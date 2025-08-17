export type Horse = {
  id: number
  name: string
  color: string
  condition: number
}

export type HorsesState = {
  allHorses: Horse[]
}

const horseNames = [
  'Ada Lawrence',
  'Grand Hopper',
  'Margaret Hamilton',
  'Thunder Strike',
  'Silver Bullet',
  'Golden Arrow',
  'Storm Chaser',
  'Lightning Bolt',
  'Fire Walker',
  'Wind Runner',
  'Star Dancer',
  'Moon Shadow',
  'Desert Rose',
  'Ocean Wave',
  'Mountain Peak',
  'Forest King',
  'River Flow',
  'Sky Rider',
  'Dream Catcher',
  'Spirit Horse',
]

const horseColors = [
  'Red',
  'Blue',
  'Yellow',
  'Green',
  'Orange',
  'Purple',
  'Pink',
  'Brown',
  'Gray',
  'Navy',
  'Lime',
  'Teal',
  'Maroon',
  'Olive',
  'Silver',
  'Cyan',
  'Magenta',
  'Gold',
  'Coral',
  'Salmon',
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateHorses(): Horse[] {
  const names = shuffleArray(horseNames)
  const colors = shuffleArray(horseColors)

  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: names[i],
    color: colors[i],
    condition: Math.floor(Math.random() * 100) + 1,
  }))
}

const horsesModule = {
  namespaced: true,

  state: (): HorsesState => ({
    allHorses: [],
  }),

  mutations: {
    SET_HORSES(state: HorsesState, horses: Horse[]) {
      state.allHorses = horses
    },
  },

  actions: {
    generateHorses({ commit }: any) {
      const horses = generateHorses()
      commit('SET_HORSES', horses)
    },
  },

  getters: {
    allHorses: (state: HorsesState) => state.allHorses,
  },
}

export default horsesModule
