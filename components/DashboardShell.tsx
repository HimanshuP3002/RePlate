"use client";

import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

interface DashboardShellProps {
  kicker: string;
  title: string;
  lead: string;
  role: "restaurant" | "consumer" | "ngo" | "admin";
  children: React.ReactNode;
  stats?: Array<{ label: string; value: string | number; detail?: string }>;
}

const roleLinks = [
  { href: "/dashboard/restaurant", label: "Restaurant", role: "restaurant" },
  { href: "/dashboard/consumer", label: "Consumer", role: "consumer" },
  { href: "/dashboard/ngo", label: "NGO", role: "ngo" },
  { href: "/dashboard/admin", label: "Admin", role: "admin" }
] as const;

export function DashboardShell({ kicker, title, lead, role, children, stats = [] }: DashboardShellProps) {
  return (
    <main className="stack dashboardPage">
      <section className="heroPanel">
        <div className="heroPanelTop">
          <div>
            <p className="kicker">{kicker}</p>
            <h1 className="heroPanelTitle">{title}</h1>
            <p className="sectionLead" style={{ marginBottom: 0 }}>{lead}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="roleTabs">
          {roleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.role === role ? "tabButton active" : "tabButton"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {stats.length > 0 ? (
          <div className="statsRail">
            {stats.map((stat) => (
              <div key={stat.label} className="statTile">
                <span className="statLabel">{stat.label}</span>
                <strong>{stat.value}</strong>
                {stat.detail ? <span className="muted small">{stat.detail}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {children}
    </main>
  );
}
