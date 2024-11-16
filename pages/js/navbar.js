/*
$(document).ready(function() {
    // When the menu toggle is clicked
    $('.nav-toggle').click(function() {
        // Toggle the sidebar class to show or hide it
        $('.sidebar').toggleClass('active');
    });
});


$(document).ready(function() {
    // When the menu toggle is clicked
    $('.nav-toggle').click(function() {
        // Toggle the sidebar class to show or hide it
        $('.sidebar').toggleClass('active');
    });
});


// JavaScript to toggle the sidebar
document.getElementById('nav-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
});
*/

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
