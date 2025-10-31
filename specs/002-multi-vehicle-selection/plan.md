# Implementation Plan: Multi-Vehicle Selection Display & Contact Request Form

**Branch**: `002-multi-vehicle-selection` | **Date**: October 30, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-multi-vehicle-selection/spec.md`

**Status**: ✅ Ready for Phase 0 Research & Phase 1 Design

## Summary

**Primary Requirements**: Display all selected vehicles (2-4) on contact request review page with validation and Material Design compliance. Remove prepopulated mock data from form fields. Add comprehensive form validation (Name, Phone, Email, Province, City, Contact Method) with real-time error messages. Ensure responsive design across mobile, tablet, and desktop.

**Technical Approach**: 
- Frontend: Enhance React component in `microfrontends/buying-flow` to manage multi-vehicle state and form validation
- State Management: Persist selected vehicles through component lifecycle and form submission
- Validation: Client-side validation using industry-standard patterns, server-side verification via backend API
- Styling: Material Design tokens from `packages/shared-ui/src/theme/theme.ts`, responsive layout patterns
- Data Model: Vehicle array structure, contact request payload with all vehicles included
- API Integration: Backend validation and submission endpoint for multi-vehicle contact requests

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x (existing project stack)  
**Primary Dependencies**: React, Material-UI (MUI), React Hook Form (or similar), Axios for API calls  
**Storage**: Backend PostgreSQL (contact requests persisted on server, source of truth)  
**Testing**: Jest, React Testing Library, Cypress for E2E  
**Target Platform**: Web (responsive: iPhone 12+, iPad, desktop)
**Project Type**: Microfrontend (buying-flow) - web React component  
**Performance Goals**: Form validation feedback within 500ms, page load under 2 seconds, vehicle list scrolls smoothly with 4 vehicles  
**Constraints**: Must maintain Material Design compliance, must not break existing vehicle selection page, must support international phone formats (+27, +1, etc.)  
**Scale/Scope**: Single feature (contact request page enhancement), affects ~10-20 component files, ~2-3 day implementation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with T-Rex Constitution (`.specify/memory/constitution.md v1.2.0`):

- [x] **Theme-First Styling**: All new UI components reference `packages/shared-ui/src/theme/theme.ts`; Material Design tokens used throughout
- [x] **Dealership Anonymity**: Contact form submission does NOT reveal dealership information; backend manages 30-minute delay via scheduled job; email-only revelation
- [x] **Microfrontend Independence**: Buying-flow microfrontend remains independently deployable; vehicle data flows through shared types in shared-ui; no cross-microfrontend state sharing
- [x] **Backend-Driven Workflow**: Form validation on frontend is presentation only; backend API performs authoritative validation; state transitions controlled by backend
- [x] **pnpm Workspace Architecture**: Dependencies scoped to microfrontends/buying-flow/package.json; shared-ui components imported via workspace protocol
- [x] **API-First Development**: Contact request API contract defined in Phase 1; request/response schemas explicit before frontend implementation
- [x] **Security Requirements**: Backend validates all inputs; frontend prevents XSS with React escaping; PII (email, phone) handled securely in transit and at rest
- [x] **Deployment Standards**: Existing Dockerfile for buying-flow maintains multi-stage build; health checks already present

**Status**: ✅ All constitutional requirements addressable - NO VIOLATIONS

## Project Structure

### Documentation (this feature)

```text
specs/002-multi-vehicle-selection/
├── spec.md                           # Feature specification (complete)
├── plan.md                           # This file (implementation plan)
├── research.md                       # Phase 0 output (research findings)
├── data-model.md                     # Phase 1 output (entity models)
├── contracts/                        # Phase 1 output (API contracts)
│   ├── contact-request-api.md
│   └── vehicle-display-api.md
├── quickstart.md                     # Phase 1 output (setup guide)
├── checklists/
│   └── requirements.md               # Quality validation checklist
└── tasks.md                          # Phase 2 output (implementation tasks - TBD)
```

### Source Code (repository)

```text
microfrontends/buying-flow/
├── src/
│   ├── components/
│   │   ├── VehicleReviewList.tsx       # [NEW] Display all selected vehicles
│   │   ├── ContactRequestForm.tsx      # [MODIFY] Add validation, remove mock data
│   │   ├── FormField.tsx               # [NEW] Reusable form field with validation
│   │   ├── ValidationError.tsx         # [NEW] Error message display component
│   │   └── ... (existing components)
│   ├── steps/
│   │   ├── ContactRequestStep.tsx      # [MODIFY] Integrate multi-vehicle display
│   │   └── ... (existing steps)
│   ├── types/
│   │   ├── vehicle.ts                  # [NEW] Vehicle type definitions
│   │   ├── contactRequest.ts           # [NEW] Contact request type definitions
│   │   └── ... (existing types)
│   ├── services/
│   │   ├── contactRequestService.ts    # [NEW] API calls for form submission
│   │   ├── validationService.ts        # [NEW] Form validation logic
│   │   └── ... (existing services)
│   ├── hooks/
│   │   ├── useContactForm.ts           # [NEW] Custom hook for form state
│   │   ├── useVehicleSelection.ts      # [NEW] Custom hook for vehicle state
│   │   └── ... (existing hooks)
│   └── App.tsx                         # [MODIFY] Ensure multi-vehicle state flows
├── tests/
│   ├── unit/
│   │   ├── VehicleReviewList.test.tsx  # [NEW] Unit tests
│   │   ├── ContactRequestForm.test.tsx # [NEW] Unit tests
│   │   └── validationService.test.ts   # [NEW] Validation logic tests
│   ├── integration/
│   │   └── contactRequestFlow.test.tsx # [NEW] E2E-style integration tests
│   └── cypress/
│       └── e2e/
│           └── multiVehicleSelection.cy.ts # [NEW] E2E tests
└── package.json                        # [MODIFY] Add test dependencies if needed

packages/shared-ui/
├── src/
│   ├── components/
│   │   ├── ... (existing shared components)
│   └── theme/
│       └── theme.ts                    # [REFERENCE] Theme tokens used throughout

backend/ (workflowservice)
├── src/
│   ├── controllers/
│   │   └── ... (API endpoints for contact requests)
│   ├── services/
│   │   ├── contactRequestService.java # [MODIFY] Support multi-vehicle submission
│   │   ├── validationService.java      # [NEW/MODIFY] Validate contact data
│   │   └── dealershipService.java      # [REFERENCE] 30-min anonymity delay
│   └── models/
│       └── ContactRequest.java         # [MODIFY] Include vehicles array
```

**Structure Decision**: Microfrontend architecture with shared UI components. Contact request page enhancements isolated to `microfrontends/buying-flow` for independent deployment. Backend supports enhanced API contract for multi-vehicle submission. Validation shared between frontend (presentation) and backend (authority). Theme tokens referenced from `packages/shared-ui`.

## Complexity Tracking

> No constitutional violations. All requirements can be addressed within established patterns.

| Aspect | Status | Notes |
|--------|--------|-------|
| State Management | Simple | Vehicle array state in component state or context; no complex workflow needed |
| Validation | Standard | Industry-standard form validation; patterns exist in codebase |
| Backend Integration | Existing Pattern | Contact request API already exists; extend to accept vehicles array |
| Material Design | Established | Theme tokens available in shared-ui; component library mature |
| Testing | Standard | Jest + React Testing Library covers existing tests; add new test files |
| Performance | No Concerns | 4 vehicle cards + form fields well within browser rendering budgets |

---

## Phase 0: Research & Requirements Clarification

### Objective
Resolve any technical unknowns and validate design decisions with team.

### Research Tasks

| # | Task | Owner | Deliverable | Duration |
|---|------|-------|-------------|----------|
| 0.1 | Verify existing contact request API structure | Backend Lead | API schema documentation | 30 min |
| 0.2 | Confirm form validation library preference (React Hook Form vs Formik vs custom) | Frontend Lead | Decision document + rationale | 1 hour |
| 0.3 | Verify Material Design component library version and vehicle card component reusability | Frontend Lead | Component audit report | 1 hour |
| 0.4 | Confirm backend database schema for contact_requests (multi-vehicle support) | Database Lead | Schema documentation | 30 min |
| 0.5 | Validate mobile responsive breakpoints and testing devices | QA Lead | Device testing matrix | 1 hour |

### Output Files
- `research.md` - All findings documented with decisions and rationales
- `decision-record.md` - Key technical decisions made during research

---

## Phase 1: Design & Contracts

### Objective
Define data models, API contracts, and component architecture before implementation.

### Deliverables

#### 1.1 Data Model (`data-model.md`)
- **Vehicle Entity**: Make, Model, Year, Price, Location, Mileage, Transmission, Fuel, Color, Body Type, Image URL, Stock Number
- **ContactRequest Entity**: ID, User Info (Name, Phone, Email), Location (Province, City), Selected Vehicles Array, Contact Method, Comments, Timestamp, Status
- **ValidationError Entity**: Field Name, Error Message, Severity Level
- **Relationships**: ContactRequest → Vehicles (1:many), Vehicle ← multiple ContactRequests (cardinality tracked)

#### 1.2 API Contracts (`contracts/`)

**File: contact-request-submission.md**
```
POST /api/contact-requests
Request: {
  fullName: string (required, non-empty)
  phone: string (required, valid international format)
  email: string (required, valid email)
  province: string (required, from provinces dropdown)
  city: string (required, from cities dropdown based on province)
  preferredContactMethod: "email" | "phone" | "whatsapp" (required)
  additionalComments: string (optional, max 1000 chars)
  selectedVehicles: [
    {
      vehicleId: number (required)
      make: string
      model: string
      year: number
      price: number
    }
  ] (required, 1-4 vehicles)
}

Response: {
  success: boolean
  contactRequestId: number
  message: string
  errors?: [{ field: string, message: string }]
}

Error: 422 Unprocessable Entity - validation errors returned
```

**File: vehicle-list-display.md**
```
GET /api/vehicles/selected
Query: selectedVehicleIds: number[]

Response: {
  vehicles: [
    {
      vehicleId: number
      make: string
      model: string
      year: number
      price: number
      location: string (province/region)
      mileage: number
      transmission: "Automatic" | "Manual"
      fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid"
      color: string
      bodyType: string
      imageUrl: string
      stockNumber: string
      dealershipId: number (NOT revealed to user)
    }
  ]
}
```

**File: provinces-cities-dropdown.md**
```
GET /api/locations/provinces
Response: [{ id: number, name: string }]

GET /api/locations/provinces/:provinceId/cities
Response: [{ id: number, name: string }]
```

#### 1.3 Component Architecture (`quickstart.md`)

**Component Hierarchy:**
```
ContactRequestStep (container)
├── VehicleReviewSection
│   └── VehicleReviewList
│       └── VehicleCard (reused from selection page)
└── ContactRequestForm
    ├── FormSection: ContactInformation
    │   ├── FormField (Name)
    │   ├── FormField (Phone)
    │   └── FormField (Email)
    ├── FormSection: Location
    │   ├── FormField (Province dropdown)
    │   └── FormField (City dropdown - dependent)
    ├── FormSection: Preferences
    │   └── FormField (Contact Method dropdown)
    ├── FormSection: Comments
    │   └── FormField (Text area)
    └── SubmitButton
```

**State Management:**
```typescript
interface ContactRequestState {
  selectedVehicles: Vehicle[]
  formData: {
    fullName: string
    phone: string
    email: string
    province: string
    city: string
    preferredContactMethod: string
    additionalComments: string
  }
  errors: Record<string, string>
  isSubmitting: boolean
  submitError?: string
}
```

#### 1.4 Agent Context Update
- Run: `.specify/scripts/bash/update-agent-context.sh copilot`
- Adds: React Hook Form (if chosen), TypeScript validation patterns, API endpoint schemas, Material Design component patterns
- Preserves: Existing manual entries between markers

### Output Files
- `data-model.md` - Entity definitions and relationships
- `contracts/contact-request-submission.md` - Contact form API contract
- `contracts/vehicle-list-display.md` - Vehicle retrieval API contract
- `contracts/provinces-cities-dropdown.md` - Location dropdown API contracts
- `quickstart.md` - Component setup guide and local development instructions
- Updated agent context file with new tech stack entries

---

## Phase 1 Gate: Pre-Design Review

**Gate Criteria** (Must pass before proceeding to Phase 2):
- [ ] Data model reviewed and approved by backend team
- [ ] API contracts reviewed and approved by backend + frontend leads
- [ ] Component architecture reviewed for Material Design compliance
- [ ] Constitutional compliance re-verified post-design

**Sign-Off Required**: Tech Lead + Backend Lead

---

## Phase 2: Implementation Tasks (Generated by `/speckit.tasks`)

*This section will be populated by running `/speckit.tasks` after Phase 1 is complete.*

Expected output:
- `tasks.md` - Breakdown of 15-20 implementation tasks
- Estimated effort: 2-3 days for full team
- Task dependencies mapped (e.g., API contract → backend → frontend integration)
- Testing strategy per task (unit, integration, E2E)
- Success criteria for each task aligned with specification

---

## Summary & Next Steps

**Current Status**: ✅ Implementation plan ready for Phase 0 research

**Timeline Estimate:**
- Phase 0 (Research): 4-5 hours
- Phase 1 (Design): 6-8 hours
- Phase 1 Review Gate: 1-2 hours
- Phase 2 (Tasks generation): 1 hour
- Implementation (from tasks): 16-20 hours
- **Total**: ~30-36 hours for full feature

**Next Immediate Actions:**
1. Review and approve this plan
2. Run Phase 0 research tasks with team
3. Generate `research.md` with findings
4. Proceed to Phase 1 design
5. Execute `/speckit.tasks` command to break into implementation tasks

**Responsible Parties:**
- **Backend**: Contact request API schema, validation logic
- **Frontend**: Component design, form validation UX, responsive layout
- **QA**: Test strategy, E2E test cases
- **Tech Lead**: Gate approvals, architecture guidance
