import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRaceEngine } from '../useRaceEngine'
import type { Horse } from '@/stores/modules/horses'

const mockStore = {
  getters: {
    'race/isRaceRunning': false,
    'race/currentRound': null,
    'race/progressMap': {},
    'race/raceStatus': 'idle',
    'race/getProgressMetersForHorse': vi.fn(),
    'race/getHorseFinishTime': vi.fn(),
    'race/currentRoundIndex': 1,
    'race/rounds': [],
  },
  commit: vi.fn(),
  dispatch: vi.fn(),
}

vi.mock('vuex', () => ({
  useStore: () => mockStore,
}))

const mockSetInterval = vi.fn()
const mockClearInterval = vi.fn()

Object.defineProperty(window, 'setInterval', {
  value: mockSetInterval,
  writable: true,
})

Object.defineProperty(window, 'clearInterval', {
  value: mockClearInterval,
  writable: true,
})

describe('useRaceEngine', () => {
  let engine: ReturnType<typeof useRaceEngine>

  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.getters['race/isRaceRunning'] = false
    mockStore.getters['race/currentRound'] = null
    mockStore.getters['race/progressMap'] = {}
    mockStore.getters['race/raceStatus'] = 'idle'
    mockStore.getters['race/currentRoundIndex'] = 1
    mockStore.getters['race/rounds'] = []

    engine = useRaceEngine()
  })

  describe('calculateSpeedForHorse', () => {
    it('should calculate speed within expected range', () => {
      const horse: Horse = {
        id: 1,
        name: 'Test Horse',
        condition: 50,
        color: '#ff0000',
      }

      const speed = engine.calculateSpeedForHorse(horse)

      expect(speed).toBeGreaterThanOrEqual(10)
      expect(speed).toBeLessThanOrEqual(12)
    })

    it('should handle minimum condition', () => {
      const horse: Horse = {
        id: 1,
        name: 'Test Horse',
        condition: 1,
        color: '#ff0000',
      }

      const speed = engine.calculateSpeedForHorse(horse)

      expect(speed).toBeGreaterThanOrEqual(5)
      expect(speed).toBeLessThanOrEqual(8)
    })

    it('should handle maximum condition', () => {
      const horse: Horse = {
        id: 1,
        name: 'Test Horse',
        condition: 100,
        color: '#ff0000',
      }

      const speed = engine.calculateSpeedForHorse(horse)

      expect(speed).toBeGreaterThanOrEqual(15)
      expect(speed).toBeLessThanOrEqual(17)
    })
  })

  describe('startRace', () => {
    it('should dispatch start race action', () => {
      engine.startRace()

      expect(mockStore.dispatch).toHaveBeenCalledWith('race/startRace')
    })

    it('should start timer with reset for new race', () => {
      mockStore.getters['race/raceStatus'] = 'idle'

      engine.startRace()

      expect(mockSetInterval).toHaveBeenCalled()
    })

    it('should start timer without reset for resume', () => {
      mockStore.getters['race/raceStatus'] = 'paused'

      engine.startRace()

      expect(mockSetInterval).toHaveBeenCalled()
    })
  })

  describe('startRaceTimer', () => {
    it('should start timer with reset by default', () => {
      engine.startRaceTimer()

      expect(mockStore.commit).toHaveBeenCalledWith('race/RESET_ROUND_PROGRESS')
      expect(mockSetInterval).toHaveBeenCalled()
    })

    it('should start timer without reset when specified', () => {
      engine.startRaceTimer({ reset: false })

      expect(mockStore.commit).not.toHaveBeenCalledWith('race/RESET_ROUND_PROGRESS')
      expect(mockSetInterval).toHaveBeenCalled()
    })
  })

  describe('computed properties', () => {
    it('should return reactive computed properties', () => {
      expect(engine.isRaceRunning).toBeDefined()
      expect(engine.currentRound).toBeDefined()
      expect(engine.progressMap).toBeDefined()
    })
  })
})
