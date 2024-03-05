let mealsData = [];

function createMealCard(meal) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h5 class="mealheader">${meal.strMeal}</h5>
        <p>Category: ${meal.strCategory}</p>
        <p>Area: ${meal.strArea}</p>
        <button onclick="showMealDetails(${meal.idMeal})" style="border-radius:5px">View Details</button>
    `;
    return card;
}

function fetchMealDetails(mealId) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const mealDetails = data.meals && data.meals[0];
            if (mealDetails) {
                mealsData.push(mealDetails);
                const modalContent = document.getElementById("mealDetailsContent");
                const ingredientHTML = getIngredientsHTML(mealDetails);
                modalContent.innerHTML = `<ul>${ingredientHTML}</ul><p>Instructions: ${mealDetails.strInstructions}</p>`;
                showModal();
            }
        });
}

function showMealDetails(mealId) {
    const meal = mealsData.find(m => m.idMeal === mealId);
    if (!meal) {
        fetchMealDetails(mealId);
        return;
    }

    const modalContent = document.getElementById("mealDetailsContent");
    const ingredientHTML = getIngredientsHTML(meal);
    modalContent.innerHTML = `<ul>${ingredientHTML}</ul><p>Instructions: ${meal.strInstructions}</p>`;
    showModal();
}

function getIngredientsHTML(meal) {
    const ingredientPairs = [];
    for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}`;
        const measureKey = `strMeasure${i}`;
        const ingredient = meal[ingredientKey];
        const measure = meal[measureKey];

        if (ingredient && measure) {
            ingredientPairs.push(`<li><strong>${ingredient}:</strong> ${measure}</li>`);
        }
    }
    return ingredientPairs.join("");
}

function showModal() {
    const modal = document.getElementById("mealDetailsModal");
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("mealDetailsModal");
    modal.style.display = "none";
}

function fetchMealsBySearchTerm(searchTerm) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(response => response.json())
        .then(data => data.meals || alert("Receipe Not Found"))
}

function searchMeals() {
    const searchTerm = document.getElementById("searchInput").value.trim();
    const mealCardsContainer = document.getElementById("mealCardsContainer");
    const modalContent = document.getElementById("mealDetailsContent");

    mealCardsContainer.innerHTML = "";
    modalContent.innerHTML = "";

    if (searchTerm !== "") {
        fetchMealsBySearchTerm(searchTerm)
            .then(searchResults => {
                mealsData = searchResults;
                searchResults.forEach(meal => {
                    const card = createMealCard(meal);
                    mealCardsContainer.appendChild(card);
                });
                document.body.classList.add("recipes-loaded");
                document.getElementById("searchInput").value = ""; // Clear search input
                document.getElementById("searchButton").innerText = "Search Another Recipe"; // Change button text
            });
    }
    else {
        // Remove class from body to show background image
        document.body.classList.remove("recipes-loaded");
    }
}
console.log("Page Loaded");
