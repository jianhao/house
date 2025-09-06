// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

async function runSeeds() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://house_user:house_pass_2024@localhost:5432/house_db'
  });

  try {
    await client.connect();
    console.log('Connected to database for seeding');

    // 读取并执行 complete_houses.sql
    const seedSqlPath = path.join(__dirname, 'complete_houses.sql');
    if (fs.existsSync(seedSqlPath)) {
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      console.log('Executing complete_houses.sql...');
      await client.query(seedSql);
      console.log('Complete houses seed data imported successfully');
    } else {
      console.log('complete_houses.sql not found, skipping...');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeeds();