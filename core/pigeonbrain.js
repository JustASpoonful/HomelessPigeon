// Variables
var speed = 1; // Customizable speed (lower value for smoother walking)
var pigeonElement = document.createElement('img');
var isIdle = true;
var isRunningAway = false;
var gifChance = 0.05; // Customize rarity for rare GIF
var rainbowChance = 0.01; // Very rare chance to turn screen rainbow
var mudDuration = 5000; // 5 seconds
var rainbowDuration = 5000; // 5 seconds

// Pigeon setup
pigeonElement.src = 'https://homelesspigeon.vercel.app/core/PigeonIdle.gif';
pigeonElement.style.position = 'absolute';
pigeonElement.style.zIndex = '9999';
document.body.appendChild(pigeonElement);

// Pigeon position
var targetX = Math.random() * (window.innerWidth - 100);
var targetY = Math.random() * (window.innerHeight - 100);

// Random movement function
function movePigeon() {
    if (!isRunningAway) {
        let deltaX = targetX - pigeonElement.offsetLeft;
        let deltaY = targetY - pigeonElement.offsetTop;
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Normalize movement
        if (distance > 1) {
            pigeonElement.style.left = Math.max(0, Math.min(window.innerWidth - 100, pigeonElement.offsetLeft + (deltaX / distance) * speed)) + 'px';
            pigeonElement.style.top = Math.max(0, Math.min(window.innerHeight - 100, pigeonElement.offsetTop + (deltaY / distance) * speed)) + 'px';
        } else {
            // Set a new target when close to the current one
            targetX = Math.random() * (window.innerWidth - 100);
            targetY = Math.random() * (window.innerHeight - 100);
        }

        // Flip horizontally
        if (Math.random() < 0.5) {
            pigeonElement.style.transform = 'scaleX(-1)';
        } else {
            pigeonElement.style.transform = 'scaleX(1)';
        }

        // Change GIF for walking
        if (isIdle) {
            pigeonElement.src = 'https://homelesspigeon.vercel.app/core/PigeonWalk.gif';
            isIdle = false;
        }

        // Check for rare GIF
        if (Math.random() < gifChance) {
            pigeonElement.src = 'YOUR_RARE_GIF_URL_HERE'; // Add your rare GIF URL
            setTimeout(() => {
                pigeonElement.src = 'https://homelesspigeon.vercel.app/core/PigeonWalk.gif'; // Back to walking
            }, 2000); // Adjust duration as needed
        }

        // Check for rainbow effect
        if (Math.random() < rainbowChance) {
            document.body.style.backgroundColor = 'rainbow'; // Implement rainbow effect
            setTimeout(() => {
                document.body.style.backgroundColor = ''; // Reset background
            }, rainbowDuration);
        }

        // Random sound
        if (Math.random() < 0.1) { // 10% chance to play sound
            var audio = new Audio('https://homelesspigeon.vercel.app/core/nah.wav');
            audio.play();
        }

        // Continue moving
        requestAnimationFrame(movePigeon);
    }
}

// Click event to run away
pigeonElement.addEventListener('click', function(event) {
    isRunningAway = true;
    var deltaX = event.clientX - pigeonElement.offsetLeft;
    var deltaY = event.clientY - pigeonElement.offsetTop;

    // Move in the opposite direction
    var angle = Math.atan2(deltaY, deltaX);
    var runX = Math.cos(angle) * speed * 10; // Adjust the run speed
    var runY = Math.sin(angle) * speed * 10;

    function runAway() {
        pigeonElement.style.left = Math.max(0, Math.min(window.innerWidth - 100, pigeonElement.offsetLeft - runX)) + 'px';
        pigeonElement.style.top = Math.max(0, Math.min(window.innerHeight - 100, pigeonElement.offsetTop - runY)) + 'px';

        if (isRunningAway) {
            requestAnimationFrame(runAway);
        }
    }

    runAway();

    setTimeout(() => {
        isRunningAway = false;
    }, 4000); // Run away duration
});

// Mud tracking effect
function mudTracking() {
    pigeonElement.style.filter = 'blur(5px)'; // Simulate mud
    setTimeout(() => {
        pigeonElement.style.filter = ''; // Remove mud effect
    }, mudDuration);
}

// Call move function
movePigeon();
