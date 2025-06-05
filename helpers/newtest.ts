// Test 1: Manual OPTIONS request
const testOptions = async () => {
  console.log("🔍 Testing OPTIONS request manually...");
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log("OPTIONS Status:", response.status);
    console.log("OPTIONS Headers:");
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
  } catch (error) {
    console.error("OPTIONS failed:", error);
  }
};

// Test 2: Check what headers the browser is sending
const testCorsHeaders = async () => {
  console.log("🔍 Testing what browser sends in preflight...");
  
  // This will trigger a preflight
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ test: true })
    });
  } catch (error) {
    console.log("Expected error:", error instanceof Error ? error.message : String(error));
  }
};

// Make functions globally available
(global as any).testOptions = testOptions;
(global as any).testCorsHeaders = testCorsHeaders;

console.log("Run testOptions() and testCorsHeaders() in your browser console");
export { testCorsHeaders, testOptions };
