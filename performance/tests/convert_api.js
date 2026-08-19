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
  scenarios: {
    // Scenario 1: Smoke Test
    smoke_test: {
      executor: scenarios.smoke.executor,
      vus: scenarios.smoke.vus,
      duration: scenarios.smoke.duration,
      tags: { test_type: 'smoke' },
    },
    
    // Scenario 2: Load Test
    load_test: {
      executor: scenarios.load.executor,
      stages: scenarios.load.stages,
      tags: { test_type: 'load' },
    },
    
    // Scenario 3: Stress Test
    stress_test: {
      executor: scenarios.stress.executor,
      stages: scenarios.stress.stages,
      tags: { test_type: 'stress' },
    },
    
    // Scenario 4: Spike Test
    spike_test: {
      executor: scenarios.spike.executor,
      stages: scenarios.spike.stages,
      tags: { test_type: 'spike' },
    },
  },
};

// Combine valid and invalid test cases from configuration
const allTestCases = [...testCases.valid, ...testCases.invalid];

// Main test function - runs for each VU iteration
export default function () {
  // Randomly select a test case from the combined pool
  const testCase = allTestCases[Math.floor(Math.random() * allTestCases.length)];
  
  // Make the request
  const res = makeRequest(testCase);
  
  // Add a small delay between requests to simulate think time
  sleep(0.1 + Math.random() * 0.2); // 100-300ms random delay
}
