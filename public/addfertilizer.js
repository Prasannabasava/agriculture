document.getElementById('cropForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const companyName = document.getElementById('companyName').value;
    const cropName = document.getElementById('cropName').value;
    const fertilizers = document.getElementById('fertilizers').value;

    try {
        const response = await fetch('/api/add-fertilizer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ companyName, cropName, fertilizers }),
        });
        const data = await response.json();

        if (response.ok) {
            document.getElementById('responseMessage').textContent = data.message;
        } else {
            document.getElementById('responseMessage').textContent = data.message || 'Error adding crop.';
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
    }
});
