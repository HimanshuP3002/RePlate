"use client";

import { AuthGate } from "@/components/AuthGate";
import { DashboardShell } from "@/components/DashboardShell";
import { ListingCard } from "@/components/ListingCard";
import { ReservationList } from "@/components/ReservationList";
import { ListingView, ReservationView } from "@/lib/types";
import { FormEvent, useEffect, useState } from "react";

export default function RestaurantDashboardPage() {
  return (
    <AuthGate role="restaurant">
      {(session) => <RestaurantDashboard userId={session.id} />}
    </AuthGate>
  );
}

function RestaurantDashboard({ userId }: { userId: string }) {
  const [listings, setListings] = useState<ListingView[]>([]);
  const [reservations, setReservations] = useState<ReservationView[]>([]);
  const [feedback, setFeedback] = useState("");

  async function loadData() {
    const [listingsResponse, reservationsResponse] = await Promise.all([
      fetch(`/api/listings?restaurantId=${userId}`),
      fetch("/api/reservations")
    ]);
    const listingData = await listingsResponse.json();
    const reservationData = await reservationsResponse.json();
    setListings(listingData.listings);
    setReservations(
      reservationData.reservations.filter((reservation: ReservationView) =>
        listingData.listings.some((listing: ListingView) => listing.id === reservation.listingId)
      )
    );
  }

  useEffect(() => {
    void loadData();
  }, [userId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      restaurantId: userId,
      title: String(form.get("title")),
      category: String(form.get("category")),
      quantity: Number(form.get("quantity")),
      unit: String(form.get("unit")),
      price: Number(form.get("price")),
      isDonation: String(form.get("isDonation")) === "yes",
      area: String(form.get("area")),
      preparedAt: String(form.get("preparedAt")),
      pickupStart: String(form.get("pickupStart")),
      pickupEnd: String(form.get("pickupEnd")),
      foodType: String(form.get("foodType")),
      notes: String(form.get("notes")),
      allergenInfo: String(form.get("allergenInfo"))
    };

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setFeedback("Could not publish listing. Check the form values and try again.");
      return;
    }

    setFeedback("Listing published successfully.");
    event.currentTarget.reset();
    await loadData();
  }

  async function updateReservation(id: string, status: "completed" | "cancelled") {
    await fetch(`/api/reservations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await loadData();
  }

  return (
    <DashboardShell
      role="restaurant"
      kicker="Restaurant operations"
      title="Post surplus and manage live handoffs"
      lead="Keep the flow fast: publish inventory, watch claims, and close the loop at pickup."
      stats={[
        { label: "Active listings", value: listings.filter((item) => item.status === "available").length },
        { label: "Claimed pickups", value: reservations.filter((item) => item.status === "reserved").length },
        { label: "Completed", value: reservations.filter((item) => item.status === "completed").length }
      ]}
    >
      <section className="workspaceGrid">
        <div className="formCard workspaceCard">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Create listing</p>
              <h2 className="sectionTitle">Publish same-day surplus</h2>
            </div>
          </div>
          <form className="formGrid" onSubmit={handleSubmit}>
            <div className="field"><label>Food title</label><input name="title" required placeholder="Veg biryani boxes" /></div>
            <div className="field"><label>Category</label><input name="category" required placeholder="Prepared meals" /></div>
            <div className="field"><label>Quantity</label><input name="quantity" type="number" min="1" required /></div>
            <div className="field"><label>Unit</label><input name="unit" required placeholder="boxes" /></div>
            <div className="field"><label>Area</label><input name="area" defaultValue="Dharampeth" required /></div>
            <div className="field"><label>Price (0 for donation)</label><input name="price" type="number" min="0" defaultValue="0" required /></div>
            <div className="field"><label>Donation only?</label><select name="isDonation" defaultValue="no"><option value="no">No</option><option value="yes">Yes</option></select></div>
            <div className="field"><label>Food type</label><select name="foodType" defaultValue="veg"><option value="veg">Veg</option><option value="non-veg">Non-veg</option></select></div>
            <div className="field"><label>Prepared at</label><input name="preparedAt" type="datetime-local" required /></div>
            <div className="field"><label>Pickup start</label><input name="pickupStart" type="datetime-local" required /></div>
            <div className="field"><label>Pickup end</label><input name="pickupEnd" type="datetime-local" required /></div>
            <div className="field"><label>Allergen info</label><input name="allergenInfo" placeholder="Contains dairy" /></div>
            <div className="field full"><label>Safety notes</label><textarea name="notes" required placeholder="Same-day cooked. Keep refrigerated after pickup." /></div>
            <div className="field full"><button className="button" type="submit">Publish listing</button></div>
          </form>
          {feedback ? <p className="feedbackNotice">{feedback}</p> : null}
        </div>

        <div className="panel workspaceCard">
          <div className="sectionHeader">
            <div>
              <p className="kicker">Claim queue</p>
              <h2 className="sectionTitle">Manage pickup commitments</h2>
            </div>
          </div>
          <ReservationList
            reservations={reservations}
            emptyLabel="No claims have come in yet."
            action={(reservation) =>
              reservation.status === "reserved" ? (
                <>
                  <button className="button" onClick={() => updateReservation(reservation.id, "completed")}>Mark completed</button>
                  <button className="buttonGhost" onClick={() => updateReservation(reservation.id, "cancelled")}>Release listing</button>
                </>
              ) : null
            }
          />
        </div>
      </section>

      <section className="stack">
        <div className="sectionHeader">
          <div>
            <p className="kicker">Inventory</p>
            <h2 className="sectionTitle">Your active and historical listings</h2>
          </div>
        </div>
        <div className="listGrid">
          {listings.length === 0 ? <div className="empty">No listings yet.</div> : null}
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      </section>
    </DashboardShell>
  );
}
