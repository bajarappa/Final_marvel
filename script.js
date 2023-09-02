// Selecting DOM Elements
const searchInput = document.querySelector("#searchInput");
const resultsDiv = document.querySelector("#results");

// Function to load the configuration from config.json
async function loadConfig() {
  try {
    const response = await fetch("config.json");
    const config = await response.json();
    return config;
  } catch (error) {
    console.error("Error loading config.json:", error);
    return null;
  }
}

// Call the loadConfig function to load the configuration
loadConfig().then((config) => {
  if (config) {
    const publicKey = config.publicKey;

    const privateKey = config.privateKey;

    // Function to generate the hash using MD5
    function generateHash(ts) {
      const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
      return hash;
    }

    // Function to fetch superheroes
    function fetchSuperheroes(searchQuery) {
      const ts = new Date().getTime();
      const hash = generateHash(ts);

      // Build the API URL
      const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
      const apiUrl = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${searchQuery}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data); // Log the API response to the console
          displaySuperheros(data.data.results);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }

    // Function to display superheroes
    function displaySuperheros(superheroes) {
      resultsDiv.innerHTML = "";

      superheroes.forEach((superhero) => {
        const superheroCardHTML = `
      <li class="flex items-center bg-gray-100 gap-x-6 p-4 rounded-md">
        <img class="h-16 w-16 rounded-full" src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
        <div class="flex flex-col">
          <a href="herodetails.html?id=${superhero.id}" class="text-base font-semibold leading-7 tracking-tight text-gray-900">${superhero.name}</a>
          <button class="text-sm font-semibold leading-6 text-indigo-600 add-to-favorites-button">Add to Favorites</button>
        </div>
      </li>
    `;

        resultsDiv.innerHTML += superheroCardHTML;
      });

      // Now, after adding the HTML, add the event listener to the "Add to Favorites" buttons
      const addToFavoritesButtons = resultsDiv.querySelectorAll(
        ".add-to-favorites-button"
      );

      addToFavoritesButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          alert("Added to favorites");
          addToFavorites(superheroes[index]);
        });
      });
    }

    // Event listener for search input
    searchInput.addEventListener("keyup", (event) => {
      const searchQuery = event.target.value.trim();
      if (searchQuery) {
        fetchSuperheroes(searchQuery);
      }
    });

    // Event listener for superhero name click
    resultsDiv.addEventListener("click", function (event) {
      // Check if the clicked element is a superhero name
      if (event.target.classList.contains("superhero-name")) {
        // Retrieve the superhero data associated with the clicked name
        const superhero = getSuperheroData(event.target.textContent);

        // Redirect to the superhero details page with the superhero's ID
        window.location.href = `herodetails.html?id=${superhero.id}`;
      }
    });

    // Function to add superhero to favorites
    function addToFavorites(superhero) {
      // Get the list of favorite superheroes from local storage or initialize an empty array
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Check if the superhero is already in favorites
      const isDuplicate = favorites.some((fav) => fav.id === superhero.id);

      if (!isDuplicate) {
        favorites.push(superhero);

        // Update the list of favorites in local storage
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    }
  }
});
