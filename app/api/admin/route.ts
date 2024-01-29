import { currentUserRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const role = await currentUserRole();
  if (role === "ADMIN") {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
