param([string]$Email = 'admin@elee.test', [switch]$ResetPassword, [switch]$GeneratePassword)
$ErrorActionPreference = 'Stop'
Push-Location (Join-Path (Split-Path -Parent $PSScriptRoot) 'backend')
try {
    if (-not $ResetPassword) { $taskAdminName = Read-Host 'Admin name' }
    if ($GeneratePassword) {
        $taskRandomBytes = New-Object byte[] 16
        $taskRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
        try { $taskRandom.GetBytes($taskRandomBytes) } finally { $taskRandom.Dispose() }
        $taskGeneratedPassword = [BitConverter]::ToString($taskRandomBytes).Replace('-', '').ToLowerInvariant()
        $taskSecurePassword = ConvertTo-SecureString $taskGeneratedPassword -AsPlainText -Force
        $taskConfirmPassword = ConvertTo-SecureString $taskGeneratedPassword -AsPlainText -Force
    } else {
        Write-Host 'Type your password, then press Enter. Characters are hidden.'
        $taskSecurePassword = Read-Host 'Password (12+ characters)' -AsSecureString
        $taskConfirmPassword = Read-Host 'Confirm password' -AsSecureString
    }
    $taskPasswordPointer = [IntPtr]::Zero
    $taskConfirmPointer = [IntPtr]::Zero
    $taskOldEncoding = $OutputEncoding
    try {
        $OutputEncoding = New-Object System.Text.UTF8Encoding($false)
        $taskPasswordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskSecurePassword)
        $taskPlainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskPasswordPointer)
        $taskConfirmPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskConfirmPassword)
        $taskPlainConfirm = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskConfirmPointer)
        if ($taskPlainPassword -cne $taskPlainConfirm) { throw 'Passwords do not match. Run the command again.' }
        if ($ResetPassword) {
            $taskPlainPassword | & php artisan elee:reset-admin-password $Email --password-stdin
        } else {
            $taskPlainPassword | & php artisan elee:create-staff $Email "--name=$taskAdminName" --admin --password-stdin
        }
        if ($LASTEXITCODE -ne 0) { throw 'Account update failed. Review the validation message above.' }
        $taskPlainPassword | & php artisan elee:verify-admin-login $Email --password-stdin
        if ($LASTEXITCODE -ne 0) { throw 'Password was saved but login verification did not succeed. Review the message above.' }
        if ($GeneratePassword) {
            Write-Host 'Copy the following password into the admin sign-in page (do not share it):'
            Write-Host $taskGeneratedPassword
        }
    } finally {
        $taskPlainPassword = $null
        $taskPlainConfirm = $null
        $taskGeneratedPassword = $null
        if ($taskPasswordPointer -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskPasswordPointer)
        }
        if ($taskConfirmPointer -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskConfirmPointer)
        }
        $taskSecurePassword.Dispose()
        $taskConfirmPassword.Dispose()
        $OutputEncoding = $taskOldEncoding
    }
    if ($LASTEXITCODE -ne 0) { throw 'Account creation failed. Review the validation message above.' }
} finally { Pop-Location }
