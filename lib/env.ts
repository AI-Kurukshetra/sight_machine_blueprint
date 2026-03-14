export const appConfig = {
  name: "SightOps",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

export function isSupabaseConfigured() {
  return Boolean(appConfig.supabaseUrl && appConfig.supabaseKey);
}
