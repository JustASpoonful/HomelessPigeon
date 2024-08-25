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
    var chasing = false;
    var chaseTimeout;
    var isWalking = false;
    var isRareIdle = false;
    var grabbedImage = null;
    var grabbedNote = null;
    var originalPosition = { left: '', top: '' };
    var targetPosition = { x: null, y: null };

    var notes = [
        "Feed me!",
        "You look nice today!"
    ];

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

    function setRandomTarget() {
        targetPosition.x = Math.random() * (window.innerWidth - 50);
        targetPosition.y = Math.random() * (window.innerHeight - 50);
    }

    function moveTowardsTarget() {
        var currentX = parseInt(img.style.right);
        var currentY = parseInt(img.style.bottom);

        var deltaX = targetPosition.x - (window.innerWidth - currentX - 50);
        var deltaY = targetPosition.y - (window.innerHeight - currentY - 50);

        direction.x = deltaX > 0 ? -1 : 1;
        direction.y = deltaY > 0 ? -1 : 1;

        if (Math.abs(deltaX) > speed) {
            img.style.right = (currentX + speed * direction.x) + 'px';
        } else {
            img.style.right = (window.innerWidth - targetPosition.x - 50) + 'px';
        }

        if (Math.abs(deltaY) > speed) {
            img.style.bottom = (currentY + speed * direction.y) + 'px';
        } else {
            img.style.bottom = (window.innerHeight - targetPosition.y - 50) + 'px';
        }

        if (Math.abs(deltaX) <= speed && Math.abs(deltaY) <= speed) {
            setRandomTarget(); // Set a new random target after reaching the current one
        }
    }

    setInterval(function() {
        if (!chasing) {
            if (!isWalking) {
                img.src = walkSrc;
                walkSound.play();
                isWalking = true;
            }

            moveTowardsTarget();

            // Rarely grab an image
            if (!grabbedImage && Math.random() < 0.001) { 
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
                    img.style.display = 'none';
                }
            }

            // Move the grabbed image with the pigeon
            if (grabbedImage) {
                grabbedImage.style.left = img.style.right;
                grabbedImage.style.top = img.style.bottom;

                if (Math.random() < 0.05) { // Chance to put the image back
                    grabbedImage.style.left = originalPosition.left;
                    grabbedImage.style.top = originalPosition.top;
                    img.style.display = 'block';
                    grabbedImage = null;
                }
            }

            // Rarely drag out a note
            if (!grabbedNote && Math.random() < 0.001) { 
                var note = document.createElement('div');
                note.innerText = notes[Math.floor(Math.random() * notes.length)];
                note.style.position = 'absolute';
                note.style.left = img.style.right;
                note.style.top = img.style.bottom;
                note.style.background = 'yellow';
                note.style.padding = '10px';
                note.style.zIndex = 9998;
                document.body.appendChild(note);
                grabbedNote = note;
            }

            // Move the grabbed note with the pigeon
            if (grabbedNote) {
                grabbedNote.style.left = img.style.right;
                grabbedNote.style.top = img.style.bottom;

                if (Math.random() < 0.05) { // Chance to put the note down
                    grabbedNote = null;
                }
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
        }
    }, 1000);

    var honkSound = new Audio('nah.wav');
    setInterval(function() {
        if (Math.random() < 0.05) {
            honkSound.play();
        }
    }, 1000);

    // Set the initial target position
    setRandomTarget();
})();
