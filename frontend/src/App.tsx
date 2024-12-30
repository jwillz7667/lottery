import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './context/authStore';
import { AccessibilityProvider } from './context/accessibilityContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navigation } from './components/common/Navigation';
import { AccessibilityMenu } from './components/common/AccessibilityMenu';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { BuyCredits } from './pages/BuyCredits';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Toaster />
              <div className="fixed bottom-4 right-4 z-50">
                <AccessibilityMenu />
              </div>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Navigation />
                        <Home />
                      </>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <>
                        <Navigation />
                        <div className="max-w-md mx-auto mt-10 px-4 sm:px-6">
                          <LoginForm />
                        </div>
                      </>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <>
                        <Navigation />
                        <div className="max-w-md mx-auto mt-10 px-4 sm:px-6">
                          <RegisterForm />
                        </div>
                      </>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buy-credits"
                    element={
                      <ProtectedRoute>
                        <BuyCredits />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </BrowserRouter>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
