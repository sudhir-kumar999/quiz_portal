import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("accessToken")?.value;

    const serverResponse = await axios.post(
      `${process.env.BACKEND_URL}/teacher/ban-users`,
      {
        userId,
      },
      {
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    return NextResponse.json(serverResponse.data, {
      status: serverResponse.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? {
          success: false,
          message: "Failed",
        },
        {
          status: error.response?.status ?? 500,
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