const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Dairy Management System API...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:5000');
    console.log('✅ Server is running:', healthResponse.data);

    // Test 2: Test registration endpoint
    console.log('\n2. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
        username: 'testuser',
        password: 'password123',
        role: 'USER'
      });
      console.log('✅ Registration successful:', registerResponse.data.message);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Registration endpoint working (user already exists)');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }

    // Test 3: Test login endpoint
    console.log('\n3. Testing user login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        username: 'testuser',
        password: 'password123'
      });
      console.log('✅ Login successful:', loginResponse.data.message);
      
      // Test 4: Test protected endpoint with token
      const token = loginResponse.data.token;
      console.log('\n4. Testing protected endpoint...');
      const usersResponse = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Protected endpoint working:', usersResponse.data.message);
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

    // Test 5: Test error handling
    console.log('\n5. Testing error handling...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'nonexistent',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Error handling working correctly:', error.response.data.message);
      } else {
        console.log('❌ Error handling test failed');
      }
    }

    console.log('\n🎉 API testing completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the test
testAPI(); 