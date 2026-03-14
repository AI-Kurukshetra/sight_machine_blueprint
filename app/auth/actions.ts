"use server";

import { redirect } from "next/navigation";

import { appConfig, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase is not configured yet. Add the project URL and publishable key to enable sign-in.",
    };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  if (!supabase) {
    return {
      error: "Supabase is unavailable.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect("/");
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase is not configured yet. Add the project URL and publishable key to enable sign-up.",
    };
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  if (!supabase) {
    return {
      error: "Supabase is unavailable.",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appConfig.siteUrl}/auth/confirm`,
      data: {
        full_name: fullName,
        role: "plant_manager",
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    success: "Account created. Check your inbox to confirm the email address.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
