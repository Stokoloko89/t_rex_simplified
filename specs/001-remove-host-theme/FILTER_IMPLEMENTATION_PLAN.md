# Enhanced Vehicle Search Filter Implementation Plan

## Analysis of Reference Design

Based on the provided images, the reference filter system has these key features:

### 1. **UI Structure**
- Side panel filter interface
- Collapsible/expandable sections
- Sticky bottom action buttons ("Reset all" and "Search X cars")
- Clean, organized layout with clear visual hierarchy

### 2. **Filter Categories**

#### Pricing
- Price/Finance toggle
- Monthly budget input
- Loan term dropdown (84 months)
- Trade-in amount
- Deposit amount
- Interest rate (9.00%)
- Estimated buying power display

#### Locations
- "Near me" functionality with radius
- Province listing with vehicle counts
- City selection based on province

#### Body Types
- Expandable section
- Multiple selection (checkboxes implied)

#### Years
- Minimum dropdown (Any)
- Maximum dropdown (Any)

#### Mileage
- Minimum dropdown (Any)
- Maximum dropdown (Any)

#### Manual / Automatic
- Radio buttons
- Shows counts: Automatic (542), Manual (409)

#### New / Used
- Radio buttons
- Options: Any, New (16), Used (935), Demo (36), Certified Used (0)

#### Fuel Type
- Checkboxes with icons
- Options: Any, Diesel (265), Electric (12), Hybrid (14), Petrol (660)

#### 4x2 / 4x4
- Checkboxes
- Options: Any, 4x2 (101), 4x4 (63), All Wheel Drive (112), Four Wheel Drive (0), Front Wheel Drive (603), Rear Wheel Drive (72)

#### Colour
- Checkboxes with color swatches
- Options: Any, Beige (12), Black (26), Blue (74), etc.

#### Min Engine Capacity
- Radio buttons
- Options: Any, 1.0l (790), 1.1l (786), 1.2l (748), etc.

#### Price Rating
- Checkboxes with colored badges
- Options: Any, Low Price (17), Great Price (156), Fair Price (492), High Price (66), No Rating (220)

#### Number of Seats
- Checkboxes
- Options: Any, 2 (36), 3 (13), 4 (35), 5 (726), 7 (75), 8+ (17)

#### Popular Features
- Checkboxes
- Search functionality within features
- Options: Any, Air conditioning (888), Bluetooth connectivity (781), Cruise control (567), etc.

### 3. **Key UX Patterns**

1. **Vehicle Counts**: Every option shows the number of matching vehicles
2. **"Any" Default**: Most filters have an "Any" option selected by default
3. **Dynamic Updates**: Counts update based on selected filters
4. **Visual Indicators**: 
   - Icons for categories
   - Color swatches for colors
   - Colored badges for price ratings
5. **Search Within Filters**: Features section has search functionality
6. **Collapsible Sections**: Reduces visual clutter
7. **Clear Actions**: Reset and Search buttons always visible

## Implementation Strategy

### Phase 1: Backend API Enhancements
1. Create `/api/vehicles/filter-counts` endpoint
   - Returns counts for each filter option based on current selections
   - Supports dynamic filtering
   
2. Enhance existing filter endpoints to return counts

### Phase 2: Frontend Component Structure
1. Create `VehicleSearchEnhanced.tsx` component
2. Implement collapsible filter sections using MUI Accordion
3. Add state management for:
   - Filter selections
   - Expanded/collapsed sections
   - Vehicle counts
   - Loading states

### Phase 3: Filter Components
1. **Radio Button Filters**: Transmission, Condition, Engine Capacity
2. **Checkbox Filters**: Body Types, Fuel Types, Drive Types, Colors, Features
3. **Dropdown Filters**: Years, Mileage, Provinces, Cities
4. **Range Filters**: Price (with finance calculator option)

### Phase 4: Dynamic Count Updates
1. Debounced API calls on filter changes
2. Real-time count updates
3. Loading indicators

### Phase 5: Additional Features
1. "Near me" location functionality
2. Search within features
3. Price rating system
4. Finance calculator
5. Reset all functionality

## Technical Considerations

### State Management
```typescript
interface SearchFilters {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMin: string;
  mileageMax: string;
  bodyTypes: string[];
  fuelTypes: string[];
  transmission: string;
  condition: string;
  province: string;
  city: string;
  colours: string[];
  driveTypes: string[];
  engineCapacity: string;
  seats: string[];
  features: string[];
}

interface FilterCounts {
  [category: string]: {
    [option: string]: number;
  };
}
```

### API Response Format
```json
{
  "total": 951,
  "counts": {
    "transmissions": {
      "Automatic": 542,
      "Manual": 409
    },
    "fuelTypes": {
      "Diesel": 265,
      "Electric": 12,
      "Hybrid": 14,
      "Petrol": 660
    },
    ...
  }
}
```

### Performance Optimizations
1. Debounce filter changes (300ms)
2. Cache API responses
3. Lazy load filter options
4. Virtual scrolling for long lists

## Design Consistency
- Use existing color scheme (#1e3a8a primary blue)
- MUI components for consistency
- Maintain current card-based layout
- Responsive design for mobile

## Next Steps
1. Review and approve plan
2. Implement backend API changes
3. Create enhanced frontend component
4. Test with real data
5. Deploy and monitor performance
