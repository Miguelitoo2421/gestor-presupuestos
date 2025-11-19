@echo off
chcp 65001 >nul
title Subir Cambios a GitHub - FASE 2

:: Ir a la carpeta del script
cd /d "%~dp0"

echo.
echo ========================================
echo   SUBIR CAMBIOS - FASE 2 (ESTETICOS)
echo ========================================
echo.
echo ⬆️  Subiendo cambios a GitHub...
echo.

:: Agregar, commitear y pushear
git add .
git commit -m "Fase 2: Cambios estéticos - Diseño reorganizado sin bordes"
git push

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ ¡CAMBIOS SUBIDOS CORRECTAMENTE!
    echo ========================================
    echo.
    echo 🌐 Disponible en:
    echo https://miguelitoo2421.github.io/gestor-presupuestos/
    echo.
    echo ⏱️  Espera 1-2 minutos para ver los cambios
    echo.
    echo 📋 CAMBIOS APLICADOS:
    echo    ✓ Doctora a la derecha del título
    echo    ✓ Espaciados mejorados
    echo    ✓ Tabla sin bordes
    echo    ✓ Diseño más limpio
    echo.
) else (
    echo.
    echo ❌ Hubo un error al subir los cambios
    echo.
)

pause

