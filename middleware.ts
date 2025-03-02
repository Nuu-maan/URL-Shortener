import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = ["/shorten", "/analytics"];

export default withAuth(
  function middleware(req) {
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
  matcher: ["/shorten", "/analytics"], // Protect these routes
};
