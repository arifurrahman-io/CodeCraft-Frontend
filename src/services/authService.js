import api, { getErrorMessage, normalizeData } from "@/services/api";

const persistAuth = (payload) => {
  const data = normalizeData(payload) || payload || {};
  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    data.user?.token;
  const user = data.user || data.admin || data;

  if (token) localStorage.setItem("adminToken", token);
  if (user && typeof user === "object") {
    localStorage.setItem("adminUser", JSON.stringify(user));
  }

  return { user, token };
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { user, token } = persistAuth(response.data);

    return {
      ...response,
      data: {
        ...normalizeData(response.data),
        user,
        token,
      },
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, "Invalid email or password"), {
      cause: error,
    });
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  return { success: true };
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    const data = normalizeData(response.data);
    const user = data?.user || data?.admin || data;

    if (user && typeof user === "object") {
      localStorage.setItem("adminUser", JSON.stringify(user));
      return user;
    }
  } catch {
    localStorage.removeItem("adminToken");
  }

  const user = localStorage.getItem("adminUser");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () =>
  !!localStorage.getItem("adminToken") || !!localStorage.getItem("adminUser");

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
