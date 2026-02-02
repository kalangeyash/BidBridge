import { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LiveFeed from './components/LiveFeed';
import Features from './components/Features';
import SealedVault from './components/SealedVault';
import TrustSection from './components/TrustSection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  const [role, setRole] = useState<'buyer' | 'vendor'>('buyer');

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <Navigation onRoleChange={setRole} currentRole={role} />
      <Hero role={role} />
      <LiveFeed />
      <Features />
      <SealedVault />
      <TrustSection />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default App;
