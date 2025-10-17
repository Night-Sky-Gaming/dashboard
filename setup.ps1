# Setup Script for Discord Bot Dashboard
# Run this script to create your .env file

Write-Host "Discord Bot Dashboard Setup" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "WARNING: .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Prompt for database path
Write-Host ""
Write-Host "Database Configuration" -ForegroundColor Green
$dbPath = Read-Host "Enter the path to your bot's SQLite database"

if (-not $dbPath) {
    $dbPath = "./database.sqlite"
    Write-Host "Using default: $dbPath" -ForegroundColor Yellow
}

# Prompt for bot name
Write-Host ""
Write-Host "Bot Configuration" -ForegroundColor Green
$botName = Read-Host "Enter your bot name (e.g. Andromeda Bot)"

if (-not $botName) {
    $botName = "My Discord Bot"
    Write-Host "Using default: $botName" -ForegroundColor Yellow
}

# Create .env file content
$envContent = "# Database Configuration`r`n"
$envContent += "DATABASE_PATH=$dbPath`r`n"
$envContent += "`r`n"
$envContent += "# Discord Configuration`r`n"
$envContent += "DISCORD_CLIENT_ID=your_client_id_here`r`n"
$envContent += "DISCORD_CLIENT_SECRET=your_client_secret_here`r`n"
$envContent += "NEXT_PUBLIC_DISCORD_BOT_NAME=$botName`r`n"
$envContent += "`r`n"
$envContent += "# NextAuth Configuration (for future authentication)`r`n"
$envContent += "NEXTAUTH_URL=http://localhost:3000`r`n"
$envContent += "NEXTAUTH_SECRET=your_nextauth_secret_here`r`n"

# Write to file
$envContent | Out-File -FilePath ".env" -Encoding ASCII -NoNewline

Write-Host ""
Write-Host "SUCCESS: .env file created!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Verify your database path in .env" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Check SETUP.md for detailed instructions." -ForegroundColor Gray
