import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Component() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMTExMTEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMjIyMjIyIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+')] opacity-20" />

      <div className="relative container mx-auto px-4 pt-20 pb-32">
        {/* Top pill button */}
        <div className="flex justify-center mb-16">
          <Link
            href="#"
            className="group inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm transition-colors hover:bg-white/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Manage Calls Smarter
            <span className="ml-2 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* Main heading */}
        <div className="text-center mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            Voice Calls
            <br />
            with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
              Precision
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
            Effortlessly streamline your AI call management with Mistral Call.
            <br />
            analyze, track, and organize all your calls in one place.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-20">
          <Link
            href="#"
            className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-black transition-all hover:bg-gray-200 hover:scale-105"
          >
            Start creating for free
            <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto max-w-6xl">
          {/* Glow effects */}
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-purple-500/30 rounded-full blur-3xl" />

          {/* Dashboard Image with Shadow Effects */}
          <div className="relative">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-10" />

            {/* Main shadow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-2xl opacity-75" />

            {/* Inner shadow for depth */}
            <div className="absolute inset-0 bg-black/50 rounded-xl blur-sm" />

            {/* Dashboard image */}
            <Image
              src="/dashboard.png?height=600&width=1200"
              width={1200}
              height={600}
              alt="Dashboard Preview"
              className="relative rounded-xl border border-gray-800/50 z-10 "
            />

            {/* Reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
