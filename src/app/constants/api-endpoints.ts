export const BASE_URL = 'http://localhost:8989/rag-chat';

export const API_ENDPOINTS = {
  GET_SESSIONS: '/sessions',
  UPDATE_SESSION_NAME: (sessionId: string) => `/sessions/${sessionId}/name`,
  TOGGLE_FAVORITE: (sessionId: string) => `/sessions/toggle/favorite/${sessionId}`,
  DELETE_SESSION: (sessionId: string) => `/sessions/${sessionId}`
};

export const API_HEADERS = {
  'accept': '*/*',
  'X-API-KEY': 'my-super-secret-key'
};