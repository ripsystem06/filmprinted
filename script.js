document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileUpload = document.getElementById('fileUpload');
    const productList = document.getElementById('productList');
    const printButton = document.getElementById('printButton');
    const modal = document.getElementById('imageModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementsByClassName('close')[0];

    // Inicializar PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const brands = [
        "GoodieTwoSleeves", "Volcom", "Billabong", "Hurley",
        "QuickSilver", "RVCA", "CapitanFinn", "Madengine",
    ];

    uploadButton.addEventListener('click', () => {
        fileUpload.click();
    });

    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    printButton.addEventListener('click', () => {
        window.print();
    });

    async function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileUrl = e.target.result;
            let thumbnailUrl = fileUrl;

            if (file.type === 'application/pdf') {
                try {
                    thumbnailUrl = await generatePDFThumbnail(fileUrl);
                } catch (error) {
                    console.error('Error generating PDF thumbnail:', error);
                    thumbnailUrl = 'path/to/pdf-icon.png'; // Asegúrate de tener este icono en tu proyecto
                }
            }

            addProduct(file.name, thumbnailUrl, fileUrl, file.type === 'application/pdf');
        };
        reader.readAsDataURL(file);
    }

    async function generatePDFThumbnail(pdfUrl) {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const scale = 0.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        return canvas.toDataURL();
    }

    function addProduct(name, thumbnailUrl, fileUrl, isPdf) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        const date = new Date().toLocaleString();

        const thumbnailHtml = `<img src="${thumbnailUrl}" alt="${name}" class="${isPdf ? 'pdf-thumbnail' : 'product-image'}">`;

        row.innerHTML = `
            <td data-label="ARCHIVO">${thumbnailHtml}</td>
            <td data-label="FECHA">${date}</td>
            <td data-label="NOMBRE">${name}</td>
            <td data-label="MARCA">
                <select>
                    <option value="">Seleccionar marca</option>
                    ${brands.map(brand => `<option value="${brand}">${brand}</option>`).join('')}
                </select>
            </td>
            <td data-label="FRONT"><input type="checkbox"></td>
            <td data-label="BACK"><input type="checkbox"></td>
            <td data-label="SLEEVE"><input type="checkbox"></td>
            <td data-label="NECK LABEL"><input type="checkbox"></td>
            <td data-label="PPO / WO"><textarea></textarea></td>
            <td data-label="ESTADO">
                <label><input type="checkbox" name="recibido"> RECIBIDO</label><br>
                <label><input type="checkbox" name="completo"> COMPLETO</label>
            </td>
        `;

        productList.appendChild(row);
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 10);

        const thumbnail = row.querySelector('.product-image, .pdf-thumbnail');
        thumbnail.addEventListener('click', () => {
            showPreview(fileUrl, isPdf, name);
        });
    }

    async function showPreview(fileUrl, isPdf, name) {
        modalContent.innerHTML = '';
        if (isPdf) {
            try {
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                modalContent.appendChild(canvas);
            } catch (error) {
                console.error('Error rendering PDF:', error);
                modalContent.innerHTML = '<p class="error-message">Error loading PDF preview</p>';
            }
        } else {
            const img = document.createElement('img');
            img.src = fileUrl;
            img.alt = name;
            img.className = 'modal-image';
            modalContent.appendChild(img);
        }
        modal.style.display = 'block';
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});
