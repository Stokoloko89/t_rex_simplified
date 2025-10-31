# Quick Start Guide: Multi-Vehicle Selection Implementation

**Date**: October 30, 2025  
**Status**: ✅ Ready for development team  
**Audience**: Frontend & Backend developers implementing this feature

## Overview

This guide provides a quick reference for setting up the multi-vehicle selection feature. For detailed information, refer to `data-model.md` and `contracts/contact-request-submission.md`.

## Quick Facts

| Item | Details |
|------|---------|
| **Feature Name** | Multi-Vehicle Selection Display & Contact Request Form |
| **Microfrontend** | `microfrontends/buying-flow` |
| **Backend Service** | `backend/workflowservice` |
| **Primary Language** | TypeScript (frontend), Java (backend) |
| **Form Library** | React Hook Form (recommended) |
| **UI Framework** | Material-UI (MUI) |
| **Theme Tokens** | `packages/shared-ui/src/theme/theme.ts` |
| **Database** | PostgreSQL (existing) |
| **Key Files to Modify** | ContactRequestForm.tsx, ContactRequestStep.tsx, ContactRequest.java |
| **New Files** | VehicleReviewList.tsx, validationService.ts, FormField.tsx, ContactRequestForm.test.tsx |

## Frontend Setup

### 1. Install Dependencies (if not already present)

```bash
cd microfrontends/buying-flow

# React Hook Form (for form state and validation)
npm install react-hook-form@7.48.0

# Or with pnpm (if project uses pnpm)
pnpm add react-hook-form@7.48.0

# Validation library (optional but recommended)
npm install yup@1.3.0
# or
npm install zod@3.22.0
```

### 2. Component Structure

**Primary Components to Create/Modify**:

```
src/
├── components/
│   ├── VehicleReviewList.tsx [NEW]
│   │   ├─ Props: vehicles: Vehicle[], onModifyClick: () => void
│   │   ├─ Display all selected vehicles in scrollable list
│   │   ├─ Reuse VehicleCard component
│   │   └─ Support 1-4 vehicles
│   │
│   ├── ContactRequestForm.tsx [MODIFY]
│   │   ├─ Use React Hook Form (useForm hook)
│   │   ├─ Remove mock data (clear default values)
│   │   ├─ Add field-level validation with error display
│   │   ├─ Implement Province-City dependent dropdowns
│   │   └─ Handle form submission with API call
│   │
│   ├── FormField.tsx [NEW]
│   │   ├─ Reusable form field component
│   │   ├─ Props: label, name, error, helperText, type, required
│   │   ├─ Display Material-UI TextField with error styling
│   │   └─ Integrate with React Hook Form controller
│   │
│   └── ValidationError.tsx [NEW]
│       ├─ Display validation error messages
│       ├─ Props: field: string, message: string, code: string
│       ├─ Red text styling, icon, accessibility
│       └─ Can be inline or separate error block
│
├── steps/
│   └── ContactRequestStep.tsx [MODIFY]
│       ├─ Manage multi-vehicle state
│       ├─ Pass selectedVehicles to VehicleReviewList
│       ├─ Pass selectedVehicles to form for submission
│       └─ Handle step transitions (prev/next)
│
├── types/
│   ├── vehicle.ts [NEW]
│   │   └─ Vehicle interface with all fields
│   │
│   └── contactRequest.ts [NEW]
│       ├─ ContactRequestFormData interface
│       ├─ ContactRequest interface
│       └─ ValidationError interface
│
├── services/
│   ├── contactRequestService.ts [NEW]
│   │   ├─ submitContactRequest(data: ContactRequestFormData): Promise<{contactRequestId, message}>
│   │   ├─ Handle API call to POST /api/contact-requests
│   │   ├─ Return errors if validation fails
│   │   └─ Error handling and retry logic
│   │
│   └── validationService.ts [NEW]
│       ├─ Email validation: isValidEmail(email: string): boolean
│       ├─ Phone validation: isValidPhone(phone: string): boolean
│       ├─ Form validation: validateContactForm(data): ValidationError[]
│       └─ Reusable validation functions
│
└── hooks/
    ├── useContactForm.ts [NEW]
    │   ├─ Custom hook wrapping React Hook Form
    │   ├─ Handle form state, validation, submission
    │   ├─ Return: { register, handleSubmit, formState, errors, isLoading }
    │   └─ Simplify component logic
    │
    └── useVehicleSelection.ts [MODIFY/NEW]
        ├─ Manage selected vehicles state
        ├─ Persist across navigation
        └─ Clear on step reset
```

### 3. Form Validation Implementation

**Example with React Hook Form + Yup**:

```typescript
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+[1-9]\d{1,14}$/,
      'Phone must include country code (e.g., +27 83 456 7890)'
    ),
  province: yup
    .string()
    .required('Please select a province'),
  city: yup
    .string()
    .required('Please select a city'),
  preferredContactMethod: yup
    .string()
    .required('Please select a preferred contact method')
    .oneOf(['email', 'phone', 'whatsapp']),
  additionalComments: yup
    .string()
    .max(1000, 'Comments limited to 1000 characters'),
});

export function ContactRequestForm({ selectedVehicles, onSuccess }) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      province: '',
      city: '',
      preferredContactMethod: 'email',
      additionalComments: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await submitContactRequest({
        ...data,
        selectedVehicles: selectedVehicles.map(v => ({
          vehicleId: v.vehicleId,
          make: v.make,
          model: v.model,
          year: v.year,
          price: v.price,
        })),
      });
      onSuccess(response.contactRequestId);
    } catch (error) {
      // Handle API errors
      if (error.response?.status === 422) {
        error.response.data.errors.forEach(err => {
          setFieldError(err.field, err.message);
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Full Name"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            fullWidth
            margin="normal"
          />
        )}
      />
      {/* More fields... */}
    </form>
  );
}
```

### 4. Material Design & Styling

**Theme Token Usage**:

```typescript
// Import theme
import { useTheme } from '@mui/material/styles';

// Use theme in component
const ContactRequestForm = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      spacing: theme.spacing(2),
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
    }}>
      {/* Form fields with theme colors */}
    </Box>
  );
};
```

**Responsive Layout**:

```typescript
import { Grid, Box } from '@mui/material';

return (
  <Grid container spacing={3}>
    {/* Mobile: full-width, Tablet+: 2-column */}
    <Grid item xs={12} md={6}>
      <VehicleReviewList vehicles={selectedVehicles} />
    </Grid>
    <Grid item xs={12} md={6}>
      <ContactRequestForm selectedVehicles={selectedVehicles} />
    </Grid>
  </Grid>
);
```

## Backend Setup

### 1. Database Migration

**File**: `backend/src/main/resources/db/migration/V[X]__add_multi_vehicle_support.sql`

```sql
-- Add vehicle support to contact requests
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

-- Add column to contact_requests if using single vehicle currently
ALTER TABLE contact_requests 
ADD COLUMN anonymity_expires_at TIMESTAMP NOT NULL DEFAULT (DATE_ADD(NOW(), INTERVAL 30 MINUTE));

ALTER TABLE contact_requests 
ADD COLUMN email_sent_at TIMESTAMP;
```

### 2. Update Entity Models

**File**: `backend/src/main/java/com/trex/models/ContactRequest.java`

```java
@Entity
@Table(name = "contact_requests")
public class ContactRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String province;
    
    @Column(nullable = false)
    private String city;
    
    @Column(name = "preferred_contact_method")
    private String preferredContactMethod;
    
    @Column(columnDefinition = "TEXT")
    private String additionalComments;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "contact_request_id")
    private List<ContactRequestVehicle> selectedVehicles = new ArrayList<>();
    
    @Column(name = "anonymity_expires_at")
    private LocalDateTime anonymityExpiresAt;
    
    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Getters, setters, constructors
}
```

### 3. Validation Service

**File**: `backend/src/main/java/com/trex/services/ContactRequestValidationService.java`

```java
@Service
public class ContactRequestValidationService {
    
    public List<ValidationError> validate(ContactRequestDTO dto) {
        List<ValidationError> errors = new ArrayList<>();
        
        if (isEmpty(dto.getFullName())) {
            errors.add(new ValidationError("fullName", "Full name is required"));
        }
        
        if (!isValidEmail(dto.getEmail())) {
            errors.add(new ValidationError("email", "Please enter a valid email address"));
        }
        
        if (!isValidPhone(dto.getPhone())) {
            errors.add(new ValidationError("phone", "Phone must include country code (e.g., +27)"));
        }
        
        if (isEmpty(dto.getProvince())) {
            errors.add(new ValidationError("province", "Please select a province"));
        }
        
        if (dto.getSelectedVehicles().isEmpty() || dto.getSelectedVehicles().size() > 4) {
            errors.add(new ValidationError("selectedVehicles", "Select 1-4 vehicles"));
        }
        
        return errors;
    }
    
    private boolean isValidPhone(String phone) {
        return phone != null && phone.matches("^\\+[1-9]\\d{1,14}$");
    }
    
    private boolean isValidEmail(String email) {
        // Use email validator library or regex
        return email != null && email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }
}
```

### 4. Controller Endpoint

**File**: `backend/src/main/java/com/trex/controllers/ContactRequestController.java`

```java
@RestController
@RequestMapping("/api/contact-requests")
public class ContactRequestController {
    
    @PostMapping
    public ResponseEntity<?> submitContactRequest(@RequestBody ContactRequestDTO dto) {
        // Validate
        List<ValidationError> errors = validationService.validate(dto);
        if (!errors.isEmpty()) {
            return ResponseEntity.status(422).body(new ApiResponse(false, "Validation failed", errors));
        }
        
        // Create and save
        ContactRequest request = new ContactRequest();
        request.setFullName(dto.getFullName());
        request.setEmail(dto.getEmail());
        request.setPhone(dto.getPhone());
        request.setProvince(dto.getProvince());
        request.setCity(dto.getCity());
        request.setPreferredContactMethod(dto.getPreferredContactMethod());
        request.setAdditionalComments(dto.getAdditionalComments());
        
        // Add selected vehicles
        dto.getSelectedVehicles().forEach(v -> {
            ContactRequestVehicle crv = new ContactRequestVehicle();
            crv.setVehicleId(v.getVehicleId());
            crv.setMake(v.getMake());
            crv.setModel(v.getModel());
            crv.setYear(v.getYear());
            crv.setPrice(v.getPrice());
            request.getSelectedVehicles().add(crv);
        });
        
        request.setAnonymityExpiresAt(LocalDateTime.now().plusMinutes(30));
        
        ContactRequest saved = contactRequestRepo.save(request);
        
        // Schedule email notification (30 min from now)
        emailScheduler.scheduleNotification(saved.getId());
        
        return ResponseEntity.status(201).body(new ApiResponse(true, "Thank you for your interest"));
    }
}
```

## Testing Strategy

### Frontend Testing (Jest + React Testing Library)

```typescript
// src/components/__tests__/ContactRequestForm.test.tsx
describe('ContactRequestForm', () => {
  it('displays validation errors on submit with empty form', async () => {
    render(<ContactRequestForm selectedVehicles={[]} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });
  
  it('submits valid form data to API', async () => {
    const mockSubmit = jest.fn();
    render(<ContactRequestForm selectedVehicles={mockVehicles} onSuccess={mockSubmit} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    // ... fill other fields
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.any(Number));
    });
  });
});
```

### Backend Testing (JUnit + Mockito)

```java
// backend/src/test/java/com/trex/services/ContactRequestValidationServiceTest.java
@SpringBootTest
public class ContactRequestValidationServiceTest {
    
    @InjectMocks
    private ContactRequestValidationService service;
    
    @Test
    public void testInvalidEmailValidation() {
        ContactRequestDTO dto = new ContactRequestDTO();
        dto.setEmail("invalid.email.com");
        
        List<ValidationError> errors = service.validate(dto);
        
        assertTrue(errors.stream()
            .anyMatch(e -> e.getField().equals("email")));
    }
    
    @Test
    public void testInvalidPhoneValidation() {
        ContactRequestDTO dto = new ContactRequestDTO();
        dto.setPhone("021 555 1234"); // Missing country code
        
        List<ValidationError> errors = service.validate(dto);
        
        assertTrue(errors.stream()
            .anyMatch(e -> e.getField().equals("phone")));
    }
}
```

### E2E Testing (Cypress)

```typescript
// cypress/e2e/multiVehicleSelection.cy.ts
describe('Multi-Vehicle Contact Request', () => {
  it('submits contact form with 2 vehicles', () => {
    // Select 2 vehicles
    cy.visit('/vehicles');
    cy.get('[data-testid="vehicle-card"]').first().click();
    cy.get('[data-testid="vehicle-card"]').eq(1).click();
    cy.get('button:contains("Continue")').click();
    
    // Fill contact form
    cy.get('[name="fullName"]').type('John Doe');
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="phone"]').type('+27 83 456 7890');
    cy.get('[name="province"]').select('Western Cape');
    cy.get('[name="city"]').select('Cape Town');
    cy.get('[name="preferredContactMethod"]').select('email');
    
    // Submit
    cy.get('button:contains("Submit")').click();
    
    // Verify success
    cy.contains('Thank you for your interest').should('be.visible');
  });
  
  it('displays validation errors on invalid email', () => {
    // ... navigate to form
    cy.get('[name="email"]').type('invalid.email');
    cy.get('button:contains("Submit")').click();
    
    cy.contains('Please enter a valid email address').should('be.visible');
  });
});
```

## Deployment Checklist

- [ ] Code review completed (frontend + backend)
- [ ] All tests passing (unit, integration, E2E)
- [ ] Database migration applied to staging
- [ ] Email notification scheduler tested
- [ ] Vehicle card component styling verified on mobile/tablet/desktop
- [ ] Validation error messages reviewed by QA
- [ ] Performance testing: form submit < 3 seconds
- [ ] Dealership anonymity logic verified (30-min delay)
- [ ] Security review: PII encryption, CORS, rate limiting
- [ ] Documentation updated (API docs, deployment guide)

## Support & Questions

| Topic | Resource |
|-------|----------|
| Data model details | See `data-model.md` |
| API contract | See `contracts/contact-request-submission.md` |
| UI/UX design | See spec.md acceptance scenarios |
| Implementation plan | See `plan.md` |
| Research findings | See `research.md` |
