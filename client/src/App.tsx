import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MissionsPage from "@/pages/MissionsPage";
import ChatPage from "@/pages/ChatPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMissionContext, MissionProvider } from "./context/MissionContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MissionsPage} />
      <Route path="/mission/:code" component={ChatPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MissionProvider>
        <AppContent />
      </MissionProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { setUser } = useMissionContext();
  
  // Fetch demo user for initial setup
  const { data: demoUser } = useQuery({
    queryKey: ['/api/demo/user'],
  });
  
  // Set the demo user in context when loaded
  useEffect(() => {
    if (demoUser && typeof demoUser === 'object' && 'id' in demoUser) {
      // Cast the demoUser to the User type required by setUser
      setUser(demoUser as any);
    }
  }, [demoUser, setUser]);

  return (
    <div className="flex flex-col min-h-screen font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
