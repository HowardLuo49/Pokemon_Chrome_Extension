let pokemonSprites = [];
  
fetch(chrome.runtime.getURL("data/pokemon_names.txt"))
  .then(response => response.text())
  .then(text => {
    pokemonSprites = text.split("\n").filter(name => name.trim() !== "");
    console.log("Loaded Pokémon sprites:", pokemonSprites);
  })
  .catch(error => console.error("Failed to load Pokémon names:", error));

function getRandomSprite() {
  if (pokemonSprites.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * pokemonSprites.length);
  return pokemonSprites[randomIndex];
}

function spawnPokemon() {
    const sprite = getRandomSprite();
    const pokemon = document.createElement('img');
    pokemon.src = chrome.runtime.getURL(`sprites/${sprite}`);
    pokemon.style.position = 'fixed';
    pokemon.style.left = `${Math.random() * window.innerWidth}px`;
    pokemon.style.top = `${Math.random() * window.innerHeight}px`;
    pokemon.style.width = '100px'; // Set sprite width
    pokemon.style.height = '100px'; // Set sprite height
    pokemon.style.zIndex = 10000;
    pokemon.style.cursor = 'pointer';

    // Randomize rotation angle
    const randomRotation = Math.random() * 90 - 45; // Angle between 0 and 360 degrees
    pokemon.style.transform = `rotate(${randomRotation}deg)`;
  
    document.body.appendChild(pokemon);
  
    // Add click event to catch Pokémon
    pokemon.addEventListener('click', () => {
      // Get Pokémon's position and size
      const { left, top, width, height } = pokemon.getBoundingClientRect();
      // Display the "Caught" image at the same position
      showCaughtImage(left + width / 2, top + height / 2, height);
  
      // Remove the Pokémon
      pokemon.remove();
    });
      
  
    // Remove Pokémon after 5 seconds if not clicked
    setTimeout(() => pokemon.remove(), 5000);
  }
  
  function showCaughtImage(centerX, centerY) {
    const caughtImage = document.createElement("img");
    caughtImage.src = chrome.runtime.getURL("static/caught.png");
    caughtImage.style.position = "fixed";
    caughtImage.style.zIndex = 10001;
    caughtImage.style.visibility = "hidden"; // Initially hide the image
  
    // Center the "Caught" image without resizing
    caughtImage.onload = () => {
      const caughtWidth = caughtImage.naturalWidth;
      const caughtHeight = caughtImage.naturalHeight;
  
      // Position the image correctly
      caughtImage.style.left = `${centerX - caughtWidth / 2}px`;
      caughtImage.style.top = `${centerY - caughtHeight / 2}px`;
  
      // Make the image visible after positioning
      caughtImage.style.visibility = "visible";
    };
  
    document.body.appendChild(caughtImage);
  
    // Remove the "Caught" image after 2 seconds
    setTimeout(() => caughtImage.remove(), 2000);
  }
  

  // Spawn Pokémon every second
  setInterval(spawnPokemon, 1000);

  