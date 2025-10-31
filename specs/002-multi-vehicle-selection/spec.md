# Feature Specification: Multi-Vehicle Selection Display & Contact Request Form

**Feature Branch**: `002-multi-vehicle-selection`  
**Created**: October 30, 2025  
**Status**: Draft  
**Input**: User description: "Fix multi-vehicle selection display on contact request page: when users select multiple vehicles and proceed to contact request form, all selected vehicles should be visible (not just one), mock data should be removed, form fields should have validation, and the layout should maintain the desired clean UI/UX design"

**Constitutional Compliance**: This feature adheres to T-Rex Constitution (`.specify/memory/constitution.md v1.2.0`):
- Theme-first styling (Material Design system maintained)
- API-first contracts (form validation and vehicle data endpoints defined)
- Backend-driven validation (server validates all form inputs)
- Microfrontend independence (buying-flow component manages its own state)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-Vehicle Display on Review Page (Priority: P1)

Users who select multiple vehicles (2-4 vehicles) on the vehicle selection page should see ALL selected vehicles displayed on the "Complete Contact Request" review page, not just the first or last vehicle selected.

**Why this priority**: This is critical functionality - users selected multiple vehicles intentionally. Showing only one defeats the purpose of multi-select and creates confusion. This is the core issue reported.

**Independent Test**: Can be tested by selecting 3+ vehicles, navigating to review page, and verifying all 3+ vehicles appear in the display list. Should deliver complete vehicle review visibility.

**Acceptance Scenarios**:

1. **Given** user has selected 2 vehicles on the selection page, **When** user clicks "Continue with 2 Selected Vehicles", **Then** the review page displays both vehicles in a list format with all vehicle details visible
2. **Given** user has selected 4 vehicles on the selection page, **When** user navigates to review page, **Then** all 4 vehicles are displayed and the user can scroll or see them in a clean layout
3. **Given** user is on the review page with multiple vehicles displayed, **When** user scrolls through the vehicle list, **Then** all vehicle cards maintain consistent styling and spacing
4. **Given** user can see multiple vehicles on review page, **When** user wants to modify selection, **Then** there is clear navigation back to vehicle selection page to add/remove vehicles

---

### User Story 2 - Remove Mock/Prepopulated Data (Priority: P1)

The "Complete Contact Request" form should not have any prepopulated mock data. All form fields should be empty, requiring users to enter their actual information.

**Why this priority**: Mock data confuses users and can lead to incorrect submissions. Users need a clean form to fill in their real contact information.

**Independent Test**: Can be tested by navigating to the contact request page and verifying no form fields contain placeholder text, mock values, or prepopulated data. Form should be completely empty.

**Acceptance Scenarios**:

1. **Given** user navigates to the Complete Contact Request page, **When** the page loads, **Then** all form fields are empty (Full Name, Phone Number, Email Address, Province, City, Preferred Contact Method, Additional Comments)
2. **Given** a form field previously had mock data, **When** the page is refreshed, **Then** the field remains empty with only placeholder text visible (if applicable)
3. **Given** user is on the contact request page, **When** examining any form input, **Then** no default/mock values are populated (only HTML placeholders are shown if applicable)

---

### User Story 3 - Form Field Validation (Priority: P1)

The contact request form should validate all user inputs before submission. Invalid data should display clear error messages. Only complete, valid forms can be submitted.

**Why this priority**: Validation prevents bad data submission, improves data quality, and provides users with immediate feedback on requirements. This is essential for successful contact requests.

**Independent Test**: Can be tested by attempting to submit incomplete/invalid form data and verifying validation messages appear. Can also test by filling valid data and verifying form accepts submission.

**Acceptance Scenarios**:

1. **Given** user leaves required fields empty, **When** user attempts to submit, **Then** validation errors appear above/below each empty required field with clear error message
2. **Given** user enters invalid email address, **When** user attempts to submit, **Then** email field shows validation error (e.g., "Please enter a valid email address")
3. **Given** user enters invalid phone number format, **When** user attempts to submit, **Then** phone field shows validation error (e.g., "Phone number must include country code and valid format")
4. **Given** user enters valid data in all required fields, **When** user clicks submit, **Then** form submission proceeds without validation errors
5. **Given** validation errors are displayed, **When** user corrects the errors and re-attempts submit, **Then** validation clears and form submits successfully
6. **Given** user enters text in numeric-only fields, **When** attempting to submit, **Then** validation error appears indicating field requires numeric format

---

### User Story 4 - Beautiful, Clean Contact Request Layout (Priority: P1)

The contact request page should maintain the T-Rex design system aesthetic with a clean, professional layout. The vehicle summary and contact form should be visually balanced and easy to navigate.

**Why this priority**: UI/UX consistency is critical for user confidence and dealership credibility. The layout must feel professional and guide users through the contact process intuitively.

**Independent Test**: Can be tested visually by navigating to the contact request page and verifying: consistent spacing, Material Design principles, readability, visual hierarchy, and professional appearance across desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** user is on the contact request page, **When** viewing the page layout, **Then** vehicle summary section and contact form section are visually distinct but complementary
2. **Given** the contact request page is displayed, **When** examining spacing and alignment, **Then** all sections follow Material Design spacing rules (4px grid system) and maintain visual harmony
3. **Given** multiple vehicles are displayed, **When** viewing the vehicle list, **Then** each vehicle card has consistent height, spacing, and typography that matches the vehicle selection page design
4. **Given** user is viewing form fields, **When** examining the form layout, **Then** fields are organized logically (name, contact, location, preferences, comments) with consistent labeling and input styling
5. **Given** page is viewed on mobile device, **When** examining responsive layout, **Then** all content remains readable, form fields are properly sized, and vehicle list scrolls smoothly
6. **Given** user is on contact request page, **When** examining visual hierarchy, **Then** most important elements (vehicle summary, key form fields) are visually prominent and easy to identify

---

### Edge Cases

- What happens when user selects 0 vehicles? (Should not allow proceeding to review page)
- What happens when user selects more than 4 vehicles? (Should display all vehicles, possibly with scroll/pagination)
- How does system handle form submission when multiple vehicles are selected? (Should submit all selected vehicles with contact info)
- What happens if user's browser doesn't support all Material Design components? (Graceful degradation to semantic HTML)
- How does system handle very long company names or address fields? (Text wrapping/truncation with ellipsis)
- What if user navigates back from review page to selection page? (Should retain previously selected vehicles)
- What if form submission fails on the backend? (Should show error message and allow retry without losing form data)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display ALL selected vehicles on the contact request review page (not just the first, last, or a single vehicle)
- **FR-002**: System MUST clear all form field values and display only HTML placeholders (no mock/prepopulated data) when contact request page loads
- **FR-003**: System MUST validate the following fields before form submission:
  - Full Name (required, non-empty)
  - Phone Number (required, valid format with country code)
  - Email Address (required, valid email format)
  - Province (required, selected from dropdown)
  - City (required, selected from dropdown, populated based on Province selection)
  - Preferred Contact Method (required, selected from dropdown)
  - Additional Comments (optional, max 1000 characters)
- **FR-004**: System MUST display field-level validation error messages immediately when user attempts submission with invalid data
- **FR-005**: System MUST prevent form submission if any required field is empty or contains invalid data
- **FR-006**: System MUST include all selected vehicles in the form submission payload
- **FR-007**: System MUST maintain consistent Material Design styling throughout the contact request page
- **FR-008**: System MUST render vehicle cards in the review section with identical styling to vehicle selection page for design consistency
- **FR-009**: System MUST support form validation without page reload (client-side validation with server-side verification)
- **FR-010**: System MUST implement Province-City dependency (City dropdown filters based on selected Province)
- **FR-011**: System MUST persist selected vehicles in component state during the contact request workflow

### Key Entities

- **Vehicle**: Represents a vehicle the user has selected (ID, make, model, year, price, location, mileage, transmission, fuel type, color, body type, image URL)
- **ContactRequest**: Represents the user's contact request submission (selected vehicles array, full name, phone, email, province, city, preferred contact method, additional comments, submission timestamp)
- **ValidationError**: Represents a field validation failure (field name, error message, severity level)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see 100% of their selected vehicles on the review page (no vehicles are hidden or omitted)
- **SC-002**: Contact request form contains zero prepopulated or mock data in any field (all fields are empty on page load)
- **SC-003**: Form validation prevents submission of incomplete or invalid data (100% of invalid submissions are caught and shown to user with clear error messages)
- **SC-004**: Form validation error feedback appears within 500ms of submission attempt so user receives immediate feedback
- **SC-005**: Users can successfully complete contact request form with valid data in under 2 minutes
- **SC-006**: Contact request page maintains Material Design visual consistency (verified against design system tokens and component library)
- **SC-007**: Vehicle list scrolls smoothly with no performance degradation when displaying 4 vehicles
- **SC-008**: Page is fully responsive and usable on mobile devices (iPhone 12 and larger, iPad)
- **SC-009**: Form submission success rate increases by 40% compared to baseline (mock data was causing confusion leading to invalid submissions)
- **SC-010**: Zero validation-related support tickets related to form errors (validation catches and communicates issues clearly to users)

## Assumptions

- Phone number validation will accept international formats (e.g., +27 for South Africa, +1 for USA)
- City dropdown will be dynamically populated based on backend data for each Province
- Vehicle data structure remains consistent with existing vehicle selection page implementation
- Contact request form submission endpoint exists and accepts the multi-vehicle payload
- Users will have JavaScript enabled (form validation relies on client-side scripts)
- Design tokens and Material Design components are available in the shared-ui package
- Maximum of 4 vehicles per contact request (based on UI shown in reference images)

## Design Considerations

- **Vehicle Card Display**: Reuse the same vehicle card component from vehicle selection page for consistency
- **Form Layout**: Organize into logical sections: Contact Information → Location → Preferences → Comments
- **Spacing**: Follow Material Design 4px grid (8px margins between sections, 16px padding within components)
- **Color Scheme**: Maintain theme colors: Primary (dark blue), Secondary (accent), Success (green for valid), Error (red for validation errors)
- **Typography**: Use Material Design font scales for hierarchy (Headers, Body, Captions)
- **Responsive**: Stack sections vertically on mobile, use grid layout on desktop
