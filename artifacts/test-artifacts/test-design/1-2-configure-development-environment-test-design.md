# Test Design: Story 1.2 - Configure Development Environment and Tools

## Document Metadata

| Property | Value |
|----------|-------|
| Story ID | 1.2 |
| Title | Configure Development Environment and Tools |
| Version | 1.0 |
| Date | 2026-04-19 |
| Test Design Mode | Epic-Level |

---

## 1. Test Objectives

| ID | Objective | Priority |
|----|-----------|----------|
| OBJ-1 | Verify Biome linting runs successfully via `pnpm lint` | P1 |
| OBJ-2 | Verify Biome formats code on save | P1 |
| OBJ-3 | Verify TypeScript strict mode is enabled and type checks pass | P1 |
| OBJ-4 | Verify environment variables are validated at startup | P1 |
| OBJ-5 | Verify missing required env vars cause fast failure | P1 |
| OBJ-6 | Verify DATABASE_URL is recognized as database connection string | P1 |
| OBJ-7 | Verify dev server fails immediately with descriptive error on missing env vars | P2 |
| OBJ-8 | Verify dev server starts successfully when all required vars provided | P1 |

---

## 2. Test Scenarios

### TS-01: Biome Linting Configuration

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-01 |
| Title | Biome runs successfully on `pnpm lint` |
| Description | Verify Biome linting command runs via npm script and returns appropriate exit codes |
| Preconditions | Biome is installed, project has source files in TypeScript |
| Test Data | Sample TypeScript file with intentional lintable issues |
| Test Steps | 1. Run command: `pnpm lint` <br> 2. Capture stdout and stderr <br> 3. Record exit code |
| Expected Result | Exit code 0 when no lint errors; exit code > 0 with descriptive output when errors exist |
| Acceptance Criteria | AC1 |
| Test Level | Integration |
| Dependencies | biome.json, package.json scripts |

### TS-02: Biome Format on Save

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-02 |
| Title | Biome formats code on save |
| Description | Verify Biome format command properly formats source files |
| Preconditions | Biome configured with formatter settings |
| Test Data | Source file with intentional formatting issues (wrong indent, extra spaces) |
| Test Steps | 1. Create test file with formatting issues <br> 2. Run command: `pnpm format` <br> 3. Verify file is formatted correctly via `pnpm format:check` |
| Expected Result | File formatted correctly, indentStyle: space, indentWidth: 2 |
| Acceptance Criteria | AC1 |
| Test Level | Unit |
| Dependencies | biome.json formatter config |

### TS-03: TypeScript Strict Mode

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-03 |
| Title | TypeScript strict mode is enabled |
| Description | Verify tsconfig.json has strict mode enabled and type checking passes |
| Preconditions | tsconfig.json exists in project root |
| Test Data | tsconfig.json contents |
| Test Steps | 1. Read tsconfig.json <br> 2. Verify `compilerOptions.strict === true` <br> 3. Verify additional strict flags: `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch` <br> 4. Run command: `pnpm type-check` |
| Expected Result | Configuration shows strict mode enabled, type-check command passes with exit code 0 |
| Acceptance Criteria | AC1 |
| Test Level | Configuration |
| Dependencies | tsconfig.json |

### TS-04: Environment Validation at Startup

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-04 |
| Title | Application validates required environment variables at startup |
| Description | Verify shared/config/env.ts provides validation logic that runs at module load |
| Preconditions | shared/config/env.ts exists with validation exports |
| Test Data | Valid env values for DATABASE_URL and AUTH_SECRET |
| Test Steps | 1. Read shared/config/env.ts <br> 2. Verify validateEnv or equivalent function exists <br> 3. Verify REQUIRED_ENV_VARS array <br> 4. Import module and verify exports work |
| Expected Result | Validation logic exists, exports DATABASE_URL and AUTH_SECRET |
| Acceptance Criteria | AC2 |
| Test Level | Unit |
| Dependencies | shared/config/env.ts |

### TS-05: Missing Env Vars Cause Fast Failure

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-05 |
| Title | Missing required variables cause fast failure with clear error messages |
| Description | Verify that when DATABASE_URL or AUTH_SECRET are missing/empty, validation throws descriptive error |
| Preconditions | Validation logic in shared/config/env.ts |
| Test Data | Empty string for DATABASE_URL; Empty string for AUTH_SECRET |
| Test Steps | Test Case 5a: <br> 1. Stub env: DATABASE_URL = "" <br> 2. Stub env: AUTH_SECRET = "valid-secret" <br> 3. Import env module <br> 4. Expect error to be thrown <br><br>Test Case 5b: <br> 1. Stub env: DATABASE_URL = "valid-url" <br> 2. Stub env: AUTH_SECRET = "" <br> 3. Import env module <br> 4. Expect error to be thrown |
| Expected Result | EnvValidationError or equivalent thrown with message containing variable name |
| Acceptance Criteria | AC2 |
| Test Level | Unit |
| Dependencies | shared/config/env.ts |

### TS-06: DATABASE_URL Recognition

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-06 |
| Title | DATABASE_URL is recognized as the database connection string |
| Description | Verify DATABASE_URL constant is exported and recognized as database connection string |
| Preconditions | shared/config/env.ts exists |
| Test Data | DATABASE_URL="postgresql://user:pass@localhost:5432/testdb" |
| Test Steps | 1. Set env stub: DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb" <br> 2. Set env stub: AUTH_SECRET = "valid-secret" <br> 3. Import DATABASE_URL constant <br> 4. Verify value is correct |
| Expected Result | DATABASE_URL constant exports correct value |
| Acceptance Criteria | AC2 |
| Test Level | Unit |
| Dependencies | shared/config/env.ts |

### TS-07: Dev Server Fast Failure

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-07 |
| Title | Server fails immediately with descriptive error when missing env vars |
| Description | Verify Next.js dev server fails with clear error when required env vars missing |
| Preconditions | Next.js dev server, env.ts validation on startup |
| Test Data | DATABASE_URL not set or empty |
| Test Steps | 1. Ensure DATABASE_URL is unset <br> 2. Start dev server: `pnpm dev` <br> 3. Capture startup output <br> 4. Verify error message is descriptive <br> 5. Terminate process |
| Expected Result | Server fails before accepting connections, shows clear error about missing DATABASE_URL |
| Acceptance Criteria | AC3 |
| Test Level | Integration |
| Dependencies | next.config.js, shared/config/env.ts |

### TS-08: Dev Server Successful Startup

| Attribute | Value |
|----------|-------|
| Scenario ID | TS-08 |
| Title | Server starts successfully when all required variables provided |
| Description | Verify dev server starts and listens on port when all required env vars are present |
| Preconditions | Valid .env file with DATABASE_URL and AUTH_SECRET |
| Test Data | DATABASE_URL and AUTH_SECRET set in environment |
| Test Steps | 1. Set required env vars <br> 2. Run command: `pnpm dev` <br> 3. Wait for server ready output <br> 4. Verify no env-related errors <br> 5. Verify server is listening |
| Expected Result | Server starts successfully without env errors |
| Acceptance Criteria | AC3 |
| Test Level | Integration |
| Dependencies | .env file, next dev |

---

## 3. Risk Assessment

| Risk ID | Risk Description | Category | Probability | Impact | Score | Mitigation | Owner |
|---------|----------------|----------|-------------|--------|-------|------------|-------|
| R-01 | Env validation not invoked at startup causing silent failures | OPS | 1 | 3 | 3 | Unit test validation runs on import | QA |
| R-02 | Biome linting configuration incorrect or missing | TECH | 1 | 2 | 2 | Test pnpm lint runs via CI | Dev |
| R-03 | TypeScript strict mode causes CI build failures | TECH | 2 | 2 | 4 | Pre-commit hook + CI validation | Dev |
| R-04 | Dev server hangs rather than fails fast | OPS | 1 | 2 | 2 | Timeout in test assertions | QA |

---

## 4. Test Data Requirements

| Data ID | Description | Source | Format | Required For |
|---------|-------------|--------|--------|-------------|
| TD-01 | Valid DATABASE_URL | .env.example | postgresql://user:pass@host:5432/db | TS-04, TS-06, TS-08 |
| TD-02 | Valid AUTH_SECRET | Generated | Base64 string | TS-04, TS-08 |
| TD-03 | Invalid DATABASE_URL | Empty string | (empty) | TS-05a |
| TD-04 | Invalid AUTH_SECRET | Empty string | (empty) | TS-05b |
| TD-05 | Source file with linting issues | Generated | .ts file | TS-01 |
| TD-06 | Formatted source file | Generated | .ts file | TS-02 |
| TD-07 | tsconfig.json | Project | JSON | TS-03 |

---

## 5. Expected Results Summary

| Scenario | Expected Outcome | Pass Criteria | Failing Condition |
|----------|-----------------|--------------|-----------------|
| TS-01 | Exit code 0 | No errors OR error list with details | Exit code 0 with errors present |
| TS-02 | All files formatted | `pnpm format:check` passes | Formatting diffs found |
| TS-03 | Type check passes | Exit code 0 from tsc | TS errors present |
| TS-04 | Validation exports available | Module imports without throwing | Module throws on import with valid vars |
| TS-05 | Error thrown | Descriptive error message | No error OR generic error |
| TS-06 | DATABASE_URL exported | Correct value returned | Wrong value OR undefined |
| TS-07 | Fast failure | Error before port listen | Server hangs OR starts |
| TS-08 | Server starts | Server ready message | Server error OR timeout |

---

## 6. Traceability Matrix

| Test Scenario | AC1 | AC2 | AC3 |
|---------------|-----|-----|-----|
| TS-01: Biome lint runs | ✓ | | |
| TS-02: Format on save | ✓ | | |
| TS-03: TS strict mode | ✓ | | |
| TS-04: Env validation | | ✓ | |
| TS-05: Missing vars fail fast | | ✓ | |
| TS-06: DATABASE_URL recognized | | ✓ | |
| TS-07: Server fails on missing | | | ✓ |
| TS-08: Server starts OK | | | ✓ |

---

## 7. Test Execution Order

| Phase | Test Scenario | Description |
|-------|--------------|-------------|
| 1 | TS-03 | Verify TypeScript strict BEFORE linting tests |
| 2 | TS-01, TS-02 | Biome configuration tests |
| 3 | TS-04, TS-05, TS-06 | Environment validation tests |
| 4 | TS-07, TS-08 | Dev server startup tests |

---

## 8. Notes

- TS-07 uses process timeout to detect hangs (fail if no output within 15 seconds)
- All unit tests can run via `pnpm test`
- Integration tests (TS-01, TS-07, TS-08) require dev server and should run separately
- Tests assume Node.js 18+ and pnpm 8+