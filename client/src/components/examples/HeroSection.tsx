import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked");
  };

  return (
    <HeroSection 
      onGetStarted={handleGetStarted}
      onLearnMore={handleLearnMore}
    />
  );
}