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
    if (path === "/auth/change-password" && !tempToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    const publicRoutes = [
      "/",
      "/auth/adminlogin",
      "/auth/login",
      "/auth/change-password",
    ];
    const isPublicRoute = publicRoutes.includes(path);
    if (!token && !isPublicRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
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
          new URL("/student/dashboard", req.url)
        );
      }
    }
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.SECRET!
      ) as Payload;
      if (
        path.startsWith("/admin") &&
        decoded.role !== "superadmin"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (
        path.startsWith("/manager") &&
        decoded.role !== "manager"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (
        path.startsWith("/teacher") &&
        decoded.role !== "teacher"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (
        path.startsWith("/student") &&
  decoded.role !== "student"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/manager/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/auth/adminlogin",
    "/auth/login",
    "/auth/change-password",
  ],
};