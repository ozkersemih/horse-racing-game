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
  gap: 12px;
  border: 1px solid black;
}

.header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
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
}

.horse-list-section {
  background-color: #fff;
  border: 1px solid black;
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
