"use client";
import axios from "axios";
import React, { useState } from "react";
export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [column, setColumn] = useState("");
  const [response, setResponse] = useState("");
  const [successEmails, setSuccessEmails] = useState<string[]>([]);
  const [failedEmails, setFailedEmails] = useState<string[]>([]);

  async function uploadFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    try {
      e.preventDefault();
      setSuccessEmails([]);
      setFailedEmails([]);
      const formData = new FormData();
      if (!file || !column) {
        setResponse("please upload a csv file and column name");
        return;
      }
      if (file) {
        formData.append("file", file);
        setResponse("");
      }
      if (column) {
        formData.append("column", column);
        setResponse("");
      }
      const res = await axios.post("/api/teacher/uploadcsv", formData);
      setResponse(res.data.message);
      if (res.data.success) {
        setSuccessEmails(res.data.success_email || []);
        setFailedEmails(res.data.failedEmail || []);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse(error.response?.data?.message || "Something went wrong.");
      } else {
        setResponse("Something went wrong.");
      }
    } finally {
    }
  }
  return (
    <>
      <h1 className="text-center">UPLOAD CSV FILE</h1>
      <p>
        Upload csv file of student details and enter the correct column name of
        email it is <span className="text-red-500">case-sensitive</span> also
      </p>
      <div className="flex flex-col justify-center items-center h=[90vh] md:h-[60vh]">
        <div className="flex flex-col justify-between items-center gap-10 p-12 bg-white shadow-2xl">
          <h3>{response}</h3>
          {successEmails.length > 0 && (
            <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4">
              <h3 className="font-semibold text-green-700 mb-2">
                Successfully Invited
              </h3>
              <ul className="list-disc ml-5 text-green-700"></ul>
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
          <input
            onChange={(e) => {
              setFile(e.target.files != null ? e.target.files[0] : null);
            }}
            type="file"
            accept=".csv"
            className="border p-2 w-full"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="column" className="">
              Enter name of Column for Email in CSV file
            </label>
            <input
              type="text"
              id="column"
              required
              onChange={(e) => setColumn(e.target.value)}
              placeholder="Enter Column name for email"
              className="border p-2 w-full"
            />
          </div>
          <button
            onClick={(e) => uploadFile(e)}
            className="text-white font-bold p-3 max-w-[50vw] rounded bg-amber-500"
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
}
