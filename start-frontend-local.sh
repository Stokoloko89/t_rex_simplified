#!/bin/bash

# T-Rex Frontend Local Development Script
# This script starts only the frontend locally (assumes backend is running in Docker)

echo "🎨 Starting T-Rex Frontend Locally"
echo "=================================="

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

echo "✅ Node.js is available"

# Check if backend is running
echo "🔍 Checking backend services..."
if ! curl -f http://localhost:8080/actuator/health >/dev/null 2>&1; then
    echo "❌ Backend is not running on port 8080"
    echo "   Please start the backend first:"
    echo "   docker-compose -f docker-compose.backend-only.yml up -d"
    exit 1
fi

echo "✅ Backend is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command_exists pnpm; then
        echo "🔄 Trying pnpm..."
        pnpm install || {
            echo "⚠️  pnpm failed, falling back to npm..."
            npm install
        }
    else
        echo "🔄 Using npm..."
        npm install
    fi
fi

# Determine package manager to use
if command_exists pnpm && [ -f "pnpm-lock.yaml" ]; then
    PKG_MGR="pnpm"
    echo "📦 Using pnpm for frontend services"
else
    PKG_MGR="npm"
    echo "📦 Using npm for frontend services"
fi

# Start frontend services
echo "🎨 Starting frontend services..."

# Start buying flow microfrontend
echo "🛒 Starting buying flow microfrontend..."
cd microfrontends/buying-flow
$PKG_MGR start &
BUYING_FLOW_PID=$!
cd ../..

# Wait a moment for the first service to start
sleep 3

# Start host app
echo "📱 Starting host application..."
cd host-app
$PKG_MGR start &
HOST_APP_PID=$!
cd ..

echo ""
echo "🎉 Frontend services started successfully!"
echo "========================================"
echo "📱 Host Application: http://localhost:3000"
echo "🛒 Buying Flow: http://localhost:3001"
echo "🔧 Backend API: http://localhost:8080 (Docker)"
echo "🗄️ Database: localhost:5432 (Docker)"
echo ""
echo "💡 Tip: Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop frontend services"

# Wait for Ctrl+C
trap "echo 'Stopping frontend services...'; kill $BUYING_FLOW_PID $HOST_APP_PID 2>/dev/null; exit" INT
wait
