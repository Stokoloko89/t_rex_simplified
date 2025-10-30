# Implementation Plan: Remove Host Application Theme

**Branch**: `001-remove-host-theme` | **Date**: 2025-10-30 | **Spec**: [../spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-remove-host-theme/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Remove the host application completely while maintaining microfrontend functionality through direct URL access. Replace AA Inform branding with generic Material Design theming to create a customer-presentable prototype. The approach involves configuring Nginx routing for direct microfrontend access and updating the shared theme to use neutral, professional styling.

## Technical Context

### Current Architecture
The T-Rex application currently consists of four main services orchestrated via Docker Compose:

1. **Host Application (Port 3000 - Production, Port 3002 - Development)**
   - Single-SPA root application serving branded AA Inform website
   - Contains navigation, hero section, and footer with AA Inform branding
   - Orchestrates microfrontend loading via Single-SPA framework
   - Serves static HTML with embedded CSS styling
   - Uses nginx for static file serving in production, webpack-dev-server on port 3002 in development

2. **Buying Flow Microfrontend (Port 3001)**
   - Standalone React application with Single-SPA lifecycle methods
   - Implements vehicle search and purchase workflow
   - Already configured for CORS and direct access
   - Has independent nginx configuration with security headers
   - Can run in standalone development mode

3. **Workflow Service Backend (Port 8080)**
   - Spring Boot application providing REST API endpoints
   - Manages vehicle data, search filters, and workflow state
   - Connects to PostgreSQL database
   - Provides actuator health endpoints

4. **PostgreSQL Database (Port 5432)**
   - Stores comprehensive vehicle inventory data
   - Contains 400+ vehicle records with pricing and specifications
   - Supports complex filtering and search operations

### Host Application Components to Remove
- **Branded HTML Content**: AA Inform logo, navigation menu, hero section, footer
- **Single-SPA Orchestration**: Root config loading microfrontends dynamically
- **Import Maps**: ESM module loading configuration for microfrontends
- **Global React Setup**: Window.React assignments for microfrontend compatibility
- **AA Inform Theming**: Yellow primary color (#ffc107) and branded color palette

### Microfrontend Independence
**Current Status**: ❌ NOT INDEPENDENT - Requires Single-SPA orchestration
- Standalone mode logic exists but only activates in development environment
- Production Docker builds cannot render microfrontend independently
- Requires host application's Single-SPA framework for proper functioning
- **IMPLEMENTATION REQUIRED**: Enable standalone rendering capability

**Post-Implementation**:
- Microfrontend will support direct access at `http://localhost:3001`
- HTML wrapper will provide necessary React globals and dependencies
- Nginx configuration will proxy API calls to backend services
- Independent deployment and scaling capability maintained

### Theme Modifications Required
Current shared-ui theme contains AA Inform branding that must be replaced:

**Colors to Change:**
- Primary: `#ffc107` (AA Inform yellow) → Material Design blue (`#1976d2`)
- Text colors referencing AA Inform dark gray
- Button hover states using branded colors

**Preserve:**
- Clean, professional Material Design aesthetic
- Apple-inspired typography and spacing
- Component styling and interaction patterns
- Overall design system consistency

### Deployment Architecture Post-Removal
**Current State** (Before Implementation):
```
Client → Host App (Port 3000) → Single-SPA → Buying Flow Microfrontend
                                      ↓
                         Workflow Service (Port 8080)
                                      ↓
                         PostgreSQL (Port 5432)
```

**Target State** (After Implementation):
```
Client → Buying Flow (Port 3001) [Standalone HTML Wrapper]
                    ↓
         Workflow Service (Port 8080)
                    ↓
         PostgreSQL (Port 5432)
```

**Implementation Requirements**:
- Create standalone HTML wrapper for buying-flow microfrontend
- Enable production standalone rendering in microfrontend code
- Configure nginx proxy for API calls from port 3001 to port 8080
- Remove host-app service from Docker Compose

### Unknowns and Research Questions
1. **URL Routing**: ❌ Microfrontend cannot be accessed directly - requires Single-SPA framework
2. **Asset Loading**: ✅ No shared assets between host and microfrontend
3. **Configuration Dependencies**: ❌ Microfrontend depends on Single-SPA orchestration from host
4. **SEO and Direct Linking**: ✅ Not applicable - internal development tool
5. **Development Workflow**: ❌ Standalone mode exists but only works in development environment

**Resolution**: Research revealed critical dependency on Single-SPA. Implementation must enable standalone microfrontend capability.

### Success Criteria
- [ ] Buying flow microfrontend loads and functions identically at `http://localhost:3001` (REQUIRES IMPLEMENTATION)
- [x] All AA Inform branding removed from UI components and theming
- [ ] Generic Material Design theme applied consistently
- [ ] Docker Compose services remain functional after host removal
- [x] No breaking changes to API contracts or data flow

**Implementation Complexity**: Medium-High - Requires enabling standalone microfrontend capability

**Language/Version**: TypeScript 5.x, React 18.3+, Material-UI 7.x, Spring Boot 3.1+
**Primary Dependencies**: React, Material-UI, Single-SPA, Spring Boot, PostgreSQL
**Storage**: PostgreSQL 15 with comprehensive vehicle dataset
**Testing**: Component testing with React Testing Library, API testing with Spring Boot Test
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Microfrontend architecture with shared UI package
**Performance Goals**: Sub-2 second initial page load, smooth 60fps animations
**Constraints**: Must maintain microfrontend independence, CORS-enabled for direct access
**Scale/Scope**: 400+ vehicle records, complex filtering workflows, multi-step buying process

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with T-Rex Constitution (`.specify/memory/constitution.md v1.1.0`):

- [x] **Theme-First Styling**: Implementation modifies `packages/shared-ui/src/theme/theme.ts` to replace AA Inform branding with generic Material Design colors while maintaining centralized theme system
- [x] **Dealership Anonymity**: Feature removes host application branding only; no changes to dealership data handling or 30-minute delay mechanisms
- [x] **Microfrontend Independence**: Implementation enhances independence by removing Single-SPA orchestration dependency and enabling direct microfrontend access
- [x] **Backend-Driven Workflow**: No changes to workflow logic or state management; buying flow functionality remains backend-driven
- [x] **pnpm Workspace Architecture**: No changes to workspace structure or dependency management
- [x] **API-First Development**: No new API endpoints created; existing contracts remain unchanged
- [x] **Security Requirements**: No security configuration changes; existing CORS and validation policies maintained
- [x] **Deployment Standards**: No changes to Docker configuration; existing multi-stage builds and health checks preserved

**Violations Requiring Justification**: None - all principles maintained

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

## Project Structure

### Documentation (this feature)

```text
specs/001-remove-host-theme/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Host Application (TO BE REMOVED)
host-app/
├── public/index.html           # Branded HTML with AA Inform content
├── src/t-rex-root-config.js    # Single-SPA orchestration logic
├── webpack.config.js           # Dev server on port 3002, production build
├── nginx.conf                  # Static file serving configuration (port 3000 in Docker)
└── Dockerfile                  # Multi-stage build (to be removed)

# Buying Flow Microfrontend (PRIMARY TARGET)
microfrontends/buying-flow/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── index.tsx               # Single-SPA lifecycle exports
│   ├── components/             # Reusable UI components
│   └── steps/                  # Workflow step components
├── nginx.conf                  # CORS-enabled serving config
└── Dockerfile                  # Independent deployment

# Shared UI Package (THEME MODIFICATIONS)
packages/shared-ui/
├── src/
│   ├── theme/theme.ts          # AA Inform theme → Generic Material Design
│   ├── components/             # Shared UI components
│   └── types/                  # TypeScript type definitions
└── package.json                # Workspace dependency management

# Backend Services (UNCHANGED)
backend/workflowservice/        # Spring Boot API service
├── src/main/java/com/          # Business logic and API endpoints
├── application.yml             # Configuration
└── Dockerfile                  # Multi-stage build

# Infrastructure (MODIFIED)
docker-compose.yml              # Remove host-app service
nginx/nginx.conf               # Optional production proxy (may be removed)
```

**Structure Decision**: This implementation modifies the existing microfrontend architecture by removing the host-app orchestration layer and updating the shared theme. The buying-flow microfrontend becomes the primary entry point, with all existing backend and database services remaining unchanged. The shared-ui package is updated to remove AA Inform branding while maintaining the professional Material Design aesthetic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitutional violations identified - implementation maintains all core principles.*
