document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('.registration-form');
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const image = formData.get('image');
        const fullname = formData.get('fullname');
        const phonenumber = formData.get('phonenumber');
        const address = formData.get('address');
        const city = formData.get('city');
        const state = formData.get('state');
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('/register_farmer', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            window.location.href = '/farmerlogin.html'; // Redirect to login page after successful registration
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle error in registration
        }
    });
});
