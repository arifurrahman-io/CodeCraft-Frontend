import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const isLoginPage = window.location.pathname === "/admin/login";

    if (error.response?.status === 401 && !isLoginRequest && !isLoginPage) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export const unwrapData = (payload) => {
  if (payload == null) return payload;

  let current = payload;
  const wrapperKeys = [
    "data",
    "result",
    "item",
    "items",
    "docs",
    "results",
    "services",
    "projects",
    "blogs",
    "team",
    "testimonials",
    "contacts",
    "messages",
    "settings",
    "stats",
  ];

  for (let index = 0; index < 4; index += 1) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return current;
    }

    const key = wrapperKeys.find((wrapperKey) =>
      Object.prototype.hasOwnProperty.call(current, wrapperKey) &&
      (["data", "result", "item", "items", "docs", "results"].includes(wrapperKey) ||
        (current[wrapperKey] && typeof current[wrapperKey] === "object")),
    );

    if (!key) return current;
    current = current[key];
  }

  return current;
};

export const normalizeId = (item) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return item;
  const author =
    item.author && typeof item.author === "object"
      ? { ...item.author, image: getAssetUrl(item.author.image) }
      : item.author;

  return {
    ...item,
    image: getAssetUrl(item.image),
    thumbnail: getAssetUrl(item.thumbnail),
    avatar: getAssetUrl(item.avatar),
    logo: getAssetUrl(item.logo),
    coverImage: getAssetUrl(item.coverImage),
    author,
    _id: item._id || item.id,
  };
};

export const normalizeData = (payload) => {
  const data = unwrapData(payload);

  if (Array.isArray(data)) return data.map(normalizeId);
  if (data && typeof data === "object") return normalizeId(data);

  return data;
};

export const normalizeResponse = (response) => ({
  ...response,
  data: normalizeData(response.data),
});

export const request = async (promise) => normalizeResponse(await promise);

export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const getAssetUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;

  const apiUrl = new URL(API_BASE_URL);
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${apiUrl.origin}${path}`;
};

export default api;
