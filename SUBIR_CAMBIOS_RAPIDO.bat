@echo off
chcp 65001 >nul
title Subir Cambios a GitHub (Rápido)

:: Ir a la carpeta del script
cd /d "%~dp0"

echo.
echo ⬆️  Subiendo cambios a GitHub...
echo.

:: Agregar, commitear y pushear en una sola operación
git add .
git commit -m "Fase 1: Actualización de datos y texto (sin diseño)"
git push

if %errorlevel% equ 0 (
    echo.
    echo ✅ ¡Cambios subidos correctamente!
    echo.
    echo 🌐 Disponible en: https://miguelitoo2421.github.io/gestor-presupuestos/
    echo ⏱️  Espera 1-2 minutos para ver los cambios
    echo.
) else (
    echo.
    echo ❌ Hubo un error al subir los cambios
    echo.
)

pause
