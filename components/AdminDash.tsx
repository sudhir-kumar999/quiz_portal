"use client";
import React, { useEffect, useState } from "react";
import OrgForm from "./OrgForm";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import NavbarQuiz from "./NavbarQuiz";
import ReInviteForm from "./ReInviteForm";
// const arr: string[] = new Array(10).fill("20", 0, 10);

// console.log(arr);
type Organization = {
  id: string;
  title: string;
  max_teacher: number;
  max_student: number;
  manager: {
    name: string;
    email: string;
    isDefPassUsed: boolean;
  };
};
export default function AdminDash() {
  const [create, setCreate] = useState(false);
  const [reInvite, setReInvite] = useState(false);
  console.log(create);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrganizations = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/admin/organizations");

      setOrganizations(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrganizations();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }
  return (
    <div
      className={`mt-25 ${create}?"bg-white/30 backdrop-blur-sm":"bg-white/30 backdrop-blur-sm"`}
    >
      <NavbarQuiz />
      <div className="flex m-4 lg:mx-20 justify-between sm:flex xs:flex-row  flex-col items-center">
        <div>
          <h2>Organizations</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCreate(true)}
            className="p-3 rounded-2xl bg-amber-400"
          >
            Create +
          </button>

          <button
            onClick={() => setReInvite(true)}
            className="p-3 rounded-2xl bg-blue-500 text-white"
          >
            Re-Invite
          </button>
        </div>
      </div>
      <h2 className="px-2 sm:px-10">Organizations List</h2>

      <div className="grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6 mr-4 xs:m-6  ">
        {organizations.map((ele) => (
          <div
            key={ele.id}
            className="rounded-xl p-4 inset-shadow-sm inset-shadow-indigo-500 h-full w-full "
          >
            <div className="  h-[250px] p-4">
              <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
                Organization details
              </div>
              <p className="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
                {ele.title}
              </p>
              <p className="mt-2 text-gray-500">
                Max Teacher: {ele.max_teacher}
              </p>
              <p className="mt-2 text-gray-500">
                Max Student: {ele.max_student}
              </p>
              <p className="mt-2 text-gray-500">
                Manager Name: {ele?.manager?.name}
              </p>
              <p className="mt-2 text-gray-500">
                Manager Email: {ele.manager.email}
              </p>
              <p className="mt-2 text-gray-500">
                Invitation:{" "}
                {ele.manager.isDefPassUsed ? "Accepted" : "Not Accepted"}
              </p>
            </div>
          </div>
        ))}
      </div>
      {create && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <IoCloseSharp
            onClick={() => setCreate(false)}
            className="absolute top-8 right-8 text-4xl cursor-pointer"
          />

          <OrgForm
            onSuccess={() => {
              setCreate(false);
              getOrganizations();
            }}
          />
        </div>
      )}
      {reInvite && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <IoCloseSharp
            onClick={() => setReInvite(false)}
            className="absolute top-8 right-8 text-4xl cursor-pointer"
          />
          <ReInviteForm
            onSuccess={() => {
              setReInvite(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
