import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceControls from '@/features/race-controls/RaceControls.vue'

const mockStore = {
  getters: {
    'race/isGenerated': false,
    'race/raceStatus': 'idle',
  },
  dispatch: vi.fn(),
}

const mockStartRace = vi.fn()
const mockPauseRace = vi.fn()
const mockCleanup = vi.fn()
const mockIsRaceRunning = { value: false }

vi.mock('vuex', () => ({
  useStore: () => mockStore,
}))

vi.mock('@/features/race-controls/composables/useRaceEngine', () => ({
  useRaceEngine: () => ({
    startRace: mockStartRace,
    pauseRace: mockPauseRace,
    cleanup: mockCleanup,
    isRaceRunning: mockIsRaceRunning,
  }),
}))

const mountWith = (overrides?: Partial<typeof mockStore.getters>) => {
  Object.assign(mockStore.getters, {
    'race/isGenerated': false,
    'race/raceStatus': 'idle',
    ...overrides,
  })
  return mount(RaceControls)
}

describe('RaceControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockStore.getters, {
      'race/isGenerated': false,
      'race/raceStatus': 'idle',
    })
    mockIsRaceRunning.value = false
  })

  describe('rendering', () => {
    it('renders both buttons', () => {
      const wrapper = mountWith()
      const generateBtn = wrapper.get('[data-testid="btn-generate"]')
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      expect(generateBtn).toBeTruthy()
      expect(startBtn).toBeTruthy()
    })

    it('renders generate button initial state (not generated)', () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const generateBtn = wrapper.get('[data-testid="btn-generate"]')
      expect(generateBtn.text()).toBe('GENERATE PROGRAM')
      expect(generateBtn.attributes('disabled')).toBeUndefined()
    })

    it('renders start button initial state (disabled, START)', () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      expect(startBtn.text()).toBe('START')
      expect(startBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('generate button', () => {
    it('dispatches generateRace when clicked', async () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const generateBtn = wrapper.get('[data-testid="btn-generate"]')
      await generateBtn.trigger('click')
      expect(mockStore.dispatch).toHaveBeenCalledWith('race/generateRace')
    })

    it('becomes disabled and shows different text when generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': true })
      const generateBtn = wrapper.get('[data-testid="btn-generate"]')
      expect(generateBtn.text()).toBe('PROGRAM GENERATED')
      expect(generateBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('start/pause button', () => {
    it('is enabled when race is generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': true })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      expect(startBtn.attributes('disabled')).toBeUndefined()
    })

    it('calls startRace when clicked while not running', async () => {
      mockIsRaceRunning.value = false
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'idle' })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      await startBtn.trigger('click')
      expect(mockStartRace).toHaveBeenCalled()
      expect(mockPauseRace).not.toHaveBeenCalled()
    })

    it('calls pauseRace when clicked while running', async () => {
      mockIsRaceRunning.value = true
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'running' })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      await startBtn.trigger('click')
      expect(mockPauseRace).toHaveBeenCalled()
      expect(mockStartRace).not.toHaveBeenCalled()
    })
  })

  describe('button text based on race status', () => {
    it('shows START when status is idle', () => {
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'idle' })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      expect(startBtn.text()).toBe('START')
    })

    it('shows PAUSE when status is running', () => {
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'running' })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      expect(startBtn.text()).toBe('PAUSE')
    })

    it('shows RESUME when status is paused', () => {
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'paused' })
      const startBtn = wrapper.get('[data-testid="btn-start"]')
      expect(startBtn.text()).toBe('RESUME')
    })
  })

  describe('cleanup', () => {
    it('calls cleanup on unmount', () => {
      const wrapper = mountWith()
      wrapper.unmount()
      expect(mockCleanup).toHaveBeenCalled()
    })
  })
})
