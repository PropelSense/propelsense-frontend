"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual password reset logic
    console.log("Password reset request for:", email);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <span className="text-3xl font-bold text-white">PropelSense</span>
          </div>

          <Card className="bg-zinc-900/90 border-zinc-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">Check your email</CardTitle>
              <CardDescription className="text-neutral-400">
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4 text-sm text-neutral-300">
                <p>
                  If you don't see the email, check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-white hover:underline font-medium"
                  >
                    try another email address
                  </button>
                  .
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-6 pb-6">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-neutral-200 hover:bg-zinc-800 hover:text-white">
                  Back to login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <span className="text-3xl font-bold text-white">PropelSense</span>
        </div>

        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Forgot password?</CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-neutral-500 focus:border-zinc-600"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 pb-6">
              <Button
                type="submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium border border-zinc-600"
                disabled={isLoading}
              >
                {isLoading ? "Sending link..." : "Send reset link"}
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full text-neutral-300 hover:text-white hover:bg-zinc-800">
                  Back to login
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
