class PdfUpload extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <input type="file" id="pdf-file" accept="application/pdf">
            <button id="upload-button">Upload and Parse</button>
        `;
        this.addEventListener('click', this.handleUpload);
    }

    async handleUpload(event) {
        if (event.target.id === 'upload-button') {
            const fileInput = this.querySelector('#pdf-file');
            const file = fileInput.files[0];
            if (file) {
                console.log("File selected:", file.name);
                try {
                    const text = await this.parsePdf(file);
                    console.log("Parsed text:", text);
                    // Here we'll add the logic to send to ChatGPT
                    this.dispatchEvent(new CustomEvent('pdf-parsed', { detail: text }));
                } catch (error) {
                    console.error("Error parsing PDF:", error);
                }
            } else {
                console.log("No file selected");
            }
        }
    }

    async parsePdf(file) {
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
}

customElements.define('pdf-upload', PdfUpload);