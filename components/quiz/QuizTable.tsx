"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
interface Quiz {
  id: string;
  title: string;
  description: string | null;
  total_questions: number;
  total_marks: number;
  duration: number;
  start_date: string;
  end_date: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Quiz[];
}

export default function QuizTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getAllQuiz = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get<ApiResponse>(
        "/api/teacher/allquizzes"
      );
      if (data.success) {
        setQuizzes(data.data);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ??
          "Failed to load quizzes"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllQuiz();
  }, []);

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        All Quiz
      </Typography>
      {message && (
        <Typography
          sx={{
            color: "red",
            mb: 2,
          }}
        >
          {message}
        </Typography>
      )}
      <TableContainer
        sx={{
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 1200,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total Questions</TableCell>
              <TableCell>Total Marks</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  No Quiz Found
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => {
                const now = new Date();
                let status = "Upcoming";
                if (
                  now >=
                    new Date(quiz.start_date) &&
                  now <=
                    new Date(quiz.end_date)
                ) {
                  status = "Live";
                }
                if (
                  now >
                  new Date(quiz.end_date)
                ) {
                  status = "Completed";
                }
                return (
                  <TableRow
                    hover
                    key={quiz.id}
                  >
                    <TableCell>
                      {quiz.title}
                    </TableCell>
                    <TableCell>
                      {quiz.description ?? "-"}
                    </TableCell>
                    <TableCell>
                      {quiz.total_questions}
                    </TableCell>
                    <TableCell>
                      {quiz.total_marks}
                    </TableCell>
                    <TableCell>
                      {quiz.duration} Min
                    </TableCell>
                    <TableCell>
                      {new Date(
                        quiz.start_date
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        quiz.end_date
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {status}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}