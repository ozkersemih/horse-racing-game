import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseLane from '@/features/track/components/HorseLane.vue'
import type { Horse } from '@/stores/modules/horses'

vi.mock('@/features/track/components/Horse.vue', () => ({
  default: {
    name: 'HorseDisplay',
    props: ['horse', 'progress', 'showProgress'],
    template: '<div class="stub-horse">{{ horse?.name }} - {{ progress }}%</div>',
  },
}))

const mockStore = {
  getters: {
    'race/getProgressForHorse': vi.fn(),
  },
}

vi.mock('vuex', () => ({
  useStore: () => mockStore,
}))

const mockHorse: Horse = { id: 1, name: 'Thunder', color: '#ff0000', condition: 85 }

describe('HorseLane', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.getters['race/getProgressForHorse'] = vi.fn().mockReturnValue(0)
  })

  it('renders lane number and HorseDisplay when horse exists', () => {
    const wrapper = mount(HorseLane, { props: { laneNumber: 3, horse: mockHorse } })
    expect(wrapper.find('.lane-number').text()).toBe('3')
    const horseDisplay = wrapper.findComponent({ name: 'HorseDisplay' })
    expect(horseDisplay.exists()).toBe(true)
    expect(horseDisplay.props('horse')).toEqual(mockHorse)
    expect(horseDisplay.props('showProgress')).toBe(false)
  })

  it('renders empty lane when horse is null', () => {
    const wrapper = mount(HorseLane, { props: { laneNumber: 2, horse: null } })
    expect(wrapper.find('.empty-lane').text()).toBe('Empty Lane')
    expect(wrapper.findComponent({ name: 'HorseDisplay' }).exists()).toBe(false)
  })

  it('calls store getter with horse id as string and forwards progress to HorseDisplay', () => {
    mockStore.getters['race/getProgressForHorse'] = vi.fn().mockReturnValue(67)
    const wrapper = mount(HorseLane, { props: { laneNumber: 1, horse: mockHorse } })
    expect(mockStore.getters['race/getProgressForHorse']).toHaveBeenCalledWith('1')
    const horseDisplay = wrapper.findComponent({ name: 'HorseDisplay' })
    expect(horseDisplay.props('progress')).toBe(67)
  })
})
