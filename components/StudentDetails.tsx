"use client";

import React from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
type Student = {
  id: string;
  name: string;
  email: string;
  isBanned: boolean;
  isDefPassUsed: boolean;
};

export default function StudentsPage() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editId, setEditId] = React.useState<string | null>(null);

  async function getStudents() {
    try {
      setLoading(true);
      const res = await axios.get("/api/teacher/students", {
        withCredentials: true,
      });
      setStudents(res.data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getStudents();
  }, []);

  async function handleBan(userId: string) {
    try {
      setEditId(userId);
      const { data } = await axios.post("/api/teacher/banstudents", {
        userId,
      });
      if (data.success) {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === userId
              ? {
                ...student,
                isBanned: !student.isBanned,
              }
              : student,
          ),
        );
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      }
    } finally {
      setEditId(null);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Students
      </Typography>
      <Paper elevation={3}>
        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 850,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Invitation</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell align="center">
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.isDefPassUsed ? "Accepted" : "Pending"}
                  </TableCell>
                  <TableCell>
                    {student.isBanned ? "Banned" : "Active"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color={student.isBanned ? "success" : "error"}
                      disabled={editId === student.id}
                      onClick={() => handleBan(student.id)}
                    >
                      {editId === student.id
                        ? "Updating..."
                        : student.isBanned
                          ? "Unban"
                          : "Ban"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Students Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
