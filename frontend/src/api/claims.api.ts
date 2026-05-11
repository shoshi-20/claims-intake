import axios from 'axios';
import type {Claim, ClaimType, DescriptionHints} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3002/claims',

  headers: {
    'Content-Type': 'application/json',
  },
});

const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getClaims = async (token: string) => {
  const response = await api.get(`${api.defaults.baseURL}/`, authHeaders(token));
  return response.data;
};

export const getClaimById = async (id: string, token: string) => {
  const response = await api.get(`${api.defaults.baseURL}/${id}`, authHeaders(token));
  return response.data;
};

export const createClaim = async (claim: Claim, token: string) => {
  const response = await api.post(`${api.defaults.baseURL}/`, claim, authHeaders(token));
  return response.data;
};

export const getUploadUrl = async (fileName: string, fileType: string, token: string) => {
  const response = await api.post(`${api.defaults.baseURL}/upload-url`, {fileName: fileName, fileType: fileType}, authHeaders(token));
  return response.data;
};

export const updateStatus = async (id: string, status: string, token: string) => {
  const response = await api.patch(`${api.defaults.baseURL}/${id}/status`, {status}, authHeaders(token));
  return response.data;
};

export const checkDescriptionCompleteness = async (
  description: string,
  claimType: ClaimType,
  incidentDate: string,
  token: string,
): Promise<DescriptionHints> => {
  const response = await api.post(`${api.defaults.baseURL}/check-description`, {description, claimType, incidentDate}, authHeaders(token));
  return response.data;
};
