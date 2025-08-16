<script setup lang="ts">
interface Props {
  laneNumber: number
  horsePosition: number
}

defineProps<Props>()
</script>

<template>
  <div class="horse-lane">
    <div class="lane-number">{{ laneNumber }}</div>
    <div class="lane-track">
      <div class="horse-icon" :style="{ left: `${horsePosition}%` }">🐎</div>
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
}

.horse-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}
</style>
