@echo off
echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel% == 0 (
    echo Node.js processes stopped successfully.
) else (
    echo No Node.js processes found or failed to stop.
)

echo Checking port 8080...
netstat -ano | findstr :8080
if %errorlevel% == 0 (
    echo Port 8080 is still in use.
) else (
    echo Port 8080 is now free.
)

echo Checking port 8081...
netstat -ano | findstr :8081
if %errorlevel% == 0 (
    echo Port 8081 is still in use.
) else (
    echo Port 8081 is now free.
)

pause 