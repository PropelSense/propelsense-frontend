"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import WeatherDetails from "./components/WeatherDetails";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");

  const getUserInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.user_metadata?.full_name || "User";
  };

  const navItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: "new-prediction", 
      label: "New Prediction", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      primary: true 
    },
    { 
      id: "fleet", 
      label: "Fleet Management", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      id: "analytics", 
      label: "Ocean Analytics", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: "weather", 
      label: "Weather Details", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    { 
      id: "parameters", 
      label: "Parameters", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: "alerts", 
      label: "Alerts", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: "documentation", 
      label: "Documentation", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900/95 border-r border-neutral-800/50 flex flex-col">
        {/* User Profile Section */}
        <div className="p-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-800/60 transition-all focus:outline-none group">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-gradient-to-br from-zinc-600 to-zinc-700 text-white text-sm font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {getUserDisplayName()}
                  </p>
                </div>
                <svg className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-zinc-900 border-zinc-700 p-3 ml-4" align="start">
              <div className="space-y-2">
                <div className="px-2 py-2 border-b border-zinc-700">
                  <p className="text-xs text-neutral-500">Signed in as</p>
                  <p className="text-sm text-white truncate">{user?.email}</p>
                </div>
                <Link href="/" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-neutral-300 hover:text-white hover:bg-zinc-800"
                    size="sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="w-full justify-start text-neutral-300 hover:text-white hover:bg-zinc-800"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-neutral-800/60 border border-neutral-700/50 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:bg-neutral-800 focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 pb-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all group ${
                activeItem === item.id
                  ? "bg-blue-600/20 text-blue-400"
                  : item.primary
                  ? "text-blue-400 hover:bg-neutral-800/60 hover:text-blue-300"
                  : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
              }`}
            >
              <span className={activeItem === item.id ? "text-blue-400" : "group-hover:text-current"}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.primary && (
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeItem === "weather" ? (
            <WeatherDetails />
          ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">
                Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || "User"}!
              </h1>
              <p className="text-neutral-400 text-lg">
                Your PropelSense dashboard
              </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <Card className="bg-zinc-900/90 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400 text-sm">
                    No predictions yet. Start making predictions to see them here.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-zinc-900/90 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400 text-sm">
                    View your prediction analytics and insights.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-zinc-900/90 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                    onClick={() => setActiveItem("new-prediction")}
                  >
                    New Prediction
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                    onClick={() => setActiveItem("weather")}
                  >
                    View History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Placeholder for future content */}
            <Card className="bg-zinc-900/90 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white">Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-700/40 to-zinc-800/40 rounded-2xl mx-auto flex items-center justify-center border border-zinc-600/50">
                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <p className="text-neutral-500">Dashboard content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
