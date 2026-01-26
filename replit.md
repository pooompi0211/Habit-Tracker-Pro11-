# Replit.md

## Overview

This is a habit tracking mobile-first web application built with React and Express. The app allows users to create habits, track daily progress, view calendar history, and see statistics. Data is stored locally in the browser using localStorage, making it a fully client-side application with minimal backend requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and UI animations
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Purpose**: Minimal backend serving static files and placeholder API routes
- **Data Storage**: Currently localStorage on client-side; backend has placeholder routes that return empty arrays

### Data Storage Strategy
- **Primary Storage**: Browser localStorage for all habit data
- **Schema Definition**: Drizzle ORM with PostgreSQL schema defined in `shared/schema.ts`
- **Database Ready**: Drizzle configuration exists for PostgreSQL migration when needed
- The app currently operates as a local-first application but has the infrastructure to migrate to server-side persistence

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` folder are used by both client and server
- **Component Library**: Full shadcn/ui component set in `client/src/components/ui/`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`
- **Mobile-First**: Bottom navigation, touch-friendly UI, safe area padding for mobile devices

### Page Structure
- **Home**: Daily habit list with toggle completion
- **Calendar**: Monthly view showing habit completion history
- **Add Habit**: Form to create new habits with frequency options
- **Statistics**: Completion rates and streak tracking
- **Settings**: Dark mode toggle, data reset functionality

## External Dependencies

### Database
- **PostgreSQL**: Configured via Drizzle ORM but not actively used (app uses localStorage)
- **Connection**: Requires `DATABASE_URL` environment variable when database features are enabled
- **Session Store**: connect-pg-simple available for session storage

### UI Libraries
- **Radix UI**: Full suite of accessible primitives (@radix-ui/react-*)
- **Lucide React**: Icon library
- **Recharts**: Chart visualization for statistics
- **Embla Carousel**: Carousel component
- **CMDK**: Command palette component

### Core Libraries
- **date-fns**: Date manipulation
- **Zod**: Schema validation with drizzle-zod integration
- **class-variance-authority & clsx & tailwind-merge**: CSS class utilities

### Build & Development
- **Vite**: Development server and production builds
- **esbuild**: Server-side bundling for production
- **TypeScript**: Full type checking across client, server, and shared code