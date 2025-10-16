# T-Rex Database Setup Guide

## Overview

This guide explains how to set up the PostgreSQL database with comprehensive vehicle data for the T-Rex application.

## Database Files

The backend contains several SQL files:

- **`init-database.sql`** ✅ **USE THIS** - Main initialization script that sets up the schema and loads comprehensive data
- **`comprehensive-vehicles.sql`** ✅ **USE THIS** - Contains ~100+ vehicles across multiple brands
- **`vehicle-database.sql`** ✅ **ALTERNATIVE** - Another comprehensive dataset
- `init-db.sql` ❌ (Legacy - not recommended)
- `init-db-simple.sql` ❌ (Legacy - not recommended)
- `sample-vehicles.sql` ❌ (Small sample set)
- `insert-test-vehicles.sql` ❌ (Test data only)

## Setup Instructions

### Option 1: Using Docker (Recommended) 🐳

The easiest way to set up the database is using Docker Compose, which automatically loads the comprehensive vehicle data.

```bash
# 1. Make sure Docker is running

# 2. Start the database and backend services
docker-compose up -d db workflowservice

# 3. Wait for initialization (first time only - takes ~30 seconds)
# Docker will automatically:
# - Create the database and user
# - Run init-database.sql to create tables and indexes
# - Load comprehensive-vehicles.sql with 100+ vehicles

# 4. Verify the database is ready
docker-compose logs db

# 5. Check if data loaded successfully
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT COUNT(*) FROM vehicles;"
```

**To restart with fresh data:**
```bash
# Stop and remove the database volume
docker-compose down -v

# Start again (will reinitialize)
docker-compose up -d db workflowservice
```

### Option 2: Using init-database.sql (Manual Setup)

If you're running PostgreSQL locally without Docker:

```bash
# 1. Start PostgreSQL (if not running)
# Windows: Start PostgreSQL service
# Linux/Mac: sudo service postgresql start

# 2. Create database and user (first time only)
psql -U postgres -c "CREATE DATABASE t_rex_db;"
psql -U postgres -c "CREATE USER t_rex_user WITH PASSWORD 'password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE t_rex_db TO t_rex_user;"

# 3. Run the initialization scripts
cd backend
psql -U postgres -d t_rex_db -f init-database.sql
psql -U postgres -d t_rex_db -f comprehensive-vehicles.sql
```

### Option 2: Manual Setup with comprehensive-vehicles.sql

```bash
# 1. Create the database schema first
psql -U postgres -d t_rex_db -f init-database.sql

# 2. Or load comprehensive vehicles directly
psql -U postgres -d t_rex_db -f comprehensive-vehicles.sql
```

### Option 3: Using vehicle-database.sql

```bash
# Load the alternative comprehensive dataset
psql -U postgres -d t_rex_db -f vehicle-database.sql
```

## Verify Data Loaded

### Using Docker:

```bash
# Check total vehicles
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT COUNT(*) FROM vehicles;"

# Check vehicles by make
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT make_name, COUNT(*) as count FROM vehicles GROUP BY make_name ORDER BY count DESC;"

# Check available (unsold) vehicles
docker-compose exec db psql -U t_rex_user -d t_rex_db -c "SELECT COUNT(*) FROM vehicles WHERE sold_date IS NULL;"

# Or connect interactively
docker-compose exec db psql -U t_rex_user -d t_rex_db
```

### Using Local PostgreSQL:

```sql
-- Connect to database
psql -U t_rex_user -d t_rex_db

-- Check total vehicles
SELECT COUNT(*) FROM vehicles;

-- Check vehicles by make
SELECT make_name, COUNT(*) as count 
FROM vehicles 
GROUP BY make_name 
ORDER BY count DESC;

-- Check available (unsold) vehicles
SELECT COUNT(*) FROM vehicles WHERE sold_date IS NULL;
```

## Expected Results

With `comprehensive-vehicles.sql`, you should have:
- **100+ vehicles** across multiple brands
- Brands include: Toyota, BMW, Mercedes-Benz, VW, Ford, Honda, Nissan, Hyundai, Kia, Mazda, Isuzu, Chevrolet, Renault, Mitsubishi, Subaru, Jeep, Jaguar, Land Rover
- Various body types: Sedan, SUV, Bakkie, Hatchback, MPV, Bus
- Price range: R185,000 - R1,285,000
- All provinces covered

## Frontend Pagination

The frontend now supports:
- **Page size selection**: 20, 50, 100, or 200 vehicles per page
- **Page navigation**: First, Previous, Next, Last buttons
- **Results info**: Shows "Showing X-Y of Z vehicles"
- **Sorting**: By price, year, mileage, or make
- **Order**: Low to High or High to Low

## Troubleshooting

### Issue: "Only 20 vehicles showing"
**Solution**: The backend uses pagination. Use the "Per Page" dropdown to show 50, 100, or 200 vehicles at once.

### Issue: "No vehicles found"
**Solution**: 
1. Check if data was loaded: `SELECT COUNT(*) FROM vehicles;`
2. Reload data: `psql -U postgres -d t_rex_db -f comprehensive-vehicles.sql`

### Issue: "Database connection error"
**Solution**:
1. Verify PostgreSQL is running
2. Check connection settings in `application.yml`:
   - URL: `jdbc:postgresql://localhost:5432/t_rex_db`
   - Username: `t_rex_user`
   - Password: `password`

### Issue: "Permission denied"
**Solution**:
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE t_rex_db TO t_rex_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO t_rex_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO t_rex_user;
```

## API Endpoints

The backend provides these endpoints for vehicle search:

- `GET /api/vehicles/search` - Search with filters
  - Parameters: `make`, `model`, `minYear`, `maxYear`, `minPrice`, `maxPrice`, `province`, `maxMileage`, `fuelType`, `bodyType`, `transmission`, `page`, `size`, `sortBy`, `sortDir`
  
- `GET /api/vehicles` - Get all available vehicles
  - Parameters: `page`, `size`, `sortBy`, `sortDir`

- `GET /api/vehicles/{id}` - Get specific vehicle

- `GET /api/vehicles/makes` - Get all makes

- `GET /api/vehicles/models?make={make}` - Get models for a make

## Performance Tips

1. **Use appropriate page sizes**: 
   - 20-50 for mobile/slow connections
   - 100-200 for desktop/fast connections

2. **Indexes are created automatically** on:
   - make_name, model_name, year, price, province_name
   - body_type, fuel_type, transmission, sold_date

3. **Database maintenance**:
   ```sql
   -- Analyze tables for better query performance
   ANALYZE vehicles;
   
   -- Vacuum to reclaim space
   VACUUM ANALYZE vehicles;
   ```

## Next Steps

1. ✅ Database is set up with comprehensive data
2. ✅ Frontend pagination is implemented
3. ✅ Users can now browse all vehicles with flexible page sizes
4. 🎯 Consider adding vehicle images
5. 🎯 Add more filter options (color, condition, etc.)
6. 🎯 Implement vehicle comparison feature
