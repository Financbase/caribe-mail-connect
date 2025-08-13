/* eslint-env node */
/**
 * GDPR data export script for PRMCE ventures using CEMI Core.
 * Connects via HashiCorp Vault-provided credentials to export all user data across tables with a `user_id` column.
 * @date 2025-02-14
 */
import { Client } from "pg";
import fs from "fs";

const connectionString = process.env.PG_CONNECTION_STRING;
const userId = process.argv[2];

if (!connectionString || !userId) {
  console.error("Usage: tsx scripts/compliance/gdpr/exportData.ts <user_id>");
  process.exit(1);
}

async function exportUserData() {
  const client = new Client({ connectionString });
  await client.connect();

  const { rows: tables } = await client.query(
    "SELECT table_name FROM information_schema.columns WHERE column_name = 'user_id'"
  );

  const exportData: Record<string, unknown[]> = {};
  for (const { table_name } of tables) {
    const { rows } = await client.query(
      `SELECT * FROM ${table_name} WHERE user_id = $1`,
      [userId]
    );
    exportData[table_name] = rows;
  }

  await client.end();

  fs.writeFileSync(
    `gdpr-export-${userId}.json`,
    JSON.stringify(exportData, null, 2)
  );
  console.log(`Exported data for user ${userId}`);
}

exportUserData().catch((err) => {
  console.error(err);
  process.exit(1);
});
