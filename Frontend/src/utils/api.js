import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(credentials) {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return { success: true, user, token };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
}

export async function verifyToken() {
  try {
    const response = await axiosInstance.post('/auth/verify');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return { valid: false };
  }
}

export async function getProfile() {
  try {
    const response = await axiosInstance.get('/profile/me');
    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profile');
  }
}

export async function updateProfile(data) {
  try {
    const response = await axiosInstance.put('/profile/me', data);
    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update profile');
  }
}

export async function getCodeforcesStats(username) {
  try {
    const response = await axiosInstance.get(`/cf/${username}`);
    return response.data;
  } catch (error) {
    console.error('Codeforces API Error:', error);
    throw new Error(`Failed to fetch Codeforces data for ${username}`);
  }
}

export async function getLeetCodeStats(username) {
  try {
    const response = await axiosInstance.get(`/lc/${username}`);
    return response.data;
  } catch (error) {
    console.error('LeetCode API Error:', error);
    throw new Error(`Failed to fetch LeetCode data for ${username}`);
  }
}

export async function searchCodeforcesUser(username) {
  try {
    const response = await axiosInstance.get(`/cf/search/${username}`);
    return response.data;
  } catch (error) {
    return { exists: false, username, error: error.message };
  }
}