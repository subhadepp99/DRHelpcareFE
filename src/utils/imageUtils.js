/**
 * Utility functions for handling image URLs consistently across the application
 */

// Determine the API base URL strictly from environment
const getApiBaseUrl = () => {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return rawBaseUrl.endsWith("/api") ? rawBaseUrl.slice(0, -4) : rawBaseUrl;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Converts a relative image path to a full URL
 * @param {string} imagePath - The relative image path (e.g., /uploads/clinics/image.jpg)
 * @returns {string} - The full URL for the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Support objects like { url: "..." } or legacy buffers
  if (typeof imagePath !== "string") {
    if (imagePath && typeof imagePath.url === "string") {
      imagePath = imagePath.url;
    } else if (
      imagePath &&
      typeof imagePath === "object" &&
      imagePath.data &&
      imagePath.contentType
    ) {
      // Handle Mongo/Mongoose Buffer-based image objects: { data: base64String | {type:'Buffer', data:[...]}, contentType: 'image/...' }
      try {
        // In most cases, Mongoose serializes Buffer to a base64 string already
        if (typeof imagePath.data === "string") {
          return `data:${imagePath.contentType};base64,${imagePath.data}`;
        }

        // Fallback: some serializers may provide { type: 'Buffer', data: number[] }
        if (
          imagePath.data &&
          typeof imagePath.data === "object" &&
          Array.isArray(imagePath.data.data)
        ) {
          // Convert number[] to base64 in browser
          const byteArray = imagePath.data.data;
          let binaryString = "";
          const chunkSize = 0x8000;
          for (let i = 0; i < byteArray.length; i += chunkSize) {
            const chunk = byteArray.slice(i, i + chunkSize);
            binaryString += String.fromCharCode.apply(null, chunk);
          }
          const base64 = btoa(binaryString);
          return `data:${imagePath.contentType};base64,${base64}`;
        }
      } catch (err) {
      }

      return null;
    }
  }

  const pathStr = imagePath.trim();
  if (!pathStr) return null;

  // Guard: treat empty data URLs (no payload) as missing so we can fall back
  // Example: "data:image/jpeg;base64," → should not be used
  if (/^data:image\/[^;]+;base64,$/i.test(pathStr)) {
    return null;
  }

  // If it's already a full URL, return as is
  if (/^https?:\/\//i.test(pathStr)) {
    return pathStr;
  }

  // If it's a relative uploads path
  if (pathStr.startsWith("/uploads/")) {
    const fullUrl = `${API_BASE_URL}${pathStr}`;
    return fullUrl;
  }
  if (pathStr.startsWith("uploads/")) {
    const fullUrl = `${API_BASE_URL}/${pathStr}`;
    return fullUrl;
  }

  // If it's just a filename, assume it's in uploads folder
  if (!pathStr.includes("/")) {
    const fullUrl = `${API_BASE_URL}/uploads/${pathStr}`;
    return fullUrl;
  }

  // Otherwise return as-is
  return pathStr;
};

/**
 * Gets the appropriate image URL for a given entity
 * @param {Object} entity - The entity object (clinic, pathology, user, etc.)
 * @param {string} imageField - The field name for the image (default: 'imageUrl')
 * @returns {string|null} - The full image URL or null if no image
 */
export const getEntityImageUrl = (entity, imageField = "imageUrl") => {
  if (!entity) {
    return null;
  }

  const candidates = [
    entity[imageField],
    entity.imageUrl,
    entity.profileImageUrl,
    entity.profileImage,
    entity.image,
  ];


  // Iterate in order and return the first resolvable URL.
  for (const candidate of candidates) {
    const url = getImageUrl(candidate);
    if (url) {
      return url;
    }
  }

  return null;
};

/**
 * Gets a fallback image URL for when the main image fails to load
 * @param {string} type - The type of entity (clinic, pathology, user, doctor)
 * @returns {string} - The fallback image URL
 */
export const getFallbackImageUrl = (type) => {
  // You can add fallback images here if needed
  return null;
};

/**
 * Test function to verify image URL accessibility
 * @param {string} url - The image URL to test
 * @returns {Promise<boolean>} - Whether the image is accessible
 */
export const testImageUrl = async (url) => {
  if (!url) return false;

  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Debug function to log current API configuration
 */
export const debugApiConfig = () => {
};
