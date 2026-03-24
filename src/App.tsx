import { Routes, Route } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar";

// Pages
import DashboardPage from "@/pages/Dashboard";
import TaxCalculatorPage from "@/pages/Calculator";
import PenaltiesPage from "@/pages/Penalties";
import ComparePage from "@/pages/Compare";
import FXChartPage from "@/pages/Volatility";
import TaxPotPage from "@/pages/TaxPot";
import WrappedPage from "@/pages/Wrapped";

export default function App() {
  return (
    <div className="min-h-full flex bg-background text-foreground font-sans selection:bg-[#007AFF] selection:text-white">
      <Sidebar />
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen relative">
        <div className="max-w-[72rem] mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-24">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
            <Route path="/penalties" element={<PenaltiesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/fx-chart" element={<FXChartPage />} />
            <Route path="/tax-pot" element={<TaxPotPage />} />
            <Route path="/wrapped" element={<WrappedPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
