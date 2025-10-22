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
    const fileExtensionSpan = document.getElementById('fileExtension');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const qualityWrapper = document.getElementById('qualityWrapper');
    
    const outputFormatSelect = document.getElementById('outputFormat');
    const autoCropCheckbox = document.getElementById('autoCrop');
    const formatOptionsDiv = document.getElementById('formatOptions');
    const bgColorInput = document.getElementById('bgColor');

    const processBtn = document.getElementById('processBtn');
    const loader = document.getElementById('loader');
    const outputSection = document.getElementById('outputSection');

    let originalImage = null;
    let originalFileName = '';
    let originalFileType = '';
    let originalAspectRatio = 1;

    function saveSettings() {
        localStorage.setItem('resizerSettings', JSON.stringify({
            width: widthInput.value,
            height: heightInput.value,
            quality: qualityInput.value,
            format: outputFormatSelect.value,
            autoCrop: autoCropCheckbox.checked,
            bgColor: bgColorInput.value,
        }));
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('resizerSettings'));
        if (settings) {
            widthInput.value = settings.width || '';
            heightInput.value = settings.height || '';
            qualityInput.value = settings.quality || 80;
            outputFormatSelect.value = settings.format || 'jpeg';
            autoCropCheckbox.checked = settings.autoCrop || false;
            bgColorInput.value = settings.bgColor || '#FFFFFF';
        }
        qualityValue.textContent = `${qualityInput.value}%`;
        updateUiForFormat();
    }

    function handleDragDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-over');
        if (e.type === 'drop') {
            const files = e.dataTransfer.files;
            if (files.length) handleFile(files[0]);
        }
    }
    
    ['dragover', 'dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, handleDragDrop));
    dropArea.addEventListener('dragover', () => dropArea.classList.add('drag-over'));
    
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
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
                originalFileType = file.type;

                previewThumbnail.src = e.target.result;
                imagePreview.hidden = false;
                imageInfo.innerHTML = `
                    Original: ${originalImage.naturalWidth}x${originalImage.naturalHeight}px
                    (${(file.size / 1024).toFixed(2)} KB) - Type: ${originalFileType}
                `;

                if (widthInput.value) updateHeight();
                else if (heightInput.value) updateWidth();

                processBtn.disabled = false;
                outputSection.hidden = true;
                updateUiForFormat();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    widthInput.addEventListener('input', updateHeight);
    heightInput.addEventListener('input', updateWidth);
    qualityInput.addEventListener('input', () => {
        qualityValue.textContent = `${qualityInput.value}%`;
        saveSettings();
    });

    function updateHeight() {
        if (originalImage && document.activeElement === widthInput) {
            const newWidth = parseInt(widthInput.value);
            heightInput.value = newWidth > 0 ? Math.round(newWidth / originalAspectRatio) : '';
            saveSettings();
        }
    }
    
    function updateWidth() {
        if (originalImage && document.activeElement === heightInput) {
            const newHeight = parseInt(heightInput.value);
            widthInput.value = newHeight > 0 ? Math.round(newHeight * originalAspectRatio) : '';
            saveSettings();
        }
    }

    function updateUiForFormat() {
        const format = outputFormatSelect.value;
        fileExtensionSpan.textContent = format === 'jpeg' ? '.jpg' : '.png';
        qualityWrapper.hidden = format !== 'jpeg';

        const isPngInput = originalFileType === 'image/png';
        const isJpgOutput = format === 'jpeg';
        const isJpgInput = ['image/jpeg', 'image/webp'].includes(originalFileType);
        const isPngOutput = format === 'png';

        if (autoCropCheckbox.checked || (isPngInput && isJpgOutput) || (isJpgInput && isPngOutput)) {
            formatOptionsDiv.hidden = false;
        } else {
            formatOptionsDiv.hidden = true;
        }
    }

    [filenameInput, bgColorInput, autoCropCheckbox].forEach(el => {
        el.addEventListener('input', saveSettings);
    });
    outputFormatSelect.addEventListener('change', () => {
        updateUiForFormat();
        saveSettings();
    });
    autoCropCheckbox.addEventListener('change', updateUiForFormat);


    processBtn.addEventListener('click', async () => {
        if (!originalImage) return alert('Please upload an image first.');
        
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        if (!width || !height || width <= 0 || height <= 0) {
            return alert('Please enter valid width and height values.');
        }

        processBtn.hidden = true;
        loader.hidden = false;

        setTimeout(async () => {
            try {
                let imageToProcess = originalImage;
                let sourceWidth = originalImage.naturalWidth;
                let sourceHeight = originalImage.naturalHeight;
                let sourceX = 0;
                let sourceY = 0;

                if (autoCropCheckbox.checked) {
                    const bounds = findCropBounds(originalImage, bgColorInput.value, originalFileType);
                    if (bounds) {
                        sourceX = bounds.left;
                        sourceY = bounds.top;
                        sourceWidth = bounds.width;
                        sourceHeight = bounds.height;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });

                const format = outputFormatSelect.value;
                const isPngInput = originalFileType === 'image/png';
                const isJpgOutput = format === 'jpeg';
                
                if (isPngInput && isJpgOutput) {
                    ctx.fillStyle = bgColorInput.value;
                    ctx.fillRect(0, 0, width, height);
                }

                ctx.drawImage(imageToProcess, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

                const isJpgInput = ['image/jpeg', 'image/webp'].includes(originalFileType);
                const isPngOutput = format === 'png';
                if (isJpgInput && isPngOutput) {
                    makeColorTransparent(ctx, width, height, bgColorInput.value);
                }

                const mimeType = `image/${format}`;
                const quality = parseInt(qualityInput.value) / 100;
                const dataUrl = canvas.toDataURL(mimeType, quality);
                
                const extension = format === 'jpeg' ? '.jpg' : '.png';
                const outputFilename = (filenameInput.value.trim() || originalFileName) + extension;
                
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = outputFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                outputSection.hidden = false;
            } catch (error) {
                console.error('Processing failed:', error);
                alert('An error occurred during image processing.');
            } finally {
                loader.hidden = true;
                processBtn.hidden = false;
            }
        }, 50);
    });

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }

    function findCropBounds(img, cropColorHex, fileType) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const { r: cropR, g: cropG, b: cropB } = hexToRgb(cropColorHex);
        const tolerance = 20;

        let top = canvas.height, bottom = -1, left = canvas.width, right = -1;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                const a = data[i + 3];
                let isContent = false;

                if (fileType === 'image/png') {
                    if (a > 0) isContent = true; 
                } else { 
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    if (Math.abs(r - cropR) > tolerance || Math.abs(g - cropG) > tolerance || Math.abs(b - cropB) > tolerance) {
                        isContent = true;
                    }
                }

                if (isContent) {
                    top = Math.min(top, y);
                    bottom = Math.max(bottom, y);
                    left = Math.min(left, x);
                    right = Math.max(right, x);
                }
            }
        }

        if (right < left || bottom < top) return null;

        return { left, top, width: right - left + 1, height: bottom - top + 1 };
    }
    
    function makeColorTransparent(ctx, width, height, colorHex) {
        const { r: targetR, g: targetG, b: targetB } = hexToRgb(colorHex);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const tolerance = 20;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            if (Math.abs(r - targetR) < tolerance && Math.abs(g - targetG) < tolerance && Math.abs(b - targetB) < tolerance) {
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    loadSettings();
});
