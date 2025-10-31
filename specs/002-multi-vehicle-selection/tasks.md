# Tasks: Multi-Vehicle Selection Display & Contact Request Form

**Input**: Design documents from `/specs/002-multi-vehicle-selection/`  
**Status**: Phase 2 Task Breakdown - Ready for Implementation  
**Estimated Total Effort**: 30-36 hours (3-4 days with 2-person team)  
**MVP Scope**: Complete User Stories 1-4 (all P1 stories = minimum viable product)

**Constitutional Compliance**: All tasks adhere to T-Rex Constitution v1.2.1:
- ✅ Theme-First Styling: All UI tasks reference `packages/shared-ui/src/theme/theme.ts`
- ✅ Backend-Driven Validation: Backend validates all form inputs; frontend is presentation only
- ✅ API-First Contracts: API contract defined before implementation tasks
- ✅ Microfrontend Independence: Buying-flow microfrontend owns its state and components
- ✅ Dealership Anonymity: 30-minute buyer delay enforced via backend scheduled job (Task B08)

## Format Guide

- **[P]**: Parallelizable (different files, no blocking dependencies)
- **[US#]**: User story label (US1, US2, US3, US4)
- **Task ID**: Sequential order (T001, T002, T003...)
- File paths are exact locations for implementation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic project structure verification

**Duration**: ~2 hours | **Prerequisites**: None

- [x] T001 Verify pnpm workspace configuration in microfrontends/buying-flow/package.json includes React Hook Form, Zod, and Axios dependencies
- [x] T002 [P] Verify Material-UI version in packages/shared-ui/package.json is 7.3+ and includes FormControl, TextField, MenuItem components
- [x] T003 [P] Create TypeScript type definitions file at microfrontends/buying-flow/src/types/contactRequest.ts for ContactRequest, ValidationError, FormState interfaces
- [x] T004 [P] Create TypeScript type definitions file at microfrontends/buying-flow/src/types/vehicle.ts for Vehicle, SelectedVehicles interfaces
- [x] T005 Verify test setup: Jest configuration in microfrontends/buying-flow/jest.config.js includes React Testing Library presets

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and API integration that MUST be complete before user story implementation

**Duration**: ~6 hours | **Prerequisites**: Phase 1 complete | **BLOCKS**: All user stories

### Backend Setup (Parallel with Frontend)

- [x] T006 [P] Update backend ContactRequest entity in backend/src/main/java/com/trex/model/ContactRequest.java to add selectedVehicles collection (List<Vehicle>)
- [x] T007 [P] Create ContactRequestVehicle junction entity in backend/src/main/java/com/trex/model/ContactRequestVehicle.java to map contact requests to vehicles
- [x] T008 Update ContactRequestRepository at backend/src/main/java/com/trex/repository/ContactRequestRepository.java to support querying by vehicle IDs
- [x] T009 Create ContactRequestValidationService at backend/src/main/java/com/trex/service/ContactRequestValidationService.java with validation rules for: name (2-255 chars), email (RFC 5322), phone (E.164 international format), province (dropdown validation), city (dependent dropdown validation), vehicleIds (1-4 items, all valid UUIDs)
- [x] T010 [P] Update ContactRequestController at backend/src/main/java/com/trex/controller/ContactRequestController.java to accept vehicles array in POST /api/contact-requests endpoint, validate via ValidationService, return 422 with field errors on validation failure
- [x] T011 [P] Create database migration script at backend/db/migrations/V202510XX_add_contact_request_vehicles.sql to:
  - Create contact_request_vehicles junction table
  - Add anonymity_expires_at column to contact_requests table (timestamp for 30-min buyer delay)
  - Add email_sent_at column to track dealership notification timing
- [x] T012 Implement scheduled job for dealership notifications in backend/src/main/java/com/trex/scheduler/DealershipNotificationScheduler.java to send immediate email to dealership upon contact request creation (t=0)
- [x] T013 [P] Implement scheduled job for buyer confirmations in backend/src/main/java/com/trex/scheduler/BuyerConfirmationScheduler.java to send email to buyer at t=30min with confirmation message (no dealership info revealed)

### Frontend Setup (Parallel with Backend)

- [ ] T014 [P] Create validation service at microfrontends/buying-flow/src/services/validationService.ts with Zod schema validators for:
  - fullName: string.min(2).max(255).regex(/^[a-zA-Z\s'-]+$/)
  - email: string.email()
  - phone: international format validation (supports +27, +1, etc.)
  - province: string enum (must match backend dropdown values)
  - city: string enum (dependent on selected province)
  - preferredContactMethod: enum("email", "phone", "whatsapp")
  - additionalComments: string.max(1000)
  - selectedVehicles: array.min(1).max(4)
- [ ] T015 [P] Create API client service at microfrontends/buying-flow/src/services/contactRequestService.ts with:
  - submitContactRequest(data: ContactRequestPayload): Promise<{id, status, nextStep}> → calls POST /api/contact-requests
  - Handles 422 validation errors from backend and surfaces field-level errors
  - Includes retry logic for network failures
- [ ] T016 [P] Create location service at microfrontends/buying-flow/src/services/locationService.ts with:
  - getProvinces(): Promise<{id, name}[]> → calls GET /api/locations/provinces
  - getCities(provinceId): Promise<{id, name}[]> → calls GET /api/locations/provinces/:provinceId/cities
  - Caches province/city data to reduce API calls
- [ ] T017 Create custom hook at microfrontends/buying-flow/src/hooks/useContactForm.ts for form state management:
  - Wraps react-hook-form for form control, watch, handleSubmit
  - Integrates with validationService for real-time validation
  - Manages submission state (isSubmitting, submitError)
  - Clears errors on field change (UX: immediate feedback on correction)
- [ ] T018 [P] Create custom hook at microfrontends/buying-flow/src/hooks/useVehicleSelection.ts for vehicle state:
  - Manages selectedVehicles array
  - Provides addVehicle(vehicle), removeVehicle(vehicleId), clearAll() methods
  - Persists to localStorage for form refresh resilience
- [x] T019 [P] Create custom hook at microfrontends/buying-flow/src/hooks/useLocations.ts for dropdown data:
  - Loads provinces on mount
  - Loads cities when province selection changes
  - Manages loading/error states for dropdown population

**Checkpoint**: Foundation complete - all user stories can now proceed in parallel

---

## Phase 3: User Story 1 - Multi-Vehicle Display on Review Page (Priority: P1) 🎯 MVP

**Goal**: Users who select 2-4 vehicles see ALL selected vehicles on the review page (not just one)

**Independent Test**: Select 3 vehicles on selection page → navigate to review page → verify all 3 vehicles appear with complete details

**Duration**: ~4 hours | **Effort**: Easy | **Prerequisites**: Phase 2 complete

### Implementation for User Story 1

- [x] T020 [P] Create VehicleCard component at microfrontends/buying-flow/src/components/VehicleCard.tsx:
  - Reuses component from vehicle selection page (check if already exists in shared-ui)
  - Displays: make, model, year, price, mileage, transmission, fuel type, color, body type, image
  - Material Design styling with 8px spacing grid
  - Responsive: stacks vertically on mobile, grid layout on desktop
- [x] T021 [P] Create VehicleReviewList component at microfrontends/buying-flow/src/components/VehicleReviewList.tsx:
  - Maps selectedVehicles array to render individual VehicleCard components
  - Handles empty state: "No vehicles selected"
  - Handles max state: "You have selected 4 vehicles (maximum)"
  - Scrollable container for 4+ vehicles with smooth scrolling
  - Includes "Back to Selection" link to modify vehicle selection
- [x] T022 Update ContactRequestStep component at microfrontends/buying-flow/src/steps/ContactRequestStep.tsx to:
  - Import and render VehicleReviewList above contact form
  - Pass selectedVehicles from state to VehicleReviewList
  - Ensure vehicles display before form (visual hierarchy)
- [ ] T023 [P] Add unit tests for VehicleReviewList at microfrontends/buying-flow/src/components/VehicleReviewList.test.tsx:
  - Test: Renders all 3 vehicles when selectedVehicles array has 3 items
  - Test: Shows "No vehicles selected" when array is empty
  - Test: Each vehicle card displays correct make, model, year, price
  - Test: Responsive layout changes on mobile viewport
- [ ] T024 [P] Add unit tests for VehicleCard at microfrontends/buying-flow/src/components/VehicleCard.test.tsx:
  - Test: Renders all vehicle properties
  - Test: Image displays correctly
  - Test: Click handler triggers navigation (mock)

**Checkpoint**: User Story 1 complete - Users can see all selected vehicles on review page

---

## Phase 4: User Story 2 - Remove Mock/Prepopulated Data (Priority: P1) 🎯 MVP

**Goal**: Contact request form has zero prepopulated mock data - all fields are empty on page load

**Independent Test**: Navigate to contact request page → verify all form fields are empty with only placeholder text visible

**Duration**: ~3 hours | **Effort**: Easy | **Prerequisites**: Phase 2, Phase 3 complete

### Implementation for User Story 2

- [x] T025 Create FormField component at microfrontends/buying-flow/src/components/FormField.tsx:
  - Reusable Material-UI TextField wrapper for consistent styling
  - Props: label, name, type, placeholder, error, helperText, required, disabled
  - Integrates with react-hook-form via {...register(name)} pattern
  - Uses theme tokens from packages/shared-ui/src/theme/theme.ts for colors, spacing, typography
  - Displays validation error text in red below field (if error exists)
- [x] T026 Update ContactRequestForm component at microfrontends/buying-flow/src/components/ContactRequestForm.tsx to:
  - REMOVE all prepopulated mock data from form initialization (e.g., hardcoded "Sarah Johnson", "sarah@example.com")
  - Initialize form fields as empty strings: fullName: '', email: '', phone: '', etc.
  - Remove any defaultValue props that contain mock data
  - Verify Form Data section has zero prepopulated values
  - Use FormField component for all text inputs
- [x] T027 [P] Create LocationFieldsSection component at microfrontends/buying-flow/src/components/LocationFieldsSection.tsx:
  - Renders Province dropdown and City dropdown
  - Province dropdown: populated from getProvinces() API call (via useLocations hook)
  - City dropdown: disabled until province selected, populated from getCities(provinceId) API call
  - Both start with placeholder "Select an option"
  - Material Design styling with 8px spacing
- [x] T028 Update App.tsx or appropriate parent at microfrontends/buying-flow/src/App.tsx to:
  - Ensure contact form state is initialized fresh on page load (no persisted form data)
  - Verify selectedVehicles from vehicle selection page persist correctly
  - Ensure form submission clears after successful submission
- [ ] T029 [P] Add unit tests for FormField at microfrontends/buying-flow/src/components/FormField.test.tsx:
  - Test: Renders with empty value by default
  - Test: Displays error message when error prop provided
  - Test: Handles onChange and updates value correctly
  - Test: Theme colors applied from shared-ui theme
- [ ] T030 [P] Add unit tests for ContactRequestForm at microfrontends/buying-flow/src/components/ContactRequestForm.test.tsx:
  - Test: All form fields are empty on mount (no mock data)
  - Test: fullName field has value: ''
  - Test: email field has value: ''
  - Test: phone field has value: ''
  - Test: province dropdown shows "Select an option" placeholder
  - Test: city dropdown is disabled until province selected
- [ ] T031 Add integration test at microfrontends/buying-flow/src/__tests__/integration/mockDataRemoval.test.tsx:
  - Navigate to ContactRequestStep
  - Assert all form fields are empty
  - Assert no hardcoded values appear anywhere
  - Simulates user entering data and form retaining clean state

**Checkpoint**: User Story 2 complete - Form has zero mock data, all fields empty on load

---

## Phase 5: User Story 3 - Form Field Validation (Priority: P1) 🎯 MVP

**Goal**: Contact request form validates all inputs before submission with clear error messages

**Independent Test**: Enter invalid data (bad email, short name, missing required fields) → attempt submit → verify validation errors appear for each invalid field

**Duration**: ~6 hours | **Effort**: Medium | **Prerequisites**: Phase 2, Phase 4 complete

### Implementation for User Story 3

- [x] T032 Create ValidationError component at microfrontends/buying-flow/src/components/ValidationError.tsx:
  - Displays single field error message in Material Design error box
  - Red color (#d32f2f or theme.error), small font size, positioned below field
  - Props: fieldName, message, showIcon
  - Icon: ⚠️ or error icon from Material-UI
  - Smooth fade-in animation on appearance
- [x] T033 Update ContactRequestForm to integrate react-hook-form:
  - import { useForm } from "react-hook-form"
  - const { register, handleSubmit, watch, formState: { errors }, control } = useForm()
  - Connect register() to all FormField components
  - Pass errors object to FormField → displays ValidationError
  - Implement onSubmit handler that validates via schema
- [x] T034 [P] Implement real-time validation feedback in ContactRequestForm:
  - Set react-hook-form mode: "onChange" (validate on every keystroke)
  - Validation errors appear within 500ms of user input (measure in browser devtools)
  - Error clears immediately when user corrects field (good UX)
  - Required fields show "*" indicator in label
- [x] T035 [P] Update submitContactRequest handler at microfrontends/buying-flow/src/components/ContactRequestForm.tsx to:
  - Call validation schema validators via validationService
  - ONLY submit if all validations pass
  - On backend 422 validation error: map error response fields to form errors
  - Display backend error messages in UI for each field
  - Show generic toast/alert for backend submission failures (network errors, 500 errors)
- [x] T036 [P] Add validation error handling for each field type in validationService:
  - fullName error: "Full name must be 2-255 characters and contain only letters, spaces, hyphens, or apostrophes"
  - email error: "Please enter a valid email address (e.g., name@example.com)"
  - phone error: "Phone must include country code (e.g., +27 83 456 7890 for South Africa)"
  - province error: "Please select a province from the list"
  - city error: "Please select a city from the list for your province"
  - preferredContactMethod error: "Please select how you'd like to be contacted"
  - selectedVehicles error: "Please select at least 1 vehicle and no more than 4"
- [x] T037 Implement dependent dropdown validation in LocationFieldsSection:
  - City dropdown only validates if Province is selected first
  - Show helper text: "Select a province first" when city field clicked without province
  - Clear city selection when province changes (reset dependent field)
- [ ] T038 [P] Add unit tests for ValidationError component at microfrontends/buying-flow/src/components/ValidationError.test.tsx:
  - Test: Renders error message when message prop provided
  - Test: Shows icon when showIcon=true
  - Test: Hides when message prop is empty
- [ ] T039 [P] Add unit tests for validation service at microfrontends/buying-flow/src/services/validationService.test.ts:
  - Test: validateName('J') → error "must be 2+ characters"
  - Test: validateName('John Smith') → no error
  - Test: validateEmail('invalid') → error "valid email"
  - Test: validateEmail('test@example.com') → no error
  - Test: validatePhone('1234567') → error "country code required"
  - Test: validatePhone('+27 83 456 7890') → no error
  - Test: validatePhone('+1 555 123 4567') → no error (different country)
  - Test: validateVehicles([]) → error "at least 1 vehicle"
  - Test: validateVehicles([v1, v2, v3, v4, v5]) → error "no more than 4"
  - Test: submitPayloadValid({...all valid data...}) → no errors
  - Test: submitPayloadValid({fullName: '', ...}) → has errors
- [ ] T040 [P] Add form submission error handling tests at microfrontends/buying-flow/src/components/ContactRequestForm.test.tsx:
  - Test: Form submission prevented when required field empty
  - Test: Error message displays after submit attempt on invalid field
  - Test: Multiple errors display simultaneously
  - Test: Form clears errors when user corrects field (onChange validation)
- [ ] T041 Add E2E test for full validation flow at microfrontends/buying-flow/cypress/e2e/formValidation.cy.ts:
  - Visit contact request page
  - Click submit button without filling form
  - Assert error messages appear for: name, email, phone, province, city, contact method
  - Enter invalid email, assert validation error
  - Enter short name ('J'), assert name validation error
  - Enter valid phone without country code, assert error
  - Correct phone to valid format, assert error clears
  - Fill all fields with valid data
  - Click submit
  - Assert no validation errors
  - Assert success message appears

**Checkpoint**: User Story 3 complete - Form validates all inputs with clear error feedback

---

## Phase 6: User Story 4 - Clean Contact Request Layout (Priority: P1) 🎯 MVP

**Goal**: Contact request page maintains Material Design aesthetic with clean, professional layout

**Independent Test**: View page on desktop, tablet, mobile → verify all sections visually aligned, spacing consistent, professional appearance maintained

**Duration**: ~5 hours | **Effort**: Medium | **Prerequisites**: Phase 2, Phase 5 complete

### Implementation for User Story 4

- [x] T042 Create ContactRequestPage layout container at microfrontends/buying-flow/src/pages/ContactRequestPage.tsx:
  - Two-column layout on desktop: VehicleReviewList (left, 40%) + ContactRequestForm (right, 60%)
  - Single-column stacked layout on mobile/tablet: VehicleReviewList (top) → ContactRequestForm (bottom)
  - Breakpoints: xs(0-600px) = stacked, sm(600-960px) = stacked, md(960px+) = two-column
  - Max width container: 1200px centered on page
  - Material Design spacing: 24px padding on desktop, 16px on tablet, 8px on mobile
- [x] T043 [P] Style VehicleReviewList section with Material Design:
  - Section background: theme.palette.background.paper (light background)
  - Title: "Vehicle Summary" in theme.typography.h6 (Material Design heading 6)
  - Border: 1px solid theme.palette.divider (light grey border)
  - Padding: 16px (Material Design 4px grid = 4 units)
  - Border radius: 4px (Material Design standard)
  - Each vehicle card: 12px margin between cards (1.5 grid units)
  - Scrollable container: max-height 400px with smooth scrolling
- [x] T044 [P] Style ContactRequestForm section with Material Design:
  - Section title: "Your Contact Information" in theme.typography.h6
  - Background: white or theme.palette.background.default
  - Padding: 24px
  - Border radius: 4px
  - All form fields use theme.spacing (8px units) for margins
  - Section dividers between Contact Info → Location → Preferences → Comments
  - Submit button: Material Design button with theme.palette.primary color, 44px min-height for touch targets
- [x] T045 [P] Implement responsive grid layout using CSS Grid:
  - Desktop: CSS Grid with 2 columns, Vehicle section = 40%, Form = 60%
  - Tablet: CSS Grid with 1 column, Vehicle section = full width, Form = full width (stacked)
  - Mobile: CSS Grid with 1 column, both sections = full width (stacked)
  - Use gridTemplateColumns responsive breakpoints
- [x] T046 [P] Apply Material Design spacing to all components:
  - Component margins: theme.spacing(2) between major sections (16px)
  - Input field spacing: theme.spacing(1.5) between fields (12px) within nested Stack
  - Button spacing: theme.spacing(3) from surrounding elements (24px)
  - Consistent left/right padding: theme.spacing(3) (24px)
  - Verify spacing uses only multiples of 4px (Material Design 4px grid)
- [x] T047 [P] Apply Material Design typography throughout:
  - Page title: theme.typography.h5 (Material Design Headline 5)
  - Section titles: theme.typography.h6 (Material Design Headline 6)
  - Form labels: theme.typography.subtitle1 or subtitle2 (Material Design subtitles)
  - Helper text: theme.typography.caption (Material Design caption)
  - Body text: theme.typography.body2 (Material Design body 2)
  - Ensure font sizes, weights, line heights match theme.json exactly
- [x] T048 [P] Apply Material Design colors:
  - Primary sections: theme.palette.primary.main (app brand color)
  - Borders: theme.palette.divider (light grey)
  - Backgrounds: theme.palette.background.paper or background.default
  - Error text: theme.palette.error.main (red for validation errors)
  - Success text: theme.palette.success.main (green for success messages)
  - Text: theme.palette.text.primary (dark grey) for body text
  - Disabled: theme.palette.action.disabled (very light grey) for disabled fields
- [x] T049 [P] Ensure vehicle cards match selection page design:
  - Import VehicleCard from existing selection page component
  - Verify same styling is applied (shadows, corners, spacing)
  - Verify no design divergence between selection page and review page vehicle cards
  - Document if changes needed to VehicleCard for consistency
- [x] T050 [P] Add loading and error states:
  - Loading state: Skeleton screens or spinners while API calls in progress
  - Error state: Error alert box with retry button for failed API calls
  - Success state: Success toast/alert after form submission
  - All use Material Design Alert or Snackbar components
- [x] T051 [P] Implement responsive image scaling:
  - Vehicle images: max-width 100%, height auto (responsive)
  - No image squishing or stretching
  - Aspect ratio maintained (4:3 or 16:10)
  - Placeholder image shown while loading
- [ ] T052 Add unit tests for responsive layout at microfrontends/buying-flow/src/pages/ContactRequestPage.test.tsx:
  - Test: Two-column layout renders on desktop (md+ breakpoint)
  - Test: Stacked layout renders on mobile (xs breakpoint)
  - Test: Vehicle section = 40% width on desktop
  - Test: Form section = 60% width on desktop
  - Test: Both sections = 100% width on mobile (stacked)
  - Test: Material Design spacing applied (theme.spacing)
  - Test: All typography uses theme tokens
  - Test: All colors use theme.palette
- [ ] T053 [P] Add visual regression tests using Percy or similar:
  - Snapshot desktop layout at 1280px width
  - Snapshot tablet layout at 768px width
  - Snapshot mobile layout at 375px width
  - Compare snapshots to approved designs
  - Flag any visual divergence
- [ ] T054 Add E2E layout validation at microfrontends/buying-flow/cypress/e2e/layoutDesign.cy.ts:
  - Visit contact request page
  - Assert vehicle section visible above form on mobile
  - Assert vehicle section visible to left of form on desktop
  - Assert no horizontal scroll needed on mobile (all content fits)
  - Assert all Material Design spacing rules followed (measure in Cypress)
  - Assert all text readable (contrast ratio > 4.5:1 for accessibility)
  - Assert form fields align vertically (no misalignment)
  - Assert responsive breakpoints work (test at 375px, 768px, 1280px widths)

**Checkpoint**: User Story 4 complete - Page has clean, professional Material Design layout

---

## Phase 7: Integration & Multi-Vehicle Submission

**Purpose**: Ensure all 4 user stories work together seamlessly for end-to-end workflow

**Duration**: ~4 hours | **Effort**: Medium | **Prerequisites**: Phase 3-6 complete

- [ ] T055 Add E2E test for complete multi-vehicle workflow at microfrontends/buying-flow/cypress/e2e/multiVehicleWorkflow.cy.ts:
  - Step 1: Navigate to vehicle selection page
  - Step 2: Select 3 vehicles
  - Step 3: Click "Continue to Contact Request"
  - Step 4: Assert review page shows all 3 vehicles (US1 verification)
  - Step 5: Assert form fields are empty (US2 verification)
  - Step 6: Attempt submit with empty form
  - Step 7: Assert validation errors appear (US3 verification)
  - Step 8: Assert layout is clean and professional (US4 verification)
  - Step 9: Fill form with valid data
  - Step 10: Click submit
  - Step 11: Assert API call includes all 3 vehicles in selectedVehicles array
  - Step 12: Assert success message appears
  - Step 13: Navigate back to selection page, verify vehicles still selected
- [ ] T056 [P] Verify multi-vehicle data flows through API contract:
  - Backend receives POST /api/contact-requests with selectedVehicles array
  - Backend validates each vehicle exists and user has access
  - Backend returns 422 if any vehicle invalid
  - Backend persists all vehicles to contact_request_vehicles junction table
  - Backend sends immediate dealership notification with all vehicles
  - Backend schedules buyer confirmation email for t=30min
- [ ] T057 [P] Test edge cases for multi-vehicle scenario:
  - Test: Submit with 1 vehicle → success
  - Test: Submit with 2 vehicles → success
  - Test: Submit with 3 vehicles → success
  - Test: Submit with 4 vehicles → success
  - Test: Submit with 5 vehicles → error "maximum 4 vehicles"
  - Test: Submit with 0 vehicles → error "at least 1 vehicle"
  - Test: Submit with invalid vehicleId → error "vehicle not found" or "vehicle unavailable"
  - Test: Submit form then navigate back and re-submit → new contact request created (not duplicate)

**Checkpoint**: All user stories integrate and work together - Ready for MVP validation

---

## Phase 8: Backend Notification System

**Purpose**: Implement dealership and buyer notification system per Constitution v1.2.1

**Duration**: ~3 hours | **Effort**: Medium | **Prerequisites**: Phase 2 Backend Setup complete

- [ ] T058 Verify dealership notification implementation in backend/src/main/java/com/trex/scheduler/DealershipNotificationScheduler.java:
  - On ContactRequest creation (t=0, immediately):
    - Query dealership email for each vehicle in selectedVehicles
    - Send email to dealership with subject: "New Lead: [Make Model Year] - [Buyer Name]"
    - Email contains: buyer full name, phone, email, province, city, preferred contact method, vehicle details (make, model, year, price), timestamp
    - Log successful send with timestamp
    - Handle email failures gracefully (log error, don't crash service)
- [ ] T059 Verify buyer confirmation notification in backend/src/main/java/com/trex/scheduler/BuyerConfirmationScheduler.java:
  - Scheduled to run at contactRequest.anonymityExpiresAt (t=30min):
    - Query contactRequest by ID
    - Send email to buyer with subject: "Your Vehicle Request Received"
    - Email contains: confirmation message, selected vehicle count and details, next steps (dealership will contact you)
    - Email DOES NOT contain dealership information (anonymity protected)
    - Log successful send
    - Mark contact_requests.email_sent_at = now
- [ ] T060 [P] Test notification timing in integration environment:
  - Create ContactRequest via API at t=0
  - Assert dealership email sent immediately (within 1 second)
  - Wait 30 minutes (or adjust test to use shorter delay)
  - Assert buyer email sent at t=30min
  - Verify buyer email does NOT contain dealership info
  - Verify dealership email DOES contain buyer info
- [ ] T061 Test notification failure handling:
  - Invalid dealership email → logged error, service continues
  - SMTP connection failure → retry with exponential backoff
  - Email content validation → no null/undefined fields in template

**Checkpoint**: Notification system fully operational per business requirements

---

## Phase 9: Performance & Optimization

**Purpose**: Ensure responsive UI, fast API calls, and smooth user experience

**Duration**: ~2 hours | **Effort**: Easy | **Prerequisites**: Phase 3-7 complete

- [ ] T062 [P] Optimize form validation performance:
  - Debounce onChange validation by 300ms (reduce excessive re-renders)
  - Memoize validation functions to prevent recreations
  - Cache locationService API responses (provinces, cities)
  - Measure validation feedback time: < 500ms from keypress to error display
- [ ] T063 [P] Optimize component rendering:
  - Use React.memo for VehicleCard to prevent unnecessary re-renders when vehicles unchanged
  - Use useMemo for selectedVehicles array to prevent recalculations
  - Use useCallback for form submission handler
  - Measure: Component re-render count in React DevTools (should be minimal)
- [ ] T064 [P] Optimize API calls:
  - Debounce city dropdown API call when province changes (300ms delay)
  - Cancel pending requests if user changes province again (prevent race conditions)
  - Cache API responses for provinces (load once on mount)
  - Batch API calls if possible (e.g., load all cities for all provinces on startup)
- [ ] T065 [P] Verify page load performance:
  - Lighthouse performance score > 80 (run via Chrome DevTools)
  - First Contentful Paint < 2 seconds
  - Time to Interactive < 3 seconds
  - Largest Contentful Paint < 2.5 seconds
  - Cumulative Layout Shift < 0.1 (no page jank)
- [ ] T066 Add performance tests at microfrontends/buying-flow/cypress/e2e/performance.cy.ts:
  - Load contact request page
  - Measure page load time (should be < 2 seconds)
  - Fill form with 3 vehicles selected
  - Measure time from keystroke to validation error (should be < 500ms)
  - Submit form
  - Measure time from submit click to success message (should be < 2 seconds including API call)

**Checkpoint**: Performance meets or exceeds targets

---

## Phase 10: Testing & Quality Assurance

**Purpose**: Comprehensive test coverage for reliability and confidence

**Duration**: ~4 hours | **Effort**: Medium | **Prerequisites**: Phase 3-8 complete

- [ ] T067 [P] Add accessibility tests:
  - All form labels have for= attributes pointing to input IDs
  - All form inputs have proper labels (not just placeholders)
  - Color contrast ratio > 4.5:1 for all text
  - Keyboard navigation works (Tab through all form fields)
  - Screen reader compatibility (test with NVDA or JAWS)
  - Focus indicators visible on all interactive elements
- [ ] T068 [P] Cross-browser testing:
  - Test on Chrome (desktop + mobile)
  - Test on Firefox (desktop + mobile)
  - Test on Safari (desktop + mobile)
  - Test on Edge (desktop)
  - Verify layout responsive on all browsers
  - Verify form validation works consistently
- [ ] T069 [P] Cross-device testing:
  - iPhone 12 (375px width)
  - iPhone 12 Pro Max (430px width)
  - iPad Air (820px width)
  - iPad Pro (1024px width)
  - Desktop 1280px width
  - Desktop 1920px width
  - Verify layout adapts correctly on all devices
  - Verify no horizontal scroll needed
- [ ] T070 Add integration test for form flow at microfrontends/buying-flow/src/__tests__/integration/contactRequestFlow.test.tsx:
  - User selects vehicles, proceeds to contact request
  - Verify all vehicles present
  - Verify form empty
  - User fills form
  - Form validates in real-time
  - User corrects errors
  - Form validates
  - User submits
  - API receives all vehicles + contact data
  - Backend returns success
  - UI shows success message
- [ ] T071 [P] Run linting and formatting checks:
  - ESLint on all new .tsx, .ts files (0 errors, 0 warnings)
  - Prettier formatting consistent
  - TypeScript strict mode type checking (0 errors)
  - Test coverage > 80% for critical components
- [ ] T072 [P] Load testing:
  - Simulate 10+ concurrent users submitting forms
  - Verify backend handles concurrent requests
  - Verify no data loss or corruption
  - Measure API response times under load (should be < 2 seconds)

**Checkpoint**: Quality assurance complete - ready for production

---

## Phase 11: Documentation & Deployment

**Purpose**: Document implementation and prepare for production deployment

**Duration**: ~2 hours | **Effort**: Easy | **Prerequisites**: Phase 10 complete

- [ ] T073 [P] Update quickstart.md with implementation notes:
  - Document any deviations from design
  - Document setup instructions for local development
  - Document testing instructions for developers
  - Document deployment process
- [ ] T074 [P] Update README.md for buying-flow microfrontend:
  - Add multi-vehicle selection feature to feature list
  - Add screenshots of new feature
  - Add setup instructions for new dependencies (React Hook Form, Zod, etc.)
- [ ] T075 Create deployment checklist in docs/:
  - Database migration: contact_request_vehicles table
  - Database migration: anonymity_expires_at, email_sent_at columns
  - Backend: Deploy workflowservice with new ContactRequest validation
  - Backend: Verify DealershipNotificationScheduler running
  - Backend: Verify BuyerConfirmationScheduler running
  - Frontend: Deploy buying-flow with new components
  - Smoke test: Create contact request with 3 vehicles
  - Smoke test: Verify dealership email sent immediately
  - Smoke test: Verify buyer email sent after 30 minutes (or test delay)
  - Smoke test: Verify dealership info not visible to buyer until 30 min passed
- [ ] T076 [P] Add feature flag for gradual rollout (optional):
  - Implement feature flag: MULTI_VEHICLE_CONTACT_ENABLED
  - If false: Show single-vehicle form (legacy behavior)
  - If true: Show multi-vehicle form (new behavior)
  - Gradual rollout: Enable for 10% → 25% → 50% → 100% of users
  - Monitor error rates and user satisfaction at each rollout stage
- [ ] T077 [P] Create monitoring and alerting:
  - Alert if dealership email fails to send
  - Alert if buyer email fails to send after 30 min
  - Alert if API response time > 2 seconds
  - Alert if form validation errors spike (possible UX problem)
  - Dashboard: Contact requests submitted per day
  - Dashboard: Success rate per dealership
  - Dashboard: Average form completion time

**Checkpoint**: Ready for production deployment

---

## Summary & Execution Guide

### Task Count by User Story

- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 19 tasks (Backend: 8, Frontend: 11)
- **Phase 3 (US1 - Multi-Vehicle Display)**: 4 tasks + 2 test tasks = 6 tasks
- **Phase 4 (US2 - Remove Mock Data)**: 8 tasks + 3 test tasks = 11 tasks
- **Phase 5 (US3 - Form Validation)**: 13 tasks + 3 test tasks = 16 tasks
- **Phase 6 (US4 - Clean Layout)**: 13 tasks + 3 test tasks = 16 tasks
- **Phase 7 (Integration)**: 4 tasks
- **Phase 8 (Notifications)**: 5 tasks
- **Phase 9 (Performance)**: 5 tasks
- **Phase 10 (Testing)**: 6 tasks
- **Phase 11 (Documentation)**: 5 tasks

**Total: 96 concrete, actionable implementation tasks**

### Effort Breakdown

| Phase | Tasks | Hours | Resource |
|-------|-------|-------|----------|
| 1: Setup | 5 | 2 | Frontend Lead |
| 2: Foundational | 19 | 6 | Backend (3h) + Frontend (3h) parallel |
| 3: US1 | 6 | 4 | Frontend Lead |
| 4: US2 | 11 | 3 | Frontend Lead |
| 5: US3 | 16 | 6 | Frontend Lead |
| 6: US4 | 16 | 5 | Frontend Lead (design-heavy) |
| 7: Integration | 4 | 4 | QA Lead (E2E testing) |
| 8: Notifications | 5 | 3 | Backend Lead |
| 9: Performance | 5 | 2 | Frontend + Backend (parallel) |
| 10: Testing | 6 | 4 | QA Lead + Frontend |
| 11: Documentation | 5 | 2 | Tech Lead |
| **TOTAL** | **96** | **36** | **2-3 people** |

### MVP Scope (Minimum Viable Product)

To ship the quickest MVP that delivers value:

**Phases to Complete**: 1, 2, 3, 4, 5, 6 (all user stories P1)
**Estimated Time**: ~28 hours (3-4 days with 2 developers)
**Result**: Users can select multiple vehicles, form has no mock data, validation works, layout is professional

**Not in MVP** (Phase 2 / 2 weeks after MVP):
- Performance optimizations (Phase 9)
- Feature flags / gradual rollout (Phase 11)
- Advanced monitoring (Phase 11)

### Execution Strategy

**Option 1: Sequential (1 person, 4 weeks)**
1. Phase 1: Setup (2 hours)
2. Phase 2: Foundational (6 hours)
3. Phase 3: US1 (4 hours)
4. Phase 4: US2 (3 hours)
5. Phase 5: US3 (6 hours)
6. Phase 6: US4 (5 hours)
7. Then: Integration, Notifications, Performance, Testing, Docs

**Option 2: Parallel (2 people, 2-3 weeks)**

- **Person A (Frontend Lead)**:
  - Phase 1: Setup (2h)
  - Phases 3-6: All frontend components (18h)
  - Total: ~20 hours

- **Person B (Backend Lead)**:
  - Phase 1: Coordinate setup (0.5h)
  - Phase 2: Backend setup (8h)
  - Phase 8: Notifications (3h)
  - Total: ~11.5 hours

- **Together**:
  - Phase 2: Frontend setup (3h) - can start after backend prep
  - Phase 7: Integration testing (4h)
  - Phase 9-11: Optimization & Documentation (6h)

**Recommended**: Option 2 (Parallel) = 2-3 weeks vs 4 weeks

### Key Dependencies

```
Phase 1: Setup
  ↓
Phase 2: Foundational (BLOCKS all stories)
  ↓
Phase 3-6: User Stories (can run in parallel per user story)
  ↓
Phase 7: Integration
  ↓
Phase 8-11: Polish & Monitoring
```

### Parallel Opportunities Within Phases

**Phase 2 (Foundational)**:
- Backend: T006-T013 (8 tasks) - mostly parallel (database, entities, services)
- Frontend: T014-T019 (6 tasks) - parallel (different services/hooks)
- Can run backend and frontend setup in parallel (different tech stacks)

**Phase 3-6 (User Stories)**:
- Each user story can be worked by different developer
- Within each story: Tests [P] can run in parallel, components [P] can run in parallel
- All 4 user stories can proceed in parallel (4 developers ideal, but 2 min)

### Parallelization Example (2-person team)

**Day 1-2**:
- Person A: Phases 1-2 Frontend tasks (T001-T005, T014-T019)
- Person B: Phase 2 Backend tasks (T006-T013) parallel
- Then: Both review & merge

**Day 3-5**:
- Person A: Phases 3-4 (Multi-vehicle display + mock data removal)
- Person B: Phase 8 (Notification system)

**Day 6-7**:
- Person A: Phase 5-6 (Validation + Layout) / Person B: Review & testing
- QA: Phase 7 (Integration tests)

**Day 8**:
- Performance & documentation (Phase 9-11)
- Code review & polish

---

## Dependencies Validation

### Task Dependencies (Critical Path)

```
T001 → T002-T005 (Setup phase)
  ↓ (both must complete)
T006-T013 → T014-T019 (Foundational split: backend + frontend)
  ↓ (CRITICAL GATE: foundation ready)
T020-T024 (Phase 3: US1)
T025-T031 (Phase 4: US2) - can overlap with Phase 3
T032-T041 (Phase 5: US3) - can overlap with Phases 3-4
T042-T054 (Phase 6: US4) - can overlap with Phases 3-5
  ↓ (all stories complete)
T055-T057 (Phase 7: Integration)
T058-T061 (Phase 8: Notifications)
T062-T066 (Phase 9: Performance)
T067-T072 (Phase 10: Testing)
T073-T077 (Phase 11: Documentation)
```

### Inter-task Dependencies (Within Phases)

- T020 VehicleCard: requires T005 types complete
- T021 VehicleReviewList: requires T020 complete (uses VehicleCard)
- T022 ContactRequestStep: requires T021 complete
- T026 ContactRequestForm: requires T014-T019 services complete + T004 types
- T033 Form react-hook-form integration: requires T014 validation service
- T042 Layout container: requires T043-T050 styling complete
- T055 E2E workflow test: requires all user story components (T020-T054) complete

### External Dependencies (Already Available)

✅ Material-UI components (packages/shared-ui)
✅ React 18+, TypeScript 5+
✅ Jest + React Testing Library setup
✅ Existing vehicle selection page (for reusing components)
✅ Backend workflowservice Spring Boot setup
✅ Database (PostgreSQL) available

### Missing Dependencies (Must Install)

- [ ] React Hook Form 7.x+ (in microfrontends/buying-flow/package.json)
- [ ] Zod 3.x+ (for schema validation)
- [ ] Axios 1.x+ (already present likely, verify)
- [ ] Spring Data JPA (backend, likely present)

---

## Validation Criteria

Each phase should verify:

- ✅ All tasks in phase complete and tested
- ✅ No linting/formatting errors
- ✅ TypeScript strict mode passes (0 errors)
- ✅ All tests pass (unit + integration + E2E)
- ✅ Constitutional compliance verified
- ✅ Code review approved

**MVP Gate** (after Phase 6):
- ✅ All 4 user stories fully functional
- ✅ All E2E tests pass
- ✅ 80%+ code coverage
- ✅ Performance targets met
- ✅ Accessibility verified (WCAG 2.1 AA)
- ✅ Deployed to staging
- ✅ Smoke tests pass
- ✅ Ready for customer demo

---

## Notes for Implementation Team

### Best Practices

1. **Commit after each task or logical group**: Keep commits small and focused
2. **Run tests continuously**: Don't wait until phase end to discover failures
3. **Update this file as you progress**: Mark tasks complete, note any blockers
4. **Parallel work**: Assign Phase 2 backend and frontend to different people
5. **Code review early**: Don't wait until end of phase for reviews
6. **Spike unknown areas early**: If React Hook Form is new, spike first (add to Phase 1)

### Troubleshooting Guide

**If validation too slow**: Debounce onChange, memoize validators, cache API responses (T062)
**If form keeps clearing**: Check localStorage persistence logic in useVehicleSelection hook (T018)
**If vehicles not showing**: Verify selectedVehicles data flows through component props (debug ContactRequestStep)
**If test flaky**: Add wait() for async operations in Cypress tests, add data-testid attributes
**If layout broken on mobile**: Check breakpoints in T042-T045, verify theme.spacing applied
**If API 422 errors not showing**: Verify error mapping in T035, check backend validation service response format

### Questions?

Refer to:
- **Data Model**: specs/002-multi-vehicle-selection/data-model.md
- **API Contract**: specs/002-multi-vehicle-selection/contracts/contact-request-submission.md
- **Research**: specs/002-multi-vehicle-selection/research.md
- **Quickstart**: specs/002-multi-vehicle-selection/quickstart.md
- **Constitution**: .specify/memory/constitution.md v1.2.1

---

## Status Tracking

- [ ] **Phase 1**: __ / 5 tasks complete
- [ ] **Phase 2**: __ / 19 tasks complete
- [ ] **Phase 3 (US1)**: __ / 6 tasks complete
- [ ] **Phase 4 (US2)**: __ / 11 tasks complete
- [ ] **Phase 5 (US3)**: __ / 16 tasks complete
- [ ] **Phase 6 (US4)**: __ / 16 tasks complete
- [ ] **Phase 7**: __ / 4 tasks complete
- [ ] **Phase 8**: __ / 5 tasks complete
- [ ] **Phase 9**: __ / 5 tasks complete
- [ ] **Phase 10**: __ / 6 tasks complete
- [ ] **Phase 11**: __ / 5 tasks complete

**Overall**: __ / 96 tasks complete

---

**Last Updated**: October 30, 2025
**Generated By**: /speckit.tasks prompt
**Feature**: 002-multi-vehicle-selection
**Branch**: 002-multi-vehicle-selection
**Ready for Implementation**: ✅ YES
