import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsTable, { type TableItem } from '../ResultsTable.vue'

const mockItems: TableItem[] = [
  { key: 1, position: 1, name: 'Thunder Bolt' },
  { key: 2, position: 2, name: 'Silver Star' },
  { key: 3, position: 3, name: 'Golden Arrow' },
]

describe('ResultsTable', () => {
  it('should mount successfully', () => {
    const wrapper = mount(ResultsTable, {
      props: { title: 'Test Round', items: mockItems },
    })
    expect(wrapper.get('[data-testid="results-table"]').exists()).toBe(true)
  })

  describe('Props', () => {
    it('should display title correctly', () => {
      const wrapper = mount(ResultsTable, {
        props: { title: '1ST Lap - 1200m', items: mockItems },
      })
      expect(wrapper.get('[data-testid="table-title"]').text()).toBe('1ST Lap - 1200m')
    })

    it('should render all items correctly', () => {
      const wrapper = mount(ResultsTable, {
        props: { title: 'Test Round', items: mockItems },
      })

      const rows = wrapper.findAll('[data-testid="table-row"]')
      expect(rows).toHaveLength(3)

      expect(rows[0].get('[data-testid="row-position"]').text()).toBe('1')
      expect(rows[0].get('[data-testid="row-name"]').text()).toBe('Thunder Bolt')

      expect(rows[1].get('[data-testid="row-position"]').text()).toBe('2')
      expect(rows[1].get('[data-testid="row-name"]').text()).toBe('Silver Star')

      expect(rows[2].get('[data-testid="row-position"]').text()).toBe('3')
      expect(rows[2].get('[data-testid="row-name"]').text()).toBe('Golden Arrow')
    })

    it('should handle empty items array', () => {
      const wrapper = mount(ResultsTable, {
        props: { title: 'Empty Round', items: [] },
      })
      expect(wrapper.get('[data-testid="table-title"]').text()).toBe('Empty Round')
      expect(wrapper.findAll('[data-testid="table-row"]')).toHaveLength(0)
    })
  })
})
