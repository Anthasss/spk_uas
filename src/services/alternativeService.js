import { apiClient } from '../api/apiClient';
import { ALTERNATIVE_ENDPOINTS } from '../api/alternativeEndpoints';

// Create new alternative
export const createAlternative = async (alternativeData) => {
  const response = await apiClient.post(ALTERNATIVE_ENDPOINTS.CREATE, alternativeData);
  return response.data;
};

// Get all alternatives
export const getAllAlternatives = async () => {
  const response = await apiClient.get(ALTERNATIVE_ENDPOINTS.GET_ALL);
  return response.data;
};

// Get alternative by ID
export const getAlternativeById = async (id) => {
  const response = await apiClient.get(ALTERNATIVE_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

// Update alternative
export const updateAlternative = async (id, alternativeData) => {
  const response = await apiClient.put(ALTERNATIVE_ENDPOINTS.UPDATE(id), alternativeData);
  return response.data;
};

// Delete alternative
export const deleteAlternative = async (id) => {
  const response = await apiClient.delete(ALTERNATIVE_ENDPOINTS.DELETE(id));
  return response.data;
};