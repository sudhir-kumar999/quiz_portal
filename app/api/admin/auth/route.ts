import axios, { AxiosError } from "axios"
import { NextResponse } from "next/server"

export async function POST(req:Request){
   try {
     const body=await req.json()
    console.log(body)
    if(!body){
        return NextResponse.json({
            message:"Both email and password is required"

        },{
            status:400
        })
    }
    const serverRes=await axios.post(`${process.env.BACKEND_URL}/admin/login`,body,{
      headers:{
        'Content-Type':"application/json"
      },
      withCredentials:true
    })

    const response=NextResponse.json(serverRes.data,{
        status:serverRes.status
    })
    const token=serverRes.data.accessToken
    console.log("tokrn",token)
    response.cookies.set("accessToken",token,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        path:"/"
    })
    return response
console.log(serverRes.status)
   } catch (error) {

    if(axios.isAxiosError(error)){
        // console.log(error.response?.status)

    return NextResponse.json({
        success:false,
            message:error.response?.data?.message||"node error"

        },{
            status:error.response?.status
        })
    }
   }
}