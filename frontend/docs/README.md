# AI Lottery Frontend Documentation

## Overview
The AI Lottery frontend is a React-based web application that provides users with an interface to participate in AI-powered lottery games. The application is built using modern web technologies and follows best practices for accessibility, performance, and user experience.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query
- React Router
- Ethers.js
- React Hot Toast
- HeadlessUI

## Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Common components like Button, Input
│   │   ├── Auth/       # Authentication related components
│   │   └── ...
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API and blockchain services
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/           # Static assets
└── docs/            # Documentation
```

## Key Features
1. **Authentication System**
   - Email/password registration
   - Ethereum wallet integration
   - Protected routes

2. **Lottery System**
   - Credit purchase with ETH
   - AI prompt submission
   - Automated winner selection

3. **Accessibility Features**
   - Reduced motion support
   - High contrast mode
   - Font size controls
   - ARIA attributes
   - Keyboard navigation

4. **Error Handling**
   - Error boundaries
   - Retry mechanisms
   - User-friendly error messages
   - Recovery options

5. **Performance Optimizations**
   - Code splitting
   - Lazy loading
   - Caching strategies
   - Performance monitoring

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask or similar Web3 wallet

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
```env
VITE_API_URL=http://localhost:3000
VITE_ETHEREUM_NETWORK=goerli
VITE_CONTRACT_ADDRESS=0x...
```

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components
- Implement proper error handling
- Write meaningful comments
- Use consistent naming conventions

### Component Structure
```typescript
import React from 'react';
import { Props } from './types';

export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // State and hooks
  
  // Event handlers
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Testing
- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Cypress
- Accessibility tests with axe-core

### Accessibility
- Follow WCAG 2.1 guidelines
- Test with screen readers
- Ensure keyboard navigation
- Provide proper ARIA labels
- Support reduced motion

### Performance
- Optimize bundle size
- Implement code splitting
- Use proper caching
- Monitor performance metrics
- Optimize images and assets

## Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Test the production build:
   ```bash
   npm run preview
   ```
3. Deploy to hosting service

## Troubleshooting
Common issues and their solutions:

1. **MetaMask Connection Issues**
   - Ensure correct network
   - Check wallet connection
   - Verify contract address

2. **API Connection Issues**
   - Check API URL
   - Verify CORS settings
   - Check authentication

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## License
MIT License 