<script setup lang="ts">
const horsesWithPosition = [
  { position: 1, name: 'Ada Lawrence' },
  { position: 2, name: 'Grand Hopper' },
  { position: 3, name: 'Margaret Hamilton' },
  { position: 4, name: 'Ada Lawrence' },
  { position: 5, name: 'Grand Hopper' },
  { position: 6, name: 'Margaret Hamilton' },
  { position: 7, name: 'Ada Lawrence' },
  { position: 8, name: 'Grand Hopper' },
  { position: 9, name: 'Margaret Hamilton' },
  { position: 10, name: 'Ada Lawrence' },
]

const mockProgram = [
  {
    round: 1,
    distance: '1200m',
    horses: horsesWithPosition,
  },
  {
    round: 2,
    distance: '1400m',
    horses: horsesWithPosition,
  },
  {
    round: 3,
    distance: '1600m',
    horses: horsesWithPosition,
  },
  {
    round: 4,
    distance: '1800m',
    horses: horsesWithPosition,
  },
  {
    round: 5,
    distance: '2000m',
    horses: horsesWithPosition,
  },
  {
    round: 6,
    distance: '2200m',
    horses: horsesWithPosition,
  },
]

const mockResults = mockProgram.map((round) => ({
  round: round.round,
  distance: round.distance,
  horses: round.horses.slice().sort((a, b) => a.position - b.position),
}))
</script>

<template>
  <div class="results">
    <div class="program-panel">
      <div class="panel-header">Program</div>
      <div class="panel-content">
        <div v-for="item in mockProgram" :key="item.round" class="round-section">
          <div class="round-title">{{ item.round }}ST Lap - {{ item.distance }}</div>
          <div class="horses-table">
            <div
              v-for="horse in item.horses"
              :key="`${item.round}-${horse.position}`"
              class="horse-row"
            >
              <span class="position">{{ horse.position }}</span>
              <span class="name">{{ horse.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="results-panel">
      <div class="panel-header">Results</div>
      <div class="panel-content">
        <div v-for="result in mockResults" :key="result.round" class="round-section">
          <div class="round-title">{{ result.round }}ST Lap - {{ result.distance }}</div>
          <div class="horses-table">
            <div
              v-for="horse in result.horses"
              :key="`result-${result.round}-${horse.position}`"
              class="horse-row"
            >
              <span class="position">{{ horse.position }}</span>
              <span class="name">{{ horse.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results {
  height: 100%;
  display: flex;
  gap: 1px;
}

.program-panel,
.results-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.panel-header {
  background-color: #2196f3;
  color: white;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.round-section {
  border-bottom: 2px solid #eee;
}

.round-title {
  background-color: #f8f9fa;
  padding: 6px 8px;
  font-weight: bold;
  font-size: 11px;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.horses-table {
  padding: 4px 8px;
}

.horse-row {
  display: flex;
  padding: 2px 0;
  border-bottom: 1px solid #f0f0f0;
}

.position {
  width: 20px;
  font-weight: bold;
  font-size: 10px;
  color: #666;
}

.name {
  flex: 1;
  font-size: 10px;
  color: #333;
}
</style>
