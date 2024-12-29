let pokemonSprites = [];
let caughtPokemonSet = new Set();

console.log("content.js is running!");

// Function to save caughtPokemonSet to Chrome Storage
function saveProgress() {
    chrome.storage.local.set({ caughtPokemon: Array.from(caughtPokemonSet) }, () => {
        console.log("Progress saved:", caughtPokemonSet);
    });
}

// Load saved progress
chrome.storage.local.get("caughtPokemon", (data) => {
    if (data.caughtPokemon) {
        caughtPokemonSet = new Set(data.caughtPokemon);
        console.log("Progress loaded:", caughtPokemonSet);
    }
});

// Load all pokemon names
fetch(chrome.runtime.getURL("data/pokemon_names.txt"))
    .then(response => response.text())
    .then(text => {
        pokemonSprites = text.split("\n").filter(name => name.trim() !== "");
        console.log("Loaded Pokémon sprites:", pokemonSprites);
    })
    .catch(error => console.error("Failed to load Pokémon names:", error));

// Get a random pokemon to spawn in
function getRandomSprite() {
    if (pokemonSprites.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pokemonSprites.length);
    return pokemonSprites[randomIndex];
}

// Spawn in a random pokemon
function spawnPokemon() {
    const sprite = getRandomSprite();
    const pokemon = document.createElement('img');
    pokemon.src = chrome.runtime.getURL(`sprites/${sprite}`);
    pokemon.style.position = 'fixed';
    pokemon.style.left = `${Math.random() * window.innerWidth}px`;
    pokemon.style.top = `${Math.random() * window.innerHeight}px`;
    pokemon.style.width = '100px';
    pokemon.style.height = '100px';
    pokemon.style.zIndex = 10000;
    pokemon.style.cursor = 'pointer';

    // Randomize rotation angle
    const randomRotation = Math.random() * 90 - 45;
    pokemon.style.transform = `rotate(${randomRotation}deg)`;
  
    document.body.appendChild(pokemon);
  
    pokemon.addEventListener('click', () => {
        const { left, top, width, height } = pokemon.getBoundingClientRect();
        showCaughtImage(left + width / 2, top + height / 2, height);
        caughtPokemonSet.add(sprite);
        pokemon.remove();
    });

    saveProgress();

    // Despawn
    setTimeout(() => pokemon.remove(), 2000);
}
  
// Catch confirm
function showCaughtImage(centerX, centerY) {
    const caughtImage = document.createElement("img");
    caughtImage.src = chrome.runtime.getURL("static/caught.png");
    caughtImage.style.position = "fixed";
    caughtImage.style.zIndex = 10001;
    caughtImage.style.visibility = "hidden";

    caughtImage.onload = () => {
        const caughtWidth = caughtImage.naturalWidth;
        const caughtHeight = caughtImage.naturalHeight;

        caughtImage.style.left = `${centerX - caughtWidth / 2}px`;
        caughtImage.style.top = `${centerY - caughtHeight / 2}px`;

        caughtImage.style.visibility = "visible";
    };

    document.body.appendChild(caughtImage);

    // Despawn "Caught"
    setTimeout(() => caughtImage.remove(), 1000);
}

// Number of caught pokemon & list of uncaught pokemon
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_CAUGHT_AND_UNCAUGHT") {
        const uncaughtList = pokemonSprites.filter((pokemon) => !caughtPokemonSet.has(pokemon)).map((pokemon) => pokemon.replace(".png", "")).sort((a, b) => a.localeCompare(b));
        console.log("Sending caught count and un-caught list:", {
          caughtCount: caughtPokemonSet.size,
          uncaughtList
        });
    
        sendResponse({
          caughtCount: caughtPokemonSet.size,
          uncaughtList
        });
        return true;
      }
});  

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "RESET_PROGRESS") {
        caughtPokemonSet.clear();
        chrome.storage.local.set({ caughtPokemon: [] }, () => {
            console.log("Progress reset. Caught Pokemon set cleared.");
            sendResponse({ success: true });
        });
        return true;
    }
});

function scheduleNextSpawn() {
    const interval = Math.random() * (10 - 5) * 60 * 1000 + 5 * 60 * 1000;
    console.log(`Next spawn in: ${(interval / 1000 / 60).toFixed(2)} minutes.`);
    setTimeout(spawnPokemon, interval);
}
  
// Start spawning
scheduleNextSpawn();

// setInterval(spawnPokemon, 1000);
// setInterval(spawnPokemon, 10 * 60 * 1000);