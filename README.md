## Environment Configuration

Add these environment variables in `.env.local`:

### MSG91 OTP Widget (Web SDK)
```
NEXT_PUBLIC_MSG91_WIDGET_ID=your_widget_id
NEXT_PUBLIC_MSG91_TOKEN=your_widget_token
```

The login and registration pages automatically use MSG91 custom UI methods when configured; otherwise they fall back to the built-in OTP endpoints. OTP length is 4 digits.

### Google Maps API (Optional - Recommended for better location services)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Setup Instructions:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Geocoding API (for pincode to location conversion)
   - Maps JavaScript API (if using map features)
4. Create credentials (API Key)
5. Add the API key to your `.env.local` file

**Features enabled with Google Maps API:**
- Pincode to city/location conversion
- More accurate geolocation data
- Better search results based on coordinates

**Note:** If Google Maps API is not configured, the system will automatically fall back to OpenStreetMap (Nominatim) which is free but less accurate.

### API Configuration
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
