@echo off
chcp 65001 >nul
echo ===========================================
echo     INICIANDO BACKEND - BURGER HOUSE
echo ===========================================
echo.
echo Este script iniciara el servidor backend...
echo.
echo Asegurate de tener Python instalado.
echo.
echo Presione Ctrl+C para detener el servidor
echo.
cd /d "%~dp0backend"
call venv\Scripts\activate.bat
python -m uvicorn app.main:app --reload --port 8000
pause