chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "injectPigeon") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: new Function(message.code),
      world: "MAIN" // or "ISOLATED" depending on what you want
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Injection failed:", chrome.runtime.lastError);
      }
    });
  }
});
