import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Results from '@/features/results/Results.vue'
import type { Round, RoundResult } from '@/stores/modules/race'

vi.mock('@/features/results/components/ResultsPanel.vue', () => ({
  default: {
    name: 'ResultsPanel',
    props: {
      title: { type: String, required: true },
      showEmptyState: { type: Boolean, required: true },
      emptyStateMessage: { type: String, required: true },
      tables: { type: Array, required: true },
    },
    template: `
      <div>
        {{ title }} - {{ String(showEmptyState) }} - {{ emptyStateMessage }} - tables: {{ tables.length }}
      </div>
    `,
  },
}))

const mockStore = {
  getters: {
    'race/rounds': [] as Round[],
    'race/isGenerated': false,
    'race/getCompletedRounds': [] as Round[],
    'race/raceStatus': 'idle',
  },
}

vi.mock('vuex', () => ({ useStore: () => mockStore }))

const mountWith = (overrides?: Partial<typeof mockStore.getters>) => {
  Object.assign(mockStore.getters, {
    'race/rounds': [],
    'race/isGenerated': false,
    'race/getCompletedRounds': [],
    'race/raceStatus': 'idle',
    ...overrides,
  })
  return mount(Results)
}

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockStore.getters, {
      'race/rounds': [],
      'race/isGenerated': false,
      'race/getCompletedRounds': [],
      'race/raceStatus': 'idle',
    })
  })

  describe('rendering', () => {
    it('should render two ResultsPanel components', () => {
      const wrapper = mountWith()
      const panels = wrapper.findAll('[data-testid^="panel-"]')
      expect(panels).toHaveLength(2)
    })

    it('renders Program panel with correct title', () => {
      const wrapper = mountWith()
      const programPanel = wrapper.get('[data-testid="panel-program"]')
      expect(programPanel.text()).toContain('Program')
    })

    it('renders Results panel with correct title', () => {
      const wrapper = mountWith()
      const resultsPanel = wrapper.get('[data-testid="panel-results"]')
      expect(resultsPanel.text()).toContain('Results')
    })
  })

  describe('render behavior based on store data', () => {
    it('Program panel shows empty state when not generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const programPanel = wrapper.get('[data-testid="panel-program"]')
      expect(programPanel.text()).toContain('true')
      expect(programPanel.text()).toContain('Click "Generate Program"')
    })

    it('Program panel hides empty state when generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': true })
      const programPanel = wrapper.get('[data-testid="panel-program"]')
      expect(programPanel.text()).toContain('false')
    })

    it('Results panel shows empty when not generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const resultsPanel = wrapper.get('[data-testid="panel-results"]')
      expect(resultsPanel.text()).toContain('true')
      expect(resultsPanel.text()).toContain('Race results will appear')
    })

    it('Results panel shows "Click Start" when idle and no completed rounds', () => {
      const wrapper = mountWith({
        'race/isGenerated': true,
        'race/raceStatus': 'idle',
        'race/getCompletedRounds': [],
      })
      const resultsPanel = wrapper.get('[data-testid="panel-results"]')
      expect(resultsPanel.text()).toContain('true')
      expect(resultsPanel.text()).toContain('Click "Start"')
    })

    it('Results panel should show "Click Resume" when paused', () => {
      const wrapper = mountWith({
        'race/isGenerated': true,
        'race/raceStatus': 'paused',
        'race/getCompletedRounds': [],
      })
      const resultsPanel = wrapper.get('[data-testid="panel-results"]')
      expect(resultsPanel.text()).toContain('Click "Resume"')
    })

    it('Results panel should hide empty state when there are completed rounds', () => {
      const completed: Round[] = [
        {
          id: 1,
          distance: '1200m',
          selectedHorses: [],
          results: [{ horseId: 10, horseName: 'Thunder', position: 1 } as RoundResult],
        },
      ]
      const wrapper = mountWith({
        'race/isGenerated': true,
        'race/raceStatus': 'running',
        'race/getCompletedRounds': completed,
      })
      const resultsPanel = wrapper.get('[data-testid="panel-results"]')
      expect(resultsPanel.text()).toContain('false')
    })
  })

  describe('tables generation', () => {
    it('should compute programTables from rounds', () => {
      const wrapper = mountWith({
        'race/isGenerated': true,
        'race/rounds': [
          {
            id: 1,
            distance: '1200m',
            selectedHorses: [
              { id: 10, name: 'Thunder', color: '#111', condition: 70 },
              { id: 11, name: 'Blaze', color: '#222', condition: 80 },
            ],
          },
        ],
      })
      const programPanel = wrapper.get('[data-testid="panel-program"]')
      expect(programPanel.text()).toContain('tables: 1')
    })

    it('should compute resultsTables from completedRounds', () => {
      const wrapper = mountWith({
        'race/isGenerated': true,
        'race/raceStatus': 'finished',
        'race/getCompletedRounds': [
          {
            id: 1,
            distance: '1200m',
            selectedHorses: [],
            results: [
              { horseId: 10, horseName: 'Thunder', position: 1, finishTime: 1000 },
              { horseId: 11, horseName: 'Blaze', position: 2, finishTime: 1200 },
            ],
          },
        ],
      })
      const resultsPanel = wrapper.get('[data-testid="panel-results"]')
      expect(resultsPanel.text()).toContain('tables: 1')
    })
  })
})
