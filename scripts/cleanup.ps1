# Cleanup Script - Run this to remove unwanted files

Write-Host "🧹 Starting cleanup..." -ForegroundColor Cyan

# Remove old backend folder (if not locked)
if (Test-Path "backend") {
    Write-Host "📁 Removing old 'backend' folder..." -ForegroundColor Yellow
    try {
        Remove-Item -Path "backend" -Recurse -Force -ErrorAction Stop
        Write-Host "✅ Removed 'backend' folder" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not remove 'backend' folder (files may be open)" -ForegroundColor Red
        Write-Host "   Please close all files from 'backend' folder and delete manually" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✅ No 'backend' folder found (already clean)" -ForegroundColor Green
}

# Check for unwanted files at root
$unwantedItems = @("src", "public", "index.html", "vite.config.js", "eslint.config.js")

foreach ($item in $unwantedItems) {
    if (Test-Path $item) {
        Write-Host "⚠️  Found '$item' at root level (should be in client/)" -ForegroundColor Yellow
        Write-Host "   Recommendation: Move to client/ or delete if duplicate" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Cleanup check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Current structure:" -ForegroundColor Cyan
Get-ChildItem -Directory | Select-Object Name

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. npm run install:all    - Install dependencies"
Write-Host "2. Setup .env files in client/ and server/"
Write-Host "3. npm run dev            - Run both servers concurrently"
