<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRaceClock } from '../composables/useRaceClock'

defineOptions({
  name: 'RaceTimer',
})

const { elapsedTime, shouldShowTimer, formatTime, cleanup } = useRaceClock()

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div v-if="shouldShowTimer" class="race-timer" data-testid="race-timer">
    {{ formatTime(elapsedTime) }}
  </div>
</template>

<style scoped>
.race-timer {
  font-size: 18px;
  font-weight: bold;
  color: #2196f3;
  font-family: monospace;
}
</style>
