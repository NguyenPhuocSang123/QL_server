@echo off
chcp 65001 >nul
echo ========================================
echo   QL Server - Khoi dong du an
echo ========================================
echo.

cd /d "%~dp0"

if not exist "backend\node_modules" (
  echo [1/4] Cai dat Backend...
  cd backend
  call npm install
  cd ..
) else (
  echo [1/4] Backend da cai dat.
)

if not exist "frontend\node_modules" (
  echo [2/4] Cai dat Frontend...
  cd frontend
  call npm install
  cd ..
) else (
  echo [2/4] Frontend da cai dat.
)

echo [3/4] Tao du lieu mau (seed)...
cd backend
call npm run seed
cd ..

echo [4/4] Mo Backend (5000) va Frontend (3000)...
echo.
echo   Trinh duyet: http://localhost:3000
echo   Dang nhap: admin@qlserver.com / admin123
echo.
echo   Nhan Ctrl+C de dung. Dong cua so nay se tat ca server.
echo.

start "QL-Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul
start "QL-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Da khoi dong! Kiem tra 2 cua so terminal Backend va Frontend.
