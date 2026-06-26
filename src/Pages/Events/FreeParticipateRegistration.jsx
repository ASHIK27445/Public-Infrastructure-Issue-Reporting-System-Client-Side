'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
  MapPin, CheckCircle, Clock, ChevronLeft, ChevronRight,
  Trash2, Trees, Wrench, Megaphone, GraduationCap, Handshake,
  Calendar, Ticket, BookCheck, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router';

const TYPE_ICON = {
  cleanup:    Trash2,
  plantation: Trees,
  repair:     Wrench,
  awareness:  Megaphone,
  student:    GraduationCap,
  meetup:     Handshake,
};

const priorityConfig = {
  Critical: { badge: 'bg-red-500/15 text-red-400 border-red-500/25' },
  High:     { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  Medium:   { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
};

const resolvedIssues = [
  {
    id: 1,
    caseId: 'CF-2024-0891',
    title: "Broken Streetlight on Park Avenue",
    description: "Multiple streetlights not working causing safety concerns in residential area.",
    location: "Park Avenue, Block A",
    reportedBy: "John Doe",
    resolvedDate: "Dec 18, 2024",
    resolutionTime: "14 hrs",
    priority: "High",
    category: "repair",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    caseId: 'CF-2024-0887',
    title: "Large Pothole on Main Street",
    description: "Deep pothole causing vehicle damage and creating traffic hazards.",
    location: "Main Street, Junction 5",
    reportedBy: "Emily Chen",
    resolvedDate: "Dec 17, 2024",
    resolutionTime: "9 hrs",
    priority: "Critical",
    category: "repair",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    caseId: 'CF-2024-0874',
    title: "Water Leakage in Residential Area",
    description: "Continuous water leakage from underground pipe affecting multiple homes.",
    location: "Green Valley, Sector 12",
    reportedBy: "Michael Brown",
    resolvedDate: "Dec 16, 2024",
    resolutionTime: "22 hrs",
    priority: "High",
    category: "cleanup",
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    caseId: 'CF-2024-0861',
    title: "Garbage Overflow Near Market",
    description: "Overflowing bins causing health and sanitation issues in commercial area.",
    location: "Central Market, Zone 3",
    reportedBy: "Lisa Anderson",
    resolvedDate: "Dec 15, 2024",
    resolutionTime: "6 hrs",
    priority: "Medium",
    category: "cleanup",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop"
  },
  {
    id: 5,
    caseId: 'CF-2024-0849',
    title: "Damaged Footpath Construction",
    description: "Broken concrete tiles making footpath unusable for pedestrians.",
    location: "Oak Street, Block C",
    reportedBy: "David Wilson",
    resolvedDate: "Dec 14, 2024",
    resolutionTime: "31 hrs",
    priority: "Medium",
    category: "repair",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop"
  },
  {
    id: 6,
    caseId: 'CF-2024-0832',
    title: "Non-functional Traffic Signal",
    description: "Traffic light malfunction at major intersection causing safety concerns.",
    location: "Highway Junction, Exit 7",
    reportedBy: "Anna Martinez",
    resolvedDate: "Dec 13, 2024",
    resolutionTime: "4 hrs",
    priority: "Critical",
    category: "repair",
    image: "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&h=400&fit=crop"
  },
];

function DetailRow({ icon: Icon, text, bold }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-zinc-300">
      <Icon className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" />
      <span className={bold ? 'font-semibold text-white' : ''}>{text}</span>
    </div>
  );
}

const SLIDE_VARIANTS = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function ResolvedIssues() {
  const [[current, dir], setPage] = useState([0, 0]);

  const paginate = (newDir) => {
    setPage(([prev]) => {
      const next = (prev + newDir + resolvedIssues.length) % resolvedIssues.length;
      return [next, newDir];
    });
  };

  const issue = resolvedIssues[current];
  const pc    = priorityConfig[issue.priority] ?? priorityConfig.Medium;
  const EventIcon = TYPE_ICON[issue.category] ?? Handshake;

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-emerald-500/60" />
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
                Success Stories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-lg">
              Recently{' '}
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                resolved
              </span>{' '}
              issues
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed max-w-md">
              Real problems fixed by real people. Every case closed means a safer, better community.
            </p>
          </div>

          {/* live pill */}
          <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 self-start md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              <span className="text-white font-semibold">24,891</span> issues resolved
            </span>
          </div>
        </motion.div>

        {/* ── carousel card — mirrors FreeParticipate success UI ── */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: 'easeInOut' }}
              className="rounded-3xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row bg-zinc-900/60"
            >
              {/* ── LEFT — image + stamp (mirrors QR side) ── */}
              <div className="w-full md:w-95 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">

                {/* image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

                  {/* priority badge top-left */}
                  <span className={`absolute top-4 left-4 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${pc.badge}`}>
                    {issue.priority}
                  </span>

                  {/* resolved stamp top-right */}
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle size={11} strokeWidth={2} />
                    Resolved
                  </span>
                </div>

                {/* banner — mirrors "You're In!" */}
                <div className="py-6 px-7 text-center border-b border-zinc-800">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <EventIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                    Case Closed
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Issue verified and resolved by field staff.
                  </p>
                </div>

                {/* resolution stats — mirrors QR status box */}
                <div className="p-6 space-y-3">
                  <div className="border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
                    <BookCheck className="text-emerald-400 w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Resolved in {issue.resolutionTime}</p>
                      <p className="text-xs text-zinc-500">{issue.resolvedDate}</p>
                    </div>
                  </div>

                  <div className="border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-zinc-500 w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Reported by</p>
                      <p className="text-xs text-zinc-500">{issue.reportedBy}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT — details (mirrors event details side) ── */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-7">

                {/* case id */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-600">{issue.caseId}</span>
                  <span className="text-[11px] text-zinc-600">
                    {current + 1} / {resolvedIssues.length}
                  </span>
                </div>

                {/* title + desc */}
                <div>
                  <h3 className="text-2xl font-bold text-white leading-snug mb-3" style={{ fontFamily: 'Fraunces, serif' }}>
                    {issue.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* details block — mirrors EventDetails */}
                <div className="rounded-2xl p-5 border border-zinc-800 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                    Issue Details
                  </p>
                  <DetailRow icon={MapPin}   text={issue.location} />
                  <DetailRow icon={Clock}    text={`Resolved in ${issue.resolutionTime}`} />
                  <DetailRow icon={Calendar} text={issue.resolvedDate} />
                </div>

                {/* what happened — mirrors What's Next */}
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                    How It Was Resolved
                  </p>
                  <div className="space-y-2.5">
                    {[
                      "Citizen submitted report with photo evidence.",
                      "Admin verified and escalated to field team.",
                      "Staff inspected site and began repairs.",
                      "Issue confirmed resolved and case closed.",
                    ].map((text, i) => (
                      <div key={i} className="flex gap-3 text-sm text-zinc-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs flex items-center justify-center shrink-0 font-semibold mt-0.5">
                          {i + 1}
                        </span>
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* dot indicators */}
                <div className="flex items-center gap-1.5 mt-auto pt-4">
                  {resolvedIssues.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(([prev]) => [i, i > prev ? 1 : -1])}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-6 bg-emerald-500'
                          : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── nav arrows ── */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all duration-200 z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all duration-200 z-10"
          >
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}