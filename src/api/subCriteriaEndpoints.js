export const SUB_CRITERIA_ENDPOINTS = {
  CREATE: '/sub-criteria',
  GET_ALL: '/sub-criteria',
  GET_BY_ID: (id) => `/sub-criteria/${id}`,
  GET_BY_CRITERIA_ID: (criteriaId) => `/sub-criteria/criteria/${criteriaId}`,
  UPDATE: (id) => `/sub-criteria/${id}`,
  DELETE: (id) => `/sub-criteria/${id}`,
};