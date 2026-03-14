import { cache } from "react";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import type { UserRole } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "plant_manager" || value === "operator";
}

export const getCurrentUserRole = cache(async (): Promise<UserRole | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const roleFromMetadata = user.user_metadata?.role;
  if (isUserRole(roleFromMetadata)) {
    return roleFromMetadata;
  }

  const profileResult = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const roleFromProfile = profileResult.data?.role;
  if (isUserRole(roleFromProfile)) {
    return roleFromProfile;
  }

  return null;
});

export async function isCurrentUserAdmin() {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const role = await getCurrentUserRole();
  return role === "admin";
}

export async function requireAdminPage() {
  if (!isSupabaseConfigured()) {
    return;
  }

  const admin = await isCurrentUserAdmin();
  if (!admin) {
    redirect("/auth?error=admin_required");
  }
}
