document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('pdf-file');
    const fileName = document.getElementById('file-name');
    const statusMessage = document.getElementById('status-message');
    const pdfViewer = document.getElementById('pdf-viewer');
    const extractButton = document.getElementById('extract-button');

    let pdfText = '';

    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    statusMessage.textContent = 'Status: Waiting for file';

    // And update the message when processing the file
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            statusMessage.textContent = 'Status: Processing file...';
            extractButton.disabled = true;
            
            try {
                pdfText = await parsePdf(file);
                statusMessage.textContent = 'Status: PDF processed. Ready for extraction.';
                extractButton.disabled = false;
                
                // Display PDF preview
                displayPdfPreview(file);
            } catch (error) {
                console.error('Error:', error);
                statusMessage.textContent = `Status: Error - ${error.message}`;
            }
        }
    });

    extractButton.addEventListener('click', async () => {
        statusMessage.textContent = 'Status: Initiating AI data extraction process...';
        extractButton.disabled = true;
        
        try {
            const response = await fetch('/.netlify/functions/chatgpt', {
                method: 'POST',
                body: JSON.stringify({ text: pdfText }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
    
            statusMessage.textContent = 'Status: Extraction complete! Redirecting to dashboard...';
            
            localStorage.setItem('parsedLeaseData', JSON.stringify(data.parsed_data));
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = `Status: Error - ${error.message}`;
            extractButton.disabled = false;
        }
    });

    async function parsePdf(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(event) {
                const typedarray = new Uint8Array(event.target.result);
                try {
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    async function displayPdfPreview(file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const typedarray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            pdfViewer.innerHTML = '';
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                pdfViewer.appendChild(canvas);
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
            }
        };
        reader.readAsArrayBuffer(file);
    }
});