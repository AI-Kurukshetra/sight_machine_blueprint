"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signInAction, signUpAction, type AuthActionState } from "@/app/auth/actions";

const initialState: AuthActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="button" type="submit" disabled={pending}>
      {pending ? "Working..." : label}
    </button>
  );
}

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="auth-form">
      <div className="field">
        <label htmlFor="sign-in-email">Email</label>
        <input id="sign-in-email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="sign-in-password">Password</label>
        <input id="sign-in-password" name="password" type="password" required minLength={8} />
      </div>
      {state.error ? <p className="form-message form-error">{state.error}</p> : null}
      <SubmitButton label="Sign in" />
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="auth-form">
      <div className="field">
        <label htmlFor="sign-up-name">Full name</label>
        <input id="sign-up-name" name="fullName" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="sign-up-email">Email</label>
        <input id="sign-up-email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="sign-up-password">Password</label>
        <input id="sign-up-password" name="password" type="password" required minLength={8} />
      </div>
      {state.error ? <p className="form-message form-error">{state.error}</p> : null}
      {state.success ? <p className="form-message form-success">{state.success}</p> : null}
      <SubmitButton label="Create account" />
    </form>
  );
}
