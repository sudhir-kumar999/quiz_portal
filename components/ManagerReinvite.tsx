
"use client";

import axios from "axios";
import React, { useState } from "react";

type Props = {
  onSuccess?: () => void;
};

export default function ManagerReinvite({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/manager/reinvite",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setSuccess(res.data.message);
        setEmail("");
        if (onSuccess) {
          onSuccess();
        }
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-xl shadow-lg w-[90vw] max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-5">
          Re-Invite Teachers
        </h2>
        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-100 px-4 py-2 text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-100 px-4 py-2 text-green-700">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">
              Manager Email
            </label>
            <input
              type="email"
              placeholder="Enter manager email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-amber-400 py-3 font-semibold text-white hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Re-Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
