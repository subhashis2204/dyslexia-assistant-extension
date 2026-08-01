// Load existing settings when Options page opens
chrome.storage.sync.get(
  ["azure_endpoint", "azure_deployment", "azure_key"],
  (res) => {
    if (res.azure_endpoint)
      document.getElementById("endpoint").value = res.azure_endpoint;
    if (res.azure_deployment)
      document.getElementById("deployment").value = res.azure_deployment;
    if (res.azure_key) document.getElementById("apiKey").value = res.azure_key;
  },
);

// Save settings to Chrome storage
document.getElementById("saveBtn").addEventListener("click", () => {
  const endpoint = document
    .getElementById("endpoint")
    .value.trim()
    .replace(/\/$/, ""); // Remove trailing slash
  const deployment = document.getElementById("deployment").value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();

  chrome.storage.sync.set(
    {
      azure_endpoint: endpoint,
      azure_deployment: deployment,
      azure_key: apiKey,
    },
    () => {
      const status = document.getElementById("status");
      status.innerText = "Settings saved successfully!";
      setTimeout(() => {
        status.innerText = "";
      }, 2000);
    },
  );
});
