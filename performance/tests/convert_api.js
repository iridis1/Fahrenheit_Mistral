import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import config from '../k6.config.js';

// Custom metrics
const responseTimeTrend = new Trend('response_time', true);
const errorRate = new Rate('error_rate');
const requestCounter = new Counter('requests_count');

// Use configuration from k6.config.js
const { baseUrl, convertEndpoint, thresholds, testCases, scenarios } = config;

function randomIntBetween(min, max) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);

  if (upper < lower) {
    throw new Error(`Invalid random range: ${min}..${max}`);
  }

  return Math.floor(Math.random() * (upper - lower + 1)) + lower; // NOSONAR (it complains about Math.random() being insecure, but it's fine for performance testing)
}

const configuredScenarios = {
  smoke_test: {
    executor: scenarios.smoke.executor,
    vus: scenarios.smoke.vus,
    duration: scenarios.smoke.duration,
    tags: { test_type: 'smoke' },
  },
  load_test: {
    executor: scenarios.load.executor,
    stages: scenarios.load.stages,
    tags: { test_type: 'load' },
  },
  stress_test: {
    executor: scenarios.stress.executor,
    stages: scenarios.stress.stages,
    tags: { test_type: 'stress' },
  },
  spike_test: {
    executor: scenarios.spike.executor,
    stages: scenarios.spike.stages,
    tags: { test_type: 'spike' },
  },
};

const selectedScenario = __ENV.SCENARIO;
const selectedScenarios = Object.fromEntries(
  Object.entries(configuredScenarios).filter(
    ([name]) => !selectedScenario || name === selectedScenario,
  ),
);

// Build full endpoint URL
const fullUrl = `${baseUrl}${convertEndpoint}`;

// Helper function to make requests
export function makeRequest(testCase) {
  const url = `${fullUrl}${testCase.query ? '?' + testCase.query : ''}`;
  
  const res = http.get(url);
  
  // Record metrics
  responseTimeTrend.add(res.timings.duration);
  errorRate.add(res.status !== testCase.expectedStatus);
  requestCounter.add(1);
  
  // Validate response
  check(res, {
    [`status is ${testCase.expectedStatus}`]: (r) => r.status === testCase.expectedStatus,
    'response is valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch (e) {
        return false;
      }
    },
  });
  
  return res;
}

// Setup function - runs once before all scenarios
export function setup() {
  console.log('Starting Temperature Converter API Performance Tests');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Endpoint: ${convertEndpoint}`);
  return { startTime: new Date().toISOString() };
}

// Teardown function - runs once after all scenarios
export function teardown(data) {
  console.log('Performance tests completed');
  console.log(`Start time: ${data.startTime}`);
  console.log(`End time: ${new Date().toISOString()}`);
}

// Configuration exported from k6.config.js is used for scenarios and thresholds
export const options = {
  // Thresholds from configuration
  thresholds: {
    http_req_failed: thresholds.http_req_failed,
    http_req_duration: thresholds.http_req_duration,
    checks: thresholds.checks,
  },
  
  // Scenarios from configuration
  scenarios: selectedScenarios,
};

// Combine valid and invalid test cases from configuration
const allTestCases = [...testCases.valid, ...testCases.invalid];

// Main test function - runs for each VU iteration
export default function main() {
  // Select a test case from the combined pool
  const randomIndex = randomIntBetween(0, allTestCases.length - 1);
  const testCase = allTestCases[randomIndex];
  
  makeRequest(testCase);
  
  // Add a random delay between requests to simulate think time (100-300ms)
  const delayMs = randomIntBetween(100, 300);
  sleep(delayMs / 1000);
}
