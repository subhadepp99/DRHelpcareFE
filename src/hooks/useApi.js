import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (method, url, data = null, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api({
          method,
          url,
          data,
          ...options,
        });

        setLoading(false);
        return response;
      } catch (err) {
        setLoading(false);
        
        // Don't show errors for cancelled requests
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          throw err;
        }
        
        setError(err);

        if (!options.silent) {
          toast.error(err.response?.data?.message || "An error occurred");
        }

        throw err;
      }
    },
    []
  );

  const get = useCallback(
    (url, options = {}) => {
      return request("GET", url, null, options);
    },
    [request]
  );

  const post = useCallback(
    (url, data, options = {}) => {
      return request("POST", url, data, options);
    },
    [request]
  );

  const put = useCallback(
    (url, data, options = {}) => {
      return request("PUT", url, data, options);
    },
    [request]
  );

  const del = useCallback(
    (url, options = {}) => {
      return request("DELETE", url, null, options);
    },
    [request]
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    request,
  };
};
