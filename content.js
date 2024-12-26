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
      pokemon.remove();
    });
      

    // Despawn
    setTimeout(() => pokemon.remove(), 2000);
  }
  
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
  

  setInterval(spawnPokemon, 1000);
//   setInterval(spawnPokemon, 10 * 60 * 1000);

  