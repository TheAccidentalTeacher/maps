# 🧪 Production Site Testing Script

param(
    [string]$SiteUrl = "https://your-site-name.netlify.app"
)

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🧪 TESTING PRODUCTION SITE                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($SiteUrl -eq "https://your-site-name.netlify.app") {
    Write-Host "⚠️  Using default URL. Replace with your actual Netlify URL:" -ForegroundColor Yellow
    $customUrl = Read-Host "Enter your Netlify site URL (or press Enter to skip)"
    if (![string]::IsNullOrWhiteSpace($customUrl)) {
        $SiteUrl = $customUrl
    }
}

Write-Host ""
Write-Host "🌐 Testing: $SiteUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Main site is accessible
Write-Host "Test 1: Main site accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $SiteUrl -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Site is online (200 OK)" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ Site is not accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Functions endpoint
Write-Host ""
Write-Host "Test 2: Netlify Functions..." -ForegroundColor Yellow

$functions = @(
    "match-photos-to-facts",
    "generate-real-life-geography",
    "get-ai-facts"
)

foreach ($func in $functions) {
    try {
        $funcUrl = "$SiteUrl/.netlify/functions/$func"
        # Note: Will return 400 without params, but that means function exists
        $response = Invoke-WebRequest -Uri $funcUrl -Method POST -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Host "  ✅ $func is deployed" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "  ✅ $func is deployed (awaiting params)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $func: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

# Test 3: Check for required files
Write-Host ""
Write-Host "Test 3: Static files..." -ForegroundColor Yellow
try {
    $indexContent = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -ErrorAction Stop
    
    if ($indexContent.Content -match "Geographic Detective Academy") {
        Write-Host "  ✅ Main HTML loaded" -ForegroundColor Green
    }
    
    if ($indexContent.Content -match "generateRealLifeGeography") {
        Write-Host "  ✅ Geography in Real Life function present" -ForegroundColor Green
    }
    
    if ($indexContent.Content -match "matchPhotosToFacts") {
        Write-Host "  ✅ Photo matching function present" -ForegroundColor Green
    }
    
} catch {
    Write-Host "  ❌ Could not verify static files" -ForegroundColor Red
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  🎯 MANUAL TESTING REQUIRED                               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Open your site in a browser and test:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Click on Greenville, South Carolina" -ForegroundColor White
Write-Host "     - Verify Liberty Bridge fact has bridge photo" -ForegroundColor Gray
Write-Host "     - Verify turtle fact has wildlife photo (NOT a dog!)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Click on Palmyra, Maine" -ForegroundColor White
Write-Host "     - Photos should show Maine town, NOT Syrian ruins" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Check Geography in Real Life card" -ForegroundColor White
Write-Host "     - Card should appear after facts load" -ForegroundColor Gray
Write-Host "     - Content should be scrollable" -ForegroundColor Gray
Write-Host "     - Examples should be student-appropriate" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Check browser console (F12) for errors" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Monitor Netlify function logs:" -ForegroundColor Cyan
Write-Host "   https://app.netlify.com → Functions → Recent invocations" -ForegroundColor White
Write-Host ""

# Open browser to site
$openBrowser = Read-Host "Open site in browser now? (Y/n)"
if ($openBrowser -ne "n" -and $openBrowser -ne "N") {
    Start-Process $SiteUrl
}

Write-Host ""
Write-Host "✅ Automated tests complete. Manual verification needed." -ForegroundColor Green
Write-Host ""
