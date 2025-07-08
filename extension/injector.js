chrome.storage.local.get("pigeonbrain", (data) => {
  if (!data.pigeonbrain) return;

  chrome.runtime.sendMessage({ type: "injectPigeon", code: data.pigeonbrain });
});
