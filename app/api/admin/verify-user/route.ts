import { setUserVerification } from "@/lib/user-repository";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await setUserVerification(body.userId, body.verificationStatus);
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update verification";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
