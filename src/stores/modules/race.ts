import type { Horse } from './horses'

export type Round = {
  id: number
  distance: string
  selectedHorses: Horse[]
}

export type RaceState = {
  rounds: Round[]
  isGenerated: boolean
  isRaceRunning: boolean
  currentRoundIndex: number
}

const distances = ['1200m', '1400m', '1600m', '1800m', '2000m', '2200m']

function selectRandomHorses(allHorses: Horse[]): Horse[] {
  const shuffled = [...allHorses].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 10)
}

const raceModule = {
  namespaced: true,

  state: (): RaceState => ({
    rounds: [],
    isGenerated: false,
    isRaceRunning: false,
    currentRoundIndex: 0,
  }),

  mutations: {
    SET_ROUNDS(state: RaceState, rounds: Round[]) {
      state.rounds = rounds
      state.isGenerated = true
      state.currentRoundIndex = 1
    },
    RESET_RACE(state: RaceState) {
      state.rounds = []
      state.isGenerated = false
      state.isRaceRunning = false
      state.currentRoundIndex = 0
    },
    START_RACE(state: RaceState) {
      state.isRaceRunning = true
    },
    NEXT_ROUND(state: RaceState) {
      if (state.currentRoundIndex < state.rounds.length) {
        state.currentRoundIndex += 1
      }
    },
    FINISH_RACE(state: RaceState) {
      state.isRaceRunning = false
    },
  },

  actions: {
    generateRace({ commit, rootGetters }: any) {
      const allHorses = rootGetters['horses/allHorses']

      const rounds = distances.map((distance, index) => ({
        id: index + 1,
        distance,
        selectedHorses: selectRandomHorses(allHorses),
      }))

      commit('SET_ROUNDS', rounds)
    },
  },

  getters: {
    rounds: (state: RaceState) => state.rounds,
    isGenerated: (state: RaceState) => state.isGenerated,
    isRaceRunning: (state: RaceState) => state.isRaceRunning,
    currentRoundIndex: (state: RaceState) => state.currentRoundIndex,
    currentRound: (state: RaceState) => {
      if (!state.isGenerated || state.currentRoundIndex === 0) return null
      return state.rounds[state.currentRoundIndex - 1]
    },
  },
}

export default raceModule
