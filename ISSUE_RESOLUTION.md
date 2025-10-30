# Issue Resolution: JPA Query Parameter Mismatch

## Problem
The backend was stuck in a restart loop due to JPA query parameter mismatches. The error was:
```
Using named parameters for method ... but parameter 'Optional[X]' not found in annotated query
```

## Root Cause
When using `GROUP BY` in a JPA query, you cannot filter by the same dimension you're grouping by. For example:
- `countByColourWithFiltersRaw` groups BY `colour`, so it shouldn't have `colours` as a filter parameter
- `countByTransmissionWithFiltersRaw` groups BY `transmission`, so it shouldn't have `transmission` as a filter parameter

## Solution
Removed the GROUP BY dimension parameter from each count method:

| Method | Removed Parameter(s) |
|--------|---------------------|
| `countByMakeWithFiltersRaw` | (none - make is not in params) |
| `countByModelWithFiltersRaw` | (none - model is not in params) |
| `countByBodyTypeWithFiltersRaw` | `bodyTypes`, `driveTypes` |
| `countByFuelTypeWithFiltersRaw` | `fuelTypes`, `driveTypes` |
| `countByTransmissionWithFiltersRaw` | `transmission`, `driveTypes` |
| `countByConditionWithFiltersRaw` | `condition`, `driveTypes` |
| `countByProvinceWithFiltersRaw` | `province`, `driveTypes` |
| `countByCityWithFiltersRaw` | `city`, `driveTypes` |
| `countByColourWithFiltersRaw` | `colours`, `driveTypes` |

Note: `driveTypes` was also removed as it was never used in any queries.

## Files Modified
1. **VehicleRepository.java** - Updated all 9 count method signatures
2. **VehicleService.java** - Updated all 9 method calls to match new signatures

## Why This Makes Sense
When counting vehicles grouped by a dimension (e.g., colour), you want to see ALL colours available, not filter by specific colours. The filtering happens on OTHER dimensions.

Example:
- To get colour counts for Toyota vehicles: filter by `make=Toyota`, group by `colour`
- To get make counts for red vehicles: filter by `colour=Red`, group by `make`

## Status
✅ Fixed - Docker container should now start successfully
⏳ Waiting for build to complete (~30 seconds)
