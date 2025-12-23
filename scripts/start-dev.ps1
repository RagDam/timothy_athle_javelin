# Script pour démarrer le serveur de développement
Write-Host "=== Démarrage du serveur Next.js ===" -ForegroundColor Cyan
Write-Host ""

# Arrêter les anciens processus Node
Write-Host "1. Arrêt des anciens processus Node.js..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Démarrer le serveur
Write-Host "2. Démarrage du serveur..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Le site sera disponible sur: http://localhost:3000" -ForegroundColor Green
Write-Host "Appuie sur Ctrl+C pour arrêter le serveur" -ForegroundColor Gray
Write-Host ""

npm run dev
