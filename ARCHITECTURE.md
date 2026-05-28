# Architecture Documentation

## Overview

Your Wealth is a financial education platform built with React 18, TypeScript, and Vite. It combines content from two Tony Robbins books into a unified 5-module training curriculum with integrated assessments and progress tracking.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI framework |
| **Language** | TypeScript 5+ | Type safety |
| **Build** | Vite 8+ | Fast dev server, optimized builds |
| **State** | Zustand | Lightweight state management |
| **Routing** | React Router v6+ | Client-side routing |
| **Testing** | Vitest + Playwright | Unit/integration + E2E |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Sanitization** | DOMPurify | XSS protection |

## Project Structure

```
mvp/
├── src/
│   ├── components/          # React components
│   │   ├── training/        # Training modules (5 modules)
│   │   ├── assessments/     # Blueprint, financial data
│   │   ├── psychology/      # Psychology assessment flow
│   │   ├── planning/        # Financial plan generation
│   │   ├── results/         # Results dashboard
│   │   └── shared/          # Shared UI components
│   ├── lib/                 # Core business logic
│   │   ├── training/        # Content loading, module mapping
│   │   ├── assessments/     # Enhanced scoring, recommendations
│   │   └── calculations/    # Financial calculations
│   ├── stores/              # Zustand state stores
│   │   ├── trainingStore.ts # Training progress, knowledge checks
│   │   ├── psychologyStore.ts # Psychology assessment state
│   │   └── financialDataStore.ts # User financial data
│   ├── __tests__/           # Unit tests
│   ├── integration/__tests__/ # Integration tests
│   └── main.tsx             # App entry point
├── e2e/                     # Playwright E2E tests
├── public/                  # Static assets
├── dist/                    # Build output
└── index.html               # HTML entry point
```

## Core Architecture

### Content Layer

```
Source Skills (existing agents)
    ↓
Content Mapping Layer (NEW)
    ↓
Training Module Layer (NEW)
    ↓
Assessment Layer (ENHANCED)
```

#### 1. Source Skills

- `/money-master-the-game`: 52 chapters
- `/unshakable`: 9 chapters
- **Location**: Agent skill files (not in MVP codebase)

#### 2. Content Mapping Layer

**Purpose**: Maps training modules to specific skill chapters

**Key Files**:
- `lib/training/moduleContentMap.ts`: Module → Chapter mapping
- `lib/training/contentLoader.ts`: Browser-compatible content loading

**Interface**:
```typescript
interface ChapterReference {
  skill: string;      // 'unshakable' | 'money-master-the-game'
  chapter: string;    // 'ch01-unshakeable.md'
  title: string;
}
```

#### 3. Training Module Layer

**Purpose**: Deliver structured training content with knowledge checks

**Components**:
- 5 training modules (Foundation, Myth-Busting, Strategy, Execution, Mastery)
- Knowledge check types: Quiz, Reflection, Scenario, Calculation
- Progress tracking with Zustand store

#### 4. Assessment Layer

**Purpose**: Evaluate user knowledge and generate personalized recommendations

**Components**:
- Blueprint Assessment: Financial baseline
- Enhanced Scoring: Training-aware scoring algorithm
- Recommendation Engine: Personalized module suggestions
- Progress Dashboard: Achievement tracking

## State Management

### Zustand Stores

All state managed through Zustand with localStorage persistence:

#### trainingStore

```typescript
interface TrainingState {
  // Module progress
  moduleProgress: Record<string, ModuleProgress>;
  
  // Knowledge check results
  knowledgeCheckResults: Record<string, KnowledgeCheckResult>;
  
  // User reflections
  reflections: Record<string, Reflection>;
  
  // Achievements
  achievements: Achievement[];
  
  // Actions
  startModule: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
  recordKnowledgeCheck: (checkId: string, result: CheckResult) => void;
  saveReflection: (promptId: string, response: string) => void;
  resetProgress: () => void;
}
```

#### psychologyStore

Psychology assessment state with 5-step flow

#### financialDataStore

User financial profile (income, expenses, investments, goals)

## Data Flow

### Training Flow

```
User → TrainingHub → Select Module
    ↓
Module Component → Load Content (contentLoader)
    ↓
Display Content → Knowledge Check → Record Results
    ↓
Complete Module → Update Progress → Unlock Achievements
```

### Assessment Flow

```
User → Blueprint Assessment → Calculate Scores
    ↓
Training Completion → Enhanced Scoring (boosts blueprint)
    ↓
Generate Recommendations → Display on Dashboard
    ↓
Track Progress → Update as modules complete
```

## Key Design Patterns

### 1. Content Orchestration

**Problem**: Need to map 5 modules to content from 2 separate book sources

**Solution**: Abstract content mapping layer that:
- Defines which chapters belong to each module
- Handles content loading (browser-compatible)
- Caches loaded content for performance

### 2. Enhanced Scoring

**Problem**: Training should improve assessment scores

**Solution**: Weighted scoring formula:
```
Enhanced Score = (Blueprint Score × 0.7) + (Training Score × 0.3)
```

Training modules weighted by importance:
- Module 1 (Foundation): 25%
- Module 2 (Myth-Busting): 20%
- Module 3 (Strategy): 25%
- Module 4 (Execution): 15%
- Module 5 (Mastery): 15%

### 3. Progressive Enhancement

**Problem**: Don't overwhelm users with all content at once

**Solution**:
- Unlock modules sequentially
- Show progress indicators
- Celebrate achievements (badges, tips)
- Personalize recommendations based on gaps

### 4. Browser Compatibility

**Problem**: Node.js APIs not available in browser

**Solution**: `SkillContentLoader` class with:
- Fallback content for all chapters
- No filesystem access required
- Production-ready for API integration

## Performance Optimization

### Code Splitting

**Implementation**: React.lazy() + Suspense

**Results**:
- Main bundle: 279 KB (down from 518 KB)
- 22 lazy chunks: 1-64 KB each
- 46% reduction in initial load

**Strategy**:
- Lazy load all route components
- Show loading fallback during chunk load
- Main bundle loads instantly

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts'],
        }
      }
    }
  }
});
```

## Security

### XSS Protection

**Implementation**: DOMPurify sanitization

**Usage**:
```typescript
import DOMPurify from 'dompurify';

const safeHtml = DOMPurify.sanitize(userInput);
```

**Applied to**:
- User reflections
- Knowledge check responses
- Any user-generated content

## Testing Architecture

### Unit Tests

**Scope**: Individual functions, components, utilities

**Tools**: Vitest, @testing-library/react

**Coverage Target**: 80%+

### Integration Tests

**Scope**: Multi-component flows, state integration

**Tools**: Vitest, renderHook

**Status**: 3/35 passing (known technical debt)

### E2E Tests

**Scope**: Complete user journeys

**Tools**: Playwright

**Coverage**:
- Training journey (all 5 modules)
- Assessment journey
- Full app journey

## Deployment

### Build Process

```bash
npm run build
# Outputs to: dist/
# - index.html
# - assets/*.css
# - assets/*.js (code-split chunks)
```

### Environment Variables

```env
VITE_APP_TITLE=Your Wealth
VITE_API_BASE_URL=https://api.example.com
```

### Hosting

**Compatible with**: Any static hosting
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## Future Enhancements

### Short-term

1. **API Integration**: Replace fallback content with API calls
2. **Enhanced Scoring Refactor**: Fix integration test architecture
3. **Accessibility Audit**: WCAG 2.1 AA compliance

### Long-term

1. **Real Collaboration**: Share progress between users
2. **Advanced Analytics**: Track learning patterns
3. **Mobile App**: React Native implementation
4. **Offline Support**: Service worker for offline mode

## Contributors

- Giovanni Annino (Project Owner)
- Claude Code (AI Assistant)

## License

Proprietary - All rights reserved
