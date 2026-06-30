"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

type org={
    id:string,
    max_teacher:number
    max_student:number
    title:string
    status:string
}
type User={
    id:string,
    name:string,
    email:string,
    role:string,
    isBanned:boolean
    organization:org
  isDefPassUsed:boolean

}
type AuthContextType={
    user:User|null
    loading:boolean
    getMe:()=>Promise<void>
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

}

export const AuthContext=createContext<AuthContextType |null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<User|null>(null);
  const [loading,setLoading]=useState(true);

  const getMe = async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.data);
        return res.data.data;
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    getMe();
  },[]);

  return(
    <AuthContext.Provider value={{user,loading,getMe,setUser}}>
      {children}
    </AuthContext.Provider>
  );
}