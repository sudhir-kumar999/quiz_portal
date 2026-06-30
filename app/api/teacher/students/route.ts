import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    const cookieStore=await cookies();
    const accessToken=cookieStore.get("accessToken")?.value;
    const serverData=await axios.get(`${process.env.BACKEND_URL}/teacher/students-details`,{
      headers:{
        Cookie:`accessToken=${accessToken}`
      }
    });
    return NextResponse.json(
      serverData.data
      ,{
        status:serverData.status
      });
  } catch (error) {
    if(axios.isAxiosError(error)){
      return NextResponse.json({
        success:false,
        message:"failed to load user data"
      },{
        status:500
      });
    }
  }
}