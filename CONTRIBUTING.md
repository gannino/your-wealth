# Contributing to Your Wealth

Thank you for your interest in contributing to Your Wealth! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed and configured
- GitHub account
- Familiarity with React, TypeScript, and Vite

### Initial Setup

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/your-wealth.git
cd your-wealth

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name
```

## 🏗 Development Workflow

### Making Changes

1. **Create a feature branch** from `main`
2. **Make your changes** following our code style
3. **Write/update tests** for your changes
4. **Run tests locally** to ensure everything passes
5. **Commit your changes** with clear messages
6. **Push to your fork** and create a Pull Request

### Code Style Guidelines

- **TypeScript**: Use types for all function parameters and return values
- **Components**: Use functional components with hooks
- **Naming**: 
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Functions: camelCase (e.g., `calculateCompoundGrowth`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_AGE`)
- **Comments**: Add JSDoc comments for exported functions
- **Files**: One component/export per file

### Testing Guidelines

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm test:coverage
```

- Write tests for new features
- Maintain test coverage above 75%
- Test edge cases and error conditions
- Use descriptive test names

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Tests pass locally (`npm test` and `npm run test:e2e`)
- [ ] Documentation updated if needed
- [ ] Commits follow our commit message conventions
- [ ] No merge conflicts with `main` branch

### Submitting a Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub
   - Clear title describing the change
   - Detailed description of changes
   - Reference related issues
   - Screenshots for UI changes

3. **Address review feedback**
   - Respond to comments promptly
   - Make requested changes
   - Push updates to your branch

### PR Review Process

- Automated checks must pass (tests, linting)
- At least one maintainer approval required
- Resolves all review feedback
- No merge conflicts

## 🐛 Bug Reports

### Before Creating a Bug Report

- Check existing issues
- Try to reproduce with latest version
- Gather relevant information

### Bug Report Template

```markdown
**Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node.js version: [e.g. 20.0.0]

**Additional Context**
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Guidelines

- Check if feature already exists or is planned
- Explain the use case clearly
- Consider if it fits the project scope
- Provide examples/mockups if possible

## 📖 Project Structure

```
your-wealth/
├── src/
│   ├── components/       # React components
│   │   ├── training/     # Training modules
│   │   ├── assessments/  # Assessment components
│   │   ├── shared/       # Shared UI components
│   │   └── ...
│   ├── lib/             # Business logic
│   │   ├── training/     # Content loading
│   │   ├── calculations/ # Financial calculations
│   │   └── assessments/  # Scoring logic
│   ├── stores/          # Zustand state management
│   └── __tests__/       # Unit tests
├── e2e/                # Playwright E2E tests
├── public/             # Static assets
├── scripts/            # Build and deployment scripts
└── docs/              # Additional documentation
```

## 🎯 Development Priorities

Current focus areas:
- Bug fixes
- Performance improvements
- Test coverage
- Documentation
- Accessibility improvements

## 💬 Communication

- **GitHub Issues**: For bugs and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For questions and ideas

## 📜 Commit Message Conventions

Use clear, descriptive commit messages:

```
feat: add user profile page
fix: resolve calculation bug in retirement module
docs: update contributing guidelines
test: add tests for compound growth calculations
refactor: simplify state management
```

## ✨ Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## 🤔 Questions?

- Check existing [Issues](../../issues)
- Read [Architecture Guide](ARCHITECTURE.md)
- Review [Testing Guide](TESTING.md)
- Start a [Discussion](../../discussions)

---

Thank you for contributing to Your Wealth! 🎉
