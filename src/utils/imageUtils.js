/**
 * Utility functions for handling image URLs consistently across the application
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Converts a relative image path to a full URL
 * @param {string} imagePath - The relative image path (e.g., /uploads/clinics/image.jpg)
 * @returns {string} - The full URL for the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path, convert to full URL
  if (imagePath.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // If it's just a filename, assume it's in uploads folder
  if (!imagePath.includes("/")) {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  return imagePath;
};

/**
 * Gets the appropriate image URL for a given entity
 * @param {Object} entity - The entity object (clinic, pathology, user, etc.)
 * @param {string} imageField - The field name for the image (default: 'imageUrl')
 * @returns {string|null} - The full image URL or null if no image
 */
export const getEntityImageUrl = (entity, imageField = "imageUrl") => {
  if (!entity) return null;

  // Try different possible image fields
  const imagePath =
    entity[imageField] ||
    entity.image ||
    entity.profileImageUrl ||
    entity.imageUrl ||
    entity.profileImage;

  return getImageUrl(imagePath);
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
