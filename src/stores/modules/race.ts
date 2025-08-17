import type { Horse } from './horses'

export type Round = {
  id: number
  distance: string
  selectedHorses: Horse[]
  results?: RoundResult[]
}

export type RoundResult = {
  horseId: number
  horseName: string
  finishTime: number
  position: number
}

export type RaceState = {
  rounds: Round[]
  isGenerated: boolean
  isRaceRunning: boolean
  currentRoundIndex: number
  progressMap: { [horseId: string]: number }
  finishTimeMap: { [horseId: string]: number }
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
    progressMap: {},
    finishTimeMap: {},
  }),

  mutations: {
    SET_ROUNDS(state: RaceState, rounds: Round[]) {
      state.rounds = rounds
      state.isGenerated = true
      state.currentRoundIndex = 1
      state.progressMap = {}
      state.finishTimeMap = {}
    },
    RESET_RACE(state: RaceState) {
      state.rounds = []
      state.isGenerated = false
      state.isRaceRunning = false
      state.currentRoundIndex = 0
      state.progressMap = {}
      state.finishTimeMap = {}
    },
    START_RACE(state: RaceState) {
      state.isRaceRunning = true
    },
    PAUSE_RACE(state: RaceState) {
      state.isRaceRunning = false
    },
    UPDATE_HORSE_PROGRESS(
      state: RaceState,
      { horseId, progress }: { horseId: string; progress: number },
    ) {
      state.progressMap[horseId] = Math.min(100, Math.max(0, progress))
    },
    RESET_ROUND_PROGRESS(state: RaceState) {
      state.progressMap = {}
      state.finishTimeMap = {}
    },
    SET_HORSE_FINISH_TIME(
      state: RaceState,
      { horseId, finishTime }: { horseId: string; finishTime: number },
    ) {
      state.finishTimeMap[horseId] = finishTime
    },
    SET_ROUND_RESULTS(
      state: RaceState,
      { roundIndex, results }: { roundIndex: number; results: RoundResult[] },
    ) {
      if (state.rounds[roundIndex]) {
        state.rounds[roundIndex].results = results
      }
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
    generateRace({ commit, rootGetters }: { commit: Function; rootGetters: any }) {
      const allHorses = rootGetters['horses/allHorses']

      const rounds = distances.map((distance, index) => ({
        id: index + 1,
        distance,
        selectedHorses: selectRandomHorses(allHorses),
      }))

      commit('SET_ROUNDS', rounds)
    },
    startRace({ commit }: { commit: Function }) {
      commit('START_RACE')
    },
    pauseRace({ commit }: { commit: Function }) {
      commit('PAUSE_RACE')
    },
  },

  getters: {
    rounds: (state: RaceState) => state.rounds,
    isGenerated: (state: RaceState) => state.isGenerated,
    isRaceRunning: (state: RaceState) => state.isRaceRunning,
    currentRoundIndex: (state: RaceState) => state.currentRoundIndex,
    progressMap: (state: RaceState) => state.progressMap,
    currentRound: (state: RaceState) => {
      if (!state.isGenerated || state.currentRoundIndex === 0) return null
      return state.rounds[state.currentRoundIndex - 1]
    },
    getProgressForHorse: (state: RaceState) => (horseId: string) => {
      return state.progressMap[horseId] || 0
    },
    getHorseFinishTime: (state: RaceState) => (horseId: string) => {
      return state.finishTimeMap[horseId] || 0
    },
    getCompletedRounds: (state: RaceState) => {
      return state.rounds.filter((round) => round.results && round.results.length > 0)
    },
  },
}

export default raceModule
