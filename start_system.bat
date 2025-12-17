@echo off
title SPGCU System - Auto Start
cd /d "%~dp0"

echo ================================================
echo   SPGCU System - Sistema Comedor Universitario
echo ================================================
echo.

REM Start Laravel development server in a new window
echo [1/2] Iniciando servidor Laravel...
start "Laravel Server" cmd /k "php artisan serve"

REM Wait a moment for Laravel to start
timeout /t 3 /nobreak > nul

REM Start Vite development server in a new window
echo [2/2] Iniciando Vite (Frontend)...
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo ================================================
echo   Servidores iniciados correctamente!
echo   - Laravel: http://127.0.0.1:8000
echo   - Vite:    http://localhost:5173
echo ================================================
echo.
echo Presione cualquier tecla para abrir el navegador...
pause > nul

start http://127.0.0.1:8000
