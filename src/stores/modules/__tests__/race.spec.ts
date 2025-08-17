import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import raceModule, { type RaceState, type Round, type RoundResult } from '../race'

const makeState = (): RaceState => (raceModule.state as any)()

describe('race store', () => {
  let state: RaceState

  beforeEach(() => {
    state = makeState()
  })

  describe('mutations', () => {
    it('SET_ROUNDS initializes race', () => {
      const rounds: Round[] = [
        { id: 1, distance: '1200m', selectedHorses: [] },
        { id: 2, distance: '1400m', selectedHorses: [] },
      ]
      raceModule.mutations.SET_ROUNDS(state, rounds)
      expect(state.rounds).toHaveLength(2)
      expect(state.isGenerated).toBe(true)
      expect(state.currentRoundIndex).toBe(1)
      expect(state.raceStatus).toBe('idle')
      expect(Object.keys(state.progressMap).length).toBe(0)
      expect(Object.keys(state.finishTimeMap).length).toBe(0)
    })

    it('RESET_RACE clears everything', () => {
      state.rounds = [{ id: 1, distance: '1200m', selectedHorses: [] }]
      state.isGenerated = true
      state.isRaceRunning = true
      state.raceStatus = 'running'
      state.currentRoundIndex = 1
      state.progressMap = { '1': 50 }
      state.finishTimeMap = { '1': 1234 }
      raceModule.mutations.RESET_RACE(state)
      expect(state.rounds).toEqual([])
      expect(state.isGenerated).toBe(false)
      expect(state.isRaceRunning).toBe(false)
      expect(state.raceStatus).toBe('idle')
      expect(state.currentRoundIndex).toBe(0)
      expect(state.progressMap).toEqual({})
      expect(state.finishTimeMap).toEqual({})
    })

    it('START_RACE and PAUSE_RACE', () => {
      raceModule.mutations.START_RACE(state)
      expect(state.isRaceRunning).toBe(true)
      expect(state.raceStatus).toBe('running')
      raceModule.mutations.PAUSE_RACE(state)
      expect(state.isRaceRunning).toBe(false)
      expect(state.raceStatus).toBe('paused')
    })

    it('UPDATE_HORSE_PROGRESS caps at >=0 and RESET_ROUND_PROGRESS', () => {
      raceModule.mutations.UPDATE_HORSE_PROGRESS(state, { horseId: '7', progress: -10 })
      expect(state.progressMap['7']).toBe(0)
      raceModule.mutations.UPDATE_HORSE_PROGRESS(state, { horseId: '7', progress: 300 })
      expect(state.progressMap['7']).toBe(300)
      raceModule.mutations.RESET_ROUND_PROGRESS(state)
      expect(state.progressMap).toEqual({})
      expect(state.finishTimeMap).toEqual({})
    })

    it('SET_HORSE_FINISH_TIME and SET_ROUND_RESULTS', () => {
      state.rounds = [{ id: 1, distance: '1200m', selectedHorses: [] }]
      raceModule.mutations.SET_HORSE_FINISH_TIME(state, { horseId: '9', finishTime: 321 })
      expect(state.finishTimeMap['9']).toBe(321)
      const results: RoundResult[] = [
        { horseId: 9, horseName: 'Thunder', finishTime: 321, position: 1 },
      ]
      raceModule.mutations.SET_ROUND_RESULTS(state, { roundIndex: 0, results })
      expect(state.rounds[0].results).toEqual(results)
    })

    it('NEXT_ROUND increments but not beyond length', () => {
      state.rounds = [
        { id: 1, distance: '1200m', selectedHorses: [] },
        { id: 2, distance: '1400m', selectedHorses: [] },
      ]
      state.currentRoundIndex = 1
      raceModule.mutations.NEXT_ROUND(state)
      expect(state.currentRoundIndex).toBe(2)
      raceModule.mutations.NEXT_ROUND(state)
      expect(state.currentRoundIndex).toBe(2)
    })

    it('FINISH_RACE sets finished state', () => {
      raceModule.mutations.FINISH_RACE(state)
      expect(state.isRaceRunning).toBe(false)
      expect(state.raceStatus).toBe('finished')
    })
  })

  describe('getters', () => {
    it('currentRound returns null before generated and proper round after', () => {
      expect(raceModule.getters.currentRound(state)).toBe(null)
      const rounds: Round[] = [
        { id: 1, distance: '1200m', selectedHorses: [] },
        { id: 2, distance: '1400m', selectedHorses: [] },
      ]
      raceModule.mutations.SET_ROUNDS(state, rounds)
      expect(raceModule.getters.currentRound(state)).toEqual(rounds[0])
    })

    it('getProgressForHorse computes percent based on current round distance', () => {
      const rounds: Round[] = [{ id: 1, distance: '1000m', selectedHorses: [] }]
      raceModule.mutations.SET_ROUNDS(state, rounds)
      state.progressMap['5'] = 250

      const g = raceModule.getters
      const fakeGetters = { currentRound: g.currentRound(state) } // value, not function

      expect(g.getProgressForHorse(state, fakeGetters)('5')).toBe(25)

      state.progressMap['5'] = 1200
      expect(g.getProgressForHorse(state, fakeGetters)('5')).toBe(100)
    })

    it('getProgressForHorse returns 0 when no current round or invalid distance', () => {
      expect(raceModule.getters.getProgressForHorse(state, raceModule.getters)('1')).toBe(0)
      raceModule.mutations.SET_ROUNDS(state, [{ id: 1, distance: 'abc', selectedHorses: [] }])
      const g = raceModule.getters
      expect(g.getProgressForHorse(state, g)('1')).toBe(0)
    })

    it('getProgressMetersForHorse and getHorseFinishTime default 0', () => {
      expect(raceModule.getters.getProgressMetersForHorse(state)('7')).toBe(0)
      expect(raceModule.getters.getHorseFinishTime(state)('7')).toBe(0)
    })

    it('getCompletedRounds filters correctly', () => {
      state.rounds = [
        { id: 1, distance: '1200m', selectedHorses: [] },
        { id: 2, distance: '1400m', selectedHorses: [], results: [] },
        {
          id: 3,
          distance: '1600m',
          selectedHorses: [],
          results: [{ horseId: 1, horseName: 'A', finishTime: 1, position: 1 }],
        },
      ]
      const completed = raceModule.getters.getCompletedRounds(state)
      expect(completed.map((r) => r.id)).toEqual([3])
    })

    it('raceStatus passthrough', () => {
      state.raceStatus = 'paused'
      expect(raceModule.getters.raceStatus(state)).toBe('paused')
    })
  })

  describe('actions', () => {
    const origRandom = Math.random
    afterEach(() => {
      Math.random = origRandom
    })

    it('generateRace commits SET_ROUNDS with 6 rounds and 10 horses each', () => {
      Math.random = vi.fn(() => 0.42) as any
      const commit = vi.fn()
      const horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `H${i + 1}`,
        color: '#000',
        condition: 50,
      }))
      const rootGetters = { 'horses/allHorses': horses }
      ;(raceModule.actions as any).generateRace({ commit, rootGetters })
      const payload = commit.mock.calls[0][1] as Round[]
      expect(commit).toHaveBeenCalledWith('SET_ROUNDS', expect.any(Array))
      expect(payload).toHaveLength(6)
      payload.forEach((r) => {
        expect(r.selectedHorses.length).toBe(10)
        r.selectedHorses.forEach((h) => expect(horses.some((x) => x.id === h.id)).toBe(true))
      })
    })

    it('startRace and pauseRace commit correct mutations', () => {
      const commit = vi.fn()
      ;(raceModule.actions as any).startRace({ commit })
      expect(commit).toHaveBeenCalledWith('START_RACE')
      ;(raceModule.actions as any).pauseRace({ commit })
      expect(commit).toHaveBeenCalledWith('PAUSE_RACE')
    })
  })
})
