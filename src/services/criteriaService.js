import { apiClient } from "../api/apiClient";
import { CRITERIA_ENDPOINTS } from "../api/criteriaEndpoints";

// Create new criteria
export const createCriteria = async (criteriaData) => {
  const response = await apiClient.post(CRITERIA_ENDPOINTS.CREATE, criteriaData);
  return response.data;
};

// Get all criteria
export const getAllCriteria = async () => {
  const response = await apiClient.get(CRITERIA_ENDPOINTS.GET_ALL);
  return response.data;
};

// Get criteria by ID
export const getCriteriaById = async (id) => {
  const response = await apiClient.get(CRITERIA_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

// Update criteria
export const updateCriteria = async (id, criteriaData) => {
  const response = await apiClient.put(CRITERIA_ENDPOINTS.UPDATE(id), criteriaData);
  return response.data;
};

// Delete criteria
export const deleteCriteria = async (id) => {
  const response = await apiClient.delete(CRITERIA_ENDPOINTS.DELETE(id));
  return response.data;
};
