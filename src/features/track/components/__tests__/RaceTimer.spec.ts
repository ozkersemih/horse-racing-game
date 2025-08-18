import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'

const elapsedRef = ref(0)
const showRef = ref(false)
const formatFn = vi.fn((n: number) => `t:${n}`)
const cleanupFn = vi.fn()

vi.mock('../../composables/useRaceClock', () => ({
  useRaceClock: () => ({
    elapsedTime: elapsedRef,
    shouldShowTimer: showRef,
    formatTime: formatFn,
    cleanup: cleanupFn,
  }),
}))

import { mount } from '@vue/test-utils'
import RaceTimer from '../RaceTimer.vue'

describe('RaceTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    elapsedRef.value = 0
    showRef.value = false
    formatFn.mockImplementation((n: number) => `t:${n}`)
  })

  it('does not render when shouldShowTimer is false', () => {
    const wrapper = mount(RaceTimer)
    expect(wrapper.find('[data-testid="race-timer"]').exists()).toBe(false)
  })

  it('renders formatted time when shouldShowTimer is true', () => {
    showRef.value = true
    elapsedRef.value = 123
    const wrapper = mount(RaceTimer)
    const el = wrapper.get('[data-testid="race-timer"]')
    expect(formatFn).toHaveBeenCalledWith(123)
    expect(el.text()).toBe('t:123')
  })

  it('updates when elapsedTime changes', async () => {
    showRef.value = true
    const wrapper = mount(RaceTimer)
    elapsedRef.value = 45
    await nextTick()
    expect(wrapper.get('[data-testid="race-timer"]').text()).toBe('t:45')
    elapsedRef.value = 90
    await nextTick()
    expect(wrapper.get('[data-testid="race-timer"]').text()).toBe('t:90')
  })

  it('calls cleanup on unmount', () => {
    const wrapper = mount(RaceTimer)
    wrapper.unmount()
    expect(cleanupFn).toHaveBeenCalled()
  })
})
