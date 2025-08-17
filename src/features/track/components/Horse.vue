<script setup lang="ts">
import type { Horse } from '@/stores/modules/horses'

defineOptions({
  name: 'HorseDisplay',
})

interface Props {
  horse: Horse
  progress?: number
}

withDefaults(defineProps<Props>(), {
  progress: 0,
})
</script>

<template>
  <div class="horse" :style="{ left: `${progress}%`, transform: `translateX(-${progress}%)` }">
    <span class="horse-icon">🐎</span>
    <span class="horse-name">{{ horse.name }}</span>
  </div>
</template>

<style scoped>
.horse {
  position: relative;
  font-size: 10px;
}

.horse-icon {
  font-size: 16px;
}

.horse-name {
  position: absolute;
  top: -60%;
  right: -100%;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}
</style>
