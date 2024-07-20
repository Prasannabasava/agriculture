// Function to fetch and display the farmer profile
async function fetchFarmerProfile() {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        alert('Please enter a username.');
        return;
    }

    try {
        const response = await fetch(`/api/farmers/${username}`);

        if (!response.ok) {
            if (response.status === 404) {
                document.getElementById('profileDetails').innerHTML = 'Profile not found.';
            } else {
                document.getElementById('profileDetails').innerHTML = 'Error fetching profile.';
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const profile = await response.json();
        displayProfile(profile);
    } catch (error) {
        console.error('Error fetching profile details:', error);
        document.getElementById('profileDetails').innerHTML = 'Failed to load profile details.';
    }
}

// Function to display profile details on the page
function displayProfile(profile) {
    // Convert image blob to a data URL for display
    const imageUrl = profile.image ? URL.createObjectURL(new Blob([profile.image], { type: 'image/jpeg' })) : '';

    const profileHtml = `
        <h2>${profile.fullname || 'N/A'}</h2>
        <p><strong>Username:</strong> ${profile.username || 'N/A'}</p>
        <p><strong>Phone:</strong> ${profile.phonenumber || 'N/A'}</p>
        <p><strong>Address:</strong> ${profile.address || 'N/A'}</p>
        <p><strong>City:</strong> ${profile.city || 'N/A'}</p>
        <p><strong>State:</strong> ${profile.state || 'N/A'}</p>
        ${imageUrl ? `<img src="${imageUrl}" alt="Profile Image" style="max-width: 200px; max-height: 200px;" />` : ''}
    `;
    document.getElementById('profileDetails').innerHTML = profileHtml;
}
