function farmerlogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Example: Check credentials (this should be handled securely on the server side)
    if (username === 'example' && password === 'password') {
        // Store username in localStorage for dashboard usage
        localStorage.setItem('username', username);

        // Redirect to dashboard page
        window.location.href = 'farmerdashboard.html';
        return false; // Prevent form submission
    } else {
        document.getElementById('response').textContent = 'Invalid username or password.';
        return false; // Prevent form submission
    }
}
