import { apiClient } from '../api/apiClient';
import { ALTERNATIVE_RATING_ENDPOINTS } from '../api/alternativeRatingEndpoints';

// Create new alternative rating
export const createAlternativeRating = async (ratingData) => {
  const response = await apiClient.post(ALTERNATIVE_RATING_ENDPOINTS.CREATE, ratingData);
  return response.data;
};

// Get all alternative ratings
export const getAllAlternativeRatings = async () => {
  const response = await apiClient.get(ALTERNATIVE_RATING_ENDPOINTS.GET_ALL);
  return response.data;
};

// Get alternative rating by ID
export const getAlternativeRatingById = async (id) => {
  const response = await apiClient.get(ALTERNATIVE_RATING_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

// Get all ratings for a specific alternative
export const getAlternativeRatingsByAlternativeId = async (alternativeId) => {
  const response = await apiClient.get(ALTERNATIVE_RATING_ENDPOINTS.GET_BY_ALTERNATIVE_ID(alternativeId));
  return response.data;
};

// Update alternative rating
export const updateAlternativeRating = async (id, ratingData) => {
  const response = await apiClient.put(ALTERNATIVE_RATING_ENDPOINTS.UPDATE(id), ratingData);
  return response.data;
};

// Delete alternative rating
export const deleteAlternativeRating = async (id) => {
  const response = await apiClient.delete(ALTERNATIVE_RATING_ENDPOINTS.DELETE(id));
  return response.data;
};