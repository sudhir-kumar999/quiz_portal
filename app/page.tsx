'use client';
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion"
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
          router.replace("/student/dashboard");
          break;
      }
    }
  }, [auth?.loading, auth?.user, router]);

  if (auth?.loading || auth?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[150px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[150px]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24">
        <motion.div initial={{y:-500,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5 , delay:0.1,ease:"easeIn"}} className="text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300">
            Organization based Quiz Portal
          </span>
          <h1 className="mt-8 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Smart Quiz Portal
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              for Your Organization
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            Invite teachers through email then ban and unban users create and manage quiz or test show result after a specific date
          </p>
        </motion.div>
          <motion.div initial={{x:-500,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.2 , delay:0.1,ease:"easeIn"}} className="group rounded-3xl mt-2 mb-4 border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl">
              <MdAdminPanelSettings className="text-6xl text-white" />
            <h2 className="mt-6 text-3xl font-bold text-white">
              Super Admin
            </h2>
            <p className="mt-4 leading-7 text-gray-300">
              Create a organisation with the manager details and invite the manager through email
            </p>
            <Link
              href="/auth/adminlogin"
              className="mt-10 flex w-full items-center justify-center rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Login as Super Admin
            </Link>
          </motion.div>
          <motion.div initial={{x:500,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.2 , delay:0.1,ease:"easeIn"}} className="group mt-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl">
              <FaUser className="text-4xl text-white" />
            <h2 className="mt-6 text-3xl font-bold text-white">
              Manager / Teacher / Student
            </h2>
            <p className="mt-4 leading-7 text-gray-300">
              Secure login for organizations to manage quizzes,
              conduct assessments, monitor results and track student
              performance from one dashboard.
            </p>
            <Link
              href="/auth/login"
              className="mt-10 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </div>
  );
}