import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import horsesModule, { type HorsesState, type Horse } from '../horses'

const makeState = (): HorsesState => (horsesModule.state as any)()

describe('horses store', () => {
  let state: HorsesState
  const origRandom = Math.random

  beforeEach(() => {
    state = makeState()
  })

  afterEach(() => {
    Math.random = origRandom
  })

  describe('mutations', () => {
    it('SET_HORSES sets allHorses', () => {
      const horses: Horse[] = [
        { id: 1, name: 'H1', color: 'Red', condition: 90 },
        { id: 2, name: 'H2', color: 'Blue', condition: 80 },
      ]
      horsesModule.mutations.SET_HORSES(state, horses)
      expect(state.allHorses).toEqual(horses)
    })
  })

  describe('actions', () => {
    it('generateHorses commits SET_HORSES with 20 valid horses', () => {
      Math.random = vi.fn(() => 0.5) as any
      const commit = vi.fn()
      ;(horsesModule.actions as any).generateHorses({ commit })

      expect(commit).toHaveBeenCalledWith('SET_HORSES', expect.any(Array))
      const payload = commit.mock.calls[0][1] as Horse[]
      expect(payload).toHaveLength(20)

      const ids = new Set(payload.map((h) => h.id))
      expect(ids.size).toBe(20)
      payload.forEach((h) => {
        expect(typeof h.name).toBe('string')
        expect(h.name.length).toBeGreaterThan(0)
        expect(typeof h.color).toBe('string')
        expect(h.color.length).toBeGreaterThan(0)
        expect(h.condition).toBeGreaterThanOrEqual(67)
        expect(h.condition).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('getters', () => {
    it('allHorses returns state array', () => {
      state.allHorses = [
        { id: 1, name: 'A', color: 'Red', condition: 75 },
        { id: 2, name: 'B', color: 'Blue', condition: 82 },
      ]
      expect(horsesModule.getters.allHorses(state)).toEqual(state.allHorses)
    })
  })
})
