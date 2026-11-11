# Development emulator storage

## Current fix

A separate AVD named `ELEE_Test_12GB` was created with a 12 GB data partition.
The old `Medium_Phone` AVD and its data were preserved. Its temporary storage
reserve override was removed because it did not reliably fix repeated updates.

Run from the project directory:

```powershell
.\scripts\start-android-test.ps1
```

The script selects the new emulator on port 5556 rather than the nearly full old
emulator on port 5554. The new emulator starts with empty local receipts.
First APK installation and a second in-place update both returned `Success`.
The app launched successfully; the new data partition still had 11 GB free.

## Earlier temporary workaround

On 2026-10-14, emulator-5554 (Medium_Phone) had a 6 GB data partition with
469 MB free. Updating the debug APK failed with INSTALL_FAILED_INSUFFICIENT_STORAGE.
Cache trimming did not reclaim meaningful space.

Temporary emulator-only workaround applied:

```powershell
& "$env:LOCALAPPDATA\Android\sdk\platform-tools\adb.exe" -s emulator-5554 shell settings put global sys_storage_threshold_max_bytes 268435456
```

This sets the low-storage reserve to 256 MB. It does not increase capacity.
The existing APK was successfully installed with `adb install -r -t`, without
uninstalling the application or clearing its saved data.

Restore the default reserve after increasing emulator capacity:

```powershell
& "$env:LOCALAPPDATA\Android\sdk\platform-tools\adb.exe" -s emulator-5554 shell settings delete global sys_storage_threshold_max_bytes
```

For a lasting fix, use a development AVD with at least 12 GB internal storage.
Do not wipe the existing AVD without backing up any needed app data.
This setting is only for the local test emulator, not customer devices.
