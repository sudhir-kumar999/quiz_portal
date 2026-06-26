import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const cookieStore=await cookies()
        const accessToken=cookieStore.get("accessToken")?.value
        // console.log("tytugyihu",accessToken)
        if(!accessToken){
            return NextResponse.json({
                success:false,
                message:"unauthorized login again"
            },{
                status:401
            })
        }

        const response=await axios.get(`${process.env.BACKEND_URL}/get/me`,{
            headers:{
                Cookie:`accessToken=${accessToken}`
            }
        })
        // console.log("ryftuygiuhoij",response.data)
        return NextResponse.json(
                response.data
            ,{
                status:response.status
            })
    } catch (error) {
        if(axios.isAxiosError(error)){
            // console.log(error.response?.data)

        return NextResponse.json({
                success:false,
                message:"failed to load user"
            },{
                status:500
            })
    }
}
}