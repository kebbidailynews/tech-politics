'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Category {
  _id: string;
  title: string;
  slug?: { current: string } | null;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  categories: Category[];
}

// Reusable Nav Link
const NavLink = ({
  href,
  children,
  onClick,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${className}`}
    aria-label={typeof children === 'string' ? `${children} page` : undefined}
  >
    {children}
  </Link>
);

// Mobile Overlay
const MobileOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
  isOpen ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
      onClick={onClose}
      aria-hidden="true"
    />
  ) : null;

// Desktop & Mobile Nav Items
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog/News' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
];

export default function ClientLayout({ children, categories }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close on outside click (mobile)
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    },
    [sidebarOpen]
  );

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden'; // Prevent scroll
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, handleOutsideClick]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-md border-b border-gray-200 dark:border-neutral-800">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main">
            <div className="py-4 flex items-center justify-between">
              {/* Logo */}
              <h1 className="text-xl sm:text-2xl font-bold flex-shrink-0">
                <Link href="/" aria-label="TechPolitics Home">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
                    TechPolitics
                  </span>
                </Link>
              </h1>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
                aria-controls="mobile-menu"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
              id="mobile-menu"
              className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </header>

        {/* Overlay (Mobile Only) */}
        <MobileOverlay isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main Content + Sidebar */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside
              ref={sidebarRef}
              className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 shadow-lg lg:shadow-none
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:block lg:w-1/4 lg:sticky lg:top-20 lg:self-start
              `}
              aria-label="Sidebar"
            >
              <div className="h-full overflow-y-auto p-5 space-y-6">
                {/* Collapse Button (Mobile) */}
                <div className="flex justify-end lg:hidden">
                  <button
                    onClick={closeSidebar}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    aria-label="Collapse sidebar"
                  >
                    Collapse
                  </button>
                </div>

                {/* Categories */}
                <section className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5 lg:shadow-none lg:p-0">
                  <h3 className="text-base font-bold mb-3 text-gray-900 dark:text-gray-100">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) =>
                      category.slug?.current ? (
                        <li key={category._id}>
                          <Link
                            href={`/category/${category.slug.current}`}
                            onClick={closeSidebar}
                            className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            aria-label={`View ${category.title} category`}
                          >
                            {category.title}
                          </Link>
                        </li>
                      ) : null
                    )}
                  </ul>
                </section>

                {/* Quick Links */}
                <section className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5 lg:shadow-none lg:p-0">
                  <h3 className="text-base font-bold mb-3 text-gray-900 dark:text-gray-100">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/"
                        onClick={closeSidebar}
                        className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        Article Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        onClick={closeSidebar}
                        className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </section>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:w-3/4 min-h-[600px]" role="main">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}