import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "./types";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  refreshProfile: async () => {},
  updateProfile: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as Profile);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s?.user) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, role: UserRole = "seeker") => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    // Create profile with role
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        user_role: role,
      });
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await fetchProfile(session.user.id);
  }, [session, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!session?.user) return { error: "Not authenticated" };

    const { skills, full_name, headline, resume_url } = { ...profile, ...updates };
    const isComplete = !!(
      full_name &&
      headline &&
      (skills?.length ?? 0) > 0 &&
      resume_url
    );

    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        is_profile_complete: isComplete,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    if (!error) await fetchProfile(session.user.id);
    return { error: error?.message ?? null };
  }, [session, profile, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

/** Hook that redirects to sign-in if not authenticated */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup) {
      router.replace("/auth/sign-in");
    }
  }, [user, loading, segments, router]);

  return { user, loading };
}
