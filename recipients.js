// ===== Recipients Page Logic =====

document.addEventListener("DOMContentLoaded", () => {
  renderRecipientTable();

  const form = document.getElementById("recipientForm");
  form.addEventListener("submit", handleRecipientSubmit);
});

function handleRecipientSubmit(e) {
  e.preventDefault();

  const recipient = {
    name: document.getElementById("recName").value.trim(),
    age: document.getElementById("recAge").value,
    bloodGroup: document.getElementById("recBloodGroup").value,
    units: Number(document.getElementById("recUnits").value),
    hospital: document.getElementById("recHospital").value.trim(),
    urgency: document.getElementById("recUrgency").value,
    contact: document.getElementById("recContact").value.trim()
  };

  addRecipient(recipient);

  alert(`✅ Request submitted for ${recipient.name} (${recipient.bloodGroup}, ${recipient.units} units)`);

  document.getElementById("recipientForm").reset();
  renderRecipientTable();
}

function renderRecipientTable() {
  const recipients = getRecipients();
  const tbody = document.getElementById("recTableBody");
  const countEl = document.getElementById("recCount");

  countEl.textContent = recipients.length;
  tbody.innerHTML = "";

  if (recipients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="empty-msg">No blood requests yet</td></tr>`;
    return;
  }

  const sorted = [...recipients].reverse();

  sorted.forEach(r => {
    const tr = document.createElement("tr");
    const statusClass = r.status === "Fulfilled" ? "status-fulfilled" : "status-pending";

    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.age}</td>
      <td><strong>${r.bloodGroup}</strong></td>
      <td>${r.units}</td>
      <td>${r.hospital}</td>
      <td>${r.urgency}</td>
      <td>${r.contact}</td>
      <td><span class="status-badge ${statusClass}">${r.status}</span></td>
      <td>${formatDate(r.requestedOn)}</td>
      <td>
        ${r.status === "Pending"
          ? `<button class="btn-danger" onclick="fulfillRequest('${r.id}')" style="background:#43a047;">Fulfill</button>`
          : "-"}
        <button class="btn-danger" onclick="removeRecipient('${r.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function fulfillRequest(id) {
  const result = fulfillRecipient(id);
  if (result.success) {
    alert("✅ " + result.message);
  } else {
    alert("❌ " + result.message);
  }
  renderRecipientTable();
}

function removeRecipient(id) {
  if (confirm("Delete this request record?")) {
    deleteRecipient(id);
    renderRecipientTable();
  }
}
function exportRecipientsCSV() {
  const recipients = getRecipients();
  exportToCSV(recipients, "recipients.csv", {
    name: "Patient Name",
    age: "Age",
    bloodGroup: "Blood Group",
    units: "Units",
    hospital: "Hospital",
    urgency: "Urgency",
    contact: "Contact",
    status: "Status",
    requestedOn: "Requested On"
  });
}
