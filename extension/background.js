// Pigeon and Cursor Integration Script

// Create and style the pigeon image
var img = document.createElement('img');
var idleSrc = 'https://homelesspigeon.vercel.app/PigeonIdle.gif';
var walkSrc = 'https://homelesspigeon.vercel.app/PigeonWalk.gif';
var walkSound = new Audio('https://homelesspigeon.vercel.app/walk.wav'); // Walk sound file
var rareGifs = [
    { src: 'https://homelesspigeon.vercel.app/PigeonRare1.gif', chance: 0.001 },
    { src: 'https://homelesspigeon.vercel.app/PigeonRare2.gif', chance: 0.000001 }
];
img.src = idleSrc;
img.style.position = 'fixed';
img.style.bottom = '0px';
img.style.right = '0px';
img.style.zIndex = 9999;
img.setAttribute('draggable', false);
document.body.appendChild(img);

var speed = 5; // Original speed
var direction = {x: 1, y: 1};
var chasing = false;
var chaseTimeout;
var isWalking = false;
var isRareIdle = false;

// Create and style custom cursors
const customCursor = document.createElement('div');
customCursor.id = 'customCursor';
customCursor.style.position = 'absolute';
customCursor.style.width = '30px';
customCursor.style.height = '30px';
customCursor.style.pointerEvents = 'none';
customCursor.style.backgroundImage = 'url(https://www.freeiconspng.com/thumbs/cursor-png/cursor-png-ico-icns-free-icon-download--icon100m-20.png)';
customCursor.style.backgroundSize = 'contain';
customCursor.style.backgroundRepeat = 'no-repeat';
customCursor.style.zIndex = 10;
customCursor.style.display = 'block'; // Always show replacement cursor
document.body.appendChild(customCursor);

const newCursor = document.createElement('div');
newCursor.id = 'newCursor';
newCursor.style.position = 'absolute';
newCursor.style.width = '30px';
newCursor.style.height = '30px';
newCursor.style.pointerEvents = 'none';
newCursor.style.backgroundImage = 'url(https://www.freeiconspng.com/thumbs/cursor-png/cursor-png-ico-icns-free-icon-download--icon100m-20.png)';
newCursor.style.backgroundSize = 'contain';
newCursor.style.backgroundRepeat = 'no-repeat';
newCursor.style.zIndex = 11;
newCursor.style.display = 'none'; // Initially hidden
document.body.appendChild(newCursor);

let flying = false;

function flyCursor() {
    const startX = parseFloat(customCursor.style.left);
    const startY = parseFloat(customCursor.style.top);
    const endX = Math.random() * (window.innerWidth - 30);
    const endY = Math.random() * (window.innerHeight - 30);

    const duration = 5000; // 5 seconds
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1); // Normalize progress (0 to 1)

        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        customCursor.style.left = currentX + 'px';
        customCursor.style.top = currentY + 'px';

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function resetCursor() {
    flying = false;
    customCursor.style.display = 'block'; // Show original cursor
    newCursor.style.display = 'none'; // Hide new cursor
}

// Add event listener to move the custom cursor
document.addEventListener('mousemove', (e) => {
    if (!flying) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    } else {
        newCursor.style.left = e.clientX + 'px';
        newCursor.style.top = e.clientY + 'px';
    }
});

// Button to trigger cursor flight
const button = document.createElement('button');
button.id = 'flyCursorButton';
button.textContent = 'Fly Cursor';
button.style.position = 'fixed';
button.style.bottom = '10px';
button.style.right = '10px';
button.style.zIndex = 10000;
button.style.padding = '10px 20px';
button.style.fontSize = '16px';
document.body.appendChild(button);

button.addEventListener('click', () => {
    if (!flying) {
        flying = true;
        flyCursor();

        setTimeout(() => {
            customCursor.style.display = 'none'; // Hide original cursor
            newCursor.style.display = 'block'; // Show new replacement cursor
        }, 5000);
    } else {
        resetCursor(); // Reset cursor for the next click
    }
});

// Pigeon movement and animation
document.addEventListener('mousemove', function(e) {
    if (chasing) {
        var x = e.clientX;
        var y = e.clientY;
        img.style.right = (window.innerWidth - x - 50) + 'px';
        img.style.bottom = (window.innerHeight - y - 50) + 'px';
    }
});

img.addEventListener('click', function() {
    chasing = true;
    clearTimeout(chaseTimeout);
    flyCursor(); // Trigger cursor flight on pigeon click
    chaseTimeout = setTimeout(function() {
        chasing = false;
    }, 3000);
});

setInterval(function() {
    if (!chasing) {
        var x = parseInt(img.style.right);
        var y = parseInt(img.style.bottom);

        if (x > window.innerWidth - 100 || x < 0) direction.x *= -1;
        if (y > window.innerHeight - 100 || y < 0) direction.y *= -1;

        if (speed > 0 && !isWalking) {
            img.src = walkSrc;
            walkSound.play(); // Play walk sound
            isWalking = true;
        } else if (speed === 0 && isWalking) {
            img.src = idleSrc;
            isWalking = false;
            isRareIdle = false;
        }

        // Randomly choose whether to move horizontally or vertically
        if (Math.random() >= 0.5) {
            img.style.right = (x + speed * direction.x) + 'px';
        } else {
            img.style.bottom = (y + speed * direction.y) + 'px';
        }
    }
}, 20);

setInterval(function() {
    if (!chasing) {
        speed = Math.random() < 0.5 ? 0 : 5; // Original idle logic
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

// Honk sound effect
var honkSound = new Audio('nah.wav');
setInterval(function() {
    if (Math.random() < 0.05) {
        honkSound.play();
    }
}, 1000);
