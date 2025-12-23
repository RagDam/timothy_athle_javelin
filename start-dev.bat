@echo off
title Timothy Site - Dev Server
cd /d "%~dp0"

:: Tue les anciens processus Node
echo Arret des anciens processus...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

:: Ouvre le navigateur apres un delai (le temps que le serveur demarre)
echo Demarrage du serveur...
start "" cmd /c "timeout /t 5 >nul && start http://localhost:3000"

:: Lance le serveur
npm run dev
