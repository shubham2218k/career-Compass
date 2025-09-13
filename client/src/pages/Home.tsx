import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";

export default function Home() {
  const { actualTheme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { openDialog } = useAuthDialog();
  const [, setLocation] = useLocation();

  const handleThemeToggle = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark");
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // If user is authenticated, start the Discovery process
      setLocation("/discovery");
    } else {
      // If not authenticated, open the auth dialog with signup tab
      openDialog("signup");
    }
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked - scrolling to roadmap section");
    document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
    switch (section) {
      case "dashboard":
        console.log("Dashboard navigation - not implemented yet");
        break;
      case "profile":
        console.log("Profile navigation - not implemented yet");
        break;
      case "settings":
        console.log("Settings navigation - not implemented yet");
        break;
      case "help":
        console.log("Help navigation - not implemented yet");
        break;
      default:
        console.log(`Unknown navigation: ${section}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onThemeToggle={handleThemeToggle} 
        isDark={actualTheme === "dark"}
        onNavigate={handleNavigate}
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