"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
type QuestionType = "multiple_choice" | "true_false";

interface Question {
  questionIndex: number;
  type: QuestionType;
  question: string;
  options?: string[];
  marks: number;
}

interface QuizResponse {
  success: boolean;
  message?: string;
  data: {
    duration: number;
    total_questions: number;
    total_marks: number;
    questions: Question[];
  };
}

export default function QuizPage() {
  const { quiz_id } = useParams<{
    quiz_id: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[] | boolean>>(
    {},
  );
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);
  async function loadQuiz() {
    try {
      setLoading(true);
      const { data } = await axios.get<QuizResponse>(
        `/api/student/quizzes/${quiz_id}`,
      );
      if (data.success) {
        setDuration(data.data.duration * 60);
        setQuestions(data.data.questions);
        setTotalMarks(data.data.total_marks);
        setTotalQuestions(data.data.total_questions);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "Failed to load quiz");
      }
      router.replace("/student/dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuiz();
  }, []);

  async function submitQuiz() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try {
      const { data } = await axios.post(`/api/student/submitquiz/${quiz_id}`, {
        answers,
      });
      alert(data.message);
      router.replace("/student/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        submittedRef.current = false;
        alert(error.response?.data?.message ?? "Failed to submit quiz");
      }
    }
  }

  useEffect(() => {
    if (!duration) return;
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duration]);
  function formatTime(time: number) {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);
    const second = time % 60;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  }
  const toggleMCQ = (questionIndex: number, optionIndex: number) => {
    let selected = [...((answers[questionIndex] as number[]) || [])];
    if (selected.includes(optionIndex)) {
      selected = selected.filter((x) => x !== optionIndex);
    } else {
      selected.push(optionIndex);
    }
    setAnswers({
      ...answers,
      [questionIndex]: selected,
    });
  };
  const chooseTrueFalse = (questionIndex: number, value: boolean) => {
    setAnswers({
      ...answers,
      [questionIndex]: value,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quiz
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>
            Time Left : {formatTime(duration)}
          </Typography>
          <Typography>Total Questions : {totalQuestions}</Typography>
          <Typography>Total Marks : {totalMarks}</Typography>
        </Stack>
      </Paper>
      <Stack spacing={3} sx={{ mt: 4 }}>
        {questions.map((question) => (
          <Paper
            key={question.questionIndex}
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Question {question.questionIndex + 1}
            </Typography>
            <Typography sx={{ mt: 1 }}>{question.question}</Typography>
            <Typography
              sx={{
                mt: 1,
                mb: 2,
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              Marks : {question.marks}
            </Typography>
            {question.type === "multiple_choice" && (
              <Stack spacing={1}>
                {question.options?.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    control={
                      <Checkbox
                        checked={(
                          (answers[question.questionIndex] as number[]) || []
                        ).includes(optionIndex)}
                        onChange={() =>
                          toggleMCQ(question.questionIndex, optionIndex)
                        }
                      />
                    }
                    label={option}
                  />
                ))}
              </Stack>
            )}
            {question.type === "true_false" && (
              <RadioGroup
                value={
                  answers[question.questionIndex] === true
                    ? "true"
                    : answers[question.questionIndex] === false
                      ? "false"
                      : ""
                }
                onChange={(e) =>
                  chooseTrueFalse(
                    question.questionIndex,
                    e.target.value === "true",
                  )
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="True"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="False"
                />
              </RadioGroup>
            )}
          </Paper>
        ))}
      </Stack>
      <Box
        sx={{
          mt: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" size="large" onClick={submitQuiz}>
          Submit Quiz
        </Button>
      </Box>
    </Container>
  );
}
