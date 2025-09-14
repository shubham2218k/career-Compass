import { GoogleAuth } from 'google-auth-library';

// Career data specific to Indian job market
export const INDIAN_CAREER_PATHS = {
  technology: [
    {
      title: "Software Developer",
      description: "Create applications, websites, and software solutions",
      skills: ["Programming", "Problem Solving", "Database Management", "Version Control"],
      education: ["Computer Science", "Information Technology", "Software Engineering"],
      avgSalary: "₹4-15 LPA",
      growthRate: "23%",
      companies: ["TCS", "Infosys", "Google", "Microsoft", "Amazon"],
      locations: ["Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai"]
    },
    {
      title: "Data Scientist",
      description: "Analyze complex data to help businesses make decisions",
      skills: ["Python/R", "Statistics", "Machine Learning", "Data Visualization"],
      education: ["Statistics", "Computer Science", "Mathematics", "Analytics"],
      avgSalary: "₹6-25 LPA",
      growthRate: "35%",
      companies: ["Flipkart", "Ola", "Paytm", "Adobe", "IBM"],
      locations: ["Bangalore", "Mumbai", "Delhi", "Pune", "Chennai"]
    },
    {
      title: "DevOps Engineer",
      description: "Bridge development and operations for efficient software delivery",
      skills: ["Cloud Platforms", "Docker", "Kubernetes", "CI/CD", "Automation"],
      education: ["Computer Science", "Information Technology"],
      avgSalary: "₹5-20 LPA",
      growthRate: "30%",
      companies: ["Amazon", "Microsoft", "Zomato", "Swiggy", "PayPal"],
      locations: ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi"]
    }
  ],
  healthcare: [
    {
      title: "Medical Doctor",
      description: "Diagnose and treat patients, promote health and wellness",
      skills: ["Medical Knowledge", "Communication", "Empathy", "Critical Thinking"],
      education: ["MBBS", "MD/MS Specialization"],
      avgSalary: "₹6-50 LPA",
      growthRate: "15%",
      companies: ["AIIMS", "Apollo", "Fortis", "Max Healthcare", "Private Practice"],
      locations: ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata"]
    },
    {
      title: "Physiotherapist",
      description: "Help patients recover from injuries and improve mobility",
      skills: ["Anatomy", "Manual Therapy", "Exercise Prescription", "Patient Care"],
      education: ["BPT", "MPT"],
      avgSalary: "₹3-12 LPA",
      growthRate: "20%",
      companies: ["Hospitals", "Sports Clubs", "Rehabilitation Centers", "Private Practice"],
      locations: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai"]
    }
  ],
  business: [
    {
      title: "Digital Marketing Manager",
      description: "Develop and execute online marketing strategies",
      skills: ["SEO/SEM", "Social Media", "Analytics", "Content Strategy"],
      education: ["Marketing", "Business", "Communications", "Any Graduate + Certification"],
      avgSalary: "₹4-18 LPA",
      growthRate: "25%",
      companies: ["Byju's", "Unacademy", "Zomato", "OYO", "Digital Agencies"],
      locations: ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad"]
    },
    {
      title: "Product Manager",
      description: "Lead product development from conception to launch",
      skills: ["Strategy", "Analytics", "User Research", "Project Management"],
      education: ["Engineering", "MBA", "Business", "Any Graduate + Experience"],
      avgSalary: "₹8-35 LPA",
      growthRate: "19%",
      companies: ["Flipkart", "Amazon", "Paytm", "Ola", "Swiggy"],
      locations: ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"]
    }
  ],
  creative: [
    {
      title: "UI/UX Designer",
      description: "Design user interfaces and experiences for digital products",
      skills: ["Design Tools", "User Research", "Prototyping", "Visual Design"],
      education: ["Design", "Fine Arts", "Psychology", "Any Graduate + Portfolio"],
      avgSalary: "₹3-15 LPA",
      growthRate: "22%",
      companies: ["Zomato", "Swiggy", "Paytm", "Adobe", "Design Studios"],
      locations: ["Bangalore", "Mumbai", "Delhi", "Pune", "Chennai"]
    },
    {
      title: "Content Writer",
      description: "Create engaging content for websites, blogs, and marketing",
      skills: ["Writing", "SEO", "Research", "Content Strategy"],
      education: ["English", "Journalism", "Communications", "Any Graduate"],
      avgSalary: "₹2-10 LPA",
      growthRate: "18%",
      companies: ["Media Houses", "Digital Agencies", "Startups", "Freelance"],
      locations: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai"]
    }
  ]
};

export const SKILL_CATEGORIES = {
  technical: ["Programming", "Data Analysis", "Cloud Computing", "Machine Learning", "Cybersecurity", "Database Management"],
  creative: ["Design", "Writing", "Photography", "Video Editing", "Graphic Design", "UI/UX"],
  business: ["Strategy", "Marketing", "Sales", "Project Management", "Analytics", "Finance"],
  communication: ["Public Speaking", "Writing", "Presentation", "Negotiation", "Team Leadership"],
  analytical: ["Problem Solving", "Critical Thinking", "Research", "Statistics", "Data Interpretation"]
};

interface UserProfile {
  personalDetails: {
    fullName: string;
    currentStage: string;
    location: string;
  };
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

interface CareerRecommendation {
  career: any;
  matchScore: number;
  reasoning: string;
  skillGaps: string[];
  learningPath: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export class AICareerService {
  constructor() {
    // Initialize Google Cloud AI client if credentials are available
  }

  /**
   * Generate personalized career recommendations based on user profile
   */
  async generateCareerRecommendations(userProfile: UserProfile): Promise<CareerRecommendation[]> {
    try {
      // Analyze user profile and match with career paths
      const recommendations: CareerRecommendation[] = [];
      
      // Get all career paths
      const allCareers = [
        ...INDIAN_CAREER_PATHS.technology,
        ...INDIAN_CAREER_PATHS.healthcare,
        ...INDIAN_CAREER_PATHS.business,
        ...INDIAN_CAREER_PATHS.creative
      ];

      // Calculate match scores for each career
      for (const career of allCareers) {
        const matchScore = this.calculateMatchScore(userProfile, career);
        
        if (matchScore > 0.3) { // Only include careers with >30% match
          const skillGaps = this.identifySkillGaps(userProfile.strengths, career.skills);
          const learningPath = this.generateLearningPath(career, skillGaps, userProfile.personalDetails.currentStage);
          const reasoning = this.generateReasoning(userProfile, career, matchScore);

          recommendations.push({
            career,
            matchScore,
            reasoning,
            skillGaps,
            learningPath
          });
        }
      }

      // Sort by match score and return top 5
      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

    } catch (error) {
      console.error('Error generating career recommendations:', error);
      throw new Error('Failed to generate career recommendations');
    }
  }

  /**
   * Calculate match score between user profile and career
   */
  private calculateMatchScore(userProfile: UserProfile, career: any): number {
    let score = 0;
    let totalFactors = 0;

    // Interest alignment (30% weight)
    const interestMatch = this.calculateInterestMatch(userProfile.interests, career);
    score += interestMatch * 0.3;
    totalFactors += 0.3;

    // Skills alignment (25% weight)
    const skillMatch = this.calculateSkillMatch(userProfile.strengths, career.skills);
    score += skillMatch * 0.25;
    totalFactors += 0.25;

    // Personality fit (20% weight)
    const personalityMatch = this.calculatePersonalityMatch(userProfile.personalityProfile, career);
    score += personalityMatch * 0.2;
    totalFactors += 0.2;

    // Work environment preference (15% weight)
    const environmentMatch = this.calculateEnvironmentMatch(userProfile.workPreferences, career);
    score += environmentMatch * 0.15;
    totalFactors += 0.15;

    // Location preference (10% weight)
    const locationMatch = this.calculateLocationMatch(userProfile.personalDetails.location, career.locations);
    score += locationMatch * 0.1;
    totalFactors += 0.1;

    return score / totalFactors;
  }

  private calculateInterestMatch(interests: string[], career: any): number {
    const careerKeywords = [
      career.title.toLowerCase(),
      career.description.toLowerCase(),
      ...career.skills.map((s: string) => s.toLowerCase())
    ].join(' ');

    let matches = 0;
    for (const interest of interests) {
      if (careerKeywords.includes(interest.toLowerCase())) {
        matches++;
      }
    }

    return interests.length > 0 ? matches / interests.length : 0;
  }

  private calculateSkillMatch(userSkills: string[], careerSkills: string[]): number {
    let matches = 0;
    for (const userSkill of userSkills) {
      for (const careerSkill of careerSkills) {
        if (userSkill.toLowerCase().includes(careerSkill.toLowerCase()) ||
            careerSkill.toLowerCase().includes(userSkill.toLowerCase())) {
          matches++;
          break;
        }
      }
    }

    return careerSkills.length > 0 ? matches / careerSkills.length : 0;
  }

  private calculatePersonalityMatch(personality: any, career: any): number {
    // Simple personality matching based on career requirements
    let score = 0.5; // Base score

    if (career.title.includes('Manager') || career.title.includes('Lead')) {
      if (personality.primaryTraits.includes('Leadership-oriented')) score += 0.3;
      if (personality.communicationStyle.includes('presenter')) score += 0.2;
    }

    if (career.title.includes('Developer') || career.title.includes('Engineer')) {
      if (personality.primaryTraits.includes('Analytical')) score += 0.3;
      if (personality.workStyle.includes('thorough')) score += 0.2;
    }

    if (career.title.includes('Designer') || career.title.includes('Creative')) {
      if (personality.primaryTraits.includes('Innovative')) score += 0.3;
      if (personality.communicationStyle.includes('Visual')) score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private calculateEnvironmentMatch(workPreferences: any, career: any): number {
    // For now, return a moderate match since we don't have detailed environment data for careers
    return 0.7;
  }

  private calculateLocationMatch(userLocation: string, careerLocations: string[]): number {
    const userLocationLower = userLocation.toLowerCase();
    
    for (const location of careerLocations) {
      if (location.toLowerCase().includes(userLocationLower) ||
          userLocationLower.includes(location.toLowerCase())) {
        return 1.0;
      }
    }

    // Check for major city matches
    const majorCities = ['bangalore', 'mumbai', 'delhi', 'chennai', 'pune', 'hyderabad', 'kolkata'];
    const userInMajorCity = majorCities.some(city => userLocationLower.includes(city));
    
    if (userInMajorCity) return 0.8;
    return 0.4; // Smaller cities still have some opportunities
  }

  private identifySkillGaps(userSkills: string[], careerSkills: string[]): string[] {
    const gaps: string[] = [];
    
    for (const careerSkill of careerSkills) {
      const hasSkill = userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(careerSkill.toLowerCase()) ||
        careerSkill.toLowerCase().includes(userSkill.toLowerCase())
      );
      
      if (!hasSkill) {
        gaps.push(careerSkill);
      }
    }

    return gaps;
  }

  private generateLearningPath(career: any, skillGaps: string[], currentStage: string): any {
    const learningPath = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };

    // Immediate (1-3 months)
    learningPath.immediate = [
      `Research ${career.title} role and responsibilities`,
      "Complete online courses in basic skills",
      "Join relevant communities and forums"
    ];

    // Short-term (3-12 months)
    if (skillGaps.length > 0) {
      learningPath.shortTerm = [
        ...skillGaps.slice(0, 2).map(skill => `Learn ${skill} through online courses`),
        "Build a portfolio or project showcase",
        "Connect with professionals in the field"
      ];
    }

    // Long-term (1-3 years)
    if (currentStage.includes('10th') || currentStage.includes('12th')) {
      learningPath.longTerm = [
        `Pursue ${career.education[0]} education`,
        "Gain internship experience",
        "Develop leadership and communication skills"
      ];
    } else {
      learningPath.longTerm = [
        "Gain professional experience through internships or entry-level positions",
        "Pursue advanced certifications or specializations",
        "Build a professional network in the industry"
      ];
    }

    return learningPath;
  }

  private generateReasoning(userProfile: UserProfile, career: any, matchScore: number): string {
    const reasons: string[] = [];

    // Add interest-based reasoning
    const matchingInterests = userProfile.interests.filter(interest => 
      career.title.toLowerCase().includes(interest.toLowerCase()) ||
      career.description.toLowerCase().includes(interest.toLowerCase())
    );

    if (matchingInterests.length > 0) {
      reasons.push(`Your interests in ${matchingInterests.join(', ')} align well with this role`);
    }

    // Add skills-based reasoning
    const matchingSkills = userProfile.strengths.filter(skill =>
      career.skills.some((careerSkill: string) =>
        skill.toLowerCase().includes(careerSkill.toLowerCase()) ||
        careerSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (matchingSkills.length > 0) {
      reasons.push(`Your strengths in ${matchingSkills.join(', ')} are valuable for this career`);
    }

    // Add location-based reasoning
    if (career.locations.some((loc: string) => 
      userProfile.personalDetails.location.toLowerCase().includes(loc.toLowerCase())
    )) {
      reasons.push(`Strong job market in your location (${userProfile.personalDetails.location})`);
    }

    // Add growth potential
    reasons.push(`${career.growthRate} expected growth rate with competitive salary range of ${career.avgSalary}`);

    return reasons.join('. ') + '.';
  }

  /**
   * Get skills assessment questions for a specific domain
   */
  async getSkillsAssessment(domain: string): Promise<any[]> {
    const assessmentQuestions = {
      technology: [
        {
          id: "tech-1",
          question: "How comfortable are you with programming concepts?",
          type: "scale",
          scale: { min: 1, max: 5, labels: ["Never tried", "Basic understanding", "Comfortable", "Advanced", "Expert"] }
        },
        {
          id: "tech-2", 
          question: "Which programming languages have you worked with?",
          type: "multiple-choice",
          options: ["Python", "Java", "JavaScript", "C++", "C#", "Go", "None"]
        },
        {
          id: "tech-3",
          question: "How do you prefer to solve complex problems?",
          type: "single-choice",
          options: ["Break into smaller parts", "Research similar solutions", "Collaborate with others", "Trial and error"]
        }
      ],
      business: [
        {
          id: "biz-1",
          question: "How comfortable are you with data analysis and spreadsheets?",
          type: "scale",
          scale: { min: 1, max: 5, labels: ["Never used", "Basic", "Comfortable", "Advanced", "Expert"] }
        },
        {
          id: "biz-2",
          question: "Which business areas interest you most?",
          type: "multiple-choice", 
          options: ["Marketing", "Sales", "Finance", "Operations", "Strategy", "Human Resources"]
        }
      ],
      creative: [
        {
          id: "creative-1",
          question: "Which creative tools have you used?",
          type: "multiple-choice",
          options: ["Photoshop", "Illustrator", "Figma", "Canva", "Video editing software", "None"]
        },
        {
          id: "creative-2",
          question: "How do you approach creative projects?",
          type: "single-choice",
          options: ["Start with inspiration and mood boards", "Research and analyze examples", "Dive right in and iterate", "Plan thoroughly before creating"]
        }
      ]
    };

    return assessmentQuestions[domain as keyof typeof assessmentQuestions] || [];
  }

  /**
   * Analyze job market trends for specific careers
   */
  async getJobMarketTrends(careerTitle: string): Promise<any> {
    // This would integrate with job portals APIs in a real implementation
    // For now, return mock data based on career title
    
    const trendData = {
      demandLevel: "High",
      salaryTrend: "Increasing",
      topSkillsInDemand: ["Communication", "Problem Solving"],
      emergingTechnologies: [],
      jobOpenings: 0,
      topCompanies: []
    };

    // Find the career in our data
    const allCareers = [
      ...INDIAN_CAREER_PATHS.technology,
      ...INDIAN_CAREER_PATHS.healthcare, 
      ...INDIAN_CAREER_PATHS.business,
      ...INDIAN_CAREER_PATHS.creative
    ];

    const career = allCareers.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());
    
    if (career) {
      trendData.topSkillsInDemand = career.skills;
      trendData.topCompanies = career.companies;
      trendData.jobOpenings = Math.floor(Math.random() * 1000) + 100; // Mock data
      
      if (career.title.includes('Data') || career.title.includes('AI')) {
        trendData.emergingTechnologies = ['AI/ML', 'Big Data', 'Cloud Computing'];
      }
      
      if (career.title.includes('Digital') || career.title.includes('Software')) {
        trendData.emergingTechnologies = ['Cloud Native', 'DevOps', 'Microservices'];
      }
    }

    return trendData;
  }
}

export const aiCareerService = new AICareerService();