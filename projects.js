// Projects Page Animation Controller
document.addEventListener('DOMContentLoaded', function() {
    // Prevent scrolling during intro animation
    document.body.classList.add('intro-active');
    window.scrollTo(0, 0);
    
    // Remove scroll lock after intro animation
    setTimeout(() => {
        document.body.classList.remove('intro-active');
        initializeProjectAnimations();
    }, 3000);
    
    function initializeProjectAnimations() {
        const projectItems = document.querySelectorAll('.project-item');
        
        // Ensure all projects start hidden
        projectItems.forEach((item, index) => {
            item.classList.remove('animate');
            item.style.opacity = '0';
        });
        
        // Add scroll-triggered animations for better mobile experience
        setupScrollAnimations();
        
        // Add click interactions for project items
        setupProjectInteractions();
    }
    
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const delay = parseFloat(entry.target.getAttribute('data-delay')) || 0;
                
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    // Fade in when entering viewport
                    if (!entry.target.classList.contains('animate')) {
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, delay * 200);
                    }
                } else if (entry.intersectionRatio <= 0.1) {
                    // Fade out when leaving viewport
                    entry.target.classList.remove('animate');
                }
            });
        }, observerOptions);
        
        // Observe all project items
        document.querySelectorAll('.project-item').forEach(item => {
            observer.observe(item);
        });
        
        // Set up continuous scroll-based fade animations
        setupContinuousScrollFade();
    }
    
    function setupContinuousScrollFade() {
        let ticking = false;
        
        const handleScrollFade = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const projectItems = document.querySelectorAll('.project-item');
                    const windowHeight = window.innerHeight;
                    
                    projectItems.forEach((item, index) => {
                        const rect = item.getBoundingClientRect();
                        
                        // Define trigger points
                        const triggerTop = windowHeight * 0.8; // Fade in when 80% visible
                        const triggerBottom = windowHeight * 0.2; // Fade out when only 20% visible
                        
                        // Check if item is in the fade-in zone
                        const isInViewport = rect.bottom > triggerBottom && rect.top < triggerTop;
                        
                        if (isInViewport) {
                            // Calculate fade ratio based on position in viewport
                            let fadeRatio = 1;
                            
                            // Fade in from bottom
                            if (rect.top > 0) {
                                fadeRatio = Math.min(1, (triggerTop - rect.top) / (triggerTop * 0.3));
                            }
                            
                            // Fade out at top
                            if (rect.bottom < windowHeight) {
                                const fadeOutRatio = Math.min(1, rect.bottom / (triggerBottom * 2));
                                fadeRatio = Math.min(fadeRatio, fadeOutRatio);
                            }
                            
                            fadeRatio = Math.max(0, Math.min(1, fadeRatio));
                            
                            // Apply staggered delay for initial appearance
                            const delay = parseFloat(item.getAttribute('data-delay')) || 0;
                            
                            if (fadeRatio > 0.1) {
                                setTimeout(() => {
                                    item.classList.add('animate');
                                    item.style.opacity = fadeRatio;
                                }, item.classList.contains('animate') ? 0 : delay * 100);
                            } else {
                                item.classList.remove('animate');
                                item.style.opacity = '0';
                            }
                        } else {
                            // Item is completely out of viewport
                            item.classList.remove('animate');
                            item.style.opacity = '0';
                        }
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Add scroll listener for continuous fade animations
        window.addEventListener('scroll', handleScrollFade, { passive: true });
        
        // Initial call
        handleScrollFade();
    }
    
    function setupProjectInteractions() {
        const projectContainers = document.querySelectorAll('.project-image-container');
        
        projectContainers.forEach((container, index) => {
            container.addEventListener('click', function() {
                // Get the clicked image element
                const clickedImage = this.querySelector('.project-image');
                
                // Store original image data for animation
                const rect = clickedImage.getBoundingClientRect();
                const imageData = {
                    src: clickedImage.src,
                    startRect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    }
                };
                
                // Add click animation
                this.style.transform = 'translateY(-8px) scale(0.98)';
                
                setTimeout(() => {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    
                    setTimeout(() => {
                        this.style.transform = 'translateY(-8px)';
                        
                        // Project-specific actions with image data
                        handleProjectClick(index, imageData);
                    }, 150);
                }, 100);
            });
            
            // Add hover effects for better interactivity
            container.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.opacity = '1';
                }
            });
            
            container.addEventListener('mouseleave', function() {
                const overlay = this.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(100%)';
                    overlay.style.opacity = '0';
                }
            });
        });
    }
    
    function handleProjectClick(projectIndex, imageData = null) {
        const projectIds = ['eva-strong', 'waste-heat-recovery', 'rocket-control-system'];
        const projectId = projectIds[projectIndex];
        
        if (projectId) {
            openProjectDetail(projectId, imageData);
        }
    }
    
    // Project data with detailed information
    const projectData = {
        'eva-strong': {
            name: 'Eva Strong',
            heroImage: 'BG.jpg',
            items: [
                {
                    title: 'Advanced Energy Solutions',
                    image: 'BG.jpg',
                    description: 'Eva Strong represents our flagship energy initiative, combining cutting-edge technology with sustainable practices. Our comprehensive approach to energy generation and distribution ensures maximum efficiency while minimizing environmental impact. This project encompasses renewable energy systems, smart grid integration, and advanced storage solutions that are designed to meet the growing energy demands of modern society.',
                    stats: [
                        { number: '95%', label: 'Efficiency Rate' },
                        { number: '25 Years', label: 'Project Lifespan' },
                        { number: '100MW', label: 'Power Output' }
                    ]
                }
            ]
        },
        'waste-heat-recovery': {
            name: 'Waste Heat Recovery',
            heroImage: 'bg2.jpg',
            items: [
                {
                    title: 'Industrial Heat Recovery Systems',
                    image: 'bg2.jpg',
                    description: 'Our waste heat recovery systems capture and repurpose thermal energy that would otherwise be lost in industrial processes. By implementing advanced heat exchangers and thermal management technologies, we can recover up to 85% of waste heat and convert it into usable energy. This not only reduces energy costs but also significantly decreases the carbon footprint of industrial operations.',
                    stats: [
                        { number: '85%', label: 'Heat Recovery' },
                        { number: '20 Years', label: 'System Lifespan' },
                        { number: '75MW', label: 'Thermal Output' }
                    ]
                }
            ]
        },
        'rocket-control-system': {
            name: 'Rocket Control System',
            heroImage: 'bg3.jpg',
            items: [
                {
                    title: 'Precision Guidance Technology',
                    image: 'bg3.jpg',
                    description: 'Our rocket control systems represent the pinnacle of aerospace engineering, providing unprecedented precision and reliability for space missions. The system incorporates advanced sensors, real-time processing capabilities, and adaptive control algorithms that ensure optimal performance under extreme conditions. From launch to orbital insertion, our technology ensures mission success with unparalleled accuracy.',
                    stats: [
                        { number: '99.9%', label: 'Precision Rate' },
                        { number: '5000m/s', label: 'Max Velocity' },
                        { number: '0.1ms', label: 'Response Time' }
                    ]
                }
            ]
        }
    };
    
    // Open project detail view
    function openProjectDetail(projectId, imageData = null) {
        const project = projectData[projectId];
        if (!project) return;
        
        // Use the clicked image src if available, otherwise fall back to heroImage
        const heroImageSrc = imageData ? imageData.src : project.heroImage;
        
        // Create project detail overlay
        const detailOverlay = document.createElement('div');
        detailOverlay.className = 'project-detail-overlay';
        
        // Store original image data for closing animation
        if (imageData) {
            detailOverlay.dataset.originalImageData = JSON.stringify(imageData);
        }
        
        detailOverlay.innerHTML = `
            <div class="project-detail-content">
                <button class="detail-close-btn">&times;</button>
                <div class="detail-hero">
                    <img src="${heroImageSrc}" alt="${project.name}" class="detail-hero-image">
                    <div class="detail-title-overlay">
                        <h1 class="detail-title">${project.name}</h1>
                    </div>
                </div>
                <div class="detail-content">
                    ${project.items.map(item => `
                        <div class="detail-item">
                            <div class="detail-item-content">
                                <div class="detail-text">
                                    <h3>${item.title}</h3>
                                    <p>${item.description}</p>
                                    <div class="detail-stats">
                                        ${item.stats.map(stat => `
                                            <div class="stat-box">
                                                <div class="stat-number">${stat.number}</div>
                                                <div class="stat-label">${stat.label}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="detail-image">
                                    <img src="${item.image}" alt="${item.title}">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(detailOverlay);
        
        // If we have image data, animate from the original position
        if (imageData && imageData.startRect) {
            const heroImg = detailOverlay.querySelector('.detail-hero-image');
            const detailContent = detailOverlay.querySelector('.detail-content');
            const titleOverlay = detailOverlay.querySelector('.detail-title-overlay');
            
            // Show overlay with transparent background first
            detailOverlay.style.background = 'rgba(0, 0, 0, 0)';
            detailOverlay.classList.add('active');
            
            // Set initial position to match the clicked image exactly
            heroImg.style.position = 'fixed';
            heroImg.style.top = `${imageData.startRect.top}px`;
            heroImg.style.left = `${imageData.startRect.left}px`;
            heroImg.style.width = `${imageData.startRect.width}px`;
            heroImg.style.height = `${imageData.startRect.height}px`;
            heroImg.style.zIndex = '9999'; // Below the close button
            heroImg.style.borderRadius = '12px';
            heroImg.style.objectFit = 'cover';
            heroImg.style.transition = 'none';
            heroImg.style.filter = 'brightness(1)';
            
            // Hide the detail content initially
            detailContent.style.opacity = '0';
            titleOverlay.style.opacity = '0';
            
            // Force a reflow to ensure styles are applied
            heroImg.offsetHeight;
            
            // Start the expansion animation
            setTimeout(() => {
                // Animate background
                detailOverlay.style.transition = 'background 0.5s ease 0.2s';
                detailOverlay.style.background = 'rgba(0, 0, 0, 0.95)';
                
                // Animate image expansion
                heroImg.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
                heroImg.style.position = 'absolute';
                heroImg.style.top = '0';
                heroImg.style.left = '0';
                heroImg.style.width = '100%';
                heroImg.style.height = '100%';
                heroImg.style.borderRadius = '0';
                heroImg.style.filter = 'brightness(0.7)';
                heroImg.style.zIndex = '1'; // Reset to normal level
                
                // Show content after image animation starts
                setTimeout(() => {
                    detailContent.style.transition = 'opacity 0.4s ease';
                    detailContent.style.opacity = '1';
                    titleOverlay.style.transition = 'opacity 0.4s ease 0.1s';
                    titleOverlay.style.opacity = '1';
                }, 300);
            }, 50);
        } else {
            // Standard fade-in animation
            setTimeout(() => {
                detailOverlay.classList.add('active');
            }, 10);
        }
        
        // Close button event
        const closeBtn = detailOverlay.querySelector('.detail-close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeProjectDetail(detailOverlay);
        });
        
        // Close on overlay click (but not on content click)
        detailOverlay.addEventListener('click', (e) => {
            if (e.target === detailOverlay) {
                closeProjectDetail(detailOverlay);
            }
        });
        
        // Prevent content clicks from closing
        const detailContent = detailOverlay.querySelector('.project-detail-content');
        detailContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeProjectDetail(detailOverlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Store escape handler for cleanup
        detailOverlay._escapeHandler = escapeHandler;
    }
    
    // Close project detail view
    function closeProjectDetail(overlay) {
        // Remove escape key handler
        if (overlay._escapeHandler) {
            document.removeEventListener('keydown', overlay._escapeHandler);
        }
        
        const originalImageData = overlay.dataset.originalImageData;
        
        if (originalImageData) {
            // Parse the original image data
            const imageData = JSON.parse(originalImageData);
            const heroImg = overlay.querySelector('.detail-hero-image');
            const detailContent = overlay.querySelector('.detail-content');
            const titleOverlay = overlay.querySelector('.detail-title-overlay');
            
            // Hide content first
            detailContent.style.opacity = '0';
            detailContent.style.transition = 'opacity 0.2s ease';
            titleOverlay.style.opacity = '0';
            titleOverlay.style.transition = 'opacity 0.2s ease';
            
            // Animate image back to original position
            setTimeout(() => {
                heroImg.style.position = 'fixed';
                heroImg.style.top = `${imageData.startRect.top}px`;
                heroImg.style.left = `${imageData.startRect.left}px`;
                heroImg.style.width = `${imageData.startRect.width}px`;
                heroImg.style.height = `${imageData.startRect.height}px`;
                heroImg.style.borderRadius = '12px';
                heroImg.style.filter = 'brightness(1)';
                heroImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
                heroImg.style.zIndex = '9999'; // Below close button during animation
                
                // Remove overlay after animation
                setTimeout(() => {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        if (overlay && overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }, 400);
            }, 200);
        } else {
            // Standard fade-out animation
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }
    
    // Smooth scrolling enhancement
    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.location.href = 'index.html';
        }
    });
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Re-trigger animations on resize if needed
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            if (item.classList.contains('animate')) {
                item.style.transition = 'none';
                setTimeout(() => {
                    item.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
                }, 100);
            }
        });
    });
    
    // Performance optimization: Preload images
    function preloadImages() {
        const images = ['BG.jpg', 'bg2.jpg', 'bg3.jpg'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Initialize preloading
    preloadImages();
    
    // Add loading states for images
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
});
