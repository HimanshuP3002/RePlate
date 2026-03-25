import { listAppUsers } from "@/lib/user-repository";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await listAppUsers();
  return NextResponse.json({ users });
}
