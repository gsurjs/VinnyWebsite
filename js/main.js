// Configuration for social media links
const SOCIAL_LINKS = {
    spotify: "https://open.spotify.com/artist/50ZkNr2NdgCRlcJbFqRUCV",  
    appleMusic: "https://music.apple.com/us/artist/vinny/1453764", 
    youtube: "https://www.youtube.com/@vinnyvirtuoso", 
    instagram: "https://instagram.com/vinnyvirtuoso",  
    twitter: "https://x.com/vinnyvirtuoso",
};

// Music preview configuration - using local preview files
const MUSIC_CONFIG = {
    tracks: {
        'track1': { 
            title: 'Thank You', 
            url: '/audio/previews/thank-you-preview.m4a'
        },
        'track2': { 
            title: 'Song Title 2', 
            url: '/audio/previews/luv-preview.m4a'
        },
        'track3': { 
            title: 'Song Title 3', 
            url: '/audio/previews/wiki-preview.wav'
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {

    function checkPageExists(pageId) {
    return document.getElementById(pageId) !== null;
    }

    // UPDATE SOCIAL LINKS
    updateSocialLinks();
    
    // Initialize music preview system
    initializeMusicPreviews();
    
    // Initialize image gallery
    initializeImageGallery();

    // Initialize banner image
    initializeBannerImage();
    
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');
    
    // Function to show specific page
    function showPage(pageId) {

        // Check if the page exists before showing it
        if (!checkPageExists(pageId)) {
            pageId = 'home'; // Default to home if the requested page doesn't exist
        }
        
        // Update active navigation item
        navItems.forEach(navItem => {
            if (navItem.getAttribute('data-page') === pageId) {
                navItem.classList.add('active-nav');
            } else {
                navItem.classList.remove('active-nav');
            }
        });
        
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    // Check URL hash on load
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showPage(initialHash);
    } else {
        showPage('home'); // Default to home if no hash
    }
    
    // Set initial active nav item
    const initialPage = initialHash || 'home';
    navItems.forEach(navItem => {
        if (navItem.getAttribute('data-page') === initialPage) {
            navItem.classList.add('active-nav');
        }
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get page to show
            const pageId = this.getAttribute('data-page');
            
            // Update URL hash
            window.location.hash = pageId;
            
            // Show the page
            showPage(pageId);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        }
    });
    
    // Add subtle hover effects
    const products = document.querySelectorAll('.product');
    const albums = document.querySelectorAll('.album');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const addHoverEffect = (elements) => {
        elements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    };
    
    addHoverEffect(products);
    addHoverEffect(albums);
    addHoverEffect(galleryItems);
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Check if the form has a Formspree action
        if (contactForm.action && contactForm.action.includes('formspree.io')) {
            // If using Formspree, don't prevent default submission
            contactForm.addEventListener('submit', function() {
                // You can still do something here before the form submits, if needed
                console.log('Submitting form to Formspree...');
                // But we won't call preventDefault()
            });
        } else {
            // Original fallback code for non-Formspree forms
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Either fake email or submission error!');
            });
        }
    }
    
    // Add typing effect to logo
    const logo = document.querySelector('.logo');
    const originalText = logo.textContent;
    logo.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < originalText.length) {
            logo.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
});

function updateSocialLinks() {
    // Update home page social links
    const homeSocialLinks = document.querySelectorAll('#home .social-link');
    const contactSocialLinks = document.querySelectorAll('#contact .social-link');
    
    // Home page links mapping
    const homeLinksMap = {
        'Spotify': SOCIAL_LINKS.spotify,
        'Apple Music': SOCIAL_LINKS.appleMusic,
        'YouTube': SOCIAL_LINKS.youtube,
        'Instagram': SOCIAL_LINKS.instagram,
        'Twitter': SOCIAL_LINKS.twitter,
    };
    
    // Contact page links mapping
    const contactLinksMap = {
        'Instagram': SOCIAL_LINKS.instagram,
        'Twitter': SOCIAL_LINKS.twitter,
        'YouTube': SOCIAL_LINKS.youtube,
    };
    
    // Update home page links
    homeSocialLinks.forEach(link => {
        const label = link.getAttribute('aria-label');
        if (homeLinksMap[label] && homeLinksMap[label] !== '#') {
            link.href = homeLinksMap[label];
        }
    });
    
    // Update contact page links
    contactSocialLinks.forEach(link => {
        const label = link.getAttribute('aria-label');
        if (contactLinksMap[label] && contactLinksMap[label] !== '#') {
            link.href = contactLinksMap[label];
        }
    });
    
    // Update music platform links
    const platformLinks = document.querySelectorAll('.platform-link');
    const platformMap = {
        'Spotify': SOCIAL_LINKS.spotify,
        'Apple Music': SOCIAL_LINKS.appleMusic,
        'YouTube Music': SOCIAL_LINKS.youtube,
    };
    
    platformLinks.forEach(link => {
        const platformName = link.querySelector('span');
        if (platformName) {
            const name = platformName.textContent;
            if (platformMap[name] && platformMap[name] !== '#') {
                link.href = platformMap[name];
            }
        }
    });
}

// Keep track of currently playing audio element
let currentlyPlaying = null;

function initializeMusicPreviews() {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        const sources = audio.querySelectorAll('source');
        const trackId = sources[0]?.getAttribute('data-track-id');
        
        if (trackId && MUSIC_CONFIG.tracks[trackId]) {
            const trackInfo = MUSIC_CONFIG.tracks[trackId];
            
            // Set the source URL for all source elements
            sources.forEach(source => {
                source.src = trackInfo.url;
            });
            
            // Force the audio element to load the new sources
            audio.load();

            // Add play event to pause other audio elements
            audio.addEventListener('play', function() {
                // Pause any currently playing audio that's not this one
                if (currentlyPlaying && currentlyPlaying !== audio) {
                    currentlyPlaying.pause();
                }
                // Set this as the currently playing audio
                currentlyPlaying = audio;
            });
            
            // Add click handler to ensure first click works
            const audioContainer = audio.closest('.album-player');
            if (audioContainer) {
                audioContainer.addEventListener('click', function(e) {
                    // Only handle clicks on the player itself, not child elements
                    if (e.target === audio || audio.contains(e.target)) {
                        // If audio is not ready, load it
                        if (audio.readyState === 0) {
                            audio.load();
                            // Small timeout to let browser process
                            setTimeout(() => {
                                audio.play().catch(err => {
                                    console.error('Error playing audio:', err);
                                });
                            }, 50);
                        }
                    }
                }, true); // Use capture phase to get events first
            }
            
            // Add error handling
            audio.addEventListener('error', function(e) {
                console.error(`Error loading audio for track ${trackId}:`, e);
                
                // Try to reload on error
                audio.load();
            });
            
            // Add canplay listener to log when audio is ready
            audio.addEventListener('canplay', function() {
                console.log(`Audio track ${trackId} is ready to play`);
            });
        }
    });
}

updateAudioLoadingStates();

function updateAudioLoadingStates() {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        const container = audio.closest('.album-player');
        if (!container) return;
        
        const loadingIndicator = container.querySelector('.loading-indicator');
        if (!loadingIndicator) return;
        
        // Show loading indicator initially
        loadingIndicator.style.display = 'block';
        
        // Hide loading indicator when metadata is loaded
        audio.addEventListener('loadedmetadata', function() {
            loadingIndicator.style.display = 'none';
        });
        
        // Show loading indicator when waiting for data
        audio.addEventListener('waiting', function() {
            loadingIndicator.style.display = 'block';
        });
        
        // Hide loading indicator when can play
        audio.addEventListener('canplay', function() {
            loadingIndicator.style.display = 'none';
        });
        
        // Hide loading indicator when playing
        audio.addEventListener('playing', function() {
            loadingIndicator.style.display = 'none';
        });
        
        // Show loading indicator on error and retry
        audio.addEventListener('error', function() {
            loadingIndicator.textContent = 'Error loading audio. Retrying...';
            loadingIndicator.style.display = 'block';
            
            // Try to reload after a short delay
            setTimeout(() => {
                audio.load();
            }, 1000);
        });
    });
}

function initializeImageGallery() {
    // Add click handlers to gallery images for lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${this.src}" alt="${this.alt}">
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Add close functionality
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.className === 'lightbox-close') {
                    lightbox.remove();
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                }
            });
        });
    });
    
    // Handle image loading and errors
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add error handling
        img.addEventListener('error', function() {
            console.error(`Failed to load image: ${this.src}`);
            this.classList.add('error');
            
            // For album covers, show the alt text
            if (this.classList.contains('album-cover')) {
                // Keep the original alt text visible
            }
        });
        
        // Add loaded class when image loads successfully
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
    
    // Add lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Only reload if it hasn't been loaded yet
                    if (!img.classList.contains('loaded') && !img.classList.contains('error')) {
                        img.src = img.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

function initializeBannerImage() {
    const bannerImage = document.querySelector('.banner-image');

    if (bannerImage) {
        // Add loading handler
        bannerImage.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Add error handler
        bannerImage.addEventListener('error', function() {
            console.error("Error loading banner image");
            
            // If error, add a fallback background color
            this.style.height = '180px';
            this.style.backgroundColor = '#111';
            this.style.opacity = '1';
        });
        
        // If image is already cached and loaded instantly
        if (bannerImage.complete) {
            bannerImage.classList.add('loaded');
        }
    }
}