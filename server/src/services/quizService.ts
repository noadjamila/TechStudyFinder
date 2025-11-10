import { getFilteredResults } from '../repositories/quizRepository';

export async function filterResults(answers: any[]) {
  //const query = buildQueryFromAnswers(answers);
  return await getFilteredResults();
}

// function buildQueryFromAnswers(answers: any[]) {
//   const categories = answers.map(a => a.category).filter(Boolean);
//   return { categories };
// }