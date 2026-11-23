# CROSS OS 2.1.0 — Features

## Desktop simulator
- Desktop workspace, windows, taskbar, Start menu and notifications
- File Explorer, Notepad, Calculator, Clock, Settings and safe simulated Terminal
- Control Center, offline help assistant, local profiles, lock overlay and virtual desktops
- Theme, accent, wallpaper and display scaling controls
- System Monitor with browser-reported hints (not Android process telemetry)

## CROSS Studio
- Multi-tab HTML/CSS/JavaScript project workspace
- Local project saving, JSON project import/export and sandboxed preview
- Publish directly to CROSS Publisher

## CROSS Publisher and CROSS Store
- App metadata: name, category, version, developer, icon and description
- Publish projects to the local Store catalog
- Export/import portable `.json` CROSS app packages
- Browse Home, Apps, Games and My Apps; search and view details
- Install, launch, update and uninstall simulator apps
- Installed apps run in sandboxed iframes (`allow-scripts`, without same-origin access)
- Packages are limited to 20 text files and 700 KB; `index.html` is required

## Data safety
- Backup Manager supports export only; destructive restore/import is disabled
- File Explorer manages only browser-local simulator data and confirms deletes
- Terminal is a safe simulated command interface, not a host shell
- No APK installation, Android settings access, or unrestricted host file access

## Important limitations
- This is a browser-based simulator, not a bootable operating system
- Store publishing is local to the browser; share packages by exporting and importing JSON
- Wi-Fi, Bluetooth, brightness, volume and profiles are simulator-only controls
- Browser sandboxing is not a substitute for a production app-review/security system
