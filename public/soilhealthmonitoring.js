document.getElementById('soil-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const ph = parseFloat(document.getElementById('ph').value);
    const nitrogen = parseFloat(document.getElementById('nitrogen').value);
    const phosphorus = parseFloat(document.getElementById('phosphorus').value);
    const potassium = parseFloat(document.getElementById('potassium').value);
    const organic = parseFloat(document.getElementById('organic').value);

    // Validate input
    if (isNaN(ph) || isNaN(nitrogen) || isNaN(phosphorus) || isNaN(potassium) || isNaN(organic)) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    // Send data to server
    fetch('/analyze-soil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ph, nitrogen, phosphorus, potassium, organic })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Display results
        document.getElementById('recommendations').textContent = data.recommendations;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('recommendations').textContent = 'Error: Unable to get recommendations.';
    });
});
