let googleMapsScriptLoadPromise = null;

function getGoogleMapsApiKey() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    // Key missing – callers should handle gracefully; we return undefined
  }
  return key;
}

export function loadGoogleMapsPlaces() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }
  if (!googleMapsScriptLoadPromise) {
    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      // Create a resolved promise to avoid breaking callers; predictions will no-op
      googleMapsScriptLoadPromise = Promise.resolve();
      return googleMapsScriptLoadPromise;
    }
    googleMapsScriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const params = new URLSearchParams({
        key: apiKey,
        libraries: "places",
        v: "weekly",
      });
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }
  return googleMapsScriptLoadPromise;
}

function getAutocompleteService() {
  if (!(window.google && window.google.maps && window.google.maps.places)) {
    return null;
  }
  return new window.google.maps.places.AutocompleteService();
}

export async function fetchPlacePredictions(query, options = {}) {
  const trimmed = String(query || "").trim();
  if (trimmed.length === 0) return [];
  try {
    await loadGoogleMapsPlaces();
    const service = getAutocompleteService();
    if (!service) return [];

    const request = {
      input: trimmed,
      // Restrict to geocodable places for location input
      types: ["geocode"],
      ...options,
    };

    return await new Promise((resolve) => {
      service.getPlacePredictions(request, (predictions, status) => {
        if (
          !predictions ||
          status !== window.google.maps.places.PlacesServiceStatus.OK
        ) {
          resolve([]);
          return;
        }
        const mapped = predictions.map((p) => ({
          description: p.description,
          placeId: p.place_id,
          matchedSubstrings: p.matched_substrings,
          types: p.types,
        }));
        resolve(mapped);
      });
    });
  } catch (_e) {
    return [];
  }
}

export function mapPredictionToDisplay(prediction) {
  if (!prediction) return "";
  return prediction.description || "";
}

// Get place details including geometry for a given placeId
export async function getPlaceDetails(placeId) {
  if (typeof window === "undefined") return null;
  try {
    await loadGoogleMapsPlaces();
    if (!(window.google && window.google.maps)) return null;

    const map = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(map);

    return await new Promise((resolve) => {
      service.getDetails(
        { placeId, fields: ["geometry", "name", "formatted_address"] },
        (place, status) => {
          if (
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !place?.geometry?.location
          ) {
            resolve(null);
            return;
          }
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          resolve({
            lat,
            lng,
            name: place.name,
            address: place.formatted_address,
          });
        }
      );
    });
  } catch (_e) {
    return null;
  }
}
