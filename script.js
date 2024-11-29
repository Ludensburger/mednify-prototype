document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const resultsList = document.getElementById("results");

  let medicines = []; // Holds the data from the JSON file

  // Fetch the JSON data
  fetch("improved.json")
    .then((response) => response.json())
    .then((data) => {
      medicines = data;
    })
    .catch((err) => console.error("Error loading JSON:", err));

  // Listen for input in the search bar
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase().trim();
    resultsList.innerHTML = ""; // Clear the list

    if (query === "") return;

    // Filter medicines based on the search query
    const filteredMedicines = medicines.filter((medicine) => {
      const genericNameMatch = medicine.genericName
        .toLowerCase()
        .includes(query);
      const brandNameMatch = medicine.brandName.toLowerCase().includes(query);
      return genericNameMatch || brandNameMatch;
    });

    // Display the filtered results
    filteredMedicines.forEach((medicine) => {
      const li = document.createElement("li");
      // Only show brand name if it exists
      const displayName = medicine.brandName
        ? `${medicine.genericName} (${medicine.brandName})`
        : medicine.genericName;
      li.textContent = displayName;
      li.addEventListener("click", () => {
        window.location.href = `details.html?id=${medicine.id}`;
      });
      resultsList.appendChild(li);
    });
  });
});
