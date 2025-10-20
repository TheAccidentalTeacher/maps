# 🔑 Extract Environment Variables for Netlify Upload

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔑 EXTRACTING API KEYS FOR NETLIFY                       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$requiredKeys = @(
    "ANTHROPIC_API_KEY",
    "OPENAI_API_KEY",
    "REPLICATE_API_TOKEN",
    "UNSPLASH_ACCESS_KEY",
    "PEXELS_API_KEY",
    "OPENWEATHERMAP_API_KEY"
)

$output = @()
$missing = @()

Write-Host "Extracting from environment variables..." -ForegroundColor Yellow
Write-Host ""

foreach ($key in $requiredKeys) {
    $value = [System.Environment]::GetEnvironmentVariable($key, "User")
    if (-not $value) {
        $value = [System.Environment]::GetEnvironmentVariable($key, "Process")
    }
    if (-not $value) {
        $value = [System.Environment]::GetEnvironmentVariable($key, "Machine")
    }
    
    if ($value) {
        $output += "$key=$value"
        
        # Show masked version
        if ($value.Length -gt 12) {
            $masked = $value.Substring(0, 8) + "..." + $value.Substring($value.Length - 4)
        } else {
            $masked = "***"
        }
        Write-Host "✅ $key = $masked" -ForegroundColor Green
    } else {
        $missing += $key
        Write-Host "❌ $key = NOT FOUND" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  📋 COPY/PASTE INTO NETLIFY                               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

if ($output.Count -gt 0) {
    # Save to clipboard
    $outputText = $output -join "`n"
    $outputText | Set-Clipboard
    
    Write-Host "✅ COPIED TO CLIPBOARD! Just paste into Netlify." -ForegroundColor Green
    Write-Host ""
    Write-Host "Format (use bulk import in Netlify):" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    foreach ($line in $output) {
        Write-Host $line -ForegroundColor White
    }
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    
    # Also save to file
    $outputText | Out-File "netlify-env-vars.txt" -Encoding UTF8
    Write-Host "✅ Also saved to: netlify-env-vars.txt" -ForegroundColor Green
    Write-Host ""
}

if ($missing.Count -gt 0) {
    Write-Host "⚠️  Missing keys:" -ForegroundColor Yellow
    foreach ($key in $missing) {
        Write-Host "   - $key" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📤 HOW TO UPLOAD TO NETLIFY                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Method 1: Bulk Import (Fastest)" -ForegroundColor Yellow
Write-Host "  1. Go to: https://app.netlify.com" -ForegroundColor White
Write-Host "  2. Select your site" -ForegroundColor White
Write-Host "  3. Site configuration → Environment variables" -ForegroundColor White
Write-Host "  4. Click: Import from .env file" -ForegroundColor White
Write-Host "  5. Paste the copied text (already in clipboard!)" -ForegroundColor White
Write-Host "  6. Click: Import variables" -ForegroundColor White
Write-Host ""
Write-Host "Method 2: Manual Entry" -ForegroundColor Yellow
Write-Host "  1. Go to: https://app.netlify.com" -ForegroundColor White
Write-Host "  2. Select your site" -ForegroundColor White
Write-Host "  3. Site configuration → Environment variables" -ForegroundColor White
Write-Host "  4. Click: Add a variable (for each key)" -ForegroundColor White
Write-Host "  5. Enter key name and value" -ForegroundColor White
Write-Host "  6. Scope: All environments" -ForegroundColor White
Write-Host ""

$openNetlify = Read-Host "Open Netlify dashboard now? (Y/n)"
if ($openNetlify -ne "n" -and $openNetlify -ne "N") {
    Start-Process "https://app.netlify.com"
}

Write-Host ""
Write-Host "✅ Done! Keys are in your clipboard. Just paste into Netlify!" -ForegroundColor Green
Write-Host ""
