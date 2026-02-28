"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updatePassword } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(formData.password);

    if (error) {
      setErrors({ general: error.message });
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <span className="text-3xl font-bold text-white">PropelSense</span>
          </div>

          <Card className="bg-zinc-900/90 border-zinc-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">
                Invalid link
              </CardTitle>
              <CardDescription className="text-neutral-400">
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-6 pb-6">
              <Link href="/forgot-password" className="w-full">
                <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium border border-zinc-600">
                  Request new link
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <span className="text-3xl font-bold text-white">PropelSense</span>
          </div>

          <Card className="bg-zinc-900/90 border-zinc-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">
                Password reset successful
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4 text-sm text-neutral-300">
                <p>You can now sign in with your new password.</p>
              </div>
            </CardContent>
            <CardFooter className="pt-6 pb-6">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium border border-zinc-600">
                  Continue to login
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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-600">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <span className="text-3xl font-bold text-white">PropelSense</span>
        </div>

        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Reset your password
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              {errors.general && (
                <div className="rounded-lg bg-red-900/20 border border-red-700 p-3 text-sm text-red-400">
                  {errors.general}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-200">
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-neutral-500 focus:border-zinc-600"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password}</p>
                )}
                <p className="text-xs text-neutral-500">
                  Must be at least 8 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-neutral-200">
                  Confirm new password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-neutral-500 focus:border-zinc-600"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 pb-6">
              <Button
                type="submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium border border-zinc-600"
                disabled={isLoading}
              >
                {isLoading ? "Resetting password..." : "Reset password"}
              </Button>
              <Link href="/login" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full text-neutral-300 hover:text-white hover:bg-zinc-800"
                >
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
