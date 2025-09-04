import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => api.post("/api/auth/login", data);
export const registerUser = (data) => api.post("/api/auth/register", data);
export const oauthLogin = (provider, token) =>
  api.post(`/api/auth/oauth/${provider}`, { token });


export const fetchUsers = () => api.get("/api/users");
export const toggleUserBlock = (id) => api.post(`/api/users/${id}/toggle-block`);
export const updateUserRole = (id, role) => api.put(`/api/users/${id}/role`, { role });
export const fetchUser = (id) => api.get(`/api/users/${id}`);


export const fetchInventories = () => api.get("/api/inventories");
export const fetchInventory = (id) => api.get(`/api/inventories/${id}`);
export const createInventory = (data) => api.post("/api/inventories", data);
export const updateInventory = (id, data) => api.put(`/api/inventories/${id}`, data);
export const deleteInventory = (id) => api.delete(`/api/inventories/${id}`);
export const fetchStats = (inventoryId) => api.get(`/api/inventories/${inventoryId}/stats`);


export const fetchItems = (inventoryId) => api.get(`/api/inventories/${inventoryId}/items`);
export const fetchItem = (id) => api.get(`/api/items/${id}`);
export const createItem = (data) => api.post("/api/items", data);
export const updateItem = (id, data) => api.put(`/api/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/api/items/${id}`);


export const likeItem = (itemId) => api.post(`/api/items/${itemId}/like`);
export const addComment = (itemId, text) => api.post(`/api/items/${itemId}/comments`, { text });


export const fetchTags = () => api.get("/api/tags");


export const search = (query) => api.get(`/api/search?q=${query}`);






