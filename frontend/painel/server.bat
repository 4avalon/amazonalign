@echo off
title Iniciando Servidores...

:: Abre o primeiro servidor em uma nova aba do PowerShell
start powershell -NoExit -Command "cd 'C:\4Avalon\Projetos\amazonalign\backend'; node server.js"

:: Aguarda um pouco para evitar conflitos
timeout /t 2 /nobreak >nul

:: Abre o segundo servidor em outra nova aba do PowerShell
start powershell -NoExit -Command "cd 'C:\4Avalon\Projetos\avamap\backend'; node server.js"

echo Servidores iniciados!
exit
