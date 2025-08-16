<script setup lang="ts">
import HorseLane from './components/HorseLane.vue'

const lanes = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  position: 0,
}))
</script>

<template>
  <div class="track">
    <div class="track-lanes">
      <HorseLane
        v-for="lane in lanes"
        :key="lane.id"
        :lane-number="lane.id"
        :horse-position="lane.position"
      />
    </div>

    <div class="track-footer">
      <span class="lap-info">1st Lap 1200m</span>
      <span class="finish-label">FINISH</span>
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
  background-color: #ff5722;
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
}
</style>
