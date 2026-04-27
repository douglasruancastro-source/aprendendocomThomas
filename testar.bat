@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

echo ============================================
echo  EducaTche - Mundo das Tres Ilhas
echo ============================================
echo.

if not exist "node_modules" (
    echo [info] node_modules nao encontrado, rodando npm install...
    call npm install
    if errorlevel 1 (
        echo [erro] npm install falhou. Saindo.
        pause
        exit /b 1
    )
)

echo Escolha o que rodar:
echo   1. Dev server  (http://localhost:3456)
echo   2. Unit tests  (vitest)
echo   3. E2E tests   (playwright)
echo   4. Sair
echo.
set /p OPCAO="Opcao [1]: "
if "%OPCAO%"=="" set OPCAO=1

if "%OPCAO%"=="1" goto dev
if "%OPCAO%"=="2" goto unit
if "%OPCAO%"=="3" goto e2e
if "%OPCAO%"=="4" exit /b 0

echo Opcao invalida.
pause
exit /b 1

:dev
echo.
echo [dev] Iniciando servidor em http://localhost:3456
echo [dev] Ctrl+C para parar.
start "" "http://localhost:3456"
call npm run dev
goto fim

:unit
echo.
echo [test] Rodando vitest...
call npm run test
goto fim

:e2e
echo.
echo [e2e] Rodando playwright...
call npm run test:e2e
goto fim

:fim
echo.
pause
endlocal
