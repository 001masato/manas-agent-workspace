# 2. 保存スクリプトの強化 (解析を組み込む)
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   MANAS AUTO-SYNC & EVOLUTION PROTOCOL   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Analyze
try {
    powershell -ExecutionPolicy Bypass -File .\analyze_system.ps1
}
catch {
    Write-Host "⚠️ Analysis Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 2. Git Sync
Write-Host "🧠 Synchronizing Manas Memory Banks..." -ForegroundColor Cyan
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
# メッセージに少し遊び心を
git commit -m "System Upgrade: Level update at $timestamp"
git push

if ($?) {
    Write-Host "✅ SYNC COMPLETE. Visual Nexus Updated." -ForegroundColor Green
    Write-Host "🚀 Check Dashboard: https://masato-p.github.io/manas-agent-workspace/ (Example URL)" -ForegroundColor Gray
}
else {
    Write-Host "❌ SYNC FAILED. Check Git status." -ForegroundColor Red
}
