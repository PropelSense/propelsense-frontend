"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchVesselsInZone,
  calculateZoneBounds,
  getVesselTypeLabel,
  getNavStatusLabel,
  getVesselStatusColor,
  formatTimeAgo,
  formatCourse,
  getCourseDirection,
  type VesselSimple,
  type ZoneBounds,
} from "@/lib/services/vesselService";
import { CITIES, type City } from "@/lib/services/weatherService";

// Dynamically import map component to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div>Loading map...</div> },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false, loading: () => null },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false, loading: () => null },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
  loading: () => null,
});
const Rectangle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Rectangle),
  { ssr: false, loading: () => null },
);

export default function VesselMap() {
  const [vessels, setVessels] = useState<VesselSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [zoneBounds, setZoneBounds] = useState<ZoneBounds | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [minutesBack, setMinutesBack] = useState<number>(60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Initialize zone bounds when city changes
  useEffect(() => {
    const bounds = calculateZoneBounds(
      selectedCity.location.latitude,
      selectedCity.location.longitude,
      20, // 20 nautical miles radius
    );
    setZoneBounds(bounds);
  }, [selectedCity]);

  // Auto-fetch vessels on first load
  useEffect(() => {
    if (zoneBounds && !hasLoadedOnce) {
      loadVessels();
      setHasLoadedOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneBounds, hasLoadedOnce]);

  const loadVessels = async () => {
    if (!zoneBounds) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchVesselsInZone({
        ...zoneBounds,
        response: "simple",
        minutesBack,
      });

      if (response.status === "error") {
        setError(response.message || "Failed to fetch vessel data");
        setVessels([]);
      } else if (response.data) {
        setVessels(response.data as VesselSimple[]);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setVessels([]);
    } finally {
      setLoading(false);
    }
  };

  // Create custom vessel icon SVG (improved ship design)
  const createVesselIcon = (course: number, color: string) => {
    const isValidCourse = course >= 0 && course < 360;
    const rotation = isValidCourse ? course : 0;

    return `
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(24,24) rotate(${rotation}) translate(-24,-24)">
          <path d="M24 8 L28 20 L30 28 L28 32 L20 32 L18 28 L20 20 Z" 
                fill="${color}" stroke="#ffffff" stroke-width="2" opacity="0.95"/>
          <path d="M24 8 L26 12 L24 16 L22 12 Z" 
                fill="#ffffff" opacity="0.9"/>
          <rect x="22" y="20" width="4" height="6" 
                fill="#ffffff" stroke="#ffffff" stroke-width="1" opacity="0.8"/>
          <circle cx="24" cy="12" r="2" fill="#fbbf24" opacity="1"/>
        </g>
      </svg>
    `;
  };

  const createLeafletIcon = (vessel: VesselSimple) => {
    if (typeof window === "undefined") return undefined;

    const L = require("leaflet");
    const color = getVesselStatusColor(vessel.nav_status);
    const iconSvg = createVesselIcon(vessel.course, color);

    return L.divIcon({
      html: iconSvg,
      className: "vessel-marker",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });
  };

  if (typeof window === "undefined") {
    return (
      <Card className="bg-zinc-900/90 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Vessel Traffic Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] flex items-center justify-center text-neutral-400">
            Loading map...
          </div>
        </CardContent>
      </Card>
    );
  }

  const mapContent = (
    <>
      <div className="px-6 py-4 bg-zinc-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-white text-xl mb-1">
              Vessel Traffic Map
            </CardTitle>
            <p className="text-sm text-neutral-400">
              Real-time AIS vessel positions in selected zone
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Fullscreen Toggle */}
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="outline"
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              {isFullscreen ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                  Fullscreen
                </>
              )}
            </Button>

            {/* City Selection */}
            <Select
              value={selectedCity.name}
              onValueChange={(value) => {
                const city = CITIES.find((c) => c.name === value);
                if (city) setSelectedCity(city);
              }}
            >
              <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {CITIES.map((city) => (
                  <SelectItem
                    key={city.name}
                    value={city.name}
                    className="text-white hover:bg-zinc-700"
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Minutes Back Selection */}
            <Select
              value={minutesBack.toString()}
              onValueChange={(value) => setMinutesBack(parseInt(value))}
            >
              <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="30" className="text-white hover:bg-zinc-700">
                  Last 30 min
                </SelectItem>
                <SelectItem value="60" className="text-white hover:bg-zinc-700">
                  Last 1 hour
                </SelectItem>
                <SelectItem
                  value="120"
                  className="text-white hover:bg-zinc-700"
                >
                  Last 2 hours
                </SelectItem>
                <SelectItem
                  value="360"
                  className="text-white hover:bg-zinc-700"
                >
                  Last 6 hours
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              onClick={loadVessels}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-neutral-300">
              {vessels.length} vessel{vessels.length !== 1 ? "s" : ""} detected
            </span>
          </div>
          {lastUpdate && (
            <div className="text-neutral-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          {error && (
            <div className="text-red-400 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="px-0">
        {/* Map Container */}
        <div
          className={`relative overflow-hidden ${isFullscreen ? "h-[calc(100vh-280px)]" : "h-[600px]"}`}
        >
          {zoneBounds && (
            <MapContainer
              center={[
                selectedCity.location.latitude,
                selectedCity.location.longitude,
              ]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Zone Boundary Rectangle */}
              <Rectangle
                bounds={[
                  [zoneBounds.minlat, zoneBounds.minlon],
                  [zoneBounds.maxlat, zoneBounds.maxlon],
                ]}
                pathOptions={{
                  color: "#3b82f6",
                  weight: 2,
                  fillOpacity: 0.05,
                  dashArray: "5, 10",
                }}
              />

              {/* Vessel Markers */}
              {vessels.map((vessel) => (
                <Marker
                  key={vessel.mmsi}
                  position={[vessel.lat, vessel.lng]}
                  icon={createLeafletIcon(vessel)}
                >
                  <Popup className="vessel-popup">
                    <div className="min-w-[250px] p-2">
                      <div className="font-bold text-lg mb-2 text-white border-b border-zinc-700 pb-2">
                        {vessel.vessel_name || "Unknown Vessel"}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">MMSI:</span>
                          <span className="text-white font-mono">
                            {vessel.mmsi}
                          </span>
                        </div>

                        {vessel.imo && (
                          <div className="flex justify-between">
                            <span className="text-neutral-400">IMO:</span>
                            <span className="text-white font-mono">
                              {vessel.imo}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-neutral-400">Type:</span>
                          <span className="text-white">
                            {getVesselTypeLabel(vessel.vtype)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-neutral-400">Status:</span>
                          <span
                            className="text-white px-2 py-0.5 rounded text-xs"
                            style={{
                              backgroundColor: getVesselStatusColor(
                                vessel.nav_status,
                              ),
                            }}
                          >
                            {getNavStatusLabel(vessel.nav_status)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-neutral-400">Speed:</span>
                          <span className="text-white">
                            {vessel.speed.toFixed(1)} kn
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-neutral-400">Course:</span>
                          <span className="text-white">
                            {formatCourse(vessel.course)} (
                            {getCourseDirection(vessel.course)})
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-neutral-400">Position:</span>
                          <span className="text-white font-mono text-xs">
                            {vessel.lat.toFixed(4)}°, {vessel.lng.toFixed(4)}°
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
                          <span className="text-neutral-400">Last Update:</span>
                          <span className="text-emerald-400 text-xs">
                            {formatTimeAgo(vessel.received)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 px-6 flex flex-wrap gap-4 text-sm">
          <div className="text-neutral-400 font-medium">
            Vessel Status Legend:
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            ></div>
            <span className="text-neutral-300">Underway</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ef4444" }}
            ></div>
            <span className="text-neutral-300">Anchored/Moored</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <span className="text-neutral-300">Fishing</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            ></div>
            <span className="text-neutral-300">Restricted</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#6b7280" }}
            ></div>
            <span className="text-neutral-300">Undefined</span>
          </div>
        </div>
      </div>

      {/* Vessel Details Table */}
      {vessels.length > 0 && (
        <div className="pt-0 px-0">
          <div className="pt-6 px-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              Detected Vessels ({vessels.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/50">
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                      Vessel Name
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                      MMSI
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-neutral-400 font-medium">
                      Speed
                    </th>
                    <th className="text-right py-3 px-4 text-neutral-400 font-medium">
                      Course
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                      Position
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                      Last Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.map((vessel) => (
                    <tr
                      key={vessel.mmsi}
                      className="border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-medium">
                        {vessel.vessel_name || "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-neutral-300 font-mono text-xs">
                        {vessel.mmsi}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {getVesselTypeLabel(vessel.vtype)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-block px-2 py-1 rounded text-xs text-white"
                          style={{
                            backgroundColor: getVesselStatusColor(
                              vessel.nav_status,
                            ),
                          }}
                        >
                          {getNavStatusLabel(vessel.nav_status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-300">
                        {vessel.speed.toFixed(1)} kn
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-300">
                        {formatCourse(vessel.course)}°{" "}
                        {getCourseDirection(vessel.course)}
                      </td>
                      <td className="py-3 px-4 text-neutral-300 font-mono text-xs">
                        {vessel.lat.toFixed(4)}°, {vessel.lng.toFixed(4)}°
                      </td>
                      <td className="py-3 px-4 text-emerald-400 text-xs">
                        {formatTimeAgo(vessel.received)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return isFullscreen ? (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto">
      <div className="min-h-screen">
        {mapContent}
        {/* Custom Styles for Leaflet Popup */}
        <style jsx global>{`
          .leaflet-popup-content-wrapper {
            background: #18181b !important;
            border: 1px solid #3f3f46 !important;
            border-radius: 8px !important;
          }
          .leaflet-popup-tip {
            background: #18181b !important;
            border: 1px solid #3f3f46 !important;
          }
          .leaflet-popup-content {
            margin: 0 !important;
            color: #fff !important;
          }
          .vessel-marker {
            background: none !important;
            border: none !important;
          }
          .leaflet-container {
            background: #09090b !important;
          }
        `}</style>
      </div>
    </div>
  ) : (
    <div className="w-full">
      {mapContent}
      {/* Custom Styles for Leaflet Popup */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: #18181b !important;
          border: 1px solid #3f3f46 !important;
          border-radius: 8px !important;
        }
        .leaflet-popup-tip {
          background: #18181b !important;
          border: 1px solid #3f3f46 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          color: #fff !important;
        }
        .vessel-marker {
          background: none !important;
          border: none !important;
        }
        .leaflet-container {
          background: #09090b !important;
        }
      `}</style>
    </div>
  );
}
