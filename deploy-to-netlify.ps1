# 🚀 Quick Deploy Script for Geographic Detective Academy

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🌍 GEOGRAPHIC DETECTIVE ACADEMY - DEPLOY TO NETLIFY      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
Write-Host ""
Write-Host "📋 Checking for changes..." -ForegroundColor Yellow
$status = git status --porcelain

if ($status) {
    Write-Host "✅ Found changes to deploy:" -ForegroundColor Green
    git status --short
    Write-Host ""
    
    # Prompt for commit message
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "AI photo matching + location disambiguation + Geography in Real Life"
    }
    
    Write-Host ""
    Write-Host "📦 Staging files..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m $commitMsg
    
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✅ DEPLOYMENT INITIATED!                                 ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Netlify will automatically deploy your changes." -ForegroundColor Cyan
    Write-Host "⏱️  This usually takes 1-3 minutes." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Check deployment status:" -ForegroundColor Yellow
    Write-Host "   https://app.netlify.com" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Wait for Netlify deploy to complete" -ForegroundColor White
    Write-Host "   2. Open your live site in incognito mode" -ForegroundColor White
    Write-Host "   3. Test 3 locations (Greenville, Palmyra Maine, Alaska)" -ForegroundColor White
    Write-Host "   4. Verify photos match facts correctly" -ForegroundColor White
    Write-Host "   5. Check Geography in Real Life card" -ForegroundColor White
    
} else {
    Write-Host "⚠️  No changes detected. Everything is already committed." -ForegroundColor Yellow
    Write-Host ""
    $forceDeploy = Read-Host "Force redeploy anyway? (y/N)"
    
    if ($forceDeploy -eq "y" -or $forceDeploy -eq "Y") {
        Write-Host "🔄 Creating empty commit to trigger deploy..." -ForegroundColor Yellow
        git commit --allow-empty -m "Force redeploy"
        git push origin main
        
        Write-Host ""
        Write-Host "✅ Deploy triggered!" -ForegroundColor Green
    } else {
        Write-Host "❌ Deploy cancelled." -ForegroundColor Red
        exit 0
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  📚 DEPLOYMENT CHECKLIST                                  ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "⏳ While Netlify is deploying, verify:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [ ] Environment variables are set in Netlify dashboard" -ForegroundColor White
Write-Host "      - ANTHROPIC_API_KEY (Claude)" -ForegroundColor Gray
Write-Host "      - OPENAI_API_KEY (GPT-4)" -ForegroundColor Gray
Write-Host "      - REPLICATE_API_TOKEN (Images)" -ForegroundColor Gray
Write-Host "      - UNSPLASH_ACCESS_KEY (Photos)" -ForegroundColor Gray
Write-Host "      - PEXELS_API_KEY (Photos)" -ForegroundColor Gray
Write-Host "      - OPENWEATHERMAP_API_KEY (Weather)" -ForegroundColor Gray
Write-Host ""
Write-Host "  [ ] Functions are deployed:" -ForegroundColor White
Write-Host "      - match-photos-to-facts" -ForegroundColor Gray
Write-Host "      - generate-real-life-geography" -ForegroundColor Gray
Write-Host "      - get-ai-facts" -ForegroundColor Gray
Write-Host ""
Write-Host "  [ ] Test in production after deploy completes" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full checklist: NETLIFY_DEPLOYMENT_CHECKLIST.md" -ForegroundColor Cyan
Write-Host ""
