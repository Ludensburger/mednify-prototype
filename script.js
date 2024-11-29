document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const resultsList = document.getElementById("results");
  const searchGenericButton = document.getElementById("search-generic");
  const searchBrandButton = document.getElementById("search-brand");
  const searchUsesButton = document.getElementById("search-uses");

  let medicines = [];
  // Load saved search criteria or use default
  let searchCriteria = JSON.parse(localStorage.getItem("searchCriteria")) || [
    "generic",
  ];

  // Restore button states
  searchCriteria.forEach((criteria) => {
    switch (criteria) {
      case "generic":
        searchGenericButton.classList.add("active");
        break;
      case "brand":
        searchBrandButton.classList.add("active");
        break;
      case "uses":
        searchUsesButton.classList.add("active");
        break;
    }
  });

  // Restore search query
  const savedQuery = localStorage.getItem("searchQuery") || "";
  searchBar.value = savedQuery;

  fetch("improved.json")
    .then((response) => response.json())
    .then((data) => {
      medicines = data;
      if (savedQuery) {
        performSearch(); // Perform search with restored query
      }
    })
    .catch((err) => console.error("Error loading JSON:", err));

  // Toggle search criteria buttons
  searchGenericButton.addEventListener("click", () =>
    toggleSearchCriteria("generic", searchGenericButton)
  );
  searchBrandButton.addEventListener("click", () =>
    toggleSearchCriteria("brand", searchBrandButton)
  );
  searchUsesButton.addEventListener("click", () =>
    toggleSearchCriteria("uses", searchUsesButton)
  );

  function toggleSearchCriteria(criteria, button) {
    const index = searchCriteria.indexOf(criteria);
    if (index > -1) {
      if (searchCriteria.length > 1) {
        searchCriteria.splice(index, 1);
        button.classList.remove("active");
      }
    } else {
      searchCriteria.push(criteria);
      button.classList.add("active");
    }
    // Save criteria state to localStorage
    localStorage.setItem("searchCriteria", JSON.stringify(searchCriteria));
    performSearch();
  }

  searchBar.addEventListener("input", () => {
    // Save search query to localStorage
    localStorage.setItem("searchQuery", searchBar.value);
    performSearch();
  });

  function performSearch() {
    const query = searchBar.value.toLowerCase().trim();
    resultsList.innerHTML = "";

    if (query === "") return;

    const filteredMedicines = medicines.filter((medicine) => {
      return searchCriteria.some((criteria) => {
        const searchableContent = {
          generic: medicine.genericName.toLowerCase(),
          brand: medicine.brandName.toLowerCase(),
          uses: medicine.uses.toLowerCase(),
        };
        return searchableContent[criteria].includes(query);
      });
    });

    filteredMedicines.forEach((medicine) => {
      const li = document.createElement("li");
      const displayText = medicine.brandName
        ? `${medicine.genericName} (${medicine.brandName})`
        : medicine.genericName;

      li.textContent = displayText;
      li.addEventListener("click", () => {
        window.location.href = `details.html?id=${medicine.id}`;
      });
      resultsList.appendChild(li);
    });
  }
});
