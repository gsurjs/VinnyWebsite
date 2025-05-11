// Configuration for social media links
const SOCIAL_LINKS = {
    spotify: "https://open.spotify.com/artist/50ZkNr2NdgCRlcJbFqRUCV",  
    appleMusic: "https://music.apple.com/us/artist/vinny/1453764", 
    youtube: "https://www.youtube.com/@vinnyvirtuoso", 
    instagram: "https://instagram.com/vinnyvirtuoso",  
    twitter: "https://x.com/vinnyvirtuoso",
};

document.addEventListener('DOMContentLoaded', function() {
    // UPDATE SOCIAL LINKS
    updateSocialLinks();

    // Initialize music preview system
    initializeMusicPreviews();
    
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');
    
    // Function to show specific page
    function showPage(pageId) {
        // Update active navigation item
        navItems.forEach(navItem => {
            if (navItem.getAttribute('data-page') === pageId) {
                navItem.style.opacity = '1';
            } else {
                navItem.style.opacity = '0.7';
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            alert('Message sent! (Form submission needs to be configured)');
        });
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
// Music preview configuration
const MUSIC_CONFIG = {
    // Use environment variables or backend API endpoints
    streamingEndpoint: '/api/stream/', // This should be your backend endpoint
    previewDuration: 30, // seconds
    tracks: {
        'track1': { title: 'Song Title 1', startTime: 44 }, // Start preview at 44 seconds -Thank You-
        'track2': { title: 'Song Title 2', startTime: 45 }, // Start preview at 45 seconds
        'track3': { title: 'Song Title 3', startTime: 30 }, // Start preview at 30 seconds
    }
};

function initializeMusicPreviews() {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        const source = audio.querySelector('source');
        const trackId = source.getAttribute('data-track-id');
        const previewDuration = parseInt(audio.getAttribute('data-preview-duration')) || MUSIC_CONFIG.previewDuration;
        
        if (trackId && MUSIC_CONFIG.tracks[trackId]) {
            // Set up the audio source with streaming endpoint
            // In production, this would be your secure backend endpoint
            source.src = `${MUSIC_CONFIG.streamingEndpoint}${trackId}`;
            
            // Handle timeupdate to limit preview duration
            let hasStarted = false;
            audio.addEventListener('timeupdate', function() {
                const trackInfo = MUSIC_CONFIG.tracks[trackId];
                
                // Start at the specified preview point
                if (!hasStarted && audio.currentTime < trackInfo.startTime) {
                    audio.currentTime = trackInfo.startTime;
                    hasStarted = true;
                }
                
                // Stop playback after preview duration
                if (audio.currentTime >= trackInfo.startTime + previewDuration) {
                    audio.pause();
                    audio.currentTime = trackInfo.startTime;
                    hasStarted = false;
                }
            });
            
            // Prevent seeking outside preview range
            audio.addEventListener('seeking', function() {
                const trackInfo = MUSIC_CONFIG.tracks[trackId];
                if (audio.currentTime < trackInfo.startTime || 
                    audio.currentTime > trackInfo.startTime + previewDuration) {
                    audio.currentTime = trackInfo.startTime;
                }
            });
            
            // Reset when audio ends
            audio.addEventListener('ended', function() {
                hasStarted = false;
            });
        }
    });
}