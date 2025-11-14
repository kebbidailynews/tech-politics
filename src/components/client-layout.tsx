'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  headlines?: string[]; // Optional custom headlines
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
  const [ticker, setTicker] = useState('');
  const [currentSlug, setCurrentSlug] = useState('/live');
  const [ngnUsd, setNgnUsd] = useState('1 USD = 1,650 NGN');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();

  // Close modals on route change
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  /* ──────── Headline Ticker: Uses Real Articles ──────── */
  const tickerItems = useMemo(() => {
    if (headlines.length > 0) {
      return headlines.map((title) => ({ title, slug: '/live' }));
    }
    if (trending.length > 0) {
      return trending.map((post) => ({
        title: post.title,
        slug: `/post/${post.slug}`,
      }));
    }
    return [{ title: 'Breaking tech news', slug: '/live' }];
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
      const item = tickerItems[i];

      setTicker(`${wat} WAT — ${item.title}`);
      setCurrentSlug(item.slug);
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
      {/* Ticker: Touch-pausable, shows real article titles */}
      <div
        className="bg-red-600 text-white text-xs font-bold py-1.5 overflow-hidden whitespace-nowrap"
        onTouchStart={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onTouchEnd={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        <div className="inline-block animate-marquee-mobile">
          <Link href={currentSlug} className="inline-block px-3 hover:underline">
            LIVE: {ticker}
          </Link>
          <span className="inline-block px-3">•</span>
          <span className="inline-flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {ngnUsd}
          </span>
          {deferredPrompt && (
            <>
              <span className="inline-block px-3">•</span>
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Download className="w-3 h-3" /> Install
              </button>
            </>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 pt-safe">
        <div className="flex items-center justify-between h-14 px-4">
          <Link
            href="/"
            className="text-xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
          >
            TechPolitics
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Nav - Hidden on mobile */}
      <nav className="hidden lg:block overflow-x-auto whitespace-nowrap px-4 py-2 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center space-x-1">
          {[
            { label: 'Home', href: '/' },
            ...categories.map((cat) => ({ label: cat.title, href: cat.slug })),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 text-sm font-bold uppercase tracking-wider transition flex-shrink-0',
                pathname === item.href ? 'text-red-600' : 'hover:text-red-600'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="flex-shrink-0"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 flex justify-around items-center h-16 shadow-lg pb-safe">
        <NavItem href="/" icon={<Home className="w-5 h-5" />} label="Home" />
        <NavItem onClick={() => setSearchOpen(true)} icon={<Search className="w-5 h-5" />} label="Search" />
        <NavItem href="/category/trending" icon={<Flame className="w-5 h-5" />} label="Trending" />
        <NavItem onClick={() => setMobileMenuOpen(true)} icon={<Grid className="w-5 h-5" />} label="Menu" />
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-bold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <section className="mb-6">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-base font-medium hover:text-red-600 border-b border-gray-100 dark:border-neutral-800"
                >
                  Home
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={cat.slug}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-base font-medium hover:text-red-600 border-b border-gray-100 dark:border-neutral-800"
                  >
                    {cat.title}
                  </Link>
                ))}
              </section>
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-600 mb-3">
                  <TrendingUp className="w-4 h-4" /> Trending
                </h3>
                <ol className="space-y-2 text-sm">
                  {trending.slice(0, 6).map((post, i) => (
                    <li key={post.slug} className="flex gap-2">
                      <span className="font-bold text-red-600 w-5">{i + 1}</span>
                      <Link
                        href={`/post/${post.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="line-clamp-2 hover:text-red-600 flex-1"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center p-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Search AI, China, Africa..."
                  className="h-12 text-base"
                  autoFocus
                />
                <Button className="bg-red-600 hover:bg-red-700 px-5">Go</Button>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Try: <span className="underline">AI Ethics</span> • <span className="underline">6G Africa</span> • <span className="underline">Quantum</span>
              </p>
            </motion.div>
            <button
              className="absolute top-5 right-5 p-2"
              onClick={() => setSearchOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pb-20 pt-4 px-4 mx-auto max-w-2xl lg:pb-8 lg:pt-8 lg:max-w-none">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="lg:w-64 space-y-6 order-2 lg:order-1 hidden lg:block">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
              <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-3">
                Categories
              </h3>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link href={cat.slug} className="block hover:text-red-600 transition">
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
              <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Trending
              </h3>
              <ol className="space-y-2 text-sm">
                {trending.map((post, i) => (
                  <li key={post.slug} className="flex gap-2">
                    <span className="font-bold text-red-600 w-5">{i + 1}</span>
                    <Link href={`/post/${post.slug}`} className="hover:text-red-600 line-clamp-2 flex-1">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
          <div className="flex-1 order-1 lg:order-2">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8 mt-12">
        {/* Mobile Footer */}
        <div className="px-4 text-center text-xs space-y-2 lg:hidden">
          <Link href="/" className="text-lg font-black text-red-600 block">TechPolitics</Link>
          <p className="text-gray-400">The world’s #1 source on tech geopolitics.</p>
          <p className="text-gray-500">© 2025 TechPolitics. All rights reserved.</p>
        </div>
        {/* Desktop Footer */}
        <div className="hidden lg:block max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-black text-red-600 mb-3 inline-block">
              TechPolitics
            </Link>
            <p className="text-sm text-gray-400">The world’s #1 source on tech geopolitics.</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString('en-NG', {
                timeZone: 'Africa/Lagos',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}{' '}
              WAT • Nigeria
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Sections</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              {categories.slice(0, 3).map((cat) => (
                <li key={cat._id}>
                  <Link href={cat.slug} className="hover:text-red-500">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-red-500">About</Link></li>
              <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-red-500">Privacy</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold mb-3">Follow</h4>
            <div className="flex gap-3 text-sm">
              <Link href="https://twitter.com/TechPolitics" className="hover:text-red-500">
                Twitter
              </Link>
              <Link href="https://linkedin.com/company/techpolitics" className="hover:text-red-500">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block text-center text-xs text-gray-500 mt-6 border-t border-neutral-800 pt-4">
          © 2025 TechPolitics. All rights reserved.
        </div>
      </footer>
    </>
  );
}

// Reusable Bottom Nav Item
function NavItem({
  href,
  onClick,
  icon,
  label,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const baseClass = "flex flex-col items-center gap-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 min-h-14 justify-center flex-1";
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