window.CrossApps = window.CrossApps || {};

CrossApps.settings = {
  title: "Settings",
  icon: "⚙️",
  render: () => `
    <div class="settings-layout">
      <aside class="settings-sidebar">
        <div class="settings-profile">
          <div class="settings-avatar">C</div>
          <div><b>CROSS User</b><small>Local account</small></div>
        </div>
        <div class="settings-search">⌕　Find a setting</div>
        <div class="settings-nav active">⚙　System</div>
        <div class="settings-nav">▣　Bluetooth & devices</div>
        <div class="settings-nav">◉　Network & internet</div>
        <div class="settings-nav">🎨　Personalization</div>
        <div class="settings-nav">♧　Apps</div>
        <div class="settings-nav">♙　Accounts</div>
        <div class="settings-nav">♧　Accessibility</div>
        <div class="settings-nav">ⓘ　About</div>
      </aside>
      <main class="settings-main">
        <small class="settings-breadcrumb">SETTINGS　›　PERSONALIZATION</small>
        <h1>Personalization</h1>
        <p>Make CROSS OS feel like your own.</p>
        <section class="settings-card">
          <div class="settings-card-icon">🎨</div>
          <div class="settings-card-content">
            <h3>Accent color</h3>
            <p>Choose the color used across the interface.</p>
            <div class="color-options">
              ${["#60a5fa","#8b5cf6","#22c55e","#f59e0b","#ec4899","#f1f5f9"].map(c =>
                `<button style="background:${c}" onclick="setCrossAccent('${c}')" aria-label="${c}"></button>`
              ).join("")}
            </div>
            <input type="color" value="${localStorage.getItem("cross-accent") || "#60a5fa"}" onchange="setCrossAccent(this.value)">
          </div>
        </section>
        <section class="settings-card">
          <div class="settings-card-icon">🖼️</div>
          <div class="settings-card-content">
            <h3>Background</h3>
            <p>Choose your desktop appearance.</p>
            <div class="wallpaper-options">
              <button onclick="setCrossWallpaper('blue')"><span class="wall-preview blue-preview"></span>Blue</button>
              <button onclick="setCrossWallpaper('purple')"><span class="wall-preview purple-preview"></span>Purple</button>
              <button onclick="setCrossWallpaper('dark')"><span class="wall-preview dark-preview"></span>Midnight</button>
            </div>
          </div>
        </section>
        <section class="settings-card">
          <div class="settings-card-icon">🌙</div>
          <div class="settings-card-content">
            <h3>Appearance</h3>
            <p>CROSS OS interface theme.</p>
            <select onchange="setCrossTheme(this.value)">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </section>
        <section class="settings-card">
          <div class="settings-card-icon">ℹ️</div>
          <div class="settings-card-content">
            <h3>About CROSS OS</h3>
            <p>Version 1.1 • Web Desktop Simulator</p>
          </div>
        </section>
      </main>
    </div>`
};

window.setCrossAccent = function(color) {
  localStorage.setItem("cross-accent", color);
  document.documentElement.style.setProperty("--accent", color);
};

window.setCrossWallpaper = function(value) {
  localStorage.setItem("cross-wallpaper", value);
  document.body.dataset.wallpaper = value;
};

window.setCrossTheme = function(value) {
  localStorage.setItem("cross-theme", value);
  document.body.dataset.theme = value;
};
