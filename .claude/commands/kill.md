---
allowed-tools: Bash(powershell -Command:*)
description: Arrête tous les processus Node.js et libère les ports
---

# Arrêter les processus Node.js

Tue tous les processus Node.js en cours pour libérer les ports (3000, 3001, etc.)

## Instructions

Exécute la commande PowerShell pour arrêter tous les processus Node.js :
`Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force`

Confirme à l'utilisateur que les processus ont été arrêtés.
