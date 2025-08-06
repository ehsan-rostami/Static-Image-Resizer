# Static Image Resizer
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://ehsan-rostami.github.io/epw-insights/)

A simple, client-side, single-page web application for resizing images with persistent settings. Built with pure HTML, CSS, and JavaScript.

## 🚀 Live Demo & Screenshot

Experience EPW Insights live at: [Demo](https://ehsan-rostami.github.io/Static-Image-Resizer/)

---

<p align="center">
  <img src="https://ehsan-rostami.github.io/tools/image-resizer/demo.png" alt="App Screenshot" width="400">
</p>

*A quick look at the application in action.*


## ✨ Core Features

- **Entirely Client-Side:** No server needed. All processing happens in your browser.
- **Drag & Drop:** Easily upload images by dragging them onto the page.
- **Persistent Settings:** Remembers your last-used width, height, and quality settings using `localStorage`.
- **Aspect Ratio Lock:** Automatically calculates width or height to maintain the original aspect ratio.
- **Quality Control:** Adjust the output JPEG quality with a simple slider to balance quality and file size.
- **Responsive Design:** Works great on both desktop and mobile devices.
- **Supported Formats:** Accepts `JPG`, `PNG`, and `WebP` and outputs as `JPG`.

## 💻 Technology Stack

- ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) **HTML5:** For the structure of the application.
- ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white) **CSS3:** For modern, responsive styling.
- ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E) **JavaScript (ES6+):** For all the application logic, including DOM manipulation and image processing with the HTML Canvas API.

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

