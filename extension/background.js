// Fetch script contents at install time (or first load)
let pigeonScriptCode = '';

fetch('https://homelesspigeon.vercel.app/core/pigeonbrain.js')
  .then(res => res.text())
  .then(code => pigeonScriptCode = code)
  .catch(err => console.error('Failed to fetch pigeon script:', err));

// Automatically inject into every tab on load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && pigeonScriptCode) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: (code) => {
        const script = document.createElement('script');
        script.textContent = code;
        document.documentElement.appendChild(script);
      },
      args: [pigeonScriptCode]
    });
  }
});
