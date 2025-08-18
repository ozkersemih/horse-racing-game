import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceTrack from '../Track.vue'
import type { Horse } from '@/stores/modules/horses'

vi.mock('../components/HorseLane.vue', () => ({
  default: {
    name: 'HorseLane',
    props: {
      laneNumber: { type: Number, required: true },
      horse: { type: Object, required: false },
    },
    template: `<div data-testid="horse-lane">lane-{{ laneNumber }} - {{ horse ? horse.name : 'empty' }}</div>`,
  },
}))

vi.mock('../components/RaceTimer.vue', () => ({
  default: {
    name: 'RaceTimer',
    template: `<div data-testid="race-timer">TIMER</div>`,
  },
}))

type RoundLike = {
  id: number
  distance: string
  selectedHorses: Horse[]
}

const mockStore = {
  getters: {
    'race/currentRound': null as RoundLike | null,
    'race/isRaceRunning': false,
  },
}

vi.mock('vuex', () => ({
  useStore: () => mockStore,
}))

const mountWith = (overrides?: Partial<typeof mockStore.getters>) => {
  Object.assign(mockStore.getters, {
    'race/currentRound': null,
    'race/isRaceRunning': false,
    ...overrides,
  })
  return mount(RaceTrack)
}

describe('RaceTrack.vue', () => {
  beforeEach(() => {
    Object.assign(mockStore.getters, {
      'race/currentRound': null,
      'race/isRaceRunning': false,
    })
  })

  it('renders header title and RaceTimer', () => {
    const wrapper = mountWith()
    expect(wrapper.get('[data-testid="track-title"]').text()).toBe('RACE TRACK')
    expect(wrapper.get('[data-testid="race-timer"]').exists()).toBe(true)
  })

  it('renders 10 empty lanes when there is no current round', () => {
    const wrapper = mountWith({ 'race/currentRound': null })
    const lanes = wrapper.findAll('[data-testid="horse-lane"]')
    expect(lanes.length).toBe(10)
    expect(lanes[0].text()).toContain('lane-1 - empty')
    expect(lanes[9].text()).toContain('lane-10 - empty')
  })

  it('renders lanes for selected horses when a round exists', () => {
    const wrapper = mountWith({
      'race/currentRound': {
        id: 1,
        distance: '1200m',
        selectedHorses: [
          { id: 10, name: 'Thunder', color: '#111', condition: 70 },
          { id: 11, name: 'Blaze', color: '#222', condition: 60 },
        ],
      },
    })
    const lanes = wrapper.findAll('[data-testid="horse-lane"]')
    expect(lanes.length).toBe(2)
    expect(lanes[0].text()).toContain('lane-1 - Thunder')
    expect(lanes[1].text()).toContain('lane-2 - Blaze')
  })

  it('shows "No Race Generated" when there is no current round', () => {
    const wrapper = mountWith({ 'race/currentRound': null })
    expect(wrapper.get('[data-testid="lap-info"]').text()).toBe('No Race Generated')
  })

  it('shows "Ready: <id>ST Lap - <distance>" when round exists but race not running', () => {
    const wrapper = mountWith({
      'race/currentRound': { id: 2, distance: '1500m', selectedHorses: [] },
      'race/isRaceRunning': false,
    })
    expect(wrapper.get('[data-testid="lap-info"]').text()).toBe('Ready: 2ST Lap - 1500m')
  })

  it('shows "<id>ST Lap - <distance>" when race is running', () => {
    const wrapper = mountWith({
      'race/currentRound': { id: 3, distance: '1800m', selectedHorses: [] },
      'race/isRaceRunning': true,
    })
    expect(wrapper.get('[data-testid="lap-info"]').text()).toBe('3ST Lap - 1800m')
  })
})
