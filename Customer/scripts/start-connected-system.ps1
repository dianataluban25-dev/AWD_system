param([int]$Port = 8000, [string]$AdminEmail = 'admin@elee.test')
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $taskRoot 'backend\public\admin-assets\index.html')) -or
    -not (Test-Path (Join-Path $taskRoot 'backend\public\customer\index.html'))) {
    throw 'Build first: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-connected-system.ps1'
}
Push-Location (Join-Path $taskRoot 'backend')
try {
    & php artisan migrate --force
    if ($LASTEXITCODE -ne 0) { throw 'Start MySQL in XAMPP and check the backend database configuration.' }
    & php artisan elee:ensure-admin $AdminEmail --check-only
    if ($LASTEXITCODE -eq 2) {
        & (Join-Path $PSScriptRoot 'create-admin.ps1') -Email $AdminEmail
    } elseif ($LASTEXITCODE -ne 0) { throw 'Admin account setup did not complete.' }
    Write-Host "Admin: http://localhost:$Port/admin"
    Write-Host "Customer: http://localhost:$Port/customer/"
    Write-Host 'Local preview only. Phone/QR LAN sharing requires approval before enabling it.'
    $env:APP_DEBUG = 'false'
    & php artisan serve --host=127.0.0.1 --port=$Port
} finally { Pop-Location }
