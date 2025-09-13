# Career Guidance Platform Design Guidelines

## Design Approach
**Reference-Based Approach**: Inspired by Salesforce's professional homepage layout with left-content/right-video hero structure, combined with modern career platform aesthetics.

## Core Design Elements

### A. Color Palette
**Dark Mode:**
- Background: 15 23% 9% (deep slate)
- Primary: 235 85% 65% (vibrant indigo)
- Text: 210 40% 98% (near white)
- Cards: 220 13% 18% (dark gray)

**Light Mode:**
- Background: 210 40% 98% (soft white)
- Primary: 218 91% 60% (professional blue)
- Text: 222 84% 5% (charcoal)
- Cards: 0 0% 100% (pure white)

### B. Typography
- **Primary Font**: Inter (Google Fonts)
- **Display Font**: Poppins for headings
- **Hero Tagline**: 4xl-6xl, bold weight
- **Body Text**: base-lg, regular weight
- **Quote Text**: xl-2xl, italic, medium weight

### C. Layout System
**Spacing Units**: Use Tailwind units of 4, 6, 8, 12, 16, 24 for consistent spacing (p-4, m-8, gap-6, etc.)

### D. Component Library

**Navigation:**
- Clean horizontal navbar with logo left, navigation center, actions right
- Theme toggle and language switcher in top-right
- Mobile hamburger menu with slide-down animation

**Hero Section (Salesforce-style):**
- Two-column layout: 60% content left, 40% video right
- Left: Large tagline + compelling paragraph for confused students
- Right: Video placeholder with rounded corners and subtle shadow
- No background image - clean gradient or solid background

**Quote Section:**
- Centered Swami Vivekananda quote with elegant typography
- Scroll-triggered fade-in animation
- Subtle background contrast

**Roadmap Timeline:**
- 8-10 comprehensive step cards in vertical timeline layout
- Each card: numbered badge, icon, title, description
- Alternating left-right layout for visual interest
- Smooth scroll-triggered animations

**CTA Section:**
- Prominent "Start Your Journey Now" button
- Gradient background with inspiring copy

**Footer:**
- Professional layout with copyright, social links, essential navigation
- Dark background in both themes

### E. Animations
**Minimal and Purposeful:**
- Scroll-triggered fade-ins for quote and roadmap steps
- Smooth theme transitions
- Subtle hover states on interactive elements
- No distracting or excessive animations

## Images
**Video Placeholder**: Large rounded rectangle in hero right section for future video content - no background image needed for hero. The layout relies on typography and clean backgrounds rather than hero imagery.

## Key Roadmap Steps
Comprehensive student journey: Discovery → Goal Setting → Skill Assessment → Learning Path → Resource Access → Progress Tracking → Mentorship → Career Planning → Achievement → Success (expandable to show complete platform value)