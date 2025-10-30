# Fix Applied: Empty List Parameter Handling

## Problem
The `/api/vehicles/filter-counts` endpoint was returning 400 Bad Request errors because Spring Boot was passing empty lists instead of `null` for list parameters (`bodyTypes`, `fuelTypes`, `colours`, `driveTypes`) when they weren't provided in the request.

## Root Cause
JPA queries were checking `(:bodyTypes IS NULL OR v.bodyType IN :bodyTypes)`, which fails when an empty list is passed because:
- `IS NULL` returns false (the list exists, it's just empty)
- `IN :bodyTypes` with an empty list causes a SQL syntax error

## Solution Applied
Updated all 10 count queries in `VehicleRepository.java` to handle both `null` and empty lists:

**Before:**
```java
"(:bodyTypes IS NULL OR v.bodyType IN :bodyTypes) AND "
```

**After:**
```java
"(:bodyTypes IS NULL OR SIZE(:bodyTypes) = 0 OR v.bodyType IN :bodyTypes) AND "
```

This checks:
1. `IS NULL` - parameter not provided
2. `SIZE(:bodyTypes) = 0` - empty list provided
3. `v.bodyType IN :bodyTypes` - list with values provided

## Files Modified
- `backend/workflowservice/src/main/java/com/trex/workflowservice/repository/VehicleRepository.java`

## Queries Updated
1. `countVehiclesWithFilters` - Total count
2. `countByMakeWithFiltersRaw` - Make counts
3. `countByModelWithFiltersRaw` - Model counts
4. `countByBodyTypeWithFiltersRaw` - Body type counts
5. `countByFuelTypeWithFiltersRaw` - Fuel type counts
6. `countByTransmissionWithFiltersRaw` - Transmission counts
7. `countByConditionWithFiltersRaw` - Condition counts
8. `countByProvinceWithFiltersRaw` - Province counts
9. `countByCityWithFiltersRaw` - City counts
10. `countByColourWithFiltersRaw` - Colour counts

## Next Steps

### 1. Restart Backend Server
The backend needs to be restarted to pick up the changes:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd backend/workflowservice
mvn spring-boot:run
```

### 2. Test the Endpoint
After restarting, run the test script:

```powershell
.\test-filter-counts-api.ps1
```

### 3. Expected Result
You should now see successful responses like:

```json
{
  "total": 400,
  "counts": {
    "makes": {
      "Toyota": 45,
      "BMW": 32,
      "Mercedes-Benz": 28
    },
    "models": {
      "Corolla": 12,
      "3 Series": 8
    },
    ...
  }
}
```

## Why This Happened
Spring Boot's `@RequestParam` with `List<String>` type:
- Returns `null` when parameter is not provided
- Returns empty list `[]` when parameter name is present but has no values
- Returns list with values when provided

The fix ensures all three cases are handled correctly.
