$ErrorActionPreference = "Stop"

$nexusDir = Resolve-Path "$PSScriptRoot\.."

Write-Host "🚀 Initializing Visual Nexus System Launch Sequence..." -ForegroundColor Cyan

# 1. Launch Bridge Server
Write-Host "   [1/2] Starting Bridge Server (Port 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$nexusDir'; Remove-Item -ErrorAction SilentlyContinue public/brain_dump.json; node server.js"

# 2. Launch Frontend
Write-Host "   [2/2] Starting Interface (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$nexusDir'; npm run dev"

Write-Host "`n✅ System Launch Initiated." -ForegroundColor Green
Write-Host "   - Bridge Window: Active"
Write-Host "   - Interface Window: Active"
Write-Host "`n🌐 Access the system at: http://localhost:5173" -ForegroundColor Cyan
