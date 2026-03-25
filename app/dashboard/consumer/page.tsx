"use client";

import { AuthGate } from "@/components/AuthGate";
import { DashboardShell } from "@/components/DashboardShell";
import { ListingCard } from "@/components/ListingCard";
import { ReservationList } from "@/components/ReservationList";
import { ListingView, ReservationView } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ConsumerDashboardPage() {
  return (
    <AuthGate role="consumer">
      {(session) => <ConsumerDashboard userId={session.id} />}
    </AuthGate>
  );
}

function ConsumerDashboard({ userId }: { userId: string }) {
  const [allListings, setAllListings] = useState<ListingView[]>([]);
  const [reservations, setReservations] = useState<ReservationView[]>([]);
  const [area, setArea] = useState("All");
  const [feedback, setFeedback] = useState("");

  async function loadData() {
    const [listingResponse, reservationResponse] = await Promise.all([
      fetch("/api/listings"),
      fetch(`/api/reservations?userId=${userId}`)
    ]);
    const listingData = await listingResponse.json();
    const reservationData = await reservationResponse.json();
    setAllListings(listingData.listings.filter((listing: ListingView) => !listing.isDonation));
    setReservations(reservationData.reservations);
  }

  useEffect(() => {
    void loadData();
  }, [userId]);

  async function reserveListing(listingId: string) {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        userId,
        actorType: "consumer",
        quantityClaimed: 1
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setFeedback(data.error ?? "Could not reserve listing.");
      return;
    }

    setFeedback("Meal reserved. Head to the restaurant within the pickup window.");
    await loadData();
  }

  const areas = ["All", ...new Set(allListings.map((listing) => listing.area))];
  const listings = area === "All" ? allListings : allListings.filter((listing) => listing.area === area);
  const liveReservations = reservations.filter((reservation) => reservation.status !== "cancelled");

  return (
    <DashboardShell
      role="consumer"
      kicker="Consumer feed"
      title="Find nearby surplus before it expires"
      lead="Browse discounted meals, reserve quickly, and pick up directly from the restaurant."
      stats={[
        { label: "Visible meals", value: listings.filter((item) => item.status === "available").length },
        { label: "Your reservations", value: liveReservations.length },
        { label: "Neighborhoods", value: Math.max(areas.length - 1, 0) }
      ]}
    >
      <section className="filterBar card">
        <div>
          <p className="kicker">Area filter</p>
          <h2 className="sectionTitle">Stay focused on pickup distance</h2>
        </div>
        <select value={area} onChange={(event) => setArea(event.target.value)}>
          {areas.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
        </select>
      </section>

      {feedback ? <div className="feedbackNotice">{feedback}</div> : null}

      <section className="workspaceGrid">
        <div className="stack">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Available meals</p>
              <h2 className="sectionTitle">Reserve before the pickup window closes</h2>
            </div>
          </div>
          <div className="listGrid">
            {listings.length === 0 ? <div className="empty">No surplus meals are available in this area right now.</div> : null}
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                action={
                  <button className="button" disabled={listing.status !== "available"} onClick={() => reserveListing(listing.id)}>
                    {listing.status === "available" ? "Reserve for pickup" : "Unavailable"}
                  </button>
                }
              />
            ))}
          </div>
        </div>

        <div className="panel workspaceCard">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Your claims</p>
              <h2 className="sectionTitle">Track pickups and history</h2>
            </div>
          </div>
          <ReservationList reservations={reservations} emptyLabel="No consumer reservations yet." />
        </div>
      </section>
    </DashboardShell>
  );
}
