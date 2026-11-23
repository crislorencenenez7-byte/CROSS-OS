window.CrossApps = window.CrossApps || {};

CrossApps.clock = {
  title: "Clock",
  icon: "🕒",
  render: () => `
    <div class="clock-page">
      <div class="clock-top">
        <div><small>CROSS OS APPLICATION</small><h1>Clock</h1></div>
        <span class="app-pill">LOCAL TIME</span>
      </div>
      <div class="clock-hero">
        <div class="clock-decoration">◷</div>
        <div id="big-clock">--:--:--</div>
        <div id="big-date">Loading date...</div>
        <div class="clock-zone">YOUR DEVICE LOCAL TIME</div>
      </div>
      <div class="clock-info-grid">
        <div class="clock-info-card"><small>TIME ZONE</small><b id="clock-zone-name">Local</b></div>
        <div class="clock-info-card"><small>DAY OF YEAR</small><b id="clock-day">--</b></div>
      </div>
    </div>`
};
