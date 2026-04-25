@echo off
echo ===========================================
echo     INICIANDO FRONTEND - BURGER HOUSE
echo ===========================================
echo.
echo Este script iniciara el servidor frontend...
echo Cuando vea "Local: http://localhost:5173"
echo Abra el navegador en esa direccion
echo.
echo Presione Ctrl+C para detener el servidor
echo.
cd /d "%~dp0frontend"
npm run dev
pause