# Feature Specification: Remove Host Application Theme

**Feature Branch**: `001-remove-host-theme`  
**Created**: 2025-10-30  
**Status**: Draft  
**Input**: User description: "I want to remove the host appication theme because I don't want it to show AA inform. The host app design myst be generic as I want to present to a potential customer. If possible remove the entire host app, as it is adding complexity to this prototype I am trying to create"

**Constitutional Compliance**: When writing requirements and user stories, ensure adherence to T-Rex Constitution (`.specify/memory/constitution.md v1.1.0`), particularly:
- Theme-first styling (no hardcoded styles)
- Dealership anonymity (30-minute delay before email-only revelation)
- API-first contracts (define before implementation)
- Backend-driven validation (frontend is presentation only)

## Clarifications

### Session 2025-10-30

- Q: Should the host application be completely removed or just its branded theming? → A: Completely remove the host application and serve microfrontends directly
- Q: What specific visual characteristics should define the generic theme? → A: Standard Material Design components with neutral color palette
- Q: How should customers access the vehicle search and buying flow without the host application? → A: Direct URLs to each microfrontend (e.g., /buying-flow, /search)
- Q: What constitutes "visible to customers" for reference removal? → A: Only user-facing interface, URLs, and customer-accessible documentation
- Q: How should deployment complexity reduction be measured? → A: Deployment steps and container count will be measured post-implementation to establish baseline and demonstrate reduction

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generic Prototype Demonstration (Priority: P1)

A potential customer views the T-Rex vehicle search and buying flow without seeing any AA Inform branding or company-specific theming, allowing them to envision the platform as a white-label solution for their own business.

**Why this priority**: Essential for customer presentations and sales demos. Removing branded elements allows prospects to focus on functionality rather than existing brand associations.

**Independent Test**: Can be fully tested by navigating to the application and verifying no AA Inform branding, colors, or references appear anywhere in the user interface.

**Acceptance Scenarios**:

1. **Given** a potential customer accesses the application, **When** they view any page or component, **Then** they see no AA Inform branding, logos, or company-specific styling
2. **Given** the application is running, **When** navigating through the vehicle search flow, **Then** all styling appears generic and neutral without brand-specific colors or themes

---

### User Story 2 - Simplified Architecture for Prototyping (Priority: P2)

Development team works with a simplified application architecture that reduces complexity by eliminating unnecessary host application layers while maintaining core functionality.

**Why this priority**: Reduces maintenance overhead and simplifies deployment for prototype demonstrations, making it easier to focus on core vehicle search and buying features.

**Independent Test**: Can be fully tested by confirming the application runs successfully with reduced architectural complexity and all core features remain functional.

**Acceptance Scenarios**:

1. **Given** the host application is completely removed, **When** accessing microfrontends via direct URLs (e.g., /buying-flow), **Then** all functionality remains accessible and operational without host application dependencies
2. **Given** the simplified architecture, **When** deploying the prototype, **Then** deployment time and complexity are reduced compared to the previous multi-layer setup

---

### User Story 3 - Clean Customer Presentation Experience (Priority: P3)

Sales team presents the T-Rex platform to potential customers with a clean, professional interface that allows prospects to imagine their own branding applied to the solution.

**Why this priority**: Supports business development efforts by providing a neutral canvas that doesn't compete with prospect's existing brand identity.

**Independent Test**: Can be fully tested by conducting a mock customer presentation and confirming the interface appears professional and brand-neutral.

**Acceptance Scenarios**:

1. **Given** a sales presentation is underway, **When** demonstrating vehicle search features, **Then** the interface appears professionally designed without conflicting brand elements
2. **Given** a potential customer is viewing the demo, **When** they see the interface, **Then** they can easily envision their own brand colors and styling applied to the platform

### Edge Cases

- What happens when customers ask about customization options after seeing the generic interface?
- How does system handle existing AA Inform references in database content or API responses?
- What occurs if microfrontends still contain hardcoded theme references after host app removal?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST remove all AA Inform branding, logos, and company-specific visual elements from the user interface
- **FR-002**: System MUST apply Standard Material Design components with neutral color palette (grays, whites, standard blues #1976d2) without company-specific branding
- **FR-003**: System MUST maintain all existing vehicle search and buying flow functionality after theme removal
- **FR-004**: System MUST completely remove the host application and serve microfrontends directly with independent routing
- **FR-005**: System MUST provide direct URL access to each microfrontend (e.g., /buying-flow, /search) for simplified customer demonstrations
- **FR-006**: System MUST ensure no AA Inform references remain in user-facing interface, URLs, and customer-accessible documentation
- **FR-007**: System MUST use Material Design typography and spacing conventions for professional, brand-neutral appearance
- **FR-007**: System MUST maintain responsive design and accessibility standards with the new generic theme

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero AA Inform brand references visible in any user-facing interface or documentation
- **SC-002**: Application startup time improves by removing host application complexity overhead
- **SC-003**: All existing vehicle search and purchase flows complete successfully with 100% feature parity
- **SC-004**: Customer presentation feedback shows 90% positive response to clean, generic interface design
- **SC-005**: Development team reports reduced deployment complexity and container count for prototype demonstrations (baseline to be established post-implementation)
- **SC-006**: All accessibility compliance standards maintained at current levels (WCAG 2.1 AA) with generic theme
