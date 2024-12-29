// Number of caught pokemon & list of uncaught pokemon
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  
    if (request.type === "GET_CAUGHT_AND_UNCAUGHT") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
            } else {
                sendResponse({ caughtCount: 0, uncaughtList: [] });
            }
        });
        return true;
    }
  });