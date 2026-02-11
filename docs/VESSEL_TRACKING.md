# Vessel Tracking Integration - MyShipTracking API

## Overview

Real-time AIS (Automatic Identification System) vessel tracking integrated into PropelSense dashboard using MyShipTracking.com API.

## Features Implemented

### 🗺️ Interactive Map

- **Leaflet-based mapping** with OpenStreetMap tiles
- **Dynamic vessel markers** with directional indicators
- **Color-coded status** based on navigation status (underway, anchored, fishing, etc.)
- **Zone boundary visualization** showing 20nm radius around selected city
- **Popup details** on marker click with complete vessel information

### 🚢 Vessel Data Display

- Vessel name, MMSI, IMO
- Vessel type classification
- Navigation status
- Current speed (knots) and course (degrees + cardinal direction)
- GPS coordinates (lat/lng)
- Last position update timestamp

### 🎛️ User Controls

- **City selection** dropdown (Turku, Helsinki, Stockholm, Oslo, Copenhagen)
- **Time range filter** (30min, 1hr, 2hrs, 6hrs back)
- **Manual refresh button** (API credit preservation)
- **Real-time vessel count** display
- **Last update timestamp** indicator

### 🎨 Visual Design

- **Status color coding:**
  - 🟢 Green: Underway (engine/sailing)
  - 🔴 Red: Anchored/Moored
  - 🔵 Blue: Fishing
  - 🟡 Orange: Restricted maneuverability
  - ⚫ Gray: Undefined
- **Vessel icon rotation** based on course/heading
- **Dark theme integration** with zinc color palette
- **Responsive layout** with mobile support

## API Integration

### Architecture

To avoid CORS restrictions, the implementation uses a **Next.js API Route as a proxy**:

```
Browser → Next.js API Route (/api/vessels/zone) → MyShipTracking API
```

This server-side proxy pattern:

- ✅ Bypasses browser CORS restrictions
- ✅ Keeps API key secure (server-side only)
- ✅ Allows request/response transformation
- ✅ Enables credit tracking via response headers

### Endpoint

**Client calls:**

```
GET /api/vessels/zone
```

**Proxy forwards to:**

```
GET https://api.myshiptracking.com/api/v2/vessel/zone
```

### Parameters Used

- `minlat`, `maxlat`, `minlon`, `maxlon` - Geographic zone bounds
- `response=simple` - Basic vessel info (1 credit/vessel)
- `minutesBack` - Position age filter (30-360 minutes)

### Authentication

- Header: `Authorization: Bearer YOUR_API_KEY`
- Environment variable: `NEXT_PUBLIC_MYSHIPTRACKING_API_KEY`

### Credit Management

- **No auto-refresh** - Manual refresh only
- Simple response (1 credit/vessel) vs Extended (3 credits/vessel)
- API returns up to 500 vessels per request
- X-Credit-Charged header in response

## File Structure

```
frontend/
├── app/
│   ├── api/vessels/zone/
│   │   └── route.ts              # API proxy (CORS fix)
│   ├── dashboard/
│   │   ├── components/
│   │   │   └── VesselMap.tsx     # Interactive map component
│   │   └── page.tsx              # Dashboard integration
│   └── layout.tsx                # Leaflet CSS import
├── lib/services/
│   └── vesselService.ts          # API client & utilities
└── .env.example                  # API key documentation
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install leaflet react-leaflet @types/leaflet
```

### 2. Get API Key

1. Visit [MyShipTracking.com](https://www.myshiptracking.com/)
2. Create account and get API key
3. Check coverage map for your region

### 3. Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_MYSHIPTRACKING_API_KEY=your_api_key_here
```

### 4. Access Feature

Navigate to **Dashboard → Vessel Traffic** in sidebar

## Technical Implementation

### Service Layer (`vesselService.ts`)

**Core Functions:**

- `fetchVesselsInZone()` - Calls Next.js API proxy (CORS-safe)
- `calculateZoneBounds()` - Zone calculation from center point + radius
- `getVesselTypeLabel()` - Vessel type code → readable label
- `getNavStatusLabel()` - Navigation status code → description
- `getVesselStatusColor()` - Status → color mapping
- `formatTimeAgo()` - Timestamp → relative time
- `isValidCourse()` - Course validity check
- `getCourseDirection()` - Course degrees → cardinal direction

**TypeScript Interfaces:**

```typescript
interface VesselSimple {
  vessel_name: string;
  mmsi: number;
  imo: number | null;
  vtype: number;
  lat: number;
  lng: number;
  course: number;
  speed: number;
  nav_status: number;
  received: string;
}

interface ZoneBounds {
  minlat: number;
  maxlat: number;
  minlon: number;
  maxlon: number;
}
```

### API Route Layer (`app/api/vessels/zone/route.ts`)

**Purpose:** Server-side proxy to avoid CORS restrictions

**Request Flow:**

1. Client makes GET request to `/api/vessels/zone`
2. API route validates parameters and API key
3. Makes server-to-server request to MyShipTracking
4. Forwards response and credit headers back to client

**Error Handling:**

- Missing API key → 500 error
- Invalid parameters → 400 error
- External API errors → Forwarded with status
- Network failures → 500 with error message

**Headers Forwarded:**

- `X-Credit-Charged` - Number of credits deducted

### Component Layer (`VesselMap.tsx`)

**State Management:**

- Vessels array
- Loading/error states
- Selected city
- Zone bounds
- Last update timestamp
- Minutes back filter

**Leaflet Integration:**

- Dynamic import (avoid SSR issues)
- Custom vessel icons with rotation
- MapContainer with OpenStreetMap tiles
- Rectangle for zone boundary
- Marker + Popup for each vessel

**Custom Styling:**

- Dark theme Leaflet popups
- Vessel marker SVG with course rotation
- Responsive map container (600px height)
- Legend with status colors

## Usage Examples

### Zone Search Around City

```typescript
// Automatic zone calculation
const bounds = calculateZoneBounds(60.4518, 22.2666, 20); // Turku, 20nm radius
// Returns: { minlat, maxlat, minlon, maxlon }
```

### Custom Zone Query

```typescript
const response = await fetchVesselsInZone({
  minlat: 60.0,
  maxlat: 61.0,
  minlon: 22.0,
  maxlon: 23.0,
  response: "simple",
  minutesBack: 60,
});
```

### Vessel Status Interpretation

```typescript
const color = getVesselStatusColor(0); // "#22c55e" (green - underway)
const label = getNavStatusLabel(0); // "Under way using engine"
const severity = getVesselStatusSeverity(0); // "safe"
```

## API Response Examples

### Success Response

```json
{
  "status": "success",
  "duration": "0.002183",
  "timestamp": "2026-01-22T22:00:23.777Z",
  "data": [
    {
      "vessel_name": "NORDIC SPIRIT",
      "mmsi": 230058000,
      "imo": 9345234,
      "vtype": 7,
      "lat": 60.4518,
      "lng": 22.2666,
      "course": 135.5,
      "speed": 12.3,
      "nav_status": 0,
      "received": "2026-01-22T21:58:30Z"
    }
  ]
}
```

### Error Response

```json
{
  "status": "error",
  "duration": "0.001234",
  "timestamp": "2026-01-22T22:00:45.123Z",
  "code": "ERR_NO_CREDITS",
  "message": "Insufficient credit balance"
}
```

## Error Handling

### Common Errors

- `ERR_NO_KEY` - API key not configured
- `ERR_INVALID_KEY` - Invalid API key
- `ERR_NO_CREDITS` - Insufficient credits
- `ERR_INVALID_BOUNDS` - Invalid geographic bounds
- `ERR_RATE_LIMIT` - Rate limit exceeded

### User-Friendly Messages

All errors display in UI with:

- Error icon indicator
- Clear error message
- Retry option (refresh button)

## Performance Considerations

### Optimization Strategies

1. **No auto-refresh** - User-initiated updates only
2. **Zone-based queries** - Limited geographic scope
3. **Simple response** - 1 credit vs 3 credits for extended
4. **Client-side caching** - No redundant API calls
5. **Dynamic imports** - Leaflet loaded only when needed

### Best Practices

- Check coverage area before deployment
- Monitor credit usage via API responses
- Set appropriate `minutesBack` values (longer = more vessels)
- Use extended response only when detailed data needed

## Future Enhancements

### Potential Features

- [ ] Vessel filtering by type
- [ ] Distance calculation from reference point
- [ ] Vessel track history visualization
- [ ] Collision risk assessment
- [ ] Export vessel list to CSV
- [ ] Push notifications for zone entry/exit
- [ ] Extended response mode toggle
- [ ] Custom zone drawing tool
- [ ] Integration with marine weather overlay

## References

- **API Documentation:** [MyShipTracking API v2](https://www.myshiptracking.com/api)
- **AIS Specification:** [ITU-R M.1371](https://www.itu.int/rec/R-REC-M.1371)
- **Vessel Type Codes:** [AIS Ship Type Classification](https://api.vtexplorer.com/docs/ref-aistypes.html)
- **Navigation Status:** [AIS Navigation Status](https://api.vtexplorer.com/docs/ref-navstat.html)
- **Leaflet Documentation:** [react-leaflet](https://react-leaflet.js.org/)

## Support

For API-related issues:

- Check [MyShipTracking Status](https://www.myshiptracking.com/)
- Review coverage map for your region
- Contact support for credit/billing questions

For technical issues:

- Check browser console for errors
- Verify API key in .env.local
- Ensure Leaflet CSS is loaded
- Test with simple zone query first
