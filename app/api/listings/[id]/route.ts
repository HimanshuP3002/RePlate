import { getListingView } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListingView(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}
