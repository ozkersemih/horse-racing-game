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
  it('mounts successfully', () => {
    const wrapper = mount(ResultsPanel, {
      props: {
        title: 'Results',
        showEmptyState: false,
        emptyStateMessage: 'No results',
        tables: mockTables,
      },
    })
    expect(wrapper.get('[data-testid="results-panel"]').exists()).toBe(true)
  })

  describe('Props', () => {
    it('displays panel title', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Race Results',
          showEmptyState: false,
          emptyStateMessage: 'No results',
          tables: mockTables,
        },
      })
      expect(wrapper.get('[data-testid="panel-header"]').text()).toBe('Race Results')
    })

    it('renders multiple tables when provided', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Results',
          showEmptyState: false,
          emptyStateMessage: 'No results',
          tables: mockTables,
        },
      })
      const tables = wrapper.findAll('[data-testid="results-table"]')
      expect(tables).toHaveLength(2)
      // child props yine kontrol edilebilir:
      const cmpTables = wrapper.findAllComponents({ name: 'ResultsTable' })
      expect(cmpTables[0].props('title')).toBe('1ST Lap - 1200m')
      expect(cmpTables[1].props('title')).toBe('2ND Lap - 1400m')
    })

    it('shows empty state when showEmptyState is true', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Results',
          showEmptyState: true,
          emptyStateMessage: 'Click "Start" to begin racing',
          tables: mockTables,
        },
      })
      const empty = wrapper.get('[data-testid="empty-state"]')
      expect(empty.text()).toBe('Click "Start" to begin racing')
      expect(wrapper.findAll('[data-testid="results-table"]').length).toBe(0)
    })

    it('handles empty tables array', () => {
      const wrapper = mount(ResultsPanel, {
        props: {
          title: 'Results',
          showEmptyState: false,
          emptyStateMessage: 'No results',
          tables: [],
        },
      })
      expect(wrapper.findAll('[data-testid="results-table"]').length).toBe(0)
    })
  })
})
