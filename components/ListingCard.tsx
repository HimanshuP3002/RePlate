import { formatCurrency, formatDateTime } from "@/lib/format";
import { ListingView } from "@/lib/types";

interface ListingCardProps {
  listing: ListingView;
  action?: React.ReactNode;
}

export function ListingCard({ listing, action }: ListingCardProps) {
  return (
    <article className="listingCard">
      <div className="listingHead">
        <div>
          <div className="kicker">{listing.isDonation ? "Donation" : "Discounted meal"}</div>
          <h3 style={{ margin: "6px 0 4px" }}>{listing.title}</h3>
          <p className="muted small" style={{ margin: 0 }}>
            {listing.restaurantName} | {listing.restaurantArea} | {listing.category}
          </p>
        </div>
        <span className={`status ${listing.status}`}>{listing.status}</span>
      </div>

      <div className="chipRow" style={{ marginTop: 16 }}>
        <div className="chip">{listing.quantity} {listing.unit}</div>
        <div className="chip">{listing.foodType}</div>
        <div className="chip">{listing.isDonation ? "Free" : formatCurrency(listing.price)}</div>
      </div>

      <div className="metaList">
        <p className="small"><strong>Prepared:</strong> {formatDateTime(listing.preparedAt)}</p>
        <p className="small"><strong>Pickup:</strong> {formatDateTime(listing.pickupStart)} to {formatDateTime(listing.pickupEnd)}</p>
        <p className="small"><strong>Safety notes:</strong> {listing.notes}</p>
        {listing.allergenInfo ? <p className="small"><strong>Allergens:</strong> {listing.allergenInfo}</p> : null}
      </div>

      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </article>
  );
}
