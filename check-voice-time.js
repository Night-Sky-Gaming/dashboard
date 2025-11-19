const Database = require('better-sqlite3');
const path = require('path');

// Update this path to your database
const dbPath = '/home/ubuntu/background/leveling.db';

try {
  const db = new Database(dbPath, { readonly: true });
  
  console.log('\n=== Voice Time Check ===\n');
  
  const query = `
    SELECT user_id, voice_total_time, level, xp
    FROM users 
    WHERE guild_id = '1430038605518077964' 
    AND voice_total_time > 0
    ORDER BY voice_total_time DESC 
    LIMIT 5
  `;
  
  const results = db.prepare(query).all();
  
  console.log('Sample voice time values from database:\n');
  results.forEach((row, i) => {
    console.log(`User ${i + 1}:`);
    console.log(`  User ID: ${row.user_id}`);
    console.log(`  Raw value: ${row.voice_total_time}`);
    console.log(`  As seconds: ${Math.floor(row.voice_total_time / 1000)}s (${Math.floor(row.voice_total_time / 1000 / 60)}min)`);
    console.log(`  As milliseconds: ${row.voice_total_time}ms (${Math.floor(row.voice_total_time / 60000)}min)`);
    console.log(`  Level: ${row.level}, XP: ${row.xp}\n`);
  });
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nNote: This script needs to run on the server where the database is located.');
}
