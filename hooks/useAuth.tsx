"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import type { User, AuthState, LoginCredentials, RegisterCredentials } from "@/types";
import { supabaseBrowser } from "@/lib/supabase/client";

interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => Promise<void>;
	loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false,
	});

	useEffect(() => {
		const checkAuth = async () => {
			const supabase = supabaseBrowser();
			try {
				const { data, error } = await supabase.auth.getUser();
				if (error || !data.user) {
					setAuthState({
						user: null,
						isLoading: false,
						isAuthenticated: false,
					});
					return;
				}

				const supabaseUser = data.user;
				const mappedUser: User = {
					id: supabaseUser.id,
					email: supabaseUser.email ?? "",
					fullName:
						(typeof supabaseUser.user_metadata?.full_name === "string"
							? supabaseUser.user_metadata.full_name
							: typeof supabaseUser.user_metadata?.fullName === "string"
							? supabaseUser.user_metadata.fullName
							: undefined),
					avatarUrl:
						typeof supabaseUser.user_metadata?.avatar_url === "string"
							? supabaseUser.user_metadata.avatar_url
							: undefined,
					provider:
						typeof supabaseUser.app_metadata?.provider === "string"
							? supabaseUser.app_metadata.provider
							: undefined,
					createdAt: supabaseUser.created_at,
				};

				// Ensure user exists in public users table for any auth method (email/password or OAuth)
				try {
					const { data: existingUser, error: fetchError } = await supabase
						.from("users")
						.select("id")
						.eq("id", mappedUser.id)
						.single();

					if (!existingUser && !fetchError) {
						const { error: insertError } = await supabase.from("users").insert({
							id: mappedUser.id,
							email: mappedUser.email,
							full_name: mappedUser.fullName,
							created_at: mappedUser.createdAt,
						});

						if (insertError) {
							console.error("Error inserting user into users table (checkAuth):", insertError);
						}
					}
				} catch (tableError) {
					console.error("Error ensuring user exists in users table (checkAuth):", tableError);
				}

				if (typeof window !== "undefined") {
					localStorage.setItem("launchly_user", JSON.stringify(mappedUser));
				}

				setAuthState({
					user: mappedUser,
					isLoading: false,
					isAuthenticated: true,
				});
			} catch {
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				});
			}
		};

		void checkAuth();
	}, []);

	const login = useCallback(async (credentials: LoginCredentials) => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));

		try {
			const supabase = supabaseBrowser();
			const { data, error } = await supabase.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password,
			});
			console.log("SUPABASE LOGIN",{data,error})

			if (error || !data.user) {
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				});
				throw error || new Error("Unable to sign in");
			}

			const supabaseUser = data.user;
			console.log({supabaseUser})
			const user: User = {
				id: supabaseUser.id,
				email: supabaseUser.email ?? "",
				fullName:
					(typeof supabaseUser.user_metadata?.full_name === "string"
						? supabaseUser.user_metadata.full_name
						: typeof supabaseUser.user_metadata?.fullName === "string"
						? supabaseUser.user_metadata.fullName
						: undefined),
				avatarUrl:
					typeof supabaseUser.user_metadata?.avatar_url === "string"
						? supabaseUser.user_metadata.avatar_url
						: undefined,
				provider:
					typeof supabaseUser.app_metadata?.provider === "string"
						? supabaseUser.app_metadata.provider
						: undefined,
				createdAt: supabaseUser.created_at,
			};

			// Check if user exists in users table
			const { data: existingUser, error: fetchError } = await supabase
				.from("users")
				.select("id")
				.eq("id", user.id)
				.single();

			// If user doesn't exist, create 
			if (!existingUser && !fetchError) {
				const { error: insertError } = await supabase.from("users").insert({
					id: user.id,
					email: user.email,
					full_name: user.fullName,
					created_at: user.createdAt,
				});

				if (insertError) {
					console.error("Error inserting user into users table:", insertError);
				}
			}

			if (typeof window !== "undefined") {
				localStorage.setItem("launchly_user", JSON.stringify(user));
			}

			setAuthState({
				user,
				isLoading: false,
				isAuthenticated: true,
			});
		} catch (error) {
			setAuthState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});
			throw error;
		}
	}, []);

	const register = useCallback(async (credentials: RegisterCredentials) => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));

		try {
			const supabase = supabaseBrowser();
			const { data, error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password,
				options: {
					data: {
						full_name: credentials.fullName,
					},
				},
			});

			if (error || !data.user) {
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				});
				throw error || new Error("Unable to register");
			}

			const supabaseUser = data.user;
			const user: User = {
				id: supabaseUser.id,
				email: supabaseUser.email ?? "",
				fullName:
					(typeof supabaseUser.user_metadata?.full_name === "string"
						? supabaseUser.user_metadata.full_name
						: typeof supabaseUser.user_metadata?.fullName === "string"
						? supabaseUser.user_metadata.fullName
						: credentials.fullName),
				avatarUrl:
					typeof supabaseUser.user_metadata?.avatar_url === "string"
						? supabaseUser.user_metadata.avatar_url
						: undefined,
				provider:
					typeof supabaseUser.app_metadata?.provider === "string"
						? supabaseUser.app_metadata.provider
						: undefined,
				createdAt: supabaseUser.created_at,
			};

			// Insert user data into users table
			const { error: insertError } = await supabase.from("users").insert({
				id: user.id,
				email: user.email,
				full_name: user.fullName,
				created_at: user.createdAt,
			});

			if (insertError) {
				console.error("Error inserting user into users table:", insertError);
				// Continue anyway as auth user is created
			}

			if (typeof window !== "undefined") {
				localStorage.setItem("launchly_user", JSON.stringify(user));
			}

			setAuthState({
				user,
				isLoading: false,
				isAuthenticated: true,
			});
		} catch (error) {
			setAuthState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});
			throw error;
		}
	}, []);

	const logout = useCallback(async () => {
		const supabase = supabaseBrowser();
		await supabase.auth.signOut();
		if (typeof window !== "undefined") {
			localStorage.removeItem("launchly_user");
		}
		setAuthState({
			user: null,
			isLoading: false,
			isAuthenticated: false,
		});
		window.location.href = "/login";
	}, []);

	const loginWithGoogle = useCallback(async () => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));
		try {
			const supabase = supabaseBrowser();
			const redirectTo =
				typeof window !== "undefined"
					? `${window.location.origin}/auth/callback`
					: undefined;

			// Mark Google verification flag as false at the moment of login.
			// GoogleUserStorer will flip it to true once the user is confirmed
			// in the `users` table, and subsequent page loads will skip checks.
			if (typeof window !== "undefined") {
				localStorage.setItem("loggedInGoogleAndUserVerified", "false");
			}

			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo,
				},
			});
			console.log({error})
			if (error) {
				throw error;
			}
		} catch (error) {
			setAuthState((prev) => ({ ...prev, isLoading: false }));
			console.log(error)
			throw error;
		}
	}, []);

	return (
		<AuthContext.Provider value={{ ...authState, login, register, logout, loginWithGoogle }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

