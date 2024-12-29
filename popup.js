// Number of caught pokemon & list of uncaught pokemon
chrome.runtime.sendMessage({ type: "GET_CAUGHT_AND_UNCAUGHT" }, (response) => {
  const countElement = document.getElementById("caught-count");
  const dropdown = document.getElementById("dropdown");

    if (chrome.runtime.lastError) {
        console.error("Error contacting background.js:", chrome.runtime.lastError.message);
        countElement.textContent = "Unable to fetch caught count.";
        dropdown.innerHTML = "<option>Error loading data</option>";
        return;
    }

    if (response && response.caughtCount !== undefined && response.uncaughtList !== undefined) {
        countElement.textContent = `Unique Pokemon caught: ${response.caughtCount}`;

        dropdown.innerHTML = "";
        response.uncaughtList.forEach((pokemon) => {
            const option = document.createElement("option");
            option.textContent = pokemon;
            dropdown.appendChild(option);
        });
    } else {
        countElement.textContent = "Unable to fetch caught count.";
        dropdown.innerHTML = "<option>Error loading data</option>";
        console.error("Unexpected response:", response);
    }
});
