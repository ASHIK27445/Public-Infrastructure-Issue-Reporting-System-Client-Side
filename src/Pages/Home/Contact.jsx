import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import LiquidChrome from "./LiquidChrome";

const Contact = () => {
  const [showLiquid, setShowLiquid] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (e) => {
      setShowLiquid(e.matches);
    };

    // Initial check
    setShowLiquid(mediaQuery.matches);

    // Listen for screen size changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-zinc-900 via-[#141414] to-zinc-950 pt-15 pb-18 md:pt-32 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="relative h-100 md:h-125 lg:h-150 overflow-hidden rounded-2xl">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            {showLiquid ? (
              <LiquidChrome
                baseColor={[0.08, 0.08, 0.08]}
                speed={0.9}
                amplitude={0.45}
                interactive={true}
              />
            ) : (
              <div className="h-full w-full bg-zinc-950" />
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 z-1 bg-black/45" />

          {/* Glass Card */}
          <div className="absolute left-5 top-5 sm:left-10 sm:top-10 md:left-16 md:top-16 lg:left-20 lg:top-20 z-10 w-[calc(100%-40px)] sm:w-95 md:w-107.5 lg:w-125 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8 lg:p-10">
            <h2 className="text-amber-100 text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Building Better
              <br />
              Communities Together.
            </h2>

            <p className="mt-5 text-sm md:text-base leading-7 text-white/75">
              CommunityFix empowers citizens to report local issues,
              participate in community events, and collaborate with local
              authorities to build cleaner, safer, and smarter neighborhoods.
            </p>

            <a
              href="/allissues"
              className="mt-8 inline-flex items-center gap-2 border-b border-amber-100 pb-1 text-sm md:text-base font-semibold text-amber-100 transition hover:border-white hover:opacity-90"
            >
              Explore Community
              <ArrowRight size={16} strokeWidth={2.4} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-zinc-800 py-10">
          {/* Column 1 */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Our Community
            </p>

            <p className="text-[14px] leading-6 text-zinc-400">
              Connecting citizens, volunteers, and local authorities to solve
              everyday community challenges and create positive local impact.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Resources
            </p>

            <a
              href="/events"
              className="inline-flex items-center gap-2 text-[14px] text-emerald-400 transition hover:opacity-80"
            >
              Explore Events
            </a>
          </div>

          {/* Column 3 */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Get in Touch
            </p>

            <a
              href="mailto:support@communityfix.com"
              className="text-[14px] text-emerald-400 transition hover:underline hover:opacity-80"
            >
              support@communityfix.com
            </a>

            <p className="mt-3 text-sm text-zinc-500">
              We'd love to hear your ideas, feedback, and suggestions to make
              our communities even better.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;