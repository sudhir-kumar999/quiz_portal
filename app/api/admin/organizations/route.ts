import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();

    const token = cookieStore.get("accessToken")?.value;

    const res = await axios.get(
        `${process.env.BACKEND_URL}/admin/organizations`,
        {
            headers:{
                Cookie:`accessToken=${token}`
            }
        }
    );

    return NextResponse.json(res.data);
}