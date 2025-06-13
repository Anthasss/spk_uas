import { apiClient } from '../api/apiClient';
import { SUB_CRITERIA_ENDPOINTS } from '../api/subCriteriaEndpoints';

// Create new sub criteria
export const createSubCriteria = async (subCriteriaData) => {
  const response = await apiClient.post(SUB_CRITERIA_ENDPOINTS.CREATE, subCriteriaData);
  return response.data;
};

// Get all sub criteria
export const getAllSubCriteria = async () => {
  const response = await apiClient.get(SUB_CRITERIA_ENDPOINTS.GET_ALL);
  return response.data;
};

// Get sub criteria by ID
export const getSubCriteriaById = async (id) => {
  const response = await apiClient.get(SUB_CRITERIA_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

// Get sub criteria by criteria ID
export const getSubCriteriaByCriteriaId = async (criteriaId) => {
  const response = await apiClient.get(SUB_CRITERIA_ENDPOINTS.GET_BY_CRITERIA_ID(criteriaId));
  return response.data;
};

// Update sub criteria
export const updateSubCriteria = async (id, subCriteriaData) => {
  const response = await apiClient.put(SUB_CRITERIA_ENDPOINTS.UPDATE(id), subCriteriaData);
  return response.data;
};

// Delete sub criteria
export const deleteSubCriteria = async (id) => {
  const response = await apiClient.delete(SUB_CRITERIA_ENDPOINTS.DELETE(id));
  return response.data;
};