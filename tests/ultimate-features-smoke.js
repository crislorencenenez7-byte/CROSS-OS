const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "frontend/index.html"), "utf8");
const core = fs.readFileSync(path.join(root, "frontend/js/cross-os.js"), "utf8");
const ultimate = fs.readFileSync(path.join(root, "frontend/js/system/ultimate.js"), "utf8");
const css = fs.readFileSync(path.join(root, "frontend/css/desktop.css"), "utf8");
const checks = [
  ["Ultimate module is loaded", html.includes("js/system/ultimate.js")],
  ["App registration extension exists", core.includes("registerApp(id, definition)")],
  ["Control Center", ultimate.includes("CROSS Control Center")],
  ["Offline AI Assistant", ultimate.includes("CROSS AI Assistant")],
  ["Safe backup export only", ultimate.includes("backupExport()") && !ultimate.includes("backupImport(f)")],
  ["Tabbed project workspace", ultimate.includes("studio-tabs") && ultimate.includes("newTab()")],
  ["Advanced themes and scaling", ultimate.includes("theme(v)") && ultimate.includes("scale(v)")],
  ["Wallpaper controls", ultimate.includes("wallpaper(v)")],
  ["Wi-Fi and Bluetooth simulation", ultimate.includes("Wi-Fi") && ultimate.includes("Bluetooth")],
  ["Lock screen and profiles", ultimate.includes("lock()") && ultimate.includes("switchProfile(i)")],
  ["System Monitor", ultimate.includes("System Monitor") && ultimate.includes("refreshMonitor()")],
  ["Virtual desktop slots", ultimate.includes("switchDesktop") && css.includes(".desktop-switcher")],
  ["Mobile responsive styling", css.includes("@media(max-width:700px)")],
  ["CROSS Store marketplace", ultimate.includes("CROSS Store") && ultimate.includes("storeCards")],
  ["CROSS Publisher workflow", ultimate.includes("CROSS Publisher") && ultimate.includes("publish()")],
  ["Studio publish action", ultimate.includes("Publish to Store")],
  ["Sandboxed installed apps", ultimate.includes("installed-app-frame") && ultimate.includes("sandbox=\"allow-scripts\"")],
  ["Install, update and uninstall", ultimate.includes("install(id)") && ultimate.includes("update(id)") && ultimate.includes("uninstall(id)")],
  ["Risky backup import disabled", !ultimate.includes("backupImport(f)") && !ultimate.includes("Import backup JSON")],
  ["App unregister support", core.includes("unregisterApp(id)")],
  ["Portable app package import/export", ultimate.includes("importPackage(file)") && ultimate.includes("cross-app-package.json")],
  ["Project CSS/JS bundling", ultimate.includes("bundleProject") && ultimate.includes("escapeRegExp")],
  ["Store desktop shortcut", html.includes("CrossOS.open('store')")],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
