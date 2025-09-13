import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  Search, 
  Target, 
  BookOpen, 
  Route, 
  Library, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Trophy, 
  Star,
  ArrowDown
} from "lucide-react";

interface RoadmapStep {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: 1,
    icon: Search,
    title: "Discovery",
    description: "Take our comprehensive assessment to understand your interests, strengths, and career preferences.",
    color: "text-pink-500"
  },
  {
    id: 2,
    icon: Target,
    title: "Goal Setting",
    description: "Define clear, achievable career goals based on your assessment results and aspirations.",
    color: "text-orange-500"
  },
  {
    id: 3,
    icon: BookOpen,
    title: "Skill Assessment",
    description: "Evaluate your current skills and identify areas for improvement to reach your career goals.",
    color: "text-purple-500"
  },
  {
    id: 4,
    icon: Route,
    title: "Learning Path",
    description: "Get a personalized roadmap with courses, certifications, and milestones tailored to your goals.",
    color: "text-teal-500"
  },
  {
    id: 5,
    icon: Library,
    title: "Resource Access",
    description: "Access curated courses, books, practice materials, and industry insights from our comprehensive library.",
    color: "text-blue-500"
  },
  {
    id: 6,
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your learning progress with detailed analytics, achievements, and milestone celebrations.",
    color: "text-green-500"
  },
  {
    id: 7,
    icon: Users,
    title: "Mentorship",
    description: "Connect with industry experts and mentors who can guide you through real-world challenges.",
    color: "text-indigo-500"
  },
  {
    id: 8,
    icon: Briefcase,
    title: "Career Planning",
    description: "Build your professional profile, prepare for interviews, and explore job opportunities in your field.",
    color: "text-red-500"
  },
  {
    id: 9,
    icon: Trophy,
    title: "Achievement",
    description: "Celebrate your accomplishments and showcase your skills to potential employers and peers.",
    color: "text-yellow-500"
  },
  {
    id: 10,
    icon: Star,
    title: "Success",
    description: "Launch your career with confidence, knowing you have the skills and support system to succeed.",
    color: "text-emerald-500"
  }
];

export default function RoadmapSection() {
  const [visibleSteps, setVisibleSteps] = useState(new Set<number>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = parseInt(entry.target.getAttribute('data-step-id') || '0');
            setVisibleSteps(prev => new Set([...Array.from(prev), stepId]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step-id]');
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleStartJourney = () => {
    console.log("Start Your Journey Now clicked - redirecting to sign up/sign in");
    // This would redirect to authentication in a real app
  };

  return (
    <section id="roadmap" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Your Success <span className="text-primary">Roadmap</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Follow our proven 10-step journey from confusion to career clarity. 
            Every student's path is unique, but success follows a pattern.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Road/Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full hidden lg:block" />
          
          <div className="space-y-12 lg:space-y-16">
            {roadmapSteps.map((step, index) => (
              <div
                key={step.id}
                data-step-id={step.id}
                className={`relative transition-all duration-700 ${
                  visibleSteps.has(step.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? 'lg:text-right' : 'lg:text-left lg:flex-row-reverse'
                }`}>
                  {/* Card */}
                  <div className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                    <Card className="hover-elevate transition-all duration-300 shadow-lg">
                      <CardContent className="p-6 sm:p-8">
                        <div className={`flex items-start gap-4 ${
                          index % 2 === 0 ? 'lg:flex-row-reverse lg:text-right' : ''
                        }`}>
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${step.color}`}>
                            <step.icon className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Step Number Circle */}
                  <div className={`hidden lg:flex justify-center ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <span className="font-heading font-bold text-xl text-primary-foreground">
                          {step.id}
                        </span>
                      </div>
                      
                      {/* Arrow connecting to next step */}
                      {index < roadmapSteps.length - 1 && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4">
                          <ArrowDown className="w-6 h-6 text-primary animate-bounce" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Step Number */}
                  <div className="lg:hidden absolute -left-2 top-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <span className="font-heading font-bold text-sm text-primary-foreground">
                        {step.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 sm:p-12">
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-4">
              Ready to Transform Your Future?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already discovered their ideal career path through our proven methodology.
            </p>
            <Button 
              size="lg" 
              className="text-base px-12 py-6 font-semibold"
              onClick={handleStartJourney}
              data-testid="button-start-journey"
            >
              Start Your Journey Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}