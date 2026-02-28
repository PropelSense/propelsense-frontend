"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const { error: googleError } = await signInWithGoogle();

    if (googleError) {
      setError(googleError.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden">
            <Image
              src="/logo.png"
              alt="PropelSense"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl font-bold text-white">PropelSense</span>
        </div>

        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your credentials to access your dashboard
            </CardDescription>
            {message && (
              <div className="mt-2 rounded-lg bg-green-900/20 border border-green-700 p-3 text-sm text-green-400">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-2 rounded-lg bg-red-900/20 border border-red-700 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              {" "}
              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 font-medium"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-neutral-500">
                    Or continue with email
                  </span>
                </div>
              </div>{" "}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-200">
                  Email
                </Label>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-neutral-200">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-neutral-500 focus:border-zinc-600"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer text-neutral-300"
                >
                  Remember me for 30 days
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 pb-6">
              <Button
                type="submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium border border-zinc-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-sm text-center text-neutral-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-white hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
