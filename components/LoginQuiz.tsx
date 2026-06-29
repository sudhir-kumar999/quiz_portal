"use client";

import React, { useContext, useState } from "react";
import student from "../public/student.png";
import Image from "next/image";
import { BiSolidHide, BiShow } from "react-icons/bi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import {motion} from "framer-motion"
export default function LoginQuiz() {
  const router = useRouter();
  const { getMe } = useContext(AuthContext)!;
  const [role, setRole] = useState("manager");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  async function handleLogin() {
    try {
      setLoading(true);
      setError("");
      let api = "";
      switch (role) {
        case "manager":
          api = "/api/auth/login";
          break;
        case "teacher":
          api = "/api/auth/teacher-login";
          break;
        case "student":
          api = "/api/auth/student-login";
          break;
      }
      const res = await axios.post(api, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.firstLogin) {
        router.replace("/auth/change-password");
        return;
      }
      console.log("login data", res.data);
      await getMe();
      if (res.data.firstLogin) {
        router.replace("/auth/change-password");
        return;
      }
      switch (res.data.data.role) {
        case "manager":
          router.replace("/manager/dashboard");
          break;
        case "teacher":
          router.replace("/teacher/dashboard");
          break;
        case "student":
          router.replace("/student/dashboard");
          break;
      }
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login Failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-gradient-to-br from-[#EBF2FF] to-[#f3d69b]">
            <motion.div initial={{y:-500,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5 , delay:0.1,ease:"easeIn"}}>
      <Image src={student} height={100} width={100} alt="logo" />
      <h1 className="text-3xl font-bold mb-4">Quiz Portal</h1>
   </motion.div>
      <motion.div initial={{y:500,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5 , delay:0.1,ease:"easeIn"}} className="max-w-[550px] rounded-xl w-[90vw] shadow-xl flex flex-col p-8 bg-white">
        <div  className="flex flex-col">
          <p className="mb-3 text-gray-600 font-semibold">Login as</p>
          <div className="flex gap-3 justify-center flex-wrap mb-5">
            <button
              type="button"
              onClick={() => setRole("manager")}
              className={`px-5 py-2 rounded-full transition ${
                role === "manager" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`px-5 py-2 rounded-full transition ${
                role === "teacher" ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-5 py-2 rounded-full transition ${
                role === "student" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Student
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 mb-3 text-center font-medium">{error}</p>
        )}
        <div className="flex flex-col">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col gap-3"
          >
            <label>Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) =>
                setData({
                  ...data,
                  email: e.target.value,
                })
              }
              placeholder="Enter your Email"
              className="w-full px-4 py-3 border rounded-lg bg-gray-50"
            />
            <div className="relative">
              <label>Password</label>
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 cursor-pointer"
              >
                {showPassword ? (
                  <BiSolidHide className="text-xl" />
                ) : (
                  <BiShow className="text-xl" />
                )}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) =>
                  setData({
                    ...data,
                    password: e.target.value,
                  })
                }
                placeholder="Enter your Password"
                className="w-full px-4 py-3 border rounded-lg bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 text-white font-semibold rounded-lg py-3 transition
    ${
      role === "manager"
        ? "bg-blue-600 hover:bg-blue-700"
        : role === "teacher"
          ? "bg-purple-600 hover:bg-purple-700"
          : "bg-green-600 hover:bg-green-700"
    }
    ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
