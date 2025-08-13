/* eslint-env node */
/**
 * GDPR data deletion script for PRMCE ventures using CEMI Core.
 * Connects via HashiCorp Vault-provided credentials to delete all user data across tables with a `user_id` column.
 * @date 2025-02-14
 */
import { Client } from "pg";

const connectionString = process.env.PG_CONNECTION_STRING;
const userId = process.argv[2];

if (!connectionString || !userId) {
  console.error("Usage: tsx scripts/compliance/gdpr/deleteData.ts <user_id>");
  process.exit(1);
}

async function deleteUserData() {
  const client = new Client({ connectionString });
  await client.connect();

  const { rows: tables } = await client.query(
    "SELECT table_name FROM information_schema.columns WHERE column_name = 'user_id'"
  );

  for (const { table_name } of tables) {
    await client.query(
      `DELETE FROM ${table_name} WHERE user_id = $1`,
      [userId]
    );
  }

  await client.end();
  console.log(`Deleted data for user ${userId}`);
}

deleteUserData().catch((err) => {
  console.error(err);
  process.exit(1);
});
