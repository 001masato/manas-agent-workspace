Write-Host "🔮 MANAS Summoning Ritual Initiated..." -ForegroundColor Magenta

# 1. Update System Stats
Write-Host "📊 Synchronizing Knowledge..." -ForegroundColor Cyan
if (Test-Path "./analyze_system.ps1") {
    ./analyze_system.ps1
}

# 2. Open Azathoth
Write-Host "🌌 Opening Void Gate (Azathoth 2.0)..." -ForegroundColor Magenta
Start-Process "http://localhost:5173"

Write-Host "✨ Ritual Complete. Singularity is Active." -ForegroundColor Green
