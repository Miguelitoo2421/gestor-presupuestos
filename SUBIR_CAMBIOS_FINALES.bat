@echo off
chcp 65001 >nul
title Subir Cambios Finales a GitHub

:: Ir a la carpeta del script
cd /d "%~dp0"

echo.
echo ========================================
echo   SUBIR CAMBIOS FINALES
echo   Gestor de Presupuestos Odontológicos
echo ========================================
echo.
echo ⬆️  Subiendo todos los cambios a GitHub...
echo.

:: Agregar, commitear y pushear
git add .
git commit -m "Ajustes finales: Franjas negras, logo, montos ajustados y sin líneas"
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
    echo 📋 AJUSTES FINALES APLICADOS:
    echo    ✓ Encabezado con fondo negro y texto blanco
    echo    ✓ Logo integrado
    echo    ✓ Líneas divisorias eliminadas
    echo    ✓ Espacios aumentados entre secciones
    echo    ✓ Totales ajustados y visibles
    echo    ✓ Franja negra solo en "Importe total"
    echo.
    echo 🎉 PROYECTO COMPLETADO
    echo.
) else (
    echo.
    echo ❌ Hubo un error al subir los cambios
    echo.
)

pause

