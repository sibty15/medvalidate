"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Compass, Filter, Search, BarChart3, Building2, Users, ArrowRight } from "lucide-react";

const demoStartups = [
  {
    name: "SehatLink Rural Telemedicine",
    domain: "Telemedicine",
    stage: "MVP",
    score: 82,
    tag: "High readiness",
  },
  {
    name: "MindEase Youth Mental Health",
    domain: "Mental Health",
    stage: "Prototype",
    score: 76,
    tag: "Promising",
  },
  {
    name: "InsureHealth Micro Insurance",
    domain: "Health Insurance",
    stage: "Idea",
    score: 64,
    tag: "Needs work",
  },
];

export default function StartupsExplorePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </span>
            Startups Explore
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Concept view of a future explorer where anonymized healthcare startup ideas can be browsed by domain, stage, and readiness score.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">Coming soon · FYP-II</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters / Search */}
        <Card className="border-0 shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Demo filters
            </CardTitle>
            <CardDescription>
              Static controls to illustrate how founders or mentors might explore ideas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Search</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  disabled
                  placeholder="Search by title, domain, or founder (preview)"
                  className="pl-8 bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Domain</p>
              <div className="flex flex-wrap gap-2">
                {['Telemedicine', 'Mental Health', 'Wearables', 'Hospital Ops'].map((d) => (
                  <Badge key={d} variant="outline" className="cursor-not-allowed opacity-70">
                    {d}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Stage</p>
              <div className="flex flex-wrap gap-2">
                {['Idea', 'Prototype', 'MVP', 'Traction'].map((s) => (
                  <Badge key={s} variant="secondary" className="cursor-not-allowed opacity-80">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <Button disabled className="w-full mt-2">
              <BarChart3 className="mr-2 h-4 w-4" />
              Apply filters (disabled)
            </Button>
          </CardContent>
        </Card>

        {/* List & Mock Analytics */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Demo startup list
              </CardTitle>
              <CardDescription>
                These rows are mocked to demonstrate the layout only.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {demoStartups.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.domain} • {s.stage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{s.tag}</Badge>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Readiness score</p>
                        <p className="font-display text-lg font-bold text-primary">{s.score}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Concept analytics
              </CardTitle>
              <CardDescription>
                High-level mock view of how aggregated scores and filters could look.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="domains" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="domains">By domain</TabsTrigger>
                  <TabsTrigger value="stage">By stage</TabsTrigger>
                </TabsList>
                <TabsContent value="domains" className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Example: telemedicine ideas in Pakistan averaging <span className="font-semibold">78/100</span> readiness
                    with strongest scores in feasibility and cultural acceptance.
                  </p>
                </TabsContent>
                <TabsContent value="stage" className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Example: MVP-stage ideas show higher compliance and market scores than raw &quot;idea only&quot; submissions.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-muted/40">
            <CardContent className="p-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <div>
                <p className="font-medium text-gray-900 text-sm mb-1">Public explorer vision</p>
                <p>
                  In FYP-II this module could power an anonymized startup gallery for mentors, incubators, and classmates.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                <ArrowRight className="mr-2 h-3 w-3" />
                Learn more
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
