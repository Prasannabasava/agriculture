document.addEventListener('DOMContentLoaded', () => {
    const cropForm = document.getElementById('cropForm');
    const cropDataTable = document.getElementById('cropData').getElementsByTagName('tbody')[0];
    const messageDiv = document.getElementById('message');
    const usernameInput = document.getElementById('username');

    cropForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(cropForm);

        const response = await fetch('/api/crops', {
            method: 'POST',
            body: JSON.stringify({
                username: formData.get('username'),
                crop: formData.get('crop'),
                plantingDate: formData.get('plantingDate'),
                soilHealth: formData.get('soilHealth'),
                irrigation: formData.get('irrigation')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = result.message;
            fetchCropData(formData.get('username')); // Fetch and display updated crop data
        } else {
            messageDiv.textContent = `Error: ${result.error}`;
        }
    });

    async function fetchCropData(username) {
        const response = await fetch(`/api/crops/${username}`);
        const crops = await response.json();
        cropDataTable.innerHTML = ''; // Clear existing data

        if (crops.length === 0) {
            const row = cropDataTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.textContent = 'No crop data found';
            return;
        }

        crops.forEach(crop => {
            const row = cropDataTable.insertRow();
            row.insertCell().textContent = crop.crop;
            row.insertCell().textContent = crop.plantingDate;
            row.insertCell().textContent = crop.soilHealth;
            row.insertCell().textContent = crop.irrigation;
        });
    }

    // Optionally, you can fetch and display crop data on page load based on a default username or query parameter
    if (usernameInput.value) {
        fetchCropData(usernameInput.value);
    }
});
