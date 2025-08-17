<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRaceTimer } from './composables/useRaceTimer'

const store = useStore()
const { startRace, pauseRace, cleanup, isRaceRunning } = useRaceTimer()

const isGenerated = computed(() => store.getters['race/isGenerated'])

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

// Cleanup on component unmount
onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="race-controls">
    <button class="btn generate-btn" @click="handleGenerate" :disabled="isGenerated">
      {{ isGenerated ? 'PROGRAM GENERATED' : 'GENERATE PROGRAM' }}
    </button>
    <button class="btn start-btn" @click="handleStartPause" :disabled="!isGenerated">
      {{ isRaceRunning ? 'PAUSE' : 'START' }}
    </button>
  </div>
</template>

<style scoped>
.race-controls {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
}

.generate-btn {
  background-color: #4caf50;
  color: white;
}

.generate-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.start-btn {
  background-color: #f44336;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #da190b;
}
</style>
