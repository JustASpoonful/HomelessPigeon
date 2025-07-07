chrome.runtime.onInstalled.addListener(() => {
  fetchAndStoreScript();
});

chrome.runtime.onStartup.addListener(() => {
  fetchAndStoreScript();
});

function fetchAndStoreScript() {
  fetch("https://yourdomain.com/latest-script.js")
    .then(res => res.text())
    .then(code => {
      chrome.storage.local.set({ remoteCode: code }, () => {
        console.log("✅ Remote code saved to storage");
      });
    })
    .catch(err => console.error("❌ Failed to fetch remote code:", err));
}
