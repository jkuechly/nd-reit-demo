class PdfUpload extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <input type="file" id="pdf-file" accept="application/pdf">
            <button id="upload-button">Upload and Parse</button>
        `;
        this.addEventListener('click', this.handleUpload);
    }

    handleUpload(event) {
        if (event.target.id === 'upload-button') {
            const fileInput = this.querySelector('#pdf-file');
            const file = fileInput.files[0];
            if (file) {
                console.log("File selected:", file.name);
                // Here we'll add the logic to parse the PDF and send to ChatGPT
            } else {
                console.log("No file selected");
            }
        }
    }
}

customElements.define('pdf-upload', PdfUpload);