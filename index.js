
console.log("Welcome to the Homeless Pigeon site!");

const downloadBtn = document.getElementById('download-btn');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.close');

downloadBtn.addEventListener('click', function() {
    popup.style.display = 'flex';
});

closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
