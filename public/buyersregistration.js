document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('.registration-form');
    const errorDisplay = document.querySelector('.error-message');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const image = formData.get('image');
        const fullname = formData.get('fullname');
        const phonenumber = formData.get('phonenumber');
        const companyname = formData.get('companyname');
        const address = formData.get('address');
        const city = formData.get('city');
        const state = formData.get('state');
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('/register_buyers', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.error || 'Registration failed');
            }

            window.location.href = `/buyersdashboard.html?username=${username}`; // Redirect to buyers dashboard
        } catch (error) {
            console.error('Error registering buyer:', error);
            errorDisplay.textContent = error.message || 'Registration failed. Please try again later.';
        }
    });
});
