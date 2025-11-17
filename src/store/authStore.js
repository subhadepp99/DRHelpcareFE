import { create } from "zustand";
import { api } from "@/lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
  },

  login: async (identifierOrPayload, passwordMaybe) => {
    set({ isLoading: true });

    try {
      let rawPayload;
      if (
        typeof identifierOrPayload === "object" &&
        identifierOrPayload !== null
      ) {
        rawPayload = identifierOrPayload;
      } else {
        rawPayload = { email: identifierOrPayload, password: passwordMaybe };
      }

      // Normalize to { identifier, password }
      const payload = {
        identifier:
          rawPayload.identifier ||
          rawPayload.email ||
          rawPayload.username ||
          rawPayload.phone ||
          "",
        password: rawPayload.password || "",
      };

      const response = await api.post("/auth/login", payload);

      // Handle different response structures
      let token, user;
      if (response.data?.data) {
        // Standard structure: { data: { user: {...}, token: "...", refreshToken: "..." } }
        token = response.data.data.token;
        user = response.data.data.user;
      } else if (response.data?.token && response.data?.user) {
        // Direct structure: { token, user }
        token = response.data.token;
        user = response.data.user;
      } else {
        throw new Error("Invalid response structure from server");
      }

      // Validate that we have the required data
      if (!token || !user) {
        throw new Error("Invalid response: missing token or user data");
      }

      if (!user._id || !user.role) {
        throw new Error("Invalid user data: missing required fields");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });

    try {
      const response = await api.post("/auth/register", userData, {
        headers: {
          "X-Skip-Unauth-Redirect": "true",
        },
      });

      // Check if the request was successful
      if (!response.data?.success && response.data?.success !== undefined) {
        set({ isLoading: false });
        return {
          success: false,
          message: response.data?.message || "Registration failed",
        };
      }

      let token, user;
      if (response.data?.data) {
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        token = response.data.token;
        user = response.data.user;
      }

      // Validate that we have the required data
      if (!token || !user) {
        set({ isLoading: false });
        return {
          success: false,
          message: "Registration response missing token or user data",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
