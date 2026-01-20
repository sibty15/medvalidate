"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
  Eye,
  Brain,
  Lightbulb,
  Clock,
  Star,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {toast} from "sonner"
import {
  getOrCreateIdeaReportPDF,
} from "@/lib/api";
import { IdeaValidationResult, getAllUserIdeaResults, reanalyzeIdea } from "@/app/actions/ai-actions/ideaAnalysisCreationAndResults";
import { deleteIdeaFully } from "@/app/actions/ideaDeletionFully";
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-orange-100";
  return "bg-red-100";
};

const getRiskBadge = (level: string) => {
  switch (level) {
    case "high":
      return <Badge className="bg-red-100 text-red-700">High Risk</Badge>;
    case "medium":
      return <Badge className="bg-orange-100 text-orange-700">Medium Risk</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-700">Low Risk</Badge>;
    default:
      return null;
  }
};

export default function ValidationResultsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery<IdeaValidationResult[]>({
    queryKey: ["results", user?.id],
    queryFn: () => getAllUserIdeaResults(),
    enabled: !!user,
  });

  const [selectedResult, setSelectedResult] = useState<IdeaValidationResult | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<{ id: string; title: string } | null>(null);

  const downloadReportMutation = useMutation({
    mutationFn: (ideaId: string) => getOrCreateIdeaReportPDF(ideaId),
    onSuccess: async (report) => {
      if (report.file_url) {
        try {
          // Fetch the file as a blob to bypass CORS download restrictions
          const response = await fetch(report.file_url);
          const blob = await response.blob();
          
          // Create a blob URL
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Create a temporary anchor element to trigger download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `medvalidate-report-${selectedResult?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'analysis'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(blobUrl);
          
          toast.success("Report downloaded", {
            description: "Your PDF report has been downloaded successfully.",
          });
        } catch (error) {
          toast.error("Download failed", {
            description: "Could not download the report. Please try again.",
          });
        }
      } else {
        toast.error("Report not available", {
          description: "The server did not return a file URL for this report.",
        });
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error("Failed to generate report", {
        description: message,
      });
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: (ideaId: string) => deleteIdeaFully(ideaId),
    onSuccess: (result, ideaId) => {
      setDeleteDialogOpen(false);
      setIdeaToDelete(null);
      if (result.success) {
        toast.success("Idea deleted successfully", {
          description: "The idea and all related data have been removed.",
        });
        // If the deleted idea was selected, clear selection
        if (selectedResult?.id === ideaId) {
          setSelectedResult(null);
        }
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

  const reanalyzeMutation = useMutation({
    mutationFn: (ideaId: string) => reanalyzeIdea(ideaId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Analysis completed!", {
          description: "Your idea has been successfully reanalyzed.",
        });
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["results", user?.id] });
      } else {
        toast.error("Reanalysis failed", {
          description: result.error || "Please try again later.",
        });
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error("Error reanalyzing idea", {
        description: message,
      });
    },
  });

  const handleDeleteIdea = (ideaId: string, ideaTitle: string) => {
    setIdeaToDelete({ id: ideaId, title: ideaTitle });
    setDeleteDialogOpen(true);
  };

  const handleReanalyze = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.loading("Reanalyzing idea with AI... This may take 30-60 seconds.", {
      id: `reanalyze-${ideaId}`,
      duration: Infinity,
    });
    reanalyzeMutation.mutate(ideaId, {
      onSettled: () => {
        toast.dismiss(`reanalyze-${ideaId}`);
      },
    });
  };

  const confirmDelete = () => {
    if (ideaToDelete) {
      deleteIdeaMutation.mutate(ideaToDelete.id);
    }
  };

  const completedResults = results.filter((r) => r.status === "processed");
  const pendingResults = results.filter((r) => r.status === "pending");

  const handleDownloadReport = () => {
    if (!selectedResult) return;
    downloadReportMutation.mutate(selectedResult.id);
  };

  if (!selectedResult && completedResults.length > 0) {
    setSelectedResult(completedResults[0]);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Validation Results</h1>
          <p className="text-muted-foreground mt-1">
            View AI-powered analysis and insights for your submitted ideas.
          </p>
        </div>
      </div>

      {!user && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Please log in to view your validation results.</p>
          </CardContent>
        </Card>
      )}

      {user && isLoading && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Loading your results...</p>
          </CardContent>
        </Card>
      )}

      {user && isError && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Could not load results. Please try again later.</p>
          </CardContent>
        </Card>
      )}

      {/* Results Tabs */}
      <Tabs defaultValue="completed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed ({completedResults.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            In Progress ({pendingResults.length})
          </TabsTrigger>
        </TabsList>

        {/* Completed Results */}
        <TabsContent value="completed" className="space-y-6">
          {completedResults.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No Completed Results</h3>
                <p className="text-muted-foreground">
                  Submit an idea to see AI-powered validation results here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Results List */}
              <div className="space-y-4">
                {completedResults.map((result) => (
                  <Card
                    key={result.id}
                    className={`border-0 shadow-card cursor-pointer transition-all hover:shadow-lg ${
                      selectedResult?.id === result.id ? "border-2 border-[#f59f0a]" : ""
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold truncate">{result.title}</h4>
                          <p className="text-sm text-muted-foreground">{result.category}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {result.overallScore !== null && result.overallScore !== undefined && (
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getScoreBg(
                                result.overallScore,
                              )}`}
                            >
                              <span
                                className={`font-display text-xl font-bold ${getScoreColor(result.overallScore)}`}
                              >
                                {result.overallScore}
                              </span>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteIdea(result.id, result.title);
                            }}
                            disabled={deleteIdeaMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Completed: {result.completedAt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Result Details */}
              <div className="lg:col-span-3 space-y-6">
                {selectedResult && selectedResult.status === "processed" && (
                  <>
                    {/* Overview Card */}
                    <Card className="border-0 shadow-xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="gradient-hero p-6 text-white">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="font-display text-2xl font-bold">{selectedResult.title}</h2>
                              <div className="flex gap-2 mt-2">
                                <Badge className="bg-white/20 text-white border-0">
                                  {selectedResult.category}
                                </Badge>
                              </div>
                            </div>
                            {selectedResult.overallScore !== null && (
                              <div className="text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                  <span className="font-display text-4xl font-bold">
                                    {selectedResult.overallScore}
                                  </span>
                                </div>
                                <p className="text-sm mt-2 text-white/80">Overall Score</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedResult.scores && [
                            { label: "Market", value: selectedResult.scores.market, icon: TrendingUp },
                            { label: "Competition", value: selectedResult.scores.competition, icon: Users },
                            { label: "Feasibility", value: selectedResult.scores.feasibility, icon: Target },
                            { label: "Innovation", value: selectedResult.scores.innovation, icon: Star },
                          ].map((score, i) => (
                            <div key={i} className="text-center">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl mx-auto ${getScoreBg(
                                  score.value,
                                )}`}
                              >
                                <score.icon className={`h-6 w-6 ${getScoreColor(score.value)}`} />
                              </div>
                              <div
                                className={`font-display text-2xl font-bold mt-2 ${getScoreColor(
                                  score.value,
                                )}`}
                              >
                                {score.value}
                              </div>
                              <p className="text-sm text-muted-foreground">{score.label}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market Analysis */}
                    <Card className="border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Market Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <p className="text-sm text-muted-foreground">Market Size</p>
                            <p className="font-display text-xl font-bold mt-1">
                              {selectedResult.marketAnalysis?.marketSize}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <p className="text-sm text-muted-foreground">Growth Rate</p>
                            <p className="font-display text-xl font-bold mt-1 text-green-600">
                              {selectedResult.marketAnalysis?.growthRate}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <p className="text-sm text-muted-foreground">Target Potential</p>
                            <p className="font-display text-xl font-bold mt-1">
                              {selectedResult.marketAnalysis?.targetPotential}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Competitors */}
                    {selectedResult.competitors && selectedResult.competitors.length > 0 && (
                      <Card className="border-0 shadow-card">
                        <CardHeader>
                          <CardTitle className="font-display text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Competitive Landscape
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedResult.competitors.map((competitor, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium mb-1">{competitor.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Strength:</strong> {competitor.strength}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recommendations */}
                    <Card className="border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-primary" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedResult.recommendations?.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Risks */}
                    <Card className="border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedResult.risks?.map((risk, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                            >
                              <AlertTriangle
                                className={`h-5 w-5 shrink-0 mt-0.5 ${
                                  risk.level === "high"
                                    ? "text-red-600"
                                    : risk.level == "low"
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{risk.title}</span>
                                  {getRiskBadge(risk.level)}
                                </div>
                                <p className="text-sm text-muted-foreground">{risk.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        className="flex-1 gradient-primary"
                        onClick={handleDownloadReport}
                        disabled={
                          !selectedResult ||
                          selectedResult.status !== "processed" ||
                          downloadReportMutation.isPending
                        }
                      >
                        {downloadReportMutation.isPending ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Generating Report...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download Report
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/dashboard/results/full-analysis/${selectedResult.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Full Analysis
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Pending Results */}
        <TabsContent value="pending">
          {pendingResults.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No Pending Analysis</h3>
                <p className="text-muted-foreground">
                  All your submitted ideas have been analyzed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingResults.map((result) => (
                <Card key={result.id} className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                          <Brain className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold">{result.title}</h4>
                          <p className="text-sm text-muted-foreground">{result.category}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleDeleteIdea(result.id, result.title)}
                        disabled={deleteIdeaMutation.isPending || reanalyzeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Analysis failed or pending. Click below to retry.
                      </p>
                      <Button
                        className="w-full gradient-primary"
                        onClick={(e) => handleReanalyze(result.id, e)}
                        disabled={reanalyzeMutation.isPending}
                      >
                        {reanalyzeMutation.isPending ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Reanalyzing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reanalyze Idea
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Submitted: {result.submittedAt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
              className=" cursor-pointer"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteIdeaMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className=" cursor-pointer"
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
