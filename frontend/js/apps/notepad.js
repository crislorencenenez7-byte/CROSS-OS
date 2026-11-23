window.CrossApps = window.CrossApps || {};

CrossApps.notepad = {
  title: "Notepad",
  icon: "📝",
  render: () => `
    <div class="notepad-page">
      <div class="notepad-top">
        <div><small>CROSS OS • TEXT EDITOR</small><h1>Notepad</h1></div>
        <span id="note-status" class="save-indicator">● Ready</span>
      </div>
      <div class="notepad-toolbar">
        <button onclick="saveCrossNote()">💾 Save</button>
        <button onclick="newCrossNote()">＋ New</button>
        <button onclick="downloadCrossNote()">⇩ Export</button>
        <span class="notepad-toolbar-spacer"></span>
        <span id="note-count">0 words</span>
      </div>
      <div class="notepad-document">
        <input id="note-title" placeholder="Untitled document"
          value="${escapeCross(localStorage.getItem("cross-note-title") || "Untitled document")}"
          oninput="markCrossNote()">
        <textarea id="note-content" placeholder="Start typing your thoughts..."
          oninput="markCrossNote()">${escapeCross(localStorage.getItem("cross-note") || "")}</textarea>
      </div>
      <div class="notepad-statusbar"><span>Plain text</span><span>UTF-8</span><span>Ln 1, Col 1</span></div>
    </div>`
};

window.markCrossNote = function() {
  const content = document.getElementById("note-content")?.value || "";
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const count = document.getElementById("note-count");
  const status = document.getElementById("note-status");
  if (count) count.textContent = words + " words";
  if (status) status.textContent = "● Unsaved changes";
};

window.saveCrossNote = function() {
  localStorage.setItem("cross-note-title", document.getElementById("note-title").value);
  localStorage.setItem("cross-note", document.getElementById("note-content").value);
  document.getElementById("note-status").textContent = "● Saved on this device";
};

window.newCrossNote = function() {
  if (!confirm("Create a new note? Save your current note first if needed.")) return;
  document.getElementById("note-title").value = "Untitled document";
  document.getElementById("note-content").value = "";
  markCrossNote();
};

window.downloadCrossNote = function() {
  const title = document.getElementById("note-title").value || "note";
  const blob = new Blob([document.getElementById("note-content").value], {type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = title.replace(/[^\w-]/g, "_") + ".txt";
  a.click();
  URL.revokeObjectURL(url);
};
