import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exempt login gate, public APIs, and next static chunks/assets to avoid any loading loops
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Enforce secure administrative cookie verification for all dashboard paths
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("axon_admin_token")?.value;

    // Reject unauthenticated requests and securely redirect to the decryption control gate
    if (!adminToken || adminToken !== "super_secret_axon_token_authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
