"use client";

import { SessionUser, getSession } from "@/lib/session";
import { UserRole } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthGateProps {
  role?: UserRole;
  children: (session: SessionUser) => React.ReactNode;
}

export function AuthGate({ role, children }: AuthGateProps) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="banner">Loading RePlate workspace...</div>;
  }

  if (!session) {
    return (
      <div className="card">
        <h1 className="sectionTitle">Login required</h1>
        <p className="sectionLead">Use the role-based login to open this dashboard.</p>
        <Link href="/auth" className="button">
          Go to login
        </Link>
      </div>
    );
  }

  if (role && session.role !== role) {
    return (
      <div className="card">
        <h1 className="sectionTitle">Role mismatch</h1>
        <p className="sectionLead">
          You are logged in as <strong>{session.role}</strong>. Switch accounts to access this dashboard.
        </p>
        <Link href="/auth" className="button">
          Switch account
        </Link>
      </div>
    );
  }

  return <>{children(session)}</>;
}
