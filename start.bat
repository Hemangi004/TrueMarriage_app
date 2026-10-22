@echo off
echo ===================================================
echo   Starting TrueMarriage Matrimonial Platform
echo ===================================================
echo Starting FastAPI Backend on http://localhost:5000 ...
start "TrueMarriage - Backend" cmd /k "python main.py"

echo Starting React Frontend on http://localhost:5173 ...
start "TrueMarriage - Frontend" cmd /k "npm --prefix frontend run dev"

echo.
echo ===================================================
echo   Servers launched in separate windows!
echo   Frontend URL: http://localhost:5173
echo   Backend API:  http://localhost:5000
echo   Health Check: http://localhost:5000/health
echo ===================================================
