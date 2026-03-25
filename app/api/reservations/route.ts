import { createReservation, listReservationViews } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") ?? undefined;
  return NextResponse.json({ reservations: listReservationViews(userId) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reservation = createReservation({
      listingId: body.listingId,
      userId: body.userId,
      actorType: body.actorType,
      quantityClaimed: Number(body.quantityClaimed ?? 1)
    });
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not reserve listing";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
