<script setup lang="ts">
import type { Horse } from '@/stores/modules/horses'

interface Props {
  laneNumber: number
  horse: Horse | null
  horsePosition: number
}

defineProps<Props>()
</script>

<template>
  <div class="horse-lane">
    <div class="lane-number">{{ laneNumber }}</div>
    <div class="lane-track">
      <div v-if="horse" class="horse" :style="{ left: `${horsePosition}%` }">
        <span class="horse-icon">🐎</span>
        <span class="horse-name">{{ horse.name }}</span>
      </div>
      <div v-else class="empty-lane">Empty Lane</div>
    </div>
  </div>
</template>

<style scoped>
.horse-lane {
  display: flex;
  align-items: center;
  height: 32px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.lane-number {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #90c695;
  color: white;
  font-weight: bold;
  font-size: 12px;
  height: 100%;
}

.lane-track {
  flex: 1;
  position: relative;
  height: 100%;
  background-color: #f9f9f9;
  border-left: 1px solid #ddd;
  display: flex;
  align-items: center;
}

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

.empty-lane {
  color: #999;
  font-style: italic;
  font-size: 10px;
  margin-left: 8px;
}
</style>
