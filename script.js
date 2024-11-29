document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const resultsList = document.getElementById("results");

  let medicines = []; // Holds the data from the JSON file

  // Fetch the JSON data
  fetch("kinawat.json")
    .then((response) => response.json())
    .then((data) => {
      medicines = data;
    })
    .catch((err) => console.error("Error loading JSON:", err));

  // Listen for input in the search bar
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    resultsList.innerHTML = ""; // Clear the list

    if (query.trim() === "") return;

    // Filter medicines based on the search query
    const filteredMedicines = medicines.filter((medicine) =>
      medicine.genericName.toLowerCase().includes(query)
    );

    // Display the filtered results
    filteredMedicines.forEach((medicine) => {
      const li = document.createElement("li");
      li.textContent = medicine.genericName;
      li.addEventListener("click", () => {
        window.location.href = `details.html?id=${medicine.id}`;
      });
      resultsList.appendChild(li);
    });
  });
});
