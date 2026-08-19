# Temperature Converter API - Performance Tests

This directory contains performance tests for the Temperature Converter API using [K6](https://k6.io/), a modern load testing tool.

## Prerequisites

Before running the performance tests, ensure you have:

1. **K6 installed** on your system:
   - **Windows (Chocolatey):** `choco install k6`
   - **macOS (Homebrew):** `brew install k6`
   - **Linux (Debian/Ubuntu):** See [K6 installation guide](https://k6.io/docs/get-started/installation/)
   - **Manual download:** Available at https://k6.io/docs/get-started/installation/

2. **API running** on port 3000:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

3. Verify the API is accessible:
   ```bash
   curl http://localhost:3000/convert?celsius=20
   ```

## Quick Start

Run all performance test scenarios:
```bash
k6 run tests/convert_api.js
```

## Test Scenarios

The performance tests include four different scenarios to evaluate the API under various load conditions:

### 1. Smoke Test
- **Purpose:** Basic functionality verification
- **Load:** 1 Virtual User (VU)
- **Duration:** 10 seconds
- **Use case:** Quick sanity check before running heavier tests

### 2. Load Test
- **Purpose:** Measure performance under sustained load
- **Load Pattern:**
  - Ramp up from 0 to 50 VUs over 30 seconds
  - Sustain 50 VUs for 20 seconds
  - Ramp down to 0 over 30 seconds
- **Total Duration:** ~80 seconds
- **Use case:** Evaluate typical production load handling

### 3. Stress Test
- **Purpose:** Find the breaking point of the API
- **Load Pattern:**
  - Ramp up from 0 to 200 VUs over 1 minute
  - Sustain 200 VUs for 2 minutes
- **Total Duration:** 3 minutes
- **Use case:** Determine maximum capacity and identify performance bottlenecks

### 4. Spike Test
- **Purpose:** Test handling of sudden traffic bursts
- **Load Pattern:**
  - 10 VUs for 1 minute (baseline)
  - Spike to 200 VUs for 10 seconds
  - Return to 10 VUs for 1 minute
- **Total Duration:** ~2 minutes 10 seconds
- **Use case:** Verify resilience to traffic spikes (e.g., from social media, news)

## Running Individual Scenarios

To run a specific scenario, use the `--scenario` flag:

```bash
# Run only the smoke test
k6 run --scenario smoke_test tests/convert_api.js

# Run only the load test
k6 run --scenario load_test tests/convert_api.js

# Run only the stress test
k6 run --scenario stress_test tests/convert_api.js

# Run only the spike test
k6 run --scenario spike_test tests/convert_api.js
```

## Running via npm Scripts

For convenience, npm scripts are available in the main `package.json`:

```bash
# Run all performance tests
npm run test:performance

# Run the load test scenario
npm run test:performance:load

# Run the stress test scenario
npm run test:performance:stress
```

## Test Cases

Each request tests one of the following scenarios:

### Valid Conversions (200 OK)
- Celsius to all units: `?celsius=20`
- Fahrenheit to all units: `?fahrenheit=68`
- Kelvin to all units: `?kelvin=293.15`
- Edge cases: 0, negative values, boiling/freezing points

### Error Handling (400 Bad Request)
- No parameters provided
- Invalid numeric values (non-numbers)
- Below absolute zero temperatures

## Performance Thresholds

The tests enforce the following pass/fail criteria:

| Metric | Threshold | Description |
|--------|-----------|-------------|
| HTTP Error Rate | < 1% | Less than 1% of requests should fail |
| P95 Response Time | < 500ms | 95th percentile response time under 500ms |
| P99 Response Time | < 1000ms | 99th percentile response time under 1 second |
| Average Response Time | < 200ms | Average response time under 200ms |
| Check Success Rate | > 99% | Over 99% of validation checks must pass |

**Note:** Tests will fail if any threshold is exceeded.

## Understanding the Output

When running K6 tests, you'll see output similar to:

```
running (0m01.0s)

     ✓ checks......................: 100.00% ✓ 100    ✗ 0
     ✓ http_req_duration...........: avg=15.23ms p(95)=25.45ms p(99)=45.67ms
     ✓ http_req_failed.............: 0.00%   ✓ 0        ✗ 100
     ✓ status is 200...............: 100.00% ✓ 100    ✗ 0
     ✓ status is 400...............: 100.00% ✓ 10      ✗ 0
     ✓ response is valid JSON......: 100.00% ✓ 110    ✗ 0

     data_received..................: 15 KB  1.5 kB/s
     data_sent......................: 5 KB   500 B/s
     http_req_duration..............: avg=15.23ms min=1ms med=12ms max=50ms
     http_reqs......................: 110    11.000/s
     iteration_duration.............: avg=115ms  min=100ms med=112ms max=250ms
     iterations.....................: 110    11.000/s
     vus............................: 1      min=1      max=1
     vus_max........................: 1      min=1      max=1
```

### Key Metrics:
- **http_req_duration:** Response time statistics (avg, p95, p99, min, max)
- **http_reqs:** Total requests per second
- **http_req_failed:** Percentage of failed requests
- **iterations:** Number of complete test iterations
- **checks:** Number of passed validation checks
- **vus:** Current number of virtual users

## Configuration

The main configuration is in `k6.config.js`:

```javascript
{
  baseUrl: 'http://localhost:3000',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000', 'avg<200'],
    checks: ['rate>0.99']
  }
}
```

To test against a different environment (e.g., staging, production), modify the `baseUrl` in the test file or use environment variables.

## Advanced Usage

### Running with Environment Variables

```bash
# Test against a different host
K6_BASE_URL=http://staging.example.com:3000 k6 run tests/convert_api.js
```

### Running with Multiple Iterations

```bash
# Run each VU iteration multiple times
k6 run --iterations 100 tests/convert_api.js
```

### Running with Higher Load

```bash
# Override scenario configuration
k6 run --stage 30s:100,1m:200,30s:100 tests/convert_api.js
```

### Generating HTML Reports

Install the K6 HTML reporter:
```bash
npm install -g k6-reporter
```

Then run with output:
```bash
k6 run --out json=results.json tests/convert_api.js
k6-reporter results.json report.html
```

### Running in Cloud

K6 can be run in cloud environments. See [K6 Cloud](https://k6.io/docs/results-output/cloud/) for more information.

## Directory Structure

```
performance/
├── tests/
│   └── convert_api.js      # Main performance test script with all scenarios
├── k6.config.js            # Centralized configuration and test data
└── README.md               # This file
```

## Troubleshooting

### K6 command not found
Ensure K6 is installed and in your PATH. Verify with:
```bash
k6 version
```

### Connection refused errors
Make sure your API server is running:
```bash
npm start
```

### Tests failing thresholds
If tests fail the performance thresholds:
1. Check if the API is responding: `curl http://localhost:3000/convert?celsius=20`
2. Reduce the load (lower VU counts) in the scenario configuration
3. Adjust thresholds to match your performance requirements
4. Investigate API performance issues (CPU, memory, database bottlenecks)

## Resources

- [K6 Documentation](https://k6.io/docs/)
- [K6 Examples](https://k6.io/docs/examples/)
- [K6 Thresholds](https://k6.io/docs/using-k6/thresholds/)
- [K6 Scenarios](https://k6.io/docs/using-k6/scenarios/)

## License

This performance test suite is licensed under the MIT License, same as the main project.
