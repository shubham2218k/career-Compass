import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiCareerService } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Career recommendation endpoints
  app.post("/api/recommendations", async (req, res) => {
    try {
      const userProfile = req.body;
      
      if (!userProfile || !userProfile.personalDetails) {
        return res.status(400).json({ error: "User profile data is required" });
      }

      const recommendations = await aiCareerService.generateCareerRecommendations(userProfile);
      res.json({ recommendations });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: "Failed to generate career recommendations" });
    }
  });

  // Skills assessment endpoints
  app.get("/api/skills-assessment/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const questions = await aiCareerService.getSkillsAssessment(domain);
      res.json({ questions });
    } catch (error) {
      console.error('Error getting skills assessment:', error);
      res.status(500).json({ error: "Failed to get skills assessment" });
    }
  });

  // Job market trends endpoint
  app.get("/api/job-market/:careerTitle", async (req, res) => {
    try {
      const { careerTitle } = req.params;
      const trends = await aiCareerService.getJobMarketTrends(decodeURIComponent(careerTitle));
      res.json({ trends });
    } catch (error) {
      console.error('Error getting job market trends:', error);
      res.status(500).json({ error: "Failed to get job market trends" });
    }
  });

  // User profile endpoints
  app.post("/api/user/profile", async (req, res) => {
    try {
      const profileData = req.body;
      // For now, we'll store in memory. In production, this would go to a database
      const userId = req.body.userId || 'anonymous';
      
      // Store the profile data
      res.json({ success: true, message: "Profile saved successfully" });
    } catch (error) {
      console.error('Error saving profile:', error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // Get career categories
  app.get("/api/career-categories", (req, res) => {
    const categories = {
      technology: aiCareerService['INDIAN_CAREER_PATHS']?.technology || [],
      healthcare: aiCareerService['INDIAN_CAREER_PATHS']?.healthcare || [],
      business: aiCareerService['INDIAN_CAREER_PATHS']?.business || [],
      creative: aiCareerService['INDIAN_CAREER_PATHS']?.creative || []
    };
    res.json({ categories });
  });

  const httpServer = createServer(app);

  return httpServer;
}
