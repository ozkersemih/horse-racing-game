import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('should rendered successfully', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Test Button' } })
    const btn = wrapper.get('[data-testid="base-button"]')
    expect(wrapper.exists()).toBe(true)
    expect(btn.text()).toBe('Test Button')
  })

  describe('Props', () => {
    it('should apply primary variant by default', () => {
      const wrapper = mount(BaseButton, { slots: { default: 'Button' } })
      const btn = wrapper.get('[data-testid="base-button"]')
      expect(btn.classes()).toContain('primary')
    })

    it('should apply secondary variant when specified', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'secondary' },
        slots: { default: 'Button' },
      })
      const btn = wrapper.get('[data-testid="base-button"]')
      expect(btn.classes()).toContain('secondary')
    })

    it('should apply danger variant when specified', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'danger' },
        slots: { default: 'Button' },
      })
      const btn = wrapper.get('[data-testid="base-button"]')
      expect(btn.classes()).toContain('danger')
    })

    it('should apply disabled class when disabled prop is true', () => {
      const wrapper = mount(BaseButton, { props: { disabled: true }, slots: { default: 'Button' } })
      const btn = wrapper.get('[data-testid="base-button"]')
      expect(btn.classes()).toContain('disabled')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('should not apply disabled class when disabled prop is false', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: false },
        slots: { default: 'Button' },
      })
      const btn = wrapper.get('[data-testid="base-button"]')
      expect(btn.classes()).not.toContain('disabled')
      expect(btn.attributes('disabled')).toBeUndefined()
    })

    it('should work with all props combined', async () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'danger', disabled: false },
        slots: { default: 'Danger Button' },
      })
      const btn = wrapper.get('[data-testid="base-button"]')
      expect(btn.classes()).toContain('danger')
      expect(btn.classes()).not.toContain('disabled')
      expect(btn.text()).toBe('Danger Button')
      await btn.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Events', () => {
    it('should emit click event when clicked and not disabled', async () => {
      const wrapper = mount(BaseButton, { slots: { default: 'Button' } })
      const btn = wrapper.get('[data-testid="base-button"]')
      await btn.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('should not emit click event when disabled', async () => {
      const wrapper = mount(BaseButton, { props: { disabled: true }, slots: { default: 'Button' } })
      const btn = wrapper.get('[data-testid="base-button"]')
      await btn.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })
})
