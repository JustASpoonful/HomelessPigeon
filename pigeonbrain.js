(function() {
    var img = document.createElement('img');
    var idleSrc = 'https://homelesspigeon.vercel.app/PigeonIdle.gif';
    var walkSrc = 'https://homelesspigeon.vercel.app/PigeonWalk.gif';
    var walkSound = new Audio('https://homelesspigeon.vercel.app/walk.wav');
    var rareGifs = [
        { src: 'https://homelesspigeon.vercel.app/robloxtested.png', chance: 50 },  
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
    var direction = {x: 1, y: 1};
    var chasing = false;
    var chaseTimeout;
    var isWalking = false;
    var isRareIdle = false;

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
            if (y > window.innerHeight - 100 || y < 0) direction.y *= -1;

            // Flip the pigeon horizontally based on the x direction
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

    var honkSound = new Audio('nah.wav');
    setInterval(function() {
        if (Math.random() < 0.05) {
            honkSound.play();
        }
    }, 1000);
})();
