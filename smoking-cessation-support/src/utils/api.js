import axios from 'axios';

const API_BASE_URL = 'https://api.smokingcessationplatform.com'; // Replace with your actual API base URL

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to fetch user profile');
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to update user profile');
  }
};

export const fetchPlans = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plans`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to fetch plans');
  }
};

export const createPlan = async (planData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/plans`, planData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to create plan');
  }
};

export const fetchProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/progress/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to fetch progress');
  }
};