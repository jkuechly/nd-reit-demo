document.addEventListener('DOMContentLoaded', () => {
    const pdfUpload = document.querySelector('pdf-upload');
    const resultsDashboard = document.getElementById('results-dashboard');

    pdfUpload.addEventListener('pdf-parsed', async (event) => {
        const parsedText = event.detail;
        console.log("Parsed text in main app:", parsedText);
        
        // Here we would typically send this to a backend API that interfaces with ChatGPT
        // For demo purposes, we'll just display the parsed text
        resultsDashboard.innerHTML = `<h2>Parsed PDF Content:</h2><pre>${parsedText}</pre>`;
        resultsDashboard.style.display = 'block';
    });
});