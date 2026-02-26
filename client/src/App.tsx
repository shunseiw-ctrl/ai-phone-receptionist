import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "./components/layout/AppLayout";
import NotFound from "@/pages/not-found";

// Import pages
import CallLogs from "@/pages/CallLogs";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={CallLogs} />
        <Route path="/settings" component={Settings} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
