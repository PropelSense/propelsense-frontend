/**
 * Vessel Tracking Service - MyShipTracking API Integration
 *
 * Provides real-time vessel position data within specified geographic zones
 * using terrestrial AIS data from MyShipTracking network.
 */

// Vessel Type Codes (according to AIS specification)
export const VESSEL_TYPES = {
  0: "Not available",
  1: "Reserved",
  2: "Wing in ground",
  3: "Special category",
  4: "High-speed craft",
  5: "Special category",
  6: "Passenger",
  7: "Cargo",
  8: "Tanker",
  9: "Other",
} as const;

// Navigation Status Codes (AIS specification)
export const NAV_STATUS = {
  0: "Under way using engine",
  1: "At anchor",
  2: "Not under command",
  3: "Restricted manoeuvrability",
  4: "Constrained by her draught",
  5: "Moored",
  6: "Aground",
  7: "Engaged in fishing",
  8: "Under way sailing",
  9: "Reserved",
  10: "Reserved",
  11: "Power-driven vessel towing astern",
  12: "Power-driven vessel pushing ahead or towing alongside",
  13: "Reserved",
  14: "AIS-SART (active), MOB-AIS, EPIRB-AIS",
  15: "Undefined",
} as const;

export interface VesselSimple {
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

export interface VesselExtended extends VesselSimple {
  callsign: string;
  vessel_type: string;
  ais_type: number;
  size_a: number;
  size_b: number;
  size_c: number;
  size_d: number;
  draught: number;
  flag: string;
  flag_mid: string;
  gt: number | null;
  dwt: number | null;
  built: number | null;
  destination: string;
  eta: string | null;
  current_port: string | null;
  current_port_id: number | null;
  current_port_unloco: string | null;
  current_port_country: string | null;
  current_port_arr_utc: string | null;
  current_port_arr_local: string | null;
  last_port: string | null;
  last_port_id: number | null;
  last_port_unloco: string | null;
  last_port_country: string | null;
  last_port_dep_utc: string | null;
  last_port_dep_local: string | null;
  next_port: string | null;
  next_port_id: number | null;
  next_port_unloco: string | null;
  next_port_country: string | null;
  next_port_eta_utc: string | null;
  next_port_eta_local: string | null;
  avg_sog: number;
  max_sog: number;
  distance_covered: number;
  wind_knots: number;
  wind_direction: string;
  humidity: number;
  pressure: number;
  temperature: number;
  visibility: number;
}

export interface VesselsResponse {
  status: "success" | "error";
  duration: string;
  timestamp: string;
  data?: VesselSimple[] | VesselExtended[];
  code?: string;
  message?: string;
}

export interface ZoneBounds {
  minlat: number;
  maxlat: number;
  minlon: number;
  maxlon: number;
}

export interface VesselQueryParams extends ZoneBounds {
  response?: "simple" | "extended";
  minutesBack?: number;
}

/**
 * Fetch vessels within a geographic zone
 * Uses Next.js API route proxy to avoid CORS issues
 */
export async function fetchVesselsInZone(
  params: VesselQueryParams,
): Promise<VesselsResponse> {
  const queryParams = new URLSearchParams({
    minlat: params.minlat.toString(),
    maxlat: params.maxlat.toString(),
    minlon: params.minlon.toString(),
    maxlon: params.maxlon.toString(),
  });

  if (params.response) {
    queryParams.append("response", params.response);
  }

  if (params.minutesBack) {
    queryParams.append("minutesBack", params.minutesBack.toString());
  }

  try {
    // Call our Next.js API route instead of external API directly
    // This avoids CORS issues since the API route makes server-side requests
    const response = await fetch(`/api/vessels/zone?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache to get fresh data
    });

    const data: VesselsResponse = await response.json();

    // Check for API-level errors
    if (data.status === "error") {
      console.error("Vessel API Error:", data.code, data.message);
      return data;
    }

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("Vessel API Error:", error);
    return {
      status: "error",
      duration: "0",
      timestamp: new Date().toISOString(),
      code: "ERR_FETCH",
      message:
        error instanceof Error ? error.message : "Failed to fetch vessel data",
    };
  }
}

/**
 * Get vessel type description from code
 */
export function getVesselTypeLabel(vtype: number): string {
  return VESSEL_TYPES[vtype as keyof typeof VESSEL_TYPES] || "Unknown";
}

/**
 * Get navigation status description from code
 */
export function getNavStatusLabel(navStatus: number): string {
  return NAV_STATUS[navStatus as keyof typeof NAV_STATUS] || "Unknown";
}

/**
 * Get color coding for vessel markers based on navigation status
 */
export function getVesselStatusColor(navStatus: number): string {
  switch (navStatus) {
    case 0: // Under way using engine
    case 8: // Under way sailing
      return "#22c55e"; // Green
    case 1: // At anchor
    case 5: // Moored
      return "#ef4444"; // Red
    case 7: // Engaged in fishing
      return "#3b82f6"; // Blue
    case 2: // Not under command
    case 3: // Restricted manoeuvrability
    case 6: // Aground
      return "#f59e0b"; // Orange/Warning
    case 15: // Undefined
    default:
      return "#6b7280"; // Gray
  }
}

/**
 * Get severity level for vessel status (for UI styling)
 */
export function getVesselStatusSeverity(
  navStatus: number,
): "safe" | "warning" | "danger" | "neutral" {
  switch (navStatus) {
    case 0: // Under way using engine
    case 8: // Under way sailing
    case 1: // At anchor
    case 5: // Moored
      return "safe";
    case 7: // Engaged in fishing
      return "neutral";
    case 2: // Not under command
    case 3: // Restricted manoeuvrability
      return "warning";
    case 6: // Aground
      return "danger";
    default:
      return "neutral";
  }
}

/**
 * Calculate zone bounds from center point and radius (nautical miles)
 * Useful for creating zones around city coordinates
 */
export function calculateZoneBounds(
  centerLat: number,
  centerLon: number,
  radiusNm: number = 20,
): ZoneBounds {
  // 1 nautical mile ≈ 1.852 km ≈ 0.016667 degrees latitude (approximate)
  const latDegreePerNm = 0.016667;
  const lonDegreePerNm = 0.016667 / Math.cos((centerLat * Math.PI) / 180);

  const latOffset = radiusNm * latDegreePerNm;
  const lonOffset = radiusNm * lonDegreePerNm;

  return {
    minlat: centerLat - latOffset,
    maxlat: centerLat + latOffset,
    minlon: centerLon - lonOffset,
    maxlon: centerLon + lonOffset,
  };
}

/**
 * Format time ago from received timestamp
 */
export function formatTimeAgo(receivedTime: string): string {
  const received = new Date(receivedTime);
  const now = new Date();
  const diffMs = now.getTime() - received.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes === 1) return "1 minute ago";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

/**
 * Check if vessel course is valid
 * AIS course value 511 or >= 360 means "not available"
 */
export function isValidCourse(course: number): boolean {
  return course >= 0 && course < 360;
}

/**
 * Format course for display
 */
export function formatCourse(course: number): string {
  if (!isValidCourse(course)) {
    return "N/A";
  }
  return `${course.toFixed(0)}°`;
}

/**
 * Get cardinal direction from course
 */
export function getCourseDirection(course: number): string {
  if (!isValidCourse(course)) return "N/A";

  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(course / 22.5) % 16;
  return directions[index];
}
