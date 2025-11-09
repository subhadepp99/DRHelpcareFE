// Location utility functions

/**
 * Check if input is a valid Indian pincode (6 digits)
 * @param {string} input
 * @returns {boolean}
 */
export const isPincode = (input) => {
  if (!input) return false;
  const cleaned = input.trim().replace(/\s/g, '');
  return /^\d{6}$/.test(cleaned);
};

/**
 * Convert pincode to location using Google Geocoding API
 * @param {string} pincode
 * @returns {Promise<{city: string, state: string, country: string, lat: number, lng: number} | null>}
 */
export const pincodeToLocation = async (pincode) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not configured');
      return null;
    }
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode},India&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const components = result.address_components;
      const geometry = result.geometry.location;
      
      let city = '';
      let state = '';
      let country = '';
      
      // Extract city, state, and country from address components
      components.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_3') && !city) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (component.types.includes('country')) {
          country = component.long_name;
        }
      });
      
      return {
        city: city || '',
        state: state || '',
        country: country || 'India',
        lat: geometry.lat,
        lng: geometry.lng,
        formatted_address: result.formatted_address,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error converting pincode to location:', error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Get nearest cities from a list based on distance
 * @param {Array} locations - Array of {city, lat, lng}
 * @param {number} userLat
 * @param {number} userLng
 * @param {number} count - Number of nearest cities to return
 * @returns {Array}
 */
export const getNearestCities = (locations, userLat, userLng, count = 5) => {
  if (!userLat || !userLng || !locations || locations.length === 0) {
    return [];
  }
  
  const locationsWithDistance = locations
    .filter(loc => loc.lat && loc.lng)
    .map(loc => ({
      ...loc,
      distance: calculateDistance(userLat, userLng, loc.lat, loc.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
  
  return locationsWithDistance;
};

/**
 * Format location string for display
 * @param {Object} location
 * @returns {string}
 */
export const formatLocationString = (location) => {
  if (!location) return '';
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  
  return parts.join(', ');
};

