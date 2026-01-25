
"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Ensures that a logged-in Google user has a corresponding row
 * in the public `users` table. Uses localStorage flag
 * `loggedInGoogleAndUserVerified` so this check runs only once
 * per login session and is skipped on subsequent renders/page changes.
 */
export function GoogleUserStorer() {
	const { user } = useAuth();

	useEffect(() => {
		if (typeof window === "undefined") return;

		// Only care about logged-in Google users
		if (!user || user.provider !== "google") return;

		const FLAG_KEY = "loggedInGoogleAndUserVerified";

		const alreadyVerified = window.localStorage.getItem(FLAG_KEY);
		if (alreadyVerified === "true") {
			return;
		}

		const ensureUserExists = async () => {
			const supabase = supabaseBrowser();

			try {
				const { data: existingUser, error: selectError } = await supabase
					.from("users")
					.select("id")
					.eq("id", user.id)
					.maybeSingle();

				if (selectError) {
					console.error("Error checking users table for Google user:", selectError);
					return;
				}

				if (!existingUser) {
					const { error: insertError } = await supabase.from("users").insert({
						id: user.id,
						email: user.email,
						full_name: user.fullName ?? user.email,
						created_at: user.createdAt,
					});

					if (insertError) {
						console.error("Error inserting Google user into users table:", insertError);
						return;
					}
				}

				// Mark as verified so we don't repeat the process on every render/page change
				window.localStorage.setItem(FLAG_KEY, "true");
			} catch (error) {
				console.error("Unexpected error ensuring Google user exists in users table:", error);
			}
		};

		void ensureUserExists();
	}, [user]);

	return null;
}

