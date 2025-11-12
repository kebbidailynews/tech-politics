'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  X,
  Menu,
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
  const pathname = usePathname();

  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  /* ──────── Headline Ticker ──────── */
  useEffect(() => {
    const update = () => {
      const wat = new Date().toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      if (!headlines || headlines.length === 0) {
        setTicker(`${wat} WAT — Breaking tech news`);
        return;
      }
      const i = Math.floor(Date.now() / 10000) % headlines.length;
      const headline = headlines[i] ?? 'Breaking tech news';
      setTicker(`${wat} WAT — ${headline}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [headlines]);

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
      {/* Ticker */}
      <div className="bg-red-600 text-white text-xs font-bold py-1.5 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
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
              >
                <Download className="w-3 h-3" /> Install App
              </button>
            </>
          )}
        </div>
      </div>

      {/* ──────── Header ──────── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo + Mobile Buttons (Stacked on Mobile) */}
          <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent py-3 lg:py-0"
            >
              TechPolitics
            </Link>

            {/* Mobile: Buttons Below Logo */}
            <div className="flex gap-3 pb-3 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="p-3"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="p-3"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
              {[
                { label: 'Home', href: '/' },
                ...categories.map((cat) => ({
                  label: cat.title,
                  href: cat.slug,
                })),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-bold uppercase tracking-wider transition',
                    pathname === item.href ? 'text-red-600' : 'hover:text-red-600'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                <Search className="w-4 h-4" />
              </Button>
            </nav>
          </div>
        </div>

        {/* Mobile Menu Overlay — Clean, Vertical, Full-Width */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white dark:bg-neutral-900 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 space-y-1">
                <Link
                  href="/"
                  className="block w-full text-left py-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={cat.slug}
                    className="block w-full text-left py-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* Search Overlay */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xl">
              <div className="flex gap-2">
                <Input
                  placeholder="Search AI, China, Africa..."
                  className="text-lg h-14 flex-1"
                  autoFocus
                />
                <Button size="lg" className="bg-red-600 hover:bg-red-700 px-6">
                  Search
                </Button>
              </div>
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6 order-2 lg:order-1">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 sm:p-5">
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
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 sm:p-5">
              <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Trending
              </h3>
              <ol className="space-y-2 text-sm">
                {trending.map((post, i) => (
                  <li key={post.slug} className="flex gap-2">
                    <span className="font-bold text-red-600 w-5">{i + 1}</span>
                    <Link
                      href={`/post/${post.slug}`}
                      className="hover:text-red-600 line-clamp-2 flex-1"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
          <main className="flex-1 order-1 lg:order-2">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 mt-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-black text-red-600 mb-3 inline-block">
              TechPolitics
            </Link>
            <p className="text-sm text-gray-400">
              The world’s #1 source on tech geopolitics.
            </p>
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
          <div>
            <h4 className="font-bold mb-3">Follow</h4>
            <div className="flex flex-col sm:flex-row gap-3 text-sm">
              <Link href="https://twitter.com/TechPolitics" className="hover:text-red-500">
                Twitter
              </Link>
              <Link href="https://linkedin.com/company/techpolitics" className="hover:text-red-500">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8 border-t border-neutral-800 pt-6">
          © 2025 TechPolitics. All rights reserved.
        </div>
      </footer>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </>
  );
}