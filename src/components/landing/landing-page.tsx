"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, Image, Sparkles } from "lucide-react";
import LandingNavbar from "@/components/landing/landing-navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Gradient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-red-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-purple-900/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section id="personalize" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight font-serif">
              Your Cinema.
              <br />
              Your Curation.
              <br />
              Your Story.
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-md">
              A bespoke digital museum for your personal film archive. Upload
              custom poster art, rate with timeless stars, and pen intimate
              journal entries for every masterpiece you experience. Build a
              private gallery that&apos;s 100% you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-6 text-lg">
                  Start Your Private Archive — It&apos;s Free.
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              Already a curator?{" "}
              <Link
                href="/auth/signin"
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Right - Movie Posters Grid */}
          <div className="relative hidden md:grid grid-cols-2 gap-4 z-10">
            {/* Placeholder movie cards - using gradient backgrounds */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`poster-${i}`}
                className="aspect-video rounded-lg bg-gradient-to-br from-red-900 via-orange-800 to-yellow-900 opacity-60 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Core Collection Section */}
      <section
        id="features"
        className="relative py-20 px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4 font-serif">
            The Core Collection
          </h2>

          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Three essential tools for the discerning cinephile
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Artful Uploads */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 rounded-lg border border-white/10 hover:border-amber-500/50 transition-colors">
                <div className="mb-4 inline-block p-3 rounded-lg bg-amber-600/20">
                  <Image className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Artful Uploads
                </h3>
                <p className="text-gray-400">
                  Curate your own visual library with high-quality, custom
                  poster art and alternative prints.
                </p>
              </div>
            </div>

            {/* Feature 2: Timeless Ratings */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 rounded-lg border border-white/10 hover:border-amber-500/50 transition-colors">
                <div className="mb-4 inline-block p-3 rounded-lg bg-amber-600/20">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Timeless Ratings
                </h3>
                <p className="text-gray-400">
                  Express your judgment using a refined 5-star rating system,
                  private to your unique taste.
                </p>
              </div>
            </div>

            {/* Feature 3: The Cinephile's Journal */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 rounded-lg border border-white/10 hover:border-amber-500/50 transition-colors">
                <div className="mb-4 inline-block p-3 rounded-lg bg-amber-600/20">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  The Cinephile&apos;s Journal
                </h3>
                <p className="text-gray-400">
                  Write detailed personal logs and journal entries under each
                  movie, capturing your feelings and contest for every viewing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inside the Vault - Product Showcase */}
      <section id="vault" className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16 font-serif">
            Inside the Vault
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Showcase mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-white/20 overflow-hidden bg-black/50 backdrop-blur p-6">
                <div className="space-y-4">
                  {/* Movie Card Preview */}
                  <div className="flex gap-4 bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <div className="w-24 h-32 rounded bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <h4 className="text-white font-semibold">Interstellar</h4>
                      <p className="text-sm text-gray-400">Ep. Uploaded</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={`star-${star}`} className="text-amber-400">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Journal Preview */}
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 space-y-2">
                    <h4 className="text-white font-semibold text-sm">
                      Description @ Journal
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      &#34;Watched again last night. Nolan&apos;s vision is
                      breathtaking. The soundtrack by Hans Zimmer is hypnotic,
                      especially in the fourth dimension.&#34;
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Log: Rainy Tuesday, solo watch. Full immersed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Benefits */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white font-serif">
                Every great collector needs a private archive.
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Don&apos;t let your favorite cinematic moments fade into the
                noise. Protect and curate your movie history. Your vault, your
                legacy.
              </p>

              <div className="space-y-4">
                {[
                  "Keep your taste private and personal",
                  "Track every viewing and discovery",
                  "Build a visual library you're proud of",
                  "Connect with other cinephiles",
                ].map((benefit, index) => (
                  <div key={`benefit-${index}`} className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>

              <Link href="/auth/signup">
                <Button className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-black font-bold py-6">
                  Create Your Account Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
            Ready to start curating?
          </h2>
          <p className="text-lg text-gray-300">
            Join thousands of cinephiles building their perfect movie
            collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/signup">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-6 px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="border-white/20 hover:border-white/40 text-white py-6 px-8"
              >
                Sign In to Your Vault
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8 z-10 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>&copy; 2024 My Movie Storage. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
