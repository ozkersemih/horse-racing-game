import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const mockStore = {
  getters: {
    'horses/allHorses': [],
    'race/isGenerated': false,
    'race/raceStatus': 'idle',
    'race/rounds': [],
    'race/getCompletedRounds': [],
    'race/isRaceRunning': false,
    'race/currentRound': null,
    'race/getProgressForHorse': vi.fn(() => vi.fn(() => 0)),
  },
  dispatch: vi.fn(),
}

vi.mock('vuex', () => ({
  useStore: () => mockStore,
}))

import App from '../App.vue'

describe('App', () => {
  it('mounts and renders main sections', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Horse Racing')
    expect(wrapper.text()).toContain('GENERATE PROGRAM')
    expect(wrapper.text()).toContain('START')

    expect(wrapper.text()).toContain('Horse List (1-20)')
    expect(wrapper.text()).toContain('RACE TRACK')

    expect(wrapper.text()).toContain('Program')
    expect(wrapper.text()).toContain('Results')
  })
})
