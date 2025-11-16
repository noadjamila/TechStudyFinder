import { pool } from '../../db'; // dein DB-Connector (z. B. pg, Sequelize, Prisma, etc.)

export async function getFilteredResults() {
  // insert query logic here
  console.log('Datenbankabfrage ausgeführt'); // Debug-Ausgabe
  return [1, 3, 5]; // Ersetze dies durch die tatsächlichen Ergebnisse aus der DB
};
