import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Smart Quiz Portal",
  description: "This is a quiz or test portal for your organization to test your users",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <AuthProvider>
              <ToastContainer />
              {children}
            </AuthProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </>
  );
}
