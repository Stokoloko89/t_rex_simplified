# Dynamic Slider Implementation

## Overview
The sliders in the Vehicle Search form now dynamically adjust based on the actual data in the database and update in real-time as users select filters.

## What Was Implemented

### Backend Changes

#### 1. New Repository Methods (`VehicleRepository.java`)
Added three new query methods to get filtered ranges:

- **`findPriceRangeByFilters()`** - Returns min/max price based on selected make, model, bodyType, fuelType, and province
- **`findYearRangeByFilters()`** - Returns min/max year based on selected filters
- **`findMileageRangeByFilters()`** - Returns min/max mileage based on selected filters

These queries dynamically filter the database to only consider vehicles matching the current selections.

#### 2. New Service Method (`VehicleService.java`)
Added `getFilteredRanges()` method that:
- Accepts current filter selections (make, model, bodyType, fuelType, province)
- Calls the repository methods to get actual ranges from the database
- Returns a map containing priceRange, yearRange, and mileageRange

#### 3. New Controller Endpoint (`VehicleController.java`)
Added `GET /api/vehicles/filtered/ranges` endpoint:
- Accepts query parameters: make, model, bodyType, fuelType, province
- Returns JSON with dynamic ranges based on available vehicles matching those filters

**Example Response:**
```json
{
  "priceRange": {
    "min": 150000,
    "max": 850000
  },
  "yearRange": {
    "min": 2018,
    "max": 2024
  },
  "mileageRange": {
    "min": 15000,
    "max": 120000
  }
}
```

### Frontend Changes (`VehicleSearch.tsx`)

#### New useEffect Hook
Added a new `useEffect` that triggers when any of these filters change:
- Make
- Model
- Body Type
- Fuel Type
- Province

**What it does:**
1. Builds query parameters from current selections
2. Calls `/api/vehicles/filtered/ranges` endpoint
3. Updates the slider ranges dynamically
4. Automatically adjusts slider values to fit within new ranges

**Example Flow:**
1. User selects "BMW" → Sliders adjust to show only BMW price/year/mileage ranges
2. User then selects "X5" → Sliders further narrow to only BMW X5 ranges
3. User selects "Gauteng" → Sliders show only BMW X5 vehicles in Gauteng

## How It Works

### Initial Load
- Sliders show full range from all available vehicles in database
- Example: R10,000 - R2,000,000 for price

### After Selecting Make (e.g., "Toyota")
- Backend queries: `SELECT MIN(price), MAX(price) FROM vehicles WHERE make = 'Toyota'`
- Sliders adjust to Toyota-specific ranges
- Example: R80,000 - R650,000

### After Selecting Model (e.g., "Corolla")
- Backend queries: `SELECT MIN(price), MAX(price) FROM vehicles WHERE make = 'Toyota' AND model = 'Corolla'`
- Sliders narrow further
- Example: R180,000 - R420,000

### After Selecting Additional Filters
- Each additional filter (bodyType, fuelType, province) further narrows the ranges
- Sliders always show only what's actually available in the database

## Benefits

1. **Better UX** - Users see only realistic ranges for their selections
2. **No Empty Results** - Prevents users from selecting impossible combinations
3. **Real-time Feedback** - Sliders update immediately as filters change
4. **Database-Driven** - Always reflects actual inventory

## Testing

To test this feature:

1. Start the backend: `docker-compose up` or run the Spring Boot app
2. Start the frontend: `npm start` in the buying-flow directory
3. Navigate to Vehicle Search
4. Select a Make and watch the sliders adjust
5. Select a Model and see them narrow further
6. Select Body Type, Fuel Type, or Province to see continued refinement

## API Endpoints Used

- `GET /api/vehicles/filters` - Initial filter options and ranges
- `GET /api/vehicles/makes/{make}/models` - Models for selected make
- `GET /api/vehicles/filtered/body-types?make=X&model=Y` - Filtered body types
- `GET /api/vehicles/filtered/fuel-types?make=X&model=Y` - Filtered fuel types
- `GET /api/vehicles/filtered/provinces?make=X&model=Y` - Filtered provinces
- **`GET /api/vehicles/filtered/ranges?make=X&model=Y&bodyType=Z&fuelType=A&province=B`** - Dynamic ranges (NEW)

## Technical Notes

- The frontend automatically clamps slider values to new ranges to prevent invalid states
- If a filter combination has no vehicles, the ranges will reflect the closest available options
- All queries include `WHERE soldDate IS NULL` to only show available vehicles
- Ranges are calculated using SQL MIN/MAX aggregation for optimal performance
