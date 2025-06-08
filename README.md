# Static Image Resizer

A simple, client-side, single-page web application for resizing images with persistent settings. Built with pure HTML, CSS, and JavaScript.

**[➡️ View Live Demo]([https://ehsan-rostami.github.io/image-resizer/](https://ehsan-rostami.github.io/tools/image-resizer/index.html))**
![App Screenshot](./demo.png)


## ✨ Core Features

- **Entirely Client-Side:** No server needed. All processing happens in your browser.
- **Drag & Drop:** Easily upload images by dragging them onto the page.
- **Persistent Settings:** Remembers your last-used width, height, and quality settings using `localStorage`.
- **Aspect Ratio Lock:** Automatically calculates width or height to maintain the original aspect ratio.
- **Quality Control:** Adjust the output JPEG quality with a simple slider to balance quality and file size.
- **Responsive Design:** Works great on both desktop and mobile devices.
- **Supported Formats:** Accepts `JPG`, `PNG`, and `WebP` and outputs as `JPG`.

## 💻 Technology Stack

- **HTML5:** For the structure of the application.
- **CSS3:** For modern, responsive styling.
- **JavaScript (ES6+):** For all the application logic, including DOM manipulation and image processing with the HTML Canvas API.

## 🚀 How to Use

1.  **Visit the website.**
2.  **Set your desired options:**
    - Enter a target `width` or `height` in pixels.
    - Adjust the `quality` slider.
    - (Optional) Provide a custom output filename.
3.  **Upload an image** by dragging it onto the drop zone or using the "Browse Files" button.
4.  Click the **"Process Image"** button.
5.  Your resized image will be automatically downloaded by your browser!

## 📜 License

This project is open-source and available under the **[MIT License](LICENSE)**.

---

Authored and maintained by **Ehsan Rostami**.

[My GitHub Profile](https://github.com/ehsan-rostami)
