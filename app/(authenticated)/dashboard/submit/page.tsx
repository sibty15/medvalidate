"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createIdeaWithAnalysis } from "@/app/actions/ai-actions/ideaAnalysisCreationAndResults";
import {
  Lightbulb,
  Target,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Brain,
  CheckCircle2,
  Zap,
} from "lucide-react";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z
    .string()
    .min(50, "Please provide a more detailed description (at least 50 characters)")
    .max(2000),
  problemStatement: z
    .string()
    .min(30, "Problem statement must be at least 30 characters")
    .max(1000),
  targetAudience: z
    .string()
    .min(10, "Please describe your target audience")
    .max(500),
  uniqueValueProposition: z
    .string()
    .min(20, "Value proposition must be at least 20 characters")
    .max(500),
  category: z.string().min(1, "Please select a category"),
  domain: z.string().min(1, "Please select a domain"),
  stage: z.string().min(1, "Please select a stage"),
  teamSize: z.string().optional(),
  fundingNeeded: z.string().optional(),
});

type IdeaFormData = z.infer<typeof ideaSchema>;
//categories or subdomains
const categories = [
  { value: "mental-health", label: "Mental Health & Wellness" },
  { value: "telemedicine", label: "Telemedicine & Virtual Care" },
  { value: "health-monitoring", label: "Health Monitoring & Wearables" },
  { value: "fitness-wellness", label: "Fitness & Wellness" },
  { value: "healthcare-ai", label: "Healthcare AI & Analytics" },
  { value: "pharma-tech", label: "Pharma Tech" },
  { value: "medical-devices", label: "Medical Devices" },
  { value: "health-insurance", label: "Health Insurance Tech" },
  { value: "elder-care", label: "Elder Care" },
  { value: "other", label: "Other Healthcare" },
  {
    label: "Tele Medicine", value: "tele-medicine"
  }
];
// now main domain 
const domains = [
  { value: "Healthcare", label: "Healthcare" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Pharmaceuticals", label: "Pharmaceuticals" },
  { value: "Health Insurance", label: "Health Insurance" },
  { value: "Medical Devices", label: "Medical Devices" },
  { value: "Wellness & Fitness", label: "Wellness & Fitness" },

]

const stages = [
  { value: "idea", label: "Just an Idea" },
  { value: "prototype", label: "Prototype / Concept" },
  { value: "mvp", label: "MVP Built" },
  { value: "early-traction", label: "Early Traction" },
  { value: "growth", label: "Growth Stage" },
];

const steps = [
  { id: 1, title: "Basic Info", icon: Lightbulb },
  { id: 2, title: "Problem & Solution", icon: Target },
  { id: 3, title: "Market Details", icon: Users },
  { id: 4, title: "Review", icon: CheckCircle2 },
];

export default function IdeaSubmissionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { user } = useAuth();

  const form = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
      problemStatement: "",
      targetAudience: "",
      uniqueValueProposition: "",
      category: "",
      stage: "",
      teamSize: "",
      fundingNeeded: "",
      domain: ""
    },
  });

  const onSubmit = async (data: IdeaFormData) => {
    if (!user) {
      toast.error("Not authenticated. Please log in before submitting an idea.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Show loading message
      toast.loading("Analyzing your idea with AI... This may take 30-60 seconds.", {
        id: "ai-analysis",
        duration: Infinity,
      });

      const result = await createIdeaWithAnalysis({
        user_id: user.id,
        title: data.title,
        description: data.description,
        problem_statement: data.problemStatement,
        target_audience: data.targetAudience,
        unique_value_proposition: data.uniqueValueProposition,
        category: data.category,
        stage: data.stage,
        team_size: data.teamSize || undefined,
        funding_needed: data.fundingNeeded || undefined,
        domain: data.domain,
        subdomain: data.category,
      });

      // Dismiss loading toast
      toast.dismiss("ai-analysis");

      if (!result.success) {
        toast.error(result.error || "Failed to submit idea. Please try again.");
        return;
      }

      toast.success("Success! Your idea has been analyzed and is ready to view.");
      router.push("/dashboard/results");
    } catch (error) {
      console.error(error);
      toast.dismiss("ai-analysis");
      toast.error("An error occurred while submitting your idea. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof IdeaFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["title", "description", "category", "stage"];
        break;
      case 2:
        fieldsToValidate = ["problemStatement", "uniqueValueProposition"];
        break;
      case 3:
        fieldsToValidate = ["targetAudience"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const formValues = form.watch();

  const fillTestData = () => {
    const testData = {
      title: "AI-Powered Telemedicine Platform for Rural Pakistan",
      description: "A mobile-first telemedicine platform designed to connect rural and underserved populations with licensed doctors through low-bandwidth video consultations, AI-assisted symptom triage, and digital prescriptions. The platform supports Urdu and regional languages and enables family members to join consultations, improving trust and accessibility.",
      problemStatement: "Rural and semi-urban populations in Pakistan face limited access to qualified doctors, long travel times to hospitals, high out-of-pocket healthcare costs, and delayed diagnoses due to a shortage of medical professionals and healthcare infrastructure.",
      targetAudience: "Rural and semi-urban patients, low-income families, small clinics, and community health workers",
      uniqueValueProposition: "Combines low-bandwidth telemedicine, AI-based symptom pre-screening, multilingual support, and family-inclusive consultations tailored specifically for Pakistan's rural healthcare challenges.",
      category: "tele-medicine",
      stage: "idea",
      teamSize: "2-5",
      fundingNeeded: "5m-20m",
      domain: "Healthcare",
    };

    // Fill all form fields
    Object.entries(testData).forEach(([key, value]) => {
      form.setValue(key as keyof IdeaFormData, value);
    });

    toast.success("Test data filled! Review and submit when ready.");
    setCurrentStep(1); // Go back to first step to see all data
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Submit Your Idea</h1>
        <p className="text-muted-foreground mt-1">
          Tell us about your healthcare startup idea and let our AI analyze its potential.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep >= step.id
                ? "gradient-primary text-white border-transparent"
                : "border-muted-foreground/30 text-muted-foreground"
                }`}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <span
              className={`hidden sm:block ml-3 text-sm font-medium ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {step.title}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`hidden sm:block w-12 lg:w-24 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                // Prevent accidental form submits when moving between steps.
                e.preventDefault();
              }}
              className="space-y-6"
            >
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h2 className="font-display text-xl font-semibold">Basic Information</h2>
                    <p className="text-muted-foreground text-sm">
                      Start with the essentials about your healthcare startup idea.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idea Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., AI-Powered Mental Health Companion for Students"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear, concise name for your startup idea
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your startup idea in detail. What does it do? How does it work?"
                            className="min-h-37.5 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive overview (50-2000 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">

                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Healthcare Domain</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="">Select domain</option>
                              {domains.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Healthcare Category</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="">Select category</option>
                              {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stage</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="">Select stage</option>
                              {stages.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                  {stage.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Problem & Solution */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h2 className="font-display text-xl font-semibold">Problem & Solution</h2>
                    <p className="text-muted-foreground text-sm">
                      Define the healthcare problem you're solving and your unique approach.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="problemStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Statement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What specific healthcare problem in Pakistan are you addressing? Why is it important?"
                            className="min-h-30 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about the pain points you're addressing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uniqueValueProposition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unique Value Proposition</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What makes your solution different and better than existing alternatives?"
                            className="min-h-30 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Your competitive advantage in the market</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Market Details */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h2 className="font-display text-xl font-semibold">Market Details</h2>
                    <p className="text-muted-foreground text-sm">
                      Help us understand your target market and business context.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Who are your primary users? Describe their demographics, behaviors, and needs."
                            className="min-h-30 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about your ideal customers in Pakistan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size (Optional)</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="">Select team size</option>
                              <option value="1">Solo Founder</option>
                              <option value="2-5">2-5 Members</option>
                              <option value="6-10">6-10 Members</option>
                              <option value="11+">11+ Members</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fundingNeeded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Needed (Optional)</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="">Select range</option>
                              <option value="bootstrap">Bootstrapping</option>
                              <option value="under-1m">Under PKR 1M</option>
                              <option value="1m-5m">PKR 1M - 5M</option>
                              <option value="5m-20m">PKR 5M - 20M</option>
                              <option value="20m+">PKR 20M+</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h2 className="font-display text-xl font-semibold">Review Your Submission</h2>
                    <p className="text-muted-foreground text-sm">
                      Double-check your information before submitting for AI analysis.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {formValues.title || "Untitled"}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">
                            {categories.find((c) => c.value === formValues.category)?.label ||
                              "Category"}
                          </Badge>
                          <Badge variant="outline">
                            {stages.find((s) => s.value === formValues.stage)?.label || "Stage"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Description</p>
                          <p className="text-sm mt-1">{formValues.description || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Problem Statement
                          </p>
                          <p className="text-sm mt-1">{formValues.problemStatement || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Value Proposition</p>
                          <p className="text-sm mt-1">
                            {formValues.uniqueValueProposition || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Target Audience</p>
                          <p className="text-sm mt-1">{formValues.targetAudience || "-"}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-primary/5 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Brain className="h-8 w-8 text-primary shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1">Ready for AI Analysis</h4>
                            <p className="text-sm text-muted-foreground">
                              Once submitted, our AI will analyze market potential, competition, and
                              feasibility. Results typically arrive within 24 hours.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep} className="gradient-primary">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    className="gradient-secondary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Submit for Analysis
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Floating Test Fill Button */}
      <Button
        type="button"
        onClick={fillTestData}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl gradient-secondary hover:scale-110 transition-transform z-50"
        title="Fill form with test data"
      >
        <Zap className="h-6 w-6" />
      </Button>
    </div>
  );
}
