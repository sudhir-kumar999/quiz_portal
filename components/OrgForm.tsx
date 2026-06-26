import axios from "axios";
import React, { useState } from "react";
type Props = {
  onSuccess: () => void;
};

export default function OrgForm({ onSuccess }: Props) {
  const [formData,setFormData]=useState({
    title:"",
    max_teacher:"",
    max_student:"",
    email:""
  })
  const [error, setError] = useState("");


  async function handleForm(e: React.FormEvent<HTMLFormElement>){
    try {
      e.preventDefault()
        setError("");

    console.log(formData)
    const res=await axios.post("/api/admin/create-org",formData,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
    if(res.data.success){
      setError("");
      onSuccess()
    return { success: true, 
        error: res.data.message,
        data:res.data.data
      }
    }
    
    } catch (error) {
      if(axios.isAxiosError(error)){
         setError(error.response?.data?.message || "Something went wrong");
      console.log("front",error)
      return { success: false, 
        error: error?.response?.data.message};
    }
  }
  }

  return (
    <div className="mt-10 flex  justify-center items-center h-screen">
      <div className="m-2 xs:m-4 ">
        <h1 className="flex justify-center">Create Organizations</h1>
        <div className="rounded-xl bg-white p-4 xs:p-8 inset-shadow-sm inset-shadow-indigo-500 h-full w-[90vw] max-w-[600px] ">
         {error && (
  <p className="mb-3 rounded-md bg-red-100 border border-red-300 text-red-600 px-3 py-2 text-sm">
    {error}
  </p>
)}
          <form action="" onSubmit={(e)=>handleForm(e)} className="flex flex-col gap-2">
            <div className="flex flex-col  gap-4">
              <label htmlFor="mail">Title of Organization</label>
              <input
                type="text"
                id="mail"
                value={formData.title}
                onChange={((e)=>setFormData({...formData,title:e.target.value}))}
                placeholder="Enter your Email"
                className="w-full px-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-base md:px-4 md:py-3"
              />
              <label htmlFor="mail">Max Teachers allowed</label>
              <input
                type="text"
                id="pass"
                onChange={((e)=>setFormData({...formData,max_teacher:e.target.value}))}

                value={formData.max_teacher}
                placeholder="Enter your Password"
                className="w-full px-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-base md:px-4 md:py-3"
              />
              <label htmlFor="mail">Max Students allowed</label>
              <input
                type="text"
                id="pass"
                onChange={((e)=>setFormData({...formData,max_student:e.target.value}))}

                value={formData.max_student}
                placeholder="Enter your Password"
                className="w-full px-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-base md:px-4 md:py-3"
              />
              <label htmlFor="mail">Manager&apos;s Email</label>
              <input
                type="text"
                id="pass"
                onChange={((e)=>setFormData({...formData,email:e.target.value}))}

                value={formData.email}
                placeholder="Enter your Password"
                className="w-full px-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-base md:px-4 md:py-3"
              />
              <button
                type="submit"
                className="mt-4 mb-2 bg-amber-400 w-full rounded-full  font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
              >
                Create
              </button>
              {/* <p>Not yet accept invitations ?</p> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
