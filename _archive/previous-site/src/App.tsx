import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Nav from './components/layout/Nav';
import AboutPage from './pages/About';
import ApproachPage from './pages/Approach';
import ContactPage from './pages/Contact';
import HomePage from './pages/Home';
import SituationHangoverPage from './pages/SituationHangover';
import SituationProvidersPage from './pages/SituationProviders';
import SituationReadinessPage from './pages/SituationReadiness';
import WorkLorePage from './pages/WorkLore';
import WorkPathologyPage from './pages/WorkPathology';
import WorkPage from './pages/Work';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-site-bg text-site-text">
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/lore" element={<WorkLorePage />} />
          <Route path="/work/pathology-billing" element={<WorkPathologyPage />} />
          <Route path="/approach" element={<ApproachPage />} />
          <Route path="/situations/ai-hangover" element={<SituationHangoverPage />} />
          <Route path="/situations/ai-providers" element={<SituationProvidersPage />} />
          <Route path="/situations/ai-readiness" element={<SituationReadinessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
