import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics
const responseTimeTrend = new Trend('response_time', true);
const errorRate = new Rate('error_rate');
const requestCounter = new Counter('requests_count');

// Configuration
export const options = {
  // Thresholds - pass/fail criteria
  thresholds: {
    http_req_failed: ['rate<0.01'], // HTTP errors < 1%
    http_req_duration: ['p(95)<500', 'p(99)<1000', 'avg<200'], // P95 < 500ms, P99 < 1000ms, avg < 200ms
    checks: ['rate>0.99'], // 99% of checks must pass
  },
  
  // Scenario configurations will be set per scenario
  scenarios: {
    // Scenario 1: Smoke Test
    smoke_test: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
      tags: { test_type: 'smoke' },
    },
    
    // Scenario 2: Load Test
    load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 VUs over 30s
        { duration: '20s', target: 50 },  // Stay at 50 VUs for 20s
        { duration: '30s', target: 0 },   // Ramp down to 0 over 30s
      ],
      tags: { test_type: 'load' },
    },
    
    // Scenario 3: Stress Test
    stress_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 200 },   // Ramp up to 200 VUs over 1 minute
        { duration: '2m', target: 200 },  // Stay at 200 VUs for 2 minutes
      ],
      tags: { test_type: 'stress' },
    },
    
    // Scenario 4: Spike Test
    spike_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 10 },    // 10 VUs for 1 minute
        { duration: '10s', target: 200 },  // Spike to 200 VUs for 10 seconds
        { duration: '1m', target: 10 },    // Back to 10 VUs for 1 minute
      ],
      tags: { test_type: 'spike' },
    },
  },
};

// Base URL - update if running against different environment
const BASE_URL = 'http://localhost:3000';

// Test data for different conversion types
const testCases = [
  { name: 'celsius', query: 'celsius=20', expectedStatus: 200 },
  { name: 'fahrenheit', query: 'fahrenheit=68', expectedStatus: 200 },
  { name: 'kelvin', query: 'kelvin=293.15', expectedStatus: 200 },
  { name: 'no_params', query: '', expectedStatus: 400 },
  { name: 'invalid_celsius', query: 'celsius=invalid', expectedStatus: 400 },
  { name: 'absolute_zero', query: 'kelvin=0', expectedStatus: 400 },
];

// Helper function to make requests
export function makeRequest(testCase) {
  const url = `${BASE_URL}/convert${testCase.query ? '?' + testCase.query : ''}`;
  
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
  console.log(`Base URL: ${BASE_URL}`);
  return { startTime: new Date().toISOString() };
}

// Main test function - runs for each VU iteration
export default function () {
  // Randomly select a test case
  const testCase = testCases[Math.floor(Math.random() * testCases.length)];
  
  // Make the request
  const res = makeRequest(testCase);
  
  // Add a small delay between requests to simulate think time
  sleep(0.1 + Math.random() * 0.2); // 100-300ms random delay
}

// Teardown function - runs once after all scenarios
export function teardown(data) {
  console.log('Performance tests completed');
  console.log(`Start time: ${data.startTime}`);
  console.log(`End time: ${new Date().toISOString()}`);
}
