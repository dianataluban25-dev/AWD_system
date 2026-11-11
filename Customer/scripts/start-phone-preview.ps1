param(
    [string]$LanIp = '192.168.1.52',
    [int]$Port = 8080,
    [string]$ApiUrl = '',
    [switch]$SkipBuild
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
if (-not $SkipBuild) {
    $buildArgs = @('build', 'web', '--no-pub', '--no-web-resources-cdn', '--no-wasm-dry-run')
    if ($ApiUrl) { $buildArgs += "--dart-define=API_BASE_URL=$ApiUrl" }
    & flutter @buildArgs
    if ($LASTEXITCODE -ne 0) { throw 'Flutter build failed.' }
}
if (-not (Test-Path -LiteralPath "$projectRoot/build/web/index.html")) { throw 'Build the website first.' }
$previewUrl = "http://${LanIp}:$Port"
& dart run tool/generate_preview_qr.dart $previewUrl docs/phone-preview-qr
if ($LASTEXITCODE -ne 0) { throw 'QR generation failed.' }
$bundledPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$pythonCommand = if (Test-Path -LiteralPath $bundledPython) { $bundledPython } else { 'python' }
& $pythonCommand -c 'from PIL import Image; im=Image.open("docs/phone-preview-qr.pgm"); im.resize((660,660), Image.Resampling.NEAREST).save("docs/phone-preview-qr.png")'
Write-Host "Phone preview: $previewUrl"
Write-Host 'Use the same Wi-Fi. Keep this terminal open. QR: docs/phone-preview-qr.png'
& $pythonCommand -m http.server $Port --bind 0.0.0.0 --directory "$projectRoot/build/web"
