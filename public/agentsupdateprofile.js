document.getElementById('agentUpdateForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const form = document.getElementById('agentUpdateForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('/update-agent', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the profile.');
    }
});
