document.addEventListener('DOMContentLoaded', () => {
    const pdfUpload = document.querySelector('pdf-upload');
    const resultsDashboard = document.getElementById('results-dashboard');
    const statusMessage = document.getElementById('status-message');

    pdfUpload.addEventListener('status-update', (event) => {
        statusMessage.textContent = event.detail;
    });

    pdfUpload.addEventListener('pdf-parsed', async (event) => {
        const parsedText = event.detail;
        console.log("Parsed text in main app:", parsedText);
        
        statusMessage.textContent = 'Sending to ChatGPT for analysis...';
        
        try {
            const response = await fetch('/.netlify/functions/chatgpt', {
                method: 'POST',
                body: JSON.stringify({ text: parsedText }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            statusMessage.textContent = 'Analysis complete!';
            displayResults(data.parsed_data);
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = `Error: ${error.message}`;
            resultsDashboard.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    function displayResults(data) {
        resultsDashboard.innerHTML = `
            <h2>Parsed Lease Data:</h2>
            <pre>${data}</pre>
        `;
        resultsDashboard.style.display = 'block';
    }
});