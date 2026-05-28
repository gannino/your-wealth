# Testing Guide

## Overview

This project uses a comprehensive testing strategy with unit tests, integration tests, and E2E tests to ensure code quality and reliability.

## Test Stack

- **Unit/Integration Tests**: Vitest
- **E2E Tests**: Playwright
- **Test Location**: `src/__tests__/` and `src/integration/__tests__/`
- **E2E Location**: `e2e/`

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Run specific test file
npm test src/__tests__/calculations/compound-growth.test.ts
```

### Integration Tests

```bash
# Integration tests run with unit tests
npm test

# Run only integration tests
npm test src/integration/__tests__/
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific E2E test
npx playwright test e2e/training-journey.spec.ts
```

## Test Coverage

Current coverage: **78%** (87/111 tests passing)

### Coverage by Module

- **Calculations**: 95%+ coverage
  - Compound growth: 30 tests
  - Inflation: 25 tests
  - Retirement: 20 tests
  - Tax: 12 tests

- **Training**: 70% coverage
  - Content loading
  - State management
  - Module navigation

- **Integration**: 40% coverage
  - 3/35 tests passing (known issue with enhancedScoring.ts architecture)

## Test Structure

### Unit Tests

Located in `src/__tests__/`:

```
src/__tests__/
├── fixtures/
│   └── sampleFinancialData.ts    # Verified test data
├── calculations/
│   ├── compound-growth.test.ts   # 30 tests
│   ├── inflation.test.ts         # 25 tests
│   ├── retirement.test.ts        # 20 tests
│   └── tax.test.ts               # 12 tests
└── ...
```

### Integration Tests

Located in `src/integration/__tests__/`:

```
src/integration/__tests__/
├── training-flow.test.ts         # Training module integration
└── assessment-flow.test.ts       # Assessment integration
```

### E2E Tests

Located in `e2e/`:

```
e2e/
├── training-journey.spec.ts      # Full training flow
├── assessment-journey.spec.ts    # Assessment flow
└── full-app-journey.spec.ts      # Complete user journey
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { calculateCompoundGrowth } from '../calculations';

describe('Compound Growth', () => {
  it('should calculate correctly for 10 years at 7%', () => {
    const result = calculateCompoundGrowth({
      principal: 10000,
      rate: 7,
      years: 10,
    });
    expect(result.finalAmount).toBeCloseTo(19671.51, 2);
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrainingStore } from '../stores/trainingStore';

describe('Training Flow', () => {
  beforeEach(() => {
    useTrainingStore.getState().resetProgress();
  });

  it('should track module completion', () => {
    const { result } = renderHook(() => useTrainingStore());
    act(() => {
      result.current.completeModule('module-1-foundation');
    });
    expect(result.current.isModuleComplete('module-1-foundation')).toBe(true);
  });
});
```

## Known Issues

### Integration Tests

**Status**: 32 integration tests failing due to `enhancedScoring.ts` architecture

**Issue**: Hook-based design in `enhancedScoring.ts` prevents proper isolation in integration tests

**Impact**: Training → Assessment integration cannot be fully tested

**Resolution**: Documented as technical debt; refactoring planned for future

### Browser Compatibility

**Status**: E2E tests use `contentLoader.ts` fallback content

**Issue**: Node.js `fs/promises` not available in browser

**Workaround**: `SkillContentLoader` class provides fallback content

## Test Data

### Verified Sample Data

All calculation tests use data verified against external sources:
- **investor.gov**: Compound growth calculator
- **bankrate.com**: Inflation calculator
- Official sources for tax brackets, contribution limits

See `src/__tests__/fixtures/sampleFinancialData.ts` for complete dataset.

## CI/CD Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Before deployment

## Troubleshooting

### Tests Failing Locally

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clear Vitest cache
npm test -- --clearCache

# Update Playwright browsers
npx playwright install
```

### Flaky E2E Tests

E2E tests use stable selectors and explicit waits. If tests fail:

1. Check if dev server is running on correct port
2. Ensure no browser dialogs are blocking
3. Try running in headed mode to see what's happening

```bash
npm run test:e2e:headed
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Test names should explain what they test
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Use fixtures for test data
5. **Test Edge Cases**: Include empty/invalid inputs
6. **Keep Tests Fast**: Unit tests should run in milliseconds
