import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Zap,
  BarChart2,
  Users,
  ChevronDown,
  AlertCircle,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Wrench,
} from "lucide-react";

// ─── Utility: Count-up hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, suffix = "", label, started }) {
  const count = useCountUp(value, 2200, started);
  return (
    <div className="relative group flex flex-col items-center justify-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-[#00ffae]/40 hover:bg-white/8 transition-all duration-500">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,174,0.07) 0%, transparent 70%)" }} />
      <span className="text-5xl font-black tracking-tight" style={{ color: "#00ffae", fontFamily: "'Syne', sans-serif" }}>
        {count.toLocaleString()}{suffix}
      </span>
      <span className="mt-2 text-sm uppercase tracking-widest text-zinc-400 text-center">{label}</span>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
        hover:-translate-y-2 hover:border-[#00ffae]/30 hover:shadow-2xl transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, box-shadow 0.4s, border-color 0.4s`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,174,0.06) 0%, transparent 60%)" }} />
      <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl border border-[#00ffae]/30 bg-[#00ffae]/10 group-hover:bg-[#00ffae]/20 transition-colors duration-300">
        <Icon size={26} color="#00ffae" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

// ─── Step ─────────────────────────────────────────────────────────────────────
function StoryStep({ icon: Icon, step, title, description, isLast, delay, inView }) {
  return (
    <div className="relative flex gap-6 items-start"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}>
      <div className="relative flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#00ffae]/60 bg-[#00ffae]/10 z-10 shrink-0">
          <Icon size={20} color="#00ffae" strokeWidth={1.8} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-2 bg-gradient-to-b from-[#00ffae]/40 to-transparent min-h-[56px]" />}
      </div>
      <div className="pb-10">
        <div className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-[#00ffae]/10 text-[#00ffae] mb-2">{step}</div>
        <h4 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h4>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VideoScupping() {
  const [scrolled, setScrolled] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);
  const [storyRef, storyInView] = useInView(0.15);
  const [ctaRef, ctaInView] = useInView(0.3);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Google Fonts - updated with HeroBanner fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="bg-zinc-950 text-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-screen overflow-hidden flex items-center">
        {/* Video Background */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(0.9)" }}
        >
          <source src="/communityfix.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays - updated with HeroBanner style */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.4) 60%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.3) 30%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 50%, rgba(0,255,174,0.08) 0%, transparent 55%)" }} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            {/* Badge - HeroBanner style */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-8"
              style={{ animation: "fadeSlideUp 0.8s ease both" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00ffae" }} />
              <span className="text-xs font-semibold text-[#00ffae] tracking-wide uppercase">🏙️ Building Better Communities</span>
            </div>

            {/* Title - HeroBanner style with gradient */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animation: "fadeSlideUp 0.9s ease 0.1s both" }}
            >
              Transform Your
              <br />
              <span style={{
                background: "linear-gradient(90deg, #00ffae 0%, #00e5ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                City.
              </span>
            </h1>

            <p className="text-lg text-zinc-300 leading-relaxed mb-10 max-w-xl"
              style={{ animation: "fadeSlideUp 1s ease 0.2s both", fontWeight: 400 }}>
              Spot a pothole? Broken streetlight? Overflowing trash bin? Report local issues in seconds,
              track real-time progress, and hold authorities accountable.
            </p>

            {/* Buttons - HeroBanner style */}
            <div className="flex flex-wrap gap-4 items-center" style={{ animation: "fadeSlideUp 1s ease 0.35s both" }}>
              <button
                className="group flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100"
                style={{
                  background: "linear-gradient(90deg, #00ffae 0%, #00e5ff 100%)",
                  color: "#09090b",
                  boxShadow: "0 0 0 0 rgba(0,255,174,0.4)",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,174,0.35)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,255,174,0.4)"}
              >
                <MapPin size={18} strokeWidth={2.2} />
                Report an Issue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <a href="#features" className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 group">
                Learn More
                <ChevronDown size={15} className="group-hover:translate-y-0.5 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator - HeroBanner style */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 animate-bounce">
            <div className="w-1 h-2 bg-linear-to-b from-emerald-500 to-transparent rounded-full" />
          </div>
        </div>

        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
          .animate-bounce {
            animation: bounce 1.5s ease infinite;
          }
        `}</style>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(0,255,174,0.04) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00ffae] mb-3 block bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Why CommunityFix</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Built for Every Citizen
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto" style={{ fontWeight: 400 }}>
              Simple tools that connect communities with the authorities who can actually make a difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Instant Issue Reporting"
              description="Report any civic issue in under 30 seconds. Attach photos, pin your location on a live map, and add context — all from your phone or browser."
              delay={0}
            />
            <FeatureCard
              icon={Navigation}
              title="Real-Time Tracking"
              description="Follow your report from submission to resolution. Get push notifications at each stage as authorities acknowledge, investigate, and fix the problem."
              delay={120}
            />
            <FeatureCard
              icon={BarChart2}
              title="Community Impact"
              description="See the collective difference your neighborhood makes. Live dashboards reveal resolution rates, response times, and the most-improved areas nearby."
              delay={240}
            />
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ───────────────────────────────────────────────────── */}
      <section id="impact" ref={statsRef} className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,255,174,0.06) 0%, transparent 65%)" }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00ffae] mb-3 block bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">By The Numbers</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Real Impact, Every Day
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value={47312} label="Issues Reported" started={statsInView} />
            <StatCard value={38901} label="Issues Resolved" started={statsInView} />
            <StatCard value={12580} label="Active Users" started={statsInView} />
            <StatCard value={18} suffix="h" label="Avg. Response Time" started={statsInView} />
          </div>
        </div>
      </section>

      {/* ── STORY / HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="how" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(0,255,174,0.04) 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-32">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00ffae] mb-3 block bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">The Process</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                From Problem to
                <br />
                <span style={{
                  background: "linear-gradient(90deg, #00ffae 0%, #00e5ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Resolution</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed text-base" style={{ fontWeight: 400 }}>
                Our streamlined workflow ensures nothing falls through the cracks.
                Every report becomes a tracked, accountable ticket until it's resolved.
              </p>

              <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={20} color="#00ffae" />
                  <span className="text-sm font-semibold text-white">Accountability Guaranteed</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every report is timestamped, geo-tagged, and assigned to the responsible authority.
                  Escalation triggers automatically after 72 hours of inactivity.
                </p>
              </div>
            </div>

            {/* Right: steps */}
            <div ref={storyRef} className="pt-2">
              <StoryStep
                icon={AlertCircle} step="Step 01" inView={storyInView} delay={0}
                title="Problem Detected"
                description="A citizen spots a civic issue — cracked pavement, flooded street, or missing manhole cover — anywhere in the city."
              />
              <StoryStep
                icon={MapPin} step="Step 02" inView={storyInView} delay={100}
                title="User Reports Issue"
                description="They open CommunityFix, snap a photo, pin the exact location, and submit in under 30 seconds. The report is instantly logged."
              />
              <StoryStep
                icon={Users} step="Step 03" inView={storyInView} delay={200}
                title="Authority Responds"
                description="The relevant municipal department receives an alert, assigns a field crew, and updates the status in real-time for all followers to see."
              />
              <StoryStep
                icon={CheckCircle2} step="Step 04" inView={storyInView} delay={300} isLast
                title="Issue Resolved"
                description="The crew fixes the issue, uploads proof, and marks it resolved. The reporter gets a notification and the community sees the result."
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}