import axios from 'axios';
import type {Claim} from '../types';
import {useContext} from 'react';
import {AuthContext} from '../context';
const token = 'useContext(AuthContext);';

const api = axios.create({
  baseURL: 'http://localhost:3002/claims',

  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getClaims = async () => {
  const response = await api.get(`${api.defaults.baseURL}/`);
  return response.data;
};

export const getClaimById = async (id: string) => {
  const response = await api.get(`${api.defaults.baseURL}/${id}`);
  return response.data;
};

export const createClaim = async (claim: Claim) => {
  const response = await api.post(`${api.defaults.baseURL}/`, claim);
  return response.data;
};

export const getUploadUrl = async (fileName: string, fileType: string) => {
  const response = await api.post(`${api.defaults.baseURL}/upload-url`, {fileName: fileName, fileType: fileType});
  return response.data;
};

export const updateStatus = async (id: string, status: string) => {
  const response = await api.patch(`${api.defaults.baseURL}/${id}/status`, {status});
  return response.data;
};
