'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ChevronRight,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTheme } from 'next-themes';

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
  headlines: string[];
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

// Memoized Ticker Item
const TickerItem = memo(({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-3 sm:px-4">{children}</span>
));
TickerItem.displayName = 'TickerItem';

export default function ClientLayout({
  children,
  categories,
  trending,
  headlines = [],
}: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ticker, setTicker] = useState('');
  const [ngnUsd, setNgnUsd] = useState('1 USD = 1,650 NGN');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Mount effect
  useEffect(() => setMounted(true), []);

  // Close overlays on route change
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcuts
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    setSearchOpen(true);
  });
  useHotkeys('escape', () => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  });

  /* ──────── Headline Ticker ──────── */
  useEffect(() => {
    const updateTicker = () => {
      const time = new Date().toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      if (!headlines.length) {
        setTicker(`${time} WAT — Breaking tech news`);
        return;
      }

      const index = Math.floor(Date.now() / 10000) % headlines.length;
      setTicker(`${time} WAT — ${headlines[index]}`);
    };

    updateTicker();
    const id = setInterval(updateTicker, 10000);
    return () => clearInterval(id);
  }, [headlines]);

  /* ──────── NGN/USD Rate (Cached) ──────── */
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const cached = localStorage.getItem('ngn-usd-rate');
        const cachedTime = localStorage.getItem('ngn-usd-time');
        const now = Date.now();

        if (cached && cachedTime && now - Number(cachedTime) < 300_000) {
          setNgnUsd(cached);
          return;
        }

        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
          next: { revalidate: 300 },
        });
        const data = await res.json();
        const rate = data.rates.NGN?.toFixed(0) ?? '1,650';
        const value = `1 USD = ${rate} NGN`;

        localStorage.setItem('ngn-usd-rate', value);
        localStorage.setItem('ngn-usd-time', now.toString());
        setNgnUsd(value);
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

  const handleInstall = useCallback(() => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
  }, [deferredPrompt]);

  // Memoized nav items
  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      ...categories.map((cat) => ({ label: cat.title, href: cat.slug })),
    ],
    [categories]
  );

  const marqueeAnimation = {
    x: [1000, -1000],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 30,
        ease: 'linear',
      },
    },
  };

  return (
    <>
      {/* SEO & Meta */}
      <meta name="theme-color" content="#dc2626" />
      <link rel="manifest" href="/manifest.json" />

      {/* Ticker Bar */}
      <div className="bg-red-600 text-white text-xs font-bold py-1.5 overflow-hidden relative">
        <motion.div
          className="inline-block whitespace-nowrap"
          animate={!prefersReducedMotion ? marqueeAnimation : {}}
          style={{ display: 'inline-block' }}
          onTapStart={(e) => e.currentTarget.style.animationPlayState = 'paused'}
          onTapEnd={(e) => e.currentTarget.style.animationPlayState = 'running'}
        >
          <TickerItem>
            <Link href="/live" className="hover:underline inline-flex items-center gap-1">
              <Globe className="w-3 h-3 animate-pulse" />
              LIVE: {ticker}
            </Link>
          </TickerItem>
          <TickerItem>•</TickerItem>
          <TickerItem>
            <span className="inline-flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {ngnUsd}
            </span>
          </TickerItem>
          {deferredPrompt && (
            <>
              <TickerItem>•</TickerItem>
              <TickerItem>
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center gap-1 hover:underline transition"
                  aria-label="Install TechPolitics App"
                >
                  <Download className="w-3 h-3" /> Install App
                </button>
              </TickerItem>
            </>
          )}
        </motion.div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
              aria-label="TechPolitics Home"
            >
              TechPolitics
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-md',
                    pathname === item.href
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'hover:text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-800'
                  )}
                  prefetch={true}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="ml-2"
                aria-label="Open search (Cmd+K)"
              >
                <Search className="w-4 h-4" />
                <kbd className="hidden xl:inline ml-2 text-xs">⌘K</kbd>
              </Button>
              {mounted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t border-gray-200 dark:border-neutral-800">
        <div className="flex justify-around items-center h-16">
          {[
            { icon: Home, label: 'Home', href: '/' },
            { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
            { icon: Flame, label: 'Trending', href: '/category/trending' },
            { icon: Grid, label: 'Categories', action: () => setMobileMenuOpen(true) },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => ('href' in item ? router.push(item.href) : item.action?.())}
              className={cn(
                'flex flex-col items-center gap-0.5 text-xs font-medium transition-colors py-2 px-3 rounded-lg',
                pathname === item.href ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
              )}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between py-3 px-2 text-lg font-medium rounded-lg transition',
                      pathname === item.href
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                    )}
                  >
                    {item.label}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </nav>

              <div>
                <h3 className="flex items-center gap-2 font-bold text-red-600 text-sm uppercase tracking-wider mb-3">
                  <TrendingUp className="w-5 h-5" /> Trending Now
                </h3>
                <ol className="space-y-3">
                  {trending.slice(0, 5).map((post, i) => (
                    <motion.li
                      key={post.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3"
                    >
                      <span className="font-bold text-red-600 text-lg w-6">{i + 1}</span>
                      <Link
                        href={`/post/${post.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-sm hover:text-red-600 line-clamp-2 font-medium"
                      >
                        {post.title}
                      </Link>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.target as HTMLFormElement).search.value;
                  router.push(`/search?q=${encodeURIComponent(q)}`);
                  setSearchOpen(false);
                }}
                className="flex gap-3"
              >
                <Input
                  name="search"
                  placeholder="Search AI, China, Africa, Geopolitics..."
                  className="text-lg h-16 rounded-xl border-2 focus:border-red-600"
                  autoFocus
                  aria-label="Search"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-xl"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </form>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-500">
                <span className="font-medium">Try:</span>
                {['AI Ethics', 'Tech in Africa', 'China Chip Ban', 'Starlink Nigeria'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(s)}`);
                      setSearchOpen(false);
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>

            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 space-y-6">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-5">
              <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={cat.slug}
                      className="block py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-5">
              <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Trending
              </h3>
              <ol className="space-y-3 text-sm">
                {trending.slice(0, 6).map((post, i) => (
                  <li key={post.slug} className="flex gap-3">
                    <span className="font-bold text-red-600 w-6">{i + 1}</span>
                    <Link
                      href={`/post/${post.slug}`}
                      className="flex-1 hover:text-red-600 line-clamp-2 font-medium transition"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Page Content */}
          <article className="flex-1">{children}</article>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white mt-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-2xl font-black text-red-600 mb-3 inline-block">
                TechPolitics
              </Link>
              <p className="text-sm text-gray-400">
                The world’s #1 source on tech geopolitics.
              </p>
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {mounted &&
                  new Date().toLocaleTimeString('en-NG', {
                    timeZone: 'Africa/Lagos',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}{' '}
                WAT
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Sections</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(0, 3).map((cat) => (
                  <li key={cat._id}>
                    <Link href={cat.slug} className="hover:text-red-500 transition">
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-red-500">About</Link></li>
                <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-red-500">Privacy</Link></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Follow</h4>
              <div className="flex gap-4 text-sm">
                <Link href="https://twitter.com/TechPolitics" className="hover:text-red-500">
                  Twitter
                </Link>
                <Link href="https://linkedin.com/company/techpolitics" className="hover:text-red-500">
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-10 pt-8 border-t border-neutral-800">
            © {new Date().getFullYear()} TechPolitics. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}