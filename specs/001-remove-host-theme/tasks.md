# Tasks: Remove Host Application Theme

**Input**: Design documents from `/specs/001-remove-host-theme/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: No test tasks included - feature specification does not request TDD approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Constitutional Compliance**: All tasks must adhere to T-Rex Constitution (`.specify/memory/constitution.md v1.1.0`):
- Use theme system for styling tasks
- Ensure API-first approach (contracts before implementation)
- Backend tasks for business logic, frontend tasks for presentation only
- Maintain microfrontend independence in architecture tasks
- Implement 30-minute delay for dealership revelation (scheduled job/delayed queue)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `host-app/`, `microfrontends/buying-flow/`, `packages/shared-ui/`, `backend/`
- **Infrastructure**: `docker-compose.yml`, `nginx/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize TypeScript/React project with Material-UI dependencies
- [x] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T004 Setup database schema and migrations framework (SKIPPED - existing backend unchanged)
- [x] T005 [P] Implement authentication/authorization framework (SKIPPED - existing backend unchanged)
- [x] T006 [P] Setup API routing and middleware structure (SKIPPED - existing backend unchanged)
- [x] T007 Create base models/entities that all stories depend on (SKIPPED - existing backend unchanged)
- [x] T008 Configure error handling and logging infrastructure (SKIPPED - existing backend unchanged)
- [x] T009 Setup environment configuration management (SKIPPED - existing backend unchanged)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generic Prototype Demonstration (Priority: P1) 🎯 MVP

**Goal**: Remove all AA Inform branding and apply generic Material Design theming for customer presentations

**Independent Test**: Navigate to application and verify no AA Inform branding, colors, or references appear anywhere in the user interface

### Implementation for User Story 1

- [x] T010 [US1] Update shared-ui theme colors from AA Inform yellow (#ffc107) to generic Material Design blue (#1976d2) in packages/shared-ui/src/theme/theme.ts
- [x] T011 [US1] Remove AA Inform text color references and replace with neutral Material Design colors in packages/shared-ui/src/theme/theme.ts
- [x] T012 [US1] Update button hover states and component styling to use generic colors in packages/shared-ui/src/theme/theme.ts
- [x] T013 [US1] Verify theme changes maintain Material Design consistency and professional appearance

**Checkpoint**: ✅ COMPLETE - User Story 1 is fully functional and testable independently - generic theming applied without AA Inform branding

---

## Phase 4: User Story 2 - Simplified Architecture for Prototyping (Priority: P2)

**Goal**: Remove host application complexity while maintaining microfrontend functionality through direct access

**Independent Test**: Confirm application runs successfully with reduced architectural complexity and all core features remain functional

### Implementation for User Story 2

- [x] T014 [US2] Modify buying-flow/src/index.tsx to enable standalone rendering in production environment (not just development)
- [x] T015 [US2] Create standalone HTML wrapper for buying-flow microfrontend with React globals and dependencies in microfrontends/buying-flow/public/index.html
- [x] T016 [US2] Configure buying-flow nginx.conf to proxy API calls from port 3001 to backend workflow service on port 8080
- [x] T017 [US2] Remove host-app service from docker-compose.yml and update any dependent configurations
- [x] T018 [US2] Test that buying-flow microfrontend loads and functions correctly at http://localhost:3001 without host app orchestration

**Checkpoint**: ✅ COMPLETE - User Stories 1 AND 2 both work independently - simplified architecture with direct microfrontend access

---

## Phase 5: User Story 3 - Clean Customer Presentation Experience (Priority: P3)

**Goal**: Provide clean, professional interface for sales presentations that allows prospects to envision their own branding

**Independent Test**: Conduct mock customer presentation and confirm interface appears professional and brand-neutral

### Implementation for User Story 3

- [x] T019 [US3] Update README.md and development documentation to reference new access URL (port 3001) and direct microfrontend access
- [x] T020 [US3] Run full application stack and verify all services work without host app orchestration
- [x] T021 [US3] Validate responsive design and accessibility standards maintained with generic theme
- [x] T022 [US3] Confirm no AA Inform references remain in user-facing interface, URLs, and customer-accessible documentation

**Checkpoint**: ✅ COMPLETE - All user stories are independently functional - clean presentation experience ready for customer demos

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [ ] T023 [P] Documentation updates in README.md and development guides
- [ ] T024 Code cleanup and removal of unused host-app references
- [ ] T025 Performance validation - confirm application startup time improves
- [ ] T026 Security validation - ensure CORS and validation policies maintained
- [ ] T027 Run final integration testing across all components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Theme changes before architecture changes
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Theme-related tasks within US1 can run in parallel
- Architecture tasks within US2 can run in parallel
- Documentation and testing tasks within US3 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch theme color updates together:
Task: "Update shared-ui theme colors from AA Inform yellow (#ffc107) to generic Material Design blue (#1976d2) in packages/shared-ui/src/theme/theme.ts"
Task: "Remove AA Inform text color references and replace with neutral Material Design colors in packages/shared-ui/src/theme/theme.ts"
Task: "Update button hover states and component styling to use generic colors in packages/shared-ui/src/theme/theme.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently - verify generic theming without AA Inform branding
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: Generic theming!)
3. Add User Story 2 → Test independently → Deploy/Demo (Simplified architecture)
4. Add User Story 3 → Test independently → Deploy/Demo (Clean presentation)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Theme changes)
   - Developer B: User Story 2 (Architecture simplification)
   - Developer C: User Story 3 (Documentation and testing)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence</content>
<parameter name="filePath">/home/stokoloko89/repos/t_rex_simplified/specs/001-remove-host-theme/tasks.md