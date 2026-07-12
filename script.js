// ===== Blood Bank Management System - Common Script =====

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const LOW_STOCK_THRESHOLD = 5; // units - below this, show alert

// ---------- Storage Init ----------
function initStorage() {
  if (!localStorage.getItem("donors")) {
    localStorage.setItem("donors", JSON.stringify([]));
  }
  if (!localStorage.getItem("recipients")) {
    localStorage.setItem("recipients", JSON.stringify([]));
  }
  if (!localStorage.getItem("inventory")) {
    const initialStock = {};
    BLOOD_GROUPS.forEach(bg => initialStock[bg] = 0);
    localStorage.setItem("inventory", JSON.stringify(initialStock));
  }
}
initStorage();

// ---------- Generic Helpers ----------
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ---------- Donors ----------
function getDonors() {
  return JSON.parse(localStorage.getItem("donors")) || [];
}

function saveDonors(donors) {
  localStorage.setItem("donors", JSON.stringify(donors));
}

function addDonor(donor) {
  const donors = getDonors();
  donor.id = generateId();
  donor.registeredOn = new Date().toISOString();
  donors.push(donor);
  saveDonors(donors);

  // Every new donor adds 1 unit to inventory for their blood group
  addStock(donor.bloodGroup, 1);

  return donor;
}

function deleteDonor(id) {
  const donors = getDonors().filter(d => d.id !== id);
  saveDonors(donors);
}

// ---------- Recipients ----------
function getRecipients() {
  return JSON.parse(localStorage.getItem("recipients")) || [];
}

function saveRecipients(recipients) {
  localStorage.setItem("recipients", JSON.stringify(recipients));
}

function addRecipient(recipient) {
  const recipients = getRecipients();
  recipient.id = generateId();
  recipient.requestedOn = new Date().toISOString();
  recipient.status = "Pending";
  recipients.push(recipient);
  saveRecipients(recipients);
  return recipient;
}

function fulfillRecipient(id) {
  const recipients = getRecipients();
  const r = recipients.find(x => x.id === id);
  if (!r) return { success: false, message: "Recipient not found" };

  const stock = getInventory();
  if (stock[r.bloodGroup] < r.units) {
    return { success: false, message: "Not enough stock available!" };
  }

  removeStock(r.bloodGroup, r.units);
  r.status = "Fulfilled";
  r.fulfilledOn = new Date().toISOString();
  saveRecipients(recipients);
  return { success: true, message: "Request fulfilled" };
}

function deleteRecipient(id) {
  const recipients = getRecipients().filter(r => r.id !== id);
  saveRecipients(recipients);
}

// ---------- Inventory ----------
function getInventory() {
  return JSON.parse(localStorage.getItem("inventory")) || {};
}

function saveInventory(inv) {
  localStorage.setItem("inventory", JSON.stringify(inv));
}

function addStock(bloodGroup, units) {
  const inv = getInventory();
  inv[bloodGroup] = (inv[bloodGroup] || 0) + Number(units);
  saveInventory(inv);
}

function removeStock(bloodGroup, units) {
  const inv = getInventory();
  inv[bloodGroup] = Math.max(0, (inv[bloodGroup] || 0) - Number(units));
  saveInventory(inv);
}

function getLowStockGroups() {
  const inv = getInventory();
  return BLOOD_GROUPS.filter(bg => inv[bg] < LOW_STOCK_THRESHOLD);
}

// ---------- Navbar Active Link ----------
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
// ---------- CSV Export ----------
function exportToCSV(data, filename, headers) {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }

  const keys = Object.keys(headers);
  const headerRow = Object.values(headers).join(",");

  const rows = data.map(item =>
    keys.map(key => {
      let val = item[key] ?? "";
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(",")
  );

  const csvContent = [headerRow, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}