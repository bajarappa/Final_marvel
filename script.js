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
        const listItem = createSuperheroCard(superhero);
        resultsDiv.appendChild(listItem);
      });
    }

    // Function to create a superhero card
    function createSuperheroCard(superhero) {
      //Creating list element
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

      // Creating anchor element
      const heroName = document.createElement("a");

      heroName.classList.add(
        "text-base",
        "font-semibold",
        "leading-7",
        "tracking-tight",
        "text-gray-900"
      );

      // Genearating content for the heroName from api
      heroName.textContent = superhero.name;

      //   heroName.href = `herodetails.html`;
      heroName.href = `herodetails.html?id=${superhero.id}`;
      // Creating img element
      const image = document.createElement("img");
      image.classList.add("h-16", "w-16", "rounded-full");

      // Genearating content for the Image from api
      image.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
      image.alt = superhero.name;

      // Creating button element (favoriteBtn)
      const addToFavoritesButton = document.createElement("button");
      addToFavoritesButton.classList.add(
        "text-sm",
        "font-semibold",
        "leading-6",
        "text-indigo-600"
      );
      addToFavoritesButton.textContent = "Add to Favorites";

      // Appending elements to listItem
      listItem.appendChild(image);
      listItem.appendChild(container);
      container.appendChild(heroName);
      container.appendChild(addToFavoritesButton);
      addToFavoritesButton.addEventListener("click", () => {
        alert("Added to favorites");
        addToFavorites(superhero);
      });
      return listItem;
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

        // Optionally, you can also update the UI to reflect the change
        // updateFavoritesUI();
      }
    }
  }
});

// // Function to fetch superheroes
// function fetchSuperheroes(searchQuery) {
//   const ts = new Date().getTime();
//   const hash = generateHash(ts);

//   // Build the API URL
//   const apiUrl = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${searchQuery}`;
//   //   console.log(apiUrl);
//   fetch(apiUrl)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data); // Log the API response to the console
//       displaySuperheros(data.data.results);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// }

// fetchSuperheroes();

// // Function to update the UI with favorite superheroes
// function updateFavoritesUI() {
//   // Get the list of favorite superheroes from local storage
//   const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//   // Display the list of favorite superheroes on the Favorites page
//   const favoritesList = document.getElementById("favoritesList");
//   favoritesList.innerHTML = "";

//   favorites.forEach((superhero) => {
//     const listItem = createSuperheroCard(superhero);
//     favoritesList.appendChild(listItem);
//   });
// }

// heroName.addEventListener("click", function (superhero) {
//   const image = document.createElement("img");
//   image.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
//   heroDetails.appendChild(image);

//   const heroName = document.createElement("h1");
//   heroName.textContent = superhero.name;
// });

// // Event listener for superhero name click
// resultsDiv.addEventListener("click", function (event) {
//   // Check if the clicked element is a superhero name
//   if (event.target.classList.contains("superhero-name")) {
//     // Retrieve the superhero data associated with the clicked name
//     const superhero = getSuperheroData(event.target.textContent);

//     // Create and append elements to display superhero details
//     const heroImage = document.createElement("img");
//     heroImage.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
//     heroDetails.appendChild(heroImage);

//     const heroName = document.createElement("h1");
//     heroName.textContent = superhero.name;
//     heroDetails.appendChild(heroName);

//     // Add more code to display additional superhero details as needed
//   }
// });

// Declaring variables
// const publicKey = "aa8d2c97a0b1e7e43b43c53c6cb43fe5";
// const privateKey = "b0ab8fffa5842c325373feaad517b0b6d50b3585";
// const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
// const ts = new Date().getTime();

// //Declaring functions

// function generateHash() {
//   const hash = CryptoJS.MD5(ts + publicKey + privateKey).toString();
//   //   console.log(hash);
//   return hash;
// }

// const hash = generateHash();

// // const apiUrl = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
// const apiUrl = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${searchQuery}`;
// console.log(apiUrl);

// fetch(apiUrl)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error("Error fetching the data", error);
//   });

// // Function to create a super hero card

// function createSuperHero(superhero) {
//   //Creating list element
//   const listItem = document.createElement("li");
//   listItem.classList.add("list");

//   // Creating anchor element
//   const heroName = document.createElement("a");
//   heroName.classList.add("name");

//   // Generating content for heroName from api
//   heroName.textContent = superhero.name;
//   heroName.href = `herodetail.html`;

//   // Creating img element
//   const img = document.createElement("img");
//   img.classList.add("img");

//   // Generating image from the api
//   img.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
//   img.alt = superhero.name;

//   // Creatin button element (favoriteBtn)
//   const btnFavorite = document.createElement("button");
//   btnFavorite.classList.add("btn");
//   btnFavorite.textContent = "Add to favorite";
//   // Appending elements to listItem
//   listItem.appendChild(img);
//   listItem.appendChild(heroName);
//   listItem.appendChild(btnFavorite);
//   console.log(listItem);

//   return listItem;
// }
