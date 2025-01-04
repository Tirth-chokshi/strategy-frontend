"use client";
import React, { useState } from "react";
import { Eye, LogOut, Plus, Menu, X } from "lucide-react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const handleLogout = async () => {
    try {
      const response = await authService.logout();
    } catch (err) {
      console.error('Error logging out:', err.message);
    }
  };
  return (
    <>
      <nav className="bg-gradient-to-r from-blue-900 to-black p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1
              className="text-white text-2xl sm:text-3xl font-bold tracking-wider cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              Shivansh
            </h1>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              <button
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() =>
                  (window.location.href = "/dashboard/strategy-display")
                }
              >
                <Eye size={20} />
                <span>Strategies</span>
              </button>
             
              <button
                className="flex items-center gap-2 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 w-full"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} mt-4`}>
            <div className="flex flex-col gap-2">
              <button
                className="flex items-center gap-2 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 w-full"
                onClick={() =>
                  (window.location.href = "/dashboard/strategy-display")
                }
              >
                <Eye size={20} />
                <span>Strategies</span>
              </button>
             
              <button className="flex items-center gap-2 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 w-full"
              onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 p-4">{children}</div>
    </>
  );
}
