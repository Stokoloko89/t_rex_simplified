# Root Directory Manifest

**Purpose**: Governance for root directory file organization  
**Constitution Version**: 1.2.0  
**Last Updated**: 2025-10-30

---

## ✅ Approved Root Files (Essential Only)

### Active Development (Always in Root)
1. **README.md** - Project overview, quick start
2. **DEPLOYMENT.md** - Production deployment guide
3. **TROUBLESHOOTING.md** - Common issues and solutions
4. **PNPM_GUIDE.md** - pnpm workspace management guide
5. **CUSTOMER_DEMO_PACKAGE.md** - Active demo package (Phase 7)
6. **check-demo-readiness.sh** - Automated demo validation

### Comprehensive Reference (Active Phase)
7. **T-REX_COMPREHENSIVE_DOCUMENTATION.md** - Complete project reference
8. **PHASE_7_EXECUTION_PLAN.md** - Active phase plan (Phase 7)

### Configuration Files (Non-Markdown, Not Counted)
- docker-compose.yml
- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml
- tsconfig.json
- etc.

**Total**: 8 active markdown files in root

---

## 📦 Archived/Moved Files (No Longer in Root)

### Phase 6 Archives (Moved to docs/archive/phases/)
- ❌ PHASE_6_COMPLETE.md → docs/archive/phases/
- ❌ PHASE_6_PROGRESS.md → docs/archive/phases/
- ❌ PHASE_6_DELIVERY_MANIFEST.md → docs/archive/phases/ (content merged into PHASE_6_COMPLETION_REPORT.md)

### Consolidated into PHASE_6_COMPLETION_REPORT.md (Kept in Root)
- ✅ PHASE_6_COMPLETION_REPORT.md (kept)
- ✅ PHASE_6_QUICK_REFERENCE.md (kept - one-page quick ref)

### Obsolete Phase Documents (Historical Archive)
- ❌ BACKEND_COMPLETE.md
- ❌ FRONTEND_DESIGN_SUMMARY.md
- ❌ FRONTEND_IMPLEMENTATION_COMPLETE.md
- ❌ IMPLEMENTATION_COMPLETION_ASSESSMENT.md
- ❌ IMPLEMENTATION_SUMMARY.md
- ❌ UI_SIMPLIFICATION_COMPLETE.md

### Implementation Plans (Feature-Specific, Belongs in specs/)
- ❌ FILTER_IMPLEMENTATION_PLAN.md → specs/001-remove-host-theme/
- ❌ NEXT_STEPS_FRONTEND.md → specs/001-remove-host-theme/

### Status/Issue Documents (Consolidated or Archived)
- ❌ CHECKLIST_CROSS_CHECK_REPORT.md
- ❌ FINAL_STATUS.md
- ❌ FIX_APPLIED.md
- ❌ ISSUE_RESOLUTION.md

---

## 📂 Correct File Organization

### Root (Kept Minimal)
```
/
├── README.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
├── PNPM_GUIDE.md
├── T-REX_COMPREHENSIVE_DOCUMENTATION.md
├── PHASE_7_EXECUTION_PLAN.md
├── PHASE_6_COMPLETION_REPORT.md
├── PHASE_6_QUICK_REFERENCE.md
├── CUSTOMER_DEMO_PACKAGE.md
├── check-demo-readiness.sh
└── [Config files: docker-compose.yml, package.json, etc.]
```

### docs/ (Archives & Guides)
```
docs/
├── archive/
│   ├── phases/
│   │   ├── PHASE_6_ARCHIVE_INDEX.md
│   │   └── phase_6_archived_docs/
│   │       ├── PHASE_6_COMPLETE.md
│   │       ├── PHASE_6_PROGRESS.md
│   │       └── PHASE_6_DELIVERY_MANIFEST.md
│   └── historical/
│       └── [Obsolete documents]
└── guides/
    └── [Procedural documentation]
```

### specs/ (Active Feature Specs)
```
specs/
└── 001-remove-host-theme/
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    ├── research.md
    ├── TYPOGRAPHY_SYSTEM.md
    ├── INTERACTION_STATES.md
    ├── LOADING_ERROR_EMPTY_STATES.md
    ├── decisions/
    │   ├── README.md
    │   ├── ADR-001-material-design-choice.md
    │   ├── ADR-002-system-fonts.md
    │   ├── ADR-003-centered-layout.md
    │   ├── ADR-004-minimized-notifications.md
    │   └── ADR-005-conditional-build-modes.md
    └── checklists/
        ├── requirements.md
        └── ux.md
```

---

## 🚀 Phase 7 Plan

### Phase 7 Root Files (Will Be Added)
1. **PHASE_7_DEMO_LOG.md** - Record of customer demos
2. **PHASE_7_FEEDBACK_SUMMARY.md** - Aggregated feedback findings
3. **PHASE_7_RECOMMENDATIONS.md** - Actionable insights

**Timeline**: These will be added during Phase 7 execution, then archived after completion.

---

## 📏 Root Directory Governance

### Adding New Files to Root
**Criteria**: File MUST meet ALL of these:
- [ ] Essential for daily development workflow
- [ ] Referenced by developers multiple times per week
- [ ] Relevant for 2+ weeks (not temporary)
- [ ] Not feature/phase-specific (use specs/ instead)
- [ ] Not status/progress tracking (use archive structure)

**Examples of Appropriate Root Files**:
- ✅ README.md (always needed)
- ✅ DEPLOYMENT.md (operations essential)
- ✅ TROUBLESHOOTING.md (support reference)
- ✅ PNPM_GUIDE.md (daily dev tool)

**Examples of Inappropriate Root Files**:
- ❌ PHASE_X_COMPLETE.md (use archive structure)
- ❌ FEATURE_IMPLEMENTATION_PLAN.md (use specs/)
- ❌ [Date]_STATUS_UPDATE.md (consolidate or archive)
- ❌ TEMPORARY_NOTES.md (use local branches or temporary folder)

### Archive Lifecycle
1. **Active** (2+ weeks in root): Actively referenced
2. **Deprecated** (older than 2 weeks): Move to docs/archive/
3. **Archived** (in archive folder): Keep for historical reference
4. **Removed** (old archives): Delete after 6 months if not referenced

---

## ✅ Implementation Status

### Cleanup Completed ✅
- [x] Constitution updated to v1.2.0 (Documentation Organization principle)
- [x] Archive structure created: `docs/archive/phases/`
- [x] Phase 6 documentation organized
- [x] Phase 6 comprehensive report consolidated
- [x] Root directory cleared of obsolete files

### Root Directory Reduction
- **Before**: 25 markdown files
- **After**: 10 markdown files (8 active + 2 for Phase 6 reference)
- **Improvement**: 60% reduction in root directory clutter

### Sustainable Pattern Established ✅
- Phase completion → comprehensive report → archive structure
- Scales for Phase 7, 8, 9+
- Clear governance prevents future bloat

---

## 📞 References

**Constitution**: `.specify/memory/constitution.md` (v1.2.0+)  
**Archive Index**: `docs/archive/phases/PHASE_6_ARCHIVE_INDEX.md`  
**Phase 6 Summary**: `PHASE_6_COMPLETION_REPORT.md` (root)  
**Phase 7 Plan**: `PHASE_7_EXECUTION_PLAN.md` (root)  

---

**Last Updated**: 2025-10-30  
**Constitution Version**: 1.2.0  
**Status**: ✅ Implementation complete - Root directory clean

