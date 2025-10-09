#!/bin/bash

# T-Rex Local Development Script (No Docker)
# This script starts the backend and frontend locally without Docker

echo "🦖 Starting T-Rex Application Locally (No Docker)"
echo "=================================================="

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

if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 17+ and try again."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL..."
if ! port_in_use 5432; then
    echo "❌ PostgreSQL is not running on port 5432"
    echo "   Please start PostgreSQL or use Docker:"
    echo "   docker run -d --name postgres-t-rex -p 5432:5432 -e POSTGRES_DB=t_rex_db -e POSTGRES_USER=t_rex_user -e POSTGRES_PASSWORD=password postgres:15"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command_exists pnpm; then
        pnpm install || npm install
    else
        npm install
    fi
fi

# Start backend
echo "🔧 Starting backend service..."
cd backend/workflowservice
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Check if backend is running
if curl -f http://localhost:8080/actuator/health >/dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend services
echo "🎨 Starting frontend services..."

# Determine package manager
if command_exists pnpm && [ -f "pnpm-lock.yaml" ]; then
    PKG_MGR="pnpm"
else
    PKG_MGR="npm"
fi

# Start buying flow microfrontend
cd microfrontends/buying-flow
$PKG_MGR start &
BUYING_FLOW_PID=$!
cd ../..

# Start host app
cd host-app
$PKG_MGR start &
HOST_APP_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo "=================================="
echo "📱 Host Application: http://localhost:3000"
echo "🛒 Buying Flow: http://localhost:3001"
echo "🔧 Backend API: http://localhost:8080"
echo "🗄️ Database: localhost:5432"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo 'Stopping services...'; kill $BACKEND_PID $BUYING_FLOW_PID $HOST_APP_PID 2>/dev/null; exit" INT
wait
