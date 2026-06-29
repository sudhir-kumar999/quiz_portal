"use client";

import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";

import QuestionDialog from "./QuestionDialog";
import axios from "axios";
export type QuestionType = "multiple_choice" | "true_false";
export interface Question {
  type: QuestionType;
  question: string;
  marks: number;
  options?: string[];
  correctOptions: number[] | boolean;
}
export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);
  const totalMarks = useMemo(() => {
    return questions.reduce((sum, q) => sum + q.marks, 0);
  }, [questions]);
  const handleCreateQuiz = async () => {
    const payload = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      duration: Number(duration),
      questions,
    };

    try {
      setLoading(true);
      setResponse(null);
      const { data } = await axios.post("/api/teacher/createquiz", payload);
      setResponse({
        success: data.success,
        message: data.message,
      });
      setTitle("")
      setDescription("")
      setStartDate("")
      setEndDate("")
      setDuration(0)
      setQuestions([])
    } catch (error: any) {
      setResponse({
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "white",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
            Create Quiz
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Quiz Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
            >
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Date"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <TextField
                fullWidth
                type="datetime-local"
                label="End Date"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Stack>
            <TextField
              label="Duration (Minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add Question
            </Button>
            <Divider />
            <Typography variant="h6">Questions ({questions.length})</Typography>
            <Stack spacing={2}>
              {questions.map((q, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                  }}
                  variant="outlined"
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    Question {index + 1}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{q.question}</Typography>
                  <Typography sx={{ mt: 1 }} color="text.secondary">
                    Type : {q.type}
                  </Typography>
                  <Typography color="text.secondary">
                    Marks : {q.marks}
                  </Typography>
                </Paper>
              ))}
            </Stack>
            <Divider />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                Total Questions : {questions.length}
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                Total Marks : {totalMarks}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateQuiz}
              disabled={!questions.length || loading}
            >
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
            {response && (
              <Typography
                sx={{
                  mt: 2,
                  color: response.success ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {response.message}
              </Typography>
            )}
          </Stack>
        </Paper>
      </Container>
      <QuestionDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(question) => {
          setQuestions((prev) => [...prev, question]);
        }}
      />
    </>
  );
}
