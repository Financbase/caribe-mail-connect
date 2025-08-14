import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppRouter from "./pages/AppRouter";
import { SkipLinks } from "@/components/a11y/SkipLinks";
import { ErrorBoundary } from "@/components/error-handling/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <SkipLinks />
          <Toaster />
          <Sonner />
          <ErrorBoundary name="AppRoot">
            <div id="app-root" className="min-h-screen">
              <AppRouter />
            </div>
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
