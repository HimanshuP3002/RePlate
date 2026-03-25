import { createNgoProfile, createRestaurantProfile, createUser } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const role = body.role as UserRole;

  const user = createUser({
    name: body.name,
    email: body.email,
    phone: body.phone,
    area: body.area,
    role
  });

  if (role === "restaurant") {
    createRestaurantProfile({
      userId: user.id,
      businessName: `${user.name}'s Kitchen`,
      address: `${body.area}, Nagpur`,
      hours: "11:00-22:00",
      fssaiOptional: ""
    });
  }

  if (role === "ngo") {
    createNgoProfile({
      userId: user.id,
      ngoName: user.name,
      serviceArea: body.area,
      verificationNotes: "Submitted via MVP signup"
    });
  }

  return NextResponse.json({ user }, { status: 201 });
}
