// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
    // fetch the pigeon code
    fetch('https://homelesspigeon.vercel.app/core/pigeonbrain.js')
      .then(res => res.text())
      .then(source => {
        // inject into the page's MAIN world
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          world: 'MAIN',
          func: new Function(source)
        });
      })
      .catch(console.error);
  }
});
