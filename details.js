document.addEventListener("DOMContentLoaded", () => {
  const detailsDiv = document.getElementById("details");

  // Get the medicine ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const medicineId = urlParams.get("id");

  // Fetch the JSON data
  fetch("improved.json")
    .then((response) => response.json())
    .then((data) => {
      const medicine = data.find((med) => med.id === medicineId);
      if (medicine) {
        displayDetails(medicine);
      } else {
        detailsDiv.innerHTML = "<p>Medicine not found.</p>";
      }
    })
    .catch((err) => console.error("Error loading JSON:", err));

  // Display details of the selected medicine
  function displayDetails(medicine) {
    detailsDiv.innerHTML = `
      <div class="card">
        <h2>${medicine.genericName}</h2>
        <p><strong>Brand Name:</strong> ${medicine.brandName}</p>
        <p><strong>Form:</strong> ${medicine.form}</p>
        <p><strong>Measurement Unit:</strong> ${medicine.measurementUnit}</p>
        <p><strong>Dosage:</strong> ${medicine.dosage}</p>
        <p><strong>Side Effects:</strong> ${medicine.sideEffects}</p>
        <p><strong>Uses:</strong> ${medicine.uses}</p>
      </div>
    `;
  }
});
