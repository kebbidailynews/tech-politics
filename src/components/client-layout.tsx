'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Menu, X, ChevronDown } from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change or resize
  useEffect(() => {
    const closeSidebar = () => setSidebarOpen(false);
    window.addEventListener('resize', closeSidebar);
    return () => window.removeEventListener('resize', closeSidebar);
  }, []);

  return (
    <>
      {/* ✅ Proper Head section */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
        <title>TechPolitics</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        {/* Sticky Header */}
        <header
          className={`sticky top-0 z-50 transition-shadow duration-200 ${
            scrolled ? 'shadow-lg' : 'shadow'
          } bg-white dark:bg-neutral-900`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-18">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="block" aria-label="TechPolitics - Home">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      TechPolitics
                    </span>
                  </h1>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {['Home', 'About Us', 'Blog/News', 'Contact', 'Privacy Policy'].map((item) => {
                  const href =
                    item === 'Home'
                      ? '/'
                      : item === 'About Us'
                      ? '/about'
                      : item === 'Blog/News'
                      ? '/blog'
                      : item === 'Contact'
                      ? '/contact'
                      : '/privacy-policy';

                  return (
                    <Link
                      key={item}
                      href={href}
                      className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
                      aria-label={`${item} Page`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Slide-In Menu */}
          <div
            className={`md:hidden fixed inset-0 z-40 transition-opacity ${
              sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
            <div
              className={`absolute left-0 top-0 h-full w-80 max-w-full bg-white dark:bg-neutral-900 shadow-2xl transform transition-transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Blog/News', href: '/blog' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Categories in Mobile Menu */}
              {categories.length > 0 && (
                <div className="border-t border-gray-200 dark:border-neutral-800 px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map(
                      (cat) =>
                        cat.slug?.current && (
                          <Link
                            key={cat._id}
                            href={`/category/${cat.slug.current}`}
                            onClick={() => setSidebarOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
                          >
                            {cat.title}
                          </Link>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside
              className={`${
                sidebarOpen
                  ? 'block fixed inset-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm lg:static lg:block'
                  : 'hidden lg:block'
              } lg:w-80 xl:w-72 flex-shrink-0`}
            >
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Categories Widget */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Categories
                    </h3>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden text-blue-600 dark:text-blue-400 text-sm font-medium"
                    >
                      Close
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {categories.map(
                      (cat) =>
                        cat.slug?.current && (
                          <li key={cat._id}>
                            <Link
                              href={`/category/${cat.slug.current}`}
                              onClick={() => setSidebarOpen(false)}
                              className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition"
                            >
                              {cat.title}
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/"
                        onClick={() => setSidebarOpen(false)}
                        className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition"
                      >
                        Latest Articles
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        onClick={() => setSidebarOpen(false)}
                        className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition transform active:scale-95"
          aria-label="Open sidebar"
        >
          <ChevronDown className="rotate-[-90deg]" size={24} />
        </button>
      </div>
    </>
  );
}
