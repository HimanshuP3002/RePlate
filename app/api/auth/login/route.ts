import { loginAppUser } from "@/lib/user-repository";
import { UserRole } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await loginAppUser(body.email, body.role as UserRole);

    if (!user) {
      return NextResponse.json({ error: "No matching account found. Sign up first." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not login";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
