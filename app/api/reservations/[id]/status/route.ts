import { updateReservationStatus } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const reservation = updateReservationStatus(id, body.status);
    return NextResponse.json({ reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update reservation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
