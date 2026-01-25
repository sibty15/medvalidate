"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { supabaseBrowser } from "@/lib/supabase/client";
import { User, Mail, Bell, Shield, Loader2, Save, Camera } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [updatingSecurity, setUpdatingSecurity] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      const supabase = supabaseBrowser();
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
        },
        email: data.email,
      });

      if (authError) {
        throw authError;
      }

      const { error: dbError } = await supabase
        .from("users")
        .update({
          full_name: data.fullName,
          email: data.email,
        })
        .eq("id", user.id);

      if (dbError) {
        console.error("Error updating users table:", dbError);
      }

      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("launchly_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            window.localStorage.setItem(
              "launchly_user",
              JSON.stringify({
                ...parsed,
                fullName: data.fullName,
                email: data.email,
              })
            );
          } catch (e) {
            console.error("Error updating cached user in localStorage:", e);
          }
        }
      }

      toast.success("Your profile has been successfully updated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl);
  }, [user?.avatarUrl]);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      try {
        const supabase = supabaseBrowser();
        // Ensure a users row exists for this account (important for Google logins).
        try {
          const { data: existingUser, error: existingError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (!existingUser && !existingError) {
            const { data: authData } = await supabase.auth.getUser();
            const authUser = authData?.user;

            const fullNameFromMetadata =
              typeof authUser?.user_metadata?.full_name === "string"
                ? authUser.user_metadata.full_name
                : typeof authUser?.user_metadata?.fullName === "string"
                  ? authUser.user_metadata.fullName
                  : undefined;

            const fullNameToUse = fullNameFromMetadata || user.fullName || user.email;

            const { error: insertError } = await supabase.from("users").insert({
              id: user.id,
              email: user.email,
              full_name: fullNameToUse ?? user.email ?? "Unknown",
            });

            if (insertError) {
              console.error("Error inserting user into users table from settings:", insertError);
            }
          }
        } catch (ensureError) {
          console.error("Error ensuring user exists in users table from settings:", ensureError);
        }

        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) return;

        const metadata = data.user.user_metadata || {};
        setEmailNotifications(
          metadata.email_notifications === undefined ? true : Boolean(metadata.email_notifications)
        );
        setWeeklySummary(
          metadata.weekly_summary === undefined ? true : Boolean(metadata.weekly_summary)
        );
        setMarketingUpdates(Boolean(metadata.marketing_updates));
        setTwoFactorEnabled(Boolean(metadata.two_factor_enabled));
      } catch (e) {
        console.error("Failed to load user preferences:", e);
      }
    };

    void loadPreferences();
  }, [user]);

  const updateNotificationSettings = async (updates: {
    emailNotifications?: boolean;
    weeklySummary?: boolean;
    marketingUpdates?: boolean;
  }) => {
    if (!user) {
      toast.error("You must be logged in to update notifications.");
      return;
    }

    setSavingNotifications(true);
    try {
      const nextEmail =
        updates.emailNotifications !== undefined
          ? updates.emailNotifications
          : emailNotifications;
      const nextWeekly =
        updates.weeklySummary !== undefined
          ? updates.weeklySummary
          : weeklySummary;
      const nextMarketing =
        updates.marketingUpdates !== undefined
          ? updates.marketingUpdates
          : marketingUpdates;

      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.updateUser({
        data: {
          email_notifications: nextEmail,
          weekly_summary: nextWeekly,
          marketing_updates: nextMarketing,
        },
      });

      if (error) {
        throw error;
      }

      setEmailNotifications(nextEmail);
      setWeeklySummary(nextWeekly);
      setMarketingUpdates(nextMarketing);
      toast.success("Notification preferences updated.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update notification preferences.");
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      toast.error("You must be logged in to change your password.");
      return;
    }

    setUpdatingSecurity(true);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) {
        throw error;
      }
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to send password reset email.");
    } finally {
      setUpdatingSecurity(false);
    }
  };

  const toggleTwoFactor = async () => {
    if (!user) {
      toast.error("You must be logged in to manage security settings.");
      return;
    }

    setUpdatingSecurity(true);
    try {
      const supabase = supabaseBrowser();
      const nextValue = !twoFactorEnabled;
      const { error } = await supabase.auth.updateUser({
        data: {
          two_factor_enabled: nextValue,
        },
      });
      if (error) {
        throw error;
      }
      setTwoFactorEnabled(nextValue);
      toast.success(
        nextValue
          ? "Two-factor preference enabled. (Ensure you enforce this on backend if needed.)"
          : "Two-factor preference disabled."
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to update two-factor settings.");
    } finally {
      setUpdatingSecurity(false);
    }
  };

  const handleAvatarSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
      toast.error("You must be logged in to change your photo.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. Max size is 2MB.");
      return;
    }

    setAvatarUploading(true);
    try {
      const supabase = supabaseBrowser();
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });
      if (authError) {
        throw authError;
      }

      try {
        await supabase
          .from("users")
          .update({ avatar_url: publicUrl })
          .eq("id", user.id);
      } catch (e) {
        console.error("Error updating avatar in users table:", e);
      }

      setAvatarUrl(publicUrl);
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("launchly_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            window.localStorage.setItem(
              "launchly_user",
              JSON.stringify({ ...parsed, avatarUrl: publicUrl })
            );
          } catch (e) {
            console.error("Error updating avatar in localStorage:", e);
          }
        }
      }

      toast.success("Profile photo updated.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload profile photo. Please try again.");
    } finally {
      setAvatarUploading(false);
      if (event.target) {
        // reset input so the same file can be chosen again if needed
        // eslint-disable-next-line no-param-reassign
        event.target.value = "";
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error("You must be logged in to delete your account.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account and all data? This action cannot be undone."
    );
    if (!confirmed) return;

    setUpdatingSecurity(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        let message = "Failed to delete account.";
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      toast.success("Your account has been deleted.");
      await logout();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (e) {
      console.error(e);
      toast.error(
        "Unable to delete account at the moment. Please try again later or contact support."
      );
    } finally {
      setUpdatingSecurity(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-black/40">
              <AvatarImage src={avatarUrl || user?.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-display font-bold">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAvatarSelectClick}
                disabled={avatarUploading}
              >
                <Camera className="mr-2 h-4 w-4" />
                {avatarUploading ? "Uploading..." : "Change Photo"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, GIF or PNG. Max size 2MB.
              </p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />

          <Separator />

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <Button
                type="submit"
                className="gradient-primary"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates when your analysis is complete.
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              disabled={savingNotifications}
              onCheckedChange={(value) =>
                updateNotificationSettings({ emailNotifications: Boolean(value) })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly digest of your validation activity.
              </p>
            </div>
            <Switch
              checked={weeklySummary}
              disabled={savingNotifications}
              onCheckedChange={(value) =>
                updateNotificationSettings({ weeklySummary: Boolean(value) })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive news about new features and healthcare insights.
              </p>
            </div>
            <Switch
              checked={marketingUpdates}
              disabled={savingNotifications}
              onCheckedChange={(value) =>
                updateNotificationSettings({ marketingUpdates: Boolean(value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Password</Label>
              <p className="text-sm text-muted-foreground">
                Last changed 30 days ago.
              </p>
            </div>
            <Button variant="outline" className=" cursor-pointer hover:bg-green-50!" onClick={handleChangePassword} disabled={updatingSecurity}>
              Change Password
            </Button>
          </div>

          <Separator />

          {/* <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={toggleTwoFactor}
              disabled={updatingSecurity}
            >
              {twoFactorEnabled ? "Disable" : "Enable"}
            </Button>
          </div> */}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data.
              </p>
            </div>
            <button
              // variant="destructive"
              // size="sm"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700/90  cursor-pointer"
              onClick={handleDeleteAccount}
              disabled={updatingSecurity}
            >
              Delete
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
