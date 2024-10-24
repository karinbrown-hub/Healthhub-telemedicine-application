document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburger.classList.toggle('active');
    });
});