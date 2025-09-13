# Career Guidance Platform

## Overview

This is a modern, responsive career guidance platform built with React, TypeScript, and Express.js. The application targets students after 10th, 12th, graduates, and non-graduates, providing personalized career guidance through a multi-step discovery process, AI-powered recommendations, and comprehensive resource libraries.

The platform follows a clean, professional design inspired by Salesforce's layout patterns, featuring a dark/light theme system and responsive design optimized for all device sizes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript in strict mode
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context for authentication and UI state, TanStack Query for server state
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

**Key Design Patterns**:
- Component composition with Radix UI primitives
- Context providers for cross-cutting concerns (auth, theming, dialogs)
- Custom hooks for reusable logic
- Controlled form components with validation

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Development Setup**: Vite for development server and HMR
- **Build System**: ESBuild for production bundling
- **Session Management**: In-memory storage with extensible interface pattern
- **API Design**: RESTful endpoints with `/api` prefix

**Storage Interface**: 
- Abstracted storage layer with `IStorage` interface
- Current implementation uses in-memory storage with plans for database integration
- CRUD operations for user management

### Authentication & Authorization

**Authentication Strategy**: Session-based authentication
- Client-side auth context for state management
- Protected routes and conditional rendering
- User profile management with discovery completion tracking
- Mock authentication system (development phase)

### Data Management

**Database Schema**: PostgreSQL with Drizzle ORM
- User table with UUID primary keys and unique constraints
- Zod schemas for runtime validation
- Migration system with drizzle-kit

**Query Management**:
- TanStack Query for server state caching and synchronization
- Custom query client configuration
- Error handling and unauthorized request management

### UI/UX Architecture

**Design System**:
- Comprehensive theme system with light/dark mode support
- Custom color palette with HSL values
- Typography hierarchy using Inter and Poppins fonts
- Consistent spacing using Tailwind's 4px grid system

**Component Architecture**:
- Atomic design principles with reusable UI components
- Compound component patterns for complex interactions
- Responsive design with mobile-first approach
- Accessibility-focused with proper ARIA attributes

**Key User Flows**:
1. **Discovery Process**: Multi-step form (Personal Details → Career Survey → Personality Assessment → Summary)
2. **Authentication**: Unified dialog with sign-in/sign-up tabs
3. **Navigation**: Responsive navbar with theme/language switching
4. **Roadmap**: Interactive timeline showing career guidance steps

### Development Workflow

**Build & Development**:
- Vite development server with HMR and error overlays
- TypeScript strict mode with path mapping
- PostCSS with Tailwind and Autoprefixer
- Development-specific tooling with Replit integration

**Code Organization**:
- Monorepo structure with shared types and schemas
- Clear separation between client, server, and shared code
- Component examples for development and testing

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and context
- **Express.js**: Backend web framework
- **TypeScript**: Type system for both frontend and backend
- **Vite**: Development server and build tool

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **class-variance-authority**: Utility for conditional styling

### Data Management
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL (@neondatabase/serverless)
- **Zod**: Schema validation library
- **TanStack Query**: Server state management

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Form validation integration

### Development Tools
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing tool
- **@replit/vite-plugin**: Replit-specific development tools

### Authentication & Session Management
- **connect-pg-simple**: PostgreSQL session store
- **nanoid**: Unique ID generation

### Date & Time
- **date-fns**: Modern JavaScript date utility library

### Development & Testing
- **tsx**: TypeScript execution for Node.js
- **@jridgewell/trace-mapping**: Source map utilities

The application is designed for easy deployment on Replit with integrated development tools and can be extended to support additional database providers and authentication methods.