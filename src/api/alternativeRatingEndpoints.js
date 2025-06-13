export const ALTERNATIVE_RATING_ENDPOINTS = {
  CREATE: '/alternative-ratings',
  GET_ALL: '/alternative-ratings',
  GET_BY_ID: (id) => `/alternative-ratings/${id}`,
  GET_BY_ALTERNATIVE_ID: (alternativeId) => `/alternative-ratings/alternative/${alternativeId}`,
  UPDATE: (id) => `/alternative-ratings/${id}`,
  DELETE: (id) => `/alternative-ratings/${id}`,
};