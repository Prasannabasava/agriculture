document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.querySelector('.update-form');

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(updateForm);

        try {
            const response = await fetch('/update-farmer', {
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
});
