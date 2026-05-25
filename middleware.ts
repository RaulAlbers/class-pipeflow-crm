import { type NextRequest, NextResponse } from "next/server";

// TODO (M5 — Auth): Replace with Supabase session refresh + route protection.
// - Refresh the user's session on every request via @supabase/ssr
// - Redirect unauthenticated users to /login for protected routes under /(app)/*
// - Redirect authenticated users away from /(auth)/* routes

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
