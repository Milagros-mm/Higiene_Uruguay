@echo off
chcp 65001 > nul
title Explorador de Base de Datos - Higiene Uruguay
echo ========================================================
echo   EXPLORADOR DE BASE DE DATOS LOCAL - HIGIENE URUGUAY
echo ========================================================
echo.

set DB_USER=agc_guest
set DB_PASS=guest
set DB_NAME=agc_sql_datosges
set OUTPUT_FILE=%~dp0reporte_base_de_datos.txt

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
echo   REPORTE DE BASE DE DATOS - HIGIENE URUGUAY             >> "%OUTPUT_FILE%"
echo   Fecha y Hora: %date% %time%                            >> "%OUTPUT_FILE%"
echo   Base de Datos: %DB_NAME%                               >> "%OUTPUT_FILE%"
echo ======================================================== >> "%OUTPUT_FILE%"
echo. >> "%OUTPUT_FILE%"

echo --- 1. TODAS LAS TABLAS EN %DB_NAME% --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SHOW TABLES;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 2. TABLAS RELEVANTES (ARTICULO, STOCK, PRECIO, RUBRO) --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SHOW TABLES LIKE '%%articulo%%'; SHOW TABLES LIKE '%%stock%%'; SHOW TABLES LIKE '%%precio%%'; SHOW TABLES LIKE '%%rubro%%';" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 3. TOTAL DE ARTICULOS EN Stock_Articulo --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SELECT COUNT(*) AS total_articulos FROM Stock_Articulo;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 4. ESTRUCTURA DE LA TABLA Stock_Articulo (COLUMNAS Y TIPOS) --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "DESCRIBE Stock_Articulo;" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

echo --- 5. MUESTRA DE 10 REGISTROS DE Stock_Articulo --- >> "%OUTPUT_FILE%"
%MYSQL_BIN% -u %DB_USER% -p%DB_PASS% -D %DB_NAME% -e "SELECT * FROM Stock_Articulo LIMIT 10\G" >> "%OUTPUT_FILE%" 2>&1
echo. >> "%OUTPUT_FILE%"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al ejecutar la consulta.
    echo Revisa el contenido de reporte_base_de_datos.txt para ver el mensaje de error.
) else (
    echo.
    echo ========================================================
    echo   EXITO: El reporte se genero correctamente.
    echo ========================================================
    echo Archivo generado: reporte_base_de_datos.txt
    echo Puedes copiar ese archivo y guardarlo en tu pendrive o enviartelo.
)

echo.
pause
