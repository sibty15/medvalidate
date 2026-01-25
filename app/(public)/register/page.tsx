"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const features = [
  "Unlimited idea submissions",
  "AI-powered market analysis",
  "Competitor intelligence",
  "Risk assessment reports",
  "Pakistan market insights",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();


  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Account Created! Welcome to MedValidateAI. Let's validate your first idea!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Registration Failed. Please try again later.");

    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md text-white space-y-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold">
            Start Your Healthcare Startup Journey Today
          </h2>
          <p className="text-white/80">
            Create your free account and get instant access to AI-powered validation
            for your digital health startup ideas in Pakistan.
          </p>

          <div className="space-y-4 pt-4">
            <p className="text-sm font-medium text-white/90">What you'll get:</p>
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-6">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold text-2xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-gradient">MedValidateAI</span>
          </Link>

          

          {/* Form */}
          <Card className="border-0 shadow-xl">
            <CardContent className="px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="Your full name"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
                          I agree to the {" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and {" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* OAuth Register */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span>Or sign up with</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleRegister}
                >
                  <svg xmlns="http://www.w3.org" viewBox="0 0 48 48" width="48px" height="48px">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.91 24.5c0-1.61-.15-3.16-.41-4.65H24v9.09h12.87c-.55 2.96-2.22 5.48-4.73 7.16v5.95h7.66c4.48-4.13 7.07-10.21 7.07-17.55z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.66-5.95c-2.12 1.43-4.84 2.26-8.23 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
