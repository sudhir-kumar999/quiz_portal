"use client";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Question } from "./types";

interface Props {
  index: number;
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionCard = ({
  index,
  question,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        bgcolor: "#fff",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{justifyContent:"center",alignItems:"center"}}
        >
          <Stack spacing={1}>
            <Typography variant="h6" sx={{fontWeight:700}}>
              Question {index + 1}
            </Typography>
            <Chip
              size="small"
              color={
                question.type === "multiple_choice"
                  ? "primary"
                  : "success"
              }
              label={
                question.type === "multiple_choice"
                  ? "Multiple Choice"
                  : "True / False"
              }
            />
          </Stack>
          <Stack direction="row">
            <IconButton color="primary" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography sx={{fontWeight:700}}>
          {question.question}
        </Typography>
        {question.type === "multiple_choice" && (
          <Stack sx={{mt:2}} spacing={1}>
            {question.options?.map((option: string, i:number) => {
              const correct =
                (question.correctOptions as number[]).includes(i);
              return (
                <Chip
                  key={i}
                  label={`${String.fromCharCode(65 + i)}. ${option}`}
                  color={correct ? "success" : "default"}
                  variant={correct ? "filled" : "outlined"}
                />
              );
            })}
          </Stack>
        )}
        {question.type === "true_false" && (
          <Chip
            sx={{ mt: 2 }}
            color={
              question.correctOptions ? "success" : "error"
            }
            label={
              question.correctOptions ? "Correct : True" : "Correct : False"
            }
          />
        )}
        <Divider sx={{ my: 2 }} />
        <Typography sx={{fontWeight:700}}>
          Marks : {question.marks}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;