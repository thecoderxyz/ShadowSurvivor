# Post-Apocalyptic Survival Game

## Overview

This is a 3D post-apocalyptic survival game built with React Three Fiber, featuring resource collection, enemy combat, shadow clone mechanics, and progressive level-based gameplay. Players navigate through various themed environments (ruins, alien caves, mechanical zones, etc.) while collecting resources, defeating enemies, and using special abilities like shadow clones to progress through increasingly challenging levels.

The application is a full-stack TypeScript project with a React frontend using Three.js for 3D rendering, and an Express backend with PostgreSQL database support (via Drizzle ORM). It includes comprehensive UI components built with Radix UI and styled with Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**3D Game Engine**
- Built on React Three Fiber (@react-three/fiber) for declarative Three.js integration
- Uses @react-three/drei for helpful 3D utilities and controls
- Implements custom keyboard controls and mobile touch controls for cross-platform support
- Features a component-based game object system (Player, Enemy, Collectible, ShadowClone, Environment)
- Includes performance monitoring and auto-quality adjustment for optimal frame rates

**State Management**
- Zustand-based state stores for game state, player stats, inventory, and audio
- Separate concerns: useGameState, usePlayer, useInventory, useAudio stores
- Local storage persistence for game progress

**UI Layer**
- Radix UI components for accessible, unstyled component primitives
- Tailwind CSS for utility-first styling with custom theme configuration
- Framer Motion for animations and transitions
- Responsive design with mobile-first approach using custom useIsMobile hook
- HUD overlay system using @react-three/drei Html component for in-game UI

**Game Features**
- Level-based progression system with themed environments
- Resource collection and crafting system (metal, crystal, energy, bio resources)
- Enemy AI with chasing and attack behavior
- Shadow clone ability with cooldown mechanics
- Day/night cycle system
- Particle effects for visual feedback
- Audio system for background music and sound effects

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Vite integration for development hot-reloading
- Custom middleware for request logging and error handling
- RESTful API structure with /api prefix convention

**Database Layer**
- PostgreSQL database using Neon serverless driver
- Drizzle ORM for type-safe database operations
- Schema defined in shared/schema.ts for type sharing between client and server
- Migration support via drizzle-kit
- Abstract storage interface (IStorage) with in-memory implementation (MemStorage) for development

**Session Management**
- Configured for connect-pg-simple session store (PostgreSQL-backed sessions)
- Cookie-based authentication ready

**Build System**
- Vite for frontend bundling with React plugin
- ESBuild for server-side bundling
- Custom path aliases (@/ for client, @shared for shared code)
- GLSL shader support via vite-plugin-glsl
- Asset handling for 3D models (GLTF/GLB) and audio files

### External Dependencies

**3D Graphics & Game Engine**
- three: Core 3D library
- @react-three/fiber: React renderer for Three.js
- @react-three/drei: Helper utilities for R3F
- @react-three/postprocessing: Post-processing effects

**UI Framework**
- @radix-ui/*: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, tooltip, etc.)
- tailwindcss: Utility-first CSS framework
- framer-motion: Animation library
- cmdk: Command menu component
- class-variance-authority: For component variant styling

**Database & ORM**
- @neondatabase/serverless: Neon PostgreSQL serverless driver
- drizzle-orm: TypeScript ORM
- drizzle-kit: Database migration toolkit
- drizzle-zod: Zod schema generation from Drizzle schemas

**State & Data Management**
- @tanstack/react-query: Server state management and caching
- zustand: Lightweight state management (implied by store structure)
- zod: Schema validation

**Development Tools**
- vite: Build tool and dev server
- tsx: TypeScript execution for development
- @replit/vite-plugin-runtime-error-modal: Development error overlay
- vite-plugin-glsl: GLSL shader support

**Utilities**
- date-fns: Date manipulation
- nanoid: Unique ID generation
- clsx & tailwind-merge: Conditional className utilities

**Audio**
- Custom audio management via useAudio store
- Support for MP3, OGG, WAV formats

**Session & Authentication**
- express-session: Session middleware
- connect-pg-simple: PostgreSQL session store

**Typography**
- @fontsource/inter: Inter font family