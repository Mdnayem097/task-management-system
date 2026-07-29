'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, CheckSquare, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">TaskFlow</span>
        </div>

        {/* User Profile & Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-full">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-700 hidden sm:inline-block">
                {user.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 py-1.5 px-3 rounded-lg transition-colors border border-transparent hover:border-red-100"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}