"use client";

import { setSession } from "@/lib/session";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface UserOption {
  id: string;
  name: string;
  role: UserRole;
  verificationStatus: string;
}

interface UsersResponse {
  users: UserOption[];
}

interface SignupResponse {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
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
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/users")
      .then((response) => response.json())
      .then((data: UsersResponse) => {
        setUsers(data.users);
        if (data.users[0]) {
          setSelectedId(data.users[0].id);
        }
      });
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    const user = users.find((entry) => entry.id === selectedId);
    if (!user) {
      setError("Select a demo user.");
      return;
    }
    setSession({ id: user.id, name: user.name, role: user.role });
    router.push(routeForRole[user.role]);
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

    setLoading(false);

    if (!response.ok) {
      setError("Could not create account.");
      return;
    }

    const data: SignupResponse = await response.json();
    setSession({ id: data.user.id, name: data.user.name, role: data.user.role });
    router.push(routeForRole[data.user.role]);
  }

  return (
    <main className="authLayout">
      <section className="card authPanel glassCard">
        <div className="authSwitch">
          <button className={mode === "login" ? "button" : "buttonGhost"} onClick={() => setMode("login")}>
            Login
          </button>
          <button className={mode === "signup" ? "button" : "buttonGhost"} onClick={() => setMode("signup")}>
            Sign up
          </button>
        </div>

        <div className="authIntro">
          <p className="kicker">Role access</p>
          <h1 className="sectionTitle">Enter the RePlate operating system</h1>
          <p className="sectionLead">
            Use seeded demo accounts or create a new profile to explore the live product flows.
          </p>
        </div>

        {mode === "login" ? (
          <form className="stack" onSubmit={handleLogin}>
            <div className="field">
              <label>Choose account</label>
              <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} | {user.role} | {user.verificationStatus}
                  </option>
                ))}
              </select>
            </div>
            <button className="button" type="submit">Continue to dashboard</button>
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
              <button className="button" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
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
