# Hybrid Development Setup Guide

This guide shows how to run the T-Rex application with **backend in Docker** and **frontend locally**.

## 🎯 **Why This Approach?**

- ✅ **Faster frontend development** - No Docker rebuild for frontend changes
- ✅ **Reliable backend** - Database and API in isolated containers
- ✅ **Hot reload** - Frontend changes reflect immediately
- ✅ **Easier debugging** - Direct access to frontend dev tools
- ✅ **Network issue workaround** - Bypasses pnpm Docker network problems

## 🚀 **Quick Start**

### Step 1: Start Backend Services (Docker)

```bash
# Start PostgreSQL + Spring Boot backend
docker-compose -f docker-compose.backend-only.yml up -d

# Check backend health
curl http://localhost:8080/actuator/health
```

### Step 2: Start Frontend Services (Local)

```bash
# Start React microfrontends locally
./start-frontend-local.sh
```

### Step 3: Access Application

- **Main App**: http://localhost:3000
- **Buying Flow**: http://localhost:3001  
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 📋 **Detailed Setup**

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- npm or pnpm

### Backend Services (Docker)

The `docker-compose.backend-only.yml` includes:

```yaml
services:
  db:          # PostgreSQL database
  workflowservice:  # Spring Boot API
```

**Commands:**
```bash
# Start backend
docker-compose -f docker-compose.backend-only.yml up -d

# View logs
docker-compose -f docker-compose.backend-only.yml logs -f

# Stop backend
docker-compose -f docker-compose.backend-only.yml down

# Clean rebuild (if needed)
docker-compose -f docker-compose.backend-only.yml build --no-cache workflowservice
```

### Frontend Services (Local)

The frontend runs locally with hot reload:

- **Buying Flow** (port 3001) - React microfrontend

**Commands:**
```bash
# Install dependencies (if needed)
npm install  # or pnpm install

# Start frontend services
./start-frontend-local.sh

# Or manually:
# cd microfrontends/buying-flow && npm start
# cd host-app && npm start
```

**Frontend Changes:**
- Edit files in `host-app/` or `microfrontends/`
- Changes auto-reload in browser
- No restart needed

**Backend Changes:**
- Edit files in `backend/workflowservice/`
- Restart backend container:
  ```bash
  docker-compose -f docker-compose.backend-only.yml restart workflowservice
  ```

## 🔧 **Troubleshooting**

### Backend Connection Issues

**Problem:** Backend API not responding (containers running but no connection)

**Symptoms:**
- Health check fails: `curl http://localhost:8080/actuator/health`
- Containers are running but API calls fail
- Frontend shows connection errors

**Solution:**

1. **Check if application is built:**
   ```bash
   docker exec t_rex_simplified-workflowservice-1 pgrep java
   ```
   If no Java process, rebuild the application.

2. **Rebuild and restart:**
   ```bash
   # Stop services
   docker-compose -f docker-compose.backend-only.yml down

   # Rebuild application
   docker-compose -f docker-compose.backend-only.yml build workflowservice

   # Start services
   docker-compose -f docker-compose.backend-only.yml up -d

   # Wait 20 seconds, then test
   curl http://localhost:8080/actuator/health
   ```

3. **Check logs for errors:**
   ```bash
   docker-compose -f docker-compose.backend-only.yml logs workflowservice
   ```

4. **Verify port binding:**
   ```bash
   netstat -tlnp | grep :8080
   # Or: lsof -i :8080
   ```

### Frontend Port Conflicts

**Problem:** Port already in use errors

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 $(lsof -ti :3001)

# Or use different ports in webpack configs
```

### Database Connection Issues

**Problem:** Database not accessible on port 5432

**Solution:**
```bash
# Check if PostgreSQL is running
docker exec t_rex_simplified-db-1 pg_isready -h localhost

# Check database logs
docker-compose -f docker-compose.backend-only.yml logs db

# Restart database if needed
docker-compose -f docker-compose.backend-only.yml restart db
```

### Build Issues

**Problem:** Docker build fails or application won't start

**Solution:**
```bash
# Clean rebuild
docker-compose -f docker-compose.backend-only.yml build --no-cache workflowservice

# Check for compilation errors in logs
docker-compose -f docker-compose.backend-only.yml logs workflowservice | tail -50
```

### Network Issues

**Problem:** Services can't communicate with each other

**Solution:**
```bash
# Check Docker network
docker network ls | grep t-rex

# Recreate network if needed
docker-compose -f docker-compose.backend-only.yml down
docker network rm t-rex-network 2>/dev/null
docker-compose -f docker-compose.backend-only.yml up -d
```

## 📊 **Verification Commands**

```bash
# Check all services status
docker-compose -f docker-compose.backend-only.yml ps

# Test backend health
curl http://localhost:8080/actuator/health

# Test workflow API
curl -X POST http://localhost:8080/api/workflow/start \
  -H "Content-Type: application/json" \
  -d '{"intent":"buying"}'

# Check database connectivity
pg_isready -h localhost -p 5432

# Check frontend services
curl http://localhost:3001 && curl http://localhost:3002
```

## 🚀 **Quick Fix Scripts**

If you encounter issues frequently, create these helper scripts:

**`fix-backend.sh`:**
```bash
#!/bin/bash
echo "🔧 Fixing backend issues..."
docker-compose -f docker-compose.backend-only.yml down
docker-compose -f docker-compose.backend-only.yml build --no-cache workflowservice
docker-compose -f docker-compose.backend-only.yml up -d
sleep 15
curl http://localhost:8080/actuator/health
```

**`check-all.sh`:**
```bash
#!/bin/bash
echo "🔍 Checking all services..."
echo "Backend Health: $(curl -s http://localhost:8080/actuator/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
echo "Database: $(timeout 3 bash -c '</dev/tcp/localhost/5432' && echo 'OK' || echo 'FAIL')"
echo "Host App: $(curl -s -m 3 http://localhost:3002 > /dev/null && echo 'OK' || echo 'FAIL')"
echo "Buying Flow: $(curl -s -m 3 http://localhost:3001 > /dev/null && echo 'OK' || echo 'FAIL')"
```

**Database Changes:**
- Edit `backend/init-db.sql`
- Recreate database:
  ```bash
  docker-compose -f docker-compose.backend-only.yml down -v
  docker-compose -f docker-compose.backend-only.yml up -d
  ```

### Debugging

**Enable debug logging:**
```bash
# Backend debug logs
docker-compose -f docker-compose.backend-only.yml logs -f workflowservice

# Database debug logs
docker-compose -f docker-compose.backend-only.yml logs -f db

# Frontend console logs
# Open browser dev tools on http://localhost:3002
```

**Check resource usage:**
```bash
# Docker resource usage
docker stats

# Disk space
df -h

# Memory usage
free -h
```

## 🎯 **Best Practices**

1. **Always check backend health** before starting frontend
2. **Use the scripts** (`check-status.sh`, `start-frontend-local.sh`)
3. **Monitor logs** during development
4. **Clean rebuild** when making backend changes
5. **Use different ports** if you have conflicts

## 🚨 **Common Issues & Quick Fixes**

| Issue | Symptom | Quick Fix |
|-------|---------|-----------|
| **Backend not responding** | API calls fail | `docker-compose -f docker-compose.backend-only.yml build --no-cache workflowservice && docker-compose -f docker-compose.backend-only.yml up -d` |
| **Port conflicts** | "Address already in use" | `kill -9 $(lsof -ti :PORT)` |
| **Database issues** | Connection refused | `docker-compose -f docker-compose.backend-only.yml restart db` |
| **Build failures** | Compilation errors | Check logs: `docker-compose -f docker-compose.backend-only.yml logs workflowservice` |
| **Network issues** | Services can't communicate | Recreate network: `docker-compose -f docker-compose.backend-only.yml down && docker-compose -f docker-compose.backend-only.yml up -d` |

## 📚 **Related Documentation**

- [Backend Development Guide](backend/README.md)
- [Frontend Development Guide](microfrontends/README.md)
- [Docker Setup Guide](README.md)
- [API Documentation](backend/workflowservice/README.md)

---

**🎉 Happy Developing!** - Your T-Rex platform is ready for development with this hybrid setup.

## 🌐 **Network Configuration**

### Service Communication

```
Browser (localhost:3000)
    ↓
Host App (localhost:3000)
    ↓
Buying Flow (localhost:3001)
    ↓
Backend API (localhost:8080) ← Docker
    ↓
PostgreSQL (localhost:5432) ← Docker
```

### CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000` (Host App)
- `http://localhost:3001` (Buying Flow)

## 🔄 **Alternative Startup Methods**

### Method 1: Automated Script
```bash
./start-frontend-local.sh
```

### Method 2: Manual Startup
```bash
# Terminal 1: Backend
docker-compose -f docker-compose.backend-only.yml up

# Terminal 2: Host App
cd host-app && npm start

# Terminal 3: Buying Flow
cd microfrontends/buying-flow && npm start
```

### Method 3: Enhanced Dev Script
```bash
./start-dev.sh
# Choose option 3 (Local Development)
```

## 🛠️ **Troubleshooting**

### Backend Issues

**Container won't start:**
```bash
# Check logs
docker-compose -f docker-compose.backend-only.yml logs

# Reset everything
docker-compose -f docker-compose.backend-only.yml down -v
docker-compose -f docker-compose.backend-only.yml up --build
```

**Database connection issues:**
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.backend-only.yml ps

# Test database connection
docker-compose -f docker-compose.backend-only.yml exec db psql -U t_rex_user -d t_rex_db
```

### Frontend Issues

**Port conflicts:**
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Dependency issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**pnpm network issues:**
```bash
# Use npm fallback
npm install
npm run dev
```

### CORS Issues

If you see CORS errors:

1. Check backend CORS configuration in `WorkflowController.java`
2. Verify frontend is making requests to `http://localhost:8080`
3. Restart backend container

## 📊 **Performance Benefits**

| Aspect | Full Docker | Hybrid Setup |
|--------|-------------|--------------|
| Frontend rebuild | ~2-3 minutes | Instant |
| Hot reload | ❌ | ✅ |
| Debugging | Limited | Full access |
| Network issues | Possible | Avoided |
| Resource usage | High | Medium |

## 🎯 **Production Deployment**

For production, use the full Docker setup:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

The hybrid setup is optimized for development only.

## 📚 **Next Steps**

1. **Start developing** - Make changes and see them instantly
2. **Add new features** - Create new microfrontends or API endpoints  
3. **Test integration** - Verify frontend-backend communication
4. **Deploy to production** - Use full Docker setup when ready

---

**Happy coding! 🚀**

For issues, check the main [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
