#!/bin/bash

# T-Rex Microfrontend Application - Development Startup Script

echo "🦖 Starting T-Rex Microfrontend Application in Development Mode"
echo "================================================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

if ! command_exists pnpm; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install pnpm. Please install it manually:"
        echo "   npm install -g pnpm"
        echo "   or use corepack: corepack enable && corepack prepare pnpm@latest --activate"
        exit 1
    fi
fi

if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 17+ and try again."
    exit 1
fi

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

echo "✅ All prerequisites are installed"

# Check if ports are available
echo "🔍 Checking port availability..."

if port_in_use 3000; then
    echo "⚠️  Port 3000 is in use. Please stop the service using port 3000 or change the port."
fi

if port_in_use 3001; then
    echo "⚠️  Port 3001 is in use. Please stop the service using port 3001 or change the port."
fi

if port_in_use 8080; then
    echo "⚠️  Port 8080 is in use. Please stop the service using port 8080 or change the port."
fi

if port_in_use 5432; then
    echo "⚠️  Port 5432 is in use. Please stop the service using port 5432 or change the port."
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Try pnpm first, fallback to npm if it fails
if command_exists pnpm; then
    echo "🔄 Trying pnpm install..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "⚠️  pnpm failed, falling back to npm..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ Both pnpm and npm failed to install dependencies"
            exit 1
        fi
        USE_NPM=true
    fi
else
    echo "🔄 Using npm (pnpm not available)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies with npm"
        exit 1
    fi
    USE_NPM=true
fi

echo "✅ Dependencies installed successfully"

# Choose startup method
echo ""
echo "🚀 Choose startup method:"
echo "1) Docker Compose with pnpm (Full Docker - all services)"
echo "2) Docker Compose with npm (Full Docker - fallback if pnpm issues)"
echo "3) Hybrid Setup (Backend in Docker + Frontend local) ⭐ RECOMMENDED"
echo "4) Local Development (requires PostgreSQL running separately)"
echo "5) Backend only (Spring Boot)"
echo "6) Frontend only (React microfrontends)"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🐳 Starting with Docker Compose (pnpm)..."
        docker-compose up --build
        ;;
    2)
        echo "🐳 Starting with Docker Compose (npm fallback)..."
        docker-compose -f docker-compose.npm.yml up --build
        ;;
    3)
        echo "🔄 Starting Hybrid Setup (Backend Docker + Frontend Local)..."
        echo "📦 Starting backend services in Docker..."
        docker-compose -f docker-compose.backend-only.yml up -d
        echo "⏳ Waiting for backend to start..."
        sleep 10
        echo "🎨 Starting frontend services locally..."
        ./start-frontend-local.sh
        ;;
    4)
        echo "💻 Starting local development..."
        echo "⚠️  Make sure PostgreSQL is running on localhost:5432"
        echo "   Database: t_rex_db"
        echo "   User: t_rex_user"
        echo "   Password: password"
        echo ""
        
        # Start backend in background
        echo "🔧 Starting backend service..."
        cd backend/workflowservice
        ./mvnw spring-boot:run &
        BACKEND_PID=$!
        cd ../..
        
        # Wait a bit for backend to start
        sleep 10
        
        # Start frontend services
        echo "🎨 Starting frontend services..."
        
        # Start buying flow microfrontend
        cd microfrontends/buying-flow
        if [ "$USE_NPM" = true ]; then
            npm start &
        else
            pnpm start &
        fi
        BUYING_FLOW_PID=$!
        cd ../..
        
        # Start host app
        cd host-app
        if [ "$USE_NPM" = true ]; then
            npm start &
        else
            pnpm start &
        fi
        HOST_APP_PID=$!
        cd ..
        
        echo "✅ All services started!"
        echo "📱 Host Application: http://localhost:3000"
        echo "🛒 Buying Flow: http://localhost:3001"
        echo "🔧 Backend API: http://localhost:8080"
        echo ""
        echo "Press Ctrl+C to stop all services"
        
        # Wait for Ctrl+C
        trap "echo 'Stopping services...'; kill $BACKEND_PID $BUYING_FLOW_PID $HOST_APP_PID 2>/dev/null; exit" INT
        wait
        ;;
    5)
        echo "🔧 Starting backend only..."
        cd backend/workflowservice
        ./mvnw spring-boot:run
        ;;
    6)
        echo "🎨 Starting frontend only..."
        echo "⚠️  Make sure backend is running on localhost:8080"
        if [ "$USE_NPM" = true ]; then
            npm run dev
        else
            pnpm run dev
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
