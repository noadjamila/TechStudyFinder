/**
 * Test script to verify session persistence in PostgreSQL
 * Run with: npx ts-node test-session-persistence.ts
 */

import { pool } from "./db";

async function testSessionPersistence() {
  try {
    // Check if session table exists
    const tableCheck = await pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'session')",
    );

    const tableExists = tableCheck.rows[0]?.exists;
    console.log(`\n📊 Session table exists: ${tableExists ? "✓ YES" : "✗ NO"}`);

    if (tableExists) {
      // Get session count
      const sessionCount = await pool.query(
        "SELECT COUNT(*) as count FROM session",
      );
      const count = sessionCount.rows[0]?.count || 0;
      console.log(`📈 Sessions in database: ${count}`);

      // Show session schema
      const schema = await pool.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = 'session'
        ORDER BY ordinal_position
      `);

      console.log("\n📋 Session table schema:");
      schema.rows.forEach((col: any) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === "NO" ? "NOT NULL" : "nullable"}`,
        );
      });

      // Show any existing sessions
      if (count > 0) {
        const sessions = await pool.query(`
          SELECT 
            sid, 
            (sess->>'expire') as expires_at,
            (sess->'user'->>'username') as username
          FROM session 
          ORDER BY sid DESC
          LIMIT 5
        `);

        console.log("\n🔑 Recent sessions:");
        sessions.rows.forEach((session: any, idx: number) => {
          console.log(
            `  ${idx + 1}. User: ${session.username || "(anonymous)"}, Expires: ${session.expires_at || "N/A"}`,
          );
        });
      }
    }

    await pool.end();
    console.log("\n✅ Test completed successfully\n");
  } catch (err: any) {
    console.error("\n❌ Error:", err.message);
    console.error("\n⚠️  Connection details:");
    console.error(`  Host: ${process.env.DB_HOST}`);
    console.error(`  Port: ${process.env.DB_PORT}`);
    console.error(`  Database: ${process.env.DB_NAME}`);
    console.error(`  User: ${process.env.DB_USER}`);
    process.exit(1);
  }
}

testSessionPersistence();
