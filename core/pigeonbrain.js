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

    var speed = 3;
    var target = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };
    var isWalking = false;
    var chasing = false;
    var isRareIdle = false;

    function updatePosition() {
        var x = parseInt(img.style.right);
        var y = parseInt(img.style.bottom);
        
        var deltaX = target.x - (window.innerWidth - x);
        var deltaY = target.y - (window.innerHeight - y);
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 20) {
            target.x = Math.random() * window.innerWidth;
            target.y = Math.random() * window.innerHeight;
        } else {
            if (!isWalking) {
                img.src = walkSrc;
                walkSound.play();
                isWalking = true;
            }
            img.style.right = (x + (deltaX / distance) * speed) + 'px';
            img.style.bottom = (y + (deltaY / distance) * speed) + 'px';
        }

        // Flip the pigeon horizontally based on movement direction
        img.style.transform = deltaX > 0 ? 'scaleX(1)' : 'scaleX(-1)';
    }

    function randomIdle() {
        if (!chasing) {
            speed = Math.random() < 0.5 ? 0 : 3;
            if (speed === 0 && !isRareIdle) {
                rareGifs.forEach(function(gif) {
                    if (Math.random() < gif.chance) {
                        img.src = gif.src;
                        isRareIdle = true;
                    }
                });
            }
        }
    }

    document.addEventListener('mousemove', function(e) {
        if (chasing) {
            img.style.right = (window.innerWidth - e.clientX - 50) + 'px';
            img.style.bottom = (window.innerHeight - e.clientY - 50) + 'px';
        }
    });

    img.addEventListener('click', function() {
        chasing = true;
        setTimeout(function() {
            chasing = false;
        }, 3000);
    });

    setInterval(updatePosition, 20);
    setInterval(randomIdle, 1000);

    var honkSound = new Audio('core/nah.wav');
    setInterval(function() {
        if (Math.random() < 0.05) {
            honkSound.play();
        }
    }, 1000);
})();
