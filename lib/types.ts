export type UserRole = "restaurant" | "consumer" | "ngo" | "admin";

export type VerificationStatus = "pending" | "verified" | "rejected";
export type ListingStatus = "available" | "reserved" | "completed" | "expired";
export type ReservationStatus = "reserved" | "completed" | "cancelled";
export type ReportStatus = "open" | "resolved";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
}

export interface RestaurantProfile {
  userId: string;
  businessName: string;
  address: string;
  hours: string;
  fssaiOptional?: string;
}

export interface NgoProfile {
  userId: string;
  ngoName: string;
  serviceArea: string;
  verificationNotes?: string;
}

export interface Listing {
  id: string;
  restaurantId: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  isDonation: boolean;
  area: string;
  preparedAt: string;
  pickupStart: string;
  pickupEnd: string;
  status: ListingStatus;
  foodType: "veg" | "non-veg";
  notes: string;
  allergenInfo?: string;
}

export interface Reservation {
  id: string;
  listingId: string;
  userId: string;
  actorType: "consumer" | "ngo";
  quantityClaimed: number;
  status: ReservationStatus;
  claimedAt: string;
  completedAt?: string;
}

export interface Report {
  id: string;
  reservationId: string;
  reporterId: string;
  issueType: string;
  description: string;
  status: ReportStatus;
}

export interface ListingView extends Listing {
  restaurantName: string;
  restaurantArea: string;
}

export interface ReservationView extends Reservation {
  listingTitle: string;
  restaurantName: string;
  listingStatus: ListingStatus;
}
