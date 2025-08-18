<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRaceEngine } from './composables/useRaceEngine'
import BaseButton from '@/components/BaseButton.vue'

const store = useStore()
const { startRace, pauseRace, cleanup, isRaceRunning } = useRaceEngine()

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
  if (raceStatus.value === 'running') return 'PAUSE'
  if (raceStatus.value === 'paused') return 'RESUME'
  return 'START'
}

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="race-controls" data-testid="race-controls">
    <BaseButton
      data-testid="btn-generate"
      variant="primary"
      :disabled="isGenerated"
      @click="handleGenerate"
    >
      {{ isGenerated ? 'PROGRAM GENERATED' : 'GENERATE PROGRAM' }}
    </BaseButton>

    <BaseButton
      data-testid="btn-start"
      variant="danger"
      :disabled="!isGenerated"
      @click="handleStartPause"
    >
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
