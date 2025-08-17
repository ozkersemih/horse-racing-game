import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils' // <-- use mount
import HorseList from '@/features/horse-list/HorseList.vue'
import type { Horse } from '@/stores/modules/horses'

vi.mock('@/features/horse-list/components/HorseListItem.vue', () => ({
  default: {
    name: 'HorseListItem',
    props: ['horse'],
    template: '<div class="stub-horse-item">{{ horse?.name }}</div>',
  },
}))

const mockStore = {
  getters: {
    'horses/allHorses': [] as Horse[],
  },
  dispatch: vi.fn(),
}

vi.mock('vuex', () => ({
  useStore: () => mockStore,
}))

const mountWith = (overrides?: Partial<typeof mockStore.getters>) => {
  Object.assign(mockStore.getters, {
    'horses/allHorses': [
      { id: 1, name: 'Thunder', color: '#111', condition: 70 },
      { id: 2, name: 'Blaze', color: '#222', condition: 55 },
      { id: 3, name: 'Comet', color: '#333', condition: 90 },
    ],
    ...overrides,
  })
  return mount(HorseList)
}

describe('HorseList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.getters['horses/allHorses'] = [
      { id: 1, name: 'Thunder', color: '#111', condition: 70 },
      { id: 2, name: 'Blaze', color: '#222', condition: 55 },
      { id: 3, name: 'Comet', color: '#333', condition: 90 },
    ]
  })

  it('dispatches horses/generateHorses on mount', () => {
    mountWith()
    expect(mockStore.dispatch).toHaveBeenCalledWith('horses/generateHorses')
  })

  it('shows the header text', () => {
    const wrapper = mountWith()
    expect(wrapper.find('.horse-list-header h3').text()).toBe('Horse List (1-20)')
  })

  it('renders as many HorseListItem components as there are horses in the store', () => {
    const wrapper = mountWith()
    const items = wrapper.findAll('.stub-horse-item')
    expect(items.length).toBe(3)
  })

  it('passes the correct horse prop to each HorseListItem', () => {
    const wrapper = mountWith()
    const itemCmps = wrapper.findAllComponents({ name: 'HorseListItem' })
    expect(itemCmps[0].props('horse')).toEqual(expect.objectContaining({ id: 1, name: 'Thunder' }))
    expect(itemCmps[1].props('horse')).toEqual(expect.objectContaining({ id: 2, name: 'Blaze' }))
    expect(itemCmps[2].props('horse')).toEqual(expect.objectContaining({ id: 3, name: 'Comet' }))
  })

  it('renders no items when the list is empty', () => {
    const wrapper = mountWith({ 'horses/allHorses': [] })
    expect(wrapper.findAll('.stub-horse-item').length).toBe(0)
  })

  it('reflects store changes by remounting (non-reactive mock)', () => {
    let wrapper = mountWith()
    expect(wrapper.findAll('.stub-horse-item').length).toBe(3)

    wrapper.unmount()
    wrapper = mountWith({
      'horses/allHorses': [{ id: 4, name: 'New Horse', color: '#444', condition: 80 }],
    })

    const items = wrapper.findAll('.stub-horse-item')
    expect(items.length).toBe(1)
    expect(items[0].text()).toBe('New Horse')
  })
})
