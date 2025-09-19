"use client";
import { useCallback } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApi() {
  const request = useCallback(async (method, path, data) => {
    const url = path.startsWith("http")
      ? path
      : `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
    const options = {
      method: method.toUpperCase(),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json().catch(() => ({}));
    return { data: json };
  }, []);

  return {
    get: (path) => request("get", path),
    post: (path, data) => request("post", path, data),
    put: (path, data) => request("put", path, data),
    del: (path, data) => request("delete", path, data),
  };
}
