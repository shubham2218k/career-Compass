import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiCareerService } from "./ai-service";
import { openaiService } from "./openai-service";
import { insertChatMessageSchema, insertChatSessionSchema } from "@shared/schema";

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

  // Chat API Routes
  
  // Create new chat session
  app.post("/api/chat/new-session", async (req, res) => {
    try {
      // For demo purposes, using a mock user ID. In production, get from auth session
      const userId = "demo-user-1";
      
      const session = await storage.createChatSession({
        userId,
        title: "New Chat"
      });
      
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  // Get chat sessions for user
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      // For demo purposes, using a mock user ID
      const userId = "demo-user-1";
      
      const sessions = await storage.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      res.status(500).json({ error: "Failed to get chat sessions" });
    }
  });

  // Get messages for a chat session
  app.get("/api/chat/messages/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      res.status(500).json({ error: "Failed to get chat messages" });
    }
  });

  // Send a chat message
  app.post("/api/chat/send", async (req, res) => {
    try {
      const { content, sessionId } = req.body;
      
      if (!content?.trim()) {
        return res.status(400).json({ error: "Message content is required" });
      }

      // For demo purposes, using a mock user
      const userId = "demo-user-1";
      let currentSessionId = sessionId;

      // Create user if doesn't exist
      let user = await storage.getUser(userId);
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password"
        });
      }

      // Check monthly prompt limit
      const now = new Date();
      const lastReset = new Date(user.lastPromptReset);
      const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
      
      if (isNewMonth) {
        user = await storage.updateUser(userId, {
          monthlyPromptCount: 0,
          lastPromptReset: now
        });
      }

      if (user.monthlyPromptCount >= 100) {
        return res.status(429).json({ error: "Monthly prompt limit reached" });
      }

      // Create session if not provided
      if (!currentSessionId) {
        const session = await storage.createChatSession({
          userId,
          title: content.slice(0, 50) + (content.length > 50 ? "..." : "")
        });
        currentSessionId = session.id;
      }

      // Moderate content
      const moderation = await openaiService.moderateContent(content);
      if (moderation.flagged) {
        return res.status(400).json({ error: "Message contains inappropriate content" });
      }

      // Save user message
      await storage.createChatMessage({
        userId,
        content,
        role: "user",
        metadata: { sessionId: currentSessionId }
      });

      // Get conversation history for context
      const previousMessages = await storage.getChatMessages(currentSessionId);
      
      // Generate AI response
      const aiResponse = await openaiService.generateChatResponse(content, user, {
        currentPage: req.headers.referer?.includes('/ai-chat') ? 'ai-chat' : undefined,
        previousMessages: previousMessages.slice(-10) // Last 10 messages for context
      });

      // Save AI response
      await storage.createChatMessage({
        userId,
        content: aiResponse,
        role: "assistant",
        metadata: { sessionId: currentSessionId }
      });

      // Update user prompt count
      await storage.updateUser(userId, {
        monthlyPromptCount: user.monthlyPromptCount + 1
      });

      // Update session timestamp
      await storage.updateChatSession(currentSessionId, {
        updatedAt: new Date()
      });

      res.json({ 
        sessionId: currentSessionId,
        message: "Message sent successfully" 
      });

    } catch (error) {
      console.error('Error sending chat message:', error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Analyze uploaded image
  app.post("/api/chat/analyze-image", async (req, res) => {
    try {
      const { image, sessionId, query } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "Image data is required" });
      }

      // For demo purposes, using a mock user
      const userId = "demo-user-1";
      let user = await storage.getUser(userId);
      
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password"
        });
      }

      // Check prompt limit
      if (user.monthlyPromptCount >= 100) {
        return res.status(429).json({ error: "Monthly prompt limit reached" });
      }

      let currentSessionId = sessionId;
      
      // Create session if not provided
      if (!currentSessionId) {
        const session = await storage.createChatSession({
          userId,
          title: "Image Analysis"
        });
        currentSessionId = session.id;
      }

      // Save user's image upload message
      await storage.createChatMessage({
        userId,
        content: "[Image uploaded for analysis]",
        role: "user",
        metadata: { sessionId: currentSessionId, hasImage: true }
      });

      // Analyze image with AI
      const analysis = await openaiService.analyzeUploadedImage(image, query);

      // Save AI analysis
      await storage.createChatMessage({
        userId,
        content: analysis,
        role: "assistant",
        metadata: { sessionId: currentSessionId }
      });

      // Update user prompt count
      await storage.updateUser(userId, {
        monthlyPromptCount: user.monthlyPromptCount + 1
      });

      res.json({ 
        sessionId: currentSessionId,
        analysis 
      });

    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Get quick actions
  app.get("/api/chat/quick-actions", async (req, res) => {
    try {
      const actions = await openaiService.generateQuickActions({
        currentPage: req.headers.referer?.includes('/ai-chat') ? 'ai-chat' : undefined
      });
      res.json(actions);
    } catch (error) {
      console.error('Error getting quick actions:', error);
      res.status(500).json({ error: "Failed to get quick actions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
