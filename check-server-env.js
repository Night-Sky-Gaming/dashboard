// Run this on the server to check what environment variables are being used
console.log("\n=== Server Environment Check ===\n");
console.log("Environment Variables:");
console.log(`DISCORD_API_ENABLED: ${process.env.DISCORD_API_ENABLED}`);
console.log(`DISCORD_BOT_TOKEN (first 20 chars): ${process.env.DISCORD_BOT_TOKEN?.substring(0, 20)}...`);
console.log(`DISCORD_BOT_TOKEN length: ${process.env.DISCORD_BOT_TOKEN?.length || 0}`);
console.log(`DATABASE_PATH: ${process.env.DATABASE_PATH}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Check if .env file exists
const fs = require('fs');
const path = require('path');

console.log("\n.env file check:");
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log(`✅ .env file exists at: ${envPath}`);
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  const tokenLine = lines.find(line => line.includes('DISCORD_BOT_TOKEN'));
  if (tokenLine) {
    const token = tokenLine.split('=')[1];
    console.log(`   DISCORD_BOT_TOKEN in .env (first 20): ${token?.substring(0, 20)}...`);
  }
  const apiLine = lines.find(line => line.includes('DISCORD_API_ENABLED'));
  if (apiLine) {
    console.log(`   ${apiLine}`);
  }
} else {
  console.log(`❌ No .env file found at: ${envPath}`);
}

console.log("\n=== End Check ===\n");
