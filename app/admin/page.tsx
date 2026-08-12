import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <span className="admin-kicker">Portfolio admin</span>
          <h1>Supabase is not connected yet.</h1>
          <p>Add the two public Supabase environment variables to this deployment, then reload this page.</p>
          <a className="admin-button admin-button-primary" href="/">Back to portfolio</a>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) redirect("/admin/login");

  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  const { data: allowlisted } = await supabase
    .from("admin_allowlist")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (!allowlisted) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <span className="admin-kicker">Portfolio admin</span>
          <h1>Access is not enabled for this email.</h1>
          <p>{email || "This account"} is signed in, but it is not on the portfolio admin allowlist.</p>
          <a className="admin-button admin-button-secondary" href="/">Back to portfolio</a>
        </section>
      </main>
    );
  }

  return <AdminDashboard userEmail={email} />;
}
