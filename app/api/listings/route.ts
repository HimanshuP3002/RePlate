import { createListing, listListingViews } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area") ?? undefined;
  const donationOnly = searchParams.get("donationOnly") === "true";
  const restaurantId = searchParams.get("restaurantId") ?? undefined;

  const listings = listListingViews({ area, donationOnly }).filter((listing) =>
    restaurantId ? listing.restaurantId === restaurantId : true
  );

  return NextResponse.json({ listings });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const listing = createListing({
    restaurantId: body.restaurantId,
    title: body.title,
    category: body.category,
    quantity: Number(body.quantity),
    unit: body.unit,
    price: Number(body.price),
    isDonation: Boolean(body.isDonation) || Number(body.price) === 0,
    area: body.area,
    preparedAt: new Date(body.preparedAt).toISOString(),
    pickupStart: new Date(body.pickupStart).toISOString(),
    pickupEnd: new Date(body.pickupEnd).toISOString(),
    foodType: body.foodType,
    notes: body.notes,
    allergenInfo: body.allergenInfo
  });

  return NextResponse.json({ listing }, { status: 201 });
}
