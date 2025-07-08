document.getElementById("updateBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Updating...";

  try {
    const res = await fetch("https://homelesspigeon.vercel.app/core/pigeonbrain.js");
    const code = await res.text();
    await chrome.storage.local.set({ pigeonbrain: code });
    status.textContent = "Pigeon updated successfully.";
  } catch (err) {
    console.error(err);
    status.textContent = "Update failed.";
  }
});
