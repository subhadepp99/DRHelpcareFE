"use client";

import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    initialize,
  } = useAuthStore();

  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isAdmin = () => hasRole(["admin", "superuser"]);
  const isSuperuser = () => hasRole("superuser");

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    initialize,
    hasRole,
    isAdmin,
    isSuperuser,
  };
};
