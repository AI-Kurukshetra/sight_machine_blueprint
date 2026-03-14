import { SignInForm, SignUpForm } from "@/components/auth-form";
import { SignOutForm } from "@/components/sign-out-form";
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

type AuthPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const [user, role, params] = await Promise.all([getCurrentUser(), getCurrentUserRole(), searchParams]);
  const error = params.error;
  const errorMessage =
    error === "admin_required"
      ? "Admin access is required for that area."
      : error === "confirm_failed"
        ? "Retry the email link or sign in manually."
        : null;

  return (
    <div className="stack-xl auth-layout">
      <section className="page-header">
        <div>
          <p className="eyebrow">Supabase auth</p>
          <h1>Access control for plant teams</h1>
        </div>
        <p className="page-copy">
          Email/password authentication with SSR-safe session handling and role metadata.
        </p>
      </section>

      {!isSupabaseConfigured() ? (
        <section className="panel callout">
          <strong>Supabase credentials are missing.</strong>
          <p>
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable live auth.
            The rest of the product remains usable with local demo data.
          </p>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="panel callout critical">
          <strong>Access blocked.</strong>
          <p>{errorMessage}</p>
        </section>
      ) : null}

      {user ? (
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Current session</p>
              <h2>{user.email}</h2>
              <p className="page-copy">Role: {role?.replace("_", " ") ?? "unassigned"}</p>
            </div>
            <SignOutForm />
          </div>
        </section>
      ) : (
        <section className="content-grid auth-grid">
          <article className="panel">
            <p className="eyebrow">Existing users</p>
            <h2>Sign in</h2>
            <SignInForm />
          </article>
          <article className="panel">
            <p className="eyebrow">New operators</p>
            <h2>Create account</h2>
            <SignUpForm />
          </article>
        </section>
      )}
    </div>
  );
}
