"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Presentation, FileText, ListOrdered, Download, Sparkles } from "lucide-react";

const sections = [
  "Problem",
  "Solution",
  "Market & TAM",
  "Business Model",
  "Traction / Experiments",
  "Regulatory Plan (DRAP / PECA)",
  "Team",
  "Ask & Use of Funds",
];

export default function PitchDeckGenPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Presentation className="h-5 w-5" />
            </span>
            Pitch Deck Gen
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Mock interface for a future module that converts your validated idea into investor-ready slide outlines and notes.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">Planned module · Not active</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input / Config */}
        <Card className="border-0 shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Deck outline preview
            </CardTitle>
            <CardDescription>
              In the real version, you would select an existing idea and let the AI draft slides and speaking notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select idea (demo)</label>
                <Input
                  disabled
                  placeholder={'e.g. "AI Telemedicine for Rural Clinics" (coming soon)'}
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target audience</label>
                <Input
                  disabled
                  placeholder="e.g. Pakistani seed investors, incubator jury"
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <Tabs defaultValue="slides" className="space-y-4">
              <TabsList>
                <TabsTrigger value="slides">Slides outline</TabsTrigger>
                <TabsTrigger value="notes">Speaker notes</TabsTrigger>
              </TabsList>
              <TabsContent value="slides" className="space-y-4">
                <ScrollArea className="h-56 rounded-lg border bg-muted/30 p-4">
                  <ol className="space-y-3 text-sm">
                    {sections.map((s, i) => (
                      <li key={s} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium">{s}</p>
                          <p className="text-xs text-muted-foreground">
                            Placeholder description of what this slide would cover for a Pakistani healthtech startup.
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="notes" className="space-y-3 text-sm">
                <Textarea
                  disabled
                  className="min-h-45 bg-muted cursor-not-allowed"
                  placeholder="Example speaker notes and transitions will appear here in the full implementation. For now this is static UI only."
                />
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                Future behaviour: generate editable deck content and export to PDF, PowerPoint, or Google Slides.
              </p>
              <div className="flex gap-2">
                <Button disabled size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export deck
                </Button>
                <Button disabled size="sm">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Generate (disabled)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-primary" />
                What this module aims to do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Translate feasibility and compliance analysis into a story that investors and incubator mentors actually expect to see.
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Auto-generate slide titles and bullet points from your analysis.</li>
                <li>Inject DRAP/PECA readiness into risk and regulatory slides.</li>
                <li>Adjust tone for academic FYP juries vs. startup pitch days.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-muted/40">
            <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-gray-900 text-sm">UI-only placeholder</p>
              <p>
                No data is saved or processed from this page. It exists to demonstrate the planned Pitch Deck Generator UX for FYP documentation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
