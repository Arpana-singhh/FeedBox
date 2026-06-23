// Shared axios instance — all API calls go through this
// Attach interceptors here if you need to add auth headers globally later
import axios from "axios";

const apiClient = axios.create({
  headers: { Accept: "application/json" },
});

// Request interceptor — runs before every request
// Useful later for auto-attaching the Firebase token to every call
apiClient.interceptors.request.use((config) => {
  return config;
});

export default apiClient;
