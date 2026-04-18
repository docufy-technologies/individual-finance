# Test Design: Story 1.1 - Initialize Next.js Project Scaffold

## Overview

- **Story ID**: 1-1-initialize-nextjs-project-scaffold  
- **Status**: review
- **Created**: April 19, 2025
- **Mode**: Epic-Level Test Design
- **Test Architect**: Murat

---

## 1. Story Context

The story covers initialization of a Next.js project with:
- Next.js 16.2.4 with App Router, TypeScript, Biome
- shadcn/ui with base preset
- Calm Trust Blue design tokens (#2563EB primary, #60A5FA secondary, #14B8A6 accent, #F8FAFC surface, #0F172A text)
- Root-level directory structure (no src/): app/, features/, entities/, components/, shared/, server/, prisma/
- Import alias "@/*" configured in tsconfig.json

---

## 2. Risk Assessment

### 2.1 Identified Risks

| ID | Risk Category | Risk Description | Probability (1-3) | Impact (1-3) | Risk Score | Priority | Mitigation |
|----|--------------|------------------|------------------|--------------|------------|----------|------------|
| R1 | TECH | Configuration mismatch causes runtime errors | 2 | 3 | 6 | HIGH | Verify build passes before acceptance |
| R2 | TECH | Import alias misconfiguration breaks imports | 2 | 3 | 6 | HIGH | Run lint and verify no import warnings |
| R3 | OPS | Missing biome schema version causes lint failure | 2 | 2 | 4 | MEDIUM | Verify biome.json schema matches @biomejs/biome version |
| R4 | TECH | shadcn/ui components not properly installed | 1 | 3 | 3 | MEDIUM | Verify components/ui/button.tsx exists and can be imported |
| R5 | DATA | Design tokens not applied to CSS variables | 2 | 2 | 4 | MEDIUM | Verify colors in app/globals.css match tokens |
| R6 | OPS | Development server fails to start | 1 | 3 | 3 | LOW | Verify pnpm dev runs without errors |

### 2.2 High Priority Risks

**R1 - Configuration mismatch (Risk Score: 6)**
- Mitigation: `pnpm type-check` must pass before story is accepted
- Owner: Developer
- Timeline: Before story completion

**R2 - Import alias (Risk Score: 6)**
- Mitigation: Run `pnpm lint` and verify no alias-related warnings
- Owner: Developer  
- Timeline: Before story completion

---

## 3. Test Coverage Strategy

### 3.1 Test Level Selection (Based on Test Pyramid)

| Acceptance Criteria | Test Level | Rationale |
|--------------------|------------|-----------|
| AC1: Project initialization with create-next-app | Unit | Verify configuration files are valid YAML/JSON |
| AC2: Directory structure verification | Unit | Verify directory layout exists |
| AC3: shadcn/ui initialization | Integration | Verify component can be imported |
| AC4: Design token configuration | Integration | Verify CSS variables are set correctly |
| AC5: Development server verification | E2E | Build and start server |

### 3.2 Unit Tests

**Purpose:** Verify configuration files are valid and properly structured

#### Test Suite 1: Configuration Validation

| Test ID | Test Description | Test Method | Priority | Pass Criteria |
|--------|----------------|------------|----------|-------------|
| UT-001 | tsconfig.json is valid TypeScript config | Parse JSON, verify structure | P0 | Valid JSON, contains "@/*" alias |
| UT-002 | biome.json schema version matches installed biome | Parse JSON, compare versions | P0 | Schema version = 2.2.0 |
| UT-003 | tailwind.config.ts is valid Tailwind config | Parse and validate | P0 | Valid JS config |
| UT-004 | next.config.ts loads without errors | Require/import config | P0 | No syntax errors |
| UT-005 | package.json has required scripts | Parse JSON, verify scripts | P0 | Contains dev, build, lint scripts |

#### Test Suite 2: Directory Structure

| Test ID | Test Description | Test Method | Priority | Pass Criteria |
|--------|----------------|------------|----------|-------------|
| UT-006 | Root directories exist | Check filesystem | P0 | app/, features/, entities/, components/, shared/, server/, prisma/ exist |
| UT-007 | No src/ folder exists | Check filesystem | P1 | src/ directory does not exist |
| UT-008 | components/ui/ directory exists | Check filesystem | P0 | components/ui/ exists |

### 3.3 Integration Tests

**Purpose:** Verify components work together and configurations are applied correctly

#### Test Suite 3: shadcn/ui Integration

| Test ID | Test Description | Test Method | Priority | Pass Criteria |
|--------|----------------|------------|----------|-------------|
| IT-001 | Button component imports correctly | Import component in test | P0 | No import errors |
| IT-002 | Button renders without crash | Render in test environment | P0 | Component renders |
| IT-003 | lib/utils.ts provides cn utility | Test cn() function | P1 | cn() returns string |

#### Test Suite 4: Design Tokens Integration

| Test ID | Test Description | Test Method | Priority | Pass Criteria |
|--------|----------------|------------|----------|-------------|
| IT-004 | CSS variables include primary color | Parse globals.css | P0 | #2563EB found in file |
| IT-005 | CSS variables include accent color | Parse globals.css | P0 | #14B8A6 found in file |
| IT-006 | CSS variables include secondary color | Parse globals.css | P1 | #60A5FA found in file |
| IT-007 | CSS variables include surface color | Parse globals.css | P1 | #F8FAFC found in file |

### 3.4 E2E Tests

**Purpose:** Verify the full development workflow works

#### Test Suite 5: Development Server

| Test ID | Test Description | Test Method | Priority | Pass Criteria |
|--------|----------------|------------|----------|-------------|
| E2E-001 | TypeScript type-check passes | Run pnpm type-check | P0 | Exit code 0 |
| E2E-002 | Biome lint passes | Run pnpm lint | P0 | Exit code 0 |
| E2E-003 | Next.js build compiles | Run pnpm build | P0 | Exit code 0 |
| E2E-004 | Dev server starts without crash | Run pnpm dev, check response | P1 | Server responds on port 3000 |

---

## 4. Coverage Matrix

### 4.1 Requirements Traceability

| Requirement | Test Coverage | Coverage Type |
|--------------|--------------|---------------|
| AC1: Project Initialization | UT-001, UT-002, UT-003, UT-004, UT-005 | Direct |
| AC2: Directory Structure | UT-006, UT-007, UT-008 | Direct |
| AC3: shadcn/ui Initialization | UT-008, IT-001, IT-002 | Direct |
| AC4: Design Tokens | IT-004, IT-005, IT-006, IT-007 | Direct |
| AC5: Dev Server Verification | E2E-001, E2E-002, E2E-003, E2E-004 | Direct |

### 4.2 Coverage Summary

- **Total Tests**: 20
- **Unit Tests**: 8
- **Integration Tests**: 7
- **E2E Tests**: 4
- **Coverage Target**: 100% of acceptance criteria

---

## 5. Test Priorities

### 5.1 Priority Definitions (Based on Test Risk)

- **P0 (Critical)**: Must pass; blocks story completion
- **P1 (High)**: Should pass; verified before merge
- **P2 (Medium)**: Nice to have; verified in CI
- **P3 (Low)**: Exploratory; run on demand

### 5.2 Priority Distribution

| Priority | Count | % of Total |
|----------|-------|------------|
| P0 | 12 | 60% |
| P1 | 6 | 30% |
| P2 | 2 | 10% |
| P3 | 0 | 0% |

---

## 6. Execution Strategy

### 6.1 Test Execution Model

**PR Pipeline (Run on every PR):**
- All P0 tests (~12 tests): ~5-10 minutes
- All P1 tests (~6 tests): ~5-8 minutes
- Total PR runtime: ~10-18 minutes

**Nightly/Weekly Pipeline:**
- All tests including P2 (~2 tests): +2-5 minutes

### 6.2 Test Tooling Recommendations

| Tool | Purpose | Justification |
|------|---------|--------------|
| **Vitest** | Unit + Integration testing | Native support for TypeScript, fast runtime |
| **Playwright** | E2E testing | Best for Next.js, supports App Router |
| **Biome** | Linting (already in project) | Replaces ESLint for lint checks |
| **Next.js type-check** | Type validation | Built-in tsc integration |

---

## 7. Quality Gates

### 7.1 Definition of Done (DoD)

- All P0 tests pass (100%)
- All P1 tests pass (≥95%)
- Type-check passes
- Build compiles without errors
- No lint violations

### 7.2 Coverage Requirements

- Minimum coverage target: 80% (can be adjusted)
- For this story: Configuration-centric (no business logic), coverage target is implicit 100% since all configs are verified

---

## 8. Test Architecture Recommendations

### 8.1 Framework Stack

```
test/
├── unit/                    # Unit tests (Vitest)
│   ├── config/
│   │   ├── tsconfig.test.ts
│   │   ├── biome.test.ts
│   │   └── directory.test.ts
│   └── setup.ts
├── integration/              # Integration tests (Vitest)
│   ├── shadcn/
│   │   └── button.test.tsx
│   └── design-tokens/
│       └── tokens.test.ts
└── e2e/                 # E2E tests (Playwright)
    └── server.spec.ts
```

### 8.2 Test Configuration

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/unit/**/*.test.ts', 'test/integration/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

---

## 9. Resource Estimates

| Test Priority | Estimated Hours | Notes |
|-------------|---------------|-------|
| P0 | 1-2 hours | Configuration validation tests |
| P1 | 1-2 hours | Integration tests |
| P2 | 0.5-1 hour | Additional E2E checks |
| **Total** | **2.5-5 hours** | Initial test setup + execution |

Note: These estimates are for ONE-TIME test creation. Ongoing test execution is much faster.

---

## 10. Conclusion

This test design provides a comprehensive risk-based testing strategy for the Next.js project scaffold story. Key points:

1. **Risk-Based Approach**: Configuration risks are prioritized (R1, R2 = score 6)
2. **Test Pyramid**: Favor unit/integration over E2E for faster feedback
3. **Clear Quality Gates**: P0 = 100% pass, P1 ≥ 95% pass
4. **Scalable Architecture**: Vitest + Playwright stack with clear separation
5. **Fast Feedback**: PR pipeline completes in ~10-18 minutes

### Next Steps

1. Initialize test framework (use testarch-framework skill)
2. Implement unit tests in test/unit/ configuration
3. Implement integration tests for shadcn/ui
4. Configure Playwright for E2E tests
5. Set up CI/CD quality gates

---

**Document Status**: Draft  
**Review Required**: Before Epic 1 implementation begins