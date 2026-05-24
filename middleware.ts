import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // High performance header injection for AXON networks
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-axon-request-time", new Date().toISOString());

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Apply premium Web3 security/context headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - static files (_next/static, _next/image, public assets, and common extensions)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|axon-|free-|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};
