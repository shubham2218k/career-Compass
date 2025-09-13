import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";

export default function Home() {
  const { actualTheme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark");
  };

  const handleGetStarted = () => {
    console.log("Get Started clicked - would navigate to sign up");
    // In a real app, this would navigate to the sign up page
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked - would navigate to about section");
    // Smooth scroll to about or roadmap section
    document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onThemeToggle={handleThemeToggle} 
        isDark={actualTheme === "dark"} 
      />
      
      <main>
        <HeroSection 
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />
        
        <QuoteSection />
        
        <RoadmapSection />
      </main>
      
      <Footer />
    </div>
  );
}