// import db from '../db.js'; // dein DB-Connector (z. B. pg, Sequelize, Prisma, etc.)

export async function getFilteredResults() {
  // const { categories } = query;
  // const results = await db.query(
  //   'SELECT * FROM quiz_questions WHERE category = ANY($1)',
  //   [categories]
  // );
  console.log('Datenbankabfrage ausgeführt'); // Debug-Ausgabe
  return [1, 3, 5]; // Ersetze dies durch die tatsächlichen Ergebnisse aus der DB
};
