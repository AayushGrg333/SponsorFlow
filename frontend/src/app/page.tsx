import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

import { GridBackgroundDemo } from "@/components/ui/dot-background-demo";

/**
 * HomePage – Fully responsive landing page
 */
export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Grid Background */}
      <GridBackgroundDemo>
        <HeroSection />
      </GridBackgroundDemo>

      {/* Main Sections */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturesSection />
      </section>

      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorksSection />
      </section>

      <section id="testimonials" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialsSection />
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CTASection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
