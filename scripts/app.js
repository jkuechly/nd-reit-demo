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
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            statusMessage.textContent = 'Analysis complete! Redirecting to dashboard...';
            
            // Store the parsed data in localStorage
            localStorage.setItem('parsedLeaseData', JSON.stringify(data.parsed_data));
            
            // Redirect to dashboard.html
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = `Error: ${error.message}`;
            resultsDashboard.innerHTML = `<p>Error: ${error.message}</p>`;
            if (error.details) {
                resultsDashboard.innerHTML += `<p>Details: ${JSON.stringify(error.details)}</p>`;
            }
        }
    });
});