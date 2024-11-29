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
        displayDetails(medicine, data);
      } else {
        detailsDiv.innerHTML = "<p>Medicine not found.</p>";
      }
    })
    .catch((err) => console.error("Error loading JSON:", err));

  function displayDetails(medicine, allMedicines) {
    // Extract base medicine name (remove strength and form information)
    const getBaseName = (name) => {
      return name.split(" ")[0].toLowerCase();
    };

    // Find related medicines
    const relatedMedicines = allMedicines
      .filter((med) => {
        // Don't include the current medicine
        if (med.id === medicine.id) return false;

        const baseNameCurrent = getBaseName(medicine.genericName);
        const baseNameOther = getBaseName(med.genericName);
        const usesMatch = med.uses
          .toLowerCase()
          .includes(medicine.uses.toLowerCase());

        // Include if base names match OR uses match, but not if it's exactly the same medicine
        return (
          (baseNameCurrent === baseNameOther || usesMatch) &&
          med.genericName !== medicine.genericName
        );
      })
      .slice(0, 5); // Limit to 5 related medicines

    detailsDiv.innerHTML = `
    <!-- Basic Information Card -->
    <div class="card basic-info">
      <h2>${medicine.genericName}</h2>
      <h3>${medicine.brandName || "No brand name available"}</h3>
      <p class="uses">${medicine.uses}</p>
    </div>

    <!-- Dosage and Form Card -->
    <div class="card dosage-info">
      <h3>Dosage & Form</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Form</span>
          <span class="value">${medicine.form}</span>
        </div>
        <div class="info-item">
          <span class="label">Dosage</span>
          <span class="value">${medicine.dosage}</span>
        </div>
        <div class="info-item">
          <span class="label">Measurement</span>
          <span class="value">${medicine.measurementUnit}</span>
        </div>
      </div>
    </div>

    <!-- Side Effects Card -->
    <div class="card side-effects">
      <h3>Side Effects</h3>
      <ul>
        ${medicine.sideEffects
          .split(",")
          .map((effect) => `<li>${effect.trim()}</li>`)
          .join("")}
      </ul>
    </div>

    ${
      relatedMedicines.length > 0
        ? `
    <!-- Related Medicines Card -->
    <div class="card related-medicines">
      <h3>Alternative Medicines</h3>
      <ul>
        ${relatedMedicines
          .map(
            (med) => `
          <li>
            <strong>${med.genericName}</strong>
            ${med.brandName ? ` (${med.brandName})` : ""}
            <span class="med-form">${med.form}</span>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
    `
        : ""
    }
  `;
  }

  // Initialize the map after displaying the details
  initMap();
});

// Add this function after the displayDetails function
function initMap() {
  // Check if geolocation is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 13,
      });

      // Create a Places service
      const service = new google.maps.places.PlacesService(map);

      // Search for pharmacies
      service.nearbySearch(
        {
          location: userLocation,
          radius: 5000, // 5km radius
          type: ["pharmacy"],
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
              new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name,
              });
            });
          }
        }
      );
    });
  }
}
