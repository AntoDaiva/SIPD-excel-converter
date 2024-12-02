document.addEventListener("DOMContentLoaded", () => {
  const dataContainer = document.getElementById("data");
  if (!dataContainer) {
    console.error("Element with ID 'data' not found in popup.html.");
    return;
  }

  chrome.runtime.sendMessage({ type: "requestData" }, (response) => {
    console.log("Popup received data:", response);
    if (response && response.data && response.data.length > 0) {
      populateData(response.data);
    } else {
      dataContainer.innerText = "No intercepted data available.";
    }
  });
});

function populateData(data) {
  const dataContainer = document.getElementById("data");
  dataContainer.innerHTML = ""; // Clear existing content
  data.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = `Title: ${item.title}, Data: ${JSON.stringify(item)}`;
    dataContainer.appendChild(itemDiv);
  });
}
