// Select the DOM element where you want to display favorite superheroes
const favoritesList = document.querySelector("#favoritesList");

// Function to fetch and display favorite superheroes
function displayFavoriteSuperheroes() {
  // Retrieve favorite superheroes from browser storage (localStorage or sessionStorage)
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Clear the favorites list before populating it to avoid duplicates
  favoritesList.innerHTML = "";

  // Display the list of favorite superheroes in favoritesList
  favorites.forEach((superhero) => {
    const listItem = createFavoriteSuperheroItem(superhero);
    favoritesList.appendChild(listItem);
  });
}

// Call displayFavoriteSuperheroes to populate the favorites list when the page loads
window.addEventListener("load", displayFavoriteSuperheroes);

// Function to create a favorite superhero item
function createFavoriteSuperheroItem(superhero) {
  // Create a list item
  const listItem = document.createElement("li");
  listItem.classList.add(
    "flex",
    "items-center",
    "bg-gray-100",
    "gap-x-6",
    "p-4",
    "rounded-md"
  );
  // const container
  const container = document.createElement("div");
  container.classList.add("flex", "flex-col");
  // Create a link to the superhero's details page (you can reuse the link creation code from the homepage)
  const heroLink = document.createElement("a");
  heroLink.textContent = superhero.name;
  heroLink.href = `herodetails.html?id=${superhero.id}`;
  heroLink.classList.add(
    "text-base",
    "font-semibold",
    "leading-7",
    "tracking-tight",
    "text-gray-900"
  );

  // Creating img element
  const image = document.createElement("img");
  image.classList.add("h-16", "w-16", "rounded-full");

  // Genearating content for the Image from api
  image.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
  image.alt = superhero.name;

  // Create a button to remove from favorites
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove from Favorites";
  removeButton.classList.add(
    "text-sm",
    "font-semibold",
    "leading-6",
    "text-indigo-600"
  );
  removeButton.addEventListener("click", () => removeFromFavorites(superhero));

  // Append elements to the list item
  listItem.appendChild(image);
  listItem.appendChild(container);
  container.appendChild(heroLink);
  container.appendChild(removeButton);

  return listItem;
}

// Function to remove a superhero from favorites
function removeFromFavorites(superheroToRemove) {
  // Get the list of favorite superheroes from local storage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Find the index of the superhero to remove in the favorites array
  const indexToRemove = favorites.findIndex(
    (fav) => fav.id === superheroToRemove.id
  );

  if (indexToRemove !== -1) {
    // Remove the superhero from the favorites array
    favorites.splice(indexToRemove, 1);

    // Update the list of favorites in local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Refresh the favorites list in the UI
    displayFavoriteSuperheroes();
  }
}
