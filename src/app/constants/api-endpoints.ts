export const BASE_URL = 'http://localhost:8989/rag-chat';

export const API_ENDPOINTS = {
  GET_SESSIONS: '/sessions',
  UPDATE_SESSION_NAME: (sessionId: string) => `/sessions/${sessionId}/name`,
  TOGGLE_FAVORITE: (sessionId: string) => `/sessions/toggle/favorite/${sessionId}`,
  DELETE_SESSION: (sessionId: string) => `/sessions/${sessionId}`,
  CREATE_SESSION: '/sessions/create',

  SEND_MESSAGE: '/messages/send',
  GET_MESSAGES_BY_SESSION: (sessionId: string) => `/messages/getBy/${sessionId}`,

  SEARCH_MESSAGES: '/messages/search',
};

export const API_HEADERS = {
  'accept': '*/*',
  'X-API-KEY': 'key-1111111111111111'
};