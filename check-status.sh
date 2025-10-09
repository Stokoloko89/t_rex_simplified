#!/bin/bash

# T-Rex Application Status Checker

echo "🔍 T-Rex Application Status Check"
echo "================================="

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to check HTTP endpoint
check_endpoint() {
    local url=$1
    local name=$2
    if curl -f "$url" >/dev/null 2>&1; then
        echo "✅ $name is running ($url)"
        return 0
    else
        echo "❌ $name is not responding ($url)"
        return 1
    fi
}

echo "📊 Port Status:"
echo "---------------"

# Check ports
if port_in_use 5432; then
    echo "✅ PostgreSQL (5432) - Running"
else
    echo "❌ PostgreSQL (5432) - Not running"
fi

if port_in_use 8080; then
    echo "✅ Backend API (8080) - Running"
else
    echo "❌ Backend API (8080) - Not running"
fi

if port_in_use 3000; then
    echo "✅ Host App (3000) - Running"
else
    echo "❌ Host App (3000) - Not running"
fi

if port_in_use 3001; then
    echo "✅ Buying Flow (3001) - Running"
else
    echo "❌ Buying Flow (3001) - Not running"
fi

echo ""
echo "🌐 Health Check:"
echo "----------------"

# Check endpoints
check_endpoint "http://localhost:8080/actuator/health" "Backend Health"
check_endpoint "http://localhost:3000" "Host Application"
check_endpoint "http://localhost:3001" "Buying Flow"

echo ""
echo "🐳 Docker Status:"
echo "----------------"

# Check Docker containers
if command -v docker >/dev/null 2>&1; then
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(postgres|workflowservice)" >/dev/null 2>&1; then
        echo "Docker containers:"
        docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(postgres|workflowservice|NAME)"
    else
        echo "❌ No T-Rex Docker containers running"
    fi
else
    echo "❌ Docker not available"
fi

echo ""
echo "💡 Quick Actions:"
echo "----------------"
echo "Start backend: docker-compose -f docker-compose.backend-only.yml up -d"
echo "Start frontend: ./start-frontend-local.sh"
echo "Full setup: ./start-dev.sh"
echo "Check logs: docker-compose -f docker-compose.backend-only.yml logs -f"
