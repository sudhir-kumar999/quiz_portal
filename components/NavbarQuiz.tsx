"use client";
import  {  useContext } from "react";
import logoQuiz from "../public/logoQuiz.png";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NavbarQuiz() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  if (!auth) {
    return null;
  }
  const user = auth?.user;
  const { setUser, loading } = auth!;
  async function handleLogout() {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div
      className={"fixed bg-[#1E1B4B] text-white border-b-3 border-[#F59E0B] w-full max-w-full top-0 "}
    >
      <div className="flex justify-between items-center p-3">
        <div className="flex justify-center gap-4 items-center ">
          <Image src={logoQuiz} height={60} width={60} alt="logo" />
          <h2 className="text-align-center pt-2 hidden xs:flex">Quiz Portal</h2>
        </div>
        <div className="flex items-center gap-4">
          {!loading && user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 cursor-pointer px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
