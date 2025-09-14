import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import PersonalDetailsForm from "@/components/discovery/PersonalDetailsForm";
import CareerSurvey from "@/components/discovery/CareerSurvey";
import PersonalitySnapshot from "@/components/discovery/PersonalitySnapshot";
import DiscoverySummary from "@/components/discovery/DiscoverySummary";
import { Progress } from "@/components/ui/progress";

interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  currentStage: string;
}

interface CareerSurveyData {
  interests: string[];
  strengths: string[];
  motivations: string[];
  workEnvironment: string;
  workLifeBalance: string;
  careerGoals: string;
  challenges: string;
  inspiration: string;
}

interface PersonalityAnswer {
  questionId: string;
  answer: string;
}

type DiscoveryStep = "personal-details" | "career-survey" | "personality" | "summary";

export default function Discovery() {
  const { updateUser, isAuthenticated } = useAuth();
  const { openDialog } = useAuthDialog();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<DiscoveryStep>("personal-details");
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [careerData, setCareerData] = useState<CareerSurveyData | null>(null);
  const [personalityData, setPersonalityData] = useState<PersonalityAnswer[] | null>(null);

  const steps: Array<{ key: DiscoveryStep; title: string; number: number }> = [
    { key: "personal-details", title: "Personal Details", number: 1 },
    { key: "career-survey", title: "Career Discovery", number: 2 },
    { key: "personality", title: "Personality Assessment", number: 3 },
    { key: "summary", title: "Summary", number: 4 },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Auth Guard: Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      // Open auth dialog after a short delay to allow navigation
      setTimeout(() => {
        openDialog("signup");
      }, 100);
    }
  }, [isAuthenticated, setLocation, openDialog]);

  // Load saved discovery data from localStorage
  useEffect(() => {
    if (!isAuthenticated) return;
    
    try {
      const savedData = localStorage.getItem('discoveryProgress');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setCurrentStep(parsed.currentStep || "personal-details");
        setPersonalDetails(parsed.personalDetails || null);
        setCareerData(parsed.careerData || null);
        setPersonalityData(parsed.personalityData || null);
      }
    } catch (error) {
      console.error('Error loading discovery progress:', error);
    }
  }, [isAuthenticated]);

  // Save discovery data to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const dataToSave = {
      currentStep,
      personalDetails,
      careerData,
      personalityData,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('discoveryProgress', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving discovery progress:', error);
    }
  }, [currentStep, personalDetails, careerData, personalityData, isAuthenticated]);

  const handlePersonalDetailsNext = (data: PersonalDetails) => {
    setPersonalDetails(data);
    setCurrentStep("career-survey");
  };

  const handleCareerSurveyNext = (data: CareerSurveyData) => {
    setCareerData(data);
    setCurrentStep("personality");
  };

  const handlePersonalityNext = (data: PersonalityAnswer[]) => {
    setPersonalityData(data);
    setCurrentStep("summary");
  };

  const handleSummaryNext = () => {
    // Mark discovery as completed in user profile
    updateUser({ discoveryCompleted: true });
    // Clear saved progress since discovery is complete
    localStorage.removeItem('discoveryProgress');
    console.log("Discovery completed! Redirecting to recommendations...");
    // Navigate to recommendations page
    setLocation("/recommendations");
  };

  // Generate personality profile from answers
  const generatePersonalityProfile = () => {
    if (!personalityData) return { primaryTraits: [], workStyle: "", communicationStyle: "" };

    const answers = personalityData.reduce((acc, answer) => {
      acc[answer.questionId] = answer.answer;
      return acc;
    }, {} as Record<string, string>);

    // Simple personality mapping based on answers
    const traits: string[] = [];
    if (answers["project-approach"] === "plan") traits.push("Organized");
    if (answers["project-approach"] === "ideas") traits.push("Innovative");
    if (answers["group-role"] === "leader") traits.push("Leadership-oriented");
    if (answers["group-role"] === "problem-solver") traits.push("Analytical");
    if (answers["decision-making"] === "analyze-data") traits.push("Data-driven");
    if (answers["decision-making"] === "trust-intuition") traits.push("Intuitive");
    if (answers["learning-style"] === "hands-on") traits.push("Practical");
    if (answers["learning-style"] === "discussion") traits.push("Collaborative");
    
    // Work style mapping
    const workStyleMap: Record<string, string> = {
      "fast-dynamic": "Fast-paced and energetic",
      "steady-consistent": "Methodical and reliable",
      "flexible-varied": "Adaptable and versatile",
      "focused-deep": "Detail-oriented and thorough"
    };

    // Communication style mapping
    const commStyleMap: Record<string, string> = {
      "presentations": "Confident presenter",
      "writing": "Strong written communicator",
      "visual-design": "Visual communicator",
      "one-on-one": "Personal relationship builder"
    };

    return {
      primaryTraits: traits.length > 0 ? traits : ["Self-motivated", "Curious"],
      workStyle: workStyleMap[answers["work-pace"]] || "Balanced approach",
      communicationStyle: commStyleMap[answers["communication-style"]] || "Effective communicator"
    };
  };

  // Format work environment labels
  const formatWorkEnvironment = (env: string) => {
    const envMap: Record<string, string> = {
      "office": "Traditional office environment",
      "remote": "Remote/Work from home", 
      "hybrid": "Hybrid (mix of office and remote)",
      "fieldwork": "Field work/Travel required",
      "laboratory": "Laboratory/Research facility",
      "startup": "Fast-paced startup environment",
      "corporate": "Large corporate setting",
      "creative": "Creative/Studio environment"
    };
    return envMap[env] || env;
  };

  const formatWorkLifeBalance = (balance: string) => {
    const balanceMap: Record<string, string> = {
      "high-demanding": "High-demanding for high rewards",
      "standard": "Standard work hours",
      "flexible": "Flexible hours with good work-life balance",
      "part-time": "Part-time or project-based work"
    };
    return balanceMap[balance] || balance;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "personal-details":
        return (
          <PersonalDetailsForm
            onNext={handlePersonalDetailsNext}
          />
        );
      
      case "career-survey":
        return (
          <CareerSurvey
            onNext={handleCareerSurveyNext}
            onBack={() => setCurrentStep("personal-details")}
          />
        );
      
      case "personality":
        return (
          <PersonalitySnapshot
            onNext={handlePersonalityNext}
            onBack={() => setCurrentStep("career-survey")}
          />
        );
      
      case "summary":
        if (!personalDetails || !careerData) return null;
        
        const summaryData = {
          personalDetails: {
            fullName: personalDetails.fullName,
            currentStage: personalDetails.currentStage,
            location: personalDetails.location
          },
          interests: careerData.interests,
          strengths: careerData.strengths,
          motivations: careerData.motivations,
          workPreferences: {
            environment: formatWorkEnvironment(careerData.workEnvironment),
            workLifeBalance: formatWorkLifeBalance(careerData.workLifeBalance)
          },
          personalityProfile: generatePersonalityProfile()
        };

        return (
          <DiscoverySummary
            data={summaryData}
            onNext={handleSummaryNext}
            onBack={() => setCurrentStep("personality")}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Progress Header */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="text-center mb-6">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Career Discovery Assessment
          </h1>
          <p className="text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" data-testid="discovery-progress" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step) => (
              <div key={step.key} className={`text-center ${
                currentStepIndex >= step.number - 1 ? 'text-primary font-medium' : ''
              }`}>
                {step.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main data-testid="discovery-main">
        {renderCurrentStep()}
      </main>
    </div>
  );
}