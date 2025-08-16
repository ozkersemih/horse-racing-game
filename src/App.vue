<script setup lang="ts">
import RaceControls from './features/race-controls/RaceControls.vue'
import HorseList from './features/horse-list/HorseList.vue'
import Track from './features/track/Track.vue'
import Results from './features/results/Results.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Horse Racing</h1>
      <RaceControls />
    </header>

    <main class="main-content">
      <div class="horse-list-section">
        <HorseList />
      </div>

      <div class="track-section">
        <Track />
      </div>

      <div class="results-section">
        <Results />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.header {
  background-color: #e88a8a;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.75fr 1.25fr;
  gap: 2px;
  background-color: #ccc;
  overflow-y: hidden;
}

.horse-list-section {
  background-color: #fff;
  border: 1px solid black;
  overflow-y: auto;
}

.track-section {
  background-color: #f5f5f5;
  border: 1px solid black;
}

.results-section {
  background-color: #fff;
  border: 1px solid black;
}
</style>
