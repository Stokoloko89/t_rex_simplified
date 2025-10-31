# Contact Request API Contract

**Endpoint**: `POST /api/contact-requests`  
**Version**: 1.0  
**Status**: ✅ Ready for implementation  
**Audience**: Frontend (buying-flow microfrontend) & Backend (workflowservice)

## Overview

This endpoint handles multi-vehicle contact request submissions from users. The user specifies one or more vehicles they're interested in and provides contact information for dealership follow-up.

## Request

### URL
```
POST /api/contact-requests
```

### Headers
```
Content-Type: application/json
Authorization: Optional (Bearer token if user authenticated)
```

### Request Body

```json
{
  "fullName": "Sarah Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "+27 83 456 7890",
  "province": "Western Cape",
  "city": "Cape Town",
  "preferredContactMethod": "email",
  "additionalComments": "Interested in fuel-efficient vehicles",
  "selectedVehicles": [
    {
      "vehicleId": 12345,
      "make": "Toyota",
      "model": "Starlet",
      "year": 2022,
      "price": 458171
    },
    {
      "vehicleId": 12346,
      "make": "Toyota",
      "model": "RAV4",
      "year": 2022,
      "price": 461457
    }
  ]
}
```

### Field Specifications

| Field | Type | Required | Length | Validation |
|-------|------|----------|--------|-----------|
| fullName | string | ✓ | 2-255 | Non-empty, letters/spaces/hyphens only |
| email | string | ✓ | - | Valid email format (RFC 5322) |
| phone | string | ✓ | - | International format: +[1-9]XX...X (E.164) |
| province | string | ✓ | - | Must exist in provinces master data |
| city | string | ✓ | - | Must exist in cities for selected province |
| preferredContactMethod | enum | ✓ | - | One of: email, phone, whatsapp |
| additionalComments | string | ✗ | 0-1000 | Optional, max 1000 characters |
| selectedVehicles | array | ✓ | 1-4 | Array of 1-4 vehicles, each with vehicleId |

### Validation Rules (Backend Authority)

**MUST BE VALIDATED ON BACKEND** - Frontend validation is presentation only:

1. **fullName**:
   - Not empty or whitespace only
   - Length >= 2 and <= 255 characters
   - Regex match: `^[a-zA-Z\s'-]+$`

2. **email**:
   - Valid email format
   - Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` or RFC 5322 validator
   - May enforce uniqueness per dealership

3. **phone**:
   - International format with country code
   - Regex: `/^\+[1-9]\d{1,14}$/` (E.164 format)
   - Example valid formats:
     - +27 83 456 7890 (South Africa)
     - +1 555 123 4567 (USA)
     - +44 20 7946 0958 (UK)

4. **province**:
   - Must exist in `provinces` master table
   - Exact string match (case-sensitive or case-insensitive per backend decision)

5. **city**:
   - Must exist in `cities` table where `city.province_id = provinces.id`
   - Dependent on province selection (validate relationship)

6. **preferredContactMethod**:
   - One of: "email", "phone", "whatsapp"

7. **additionalComments**:
   - Optional field
   - If provided: max 1000 characters
   - Trim whitespace

8. **selectedVehicles**:
   - Array with 1-4 items (min 1, max 4 vehicles)
   - Each vehicle must have:
     - vehicleId: positive integer, must exist in vehicles table
     - Other fields (make, model, year, price) are informational; backend can re-fetch from DB
   - No duplicate vehicleIds in array

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "contactRequestId": 98765,
  "message": "Thank you for your interest. We'll contact you shortly.",
  "nextUrl": "/confirmation?id=98765"
}
```

**Status**: `201 Created`

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true for successful response |
| contactRequestId | number | Unique ID for this contact request; use for tracking |
| message | string | User-friendly success message |
| nextUrl | string | Optional redirect URL for frontend |

### Validation Error Response (422 Unprocessable Entity)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address",
      "code": "INVALID_EMAIL"
    },
    {
      "field": "phone",
      "message": "Phone number must include country code (e.g., +27)",
      "code": "INVALID_PHONE"
    },
    {
      "field": "selectedVehicles",
      "message": "Please select at least one vehicle",
      "code": "NO_VEHICLES_SELECTED"
    }
  ]
}
```

**Status**: `422 Unprocessable Entity`

**Errors Array**: Each error object contains:
- `field`: Field name that failed validation
- `message`: Human-readable error message for display to user
- `code`: Machine-readable error code for logging/handling

### Server Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later.",
  "errorId": "ERR-2025-10-30-001"
}
```

**Status**: `500 Internal Server Error`

**Note**: Detailed error info included in server logs, not returned to client (security best practice)

## Example Requests & Responses

### Example 1: Valid Multi-Vehicle Submission

**Request**:
```bash
curl -X POST http://localhost:3000/api/contact-requests \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john@example.com",
    "phone": "+27 21 555 1234",
    "province": "Western Cape",
    "city": "Cape Town",
    "preferredContactMethod": "whatsapp",
    "selectedVehicles": [
      {"vehicleId": 100, "make": "Toyota", "model": "Corolla", "year": 2023, "price": 350000},
      {"vehicleId": 101, "make": "Honda", "model": "Civic", "year": 2023, "price": 380000}
    ]
  }'
```

**Response** (201):
```json
{
  "success": true,
  "contactRequestId": 54321,
  "message": "Thank you for your interest. We'll contact you via WhatsApp shortly.",
  "nextUrl": "/confirmation?id=54321"
}
```

### Example 2: Invalid Email Format

**Request**: (email field: "invalid.email.com" - missing @)

**Response** (422):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address",
      "code": "INVALID_EMAIL"
    }
  ]
}
```

### Example 3: Invalid Phone Format

**Request**: (phone field: "021 555 1234" - missing country code)

**Response** (422):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must include country code (e.g., +27)",
      "code": "INVALID_PHONE"
    }
  ]
}
```

### Example 4: No Vehicles Selected

**Request**: (selectedVehicles: [] - empty array)

**Response** (422):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "selectedVehicles",
      "message": "Please select at least one vehicle",
      "code": "NO_VEHICLES_SELECTED"
    }
  ]
}
```

## Backend Processing

### Upon Successful Submission (201)

1. **Create ContactRequest** in `contact_requests` table with:
   - All submitted field values
   - `status = 'pending'`
   - `created_at = NOW()`
   - `anonymity_expires_at = NOW() + 30 minutes`

2. **Create Junction Records** in `contact_request_vehicles` for each selected vehicle:
   - Link contactRequestId to each vehicleId
   - Store denormalized vehicle details (make, model, year, price)

3. **Schedule Email Notification** (30 minutes from now):
   - Queue background job to send dealership notification email
   - Email triggers when `anonymity_expires_at <= NOW()`
   - Email includes: buyer contact info + vehicle list

4. **Return 201** with contactRequestId

### Upon Validation Error (422)

1. **Collect all validation errors** (don't stop on first error - report all at once)
2. **Return 422** with errors array for frontend to display
3. **Do NOT create** ContactRequest record
4. **Do NOT schedule** email notification

### Rate Limiting

- Recommend: Max 5 contact requests per IP per hour
- Recommend: Max 10 contact requests per email address per day
- Return `429 Too Many Requests` if exceeded

## Constitutional Compliance

✅ **Backend-Driven Validation**: All validation performed on server before database write  
✅ **API-First Contract**: Schema defined with examples before implementation  
✅ **Dealership Anonymity**: Dealership details NOT sent until 30 min after submission via email only  
✅ **Data Security**: Email/phone treated as PII, encrypted in transit and at rest  

## Implementation Notes

**Frontend** (React/TypeScript):
- Use React Hook Form with validation schema
- Call POST /api/contact-requests on form submit
- Display 422 errors field-by-field to user
- Show 201 success message with next redirect

**Backend** (Java workflowservice):
- Extend ContactRequest entity to include vehicles collection
- Update ContactRequestController to accept POST with vehicles array
- Add ContactRequestValidator with business rules
- Implement background job for 30-min delayed email notification

## Related Contracts

- See `vehicle-list-display.md` for GET /api/vehicles/selected endpoint (fetch vehicle details)
- See `provinces-cities-dropdown.md` for location data endpoints
