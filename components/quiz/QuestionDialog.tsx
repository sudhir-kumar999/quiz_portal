"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import { Question } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
}

const defaultQuestion: Question = {
  type: "multiple_choice",
  question: "",
  marks: 1,
  options: ["", "", "", ""],
  correctOptions: [],
};
export default function QuestionDialog({ open, onClose, onSave }: Props) {
  const [question, setQuestion] = useState<Question>(defaultQuestion);

  const handleTypeChange = (value: "multiple_choice" | "true_false") => {
    if (value === "multiple_choice") {
      setQuestion({
        type: value,
        question: "",
        marks: 1,
        options: ["", "", "", ""],
        correctOptions: [],
      });
    } else {
      setQuestion({
        type: value,
        question: "",
        marks: 1,
        correctOptions: true,
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const arr = [...(question.options || [])];
    arr[index] = value;
    setQuestion({
      ...question,
      options: arr,
    });
  };

  const toggleCorrectOption = (index: number) => {
    let answers = [...((question.correctOptions as number[]) || [])];
    if (answers.includes(index)) {
      answers = answers.filter((item) => item !== index);
    } else {
      answers.push(index);
    }
    setQuestion({
      ...question,
      correctOptions: answers,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              label="Question Type"
              value={question.type}
              onChange={(e) =>
                handleTypeChange(e.target.value as Question["type"])
              }
            >
              <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
              <MenuItem value="true_false">True / False</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Question"
            fullWidth
            multiline
            rows={2}
            value={question.question}
            onChange={(e) =>
              setQuestion({
                ...question,
                question: e.target.value,
              })
            }
          />
          <TextField
            label="Marks"
            type="number"
            value={question.marks}
            onChange={(e) =>
              setQuestion({
                ...question,
                marks: Number(e.target.value),
              })
            }
          />
          {question.type === "multiple_choice" && (
            <>
              <Typography variant="h6">Options</Typography>
              {question.options?.map((option, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center" }}
                >
                  <Checkbox
                    checked={(question.correctOptions as number[]).includes(
                      index,
                    )}
                    onChange={() => toggleCorrectOption(index)}
                  />
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                </Stack>
              ))}
            </>
          )}
          {question.type === "true_false" && (
            <FormControl>
              <Typography sx={{ mb: 1 }}>Correct Answer</Typography>
              <RadioGroup
                value={question.correctOptions ? "true" : "false"}
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    correctOptions: e.target.value === "true",
                  })
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
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
            setQuestion(defaultQuestion);
            onClose();
          }}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!question.question.trim()) {
              alert("Question is required");
              return;
            }
            if (question.marks < 1) {
              alert("Marks must be at least 1");
              return;
            }
            if (question.type === "multiple_choice") {
              const options = question.options || [];
              if (options.length < 2) {
                alert("Minimum 2 options required");
                return;
              }
              const hasEmpty = options.some((item) => item.trim() === "");
              if (hasEmpty) {
                alert("All options are required");
                return;
              }
              if (
                !Array.isArray(question.correctOptions) ||
                question.correctOptions.length === 0
              ) {
                alert("Select at least one correct answer");
                return;
              }
            }
            onSave(question);
            setQuestion(defaultQuestion);
            onClose();
          }}
        >
          Save Question
        </Button>
      </DialogActions>
    </Dialog>
  );
}
