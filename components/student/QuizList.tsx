"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_marks: number;
  total_questions: number;
  start_date: string;
  end_date: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Quiz[];
}

export default function QuizList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [message, setMessage] = useState("");
  async function fetchQuiz() {
    try {
      setLoading(true);
      const { data } = await axios.get<ApiResponse>("/api/student/quizzes");
      if (data.success) {
        setQuizzes(data.data);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        setMessage(error.response?.data?.message ?? "Something went wrong");
      } 
    }finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchQuiz();
  }, []);
  const isQuizStarted = (startDate: string, endDate: string) => {
    const now = new Date();
    return now >= new Date(startDate) && now <= new Date(endDate);
  };

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
        Available Quiz
      </Typography>
      {message && (
        <Typography color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
            key={quiz.id}
          >
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {quiz.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  {quiz.description}
                </Typography>
                <Stack
                  spacing={1}
                  sx={{
                    mt: 2,
                  }}
                >
                  <Chip label={`Questions : ${quiz.total_questions}`} />
                  <Chip label={`Marks : ${quiz.total_marks}`} />
                  <Chip label={`Duration : ${quiz.duration} Min`} />
                  <Chip
                    label={`Start : ${new Date(
                      quiz.start_date,
                    ).toLocaleString()}`}
                  />
                  <Chip
                    label={`End : ${new Date(quiz.end_date).toLocaleString()}`}
                  />
                </Stack>
                <Button
                  fullWidth
                  sx={{ mt: 3 }}
                  variant="contained"
                  disabled={!isQuizStarted(quiz.start_date, quiz.end_date)}
                  onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                >
                  {isQuizStarted(quiz.start_date, quiz.end_date)
                    ? "Start Quiz" 
                    : new Date() < new Date(quiz.start_date)
                      ? "Not Started"
                      : "Quiz Ended"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
