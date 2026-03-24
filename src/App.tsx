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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: 0,
        paddingTop: 64,
        minHeight: "100vh",
        position: "relative",
      }} className="lg:ml-[280px] lg:pt-0">
        <div style={{
          maxWidth: 1100,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 48,
          paddingBottom: 48,
        }} className="sm:px-10 lg:px-16 lg:py-16">
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
