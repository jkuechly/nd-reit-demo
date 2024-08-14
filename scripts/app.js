document.addEventListener('DOMContentLoaded', () => {
    const pdfUpload = document.querySelector('pdf-upload');
    const resultsDashboard = document.getElementById('results-dashboard');

    pdfUpload.addEventListener('pdf-parsed', async (event) => {
        const parsedText = event.detail;
        console.log("Parsed text in main app:", parsedText);
        
        try {
            const response = await fetch('/api/chatgpt', {
                method: 'POST',
                body: JSON.stringify({ text: parsedText }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            displayResults(data.parsed_data);
        } catch (error) {
            console.error('Error:', error);
            resultsDashboard.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    function displayResults(data) {
        resultsDashboard.innerHTML = `
            <h2>Parsed Lease Data:</h2>
            <p><strong>Tenant:</strong> ${data.tenant}</p>
            <p><strong>Landlord:</strong> ${data.landlord}</p>
            <p><strong>Lease Term:</strong> ${data.lease_term}</p>
            <p><strong>Rent:</strong> ${data.rent}</p>
        `;
        resultsDashboard.style.display = 'block';
    }
});