"use client";

import { setSession } from "@/lib/session";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthResponse {
  user: AuthUser;
  error?: string;
}

const routeForRole: Record<UserRole, string> = {
  restaurant: "/dashboard/restaurant",
  consumer: "/dashboard/consumer",
  ngo: "/dashboard/ngo",
  admin: "/dashboard/admin"
};

const roleCopy: Array<{ role: UserRole; title: string; description: string }> = [
  { role: "restaurant", title: "Restaurants", description: "Post surplus, manage claims, complete handoffs." },
  { role: "consumer", title: "Consumers", description: "Discover discounted meals and reserve for pickup." },
  { role: "ngo", title: "NGOs", description: "Claim donation inventory for rescue operations." },
  { role: "admin", title: "Admin", description: "Verify partners, track risk, monitor impact." }
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setLoading(true);

    const payload = {
      email: String(form.get("email")),
      role: String(form.get("role"))
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data: AuthResponse & { error?: string } = await response.json();
    setLoading(false);

    if (!response.ok || !data.user) {
      setError(data.error ?? "Could not login.");
      return;
    }

    setSession({ id: data.user.id, name: data.user.name, role: data.user.role });
    router.push(routeForRole[data.user.role]);
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setLoading(true);

    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      area: String(form.get("area")),
      role: String(form.get("role"))
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data: AuthResponse & { error?: string } = await response.json();
    setLoading(false);

    if (!response.ok || !data.user) {
      setError(data.error ?? "Could not create account.");
      return;
    }

    setSession({ id: data.user.id, name: data.user.name, role: data.user.role });
    router.push(routeForRole[data.user.role]);
  }

  return (
    <main className="authLayout">
      <section className="card authPanel glassCard">
        <div className="authSwitch">
          <button className={mode === "login" ? "button" : "buttonGhost"} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "signup" ? "button" : "buttonGhost"} onClick={() => setMode("signup")}>Sign up</button>
        </div>

        <div className="authIntro">
          <p className="kicker">Account access</p>
          <h1 className="sectionTitle">Enter your details to use RePlate</h1>
          <p className="sectionLead">
            Signup saves your information in Supabase Postgres when `DATABASE_URL` is configured. Login checks your saved account by email and role.
          </p>
        </div>

        {mode === "login" ? (
          <form className="formGrid" onSubmit={handleLogin}>
            <div className="field full">
              <label>Email</label>
              <input name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="field full">
              <label>Role</label>
              <select name="role" defaultValue="consumer">
                <option value="consumer">Consumer</option>
                <option value="restaurant">Restaurant</option>
                <option value="ngo">NGO</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field full">
              <button className="button" type="submit" disabled={loading}>{loading ? "Logging in..." : "Continue to dashboard"}</button>
            </div>
          </form>
        ) : (
          <form className="formGrid" onSubmit={handleSignup}>
            <div className="field">
              <label>Name</label>
              <input name="name" required placeholder="Your name" />
            </div>
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input name="phone" required placeholder="98XXXXXXXX" />
            </div>
            <div className="field">
              <label>Area</label>
              <input name="area" required placeholder="Dharampeth" />
            </div>
            <div className="field full">
              <label>Role</label>
              <select name="role" defaultValue="consumer">
                <option value="consumer">Consumer</option>
                <option value="restaurant">Restaurant</option>
                <option value="ngo">NGO</option>
              </select>
            </div>
            <div className="field full">
              <button className="button" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
            </div>
          </form>
        )}

        {error ? <p className="feedbackError">{error}</p> : null}
      </section>

      <section className="card authShowcase">
        <p className="kicker">Live views</p>
        <h2 className="sectionTitle">Every role sees a focused workflow</h2>
        <div className="stack">
          {roleCopy.map((item) => (
            <div key={item.role} className="storyCard">
              <span className="storyIndex">{item.role.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{item.title}</strong>
                <p className="muted small" style={{ margin: "6px 0 0" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
