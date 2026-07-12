// ===== Dashboard Logic =====

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
});

function renderDashboard() {
  const donors = getDonors();
  const recipients = getRecipients();
  const inventory = getInventory();
  const lowStock = getLowStockGroups();

  // ---- Stat Cards ----
  document.getElementById("totalDonors").textContent = donors.length;
  document.getElementById("totalRecipients").textContent = recipients.length;

  const totalUnits = Object.values(inventory).reduce((sum, val) => sum + val, 0);
  document.getElementById("totalUnits").textContent = totalUnits;

  document.getElementById("lowStockCount").textContent = lowStock.length;

  // ---- Stock Grid ----
  const stockGrid = document.getElementById("stockGrid");
  stockGrid.innerHTML = "";
  BLOOD_GROUPS.forEach(bg => {
    const units = inventory[bg] || 0;
    const isLow = units < LOW_STOCK_THRESHOLD;

    const card = document.createElement("div");
    card.className = "blood-card" + (isLow ? " low-stock" : "");
    card.innerHTML = `
      <div class="blood-group">${bg}</div>
      <div class="blood-units">${units} units</div>
      ${isLow ? '<div class="low-tag">Low</div>' : ""}
    `;
    stockGrid.appendChild(card);
  });

  // ---- Alerts List ----
  const alertsList = document.getElementById("alertsList");
  alertsList.innerHTML = "";

  if (lowStock.length === 0) {
    alertsList.innerHTML = '<li class="empty-msg">No alerts — stock levels are healthy ✅</li>';
  } else {
    lowStock.forEach(bg => {
      const li = document.createElement("li");
      li.className = "alert-item";
      li.textContent = `${bg} stock is low: only ${inventory[bg]} units left`;
      alertsList.appendChild(li);
    });
  }
}