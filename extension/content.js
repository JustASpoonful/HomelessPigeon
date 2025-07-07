chrome.storage.local.get("remoteCode", (result) => {
  if (result.remoteCode) {
    const script = document.createElement("script");
    script.textContent = result.remoteCode;
    document.documentElement.appendChild(script);
    script.remove(); // Clean up after injection
  } else {
    console.warn("⚠️ No remote code found in storage");
  }
});
