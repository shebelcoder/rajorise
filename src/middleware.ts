import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Admin routes: require ADMIN role ---
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "ADMIN") {
      // Log unauthorized access attempt
      console.warn(`[SECURITY] Unauthorized admin access attempt by ${token.email} (role: ${token.role})`);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Admin email whitelist check
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rajorise.com")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!adminEmails.includes((token.email || "").toLowerCase())) {
      console.warn(`[SECURITY] Admin email not whitelisted: ${token.email}`);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // --- Journalist routes: require JOURNALIST role ---
  if (pathname.startsWith("/journalist")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "JOURNALIST") {
      console.warn(`[SECURITY] Unauthorized journalist access attempt by ${token.email} (role: ${token.role})`);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // --- Donor account routes: require any authenticated user ---
  if (pathname.startsWith("/account")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // --- Portal admin-login: optional secret key check ---
  if (pathname === "/portal/admin-login") {
    const key = req.nextUrl.searchParams.get("key");
    const adminSecret = process.env.ADMIN_LOGIN_SECRET;

    if (adminSecret && key !== adminSecret) {
      // If ADMIN_LOGIN_SECRET is set, require it as query param
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/journalist/:path*",
    "/account/:path*",
    "/portal/admin-login",
  ],
};
