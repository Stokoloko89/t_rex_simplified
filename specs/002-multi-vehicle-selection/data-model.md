# Phase 1: Data Model & Entity Definitions

**Feature**: Multi-Vehicle Selection Display & Contact Request Form  
**Date**: October 30, 2025  
**Status**: ✅ Design phase complete

## Entity Models

### Vehicle

**Description**: Represents a vehicle listed in the T-Rex system. Used for display on vehicle selection page and contact request review page.

**Fields**:
```typescript
interface Vehicle {
  vehicleId: number                    // Unique identifier
  make: string                         // e.g., "Toyota"
  model: string                        // e.g., "Starlet"
  year: number                         // e.g., 2022
  price: number                        // Asking price in currency (e.g., R458,171)
  location: string                     // Province/Region (e.g., "Northern Cape")
  mileage: number                      // e.g., 55,534 km
  transmission: "Automatic" | "Manual" // e.g., "Automatic"
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" // e.g., "Petrol"
  color: string                        // e.g., "Grey", "Blue", "White"
  bodyType: string                     // e.g., "Hatchback", "Sedan", "SUV"
  imageUrl: string                     // Full URL to vehicle image
  stockNumber: string                  // Internal stock identifier
  condition: "Used" | "New"            // Vehicle condition
  rating: "Excellent" | "Good" | "Fair" // Dealership rating badge
  dealershipId: number                 // [HIDDEN FROM USER] - Never exposed to frontend during selection
}
```

**Relationships**:
- 1 Vehicle → many ContactRequests (tracking which requests included this vehicle)
- 1 Vehicle → 1 Dealership (dealership ID hidden until 30 min after user interest)

**Validation Rules**:
- vehicleId: Required, positive integer, must exist in database
- price: Required, positive number, > 0
- mileage: Required, non-negative integer
- fuelType: Required, one of enum values
- transmission: Required, one of enum values
- imageUrl: Required, valid URL format

---

### ContactRequest

**Description**: Represents a user's request to be contacted regarding one or more vehicles. Submitted form data stored on backend for dealership follow-up.

**Fields**:
```typescript
interface ContactRequest {
  // Metadata
  contactRequestId: number             // Unique identifier, auto-generated
  createdAt: timestamp                 // ISO 8601 format
  status: "pending" | "contacted" | "converted" // Workflow state
  
  // User Contact Information
  fullName: string                     // e.g., "Sarah Johnson" (required, non-empty)
  email: string                        // e.g., "sarah@example.com" (required, valid email)
  phone: string                        // e.g., "+27 83 456 7890" (required, valid international)
  
  // User Location
  province: string                     // e.g., "Western Cape" (required, from provinces list)
  city: string                         // e.g., "Cape Town" (required, from cities list for province)
  
  // Contact Preferences
  preferredContactMethod: "email" | "phone" | "whatsapp" // (required)
  additionalComments: string           // Optional, max 1000 chars
  
  // Selected Vehicles (NEW - Multi-vehicle support)
  selectedVehicles: [
    {
      vehicleId: number
      make: string
      model: string
      year: number
      price: number
    }
  ]                                    // Array of 1-4 vehicles
  
  // System Fields
  userId?: number                      // If user authenticated (optional)
  dealershipIds: number[]              // Array of dealership IDs for selected vehicles
  anonymityExpiresAt: timestamp        // When dealership info can be revealed (30 min from now)
  emailSentAt?: timestamp              // When dealership notification sent
  
  // Internal
  ipAddress: string                    // For fraud detection
  userAgent: string                    // Browser info
}
```

**Relationships**:
- 1 ContactRequest → many Vehicles (1-4 relationship)
- 1 ContactRequest → many Dealerships (via dealershipIds array)
- 1 User → many ContactRequests (if user authenticated)

**State Machine**:
```
pending ─[dealership contacted]─> contacted ─[buyer converted]─> converted
  │
  └─[dealership unresponsive]─> abandoned
```

**Validation Rules**:
- fullName: Required, non-empty, length > 1 character
- email: Required, valid email format (RFC 5322)
- phone: Required, must match international format pattern (starts with + and country code)
- province: Required, must be from provinces list (database or API lookup)
- city: Required, must be from cities list for selected province
- preferredContactMethod: Required, one of enum values
- additionalComments: Optional, max 1000 characters
- selectedVehicles: Required array, length 1-4, each vehicle must exist in database
- anonymityExpiresAt: Calculated as createdAt + 30 minutes

---

### ValidationError

**Description**: Represents a single form field validation failure. Used for error display feedback.

**Fields**:
```typescript
interface ValidationError {
  field: string                        // Field name, e.g., "email", "phone", "fullName"
  message: string                      // Human-readable error message
  severity: "error" | "warning"        // Error level
  code: string                         // Machine-readable error code, e.g., "INVALID_EMAIL"
}
```

**Error Codes & Messages**:
```
REQUIRED_FIELD
  Message: "[Field Name] is required"
  
INVALID_EMAIL
  Message: "Please enter a valid email address"
  
INVALID_PHONE
  Message: "Phone number must include country code (e.g., +27)"
  
INVALID_PHONE_FORMAT
  Message: "Phone number format not recognized"
  
PROVINCE_REQUIRED
  Message: "Please select a province"
  
CITY_REQUIRED
  Message: "Please select a city"
  
CONTACT_METHOD_REQUIRED
  Message: "Please select a preferred contact method"
  
MIN_LENGTH
  Message: "[Field Name] must be at least X characters"
  
MAX_LENGTH
  Message: "Additional comments limited to 1000 characters"
  
NO_VEHICLES_SELECTED
  Message: "Please select at least one vehicle"
  
TOO_MANY_VEHICLES
  Message: "Maximum 4 vehicles can be selected"
```

---

## Data Flow Diagram

```
Vehicle Selection Page
        │
        ├─ User selects 2-4 vehicles
        │
        ├─ selectedVehicles: Vehicle[] stored in component state
        │
        └─→ "Continue with X Selected Vehicles" button
              │
              │ (state passed to ContactRequestStep)
              │
        Contact Request Page
              │
              ├─ VehicleReviewSection
              │    └─ Displays all selectedVehicles[] with vehicle cards
              │
              ├─ ContactRequestForm
              │    ├─ Form state initialized with empty values
              │    ├─ User fills: fullName, email, phone, province, city, contactMethod, comments
              │    ├─ Real-time validation on blur/change
              │    ├─ Error messages displayed under each field
              │    │
              │    └─→ User clicks Submit
              │         │
              │         ├─ Client-side validation runs
              │         ├─ All errors collected
              │         ├─ IF errors: display ValidationError[] to user → STOP
              │         │
              │         └─ IF valid: 
              │              │
              │              └─→ POST /api/contact-requests
              │                   │
              │                   ├─ Backend receives:
              │                   │    - ContactRequest data
              │                   │    - selectedVehicles[]
              │                   │
              │                   ├─ Backend validates (authoritative)
              │                   │
              │                   ├─ IF invalid:
              │                   │    └─ Returns 422 with ValidationError[]
              │                   │       Frontend displays errors
              │                   │
              │                   └─ IF valid:
              │                        │
              │                        ├─ Create ContactRequest in DB
              │                        ├─ Store all selectedVehicles in junction table
              │                        ├─ Set anonymityExpiresAt = now + 30 min
              │                        ├─ Schedule email to dealerships for later
              │                        │
              │                        └─ Return 200 with contactRequestId
              │                           │
              │                           └─→ Frontend: Show success message
              │                              Redirect to confirmation page
              │
        [30 minutes later]
              │
              ├─ Scheduled job runs
              ├─ Finds ContactRequest where anonymityExpiresAt <= now
              ├─ Retrieves dealership contact info
              ├─ Sends email with:
              │    - Buyer name, contact info, location
              │    - Vehicles buyer interested in
              │
              └─→ Dealership receives notification
```

---

## Database Schema

### Tables

**contact_requests**
```sql
CREATE TABLE contact_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  preferred_contact_method VARCHAR(20) NOT NULL CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
  additional_comments TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'abandoned')),
  user_id INT,
  anonymity_expires_at TIMESTAMP NOT NULL,
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_anonymity_expires (anonymity_expires_at),
  INDEX idx_created_at (created_at)
);
```

**contact_request_vehicles** (Junction Table)
```sql
CREATE TABLE contact_request_vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_request_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INT,
  price DECIMAL(10, 2),
  
  FOREIGN KEY (contact_request_id) REFERENCES contact_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  UNIQUE KEY uk_request_vehicle (contact_request_id, vehicle_id),
  INDEX idx_vehicle (vehicle_id)
);
```

---

## Type Definitions (TypeScript)

**File: `microfrontends/buying-flow/src/types/vehicle.ts`**
```typescript
export interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  mileage: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  color: string;
  bodyType: string;
  imageUrl: string;
  stockNumber: string;
  condition: 'Used' | 'New';
  rating: 'Excellent' | 'Good' | 'Fair';
}

export interface SelectedVehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  price: number;
}
```

**File: `microfrontends/buying-flow/src/types/contactRequest.ts`**
```typescript
export interface ContactRequestFormData {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  additionalComments?: string;
}

export interface ContactRequest extends ContactRequestFormData {
  contactRequestId: number;
  selectedVehicles: SelectedVehicle[];
  createdAt: string;
  status: 'pending' | 'contacted' | 'converted' | 'abandoned';
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}
```

---

## Validation Rules Summary

### Frontend Validation (Presentation Layer)

**Full Name**:
- Required: Yes
- Min length: 2 characters
- Max length: 255 characters
- Regex: `^[a-zA-Z\s'-]+$` (letters, spaces, hyphens, apostrophes)
- Error: "Please enter a valid name"

**Email**:
- Required: Yes
- Format: Valid email address (RFC 5322)
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Error: "Please enter a valid email address"

**Phone**:
- Required: Yes
- Format: International format with country code
- Regex: `/^\+[1-9]\d{1,14}$/` (E.164 format)
- Error: "Phone number must include country code (e.g., +27)"

**Province**:
- Required: Yes
- Type: Select dropdown
- Options: From provinces API endpoint
- Error: "Please select a province"

**City**:
- Required: Yes
- Type: Select dropdown (dependent on province)
- Options: From cities API endpoint filtered by province
- Error: "Please select a city"

**Preferred Contact Method**:
- Required: Yes
- Type: Select dropdown or radio buttons
- Options: email | phone | whatsapp
- Error: "Please select a preferred contact method"

**Additional Comments**:
- Required: No
- Max length: 1000 characters
- Min length: 0 characters
- Error (if max exceeded): "Comments limited to 1000 characters"

### Backend Validation (Authoritative)

All frontend rules re-validated on backend + additional checks:
- Email uniqueness (per dealership business rules)
- Phone format with carrier validation (if available)
- Province/City existence in master data
- Vehicle availability (vehicles still listed)
- Dealership business rules (min/max contact requests per day, etc.)
- Rate limiting (prevent abuse)

---

## Performance Considerations

| Aspect | Target | Implementation |
|--------|--------|-----------------|
| Form validation feedback | < 500ms | Real-time on blur, no API calls until submit |
| Vehicle list render | < 200ms | Virtual scrolling if > 20 vehicles |
| API submission | < 3 seconds | Timeout handling, retry logic |
| Page load | < 2 seconds | Lazy load vehicle images, optimize bundle |
| Mobile responsiveness | Smooth scrolling | Native scroll, no custom scroll handlers |

---

## Accessibility Requirements

- Form labels associated with inputs (htmlFor attribute)
- Error messages linked to fields with aria-describedby
- Keyboard navigation: Tab through form fields, Enter to submit
- Screen reader: Announce validation errors immediately
- Color contrast: WCAG AA compliant (4.5:1 for text)
- Focus management: Visible focus indicator on all interactive elements

