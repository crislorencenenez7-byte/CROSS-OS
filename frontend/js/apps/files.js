window.CrossApps = window.CrossApps || {};

CrossApps.files = {
  title: "File Explorer",
  icon: "📁",
  render: () => {
    const files = JSON.parse(localStorage.getItem("cross-files") || "{}");
    const names = Object.keys(files);
    return `
      <div class="explorer">
        <aside class="explorer-sidebar">
          <div class="explorer-logo">📁 <b>File Explorer</b></div>
          <div class="explorer-nav active">⌂　Home</div>
          <div class="explorer-nav">★　Favorites</div>
          <div class="explorer-nav">◷　Recent</div>
          <div class="explorer-divider"></div>
          <div class="explorer-nav">🖥️　Desktop</div>
          <div class="explorer-nav">📄　Documents</div>
          <div class="explorer-nav">⬇　Downloads</div>
          <div class="explorer-nav">🖼️　Pictures</div>
          <div class="explorer-storage">
            <b>Storage</b>
            <div class="storage-bar"><span></span></div>
            <small>Browser workspace</small>
          </div>
        </aside>
        <main class="explorer-main">
          <div class="explorer-toolbar">
            <button onclick="openApp('files')">↻</button>
            <button onclick="createCrossFile()">＋ New file</button>
            <input placeholder="Search files" oninput="filterCrossFiles(this.value)">
          </div>
          <div class="explorer-path">⌂　Home　›　My Files</div>
          <div class="explorer-welcome">
            <small>YOUR WORKSPACE</small>
            <h1>Welcome to your files</h1>
            <p>Manage your documents in CROSS OS.</p>
          </div>
          <h3 class="explorer-section-title">Your files</h3>
          <div class="explorer-file-list" id="file-list">
            ${names.length ? names.map(name => `
              <div class="explorer-file" data-name="${escapeCross(name.toLowerCase())}">
                <span class="explorer-file-icon">📄</span>
                <span class="explorer-file-name">${escapeCross(name)}</span>
                <button onclick="openCrossFile('${encodeURIComponent(name)}')">Open</button>
                <button onclick="deleteCrossFile('${encodeURIComponent(name)}')">×</button>
              </div>`).join("") : `
              <div class="empty-files">
                <span>📂</span>
                <h3>This folder is empty</h3>
                <p>Create a file to get started.</p>
              </div>`}
          </div>
          <div class="file-editor-panel">
            <div class="file-editor-heading">
              <b>File editor</b>
              <span id="file-active-label">No file selected</span>
            </div>
            <input id="new-file-name" placeholder="New file name">
            <input id="active-file" type="hidden">
            <textarea id="file-editor" placeholder="Select a file or create a new one..."></textarea>
            <button onclick="saveCrossFile()">Save changes</button>
          </div>
        </main>
      </div>`;
  }
};

window.escapeCross = function(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
};

window.createCrossFile = function() {
  const name = document.getElementById("new-file-name")?.value.trim();
  if (!name) return alert("Enter a file name in the editor panel.");
  const files = JSON.parse(localStorage.getItem("cross-files") || "{}");
  if (Object.prototype.hasOwnProperty.call(files, name)) return alert("File already exists.");
  files[name] = "";
  localStorage.setItem("cross-files", JSON.stringify(files));
  openApp("files");
};

window.openCrossFile = function(encoded) {
  const name = decodeURIComponent(encoded);
  const files = JSON.parse(localStorage.getItem("cross-files") || "{}");
  document.getElementById("active-file").value = name;
  document.getElementById("file-editor").value = files[name] ?? "";
  document.getElementById("file-active-label").textContent = name;
};

window.saveCrossFile = function() {
  const name = document.getElementById("active-file")?.value;
  if (!name) return alert("Open a file first.");
  const files = JSON.parse(localStorage.getItem("cross-files") || "{}");
  files[name] = document.getElementById("file-editor").value;
  localStorage.setItem("cross-files", JSON.stringify(files));
  document.getElementById("file-active-label").textContent = name + " • Saved";
};

window.deleteCrossFile = function(encoded) {
  const name = decodeURIComponent(encoded);
  if (!confirm("Delete " + name + "?")) return;
  const files = JSON.parse(localStorage.getItem("cross-files") || "{}");
  delete files[name];
  localStorage.setItem("cross-files", JSON.stringify(files));
  openApp("files");
};

window.filterCrossFiles = function(query) {
  document.querySelectorAll(".explorer-file").forEach(row => {
    row.style.display = row.dataset.name.includes(query.toLowerCase()) ? "flex" : "none";
  });
};
