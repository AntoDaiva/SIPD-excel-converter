let interceptedData = [];

function storeInterceptedData(data) {
  interceptedData.push(data);
  console.log("Stored intercepted data:", interceptedData);
}

// Store intercepted data when an API response is detected
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "interceptedData") {
    storeInterceptedData(message.data);
    sendResponse({ data: interceptedData });
  } else {
    sendResponse({ error: "Unknown message type" });
  }
  return true; // Keeps the messaging channel open for async responses
});
