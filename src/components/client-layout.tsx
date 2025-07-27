// src/app/client-layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface Category {
  _id: string;
  title: string;
  slug?: { current: string } | null;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  categories: Category[];
}

export default function ClientLayout({ children, categories }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar closed by default on mobile

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold flex-shrink-0">
            <Link href="/" aria-label="TechPolitics Home">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text fallback-text">
                TechPolitics
              </span>
            </Link>
          </h1>
          {/* Navigation Links */}
          <div className="flex items-center">
            <div className="hidden md:flex space-x-4 sm:space-x-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Home Page"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="About Us Page"
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Blog or News Page"
              >
                Blog/News
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Contact Page"
              >
                Contact
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Privacy Policy Page"
              >
                Privacy Policy
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-800 dark:text-gray-100 ml-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Close Menu' : 'Open Menu'}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {sidebarOpen && (
          <div className="md:hidden bg-white dark:bg-neutral-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Home Page"
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="About Us Page"
                onClick={() => setSidebarOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Blog or News Page"
                onClick={() => setSidebarOpen(false)}
              >
                Blog/News
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Contact Page"
                onClick={() => setSidebarOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Privacy Policy Page"
                onClick={() => setSidebarOpen(false)}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar + Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 transition-all duration-300`}
          aria-hidden={!sidebarOpen}
        >
          <div className="sticky top-20 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold">Categories</h3>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline lg:hidden"
                  aria-label={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                >
                  {sidebarOpen ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <ul className="space-y-2">
                {categories.map((category) =>
                  category.slug?.current ? (
                    <li key={category._id}>
                      <Link
                        href={`/category/${category.slug.current}`}
                        className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition"
                        aria-label={`View ${category.title} category`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {category.title}
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5">
              <h3 className="text-base font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition"
                    aria-label="View Article Archive"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Article Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition"
                    aria-label="Contact Us"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="w-full lg:w-3/4">{children}</main>
      </div>
    </div>
  );
}