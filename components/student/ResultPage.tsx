"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
interface ResultResponse {
  success: boolean;
  message?: string;
  data: {
    quiz_id: string;
    score: number;
    total_marks: number;
    submitted_at: string;
  };
}

export default function ResultPage() {
  const { quiz_id } = useParams<{
    quiz_id: string;
  }>();

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState<ResultResponse["data"]>();

  const [message, setMessage] = useState("");

  async function loadResult() {
    try {
      setLoading(true);

      const { data } = await axios.get<ResultResponse>(
        `/api/student/quizzes/${quiz_id}/result`,
      );

      if (data.success) {
        setResult(data.data);
      } else {
        setMessage(data.message ?? "");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? "Failed to fetch result");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResult();
  }, []);

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

  if (message) {
    return (
      <Typography color="error" align="center">
        {message}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Quiz Result
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Chip color="primary" label={`Score : ${result?.score}`} />
          <Chip
            color="success"
            label={`Total Marks : ${result?.total_marks}`}
          />
          <Chip
            label={`Submitted : ${new Date(
              result!.submitted_at,
            ).toLocaleString()}`}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
