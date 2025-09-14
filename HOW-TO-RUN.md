# 🚀 How to Run CareerCompass - AI Career Advisor

## Prerequisites Installation

### 1. Install Node.js and npm
**Download and install Node.js (which includes npm):**

1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the installation steps
4. **Restart your terminal/PowerShell** after installation

**Verify installation:**
```powershell
node --version
npm --version
```
You should see version numbers (e.g., `v18.17.0` and `9.6.7`)

## Running the Project

### Step 1: Navigate to Project Directory
```powershell
cd E:\code\Project\CareerCompass
```

### Step 2: Install Dependencies
```powershell
npm install
```
*This will install all required packages (React, Express, TypeScript, etc.)*

### Step 3: Start Development Server
```powershell
npm run dev
```

### Step 4: Open in Browser
The application will automatically open in your default browser at:
**http://localhost:5000**

If it doesn't open automatically, manually navigate to http://localhost:5000

## 🎯 What You Should See

### 1. **Home Page**
- Modern, clean interface with navigation bar
- Hero section with career guidance messaging
- Quote section with inspirational content
- Roadmap timeline showing the career discovery process
- Sign up/Sign in buttons for user authentication

### 2. **Discovery Assessment (After Sign Up)**
- **Step 1**: Personal Details Form
- **Step 2**: Career Survey (interests, strengths, motivations)
- **Step 3**: Personality Assessment
- **Step 4**: Summary of your profile

### 3. **AI Recommendations (After Discovery)**
- Personalized career recommendations with match scores
- Detailed career information (salary, companies, locations)
- Skills assessment and gap analysis
- Learning paths (immediate, short-term, long-term)
- Job market trends and insights

## 🛠️ Development Commands

### Available Scripts
```powershell
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npm run check

# Push database schema (if using database)
npm run db:push
```

## 📱 Features to Test

### 1. **User Authentication**
- Click "Sign Up" to create an account
- Fill in email, password, and basic info
- Sign in with your credentials

### 2. **Discovery Assessment**
- Complete all 4 steps of the discovery process
- Try different combinations of interests and skills
- Notice how the personality assessment affects recommendations

### 3. **AI Career Recommendations**
- View your personalized career matches
- Check match scores and reasoning
- Explore different career details (skills, education, salary)
- Review learning paths and job market data

### 4. **Skills Assessment**
- Test the interactive skills assessment
- Try different domains (Technology, Business, Creative)
- See how skill levels affect recommendations

### 5. **Responsive Design**
- Test on different screen sizes
- Try light/dark mode toggle
- Check mobile responsiveness

## 🐛 Troubleshooting

### Common Issues

#### **Port Already in Use**
If you see "Port 5000 is already in use":
```powershell
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

#### **Dependencies Installation Failed**
```powershell
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

#### **TypeScript Errors**
```powershell
# Run type checking
npm run check
```

#### **Database Errors**
The app works without a database connection but with limited functionality. For full features:
1. Install PostgreSQL
2. Create a database named `careercompass`
3. Run the schema: `psql -d careercompass -f server/schema.sql`

## 🎨 UI Components to Test

### **Theme System**
- Toggle between light and dark modes
- Check that all components adapt properly

### **Navigation**
- Test all navigation links
- Verify responsive mobile menu

### **Forms**
- Fill out forms with validation
- Test error states and success messages

### **Interactive Elements**
- Progress bars in assessments
- Tabs in career recommendations
- Hover effects on cards and buttons

## 🔧 Development Mode Features

### **Hot Reload**
- Make changes to code and see updates instantly
- No need to restart the server for most changes

### **Error Overlay**
- TypeScript and React errors appear as overlays
- Clear error messages for debugging

### **Development Tools**
- React Developer Tools (install browser extension)
- Network tab to see API requests
- Console logging for debugging

## 📊 Expected Performance

### **Loading Times**
- Initial load: ~2-3 seconds
- Page transitions: ~500ms
- AI recommendations: ~1-2 seconds
- Skills assessment: Real-time responses

### **Responsiveness**
- Mobile: Fully responsive design
- Tablet: Optimized layout
- Desktop: Full feature set

## 🌟 Success Indicators

**Your app is working correctly if you can:**
1. ✅ Navigate through the home page
2. ✅ Create an account and sign in
3. ✅ Complete the discovery assessment
4. ✅ View AI-generated career recommendations
5. ✅ Take skills assessments
6. ✅ See job market data and trends
7. ✅ Toggle between light/dark themes
8. ✅ Use the app on mobile devices

## 🚀 Next Steps After Testing

1. **Customize Career Data**: Add more Indian market careers
2. **Database Setup**: Connect to PostgreSQL for persistence
3. **Google Cloud AI**: Integrate for enhanced recommendations
4. **Job Portal APIs**: Connect to live job market data
5. **Deploy Online**: Use Vercel, Netlify, or Railway

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Look at the terminal output for server errors
3. Verify all dependencies are installed
4. Make sure you're using Node.js version 18 or higher

**Happy Testing! 🎯**