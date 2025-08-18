import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseListItem from '../HorseListItem.vue'
import type { Horse } from '@/stores/types'

const mockHorse: Horse = {
  id: 1,
  name: 'Thunder Bolt',
  color: 'Red',
  condition: 85,
}

describe('HorseListItem', () => {
  it('should mount successfully', () => {
    const wrapper = mount(HorseListItem, {
      props: { horse: mockHorse },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.get('[data-testid="horse-item"]')).toBeTruthy()
  })

  describe('Props', () => {
    it('should display horse data correctly', () => {
      const wrapper = mount(HorseListItem, {
        props: { horse: mockHorse },
      })

      expect(wrapper.get('[data-testid="horse-number"]').text()).toBe('1')
      expect(wrapper.get('[data-testid="horse-name"]').text()).toBe('Thunder Bolt')
      expect(wrapper.get('[data-testid="horse-condition"]').text()).toBe('85')
      expect(wrapper.get('[data-testid="horse-color-text"]').text()).toBe('Red')
    })

    it('should apply correct background color to color indicator', () => {
      const wrapper = mount(HorseListItem, {
        props: { horse: mockHorse },
      })

      const colorIndicator = wrapper.get('[data-testid="horse-color-indicator"]')
      expect(colorIndicator.attributes('style')).toContain('background-color: red')
    })
  })
})
