@echo off
echo Iniciando sincronizacion con Apollo GesCom...
cd %~dp0
npx tsx scripts/sync-apollo.ts
pause