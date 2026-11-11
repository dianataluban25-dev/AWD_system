$ErrorActionPreference = 'Stop'
$taskDbPath = Join-Path $PSScriptRoot ('admin-password-test-' + [Guid]::NewGuid().ToString('N') + '.sqlite')
New-Item -ItemType File -Path $taskDbPath | Out-Null
$env:DB_CONNECTION = 'sqlite'
$env:DB_DATABASE = $taskDbPath
$env:DB_URL = ''
$env:APP_ENV = 'testing'
$env:ELEE_TEST_PASSWORD = 'Pa' + [char]0x00f1 + 'ss-' + [Guid]::NewGuid().ToString('N')
$OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Push-Location (Join-Path (Split-Path -Parent $PSScriptRoot) 'backend')
try {
    & php artisan migrate --force --quiet
    if ($LASTEXITCODE -ne 0) { throw 'Disposable test database migration failed.' }
    $env:ELEE_TEST_PASSWORD | & php artisan elee:create-staff stdin-check@example.test --name=Test --admin --password-stdin
    if ($LASTEXITCODE -ne 0) { throw 'Password stdin account creation failed.' }
    & php (Join-Path $PSScriptRoot 'check-admin-password.php')
    if ($LASTEXITCODE -ne 0) { throw 'Password verification failed.' }
    $env:ELEE_TEST_PASSWORD = 'Reset-' + [Guid]::NewGuid().ToString('N')
    $env:ELEE_TEST_PASSWORD | & php artisan elee:reset-admin-password stdin-check@example.test --password-stdin
    if ($LASTEXITCODE -ne 0) { throw 'Password reset failed.' }
    & php (Join-Path $PSScriptRoot 'check-admin-password.php')
    if ($LASTEXITCODE -ne 0) { throw 'Reset password verification failed.' }
} finally { Pop-Location }
