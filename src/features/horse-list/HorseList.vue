<script setup lang="ts">
import HorseListItem from './components/HorseListItem.vue'

// Mock data for UI development
const mockHorses = [
  { id: 1, name: 'Ada Lawrence', color: 'Red', condition: 85 },
  { id: 2, name: 'Grand Hopper', color: 'Blue', condition: 92 },
  { id: 3, name: 'Margaret Hamilton', color: 'Yellow', condition: 78 },
  { id: 4, name: 'Ada Lawrence', color: 'Green', condition: 91 },
  { id: 5, name: 'Grand Hopper', color: 'Orange', condition: 67 },
  { id: 6, name: 'Margaret Hamilton', color: 'Purple', condition: 89 },
  { id: 7, name: 'Ada Lawrence', color: 'Pink', condition: 73 },
  { id: 8, name: 'Grand Hopper', color: 'Brown', condition: 96 },
  { id: 9, name: 'Margaret Hamilton', color: 'Gray', condition: 82 },
  { id: 10, name: 'Ada Lawrence', color: 'Navy', condition: 75 },
  { id: 11, name: 'Grand Hopper', color: 'Lime', condition: 88 },
  { id: 12, name: 'Margaret Hamilton', color: 'Teal', condition: 94 },
  { id: 13, name: 'Ada Lawrence', color: 'Maroon', condition: 79 },
  { id: 14, name: 'Grand Hopper', color: 'Olive', condition: 86 },
  { id: 15, name: 'Margaret Hamilton', color: 'Silver', condition: 71 },
  { id: 16, name: 'Ada Lawrence', color: 'Cyan', condition: 93 },
  { id: 17, name: 'Grand Hopper', color: 'Magenta', condition: 77 },
  { id: 18, name: 'Margaret Hamilton', color: 'Gold', condition: 90 },
  { id: 19, name: 'Ada Lawrence', color: 'Coral', condition: 84 },
  { id: 20, name: 'Grand Hopper', color: 'Salmon', condition: 76 },
]
</script>

<template>
  <div class="horse-list">
    <div class="horse-list-header">
      <h3>Horse List (1-20)</h3>
    </div>

    <div class="horse-list-content">
      <HorseListItem v-for="horse in mockHorses" :key="horse.id" :horse="horse" />
    </div>
  </div>
</template>

<style scoped>
.horse-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.horse-list-header {
  background-color: #ffeb3b;
  padding: 16px;
}

.horse-list-header h3 {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.horse-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  min-height: 0;
}
</style>
