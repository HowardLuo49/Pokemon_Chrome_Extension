function spawnPokemon() {
    const pokemon = document.createElement('img');
    pokemon.src = chrome.runtime.getURL('sprites/pikachu.png'); // Replace with random sprite logic
    pokemon.style.position = 'fixed';
    pokemon.style.left = `${Math.random() * window.innerWidth}px`;
    pokemon.style.top = `${Math.random() * window.innerHeight}px`;
    pokemon.style.width = '50px'; // Set sprite width
    pokemon.style.height = '50px'; // Set sprite height
    pokemon.style.zIndex = 10000;
    pokemon.style.cursor = 'pointer';
  
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
  
  function showCaughtImage(centerX, centerY, spriteHeight) {
    const caughtImage = document.createElement('img');
    caughtImage.src = chrome.runtime.getURL('static/caught.png');
    caughtImage.style.position = 'fixed';
    caughtImage.style.zIndex = 10001;
  
    // Scale "Caught" image to match sprite's height and align centers
    caughtImage.onload = () => {
      const aspectRatio = caughtImage.naturalWidth / caughtImage.naturalHeight;
      const caughtHeight = spriteHeight;
      const caughtWidth = spriteHeight * aspectRatio;
  
      caughtImage.style.width = `${caughtWidth}px`;
      caughtImage.style.height = `${caughtHeight}px`;
      caughtImage.style.left = `${centerX - caughtWidth / 2}px`;
      caughtImage.style.top = `${centerY - caughtHeight / 2}px`;
    };
  
    document.body.appendChild(caughtImage);
  
    // Remove the "Caught" image after 2 seconds
    setTimeout(() => caughtImage.remove(), 2000);
  }
  
  // Spawn Pokémon every 10 seconds
  setInterval(spawnPokemon, 1000);
  