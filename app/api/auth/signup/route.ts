import { createAppUser } from "@/lib/user-repository";
import { UserRole } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = body.role as UserRole;

    const user = await createAppUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      area: body.area,
      role
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create account";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
