import { formatDateTime } from "@/lib/format";
import { ReservationView } from "@/lib/types";

interface ReservationListProps {
  reservations: ReservationView[];
  action?: (reservation: ReservationView) => React.ReactNode;
  emptyLabel?: string;
}

export function ReservationList({ reservations, action, emptyLabel = "No reservations yet." }: ReservationListProps) {
  if (reservations.length === 0) {
    return <div className="empty">{emptyLabel}</div>;
  }

  return (
    <div className="stack">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="panel reservationCard">
          <div className="row" style={{ alignItems: "flex-start" }}>
            <div>
              <strong>{reservation.listingTitle}</strong>
              <p className="muted small" style={{ margin: "6px 0 0" }}>
                {reservation.restaurantName} | {reservation.actorType} claim | {formatDateTime(reservation.claimedAt)}
              </p>
            </div>
            <span className={`status ${reservation.status}`}>{reservation.status}</span>
          </div>
          {action ? <div className="actionRow">{action(reservation)}</div> : null}
        </div>
      ))}
    </div>
  );
}
