"use client";

import axios from "axios";
import React, { useState } from "react";

export default function TeacherReinvite() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successEmails, setSuccessEmails] = useState<string[]>([]);
  const [failedEmails, setFailedEmails] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccessEmails([]);
    setFailedEmails([]);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/teacher/reinvite-students",
        {
          email: [email.trim()],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setSuccessEmails(res.data.success_email || []);
        setFailedEmails(res.data.failedEmail || []);
        setEmail("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Re-Invite Student
        </h2>
        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-100 px-4 py-2 text-red-600">
            {error}
          </div>
        )}
        {successEmails.length > 0 && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4">
            <h3 className="font-semibold text-green-700 mb-2">
              Successful Emails
            </h3>
            <ul className="list-disc ml-5 text-green-700">
              {successEmails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {failedEmails.length > 0 && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
            <h3 className="font-semibold text-red-700 mb-2">Failed Emails</h3>
            <ul className="list-disc ml-5 text-red-700">
              {failedEmails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">Student Email</label>
            <input
              type="email"
              placeholder="Enter student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Re-Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
