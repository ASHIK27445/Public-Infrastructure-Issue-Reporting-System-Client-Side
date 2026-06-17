import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  User,
  Building,
  CheckCircle,
  Clock,
  Send,
  Copy,
  Eye,
  FileText,
  AlertCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  X,
  ZoomIn,
  Instagram,
  Twitter,
  Facebook,
  Link2,
} from "lucide-react";
import { toast } from "react-toastify";

// ===================== DEMO DATA =====================
const DEMO_CERTIFICATES = [
  {
    _id: "demo-1",
    certId: "CERT-2024-A7B3",
    recipientName: "Sarah Johnson",
    recipientEmail: "sarah@example.com",
    eventTitle: "Dhaka Lakeside Cleanup Drive",
    eventType: "cleanup",
    eventDate: "2024-03-15T08:00:00Z",
    eventAddress: "Gulshan Lake Park, Dhaka",
    role: "Volunteer",
    institution: "University of Dhaka",
    issuedAt: "2024-03-16T10:30:00Z",
    verifyUrl: "https://communityfix.com/verify/CERT-2024-A7B3",
    emailSent: true,
    emailSentAt: "2024-03-16T10:35:00Z",
    pdfUrl: null,
  },
  {
    _id: "demo-2",
    certId: "CERT-2024-D9F2",
    recipientName: "Sarah Johnson",
    recipientEmail: "sarah@example.com",
    eventTitle: "Green Dhaka Tree Plantation",
    eventType: "plantation",
    eventDate: "2024-02-20T07:00:00Z",
    eventAddress: "Ramna Park, Dhaka",
    role: "Volunteer",
    institution: "University of Dhaka",
    issuedAt: "2024-02-21T14:00:00Z",
    verifyUrl: "https://communityfix.com/verify/CERT-2024-D9F2",
    emailSent: true,
    emailSentAt: "2024-02-21T14:05:00Z",
    pdfUrl: null,
  },
  {
    _id: "demo-3",
    certId: "CERT-2024-K2M8",
    recipientName: "Sarah Johnson",
    recipientEmail: "sarah@example.com",
    eventTitle: "Community Health Awareness Camp",
    eventType: "awareness",
    eventDate: "2024-01-10T09:00:00Z",
    eventAddress: "Mohammadpur Community Center, Dhaka",
    role: "Guest",
    institution: "",
    issuedAt: "2024-01-11T11:00:00Z",
    verifyUrl: "https://communityfix.com/verify/CERT-2024-K2M8",
    emailSent: false,
    emailSentAt: null,
    pdfUrl: null,
  },
  {
    _id: "demo-4",
    certId: "CERT-2023-P5R1",
    recipientName: "Sarah Johnson",
    recipientEmail: "sarah@example.com",
    eventTitle: "School Renovation Project",
    eventType: "repair",
    eventDate: "2023-11-05T08:30:00Z",
    eventAddress: "Mirpur Primary School, Dhaka",
    role: "Volunteer",
    institution: "BUET",
    issuedAt: "2023-11-06T09:00:00Z",
    verifyUrl: "https://communityfix.com/verify/CERT-2023-P5R1",
    emailSent: true,
    emailSentAt: "2023-11-06T09:30:00Z",
    pdfUrl: null,
  },
  {
    _id: "demo-5",
    certId: "CERT-2023-W8X4",
    recipientName: "Sarah Johnson",
    recipientEmail: "sarah@example.com",
    eventTitle: "Student Volunteer Day 2023",
    eventType: "student",
    eventDate: "2023-09-22T10:00:00Z",
    eventAddress: "Multiple Locations, Dhaka",
    role: "Volunteer",
    institution: "North South University",
    issuedAt: "2023-09-23T15:00:00Z",
    verifyUrl: "https://communityfix.com/verify/CERT-2023-W8X4",
    emailSent: true,
    emailSentAt: "2023-09-23T15:10:00Z",
    pdfUrl: null,
  },
];

const DEMO_USER = {
  email: "sarah@example.com",
  name: "Sarah Johnson",
  totalEvents: 5,
};

// ===================== CONSTANTS =====================
const TYPE_CONFIG = {
  cleanup: {
    label: "Cleanup Drive",
    emoji: "🧹",
    color: "from-sky-500 to-sky-600",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    light: "bg-sky-100",
  },
  plantation: {
    label: "Tree Plantation",
    emoji: "🌳",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    light: "bg-emerald-100",
  },
  repair: {
    label: "Repair Work",
    emoji: "🏗️",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    light: "bg-amber-100",
  },
  awareness: {
    label: "Awareness Campaign",
    emoji: "📢",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    light: "bg-violet-100",
  },
  student: {
    label: "Student Volunteer Day",
    emoji: "🎓",
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    light: "bg-pink-100",
  },
  meetup: {
    label: "Community Meetup",
    emoji: "🤝",
    color: "from-teal-500 to-teal-600",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    light: "bg-teal-100",
  },
};

// ===================== MAIN COMPONENT =====================
export default function MyCertificatesPage() {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedCert, setExpandedCert] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({ total: 0, emailSent: 0, emailPending: 0 });

  // ===================== DATA FETCHING =====================
  const fetchCertificates = useCallback(async () => {
    if (isDemoMode) {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCertificates(DEMO_CERTIFICATES);
      setStats({
        total: DEMO_CERTIFICATES.length,
        emailSent: DEMO_CERTIFICATES.filter((c) => c.emailSent).length,
        emailPending: DEMO_CERTIFICATES.filter((c) => !c.emailSent).length,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/certificates/my-certificates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }

      const data = await response.json();
      setCertificates(data.certificates || []);
      setStats({
        total: data.total || 0,
        emailSent: data.certificates?.filter((c) => c.emailSent).length || 0,
        emailPending: data.certificates?.filter((c) => !c.emailSent).length || 0,
      });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // ===================== FILTERING & SORTING =====================
  const filteredCertificates = certificates
    .filter((cert) => {
      const matchesSearch =
        cert.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.eventAddress?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || cert.eventType === filterType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.issuedAt) - new Date(b.issuedAt);
        case "date-desc":
          return new Date(b.issuedAt) - new Date(a.issuedAt);
        case "name-asc":
          return a.eventTitle.localeCompare(b.eventTitle);
        case "name-desc":
          return b.eventTitle.localeCompare(a.eventTitle);
        default:
          return 0;
      }
    });

  // ===================== ACTIONS =====================
  const handleDownload = async (cert) => {
    if (isDemoMode) {
      toast.success("📄 Download started! (Demo mode)");
      return;
    }
    if (cert.pdfUrl) {
      window.open(cert.pdfUrl, "_blank");
    } else {
      toast.info("PDF not available. Try requesting a resend.");
    }
  };

  const handleResendEmail = async (cert) => {
    if (isDemoMode) {
      toast.success(`✅ Email resent to ${cert.recipientEmail}! (Demo)`);
      // Update local state for demo
      setCertificates((prev) =>
        prev.map((c) =>
          c.certId === cert.certId
            ? { ...c, emailSent: true, emailSentAt: new Date().toISOString() }
            : c
        )
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/certificates/admin/events/${cert.eventId}/certificates/${cert.certId}/resend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to resend email");

      toast.success(`📧 Certificate resent to ${cert.recipientEmail}`);
      fetchCertificates();
    } catch (err) {
      toast.error("Failed to resend email");
    }
  };

  const handleVerify = (cert) => {
    if (isDemoMode) {
      setSelectedCert(cert);
      setShowPreview(true);
      return;
    }
    window.open(cert.verifyUrl, "_blank");
  };

  const handleShare = (cert) => {
    setSelectedCert(cert);
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // ===================== RENDER HELPERS =====================
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.meetup;

  // ===================== MODALS =====================
  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Share Certificate</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {selectedCert && (
          <div className="space-y-4">
            {/* Certificate Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{selectedCert.recipientName}</p>
              <p className="text-sm text-gray-600">{selectedCert.eventTitle}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedCert.certId}</p>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  window.open(
                    `https://www.Instagram.com/sharing/share-offsite/?url=${encodeURIComponent(
                      selectedCert.verifyUrl
                    )}`,
                    "_blank"
                  );
                }}
                className="flex items-center gap-2 justify-center p-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
              >
                <Instagram size={18} />
                <span className="text-sm font-medium">Instagram</span>
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `I just received my certificate for "${selectedCert.eventTitle}"! 🎉\n\nVerify here: ${selectedCert.verifyUrl}`
                    )}`,
                    "_blank"
                  );
                }}
                className="flex items-center gap-2 justify-center p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Twitter size={18} />
                <span className="text-sm font-medium">Twitter</span>
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      selectedCert.verifyUrl
                    )}`,
                    "_blank"
                  );
                }}
                className="flex items-center gap-2 justify-center p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#0C5DC7] transition-colors"
              >
                <Facebook size={18} />
                <span className="text-sm font-medium">Facebook</span>
              </button>
              <button
                onClick={() => copyToClipboard(selectedCert.verifyUrl)}
                className="flex items-center gap-2 justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Copy size={18} />
                <span className="text-sm font-medium">Copy Link</span>
              </button>
            </div>

            {/* Direct Link */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">Verification Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedCert.verifyUrl}
                  readOnly
                  className="flex-1 text-xs bg-white border rounded px-3 py-2 text-gray-700"
                />
                <button
                  onClick={() => copyToClipboard(selectedCert.verifyUrl)}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-lg font-bold text-gray-900">
            Certificate Preview
          </h3>
          <button
            onClick={() => {
              setShowPreview(false);
              setSelectedCert(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {selectedCert && (
          <div className="p-6">
            {/* Certificate Preview Card */}
            <div className="border-4 border-double border-gray-200 rounded-lg p-8 max-w-3xl mx-auto">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    CommunityFix · Civic Engagement Program
                  </p>
                </div>

                <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  {getTypeConfig(selectedCert.eventType).emoji}{" "}
                  {getTypeConfig(selectedCert.eventType).label}
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-[4px] mb-2">
                    Certificate of
                  </p>
                  <h2 className="text-4xl font-bold text-gray-900">
                    {selectedCert.role === "Guest" ? "Guest" : "Volunteer"}{" "}
                    Achievement
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Presented to
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {selectedCert.recipientName}
                  </p>
                  {selectedCert.institution && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      {selectedCert.institution}
                    </p>
                  )}
                </div>

                <div className="w-48 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>

                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  For outstanding participation as a{" "}
                  <strong>{selectedCert.role}</strong> in{" "}
                  <strong>{selectedCert.eventTitle}</strong>, demonstrating
                  commendable civic spirit.
                </p>

                <div className="flex justify-center gap-4">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    🗓️ {formatDate(selectedCert.eventDate)}
                  </span>
                  {selectedCert.eventAddress && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      📍 {selectedCert.eventAddress}
                    </span>
                  )}
                </div>

                <div className="flex justify-center gap-16 pt-8">
                  <div className="text-center">
                    <div className="w-32 h-px bg-gray-300 mb-2"></div>
                    <p className="text-xs font-semibold text-gray-600">
                      Event Organizer
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-px bg-gray-300 mb-2"></div>
                    <p className="text-xs font-semibold text-gray-600">
                      Issued: {formatDate(selectedCert.issuedAt)}
                    </p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-gray-400">
                    Certificate ID: {selectedCert.certId}
                  </p>
                  <p className="text-xs text-gray-400">
                    Verify at: {selectedCert.verifyUrl}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => handleDownload(selectedCert)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleShare(selectedCert);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ===================== MAIN RENDER =====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Award size={32} className="text-green-200" />
                <h1 className="text-3xl font-bold">My Certificates</h1>
              </div>
              <p className="text-green-100 max-w-2xl">
                View, download, and share your certificates of participation.
                Each certificate is verifiable online.
              </p>
            </div>

            {/* Demo Mode Toggle */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-green-100">Demo Mode</span>
              <button
                onClick={() => {
                  setIsDemoMode(!isDemoMode);
                  setCertificates([]);
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-green-400"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDemoMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-200 mb-1">
                <Award size={16} />
                <span className="text-xs font-semibold uppercase">Total</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-green-200">Certificates earned</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-200 mb-1">
                <Send size={16} />
                <span className="text-xs font-semibold uppercase">Emailed</span>
              </div>
              <p className="text-2xl font-bold">{stats.emailSent}</p>
              <p className="text-xs text-green-200">Delivered to inbox</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-200 mb-1">
                <Clock size={16} />
                <span className="text-xs font-semibold uppercase">Pending</span>
              </div>
              <p className="text-2xl font-bold">{stats.emailPending}</p>
              <p className="text-xs text-green-200">Awaiting delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              {Object.entries(TYPE_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.emoji} {config.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Event Name A-Z</option>
              <option value="name-desc">Event Name Z-A</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchCertificates}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border p-6 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Certificates
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCertificates}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-12">
            <Award size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {certificates.length === 0
                ? "No Certificates Yet"
                : "No Matching Certificates"}
            </h3>
            <p className="text-gray-600 mb-4">
              {certificates.length === 0
                ? "Participate in events to earn certificates!"
                : "Try adjusting your search or filters."}
            </p>
            {certificates.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCertificates.map((cert) => {
              const typeConfig = getTypeConfig(cert.eventType);
              const isExpanded = expandedCert === cert.certId;

              return (
                <div
                  key={cert.certId}
                  className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all ${
                    isExpanded ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Type Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg ${typeConfig.light} flex items-center justify-center text-2xl`}
                      >
                        {typeConfig.emoji}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {cert.eventTitle}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border} w-fit`}
                          >
                            {typeConfig.emoji} {typeConfig.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(cert.eventDate)}
                          </span>
                          {cert.eventAddress && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {cert.eventAddress}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {cert.role}
                          </span>
                          {cert.institution && (
                            <span className="flex items-center gap-1">
                              <Building size={14} />
                              {cert.institution}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {cert.certId}
                          </span>
                          <span className="text-xs text-gray-400">
                            Issued {formatDate(cert.issuedAt)}
                          </span>
                          {cert.emailSent ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle size={12} />
                              Email sent
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <Clock size={12} />
                              Email pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 justify-end">
                        <button
                          onClick={() => handleDownload(cert)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download size={14} />
                          PDF
                        </button>
                        <button
                          onClick={() => handleVerify(cert)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleShare(cert)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Share2 size={14} />
                          Share
                        </button>
                        <button
                          onClick={() =>
                            setExpandedCert(
                              isExpanded ? null : cert.certId
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Certificate ID</p>
                            <p className="font-mono font-semibold text-gray-900">
                              {cert.certId}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Issued Date</p>
                            <p className="font-semibold text-gray-900">
                              {formatDate(cert.issuedAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Event Date</p>
                            <p className="font-semibold text-gray-900">
                              {formatDate(cert.eventDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Role</p>
                            <p className="font-semibold text-gray-900">
                              {cert.role}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email Status</p>
                            <p className="font-semibold text-gray-900">
                              {cert.emailSent ? "Sent" : "Pending"}
                              {cert.emailSentAt &&
                                ` (${formatDate(cert.emailSentAt)})`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Verification</p>
                            <button
                              onClick={() => copyToClipboard(cert.verifyUrl)}
                              className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Link2 size={12} />
                              Copy verify link
                            </button>
                          </div>
                        </div>

                        {/* Additional Actions */}
                        <div className="flex gap-2 mt-4">
                          {!cert.emailSent && (
                            <button
                              onClick={() => handleResendEmail(cert)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                            >
                              <Send size={14} />
                              Resend Email
                            </button>
                          )}
                          <button
                            onClick={() => handleVerify(cert)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink size={14} />
                            Verify Online
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showShareModal && <ShareModal />}
      {showPreview && <PreviewModal />}
    </div>
  );
}