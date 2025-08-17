import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '@/stores/modules/horses'
import type { RoundResult } from '@/stores/modules/race'

export function useRaceTimer() {
  const store = useStore()
  const raceInterval = ref<number | null>(null)
  const RACE_TIME_INTERVAL = 100
  const ROUND_WAIT_TIME = 2000
  const BASE_SPEED = 0.5
  const SPEED_MULTIPLIER = 0.01
  const SPEED_RANDOM_FACTOR = 0.3

  const isRaceRunning = computed(() => store.getters['race/isRaceRunning'])
  const currentRound = computed(() => store.getters['race/currentRound'])
  const progressMap = computed(() => store.getters['race/progressMap'])

  function calculateSpeedForHorse(horse: Horse): number {
    const conditionBonus = horse.condition * SPEED_MULTIPLIER
    const randomFactor = Math.random() * SPEED_RANDOM_FACTOR
    return BASE_SPEED + conditionBonus + randomFactor
  }

  function updateProgressForHorse(horse: Horse): boolean {
    const currentProgress = store.getters['race/getProgressForHorse'](horse.id.toString())
    const isAlreadyFinished = store.getters['race/getHorseFinishTime'](horse.id.toString())

    if (isAlreadyFinished) {
      return true
    }

    if (currentProgress < 100) {
      const speed = calculateSpeedForHorse(horse)
      const newProgress = currentProgress + speed

      store.commit('race/UPDATE_HORSE_PROGRESS', {
        horseId: horse.id.toString(),
        progress: newProgress,
      })
      return false
    } else if (currentProgress >= 100) {
      console.log(horse.id, horse.name, 'finished')
      const finishTime = Date.now()
      store.commit('race/SET_HORSE_FINISH_TIME', {
        horseId: horse.id.toString(),
        finishTime,
      })
      return true
    }
    return true
  }

  function updateRoundProgress() {
    if (!currentRound.value) return

    const selectedHorses = currentRound.value.selectedHorses
    let allHorsedFinished = true

    selectedHorses.forEach((horse: Horse) => {
      const isHorseFinished = updateProgressForHorse(horse)
      if (!isHorseFinished) {
        allHorsedFinished = false
      }
    })

    if (allHorsedFinished) {
      completeCurrentRound()
    }
  }

  function updateResultsForCurrentRound(): RoundResult[] {
    if (!currentRound.value) return []

    const selectedHorses = currentRound.value.selectedHorses
    const results = selectedHorses
      .map((horse: Horse) => {
        const finishTime = store.getters['race/getHorseFinishTime'](horse.id.toString())
        return {
          horseId: horse.id,
          horseName: horse.name,
          finishTime,
          position: 0,
        }
      })
      .sort((a: { finishTime: number }, b: { finishTime: number }) => a.finishTime - b.finishTime)
      .map((result: RoundResult, index: number) => ({
        ...result,
        position: index + 1,
      }))

    const roundIndex = store.getters['race/currentRoundIndex'] - 1
    store.commit('race/SET_ROUND_RESULTS', { roundIndex, results })

    return results
  }

  function completeCurrentRound() {
    if (!currentRound.value) return

    stopRaceTimer()

    updateResultsForCurrentRound()

    if (store.getters['race/currentRoundIndex'] < store.getters['race/rounds'].length) {
      setTimeout(() => {
        store.commit('race/NEXT_ROUND')
        store.commit('race/RESET_ROUND_PROGRESS')

        if (isRaceRunning.value) {
          startRaceTimer()
        }
      }, ROUND_WAIT_TIME)
    } else {
      store.commit('race/FINISH_RACE')
    }
  }

  function startRaceTimer() {
    if (raceInterval.value) return

    store.commit('race/RESET_ROUND_PROGRESS')

    raceInterval.value = window.setInterval(() => {
      updateRoundProgress()
    }, RACE_TIME_INTERVAL)
  }

  function stopRaceTimer() {
    if (raceInterval.value) {
      clearInterval(raceInterval.value)
      raceInterval.value = null
    }
  }

  function startRace() {
    store.dispatch('race/startRace')
    startRaceTimer()
  }

  function pauseRace() {
    store.dispatch('race/pauseRace')
    stopRaceTimer()
  }

  function cleanup() {
    stopRaceTimer()
  }

  return {
    isRaceRunning,
    currentRound,
    progressMap,

    startRace,
    pauseRace,
    cleanup,

    startRaceTimer,
    stopRaceTimer,
    calculateSpeedForHorse: calculateSpeedForHorse,
  }
}
