#!/bin/bash

# Demo Readiness Checker Script
# Comprehensive validation for pre-demo quality assurance
# Usage: ./check-demo-readiness.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║   T-REX DEMO READINESS CHECKER v1.0       ║"
echo "║   Comprehensive Pre-Demo Validation       ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Helper functions
check_pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((CHECKS_PASSED++))
}

check_fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((CHECKS_FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((CHECKS_WARNING++))
}

# ============================================================
# SECTION 1: PROJECT STRUCTURE
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 1: PROJECT STRUCTURE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check required directories
if [ -d "src" ] && [ -d "public" ] && [ -d "package.json" ]; then
    check_pass "Project structure is correct"
else
    check_fail "Missing required directories (src, public, package.json)"
fi

# Check for docker-compose
if [ -f "docker-compose.yml" ]; then
    check_pass "docker-compose.yml exists"
else
    check_fail "docker-compose.yml not found"
fi

# Check for package.json
if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json not found"
fi

echo ""

# ============================================================
# SECTION 2: BRAND REMOVAL VERIFICATION
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 2: BRAND REMOVAL VERIFICATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

AA_INFORM_REFS=0

# Search in source code
if grep -r "AA.Inform\|AA Inform" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "//"; then
    AA_INFORM_REFS=$((AA_INFORM_REFS + 1))
fi

# Search in public HTML
if grep -r "AA.Inform\|AA Inform" public/ --include="*.html" 2>/dev/null; then
    AA_INFORM_REFS=$((AA_INFORM_REFS + 1))
fi

# Search in config
if grep -r "aainform\|aa-inform" . --include="*.json" --include="*.yaml" --include="*.yml" 2>/dev/null | grep -v node_modules | grep -v ".git"; then
    AA_INFORM_REFS=$((AA_INFORM_REFS + 1))
fi

if [ $AA_INFORM_REFS -eq 0 ]; then
    check_pass "No AA Inform references found in codebase"
else
    check_warn "Potential AA Inform references detected - manual review recommended"
fi

echo ""

# ============================================================
# SECTION 3: DEBUG CODE REMOVAL
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 3: DEBUG CODE REMOVAL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

DEBUG_FOUND=0

# Check for console.log statements (excluding comments)
if grep -r "console\.log" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "//" | grep -v "\/\*" | grep -v "console.error"; then
    check_warn "console.log() calls found - should be removed for production"
    DEBUG_FOUND=1
else
    check_pass "No console.log() calls in source code"
fi

# Check for debugger statements
if grep -r "debugger" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null; then
    check_fail "debugger statements found - must be removed"
    DEBUG_FOUND=1
else
    check_pass "No debugger statements found"
fi

# Check for test/mock data
if grep -r "MOCK_\|TEST_\|DEMO_DATA" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "//" | grep -v "\/\*"; then
    check_warn "Test data references found - verify they're not exported"
    DEBUG_FOUND=1
else
    check_pass "No obvious test data in source code"
fi

# Check for debug UI components
if grep -r "showDebug\|DEBUG_MODE\|debugUI\|<Debug" src/ --include="*.tsx" 2>/dev/null; then
    check_fail "Debug UI components found - must be removed"
    DEBUG_FOUND=1
else
    check_pass "No debug UI components found"
fi

echo ""

# ============================================================
# SECTION 4: DEPENDENCIES
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 4: DEPENDENCIES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_pass "Dependencies installed (node_modules exists)"
else
    check_warn "node_modules not found - run 'pnpm install'"
fi

# Check for React
if grep -q '"react"' package.json; then
    REACT_VERSION=$(grep '"react"' package.json | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
    check_pass "React dependency found (version: $REACT_VERSION)"
else
    check_fail "React dependency not found in package.json"
fi

# Check for Material-UI
if grep -q '"@mui/material"' package.json; then
    check_pass "Material-UI dependency found"
else
    check_fail "Material-UI (@mui/material) not found in package.json"
fi

echo ""

# ============================================================
# SECTION 5: BUILD & COMPILATION
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 5: BUILD & COMPILATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if build script exists
if grep -q '"build"' package.json; then
    check_pass "Build script defined in package.json"
else
    check_warn "No build script found in package.json"
fi

# Check for TypeScript config
if [ -f "tsconfig.json" ]; then
    check_pass "tsconfig.json exists"
else
    check_warn "tsconfig.json not found - TypeScript configuration may not be optimal"
fi

# Check for webpack/build config
if [ -f "webpack.config.js" ] || [ -f "vite.config.ts" ] || [ -f "next.config.js" ]; then
    check_pass "Build configuration file exists"
else
    check_warn "No standard build configuration found (webpack/vite/next)"
fi

echo ""

# ============================================================
# SECTION 6: ENVIRONMENT CONFIGURATION
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 6: ENVIRONMENT CONFIGURATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check for .env files
if [ -f ".env.example" ] || [ -f ".env.local" ]; then
    check_pass "Environment configuration template exists"
else
    check_warn "No .env.example or .env.local found - configuration may be needed"
fi

# Check for environment variables in package.json
if grep -q "REACT_APP_\|VITE_\|NEXT_PUBLIC_" package.json .env* 2>/dev/null; then
    check_pass "Environment variables configured"
else
    check_warn "No environment variables found - verify configuration"
fi

echo ""

# ============================================================
# SECTION 7: DOCKER SETUP
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 7: DOCKER SETUP${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if Docker is installed
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    check_pass "Docker installed (version: $DOCKER_VERSION)"
else
    check_fail "Docker not installed - required for demo deployment"
fi

# Check if Docker daemon is running
if docker ps &> /dev/null; then
    check_pass "Docker daemon is running"
else
    check_fail "Docker daemon is not running - start Docker before demo"
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | awk '{print $3}' | sed 's/,//')
    check_pass "docker-compose installed (version: $COMPOSE_VERSION)"
else
    if docker compose version &> /dev/null; then
        check_pass "Docker Compose (plugin) available"
    else
        check_fail "docker-compose not available"
    fi
fi

# Check Dockerfile
if [ -f "Dockerfile" ]; then
    check_pass "Dockerfile exists"
else
    check_warn "Dockerfile not found - Docker image may need to be created"
fi

echo ""

# ============================================================
# SECTION 8: DOCUMENTATION
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 8: DOCUMENTATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check for README
if [ -f "README.md" ]; then
    check_pass "README.md exists"
else
    check_warn "README.md not found"
fi

# Check for deployment docs
if [ -f "DEPLOYMENT.md" ]; then
    check_pass "DEPLOYMENT.md exists"
else
    check_warn "DEPLOYMENT.md not found"
fi

# Check for customer demo package
if [ -f "CUSTOMER_DEMO_PACKAGE.md" ]; then
    check_pass "CUSTOMER_DEMO_PACKAGE.md exists"
else
    check_warn "CUSTOMER_DEMO_PACKAGE.md not found"
fi

# Check for ADRs
if [ -d "specs/001-remove-host-theme/decisions" ]; then
    ADR_COUNT=$(find specs/001-remove-host-theme/decisions -name "ADR-*.md" 2>/dev/null | wc -l)
    if [ "$ADR_COUNT" -gt 0 ]; then
        check_pass "Architecture Decision Records found ($ADR_COUNT files)"
    else
        check_warn "decisions folder exists but no ADRs found"
    fi
else
    check_warn "Architecture Decision Records folder not found"
fi

echo ""

# ============================================================
# SECTION 9: GIT STATUS
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 9: GIT STATUS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if git repo
if [ -d ".git" ]; then
    check_pass "Git repository initialized"
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        check_pass "All changes committed (clean working tree)"
    else
        check_warn "Uncommitted changes detected - consider committing before demo"
    fi
else
    check_warn "Not a git repository"
fi

echo ""

# ============================================================
# SECTION 10: QUICK TESTS
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SECTION 10: QUICK TESTS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check for test files
if find src -name "*.test.ts*" -o -name "*.spec.ts*" 2>/dev/null | grep -q .; then
    check_pass "Test files found"
else
    check_warn "No test files found (*.test.ts, *.spec.ts)"
fi

# Check for test script
if grep -q '"test"' package.json; then
    check_pass "Test script defined"
else
    check_warn "No test script in package.json"
fi

echo ""

# ============================================================
# SUMMARY
# ============================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNING))

echo ""
echo "Results:"
echo -e "  ${GREEN}✅ Passed:  $CHECKS_PASSED${NC}"
echo -e "  ${YELLOW}⚠️  Warnings: $CHECKS_WARNING${NC}"
echo -e "  ${RED}❌ Failed:  $CHECKS_FAILED${NC}"
echo -e "  Total:  $TOTAL_CHECKS"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    if [ $CHECKS_WARNING -eq 0 ]; then
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}🎉 ALL CHECKS PASSED - READY FOR DEMO! 🎉${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 0
    else
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}⚠️  READY FOR DEMO - BUT REVIEW WARNINGS ⚠️${NC}"
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 0
    fi
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ DEMO NOT READY - FIX FAILURES FIRST ❌${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
