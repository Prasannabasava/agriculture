document.addEventListener('DOMContentLoaded', () => {
    const costForm = document.getElementById('costForm');
    const costDataTable = document.getElementById('costData').getElementsByTagName('tbody')[0];
    const messageDiv = document.getElementById('message');
    const usernameInput = document.getElementById('username');

    costForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(costForm);

        const response = await fetch('/api/costs', {
            method: 'POST',
            body: JSON.stringify({
                username: formData.get('username'),
                crop: formData.get('crop'),
                cost: parseFloat(formData.get('cost')),
                date: formData.get('date')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = result.message;
            fetchCostData(formData.get('username')); // Fetch and display updated cost data
        } else {
            messageDiv.textContent = `Error: ${result.error}`;
        }
    });

    async function fetchCostData(username) {
        const response = await fetch(`/api/costs/${username}`);
        const costs = await response.json();
        costDataTable.innerHTML = ''; // Clear existing data

        if (costs.length === 0) {
            const row = costDataTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.textContent = 'No cost data found';
            return;
        }

        costs.forEach(cost => {
            const row = costDataTable.insertRow();
            row.insertCell().textContent = cost.crop;
            row.insertCell().textContent = cost.cost.toFixed(2);
            row.insertCell().textContent = cost.date;
        });
    }

    // Optionally, you can fetch and display cost data on page load based on a default username or query parameter
    if (usernameInput.value) {
        fetchCostData(usernameInput.value);
    }
});
