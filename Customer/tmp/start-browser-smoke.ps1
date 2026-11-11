$ErrorActionPreference = 'Stop'
$taskDb = Join-Path $PSScriptRoot ('browser-smoke-' + [Guid]::NewGuid().ToString('N') + '.sqlite')
New-Item -ItemType File -Path $taskDb | Out-Null
$env:DB_CONNECTION = 'sqlite'
$env:DB_DATABASE = $taskDb
Set-Content -LiteralPath (Join-Path $PSScriptRoot 'auto-smoke-db.txt') -Value $taskDb
$env:DB_URL = ''
$env:APP_ENV = 'testing'
$env:APP_DEBUG = 'false'
$OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Set-Location (Join-Path (Split-Path $PSScriptRoot -Parent) 'backend')
& php artisan migrate --force --quiet
if ($LASTEXITCODE -ne 0) { throw 'Test migration failed.' }
'Browser-test-only-12345' | & php artisan elee:create-staff browser-test@example.test --name=BrowserTest --admin --password-stdin
if ($LASTEXITCODE -ne 0) { throw 'Test account creation failed.' }
& php (Join-Path $PSScriptRoot 'create-auto-smoke-product.php')
& php artisan serve --host=127.0.0.1 --port=8001
