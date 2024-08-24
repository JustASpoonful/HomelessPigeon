const scriptUrl = 'https://homelesspigeon.vercel.app/script.js';

async function updateScript() {
  try {
    const response = await fetch(scriptUrl);
    if (response.ok) {
      const scriptContent = await response.text();
      chrome.scripting.executeScript({
        target: { allFrames: true },
        func: new Function(scriptContent)
      });
    } else {
      console.error('Failed to fetch the script:', response.status);
    }
  } catch (error) {
    console.error('Error updating the script:', error);
  }
}

// Check for updates every hour
setInterval(updateScript, 3600000);

// Initial update
updateScript();
