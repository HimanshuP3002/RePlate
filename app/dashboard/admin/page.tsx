"use client";

import { AuthGate } from "@/components/AuthGate";
import { DashboardShell } from "@/components/DashboardShell";
import { ListingCard } from "@/components/ListingCard";
import { ListingView, User, VerificationStatus } from "@/lib/types";
import { useEffect, useState } from "react";

interface Metrics {
  activeRestaurants: number;
  liveListings: number;
  reservations: number;
  openReports: number;
  mealsRedistributed: number;
  fillRate: number;
}

export default function AdminDashboardPage() {
  return (
    <AuthGate role="admin">
      {() => <AdminDashboard />}
    </AuthGate>
  );
}

function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<ListingView[]>([]);

  async function loadData() {
    const [metricsResponse, usersResponse, listingsResponse] = await Promise.all([
      fetch("/api/admin/metrics"),
      fetch("/api/users"),
      fetch("/api/listings")
    ]);
    const metricsData = await metricsResponse.json();
    const usersData = await usersResponse.json();
    const listingsData = await listingsResponse.json();
    setMetrics(metricsData.metrics);
    setUsers(usersData.users);
    setListings(listingsData.listings);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function updateVerification(userId: string, verificationStatus: VerificationStatus) {
    await fetch("/api/admin/verify-user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, verificationStatus })
    });
    await loadData();
  }

  return (
    <DashboardShell
      role="admin"
      kicker="Pilot command center"
      title="Moderate partners, monitor risk, and track market movement"
      lead="This control layer keeps the Nagpur pilot safe, dense, and measurable without building enterprise overhead too early."
      stats={
        metrics
          ? [
              { label: "Active restaurants", value: metrics.activeRestaurants },
              { label: "Live listings", value: metrics.liveListings },
              { label: "Reservations", value: metrics.reservations },
              { label: "Open reports", value: metrics.openReports },
              { label: "Meals completed", value: metrics.mealsRedistributed },
              { label: "Fill rate", value: `${metrics.fillRate}%` }
            ]
          : []
      }
    >
      <section className="workspaceGrid">
        <div className="panel workspaceCard">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Verification queue</p>
              <h2 className="sectionTitle">Approve or hold partners</h2>
            </div>
          </div>
          <div className="stack">
            {users
              .filter((user) => user.role !== "consumer" && user.role !== "admin")
              .map((user) => (
                <div key={user.id} className="partnerCard">
                  <div className="row">
                    <div>
                      <strong>{user.name}</strong>
                      <p className="small muted" style={{ margin: "6px 0 0" }}>
                        {user.role} | {user.area}
                      </p>
                    </div>
                    <span className={`status ${user.verificationStatus}`}>{user.verificationStatus}</span>
                  </div>
                  <div className="actionRow">
                    <button className="button" onClick={() => updateVerification(user.id, "verified")}>Verify</button>
                    <button className="buttonDanger" onClick={() => updateVerification(user.id, "rejected")}>Reject</button>
                    <button className="buttonGhost" onClick={() => updateVerification(user.id, "pending")}>Mark pending</button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="panel workspaceCard">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Market snapshot</p>
              <h2 className="sectionTitle">What the city sees right now</h2>
            </div>
          </div>
          <div className="stack">
            {listings.slice(0, 3).map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
