import React from 'react';
import Navbar from "./Navbar";
import HeroBanner from "./HeroBanner";
import StatusBar from "./StatusBar";
import ResolvedIssue from "./ResolvedIssue";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CTASection from "./CTASection";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroBanner />
      <StatusBar />
      <ResolvedIssue />
      <Features />
      <HowItWorks />
      <CTASection />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;