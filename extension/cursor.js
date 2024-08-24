const button = document.getElementById('flyCursorButton');
const customCursor = document.getElementById('customCursor');
const newCursor = document.getElementById('newCursor');

let flying = false;

document.addEventListener('mousemove', (e) => {
    if (!flying) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    } else {
        newCursor.style.left = e.clientX + 'px';
        newCursor.style.top = e.clientY + 'px';
    }
});

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

// Change cursor to hand when hovering over buttons or clickable elements
const clickableElements = document.querySelectorAll('button'); // Add other selectors if needed

clickableElements.forEach(element => {
    element.addEventListener('mouseover', () => {
        document.body.classList.add('button-cursor');
    });

    element.addEventListener('mouseout', () => {
        document.body.classList.remove('button-cursor');
    });
});
