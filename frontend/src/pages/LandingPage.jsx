import React from "react";
import HeroSection from "../components/landingPage/HeroSection";
import FeaturesSection from "../components/landingPage/FeaturesSection";
import FeaturedProperties from "../components/landingPage/CoberagePlans";
import TestimonialsSection from "../components/landingPage/TestimonialsSection";
import CallToAction from "../components/landingPage/CallToAction";
import Navbar from "@/layouts/Navbar";
import DashboardShowcase from "@/components/landingPage/DashboardShowcase";

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <HeroSection />
      <DashboardShowcase />
      <TestimonialsSection />
      <FeaturedProperties />

      <CallToAction />
    </div>
  );
};

export default LandingPage;
