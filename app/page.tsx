'use client'
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import NavbarQuiz from "@/components/NavbarQuiz";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function Home() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading && auth?.user) {
      switch (auth.user.role) {
        case "superadmin":
          router.replace("/admin/dashboard");
          break;
        case "manager":
          router.replace("/manager/dashboard");
          break;
        case "teacher":
          router.replace("/teacher/dashboard");
          break;
        case "student":
          router.replace("/dashboard");
          break;
      }
    }
  }, [auth?.loading, auth?.user, router]);

  // Loading ya redirect ke time kuch mat dikhao
  if (auth?.loading || auth?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 flex justify-center items-center flex-col p-4 xs:p-8 mt-16 xs:mt-20">
      <NavbarQuiz/>
      <h1 className="text-center">Welcome to Quiz Portal</h1>
      <p className="text-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi sint sunt
        labore a aut pariatur enim amet laborum, obcaecati fugiat!
      </p>
      <div className=" rounded-lg  w-full max-w-[600px]  m-4 xs:m-8 flex justify-between  flex-col items-center ">
        <div className="w-full  h-full rounded-xl shadow-xl/20 flex justify-baseline">
          <div className="flex flex-col  justify-center items-center w-full  m-10">
            <MdAdminPanelSettings className="text-6xl" />

            <p className=" text-center m-4 font-bold text-xs xs:text-xl">
              Super Admin
            </p>
            <p className="m-2">
              Login as Super Admin to access Restricted content
            </p>
            <button className="rounded-xl w-full bg-cyan-400 py-2 mx-2">
             <Link href="/auth/adminlogin">Login</Link>
            </button>
          </div>
        </div>
        <div className="w-full shadow-xl/20 rounded-xl m-4 h-full flex justify-baseline ">
          <div className="flex flex-col  justify-center items-center w-full m-10">
            <FaUser className="text-6xl" />

            <p className=" text-center m-4 font-bold text-xs xs:text-xl">
            General

            </p>
            <p className="m-2">
              Login as Manager, Teacher and Student
            </p>
            <button className="rounded-xl w-full bg-amber-400 py-2 mx-2">
              <Link href="/auth/login">Login</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
    // <ManagerDashBoard/>

  );
}
