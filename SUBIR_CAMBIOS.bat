@echo off
chcp 65001 >nul
title Subir Cambios a GitHub

echo.
echo ========================================
echo   SUBIR CAMBIOS A GITHUB
echo   Gestor de Presupuestos Odontológicos
echo ========================================
echo.

:: Ir a la carpeta del script
cd /d "%~dp0"

echo Verificando cambios...
echo.

:: Verificar si hay cambios
git status

echo.
echo ========================================
echo.

:: Preguntar si quiere continuar
set /p continuar="¿Desea subir estos cambios a GitHub? (S/N): "

if /i "%continuar%" NEQ "S" (
    echo.
    echo Operación cancelada.
    echo.
    pause
    exit /b
)

echo.
echo Agregando archivos...
git add .

echo.
echo Creando commit...
set /p mensaje="Ingrese un mensaje para el commit (Enter para usar mensaje por defecto): "

if "%mensaje%"=="" (
    set mensaje=Actualización de presupuestos
)

git commit -m "%mensaje%"

echo.
echo Subiendo cambios a GitHub...
git push

echo.
echo ========================================
echo   ¡CAMBIOS SUBIDOS CORRECTAMENTE!
echo ========================================
echo.
echo Los cambios estarán disponibles en:
echo https://miguelitoo2421.github.io/gestor-presupuestos/
echo.
echo (Espera 1-2 minutos para ver los cambios reflejados)
echo.

pause

