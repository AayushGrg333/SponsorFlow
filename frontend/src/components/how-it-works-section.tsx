import { UserPlus, Search, MessageSquare, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up as an influencer or company. Fill in your details, showcase your work, and define your preferences.",
    color: "primary",
  },
  {
    number: "02",
    icon: Search,
    title: "Discover Matches",
    description:
      "Browse through profiles, filter by categories, and find the perfect match for your collaboration needs.",
    color: "accent",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Connect & Discuss",
    description:
      "Use our built-in messaging to discuss collaboration details, negotiate terms, and plan your campaign.",
    color: "chart-3",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch Campaign",
    description:
      "Finalize the deal, track progress, and watch your collaboration come to life with measurable results.",
    color: "primary",
  },
]

const colorClasses = {
  primary: {
    bg: "bg-primary/20",
    text: "text-primary",
    line: "from-primary",
  },
  accent: {
    bg: "bg-accent/20",
    text: "text-accent",
    line: "from-accent",
  },
  "chart-3": {
    bg: "bg-chart-3/20",
    text: "text-chart-3",
    line: "from-chart-3",
  },
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
            How It Works
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Start collaborating in minutes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Our streamlined process makes it easy to find, connect, and collaborate with the perfect partners.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-primary via-accent to-chart-3 lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses]
              return (
                <div key={index} className="relative">
                  {/* Step Number - Desktop */}
                  <div className="relative mb-8 hidden lg:block">
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${colors.bg} ring-4 ring-background`}
                    >
                      <step.icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
                    {/* Step Number - Mobile */}
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${colors.bg} lg:hidden`}
                    >
                      <step.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>

                    <span className={`text-sm font-bold ${colors.text}`}>{step.number}</span>
                    <h3 className="mb-2 mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
