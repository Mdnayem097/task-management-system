"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import API from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Eye, EyeOff, Loader2, UserCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: loginEmail,
        password: loginPass,
      });
      const token = response.data.token;
      const user = response.data.data.user;

      login(token, user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check credentials."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  // ✅ Demo Login Handler (তোমার টেস্ট ক্র্যাডেনশিয়াল বসিয়ে নিও)
  const handleDemoLogin = () => {
    const demoEmail = "user@example.com";
    const demoPassword = "password123";

    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLogin(demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-sm w-full space-y-6 bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-1 text-xs text-gray-500">
            Sign in to manage your tasks effectively
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {/* ✅ Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium text-xs transition-colors focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <span>Demo User One-Click Login</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-2 text-[10px] text-gray-400 uppercase tracking-wider absolute">
            or use credentials
          </span>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 flex items-center justify-center shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 pt-1">
          {"Don't have an account?"}{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}