window.CrossWindow = window.CrossWindow || {};
let crossZ = 20;

window.openWindow = function(id, title, icon, content) {
  let win = document.getElementById("window-" + id);

  if (win) {
    win.classList.remove("minimized");
    win.style.zIndex = ++crossZ;
    return;
  }

  win = document.createElement("section");
  win.className = "window app-fullscreen";
  win.id = "window-" + id;
  win.style.zIndex = ++crossZ;

  win.innerHTML = `
    <div class="window-header">
      <div class="window-title">
        <span class="window-title-icon">${icon}</span>
        <span>${title}</span>
        <span class="window-title-sub">CROSS OS</span>
      </div>
      <div class="window-controls">
        <button title="Minimize" onclick="minimizeWindow('${id}')">−</button>
        <button title="Restore / Maximize" onclick="maximizeWindow('${id}')">□</button>
        <button title="Close" onclick="closeWindow('${id}')">×</button>
      </div>
    </div>
    <div class="window-content">${content}</div>
  `;

  document.getElementById("window-area").appendChild(win);
  win.addEventListener("pointerdown", () => win.style.zIndex = ++crossZ);
  addTaskApp(id, title, icon);
};

window.closeWindow = function(id) {
  document.getElementById("window-" + id)?.remove();
  document.getElementById("task-" + id)?.remove();
};

window.minimizeWindow = function(id) {
  document.getElementById("window-" + id)?.classList.add("minimized");
};

window.maximizeWindow = function(id) {
  const win = document.getElementById("window-" + id);
  if (!win) return;
  win.classList.toggle("app-fullscreen");
  win.classList.toggle("window-restored");
};

window.addTaskApp = function(id, title, icon) {
  const task = document.getElementById("task-apps");
  if (!task || document.getElementById("task-" + id)) return;

  const button = document.createElement("button");
  button.id = "task-" + id;
  button.className = "task-app";
  button.textContent = icon + " " + title;
  button.onclick = () => {
    const win = document.getElementById("window-" + id);
    if (!win) return;
    win.classList.remove("minimized");
    win.style.zIndex = ++crossZ;
  };
  task.appendChild(button);
};
