<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import HorseLane from './components/HorseLane.vue'
import RaceTimer from './components/RaceTimer.vue'
import type { Horse } from '@/stores/modules/horses'

defineOptions({
  name: 'RaceTrack',
})

const store = useStore()

const currentRound = computed(() => store.getters['race/currentRound'])
const isRaceRunning = computed(() => store.getters['race/isRaceRunning'])

const lapInfo = computed(() => {
  if (!currentRound.value) return 'No Race Generated'
  if (!isRaceRunning.value)
    return `Ready: ${currentRound.value.id}ST Lap - ${currentRound.value.distance}`
  return `${currentRound.value.id}ST Lap - ${currentRound.value.distance}`
})

const trackLanes = computed(() => {
  if (!currentRound.value) {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      horse: null,
    }))
  }

  return currentRound.value.selectedHorses.map((horse: Horse, index: number) => ({
    id: index + 1,
    horse,
  }))
})
</script>

<template>
  <div class="track" data-testid="track">
    <div class="track-header" data-testid="track-header">
      <div class="track-title" data-testid="track-title">RACE TRACK</div>
      <RaceTimer />
    </div>

    <div class="track-lanes" data-testid="track-lanes">
      <HorseLane
        v-for="lane in trackLanes"
        :key="lane.id"
        :lane-number="lane.id"
        :horse="lane.horse"
      />
    </div>

    <div class="track-footer" data-testid="track-footer">
      <span class="lap-info" data-testid="lap-info">{{ lapInfo }}</span>
      <span class="finish-label" data-testid="finish-label">FINISH</span>
    </div>
  </div>
</template>

<style scoped>
.track {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

.track-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.track-lanes {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 12px;
}

.track-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

.lap-info {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.finish-label {
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
}
</style>
