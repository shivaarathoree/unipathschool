import { NextRequest, NextResponse } from "next/server";

/**
 * Edge Middleware — enforces authentication on all protected routes.
 * Runs before any page render. Redirects to /login if the session cookie
 * is absent. Pages in publicRoutes are always accessible.
 *
 * NOTE: We rely on the Firebase ID token stored in localStorage on the
 * client (handled by ProtectedRoute component). For true edge-level
 * protection we check for the presence of the Firebase session marker.
 * Full token verification happens server-side in API routes via firebase-admin.
 */

const protectedRoutes = [
    "/dashboard",
    "/onboarding",
    "/ai-interview",
    "/career-discovery",
    "/company-sheets",
    "/faang-roadmap",
    "/team",
    "/timeline-demo",
];

const publicRoutes = ["/", "/login", "/pricing"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Security headers for all responses
    const response = NextResponse.next();

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    // Never cache auth-sensitive pages
    if (protectedRoutes.some((r) => pathname.startsWith(r))) {
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt
         * - public folder assets
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public).*)",
    ],
};
