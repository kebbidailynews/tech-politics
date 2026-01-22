'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  X,
  Menu,
  Home,
  Grid,
  Flame,
  Bell,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface TrendingPost {
  title: string;
  slug: string;
  views?: number;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  categories: Category[];
  trending: TrendingPost[];
  headlines?: string[];
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function ClientLayout({
  children,
  categories,
  trending,
  headlines = [],
}: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [ticker, setTicker] = useState('');
  const [ngnUsd, setNgnUsd] = useState('1 USD = 1,650 NGN');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();

  // Close modals on route change
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  /* ──────── Headline Ticker ──────── */
  const tickerItems = useMemo(() => {
    if (headlines.length > 0) return headlines;
    if (trending.length > 0) return trending.map((post) => post.title);
    return ['Breaking tech news'];
  }, [headlines, trending]);

  useEffect(() => {
    const update = () => {
      const wat = new Date().toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const i = Math.floor(Date.now() / 10000) % tickerItems.length;
      const title = tickerItems[i] ?? 'Breaking tech news';
      setTicker(`${wat} WAT — ${title}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [tickerItems]);

  /* ──────── NGN/USD Rate ──────── */
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        const rate = data.rates.NGN?.toFixed(0) ?? '1,650';
        setNgnUsd(`1 USD = ${rate} NGN`);
      } catch {
        setNgnUsd('1 USD = 1,650 NGN');
      }
    };
    fetchRate();
    const id = setInterval(fetchRate, 300_000);
    return () => clearInterval(id);
  }, []);

  /* ──────── PWA Install Prompt ──────── */
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
  };

  return (
    <>
      {/* Breaking News Ticker - Fox Style – Mobile Improved (No Flame Icon) */}
<div className="bg-gradient-to-r from-red-700 to-red-600 text-white overflow-hidden shadow-sm">
  <div className="flex items-center h-9 sm:h-10">
    {/* Fixed left label - no icon */}
    <div className="bg-white text-red-700 px-4 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center h-full flex-shrink-0 z-10 relative shadow-[2px_0_6px_rgba(0,0,0,0.3)]">
      <Link href="/blog" className="hover:underline">HOT</Link>
    </div>

    {/* Scrolling area */}
    <div
      className="flex-1 overflow-hidden"
      onMouseEnter={(e) => e.currentTarget.classList.add('pause-marquee')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('pause-marquee')}
      onTouchStart={(e) => e.currentTarget.classList.add('pause-marquee')}
      onTouchEnd={(e) => {
        setTimeout(() => e.currentTarget.classList.remove('pause-marquee'), 80);
      }}
    >
      <div className="inline-flex items-center animate-marquee whitespace-nowrap will-change-transform">
        {/* Original content */}
        <span className="inline-flex items-center gap-4 sm:gap-6 px-5 sm:px-8 text-sm sm:text-base font-medium">
          <span className="font-semibold">{ticker}</span>
          <span className="opacity-80">•</span>
          <span className="inline-flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{ngnUsd}</span>
          </span>

          {deferredPrompt && (
            <>
              <span className="opacity-80">•</span>
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            </>
          )}

          {/* Visual separator for smooth loop */}
          <span className="opacity-60 mx-2 sm:mx-4">••••</span>
        </span>

        {/* Duplicate for seamless loop */}
        <span className="inline-flex items-center gap-4 sm:gap-6 px-5 sm:px-8 text-sm sm:text-base font-medium">
          <span className="font-semibold">{ticker}</span>
          <span className="opacity-80">•</span>
          <span className="inline-flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{ngnUsd}</span>
          </span>

          {deferredPrompt && (
            <>
              <span className="opacity-80">•</span>
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            </>
          )}

          <span className="opacity-60 mx-2 sm:mx-4">••••</span>
        </span>
      </div>
    </div>
  </div>
</div>

      {/* Header - Fox News Style */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b-4 border-red-600 shadow-md pt-safe">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Logo and Title (Mobile Only) */}
          <div className="lg:hidden flex items-center justify-between px-4 h-14">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="TechPolitics Logo"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <div>
                <h1 className="text-xl font-black text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text leading-none">
                  TechPolitics
                </h1>
                <p className="text-[9px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold">
                  Fair & Balanced
                </p>
              </div>
            </Link>

            {/* Desktop Actions - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="font-bold"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 font-bold">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Row - Categories, Search, Menu */}
          <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-gray-200 dark:border-neutral-800">
            {/* Categories Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              >
                <span className="truncate">
                  {categories.find(cat => pathname === cat.slug)?.title || 'Categories'}
                </span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" />
              </button>
              
              {/* Categories Dropdown Menu */}
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                  >
                    <div className="p-2">
                      <Link
                        href="/"
                        onClick={() => setCategoriesOpen(false)}
                        className={cn(
                          "block px-3 py-2 text-sm font-medium rounded hover:bg-red-50 dark:hover:bg-neutral-800 transition",
                          pathname === '/' ? "text-red-600 bg-red-50 dark:bg-neutral-800" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        Home
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={cat.slug}
                          onClick={() => setCategoriesOpen(false)}
                          className={cn(
                            "block px-3 py-2 text-sm font-medium rounded hover:bg-red-50 dark:hover:bg-neutral-800 transition",
                            pathname === cat.slug ? "text-red-600 bg-red-50 dark:bg-neutral-800" : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
            >
              <Search className="w-4 h-4" />
              <span className="truncate">Search</span>
            </button>

            {/* Menu Dropdown */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
            >
              <Menu className="w-4 h-4" />
              <span className="truncate">Menu</span>
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between px-4 h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/favicon.ico"
                  alt="TechPolitics Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text leading-none">
                    TechPolitics
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold">
                    Fair & Balanced
                  </p>
                </div>
              </Link>

              {/* Desktop Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(true)}
                  className="font-bold"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 font-bold">
                  <Bell className="w-4 h-4 mr-2" />
                  Alerts
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="border-t border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-1 px-4 overflow-x-auto">
                <NavLink href="/" label="Home" active={pathname === '/'} />
                {categories.map((cat) => (
                  <NavLink
                    key={cat._id}
                    href={cat.slug}
                    label={cat.title}
                    active={pathname === cat.slug}
                  />
                ))}
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span className="font-bold">
                    {new Date().toLocaleTimeString('en-NG', {
                      timeZone: 'Africa/Lagos',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })} WAT
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Fox Style */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-900 border-t-2 border-red-600 shadow-2xl pb-safe">
        <div className="grid grid-cols-4 h-16">
          <NavItem href="/" icon={<Home className="w-5 h-5" />} label="Home" active={pathname === '/'} />
          <NavItem 
            onClick={() => setSearchOpen(true)} 
            icon={<Search className="w-5 h-5" />} 
            label="Search" 
          />
          <NavItem 
            href="/category/trending" 
            icon={<Flame className="w-5 h-5" />} 
            label="Trending"
            active={pathname === '/category/trending'}
          />
          <NavItem 
            onClick={() => setMobileMenuOpen(true)} 
            icon={<Grid className="w-5 h-5" />} 
            label="Menu" 
          />
        </div>
      </nav>

      {/* Mobile Menu Drawer - Fox Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm z-50 bg-white dark:bg-neutral-900 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="flex items-center gap-2">
                  <Image
                    src="/favicon.ico"
                    alt="TechPolitics"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                  <h2 className="text-lg font-black uppercase tracking-wide">Menu</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Main Navigation */}
                <section className="border-b-4 border-red-600">
                  <MenuLink href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
                  {categories.map((cat) => (
                    <MenuLink
                      key={cat._id}
                      href={cat.slug}
                      label={cat.title}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </section>

                {/* Trending Section */}
                <section className="p-4 bg-gray-50 dark:bg-neutral-800">
                  <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-red-600 mb-4">
                    <TrendingUp className="w-5 h-5" /> Trending Now
                  </h3>
                  <ol className="space-y-3">
                    {trending.slice(0, 6).map((post, i) => (
                      <li key={post.slug} className="flex gap-3 group">
                        <span className="font-black text-xl text-red-600 w-6 flex-shrink-0">{i + 1}</span>
                        <Link
                          href={`/post/${post.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm font-semibold line-clamp-2 hover:text-red-600 transition flex-1 min-w-0"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Quick Links */}
                <section className="p-4">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-3">Quick Links</h3>
                  <div className="space-y-2 text-sm">
                    <Link href="/about" className="block py-2 hover:text-red-600 font-medium">About Us</Link>
                    <Link href="/contact" className="block py-2 hover:text-red-600 font-medium">Contact</Link>
                    <Link href="/privacy-policy" className="block py-2 hover:text-red-600 font-medium">Privacy Policy</Link>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Articles
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay - Fox Style */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-2xl">
                <h2 className="text-2xl font-black mb-4 text-red-600">Search TechPolitics</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search AI, China, Africa, Politics..."
                    className="h-12 text-base border-2 border-gray-300 focus:border-red-600"
                    autoFocus
                  />
                  <Button className="bg-red-600 hover:bg-red-700 px-6 h-12 font-bold">
                    Search
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase mb-2">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['AI Ethics', '6G Africa', 'Quantum Computing', 'Tech Policy'].map((term) => (
                      <button
                        key={term}
                        className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 rounded text-xs font-medium hover:bg-red-600 hover:text-white transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="absolute top-5 right-5 p-2 text-white hover:bg-white/10 rounded-full transition"
                onClick={() => setSearchOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <main className="bg-gray-50 dark:bg-neutral-950 min-h-screen pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:block w-64 space-y-4 flex-shrink-0">
              {/* Categories */}
              <div className="bg-white dark:bg-neutral-900 border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-3">
                  <h3 className="font-black text-sm uppercase tracking-wide">Categories</h3>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-neutral-800">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={cat.slug}
                        className="block px-4 py-3 hover:bg-red-50 dark:hover:bg-neutral-800 transition font-medium text-sm group"
                      >
                        <span className="flex items-center justify-between">
                          {cat.title}
                          <ChevronRight className="w-4 h-4 text-red-600 opacity-0 group-hover:opacity-100 transition" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trending */}
              <div className="bg-white dark:bg-neutral-900 border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-3">
                  <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Most Read
                  </h3>
                </div>
                <ol className="divide-y divide-gray-200 dark:divide-neutral-800">
                  {trending.map((post, i) => (
                    <li key={post.slug} className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                      <div className="flex gap-3">
                        <span className="font-black text-2xl text-red-600 leading-none flex-shrink-0">{i + 1}</span>
                        <Link
                          href={`/post/${post.slug}`}
                          className="text-sm font-bold hover:text-red-600 line-clamp-3 flex-1 leading-tight min-w-0"
                        >
                          {post.title}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>

      {/* Footer - Fox Style */}
      <footer className="bg-neutral-900 text-white border-t-4 border-red-600">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/favicon.ico"
                  alt="TechPolitics"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="text-xl font-black">TechPolitics</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Fair & Balanced</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                The world's #1 source on tech geopolitics.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date().toLocaleTimeString('en-NG', {
                    timeZone: 'Africa/Lagos',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}{' '}
                  WAT • Nigeria
                </span>
              </div>
            </div>

            {/* Sections */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wide mb-3 text-red-600">Sections</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat._id}>
                    <Link href={cat.slug} className="hover:text-red-500 transition">
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wide mb-3 text-red-600">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-red-500 transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-red-500 transition">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-red-500 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-red-500 transition">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Follow */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wide mb-3 text-red-600">Follow Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="https://twitter.com/TechPolitics" className="hover:text-red-500 transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://linkedin.com/company/techpolitics" className="hover:text-red-500 transition">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="https://facebook.com/techpolitics" className="hover:text-red-500 transition">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <p>© 2025 TechPolitics. All rights reserved.</p>
              <p className="flex items-center gap-1">
                Made with <span className="text-red-600">❤</span> in Nigeria
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Desktop Nav Link Component
function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-3 text-sm font-bold uppercase tracking-wider transition border-b-4 hover:border-red-600 hover:text-red-600',
        active ? 'border-red-600 text-red-600' : 'border-transparent'
      )}
    >
      {label}
    </Link>
  );
}

// Mobile Bottom Nav Item
function NavItem({
  href,
  onClick,
  icon,
  label,
  active,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  const baseClass = cn(
    'flex flex-col items-center justify-center gap-1 text-xs font-bold transition',
    active ? 'text-red-600' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
  );
  
  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {icon}
        <span>{label}</span>
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={baseClass}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Mobile Menu Link Component
function MenuLink({ 
  href, 
  label, 
  onClick 
}: { 
  href: string; 
  label: string; 
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-4 font-bold hover:bg-red-50 dark:hover:bg-neutral-800 transition border-b border-gray-100 dark:border-neutral-800"
    >
      <span>{label}</span>
      <ChevronRight className="w-5 h-5 text-red-600" />
    </Link>
  );
}