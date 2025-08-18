<script setup lang="ts">
import type { Horse } from '@/stores/modules/horses'

interface Props {
  horse: Horse
}

defineProps<Props>()
</script>

<template>
  <div class="horse-item" data-testid="horse-item">
    <div class="horse-number" data-testid="horse-number">{{ horse.id }}</div>
    <div>
      <div class="horse-name" data-testid="horse-name">{{ horse.name }}</div>
      <div class="horse-details" data-testid="horse-details">
        <span class="horse-condition" data-testid="horse-condition">{{ horse.condition }}</span>
        <div
          class="horse-color-indicator"
          data-testid="horse-color-indicator"
          :style="{ backgroundColor: horse.color.toLowerCase() }"
        ></div>
        <span class="horse-color-text" data-testid="horse-color-text">{{ horse.color }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horse-item {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 16px;
  border-bottom: 1px solid #eee;
}

.horse-item:hover {
  background-color: #f8f9fa;
}

.horse-number {
  width: 30px;
  text-align: center;
  font-weight: bold;
  color: #666;
}

.horse-name {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 2px;
}

.horse-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.horse-condition {
  font-weight: bold;
}

.horse-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.horse-color-text {
  font-size: 12px;
}
</style>
