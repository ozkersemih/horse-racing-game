import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsPanel from '../ResultsPanel.vue'
import type { TableItem } from '../ResultsTable.vue'

const mockTables = [
  {
    id: 1,
    title: '1ST Lap - 1200m',
    items: [
      { key: 1, position: 1, name: 'Thunder Bolt' },
      { key: 2, position: 2, name: 'Silver Star' },
    ] as TableItem[],
  },
  {
    id: 2,
    title: '2ND Lap - 1400m',
    items: [
      { key: 3, position: 1, name: 'Golden Arrow' },
      { key: 4, position: 2, name: 'Blue Lightning' },
    ] as TableItem[],
  },
]

describe('ResultsPanel', () => {
  it('should mount successfully', () => {
    const wrapper = mount(ResultsPanel, {
      props: {
        title: 'Results',
        showEmptyState: false,
        emptyStateMessage: 'No results',
        tables: mockTables,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('results-panel')
  })

  describe('Props', () => {
    it('should display panel title correctly', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Race Results',
          showEmptyState: false,
          emptyStateMessage: 'No results',
          tables: mockTables,
        },
      })

      expect(wrapper.find('.panel-header').text()).toBe('Race Results')
    })

    it('should render multiple tables when they are provided', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Results',
          showEmptyState: false,
          emptyStateMessage: 'No results',
          tables: mockTables,
        },
      })

      const resultsTables = wrapper.findAllComponents({ name: 'ResultsTable' })
      expect(resultsTables).toHaveLength(2)

      expect(resultsTables[0].props('title')).toBe('1ST Lap - 1200m')
      expect(resultsTables[1].props('title')).toBe('2ND Lap - 1400m')
    })

    it('should show empty state when showEmptyState is true', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Results',
          showEmptyState: true,
          emptyStateMessage: 'Click "Start" to begin racing',
          tables: mockTables,
        },
      })

      expect(wrapper.find('.empty-state').exists()).toBe(true)
      expect(wrapper.find('.empty-state').text()).toBe('Click "Start" to begin racing')

      const resultsTables = wrapper.findAllComponents({ name: 'ResultsTable' })
      expect(resultsTables).toHaveLength(0)
    })

    it('should handle empty tables array', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Results',
          showEmptyState: false,
          emptyStateMessage: 'No results',
          tables: [],
        },
      })

      const resultsTables = wrapper.findAllComponents({ name: 'ResultsTable' })
      expect(resultsTables).toHaveLength(0)
    })
  })
})
