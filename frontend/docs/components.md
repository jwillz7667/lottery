# Frontend Components Documentation

## Common Components

### AccessibilityMenu
A floating menu that provides accessibility controls for:
- Reduced motion
- High contrast mode
- Font size adjustment

```typescript
import { AccessibilityMenu } from './components/common/AccessibilityMenu';

// Usage
<AccessibilityMenu />
```

### ErrorBoundary
Catches and handles React component errors gracefully.

```typescript
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Usage
<ErrorBoundary fallback={<CustomErrorUI />}>
  <ChildComponent />
</ErrorBoundary>
```

### SEO
Manages meta tags and SEO-related elements.

```typescript
import { SEO } from './components/common/SEO';

// Usage
<SEO 
  title="Page Title"
  description="Page description"
  keywords={['keyword1', 'keyword2']}
/>
```

## Authentication Components

### LoginForm
Handles user authentication with email/password.

```typescript
import { LoginForm } from './components/Auth/LoginForm';

// Usage
<LoginForm onSuccess={() => navigate('/dashboard')} />
```

### RegisterForm
Handles new user registration with email/password and wallet connection.

```typescript
import { RegisterForm } from './components/Auth/RegisterForm';

// Usage
<RegisterForm onSuccess={() => navigate('/dashboard')} />
```

## Layout Components

### Navigation
Main navigation component with responsive design.

```typescript
import { Navigation } from './components/common/Navigation';

// Usage
<Navigation />
```

### ProtectedRoute
Route wrapper that requires authentication.

```typescript
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Usage
<ProtectedRoute>
  <PrivateComponent />
</ProtectedRoute>
```

## Feature Components

### ChatInterface
Handles AI prompt submission and responses.

```typescript
import { ChatInterface } from './components/ChatInterface';

// Usage
<ChatInterface />
```

### CreditPurchase
Manages Ethereum transactions for credit purchases.

```typescript
import { CreditPurchase } from './components/CreditPurchase';

// Usage
<CreditPurchase />
```

## Utility Components

### LoadingSkeleton
Provides loading state UI for components.

```typescript
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

// Usage
<LoadingSkeleton width={200} height={20} />
```

### Button
Reusable button component with variants.

```typescript
import { Button } from './components/common/Button';

// Usage
<Button 
  variant="primary"
  loading={isLoading}
  onClick={handleClick}
>
  Click Me
</Button>
```

## Context Providers

### AccessibilityProvider
Provides accessibility settings throughout the app.

```typescript
import { AccessibilityProvider } from './context/accessibilityContext';

// Usage
<AccessibilityProvider>
  <App />
</AccessibilityProvider>
```

## Custom Hooks

### useRetry
Manages retry logic for async operations.

```typescript
import { useRetry } from './hooks/useRetry';

// Usage
const { execute, isLoading, error } = useRetry(
  async () => await api.call(),
  { maxAttempts: 3 }
);
```

## Animation Variants

```typescript
import { fadeIn, slideUp, scale } from './utils/animations';

// Usage with Framer Motion
<motion.div
  variants={fadeIn}
  initial="initial"
  animate="animate"
  exit="exit"
/>
```

## Best Practices
1. Always provide ARIA labels for interactive elements
2. Include loading states for async operations
3. Handle errors gracefully
4. Support keyboard navigation
5. Test components in isolation
6. Document props and usage examples
7. Follow consistent naming conventions
8. Optimize for performance
9. Support accessibility features
10. Maintain responsive design 