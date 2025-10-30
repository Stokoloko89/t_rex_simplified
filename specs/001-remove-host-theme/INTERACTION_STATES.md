# Component Interaction States

**Feature**: Remove Host Application Theme (001-remove-host-theme)  
**Component**: Interaction States & Feedback  
**Status**: Reference Implementation ✅  
**Last Updated**: 2025-10-30

---

## Overview

This document defines visual feedback for user interactions across all component types. Clear, consistent interaction states improve usability and provide reassurance that the system is responsive.

**Design Philosophy**: Subtle, smooth transitions (200-300ms) provide feedback without being jarring. States layer through color shifts, shadows, and slight transforms.

---

## State Types

Every interactive element supports these standard states:

| State | Trigger | Visual Treatment | Accessibility |
|-------|---------|-----------------|----------------|
| **Normal** | Default state | Baseline styling | Keyboard accessible |
| **Hover** | Mouse/pointer over | Color/shadow elevation | N/A |
| **Focus** | Tab/keyboard navigation | Outline + background shift | WCAG 2.1 AA required |
| **Active** | Mouse down/click | Scale down 98% + shadow reduction | Visual feedback |
| **Disabled** | Element disabled (prop) | Opacity 50% + gray out | Screen reader announces |

---

## Component State Guidelines

### Buttons

#### Normal State
```typescript
// From theme.ts MuiButton.root
background: '#1976d2',
color: '#ffffff',
borderRadius: '24px',
padding: '12px 24px',
fontSize: '1rem',
fontWeight: 600,
minHeight: 48, // Touch-friendly minimum
boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
```

#### Hover State (Primary)
```typescript
background: '#1565c0',  // Darker shade
boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',  // Elevated shadow
transform: 'translateY(-1px)',  // Slight lift
transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
```

**Visual Effect**: Button appears to lift slightly with increased shadow. Color darkens to show responsiveness.

#### Focus State (Keyboard)
```typescript
// For keyboard navigation
outline: '2px solid #1976d2',
outlineOffset: '2px',
boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
```

**Visual Effect**: Clear outline visible around button for keyboard users.

#### Active State (During Click)
```typescript
transform: 'scale(0.98)',  // Slight compression
boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',  // Reduced shadow
```

**Visual Effect**: Button "presses" down during click, provides haptic feedback feeling.

#### Disabled State
```typescript
background: 'rgba(25, 118, 210, 0.3)',  // Muted color
color: 'rgba(255, 255, 255, 0.6)',  // Reduced contrast
cursor: 'not-allowed',
opacity: 0.6,
```

**Visual Effect**: Button appears grayed out and non-interactive.

#### Implementation (MUI)
```tsx
import { Button } from '@mui/material';

// Primary button - all states handled automatically
<Button 
  variant="contained" 
  color="primary"
  disabled={isDisabled}
>
  Apply Filters
</Button>

// Outlined variant
<Button 
  variant="outlined"
  color="primary"
>
  Clear Filters
</Button>

// Text variant
<Button 
  variant="text"
  color="primary"
>
  Learn More
</Button>
```

---

### Text Fields & Input Elements

#### Normal State
```typescript
// From theme.ts MuiTextField.root
borderColor: '#e0e0e0',  // Light gray border
borderWidth: '1.5px',
borderRadius: '12px',
backgroundColor: '#ffffff',
padding: '16px 14px',
fontSize: '1rem',
```

#### Hover State
```typescript
borderColor: '#1976d2',  // Primary color border
backgroundColor: '#ffffff',  // No change
```

**Visual Effect**: Border color shifts to primary blue to indicate focus readiness.

#### Focus State (Active Input)
```typescript
borderColor: '#1976d2',
borderWidth: '2px',  // Thicker border
boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',  // Blue glow
```

**Visual Effect**: Clear visual ring around field shows it's active.

#### Error State
```typescript
borderColor: '#f44336',  // Red
boxShadow: '0 0 0 4px rgba(244, 67, 54, 0.1)',  // Red glow
```

**Associated Element**: Error message appears below in red (#D70015)

#### Disabled State
```typescript
backgroundColor: '#f5f5f5',  // Gray background
borderColor: '#e0e0e0',
opacity: 0.6,
cursor: 'not-allowed',
color: 'rgba(0, 0, 0, 0.38)',
```

#### Implementation (MUI)
```tsx
import { TextField } from '@mui/material';

<TextField
  label="Vehicle Make"
  variant="outlined"
  value={make}
  onChange={(e) => setMake(e.target.value)}
  error={!!makeError}  // Shows error styling
  helperText={makeError}  // Error message below
  disabled={isLoading}  // Gray out during loading
/>
```

---

### Checkboxes & Radio Buttons

#### Normal State
```typescript
borderColor: '#e0e0e0',  // Light gray
size: '24px',
```

#### Checked State
```typescript
backgroundColor: '#1976d2',  // Filled with primary color
borderColor: '#1976d2',
```

#### Hover State (Unchecked)
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.04)',  // Very subtle background
```

#### Focus State (Keyboard)
```typescript
boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.08)',  // Ring glow
```

#### Disabled State
```typescript
opacity: 0.4,
cursor: 'not-allowed',
```

#### Implementation (MUI)
```tsx
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';

// Checkbox
<FormControlLabel
  control={<Checkbox 
    checked={selectedOptions.includes('allWheelDrive')}
    onChange={(e) => handleOptionChange(e)}
    disabled={isDisabled}
  />}
  label="All Wheel Drive"
/>

// Radio Group
<RadioGroup
  value={selectedMake}
  onChange={(e) => setSelectedMake(e.target.value)}
>
  <FormControlLabel value="toyota" control={<Radio />} label="Toyota" />
  <FormControlLabel value="honda" control={<Radio />} label="Honda" />
</RadioGroup>
```

---

### Chips (Tags/Filters)

#### Normal State
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.08)',  // Light blue background
color: '#1976d2',  // Blue text
borderRadius: '8px',
padding: '6px 12px',
fontSize: '0.875rem',
height: '32px',
```

#### Hover State (Clickable)
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.12)',  // Darker background
transform: 'translateY(-1px)',  // Slight lift
boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
```

#### Active State
```typescript
backgroundColor: '#1976d2',  // Solid color
color: '#ffffff',  // White text
transform: 'scale(0.98)',
```

#### Deleted State (Removal)
```typescript
opacity: 0,
transform: 'scale(0.8)',
// Animated out over 300ms
```

#### Implementation (MUI)
```tsx
import { Chip } from '@mui/material';

<Chip
  label="Toyota"
  onClick={() => selectMake('toyota')}
  onDelete={() => removeMake('toyota')}
  variant={selectedMake === 'toyota' ? 'filled' : 'outlined'}
  disabled={isDisabled}
/>
```

---

### List Items

#### Normal State
```typescript
backgroundColor: '#ffffff',
padding: '12px 16px',
borderRadius: '8px',
```

#### Hover State (Non-Button List Items)
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.04)',  // Very subtle
```

#### Hover State (Clickable List Items - Button)
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.08)',  // More pronounced
transform: 'translateX(4px)',  // Slide right slightly
```

#### Selected State
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.12)',
borderLeft: '4px solid #1976d2',  // Accent bar
```

#### Active/Current State
```typescript
backgroundColor: 'rgba(25, 118, 210, 0.12)',
color: '#1976d2',
fontWeight: 600,
```

#### Implementation (MUI)
```tsx
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

<List>
  <ListItemButton
    selected={selectedVehicle === vehicleId}
    onClick={() => setSelectedVehicle(vehicleId)}
  >
    <ListItemText
      primary={vehicleName}
      secondary={`${year} ${make} ${model}`}
    />
  </ListItemButton>
</List>
```

---

### Links

#### Normal State
```typescript
color: '#1976d2',  // Primary blue
textDecoration: 'none',
cursor: 'pointer',
```

#### Hover State
```typescript
textDecoration: 'underline',
color: '#1565c0',  // Darker blue
```

#### Visited State (Optional)
```typescript
color: '#5e35b1',  // Purple (if tracking)
```

#### Focus State (Keyboard)
```typescript
outline: '2px solid #1976d2',
outlineOffset: '2px',
borderRadius: '2px',
```

#### Active State (During Click)
```typescript
color: '#0d47a1',  // Darkest blue
fontWeight: 600,
```

#### Implementation (MUI)
```tsx
import { Link } from '@mui/material';

<Link 
  href="/vehicles"
  sx={{
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: '2px solid #1976d2',
      outlineOffset: '2px',
    },
  }}
>
  View more vehicles
</Link>
```

---

### Cards

#### Normal State
```typescript
borderRadius: '16px',
boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
backgroundColor: '#ffffff',
```

#### Hover State
```typescript
boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',  // Elevated shadow
transform: 'translateY(-2px)',  // Slight lift
```

#### Active/Selected State
```typescript
borderLeft: '4px solid #1976d2',
boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
```

#### Implementation (MUI)
```tsx
import { Card, CardContent, CardActionArea } from '@mui/material';

<Card
  sx={{
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    },
  }}
>
  <CardActionArea onClick={() => selectVehicle(id)}>
    <CardContent>
      {/* Card content */}
    </CardContent>
  </CardActionArea>
</Card>
```

---

### Switches/Toggles

#### Off State
```typescript
backgroundColor: '#e0e0e0',  // Light gray
```

#### Hover State (Off)
```typescript
backgroundColor: '#bdbdbd',  // Darker gray
```

#### On State
```typescript
backgroundColor: '#34C759',  // Apple green
```

#### Hover State (On)
```typescript
backgroundColor: '#30B952',  // Darker green
```

#### Disabled State
```typescript
opacity: 0.5,
cursor: 'not-allowed',
```

#### Implementation (MUI)
```tsx
import { Switch, FormControlLabel } from '@mui/material';

<FormControlLabel
  control={<Switch 
    checked={useAdvancedFilters}
    onChange={(e) => setUseAdvancedFilters(e.target.checked)}
    disabled={isLoading}
  />}
  label="Advanced Filters"
/>
```

---

## Transitions & Animations

### Standard Easing Curves (MUI Theme)

```typescript
// From theme.ts transitions.easing
easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',  // Most common
easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',    // Enter animations
easeIn: 'cubic-bezier(0.4, 0, 1, 1)',       // Exit animations
sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',      // Quick reactions
```

### Standard Duration Timings

```typescript
shortest: 150,      // Quick feedback (disabled → enabled)
shorter: 200,       // Hover/focus reactions
short: 250,         // State transitions
standard: 300,      // Main interactions
complex: 375,       // Multi-element sequences
```

### Application Examples

```tsx
// Smooth state transition
sx={{
  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
}}

// Fast focus response
sx={{
  transition: 'box-shadow 0.15s cubic-bezier(0.4, 0, 0.6, 1)',
  '&:focus': {
    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
  },
}}

// Staggered transitions (for lists)
sx={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDelay: '0.1s',  // Stagger effect
}}
```

---

## Accessibility Checklist for States

- [ ] **Focus Visible**: All interactive elements show visible focus indicator (outline or background change)
- [ ] **Disabled Clear**: Disabled state obvious visually (opacity/grayscale) and to screen readers (`disabled` prop)
- [ ] **Color Not Only Signal**: Don't use color alone for state (e.g., red for error should also have icon/text)
- [ ] **Contrast Maintained**: All state colors maintain 4.5:1 contrast ratio for text
- [ ] **Motion Reduced Respected**: Components reduce motion when `prefers-reduced-motion` is set

```tsx
// Example: Respect prefers-reduced-motion
sx={{
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    animation: 'none',
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
}}
```

---

## Component Implementation Checklist

When implementing new components, ensure these interaction states are defined:

- [ ] Normal state styling defined
- [ ] Hover state responsive and smooth (200-300ms transition)
- [ ] Focus state with visible indicator (keyboard accessible)
- [ ] Active state provides tactile feedback (scale/shadow change)
- [ ] Disabled state clearly visually distinct and announced to screen readers
- [ ] Error state (if applicable) uses semantic red color
- [ ] Loading state shows progress indication
- [ ] All transitions use cubic-bezier easing from theme
- [ ] Motion respects `prefers-reduced-motion` preference

---

## Theme Token Integration

Access standard state colors in components:

```tsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      transition: theme.transitions.create('all'),
    }}>
      Interactive content
    </Box>
  );
}
```

---

## Visual State Reference Grid

| Component | Normal | Hover | Focus | Active | Disabled |
|-----------|--------|-------|-------|--------|----------|
| **Button** | Blue, shadow | Darker, elevated | Outline visible | Scale 0.98 | Opacity 0.6 |
| **Input** | Gray border | Blue border | Blue 2px border + glow | N/A | Gray background |
| **Checkbox** | Gray outline | N/A | Ring glow | Blue fill | Opacity 0.4 |
| **Chip** | Light blue bg | Darker blue bg | Ring glow | Solid blue | Opacity 0.4 |
| **ListItem** | White | Subtle blue | Border left | Solid blue bg | Opacity 0.6 |
| **Link** | Blue text | Underline | Outline | Darker blue | Opacity 0.6 |
| **Card** | Subtle shadow | Elevated shadow | Ring glow | Slight lift | Opacity 0.6 |

---

## File References

- **Theme Implementation**: `packages/shared-ui/src/theme/theme.ts`
- **Material-UI States**: https://mui.com/material-ui/guides/understanding-mui-sx-prop/
- **Material Design States**: https://m3.material.io/foundations/interaction/states/overview
