"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, CheckSquare } from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-sm shadow-indigo-200">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            TaskCraft
          </span>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-3 pr-1 py-1 bg-gray-50 rounded-full border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 hidden sm:inline-block">
                {user?.name || "User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
