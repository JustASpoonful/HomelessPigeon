(function() {
    var img = document.createElement('img');
    var idleSrc = 'https://homelesspigeon.vercel.app/PigeonIdle.gif';
    var walkSrc = 'https://homelesspigeon.vercel.app/PigeonWalk.gif';
    var walkSound = new Audio('https://homelesspigeon.vercel.app/walk.wav');
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

    var speed = 5;
    var direction = {x: 1, y: 0};
    var chasing = false;
    var chaseTimeout;
    var isWalking = false;
    var isRareIdle = false;
    var grabbedImage = null;
    var originalPosition = { left: '', top: '' };

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
        chaseTimeout = setTimeout(function() {
            chasing = false;
        }, 3000);
    });

    setInterval(function() {
        if (!chasing) {
            var x = parseInt(img.style.right);
            var y = parseInt(img.style.bottom);

            if (x > window.innerWidth - 100 || x < 0) direction.x *= -1;

            if (speed > 0 && !isWalking) {
                img.src = walkSrc;
                walkSound.play();
                isWalking = true;
            } else if (speed === 0 && isWalking) {
                img.src = idleSrc;
                isWalking = false;
                isRareIdle = false;
            }

            if (Math.random() < 0.95) {
                img.style.right = (x + speed * direction.x) + 'px';
            } else {
                direction.y = Math.random() < 0.5 ? -1 : 1;
                img.style.right = (x + speed * direction.x) + 'px';
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
            direction.y = 0;
        }
    }, 1000);

    setInterval(function() {
        if (!chasing && !grabbedImage && Math.random() < 0.001) { // Very rare chance to grab an image
            var images = document.getElementsByTagName('img');
            if (images.length > 0) {
                var randomImage = images[Math.floor(Math.random() * images.length)];
                grabbedImage = randomImage;
                originalPosition.left = randomImage.style.left;
                originalPosition.top = randomImage.style.top;
                randomImage.style.position = 'absolute';
                randomImage.style.zIndex = 9999;
                randomImage.style.left = img.style.right;
                randomImage.style.top = img.style.bottom;
                img.style.display = 'none'; // Hide pigeon while holding image
            }
        }

        if (grabbedImage) {
            // Make the pigeon drag the image with it
            grabbedImage.style.left = img.style.right;
            grabbedImage.style.top = img.style.bottom;

            if (Math.random() < 0.05) { // Chance to put the image back
                grabbedImage.style.left = originalPosition.left;
                grabbedImage.style.top = originalPosition.top;
                img.style.display = 'block'; // Show pigeon again
                grabbedImage = null;
            }
        }
    }, 1000);

    var honkSound = new Audio('nah.wav');
    setInterval(function() {
        if (Math.random() < 0.05) {
            honkSound.play();
        }
    }, 1000);
})();
