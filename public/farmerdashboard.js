document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    
    if (username) {
        document.getElementById('username-dashboard').textContent = `${username}'s Dashboard`;
        document.getElementById('username').textContent = username;
    }
    
    // Function to toggle the visibility of the sub-menu
    function toggleSubMenu() {
        const subMenu = document.querySelector('.sub-menu ul');
        subMenu.classList.toggle('show');
    }

    // Fetch the session username from the backend
    fetch('/api/session-username')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                document.getElementById('dashboardUsername').textContent = data.username;
            } else {
                // Redirect to login page if not authenticated
                window.location.href = 'farmerlogin.html';
            }
        })
        .catch(error => console.error('Error fetching session username:', error));

    // Add event listener to the Soil Test link
    const soilTestLink = document.querySelector('.sub-menu > a');
    soilTestLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        toggleSubMenu(); // Toggle visibility of sub-menu
    });

    // Show sub-menu by default
    toggleSubMenu();
});

// Function to toggle the main menu visibility
function toggleMenu() {
    const menuList = document.getElementById('menuList');
    if (menuList.style.display === 'block') {
        menuList.style.display = 'none';
    } else {
        menuList.style.display = 'block';
    }
}
