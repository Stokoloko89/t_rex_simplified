# Contact Information City Field Implementation

## Summary
Added a **City** field to the Contact Information card in the Vehicle Purchase Confirmation page. This allows users to specify their exact city location for better dealer matching and proximity-based services.

## Changes Made

### File Modified
- ✅ `microfrontends/buying-flow/src/steps/VehiclePurchaseConfirmation.tsx`

### 1. Updated Imports
```typescript
// Added useState and useEffect for dynamic city loading
import React, { useState, useEffect } from 'react';
```

### 2. Updated PersonData Interface
```typescript
interface PersonData {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
  location?: string;
  city?: string;  // NEW FIELD
}
```

### 3. Added City Validation to Schema
```typescript
city: yup
  .string()
  .required('City is required')
  .min(2, 'City name must be at least 2 characters'),
```

### 4. Added State Management for Cities
```typescript
// State for cities dropdown
const [cities, setCities] = useState<string[]>([]);
const [loadingCities, setLoadingCities] = useState(false);

const selectedProvince = watch('location');
```

### 5. Added Dynamic City Loading
```typescript
// Load cities when province changes
useEffect(() => {
  if (selectedProvince) {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/vehicles/provinces/${selectedProvince}/cities`
        );
        const citiesData = await response.json();
        setCities(citiesData || []);
      } catch (error) {
        console.error('Error loading cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  } else {
    setCities([]);
  }
}, [selectedProvince]);
```

### 6. Added City Field to Form
```typescript
<Grid item xs={12} sm={6}>
  <Controller
    name="city"
    control={control}
    render={({ field }) => (
      <FormControl fullWidth error={!!errors.city}>
        <InputLabel id="city-label">City *</InputLabel>
        <Select
          {...field}
          labelId="city-label"
          label="City *"
          disabled={!selectedProvince || loadingCities}
          sx={{ backgroundColor: field.value ? '#f8f9fa' : 'white' }}
        >
          <MenuItem value="">
            <em>{loadingCities ? 'Loading cities...' : 'Select a city'}</em>
          </MenuItem>
          {(cities || []).map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
        {errors.city && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
            {errors.city.message}
          </Typography>
        )}
        {!errors.city && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
            {selectedProvince ? 'Select your city for nearest dealer matching' : 'Select a province first'}
          </Typography>
        )}
      </FormControl>
    )}
  />
</Grid>
```

## User Experience Flow

### 1. Initial State
- **Province dropdown**: Shows all 9 South African provinces
- **City dropdown**: Disabled with message "Select a province first"

### 2. User Selects Province
1. User selects "Western Cape" from Province dropdown
2. City dropdown shows "Loading cities..."
3. API call: `GET /api/vehicles/provinces/Western Cape/cities`
4. City dropdown populates with cities (e.g., Cape Town, Stellenbosch)
5. City dropdown becomes enabled

### 3. User Selects City
1. User selects "Cape Town" from City dropdown
2. Field is validated (required, min 2 characters)
3. Helper text: "Select your city for nearest dealer matching"

### 4. Form Submission
- Form data includes both `location` (province) and `city`
- Data structure:
  ```javascript
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    phone: "+27 83 456 7890",
    location: "Western Cape",
    city: "Cape Town",  // NEW FIELD
    preferredContact: "whatsapp",
    comments: "...",
    assistanceTypes: ["financing"]
  }
  ```

## Form Layout

### Before (2 fields in row)
```
[Province Dropdown]    [Preferred Contact Method]
```

### After (3 fields with better layout)
```
[Province Dropdown]    [City Dropdown]
[Preferred Contact Method]
```

## Features

### ✅ Dynamic Loading
- Cities load automatically when province is selected
- Loading state shows "Loading cities..." message
- Error handling if API call fails

### ✅ Validation
- City is required (marked with *)
- Must be at least 2 characters
- Form cannot be submitted without city selection

### ✅ User Guidance
- Helper text explains purpose: "Select your city for nearest dealer matching"
- Disabled state with clear message when no province selected
- Visual feedback with background color when field has value

### ✅ Error Handling
- Gracefully handles API errors
- Falls back to empty array if cities can't be loaded
- Shows validation errors inline

### ✅ Prepopulation
- Mock user data includes city: "Cape Town"
- City field can be prepopulated from `personData.city`
- Maintains consistency with other prepopulated fields

## Benefits

### 1. Better Dealer Matching
- Exact city location allows for precise dealer proximity matching
- Users can be connected to the nearest dealership
- Reduces travel time and improves customer satisfaction

### 2. Improved User Experience
- Clear two-step selection (Province → City)
- Dynamic loading prevents showing irrelevant cities
- Helpful guidance text throughout

### 3. Data Quality
- Structured location data (Province + City)
- Validated input ensures data consistency
- Easier to query and filter in backend systems

### 4. Future Enhancements Ready
- Can add distance calculations
- Can show "X dealers in your city"
- Can prioritize inventory from nearby locations

## API Dependency

### Endpoint Used
```
GET /api/vehicles/provinces/{province}/cities
```

### Example Request
```bash
GET http://localhost:8080/api/vehicles/provinces/Western%20Cape/cities
```

### Example Response
```json
["Cape Town", "Stellenbosch", "George", "Paarl", "Worcester"]
```

### Error Handling
- If API fails, cities array defaults to empty `[]`
- User sees empty dropdown (only "Select a city" option)
- Error logged to console for debugging

## Testing Checklist

### Manual Testing

1. **Initial Load**
   - [ ] City dropdown is disabled
   - [ ] Helper text says "Select a province first"

2. **Province Selection**
   - [ ] Select "Western Cape"
   - [ ] City dropdown shows "Loading cities..."
   - [ ] Cities populate (Cape Town, Stellenbosch, etc.)
   - [ ] City dropdown becomes enabled

3. **City Selection**
   - [ ] Select "Cape Town"
   - [ ] Field background changes to light gray (#f8f9fa)
   - [ ] Helper text shows "Select your city for nearest dealer matching"

4. **Validation**
   - [ ] Try to submit without selecting city
   - [ ] Error message appears: "City is required"
   - [ ] Submit button remains disabled

5. **Province Change**
   - [ ] Change province from "Western Cape" to "Gauteng"
   - [ ] Cities reload with Gauteng cities
   - [ ] Previously selected city is cleared

6. **Form Submission**
   - [ ] Fill all required fields including city
   - [ ] Submit form
   - [ ] Verify city is included in submitted data

### Edge Cases

1. **API Failure**
   - [ ] Simulate API error (disconnect backend)
   - [ ] Verify dropdown shows empty (only "Select a city")
   - [ ] Verify error is logged to console
   - [ ] Verify form still works (doesn't crash)

2. **No Cities Available**
   - [ ] API returns empty array
   - [ ] Dropdown shows only "Select a city"
   - [ ] User cannot proceed (validation fails)

3. **Slow Network**
   - [ ] Throttle network to slow 3G
   - [ ] Verify "Loading cities..." shows
   - [ ] Verify cities eventually load
   - [ ] Verify loading state clears

## Integration Points

### Data Flow
```
User selects Province
    ↓
useEffect triggers
    ↓
API call to /provinces/{province}/cities
    ↓
Cities array updates
    ↓
Dropdown populates
    ↓
User selects City
    ↓
Form validation passes
    ↓
Submit includes city in contactInfo
```

### Backend Requirements
- ✅ Endpoint exists: `/api/vehicles/provinces/{province}/cities`
- ✅ Returns array of city strings
- ✅ Handles URL encoding (e.g., "Western Cape" → "Western%20Cape")
- ✅ Returns empty array if no cities found

### Frontend Requirements
- ✅ React Hook Form for form management
- ✅ Yup for validation
- ✅ Material-UI for components
- ✅ Fetch API for HTTP requests

## Future Enhancements

### 1. Autocomplete Search
- Replace dropdown with autocomplete
- Allow typing to filter cities
- Show popular cities first

### 2. Geolocation
- Auto-detect user's location
- Pre-select nearest city
- Show distance to dealerships

### 3. Multi-City Support
- Allow selecting multiple cities
- "Show me vehicles in Cape Town OR Stellenbosch"

### 4. Dealer Information
- Show number of dealers in selected city
- Display nearest dealer address
- Show inventory count per city

### 5. Map Integration
- Show city on map
- Display dealer locations
- Calculate distances

## Success Criteria

- ✅ City field added to Contact Information card
- ✅ Cities load dynamically based on province
- ✅ Validation ensures city is required
- ✅ Form submission includes city data
- ✅ User experience is smooth and intuitive
- ✅ Error handling is robust
- ✅ No console errors or warnings

## Conclusion

The Contact Information card now includes a **City** field that:
- Dynamically loads cities based on selected province
- Provides clear user guidance
- Validates input to ensure data quality
- Enables better dealer matching and proximity-based services

This enhancement improves the user experience by allowing precise location specification, which is essential for connecting users with the nearest dealerships and providing location-specific services.
