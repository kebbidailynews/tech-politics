'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  ChevronDown,
  ChevronUp,
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

// PWA install prompt type
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [trendOpen, setTrendOpen] = useState(false);

  const [ticker, setTicker] = useState('');
  const [ngnUsd, setNgnUsd] = useState('1 USD = 1,650 NGN');
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();

  // close drawers on route change
  useEffect(() => {
    setSidebarOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* ---------- Ticker ---------- */
  useEffect(() => {
    if (!headlines?.length) {
      const update = () => {
        const wat = new Date().toLocaleTimeString('en-NG', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setTicker(`${wat} WAT — Breaking tech news`);
      };
      update();
      const id = setInterval(update, 10000);
      return () => clearInterval(id);
    }

    let i = 0;
    const update = () => {
      const wat = new Date().toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const headline = headlines[i] ?? 'Breaking tech news';
      setTicker(`${wat} WAT — ${headline}`);
      i = (i + 1) % headlines.length;
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [headlines]);

  /* ---------- USD/NGN ---------- */
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

  /* ---------- PWA install ---------- */
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () =>
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
  };

  return (
    <>
      {/* Ticker */}
      <div className="bg-red-600 text-white text-xs font-bold py-1.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <Link href="/live" className="inline-block px-4 hover:underline">
            LIVE: {ticker}
          </Link>
          <span className="inline-block px-4">•</span>
          <span className="inline-flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {ngnUsd}
          </span>
          {deferredPrompt && (
            <>
              <span className="inline-block px-4">•</span>
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

      {/* Header – always visible */}
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Site title */}
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
            >
              TechPolitics
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { label: 'Home', href: '/' },
                ...categories.map((c) => ({ label: c.title, href: c.slug })),
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
              <div className="flex gap-3">
                <Input
                  placeholder="Search AI, China, Africa..."
                  className="text-lg h-14"
                  autoFocus
                />
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Search
                </Button>
              </div>
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </header>

      {/* Mobile drawer – collapsible sections */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <span className="text-xl font-bold text-red-600">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-5 space-y-4">
              {/* Pages */}
              <div>
                <button
                  onClick={() => setPagesOpen(!pagesOpen)}
                  className="flex w-full items-center justify-between font-bold text-sm uppercase text-gray-600 dark:text-gray-400 mb-2"
                >
                  Pages
                  {pagesOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {pagesOpen && (
                  <div className="space-y-1">
                    {[
                      { label: 'About Us', href: '/about' },
                      { label: 'Blog/News', href: '/blog' },
                      { label: 'Contact', href: '/contact' },
                      { label: 'Privacy Policy', href: '/privacy-policy' },
                    ].map((i) => (
                      <Link
                        key={i.href}
                        href={i.href}
                        className="block py-1.5 text-lg font-medium hover:text-red-600"
                        onClick={() => setSidebarOpen(false)}
                      >
                        {i.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div>
                <button
                  onClick={() => setCatsOpen(!catsOpen)}
                  className="flex w-full items-center justify-between font-bold text-sm uppercase text-gray-600 dark:text-gray-400 mb-2"
                >
                  Categories
                  {catsOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {catsOpen && (
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={cat.slug}
                        className="block py-1.5 text-lg font-medium hover:text-red-600"
                        onClick={() => setSidebarOpen(false)}
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Trending */}
              <div>
                <button
                  onClick={() => setTrendOpen(!trendOpen)}
                  className="flex w-full items-center justify-between font-bold text-sm uppercase text-gray-600 dark:text-gray-400 mb-2"
                >
                  Trending
                  {trendOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {trendOpen && (
                  <ol className="space-y-2 text-sm">
                    {trending.map((post, i) => (
                      <li key={post.slug} className="flex gap-2">
                        <span className="font-bold text-red-600">{i + 1}</span>
                        <Link
                          href={`/post/${post.slug}`}
                          className="hover:text-red-600 line-clamp-2"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Main content – desktop sidebar hidden on mobile */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Desktop-only sidebar */}
        <aside className="hidden lg:block lg:w-64 space-y-6">
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
            <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link href={cat.slug} className="block text-sm hover:text-red-600">
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
                  <span className="font-bold text-red-600">{i + 1}</span>
                  <Link
                    href={`/post/${post.slug}`}
                    className="hover:text-red-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* Page body */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link
              href="/"
              className="text-2xl font-black text-red-600 mb-3 inline-block"
            >
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
              <li>
                <Link href="/about" className="hover:text-red-500">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-red-500">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Follow</h4>
            <div className="flex gap-4 text-sm">
              <Link href="https://twitter.com/TechPolitics" className="hover:text-red-500">
                Twitter
              </Link>
              <Link
                href="https://linkedin.com/company/techpolitics"
                className="hover:text-red-500"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-8 border-t border-neutral-800 pt-6">
          © 2025 TechPolitics. All rights reserved.
        </div>
      </footer>

      {/* Marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </>
  );
}