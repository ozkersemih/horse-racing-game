import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export function useRaceClock() {
  const store = useStore()
  const timerInterval = ref<number | null>(null)
  const elapsedTime = ref(0)

  const isRaceRunning = computed(() => store.getters['race/isRaceRunning'])
  const raceStatus = computed(() => store.getters['race/raceStatus'])
  const currentRoundIndex = computed(() => store.getters['race/currentRoundIndex'])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    if (timerInterval.value) return
    timerInterval.value = window.setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    elapsedTime.value = 0
  }

  const shouldShowTimer = computed(() => {
    return isRaceRunning.value || raceStatus.value === 'paused'
  })

  watch(isRaceRunning, (newValue) => {
    if (newValue && !timerInterval.value) {
      startTimer()
    } else if (!newValue && timerInterval.value) {
      stopTimer()
    }
  })

  watch(raceStatus, (newValue) => {
    if (newValue === 'idle' && elapsedTime.value > 0) {
      resetTimer()
    }
  })

  watch(currentRoundIndex, () => {
    if (isRaceRunning.value) {
      resetTimer()
      startTimer()
    }
  })

  const cleanup = () => {
    stopTimer()
  }

  return {
    elapsedTime,
    shouldShowTimer,
    formatTime,
    cleanup,
  }
}
