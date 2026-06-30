// DOM Elements
const body = document.body;
const themeSwitches = document.querySelectorAll('.theme-switch');
const loadingScreen = document.querySelector('.loading-screen');
const hamburgerIcon = document.getElementById('hamburger-icon');
const menuLinks = document.getElementById('menu-links');
const navLinks = document.querySelectorAll('.nav-link');
const currentYear = document.getElementById('year');
const text1Element = document.querySelector('.typewriter-text.text-1');
const text2Element = document.querySelector('.typewriter-text.text-2');
const sections = document.querySelectorAll('section');
const scrollDownButtons = document.querySelectorAll('.scroll-down');
const menuOverlay = document.querySelector('.menu-overlay');

// Gooey Text Morphing Configuration
const morphConfig = {
    morphTime: 0.3,      // duration of morph in seconds
    cooldownTime: 1.2   // duration of stable text pause in seconds
};

// State Variables
const professions = ["Cybersecurity Researcher", "SOC Analyst", "IT Engineer"];
let professionIndex = professions.length - 1;
let morph = 0;
let cooldown = morphConfig.cooldownTime;
let lenis;
let isHoveringNav = false;

// Initialize Lenis Smooth Scroll
function initLenis() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 1.0
        });

        lenis.on('scroll', () => {
            animateOnScroll();
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

// Initialize
function init() {
    initLenis();
    setCurrentYear();
    setupTheme();
    setupEventListeners();
    setupNavCursor();
    startGooeyTextMorphingEffect();
    setupScrollAnimations();
    setupPageLoad();
}

// Set current year in footer
function setCurrentYear() {
    currentYear.textContent = new Date().getFullYear();
}

// Theme functionality
function setupTheme() {
    // Always default to dark mode on first load
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = 'dark';
        localStorage.setItem('theme', 'dark');
    }
    body.setAttribute('data-theme', savedTheme);

    themeSwitches.forEach(switchEl => {
        switchEl.checked = savedTheme === 'light';
    });
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    themeSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', toggleTheme);
    });

    // Mobile menu
    hamburgerIcon.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', closeMenu);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    // Scroll animations
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Scroll down buttons
    scrollDownButtons.forEach(button => {
        button.addEventListener('click', scrollToNextSection);
    });
}

// Page load handler
function setupPageLoad() {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 1000);
}

// Theme toggle handler
function toggleTheme() {
    const isLight = body.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    document.querySelectorAll('.theme-switch').forEach(switchEl => {
        switchEl.checked = newTheme === 'light';
    });
}

// Mobile menu toggle
function toggleMenu() {
    const isOpen = hamburgerIcon.classList.toggle('open');
    hamburgerIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuLinks.classList.toggle('open');
    body.classList.toggle('menu-active');

    if (menuLinks.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
        menuOverlay.style.visibility = 'visible';
        menuOverlay.style.opacity = '1';
    } else {
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        menuOverlay.style.visibility = 'hidden';
        menuOverlay.style.opacity = '0';
    }
}

// Close mobile menu
function closeMenu() {
    hamburgerIcon.classList.remove('open');
    hamburgerIcon.setAttribute('aria-expanded', 'false');
    menuLinks.classList.remove('open');
    body.classList.remove('menu-active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    menuOverlay.style.visibility = 'hidden';
    menuOverlay.style.opacity = '0';
}

// Scroll to next section
function scrollToNextSection() {
    const currentSection = this.closest('section');
    const nextSection = currentSection.nextElementSibling;

    if (nextSection) {
        if (lenis) {
            lenis.scrollTo(nextSection);
        } else {
            window.scrollTo({
                top: nextSection.offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Gooey Text Morphing Effect
function startGooeyTextMorphingEffect() {
    if (!text1Element || !text2Element) return;

    // Initialize text content
    text1Element.textContent = professions[professionIndex];
    text2Element.textContent = professions[(professionIndex + 1) % professions.length];

    let lastTime = new Date();

    const setMorph = (fraction) => {
        text2Element.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Element.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        fraction = 1 - fraction;
        text1Element.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text1Element.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    };

    const doCooldown = () => {
        morph = 0;
        text2Element.style.filter = "";
        text2Element.style.opacity = "100%";
        text1Element.style.filter = "";
        text1Element.style.opacity = "0%";
    };

    const doMorph = () => {
        morph -= cooldown;
        cooldown = 0;
        let fraction = morph / morphConfig.morphTime;

        if (fraction > 1) {
            cooldown = morphConfig.cooldownTime;
            fraction = 1;
        }

        setMorph(fraction);
    };

    function animate() {
        requestAnimationFrame(animate);
        const newTime = new Date();
        const shouldIncrementIndex = cooldown > 0;
        const dt = (newTime.getTime() - lastTime.getTime()) / 1000;
        lastTime = newTime;

        cooldown -= dt;

        if (cooldown <= 0) {
            if (shouldIncrementIndex) {
                professionIndex = (professionIndex + 1) % professions.length;
                text1Element.textContent = professions[professionIndex];
                text2Element.textContent = professions[(professionIndex + 1) % professions.length];
            }
            doMorph();
        } else {
            doCooldown();
        }
    }

    animate();
}

// Smooth scrolling
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        const isMobileMenuLink = this.closest('.menu-links') !== null;
        if (isMobileMenuLink) {
            closeMenu();
        }

        const performScroll = () => {
            if (lenis) {
                lenis.scrollTo(targetElement, { offset: -80 });
            } else {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        };

        if (isMobileMenuLink) {
            setTimeout(performScroll, 50);
        } else {
            performScroll();
        }
    }
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    const screenPosition = window.innerHeight / 1.3;

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;

        if (elementPosition < screenPosition) {
            element.classList.add('active');
        }
    });

    // Update active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    if (!isHoveringNav && typeof window.updateNavCursorPosition === 'function') {
        window.updateNavCursorPosition();
    }
}

function setupScrollAnimations() {
    document.querySelectorAll('.section, .details-container, .project-img').forEach(el => {
        el.classList.add('reveal');
    });
}

function loadParticlesForTheme(theme) {
    if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }
    if (theme === 'light') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#66FCFF" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.85, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#66FCFF",
                    opacity: 0.6,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "window",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.8 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    } else {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#00F0FF" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00F0FF",
                    opacity: 0.3,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "window",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// Detect initial theme
const htmlEl = document.documentElement;
const initialTheme = htmlEl.getAttribute('data-theme') || 'dark';
loadParticlesForTheme(initialTheme);

// Listen for theme changes
const themeSwitch = document.getElementById('theme-switch');
const themeSwitchMobile = document.getElementById('theme-switch-mobile');

function handleThemeChange() {
    const theme = htmlEl.getAttribute('data-theme') || 'dark';
    loadParticlesForTheme(theme);
}

if (themeSwitch) themeSwitch.addEventListener('change', handleThemeChange);
if (themeSwitchMobile) themeSwitchMobile.addEventListener('change', handleThemeChange);

// Navigation Sliding Pill Cursor Highlight
function setupNavCursor() {
    const navLinksContainer = document.querySelector('.nav-links');
    const navCursor = document.querySelector('.nav-cursor');
    const navItems = document.querySelectorAll('.nav-links li:not(.nav-cursor)');

    if (!navLinksContainer || !navCursor) return;

    function positionCursorToActive() {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            const parentLi = activeLink.closest('li');
            if (parentLi) {
                navCursor.style.left = `${parentLi.offsetLeft}px`;
                navCursor.style.width = `${parentLi.offsetWidth}px`;
                navCursor.style.opacity = '1';
                return;
            }
        }
        navCursor.style.opacity = '0';
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            isHoveringNav = true;
            navCursor.style.left = `${item.offsetLeft}px`;
            navCursor.style.width = `${item.offsetWidth}px`;
            navCursor.style.opacity = '1';
        });
    });

    navLinksContainer.addEventListener('mouseleave', () => {
        isHoveringNav = false;
        positionCursorToActive();
    });

    // Make positionCursorToActive globally accessible for animateOnScroll
    window.updateNavCursorPosition = positionCursorToActive;

    // Initial position on load with dynamic check
    setTimeout(positionCursorToActive, 100);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

// --- AI Chatbot Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Show toggle button with a slight delay
    setTimeout(() => {
        chatToggleBtn.style.display = 'flex';
        // Add animation class after it's displayed
        chatToggleBtn.classList.add('animate__animated', 'animate__bounceIn');
    }, 2000);

    // Toggle Chat Window
    chatToggleBtn.addEventListener('click', () => {
        const isActive = chatbotContainer.classList.contains('active');
        if (isActive) {
            chatbotContainer.classList.remove('active');
        } else {
            chatbotContainer.classList.add('active');
            chatInput.focus();
            // Scroll to bottom when opening
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    // Close Chat Window
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Handle Input Enter Key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Handle Send Button Click
    chatSendBtn.addEventListener('click', handleSendMessage);

    // Message History Array
    let conversationHistory = [];

    async function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // Clear input and disable
        chatInput.value = '';
        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        // Add user message to UI
        appendMessage('user', messageText);

        // Add to history
        conversationHistory.push({ role: 'user', content: messageText });

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Call our Serverless API endpoint
            // If running locally with Vercel CLI, it hits /api/chat
            // In production, it hits the relative path /api/chat
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Remove typing indicator
            removeTypingIndicator(typingId);

            // Add bot response to UI
            appendMessage('bot', data.content);

            // Add to history
            conversationHistory.push({ role: 'assistant', content: data.content });

        } catch (error) {
            console.error('Chat Error:', error);
            removeTypingIndicator(typingId);
            appendMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again later.", true);
            // Remove the failed message from history
            conversationHistory.pop();
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();
        }
    }

    function appendMessage(sender, text, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        if (isError) {
            messageDiv.style.color = '#ff4d4d';
        }

        // Extremely basic markdown-to-html for bold text from API
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle basic line breaks
        formattedText = formattedText.replace(/\n/g, '<br>');

        messageDiv.innerHTML = formattedText;
        chatbotMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = id;
        typingDiv.classList.add('message', 'bot-typing');

        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        return id;
    }

    function removeTypingIndicator(id) {
        const typingIndicator = document.getElementById(id);
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
});
