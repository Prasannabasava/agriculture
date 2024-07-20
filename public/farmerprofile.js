document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/view-farmer-profile', {
            method: 'GET',
        });

        const profile = await response.json();

        if (response.ok) {
            document.getElementById('profileImage').src = profile.image || 'default-image.jpg';
            document.getElementById('username').innerText = profile.username;
            document.getElementById('fullname').innerText = profile.fullname;
            document.getElementById('phonenumber').innerText = profile.phonenumber;
            document.getElementById('address').innerText = profile.address;
            document.getElementById('city').innerText = profile.city;
            document.getElementById('state').innerText = profile.state;
        } else {
            alert(`Error: ${profile.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the profile.');
    }
});
