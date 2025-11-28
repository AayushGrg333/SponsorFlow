import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Building2 } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/20 via-accent/10 to-chart-3/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="relative p-8 sm:p-12 lg:p-16">
            {/* Content */}
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
                Ready to transform your{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  collaborations?
                </span>
              </h2>
              <p className="mb-8 text-lg text-muted-foreground text-pretty">
                Join thousands of brands and influencers already growing together on SponsorFlow.
              </p>

              {/* Signup Options */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="group h-14 w-full px-8 text-base sm:w-auto" asChild>
                  <Link href="/signup?type=influencer">
                    <Users className="mr-2 h-5 w-5" />
                    Join as Influencer
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group h-14 w-full border-accent bg-accent/10 px-8 text-base text-accent hover:bg-accent hover:text-accent-foreground sm:w-auto"
                  asChild
                >
                  <Link href="/signup?type=company">
                    <Building2 className="mr-2 h-5 w-5" />
                    Join as Company
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
