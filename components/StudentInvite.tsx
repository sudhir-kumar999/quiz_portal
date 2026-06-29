"use client";

import axios from "axios";
import React, { useState } from "react";

export default function StudentInvite() {
  const [emails, setEmails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [successEmails, setSuccessEmails] = useState<string[]>([]);
  const [failedEmails, setFailedEmails] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessEmails([]);
    setFailedEmails([]);
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
    console.log(emailArray);
    try {
      setLoading(true);

      const res = await axios.post(
        "/api/teacher/invite-students",
        {
          email: emailArray,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setSuccess(res.data.message);

        setSuccessEmails(res.data.success_email || []);

        setFailedEmails(res.data.failedEmail || []);

        setEmails("");
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Invite Students</h2>
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 text-red-600 p-3">
            {error}
          </div>
        )}
        {/* {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-100 text-green-600 p-3">
            {success}
          </div>
        )} */}
        {successEmails.length > 0 && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4">
            <h3 className="font-semibold text-green-700 mb-2">
              Successfully Invited
            </h3>
            <ul className="list-disc ml-5 text-green-700">
            </ul>
          </div>
        )}
        {failedEmails.length > 0 && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
            <h3 className="font-semibold text-red-700 mb-2">
              Failed Invitations
            </h3>
            <ul className="list-disc ml-5 text-red-700">
              {failedEmails.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 font-semibold">Student Emails</label>
            <textarea
              rows={6}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="student1@gmail.com, student2@gmail.com, student3@gmail.com"
              className="w-full rounded-lg border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition disabled:opacity-60"
          >
            {loading ? "Inviting..." : "Invite Students"}
          </button>
        </form>
      </div>
    </div>
  );
}
