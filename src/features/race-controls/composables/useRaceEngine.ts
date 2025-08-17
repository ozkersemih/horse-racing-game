import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '@/stores/modules/horses'
import type { RoundResult } from '@/stores/modules/race'

function toMeters(dist: string | number): number {
  if (typeof dist === 'number') return dist
  return parseInt(dist, 10) || 0
}

export function useRaceEngine() {
  const store = useStore()
  const raceInterval = ref<number | null>(null)
  const RACE_TIME_INTERVAL = 100
  const ROUND_WAIT_TIME = 2000
  const BASE_SPEED = 5
  const SPEED_MULTIPLIER = 0.1
  const SPEED_RANDOM_FACTOR = 2

  const isRaceRunning = computed(() => store.getters['race/isRaceRunning'])
  const currentRound = computed(() => store.getters['race/currentRound'])
  const progressMap = computed(() => store.getters['race/progressMap'])
  const raceStatus = computed(() => store.getters['race/raceStatus'])

  function calculateSpeedForHorse(horse: Horse): number {
    const conditionBonus = horse.condition * SPEED_MULTIPLIER
    const randomFactor = Math.random() * SPEED_RANDOM_FACTOR
    return BASE_SPEED + conditionBonus + randomFactor
  }

  function updateProgressForHorse(horse: Horse): boolean {
    const currentMeters = store.getters['race/getProgressMetersForHorse'](horse.id.toString())
    const isAlreadyFinished = store.getters['race/getHorseFinishTime'](horse.id.toString())

    if (isAlreadyFinished) {
      return true
    }

    const distanceMeters = toMeters(currentRound.value?.distance || 0)

    if (currentMeters < distanceMeters) {
      const speed = calculateSpeedForHorse(horse)
      const newMeters = currentMeters + speed

      store.commit('race/UPDATE_HORSE_PROGRESS', {
        horseId: horse.id.toString(),
        progress: newMeters,
      })
      return false
    } else if (currentMeters >= distanceMeters) {
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

  function startRaceTimer({ reset = true }: { reset?: boolean } = {}) {
    if (raceInterval.value) return

    if (reset) {
      store.commit('race/RESET_ROUND_PROGRESS')
    }

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
    const isResume = raceStatus.value === 'paused'

    store.dispatch('race/startRace')

    startRaceTimer({ reset: !isResume })
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
