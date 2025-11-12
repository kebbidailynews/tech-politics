'use client';

import { useState, useEffect, useRef } from 'react';
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
  Layers,
  Bell,
  List,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
  const [ngnUsd, setNgnUsd] = useState('1 USD = 1,650 NGN');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Close overlays on route change
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  /* ──────── Headline Ticker (throttled) ──────── */
  useEffect(() => {
    let i = 0;
    const update = () => {
      const now = new Date().toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const headline = headlines.length ? headlines[i % headlines.length] : 'Breaking tech news';
      setTicker(`${now} WAT — ${headline}`);
      i += 1;
    };
    update();
    const id = setInterval(update, 9000);
    return () => clearInterval(id);
  }, [headlines]);

  /* ──────── NGN/USD Rate (lazy load once visible) ──────── */
  useEffect(() => {
    let mounted = true;
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (!mounted) return;
        const rate = data.rates?.NGN ? Number(data.rates.NGN).toFixed(0) : '1,650';
        setNgnUsd(`1 USD = ${rate} NGN`);
      } catch {
        if (!mounted) return;
        setNgnUsd('1 USD = 1,650 NGN');
      }
    };
    // only fetch once after first paint to avoid blocking
    const id = setTimeout(fetchRate, 1200);
    return () => {
      mounted = false;
      clearTimeout(id);
    };
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

  /* ──────── Smart search suggestions (client-only lightweight) ──────── */
  useEffect(() => {
    if (!query) return setSuggestions([]);
    // derive suggestions from categories + headlines + trending (local heuristic)
    const q = query.toLowerCase();
    const fromCats = categories
      .map((c) => c.title)
      .filter((t) => t.toLowerCase().includes(q))
      .slice(0, 4);
    const fromHead = headlines.filter((h) => h.toLowerCase().includes(q)).slice(0, 4);
    const fromTrend = trending.map((t) => t.title).filter((t) => t.toLowerCase().includes(q)).slice(0, 4);
    const uniq = Array.from(new Set([...fromCats, ...fromHead, ...fromTrend]));
    setSuggestions(uniq.slice(0, 6));
  }, [query, categories, headlines, trending]);

  // Accessibility: trap focus for mobile menu (simple)
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Ticker */}
      <div className="bg-red-600 text-white text-xs font-bold py-1.5 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee" aria-live="polite">
          <Link href="/live" className="inline-block px-3 sm:px-4 hover:underline">
            LIVE: {ticker}
          </Link>
          <span className="inline-block px-3 sm:px-4">•</span>
          <span className="inline-flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {ngnUsd}
          </span>
          {deferredPrompt && (
            <>
              <span className="inline-block px-3 sm:px-4">•</span>
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1 hover:underline"
                aria-label="Install app"
              >
                <Download className="w-3 h-3" /> Install App
              </button>
            </>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3"
              aria-label="TechPolitics home"
            >
              <span className="sr-only">TechPolitics</span>
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-500 to-yellow-400 flex items-center justify-center text-white shadow-sm">
                TP
              </div>
              <span className="hidden sm:inline-block">TechPolitics</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
              {[
                { label: 'Home', href: '/' },
                ...categories.map((cat) => ({ label: cat.title, href: cat.slug })),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-semibold uppercase tracking-wide transition rounded-md',
                    pathname === item.href ? 'text-red-600' : 'hover:text-red-600 hover:bg-red-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} aria-label="Open search">
                <Search className="w-4 h-4" />
              </Button>
            </nav>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="p-2" aria-label="Search">
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="p-2"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden fixed inset-x-0 top-16 z-40 transition-transform duration-300 ease-in-out',
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          )}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 shadow-md p-4 pb-20 h-[calc(100vh-4rem)] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-red-600" />
                <span className="font-semibold">Browse</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </div>
              </Link>

              <Link href="/sections" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  <span className="font-medium">Sections</span>
                </div>
              </Link>
            </div>

            {/* Collapsible categories */}
            <details className="mb-4 rounded-lg bg-gray-50 dark:bg-neutral-800 p-3" open>
              <summary className="font-semibold cursor-pointer mb-2 list-none">Categories</summary>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={cat.slug}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2 rounded hover:bg-white dark:hover:bg-neutral-700"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            {/* Trending */}
            <div className="mb-4">
              <h4 className="flex items-center gap-2 font-semibold mb-2">
                <TrendingUp className="w-4 h-4" /> Trending
              </h4>
              <ol className="space-y-2 text-sm">
                {trending.map((t, i) => (
                  <li key={t.slug} className="flex items-start gap-2">
                    <span className="font-bold text-red-600 w-5">{i + 1}</span>
                    <Link href={`/post/${t.slug}`} onClick={() => setMobileMenuOpen(false)} className="line-clamp-2">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">{ngnUsd}</div>
                {deferredPrompt && (
                  <Button size="sm" onClick={handleInstall}>
                    <Download className="w-4 h-4 mr-2" /> Install
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search modal / sheet (mobile-first) */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center lg:items-center p-4 lg:p-0">
            <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-lg shadow-xl p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label htmlFor="mobile-search" className="sr-only">Search</label>
                  <Input
                    id="mobile-search"
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search AI, China, Africa..."
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>
                <Button onClick={() => { /* perform navigation to /search?q=... */ }} className="px-4 h-12">Search</Button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => {
                          setQuery(s);
                          setSuggestions([]);
                          // ideally navigate to search page
                        }}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setSearchOpen(false)}
                className="absolute top-3 right-3 p-2"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 order-1 lg:order-2">{children}</main>

          <aside className="lg:w-64 order-2 lg:order-1 space-y-6">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-3">Categories</h3>
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

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
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
        </div>
      </div>

      {/* Mobile bottom nav (comfortable touch targets) */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 lg:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur rounded-full shadow-lg px-3 py-2 flex items-center gap-2">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
          <Home className="w-5 h-5" />
        </Link>
        <Link href="/sections" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
          <List className="w-5 h-5" />
        </Link>
        <Button variant="ghost" onClick={() => setSearchOpen(true)} className="p-2">
          <Search className="w-5 h-5" />
        </Button>
        <Link href="/notifications" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
          <Bell className="w-5 h-5" />
        </Link>
      </nav>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 mt-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-black text-red-600 mb-3 inline-block">TechPolitics</Link>
            <p className="text-sm text-gray-400">The world’s #1 source on tech geopolitics.</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', hour12: true })} WAT • Nigeria
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Sections</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              {categories.slice(0, 3).map((cat) => (
                <li key={cat._id}><Link href={cat.slug} className="hover:text-red-500">{cat.title}</Link></li>
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

          <div>
            <h4 className="font-bold mb-3">Follow</h4>
            <div className="flex flex-col sm:flex-row gap-3 text-sm">
              <Link href="https://twitter.com/TechPolitics" className="hover:text-red-500">Twitter</Link>
              <Link href="https://linkedin.com/company/techpolitics" className="hover:text-red-500">LinkedIn</Link>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8 border-t border-neutral-800 pt-6">© 2025 TechPolitics. All rights reserved.</div>
      </footer>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(100%);} 100% { transform: translateX(-100%);} }
        .animate-marquee { animation: marquee 28s linear infinite; }
      `}</style>
    </>
  );
}
