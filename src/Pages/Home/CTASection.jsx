import React, { use } from "react";
import { ArrowRight } from "lucide-react";
import { AuthContext } from "../AuthProvider/AuthContext";
import { NavLink, useNavigate } from "react-router";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=900&fit=crop";

const CARD_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop";

const CTASection = () => {
  const { role } = use(AuthContext);
  const navigate = useNavigate();

  const handleStaffReportIssue = () => {
    if (role === "staff") {
      alert("Staff can't report issues.");
      return;
    }
    navigate("/dashboard/dashboard/addissues");
  };

  return (
    <div className="bg-zinc-950 p-6 ">
      <section className="relative h-120 md:h-130 lg:h-150 w-full overflow-hidden rounded-[20px] font-sans">

        {/* Background */}
        <img
          src={BG_IMAGE}
          alt="Community"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/20 to-black/55" />

        {/* Heading */}
        <div className="absolute left-5 top-5 md:left-9 md:top-9 flex flex-col gap-3">
          <div className="w-fit rounded-[14px] bg-transparent md:bg-zinc-950 px-2 py-3 md:px-5 md:py-2 backdrop-blur-md">
            <h2 className="whitespace-nowrap text-[clamp(28px,4vw,48px)] font-black leading-none tracking-[-0.02em] text-white">
              Fix Your Community
            </h2>
          </div>

          <div className="w-fit rounded-[14px] bg-transparent md:bg-zinc-950 px-2 py-3 md:px-5 md:py-2 backdrop-blur-md">
            <h2 className="whitespace-nowrap text-[clamp(28px,4vw,48px)] font-black leading-none tracking-[-0.02em] text-white">
              Starting Today
            </h2>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStaffReportIssue}
          className="absolute right-9 bottom-9 md:flex items-center gap-2 rounded-xl bg-white/90 px-3 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-[#111] hidden shadow-lg transition  hover:bg-white"
        >
          Start Reporting
          <ArrowRight size={15} />
        </button>

        {/* Floating Card */}
        <div className="absolute bottom-8 right-8 w-65 overflow-hidden rounded-2xl bg-[#121212]/90 shadow-2xl backdrop-blur-xl">

          <img
            src={CARD_IMAGE}
            alt="Issue preview"
            className="block h-30 w-full object-cover"
          />

          <div className="p-4">
            <h3 className="mb-1.5 text-[15px] font-bold leading-[1.3] text-amber-100">
              Real Issues. Real Solutions.
            </h3>

            <p className="mb-4 text-[13px] leading-6 text-gray-400">
              Citizens report, officials act. Transparent from start to finish.
            </p>

            <NavLink
              to="/community-guidelines"
              className="flex items-center justify-between text-sm font-semibold text-amber-100 transition hover:text-gray-300"
            >
              <span>More info</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CTASection;