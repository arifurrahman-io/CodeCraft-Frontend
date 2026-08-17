import api, { getErrorMessage, normalizeData } from "@/services/api";

const persistUser = (payload) => {
  const data = normalizeData(payload) || payload || {};
  const user = data.user || data.admin || null;

  if (user && typeof user === "object" && (user._id || user.id || user.email)) {
    localStorage.setItem("adminUser", JSON.stringify(user));
    return user;
  }

  return null;
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const user = persistUser(response.data);

    return {
      ...response,
      data: {
        ...normalizeData(response.data),
        user,
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
    const user = persistUser(response.data);
    if (user) return user;
  } catch {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  return null;
};

export const isAuthenticated = () => !!localStorage.getItem("adminUser");

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
