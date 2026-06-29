export type QuestionType = "multiple_choice" | "true_false";

export interface Question {
  type: QuestionType;
  question: string;
  marks: number;
  options?: string[];
  correctOptions: number[] | boolean;
}