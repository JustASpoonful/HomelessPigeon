function injectPigeon(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      if (document.getElementById('pigeon-pet')) return; // avoid duplicates

      var img = document.createElement('img');
      img.id = 'pigeon-pet';
      var idleSrc = 'https://homelesspigeon.vercel.app/core/PigeonIdle.gif';
      var walkSrc = 'https://homelesspigeon.vercel.app/core/PigeonWalk.gif';
      var walkSound = new Audio('https://homelesspigeon.vercel.app/core/Walk.wav');
      var honkSound = new Audio('https://homelesspigeon.vercel.app/core/nah.wav');
      var rareGifs = [
        { src: 'https://homelesspigeon.vercel.app/core/robloxtested.png', chance: 0.001 },
        { src: 'https://homelesspigeon.vercel.app/core/PigeonRare2.gif', chance: 0.000001 }
      ];

      img.src = idleSrc;
      img.style.position = 'fixed';
      img.style.bottom = '0px';
      img.style.right = '0px';
      img.style.zIndex = 9999999;
      img.style.userSelect = 'none';
      img.setAttribute('draggable', false);

      document.body.appendChild(img);

      var speed = 3;
      var chasing = false;
      var direction = { x: 1, y: 1 };
      var isWalking = false;
      var isRareIdle = false;

      setInterval(function() {
        if (!chasing) {
          var x = parseInt(img.style.right) || 0;
          var y = parseInt(img.style.bottom) || 0;

          if (x > window.innerWidth - 100 || x < 0) direction.x *= -1;
          if (y > window.innerHeight - 100 || y < 0) direction.y *= -1;

          img.style.transform = direction.x === 1 ? 'scaleX(1)' : 'scaleX(-1)';

          if (speed > 0 && !isWalking) {
            img.src = walkSrc;
            walkSound.play().catch(() => {});
            isWalking = true;
          } else if (speed === 0 && isWalking) {
            img.src = idleSrc;
            isWalking = false;
            isRareIdle = false;
          }

          if (Math.random() >= 0.89) {
            img.style.right = (x + speed * direction.x) + 'px';
          } else {
            img.style.bottom = (y + speed * direction.y) + 'px';
          }
        }
      }, 20);

      setInterval(function() {
        if (!chasing) {
          speed = Math.random() < 0.5 ? 0 : 5;
          if (speed === 0 && !isRareIdle) {
            rareGifs.forEach(function(gif) {
              if (Math.random() < gif.chance) {
                img.src = gif.src;
                isRareIdle = true;
              }
            });
          }

          direction.x = Math.random() < 0.5 ? -1 : 1;
          direction.y = Math.random() < 0.5 ? -1 : 1;
        }
      }, 1000);

      setInterval(function() {
        if (Math.random() < 0.05) {
          honkSound.play().catch(() => {});
        }
      }, 1000);
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.startsWith('http')
  ) {
    injectPigeon(tabId);
  }
});
