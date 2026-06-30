import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized login again",
        },
        {
          status: 401,
        },
      );
    }
    const serverData = await axios.post(
      `${process.env.BACKEND_URL}/admin/create-org`,
      body,
      {
        headers: {
          Cookie: `accessToken=${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    return NextResponse.json(serverData.data, {
      status: serverData.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "node error",
        },
        {
          status: error.response?.status,
        },
      );
    }
  }
}
