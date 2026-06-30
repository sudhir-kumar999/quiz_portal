import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req:Request){
  try {
    const {id}=await req.json();
    const cookieStore=await cookies();
    const accessToken=cookieStore.get("accessToken")?.value;
    const serverData=await axios.post(`${process.env.BACKEND_URL}/manager/ban-users`,{userId:id},{
      headers:{
        Cookie:`accessToken=${accessToken}`
      }
    });
    return NextResponse.json(
      serverData.data
      ,{
        status:serverData.status
      });
  }  catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(error.response?.data, {
        status: error.response?.status || 500,
      });
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