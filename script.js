/**
 * Static Image Resizer
 * Author: Ehsan Rostami (https://github.com/ehsan-rostami)
 * Copyright (c) 2025 Ehsan Rostami
 * Released under the MIT License.
 */

document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const browseBtn = document.getElementById('browseBtn');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewThumbnail = document.getElementById('previewThumbnail');
    const imageInfo = document.getElementById('imageInfo');

    const filenameInput = document.getElementById('filename');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    
    const processBtn = document.getElementById('processBtn');
    const loader = document.getElementById('loader');
    const outputSection = document.getElementById('outputSection');

    let originalImage = null;
    let originalFileName = '';
    let originalAspectRatio = 1;

    function saveSettings() {
        localStorage.setItem('resizerSettings', JSON.stringify({
            width: widthInput.value,
            height: heightInput.value,
            quality: qualityInput.value,
        }));
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('resizerSettings'));
        if (settings) {
            widthInput.value = settings.width || '';
            heightInput.value = settings.height || '';
            qualityInput.value = settings.quality || 80;
            qualityValue.textContent = `${qualityInput.value}%`;
        }
    }

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFile(files[0]);
        }
    });

    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                originalAspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;
                originalFileName = file.name.split('.').slice(0, -1).join('.');

                previewThumbnail.src = e.target.result;
                imagePreview.hidden = false;
                imageInfo.innerHTML = `
                    Original: ${originalImage.naturalWidth}x${originalImage.naturalHeight}px
                    (${ (file.size / 1024).toFixed(2) } KB)
                `;

                if(widthInput.value) {
                    updateHeight();
                } else if (heightInput.value) {
                    updateWidth();
                }

                processBtn.disabled = false;
                outputSection.hidden = true;
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    widthInput.addEventListener('input', updateHeight);
    heightInput.addEventListener('input', updateWidth);

    function updateHeight() {
        if (originalImage) {
            const newWidth = parseInt(widthInput.value);
            if(newWidth > 0) {
                heightInput.value = Math.round(newWidth / originalAspectRatio);
                saveSettings();
            }
        }
    }
    
    function updateWidth() {
        if (originalImage) {
            const newHeight = parseInt(heightInput.value);
            if(newHeight > 0) {
                widthInput.value = Math.round(newHeight * originalAspectRatio);
                saveSettings();
            }
        }
    }

    qualityInput.addEventListener('input', () => {
        qualityValue.textContent = `${qualityInput.value}%`;
        saveSettings();
    });

    filenameInput.addEventListener('input', saveSettings);

    processBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        const quality = parseInt(qualityInput.value) / 100;
        
        if (!width || !height || width <= 0 || height <= 0) {
            alert('Please enter valid width and height values.');
            return;
        }

        processBtn.hidden = true;
        loader.hidden = false;

        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalImage, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', quality);

            const outputFilename = (filenameInput.value.trim() || originalFileName) + '.jpg';
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = outputFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            loader.hidden = true;
            processBtn.hidden = false;
            outputSection.hidden = false;

        }, 50);
    });

    loadSettings();
});
