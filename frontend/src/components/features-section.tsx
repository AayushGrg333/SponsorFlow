import { Users, Building2, Layers, Brain, MessageSquare, CreditCard, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Influencer Profiles",
    description:
      "Showcase your content type, past collaborations, social media reach, and experience to attract the right brands.",
    color: "primary",
  },
  {
    icon: Building2,
    title: "Company Profiles",
    description:
      "Create detailed profiles outlining your products, target audience, and marketing needs to find perfect matches.",
    color: "accent",
  },
  {
    icon: Layers,
    title: "Category Matching",
    description: "Get matched based on shared categories like skincare, tech, gaming, fashion, and more.",
    color: "chart-3",
  },
  {
    icon: Brain,
    title: "AI Matchmaking",
    description:
      "Coming soon: AI-powered suggestions for the best brand-influencer matches based on detailed analysis.",
    color: "primary",
  },
  {
    icon: MessageSquare,
    title: "Real-time Messaging",
    description: "Communicate seamlessly with built-in messaging powered by Socket.io for instant collaboration.",
    color: "accent",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Coming soon: Integrated payment processing through Stripe for seamless and secure transactions.",
    color: "chart-3",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Trust verified influencers and companies with our authentication and verification system.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Campaign Analytics",
    description: "Track campaign performance, engagement metrics, and ROI with comprehensive analytics.",
    color: "accent",
  },
]

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "group-hover:border-primary/30",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "group-hover:border-accent/30",
  },
  "chart-3": {
    bg: "bg-chart-3/10",
    text: "text-chart-3",
    border: "group-hover:border-chart-3/30",
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Features
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Everything you need to succeed
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Powerful tools designed to connect brands and influencers, streamline collaborations, and drive results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <div
                key={index}
                className={`glass-card group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${colors.border}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                  <feature.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
