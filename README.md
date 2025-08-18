# Horse Racing Game

A modern Vue 3-based horse racing simulation built with feature-based architecture, TypeScript for type safety, and comprehensive test coverage.

**Live Demo**: [https://ozkersemih.github.io/horse-racing-game/](https://ozkersemih.github.io/horse-racing-game/)

## Features

**Race Management**

- Dynamic race program generation with 20 different horses
- Real-time race simulation with varying distances per round
- Multi-round support
- Race status tracking (ready, running, paused)

**Horse System**

- Unique horse characteristics (name, color, condition)
- Dynamic speed calculation algorithm
- Visual horse representation

**Results System**

- Round-based results table
- Finish rankings
- Race statistics

## Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **Type Safety**: TypeScript
- **State Management**: Vuex 4
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## Architecture Approach

This project follows a feature-based architecture where each feature is organized within its own domain. This approach ensures scalability, maintainability, and clear separation of concerns.

```
src/
├── components/
│   └── BaseButton.vue
├── features/
│   ├── horse-list/
│   │   ├── components/
│   │   │   └── HorseListItem.vue
│   │   ├── __tests__/
│   │   └── HorseList.vue
│   ├── race-controls/
│   │   ├── composables/
│   │   │   └── useRaceEngine.ts
│   │   ├── __tests__/
│   │   └── RaceControls.vue
│   ├── track/
│   │   ├── components/
│   │   │   ├── Horse.vue
│   │   │   ├── HorseLane.vue
│   │   │   └── RaceTimer.vue
│   │   ├── composables/
│   │   │   └── useRaceClock.ts
│   │   ├── __tests__/
│   │   └── Track.vue
│   └── results/
│       ├── components/
│       │   ├── ResultsPanel.vue
│       │   └── ResultsTable.vue
│       ├── __tests__/
│       └── Results.vue
└── stores/
    ├── modules/
    │   ├── horses.ts
    │   └── race.ts
    └── types/
        └── index.ts
```

Each feature contains its own:

- Components
- Composable functions
- Tests
- Type definitions

While this is a small project, it's designed with large-scale applications in mind. For example, if the track screen needs new features tomorrow - like modals, floating buttons, or other track-specific functionality - they would be placed within the track feature. If components are used across multiple features, they belong in the shared components directory, like BaseButton.

## State Management

Modular state management with Vuex 4:

- **Horses Module**: Horse data management
- **Race Module**: Race state and progress tracking

## Testing Strategy

- **Unit Tests**: For every component and composable
- **Coverage**: 90%+ test coverage target
- **Testing Library**: Vue Test Utils + Vitest
- **Best Practices**: data-testid usage for reliable element selection

## Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Coverage report
npm run test:coverage

# Type check
npm run type-check

# Build
npm run build
```

## CI/CD Pipeline

We use GitHub Actions for automated deployment directly to GitHub Pages. The pipeline includes:

1. **Test Stage**: Unit tests and coverage reporting
2. **Build Stage**: Production build generation
3. **Deploy Stage**: Automatic deployment to GitHub Pages

Deployment to GitHub Pages only occurs when code is pushed to the master branch. Development features can be pushed to different branches first, allowing for code review processes and testing before merging to master for deployment.

**Workflow Features**

- Cache optimization for faster builds
- Parallel job execution
- Conditional deployment (master branch only)
- Coverage artifacts preservation

## Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Automated code formatting
- **TypeScript**: Strict type checking
- **Vue 3**: Modern Composition API patterns
