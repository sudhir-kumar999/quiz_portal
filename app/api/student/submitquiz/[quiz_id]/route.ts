import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    quiz_id: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { quiz_id } = await params;
    const body = await req.json();
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
    const serverResponse = await axios.post(
      `${process.env.BACKEND_URL}/student/submitquiz/${quiz_id}`,
      body,
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
          message: "Failed to submit quiz",
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