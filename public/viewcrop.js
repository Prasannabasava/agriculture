document.addEventListener('DOMContentLoaded', () => {
    const viewForm = document.getElementById('viewForm');
    const cropDataTable = document.getElementById('cropData').getElementsByTagName('tbody')[0];
    const messageDiv = document.getElementById('message');

    viewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;

        try {
            const response = await fetch(`/api/crops/${username}`);
            const crops = await response.json();

            if (response.ok) {
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

                messageDiv.textContent = 'Data loaded successfully.';
            } else {
                messageDiv.textContent = 'Error fetching data.';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Error fetching data.';
        }
    });
});
