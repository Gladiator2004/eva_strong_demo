document.addEventListener('DOMContentLoaded', function () {
    // Shake the project image every 15 seconds
    const slidingImage = document.querySelector('.sliding-image');
    if (slidingImage) {
        function triggerShake() {
            slidingImage.classList.remove('shake'); // reset in case
            void slidingImage.offsetWidth; // force reflow
            slidingImage.classList.add('shake');
            setTimeout(() => {
                slidingImage.classList.remove('shake');
            }, 700);
        }
        triggerShake(); // initial shake
        setInterval(triggerShake, 15000);
    }
    // Global variable to track content expansion state
    let isContentExpanded = false;
    document.body.classList.add('intro-active');
    window.scrollTo(0, 0);
    setTimeout(() => {
        document.body.classList.remove('intro-active');
    }, 4000);

    // Initialize after content loads and intro animation completes
    setTimeout(() => {
        window.scrollTo(0, 0);
        initializeContrastEffect();
        initializeLinkSection();
        initializeProjectsSection();
    }, 4000);

    function initializeContrastEffect() {
        addContrastStyles();
        processContentText(); // Ensure words are processed for highlighting

        window.addEventListener('scroll', handleScrollReveal);
        window.addEventListener('scroll', handleProjectsAnimation);
        window.addEventListener('resize', handleScrollReveal);
        // Apply initial state based on current scroll position
        handleScrollReveal();
    }

    function addContrastStyles() {
        const style = document.createElement('style');
        style.id = 'contrast-styles';
        style.textContent = `
            .content p, .content li, .main-content > p, 
            .content .list, .list li, ol.list li {
                color: transparent !important;
                font-size: clamp(1.2rem, 30px, 2rem) !important;
            }
            
            .content p *, .content li *, .main-content > p * {
                color: inherit !important;
                font-size: clamp(1.2rem, 30px, 2rem) !important;
            }
            
            .word-span {
                display: inline;
                transition: color 0.3s ease, opacity 0.3s ease;
                color: #ffffff !important;
                font-size: clamp(1.2rem, 30px, 2rem) !important;
            }
            
            .word-span.upcoming {
                color: #444444 !important;
                opacity: 0.7;
            }
            
            .word-span.current {
                color: #888888 !important;
                opacity: 0.9;
            }
            
            .word-span.seen {
                color: #ffffff !important;
                opacity: 1.0;
            }
            
            /* Responsive text animation sizes */
            @media (max-width: 768px) {
                .content p, .content li, .main-content > p, 
                .content .list, .list li, ol.list li,
                .content p *, .content li *, .main-content > p *,
                .word-span {
                    font-size: clamp(1rem, 25px, 1.6rem) !important;
                }
            }
            
            @media (max-width: 480px) {
                .content p, .content li, .main-content > p, 
                .content .list, .list li, ol.list li,
                .content p *, .content li *, .main-content > p *,
                .word-span {
                    font-size: clamp(0.9rem, 20px, 1.4rem) !important;
                }
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
        let startTriggerMultiplier = 0.25;
        if (window.innerWidth <= 480) {
            startTriggerMultiplier = 0.10;
        } else if (window.innerWidth <= 768) {
            startTriggerMultiplier = 0.15;
        } else if (window.innerWidth <= 1024) {
            startTriggerMultiplier = 0.20;
        }
        const startTrigger = windowHeight * startTriggerMultiplier;
        let animationScrollPercent = 0;
        if (scrollTop > startTrigger) {
            const maxScroll = documentHeight - windowHeight;
            const adjustedScrollTop = scrollTop - startTrigger;
            const adjustedMaxScroll = maxScroll - startTrigger;
            if (adjustedMaxScroll > 0) {
                const scrollPercent = Math.min(adjustedScrollTop / adjustedMaxScroll, 1);
                let completionRate;
                if (window.innerWidth <= 480) {
                    completionRate = 0.25;
                } else if (window.innerWidth <= 768) {
                    completionRate = 0.28;
                } else {
                    completionRate = 0.33;
                }
                animationScrollPercent = Math.min(scrollPercent * (1 / completionRate), 1);
            }
        }
        let currentWordIndex = Math.round(animationScrollPercent * totalWords);
        if (animationScrollPercent >= 0.98) {
            currentWordIndex = totalWords;
        }
        currentWordIndex = Math.max(0, Math.min(currentWordIndex, totalWords));

        // Responsive gradient zone
        let gradientZone = 2;
        if (window.innerWidth <= 768) {
            gradientZone = 1;
        }
        const halfZone = Math.floor(gradientZone / 2);

        allWords.forEach((word, index) => {
            word.classList.remove('upcoming', 'current', 'seen');
            if (scrollTop <= startTrigger) {
                word.classList.add('upcoming');
                return;
            }
            // If animation is near completion, mark last N words as seen
            const seenTailCount = Math.max(2, halfZone + 1); // how many last words to mark as seen
            if (currentWordIndex >= totalWords - seenTailCount + 1 && index >= totalWords - seenTailCount) {
                word.classList.add('seen');
                return;
            }
            const distanceFromCurrent = index - (currentWordIndex - 1);
            if (distanceFromCurrent < -halfZone) {
                word.classList.add('seen');
            } else if (Math.abs(distanceFromCurrent) <= halfZone) {
                word.classList.add('current');
            } else {
                word.classList.add('upcoming');
            }
        });
    }

    // Helper function to check if element is currently in the center of viewport
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;

        // Check if the element's center area is in the viewport center
        const elementCenter = rect.top + (rect.height / 2);
        const centerTolerance = windowHeight * 0.3; // 30% tolerance around center

        return Math.abs(elementCenter - windowCenter) < centerTolerance && rect.top < windowHeight && rect.bottom > 0;
    }

    // Helper function to check if we've scrolled to or past an element
    function hasScrolledPastElement(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Return true if the element's top is at or above the center of the viewport
        return rect.top <= windowHeight * 0.5;
    }


    // Link Section Functionality (only for link image)
    function initializeLinkSection() {
        const linkImage = document.querySelector('.link-image');
        if (linkImage) {
            linkImage.addEventListener('click', function () {
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

    // Projects Section Functionality (only for sliding image)
    function initializeProjectsSection() {
        const projectsContainer = document.querySelector('.sliding-image-container');
        if (projectsContainer) {
            projectsContainer.addEventListener('click', function () {
                // Open the project page
                window.location.href = 'projects.html';
            });
        }
    }

    // Projects Section Scroll Animation
    function handleProjectsAnimation() {
        const projectsSection = document.querySelector('.projects-section');
        const slidingImage = document.querySelector('.sliding-image');

        if (!projectsSection || !slidingImage) return;

        const rect = projectsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        // If at the very top and projects section is in view, activate immediately
        if (scrollTop === 0 && rect.top < windowHeight && rect.bottom > 0) {
            if (!projectsSection.classList.contains('visible')) {
                projectsSection.classList.add('visible');
            }
            if (!slidingImage.classList.contains('animate')) {
                setTimeout(() => {
                    slidingImage.classList.add('animate');
                }, 300);
            }
            return;
        }

        // Trigger section fade-in when it's 80% visible from bottom
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
            if (!projectsSection.classList.contains('visible')) {
                projectsSection.classList.add('visible');
            }
        }

        // Trigger image animation when section is 70% visible from bottom
        if (rect.top <= windowHeight * 0.7 && rect.bottom >= 0) {
            if (!slidingImage.classList.contains('animate')) {
                setTimeout(() => {
                    slidingImage.classList.add('animate');
                }, 300);
            }
        }
    }
    // End of DOMContentLoaded
});
