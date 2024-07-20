document.addEventListener('DOMContentLoaded', () => {
    function getUsernameFromQuery() {
        const params = new URLSearchParams(window.location.search);
        return params.get('username');
    }

    const username = getUsernameFromQuery() || 'User'; // Default to 'User' if username is not set

    document.getElementById('username-dashboard').textContent = `${username}'s Dashboard`;
    document.getElementById('username').textContent = username;
});

function toggleMenu() {
    const menuList = document.getElementById('menuList');
    if (menuList.style.display === 'block') {
        menuList.style.display = 'none';
    } else {
        menuList.style.display = 'block';
    }
}
