import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthDialogProvider } from "@/contexts/AuthDialogContext";
import AuthDialog from "@/components/AuthDialog";
import Home from "@/pages/Home";
import Discovery from "@/pages/Discovery";
import Recommendations from "@/pages/Recommendations";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discovery" component={Discovery} />
      <Route path="/recommendations" component={Recommendations} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthDialogProvider>
            <ThemeProvider defaultTheme="light">
              <Toaster />
              <AuthDialog />
              <Router />
            </ThemeProvider>
          </AuthDialogProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
