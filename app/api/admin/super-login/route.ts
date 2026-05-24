import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password === process.env.SUPER_ADMIN_PASSWORD || "axon123") {
      return NextResponse.json({ success: true, token: "super_admin_token" });
    }
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }
}
