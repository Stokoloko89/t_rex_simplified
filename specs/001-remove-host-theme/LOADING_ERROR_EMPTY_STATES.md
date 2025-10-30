# Loading, Error, and Empty State Visuals

**Feature**: Remove Host Application Theme (001-remove-host-theme)  
**Component**: State Visuals for Async Operations  
**Status**: Reference Implementation ✅  
**Last Updated**: 2025-10-30

---

## Overview

This document specifies visual treatments for transient application states: loading operations, error conditions, and empty data scenarios. Consistent, clear feedback reassures users that the system is working and helps them understand what to do next.

**Design Philosophy**: Minimize cognitive load with clear, actionable messaging. Use consistent visual language (loading spinners, error icons, empty state illustrations) across all workflows.

---

## Loading States

### Purpose
Provides feedback that an asynchronous operation is in progress. Prevents user from taking redundant actions and sets expectation for completion.

### Visual Indicators

#### 1. Circular Progress Spinner (In-Progress Operations)

```typescript
// From theme.ts MuiLinearProgress
// Used for: API calls, data fetching, form submissions

import { CircularProgress, Box } from '@mui/material';

// Example: Standard use
<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
  <CircularProgress 
    size={40}
    sx={{
      color: '#1976d2',  // Primary blue
    }}
  />
</Box>
```

**Visual Properties**:
- Size: 40px for inline loading, 64px for full-page loading
- Color: Primary blue (#1976d2)
- Animation: Smooth 360° rotation, 1.4s duration
- Placement: Centered in loading area

**Use Cases**:
- Search filter updates
- Vehicle data fetching
- Form submission processing
- API responses (< 2 seconds expected)

#### 2. Linear Progress Bar (Long-Running Operations)

```typescript
// From theme.ts MuiLinearProgress
// Used for: Multi-step operations, file uploads, data processing

import { LinearProgress, Box, Typography } from '@mui/material';

<Box>
  <Typography variant="body2" sx={{ mb: 1 }}>
    Processing vehicle data...
  </Typography>
  <LinearProgress 
    variant="determinate"
    value={75}  // 0-100
    sx={{
      height: 6,
      borderRadius: 4,
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        backgroundColor: '#1976d2',
      },
    }}
  />
</Box>
```

**Visual Properties**:
- Height: 6px
- Border radius: 4px (soft corners)
- Color: Primary blue (#1976d2)
- Background: Light blue (rgba 10%)
- Indeterminate mode: Animated sweep

**Use Cases**:
- Multi-step workflows
- File uploads/downloads
- Data processing with known duration
- Operations > 2 seconds expected

#### 3. Loading Skeleton (Content Placeholder)

Use skeleton loaders when replacing specific content areas:

```tsx
import { Skeleton, Card, CardContent } from '@mui/material';

// Vehicle card skeleton (during fetch)
<Card>
  <CardContent>
    <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
    <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="80%" />
  </CardContent>
</Card>
```

**Visual Properties**:
- Color: Light gray with shimmer animation
- Duration: 1.5s smooth animation
- Replicates: Content layout for context

**Use Cases**:
- List items while fetching
- Card placeholders
- Table rows while loading
- Header information while fetching

#### 4. Badge Loading Indicator

For small async updates (filter counts, notifications):

```tsx
import { Badge, CircularProgress } from '@mui/material';

// Filter count updating
<Badge
  badgeContent={
    isLoading ? (
      <CircularProgress size={16} sx={{ color: '#1976d2' }} />
    ) : (
      filterCount
    )
  }
  sx={{
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid #fff`,
    },
  }}
>
  <FilterIcon />
</Badge>
```

---

### Loading State Pattern

Complete example for API request flow:

```tsx
import { useState, useEffect } from 'react';
import { CircularProgress, Box, Alert, List } from '@mui/material';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/vehicles');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  // LOADING STATE
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ERROR STATE (see next section)
  if (error) {
    return <ErrorState error={error} />;
  }

  // EMPTY STATE (see next section)
  if (vehicles.length === 0) {
    return <EmptyState />;
  }

  // SUCCESS STATE
  return <List>{/* vehicles */}</List>;
}
```

---

## Error States

### Purpose
Communicates that an operation failed and explains why. Enables users to understand and potentially recover.

### Error Severity Levels

#### 1. Info-Level Messages (FYI)

```tsx
import { Alert } from '@mui/material';

<Alert 
  severity="info"
  sx={{
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    color: '#0051D5',
    borderRadius: 2,
  }}
>
  No exact matches found. Showing similar results instead.
</Alert>
```

**Visual**: Light blue background with info icon  
**Use**: Informational messages, non-blocking

#### 2. Warning-Level Messages (Caution)

```tsx
<Alert 
  severity="warning"
  sx={{
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    color: '#C93400',
    borderRadius: 2,
  }}
>
  Your saved search is about to expire. Would you like to save it again?
</Alert>
```

**Visual**: Light orange background with warning icon  
**Use**: User action may have unintended consequences

#### 3. Error-Level Messages (Action Required)

```tsx
<Alert 
  severity="error"
  sx={{
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    color: '#D70015',
    borderRadius: 2,
  }}
  onClose={() => setError(null)}
>
  Network error: Could not reach the server. Please check your connection and try again.
</Alert>
```

**Visual**: Light red background with error icon, dismissible  
**Use**: Blocking errors preventing progress

#### 4. Success Messages (Confirmation)

```tsx
<Alert 
  severity="success"
  sx={{
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    color: '#248A3D',
    borderRadius: 2,
  }}
  onClose={() => setSuccess(false)}
>
  Your purchase was completed successfully! Check your email for confirmation.
</Alert>
```

**Visual**: Light green background with checkmark icon  
**Use**: Positive action confirmations

---

### Field-Level Errors

For form validation and field-specific errors:

```tsx
import { TextField, FormHelperText } from '@mui/material';

<TextField
  label="Vehicle Make"
  value={make}
  onChange={(e) => setMake(e.target.value)}
  error={!!makeError}  // Shows red border
  helperText={makeError}  // Error text below
  sx={{
    '& .MuiOutlinedInput-root.Mui-error': {
      '& fieldset': {
        borderColor: '#f44336',
      },
    },
  }}
/>
```

**Visual**: Red border on field + error message below  
**Use**: Input validation, form submission errors

---

### Error Modal/Dialog

For critical errors requiring user acknowledgment:

```tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';

<Dialog open={hasCriticalError} onClose={() => {}}>
  <DialogTitle>Something went wrong</DialogTitle>
  <DialogContent>
    <Alert severity="error" sx={{ mb: 2 }}>
      {errorMessage}
    </Alert>
    <Typography variant="body2">
      Your session has expired. Please log in again to continue.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button 
      variant="contained" 
      onClick={() => window.location.href = '/login'}
    >
      Go to Login
    </Button>
  </DialogActions>
</Dialog>
```

---

### Error Recovery Pattern

Complete example with recovery options:

```tsx
function VehicleSearch() {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Still failed');
      // Success - clear error
      setError(null);
    } catch (err) {
      setError({
        message: 'Still unable to load vehicles. Please try again later.',
        type: 'error',
        canRetry: true,
      });
    } finally {
      setIsRetrying(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity={error.type}
          action={
            error.canRetry && (
              <Button 
                color="inherit" 
                size="small"
                onClick={handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? 'RETRYING...' : 'RETRY'}
              </Button>
            )
          }
        >
          {error.message}
        </Alert>
      </Box>
    );
  }

  return <div>{/* Normal content */}</div>;
}
```

---

## Empty States

### Purpose
Provides helpful guidance when no data exists, sets expectations, and suggests next steps.

### Empty State Components

#### 1. Text-Only Empty State (Simple)

```tsx
import { Box, Typography, Button } from '@mui/material';

<Box 
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    p: 3,
  }}
>
  <Typography variant="h5" sx={{ mb: 1 }}>
    No vehicles found
  </Typography>
  <Typography 
    variant="body2" 
    color="textSecondary"
    sx={{ mb: 3, maxWidth: 400, textAlign: 'center' }}
  >
    Try adjusting your search filters to find more vehicles in your price range.
  </Typography>
  <Button 
    variant="contained"
    onClick={() => resetFilters()}
  >
    Reset Filters
  </Button>
</Box>
```

**Visual**: Centered heading + descriptive text + action button  
**Use**: Simple scenarios where users understand what to do

#### 2. Icon + Text Empty State (Guidance)

```tsx
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

<Box 
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    p: 3,
  }}
>
  <SearchIcon 
    sx={{
      fontSize: 64,
      color: 'rgba(25, 118, 210, 0.2)',
      mb: 2,
    }}
  />
  <Typography variant="h5" sx={{ mb: 1 }}>
    Start your search
  </Typography>
  <Typography 
    variant="body2" 
    color="textSecondary"
    sx={{ mb: 3, maxWidth: 400, textAlign: 'center' }}
  >
    Select your preferred vehicle type and price range to get started.
  </Typography>
  <Button 
    variant="contained"
    onClick={() => scrollToFilters()}
  >
    View Filters
  </Button>
</Box>
```

**Visual**: Large icon (64px) + heading + text + button  
**Use**: Initial state when user hasn't interacted yet

#### 3. Illustration + CTA Empty State (Engaged)

```tsx
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

<Box 
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    p: 3,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
  }}
>
  <ErrorOutlineIcon
    sx={{
      fontSize: 80,
      color: 'rgba(244, 67, 54, 0.2)',
      mb: 2,
    }}
  />
  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
    No results for "{searchQuery}"
  </Typography>
  <Typography 
    variant="body1" 
    color="textSecondary"
    sx={{ mb: 3, maxWidth: 500, textAlign: 'center' }}
  >
    We couldn't find any vehicles matching your criteria. Try broadening your search or browsing our featured listings.
  </Typography>
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button variant="outlined" onClick={() => setSearchQuery('')}>
      Clear Search
    </Button>
    <Button variant="contained" onClick={() => browseFeatured()}>
      Browse Featured
    </Button>
  </Box>
</Box>
```

**Visual**: Large icon (80px) + multiple CTAs + context-specific messaging  
**Use**: After user performed search/filter with no results

### Empty State Types

| Scenario | Icon | Message | CTA |
|----------|------|---------|-----|
| **No search results** | SearchOff | "No vehicles match your search" | Clear filters / Reset search |
| **Initial empty** | Search | "Start your search" | View filters / Browse all |
| **No saved items** | BookmarkBorder | "You haven't saved any vehicles" | Browse all / Start searching |
| **No messages** | MailOutline | "Your inbox is empty" | Check notifications / Go back |
| **No favorites** | FavoriteBorder | "No favorites yet" | Add favorites / Browse vehicles |

---

## Complete State Flow Example

```tsx
import { 
  useState, 
  useEffect 
} from 'react';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function VehicleSearchResults({ searchQuery, filters }) {
  const [state, setState] = useState('idle');  // idle, loading, success, error, empty
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchQuery && !Object.keys(filters).length) {
      setState('idle');
      return;
    }

    const fetchResults = async () => {
      setState('loading');
      try {
        const response = await fetch('/api/vehicles', {
          method: 'POST',
          body: JSON.stringify({ query: searchQuery, filters }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        
        if (data.length === 0) {
          setState('empty');
          setVehicles([]);
        } else {
          setState('success');
          setVehicles(data);
        }
      } catch (err) {
        setError(err.message);
        setState('error');
      }
    };

    fetchResults();
  }, [searchQuery, filters]);

  // IDLE STATE - Nothing to display yet
  if (state === 'idle') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <SearchIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
        <Typography variant="h5" color="textSecondary">
          Start your search
        </Typography>
      </Box>
    );
  }

  // LOADING STATE - Show spinner
  if (state === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ERROR STATE - Show error with retry option
  if (state === 'error') {
    return (
      <Alert 
        severity="error"
        action={
          <Button size="small" onClick={() => setState('loading')}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  // EMPTY STATE - Show helpful message
  if (state === 'empty') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <SearchIcon sx={{ fontSize: 64, color: 'rgba(244,67,54,0.2)', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No vehicles found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting your filters or search criteria
        </Typography>
      </Box>
    );
  }

  // SUCCESS STATE - Show results
  return (
    <List>
      {vehicles.map(vehicle => (
        <ListItem key={vehicle.id}>
          {/* Vehicle item */}
        </ListItem>
      ))}
    </List>
  );
}

export default VehicleSearchResults;
```

---

## Animation Timings

From theme.ts transitions configuration:

```typescript
// Standard transitions
shortest: 150,      // State changes
shorter: 200,       // Quick operations
short: 250,         // Status updates
standard: 300,      // Main interactions
complex: 375,       // Sequences
```

### Loading Animation Examples

```tsx
// Fade in loading spinner
<CircularProgress 
  sx={{
    animation: 'fadeIn 0.3s ease-in',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  }}
/>

// Slide up empty state
<Box
  sx={{
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '@keyframes slideUp': {
      from: { 
        opacity: 0, 
        transform: 'translateY(20px)',
      },
      to: { 
        opacity: 1, 
        transform: 'translateY(0)',
      },
    },
  }}
>
```

---

## Accessibility for Async States

### Loading States
- ✅ Announce with `aria-busy="true"` and `aria-label="Loading results"`
- ✅ Use semantic HTML (`<progress>` for progress bars)
- ✅ Don't timeout loading spinners (wait for actual completion)

```tsx
<Box 
  role="status"
  aria-live="polite"
  aria-label="Loading vehicles, please wait"
>
  <CircularProgress />
</Box>
```

### Error States
- ✅ Use `role="alert"` for critical errors
- ✅ Describe error clearly, not just color
- ✅ Provide recovery action in text, not just button

```tsx
<Alert 
  severity="error"
  role="alert"
>
  {error.message}
</Alert>
```

### Empty States
- ✅ Use `role="status"` with aria-live region
- ✅ Describe what's empty and why
- ✅ Provide actionable next steps

```tsx
<Box role="status" aria-live="polite">
  <Typography>No results found</Typography>
  <Button>Try different filters</Button>
</Box>
```

---

## File References

- **Theme Implementation**: `packages/shared-ui/src/theme/theme.ts`
- **MUI Loading Components**: https://mui.com/material-ui/react-progress/
- **MUI Alert Component**: https://mui.com/material-ui/react-alert/
- **Material Design States**: https://m3.material.io/foundations/interaction/states/overview
