import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API Route - Vessel Zone Proxy
 *
 * Proxies requests to MyShipTracking API to avoid CORS issues.
 * The API doesn't support browser-based requests, so we proxy through Next.js server.
 */

export async function GET(request: NextRequest) {
  // Use server-side env var (no NEXT_PUBLIC_ prefix for API keys)
  const apiKey = process.env.MYSHIPTRACKING_API_KEY;

  // Debug logging
  console.log("=== Vessel API Route Debug ===");
  console.log("API Key exists:", !!apiKey);
  console.log("API Key first 10 chars:", apiKey?.substring(0, 10));
  console.log("API Key length:", apiKey?.length);
  console.log("api key :: ", apiKey);

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        duration: "0",
        timestamp: new Date().toISOString(),
        code: "ERR_NO_KEY",
        message:
          "MyShipTracking API key not configured. Add MYSHIPTRACKING_API_KEY to .env.local",
      },
      { status: 500 },
    );
  }

  // Extract query parameters from request
  const searchParams = request.nextUrl.searchParams;
  const minlat = searchParams.get("minlat");
  const maxlat = searchParams.get("maxlat");
  const minlon = searchParams.get("minlon");
  const maxlon = searchParams.get("maxlon");
  const response = searchParams.get("response") || "simple";
  const minutesBack = searchParams.get("minutesBack") || "60";

  // Validate required parameters
  if (!minlat || !maxlat || !minlon || !maxlon) {
    return NextResponse.json(
      {
        status: "error",
        duration: "0",
        timestamp: new Date().toISOString(),
        code: "ERR_INVALID_PARAMS",
        message: "Missing required parameters: minlat, maxlat, minlon, maxlon",
      },
      { status: 400 },
    );
  }

  // Build query string for external API
  const queryParams = new URLSearchParams({
    minlat,
    maxlat,
    minlon,
    maxlon,
    response,
    minutesBack,
  });

  try {
    const apiUrl = `https://api.myshiptracking.com/api/v2/vessel/zone?${queryParams}`;
    console.log("Fetching from:", apiUrl);
    console.log(
      "Authorization header:",
      `Bearer ${apiKey?.substring(0, 10)}...`,
    );

    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Note: Don't include Content-Type - API rejects it
      },
      cache: "no-store",
    });

    console.log("API Response status:", apiResponse.status);

    const data = await apiResponse.json();
    console.log("API Response data:", JSON.stringify(data).substring(0, 200));

    // Forward credit charge header if present
    const creditCharged = apiResponse.headers.get("X-Credit-Charged");
    const responseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (creditCharged) {
      responseHeaders["X-Credit-Charged"] = creditCharged;
    }

    return NextResponse.json(data, {
      status: apiResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Vessel API Proxy Error:", error);
    return NextResponse.json(
      {
        status: "error",
        duration: "0",
        timestamp: new Date().toISOString(),
        code: "ERR_FETCH",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch vessel data",
      },
      { status: 500 },
    );
  }
}
