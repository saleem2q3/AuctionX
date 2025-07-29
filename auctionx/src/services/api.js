import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const registerUser = (userData) => api.post('/user/register', userData);
export const loginUser = (loginData) => api.post('/user/login', loginData);
export const getUserDetails = () => api.get('/user/details');
export const updateUser = (userData) => api.put('/user/update', userData);
export const logoutUser = () => api.post('/user/logout');
