import Image from "next/image";
import Link from "next/link";
import Documentation from "@/app/dashboard/components/Documentation";

export const metadata = {
  title: "PropelSense — User Guide",
  description:
    "User guide and documentation for the PropelSense ship propulsion intelligence platform.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="PropelSense"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-white">PropelSense</span>
            <span className="text-zinc-600 text-sm hidden sm:inline">
              / User Guide
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm bg-white text-zinc-900 font-medium px-4 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Page header ── */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-xs text-zinc-600 mb-3">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-400">User Guide</span>
          </div>
          <h1 className="text-3xl font-bold text-white">User Guide</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Everything you need to get up and running with PropelSense.
          </p>
        </div>
      </div>

      {/* ── Documentation content ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Documentation />
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/60 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded overflow-hidden">
              <Image
                src="/logo.png"
                alt="PropelSense"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-zinc-500">PropelSense</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Home
            </Link>
            <Link
              href="/login"
              className="hover:text-zinc-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="hover:text-zinc-400 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
