"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import Link from 'next/link';
import Image from 'next/image';
import { Home, Eye, LogOut, Plus, Mail, Phone, MapPin, Menu, X } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

  // Function to check if the user is authenticated
  const checkAuthentication = () => {
    // Replace this with your actual authentication logic
    const isAuthenticated = false; // Example: change to true if authenticated
    return isAuthenticated;
  };

  // useEffect to handle redirection based on authentication status
  useEffect(() => {
    if (checkAuthentication()) {
      // Redirect to dashboard if authenticated
      router.push('/dashboard/strategy-display');
    } else {
      // Redirect to login if unauthenticated
      router.push('/login');
    }
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile-optimized Navbar */}
      {/* <nav className="bg-gradient-to-r from-blue-900 to-black p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wider cursor-pointer" onClick={() => window.location.href = '/'}>
              Shivansh
            </h1>
            
            
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            
            <div className="hidden md:flex gap-6">
              <button className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={() => window.location.href = '/dashboard/strategy-display'}>
                <Eye size={20} />
                <span>Strategies</span>
              </button>
              <button className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={() => window.location.href = '/dashboard/new-strategy'}>
                <Plus size={20} />
                <span>New</span>
              </button>
              <button className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

      
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 w-full" onClick={() => window.location.href = '/dashboard/strategy-display'}>
                <Eye size={20} />
                <span>Strategies</span>
              </button>
              <button className="flex items-center gap-2 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 w-full" onClick={() => window.location.href = '/dashboard/new-strategy'}>
                <Plus size={20} />
                <span>New</span>
              </button>
              <button className="flex items-center gap-2 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 w-full">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav> */}
      {/* Main Content */}
      <main className="flex-grow">
        {/* Responsive Hero Section */}
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] group">
          <Image
            src="/strategy1.jpg"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            priority
          />
          
          {/* Responsive Hero Content */}
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center px-4 text-center">
            <Link href="/dashboard/new-strategy">
              <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2">
                <Plus size={20} className="sm:size-18" />
                Create New Strategy
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Responsive Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">About Us</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                We specialize in creating sophisticated trading strategies for the stock market. 
                Our advanced algorithms and expert analysis help customers maximize their trading potential 
                and achieve consistent results in the financial markets.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base">
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/strategies" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base">
                    <Eye size={18} />
                    <span>View Strategies</span>
                  </Link>
                </li>
                <li>
                  <Link href="/logout" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4 sm:col-span-2 md:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Contact Info</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                  <Mail size={18} />
                  <span>shivansh@gmail.com</span>
                </p>
                <p className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                  <Phone size={18} />
                  <span>9558829664</span>
                </p>
                <p className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                  <MapPin size={18} />
                  <span>Gandhinagar, Gujarat</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © 2024 Shivansh. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;