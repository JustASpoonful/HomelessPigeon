// Variables
var speed = 5; // Customizable speed
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

// Random movement function
function movePigeon() {
    if (!isRunningAway) {
        let targetX = Math.random() * (window.innerWidth - 100);
        let targetY = Math.random() * (window.innerHeight - 100);

        let deltaX = targetX - pigeonElement.offsetLeft;
        let deltaY = targetY - pigeonElement.offsetTop;
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Normalize the movement
        if (distance > 1) {
            let moveX = (deltaX / distance) * speed;
            let moveY = (deltaY / distance) * speed;

            pigeonElement.style.left = Math.max(0, Math.min(window.innerWidth - 100, pigeonElement.offsetLeft + moveX)) + 'px';
            pigeonElement.style.top = Math.max(0, Math.min(window.innerHeight - 100, pigeonElement.offsetTop + moveY)) + 'px';
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

        // Move pigeon every 50 ms
        setTimeout(movePigeon, 50);
    }
}

// Click event to run away
pigeonElement.addEventListener('click', function(event) {
    isRunningAway = true;
    var deltaX = event.clientX - pigeonElement.offsetLeft;
    var deltaY = event.clientY - pigeonElement.offsetTop;
    
    // Move in the opposite direction
    var angle = Math.atan2(deltaY, deltaX);
    var x = Math.cos(angle) * speed * 10; // Adjust the run speed
    var y = Math.sin(angle) * speed * 10;

    // Run away smoothly
    function runAway() {
        if (isRunningAway) {
            pigeonElement.style.left = Math.max(0, Math.min(window.innerWidth - 100, pigeonElement.offsetLeft - x)) + 'px';
            pigeonElement.style.top = Math.max(0, Math.min(window.innerHeight - 100, pigeonElement.offsetTop - y)) + 'px';
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
