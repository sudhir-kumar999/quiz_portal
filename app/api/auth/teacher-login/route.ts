import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log(body);
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Both are required from next js",
        },
        {
          status: 400,
        },
      );
    }
    const serverRes = await axios.post(
      `${process.env.BACKEND_URL}/teacher/login`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    // console.log(serverRes.data)
    const response = NextResponse.json(serverRes.data, {
      status: serverRes.status,
    });

    const tempToken = serverRes.data.tempToken;
    if (tempToken) {
      response.cookies.set("tempToken", tempToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    return response;

    }

    const token = serverRes.data.accessToken;
    // console.log("tokrn",token)
    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.log(error.response?.status)

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
