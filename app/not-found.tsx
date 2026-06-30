"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function NotFound() {
  const router = useRouter();
  const { user } = useContext(AuthContext)!;
  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    switch (user.role) {
    case "superadmin":
      router.replace("/admin/dashboard");
      break;
    case "manager":
      router.replace("/manager/dashboard");
      break;
    case "teacher":
      router.replace("/teacher/dashboard");
      break;
    case "student":
      router.replace("/student/dashboard");
      break;
    default:
      router.replace("/");
    }
  }, [user, router]);
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}