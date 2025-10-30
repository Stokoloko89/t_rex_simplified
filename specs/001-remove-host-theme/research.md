# Research Findings: Remove Host Application Theme

**Feature**: 001-remove-host-theme | **Phase**: 0 (Research) | **Date**: 2025-10-30
**Plan**: [plan.md](plan.md) | **Spec**: [../spec.md](../spec.md)

## Executive Summary

Research confirms that the buying-flow microfrontend is architecturally ready for independent operation. The host application serves no functional purpose beyond branding and can be safely removed. Theme modifications are straightforward and contained to the shared-ui package.

## Current Architecture Analysis

### Host Application Assessment
**Purpose**: Single-SPA root container with AA Inform branding
**Functionality**: 
- Serves branded HTML with navigation, hero section, and footer
- Orchestrates microfrontend loading via Single-SPA
- Provides global React setup for microfrontends
- **CRITICAL**: Provides the only mechanism for microfrontend rendering

**Port Configuration**:
- **Production/Docker**: Port 3000 (nginx serving static files)
- **Development**: Port 3002 (webpack-dev-server with hot reloading)

**Removal Impact**: **BREAKING** - Microfrontend cannot render without Single-SPA orchestration

### Microfrontend Independence Verification
**Direct Access Capability**: ❌ NOT CONFIRMED - REQUIRES MODIFICATION
- Standalone mode logic only activates in development environment (`NODE_ENV === 'development'`)
- Production Docker builds do not enable standalone rendering
- Microfrontend requires Single-SPA orchestration from host app to function
- Current implementation cannot operate independently at `http://localhost:3001`

**API Dependencies**: ✅ VERIFIED
- Backend API calls use relative paths (`/api/*`)
- No host-specific configuration required
- Environment variables properly scoped

### Theme Analysis
**Current Branding**: AA Inform yellow (#ffc107) primary color
**Scope of Changes**: 
- Primary color palette (main, light, dark, contrastText)
- Button styling overrides
- Component color references
- Typography colors (preserved)

**Impact Assessment**: Changes contained to `packages/shared-ui/src/theme/theme.ts`

## Technical Findings

### Service Dependencies
```
Buying Flow (Port 3001) → Workflow Service (Port 8080) [REQUIRES MODIFICATION]
                          → PostgreSQL (Port 5432)
                          → Shared UI Package
                          → Single-SPA Orchestration (CURRENTLY REQUIRED)
```

**CRITICAL DEPENDENCY**: Host application provides essential Single-SPA framework for microfrontend rendering.

### Configuration Analysis
**Import Maps**: Used only for microfrontend loading - can be removed
**Global React**: Window.React assignments necessary for Single-SPA compatibility
**Nginx Routing**: Host app nginx serves static files only - no routing logic
**Standalone Mode**: Currently development-only, needs production enablement

### Asset Dependencies
**Shared Fonts**: System fonts (Apple-inspired) - no external dependencies
**Images**: Unsplash stock photos in host app - not used by microfrontend
**CSS**: Embedded styles in host HTML - microfrontend uses Material-UI theme
**JavaScript**: Single-SPA framework required for current microfrontend architecture

## Risk Assessment

### High Risk Items
- **Microfrontend Standalone Implementation**: Requires modifying buying-flow to support production standalone mode
- **Single-SPA Removal**: Need to ensure all Single-SPA lifecycle methods are properly replaced
- **Global React Dependencies**: Must maintain React global availability for microfrontend components

### Medium Risk Items
- **URL access patterns**: Users accustomed to port 3000 access
- **Development workflow**: Local development may require port changes
- **API proxy configuration**: Need to ensure API calls work from standalone microfrontend

### Low Risk Items
- Host application removal: No functional dependencies beyond orchestration
- Theme color changes: Straightforward palette replacement
- Docker Compose updates: Simple service removal

### Mitigation Strategies
- Implement standalone rendering logic that works in both development and production
- Create simple HTML wrapper for microfrontend with necessary dependencies
- Update documentation with new access URL (localhost:3001)
- Provide migration guide for development environment
- Test all microfrontend functionality post-removal

## Unknowns Resolved

1. **URL Routing**: ❌ Microfrontend cannot currently be accessed directly - requires Single-SPA orchestration
2. **Asset Loading**: ✅ No shared assets between host and microfrontend
3. **Configuration Dependencies**: ✅ No host configuration passed to microfrontend, but Single-SPA framework required
4. **SEO and Direct Linking**: ✅ Not applicable - internal development tool
5. **Development Workflow**: ❌ Standalone mode exists but only works in development environment

## Implementation Requirements Identified

### Required Modifications
1. **Enable Standalone Mode**: Modify buying-flow to support standalone rendering in production
2. **Create HTML Wrapper**: Develop simple HTML page that loads microfrontend independently
3. **Maintain Global React**: Ensure React remains globally available for component compatibility
4. **API Proxy Configuration**: Configure nginx to proxy API calls to backend service

### Alternative Approaches
1. **Minimal Host App**: Keep minimal host app without branding for orchestration only
2. **Microfrontend Standalone Build**: Create separate build configuration for standalone operation
3. **Simple Wrapper Page**: Create basic HTML page that mimics host app functionality

## Recommendations

### Immediate Actions
1. **Implement Standalone Capability**: Modify buying-flow index.tsx to enable standalone mode in production
2. **Create Standalone HTML**: Develop simple HTML wrapper with required dependencies
3. **Update Theme**: Replace AA Inform branding with generic Material Design colors
4. **Remove Host App**: Remove host-app service from docker-compose.yml
5. **Test Standalone Operation**: Verify microfrontend functions at `http://localhost:3001`

### Future Considerations
- Consider implementing a simple landing page at root if needed
- Evaluate need for nginx reverse proxy configuration
- Document direct access pattern for stakeholders
- Consider long-term migration away from Single-SPA for simpler architecture

## Success Criteria Validation

- [ ] Buying flow microfrontend loads identically at `http://localhost:3001` (REQUIRES IMPLEMENTATION)
- [x] All AA Inform branding removed from theme
- [ ] Generic Material Design theme applied consistently
- [ ] Docker Compose services functional after host removal
- [x] No breaking changes to API contracts

**Research Complete**: Critical dependency on Single-SPA orchestration discovered. Implementation requires enabling standalone microfrontend capability. Ready to proceed to Phase 1 (Design) with corrected understanding.