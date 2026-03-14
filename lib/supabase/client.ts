"use client";

import { createBrowserClient } from "@supabase/ssr";

import { appConfig, isSupabaseConfigured } from "@/lib/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(appConfig.supabaseUrl!, appConfig.supabaseKey!);
}
