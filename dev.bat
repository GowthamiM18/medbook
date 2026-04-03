@echo off
REM Fixed port 3050 — always open http://localhost:3050 (avoids 3000/3001 conflicts).
cd /d "%~dp0"
set PORT=3050
echo.
echo Udumula Hospital dev server  ^>  http://localhost:%PORT%
echo If login/auth breaks, set NEXTAUTH_URL=http://localhost:%PORT% in your .env file.
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:%PORT%"
call "%~dp0node_modules\.bin\next.cmd" dev -p %PORT%
