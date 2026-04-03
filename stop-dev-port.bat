@echo off
REM Frees port 3050 if an old Node/Next process is stuck (Windows).
echo Stopping whatever is listening on port 3050...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :3050 ^| findstr LISTENING') do (
  echo Killing PID %%P
  taskkill /F /PID %%P 2>nul
)
echo Done. Run dev.bat or npm run dev again.
