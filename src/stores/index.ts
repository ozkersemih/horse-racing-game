import { createStore } from 'vuex'
import horsesModule from './modules/horses'
import raceModule from './modules/race'

export const store = createStore({
  modules: {
    horses: horsesModule,
    race: raceModule,
  },
})

export type RootState = {
  horses: typeof horsesModule.state
  race: typeof raceModule.state
}
