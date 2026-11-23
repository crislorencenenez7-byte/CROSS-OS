window.CrossApps = window.CrossApps || {};

window.openApp = function(id) {
  const app = CrossApps[id] || (id === "system" ? {
    title: "System Information",
    icon: "💻",
    render: () => `
      <div class="system-page">
        <small>CROSS OS CONTROL CENTER</small>
        <h1>System overview</h1>
        <p>Your CROSS OS environment at a glance.</p>
        <div class="system-cards">
          <div class="system-card"><span>💻</span><small>PLATFORM</small><b>${escapeCross(navigator.platform || "Browser")}</b></div>
          <div class="system-card"><span>🖥️</span><small>SCREEN</small><b>${screen.width} × ${screen.height}</b></div>
          <div class="system-card"><span>🌐</span><small>LANGUAGE</small><b>${escapeCross(navigator.language)}</b></div>
          <div class="system-card"><span>⚙️</span><small>VERSION</small><b>CROSS OS 1.1</b></div>
        </div>
        <section class="system-detail">
          <h3>About this simulator</h3>
          <p>Interface: CROSS Desktop Shell</p>
          <p>Runtime: HTML, CSS and JavaScript</p>
          <p>Storage: Browser local storage</p>
          <p>Host: Python local web server</p>
        </section>
      </div>`
  } : null);

  if (!app) return;
  openWindow(id, app.title, app.icon, app.render());
  document.getElementById("start-menu").classList.add("hidden");
  document.getElementById("quick-panel").classList.add("hidden");
};

window.toggleStart = function() {
  document.getElementById("quick-panel").classList.add("hidden");
  document.getElementById("start-menu").classList.toggle("hidden");
};

window.toggleQuick = function(feature) {
  if (!feature) {
    document.getElementById("start-menu").classList.add("hidden");
    document.getElementById("quick-panel").classList.toggle("hidden");
    return;
  }
  const button = document.querySelector(
    `.quick-grid button[onclick="toggleQuick('${feature}')"]`
  );
  button?.classList.toggle("active");
};

window.searchApps = function(query) {
  const area = document.getElementById("start-apps");
  if (!area) return;

  const entries = Object.entries(CrossApps).concat([
    ["system", {title:"System Info",icon:"💻"}]
  ]);

  area.innerHTML = entries
    .filter(([id, app]) =>
      (app.title + " " + id).toLowerCase().includes(query.toLowerCase())
    )
    .map(([id, app]) =>
      `<button onclick="openApp('${id}')">
        <span style="font-size:27px">${app.icon}</span>
        <span>${escapeCross(app.title)}</span>
      </button>`
    ).join("") || "<p>No apps found.</p>";
};

function updateDesktopClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  if (clock) clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit"
  });

  if (date) date.textContent = now.toLocaleDateString([], {
    month: "2-digit", day: "2-digit", year: "numeric"
  });

  updateBigClock();
}

window.updateBigClock = function() {
  const now = new Date();
  const clock = document.getElementById("big-clock");
  const date = document.getElementById("big-date");
  const zone = document.getElementById("clock-zone-name");
  const day = document.getElementById("clock-day");

  if (clock) clock.textContent = now.toLocaleTimeString();
  if (date) date.textContent = now.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  if (zone) zone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (day) {
    const start = new Date(now.getFullYear(), 0, 0);
    day.textContent = Math.floor((now - start) / 86400000);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  updateDesktopClock();
  setInterval(updateDesktopClock, 1000);
  searchApps("");

  const accent = localStorage.getItem("cross-accent");
  if (accent) document.documentElement.style.setProperty("--accent", accent);

  const wallpaper = localStorage.getItem("cross-wallpaper");
  if (wallpaper) document.body.dataset.wallpaper = wallpaper;

  const theme = localStorage.getItem("cross-theme");
  if (theme) document.body.dataset.theme = theme;
});

/* CROSS OS DISPLAY CONTROLS */

window.enterCrossLandscape = async function() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    if (screen.orientation && screen.orientation.lock) {
      try {
        await screen.orientation.lock("landscape");
      } catch (error) {
        console.info("Landscape lock is not supported by this browser.");
      }
    }
  } catch (error) {
    console.warn("Fullscreen is unavailable:", error);
  }

  document.body.classList.add("cross-desktop-mode");
};

window.exitCrossFullscreen = async function() {
  try {
    if (screen.orientation?.unlock) screen.orientation.unlock();
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch (error) {
    console.warn("Could not exit fullscreen:", error);
  }
};

document.addEventListener("fullscreenchange", () => {
  document.body.classList.toggle(
    "cross-fullscreen",
    Boolean(document.fullscreenElement)
  );
});

window.addEventListener("orientationchange", () => {
  document.body.classList.toggle(
    "cross-landscape",
    window.innerWidth > window.innerHeight
  );
});

window.addEventListener("resize", () => {
  document.body.classList.toggle(
    "cross-landscape",
    window.innerWidth > window.innerHeight
  );
});
