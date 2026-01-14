"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

export default function DashboardPage() {
  const { user, signOut } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900">
      {/* Header */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-white">PropelSense</span>
            </Link>
            
            {/* User Avatar with Popover */}
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
                        {user?.user_metadata?.first_name && user?.user_metadata?.last_name
                          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                          : user?.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-neutral-500">Email:</span>
                      <p className="text-white truncate">{user?.email}</p>
                    </div>
                    {(user?.user_metadata?.first_name || user?.user_metadata?.full_name) && (
                      <div>
                        <span className="text-neutral-500">Name:</span>
                        <p className="text-white">
                          {user?.user_metadata?.first_name && user?.user_metadata?.last_name
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                            : user?.user_metadata?.full_name}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-zinc-700 space-y-2">
                    <Link href="/" className="block">
                      <Button
                        variant="outline"
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                        size="sm"
                      >
                        Back to Home
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
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
                >
                  New Prediction
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
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
      </div>
    </div>
  );
}
