import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { Code, Briefcase, Palette, Brain, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  type: "scale" | "single-choice" | "multiple-choice";
  options?: string[];
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
}

interface SkillsAssessmentProps {
  onComplete: (results: any) => void;
  onBack?: () => void;
}

async function fetchAssessmentQuestions(domain: string): Promise<AssessmentQuestion[]> {
  const response = await fetch(`/api/skills-assessment/${domain}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch assessment questions');
  }
  
  const data = await response.json();
  return data.questions;
}

const SKILL_DOMAINS = [
  {
    id: 'technology',
    title: 'Technology',
    description: 'Programming, software development, data analysis',
    icon: Code,
    color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Management, strategy, entrepreneurship, finance',
    icon: Briefcase,
    color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  },
  {
    id: 'creative',
    title: 'Creative',
    description: 'Design, writing, media, arts',
    icon: Palette,
    color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
  }
];

export default function SkillsAssessment({ onComplete, onBack }: SkillsAssessmentProps) {
  const [currentStep, setCurrentStep] = useState<'domain-selection' | 'assessment' | 'results'>('domain-selection');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [domainResults, setDomainResults] = useState<Record<string, any>>({});
  const [completedDomains, setCompletedDomains] = useState<string[]>([]);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['assessment-questions', currentDomain],
    queryFn: () => fetchAssessmentQuestions(currentDomain),
    enabled: !!currentDomain && currentStep === 'assessment',
  });

  const handleDomainSelection = () => {
    if (selectedDomains.length === 0) return;
    
    setCurrentDomain(selectedDomains[0]);
    setCurrentStep('assessment');
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!questions) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete current domain
      finishCurrentDomain();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishCurrentDomain = () => {
    const domainAnswers = questions?.reduce((acc, q) => {
      acc[q.id] = answers[q.id];
      return acc;
    }, {} as Record<string, any>) || {};

    setDomainResults(prev => ({
      ...prev,
      [currentDomain]: domainAnswers
    }));

    setCompletedDomains(prev => [...prev, currentDomain]);

    // Move to next domain or show results
    const remainingDomains = selectedDomains.filter(d => d !== currentDomain && !completedDomains.includes(d));
    
    if (remainingDomains.length > 0) {
      setCurrentDomain(remainingDomains[0]);
      setCurrentQuestionIndex(0);
      setAnswers({});
    } else {
      setCurrentStep('results');
    }
  };

  const calculateDomainScore = (domain: string, domainAnswers: Record<string, any>) => {
    // Simple scoring logic - in a real app this would be more sophisticated
    const values = Object.values(domainAnswers);
    const numericValues = values.filter(v => typeof v === 'number');
    
    if (numericValues.length > 0) {
      const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      return Math.round((average / 5) * 100); // Convert to percentage
    }
    
    return 60; // Default score
  };

  const generateSkillProfile = () => {
    const profile: Record<string, any> = {};
    
    for (const [domain, domainAnswers] of Object.entries(domainResults)) {
      const score = calculateDomainScore(domain, domainAnswers);
      const domainInfo = SKILL_DOMAINS.find(d => d.id === domain);
      
      profile[domain] = {
        title: domainInfo?.title,
        score: score,
        level: score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : score >= 40 ? 'Beginner' : 'Novice',
        answers: domainAnswers
      };
    }
    
    return profile;
  };

  const handleComplete = () => {
    const skillProfile = generateSkillProfile();
    onComplete({
      domains: selectedDomains,
      results: skillProfile,
      detailedAnswers: domainResults
    });
  };

  if (currentStep === 'domain-selection') {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Areas of Interest</CardTitle>
            <CardDescription>
              Select one or more areas where you'd like to assess your skills. This will help us provide more accurate career recommendations.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {SKILL_DOMAINS.map((domain) => {
                const Icon = domain.icon;
                const isSelected = selectedDomains.includes(domain.id);
                
                return (
                  <Card 
                    key={domain.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDomains(prev => prev.filter(d => d !== domain.id));
                      } else {
                        setSelectedDomains(prev => [...prev, domain.id]);
                      }
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full ${domain.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold mb-2">{domain.title}</h3>
                      <p className="text-sm text-muted-foreground">{domain.description}</p>
                      {isSelected && (
                        <Badge className="mt-3">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleDomainSelection}
                disabled={selectedDomains.length === 0}
              >
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'assessment') {
    if (isLoading || !questions) {
      return (
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading assessment questions...</p>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const domainInfo = SKILL_DOMAINS.find(d => d.id === currentDomain);

    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {domainInfo && (
                <>
                  <domainInfo.icon className="w-5 h-5" />
                  <span className="font-medium">{domainInfo.title} Assessment</span>
                </>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
              {completedDomains.length > 0 && ` • ${completedDomains.length} domain(s) completed`}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          
          <CardContent>
            {currentQuestion.type === 'scale' && currentQuestion.scale && (
              <div className="space-y-4">
                <RadioGroup
                  value={currentAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                >
                  {Array.from({ length: currentQuestion.scale.max - currentQuestion.scale.min + 1 }, (_, i) => {
                    const value = currentQuestion.scale!.min + i;
                    const label = currentQuestion.scale!.labels[i];
                    
                    return (
                      <div key={value} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                        <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                        <Label htmlFor={`option-${value}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <span>{label}</span>
                            <span className="text-sm text-muted-foreground">{value}</span>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {currentQuestion.type === 'single-choice' && currentQuestion.options && (
              <RadioGroup
                value={currentAnswer}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                    <Checkbox
                      id={`option-${index}`}
                      checked={(currentAnswer || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentSelections = currentAnswer || [];
                        if (checked) {
                          handleAnswer(currentQuestion.id, [...currentSelections, option]);
                        } else {
                          handleAnswer(currentQuestion.id, currentSelections.filter((item: string) => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  selectedDomains.indexOf(currentDomain) === selectedDomains.length - 1 ? 'Finish' : 'Next Domain'
                ) : (
                  'Next Question'
                )}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results') {
    const skillProfile = generateSkillProfile();
    
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Skills Assessment Results</CardTitle>
            <CardDescription>
              Here's a summary of your skills across different domains. This will help generate better career recommendations.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(skillProfile).map(([domainId, result]) => {
                const domainInfo = SKILL_DOMAINS.find(d => d.id === domainId);
                const Icon = domainInfo?.icon || Brain;
                
                return (
                  <Card key={domainId}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full ${domainInfo?.color || 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold mb-2">{result.title}</h3>
                      <div className="space-y-2">
                        <Progress value={result.score} className="h-2" />
                        <p className="text-2xl font-bold text-primary">{result.score}%</p>
                        <Badge variant={result.score >= 70 ? 'default' : 'secondary'}>
                          {result.level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Alert className="mb-6">
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Your skills assessment is complete! These results will be used to provide you with personalized career recommendations that match your strengths and interests.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('domain-selection')}>
                Retake Assessment
              </Button>
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Continue to Recommendations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}