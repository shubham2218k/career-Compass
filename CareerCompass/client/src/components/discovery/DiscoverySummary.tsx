import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, UserCheck } from "lucide-react";

interface PersonalDetails {
  fullName: string;
  currentStage: string;
  location: string;
}

interface SummaryData {
  personalDetails: PersonalDetails;
  interests: string[];
  strengths: string[];
  motivations: string[];
  workPreferences: {
    environment: string;
    workLifeBalance: string;
  };
  personalityProfile: {
    primaryTraits: string[];
    workStyle: string;
    communicationStyle: string;
  };
}

interface DiscoverySummaryProps {
  data: SummaryData;
  onNext: () => void;
  onBack: () => void;
}

export default function DiscoverySummary({ data, onNext, onBack }: DiscoverySummaryProps) {
  const formatStageLabel = (stage: string) => {
    const stageMap: Record<string, string> = {
      "after-10th": "Completed 10th Grade",
      "after-12th": "Completed 12th Grade", 
      "undergraduate": "Undergraduate Student",
      "graduate": "Graduate",
      "postgraduate": "Postgraduate",
      "working-professional": "Working Professional",
      "career-changer": "Looking for Career Change",
      "other": "Other"
    };
    return stageMap[stage] || stage;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-heading text-green-700 dark:text-green-400">
            Discovery Complete! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Congratulations! You've completed the first step of your career journey. 
            Here's a summary of your profile.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Personal Information */}
          <div className="bg-accent/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Your Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {data.personalDetails.fullName}
              </div>
              <div>
                <span className="font-medium">Current Stage:</span> {formatStageLabel(data.personalDetails.currentStage)}
              </div>
              {data.personalDetails.location && (
                <div>
                  <span className="font-medium">Location:</span> {data.personalDetails.location}
                </div>
              )}
            </div>
          </div>

          {/* Career Interests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">🎯 Your Career Interests</h3>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Key Strengths */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">💪 Your Key Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((strength) => (
                <Badge key={strength} variant="outline" className="text-sm">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Career Motivations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">🚀 What Motivates You</h3>
            <div className="flex flex-wrap gap-2">
              {data.motivations.map((motivation) => (
                <Badge key={motivation} variant="default" className="text-sm">
                  {motivation}
                </Badge>
              ))}
            </div>
          </div>

          {/* Work Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">🏢 Your Work Preferences</h3>
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Preferred Environment:</span> {data.workPreferences.environment}
              </div>
              <div className="text-sm">
                <span className="font-medium">Work-Life Balance:</span> {data.workPreferences.workLifeBalance}
              </div>
            </div>
          </div>

          {/* Personality Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">✨ Your Personality Profile</h3>
            <div className="bg-card border rounded-lg p-4 space-y-3">
              <div>
                <span className="font-medium text-sm">Primary Traits:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.personalityProfile.primaryTraits.map((trait) => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Work Style:</span> {data.personalityProfile.workStyle}
              </div>
              <div className="text-sm">
                <span className="font-medium">Communication Style:</span> {data.personalityProfile.communicationStyle}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-3">🎯 What's Next?</h3>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>• We'll create a personalized learning path based on your profile</p>
              <p>• Get access to curated resources matching your interests</p>
              <p>• Connect with mentors in your areas of interest</p>
              <p>• Track your progress and celebrate milestones</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              data-testid="button-back"
            >
              Review Responses
            </Button>
            
            <Button 
              onClick={onNext}
              data-testid="button-continue-journey"
              className="gap-2"
            >
              Continue Your Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}