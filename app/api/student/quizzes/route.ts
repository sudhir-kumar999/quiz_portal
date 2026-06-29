import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("accessToken")?.value;

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

    const serverResponse = await axios.get(
      `${process.env.BACKEND_URL}/student/get-quiz`,
      {
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    return NextResponse.json(
      serverResponse.data,
      {
        status: serverResponse.status,
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? {
          success: false,
          message: "Failed to fetch quizzes",
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