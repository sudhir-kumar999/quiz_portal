"use client";

import React, { useState } from "react";
import student from "../public/student.png";
import Image from "next/image";
import { BiSolidHide, BiShow } from "react-icons/bi";
import axios from "axios";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion"
export default function ChangePassword() {
  const router = useRouter();
  const [role] = useState("manager");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!data.name.trim()) {
      setError("Name is required");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }
    try {
      setLoading(true);
      const obj = {
        name: data.name,
        password: data.password,
      };
      const res = await axios.post("/api/auth/change-password", obj, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        setSuccess(res.data.message || "Password Changed Successfully");
        setTimeout(() => {
          router.replace("/manager/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        console.log(error.response?.data.message);
        setError(error.response?.data?.message ?? "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  const [email, setEmail] = useState("");
  React.useEffect(() => {
    async function loadUser() {
      const { data } = await axios.get("/api/auth/temp-user");
      setEmail(data.email);
    }
    loadUser();
  }, []);

  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-gradient-to-br from-[#EBF2FF] to-[#f3d69b]">
            <motion.div initial={{y:-500,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5 , delay:0.1,ease:"easeIn"}} className="flex justify-center flex-col items-center">
      <Image src={student} height={100} width={100} alt="logo" />
      <h1 className="text-3xl font-bold mb-3">Quiz Portal</h1>
      <h2 className="font-weight:600">Hello {email}</h2>
      </motion.div>
      <motion.div initial={{y:500,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5 , delay:0.1,ease:"easeIn"}} className="max-w-[550px] w-[90vw] rounded-xl shadow-xl bg-white p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-600 border border-red-300 p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-100 text-green-700 border border-green-300 p-3">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Enter your Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            placeholder="Enter Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
          />
          <div className="relative">
            <label htmlFor="confirm">Confirm Password</label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-11 cursor-pointer"
            >
              {showPassword ? (
                <BiSolidHide className="text-xl" />
              ) : (
                <BiShow className="text-xl" />
              )}
            </div>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) =>
                setData({
                  ...data,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 text-white rounded-lg py-3 font-semibold ${
              role === "manager"
                ? "bg-blue-600"
                : role === "teacher"
                  ? "bg-purple-600"
                  : "bg-green-600"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
