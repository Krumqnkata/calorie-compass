import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import PortionCalculatorPage from "./pages/PortionCalculatorPage";
import BodyFatPage from "./pages/BodyFatPage";
import DailyToolsPage from "./pages/DailyToolsPage";
import MealPlanPage from "./pages/MealPlanPage";
import { OneRepMaxPage } from "./pages/OneRepMaxPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portion-calculator" element={<PortionCalculatorPage />} />
          <Route path="/body-fat" element={<BodyFatPage />} />
          <Route path="/daily-tools" element={<DailyToolsPage />} />
          <Route path="/meal-plan" element={<MealPlanPage />} />
          <Route path="/one-rep-max" element={<OneRepMaxPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
