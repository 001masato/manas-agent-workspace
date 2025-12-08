# 1. ステータス解析エンジンの作成 (analyze_system.ps1)
Write-Host "🔍 MANAS SYSTEM: Scanning workspace data..." -ForegroundColor Cyan

# 統計データの取得 (Git除外)
$files = Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\node_modules\\' }
$fileCount = $files.Count
$totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1KB
$linesOfCode = 0

# 行数カウント (テキストファイルのみ対象、エラー無視)
foreach ($f in $files) { 
    if ($f.Extension -match '\.(md|txt|js|ts|jsx|tsx|html|css|json|ps1|py|yaml|yml)$') {
        try { $linesOfCode += (Get-Content $f.FullName -ErrorAction SilentlyContinue).Count } catch {} 
    }
}

# レベル計算ロジック (RPG風)
# XP = ファイル数 * 10 + 行数 * 0.5
$xp = [math]::Round($fileCount * 10 + $linesOfCode * 0.5)
# Level = sqrt(xp) * 0.5
$level = [math]::Floor([math]::Sqrt($xp) * 0.5)
# Next Level XP = ((Level + 1) / 0.5)^2
$nextLevelXp = [math]::Round([math]::Pow(($level + 1) / 0.5, 2))
$progress = [math]::Round(($xp / $nextLevelXp) * 100)
if ($progress -gt 100) { $progress = 100 }

# JSONデータの作成
$stats = @{
    user        = "001masato"
    agent       = "MANAS (Visual Nexus)"
    level       = $level
    xp          = $xp
    next_xp     = $nextLevelXp
    progress    = $progress
    total_files = $fileCount
    total_lines = $linesOfCode
    last_sync   = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    status      = "OPERATIONAL"
    message     = "System All Green. Ready for Next Interaction."
}

$jsonContent = $stats | ConvertTo-Json
if (-not (Test-Path "docs")) { New-Item -ItemType Directory -Path "docs" | Out-Null }
Set-Content -Path "docs/stats.json" -Value $jsonContent -Encoding UTF8

Write-Host "📊 ANALYSIS COMPLETE: Level $level (XP: $xp)" -ForegroundColor Magenta
Write-Host "   Files: $fileCount | Lines: $linesOfCode" -ForegroundColor DarkGray
