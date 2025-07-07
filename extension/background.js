async function fetchAndStoreScript() {
  try {
    const res = await fetch("https://homelesspigeon.vercel.app/core/pigeonbrain.js");
    const code = await res.text();
    await chrome.storage.local.set({ remoteCode: code });
    console.log("✅ Remote code saved to storage");
  } catch (e) {
    console.error("❌ Failed to fetch remote code:", e);
  }
}

// Run once on install/startup
chrome.runtime.onInstalled.addListener(fetchAndStoreScript);
chrome.runtime.onStartup.addListener(fetchAndStoreScript);

// Run code on tab load
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === "complete" && /^https?:/.test(tab.url)) {
    chrome.storage.local.get("remoteCode", ({ remoteCode }) => {
      if (!remoteCode) return;

      chrome.scripting.executeScript({
        target: { tabId },
        func: new Function(remoteCode) // injects code safely
      });
    });
  }
});
