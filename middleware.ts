import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = ["/shorten", "/analytics"];

export default withAuth(
  function middleware(req) {
    // Forward shortcode requests to the appropriate API endpoint
    const pathname = req.nextUrl.pathname;
    if (pathname.length > 1 && !pathname.startsWith("/api") && !protectedRoutes.includes(pathname)) {
      // This could be a shortened URL
      const shortcode = pathname.slice(1); // Remove the leading slash
      if (shortcode && shortcode.length > 0) {
        // Redirect to our API handler for shortened URLs
        return NextResponse.rewrite(new URL(`/api/url/shortcode/${shortcode}`, req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow access if user is authenticated OR if the route is public
        return !!token || !protectedRoutes.includes(req.nextUrl.pathname);
      },
    },
    pages: {
      signIn: "/api/auth/signin", // Redirect to sign-in page if not authenticated
    },
  }
);

// Apply middleware to specific routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Match all routes except Next.js internal routes
};
