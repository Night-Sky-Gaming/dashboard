// Test script to verify Discord bot token and guild access
const fs = require('fs');
const path = require('path');

// Simple .env parser
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const DISCORD_API_BASE = "https://discord.com/api/v10";
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = "1430038605518077964";
const TEST_USER_ID = "1084918048638652426"; // First user from your logs

async function testBotToken() {
  console.log("\n=== Testing Discord Bot Configuration ===\n");
  
  // Test 1: Check bot token format
  console.log("1. Bot Token Check:");
  console.log(`   Token starts with: ${TOKEN?.substring(0, 20)}...`);
  console.log(`   Token length: ${TOKEN?.length || 0} characters`);
  
  if (!TOKEN) {
    console.error("   ❌ ERROR: No bot token found in environment!");
    return;
  }
  
  // Test 2: Verify bot authentication
  console.log("\n2. Testing Bot Authentication:");
  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
      },
    });
    
    if (response.ok) {
      const bot = await response.json();
      console.log(`   ✅ Bot authenticated successfully!`);
      console.log(`   Bot Name: ${bot.username}#${bot.discriminator}`);
      console.log(`   Bot ID: ${bot.id}`);
    } else {
      console.error(`   ❌ Authentication failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.error(`   Error details: ${error}`);
      return;
    }
  } catch (error) {
    console.error(`   ❌ Network error: ${error.message}`);
    return;
  }
  
  // Test 3: Check guild access
  console.log("\n3. Testing Guild Access:");
  try {
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${GUILD_ID}`, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
      },
    });
    
    if (response.ok) {
      const guild = await response.json();
      console.log(`   ✅ Bot has access to guild!`);
      console.log(`   Guild Name: ${guild.name}`);
      console.log(`   Guild ID: ${guild.id}`);
      console.log(`   Member Count: ${guild.approximate_member_count || 'N/A'}`);
    } else {
      console.error(`   ❌ Guild access failed: ${response.status} ${response.statusText}`);
      if (response.status === 403) {
        console.error(`   → Bot is NOT in this guild. Please invite the bot to guild ${GUILD_ID}`);
      }
    }
  } catch (error) {
    console.error(`   ❌ Network error: ${error.message}`);
  }
  
  // Test 4: Check guild member endpoint
  console.log("\n4. Testing Guild Member Endpoint:");
  try {
    const response = await fetch(
      `${DISCORD_API_BASE}/guilds/${GUILD_ID}/members/${TEST_USER_ID}`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      }
    );
    
    if (response.ok) {
      const member = await response.json();
      console.log(`   ✅ Successfully fetched guild member!`);
      console.log(`   User: ${member.user.username}`);
      console.log(`   Display Name: ${member.nick || member.user.global_name || member.user.username}`);
    } else {
      console.error(`   ❌ Member fetch failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.error(`   Error details: ${error}`);
      
      if (response.status === 401) {
        console.error(`\n   🔧 SOLUTION: Your bot token is invalid or has been reset.`);
        console.error(`      1. Go to https://discord.com/developers/applications`);
        console.error(`      2. Select your application`);
        console.error(`      3. Go to "Bot" tab`);
        console.error(`      4. Click "Reset Token" and copy the new token`);
        console.error(`      5. Update DISCORD_BOT_TOKEN in your .env file`);
      } else if (response.status === 403) {
        console.error(`\n   🔧 SOLUTION: Enable Server Members Intent:`);
        console.error(`      1. Go to https://discord.com/developers/applications`);
        console.error(`      2. Select your application`);
        console.error(`      3. Go to "Bot" tab`);
        console.error(`      4. Scroll to "Privileged Gateway Intents"`);
        console.error(`      5. Enable "SERVER MEMBERS INTENT"`);
        console.error(`      6. Save changes`);
      }
    }
  } catch (error) {
    console.error(`   ❌ Network error: ${error.message}`);
  }
  
  console.log("\n=== Test Complete ===\n");
}

testBotToken();
