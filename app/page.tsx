"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900">
      {/* Header/Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-white">PropelSense</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-neutral-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#technology" className="text-neutral-400 hover:text-white transition-colors">
              Technology
            </Link>
            <Link href="#about" className="text-neutral-400 hover:text-white transition-colors">
              About
            </Link>
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded-full">
                    <Avatar className="w-10 h-10 cursor-pointer border-2 border-zinc-600 hover:border-zinc-500 transition-colors">
                      <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 bg-zinc-900 border-zinc-700 p-4" align="end">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 pb-3 border-b border-zinc-700">
                      <Avatar className="w-12 h-12 border-2 border-zinc-600">
                        <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-white font-semibold text-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.user_metadata?.first_name && user.user_metadata?.last_name
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                            : "User"}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-neutral-500">Email:</span>
                        <p className="text-white truncate">{user.email}</p>
                      </div>
                      {user.user_metadata?.first_name && (
                        <div>
                          <span className="text-neutral-500">Name:</span>
                          <p className="text-white">
                            {user.user_metadata.first_name} {user.user_metadata.last_name}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-zinc-700">
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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 border border-neutral-200 backdrop-blur-sm shadow-lg">
            <div className="w-2 h-2 bg-neutral-800 rounded-full mr-2 animate-pulse" />
            <span className="text-sm text-neutral-900 font-medium">Powered by Advanced ML Algorithms</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Predictive Power for
            <br />
            <span className="bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              Maritime Excellence
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            PropelSense leverages cutting-edge machine learning to predict vessel propulsion power with unprecedented accuracy. 
            Optimize fuel efficiency, reduce emissions, and enhance operational planning for Meyer Turku fleet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-white hover:bg-neutral-100 text-neutral-900 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
              Try Prediction Tool
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-2 border-white/30 !text-white hover:bg-white/20 hover:border-white/50 px-8 py-6 text-lg font-medium hover:!text-white backdrop-blur-sm">
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="text-sm text-neutral-500">Prediction Accuracy</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-white">20+</div>
              <div className="text-sm text-neutral-500">Vessel Parameters</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-white">Real-time</div>
              <div className="text-sm text-neutral-500">Analysis</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Placeholder */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-gradient-to-br from-zinc-800 to-neutral-900 p-1">
            <div className="bg-gradient-to-br from-zinc-800/50 to-neutral-900 rounded-xl p-8">
              <div className="aspect-video bg-zinc-800/50 rounded-lg flex items-center justify-center border border-zinc-700">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-2xl mx-auto flex items-center justify-center border border-zinc-600/50">
                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    [Dashboard Preview Image]
                    <br />
                    <span className="text-xs">Request: Hero section dashboard screenshot showing prediction interface</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Intelligent Prediction System
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Comprehensive features designed for maritime professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Power Prediction</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Accurately predict propulsion power requirements based on vessel conditions, weather, and ocean data.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Real-time Analysis</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Instant predictions with confidence scores and efficiency metrics for immediate decision-making.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Weather Integration</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Incorporates wind speed, wave height, and ocean conditions for comprehensive power estimation.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 4 */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Historical Data</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Access prediction history and analyze trends to optimize vessel operations over time.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 5 */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Parameter Tuning</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Adjust vessel parameters like speed, draft, and load to explore different operational scenarios.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 6 */}
            <Card className="bg-zinc-900/90 border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-600/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Confidence Metrics</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Every prediction includes confidence scores and efficiency ratings for informed decision-making.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Enterprise-grade stack for reliability and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tech Stack Card */}
            <Card className="bg-zinc-900/90 border-zinc-700">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">Machine Learning</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
                    <div>
                      <div className="text-white font-medium">Advanced Algorithms</div>
                      <div className="text-neutral-400 text-sm">Trained on extensive maritime operational data</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
                    <div>
                      <div className="text-white font-medium">Multi-factor Analysis</div>
                      <div className="text-neutral-400 text-sm">Considers vessel, weather, and ocean parameters</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
                    <div>
                      <div className="text-white font-medium">Continuous Learning</div>
                      <div className="text-neutral-400 text-sm">Model improves with each prediction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Card */}
            <Card className="bg-zinc-900/90 border-zinc-700">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">Infrastructure</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
                    <div>
                      <div className="text-white font-medium">FastAPI Backend</div>
                      <div className="text-neutral-400 text-sm">High-performance Python API framework</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
                    <div>
                      <div className="text-white font-medium">Next.js Frontend</div>
                      <div className="text-neutral-400 text-sm">React-based with server-side rendering</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
                    <div>
                      <div className="text-white font-medium">PostgreSQL Database</div>
                      <div className="text-neutral-400 text-sm">Reliable data storage via Supabase</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About/Partnership Section */}
      <section id="about" className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-zinc-900/90 border-zinc-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Text Content */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="space-y-2">
                    <div className="text-zinc-400 text-sm font-medium">PARTNERSHIP</div>
                    <h3 className="text-3xl font-bold text-white">Meyer Turku</h3>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    Developed as part of an academic competition for Meyer Turku, one of the world's leading shipbuilding companies. 
                    PropelSense demonstrates the potential of AI-driven optimization in maritime operations.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-zinc-700/60 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-neutral-300">Simulated vessel data for demonstration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-zinc-700/60 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-neutral-300">Real-world applicable algorithms</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-zinc-700/60 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-neutral-300">Scalable for production deployment</span>
                    </div>
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center p-8 min-h-[300px]">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-zinc-700/60 rounded-2xl mx-auto flex items-center justify-center border border-zinc-600/50">
                      <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <p className="text-neutral-600 text-sm px-4">
                      [Meyer Turku Ship Image]
                      <br />
                      <span className="text-xs">Request: Meyer Turku vessel or shipyard image</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 overflow-hidden">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Ready to Optimize Your Fleet?
              </h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Experience the power of predictive analytics for maritime propulsion.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="bg-white hover:bg-neutral-100 text-neutral-900 font-semibold px-8 shadow-xl hover:shadow-2xl transition-all">
                  Start Prediction
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-2 border-white/30 !text-white hover:bg-white/20 hover:border-white/50 px-8 font-medium hover:!text-white backdrop-blur-sm">
                  Contact Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-zinc-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-xl font-bold text-white">PropelSense</span>
              </div>
              <p className="text-sm text-neutral-500">
                AI-powered propulsion prediction for the maritime industry.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Technology</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Team</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-700 text-center text-sm text-neutral-500">
            <p>© 2026 PropelSense. Built for Meyer Turku Academic Competition.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
