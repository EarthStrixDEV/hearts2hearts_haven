"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import h2h_logo from "../../public/images/h2h_logo.png";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: "Members", href: "/members" },
    { name: "Gallery", href: "/gallery" },
    { name: "Streaming", href: "/music" },
    { name: "About", href: "/about" },
    { name: "Schedule", href: "/schedule" },
    { name: "Contact", href: "/contact" },
  ];

  const funLinks = [
    { name: "Quiz 🎮", href: "/quiz" },
    { name: "Personality Test 💕", href: "/personality-test" },
    { name: "Fan Bingo 🎯", href: "/bingo" },
  ];

  const adminLinks = [{ name: "CMS 🔐", href: "/cms" }];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src={h2h_logo}
                  alt="Hearts2Hearts Haven Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold gradient-text leading-tight">
                  Hearts2Hearts
                </span>
                <span className="text-sm font-medium text-gray-600 leading-tight">
                  Haven
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Fun Links */}
            <div className="flex items-center space-x-1">
              {funLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 font-medium text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Admin Links */}
            <div className="flex items-center space-x-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium text-sm border border-red-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {/* Main Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-3"></div>

            {/* Fun Activities Section */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-purple-600 px-4 py-2 uppercase tracking-wide">
                Fun Activities
              </div>
              {funLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-3"></div>

            {/* Admin Section */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-red-600 px-4 py-2 uppercase tracking-wide">
                Admin
              </div>
              {adminLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium border border-red-200 mx-4"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
