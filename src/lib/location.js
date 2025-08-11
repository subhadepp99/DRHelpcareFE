import axios from "axios";

/**
 * Reverse-geocode lat/lng with Google Maps.  Returns
 * { city, state, country } – empty strings if not resolvable.
 */
export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const resp = await axios.get(url);
    const components = resp.data.results[0]?.address_components || [];

    const find = (type) =>
      components.find((c) => c.types.includes(type))?.long_name || "";

    return {
      city: find("locality"),
      state: find("administrative_area_level_1"),
      country: find("country"),
    };
  } catch (e) {
    console.error("Reverse geocode failed", e);
    return { city: "", state: "", country: "" };
  }
}
