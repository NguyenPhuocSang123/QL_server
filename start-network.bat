@echo off
REM Quick start script for network access
REM Thay YOUR_IP bang dia chi IP thuc

echo.
echo ===============================================
echo   QUICK START - Network Access Setup
echo ===============================================
echo.

REM Get local IP
echo [*] Tim dia chi IP cua may tinh...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
)

if defined ip (
    echo [+] Found IP: %ip%
) else (
    echo [!] Khong the tim IP, dung ipconfig manually
    pause
    exit /b 1
)

echo.
echo [*] Installing dependencies...
call npm run install:all

echo.
echo [*] Starting backend on 0.0.0.0:5000...
echo [+] Access: http://%ip%:5000/api/health
start cmd /k "cd backend && npm run dev"

timeout /t 3

echo.
echo [*] Starting frontend on 0.0.0.0:3000...
echo [+] Access: http://%ip%:3000
start cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================
echo   Access from another machine:
echo   http://%ip%:3000
echo ===============================================
echo.
pause
