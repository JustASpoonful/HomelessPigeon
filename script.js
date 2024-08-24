(function(){
    var img = document.createElement('img');
    var idleSrc = 'https://homelesspigeon.vercel.app/PigeonIdle.gif';
    var walkSrc = 'https://homelesspigeon.vercel.app/PigeonWalk.gif';
    var rareGifs = [
        { src: 'https://homelesspigeon.vercel.app/PigeonRare1.gif', chance: 0.001 },  // 0.1% chance
        { src: 'https://homelesspigeon.vercel.app/PigeonRare2.gif', chance: 0.000001 } // 0.0001% chance
    ];
    img.src = idleSrc;
    img.style.position = 'fixed';
    img.style.bottom = '0px';
    img.style.right = '0px';
    img.style.zIndex = 9999;
    img.setAttribute('draggable', false);
    document.body.appendChild(img);

    var speed = 1;
    var direction = {x: -1, y: -1};
    var chasing = false;
    var chaseTimeout;
    var isWalking = false;
    var isRareIdle = false;

    document.addEventListener('mousemove', function(e){
        if(chasing){
            var x = e.clientX;
            var y = e.clientY;
            img.style.right = (window.innerWidth - x - 50) + 'px';
            img.style.bottom = (window.innerHeight - y - 50) + 'px';
        }
    });

    img.addEventListener('click', function(){
        chasing = true;
        clearTimeout(chaseTimeout);
        chaseTimeout = setTimeout(function(){
            chasing = false;
        }, 3000);
    });

    setInterval(function(){
        if(!chasing){
            var x = parseInt(img.style.right);
            var y = parseInt(img.style.bottom);

            if(x > window.innerWidth - 100 || x < 0) direction.x *= -1;
            if(y > window.innerHeight - 100 || y < 0) direction.y *= -1;

            if (speed > 0 && !isWalking) {
                img.src = walkSrc; // Switch to walking animation when moving
                isWalking = true;
            } else if (speed === 0 && isWalking) {
                img.src = idleSrc; // Switch to idle animation when stopped
                isWalking = false;
                isRareIdle = false; // Reset rare idle state
            }

            img.style.right = (x + speed * direction.x) + 'px';
            img.style.bottom = (y + speed * direction.y) + 'px';
        }
    }, 20);

    setInterval(function() {
        if (!chasing) {
            speed = Math.random() < 0.7 ? 0 : 5; // More likely to idle (70% chance)
            if (speed === 0 && !isRareIdle) {
                rareGifs.forEach(function(gif) {
                    if (Math.random() < gif.chance) {
                        img.src = gif.src;
                        isRareIdle = true; // Ensure rare animation only happens once per idle
                    }
                });
            }

            direction.x = Math.random() < 0.5 ? -1 : 1;
            direction.y = Math.random() < 0.5 ? -1 : 1;
            setTimeout(function() {
                speed = 5;
            }, Math.random() * (5000 - 1000) + 1000);
        }
    }, 1000);

    var honkSound = new Audio('https://pugware.github.io/honk0in0honk/HONKsounds/honk-sound.mp3');
    setInterval(function() {
        if (Math.random() < 0.05) {
            honkSound.play();
        }
    }, 1000);
})();
