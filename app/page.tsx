"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <main className="relative min-h-screen bg-linear-to-b from-neutral-900 via-neutral-950 to-neutral-900">
      {/* â”€â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo + Abo Akademi badge */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="PropelSense"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-white">PropelSense</span>

            {/* Abo Akademi University logo â€” top-left corner
            <div className="hidden sm:flex items-center border-l border-zinc-700 pl-4">
              <Image
                src="/aau-logo.png"
                alt="Abo Akademi University"
                width={90}
                height={28}
                className="brightness-0 invert opacity-60 hover:opacity-90 transition-opacity"
              />
            </div> */}
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#technology"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Technology
            </Link>
            <Link
              href="#about"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              About
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded-full">
                    <Avatar className="w-10 h-10 cursor-pointer border-2 border-zinc-600 hover:border-zinc-500 transition-colors">
                      <AvatarFallback className="bg-linear-to-br from-zinc-700 to-zinc-800 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-72 bg-zinc-900 border-zinc-700 p-4"
                  align="end"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 pb-3 border-b border-zinc-700">
                      <Avatar className="w-12 h-12 border-2 border-zinc-600">
                        <AvatarFallback className="bg-linear-to-br from-zinc-700 to-zinc-800 text-white font-semibold text-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.user_metadata?.first_name &&
                          user.user_metadata?.last_name
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                            : user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-neutral-500">Email:</span>
                        <p className="text-white truncate">{user.email}</p>
                      </div>
                      {(user.user_metadata?.first_name ||
                        user.user_metadata?.full_name) && (
                        <div>
                          <span className="text-neutral-500">Name:</span>
                          <p className="text-white">
                            {user.user_metadata?.first_name &&
                            user.user_metadata?.last_name
                              ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                              : user.user_metadata?.full_name}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-zinc-700 space-y-2">
                      <Link href="/dashboard" className="block">
                        <Button
                          variant="outline"
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                          size="sm"
                        >
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Button
                        onClick={() => signOut()}
                        variant="outline"
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                        size="sm"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href="/login">
                <Button className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium border border-zinc-600 shadow-md">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative z-10 container mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Built-with badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-neutral-200 backdrop-blur-sm shadow-lg">
            <Image
              src="/Meyer_Turku_logo.svg"
              alt="Meyer Turku"
              width={90}
              height={22}
              className="brightness-0"
            />
            <span className="text-neutral-400 text-sm">|</span>
            <span className="text-sm text-neutral-700 font-medium">
              Built in collaboration with Meyer Turku
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Ship Propulsion,
            <br />
            <span className="bg-linear-to-r from-zinc-300 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              Predicted Before Departure
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            A research tool for ship propulsion analysis, covering power
            prediction, sea trial management, live weather and ocean data,
            vessel traffic monitoring, and propulsion performance tracking.
            Developed at Abo Akademi University in collaboration with Meyer
            Turku.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button
                size="lg"
                className="bg-white hover:bg-neutral-100 text-neutral-900 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Open the Dashboard
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-2 border-white/30 text-white! hover:bg-white/20 hover:border-white/50 px-8 py-6 text-lg font-medium hover:text-white! backdrop-blur-sm"
              onClick={() => {
                /* video link goes here */
              }}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-white">97.8%</div>
              <div className="text-sm text-neutral-500">
                Model RÂ² (in-distribution)
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-white">15+</div>
              <div className="text-sm text-neutral-500">Input Features</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-white">On-Demand</div>
              <div className="text-sm text-neutral-500">Predictions</div>
            </div>
          </div>
        </div>

        {/* Dashboard screenshot */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-linear-to-br from-zinc-800 to-neutral-900 p-1">
            <div className="bg-linear-to-br from-zinc-800/50 to-neutral-900 rounded-xl p-6">
              <div className="rounded-lg overflow-hidden border border-zinc-700">
                <img
                  src="/dashboard.png"
                  alt="PropelSense dashboard preview"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Features â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        id="features"
        className="relative z-10 container mx-auto px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Everything in One Dashboard
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              From raw vessel parameters to actionable performance insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Power Prediction */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-linear-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Power Prediction
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Enter speed, draft, wind, current, and wave data to get an
                  instant shaft power estimate in kW from the trained XGBoost
                  model.
                </p>
              </CardContent>
            </Card>

            {/* Sea Trial Dashboard */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-linear-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Sea Trial Dashboard
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Log and analyse sea trial results. Compare predicted vs actual
                  speed, power, fuel, and RPM. Track contract compliance and
                  auto-fill predicted power with one click using the ML model.
                </p>
              </CardContent>
            </Card>

            {/* Weather Integration */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-linear-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Live Weather & Ocean Data
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Real-time marine weather feed covering wind speed and
                  direction, wave height, ocean current, and sea surface
                  temperature for the vessel's current position.
                </p>
              </CardContent>
            </Card>

            {/* Vessel Map */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-linear-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Interactive Vessel Map
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Live map showing vessel positions with vessel type markers.
                  Click any vessel to see details and jump straight into a power
                  prediction for its current conditions.
                </p>
              </CardContent>
            </Card>

            {/* Prediction History */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-linear-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Prediction History
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Every prediction is stored and linked to your account. Review
                  past runs, compare inputs and results, and track how power
                  demand changes across different voyage conditions.
                </p>
              </CardContent>
            </Card>

            {/* Propulsion Monitoring */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-linear-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Propulsion Monitoring
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  View live propulsion readings including shaft RPM, torque,
                  thrust, and power across time series charts and comparison
                  views.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Technology â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        id="technology"
        className="relative z-10 container mx-auto px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              A purpose-built stack from model training to production UI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-zinc-900/90 border-zinc-700">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">The ML Model</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        XGBoost Regressor
                      </div>
                      <div className="text-neutral-400 text-sm">
                        Trained on time-series vessel data covering speed
                        through water, draft, wind components, ocean current,
                        and wave height
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        Feature Engineering
                      </div>
                      <div className="text-neutral-400 text-sm">
                        Derived features include mean draft, trim, wind and
                        current magnitude and angle, STW cubed, and a speed-wind
                        interaction term
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        Model Performance
                      </div>
                      <div className="text-neutral-400 text-sm">
                        RÂ² of 0.978 in-distribution, MAE 866 kW. Hosted on
                        Hugging Face and cached locally on first load
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/90 border-zinc-700">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">
                  The Tech Stack
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        Next.js 15 + TypeScript
                      </div>
                      <div className="text-neutral-400 text-sm">
                        React-based frontend with server components and Tailwind
                        CSS
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        FastAPI + SQLAlchemy
                      </div>
                      <div className="text-neutral-400 text-sm">
                        Python backend handling predictions, sea trial data, and
                        propulsion readings via a versioned REST API
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        Supabase (PostgreSQL)
                      </div>
                      <div className="text-neutral-400 text-sm">
                        Handles authentication, user management, and persistent
                        storage for predictions and trial records
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ About â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        id="about"
        className="relative z-10 container mx-auto px-6 py-20"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-zinc-900/90 border-zinc-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Text */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="space-y-2">
                    <div className="text-zinc-400 text-sm font-medium tracking-widest uppercase">
                      Academic Research Project
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Abo Akademi University
                    </h3>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    PropelSense was developed at Abo Akademi University as an
                    applied research project in collaboration with Meyer Turku.
                    The goal was to turn real shipyard operational data into a
                    practical tool that engineers and analysts can use during
                    sea trials and voyage planning.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Trained on real vessel operational data provided by Meyer Turku",
                      "Covers the full range from calm-water trials to rough weather conditions",
                      "Open architecture designed for integration with existing shipyard workflows",
                    ].map((point) => (
                      <div key={point} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-zinc-700/60 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <svg
                            className="w-4 h-4 text-zinc-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-neutral-300 text-sm leading-relaxed">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Partner logos */}
                  <div className="flex items-center gap-6 pt-2">
                    <Image
                      src="/Meyer_Turku_logo.svg"
                      alt="Meyer Turku"
                      width={110}
                      height={28}
                      className="brightness-0 invert opacity-70"
                    />
                    <Image
                      src="/aau-logo.png"
                      alt="Abo Akademi University"
                      width={90}
                      height={28}
                      className="brightness-0 invert opacity-70"
                    />
                  </div>
                </div>

                {/* Shipyard photo */}
                <div className="bg-linear-to-br from-zinc-800 to-zinc-900 min-h-75 overflow-hidden">
                  <img
                    src="/shipyard.jpg"
                    alt="Meyer Turku shipyard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* â”€â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-linear-to-br from-zinc-800 to-zinc-900 border-zinc-700 overflow-hidden">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Ready to Run Your First Prediction?
              </h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Sign in and start predicting shaft power in under a minute.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href={user ? "/dashboard" : "/login"}>
                  <Button
                    size="lg"
                    className="bg-white hover:bg-neutral-100 text-neutral-900 font-semibold px-8 shadow-xl hover:shadow-2xl transition-all"
                  >
                    {user ? "Go to Dashboard" : "Get Started"}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-2 border-white/30 text-white! hover:bg-white/20 hover:border-white/50 px-8 font-medium hover:text-white! backdrop-blur-sm"
                  onClick={() => {
                    /* video link goes here */
                  }}
                >
                  Watch Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* â”€â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-zinc-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-xl font-bold text-white">
                  PropelSense
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                Propulsion power prediction for the maritime industry, developed
                at Abo Akademi University.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <Image
                  src="/Meyer_Turku_logo.svg"
                  alt="Meyer Turku"
                  width={80}
                  height={20}
                  className="brightness-0 invert opacity-40"
                />
                <Image
                  src="/aau-logo.png"
                  alt="Abo Akademi University"
                  width={64}
                  height={20}
                  className="brightness-0 invert opacity-40"
                />
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#technology"
                    className="hover:text-white transition-colors"
                  >
                    Technology
                  </Link>
                </li>
                <li>
                  <Link
                    href={user ? "/dashboard" : "/login"}
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Project</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.abo.fi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Abo Akademi University
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.meyerturku.fi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Meyer Turku
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-700 text-center text-sm text-neutral-500">
            <p>
              &copy; {new Date().getFullYear()} PropelSense &mdash; A research
              project by Abo Akademi University in collaboration with Meyer
              Turku.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
