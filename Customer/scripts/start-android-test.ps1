$ErrorActionPreference = 'Stop'
$taskSdk = Join-Path $env:LOCALAPPDATA 'Android\sdk'
$taskAdb = Join-Path $taskSdk 'platform-tools\adb.exe'
$taskEmulator = Join-Path $taskSdk 'emulator\emulator.exe'
$taskDevice = 'emulator-5556'

# Windows PowerShell treats ADB's temporary startup stderr as an error record.
# Keep probing until the emulator is online rather than aborting at first boot.
function Get-TaskAdbOutput {
    param([string[]]$AdbArguments)
    $ErrorActionPreference = 'SilentlyContinue'
    $taskOutput = & $taskAdb @AdbArguments 2>$null
    if ($LASTEXITCODE -eq 0) { $taskOutput }
}

$taskDevices = Get-TaskAdbOutput -AdbArguments @('devices')
if (-not ($taskDevices -match '^emulator-5556\s')) {
    Start-Process -FilePath $taskEmulator -ArgumentList '-avd', 'ELEE_Test_12GB', '-port', '5556', '-no-snapshot' -WindowStyle Hidden
}

Write-Host 'Waiting for ELEE_Test_12GB...'
$taskDeadline = (Get-Date).AddMinutes(3)
do {
    $taskBoot = Get-TaskAdbOutput -AdbArguments @('-s', $taskDevice, 'shell', 'getprop', 'sys.boot_completed')
    if ($taskBoot -match '1') { break }
    Start-Sleep -Seconds 2
} while ((Get-Date) -lt $taskDeadline)
if ($taskBoot -notmatch '1') { throw 'Emulator did not finish booting. Check Android Studio Device Manager.' }

Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    & flutter run -d $taskDevice @args
} finally {
    Pop-Location
}
