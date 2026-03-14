"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";

import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavigationItem = {
  href: string;
  label: string;
  adminOnly?: boolean;
};

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

const navigationSections: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard" },
      { href: "/sites", label: "Sites" },
      { href: "/mobile", label: "Mobile Ops" },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/planning", label: "Planning" },
      { href: "/equipment", label: "Equipment" },
      { href: "/alerts", label: "Alerts" },
      { href: "/maintenance", label: "Maintenance" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/analytics", label: "Analytics" },
      { href: "/quality", label: "Quality" },
      { href: "/digital-twin", label: "Digital Twin" },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/admin", label: "Admin Center", adminOnly: true },
      { href: "/connect", label: "Connect", adminOnly: true },
      { href: "/kpis", label: "KPI Builder", adminOnly: true },
      { href: "/optimization", label: "Optimization", adminOnly: true },
      { href: "/compliance", label: "Compliance", adminOnly: true },
    ],
  },
  {
    title: "Account",
    items: [{ href: "/auth", label: "Auth" }],
  },
];

type AppShellProps = {
  children: ReactNode;
  user: User | null;
  role: UserRole | null;
  adminAccess: boolean;
};

export function AppShell({ children, user, role, adminAccess }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isPublicLanding = pathname === "/";
  const visibleSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.adminOnly || adminAccess),
    }))
    .filter((section) => section.items.length > 0);
  const roleLabel = role ? role.replace("_", " ") : "guest";
  const sidebarId = "sightops-sidebar";

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  if (isPublicLanding) {
    return (
      <div className="public-layout">
        <header className="public-topbar">
          <Link href="/" className="public-brand">
            <span className="public-brand-mark">SO</span>
            <span>SightOps</span>
          </Link>
          <nav className="public-nav">
            <Link href="/#platform">Platform</Link>
            <Link href="/#outcomes">Outcomes</Link>
            <Link href="/#use-cases">Use Cases</Link>
            <Link href="/auth" className="button button-secondary">
              Sign in
            </Link>
            {adminAccess ? (
              <Link href="/admin" className="button">
                Open App
              </Link>
            ) : (
              <Link href="/auth" className="button">
                Get Demo
              </Link>
            )}
          </nav>
        </header>
        <main className="public-main">{children}</main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside id={sidebarId} className={cn("sidebar", open && "sidebar-open")}>
        <div className="sidebar-brand">
          <div className="sidebar-mark">SO</div>
          <div>
            <p className="eyebrow">Smart factory intelligence</p>
            <h1>SightOps</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          {visibleSections.map((section) => (
            <div key={section.title} className="nav-section">
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("nav-link", pathname === item.href && "nav-link-active")}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="eyebrow">Environment</p>
          <strong>{user?.email ? "Connected" : "Demo mode"}</strong>
          <span>{user?.email ? `${user.email} · ${roleLabel}` : "Seeded local snapshot active"}</span>
        </div>
      </aside>
      <button
        type="button"
        className={cn("sidebar-backdrop", open && "sidebar-backdrop-open")}
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      />

      <div className="shell-main">
        <header className="topbar">
          <button
            className="menu-button"
            type="button"
            aria-controls={sidebarId}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <div>
            <p className="eyebrow">Plant pulse</p>
            <strong>Atlas Components Plant</strong>
          </div>
          <div className="topbar-user">
            <span className="status-dot" />
            {user?.email ?? "Guest operator"}
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
