import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseDisplay from '../Horse.vue'
import type { Horse } from '@/stores/modules/horses'

const mockHorse: Horse = {
  id: 1,
  name: 'Thunder Bolt',
  color: 'Red',
  condition: 85,
}

describe('HorseDisplay', () => {
  it('should mount successfully', () => {
    const wrapper = mount(HorseDisplay, {
      props: { horse: mockHorse },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('horse')
  })

  describe('Props', () => {
    it('should display horse data and apply custom progress', () => {
      const wrapper = mount(HorseDisplay, {
        props: {
          horse: mockHorse,
          progress: 50,
        },
      })

      expect(wrapper.find('.horse-name').text()).toBe('Thunder Bolt')
      expect(wrapper.find('.horse-icon').text()).toBe('🐎')

      const horseElement = wrapper.find('.horse')
      expect(horseElement.attributes('style')).toContain('left: 50%')
      expect(horseElement.attributes('style')).toContain('transform: translateX(-50%)')
    })

    it('should apply default progress of 0', () => {
      const wrapper = mount(HorseDisplay, {
        props: { horse: mockHorse },
      })

      const horseElement = wrapper.find('.horse')
      expect(horseElement.attributes('style')).toContain('left: 0%')
      expect(horseElement.attributes('style')).toContain('transform: translateX(-0%)')
    })
  })
})
