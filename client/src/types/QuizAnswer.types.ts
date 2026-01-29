export type Answer = {
  questionId: string;
  value: string | number | boolean;
  answeredAt: number;
};

export type AnswerMap = Record<string, Answer>;
