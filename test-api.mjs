#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all available endpoints with various scenarios
 * 
 * Usage: node test-api.mjs [baseUrl]
 * Default baseUrl: http://localhost:3000
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Make HTTP request
 */
async function makeRequest(url, options = {}) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-ID': `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...options.headers
      }
    });
    
    const responseTime = Date.now() - startTime;
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    return {
      success: response.ok,
      status: response.status,
      data,
      responseTime,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

/**
 * Log test result
 */
function logTest(testName, result, expectedStatus) {
  totalTests++;
  
  const status = result.success ? 
    (expectedStatus ? (result.status === expectedStatus ? '✓' : '⚠') : '✓') : 
    '✗';
    
  const color = result.success ? 
    (expectedStatus ? (result.status === expectedStatus ? colors.green : colors.yellow) : colors.green) : 
    colors.red;
    
  console.log(`${status} ${testName} (${result.responseTime}ms)`);
  
  if (!result.success || (expectedStatus && result.status !== expectedStatus)) {
    failedTests++;
    console.log(`  ${colors.red}Failed:${colors.reset} ${JSON.stringify(result, null, 2)}`);
  } else {
    passedTests++;
  }
}

/**
 * Test GET /hello endpoint
 */
async function testHelloEndpoint() {
  console.log(`\n${colors.cyan}Testing GET /hello endpoint${colors.reset}`);
  
  const result = await makeRequest(`${API_BASE}/hello`);
  logTest('GET /hello - should return greeting message', result, 200);
  
  if (result.success && result.data && result.data.status === true) {
    console.log(`  ${colors.green}Response format: Standardized API response${colors.reset}`);
    console.log(`  ${colors.green}Message: ${result.data.payload}${colors.reset}`);
  }
}

/**
 * Test GET /health endpoint
 */
async function testHealthEndpoint() {
  console.log(`\n${colors.cyan}Testing GET /health endpoint${colors.reset}`);
  
  const result = await makeRequest(`${API_BASE}/health`);
  logTest('GET /health - should return health status', result, 200);
  
  if (result.success && result.data && result.data.status === true) {
    const healthData = result.data.payload;
    console.log(`  ${colors.green}Status: ${healthData.status}${colors.reset}`);
    console.log(`  ${colors.green}Uptime: ${healthData.uptime.toFixed(2)}s${colors.reset}`);
    console.log(`  ${colors.green}Memory: ${Math.round(healthData.memory.heapUsed / 1024 / 1024)}MB${colors.reset}`);
  }
}

/**
 * Test GET / (API info) endpoint
 */
async function testApiInfoEndpoint() {
  console.log(`\n${colors.cyan}Testing GET / (API info) endpoint${colors.reset}`);
  
  const result = await makeRequest(`${API_BASE}/`);
  logTest('GET / - should return API information', result, 200);
  
  if (result.success && result.data && result.data.status === true) {
    const apiInfo = result.data.payload;
    console.log(`  ${colors.green}Name: ${apiInfo.name}${colors.reset}`);
    console.log(`  ${colors.green}Version: ${apiInfo.version}${colors.reset}`);
    console.log(`  ${colors.green}Endpoints: ${Object.keys(apiInfo.endpoints).length}${colors.reset}`);
  }
}

/**
 * Test POST /echo endpoint with valid data
 */
async function testEchoEndpointValid() {
  console.log(`\n${colors.cyan}Testing POST /echo endpoint with valid data${colors.reset}`);
  
  const testData = {
    message: "Hello API!",
    data: {
      test: true,
      number: 42,
      timestamp: new Date().toISOString()
    }
  };
  
  const result = await makeRequest(`${API_BASE}/echo`, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  logTest('POST /echo - should echo back JSON data', result, 200);
  
  if (result.success && result.data && result.data.status === true) {
    const echoData = result.data.payload;
    console.log(`  ${colors.green}Original message: ${echoData.originalMessage}${colors.reset}`);
    console.log(`  ${colors.green}Received data: ${JSON.stringify(echoData.receivedData)}${colors.reset}`);
  }
}

/**
 * Test POST /echo endpoint with invalid data
 */
async function testEchoEndpointInvalid() {
  console.log(`\n${colors.cyan}Testing POST /echo endpoint with invalid data${colors.reset}`);
  
  const invalidData = {
    data: {
      test: true
      // missing 'message' field
    }
  };
  
  const result = await makeRequest(`${API_BASE}/echo`, {
    method: 'POST',
    body: JSON.stringify(invalidData)
  });
  
  logTest('POST /echo - should reject missing message field with 400', 
    { ...result, success: result.status === 400 }, 400);
  
  if (result.status === 400 && result.data && result.data.status === false) {
    console.log(`  ${colors.green}Error code: ${result.data.error.code}${colors.reset}`);
    console.log(`  ${colors.green}Error message: ${result.data.error.message}${colors.reset}`);
  }
}

/**
 * Test POST /echo endpoint with invalid JSON
 */
async function testEchoEndpointInvalidJSON() {
  console.log(`\n${colors.cyan}Testing POST /echo endpoint with invalid JSON${colors.reset}`);
  
  const result = await makeRequest(`${API_BASE}/echo`, {
    method: 'POST',
    body: 'invalid json'
  });
  
  logTest('POST /echo - should reject invalid JSON with 400', 
    { ...result, success: result.status === 400 }, 400);
}

/**
 * Test 404 endpoint
 */
async function test404Endpoint() {
  console.log(`\n${colors.cyan}Testing 404 endpoint${colors.reset}`);
  
  const result = await makeRequest(`${API_BASE}/notfound`);
  logTest('GET /notfound - should return 404 with proper error format', 
    { ...result, success: result.status === 404 }, 404);
  
  if (result.status === 404 && result.data && result.data.status === false) {
    console.log(`  ${colors.green}Error code: ${result.data.error.code}${colors.reset}`);
    console.log(`  ${colors.green}Available endpoints: ${result.data.error.details?.availableEndpoints?.length}${colors.reset}`);
  }
}

/**
 * Test CORS headers
 */
async function testCORSHeaders() {
  console.log(`\n${colors.cyan}Testing headers and middleware${colors.reset}`);
  
  const result = await makeRequest(`${API_BASE}/hello`);
  
  const hasRequestId = result.headers['x-request-id'] !== undefined;
  logTest('Headers - should include X-Request-ID', { success: hasRequestId, status: 200, responseTime: 0 }, 200);
  
  if (hasRequestId) {
    console.log(`  ${colors.green}Request ID: ${result.headers['x-request-id']}${colors.reset}`);
  }
}

/**
 * Test performance
 */
async function testPerformance() {
  console.log(`\n${colors.cyan}Testing performance${colors.reset}`);
  
  const requests = [];
  for (let i = 0; i < 5; i++) {
    requests.push(makeRequest(`${API_BASE}/hello`));
  }
  
  const results = await Promise.all(requests);
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  logTest(`Performance - average response time ${avgResponseTime.toFixed(2)}ms`, 
    { success: avgResponseTime < 1000, status: 200, responseTime: 0 }, 200);
    
  console.log(`  ${colors.green}5 concurrent requests average: ${avgResponseTime.toFixed(2)}ms${colors.reset}`);
}

/**
 * Print test summary
 */
function printSummary() {
  console.log(`\n${colors.bright}=== Test Summary ===${colors.reset}`);
  console.log(`Total tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Success rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);
  
  if (failedTests === 0) {
    console.log(`\n${colors.green}${colors.bright}🎉 All tests passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}❌ Some tests failed${colors.reset}`);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`${colors.bright}🚀 Starting API Tests${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`API Base: ${API_BASE}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Run all tests
    await testHelloEndpoint();
    await testHealthEndpoint();
    await testApiInfoEndpoint();
    await testEchoEndpointValid();
    await testEchoEndpointInvalid();
    await testEchoEndpointInvalidJSON();
    await test404Endpoint();
    await testCORSHeaders();
    await testPerformance();
    
  } catch (error) {
    console.error(`${colors.red}Test runner error: ${error.message}${colors.reset}`);
  } finally {
    printSummary();
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests, makeRequest };