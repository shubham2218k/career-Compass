-- CareerCompass Database Schema
-- Designed for PostgreSQL with Drizzle ORM

-- Users table - Store user authentication and basic profile info
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    location VARCHAR(255),
    current_stage VARCHAR(50), -- 'after-10th', 'after-12th', 'undergraduate', etc.
    discovery_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Discovery Data - Store results from discovery assessment
CREATE TABLE IF NOT EXISTS user_discovery_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interests TEXT[] NOT NULL DEFAULT '{}',
    strengths TEXT[] NOT NULL DEFAULT '{}',
    motivations TEXT[] NOT NULL DEFAULT '{}',
    work_environment VARCHAR(100),
    work_life_balance VARCHAR(100),
    career_goals TEXT,
    challenges TEXT,
    inspiration TEXT,
    personality_data JSONB, -- Store personality test results
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Assessment Results
CREATE TABLE IF NOT EXISTS skills_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL, -- 'technology', 'business', 'creative'
    questions_answered JSONB NOT NULL, -- Store question IDs and answers
    score INTEGER NOT NULL DEFAULT 0, -- Overall score for this domain
    skill_level VARCHAR(50) NOT NULL DEFAULT 'Beginner', -- 'Novice', 'Beginner', 'Intermediate', 'Advanced'
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Paths - Master data of available careers
CREATE TABLE IF NOT EXISTS career_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'technology', 'healthcare', 'business', 'creative'
    skills_required TEXT[] NOT NULL DEFAULT '{}',
    education_paths TEXT[] NOT NULL DEFAULT '{}',
    avg_salary_range VARCHAR(50),
    growth_rate VARCHAR(10),
    demand_level VARCHAR(20) DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
    locations TEXT[] NOT NULL DEFAULT '{}', -- Popular job locations
    top_companies TEXT[] NOT NULL DEFAULT '{}',
    emerging_technologies TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Career Recommendations - AI-generated recommendations
CREATE TABLE IF NOT EXISTS career_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_path_id UUID REFERENCES career_paths(id),
    match_score DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    reasoning TEXT,
    skill_gaps TEXT[] DEFAULT '{}',
    learning_path_immediate TEXT[] DEFAULT '{}',
    learning_path_short_term TEXT[] DEFAULT '{}',
    learning_path_long_term TEXT[] DEFAULT '{}',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Job Market Data - Real-time job market information
CREATE TABLE IF NOT EXISTS job_market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_title VARCHAR(255) NOT NULL,
    job_openings INTEGER DEFAULT 0,
    salary_trend VARCHAR(20) DEFAULT 'Stable', -- 'Decreasing', 'Stable', 'Increasing'
    top_skills_in_demand TEXT[] DEFAULT '{}',
    top_companies TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    data_source VARCHAR(100), -- 'naukri', 'linkedin', 'indeed', etc.
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_path_id UUID REFERENCES career_paths(id),
    skill_name VARCHAR(255) NOT NULL,
    current_level VARCHAR(50) DEFAULT 'Beginner',
    target_level VARCHAR(50) DEFAULT 'Intermediate',
    progress_percentage INTEGER DEFAULT 0,
    resources_completed TEXT[] DEFAULT '{}',
    milestones_achieved TEXT[] DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Resources - Curated resources for skill development
CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL, -- 'course', 'book', 'article', 'video', 'certification'
    provider VARCHAR(255), -- 'Coursera', 'YouTube', 'Udemy', etc.
    url TEXT,
    skill_tags TEXT[] DEFAULT '{}',
    difficulty_level VARCHAR(50) DEFAULT 'Beginner',
    duration_hours INTEGER,
    cost_type VARCHAR(20) DEFAULT 'Free', -- 'Free', 'Paid', 'Freemium'
    rating DECIMAL(2,1),
    is_indian_content BOOLEAN DEFAULT FALSE,
    language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Bookmarks - Save favorite resources and careers
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bookmark_type VARCHAR(50) NOT NULL, -- 'career', 'resource', 'article'
    reference_id UUID NOT NULL, -- ID of the bookmarked item
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentorship Connections (Future feature)
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentee_id UUID REFERENCES users(id),
    mentor_id UUID REFERENCES users(id),
    career_field VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Accepted', 'Declined', 'Active', 'Completed'
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_discovery_completed ON users(discovery_completed);
CREATE INDEX IF NOT EXISTS idx_user_discovery_user_id ON user_discovery_data(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_assessments_user_id ON skills_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_career_paths_category ON career_paths(category);
CREATE INDEX IF NOT EXISTS idx_career_paths_active ON career_paths(is_active);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_active ON career_recommendations(is_active);
CREATE INDEX IF NOT EXISTS idx_job_market_data_career_title ON job_market_data(career_title);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_skill_tags ON learning_resources USING GIN(skill_tags);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);

-- Insert sample career data for Indian market
INSERT INTO career_paths (title, description, category, skills_required, education_paths, avg_salary_range, growth_rate, demand_level, locations, top_companies) VALUES
('Software Developer', 'Create applications, websites, and software solutions', 'technology', 
 ARRAY['Programming', 'Problem Solving', 'Database Management', 'Version Control'], 
 ARRAY['Computer Science', 'Information Technology', 'Software Engineering'],
 '₹4-15 LPA', '23%', 'High',
 ARRAY['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai'],
 ARRAY['TCS', 'Infosys', 'Google', 'Microsoft', 'Amazon']),

('Data Scientist', 'Analyze complex data to help businesses make decisions', 'technology',
 ARRAY['Python/R', 'Statistics', 'Machine Learning', 'Data Visualization'],
 ARRAY['Statistics', 'Computer Science', 'Mathematics', 'Analytics'],
 '₹6-25 LPA', '35%', 'High',
 ARRAY['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
 ARRAY['Flipkart', 'Ola', 'Paytm', 'Adobe', 'IBM']),

('Digital Marketing Manager', 'Develop and execute online marketing strategies', 'business',
 ARRAY['SEO/SEM', 'Social Media', 'Analytics', 'Content Strategy'],
 ARRAY['Marketing', 'Business', 'Communications', 'Any Graduate + Certification'],
 '₹4-18 LPA', '25%', 'High',
 ARRAY['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'],
 ARRAY['Byju''s', 'Unacademy', 'Zomato', 'OYO', 'Digital Agencies']),

('UI/UX Designer', 'Design user interfaces and experiences for digital products', 'creative',
 ARRAY['Design Tools', 'User Research', 'Prototyping', 'Visual Design'],
 ARRAY['Design', 'Fine Arts', 'Psychology', 'Any Graduate + Portfolio'],
 '₹3-15 LPA', '22%', 'High',
 ARRAY['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
 ARRAY['Zomato', 'Swiggy', 'Paytm', 'Adobe', 'Design Studios']);

-- Insert sample learning resources
INSERT INTO learning_resources (title, description, resource_type, provider, skill_tags, difficulty_level, duration_hours, cost_type, is_indian_content, language) VALUES
('Python for Everybody Specialization', 'Learn Python programming from scratch', 'course', 'Coursera', 
 ARRAY['Programming', 'Python'], 'Beginner', 160, 'Freemium', FALSE, 'English'),
 
('Digital Marketing Course by Google', 'Comprehensive digital marketing fundamentals', 'certification', 'Google Digital Garage',
 ARRAY['Digital Marketing', 'SEO', 'Analytics'], 'Beginner', 40, 'Free', FALSE, 'English'),

('UI/UX Design Bootcamp', 'Complete guide to user interface and experience design', 'course', 'Udemy',
 ARRAY['Design', 'UI/UX', 'Prototyping'], 'Intermediate', 80, 'Paid', FALSE, 'English'),

('Coding Ninjas DSA Course', 'Data Structures and Algorithms for Indian students', 'course', 'Coding Ninjas',
 ARRAY['Programming', 'Data Structures', 'Algorithms'], 'Intermediate', 120, 'Paid', TRUE, 'English');