"use client";

import Link from "next/link";
import {
  Target,
  Users,
  Award,
  Heart,
  Lightbulb,
  Globe,
  Sparkles,
  ArrowRight,
  Linkedin,
  Twitter,
  CheckCircle2,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We believe healthcare innovation in Pakistan can save lives and improve millions of outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "Leveraging cutting-edge AI to provide insights that were previously only available to well-funded startups.",
  },
  {
    icon: Heart,
    title: "Healthcare Focus",
    description:
      "Dedicated exclusively to digital and mental healthcare startups addressing real Pakistani health challenges.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a supportive ecosystem of healthcare entrepreneurs, mentors, and investors.",
  },
];

const team = [
  {
    name: "Syed Ayan Haider",
    role: "CEO & Co-Founder",
    bio: "Founder of MedValidateAI, leading vision and strategy for AI-driven healthcare validation in Pakistan.",
    image: "/ayan.jpeg",
  },
  {
    name: "Raja Muhammad Usman",
    role: "Co-Founder & Product Lead",
    bio: "Oversees product development and user experience to ensure MedValidateAI truly serves healthcare founders.",
    image: "/raja.jpeg",
  },
  {
    name: "Malik Muhammad Shahzain",
    role: "Co-Founder & Technology Lead",
    bio: "Drives the AI and platform engineering that powers MedValidateAI's startup validation engine.",
    image: "/malik.jpeg",
  },
];

const milestones = [
  { year: "Early 2026", event: "MedValidateAI founded with a mission to support Pakistani healthcare startups" },
  { year: "Feb 2026", event: "First MVP of the MedValidateAI product launched" },
  { year: "Mid 2026", event: "Onboarded first cohort of healthcare startup users" },
  { year: "Late 2026", event: "Expanded AI validation engine with richer local healthcare data" },
  { year: "2027+", event: "Scaling impact across Pakistan and exploring regional health-tech collaborations" },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* now we put div inset 0 and image full in it behind all  */}
        <div className="absolute inset-0">
          <img
            src="/about-hero.jpg"
            alt="About MedValidateAI"
            className="w-full h-full object-cover object-center opacity-90"
          />
        </div>

        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[30px] w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center text-white justify-center rounded-full border px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 text-white" />
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-white lg:text-6xl font-bold">
              Empowering Healthcare
              <span className="text-gradient"> Innovation in Pakistan</span>
            </h1>
            <p className="text-lg text-white/90">
              MedValidateAI was born from a simple observation: Pakistan has immense healthcare challenges
              and equally immense entrepreneurial talent. We bridge the gap with AI-powered validation.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col w-[90%] mx-auto ">
        {/* Hero Section */}

        {/* Mission & Vision */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-6">
                  <Target className="w-4 h-4 mr-2" />
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Democratizing Startup Validation for Healthcare Entrepreneurs
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Every healthcare startup idea deserves a fair chance at validation. We provide enterprise-grade
                  market intelligence and feasibility analysis to entrepreneurs at every stagefrom first-time
                  founders to seasoned healthcare professionals.
                </p>
                <ul className="space-y-3">
                  {[
                    "Level the playing field for Pakistani entrepreneurs",
                    "Reduce startup failure rates through data-driven insights",
                    "Accelerate healthcare innovation to reach patients faster",
                    "Build a thriving health-tech ecosystem in Pakistan",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl bg-card shadow-xl">
                  <div className="gradient-hero p-8 text-center">
                    <Globe className="w-16 h-16 text-white mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Our Vision</h3>
                    <p className="text-white/80">
                      To be the trusted partner for every healthcare startup in Pakistan,
                      from ideation to impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-4">
                <Users className="w-4 h-4 mr-2" />
                Our Team
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Meet the People Behind MedValidateAI
              </h2>
              <p className="text-muted-foreground">
                A diverse team of healthcare professionals, AI experts, and entrepreneurs united by
                a passion for Pakistani healthcare innovation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="border-0 bg-card shadow-card overflow-hidden rounded-2xl p-6 text-center group hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className=" size-32 xl:size-40 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
                      <Twitter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Values */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">What Drives Us Forward</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="border-0 bg-card shadow-card text-center rounded-2xl p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary mx-auto mb-4 shadow-lg">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Timeline */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-4">
                <Award className="w-4 h-4 mr-2" />
                Our Journey
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Milestones Along the Way</h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative border-l-2 border-primary/30 pl-8 space-y-8">
                {milestones.map((milestone, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[41px] w-4 h-4 rounded-full gradient-primary shadow-lg" />
                    <div className="font-display font-bold text-primary">{milestone.year}</div>
                    <p className="text-foreground">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <div className="border-0 bg-card shadow-xl overflow-hidden rounded-3xl">
              <div className="gradient-hero p-12 lg:p-16 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Join Our Mission?
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                  Whether you're an entrepreneur with a healthcare idea or want to support the ecosystem,
                  we'd love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-full gradient-secondary text-white font-semibold px-8 py-4"
                  >
                    Start Validating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 text-white border border-white/30 hover:bg-white/20 font-semibold px-8 py-4"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
