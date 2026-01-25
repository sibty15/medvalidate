"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentUserIdeasResults } from "@/lib/api";
import {
  Lightbulb,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Brain,
  Target,
  Plus,
  Trash2,
} from "lucide-react";
import { IdeaValidationResult } from "../../actions/getIdeaWithBasicResults";
import { deleteIdeaFully } from "@/app/actions/ideaDeletionFully";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
    case "analyzing":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Analyzing</Badge>;
    case "draft":
      return <Badge variant="secondary">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
};

export default function DashboardPage() {
  const { user } = useAuth();
  console.log(user)

  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<{ id: string; title: string } | null>(null);

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery<IdeaValidationResult[]>({
    queryKey: ["results", user?.id],
    queryFn: () => getCurrentUserIdeasResults(),
    enabled: !!user,
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: (ideaId: string) => deleteIdeaFully(ideaId),
    onSuccess: (result) => {
      setDeleteDialogOpen(false);
      setIdeaToDelete(null);
      if (result.success) {
        toast.success("Idea deleted successfully", {
          description: "The idea and all related data have been removed.",
        });
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["results", user?.id] });
      } else {
        toast.error("Failed to delete idea", {
          description: result.message,
        });
      }
    },
    onError: (error: unknown) => {
      setDeleteDialogOpen(false);
      setIdeaToDelete(null);
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error("Error deleting idea", {
        description: message,
      });
    },
  });

  const handleDeleteIdea = (ideaId: string, ideaTitle: string) => {
    setIdeaToDelete({ id: ideaId, title: ideaTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (ideaToDelete) {
      deleteIdeaMutation.mutate(ideaToDelete.id);
    }
  };

  const totalIdeas = results.length;
  const completed = results.filter((r) => r.status === "processed");
  const inProgress = results.filter((r) => r.status === "pending" || r.status === "analyzing");

  const completedCount = completed.length;
  const inProgressCount = inProgress.length;

  const avgScoreRaw = results
    .map((r) => r.overallScore)
    .filter((v): v is number => v != null && !Number.isNaN(v));
  const avgScore = avgScoreRaw.length
    ? Math.round(avgScoreRaw.reduce((sum, v) => sum + v, 0) / avgScoreRaw.length)
    : null;



  const completionPercent = totalIdeas ? Math.round((completedCount / totalIdeas) * 100) : 0;

  const stats = [
    {
      title: "Total Ideas",
      value: totalIdeas.toString(),
      icon: Lightbulb,
      trend: totalIdeas ? `${totalIdeas} submitted` : "No ideas yet",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: totalIdeas.toString(),
      icon: CheckCircle2,
      trend: totalIdeas ? `100% completion` : "Waiting for first idea",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Avg. Score",
      value: avgScore != null ? avgScore.toString() : "—",
      icon: TrendingUp,
      trend: avgScore != null ? "Based on completed ideas" : "No completed ideas yet",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "In Progress",
      value: inProgressCount.toString(),
      icon: Clock,
      trend: inProgressCount ? "Being analyzed" : "No analyses running",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentIdeas = [...results]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Welcome back, {user?.fullName?.split(" ")[0] || "Entrepreneur"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your startup validation journey.
          </p>
        </div>
        <Button asChild className="gradient-primary w-fit">
          <Link href="/dashboard/submit">
            <Plus className="mr-2 h-5 w-5" />
            New Idea
          </Link>
        </Button>
      </div>

      {isError && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 text-sm text-muted-foreground">
            We couldnt load your dashboard data right now. Please refresh or try again in a moment.
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{stat.trend}</span>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-3xl font-bold">{stat.value}</h3>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Ideas */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-xl">Recent Ideas</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/results">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading your recent ideas...</div>
              ) : recentIdeas.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  You haven&apos;t submitted any ideas yet. Start by submitting your first idea.
                </div>
              ) : (
                <div className="divide-y">
                  {recentIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium truncate">{idea.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{idea.category}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(idea.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {idea.overallScore !== null && idea.overallScore !== undefined && (
                          <span
                            className={`font-display font-bold text-lg ${getScoreColor(
                              idea.overallScore,
                            )}`}
                          >
                            {idea.overallScore}
                          </span>
                        )}
                        {getStatusBadge(idea.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteIdea(idea.id, idea.title)}
                          disabled={deleteIdeaMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div className="gradient-primary p-6 text-white">
                <Brain className="h-10 w-10 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">Ready to Validate?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Submit your healthcare startup idea and get AI-powered insights.
                </p>
                <Button asChild className="w-full bg-white  text-black hover:bg-white/90">
                  <Link href="/dashboard/submit">
                    Submit New Idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validation Progress */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Ideas Validated</span>
                  <span className="font-medium">
                    {totalIdeas}
                  </span>
                </div>
                <Progress value={completionPercent} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-medium">
                    {avgScore != null ? `${avgScore}/100` : "N/A"}
                  </span>
                </div>
                <Progress value={avgScore != null ? avgScore : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Tip Card */}
          <Card className="border-0 shadow-card bg-muted/30">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Target className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Ideas with clear problem statements and target audiences score 30% higher on average.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Idea</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{ideaToDelete?.title}"</span>?
              <br />
              <br />
              This action cannot be undone and will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The startup idea</li>
                <li>All analysis results</li>
                <li>Scores and reports</li>
                <li>Market data and insights</li>
                <li>All related data across 17+ tables</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteIdeaMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteIdeaMutation.isPending}
            >
              {deleteIdeaMutation.isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
