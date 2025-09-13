import { useEffect, useState } from "react";

export default function QuoteSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("quote-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section 
      id="quote-section"
      className="py-16 sm:py-20 bg-accent/30"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <blockquote className="space-y-6">
            <div className="text-4xl text-primary/20 mb-4">
              "
            </div>
            
            <p className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium leading-relaxed text-foreground italic">
              "Arise, awake, and stop not till the goal is reached."
            </p>
            
            <footer className="pt-4">
              <cite className="text-lg text-muted-foreground font-medium not-italic">
                — Swami Vivekananda
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}