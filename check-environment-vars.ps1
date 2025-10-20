# 🔑 Environment Variables Checker for Netlify

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔑 NETLIFY ENVIRONMENT VARIABLES CHECKLIST               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script checks if your API keys are configured for Netlify." -ForegroundColor Yellow
Write-Host "These keys must be set in the Netlify dashboard, NOT in your code!" -ForegroundColor Yellow
Write-Host ""

# Check local .env file (for reference)
$envFile = ".env"
$localVars = @{}

if (Test-Path $envFile) {
    Write-Host "📄 Found local .env file (for local dev server only):" -ForegroundColor Green
    Write-Host ""
    
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.+)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Mask the key for security
            if ($value.Length -gt 8) {
                $masked = $value.Substring(0, 8) + "..." + $value.Substring($value.Length - 4)
            } else {
                $masked = "***"
            }
            
            $localVars[$key] = $value
            Write-Host "  ✅ $key = $masked" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠️  No .env file found. Keys should be in environment or Netlify dashboard." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  📋 REQUIRED NETLIFY ENVIRONMENT VARIABLES                ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

$requiredVars = @(
    @{
        Name = "ANTHROPIC_API_KEY"
        Purpose = "Claude 3.5 Sonnet (primary AI for facts & matching)"
        Prefix = "sk-ant-"
        Critical = $true
    },
    @{
        Name = "OPENAI_API_KEY"
        Purpose = "GPT-4o (fallback AI)"
        Prefix = "sk-"
        Critical = $false
    },
    @{
        Name = "REPLICATE_API_TOKEN"
        Purpose = "Flux Schnell (AI image generation - FALLBACK ONLY)"
        Prefix = "r8_"
        Critical = $false
    },
    @{
        Name = "UNSPLASH_ACCESS_KEY"
        Purpose = "Real photos (primary source)"
        Prefix = ""
        Critical = $true
    },
    @{
        Name = "PEXELS_API_KEY"
        Purpose = "Real photos (secondary source)"
        Prefix = ""
        Critical = $false
    },
    @{
        Name = "OPENWEATHERMAP_API_KEY"
        Purpose = "Weather data"
        Prefix = ""
        Critical = $false
    }
)

$missingCritical = @()
$missingOptional = @()

foreach ($var in $requiredVars) {
    $found = $localVars.ContainsKey($var.Name)
    
    if ($found) {
        $value = $localVars[$var.Name]
        $valid = $true
        
        # Check prefix if specified
        if ($var.Prefix -and -not $value.StartsWith($var.Prefix)) {
            $valid = $false
        }
        
        if ($valid) {
            Write-Host "✅ $($var.Name)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($var.Name) - Invalid format (should start with '$($var.Prefix)')" -ForegroundColor Yellow
        }
    } else {
        if ($var.Critical) {
            Write-Host "❌ $($var.Name) - MISSING (CRITICAL!)" -ForegroundColor Red
            $missingCritical += $var.Name
        } else {
            Write-Host "⚠️  $($var.Name) - Missing (optional)" -ForegroundColor Yellow
            $missingOptional += $var.Name
        }
    }
    
    Write-Host "   Purpose: $($var.Purpose)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 NETLIFY DASHBOARD SETUP                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "To set environment variables in Netlify:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://app.netlify.com" -ForegroundColor White
Write-Host "2. Select your site (mrsomersmaps)" -ForegroundColor White
Write-Host "3. Click: Site configuration → Environment variables" -ForegroundColor White
Write-Host "4. Click: Add a variable" -ForegroundColor White
Write-Host "5. For each variable above:" -ForegroundColor White
Write-Host "   - Key: Variable name (e.g., ANTHROPIC_API_KEY)" -ForegroundColor Gray
Write-Host "   - Value: Your API key" -ForegroundColor Gray
Write-Host "   - Scope: All environments" -ForegroundColor Gray
Write-Host "6. Click: Create variable" -ForegroundColor White
Write-Host ""

if ($missingCritical.Count -gt 0) {
    Write-Host "⚠️  CRITICAL MISSING KEYS:" -ForegroundColor Red
    $missingCritical | ForEach-Object {
        Write-Host "   - $_" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Your site will NOT work without these keys!" -ForegroundColor Red
    Write-Host ""
}

if ($missingOptional.Count -gt 0) {
    Write-Host "ℹ️  Optional missing keys (site will work with fallbacks):" -ForegroundColor Yellow
    $missingOptional | ForEach-Object {
        Write-Host "   - $_" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  📚 WHERE TO GET API KEYS                                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "ANTHROPIC_API_KEY:       https://console.anthropic.com/settings/keys" -ForegroundColor White
Write-Host "OPENAI_API_KEY:          https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "REPLICATE_API_TOKEN:     https://replicate.com/account/api-tokens" -ForegroundColor White
Write-Host "UNSPLASH_ACCESS_KEY:     https://unsplash.com/developers" -ForegroundColor White
Write-Host "PEXELS_API_KEY:          https://www.pexels.com/api/" -ForegroundColor White
Write-Host "OPENWEATHERMAP_API_KEY:  https://openweathermap.org/api" -ForegroundColor White
Write-Host ""

$openNetlify = Read-Host "Open Netlify dashboard now? (Y/n)"
if ($openNetlify -ne "n" -and $openNetlify -ne "N") {
    Start-Process "https://app.netlify.com"
}

Write-Host ""
Write-Host "✅ Checklist complete!" -ForegroundColor Green
Write-Host ""
