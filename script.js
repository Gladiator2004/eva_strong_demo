// Progressive Word-by-Word Contrast Effect with Landing Animation
document.addEventListener('DOMContentLoaded', function() {
    // Global variable to track content expansion state
    let isContentExpanded = false;
    
    // Prevent scrolling during intro animation
    document.body.classList.add('intro-active');
    window.scrollTo(0, 0);
    
    // Remove scroll lock after intro animation
    setTimeout(() => {
        document.body.classList.remove('intro-active');
    }, 4000);
    
    // Initialize after content loads and intro animation completes
    setTimeout(() => {
        window.scrollTo(0, 0);
        initializeContrastEffect();
        initializeReadMore();
        initializeRevolutionSection();
        initializeProjectsSection();
    }, 4000);
    
    function initializeContrastEffect() {
        addContrastStyles();
        processContentText();
        
        // Set up scroll listeners
        window.addEventListener('scroll', handleScrollReveal);
        window.addEventListener('scroll', handleProjectsAnimation);
        window.addEventListener('resize', handleScrollReveal);
        window.addEventListener('load', handleScrollReveal);
        
        // Apply initial state
        setTimeout(handleScrollReveal, 200);
    }
    
    function addContrastStyles() {
        const style = document.createElement('style');
        style.id = 'contrast-styles';
        style.textContent = `
            .content p, .content li, .main-content > p, 
            .content .list, .list li, ol.list li {
                color: transparent !important;
                font-size: 30px !important;
            }
            
            .content p *, .content li *, .main-content > p * {
                color: inherit !important;
                font-size: 30px !important;
            }
            
            .word-span {
                display: inline;
                transition: color 0.3s ease, opacity 0.3s ease;
                color: #ffffff !important;
                font-size: 30px !important;
            }
            
            .word-span.upcoming {
                color: #444444 !important;
                opacity: 0.5;
            }
            
            .word-span.current {
                color: #888888 !important;
                opacity: 0.8;
            }
            
            .word-span.seen {
                color: #ffffff !important;
                opacity: 1.0;
            }
        `;
        document.head.appendChild(style);
    }
    
    function processContentText() {
        const contentElements = document.querySelectorAll('.content p, .content li, .main-content > p');
        let globalWordIndex = 0;
        
        contentElements.forEach((element, elemIndex) => {
            const originalHTML = element.innerHTML;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = originalHTML;
            
            processTextNodesForWords(tempDiv, globalWordIndex);
            
            const wordSpans = tempDiv.querySelectorAll('.word-span');
            globalWordIndex += wordSpans.length;
            
            element.innerHTML = tempDiv.innerHTML;
        });
    }
    
    function processTextNodesForWords(element, startIndex) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        let currentIndex = startIndex;
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const fragment = document.createDocumentFragment();
            const words = text.split(/(\s+)/);
            
            words.forEach(word => {
                if (word.trim() === '') {
                    fragment.appendChild(document.createTextNode(word));
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'word-span upcoming';
                    wordSpan.textContent = word;
                    wordSpan.setAttribute('data-word-index', currentIndex);
                    fragment.appendChild(wordSpan);
                    currentIndex++;
                }
            });
            
            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }
    
    function handleScrollReveal() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const allWords = document.querySelectorAll('.word-span');
        const totalWords = allWords.length;
        
        if (totalWords === 0) return;
        
        // Calculate animation progress
        const startTrigger = windowHeight * 0.30;
        let animationScrollPercent = 0;
        
        if (scrollTop > startTrigger) {
            const maxScroll = documentHeight - windowHeight;
            const adjustedScrollTop = scrollTop - startTrigger;
            const adjustedMaxScroll = maxScroll - startTrigger;
            
            if (adjustedMaxScroll > 0) {
                const scrollPercent = Math.min(adjustedScrollTop / adjustedMaxScroll, 1);
                const completionRate = isContentExpanded ? 0.80 : 1.50;
                animationScrollPercent = Math.min(scrollPercent * (1 / completionRate), 1);
            }
        }
        
        // Update word states
        const currentWordPosition = animationScrollPercent * (totalWords - 1);
        const currentWordIndex = Math.round(currentWordPosition);
        const gradientZone = 2;
        const halfZone = Math.floor(gradientZone / 2);
        
        allWords.forEach((word, index) => {
            word.classList.remove('upcoming', 'current', 'seen');
            const distanceFromCurrent = index - currentWordIndex;
            
            if (distanceFromCurrent < -halfZone) {
                word.classList.add('seen');
            } else if (Math.abs(distanceFromCurrent) <= halfZone) {
                word.classList.add('current');
            } else {
                word.classList.add('upcoming');
            }
        });
    }

    // Read More Button Functionality
    function initializeReadMore() {
        const readMoreBtn = document.getElementById('readMoreBtn');
        const hiddenContent = document.getElementById('hiddenContent');
        
        if (readMoreBtn && hiddenContent) {
            readMoreBtn.addEventListener('click', function() {
                if (hiddenContent.classList.contains('show')) {
                    hiddenContent.classList.remove('show');
                    readMoreBtn.textContent = 'Read More';
                    readMoreBtn.classList.remove('expanded');
                    isContentExpanded = false;
                } else {
                    hiddenContent.classList.add('show');
                    readMoreBtn.textContent = 'Read Less';
                    readMoreBtn.classList.add('expanded');
                    isContentExpanded = true;
                    
                    // Re-process the newly visible content
                    setTimeout(() => {
                        processContentText();
                        handleScrollReveal();
                    }, 100);
                }
            });
        }
    }

    // Revolution Section Functionality
    function initializeRevolutionSection() {
        const revolutionTitle = document.querySelector('.revolution-title');
        const revolutionImage = document.querySelector('.revolution-image');
        
        if (revolutionTitle) {
            revolutionTitle.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                        window.open('https://zoom.us', '_blank');
                    }, 150);
                }, 100);
            });
        }
        
        if (revolutionImage) {
            revolutionImage.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                }, 100);
            });
        }
    }

    // Projects Section Functionality
    function initializeProjectsSection() {
        const projectsContainer = document.querySelector('.sliding-image-container');
        
        if (projectsContainer) {
            projectsContainer.addEventListener('click', function() {
                // Add click animation
                const image = this.querySelector('.sliding-image');
                const overlay = this.querySelector('.overlay-text');
                
                // Store original transform values
                const imageTransform = image.style.transform || 'scale(1)';
                const overlayTransform = overlay.style.transform || 'translate(-50%, -50%) scale(1)';
                
                image.style.transform = 'scale(0.97)';
                overlay.style.transform = 'translate(-50%, -50%) scale(0.97)';
                
                setTimeout(() => {
                    image.style.transform = 'scale(1.03)';
                    overlay.style.transform = 'translate(-50%, -50%) scale(1.03)';
                    
                    setTimeout(() => {
                        image.style.transform = imageTransform;
                        overlay.style.transform = overlayTransform;
                        // Here you can add navigation to projects page
                        alert('Projects page coming soon!');
                    }, 150);
                }, 100);
            });
        }
    }

    // Projects Section Scroll Animation
    function handleProjectsAnimation() {
        const projectsSection = document.querySelector('.projects-section');
        const slidingImage = document.querySelector('.sliding-image');
        const overlayText = document.querySelector('.overlay-text');
        
        if (!projectsSection || !slidingImage || !overlayText) return;
        
        const rect = projectsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Trigger section fade-in when it's 80% visible
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
            if (!projectsSection.classList.contains('visible')) {
                projectsSection.classList.add('visible');
            }
        }
        
        // Trigger image and overlay animations when section is 70% visible
        if (rect.top <= windowHeight * 0.7 && rect.bottom >= 0) {
            if (!slidingImage.classList.contains('animate')) {
                // Add a slight delay before starting both animations simultaneously
                setTimeout(() => {
                    slidingImage.classList.add('animate');
                    overlayText.classList.add('animate');
                }, 300);
            }
        }
    }
});
