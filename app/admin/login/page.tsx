"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("jamesfontanilla.dev@proton.me");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (signInError) setError(signInError.message);
    else setMessage("Magic link sent. Check your inbox, then return here to finish signing in.");
    setLoading(false);
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-mark">JF</div>
        <span className="admin-kicker">Private workspace</span>
        <h1>Manage your portfolio.</h1>
        <p>Sign in with your allowlisted email. You will receive a one-click magic link instead of a password.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button className="admin-button admin-button-primary" type="submit" disabled={loading}>
            {loading ? "Sending link…" : "Send magic link"}
          </button>
        </form>

        {message ? <p className="admin-success" role="status">{message}</p> : null}
        {error ? <p className="admin-error" role="alert">{error}</p> : null}
        <Link className="admin-back-link" href="/">← Back to public portfolio</Link>
      </section>
    </main>
  );
}
