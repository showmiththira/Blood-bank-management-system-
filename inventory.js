// ===== Inventory Page Logic =====

document.addEventListener("DOMContentLoaded", () => {
  renderInventoryGrid();

  const form = document.getElementById("adjustForm");
  form.addEventListener("submit", handleAdjustSubmit);
});

function renderInventoryGrid() {
  const inventory = getInventory();
  const grid = document.getElementById("invStockGrid");
  grid.innerHTML = "";

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
    grid.appendChild(card);
  });
}

function handleAdjustSubmit(e) {
  e.preventDefault();

  const bloodGroup = document.getElementById("adjBloodGroup").value;
  const type = document.getElementById("adjType").value;
  const units = Number(document.getElementById("adjUnits").value);

  if (type === "add") {
    addStock(bloodGroup, units);
    alert(`✅ ${units} units added to ${bloodGroup} stock`);
  } else if (type === "remove") {
    const inventory = getInventory();
    if (inventory[bloodGroup] < units) {
      alert(`❌ Not enough stock! Only ${inventory[bloodGroup]} units of ${bloodGroup} available`);
      return;
    }
    removeStock(bloodGroup, units);
    alert(`✅ ${units} units removed from ${bloodGroup} stock`);
  }

  document.getElementById("adjustForm").reset();
  renderInventoryGrid();
}