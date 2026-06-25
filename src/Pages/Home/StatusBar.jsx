import React, { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import { CheckCircle2, Users, TrendingUp, Clock } from 'lucide-react';
import './statsbar.css';

/* ── Stats data ─────────────────────────────────────── */
const stats = [
  {
    raw: 24891,
    display: '24,891',
    suffix: '',
    label: 'Issues Resolved',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16, 185, 129, 0.12)',
    live: true,
  },
  {
    raw: 16432,
    display: '16,432',
    suffix: '',
    label: 'Active Citizens',
    icon: Users,
    gradient: 'from-teal-500 to-cyan-500',
    glowColor: 'rgba(20, 184, 166, 0.12)',
    live: false,
  },
  {
    raw: 98.5,
    display: '98.5',
    suffix: '%',
    label: 'Success Rate',
    icon: TrendingUp,
    gradient: 'from-green-400 to-emerald-500',
    glowColor: 'rgba(74, 222, 128, 0.12)',
    live: false,
  },
  {
    raw: 18,
    display: '18',
    suffix: 'hrs',
    label: 'Avg Response',
    icon: Clock,
    gradient: 'from-cyan-400 to-teal-500',
    glowColor: 'rgba(34, 211, 238, 0.12)',
    live: false,
  },
];

/* ── Animated counter ────────────────────────────────── */
function AnimatedNumber({ target, suffix, gradient, inView }) {
  const [displayValue, setDisplayValue] = React.useState('0');
  const isFloat = !Number.isInteger(target);

  React.useEffect(() => {
    if (!inView) return;
    const duration = 1.6;
    const start = performance.now();

    const step = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;

      setDisplayValue(
        isFloat
          ? current.toFixed(1)
          : Math.floor(current).toLocaleString()
      );

      if (progress < 1) requestAnimationFrame(step);
      else setDisplayValue(isFloat ? target.toFixed(1) : target.toLocaleString());
    };

    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span
      className={`stat-value bg-linear-to-r ${gradient} bg-clip-text text-transparent`}
    >
      {displayValue}
      {suffix && (
        <span className="text-2xl font-black ml-0.5">{suffix}</span>
      )}
    </span>
  );
}

/* ── Single stat card ────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

function StatCard({ stat, index, inView }) {
  const Icon = stat.icon;

  return (
    <motion.div
      className="stat-card"
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.018 }}
    >
      {/* Ambient glow orb */}
      <div
        className="stat-card-glow"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${stat.glowColor}, transparent 70%)` }}
      />

      <div className="stat-card-content">
        {/* Icon badge */}
        <div className="stat-icon-badge">
          <Icon
            className={`w-4 h-4 bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}
            style={{ color: '#10b981' }}
            strokeWidth={2.2}
          />
        </div>

        {/* Number */}
        <AnimatedNumber
          target={stat.raw}
          suffix={stat.suffix}
          gradient={stat.gradient}
          inView={inView}
        />

        {/* Label */}
        <div className="stat-label mt-2">
          {stat.live && <span className="stat-pulse-dot" />}
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main export ─────────────────────────────────────── */
const StatsBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="statsbar-section" ref={ref}>
      <div className="statsbar-grid">        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
};

export default StatsBar;