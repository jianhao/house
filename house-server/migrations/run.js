// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://house_user:house_pass_2024@localhost:5432/house_db'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // 读取并执行 002_add_policies.sql
    const policiesSqlPath = path.join(__dirname, '002_add_policies.sql');
    if (fs.existsSync(policiesSqlPath)) {
      const policiesSql = fs.readFileSync(policiesSqlPath, 'utf8');
      console.log('Executing 002_add_policies.sql...');
      await client.query(policiesSql);
      console.log('Migration 002_add_policies.sql completed successfully');
    } else {
      console.log('002_add_policies.sql not found, skipping...');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();