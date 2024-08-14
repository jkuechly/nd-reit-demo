class PdfUpload extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <input type="file" id="pdf-file" accept="application/pdf">
            <button id="upload-button">Upload and Parse</button>
            <div id="file-name"></div>
        `;
        this.addEventListener('change', this.updateFileName);
        this.addEventListener('click', this.handleUpload);
    }

    updateFileName(event) {
        if (event.target.id === 'pdf-file') {
            const fileNameDiv = this.querySelector('#file-name');
            const file = event.target.files[0];
            if (file) {
                fileNameDiv.textContent = `Selected file: ${file.name}`;
            } else {
                fileNameDiv.textContent = '';
            }
        }
    }

    async handleUpload(event) {
        if (event.target.id === 'upload-button') {
            const fileInput = this.querySelector('#pdf-file');
            const file = fileInput.files[0];
            if (file) {
                this.dispatchEvent(new CustomEvent('status-update', { detail: 'Parsing PDF...' }));
                try {
                    const text = await this.parsePdf(file);
                    this.dispatchEvent(new CustomEvent('pdf-parsed', { detail: text }));
                } catch (error) {
                    console.error("Error parsing PDF:", error);
                    this.dispatchEvent(new CustomEvent('status-update', { detail: 'Error parsing PDF' }));
                }
            } else {
                this.dispatchEvent(new CustomEvent('status-update', { detail: 'No file selected' }));
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