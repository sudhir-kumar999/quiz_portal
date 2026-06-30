import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;
    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required from next js",
        },
        {
          status: 400,
        },
      );
    }
    const cookieStore = await cookies();
    const tempToken = cookieStore.get("tempToken")?.value;
    const serverRes = await axios.post(
      `${process.env.BACKEND_URL}/manager/reset-password`,
      body,
      {
        headers: {
          Cookie: `tempToken=${tempToken}`,
        },
        withCredentials: true,
      },
    );
    const response = NextResponse.json(serverRes.data, {
      status: serverRes.status,
    });
    return response;
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
