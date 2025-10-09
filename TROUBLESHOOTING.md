# Troubleshooting Guide

Common issues and solutions for the T-Rex microfrontend application.

## 🐳 Docker Issues

### OpenJDK Image Not Found

**Error**: `openjdk:17-jre-slim: not found`

**Cause**: Oracle deprecated official OpenJDK images on Docker Hub.

**Solution**: ✅ **Fixed** - Updated to use `eclipse-temurin:17-jre-alpine`

### Docker Compose Version Warning

**Warning**: `the attribute 'version' is obsolete`

**Cause**: Docker Compose v2+ doesn't require version specification.

**Solution**: ✅ **Fixed** - Removed version from docker-compose files

## 📦 pnpm Issues

### Network Connectivity Errors

**Error**: `ERR_INVALID_THIS` or `ERR_PNPM_META_FETCH_FAIL`

**Causes**:
- Network connectivity issues
- Corporate firewall/proxy
- DNS resolution problems
- Registry configuration issues

**Solutions**:

#### 1. Check Network Connection
```bash
# Test basic connectivity
ping registry.npmjs.org
curl -I https://registry.npmjs.org/

# Check DNS resolution
nslookup registry.npmjs.org
```

#### 2. Configure Registry (if behind corporate firewall)
```bash
# Set registry URL
pnpm config set registry https://registry.npmjs.org/

# Or use a mirror
pnpm config set registry https://registry.npmmirror.com/
```

#### 3. Configure Proxy (if needed)
```bash
# Set HTTP proxy
pnpm config set proxy http://proxy.company.com:8080
pnpm config set https-proxy http://proxy.company.com:8080

# Or set via environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

#### 4. Clear pnpm Cache
```bash
# Clear store and cache
pnpm store prune
rm -rf ~/.pnpm-store

# Clear npm cache (if mixed usage)
npm cache clean --force
```

#### 5. Alternative Installation Methods

**Option A: Use npm temporarily**
```bash
# If pnpm fails, use npm as fallback
npm install
# Then try pnpm again
pnpm install
```

**Option B: Use Docker for development**
```bash
# Skip local installation, use Docker
docker-compose up --build
```

**Option C: Use offline installation**
```bash
# If you have pnpm-lock.yaml from another machine
pnpm install --offline
```

#### 6. Network Configuration
Create `.npmrc` file in project root:
```ini
# Registry configuration
registry=https://registry.npmjs.org/

# Timeout settings
fetch-timeout=300000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000

# Network settings
maxsockets=5
```

## 🔧 Development Issues

### Port Conflicts

**Error**: `EADDRINUSE: address already in use`

**Solutions**:
```bash
# Find process using port
lsof -i :3000
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change ports in package.json/docker-compose.yml
```

### Maven Wrapper Issues

**Error**: `Permission denied: ./mvnw`

**Solution**:
```bash
chmod +x backend/workflowservice/mvnw
```

### Database Connection Issues

**Error**: `Connection refused` or `Unknown database`

**Solutions**:
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up db
```

## 🏗️ Build Issues

### Frontend Build Failures

**Common causes**:
- Missing dependencies
- TypeScript errors
- Webpack configuration issues

**Solutions**:
```bash
# Clean and reinstall
pnpm -r clean
rm -rf node_modules
pnpm install

# Check for TypeScript errors
pnpm --filter buying-flow run build

# Check webpack config
pnpm --filter host-app run build
```

### Backend Build Failures

**Common causes**:
- Java version mismatch
- Maven dependency issues
- Missing environment variables

**Solutions**:
```bash
# Check Java version
java -version

# Clean Maven cache
cd backend/workflowservice
./mvnw clean

# Skip tests if needed
./mvnw clean package -DskipTests
```

## 🌐 Runtime Issues

### CORS Errors

**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions**:
1. Check backend CORS configuration in `WorkflowController.java`
2. Verify frontend API URL configuration
3. Check nginx proxy settings (if using)

### Microfrontend Loading Issues

**Error**: `Loading chunk failed` or `Module not found`

**Solutions**:
```bash
# Check if microfrontend is accessible
curl http://localhost:3001/buying-flow.js

# Verify Single-SPA configuration
# Check browser console for detailed errors
```

## 🔍 Debugging Commands

### Check Service Status
```bash
# Docker services
docker-compose ps
docker-compose logs -f [service-name]

# Local processes
ps aux | grep java
ps aux | grep node
```

### Network Debugging
```bash
# Test API endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:3000/health
curl http://localhost:3001/health

# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
```

### pnpm Debugging
```bash
# Check pnpm configuration
pnpm config list

# Check workspace info
pnpm list --depth=0

# Verify dependencies
pnpm why [package-name]
```

## 🚀 Quick Fixes

### Complete Reset
```bash
# Nuclear option - reset everything
docker-compose down -v
docker system prune -a
pnpm -r clean
rm -rf node_modules
rm -rf ~/.pnpm-store
pnpm install
docker-compose up --build
```

### Alternative Startup Methods
```bash
# Method 1: Docker only
docker-compose up --build

# Method 2: Backend in Docker, Frontend local
docker-compose up db workflowservice
pnpm run dev

# Method 3: Everything local (requires PostgreSQL)
# Start PostgreSQL locally
cd backend/workflowservice && ./mvnw spring-boot:run &
pnpm run dev
```

## 📞 Getting Help

1. **Check logs**: Always check service logs first
2. **Network issues**: Test basic connectivity
3. **Clean slate**: Try complete reset if stuck
4. **Docker fallback**: Use Docker if local setup fails
5. **Community**: Check pnpm/Docker documentation

## 🔗 Useful Links

- [pnpm Troubleshooting](https://pnpm.io/troubleshooting)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Eclipse Temurin Images](https://hub.docker.com/_/eclipse-temurin)
- [Single-SPA Documentation](https://single-spa.js.org/)

---

If issues persist, check the specific error logs and consult the relevant documentation.
