import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/auth',

  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const response = await api.post(`${api.defaults.baseURL}/login`, {email, password});
  if (!response.data?.token) throw new Error('Unexpected login response from server');
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post(`${api.defaults.baseURL}/register`, {email, password});
  return response.data;
};
