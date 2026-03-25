import Link from "next/link";

const promises = [
  "Restaurants create live same-day surplus listings in under one minute.",
  "Consumers discover affordable meals nearby without needing delivery ops.",
  "NGOs claim donation inventory and admins keep the pilot safe and measurable."
];

const tracks = [
  { label: "Restaurant ops", value: "Fast posting", detail: "Quick publish, pickup windows, live status" },
  { label: "Demand side", value: "Instant claims", detail: "Consumers and NGOs reserve before food expires" },
  { label: "Safety layer", value: "Structured notes", detail: "Prepared time, allergens, food type, expiry" },
  { label: "Impact", value: "Measured daily", detail: "Meals redirected, fill rate, partner quality" }
];

const focusAreas = [
  "Role-based dashboards for restaurant, consumer, NGO, and admin",
  "Nagpur-first listing feed with self-pickup and donation routing",
  "Manual-ops-friendly system that still feels product-grade",
  "Expansion path toward real auth, database, and notifications"
];

export default function HomePage() {
  return (
    <main className="stack landingPage">
      <section className="landingHero">
        <div className="heroCopy card glassCard">
          <p className="kicker">Nagpur pilot</p>
          <h1 className="heroTitle">Move surplus food faster than it turns into waste.</h1>
          <p className="heroLead">
            RePlate connects restaurants, consumers, NGOs, and operations in one focused workflow.
            The product is built for dense local execution, strong safety signaling, and measurable diversion from day one.
          </p>
          <div className="heroActions">
            <Link href="/auth" className="button">Enter the product</Link>
            <Link href="/dashboard/admin" className="buttonGhost">See pilot metrics</Link>
          </div>
          <div className="statsRail compactRail">
            <div className="statTile">
              <span className="statLabel">Launch model</span>
              <strong>Self-pickup first</strong>
              <span className="muted small">Lowest operational drag for the MVP</span>
            </div>
            <div className="statTile">
              <span className="statLabel">Target market</span>
              <strong>Nagpur neighborhoods</strong>
              <span className="muted small">Start dense before city-wide expansion</span>
            </div>
            <div className="statTile">
              <span className="statLabel">Core proof</span>
              <strong>Supply meets demand</strong>
              <span className="muted small">Restaurants post, claims happen, ops stay manageable</span>
            </div>
          </div>
        </div>

        <div className="heroAside stack">
          <section className="card spotlightCard">
            <h2 className="sectionTitle">What the MVP proves</h2>
            <div className="stack">
              {promises.map((promise, index) => (
                <div key={promise} className="storyCard">
                  <span className="storyIndex">0{index + 1}</span>
                  <p>{promise}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="card featureField">
        <div>
          <p className="kicker">Product structure</p>
          <h2 className="sectionTitle">Built for validation first, scale second</h2>
          <p className="sectionLead">
            The current product already gives you role-specific screens, listing and reservation flows, and a control layer for verification and oversight.
          </p>
        </div>
        <div className="featureGrid">
          {tracks.map((track) => (
            <div key={track.label} className="featureCard">
              <span className="statLabel">{track.label}</span>
              <strong>{track.value}</strong>
              <p className="muted small">{track.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="splitSection">
        <div className="card">
          <p className="kicker">Why it works</p>
          <h2 className="sectionTitle">One workflow, four aligned actors</h2>
          <div className="stack">
            {focusAreas.map((area) => (
              <div key={area} className="banner">{area}</div>
            ))}
          </div>
        </div>
        <div className="card quoteCard">
          <p className="kicker">Operational principle</p>
          <h2 className="sectionTitle">Keep logistics light, keep trust high</h2>
          <p className="heroLead" style={{ marginBottom: 0 }}>
            RePlate should win by making surplus visible and claimable quickly, not by taking on delivery complexity too early.
            That is why the interface emphasizes speed, clarity, and safe pickup windows before anything else.
          </p>
        </div>
      </section>
    </main>
  );
}
