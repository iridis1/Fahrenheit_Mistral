<template>
  <div class="converter-container">
    <h1>Temperatuur Converter</h1>
    
    <div class="input-group">
      <input
        type="number"
        v-model.number="temperature"
        placeholder="Temperatuur"
        @keyup.enter="convert"
      >
      <select v-model="unit">
        <option value="celsius">Celsius</option>
        <option value="fahrenheit">Fahrenheit</option>
        <option value="kelvin">Kelvin</option>
      </select>
      <button @click="convert" :disabled="loading">
        {{ loading ? 'Laden...' : 'Converteer' }}
      </button>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="result" class="results">
      <h2>Resultaat:</h2>
      <div class="result-item">
        <span>Celsius:</span>
        <strong>{{ result.celsius.toFixed(2) }} °C</strong>
      </div>
      <div class="result-item">
        <span>Fahrenheit:</span>
        <strong>{{ result.fahrenheit.toFixed(2) }} °F</strong>
      </div>
      <div class="result-item">
        <span>Kelvin:</span>
        <strong>{{ result.kelvin.toFixed(2) }} K</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { convertTemperature, TemperatureResult } from '@/services/api';

const temperature = ref<number | null>(null);
const unit = ref<'celsius' | 'fahrenheit' | 'kelvin'>('celsius');
const result = ref<TemperatureResult | null>(null);
const error = ref<string | null>(null);
const loading = ref<boolean>(false);

const convert = async () => {
  if (temperature.value === null || temperature.value.toString().trim() === '') {
    error.value = 'Voer een temperatuur in';
    result.value = null;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    result.value = await convertTemperature(temperature.value, unit.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Onbekende fout opgetreden';
    result.value = null;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.converter-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

input, select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input {
  flex: 1;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  padding: 0.5rem;
  background-color: #ffeeee;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.results {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 4px;
}

.result-item {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}
</style>
