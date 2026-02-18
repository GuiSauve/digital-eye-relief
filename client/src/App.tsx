import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import NotFound from "@/pages/not-found";
import { ExtensionMockup } from "@/pages/extension-mockup";
import { Privacy } from "@/pages/privacy";

function Router() {
  return (
    <Switch>
      {/* Language-prefixed routes */}
      <Route path="/es" component={ExtensionMockup} />
      <Route path="/fr" component={ExtensionMockup} />
      <Route path="/de" component={ExtensionMockup} />
      <Route path="/es/privacy" component={Privacy} />
      <Route path="/fr/privacy" component={Privacy} />
      <Route path="/de/privacy" component={Privacy} />
      {/* Default English routes */}
      <Route path="/" component={ExtensionMockup} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
