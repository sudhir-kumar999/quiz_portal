"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
interface Result {
  quiz_id: string;
  title: string;
  total_marks: number;
  score: number | null;
  submitted_at: string;
  end_date: string;
  result_published: boolean;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Result[];
}

export default function AllResult() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState("");
  async function fetchResults() {
    try {
      setLoading(true);
      const { data } = await axios.get<ApiResponse>("/api/student/result");
      if (data.success) {
        setResults(data.data);
      } else {
        setMessage(data.message ?? "");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? "Failed to fetch results");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResults();
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

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
        }}
      >
        My Results
      </Typography>
      {message && <Typography color="error">{message}</Typography>}
      {results?.length==0 && <Typography color="error">No result found</Typography>}
      <Grid container spacing={3}>
        {results.map((result) => (
          <Grid
            key={result.quiz_id}
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {result.title}
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Chip label={`Total Marks : ${result.total_marks}`} />
                  <Chip
                    label={`Submitted : ${new Date(
                      result.submitted_at,
                    ).toLocaleString()}`}
                  />
                  <Chip
                    color={result.result_published ? "success" : "warning"}
                    label={
                      result.result_published
                        ? `Score : ${result.score}`
                        : "Result Pending"
                    }
                  />
                </Stack>
                <Button
                  fullWidth
                  sx={{ mt: 3 }}
                  variant="contained"
                  disabled={!result.result_published}
                  onClick={() =>
                    router.push(`/student/result/${result.quiz_id}`)
                  }
                >
                  {result.result_published ? "View Result" : "Result Pending"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
