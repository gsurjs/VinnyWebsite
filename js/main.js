// Configuration for social media links
const SOCIAL_LINKS = {
    spotify: "https://open.spotify.com/artist/50ZkNr2NdgCRlcJbFqRUCV",  
    appleMusic: "https://music.apple.com/us/artist/vinny/1453764", 
    youtube: "https://www.youtube.com/@vinnyvirtuoso", 
    instagram: "https://instagram.com/playvirtuoso",  
    twitter: "https://x.com/vinnyvirtuoso",
};


document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get page to show
            const pageId = this.getAttribute('data-page');
            
            // Update active navigation item
            navItems.forEach(navItem => {
                navItem.style.opacity = navItem === this ? '1' : '0.7';
            });
            
            // Hide all pages
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
        });
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
    };
    
    platformLinks.forEach(link => {
        const platformName = link.querySelector('span').textContent;
        if (platformMap[platformName] && platformMap[platformName] !== '#') {
            link.href = platformMap[platformName];
        }
    });
}