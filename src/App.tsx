/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { AdminProvider } from './lib/AdminContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Button } from './components/Button';

// Public Pages
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { ProjectDetails } from './pages/ProjectDetails';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Testimonials } from './pages/Testimonials';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { HeroManager } from './pages/admin/HeroManager';
import { AboutManager } from './pages/admin/AboutManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { MessagesManager } from './pages/admin/MessagesManager';
import { GeneralSettings } from './pages/admin/GeneralSettings';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { ServicesManager } from './pages/admin/ServicesManager';
import { TestimonialsManager } from './pages/admin/TestimonialsManager';
import { BlogManager } from './pages/admin/BlogManager';
import { PricingManager } from './pages/admin/PricingManager';
import { SocialLinksManager } from './pages/admin/SocialLinksManager';
import { SEOSettings } from './pages/admin/SEOSettings';
import { Seeder } from './pages/admin/Seeder';
import { HireMeManager } from './pages/admin/HireMeManager';

import { BlogPostDetails } from './pages/BlogPostDetails';

import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-light-text mb-6">{this.state.error?.message || "An unexpected error occurred"}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <PortfolioProvider>
          <ThemeProvider>
            <Router>
            <div className="min-h-screen font-sans bg-white dark:bg-dark text-slate-900 dark:text-white flex flex-col">
              <Routes>
                {/* Hidden Admin Routes - only accessible via /studio */}
                <Route path="/studio" element={<AdminLogin />} />
                <Route 
                  path="/studio/*" 
                  element={
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="hero" element={<HeroManager />} />
                        <Route path="about" element={<AboutManager />} />
                        <Route path="projects" element={<ProjectsManager />} />
                        <Route path="categories" element={<CategoriesManager />} />
                        <Route path="services" element={<ServicesManager />} />
                        <Route path="testimonials" element={<TestimonialsManager />} />
                        <Route path="blog" element={<BlogManager />} />
                        <Route path="pricing" element={<PricingManager />} />
                        <Route path="messages" element={<MessagesManager />} />
                        <Route path="social-links" element={<SocialLinksManager />} />
                        <Route path="seo" element={<SEOSettings />} />
                        <Route path="settings" element={<GeneralSettings />} />
                        <Route path="hire-me-settings" element={<HireMeManager />} />
                        <Route path="seed" element={<Seeder />} />
                      </Routes>
                    </AdminLayout>
                  } 
                />

                {/* Public Routes */}
                <Route 
                  path="/*" 
                  element={
                    <>
                      <Navbar />
                      <main className="flex-grow pt-20">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/portfolio" element={<Portfolio />} />
                          <Route path="/portfolio/:id" element={<ProjectDetails />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/testimonials" element={<Testimonials />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:id" element={<BlogPostDetails />} />
                        </Routes>
                      </main>
                      <Footer />
                      <WhatsAppButton />
                    </>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </PortfolioProvider>
    </AdminProvider>
  </ErrorBoundary>
);
}
