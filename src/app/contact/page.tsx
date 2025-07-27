"use client";

import { useForm, ValidationError } from "@formspree/react";

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mdkdgrvd"); // ✅ your Formspree form ID

  if (state.succeeded) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg mb-6 text-green-700 font-medium">
          ✅ Thanks for reaching out! We’ll get back to you shortly.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-6">
        Have questions, feedback, or partnership ideas? We’d love to hear from you.
        You can reach us directly at{" "}
        <a
          href="mailto:support@thetechpolitics.com"
          className="text-blue-600 hover:underline font-medium"
        >
          support@thetechpolitics.com
        </a>{" "}
        or use the form below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Your full name"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="text-red-600 text-sm mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Type your message..."
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-600 text-sm mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {state.submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </main>
  );
}
