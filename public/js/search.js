document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const specialization = document.getElementById('specialization').value;
    const rating = document.getElementById('rating').value;

    const queryParams = new URLSearchParams({
        name,
        specialization,
        rating
    }).toString();

    try {
        const response = await fetch(`/api/search/providers?${queryParams}`);
        const data = await response.json();

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        data.forEach(provider => {
            resultsDiv.innerHTML += `
                <div>
                    <h2>${provider.first_name} ${provider.last_name}</h2>
                    <p>Specialization: ${provider.specialization}</p>
                    <p>Average Rating: ${provider.average_rating.toFixed(1)}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while searching. Please try again.');
    }
});

