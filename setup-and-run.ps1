# CareerCompass - Quick Setup and Run Script for Windows
# Run this script in PowerShell as Administrator if needed

Write-Host "🚀 CareerCompass - AI Career Advisor Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version and restart PowerShell after installation." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in the right directory
$currentDir = Get-Location
Write-Host "📁 Current directory: $currentDir" -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    Write-Host "Please make sure you're in the CareerCompass project directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Try running: npm cache clean --force" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start the development server
Write-Host "`n🚀 Starting the development server..." -ForegroundColor Yellow
Write-Host "The app will open in your browser at http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

Write-Host "`n🎯 Features to test:" -ForegroundColor Green
Write-Host "- Home page with navigation" -ForegroundColor White
Write-Host "- User authentication (Sign Up/Sign In)" -ForegroundColor White  
Write-Host "- Discovery assessment (4 steps)" -ForegroundColor White
Write-Host "- AI career recommendations" -ForegroundColor White
Write-Host "- Skills assessment" -ForegroundColor White
Write-Host "- Light/Dark theme toggle" -ForegroundColor White

Write-Host "`n⚡ Starting server..." -ForegroundColor Yellow

try {
    npm run dev
} catch {
    Write-Host "❌ Failed to start the server!" -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
}

Write-Host "`n👋 Server stopped. Thanks for testing CareerCompass!" -ForegroundColor Green