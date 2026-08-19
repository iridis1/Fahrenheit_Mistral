// K6 Configuration File
// Centralized configuration for Temperature Converter API performance tests

// Base configuration that can be imported by other test files
export const config = {
  // API Configuration
  baseUrl: 'http://localhost:3000',
  convertEndpoint: '/convert',
  
  // Test Configuration
  defaultTimeout: '30s',
  
  // Thresholds - pass/fail criteria
  thresholds: {
    // HTTP errors should be less than 1%
    http_req_failed: ['rate<0.01'],
    
    // Response time thresholds
    http_req_duration: {
      'p(95)<500': ['p(95)<500'],    // 95th percentile < 500ms
      'p(99)<1000': ['p(99)<1000'],  // 99th percentile < 1000ms
      'avg<200': ['avg<200'],        // Average < 200ms
    },
    
    // Check success rate
    checks: ['rate>0.99'], // 99% of checks must pass
  },
  
  // Test data for different conversion types
  testCases: {
    valid: [
      { name: 'celsius_20', query: 'celsius=20', expectedStatus: 200 },
      { name: 'celsius_0', query: 'celsius=0', expectedStatus: 200 },
      { name: 'celsius_negative', query: 'celsius=-40', expectedStatus: 200 },
      { name: 'celsius_100', query: 'celsius=100', expectedStatus: 200 },
      { name: 'fahrenheit_68', query: 'fahrenheit=68', expectedStatus: 200 },
      { name: 'fahrenheit_32', query: 'fahrenheit=32', expectedStatus: 200 },
      { name: 'fahrenheit_212', query: 'fahrenheit=212', expectedStatus: 200 },
      { name: 'kelvin_293', query: 'kelvin=293.15', expectedStatus: 200 },
      { name: 'kelvin_273', query: 'kelvin=273.15', expectedStatus: 200 },
      { name: 'kelvin_373', query: 'kelvin=373.15', expectedStatus: 200 },
    ],
    
    invalid: [
      { name: 'no_params', query: '', expectedStatus: 400 },
      { name: 'invalid_celsius', query: 'celsius=invalid', expectedStatus: 400 },
      { name: 'invalid_fahrenheit', query: 'fahrenheit=not_a_number', expectedStatus: 400 },
      { name: 'invalid_kelvin', query: 'kelvin=abc', expectedStatus: 400 },
      { name: 'absolute_zero_kelvin', query: 'kelvin=0', expectedStatus: 400 },
      { name: 'below_absolute_zero', query: 'kelvin=-1', expectedStatus: 400 },
    ],
  },
  
  // Individual scenario configurations
  scenarios: {
    smoke: {
      name: 'Smoke Test',
      description: 'Basic functionality check with minimal load',
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
    },
    
    load: {
      name: 'Load Test',
      description: 'Ramp up to 50 VUs, sustain for 20 seconds, ramp down',
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 50 },  // Ramp up
        { duration: '20s', target: 50 },  // Sustain
        { duration: '30s', target: 0 },   // Ramp down
      ],
    },
    
    stress: {
      name: 'Stress Test',
      description: 'Ramp up to 200 VUs and sustain for 2 minutes to find breaking point',
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 200 },  // Ramp up
        { duration: '2m', target: 200 },  // Sustain
      ],
    },
    
    spike: {
      name: 'Spike Test',
      description: 'Sudden traffic spike from 10 to 200 VUs',
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 10 },    // Baseline
        { duration: '10s', target: 200 },  // Spike
        { duration: '1m', target: 10 },    // Return to baseline
      ],
    },
  },
};

export default config;
