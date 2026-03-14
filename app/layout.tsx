import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

import "./globals.css";

export const metadata: Metadata = {
  title: "SightOps",
  description: "Smart factory intelligence platform built with Next.js and Supabase.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [user, role] = await Promise.all([getCurrentUser(), getCurrentUserRole()]);
  const adminAccess = !isSupabaseConfigured() || role === "admin";

  return (
    <html lang="en">
      <body>
        <AppShell user={user} role={role} adminAccess={adminAccess}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
