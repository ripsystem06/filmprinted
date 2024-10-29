document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const imageUpload = document.getElementById('imageUpload');
    const productList = document.getElementById('productList');
    const printButton = document.getElementById('printButton');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.getElementsByClassName('close')[0];

    const brands = [
        "GoodieTwoSleeves",
        "Volcom",
        "Billabong",
        "Hurley",
        "QuickSilver",
        "RVCA",
        "CapitanFinn"
        "Madengine"
    ];

    uploadButton.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                addProduct(file.name, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    printButton.addEventListener('click', () => {
        window.print();
    });

    function addProduct(name, imageUrl) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        const date = new Date().toLocaleString();

        row.innerHTML = `
            <td data-label="IMAGEN"><img src="${imageUrl}" alt="${name}" class="product-image"></td>
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
            <td data-label="FIRMA"><textarea></textarea></td>
        `;

        productList.appendChild(row);
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 10);

        const productImage = row.querySelector('.product-image');
        productImage.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = imageUrl; // Asegúrate de que el modal tenga la imagen
        });
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
