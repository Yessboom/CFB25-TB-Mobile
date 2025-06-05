// Enhanced test login with detailed debugging
const testLogin = async () => {
  console.log("🚀 Starting login request from React...");
  console.log("Current origin:", window.location.origin);
  console.log("Target URL: http://localhost:3000/api/auth/login");
  
  try {
    console.log("📤 Making fetch request with credentials...");
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: 'newtest',
        password: 'newtest'
      })
    });
    
    console.log("📡 Response received!");
    console.log("Status:", response.status);
    console.log("Status text:", response.statusText);
    console.log("Response OK:", response.ok);
    
    // Log all response headers
    console.log("Response headers:");
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("📦 Response data:", data);
    } else {
      console.log("❌ Response not OK, attempting to read body anyway...");
      try {
        const errorData = await response.text();
        console.log("Error response body:", errorData);
      } catch (bodyError) {
        console.log("Could not read error response body:", bodyError);
      }
    }
    
  } catch (error) {
    console.error("💥 Request failed:", error);
    console.error("Error type:", typeof error);
    console.error("Error name:", error instanceof Error ? error.name : "Unknown");
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
  }
};

// Test without credentials for comparison
const testLoginWithoutCredentials = async () => {
  console.log("🧪 Testing login WITHOUT credentials...");
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No credentials: 'include'
      body: JSON.stringify({
        username: 'newtest',
        password: 'newtest'
      })
    });
    
    console.log("📡 No-credentials response:", response.status, response.statusText);
    
    // Log response headers
    console.log("No-credentials response headers:");
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("📦 No-credentials data:", data);
    }
    
  } catch (error) {
    console.error("💥 No-credentials request failed:", error);
  }
};

// Make both functions globally available
(global as any).testLogin = testLogin;
(global as any).testLoginWithoutCredentials = testLoginWithoutCredentials;

export { testLogin, testLoginWithoutCredentials };

