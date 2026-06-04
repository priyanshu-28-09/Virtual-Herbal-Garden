import axios from "axios";

export const SERVER_URL = "http://localhost:5001";
export const API_URL = `${SERVER_URL}/api`;

export const normalizeApiResponse = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  const payload = response.data ?? response;
  if (Array.isArray(payload)) return payload;
  return payload?.data ?? payload?.herbs ?? [];
};

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default API;