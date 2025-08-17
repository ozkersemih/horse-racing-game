<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRaceTimer } from './composables/useRaceTimer'
import BaseButton from '@/components/BaseButton.vue'

const store = useStore()
const { startRace, pauseRace, cleanup, isRaceRunning } = useRaceTimer()

const isGenerated = computed(() => store.getters['race/isGenerated'])
const raceStatus = computed(() => store.getters['race/raceStatus'])

function handleGenerate() {
  store.dispatch('race/generateRace')
}

function handleStartPause() {
  if (isRaceRunning.value) {
    pauseRace()
  } else {
    startRace()
  }
}

function getStartPauseButtonText(): string {
  if (raceStatus.value === 'running') {
    return 'PAUSE'
  } else if (raceStatus.value === 'paused') {
    return 'RESUME'
  } else {
    return 'START'
  }
}

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="race-controls">
    <BaseButton variant="primary" :disabled="isGenerated" @click="handleGenerate">
      {{ isGenerated ? 'PROGRAM GENERATED' : 'GENERATE PROGRAM' }}
    </BaseButton>
    <BaseButton variant="danger" :disabled="!isGenerated" @click="handleStartPause">
      {{ getStartPauseButtonText() }}
    </BaseButton>
  </div>
</template>

<style scoped>
.race-controls {
  display: flex;
  gap: 16px;
}
</style>
