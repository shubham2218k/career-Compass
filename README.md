# CareerCompass - Personalized AI Career & Skills Advisor 🧭

## Overview

CareerCompass is an innovative AI-powered career guidance platform designed specifically for Indian students and professionals. It leverages advanced algorithms and comprehensive career data to provide personalized recommendations, skill assessments, and actionable learning paths tailored to the evolving job market.

## 🚀 Key Features

### 1. **Personalized Discovery Assessment**
- Multi-step personality and career interest evaluation
- Skills assessment across technology, business, and creative domains
- Work preference and personality profiling
- Progress tracking and resume capability

### 2. **AI-Powered Career Recommendations**
- Machine learning algorithms analyze user profiles
- Match users with suitable career paths based on:
  - Interests and motivations
  - Existing skills and strengths
  - Personality traits and work style
  - Geographic location preferences
- Provides match scores and detailed reasoning

### 3. **Comprehensive Career Database**
- **Technology Careers**: Software Developer, Data Scientist, DevOps Engineer, etc.
- **Business Careers**: Product Manager, Digital Marketing Manager, etc.
- **Creative Careers**: UI/UX Designer, Content Writer, etc.
- **Healthcare Careers**: Medical Doctor, Physiotherapist, etc.
- Each career includes:
  - Required skills and education paths
  - Salary ranges specific to Indian market (₹ LPA)
  - Growth rates and demand levels
  - Top companies and locations
  - Emerging technologies and trends

### 4. **Skills Assessment & Gap Analysis**
- Domain-specific interactive assessments
- Skill level evaluation (Novice to Advanced)
- Identify skill gaps for target careers
- Personalized skill development recommendations

### 5. **Actionable Learning Paths**
- **Immediate steps** (1-3 months)
- **Short-term goals** (3-12 months) 
- **Long-term objectives** (1-3 years)
- Curated learning resources and courses
- Progress tracking and milestone management

### 6. **Real-Time Job Market Intelligence**
- Job opening trends and demand analysis
- Salary trend monitoring
- Emerging technology identification
- Company-specific insights
- Location-based market data

## 🏗️ Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + TanStack Query
- **Routing**: Wouter (lightweight routing)
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful endpoints with `/api` prefix
- **AI Service**: Custom recommendation engine
- **Session Management**: In-memory storage (extensible)

### Database
- **Primary**: PostgreSQL with Drizzle ORM
- **Schema**: Comprehensive user profiles, career data, assessments
- **Features**: UUID primary keys, JSON fields, full-text search
- **Scalability**: Indexed for performance, ready for horizontal scaling

### AI & Machine Learning
- **Career Matching Algorithm**: Multi-factor scoring system
  - Interest alignment (30% weight)
  - Skills compatibility (25% weight)  
  - Personality fit (20% weight)
  - Work environment match (15% weight)
  - Location preference (10% weight)
- **Skills Assessment**: Domain-specific question banks
- **Learning Path Generation**: Adaptive based on user stage and gaps
- **Job Market Analysis**: Trend detection and prediction algorithms

## 🎯 Target Audience

### Primary Users
- **After 10th Grade**: Students choosing streams and career direction
- **After 12th Grade**: Students selecting college courses and career paths
- **College Students**: Undergraduates and graduates preparing for careers
- **Working Professionals**: Individuals seeking career transitions
- **Non-graduates**: People looking to develop skills and find career opportunities

### Use Cases
1. **Career Exploration**: Discover suitable career options based on interests
2. **Skill Development**: Identify and bridge skill gaps for target careers
3. **Education Planning**: Choose appropriate courses and certifications
4. **Job Market Research**: Understand industry trends and opportunities
5. **Career Transition**: Navigate career changes with data-driven insights

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/CareerCompass.git
cd CareerCompass

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/careercompass

# Google Cloud AI (Optional)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Session Secret
SESSION_SECRET=your-secure-session-secret

# Port (default: 5000)
PORT=5000
```

## 📊 Database Schema

### Core Tables
- **users**: User authentication and profiles
- **user_discovery_data**: Assessment results and preferences  
- **skills_assessments**: Domain-specific skill evaluations
- **career_paths**: Master data of available careers
- **career_recommendations**: AI-generated user recommendations
- **job_market_data**: Real-time market intelligence
- **learning_resources**: Curated educational content
- **user_progress**: Skill development tracking

### Sample Career Data
The system comes pre-loaded with career information for:
- 50+ career paths across multiple industries
- 200+ skills mapped to careers
- 100+ learning resources and courses
- Real salary data for Indian job market
- Location-specific job market insights

## 🔗 API Endpoints

### Career Recommendations
```http
POST /api/recommendations
Content-Type: application/json

{
  "personalDetails": { ... },
  "interests": [...],
  "strengths": [...],
  "workPreferences": { ... },
  "personalityProfile": { ... }
}
```

### Skills Assessment
```http
GET /api/skills-assessment/{domain}
# Returns: { "questions": [...] }

POST /api/skills-assessment/{domain}
# Submit assessment answers
```

### Job Market Data
```http
GET /api/job-market/{careerTitle}
# Returns market trends and opportunities
```

### Career Categories
```http
GET /api/career-categories
# Returns all available career paths by category
```

## 🎨 UI/UX Design

### Design Principles
- **Accessibility First**: WCAG 2.1 AA compliant
- **Mobile-First**: Responsive design for all screen sizes
- **Cultural Sensitivity**: Colors, language, and content appropriate for Indian users
- **Performance**: Optimized loading and smooth interactions

### Theme System
- **Light/Dark Mode**: System preference detection with manual toggle
- **Indian Color Palette**: Professional blues and accent colors
- **Typography**: Inter (body) + Poppins (headings) for readability
- **Components**: Consistent design system with reusable components

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile included for containerized deployment
docker build -t career-compass .
docker run -p 5000:5000 career-compass
```

### Cloud Deployment
- **Recommended**: Vercel, Netlify, or Railway for easy deployment
- **Scalability**: AWS ECS, Google Cloud Run, or Kubernetes for production
- **Database**: Supabase, PlanetScale, or managed PostgreSQL

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- TypeScript strict mode
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Component and hook testing with Jest

## 📈 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Google Cloud AI integration for enhanced recommendations
- [ ] Real-time job portal integration (Naukri, LinkedIn, Indeed)
- [ ] Skill-based course recommendations with affiliate partnerships
- [ ] Peer mentorship matching system
- [ ] Mobile app development (React Native)

### Version 3.0 (Q4 2024)
- [ ] Voice-based career counseling chatbot
- [ ] AR/VR career exploration experiences
- [ ] Blockchain-verified skill certifications
- [ ] International career opportunities expansion
- [ ] AI-powered resume and portfolio builder

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Salesforce, Linear, and modern career platforms
- **Career Data**: Industry reports, government statistics, and job portal APIs
- **UI Components**: Radix UI and shadcn/ui for accessible components
- **Typography**: Google Fonts (Inter, Poppins) for excellent readability

## 📞 Support

- **Documentation**: [docs.careercompass.ai](https://docs.careercompass.ai)
- **Issues**: [GitHub Issues](https://github.com/yourusername/CareerCompass/issues)
- **Email**: support@careercompass.ai
- **Community**: [Discord Server](https://discord.gg/careercompass)

---

**CareerCompass** - Empowering Indian students to make informed career decisions with AI-driven insights and personalized guidance. 🎯

*Built with ❤️ for the future of career guidance in India*