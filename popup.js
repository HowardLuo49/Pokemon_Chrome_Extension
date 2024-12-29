const resetButton = document.getElementById("reset-button");

// Reset progress when button is clicked
resetButton.addEventListener("click", () => {
    const userConfirmed = confirm("Are you sure? This will clear your catch history.");
    if (userConfirmed) {
        chrome.runtime.sendMessage({ type: "RESET_PROGRESS" }, (response) => {
            if (chrome.runtime.lastError) {
                return;
            }

            console.log("Progress reset:", response);
            document.getElementById("caught-count").textContent = "Unique Pokemon caught: 0";
        });
    }
});

// Number of caught pokemon & list of uncaught pokemon
chrome.runtime.sendMessage({ type: "GET_CAUGHT_AND_UNCAUGHT" }, (response) => {
  const countElement = document.getElementById("caught-count");
  const dropdown = document.getElementById("dropdown");

    if (chrome.runtime.lastError) {
        countElement.textContent = "Extension can't work on this page.";
        dropdown.innerHTML = "<option>Extension can't work on this page.</option>";
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
        countElement.textContent = "Extension can't work on this page.";
        dropdown.innerHTML = "<option>Extension can't work on this page.</option>";
        return;
    }
});
