import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Payload extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    const tempToken = req.cookies.get("tempToken")?.value;
    const path = req.nextUrl.pathname;

    // Protect Change Password page
    if (path === "/auth/change-password" && !tempToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    console.log("Path:", path);
    console.log("Token:", token);

    const publicRoutes = [
      "/",
      "/auth/adminlogin",
      "/auth/login",
      "/auth/change-password",
    ];

    const isPublicRoute = publicRoutes.includes(path);

    // Protect private routes
    if (!token && !isPublicRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Already logged in
    if (
      token &&
      (path === "/" ||
        path === "/auth/adminlogin" ||
        path === "/auth/login")
    ) {
      const decoded = jwt.verify(
        token,
        process.env.SECRET!
      ) as Payload;

      if (decoded.role === "superadmin") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.url)
        );
      }

      if (decoded.role === "manager") {
        return NextResponse.redirect(
          new URL("/manager/dashboard", req.url)
        );
      }

      if (decoded.role === "teacher") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", req.url)
        );
      }

      if (decoded.role === "student") {
        return NextResponse.redirect(
          new URL("/dashboard", req.url)
        );
      }
    }

    // Role Based Protection
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.SECRET!
      ) as Payload;

      // Super Admin
      if (
        path.startsWith("/admin") &&
        decoded.role !== "superadmin"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Manager
      if (
        path.startsWith("/manager") &&
        decoded.role !== "manager"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Teacher
      if (
        path.startsWith("/teacher") &&
        decoded.role !== "teacher"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Student
      if (
        path.startsWith("/dashboard") &&
        decoded.role !== "student"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);

    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/manager/:path*",
    "/teacher/:path*",
    "/dashboard/:path*",
    "/auth/adminlogin",
    "/auth/login",
    "/auth/change-password",
  ],
};