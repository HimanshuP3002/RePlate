"use client";

import { AuthGate } from "@/components/AuthGate";
import { DashboardShell } from "@/components/DashboardShell";
import { ListingCard } from "@/components/ListingCard";
import { ReservationList } from "@/components/ReservationList";
import { ListingView, ReservationView } from "@/lib/types";
import { useEffect, useState } from "react";

export default function NgoDashboardPage() {
  return (
    <AuthGate role="ngo">
      {(session) => <NgoDashboard userId={session.id} />}
    </AuthGate>
  );
}

function NgoDashboard({ userId }: { userId: string }) {
  const [listings, setListings] = useState<ListingView[]>([]);
  const [reservations, setReservations] = useState<ReservationView[]>([]);
  const [feedback, setFeedback] = useState("");

  async function loadData() {
    const [listingResponse, reservationResponse] = await Promise.all([
      fetch("/api/listings?donationOnly=true"),
      fetch(`/api/reservations?userId=${userId}`)
    ]);
    const listingData = await listingResponse.json();
    const reservationData = await reservationResponse.json();
    setListings(listingData.listings);
    setReservations(reservationData.reservations);
  }

  useEffect(() => {
    void loadData();
  }, [userId]);

  async function claimDonation(listingId: string) {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        userId,
        actorType: "ngo",
        quantityClaimed: 1
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setFeedback(data.error ?? "Could not claim donation listing.");
      return;
    }

    setFeedback("Donation claim created. Coordinate pickup with the restaurant manually.");
    await loadData();
  }

  return (
    <DashboardShell
      role="ngo"
      kicker="NGO rescue board"
      title="Claim donation inventory and coordinate rescue pickups"
      lead="This view stays focused on donation-only inventory and fast rescue coordination."
      stats={[
        { label: "Donation listings", value: listings.filter((item) => item.status === "available").length },
        { label: "Your claims", value: reservations.length },
        { label: "Urgent partner mode", value: "Manual", detail: "WhatsApp and direct calls still drive scheduling" }
      ]}
    >
      {feedback ? <div className="feedbackNotice">{feedback}</div> : null}

      <section className="workspaceGrid">
        <div className="stack">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Donation inventory</p>
              <h2 className="sectionTitle">Claim high-impact surplus quickly</h2>
            </div>
          </div>
          <div className="listGrid">
            {listings.length === 0 ? <div className="empty">No donation inventory is available right now.</div> : null}
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                action={
                  <button className="button" disabled={listing.status !== "available"} onClick={() => claimDonation(listing.id)}>
                    {listing.status === "available" ? "Claim for NGO pickup" : "Unavailable"}
                  </button>
                }
              />
            ))}
          </div>
        </div>

        <div className="panel workspaceCard">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Claim log</p>
              <h2 className="sectionTitle">Your NGO rescue history</h2>
            </div>
          </div>
          <ReservationList reservations={reservations} emptyLabel="No NGO claims yet." />
          <p className="footerNote">Use manual coordination for route timing and bulk handoff confirmation until logistics automation is introduced.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
