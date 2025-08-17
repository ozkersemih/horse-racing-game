import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceControls from '@/features/race-controls/RaceControls.vue'
import BaseButton from '@/components/BaseButton.vue'

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
      const buttons = wrapper.findAllComponents(BaseButton)
      expect(buttons).toHaveLength(2)
    })

    it('renders generate button initial state (not generated)', () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const generateButton = wrapper.findAllComponents(BaseButton)[0]
      expect(generateButton.text()).toBe('GENERATE PROGRAM')
      expect(generateButton.props('disabled')).toBe(false)
    })

    it('renders start button initial state (not generated -> disabled, shows START)', () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      expect(startButton.text()).toBe('START')
      expect(startButton.props('disabled')).toBe(true)
    })
  })

  describe('generate button', () => {
    it('dispatches generateRace when clicked', async () => {
      const wrapper = mountWith({ 'race/isGenerated': false })
      const generateButton = wrapper.findAllComponents(BaseButton)[0]
      await generateButton.trigger('click')
      expect(mockStore.dispatch).toHaveBeenCalledWith('race/generateRace')
    })

    it('becomes disabled and shows different text when race is generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': true })
      const generateButton = wrapper.findAllComponents(BaseButton)[0]
      expect(generateButton.text()).toBe('PROGRAM GENERATED')
      expect(generateButton.props('disabled')).toBe(true)
    })
  })

  describe('start/pause button', () => {
    it('is enabled when race is generated', () => {
      const wrapper = mountWith({ 'race/isGenerated': true })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      expect(startButton.props('disabled')).toBe(false)
    })

    it('calls startRace when clicked while not running', async () => {
      mockIsRaceRunning.value = false
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'idle' })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      await startButton.trigger('click')
      expect(mockStartRace).toHaveBeenCalled()
      expect(mockPauseRace).not.toHaveBeenCalled()
    })

    it('calls pauseRace when clicked while running', async () => {
      mockIsRaceRunning.value = true
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'running' })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      await startButton.trigger('click')
      expect(mockPauseRace).toHaveBeenCalled()
      expect(mockStartRace).not.toHaveBeenCalled()
    })
  })

  describe('button text based on race status', () => {
    it('shows START when status is idle', () => {
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'idle' })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      expect(startButton.text()).toBe('START')
    })

    it('shows PAUSE when status is running', () => {
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'running' })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      expect(startButton.text()).toBe('PAUSE')
    })

    it('shows RESUME when status is paused', () => {
      const wrapper = mountWith({ 'race/isGenerated': true, 'race/raceStatus': 'paused' })
      const startButton = wrapper.findAllComponents(BaseButton)[1]
      expect(startButton.text()).toBe('RESUME')
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
