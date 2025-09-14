import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, TrendingUp, MapPin, Building2, Users, Clock, BookOpen, Target, ArrowRight, Star } from "lucide-react";

interface CareerRecommendation {
  career: {
    title: string;
    description: string;
    skills: string[];
    education: string[];
    avgSalary: string;
    growthRate: string;
    companies: string[];
    locations: string[];
  };
  matchScore: number;
  reasoning: string;
  skillGaps: string[];
  learningPath: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

interface JobMarketTrends {
  demandLevel: string;
  salaryTrend: string;
  topSkillsInDemand: string[];
  emergingTechnologies: string[];
  jobOpenings: number;
  topCompanies: string[];
}

async function fetchRecommendations(userProfile: any): Promise<CareerRecommendation[]> {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userProfile),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  
  const data = await response.json();
  return data.recommendations;
}

async function fetchJobMarketTrends(careerTitle: string): Promise<JobMarketTrends> {
  const response = await fetch(`/api/job-market/${encodeURIComponent(careerTitle)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch job market trends');
  }
  
  const data = await response.json();
  return data.trends;
}

export default function Recommendations() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    try {
      const savedData = localStorage.getItem('discoveryProgress');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        if (parsed.personalDetails && parsed.careerData && parsed.personalityData) {
          // Transform the data to match the expected format
          const profile = {
            personalDetails: {
              fullName: parsed.personalDetails.fullName,
              currentStage: parsed.personalDetails.currentStage,
              location: parsed.personalDetails.location
            },
            interests: parsed.careerData.interests || [],
            strengths: parsed.careerData.strengths || [],
            motivations: parsed.careerData.motivations || [],
            workPreferences: {
              environment: parsed.careerData.workEnvironment || "",
              workLifeBalance: parsed.careerData.workLifeBalance || ""
            },
            personalityProfile: {
              primaryTraits: ["Self-motivated", "Curious"], // Default traits
              workStyle: "Balanced approach",
              communicationStyle: "Effective communicator"
            }
          };
          
          setUserProfile(profile);
        }
      }
    } catch (error) {
      console.error('Error loading discovery data:', error);
    }
  }, [isAuthenticated, setLocation]);

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', userProfile],
    queryFn: () => fetchRecommendations(userProfile),
    enabled: !!userProfile,
  });

  const { data: jobTrends } = useQuery({
    queryKey: ['jobTrends', selectedCareer?.career.title],
    queryFn: () => fetchJobMarketTrends(selectedCareer?.career.title || ''),
    enabled: !!selectedCareer,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your profile and generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Unable to generate recommendations. Please complete your discovery assessment first.
              <Button variant="link" className="pl-2" onClick={() => setLocation("/discovery")}>
                Go to Discovery
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            Your Personalized Career Recommendations
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Based on your interests, skills, and personality profile, here are the career paths that best match your unique potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recommendations List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Top Career Matches</h2>
            
            {recommendations.map((recommendation, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCareer?.career.title === recommendation.career.title ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCareer(recommendation)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        {recommendation.career.title}
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(recommendation.matchScore * 100)}% match
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-base">
                        {recommendation.career.description}
                      </CardDescription>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Match Score Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Match Score</span>
                      <span>{Math.round(recommendation.matchScore * 100)}%</span>
                    </div>
                    <Progress value={recommendation.matchScore * 100} className="h-2" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {recommendation.reasoning}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>{recommendation.career.growthRate} growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>{recommendation.career.avgSalary}</span>
                    </div>
                  </div>
                  
                  {/* Skills Preview */}
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.career.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {recommendation.career.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recommendation.career.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="mt-4 w-full justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCareer(recommendation);
                    }}
                  >
                    View Full Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column - Selected Career Details */}
          <div className="lg:col-span-1">
            {selectedCareer ? (
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {selectedCareer.career.title}
                    </CardTitle>
                    <CardDescription>
                      Detailed insights and learning path
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                        <TabsTrigger value="learning" className="text-xs">Learning</TabsTrigger>
                        <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-4 space-y-4">
                        {/* Skills Required */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Skills Required
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.career.skills.map((skill, idx) => (
                              <Badge 
                                key={idx} 
                                variant={selectedCareer.skillGaps.includes(skill) ? "destructive" : "default"}
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Education Paths
                          </h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {selectedCareer.career.education.map((edu, idx) => (
                              <div key={idx}>• {edu}</div>
                            ))}
                          </div>
                        </div>

                        {/* Top Companies */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Top Companies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.career.companies.slice(0, 4).map((company, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Locations */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Key Locations
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            {selectedCareer.career.locations.join(', ')}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="learning" className="mt-4 space-y-4">
                        {/* Learning Path */}
                        <div className="space-y-4">
                          {selectedCareer.skillGaps.length > 0 && (
                            <Alert>
                              <Lightbulb className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                Focus on developing: {selectedCareer.skillGaps.slice(0, 3).join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Immediate Steps */}
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Immediate (1-3 months)
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {selectedCareer.learningPath.immediate.map((step, idx) => (
                                <li key={idx}>• {step}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Short Term */}
                          <div>
                            <h4 className="font-medium mb-2">Short Term (3-12 months)</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {selectedCareer.learningPath.shortTerm.map((step, idx) => (
                                <li key={idx}>• {step}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Long Term */}
                          <div>
                            <h4 className="font-medium mb-2">Long Term (1-3 years)</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {selectedCareer.learningPath.longTerm.map((step, idx) => (
                                <li key={idx}>• {step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="market" className="mt-4 space-y-4">
                        {jobTrends && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-sm font-medium text-green-700 dark:text-green-400">Demand</div>
                                <div className="text-lg font-bold text-green-800 dark:text-green-300">{jobTrends.demandLevel}</div>
                              </div>
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Openings</div>
                                <div className="text-lg font-bold text-blue-800 dark:text-blue-300">{jobTrends.jobOpenings.toLocaleString()}</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Salary Trend</h4>
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                                {jobTrends.salaryTrend}
                              </Badge>
                            </div>

                            {jobTrends.emergingTechnologies.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Emerging Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                  {jobTrends.emergingTechnologies.map((tech, idx) => (
                                    <Badge key={idx} className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a career recommendation to view detailed insights and learning path.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}