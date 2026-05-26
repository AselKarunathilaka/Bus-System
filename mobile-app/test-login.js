const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('https://bus-system-3lgy.onrender.com/api/auth/login', {
      email: 'admin@quickbus.lk', // or any email
      password: 'wrongpassword123'
    });
    console.log("LOGIN SUCCESSFUL WITH WRONG PASSWORD!");
    console.log(res.data);
  } catch (error) {
    console.log("LOGIN FAILED AS EXPECTED:");
    console.log(error.response?.status, error.response?.data);
  }
}

testLogin();
