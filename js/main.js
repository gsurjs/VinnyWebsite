// Configuration for social media links
const SOCIAL_LINKS = {
    spotify: "https://open.spotify.com/artist/3hXX72sGg8iOTsOkwV1vrj",  
    appleMusic: "https://music.apple.com/us/artist/vinny-virtuoso/1867422882",
    bandcamp: "https://vinnyvirtuoso.bandcamp.com/", 
    youtube: "https://www.youtube.com/@vinnyvirtuoso", 
    instagram: "https://instagram.com/vinnyvirtuoso",  
    twitter: "https://x.com/vinnyvirtuoso",
};

// Music preview configuration
const MUSIC_CONFIG = {
    tracks: {
        'track1': { 
            title: 'Thank You', 
            url: '/audio/previews/thank-you-preview.m4a'
        },
        'track2': { 
            title: 'A LOVE SUPREME!', 
            url: '/audio/previews/fbi-murdered-fred-preview.m4a'
        },
        'track3': { 
            title: 'RED LIGHT DISTRICT', 
            url: '/audio/previews/wiki-preview.wav'
        },
        'track4': {
            title: 'MOTH',
            url: '/audio/previews/moth-preview.m4a'
        },
        'track5': {
            title: 'THE WORLD IS YOURS',
            url: '/audio/previews/party-preview.m4a'
        },
        'track6': {
            title: 'NO DAYS OFF',
            url: '/audio/previews/no-days-off-preview.m4a'
        },
        'track7': {
            title: 'AINT SHIT',
            url: '/audio/previews/aint-shit-preview.m4a'
        },
        'track8': {
            title: 'SUMMER\'S OVER',
            url: '/audio/previews/wake-bake-preview.m4a'
        },
        'track9': {
            title: 'SPACECOWBOY',
            url: '/audio/previews/spacecowboy-preview.m4a'
        },
        'track10': {
            title: 'IMAGES',
            url: '/audio/previews/images-preview.m4a'
        },
        'track11': {
            title: 'WKND FM',
            url: '/audio/previews/wknd-fm-preview.m4a'
        },
        'track12': {
            title: 'FROM MUDD',
            url: '/audio/previews/from-mudd-preview.m4a'
        },
        'track13': {
            title: 'AT LONG LAST',
            url: '/audio/previews/at-long-last.m4a'
        },
        'track14': {
            title: 'GLOCK',
            url: '/audio/previews/glock-preview.m4a'
        },
    }
};

document.addEventListener('DOMContentLoaded', function() {

    // --- HANDLES NEWSLETTER SUBMISSION WITH SECURITY CHECK ---
    const newsletterForm = document.querySelector('form[action*="kit.com"]');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // SECURITY: HONEYPOT CHECK
            // If the hidden 'bot_check' field has any value, it's a bot.
            // We simulate success but do not send the data.
            if (formData.get('bot_check')) {
                console.log("Bot detected. Submission blocked.");
                return; 
            }
            
            const button = this.querySelector('button');
            const originalText = button.innerText;
            
            // Visual Feedback
            button.innerText = "JOINING...";
            button.style.opacity = "0.7";
            button.disabled = true;
            
            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success State
                    button.innerText = "WELCOME TO THE FAMILY";
                    button.style.borderColor = "#00ff00"; 
                    button.style.color = "#00ff00";
                    button.style.textShadow = "0 0 10px #00ff00";
                    this.reset();
                    
                    setTimeout(() => {
                        button.innerText = originalText;
                        button.style.borderColor = "rgba(255, 255, 255, 0.3)";
                        button.style.color = "white";
                        button.style.opacity = "1";
                        button.style.textShadow = "none";
                        button.disabled = false;
                    }, 4000);
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                console.error('Error:', error);
                button.innerText = "ERROR - TRY AGAIN";
                button.style.borderColor = "red";
                button.disabled = false;
                
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }, 3000);
            }
        });
    }
    // ------------------------------------------

    function checkPageExists(pageId) {
        return document.getElementById(pageId) !== null;
    }

    const homeTriggers = document.querySelectorAll('.logo, .banner-image');
    
    homeTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // Update the URL hash to #home
            // This triggers the existing 'hashchange' listener which handles the page switch
            window.location.hash = 'home';
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });



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
        if (!checkPageExists(pageId)) {
            pageId = 'home';
        }
        
        navItems.forEach(navItem => {
            if (navItem.getAttribute('data-page') === pageId) {
                navItem.classList.add('active-nav');
            } else {
                navItem.classList.remove('active-nav');
            }
        });
        
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
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
        showPage('home');
    }
    
    const initialPage = initialHash || 'home';
    navItems.forEach(navItem => {
        if (navItem.getAttribute('data-page') === initialPage) {
            navItem.classList.add('active-nav');
        }
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            window.location.hash = pageId;
            showPage(pageId);
        });
    });
    
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        }
    });
    
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
    const contactForm = document.querySelector('.contact-form:not([action*="kit.com"])');
    if (contactForm) {
        if (contactForm.action && contactForm.action.includes('formspree.io')) {
            contactForm.addEventListener('submit', function() {
                console.log('Submitting form to Formspree...');
            });
        } else {
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
    
    setTimeout(typeWriter, 500);
});

function updateSocialLinks() {
    const homeSocialLinks = document.querySelectorAll('#home .social-link');
    const contactSocialLinks = document.querySelectorAll('#contact .social-link');
    
    const homeLinksMap = {
        'Spotify': SOCIAL_LINKS.spotify,
        'Apple Music': SOCIAL_LINKS.appleMusic,
        'Bandcamp' : SOCIAL_LINKS.bandcamp,
        'YouTube': SOCIAL_LINKS.youtube,
        'Instagram': SOCIAL_LINKS.instagram,
        'Twitter': SOCIAL_LINKS.twitter,
    };
    
    const contactLinksMap = {
        'Instagram': SOCIAL_LINKS.instagram,
        'Twitter': SOCIAL_LINKS.twitter,
        'YouTube': SOCIAL_LINKS.youtube,
    };
    
    homeSocialLinks.forEach(link => {
        const label = link.getAttribute('aria-label');
        if (homeLinksMap[label] && homeLinksMap[label] !== '#') {
            link.href = homeLinksMap[label];
        }
    });
    
    contactSocialLinks.forEach(link => {
        const label = link.getAttribute('aria-label');
        if (contactLinksMap[label] && contactLinksMap[label] !== '#') {
            link.href = contactLinksMap[label];
        }
    });
    
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

let currentlyPlaying = null;

function initializeMusicPreviews() {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        const sources = audio.querySelectorAll('source');
        const trackId = sources[0]?.getAttribute('data-track-id');
        
        if (trackId && MUSIC_CONFIG.tracks[trackId]) {
            const trackInfo = MUSIC_CONFIG.tracks[trackId];
            sources.forEach(source => {
                source.src = trackInfo.url;
            });
            
            audio.load();

            audio.addEventListener('play', function() {
                if (currentlyPlaying && currentlyPlaying !== audio) {
                    currentlyPlaying.pause();
                }
                currentlyPlaying = audio;
            });
            
            const audioContainer = audio.closest('.album-player');
            if (audioContainer) {
                audioContainer.addEventListener('click', function(e) {
                    if (e.target === audio || audio.contains(e.target)) {
                        if (audio.readyState === 0) {
                            audio.load();
                            setTimeout(() => {
                                audio.play().catch(err => {
                                    console.error('Error playing audio:', err);
                                });
                            }, 50);
                        }
                    }
                }, true);
            }
            
            audio.addEventListener('error', function(e) {
                console.error(`Error loading audio for track ${trackId}:`, e);
                audio.load();
            });
            
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
        
        loadingIndicator.style.display = 'block';
        
        audio.addEventListener('loadedmetadata', function() {
            loadingIndicator.style.display = 'none';
        });
        
        audio.addEventListener('waiting', function() {
            loadingIndicator.style.display = 'block';
        });
        
        audio.addEventListener('canplay', function() {
            loadingIndicator.style.display = 'none';
        });
        
        audio.addEventListener('playing', function() {
            loadingIndicator.style.display = 'none';
        });
        
        audio.addEventListener('error', function() {
            loadingIndicator.textContent = 'Error loading audio. Retrying...';
            loadingIndicator.style.display = 'block';
            setTimeout(() => {
                audio.load();
            }, 1000);
        });
    });
}

function initializeImageGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // SECURITY UPDATE: Prevent XSS by building elements safely instead of innerHTML
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            const content = document.createElement('div');
            content.className = 'lightbox-content';
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'lightbox-close';
            closeBtn.textContent = '×';
            
            const img = document.createElement('img');
            img.src = this.src;
            img.alt = this.alt;
            
            content.appendChild(closeBtn);
            content.appendChild(img);
            lightbox.appendChild(content);
            
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.className === 'lightbox-close') {
                    lightbox.remove();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                }
            });
        });
    });
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.error(`Failed to load image: ${this.src}`);
            this.classList.add('error');
        });
        
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
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
        bannerImage.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        bannerImage.addEventListener('error', function() {
            console.error("Error loading banner image");
            this.style.height = '180px';
            this.style.backgroundColor = '#111';
            this.style.opacity = '1';
        });
        
        if (bannerImage.complete) {
            bannerImage.classList.add('loaded');
        }
    }
}