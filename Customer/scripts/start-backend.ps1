param([string]$LanIp = '192.168.1.52', [int]$Port = 8000)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Join-Path (Split-Path -Parent $PSScriptRoot) 'backend')
$env:FRONTEND_ORIGINS = "http://localhost:5173,http://localhost:3000,http://localhost:8080,http://${LanIp}:8080"
Write-Host 'Start MySQL in XAMPP first. Staff accounts are created with php artisan elee:create-staff.'
& php artisan serve --host=0.0.0.0 --port=$Port
