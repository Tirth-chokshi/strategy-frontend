"use client";
import React, { useState, useEffect } from "react";
import { Eye, LogOut, Menu, X, Key } from "lucide-react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("userToken");
    if (savedToken) {
      setToken(savedToken);
      setHasToken(true);
    }
  }, []);

  const handleTokenSave = () => {
    if (token.trim()) {
      localStorage.setItem("userToken", token);
      setHasToken(true);
    } else {
      localStorage.removeItem("userToken");
      setHasToken(false);
    }
    setShowTokenModal(false);
  };

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  return (
    <>
      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-background rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Enter Token</h2>
              <button
                onClick={() => setShowTokenModal(false)}
                className="p-1 hover:bg-accent rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none mb-4"
              placeholder="Paste your token here"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTokenSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="border-b bg-background h-14 fixed w-full top-0 z-50">
        <div className="container h-full mx-auto flex items-center px-4">
          <div className="flex justify-end items-center w-full">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 ${
                  hasToken
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
                onClick={() => setShowTokenModal(true)}
              >
                <Key className="mr-2 h-4 w-4" />
                <span>Input Token</span>
              </button>

              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => router.push("/dashboard/strategy-display")}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>Strategies</span>
              </button>

              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`md:hidden absolute top-14 left-0 right-0 border-b bg-background ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
              <button
                className={`flex items-center gap-2 w-full rounded-md px-4 py-2 text-sm ${
                  hasToken
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
                onClick={() => setShowTokenModal(true)}
              >
                <Key className="h-4 w-4" />
                <span>Input Token</span>
              </button>

              <button
                className="flex items-center gap-2 w-full rounded-md px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => router.push("/dashboard/strategy-display")}
              >
                <Eye className="h-4 w-4" />
                <span>Strategies</span>
              </button>

              <button
                className="flex items-center gap-2 w-full rounded-md px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        <div>{children}</div>
      </main>
    </>
  );
}
