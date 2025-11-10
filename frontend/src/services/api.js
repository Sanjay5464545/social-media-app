import axios from 'axios';

// Base URL for your backend API
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

// Post APIs
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const getAllPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

export const commentOnPost = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comment`, { text });
  return response.data;
};

export default api;
