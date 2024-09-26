(function() {
    var img = document.createElement('img');
    var idleSrc = 'https://homelesspigeon.vercel.app/core/PigeonIdle.gif';
    var walkSrc = 'https://homelesspigeon.vercel.app/core/PigeonWalk.gif';
    var walkSound = new Audio('https://homelesspigeon.vercel.app/core/Walk.wav');
    var rareGifs = [
        { src: 'https://homelesspigeon.vercel.app/core/robloxtested.png', chance: 0.001 },  
        { src: 'https://homelesspigeon.vercel.app/core/PigeonRare2.gif', chance: 0.000001 } 
    ];
    img.src = idleSrc;
    img.style.position = 'fixed';
    img.style.bottom = '0px';
    img.style.right = '0px';
    img.style.zIndex = 9999;
    img.setAttribute('draggable', false);
    document.body.appendChild(img);

    // Create mud element
    var mud = document.createElement('div');
    mud.style.position = 'fixed';
    mud.style.width = '20px'; // Width of the mud trail
    mud.style.height = '10px'; // Height of the mud trail
    mud.style.backgroundColor = 'brown'; // Brown color for mud
    mud.style.borderRadius = '10px'; // Make it oval
    mud.style.display = 'none'; // Initially hidden
    mud.style.zIndex = 9998; // Just below the pigeon
    document.body.appendChild(mud);

    var speed = 5;
    var direction = {x: 1, y: 1};
    var chasing = false;
    var isWalking = false;
    var isRareIdle = false;
    var isTrackingInMud = false;

    function trackInMud() {
        if (Math.random() < 0.5) { // 50% chance
            isTrackingInMud = true;
            mud.style.display = 'block'; // Show mud
            
            // Position mud slightly behind the pigeon
            var pigeonRect = img.getBoundingClientRect();
            mud.style.bottom = (pigeonRect.bottom + 5) + 'px'; // Position mud just behind pigeon
            mud.style.right = (pigeonRect.right - 15) + 'px'; // Center mud under pigeon

            setTimeout(() => {
                isTrackingInMud = false;
                mud.style.display = 'none'; // Hide mud after 5 seconds
            }, 5000); // Mud lasts for 5 seconds
        }
    }

    setInterval(function() {
        if (!chasing) {
            var x = parseInt(img.style.right);
            var y = parseInt(img.style.bottom);

            if (x > window.innerWidth - 100 || x < 0) direction.x *= -1;
            if (y > window.innerHeight - 100 || y < 0) direction.y *= -1;

            img.style.transform = direction.x === 1 ? 'scaleX(1)' : 'scaleX(-1)';

            if (speed > 0 && !isWalking) {
                img.src = walkSrc;
                walkSound.play();
                isWalking = true;
            } else if (speed === 0 && isWalking) {
                img.src = idleSrc;
                isWalking = false;
                isRareIdle = false;
            }

            if (Math.random() >= 0.8) {
                img.style.right = (x + speed * direction.x) + 'px';
            } else {
                img.style.bottom = (y + speed * direction.y) + 'px';
            }

            if (!isTrackingInMud) {
                trackInMud(); // Check for mud tracking
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

    var honkSound = new Audio('core/nah.wav');
    setInterval(function() {
        if (Math.random() < 0.05) {
            honkSound.play();
        }
    }, 1000);
})();
