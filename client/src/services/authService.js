import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    const { token } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};