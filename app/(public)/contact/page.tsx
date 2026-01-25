"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  HelpCircle,
  FileQuestion,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "ayanhaidershah0@gmail.com",
    subtitle: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+92 331 225678",
    subtitle: "Mon-Fri, 9am-6pm PKT",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Haripur, Pakistan",
    subtitle: "Haripur District",
  },
];

const faqItems = [
  {
    question: "How long does validation take?",
    answer:
      "Most validations complete within 24 hours. Complex analyses may take up to 48 hours.",
  },
  {
    question: "Is my idea kept confidential?",
    answer:
      "Absolutely. We use enterprise-grade encryption and never share your data with third parties.",
  },
  {
    question: "Can I validate multiple ideas?",
    answer: "Yes! Our platform supports unlimited idea submissions on premium plans.",
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    // Very basic front-end validation similar in spirit to the original
    if (!name || name.trim().length < 2) {
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col mx-auto w-[90%]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
              We're Here to
              <span className="text-gradient"> Help You Succeed</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about validating your healthcare startup idea?
              Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="border-0 bg-card shadow-card rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary mx-auto mb-4 shadow-lg">
                  <info.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{info.title}</h3>
                <p className="font-medium text-primary">{info.details}</p>
                <p className="text-muted-foreground text-sm mt-1">{info.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-6">
                <Send className="w-4 h-4 mr-2" />
                Send a Message
              </span>
              <h2 className="font-display text-3xl font-bold mb-6">Drop Us a Line</h2>

              {isSubmitted ? (
                <div className="border-0 bg-card shadow-xl rounded-2xl p-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center justify-center rounded-full border px-6 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="border-0 bg-card shadow-xl rounded-2xl p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          name="name"
                          placeholder="Your name"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                          minLength={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <select
                        name="subject"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        name="message"
                        placeholder="Tell us how we can help..."
                        className="min-h-[150px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                        minLength={10}
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full cursor-pointer hover:opacity-90 items-center justify-center rounded-full gradient-primary text-white px-6 py-3 text-base font-semibold disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div>
              <span className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium mb-6">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </span>
              <h2 className="font-display text-3xl font-bold mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                {faqItems.map((faq, i) => (
                  <div key={i} className="border-0 bg-card shadow-card rounded-2xl p-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileQuestion className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Response Time Card */}
              <div className="border-0 bg-card shadow-card rounded-2xl mt-8 overflow-hidden">
                <div className="gradient-primary p-6 text-center text-white">
                  <Clock className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-display text-xl font-semibold mb-2">Quick Response Time</h3>
                  <p className="text-white/80">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
