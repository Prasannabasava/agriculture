// agentsdashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    
    if (username) {
        document.getElementById('username-dashboard').textContent = `${username}'s Dashboard`;
        document.getElementById('username').textContent = username;
    }
});

function toggleMenu() {
    const menuList = document.getElementById('menuList');
    if (menuList.style.display === 'block') {
        menuList.style.display = 'none';
    } else {
        menuList.style.display = 'block';
    }
}
