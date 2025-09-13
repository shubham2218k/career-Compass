import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { BrainIcon } from "lucide-react";

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

interface CareerSurveyProps {
  onNext: (data: CareerSurveyData) => void;
  onBack: () => void;
}

export default function CareerSurvey({ onNext, onBack }: CareerSurveyProps) {
  const [formData, setFormData] = useState<CareerSurveyData>({
    interests: [],
    strengths: [],
    motivations: [],
    workEnvironment: "",
    workLifeBalance: "",
    careerGoals: "",
    challenges: "",
    inspiration: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const interestOptions = [
    "Technology & Programming", "Creative Arts & Design", "Business & Entrepreneurship",
    "Healthcare & Medicine", "Education & Teaching", "Science & Research",
    "Engineering & Manufacturing", "Sales & Marketing", "Finance & Banking",
    "Social Work & Non-profit", "Media & Communications", "Sports & Fitness",
    "Environment & Sustainability", "Law & Legal Services", "Travel & Tourism"
  ];

  const strengthOptions = [
    "Problem Solving", "Leadership", "Communication", "Creativity",
    "Analytical Thinking", "Team Collaboration", "Time Management",
    "Attention to Detail", "Adaptability", "Technical Skills",
    "Public Speaking", "Writing", "Mathematical Skills", "Empathy"
  ];

  const motivationOptions = [
    "Making a positive impact", "Financial security", "Creative expression",
    "Helping others", "Personal growth", "Recognition & status",
    "Work-life balance", "Intellectual challenges", "Independence & autonomy",
    "Building something meaningful", "Continuous learning", "Stability & security"
  ];

  const workEnvironmentOptions = [
    { value: "office", label: "Traditional office environment" },
    { value: "remote", label: "Remote/Work from home" },
    { value: "hybrid", label: "Hybrid (mix of office and remote)" },
    { value: "fieldwork", label: "Field work/Travel required" },
    { value: "laboratory", label: "Laboratory/Research facility" },
    { value: "startup", label: "Fast-paced startup environment" },
    { value: "corporate", label: "Large corporate setting" },
    { value: "creative", label: "Creative/Studio environment" }
  ];

  const workLifeBalanceOptions = [
    { value: "high-demanding", label: "High-demanding (60+ hours/week) for high rewards" },
    { value: "standard", label: "Standard work hours (40-50 hours/week)" },
    { value: "flexible", label: "Flexible hours with good work-life balance" },
    { value: "part-time", label: "Part-time or project-based work" }
  ];

  const handleCheckboxChange = (field: keyof Pick<CareerSurveyData, 'interests' | 'strengths' | 'motivations'>, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleTextChange = (field: keyof CareerSurveyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.interests.length === 0) {
      newErrors.interests = "Please select at least one area of interest";
    }
    if (formData.strengths.length === 0) {
      newErrors.strengths = "Please select at least one strength";
    }
    if (formData.motivations.length === 0) {
      newErrors.motivations = "Please select at least one motivation";
    }
    if (!formData.workEnvironment) {
      newErrors.workEnvironment = "Please select a work environment preference";
    }
    if (!formData.workLifeBalance) {
      newErrors.workLifeBalance = "Please select a work-life balance preference";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BrainIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">Career Discovery Questions</CardTitle>
          <CardDescription>
            Help us understand your interests, strengths, and career preferences to provide personalized guidance.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Interests Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">1. What areas interest you most? *</Label>
              <p className="text-sm text-muted-foreground mt-1">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("interests", interest, checked as boolean)
                    }
                    data-testid={`checkbox-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <Label 
                    htmlFor={`interest-${interest}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
            {errors.interests && (
              <p className="text-sm text-destructive">{errors.interests}</p>
            )}
          </div>

          {/* Strengths Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">2. What are your key strengths? *</Label>
              <p className="text-sm text-muted-foreground mt-1">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {strengthOptions.map((strength) => (
                <div key={strength} className="flex items-center space-x-2">
                  <Checkbox
                    id={`strength-${strength}`}
                    checked={formData.strengths.includes(strength)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("strengths", strength, checked as boolean)
                    }
                    data-testid={`checkbox-strength-${strength.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <Label 
                    htmlFor={`strength-${strength}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {strength}
                  </Label>
                </div>
              ))}
            </div>
            {errors.strengths && (
              <p className="text-sm text-destructive">{errors.strengths}</p>
            )}
          </div>

          {/* Motivations Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">3. What motivates you in your career? *</Label>
              <p className="text-sm text-muted-foreground mt-1">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {motivationOptions.map((motivation) => (
                <div key={motivation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`motivation-${motivation}`}
                    checked={formData.motivations.includes(motivation)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("motivations", motivation, checked as boolean)
                    }
                    data-testid={`checkbox-motivation-${motivation.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <Label 
                    htmlFor={`motivation-${motivation}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {motivation}
                  </Label>
                </div>
              ))}
            </div>
            {errors.motivations && (
              <p className="text-sm text-destructive">{errors.motivations}</p>
            )}
          </div>

          {/* Work Environment */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">4. What work environment do you prefer? *</Label>
            <RadioGroup
              value={formData.workEnvironment}
              onValueChange={(value) => handleTextChange("workEnvironment", value)}
              data-testid="radio-work-environment"
            >
              {workEnvironmentOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`env-${option.value}`} />
                  <Label htmlFor={`env-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.workEnvironment && (
              <p className="text-sm text-destructive">{errors.workEnvironment}</p>
            )}
          </div>

          {/* Work-Life Balance */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">5. What's your ideal work-life balance? *</Label>
            <RadioGroup
              value={formData.workLifeBalance}
              onValueChange={(value) => handleTextChange("workLifeBalance", value)}
              data-testid="radio-work-life-balance"
            >
              {workLifeBalanceOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`balance-${option.value}`} />
                  <Label htmlFor={`balance-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.workLifeBalance && (
              <p className="text-sm text-destructive">{errors.workLifeBalance}</p>
            )}
          </div>

          {/* Career Goals */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="careerGoals" className="text-lg font-semibold">
                6. What are your long-term career goals?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Optional - share your aspirations</p>
            </div>
            <Textarea
              id="careerGoals"
              placeholder="Describe your career aspirations, where you see yourself in 5-10 years, or specific roles you're interested in..."
              value={formData.careerGoals}
              onChange={(e) => handleTextChange("careerGoals", e.target.value)}
              rows={3}
              data-testid="textarea-career-goals"
            />
          </div>

          {/* Challenges */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="challenges" className="text-lg font-semibold">
                7. What career challenges are you facing?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Optional - help us understand your concerns</p>
            </div>
            <Textarea
              id="challenges"
              placeholder="Share any career-related challenges, uncertainties, or areas where you need guidance..."
              value={formData.challenges}
              onChange={(e) => handleTextChange("challenges", e.target.value)}
              rows={3}
              data-testid="textarea-challenges"
            />
          </div>

          {/* Inspiration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="inspiration" className="text-lg font-semibold">
                8. Who or what inspires your career choices?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Optional - role models, experiences, or values</p>
            </div>
            <Textarea
              id="inspiration"
              placeholder="Share what or who inspires you - role models, personal experiences, values, or life events..."
              value={formData.inspiration}
              onChange={(e) => handleTextChange("inspiration", e.target.value)}
              rows={3}
              data-testid="textarea-inspiration"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              data-testid="button-back"
            >
              Back to Personal Details
            </Button>
            
            <Button 
              onClick={handleSubmit}
              data-testid="button-next"
            >
              Continue to Personality Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}