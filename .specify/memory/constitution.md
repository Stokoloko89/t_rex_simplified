<!--
SYNC IMPACT REPORT
==================
Version Change: 1.1.0 → 1.2.0
Change Type: MINOR - Added Documentation Organization principle
Rationale: Root directory bloat prevention and sustainable documentation structure

Modified Principles: None

Added Sections:
  - VII. Documentation Organization: New principle for sustainable docs structure

Removed Sections: None

Templates Requiring Updates:
  ⚠ plan-template.md - Add documentation organization compliance check
  ⚠ spec-template.md - Add documentation location requirement
  ⚠ tasks-template.md - Add documentation consolidation task for long-running projects

Follow-up TODOs:
  - Implement docs/ archive folder structure
  - Migrate historical phase documents to archive/phases/
  - Consolidate root directory from 25 files to 5 (README, DEPLOYMENT, TROUBLESHOOTING, PNPM_GUIDE, T-REX_COMPREHENSIVE_DOCUMENTATION)

Commit Message Suggestion:
docs: amend constitution to v1.2.0 (add documentation organization principle)
-->

# T-Rex Microfrontend Constitution

## Core Principles

### I. Theme-First Styling

All visual components MUST use the centralized theme system located in `packages/shared-ui/src/theme/theme.ts`. 

**Non-negotiable rules:**
- New styles MUST extend or reference theme values (colors, typography, spacing, shadows)
- Direct hardcoded styles are PROHIBITED unless explicitly justified and documented
- Component styling MUST use Material-UI's `sx` prop or styled components with theme access
- Custom styles MUST maintain consistency with the Apple-inspired design philosophy

**Rationale:** Ensures visual consistency across all microfrontends, enables centralized brand updates, and prevents style fragmentation that would undermine the unified user experience.

### II. Dealership Anonymity

Vehicle listings MUST NOT reveal dealership identities until a user expresses purchase interest.

**Non-negotiable rules:**
- Database queries MUST exclude dealership names, contacts, and identifying information in public APIs
- Only generic location data (province/region) may be displayed in search results
- Dealership information is revealed ONLY 30 minutes after user submits interest form
- Revelation MUST occur exclusively via email notification (not in-app or API)
- Email notifications to dealerships MUST include complete buyer information for follow-up
- System MUST enforce 30-minute delay through scheduled job or delayed queue mechanism

**Rationale:** Protects the business model of connecting qualified buyers with sellers; prevents buyers from bypassing the platform; maintains T-Rex as the trusted intermediary; the 30-minute delay ensures genuine interest and reduces spam/casual inquiries.

### III. Microfrontend Independence

Each microfrontend MUST be independently deployable, testable, and maintainable.

**Non-negotiable rules:**
- Microfrontends share code ONLY through `packages/shared-ui` (versioned dependencies)
- Each microfrontend has its own Dockerfile and can run standalone
- Cross-microfrontend communication MUST occur through Single-SPA lifecycle methods or backend APIs
- Breaking changes in shared components require version bumps and migration paths

**Rationale:** Enables parallel development, reduces deployment risk, supports technology diversity, and allows feature teams to move independently.

### IV. Backend-Driven Workflow State

All workflow logic, validation, and state transitions MUST be managed by the backend workflow engine.

**Non-negotiable rules:**
- Frontend MUST NOT implement business rules or validation logic (presentation only)
- Step progression decisions are determined by backend workflow engine responses
- Frontend state is ephemeral; backend database is source of truth
- API contracts define available actions and next steps explicitly

**Rationale:** Ensures data integrity, security, and consistency; prevents client-side manipulation; centralizes business logic for easier maintenance and audit compliance.

### V. pnpm Workspace Architecture

The monorepo MUST be managed using pnpm workspaces with strict dependency isolation.

**Non-negotiable rules:**
- All shared dependencies MUST be defined in workspace root `package.json`
- Microfrontend-specific dependencies MUST be scoped to their package
- Phantom dependencies are PROHIBITED (strict mode enforced)
- Workspace protocol references (`workspace:*`) MUST be used for internal packages

**Rationale:** Prevents version conflicts, reduces disk usage through hard links, ensures predictable builds, and maintains clear dependency graphs across the monorepo.

### VI. API-First Development

All features requiring data MUST define API contracts before frontend implementation begins.

**Non-negotiable rules:**
- API endpoints MUST be documented with request/response schemas
- Frontend development MUST use mocked API responses until backend is ready
- Breaking API changes require versioning (e.g., `/api/v2/vehicles`)
- All endpoints MUST include error response definitions

**Rationale:** Enables parallel frontend/backend development, reduces integration issues, provides clear contracts for testing, and supports API versioning strategy.

### VII. Documentation Organization

Documentation MUST be organized systematically to prevent root directory bloat and maintain discoverability.

**Non-negotiable rules:**
- Root directory MUST contain only essential files: `README.md`, `DEPLOYMENT.md`, `TROUBLESHOOTING.md`, `PNPM_GUIDE.md`, and one comprehensive reference document
- Phase-specific documentation MUST be archived to `docs/archive/phases/` after phase completion
- Status/progress documents (PHASE_*_COMPLETE, PHASE_*_PROGRESS, etc.) MUST be consolidated into phase completion reports
- Feature-specific documentation MUST be stored in `specs/` directory, NOT root
- Architectural decision records MUST be stored in `specs/[feature]/decisions/`, NOT root
- Comprehensive documentation MUST use a single consolidated reference: `T-REX_COMPREHENSIVE_DOCUMENTATION.md`
- Document lifecycle: Active → Archive after 2 weeks of inactivity

**Rationale:** Prevents repository root pollution, maintains clear navigation hierarchy, archives historical decisions for reference, reduces cognitive load when onboarding, and improves long-term maintainability.

## Technology & Architecture Standards

**Frontend Stack:**
- React 18.3+ with TypeScript 5.x (strict mode enabled)
- Material-UI 7.3+ for components (using centralized theme)
- Single-SPA 6.0+ for microfrontend orchestration
- pnpm 8.x+ for package management
- Webpack 5 with code splitting and lazy loading

**Backend Stack:**
- Spring Boot 3.1+ with Java 17+
- PostgreSQL 15+ for persistent storage
- Spring Data JPA with Hibernate ORM
- Maven 3.8+ for build management
- Docker multi-stage builds for deployment

**Infrastructure:**
- Docker Compose for local development
- Nginx for reverse proxy and static file serving
- Health check endpoints required for all services
- Environment-specific configuration (dev/staging/prod)

**Deployment Requirements:**
- All services MUST have Dockerfile with multi-stage builds
- Images MUST be optimized for size (<500MB backend, <100MB frontend)
- Services MUST expose health check endpoints (`/actuator/health`)
- Zero-downtime deployments supported through rolling updates

## Security & Privacy Requirements

**Data Protection:**
- User personal information (name, email, phone) MUST be encrypted at rest
- Database connections MUST use SSL/TLS in production
- Passwords and sensitive config MUST use environment variables (never hardcoded)
- PII access MUST be logged for audit compliance

**API Security:**
- CORS configuration MUST be explicit and restrictive (no wildcards in production)
- SQL injection protection via JPA parameterized queries ONLY
- Input validation MUST occur on backend (frontend validation is UX only)
- Rate limiting MUST be implemented on all public endpoints

**Frontend Security:**
- XSS protection headers MUST be configured in Nginx
- Content Security Policy MUST restrict script sources
- Third-party scripts MUST be vetted and minimized
- Authentication tokens MUST use HttpOnly cookies (no localStorage)

**Email Security:**
- Dealership email notifications MUST sanitize user input to prevent injection
- Email rate limiting MUST prevent spam/abuse
- Unsubscribe mechanisms MUST be provided per CAN-SPAM/GDPR

## Governance

**Amendment Procedure:**
- Constitution changes require documented rationale and impact analysis
- Version bumps follow semantic versioning (MAJOR.MINOR.PATCH)
- All amendments MUST update dependent templates and documentation
- Breaking changes (MAJOR) require migration plan and stakeholder approval

**Compliance Verification:**
- All pull requests MUST include constitution compliance checklist
- Code reviews MUST verify adherence to core principles
- CI/CD pipelines MUST enforce linting, formatting, and test coverage gates
- Architecture Decision Records (ADRs) MUST justify principle violations

**Version Policy:**
- MAJOR: Backward-incompatible governance changes or principle removals
- MINOR: New principles added or material guidance expansions
- PATCH: Clarifications, typo fixes, non-semantic refinements

**Documentation:**
- Runtime development guidance lives in `README.md` and `PNPM_GUIDE.md`
- Feature-specific guidance generated via `/speckit` commands in `.specify/` directory
- All principles MUST have clear rationale and testable acceptance criteria

**Complexity Justification:**
- Violations of principles MUST be documented in feature plan's "Complexity Tracking" table
- Justifications MUST explain why simpler alternatives were rejected
- Technical debt from violations MUST be tracked and prioritized for resolution

**Version**: 1.2.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-10-30
