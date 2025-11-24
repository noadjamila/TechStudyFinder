export async function postFilterLevel(payload: {
  level: 1 | 2 | 3;
  answers: any[];
  studyProgrammeIds?: number[];
}) {
  const res = await fetch("/api/quiz/filter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Filter request failed");
  return res.json() as Promise<{ success: boolean; ids: number[] }>;
}
