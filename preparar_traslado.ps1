# ============================================
# SPGCU System - Script de Preparación para Traslado
# ============================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SPGCU - Preparación para Traslado" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$outputDir = [Environment]::GetFolderPath("Desktop")
$zipName = "spgcu_system_traslado_$timestamp.zip"
$zipPath = Join-Path $outputDir $zipName
$dbBackupName = "spgcu_backup_$timestamp.sql"
$dbBackupPath = Join-Path $outputDir $dbBackupName

Write-Host "[INFO] Directorio del proyecto: $projectPath" -ForegroundColor Gray
Write-Host "[INFO] Archivo ZIP se guardará en: $zipPath" -ForegroundColor Gray
Write-Host ""

# ============================================
# PASO 1: Exportar Base de Datos (opcional)
# ============================================
Write-Host "[PASO 1/3] Exportar Base de Datos" -ForegroundColor Yellow
Write-Host "-----------------------------------------"

$exportDB = Read-Host "¿Desea exportar la base de datos? (S/N)"

if ($exportDB -eq "S" -or $exportDB -eq "s") {
    $dbName = Read-Host "Nombre de la base de datos (ej: spgcu_db)"
    $dbUser = Read-Host "Usuario MySQL (ej: root)"
    $dbPass = Read-Host "Contraseña MySQL" -AsSecureString
    $dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass))
    
    Write-Host ""
    Write-Host "[...] Exportando base de datos..." -ForegroundColor Cyan
    
    try {
        if ($dbPassPlain) {
            & mysqldump -u $dbUser -p"$dbPassPlain" $dbName > $dbBackupPath 2>$null
        } else {
            & mysqldump -u $dbUser $dbName > $dbBackupPath 2>$null
        }
        
        if (Test-Path $dbBackupPath) {
            $dbSize = (Get-Item $dbBackupPath).Length / 1MB
            Write-Host "[OK] Base de datos exportada: $dbBackupPath ($([math]::Round($dbSize, 2)) MB)" -ForegroundColor Green
        } else {
            Write-Host "[WARN] No se pudo exportar la base de datos. Continúe manualmente." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[WARN] Error al exportar BD: $_" -ForegroundColor Yellow
        Write-Host "[WARN] Puede exportar manualmente después." -ForegroundColor Yellow
    }
} else {
    Write-Host "[SKIP] Omitiendo exportación de base de datos." -ForegroundColor Gray
}

Write-Host ""

# ============================================
# PASO 2: Crear carpeta temporal sin node_modules/vendor
# ============================================
Write-Host "[PASO 2/3] Preparando archivos..." -ForegroundColor Yellow
Write-Host "-----------------------------------------"

$tempDir = Join-Path $env:TEMP "spgcu_traslado_temp"

# Limpiar temp si existe
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

Write-Host "[...] Copiando archivos (excluyendo node_modules y vendor)..." -ForegroundColor Cyan

# Crear lista de exclusiones
$excludeDirs = @("node_modules", "vendor", ".git")

# Copiar archivos excluyendo carpetas grandes
$sourceItems = Get-ChildItem -Path $projectPath -Force | Where-Object { 
    $_.Name -notin $excludeDirs 
}

New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

foreach ($item in $sourceItems) {
    $dest = Join-Path $tempDir $item.Name
    if ($item.PSIsContainer) {
        Copy-Item -Path $item.FullName -Destination $dest -Recurse -Force
    } else {
        Copy-Item -Path $item.FullName -Destination $dest -Force
    }
}

# Contar archivos copiados
$fileCount = (Get-ChildItem -Path $tempDir -Recurse -File).Count
Write-Host "[OK] $fileCount archivos copiados" -ForegroundColor Green

Write-Host ""

# ============================================
# PASO 3: Crear archivo ZIP
# ============================================
Write-Host "[PASO 3/3] Creando archivo ZIP..." -ForegroundColor Yellow
Write-Host "-----------------------------------------"

Write-Host "[...] Comprimiendo archivos..." -ForegroundColor Cyan

try {
    # Eliminar ZIP anterior si existe
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -CompressionLevel Optimal
    
    $zipSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "[OK] ZIP creado: $zipPath" -ForegroundColor Green
    Write-Host "[OK] Tamaño: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al crear ZIP: $_" -ForegroundColor Red
    exit 1
}

# Limpiar carpeta temporal
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  ¡TRASLADO PREPARADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Archivos generados en el Escritorio:" -ForegroundColor White
Write-Host "  [ZIP] $zipName" -ForegroundColor Cyan

if ($exportDB -eq "S" -or $exportDB -eq "s") {
    Write-Host "  [SQL] $dbBackupName" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "PRÓXIMOS PASOS en la nueva computadora:" -ForegroundColor Yellow
Write-Host "  1. Descomprimir el ZIP" -ForegroundColor White
Write-Host "  2. Ejecutar: composer install" -ForegroundColor White
Write-Host "  3. Ejecutar: npm install" -ForegroundColor White
Write-Host "  4. Copiar .env.example a .env y configurar BD" -ForegroundColor White
Write-Host "  5. Ejecutar: php artisan key:generate" -ForegroundColor White
Write-Host "  6. Importar BD: mysql -u root -p spgcu_db < $dbBackupName" -ForegroundColor White
Write-Host "  7. Ejecutar: start_system.bat" -ForegroundColor White
Write-Host ""
Write-Host "Consulta GUIA_TRASLADO.md para más detalles." -ForegroundColor Gray
Write-Host ""

# Abrir carpeta del escritorio
$openFolder = Read-Host "¿Abrir carpeta con los archivos? (S/N)"
if ($openFolder -eq "S" -or $openFolder -eq "s") {
    Start-Process explorer.exe -ArgumentList $outputDir
}

Write-Host ""
Write-Host "Presione cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
