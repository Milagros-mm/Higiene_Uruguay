@echo off
chcp 65001 > nul
title Explorador de Rubros, Subrubros y Marcas - GesCom / Apollo
echo ========================================================
echo   EXPLORADOR DE RUBROS Y MARCAS - GESCOM / APOLLO
echo ========================================================
echo.

set DB_USER=agc_guest
set DB_PASS=guest
set DB_NAME=agc_sql_datosges
set OUTPUT_FILE=%~dp0reporte_rubros_marcas.txt

:: 1. Buscar mysql.exe
set MYSQL_BIN=mysql.exe
where mysql.exe >nul 2>nul
if %errorlevel%==0 goto RUN_QUERY

:: Buscar en rutas tipicas de instalacion de MySQL en Windows
for /d %%d in ("C:\Program Files\MySQL\MySQL Server *") do (
    if exist "%%d\bin\mysql.exe" set MYSQL_BIN="%%d\bin\mysql.exe" & goto RUN_QUERY
)
for /d %%d in ("C:\Program Files (x86)\MySQL\MySQL Server *") do (
    if exist "%%d\bin\mysql.exe" set MYSQL_BIN="%%d\bin\mysql.exe" & goto RUN_QUERY
)
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_BIN="C:\xampp\mysql\bin\mysql.exe" & goto RUN_QUERY
if exist "C:\wamp64\bin\mysql\mysql*\bin\mysql.exe" set MYSQL_BIN="C:\wamp64\bin\mysql\mysql*\bin\mysql.exe" & goto RUN_QUERY
if exist "C:\laragon\bin\mysql\mysql*\bin\mysql.exe" set MYSQL_BIN="C:\laragon\bin\mysql\mysql*\bin\mysql.exe" & goto RUN_QUERY

echo [AVISO] No se encontro mysql.exe en el PATH ni en las rutas estandar.
echo Si conoces la carpeta donde esta instalado MySQL, ingresa la ruta completa a mysql.exe.
echo (Ejemplo: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe)
set /p MYSQL_BIN="Ruta a mysql.exe (o presiona Enter para intentar usar mysql directo): "
if "%MYSQL_BIN%"=="" set MYSQL_BIN=mysql.exe

:RUN_QUERY
echo Conectando a la base de datos %DB_NAME% con usuario %DB_USER%...
echo Generando reporte en: %OUTPUT_FILE%
echo.

echo ======================================================== > "%OUTPUT_FILE%"
echo   REPORTE DE RUBROS, SUBRUBROS Y MARCAS - GESCOM/APOLLO   >> "%OUTPUT_FILE%"
echo   Fecha y Hora: %date% %time%                            >> "%OUTPUT_FILE%"
echo   Base de Datos: %DB_NAME%                               >> "%OUTPUT_FILE%"
echo ======================================================== >> "%OUTPUT_FILE%"
echo. >> "%OUTPUT_FILE%"

echo --- 1. PERMISOS DEL USUARIO (SHOW GRANTS) --- >> "%OUTPUT_FILE%"
echo (Si aqui no aparece SELECT en Stock_Rubros/Marcas, Heidi no las mostrara) >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "SHOW GRANTS FOR CURRENT_USER();" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 2. TABLAS EXISTENTES RELACIONADAS CON RUBROS Y MARCAS --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "SHOW TABLES LIKE '%%rubro%%'; SHOW TABLES LIKE '%%marca%%'; SHOW TABLES LIKE '%%sub%%';" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 3. ESTRUCTURA Y MUESTRA DE Stock_Rubros --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "DESCRIBE Stock_Rubros; SELECT * FROM Stock_Rubros LIMIT 10;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 4. ESTRUCTURA Y MUESTRA DE Stock_SubRubro --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "DESCRIBE Stock_SubRubro; SELECT * FROM Stock_SubRubro LIMIT 10;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 5. ESTRUCTURA Y MUESTRA DE Stock_Marcas --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "DESCRIBE Stock_Marcas; SELECT * FROM Stock_Marcas LIMIT 10;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 6. ASIGNACIÓN DE RUBROS Y MARCAS EN Stock_Articulo --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "SELECT COUNT(*) AS TotalArticulos, SUM(CASE WHEN ARub IS NOT NULL AND TRIM(ARub) != '' THEN 1 ELSE 0 END) AS ConRubro, SUM(CASE WHEN ASub IS NOT NULL AND TRIM(ASub) != '' THEN 1 ELSE 0 END) AS ConSubrubro, SUM(CASE WHEN AMar IS NOT NULL AND TRIM(AMar) != '' THEN 1 ELSE 0 END) AS ConMarca FROM Stock_Articulo;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 7. MUESTRA DE ARTÍCULOS CON SUS NOMBRES DE RUBRO, SUBRUBRO Y MARCA --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -t -e "SELECT sa.ACod AS Sku, sa.ADes AS Producto, sa.ARub AS CodRubro, sr.RDes AS Rubro, sa.ASub AS CodSub, ss.SDes AS Subrubro, sa.AMar AS CodMarca, sm.MDes AS Marca, sa.AExis AS Stock, sa.AVenta AS PrecioBase FROM Stock_Articulo sa LEFT JOIN Stock_Rubros sr ON sa.ARub = sr.RCod LEFT JOIN Stock_SubRubro ss ON sa.ASub = ss.SCod LEFT JOIN Stock_Marcas sm ON sa.AMar = sm.MCod WHERE (sa.ARub IS NOT NULL AND TRIM(sa.ARub) != '') OR (sa.AMar IS NOT NULL AND TRIM(sa.AMar) != '') LIMIT 15;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al ejecutar las consultas.
    echo Revisa el contenido de reporte_rubros_marcas.txt para ver el mensaje de error.
) else (
    echo.
    echo ========================================================
    echo   EXITO: El reporte se genero correctamente.
    echo ========================================================
    echo Archivo generado: reporte_rubros_marcas.txt
    echo Puedes copiar ese archivo y enviartelo.
)

echo.
pause
