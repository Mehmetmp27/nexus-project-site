@echo off
title NEXUS-v2 Site Guncelleme ve Canliya Alma
color 0B
chcp 65001 >nul

echo =======================================================
echo    NEXUS-v2 SITE GUNCELLEME VE CANLIYA ALMA ARACI
echo =======================================================
echo.
cd /d "%~dp0"

echo Guncellemeler GitHub Pages'e gonderiliyor...
echo.

git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo  [BASARILI] NEXUS-v2 Sitesi Basariyla GitHub'a Yuklendi!
    echo =======================================================
    echo https://mehmetmp27.github.io/nexus-project-site/
    timeout /t 2 >nul
    start https://mehmetmp27.github.io/nexus-project-site/
) else (
    echo.
    echo [HATA / BEKLEME] Giris onayini kontrol ediniz.
)

pause
