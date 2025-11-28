import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Tech Influencer",
    avatar: "/professional-woman-tech-influencer.jpg",
    content:
      "SponsorFlow transformed my collaboration game. I went from cold outreach to having brands come to me. The matching algorithm understands my niche perfectly.",
    rating: 5,
    stats: "500K+ followers",
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Director, TechGear Co.",
    avatar: "/professional-marketing-director.png",
    content:
      "We've cut our influencer discovery time by 80%. The platform's category matching helps us find creators who genuinely align with our brand values.",
    rating: 5,
    stats: "$2M+ in campaigns",
  },
  {
    name: "Emily Rodriguez",
    role: "Lifestyle Creator",
    avatar: "/professional-woman-lifestyle-creator.jpg",
    content:
      "The messaging system is seamless. I can negotiate, share ideas, and finalize deals all in one place. It's like having a personal assistant for sponsorships.",
    rating: 5,
    stats: "1M+ followers",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-chart-3/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-chart-3/10 px-4 py-1 text-sm font-medium text-chart-3">
            Testimonials
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Loved by creators and brands
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Join thousands of successful collaborations powered by SponsorFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs font-medium text-primary">{testimonial.stats}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
