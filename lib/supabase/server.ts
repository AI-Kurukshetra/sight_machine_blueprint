import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { appConfig, isSupabaseConfigured } from "@/lib/env";

export async function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(appConfig.supabaseUrl!, appConfig.supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies. Proxy refresh handles that case.
        }
      },
    },
  });
}
