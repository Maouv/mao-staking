# MON Staking DApp

## Overview

This is a React-based decentralized application (DApp) for staking MON tokens on the Monad testnet. The application features a modern, responsive interface built with TypeScript, React, and shadcn/ui components, integrated with Web3 functionality for wallet connection and smart contract interactions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and production builds
- **Web3 Integration**: Ethers.js v6 for blockchain interactions

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Environment**: Node.js 20
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for bundling

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Development Storage**: In-memory storage implementation
- **Production Ready**: PostgreSQL schema defined with migrations support

## Key Components

### Web3 Integration
- **Wallet Connection**: MetaMask and WalletConnect support via custom hook
- **Smart Contracts**: ERC20 token and staking contract interactions
- **Network**: Monad testnet configuration with automatic network switching
- **Error Handling**: Comprehensive Web3 error management with user-friendly messages

### User Interface Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: Complete shadcn/ui implementation with 40+ components
- **Toast Notifications**: Real-time user feedback system
- **Loading States**: Skeleton loaders and transaction pending states

### Smart Contract Interface
- **Staking Operations**: Stake, withdraw, and claim rewards functionality
- **Real-time Data**: Live balance and staking statistics
- **Transaction Management**: Gas estimation and transaction status tracking

## Data Flow

1. **Wallet Connection**: User connects wallet through modal interface
2. **Network Verification**: Application checks for Monad testnet connection
3. **Balance Fetching**: Real-time MON and staked token balance updates
4. **Staking Operations**: User initiates stake/withdraw/claim transactions
5. **State Updates**: UI refreshes with new data after transaction confirmation

## External Dependencies

### Blockchain Dependencies
- **Ethers.js**: Web3 provider and contract interaction
- **@neondatabase/serverless**: Database connection (configured for PostgreSQL)

### UI Dependencies
- **@radix-ui**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library

### Development Dependencies
- **Vite**: Build tool with hot module replacement
- **TypeScript**: Type safety and developer experience
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` with hot reloading
- **Database**: Migrations with `npm run db:push`
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Production Deployment
- **Build Process**: Vite builds client, esbuild bundles server
- **Deployment Target**: Replit autoscale deployment
- **Port Configuration**: Server runs on port 5000, external port 80
- **Static Assets**: Client build served from dist/public

### Environment Configuration
- **Replit Modules**: Node.js 20, Web, PostgreSQL 16
- **Database**: PostgreSQL with connection pooling
- **File Structure**: Monorepo with client/server/shared directories

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Key Architectural Decisions

### Monorepo Structure
- **Problem**: Organize full-stack TypeScript application
- **Solution**: Separate client, server, and shared directories with path aliases
- **Benefits**: Code reuse, type safety across boundaries, simplified development

### Web3 Integration Strategy
- **Problem**: Complex wallet connection and contract interaction
- **Solution**: Custom hooks with error handling and state management
- **Benefits**: Reusable Web3 logic, consistent error handling, type-safe contracts

### Database Abstraction
- **Problem**: Flexible storage options for development and production
- **Solution**: Storage interface with memory and PostgreSQL implementations
- **Benefits**: Easy testing, flexible deployment options, type-safe database operations

### Component Architecture
- **Problem**: Consistent, accessible UI components
- **Solution**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **Benefits**: Accessibility compliance, consistent design system, developer productivity