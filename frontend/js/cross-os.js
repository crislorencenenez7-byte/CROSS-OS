"use strict";

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);

  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  const writeJSON = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const apps = {
    explorer: { name:"File Explorer", icon:"📁", render:renderExplorer },
    studio: { name:"Code Studio", icon:"💻", render:renderStudio },
    notepad: { name:"Notepad", icon:"📝", render:renderNotepad },
    calculator: { name:"Calculator", icon:"🧮", render:renderCalculator },
    clock: { name:"Clock", icon:"🕒", render:renderClock },
    settings: { name:"Settings", icon:"⚙️", render:renderSettings },
    terminal: { name:"Terminal", icon:"⌘", render:renderTerminal },
    appcenter: { name:"App Center", icon:"▦", render:renderAppCenter },
    system: { name:"System Information", icon:"🖥️", render:renderSystem }
  };

  let zIndex = 20;
  let notificationItems = [];
  let explorerFolder = "Home";

  function appButton(id) {
    const app = apps[id];
    return `<button class="start-app" onclick="CrossOS.open('${id}')">
      <span>${app.icon}</span>${escapeHTML(app.name)}
    </button>`;
  }

  function buildStartMenu() {
    $("#start-apps").innerHTML = Object.keys(apps).map(appButton).join("");
  }

  function renderExplorer() {
    const files = readJSON("crossos.files", [
      {name:"Welcome.txt",type:"file",folder:"Home",content:"Welcome to CROSS OS!"},
      {name:"Projects",type:"folder",folder:"Home"},
      {name:"Documents",type:"folder",folder:"Home"}
    ]);

    const visible = files.filter(item => item.folder === explorerFolder);
    const rows = visible.map((file,index) => `
      <div class="file-row">
        <span>${file.type === "folder" ? "📁" : "📄"} ${escapeHTML(file.name)}</span>
        <div class="button-row">
          ${file.type === "folder"
            ? `<button onclick="CrossOS.enterFolder(${index})">Open</button>`
            : `<button onclick="CrossOS.openFile(${index})">Open</button>`}
          <button onclick="CrossOS.deleteFile(${index})">Delete</button>
        </div>
      </div>`).join("");

    return `
      <div class="app-hero">
        <h2>File Explorer</h2>
        <p>Manage files inside the CROSS OS browser sandbox.</p>
      </div>
      <div class="button-row">
        <button class="secondary-btn" onclick="CrossOS.folderUp()">← Back</button>
        <button class="primary-btn" onclick="CrossOS.createFile()">＋ New file</button>
        <button class="secondary-btn" onclick="CrossOS.createFolder()">＋ Folder</button>
      </div>
      <h3 class="section-title">📍 ${escapeHTML(explorerFolder)}</h3>
      <div class="file-list">${rows || '<div class="empty-state">This folder is empty.</div>'}</div>
      <p class="muted">Storage is local to this browser. It does not access your Android files.</p>`;
  }

  function renderStudio() {
    return `
      <div class="app-hero">
        <h2>Code Studio</h2>
        <p>Write HTML, CSS and JavaScript, then preview your work.</p>
      </div>
      <div class="field">
        <label>HTML / CSS / JavaScript</label>
        <textarea id="studio-code" class="editor-area" spellcheck="false"><!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial;
  background: #101a30;
  color: white;
  text-align: center;
  padding: 35px;
}
button {
  padding: 12px 20px;
  border: 0;
  border-radius: 8px;
  background: #4389ed;
  color: white;
}
</style>
</head>
<body>
  <h1>Hello, CROSS OS!</h1>
  <p>Your first preview is ready.</p>
  <button onclick="document.querySelector('p').textContent='It works!'">
    Test button
  </button>
</body>
</html></textarea>
      </div>
      <div class="button-row">
        <button class="primary-btn" onclick="CrossOS.previewCode()">▶ Run Preview</button>
        <button class="secondary-btn" onclick="CrossOS.saveCode()">Save Project</button>
        <button class="secondary-btn" onclick="CrossOS.downloadCode()">Export HTML</button>
      </div>
      <h3 class="section-title">Live Preview</h3>
      <iframe id="studio-preview" class="code-preview" sandbox="allow-scripts"></iframe>
      <p class="muted">Preview runs in an isolated iframe. It cannot access the parent desktop or Android files.</p>`;
  }

  function renderNotepad() {
    const saved = localStorage.getItem("crossos.notepad") || "";
    return `
      <div class="app-hero">
        <h2>Notepad</h2><p>A simple workspace for your notes.</p>
      </div>
      <textarea id="notepad-text" class="editor-area" style="height:55%;min-height:180px" placeholder="Start writing...">${escapeHTML(saved)}</textarea>
      <div class="button-row">
        <button class="primary-btn" onclick="CrossOS.saveNote()">Save Note</button>
        <button class="secondary-btn" onclick="CrossOS.exportNote()">Export TXT</button>
        <button class="secondary-btn" onclick="CrossOS.clearNote()">Clear</button>
      </div>
      <p class="muted">Notes are saved in this browser's local storage.</p>`;
  }

  function renderCalculator() {
    return `
      <div class="app-hero"><h2>Calculator</h2><p>Basic arithmetic calculator.</p></div>
      <input id="calc-display" value="0" readonly style="font-size:28px;text-align:right;padding:20px">
      <div class="card-grid" style="margin-top:12px">
        ${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","C","+","(",")","⌫","="].map(key =>
          `<button class="secondary-btn" style="font-size:18px;padding:16px" onclick="CrossOS.calc('${key}')">${key}</button>`
        ).join("")}
      </div>`;
  }

  function renderClock() {
    return `
      <div class="app-hero"><h2>Clock</h2><p>Your device's local time.</p></div>
      <div class="clock-display" id="big-clock">--:--:--</div>
      <div class="clock-date" id="big-date">Loading date...</div>
      <div class="card-grid" style="margin-top:25px">
        <div class="info-card"><small>TIME ZONE</small><strong id="timezone">Local</strong></div>
        <div class="info-card"><small>DATE</small><strong id="clock-day">---</strong></div>
      </div>`;
  }

  function renderSettings() {
    const accent = localStorage.getItem("crossos.accent") || "#65a8ff";
    return `
      <div class="app-hero"><h2>Settings</h2><p>Personalize your CROSS OS desktop.</p></div>
      <h3 class="section-title">Appearance</h3>
      <div class="field">
        <label>Accent color</label>
        <input type="color" id="accent-color" value="${escapeHTML(accent)}" onchange="CrossOS.setAccent(this.value)">
      </div>
      <div class="field">
        <label>Desktop style</label>
        <select onchange="CrossOS.setStyle(this.value)">
          <option value="hybrid">Hybrid Glass</option>
          <option value="midnight">Midnight Blue</option>
          <option value="violet">Violet Future</option>
        </select>
      </div>
      <h3 class="section-title">System</h3>
      <div class="button-row">
        <button class="secondary-btn" onclick="CrossOS.open('system')">System Information</button>
        <button class="secondary-btn" onclick="CrossOS.resetAppearance()">Reset appearance</button>
      </div>
      <p class="muted">Settings are stored locally in your browser.</p>`;
  }

  function renderTerminal() {
    return `
      <div class="app-hero"><h2>Terminal</h2><p>Safe CROSS OS simulator commands. These are not Android shell commands.</p></div>
      <div class="terminal-output" id="terminal-output">CROSS OS Terminal [Version 1.0]
Type "help" to see available commands.</div>
      <div class="terminal-input">
        <input id="terminal-command" placeholder="Enter a command..." onkeydown="if(event.key==='Enter')CrossOS.runCommand()">
        <button class="primary-btn" onclick="CrossOS.runCommand()">Run</button>
      </div>`;
  }

  function renderAppCenter() {
    return `
      <div class="app-hero"><h2>App Center</h2><p>Applications available in this CROSS OS build.</p></div>
      <div class="card-grid">
        ${Object.keys(apps).filter(id => id !== "appcenter").map(id => `
          <div class="app-card">
            <span class="app-icon">${apps[id].icon}</span>
            <b>${escapeHTML(apps[id].name)}</b>
            <small>Built-in application</small>
            <button class="primary-btn" onclick="CrossOS.open('${id}')">Launch</button>
          </div>`).join("")}
      </div>`;
  }

  function renderSystem() {
    const ua = navigator.userAgent;
    const memory = navigator.deviceMemory ? navigator.deviceMemory + " GB (reported)" : "Not available";
    return `
      <div class="app-hero"><h2>System Information</h2><p>CROSS OS simulator status and browser environment.</p></div>
      <div class="card-grid">
        <div class="info-card"><small>PLATFORM</small><strong>CROSS OS</strong></div>
        <div class="info-card"><small>VERSION</small><strong>1.0 Ultimate</strong></div>
        <div class="info-card"><small>OPEN WINDOWS</small><strong id="window-count">0</strong></div>
        <div class="info-card"><small>DEVICE MEMORY</small><strong>${escapeHTML(memory)}</strong></div>
      </div>
      <h3 class="section-title">Browser environment</h3>
      <div class="system-row"><span>Screen</span><span>${screen.width} × ${screen.height}</span></div>
      <div class="system-row"><span>Viewport</span><span>${innerWidth} × ${innerHeight}</span></div>
      <div class="system-row"><span>Language</span><span>${escapeHTML(navigator.language)}</span></div>
      <div class="system-row"><span>Platform</span><span>${escapeHTML(navigator.platform || "Unknown")}</span></div>
      <div class="system-row"><span>User agent</span><span>${escapeHTML(ua.slice(0,110))}</span></div>
      <p class="muted">This is a browser-based desktop simulator, not a replacement for your Android operating system.</p>`;
  }

  function open(id) {
    const app = apps[id];
    if (!app) return;

    closePanels();
    let win = $("#window-" + id);

    if (win) {
      win.classList.remove("minimized");
      win.style.zIndex = ++zIndex;
      return;
    }

    win = document.createElement("section");
    win.className = "window";
    win.id = "window-" + id;
    win.style.zIndex = ++zIndex;

    win.innerHTML = `
      <div class="window-header" data-drag-handle>
        <div class="window-title">
          <span class="window-title-icon">${app.icon}</span>
          <span>${escapeHTML(app.name)}</span>
          <span class="window-title-sub">CROSS OS</span>
        </div>
        <div class="window-controls">
          <button title="Minimize" onclick="CrossOS.minimize('${id}')">−</button>
          <button title="Maximize / Restore" onclick="CrossOS.maximize('${id}')">□</button>
          <button class="close" title="Close" onclick="CrossOS.close('${id}')">×</button>
        </div>
      </div>
      <div class="window-content">${app.render()}</div>
      <div class="resize-handle" aria-hidden="true"></div>`;

    $("#window-area").appendChild(win);
    makeDraggable(win);
    makeResizable(win);
    addTask(id);
    focusWindow(id);

    if (id === "studio") { openStudioSaved(); previewCode(); }
    if (id === "clock") updateClock();
    if (id === "system") updateWindowCount();
  }

  function addTask(id) {
    const app = apps[id];
    const button = document.createElement("button");
    button.className = "task-app active";
    button.id = "task-" + id;
    button.textContent = app.icon + " " + app.name;
    button.onclick = () => {
      const win = $("#window-" + id);
      if (!win) return;
      if (!win.classList.contains("minimized") && win.classList.contains("focused")) {
        minimize(id);
      } else {
        win.classList.remove("minimized");
        focusWindow(id);
      }
    };
    $("#task-apps").appendChild(button);
  }

  function focusWindow(id) {
    $$(".window").forEach(win => win.classList.remove("focused"));
    $$(".task-app").forEach(button => button.classList.remove("active"));
    const win = $("#window-" + id);
    const task = $("#task-" + id);
    if (win) {
      win.style.zIndex = ++zIndex;
      win.classList.add("focused");
    }
    if (task) task.classList.add("active");
  }

  function close(id) {
    $("#window-" + id)?.remove();
    $("#task-" + id)?.remove();
    updateWindowCount();
  }

  function minimize(id) {
    $("#window-" + id)?.classList.add("minimized");
    $("#task-" + id)?.classList.remove("active");
  }

  function maximize(id) {
    const win = $("#window-" + id);
    if (!win) return;
    win.classList.toggle("maximized");
    win.classList.remove("minimized");
    focusWindow(id);
  }

  function makeDraggable(win) {
    const handle = $("[data-drag-handle]", win);
    let startX = 0, startY = 0, left = 0, top = 0, dragging = false;

    handle.addEventListener("pointerdown", event => {
      if (event.target.closest("button")) return;
      if (win.classList.contains("maximized")) return;
      dragging = true;
      focusWindow(win.id.replace("window-", ""));
      startX = event.clientX;
      startY = event.clientY;
      left = win.offsetLeft;
      top = win.offsetTop;
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener("pointermove", event => {
      if (!dragging) return;
      const area = $("#window-area").getBoundingClientRect();
      const x = Math.max(0, Math.min(area.width - 100, left + event.clientX - startX));
      const y = Math.max(0, Math.min(area.height - 45, top + event.clientY - startY));
      win.style.left = x + "px";
      win.style.top = y + "px";
    });

    handle.addEventListener("pointerup", event => {
      dragging = false;
      try { handle.releasePointerCapture(event.pointerId); } catch {}
      const area = $("#window-area").getBoundingClientRect();
      if (event.clientY < area.top + 18) win.classList.add("maximized");
      else if (event.clientX < area.left + 12) {
        win.style.left = "0"; win.style.top = "0";
        win.style.width = "50%"; win.style.height = "100%";
      } else if (event.clientX > area.right - 12) {
        win.style.left = "50%"; win.style.top = "0";
        win.style.width = "50%"; win.style.height = "100%";
      }
    });
  }

  function makeResizable(win) {
    const handle = $(".resize-handle", win);
    if (!handle) return;
    handle.style.cssText = "position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;touch-action:none";
    let startX, startY, startW, startH;
    handle.addEventListener("pointerdown", event => {
      if (win.classList.contains("maximized")) return;
      event.preventDefault();
      startX = event.clientX; startY = event.clientY;
      startW = win.offsetWidth; startH = win.offsetHeight;
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", event => {
      if (!handle.hasPointerCapture(event.pointerId)) return;
      win.style.width = Math.max(280, startW + event.clientX - startX) + "px";
      win.style.height = Math.max(230, startH + event.clientY - startY) + "px";
    });
    handle.addEventListener("pointerup", event => {
      try { handle.releasePointerCapture(event.pointerId); } catch {}
    });
  }

  function closePanels() {
    ["start-menu","quick-panel","notification-panel"].forEach(id => $("#"+id).classList.add("hidden"));
  }

  function toggleStart() {
    const panel = $("#start-menu");
    const opening = panel.classList.contains("hidden");
    closePanels();
    if (opening) {
      panel.classList.remove("hidden");
      $("#app-search").focus();
    }
  }

  function toggleQuick() {
    const panel = $("#quick-panel");
    const opening = panel.classList.contains("hidden");
    closePanels();
    if (opening) panel.classList.remove("hidden");
  }

  function toggleNotifications() {
    const panel = $("#notification-panel");
    const opening = panel.classList.contains("hidden");
    closePanels();
    if (opening) panel.classList.remove("hidden");
  }

  function search(query) {
    const value = query.toLowerCase();
    $("#start-apps").innerHTML = Object.keys(apps)
      .filter(id => (apps[id].name + " " + id).toLowerCase().includes(value))
      .map(appButton).join("") || '<div class="empty-state">No apps found.</div>';
  }

  function toggleTile(button) {
    button.classList.toggle("active");
  }

  function notify(title, message) {
    notificationItems.unshift({title, message, time:new Date().toLocaleTimeString()});
    notificationItems = notificationItems.slice(0,15);
    $("#notification-list").innerHTML = notificationItems.map(item => `
      <div class="info-card" style="margin-top:8px">
        <b>${escapeHTML(item.title)}</b>
        <p class="muted">${escapeHTML(item.message)}</p>
        <small>${escapeHTML(item.time)}</small>
      </div>`).join("");
  }

  function clearNotifications() {
    notificationItems = [];
    $("#notification-list").innerHTML = '<div class="empty-state">You\'re all caught up.</div>';
  }

  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"});
    const date = now.toLocaleDateString([], {weekday:"long",year:"numeric",month:"long",day:"numeric"});
    $("#top-clock").textContent = time.slice(0,5);
    $("#task-clock").textContent = time.slice(0,5);
    $("#task-date").textContent = now.toLocaleDateString();
    const big = $("#big-clock");
    if (big) {
      big.textContent = time;
      $("#big-date").textContent = date;
      $("#timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
      $("#clock-day").textContent = now.toLocaleDateString([], {weekday:"long"});
    }
  }

  function updateWindowCount() {
    const count = $("#window-count");
    if (count) count.textContent = $$(".window").filter(win => !win.classList.contains("minimized")).length;
  }

  function saveNote() {
    localStorage.setItem("crossos.notepad", $("#notepad-text").value);
    notify("Notepad", "Your note has been saved.");
  }

  function exportText(filename, text) {
    const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportNote() {
    exportText("cross-os-note.txt", $("#notepad-text").value);
  }

  function previewCode() {
    const editor = $("#studio-code");
    const frame = $("#studio-preview");
    if (!editor || !frame) return;
    frame.srcdoc = editor.value;
  }

  function saveCode() {
    localStorage.setItem("crossos.studio", $("#studio-code").value);
    notify("Code Studio", "Project saved in browser storage.");
  }

  function downloadCode() {
    exportText("cross-os-project.html", $("#studio-code").value);
  }

  function setAccent(color) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    document.documentElement.style.setProperty("--accent", color);
    localStorage.setItem("crossos.accent", color);
  }

  function setStyle(style) {
    const root = document.documentElement;
    const palettes = {
      hybrid:["#65a8ff","#9a83ff"],
      midnight:["#40c5d9","#4277d8"],
      violet:["#b18aff","#e276cb"]
    };
    const colors = palettes[style] || palettes.hybrid;
    root.style.setProperty("--accent", colors[0]);
    root.style.setProperty("--accent2", colors[1]);
    localStorage.setItem("crossos.style", style);
  }

  function resetAppearance() {
    localStorage.removeItem("crossos.accent");
    localStorage.removeItem("crossos.style");
    setStyle("hybrid");
    setAccent("#65a8ff");
    notify("Settings", "Appearance reset.");
  }

  async function fullscreen() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      if (screen.orientation?.lock) {
        try {
          await screen.orientation.lock("landscape");
        } catch {}
      }

      notify("Display", "Fullscreen requested.");
    } catch {
      notify("Display", "Fullscreen is not supported by this browser.");
    }
  }

  function createFile() {
    const name = prompt("Enter file name:", "New File.txt");
    if (!name || !name.trim()) return;

    const files = readJSON("crossos.files", []);
    files.push({
      name: name.trim(),
      type: "file",
      folder: explorerFolder,
      content: ""
    });

    writeJSON("crossos.files", files);
    refreshExplorer();
    notify("File Explorer", "New file created.");
  }

  function createFolder() {
    const name = prompt("Enter folder name:", "New Folder");
    if (!name || !name.trim()) return;

    const files = readJSON("crossos.files", []);
    files.push({
      name: name.trim(),
      type: "folder",
      folder: explorerFolder
    });

    writeJSON("crossos.files", files);
    refreshExplorer();
    notify("File Explorer", "New folder created.");
  }

  function refreshExplorer() {
    const win = $("#window-explorer");
    if (!win) return;

    $(".window-content", win).innerHTML = renderExplorer();
  }

  function enterFolder(index) {
    const files = readJSON("crossos.files", []);
    const visible = files.filter(item => item.folder === explorerFolder);
    const selected = visible[index];

    if (!selected || selected.type !== "folder") return;

    explorerFolder = selected.name;
    refreshExplorer();
  }

  function folderUp() {
    if (explorerFolder === "Home") return;

    const files = readJSON("crossos.files", []);
    const current = files.find(
      item => item.name === explorerFolder && item.type === "folder"
    );

    explorerFolder = current?.folder || "Home";
    refreshExplorer();
  }

  function openFile(index) {
    const files = readJSON("crossos.files", []);
    const visible = files.filter(item => item.folder === explorerFolder);
    const file = visible[index];

    if (!file || file.type !== "file") return;

    const content = prompt(
      "Edit file: " + file.name,
      file.content || ""
    );

    if (content === null) return;

    const actual = files.find(
      item => item === file
    );

    if (actual) {
      actual.content = content;
      writeJSON("crossos.files", files);
      notify("File Explorer", "File saved.");
    }
  }

  function deleteFile(index) {
    const files = readJSON("crossos.files", []);
    const visible = files.filter(item => item.folder === explorerFolder);
    const selected = visible[index];

    if (!selected) return;

    if (!confirm("Delete " + selected.name + "?")) return;

    const position = files.indexOf(selected);
    if (position !== -1) {
      files.splice(position, 1);
      writeJSON("crossos.files", files);
    }

    refreshExplorer();
    notify("File Explorer", "Item deleted.");
  }

  function clearNote() {
    const editor = $("#notepad-text");
    if (!editor) return;

    if (!confirm("Clear the current note?")) return;

    editor.value = "";
    localStorage.removeItem("crossos.notepad");
  }

  function runCommand() {
    const input = $("#terminal-command");
    const output = $("#terminal-output");

    if (!input || !output) return;

    const command = input.value.trim().toLowerCase();
    if (!command) return;

    const commands = {
      help: [
        "Available CROSS OS commands:",
        "help     - Show available commands",
        "about    - About CROSS OS",
        "version  - Show simulator version",
        "date     - Show current date and time",
        "whoami   - Show current environment",
        "apps     - List installed applications",
        "clear    - Clear terminal output"
      ].join("\n"),

      about: "CROSS OS is a browser-based desktop simulator.",

      version: "CROSS OS Ultimate Simulator 1.0",

      date: new Date().toString(),

      whoami: "CROSS OS browser user",

      apps: Object.values(apps)
        .map(app => app.name)
        .join("\n")
    };

    if (command === "clear") {
      output.textContent = "";
    } else {
      output.textContent +=
        "\n\nCROSS-OS> " + command + "\n" +
        (commands[command] || "Unknown command. Type help.");
    }

    input.value = "";
    output.scrollTop = output.scrollHeight;
  }

  function openStudioSaved() {
    const editor = $("#studio-code");
    if (!editor) return;

    const saved = localStorage.getItem("crossos.studio");
    if (saved !== null) {
      editor.value = saved;
    }
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closePanels();
    }

    if (event.altKey && event.key === "Tab") {
      event.preventDefault();

      const windows = $$(".window").filter(
        win => !win.classList.contains("minimized")
      );

      if (windows.length < 2) return;

      const active = windows.findIndex(
        win => win.classList.contains("focused")
      );

      const next = windows[(active + 1) % windows.length];
      focusWindow(next.id.replace("window-", ""));
    }
  });

  document.addEventListener("pointerdown", event => {
    const insidePanel = event.target.closest(".floating-panel");
    const panelButton = event.target.closest(
      ".taskbar-brand, .tray-button, .tray-clock"
    );

    if (!insidePanel && !panelButton) {
      closePanels();
    }
  });

  document.addEventListener("click", event => {
    const win = event.target.closest(".window");

    if (win) {
      focusWindow(win.id.replace("window-", ""));
    }
  });

  window.addEventListener("resize", () => {
    $$(".window").forEach(win => {
      if (win.classList.contains("maximized")) return;

      const area = $("#window-area").getBoundingClientRect();

      if (win.offsetLeft > area.width - 100) {
        win.style.left = "10px";
      }

      if (win.offsetTop > area.height - 60) {
        win.style.top = "10px";
      }
    });

    updateWindowCount();
  });


  let calculatorExpression = "";

  function calc(key) {
    const display = $("#calc-display");
    if (!display) return;

    if (key === "C") {
      calculatorExpression = "";
      display.value = "0";
      return;
    }

    if (key === "⌫") {
      calculatorExpression = calculatorExpression.slice(0, -1);
      display.value = calculatorExpression || "0";
      return;
    }

    if (key === "=") {
      try {
        const expression = calculatorExpression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-");

        if (!expression || !/^[0-9+*/().\-\s]+$/.test(expression)) {
          throw new Error("Invalid expression");
        }

        const result = Function('"use strict"; return (' + expression + ')')();

        if (!Number.isFinite(result)) {
          throw new Error("Invalid result");
        }

        calculatorExpression = String(result);
        display.value = calculatorExpression;
      } catch {
        display.value = "Error";
        calculatorExpression = "";
      }
      return;
    }

    if (display.value === "Error") {
      calculatorExpression = "";
    }

    calculatorExpression += key;
    display.value = calculatorExpression;
  }

  const CrossOS = {
    registerApp(id, definition) {
      if (!id || !definition || typeof definition.render !== "function") return false;
      apps[id] = { name: definition.name || id, icon: definition.icon || "▣", render: definition.render };
      if (window.CROSSCore?.apps?.registry) {
        window.CROSSCore.apps.registry.set(id, { id, name: apps[id].name, icon: apps[id].icon, render: apps[id].render });
      }
      // The script is loaded at the end of index.html, after #start-apps exists.
      // Refresh immediately so late-registered apps are visible in Start and Search.
      if ($("#start-apps")) buildStartMenu();
      return true;
    },
    unregisterApp(id) {
      if (!id || !apps[id]) return false;
      close(id);
      delete apps[id];
      if (window.CROSSCore?.apps?.registry) window.CROSSCore.apps.registry.delete(id);
      if ($("#start-apps")) buildStartMenu();
      return true;
    },
    open,
    close,
    minimize,
    maximize,
    toggleStart,
    toggleQuick,
    toggleNotifications,
    search,
    toggleTile,
    notify,
    clearNotifications,
    fullscreen,
    saveNote,
    exportNote,
    clearNote,
    previewCode,
    saveCode,
    downloadCode,
    setAccent,
    setStyle,
    resetAppearance,
    createFile,
    createFolder,
    enterFolder,
    folderUp,
    openFile,
    deleteFile,
    calc,
    runCommand
  };

  window.CrossOS = CrossOS;

  if (window.CROSSCore) {
    window.CROSSCore.connect(CrossOS, apps);
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildStartMenu();
    updateClock();
    setInterval(updateClock, 1000);

    if (!localStorage.getItem("crossos.files")) {
      writeJSON("crossos.files", [
        {
          name: "Welcome.txt",
          type: "file",
          folder: "Home",
          content: "Welcome to CROSS OS!"
        },
        {
          name: "Projects",
          type: "folder",
          folder: "Home"
        },
        {
          name: "Documents",
          type: "folder",
          folder: "Home"
        }
      ]);
    }

    const accent = localStorage.getItem("crossos.accent");
    const style = localStorage.getItem("crossos.style");

    if (style) setStyle(style);
    if (accent) setAccent(accent);

    notify("CROSS OS", "Ultimate Hybrid desktop is ready.");

    setTimeout(() => {
      $("#notification-panel")?.classList.add("hidden");
    }, 100);
  });
})();
