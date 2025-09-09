/**
 * Utility functions for handling image URLs consistently across the application
 */

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// If base has trailing /api, strip it for static assets served from /uploads
const API_BASE_URL = RAW_BASE_URL.endsWith("/api")
  ? RAW_BASE_URL.slice(0, -4)
  : RAW_BASE_URL;

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
    } else {
      return null;
    }
  }

  const pathStr = imagePath.trim();
  if (!pathStr) return null;

  // If it's already a full URL, return as is
  if (/^https?:\/\//i.test(pathStr)) {
    return pathStr;
  }

  // If it's a relative uploads path
  if (pathStr.startsWith("/uploads/")) {
    return `${API_BASE_URL}${pathStr}`;
  }
  if (pathStr.startsWith("uploads/")) {
    return `${API_BASE_URL}/${pathStr}`;
  }

  // If it's just a filename, assume it's in uploads folder
  if (!pathStr.includes("/")) {
    return `${API_BASE_URL}/uploads/${pathStr}`;
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
  if (!entity) return null;

  const candidates = [
    entity[imageField],
    entity.imageUrl,
    entity.profileImageUrl,
    entity.profileImage,
    entity.image,
  ];

  const chosen =
    candidates.find((v) => typeof v === "string" && v.trim().length > 0) ||
    candidates.find((v) => v && typeof v.url === "string");

  return getImageUrl(chosen);
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
