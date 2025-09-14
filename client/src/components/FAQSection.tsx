import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "career-counseling",
    question: "Why do I need career counseling?",
    answer: "Career counseling helps you make informed decisions about your professional future. Our platform provides personalized guidance based on your interests, skills, and goals, helping you navigate the complex world of career choices and avoid costly mistakes."
  },
  {
    id: "app-purpose",
    question: "What is this app for?",
    answer: "CareerPath is a comprehensive career guidance platform designed to help students and professionals discover their ideal career paths. We combine AI-powered assessments, personalized recommendations, and expert insights to guide you through every step of your career journey."
  },
  {
    id: "right-career",
    question: "How can this app help me choose the right career?",
    answer: "Our platform uses advanced assessment tools to analyze your interests, skills, personality traits, and goals. Based on this comprehensive profile, we provide personalized career recommendations, market insights, and detailed roadmaps to help you make confident career decisions."
  },
  {
    id: "personalized-guidance",
    question: "Is the guidance personalized?",
    answer: "Absolutely! Every recommendation is tailored to your unique profile. Our AI analyzes your responses, educational background, interests, and career goals to provide customized advice that fits your specific situation and aspirations."
  },
  {
    id: "uncertain-skills",
    question: "Can I use this app if I'm unsure about my skills?",
    answer: "Yes! Our platform is perfect for discovering your hidden talents and strengths. Through interactive assessments and self-discovery exercises, we help you identify skills you might not even know you have, giving you clarity on your capabilities."
  },
  {
    id: "free-resources",
    question: "Are the resources provided free?",
    answer: "We offer a comprehensive free tier with basic career assessments and general guidance. Premium features include detailed AI-powered career coaching, personalized roadmaps, and exclusive industry insights. Our goal is to make career guidance accessible to everyone."
  },
  {
    id: "usage-frequency",
    question: "How often should I use the app?",
    answer: "We recommend using the platform whenever you're facing career decisions or want to reassess your goals. Many users find it helpful to revisit their career plans quarterly or during major life transitions like graduation, job changes, or career pivots."
  },
  {
    id: "job-market",
    question: "Does the app provide current job market information?",
    answer: "Yes! We provide real-time job market trends, salary insights, growth projections, and demand forecasts for various career fields. This helps you make informed decisions based on current market realities and future opportunities."
  },
  {
    id: "ai-chat",
    question: "How does the AI Chat feature work?",
    answer: "Our AI Chat provides instant, personalized career guidance through natural conversation. You can ask questions about career paths, get advice on specific situations, and receive tailored recommendations. The AI remembers your conversation history to provide contextual and relevant responses."
  }
];

export default function FAQSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <section className="py-16 bg-background border-t" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-faq-title">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-faq-subtitle">
            Get answers to common questions about our career guidance platform
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover-elevate"
              data-testid={`card-faq-${faq.id}`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                data-testid={`button-faq-toggle-${faq.id}`}
                aria-expanded={expandedFAQ === faq.id}
                aria-controls={`faq-content-${faq.id}`}
              >
                <span className="text-lg font-medium text-foreground pr-8">
                  {faq.question}
                </span>
                <span className="flex-shrink-0">
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
              </button>
              
              <div
                id={`faq-content-${faq.id}`}
                className={`px-6 pb-4 transition-all duration-200 ease-in-out ${
                  expandedFAQ === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
                data-testid={`text-faq-answer-${faq.id}`}
              >
                <div className="text-muted-foreground leading-relaxed border-t pt-4 mt-0">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-more-questions">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Try our AI Chat for personalized help.
            </p>
            <a
              href="/ai-chat"
              className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              data-testid="link-ai-chat"
            >
              Ask AI Assistant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}