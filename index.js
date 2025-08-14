/* This is an example JavaScript file, feel free to remove/edit it anytime */
// console.log(
//   "%cProject by BigDevSoon",
//   'font-size: 40px; font-weight: bold; color: #8A2BE2; font-family: "Comic Sans MS", cursive, sans-serif;'
// );
// console.log("Check out more projects at https://bigdevsoon.me");

const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const clearIcon = document.querySelector(".search-close-icon");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
  allPokemons = data.results;
  displayPokemons(allPokemons)
})

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
    ]);
    return true;
  } catch(error) {
    console.error(error);
  }
}

function displayPokemons(pokemons) {
  listWrapper.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = /*html*/ `
      <div class="number-wrap">
        <p class="caption-fonts">#${pokemonID}</p>
      </div>
      <div class="img-wrap">
      <img
      src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
      alt="${pokemon.name}"
      />
      </div>
      <div class="name-wrap">
        <p class="body3-fonts">#${pokemon.name}</p>
      </div>
    `

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if(success) {
        window.location.href = `details.html?id=${pokemonID}`;
      }
    })

    listWrapper.appendChild(listItem)
  });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if(numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.includes(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => 
      pokemon.name.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);

  if(filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }

  if (searchInput.value !== '') {
    clearIcon.style.display = "block";
  } else {
    clearIcon.style.display = "none";
  }
}

clearIcon.addEventListener("click", function(e) {
  searchInput.value = '';
  clearIcon.style.display = "none";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
})