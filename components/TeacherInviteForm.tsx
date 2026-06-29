"use client";

import axios from "axios";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { IoCloseSharp } from "react-icons/io5";

type Props = {
  onSuccess: () => void;
  onClose: () => void;
};

export default function TeacherInviteForm({ onSuccess ,onClose}: Props) {
  const [emails, setEmails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const emailArray = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
    if (emailArray.length === 0) {
      setError("Please enter at least one email.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/manager/invite-teacher",
        {
          email: emailArray,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setSuccess(res.data.message);
        setEmails("");
        onSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Something went wrong."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen mt-15">
        <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-lg p-6 relative">
      {/* <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-lg p-6"> */}
        <IconButton
  onClick={onClose}
  sx={{
    position: "absolute",
    top: 10,
    right: 10,
  }}
>
  <CloseIcon />
</IconButton>
        <h2 className="text-2xl font-bold text-center mb-5">
          Invite Teacher
        </h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 border border-red-300 text-red-600 p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded bg-green-100 border border-green-300 text-green-600 p-3">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Teacher Emails
            </label>
            <textarea
              rows={6}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="teacher1@gmail.com, teacher2@gmail.com, teacher3@gmail.com"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 disabled:opacity-60"
          >
            {loading ? "Inviting..." : "Invite Teachers"}
          </button>
        </form>
      </div>
    </div>
  );
}