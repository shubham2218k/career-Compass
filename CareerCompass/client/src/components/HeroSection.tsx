import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export default function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              {/* Tagline */}
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground">
                Ignite Your{" "}
                <span className="text-primary">Potential</span>
              </h1>

              {/* Compelling paragraph */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Feeling confused about your career path? You're not alone. Whether you've just completed 10th grade, 12th grade, graduation, or are exploring new opportunities - we're here to guide you through every step of your journey with personalized resources, expert mentorship, and proven strategies.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6"
                  onClick={onGetStarted}
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-6"
                  onClick={onLearnMore}
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Video placeholder */}
          <div className="order-1 lg:order-2">
            <div className="relative bg-card rounded-2xl shadow-lg overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary fill-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      See How It Works
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Discover your career path in minutes
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Video placeholder overlay */}
              <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer" data-testid="video-placeholder">
                <div className="absolute top-4 right-4">
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}