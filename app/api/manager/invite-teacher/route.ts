import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !Array.isArray(email) || email.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide teacher email(s).",
        },
        {
          status: 400,
        }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const serverRes = await axios.post(
      `${process.env.BACKEND_URL}/manager/invite`,
      body,
      {
        headers: {
          Cookie: `accessToken=${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(serverRes.data, {
      status: serverRes.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.response?.data?.message || "Failed to invite teacher",
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}