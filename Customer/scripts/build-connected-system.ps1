$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskAdmin = Join-Path $taskRoot 'admin-web\ADMINSIDE\HAKDOG'
Push-Location $taskAdmin
try {
    if (-not (Test-Path 'node_modules\vite')) {
        & npm.cmd ci --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw 'Admin dependency installation failed.' }
    }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Admin build failed.' }
} finally { Pop-Location }

Push-Location $taskRoot
try {
    & flutter build web --no-pub --no-web-resources-cdn --no-wasm-dry-run --base-href=/customer/
    if ($LASTEXITCODE -ne 0) { throw 'Customer web build failed.' }
    $taskDestination = Join-Path $taskRoot 'backend\public\customer'
    New-Item -ItemType Directory -Path $taskDestination -Force | Out-Null
    Copy-Item -Path (Join-Path $taskRoot 'build\web\*') -Destination $taskDestination -Recurse -Force
    Write-Host 'Admin and customer builds are ready in the shared backend.'
} finally { Pop-Location }
