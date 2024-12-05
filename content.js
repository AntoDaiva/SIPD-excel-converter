// content.js
const script = document.createElement("script");
script.src = chrome.runtime.getURL("bundle.js");
script.onload = function () {
    this.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
    // Ensure the message is from the injected script
    if (event.source !== window || event.data.type !== "INTERCEPTED_DATA") {
        return;
    }

    const { data } = event.data;
    // console.log("Content script received data:", data);

    // Relay the intercepted data to the background script
    chrome.runtime.sendMessage({ type: "interceptedData", data }, (response) => {
        // console.log("Background script response:", response);
    });
});