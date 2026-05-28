# Your Wealth

[![CI/CD - Deploy to GitHub Pages](https://github.com/gannino/your-wealth/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/gannino/your-wealth/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/gannino/your-wealth/branch/main/graph/badge.svg)](https://codecov.io/gh/gannino/your-wealth)

A comprehensive financial education platform built with React 19, TypeScript, and Vite.

## ⚠️ Important Disclaimer

**This is NOT financial advice.** This application is for **educational purposes only**.

This tool is inspired by the principles and strategies presented in Tony Robbins' books:
- *MONEY Master the Game: 7 Simple Steps to Financial Freedom*
- *Unshakeable: Your Financial Freedom Playbook*

**The purpose of this application is to help you:**
- Visualize estimated timelines to reach financial security, vitality, and freedom
- Understand the impact of savings rates, investment returns, and time
- Learn fundamental concepts about asset allocation and fee structures
- Explore different scenarios and their potential outcomes

**What this tool does NOT do:**
- Provide personalized financial recommendations
- Offer investment advice or suggest specific investments
- Guarantee any financial outcomes
- Consider your complete financial situation

**Before making any financial decisions:**
- Consult with qualified financial advisors, tax professionals, or attorneys
- Consider your individual circumstances, risk tolerance, and goals
- Understand that past performance does not guarantee future results
- Be aware that all projections are estimates based on assumptions

**Use this tool as a starting point for learning and discussion, not as a substitute for professional financial guidance.**

## 🌟 Features

**Training Modules:**
- **5-Module Training Curriculum**: Foundation, Myth-Busting, Strategy, Execution, Mastery
- **Knowledge Checks**: Quizzes, reflections, scenarios, and calculations
- **Progress Tracking**: Achievement system and dynamic tips

**Psychology Assessment:**
- **Mindset Assessment**: Evaluate your current psychology around money
- **Limiting Beliefs**: Identify and transform money beliefs that hold you back
- **Belief Transformation**: Replace limiting beliefs with empowering ones
- **Success Formula**: Learn the pattern that creates lasting change
- **Action Commitment**: Create specific action steps to move forward
- **Personalized Results**: Comprehensive psychology profile with recommendations

**Planning Tools:**
- **Financial Blueprint**: Assessment of your current financial situation
- **Scenario Comparison**: Compare conservative, current, and aggressive scenarios
- **Goal Visualization**: See your path to Security, Vitality, and Independence
- **Retirement Projections**: Understand when and how you can reach financial freedom

**Technical:**
- **Performance Optimized**: 46% smaller initial bundle (279 KB)
- **100% Client-Side**: All data stored locally in your browser
- **No Server Required**: Works entirely offline after initial load

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gannino/your-wealth.git
cd your-wealth

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
your-wealth/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── lib/              # Business logic
│   ├── stores/           # State management
│   └── __tests__/        # Unit tests
├── e2e/                   # Playwright E2E tests
├── public/                # Static assets
├── scripts/               # Build and deployment scripts
├── docs/                  # Additional documentation
└── deployment-files/      # GitHub Pages deployment files
```

## 🛠 Tech Stack

- **React 19** + **TypeScript**
- **Vite** for fast builds
- **Zustand** for state management
- **React Router v7** for navigation
- **Tailwind CSS** for styling
- **Vitest** + **Playwright** for testing

## 🧪 Testing

```bash
# Unit tests
npm test

# Unit tests with UI
npm run test:ui

# Coverage report
npm test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## 📦 Deployment

### Automatic Deployment to GitHub Pages

This repository includes automatic deployment to GitHub Pages via GitHub Actions.

#### Setup:

1. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

3. **Access your app**:
   - URL: `https://gannino.github.io/your-wealth/`

### Manual Deployment

```bash
# Build for production
npm run build

# Build outputs to dist/
# For manual deployment, copy dist/ contents to your host
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Review Process

- All submissions require review
- Maintain test coverage above 75%
- Follow TypeScript best practices
- Use descriptive commit messages

## 📖 Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - System architecture and design
- **[Testing Guide](TESTING.md)** - Testing strategy and guidelines
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment instructions

## 🔐 Privacy & Security

- **100% Client-Side** - No server calls, no data collection
- **Local Storage** - All data stored in browser
- **XSS Protection** - DOMPurify sanitization enabled
- **Secure by Design** - No external dependencies on user data

## 📝 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

Based on principles from:
- *MONEY Master the Game* by Tony Robbins
- *Unshakeable* by Tony Robbins

## 📧 Support

For issues and questions:
- Open a GitHub Issue
- Check existing documentation
- Review Architecture and Testing guides

---

**Built with ❤️ for financial education**
