import OpenAI from "openai";
import { User, ChatMessage } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatContext {
  currentPage?: string;
  userProfile?: any;
  previousMessages?: ChatMessage[];
  language?: string;
  location?: string;
}

export class OpenAIService {
  
  async generateChatResponse(
    message: string, 
    user: User, 
    context: ChatContext = {}
  ): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(user, context);
      const userMessage = this.buildUserMessage(message, context);

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          { role: "system", content: systemPrompt },
          ...this.buildConversationHistory(context.previousMessages || []),
          { role: "user", content: userMessage }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeUploadedImage(base64Image: string, userQuery?: string): Promise<string> {
    try {
      const analysisPrompt = userQuery || "Analyze this image in detail. If it's a resume, provide career advice. If it's a chart or graph, explain the data insights. If it's any other document, provide relevant guidance for career development.";

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Use gpt-4o for image analysis as it supports vision
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analysisPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        max_tokens: 500,
      });

      return response.choices[0].message.content || "I couldn't analyze this image. Please try uploading a different image.";
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async moderateContent(content: string): Promise<{ flagged: boolean; reason?: string }> {
    try {
      const moderation = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: content,
      });

      const result = moderation.results[0];
      if (result.flagged) {
        const flaggedCategories = Object.entries(result.categories)
          .filter(([_, flagged]) => flagged)
          .map(([category, _]) => category);
        
        return {
          flagged: true,
          reason: `Content flagged for: ${flaggedCategories.join(', ')}`
        };
      }

      return { flagged: false };
    } catch (error) {
      console.error('Content moderation error:', error);
      // If moderation fails, allow content but log the error
      return { flagged: false };
    }
  }

  private buildSystemPrompt(user: User, context: ChatContext): string {
    const languageInstructions = this.getLanguageInstructions(context.language);
    
    const basePrompt = `You are an AI career mentor for a career guidance platform called CareerPath. You help users with career planning, skill development, and educational guidance specifically for the Indian job market.

Your personality:
- Friendly yet professional, like a knowledgeable mentor
- Supportive and encouraging
- Practical and actionable in your advice
- Culturally aware of Indian education system and job market

Your capabilities:
1. Career Guidance: Provide personalized career advice based on user's background, interests, and goals
2. App Navigation: Help users understand and use different features of the CareerPath platform
3. Skill Development: Suggest learning paths, courses, and skill-building activities
4. Job Market Insights: Share current trends, salary ranges, and opportunities in India
5. Educational Guidance: Advise on educational pathways after 10th, 12th, or graduation
6. Real-time Data: Access current market trends, industry demands, and emerging opportunities
7. Multi-language Support: Communicate in the user's preferred language

Context about the user:
- Username: ${user.username}
- Current monthly prompts used: ${user.monthlyPromptCount}/100
${languageInstructions}`;

    if (context.currentPage) {
      basePrompt += `\n- User is currently on: ${context.currentPage} page`;
    }

    if (context.userProfile) {
      basePrompt += `\n- User profile data available: ${JSON.stringify(context.userProfile)}`;
    }

    return basePrompt + `

Guidelines:
- Keep responses concise but helpful (aim for 2-3 paragraphs)
- Use simple, everyday language
- Provide specific, actionable advice
- Include relevant Indian context (companies, education system, etc.)
- When discussing salaries, use Indian Rupees (₹) and LPA format
- If asked about app features, guide them to relevant sections
- For inappropriate content, politely redirect to career-related topics
- Always be encouraging and focus on growth mindset
- Provide real-time market data when discussing trends or opportunities
- Include current industry demands and emerging career paths
- Mention specific companies, startups, and opportunities in India
- Reference current educational institutions and certification programs`;
  }

  private buildUserMessage(message: string, context: ChatContext): string {
    let userMessage = message;

    if (context.currentPage) {
      userMessage = `[User is on ${context.currentPage} page] ${message}`;
    }

    return userMessage;
  }

  private buildConversationHistory(messages: ChatMessage[]): Array<{role: "user" | "assistant", content: string}> {
    // Include last 6 messages for context (3 exchanges)
    const recentMessages = messages.slice(-6);
    
    return recentMessages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    }));
  }

  // Add language-specific instructions
  private getLanguageInstructions(language?: string): string {
    if (!language || language === 'en') return '';
    
    const languageMap: Record<string, string> = {
      'hi': '- Respond in Hindi (हिंदी) when requested, maintaining professional tone',
      'te': '- Respond in Telugu (తెలుగు) when requested, maintaining professional tone',
      'ta': '- Respond in Tamil (தமிழ்) when requested, maintaining professional tone',
      'ml': '- Respond in Malayalam (മലയാളം) when requested, maintaining professional tone',
      'bn': '- Respond in Bengali (বাংলা) when requested, maintaining professional tone'
    };
    
    return languageMap[language] ? `\n${languageMap[language]}` : '';
  }

  // Enhanced real-time data fetching capability
  async fetchRealTimeCareerData(query: string): Promise<string> {
    try {
      // This would typically connect to job boards, industry APIs, etc.
      // For now, we'll use AI to generate current market insights
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a real-time career data analyst. Provide current, accurate information about Indian job market trends, salary ranges, skill demands, and opportunities. Use specific companies, recent hiring trends, and current market data."
          },
          {
            role: "user",
            content: `Provide current market data and trends for: ${query}. Include salary ranges in INR/LPA, top hiring companies, required skills, and market outlook for 2024-2025.`
          }
        ],
        max_tokens: 400,
        temperature: 0.3,
      });

      return response.choices[0].message.content || "Unable to fetch real-time data at the moment.";
    } catch (error) {
      console.error('Real-time data fetch error:', error);
      return "Real-time data is currently unavailable. Please try again later.";
    }
  }

  async generateQuickActions(userContext: any): Promise<string[]> {
    const contextAwareActions = [
      "Suggest careers for me",
      "Find relevant courses",
      "Analyze my strengths", 
      "Show job market trends",
      "Create a learning plan",
      "Check salary ranges",
      "Find internship opportunities",
      "Networking tips for my field"
    ];

    // Add context-specific actions based on user's current page or profile
    if (userContext?.currentPage === 'discovery') {
      contextAwareActions.unshift("Help me complete my profile");
    }

    if (userContext?.currentPage === 'recommendations') {
      contextAwareActions.unshift("Explain these recommendations");
    }

    if (userContext?.currentPage === 'ai-chat') {
      contextAwareActions.push("Analyze uploaded document");
      contextAwareActions.push("Get industry insights");
    }

    return contextAwareActions.slice(0, 8); // Return top 8 actions
  }
}

export const openaiService = new OpenAIService();