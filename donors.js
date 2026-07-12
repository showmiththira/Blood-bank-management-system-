// ===== Donors Page Logic =====

document.addEventListener("DOMContentLoaded", () => {
  renderDonorTable();

  const form = document.getElementById("donorForm");
  form.addEventListener("submit", handleDonorSubmit);
});

function handleDonorSubmit(e) {
  e.preventDefault();

  const donor = {
    name: document.getElementById("donorName").value.trim(),
    age: document.getElementById("donorAge").value,
    gender: document.getElementById("donorGender").value,
    bloodGroup: document.getElementById("donorBloodGroup").value,
    contact: document.getElementById("donorContact").value.trim(),
    lastDonation: document.getElementById("donorLastDonation").value || null
  };

  addDonor(donor);

  alert(`✅ ${donor.name} registered successfully! 1 unit of ${donor.bloodGroup} added to stock.`);

  document.getElementById("donorForm").reset();
  renderDonorTable();
}

function renderDonorTable() {
  const donors = getDonors();
  const tbody = document.getElementById("donorTableBody");
  const countEl = document.getElementById("donorCount");

  countEl.textContent = donors.length;
  tbody.innerHTML = "";

  if (donors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-msg">No donors registered yet</td></tr>`;
    return;
  }

  // show latest first
  const sorted = [...donors].reverse();

  sorted.forEach(donor => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${donor.name}</td>
      <td>${donor.age}</td>
      <td>${donor.gender}</td>
      <td><strong>${donor.bloodGroup}</strong></td>
      <td>${donor.contact}</td>
      <td>${formatDate(donor.lastDonation)}</td>
      <td>${formatDate(donor.registeredOn)}</td>
      <td><button class="btn-danger" onclick="removeDonor('${donor.id}')">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function removeDonor(id) {
  if (confirm("Delete this donor record? (This won't remove already-added stock units)")) {
    deleteDonor(id);
    renderDonorTable();
  }
}
function exportDonorsCSV() {
  const donors = getDonors();
  exportToCSV(donors, "donors.csv", {
    name: "Name",
    age: "Age",
    gender: "Gender",
    bloodGroup: "Blood Group",
    contact: "Contact",
    lastDonation: "Last Donation",
    registeredOn: "Registered On"
  });
}