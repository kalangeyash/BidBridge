import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LiveFeed from './components/LiveFeed';
import Features from './components/Features';
import SealedVault from './components/SealedVault';
import TrustSection from './components/TrustSection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import VendorDashboard from './components/vendor/VendorDashboard';
import CreateTender from './components/buyer/CreateTender';
import BrowseTenders from './components/vendor/BrowseTenders';

// A separate component for the Landing Page to keep App.tsx clean
const LandingPage = ({ role }: { role: 'buyer' | 'vendor' }) => (
  <>
    <Hero role={role} />
    <LiveFeed />
    <Features />
    <SealedVault />
    <TrustSection />
    <CallToAction />
  </>
);

function App() {
  const [role, setRole] = useState<'buyer' | 'vendor'>('buyer');

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
        {/* Navigation stays visible on all routes */}
        <Navigation onRoleChange={setRole} currentRole={role} />

<Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage role={role} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer Specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_BUYER']} />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/create-tender" element={<CreateTender />} />
        </Route>

        {/* Vendor Specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_VENDOR']} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/tenders" element={<BrowseTenders />} />
        </Route>
      </Routes>

      <Footer />
    </div>
    </Router >
  );
}

export default App;