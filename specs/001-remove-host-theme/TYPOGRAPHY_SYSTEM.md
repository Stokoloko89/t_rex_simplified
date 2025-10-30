# Material Design Typography System

**Feature**: Remove Host Application Theme (001-remove-host-theme)  
**Component**: Typography System  
**Status**: Reference Implementation ✅  
**Last Updated**: 2025-10-30

---

## Overview

This document details the typography system used throughout T-Rex, implemented via Material-UI theme tokens. Typography is the primary visual carrier of information hierarchy and professional appearance.

**Design Philosophy**: System fonts (Apple-iOS stack) for optimal readability, combined with Material Design weight and sizing conventions. No custom fonts to reduce bundle size and ensure reliability.

---

## Typography Scale

All font sizes use Material Design's 8px base unit (MUI spacing: 8px base). Line heights and letter spacing follow Material Design 3 specifications.

### Font Stack (System Fonts Priority)

```typescript
// Implemented in packages/shared-ui/src/theme/theme.ts
fontFamily: [
  '-apple-system',        // macOS/iOS: San Francisco
  'BlinkMacSystemFont',   // macOS Chrome compatibility
  '"Segoe UI"',           // Windows: Segoe UI
  'Roboto',               // Android: Roboto (fallback)
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',')
```

**Rationale**: 
- Eliminates external font loading (improves performance)
- Matches OS native appearance (increases perceived polish)
- Reduces web font bundle size
- Ensures consistent rendering across all platforms

---

## Type Styles

| Style | Size | Weight | Line Height | Letter Spacing | Usage | Color |
|-------|------|--------|-------------|----------------|-------|-------|
| **h1** | 2rem (32px) | 600 | 1.2 | -0.02em | Page titles, main headings | #212121 |
| **h2** | 1.75rem (28px) | 600 | 1.3 | -0.01em | Section headings | #212121 |
| **h3** | 1.5rem (24px) | 600 | 1.4 | 0em | Component section titles | #212121 |
| **h4** | 1.25rem (20px) | 600 | 1.4 | 0em | Subsection titles, card titles | #212121 |
| **h5** | 1.125rem (18px) | 600 | 1.5 | 0em | Small headers | #212121 |
| **h6** | 1rem (16px) | 600 | 1.5 | 0em | Minor headers | #212121 |
| **body1** | 1rem (16px) | 400 | 1.5 | 0em | Primary body text, paragraphs | #212121 |
| **body2** | 0.875rem (14px) | 400 | 1.5 | 0em | Secondary body text, descriptions | #757575 |
| **button** | 1rem (16px) | 500 | 1.75 | 0.02em | Button labels | Dynamic (auto) |
| **caption** | 0.75rem (12px) | 400 | 1.66 | 0em | Small captions, hints | #757575 |
| **overline** | 0.625rem (10px) | 600 | 2.66 | 0.08em | Labels, tags (UPPERCASE) | #757575 |

---

## Implementation Guide

### Using Typography in Components

```tsx
import { Typography } from '@mui/material';

// Primary page heading
<Typography variant="h1">Vehicle Search</Typography>

// Section heading
<Typography variant="h3">Filter Results</Typography>

// Standard paragraph
<Typography variant="body1">
  Find your perfect vehicle from our inventory
</Typography>

// Secondary text
<Typography variant="body2" color="textSecondary">
  Refine your search using filters below
</Typography>

// Button text (auto-applied)
<Button>Apply Filters</Button>

// Caption/helper text
<Typography variant="caption">
  Showing 1-20 of 487 results
</Typography>
```

### Color Assignments

#### Text Colors

- **Primary Text (#212121)**: Main content - headings, body, labels
- **Secondary Text (#757575)**: Supporting information - descriptions, captions
- **Disabled Text (#cccccc)**: Inactive UI - disabled buttons, read-only fields
- **Error Text (#D70015)**: Error messages and validation feedback
- **Success Text (#248A3D)**: Success confirmations and positive feedback

#### Heading Colors

All headings default to dark gray (#212121) for high contrast and readability. Semantic colors (error, success) applied only when conveying specific status.

---

## Visual Hierarchy Rules

The typography scale creates visual hierarchy through three primary mechanisms:

### 1. Size Hierarchy

```
h1 (32px)  ← Page-level emphasis
  ↓
h2 (28px)  ← Section emphasis
  ↓
h3 (24px)  ← Component emphasis
  ↓
body1 (16px) ← Primary content
  ↓
body2 (14px) ← Secondary content
  ↓
caption (12px) ← Tertiary content
```

### 2. Weight Hierarchy

- **Headings**: Weight 600 (semibold) - draws eye first
- **Buttons**: Weight 500 (medium) - actionable elements
- **Body**: Weight 400 (regular) - readable content
- **Caption/Overline**: Weight 600 for labels, 400 for text

### 3. Color Hierarchy

- **Primary text (#212121)**: Important information
- **Secondary text (#757575)**: Supporting information
- **Semantic colors**: Status information (red/green)

---

## Responsive Typography

Material-UI theme applies same typography scale across all breakpoints. To scale typography responsively:

```tsx
// Option 1: Using MUI's responsive values
<Typography sx={{
  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
}}>
  Responsive heading
</Typography>

// Option 2: CSS media queries (if custom scaling needed)
<Typography sx={{
  fontSize: '1rem',
  '@media (min-width: 600px)': {
    fontSize: '1.25rem',
  },
  '@media (min-width: 960px)': {
    fontSize: '1.5rem',
  },
}}>
  Responsive heading
</Typography>
```

### Breakpoints (MUI Defaults)

- **xs**: 0px (mobile)
- **sm**: 600px (tablet)
- **md**: 960px (desktop)
- **lg**: 1280px (large desktop)
- **xl**: 1920px (extra-large)

---

## Line Length & Readability

Optimal line length for body text is 45-75 characters. Container maximum widths:

```typescript
// In component styling
maxWidth: '600px'  // Paragraph-heavy content
maxWidth: '960px'  // Mixed content
maxWidth: '1200px' // Large layouts
```

---

## Emphasis & Styling Options

### Bold Text

```tsx
<Typography sx={{ fontWeight: 600 }}>
  Important emphasized text
</Typography>
```

### Italic Text

```tsx
<Typography sx={{ fontStyle: 'italic' }}>
  Referenced or quoted text
</Typography>
```

### Link Styling

```tsx
<Link
  sx={{
    color: '#1976d2',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: '#1565c0',
    },
  }}
  href="/somewhere"
>
  Navigate somewhere
</Link>
```

---

## Component-Specific Typography

### Forms & Input Fields

```tsx
// Label text
<Typography variant="body2" component="label" sx={{ fontWeight: 500 }}>
  Vehicle Make
</Typography>

// Helper/validation text
<Typography variant="caption" color="error">
  This field is required
</Typography>
```

### Buttons

All buttons use `variant="button"` typography automatically:
- Text: 1rem, Weight: 500
- Letter spacing: 0.02em (subtle widening)
- Text transform: None (no uppercase conversion)

```tsx
<Button variant="contained">
  Apply Filters  {/* Automatically styled as button typography */}
</Button>
```

### Cards & Sections

```tsx
<Card>
  <CardContent>
    <Typography variant="h4" gutterBottom>
      Card Title
    </Typography>
    <Typography variant="body2" color="textSecondary">
      Card description or supporting text
    </Typography>
  </CardContent>
</Card>
```

### Data Tables

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableCell>
        <Typography variant="button">Column Header</Typography>
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>
        <Typography variant="body2">Data cell content</Typography>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Accessibility Considerations

### Color Contrast

All text colors meet WCAG 2.1 AA standards:

| Combination | Ratio | Level | Usage |
|------------|-------|-------|-------|
| #212121 on #ffffff | 12.6:1 | AAA | Primary text |
| #757575 on #ffffff | 5.5:1 | AA | Secondary text |
| #1976d2 on #ffffff | 8.6:1 | AAA | Links (if used) |

### Text Sizing

- Minimum text size: 12px (captions)
- Recommended minimum: 14px for body text
- Ensure 1.5x line height for body text (implemented: 1.5)

### Focus Indicators for Links

```tsx
<Link
  sx={{
    '&:focus-visible': {
      outline: '2px solid #1976d2',
      outlineOffset: '2px',
      borderRadius: '4px',
    },
  }}
>
  Link text
</Link>
```

---

## Spacing with Typography

Material Design 8px base unit applies to typography spacing:

```tsx
// Spacing after headings
<Typography variant="h3" sx={{ mb: 3 }}>  {/* 24px below */}
  Section Title
</Typography>

// Spacing between paragraphs
<Typography variant="body1" sx={{ mb: 2 }}>
  First paragraph
</Typography>
<Typography variant="body1" sx={{ mb: 2 }}>
  Second paragraph
</Typography>

// Spacing inside containers
<Box sx={{ p: 3 }}>  {/* 24px padding = 3 * 8px */}
  <Typography variant="h4">Title</Typography>
</Box>
```

---

## Migration Guide (For Existing Code)

If updating existing components to use this typography system:

### Before (Hardcoded Styles)
```tsx
<div style={{
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#000',
}}>
  My Heading
</div>
```

### After (Typography Variant)
```tsx
<Typography variant="h4">
  My Heading
</Typography>
```

### Advantages
- ✅ Consistent across all components
- ✅ Responsive scaling possible
- ✅ Theme-driven (easy to customize)
- ✅ Accessibility built-in
- ✅ Smaller bundle size

---

## Common Patterns

### Page Section Layout
```tsx
<Box sx={{ py: 4 }}>
  <Typography variant="h2" sx={{ mb: 3 }}>
    Search Results
  </Typography>
  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
    Found {count} vehicles matching your criteria
  </Typography>
  
  {/* Content here */}
</Box>
```

### Card with Hierarchy
```tsx
<Card>
  <CardContent>
    <Typography variant="h4" gutterBottom>
      Vehicle Details
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      {vehicleDescription}
    </Typography>
    <Typography variant="caption" color="textSecondary">
      Posted {datePublished}
    </Typography>
  </CardContent>
</Card>
```

### Form Section
```tsx
<Box>
  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
    Vehicle Preferences
  </Typography>
  {/* Form fields */}
  <Typography variant="caption" color="textSecondary">
    These preferences help us show you better results
  </Typography>
</Box>
```

---

## Theme Token Reference

For developers integrating with the theme:

```typescript
// Access typography tokens in components
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Typography sx={{
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      lineHeight: theme.typography.h3.lineHeight,
    }}>
      Themed heading
    </Typography>
  );
}
```

---

## File References

- **Theme Implementation**: `packages/shared-ui/src/theme/theme.ts`
- **Component Examples**: `microfrontends/buying-flow/src/components/`
- **Material-UI Docs**: https://mui.com/material-ui/react-typography/
- **Material Design Typography**: https://m3.material.io/styles/typography/overview

---

## Checklist for Typography Implementation

- [ ] All headings use appropriate h1-h6 variants (not sizes)
- [ ] Body text uses body1 (main content) or body2 (secondary)
- [ ] All captions use caption variant
- [ ] Button text is applied via Button component (auto-styled)
- [ ] Color contrast verified for all text (WCAG 2.1 AA minimum)
- [ ] Line heights set appropriately (1.5+ for body text)
- [ ] Font stack references system fonts first
- [ ] No hardcoded font sizes or weights (use theme instead)
- [ ] Responsive text sizes implemented where needed
- [ ] Focus indicators visible for interactive text elements
