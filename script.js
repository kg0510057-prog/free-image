// script.js
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const searchQuery = document.getElementById('searchQuery').value.trim();
    if (searchQuery === '') {
        alert('Please enter a search term');
        return;
    }

    const apiKey = '8VhmlVIMAH2-JsgjrFyV-VetQSUnEIM8Xy49wT71CDc'; // Replace with your actual Unsplash Access Key
    const apiUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=10&client_id=${apiKey}`;
    console.log('Fetching images from:', apiUrl); // Debugging line

    try {
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status); // Debugging line

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging line
        displayImages(data.results);

        // Hide the family area image after search results are fetched
        document.querySelector('.family-area').style.display = 'none';
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch images. Please try again later.');
    }
});

function displayImages(images) {
    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = '';

    if (images.length === 0) {
        imageGallery.innerHTML = '<p>No images found.</p>';
        return;
    }

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.regular;
        imgElement.alt = image.alt_description || 'Image';
        imgElement.classList.add('gallery-image');

        const downloadButton = document.createElement('a');
        downloadButton.href = image.links.download;
        downloadButton.download = 'download';
        downloadButton.textContent = 'Download';
        downloadButton.classList.add('download-button');
        downloadButton.style.display = 'none'; // Initially hide download button

        const threeDots = document.createElement('button');
        threeDots.textContent = '⋮';
        threeDots.classList.add('three-dots');
        threeDots.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent propagation to document click handler
            const isVisible = downloadButton.style.display === 'block';
            hideAllDownloadButtons(); // Hide all other download buttons first
            downloadButton.style.display = isVisible ? 'none' : 'block';
        });

        const downloadContainer = document.createElement('div');
        downloadContainer.classList.add('download-container');
        downloadContainer.appendChild(threeDots);
        downloadContainer.appendChild(downloadButton);

        const imageContainer = document.createElement('div');
        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(downloadContainer);

        imageGallery.appendChild(imageContainer);

        // Close download button on click outside
        document.addEventListener('click', (event) => {
            if (!imageContainer.contains(event.target)) {
                hideAllDownloadButtons();
            }
        });
    });
}

function hideAllDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-button');
    downloadButtons.forEach(button => {
        button.style.display = 'none';
    });
}
