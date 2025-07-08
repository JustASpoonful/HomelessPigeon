chrome.storage.local.get("pigeonbrain", (data) => {
  if (!data.pigeonbrain) return;

  const script = document.createElement("script");
  script.textContent = data.pigeonbrain;
  document.documentElement.appendChild(script);
  script.remove();
});
