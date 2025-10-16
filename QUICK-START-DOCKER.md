# T-Rex Quick Start Guide (Docker)

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)

## Quick Start (5 minutes)

### 1. Start the Backend Services

```bash
# Navigate to project directory
cd t_rex_simplified-1

# Start database and backend API
docker-compose up -d db workflowservice

# Wait for services to be ready (~30 seconds first time)
docker-compose logs -f db workflowservice
```

**Look for these messages:**
- ✅ `database system is ready to accept connections`
- ✅ `Started WorkflowServiceApplication`

### 2. Verify Database Has Data

```bash
# Check vehicle count (should show 100+)
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT COUNT(*) FROM vehicles;"

# Expected output:
#  count 
# -------
#    100+
```

### 3. Start the Frontend

```bash
# In a new terminal - Start the buying-flow microfrontend
cd microfrontends/buying-flow
npm start

# In another terminal - Start the host application
cd host-app
npm start
```

**Access the application:**
- Frontend: http://localhost:3002
- Buying Flow: http://localhost:3001
- Backend API: http://localhost:8080/api/vehicles

### 4. Test the Pagination

1. Open http://localhost:3002
2. Search for vehicles
3. You should see "X vehicles found in South Africa"
4. Use the **"Per Page"** dropdown to change from 20 to 50, 100, or 200
5. Navigate between pages using the pagination controls

## Docker Commands Cheat Sheet

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d db workflowservice

# Start with logs
docker-compose up db workflowservice
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f db
docker-compose logs -f workflowservice
```

### Database Commands
```bash
# Connect to database
docker-compose exec db psql -U t_rex_user -d t_rex_db

# Run a query
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT COUNT(*) FROM vehicles;"

# Check database status
docker-compose exec db pg_isready -U t_rex_user -d t_rex_db
```

### Restart Services
```bash
# Restart specific service
docker-compose restart workflowservice

# Restart database (keeps data)
docker-compose restart db

# Fresh database (deletes data)
docker-compose down -v
docker-compose up -d db
```

## Troubleshooting

### Issue: "Port 5432 already in use"
**Solution**: You have PostgreSQL running locally
```bash
# Windows: Stop PostgreSQL service
# Or change the port in docker-compose.yml:
ports:
  - "5433:5432"  # Use 5433 instead
```

### Issue: "Port 8080 already in use"
**Solution**: Another service is using port 8080
```bash
# Stop the other service or change port in docker-compose.yml:
ports:
  - "8081:8080"  # Use 8081 instead
```

### Issue: "No vehicles showing"
**Solution**: Database might not have initialized
```bash
# Check if data loaded
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT COUNT(*) FROM vehicles;"

# If count is 0, restart with fresh data
docker-compose down -v
docker-compose up -d db workflowservice
```

### Issue: "Backend not connecting to database"
**Solution**: Wait for database to be fully ready
```bash
# Check database health
docker-compose ps

# Should show:
# db            running (healthy)
# workflowservice   running (healthy)

# If unhealthy, check logs
docker-compose logs db
```

### Issue: "Changes to SQL files not reflected"
**Solution**: Docker cached the old files
```bash
# Remove volumes and restart
docker-compose down -v
docker-compose up -d db workflowservice
```

## What Happens on First Start?

When you run `docker-compose up -d db` for the first time:

1. **Docker pulls PostgreSQL 15 image** (~100MB)
2. **Creates database container** with name `t_rex_db`
3. **Runs initialization scripts** in order:
   - `01-init-database.sql` - Creates tables and indexes
   - `02-comprehensive-vehicles.sql` - Loads 100+ vehicles
4. **Database is ready** in ~30 seconds

The data persists in a Docker volume named `t_rex_simplified-1_db_data`.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (localhost:    │
│   3002, 3001)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Workflow       │
│  Service        │
│  (port 8080)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  PostgreSQL     │
│  Database       │
│  (port 5432)    │
└─────────────────┘
```

## Next Steps

1. ✅ Backend is running with 100+ vehicles
2. ✅ Pagination is working (20, 50, 100, 200 per page)
3. 🎯 Customize vehicle data in `backend/comprehensive-vehicles.sql`
4. 🎯 Add more brands/models as needed
5. 🎯 Configure production deployment

## Production Deployment

For production, use:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

This includes:
- Nginx reverse proxy
- SSL/TLS configuration
- Optimized builds
- Health checks
- Auto-restart policies

## Useful Links

- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **Database**: postgresql://localhost:5432/t_rex_db
- **Frontend**: http://localhost:3002

---

**Need help?** Check the detailed documentation:
- `backend/README-DATABASE-SETUP.md` - Database setup details
- `PAGINATION-IMPLEMENTATION.md` - Pagination feature details
