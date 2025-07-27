import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: July 2025</p>

      <p className="mb-4 text-lg leading-relaxed">
        At <strong>TechPolitics</strong>, your privacy is important to us. This policy explains
        what personal data we collect, how we use it, and the choices you have regarding your
        information.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
      <p className="mb-4 text-lg leading-relaxed">
        We may collect personal information such as your name and email address when you
        subscribe to our newsletter, fill out a contact form, or otherwise interact with our site.
        We also collect non‑personal information, such as browser type, device information, and
        analytics data, to help improve our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
      <p className="mb-4 text-lg leading-relaxed">
        We use collected information to:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6 text-lg leading-relaxed">
        <li>Send updates, newsletters, or responses to inquiries.</li>
        <li>Improve our website and content offerings.</li>
        <li>Monitor and analyze trends, usage, and activities.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Third‑Party Services</h2>
      <p className="mb-4 text-lg leading-relaxed">
        Our website may use cookies to enhance your browsing experience and gather anonymous
        analytics data. In addition, we use third‑party services such as Google AdSense to
        display advertisements. Google, as a third‑party vendor, uses cookies to serve ads
        based on your prior visits to this and other websites. You can opt out of
        personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Google Ads Settings
        </a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
      <p className="mb-4 text-lg leading-relaxed">
        You have the right to access, update, or delete your personal information at any time.
        You may also opt out of receiving communications from us by following the unsubscribe
        link in our emails or by contacting us directly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
      <p className="mb-4 text-lg leading-relaxed">
        If you have any questions about this Privacy Policy or our data practices, please
        reach out to us through our{" "}
        <Link href="/contact" className="text-blue-600 hover:underline">
          contact page
        </Link>{" "}
        or email us at{" "}
        <a
          href="mailto:support@thetechpolitics.com"
          className="text-blue-600 hover:underline"
        >
          support@thetechpolitics.com
        </a>.
      </p>
    </main>
  );
}
