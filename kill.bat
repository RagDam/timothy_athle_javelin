@echo off
echo Arret des processus Node.js...
taskkill /f /im node.exe >nul 2>&1
echo Processus arretes.
echo.
echo Tu peux maintenant lancer: dev.bat
pause
