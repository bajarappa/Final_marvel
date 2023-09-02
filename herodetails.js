const heroDetails = document.querySelector("#hero-details");

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

    // Get superheroId from the URL (you can use URL parameters or hash fragments)
    const urlSearchParams = new URLSearchParams(window.location.search);
    const superheroId = urlSearchParams.get("id");

    //Declaring variables
    const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";

    // Function to generate the hash using MD5
    function generateHash(ts) {
      const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
      return hash;
    }

    // Call fetchSuperheroDetails with the superheroId
    if (superheroId) {
      fetchSuperheroDetails(superheroId);
    }

    // Function to fetch and display superhero details
    function fetchSuperheroDetails(superheroId) {
      const ts = new Date().getTime();
      const hash = generateHash(ts);

      // Build the API URL for fetching superhero details by ID
      const apiUrl = `${baseUrl}/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const superhero = data.data.results[0]; // Assuming the response contains the superhero details

          console.log(superhero);

          function removeDuplicates(items, propertyName) {
            let unique = [];
            items.forEach((item) => {
              const propertyValue = item[propertyName];
              if (propertyValue) {
                const trimmedValue = propertyValue.replace(/#[0-9]+/g, "");
                unique.push(trimmedValue);
              }
            });
            return unique.filter(
              (item, index) => unique.indexOf(item) === index
            );
          }

          // Usage for removing duplicates from comics
          const uniqueComics = removeDuplicates(superhero.comics.items, "name");

          // Usage for removing duplicates from stories
          const uniqueStories = removeDuplicates(
            superhero.stories.items,
            "name"
          );

          // Usage for removing duplicates from stories
          const uniqueSeries = removeDuplicates(superhero.series.items, "name");

          console.log("Unique Comics:", uniqueComics);
          console.log("Unique Stories:", uniqueStories);
          console.log("Unique Series:", uniqueSeries);

          // Create a list element
          const listHTML = `
            <li class="flex flex-col sm:flex-row items-center bg-gray-100 gap-x-6 p-4 rounded-md">
              <img class="h-1/2 w-1/2 rounded-lg" src="${
                superhero.thumbnail.path
              }.${superhero.thumbnail.extension}" alt="${superhero.name}" />
              <div class="flex flex-col">
                <h1 class="text-2xl font-semibold leading-7 tracking-tight text-gray-900">Name: ${
                  superhero.name
                }</h1>
                <div> 
                  <span class="text-2xl">Comics: </span>
                  ${uniqueComics
                    .map(
                      (comic) => `<span class="text-base"> ${comic}, </span>`
                    )
                    .join("")}
                </div>
                <div> 
                  <span class="text-2xl">Series: </span>
                  ${uniqueSeries
                    .map(
                      (series) => `<span class="text-base"> ${series}, </span>`
                    )
                    .join("")}
                </div>
                <div> 
                  <span class="text-2xl">Stories: </span>
                  ${uniqueStories
                    .map(
                      (story) => `<span class="text-base"> ${story}, </span>`
                    )
                    .join("")}
                </div>
                <button class="text-sm mt-4 font-semibold leading-6 text-indigo-600 text-left">Add to favorite</button>
              </div>
            </li>
          `;

          const heroDetails = document.querySelector("#hero-details");
          heroDetails.innerHTML += listHTML;

          // Add click event listener to the button
          const btnFavorite = heroDetails.querySelector("li:last-child button");
          btnFavorite.addEventListener("click", () => {
            alert("Added to favorites");
            addToFavorites(superhero);
          });
        })
        .catch((error) => {
          console.error("Error fetching superhero details:", error);
        });
    }

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
