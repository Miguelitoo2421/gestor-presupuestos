@echo off
chcp 65001 >nul
title Gestor de Presupuestos Odontológicos

echo.
echo ========================================
echo   GESTOR DE PRESUPUESTOS ODONTOLÓGICOS
echo   Dra. Karelys Matheus
echo ========================================
echo.
echo Iniciando servidor local...
echo.

:: Buscar y matar procesos Python en el puerto 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Cerrando servidor anterior (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

:: Esperar un momento
timeout /t 2 /nobreak >nul

:: Iniciar el servidor
echo Servidor iniciado en: http://localhost:8000
echo.
echo INSTRUCCIONES:
echo - La aplicacion se abrira automaticamente en tu navegador
echo - NO CIERRES esta ventana mientras uses la aplicacion
echo - Para cerrar: presiona Ctrl+C o cierra esta ventana
echo.
echo ========================================
echo.

:: Abrir navegador en segundo plano
start http://localhost:8000

:: Iniciar servidor (esto mantiene la ventana abierta)
python -m http.server 8000

pause

