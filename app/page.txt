"use client";

import Link from "next/link";
import {
  Brain,
  Sparkles,
  Target,
  BarChart3,
  Shield,
  Rocket,
  Heart,
  Stethoscope,
  Activity,
  CheckCircle2,
  ArrowRight,
  Users,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms analyze your startup idea against Pakistan's healthcare market dynamics.",
  },
  {
    icon: Target,
    title: "Market Validation",
    description:
      "Get comprehensive market size estimates, growth projections, and target audience insights specific to Pakistan.",
  },
  {
    icon: BarChart3,
    title: "Competitor Intelligence",
    description:
      "Identify existing players, market gaps, and unique positioning opportunities in the healthcare sector.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Understand regulatory requirements, financial feasibility, and technical challenges before you invest.",
  },
];

const categories = [
  { icon: Heart, label: "Mental Health", color: "bg-pink-500/10 text-pink-600" },
  { icon: Stethoscope, label: "Telemedicine", color: "bg-blue-500/10 text-blue-600" },
  { icon: Activity, label: "Health Monitoring", color: "bg-green-500/10 text-green-600" },
  { icon: Brain, label: "Healthcare AI", color: "bg-purple-500/10 text-purple-600" },
];

const stats = [
  { value: "10K+", label: "Ideas Validated" },
  { value: "85%", label: "Success Rate" },
  { value: "500+", label: "Startups Launched" },
  { value: "24hr", label: "Avg. Analysis Time" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div
          className="absolute inset-0 opacity-30 bg-[url('/hero-bg.png')] bg-cover bg-center"
        />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </span>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight animate-slide-up">
              Validate Your
              <span className="block text-gradient-secondary">Healthcare Startup</span>
              Idea in Pakistan
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              MedValidateAI uses artificial intelligence to analyze market potential, identify competitors,
              and assess feasibility of digital and mental healthcare startups in Pakistan.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full gradient-secondary text-white font-semibold text-lg px-8 py-4 shadow-xl hover:opacity-90 transition-opacity"
              >
                Start Validating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full bg-white/10 text-white border border-white/30 hover:bg-white/20 font-semibold text-lg px-8 py-4 backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Healthcare Categories */}
            <div
              className="flex flex-wrap justify-center gap-3 pt-8 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              {categories.map((cat, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${cat.color} border-0`}
                >
                  <cat.icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Features
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="text-gradient"> Validate Your Vision</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Our AI-powered platform provides comprehensive analysis tailored specifically
              for Pakistan's unique healthcare ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border-0 bg-card shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="p-8">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              How It Works
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Three Simple Steps to
              <span className="text-gradient"> Validate Your Idea</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Submit Your Idea",
                description:
                  "Describe your healthcare startup concept, target audience, and unique value proposition.",
                icon: Lightbulb,
              },
              {
                step: "02",
                title: "AI Analysis",
                description:
                  "Our AI engine analyzes market data, competitor landscape, and feasibility factors.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get Insights",
                description:
                  "Receive a comprehensive report with scores, recommendations, and actionable insights.",
                icon: BarChart3,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary text-white font-display text-2xl font-bold mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-6 w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakistan Focus Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium">
                <Globe className="w-4 h-4 mr-2" />
                Pakistan Focus
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
                Built for Pakistan's
                <span className="text-gradient"> Healthcare Revolution</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                With over 220 million people and a rapidly growing digital economy, Pakistan presents
                massive opportunities in healthcare technology. Our AI is trained on local market data,
                regulatory frameworks, and cultural nuances.
              </p>
              <ul className="space-y-4">
                {[
                  "Local market size and growth projections",
                  "DRAP regulatory compliance guidance",
                  "Pakistan-specific competitor analysis",
                  "Regional healthcare trends and opportunities",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full gradient-primary text-white px-8 py-4 text-lg font-semibold"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-20 rounded-3xl blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl bg-card shadow-xl">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">Market Opportunity</h3>
                    <span className="inline-flex items-center rounded-full gradient-secondary text-white text-xs font-medium px-3 py-1 border-0">
                      Hot
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Digital Health Market", value: "$450M", growth: "+28%" },
                      { label: "Telemedicine Users", value: "15M+", growth: "+45%" },
                      { label: "Mental Health Apps", value: "$25M", growth: "+62%" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                      >
                        <span className="text-muted-foreground">{item.label}</span>
                        <div className="text-right">
                          <span className="font-display font-semibold">{item.value}</span>
                          <span className="ml-2 text-sm text-green-600">{item.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Ready to Validate Your
              <span className="block text-gradient-secondary">Healthcare Startup Idea?</span>
            </h2>
            <p className="text-lg text-white/80">
              Join hundreds of healthcare entrepreneurs in Pakistan who have validated their ideas with
              MedValidateAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full gradient-secondary text-white font-semibold text-lg px-8 py-4 shadow-xl hover:opacity-90"
              >
                Start Free Validation
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white/10 text-white border border-white/30 hover:bg-white/20 font-semibold text-lg px-8 py-4"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple inline icon used in the "How It Works" section
const Lightbulb = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

