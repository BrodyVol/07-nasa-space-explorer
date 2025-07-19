// Fun space facts array
const spaceFacts = [
  "A day on Venus is longer than a year on Venus!",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "There are more trees on Earth than stars in the Milky Way.",
  "The footprints on the Moon will be there for millions of years.",
  "One million Earths could fit inside the Sun.",
  "A spoonful of a neutron star weighs about a billion tons.",
  "Jupiter has 95 known moons as of 2025!",
  "Space is completely silent—there’s no air for sound to travel.",
  "The hottest planet in our solar system is Venus.",
  "Saturn would float if you could put it in water!"
];

// Pick a random fact and display it
const factBox = document.getElementById('space-fact');
if (factBox) {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factBox.textContent = spaceFacts[randomIndex];
}
// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery elements
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA APOD API key (provided)
const API_KEY = 'hkakoHNuAoskyBDx2X7UIL9kEAeoKfKUYXYQXgVz';

// Listen for button click to fetch images
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the NASA APOD API URL
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message
  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🚀</div><p>Loading Space Images 🚀🚀🚀</p></div>`;

  // Fetch images from NASA API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // If the API returns a single object, put it in an array
      const images = Array.isArray(data) ? data : [data];

      // Filter out any items that are not images (e.g., videos)
      const imageItems = images.filter(item => item.media_type === 'image');

      // If no images, show a message
      if (imageItems.length === 0) {
        gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">😢</div><p>No images found for this date range.</p></div>`;
        return;
      }

      // Build gallery HTML for both images and videos
      gallery.innerHTML = images.map(item => {
        if (item.media_type === 'image') {
          // Image entry
          return `
            <div class="gallery-item" 
              data-type="image"
              data-url="${item.url}"
              data-title="${item.title.replace(/"/g, '&quot;')}"
              data-date="${item.date}"
              data-explanation="${item.explanation.replace(/"/g, '&quot;')}">
              <img src="${item.url}" alt="${item.title}" />
              <h3>${item.title}</h3>
              <p><strong>Date:</strong> ${item.date}</p>
              <p>${item.explanation}</p>
            </div>
          `;
        } else if (item.media_type === 'video') {
          // Video entry: show a thumbnail with play overlay and a link
          // Try to get a YouTube thumbnail if possible
          let thumb = '';
          let isYouTube = false;
          let videoId = '';
          if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
            isYouTube = true;
            // Extract YouTube video ID
            const ytMatch = item.url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (ytMatch && ytMatch[1]) {
              videoId = ytMatch[1];
              thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
          }
          // Fallback thumbnail
          if (!thumb) thumb = 'https://www.nasa.gov/sites/all/themes/custom/nasatwo/images/nasa-logo.svg';
          return `
            <div class="gallery-item" 
              data-type="video"
              data-url="${item.url}"
              data-title="${item.title.replace(/"/g, '&quot;')}"
              data-date="${item.date}"
              data-explanation="${item.explanation.replace(/"/g, '&quot;')}">
              <div class="video-thumb-container">
                <img src="${thumb}" alt="${item.title} (Video)" />
                <div class="play-overlay">▶</div>
              </div>
              <h3>${item.title}</h3>
              <p><strong>Date:</strong> ${item.date}</p>
              <p>${item.explanation}</p>
              <a href="${item.url}" target="_blank" class="video-link">Watch Video</a>
            </div>
          `;
        } else {
          // Unknown type, skip
          return '';
        }
      }).join('');

      // Add click event to each gallery item to open modal or video
      const galleryItems = document.querySelectorAll('.gallery-item');
      galleryItems.forEach(item => {
        const type = item.getAttribute('data-type');
        if (type === 'image') {
          item.addEventListener('click', () => {
            // Get data from attributes
            const url = item.getAttribute('data-url');
            const title = item.getAttribute('data-title');
            const date = item.getAttribute('data-date');
            const explanation = item.getAttribute('data-explanation');

            // Fill modal content
            document.getElementById('modalImg').src = url;
            document.getElementById('modalImg').alt = title;
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDate').textContent = date;
            document.getElementById('modalExplanation').textContent = explanation;

            // Show modal
            document.getElementById('modal').style.display = 'flex';
          });
        } else if (type === 'video') {
          // Only open the video link in a new tab when clicking the video item (not modal)
          item.addEventListener('click', (e) => {
            // Only trigger if not clicking the link itself
            if (!e.target.classList.contains('video-link')) {
              const url = item.getAttribute('data-url');
              window.open(url, '_blank');
            }
          });
        }
      });
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">⚠️</div><p>Could not load images. Please try again later.</p></div>`;
      console.error('Error fetching NASA images:', error);
    });
// ...existing code...

// Modal close logic
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

// Close modal when X is clicked
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
});
