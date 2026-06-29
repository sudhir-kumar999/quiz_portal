"use client";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import student from "../public/student.png";
import Image from "next/image";
import { BiSolidHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const { getMe } = auth!;
  async function handleSubmit(_: unknown, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password");
    console.log(email);
    console.log(password);
    const data = {
      email,
      password,
    };
    try {
      const res = await axios.post("/api/admin/auth", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      await getMe();
      if (res.data.success) {
        return { success: true, error: res.data.message, data: res.data.data };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("front", error);
        return { success: false, error: error?.response?.data.message, email };
      }
    }
  }
  const [states, action, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (states?.success) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }, [states, router]);
  const [role, setRole] = useState("superadmin");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex justify-center flex-col items-center  min-h-screen  bg-gradient-to-br from-[#EBF2FF] to-[#f3d69b] ">
      <Image src={student} height={100} width={100} alt="logo" />
      <h1>Quiz Portal</h1>
      <div className=" max-w-[550px] rounded-xl w-[90vw]   max-h-full shadow-xl/30 flex flex-col p-8">
        <div className=" p-2 flex flex-col flex-wrap ">
          <p className="m-2 text-gray-600">Login as</p>
          <div className={`flex justify-around  flex-wrap `}>
            <div
              onClick={() => setRole("superadmin")}
              className={`flex flex-col w-full rounded-full justify-center items-center  py-2 px-4 max-w-full ${role === "superadmin" ? "bg-[#F59E0B] text-white font-bold" : "bg-transparent"}`}
            >
              <MdAdminPanelSettings />
              <button className="">Super Admin</button>
            </div>
          </div>
          <div className="flex justify-around flex-wrap items-center">
            {states?.error && (
              <p className="text-red-500 font-bold p-2">{states.error}</p>
            )}
          </div>
        </div>
        <div className=" flex flex-col flex-grow-2">
          <form action={action} className="flex flex-col gap-2">
            <label htmlFor="mail">Email</label>
            <input
              type="text"
              id="mail"
              name="email"
              defaultValue={states?.email}
              placeholder="Enter your Email"
              className="w-full px-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-base md:px-4 md:py-3"
            />
            <div className="relative">
              <label htmlFor="pass">Password</label>
              <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <BiSolidHide className="absolute right-5 my-3 z-50 text-xl" />
                ) : (
                  <BiShow className="absolute right-5 my-3 z-50 text-xl" />
                )}
              </div>
              <input
                type={`${showPassword ? "text" : "password"}`}
                id="pass"
                name="password"
                placeholder="Enter your Password"
                className="w-full px-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-base md:px-4 md:py-3"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className={`mt-4 mb-2 text-white  font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 ${role == "superadmin" ? "bg-[#F59E0B] text-white font-bold" : role == "manager" ? "bg-[#3B82F6] text-white font-bold" : role == "teacher" ? "bg-[#8B5CF6] text-white font-bold" : role == "student" ? "bg-[#10B981] text-white font-bold" : "bg-slate-400"}`}
            >
              {isPending ? "Logging..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
