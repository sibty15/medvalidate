"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, MessageCircle, Activity, Sparkles, Stethoscope } from "lucide-react";

export default function MedAssistantPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </span>
            Med Assistant
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Conversational AI space for asking compliance, feasibility, and market-readiness questions about your healthcare startup ideas.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">Coming soon · Prototype</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat / Prompt Area */}
        <Card className="border-0 shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              MedValidate Assistant
            </CardTitle>
            <CardDescription>
              This is a non-functional preview. In FYP-II, this space will host a full chat-based assistant grounded in your Supabase data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-4 h-64 flex flex-col gap-3 overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl bg-white shadow-sm px-4 py-3 max-w-md">
                  <p className="text-sm text-gray-900 font-medium">Hi! I&apos;m your Med Assistant.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Soon I&apos;ll help you understand scores, DRAP readiness, and next steps for your idea.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 ml-auto">
                <div className="rounded-2xl bg-primary text-white px-4 py-3 max-w-md">
                  <p className="text-sm font-medium">What is holding back my telemedicine idea from being investor-ready?</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                  You
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                <Activity className="h-3 w-3 text-primary" />
                <span>Live AI assistant, context from your analyses, safety filters enabled.</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Ask a sample question</label>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  disabled
                  placeholder={'e.g. "How can I improve compliance for my e-pharmacy idea?" (preview only)'}
                  className="bg-muted cursor-not-allowed"
                />
                <Button disabled className="md:w-32">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                In the full version, this input will send messages to a Groq-hosted LLM with your Supabase history as context.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Planned capabilities</CardTitle>
              <CardDescription>
                High-level sketch of what Med Assistant will eventually support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">1</span>
                <div>
                  <p className="font-medium">Explain your scores</p>
                  <p className="text-muted-foreground">Natural-language breakdown of feasibility, market, and regulatory scores per idea.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">2</span>
                <div>
                  <p className="font-medium">Pakistan-aware guidance</p>
                  <p className="text-muted-foreground">Suggestions tuned for DRAP, PECA, affordability, and local clinical realities.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">3</span>
                <div>
                  <p className="font-medium">Actionable next steps</p>
                  <p className="text-muted-foreground">Concrete recommendations to move from idea validation to fundable prototype.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-muted/40">
            <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-gray-900 text-sm">Note for FYP report</p>
              <p>
                This page is a UI placeholder only. It visually communicates the planned Med Assistant module without making any API calls.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
