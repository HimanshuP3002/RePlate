import {
  Listing,
  ListingView,
  NgoProfile,
  Report,
  Reservation,
  ReservationView,
  RestaurantProfile,
  User,
  UserRole,
  VerificationStatus
} from "@/lib/types";

const now = new Date();
const plusHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
const minusHours = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

interface Store {
  users: User[];
  restaurantProfiles: RestaurantProfile[];
  ngoProfiles: NgoProfile[];
  listings: Listing[];
  reservations: Reservation[];
  reports: Report[];
}

const initialStore = (): Store => ({
  users: [
    {
      id: "rest-1",
      name: "Ananya Joshi",
      email: "owner@saffronplate.in",
      phone: "9876543210",
      area: "Dharampeth",
      role: "restaurant",
      verificationStatus: "verified"
    },
    {
      id: "cons-1",
      name: "Rohan Kale",
      email: "rohan@example.com",
      phone: "9123456780",
      area: "Sadar",
      role: "consumer",
      verificationStatus: "verified"
    },
    {
      id: "ngo-1",
      name: "Seva Meal Network",
      email: "hello@sevameals.org",
      phone: "9988776655",
      area: "Sitabuldi",
      role: "ngo",
      verificationStatus: "pending"
    },
    {
      id: "admin-1",
      name: "RePlate Ops",
      email: "ops@replate.app",
      phone: "9000000000",
      area: "Nagpur",
      role: "admin",
      verificationStatus: "verified"
    }
  ],
  restaurantProfiles: [
    {
      userId: "rest-1",
      businessName: "Saffron Plate Kitchen",
      address: "WHC Road, Dharampeth, Nagpur",
      hours: "11:00-23:00",
      fssaiOptional: "FSSAI-PENDING"
    }
  ],
  ngoProfiles: [
    {
      userId: "ngo-1",
      ngoName: "Seva Meal Network",
      serviceArea: "Sitabuldi, Sadar, Itwari",
      verificationNotes: "Awaiting field check"
    }
  ],
  listings: [
    {
      id: "lst-1",
      restaurantId: "rest-1",
      title: "Veg thali surplus trays",
      category: "Prepared meals",
      quantity: 12,
      unit: "plates",
      price: 59,
      isDonation: false,
      area: "Dharampeth",
      preparedAt: minusHours(2),
      pickupStart: plusHours(1),
      pickupEnd: plusHours(3),
      status: "available",
      foodType: "veg",
      notes: "Same-day cooked. Pickup in sealed boxes.",
      allergenInfo: "Contains dairy"
    },
    {
      id: "lst-2",
      restaurantId: "rest-1",
      title: "Bakery rolls for NGO pickup",
      category: "Bakery",
      quantity: 30,
      unit: "pieces",
      price: 0,
      isDonation: true,
      area: "Dharampeth",
      preparedAt: minusHours(4),
      pickupStart: plusHours(0.5),
      pickupEnd: plusHours(2),
      status: "available",
      foodType: "veg",
      notes: "Donation only. Best before tonight.",
      allergenInfo: "Contains gluten"
    }
  ],
  reservations: [
    {
      id: "res-1",
      listingId: "lst-1",
      userId: "cons-1",
      actorType: "consumer",
      quantityClaimed: 2,
      status: "reserved",
      claimedAt: minusHours(1)
    }
  ],
  reports: [
    {
      id: "rep-1",
      reservationId: "res-1",
      reporterId: "cons-1",
      issueType: "pickup-delay",
      description: "Pickup queue was longer than expected.",
      status: "open"
    }
  ]
});

declare global {
  var replateStore: Store | undefined;
}

const store = globalThis.replateStore ?? initialStore();

if (!globalThis.replateStore) {
  globalThis.replateStore = store;
}

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export function getStore() {
  return globalThis.replateStore!;
}

export function listUsers(role?: UserRole) {
  const users = getStore().users;
  return role ? users.filter((user) => user.role === role) : users;
}

export function createUser(input: Omit<User, "id" | "verificationStatus"> & { verificationStatus?: VerificationStatus }) {
  const user: User = {
    ...input,
    id: makeId("usr"),
    verificationStatus: input.verificationStatus ?? (input.role === "consumer" ? "verified" : "pending")
  };
  getStore().users.unshift(user);
  return user;
}

export function createRestaurantProfile(input: RestaurantProfile) {
  getStore().restaurantProfiles.push(input);
}

export function createNgoProfile(input: NgoProfile) {
  getStore().ngoProfiles.push(input);
}

export function listListings(filters?: { area?: string; donationOnly?: boolean; status?: string }) {
  const current = getStore().listings.map(autoExpire);
  return current.filter((listing) => {
    if (filters?.area && listing.area !== filters.area) {
      return false;
    }
    if (filters?.donationOnly && !listing.isDonation) {
      return false;
    }
    if (filters?.status && listing.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export function listListingViews(filters?: { area?: string; donationOnly?: boolean; status?: string }) {
  return listListings(filters).map((listing) => toListingView(listing));
}

export function getListing(id: string) {
  const listing = getStore().listings.find((item) => item.id === id);
  return listing ? autoExpire(listing) : null;
}

export function getListingView(id: string) {
  const listing = getListing(id);
  return listing ? toListingView(listing) : null;
}

export function createListing(input: Omit<Listing, "id" | "status">) {
  const listing: Listing = {
    ...input,
    id: makeId("lst"),
    status: "available"
  };
  getStore().listings.unshift(listing);
  return toListingView(listing);
}

export function createReservation(input: Omit<Reservation, "id" | "status" | "claimedAt">) {
  const listing = getStore().listings.find((item) => item.id === input.listingId);
  if (!listing) {
    throw new Error("Listing not found");
  }
  autoExpire(listing);
  if (listing.status !== "available") {
    throw new Error("Listing is not available");
  }
  listing.status = "reserved";
  const reservation: Reservation = {
    ...input,
    id: makeId("res"),
    claimedAt: new Date().toISOString(),
    status: "reserved"
  };
  getStore().reservations.unshift(reservation);
  return toReservationView(reservation);
}

export function updateReservationStatus(id: string, status: Reservation["status"]) {
  const reservation = getStore().reservations.find((item) => item.id === id);
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  reservation.status = status;
  reservation.completedAt = status === "completed" ? new Date().toISOString() : reservation.completedAt;
  const listing = getStore().listings.find((item) => item.id === reservation.listingId);
  if (listing) {
    listing.status = status === "completed" ? "completed" : "available";
  }
  return toReservationView(reservation);
}

export function listReservations(userId?: string) {
  const reservations = getStore().reservations;
  return userId ? reservations.filter((reservation) => reservation.userId === userId) : reservations;
}

export function listReservationViews(userId?: string) {
  return listReservations(userId).map((reservation) => toReservationView(reservation));
}

export function updateUserVerification(userId: string, verificationStatus: VerificationStatus) {
  const user = getStore().users.find((entry) => entry.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.verificationStatus = verificationStatus;
  return user;
}

export function getMetrics() {
  const currentListings = listListings();
  const reservations = getStore().reservations;
  const completed = reservations.filter((entry) => entry.status === "completed");
  return {
    activeRestaurants: getStore().users.filter((user) => user.role === "restaurant").length,
    liveListings: currentListings.filter((listing) => listing.status === "available").length,
    reservations: reservations.filter((entry) => entry.status !== "cancelled").length,
    openReports: getStore().reports.filter((report) => report.status === "open").length,
    mealsRedistributed: completed.reduce((sum, reservation) => sum + reservation.quantityClaimed, 0),
    fillRate: currentListings.length === 0 ? 0 : Math.round((reservations.length / currentListings.length) * 100)
  };
}

function autoExpire(listing: Listing) {
  if (listing.status === "available" && new Date(listing.pickupEnd).getTime() < Date.now()) {
    listing.status = "expired";
  }
  return listing;
}

function toListingView(listing: Listing): ListingView {
  const profile = getStore().restaurantProfiles.find((item) => item.userId === listing.restaurantId);
  const user = getStore().users.find((item) => item.id === listing.restaurantId);

  return {
    ...listing,
    restaurantName: profile?.businessName ?? user?.name ?? "Restaurant partner",
    restaurantArea: user?.area ?? listing.area
  };
}

function toReservationView(reservation: Reservation): ReservationView {
  const listing = getStore().listings.find((item) => item.id === reservation.listingId);
  const listingView = listing ? toListingView(autoExpire(listing)) : null;

  return {
    ...reservation,
    listingTitle: listingView?.title ?? "Removed listing",
    restaurantName: listingView?.restaurantName ?? "Unknown partner",
    listingStatus: listingView?.status ?? "expired"
  };
}
