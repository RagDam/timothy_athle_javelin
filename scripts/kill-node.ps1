# Script pour tuer tous les processus Node.js et libérer les ports
Write-Host "Arrêt de tous les processus Node.js..." -ForegroundColor Yellow

Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Processus Node.js arrêtés." -ForegroundColor Green
Write-Host ""
Write-Host "Tu peux maintenant lancer: npm run dev" -ForegroundColor Cyan
