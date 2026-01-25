"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "sonner"
import {
  Sparkles,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();

  const from = searchParams.get("from") || "/dashboard";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Welcome back! You have successfully logged in.");
      router.replace(from);
    } catch (error) {
      toast.error("Login Failed. Please check your credentials and try again.");
    } finally {
      form.reset({ ...form.getValues(), password: "" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          
          {/* header */}
          <div className="space-y-2  text-center">
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-700/80">
              Sign in to your account to continue validating healthcare startup ideas.
            </p>
          </div>
           

          {/* Form */}
          <Card className="border-0 shadow-xl">
            <CardContent className="px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* OAuth Login */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span>Or continue with</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
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

          {/* Register Link */}
          <p className="text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md text-center text-white space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mx-auto">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold">
            AI-Powered Healthcare Startup Validation
          </h2>
          <p className="text-white/80">
            Join hundreds of entrepreneurs who have validated their healthcare startup ideas
            with MedValidateAI's intelligent analysis platform.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="font-display text-2xl font-bold">500+</div>
              <div className="text-sm text-white/70">Startups</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold">85%</div>
              <div className="text-sm text-white/70">Success</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold">24hr</div>
              <div className="text-sm text-white/70">Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
