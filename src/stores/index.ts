import { createStore } from 'vuex'
import horsesModule from './modules/horses'

export const store = createStore({
  modules: {
    horses: horsesModule,
  },
})

export type RootState = {
  horses: typeof horsesModule.state
}
