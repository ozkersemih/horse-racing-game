<script setup lang="ts"></script>

<template>
  <div class="race-controls">
    <button class="btn generate-btn">GENERATE PROGRAM</button>
    <button class="btn start-btn">START / PAUSE</button>
  </div>
</template>

<style scoped>
.race-controls {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-btn {
  background-color: #4caf50;
  color: white;
}

.generate-btn:hover {
  background-color: #45a049;
}

.start-btn {
  background-color: #f44336;
  color: white;
}

.start-btn:hover {
  background-color: #da190b;
}
</style>
