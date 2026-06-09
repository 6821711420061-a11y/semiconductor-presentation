document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let presenterMode = false;
    let isDarkTheme = true;
    
    // Broadcast Channel for Dual Screen Sync
    const syncChannel = new BroadcastChannel('semiconductor-presentation');
    
    // Presenter Timer State
    let timerInterval = null;
    let timerSeconds = 0;
    let timerRunning = false;
    
    // Script Font Size State
    const fontSizes = ['sm', 'md', 'lg', 'xl'];
    let currentFontSizeIndex = 1; // Default to 'md'
 
    // Slide Pacing Budget (Target cumulative minutes for the end of each slide)
    // For a 30-minute presentation across 17 slides:
    const pacingTargets = [
        1.5,   // Slide 1: Title
        3.0,   // Slide 2: Agenda
        4.5,   // Slide 3: Why semiconductors matter
        6.0,   // Slide 4: From silicon to a finished chip
        7.5,   // Slide 5: Procurement of semiconductors
        9.5,   // Slide 6: How semiconductor buying usually works
        11.5,  // Slide 7: What exactly must be sourced?
        13.5,  // Slide 8: Main risks and how companies reduce them
        15.0,  // Slide 9: The global semiconductor supply chain
        17.5,  // Slide 10: Who does what in the chip chain?
        19.5,  // Slide 11: From design file to final product
        21.5,  // Slide 12: Why semiconductor supply chains become fragile
        23.0,  // Slide 13: Industries that semiconductors end up using
        25.5,  // Slide 14: Automotive and electric vehicles
        27.5,  // Slide 15: AI, data centers, healthcare, and industry
        29.0,  // Slide 16: Key takeaways
        30.0   // Slide 17: Sources used
    ];
 
    // Speaking Script text for each slide
    const slideScripts = [
        // Slide 1: Title
        "Hello everyone, my name is Phyoe Sat Paing. Today, I am presenting my assignment on semiconductors. This presentation is structured into three main sections to explain how semiconductors are procured, how their global supply chain operates, and which industries end up using them. Over the next 30 minutes, we will look at this critical technology from silicon sand to the cars and data centers that power our modern world.",
        
        // Slide 2: Agenda
        "To cover the three assignments comprehensively, I have structured this 30-minute presentation into five distinct parts. We will spend 3 minutes defining what semiconductors are, followed by 8 minutes on procurement, 10 minutes tracing the global supply chain, and 7 minutes examining the downstream industries. We will finish with a 2-minute wrap-up and Q&A. The core message here is that chips are not simple commodities; they are strategic products that connect design, fabrication, logistics, and global markets.",
        
        // Slide 3: Why semiconductors matter
        "Before diving into the assignments, let's establish why semiconductors matter. These chips are the hidden brain of modern society. A single chip controls, stores, senses, and processes information, powering everything from household light switches to military defense systems. Economically, global sales reached a record $791.7 billion in 2025, and are projected by the SIA to approach $1 trillion in 2026. In response to recent disruptions, programs like the US CHIPS Act are investing over $50 billion to secure manufacturing. In logistics, a failure in the chip supply chain immediately stops production across automotive, medical, and electronics industries.",
        
        // Slide 4: From silicon to a finished chip
        "This slide shows the basic flow from raw silicon to a finished chip. We start with silicon wafers, which are printed with circuit layouts using photolithography. Photolithography is the most critical step, printing patterns at nanometer scales. Next, the wafers are etched and chemical layers are deposited. Wafers are then diced into individual dies, which are packaged and tested. A key lesson for procurement is that you are not just buying the finished chip; you must secure the entire upstream pipeline including raw wafers, specialty gases, packaging materials, and testing services.",
        
        // Slide 5: Procurement of semiconductors
        "Now we begin Assignment 1: Procurement. In this industry, procurement goes far beyond buying components; it is an active exercise in risk management. What is bought ranges from finished microchips to chemical gases and manufacturing equipment. The buyers include consumer electronics companies, automakers, cloud providers, and defense firms. Each buyer is chasing the core procurement goals: securing a stable supply, ensuring chips meet precise technical specifications, controlling costs, ensuring quality compliance, and establishing backup sourcing options.",
        
        // Slide 6: How semiconductor buying usually works
        "Let's examine how the buying process actually works. It is structured and slow because chips must go through rigorous qualification. First, we forecast demand based on product launches. Second, we define the technical specifications like the manufacturing node and power requirements. Third, we select suppliers—evaluating distributors, foundries, and packaging houses. Fourth, the qualification stage begins: testing the chips for defects and reliability. Finally, we negotiate contracts and logistics. A major mistake companies make is treating chips like simple spare parts; in reality, replacing a single chip can trigger months of redesign and re-testing.",
        
        // Slide 7: What exactly must be sourced?
        "To illustrate procurement complexity, this slide maps out the entire sourcing ecosystem. We categorize these into four pillars: raw materials like photoresist and wafers; advanced equipment like lithography scanners and metrology tools; design inputs which include Electronic Design Automation software, IP blocks, and engineering talent; and back-end services like assembly and final testing. The complexity is extreme because a bottleneck in just one chemical or a single design license can delay a multi-billion dollar production line.",
        
        // Slide 8: Main risks and how companies reduce them
        "Given these complexities, companies face major risks. We identify five primary procurement threats: long lead times, which we mitigate with safety stock and long-term agreements; single-source dependencies, which require dual-sourcing strategies; quality defects, managed by strict traceability; export controls and geopolitical shifts, which demand compliance monitoring; and sudden demand spikes, resolved through early capacity reservations. Ultimately, a modern procurement strategy must balance cost, security, compliance, and quality.",
        
        // Slide 9: The global semiconductor supply chain
        "Now we move to Assignment 2: The Global Supply Chain. The key takeaway here is interdependence. No single country contains all the steps required to design and build a chip. The supply chain flows from global R&D and design, through EDA software modeling, wafer fabrication, equipment and material inputs, back-end assembly and testing, distribution, and finally to end products. This chain represents the most complex division of labor in industrial history.",
        
        // Slide 10: Who does what in the chip chain?
        "This slide breaks down regional specialization. The United States leads in design and software; Taiwan dominates advanced foundry fabrication and packaging; South Korea excels in memory and manufacturing; Japan holds massive control over raw materials and mature nodes; Europe supplies the world's lithography scanners and equipment; and China and Southeast Asia host the largest footprint for back-end assembly, packaging, and testing. Because of this high specialization, supply-chain resilience cannot be achieved by isolation; it requires deep international coordination.",
        
        // Slide 11: From design file to final product
        "Let's track a chip's physical journey from a design file to a final product. The process spans design houses, foundry fabs, OSAT packaging houses, distributors, and finally end customers. For example, a cutting-edge AI chip is designed in the US, fabricated in Taiwan, packaged in Southeast Asia, integrated into a server, and finally deployed in a European data center. The logistical challenge is massive: every handoff requires strict temperature controls, shock protection, customs compliance, and defect traceability.",
        
        // Slide 12: Why semiconductor supply chains become fragile
        "Why is this supply chain so fragile? It boils down to structural bottlenecks. First, advanced tools like EUV lithography scanners are manufactured by only one company, ASML. Second, capacity is highly inelastic; building a new fab takes at least 3 years and costs up to $20 billion. Third, chemical materials are highly concentrated. Finally, policy risks like tariffs and export controls create massive friction. This means a minor bottleneck in a single chemical or tool immediately ripples downstream, halting multiple global industries simultaneously.",
        
        // Slide 13: Industries that semiconductors end up using
        "Now we begin Assignment 3: End-Use Industries. While every modern sector relies on semiconductors, their needs differ dramatically. We divide the end-use market into 8 primary categories: consumer electronics, automotive, AI/data centers, healthcare, industrial automation, energy grids, aerospace/defense, and telecom. Because foundry capacity is finite, these diverse industries must actively compete for fab allocations, turning chips into a strategic geopolitical resource.",
        
        // Slide 14: Automotive and electric vehicles
        "Let's perform a deep dive into the automotive sector. Modern electric vehicles are essentially computers on wheels. They require Microcontrollers for engines and brakes; power semiconductors to manage battery electricity; sensors like radar and lidar; infotainment systems for navigation; and advanced AI chips for self-driving features. Importantly, most automotive chips are built on mature nodes, not leading-edge ones. This means automakers do not compete for 3-nanometer nodes, but are highly vulnerable to shortages of cheaper, older legacy chips.",
        
        // Slide 15: AI, data centers, healthcare, and industry
        "This slide covers other key sectors: AI and data centers, healthcare, industrial automation, and telecom infrastructure. In AI and data centers, the demand is skyrocketing for GPUs, High-Bandwidth Memory, and high-speed networking. Healthcare requires advanced chips for MRI imaging and surgical robots. Industrial automation relies on machine vision and control PLCs. Telecom needs chips for 5G base stations. According to the SIA, the explosive growth in 2025 was driven heavily by logic and memory chips to satisfy this massive computing and AI demand.",
        
        // Slide 16: Key takeaways
        "To summarize my presentation, we have connected the three assignments into one cohesive narrative. First, procurement is not just purchasing; it is a complex exercise in risk management and compliance. Second, the global supply chain is highly specialized, making it efficient but structurally vulnerable to geopolitical events. Third, downstream industries compete for the same foundry capacity. My final message is that a chip shortage is not simply a technology problem; it is a procurement, logistics, manufacturing, and strategic planning challenge.",
        
        // Slide 17: Sources used
        "Finally, here are the main references I used for my research, including reports from the Semiconductor Industry Association, NIST, CSET Georgetown, ASML, and the World Semiconductor Trade Statistics. Thank you very much for your time and attention. I am now open to any questions you may have."
    ];
 
    // DOM Elements
    const elements = {
        appContainer: document.getElementById('app-container'),
        slideScreen: document.getElementById('slides-frame'),
        slides: document.querySelectorAll('.slide'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        slideNumIndicator: document.getElementById('slide-num-indicator'),
        progressBarFill: document.getElementById('progress-bar-fill'),
        btnTheme: document.getElementById('btn-theme'),
        btnPresenter: document.getElementById('btn-presenter'),
        btnPopoutPresenter: document.getElementById('btn-popout-presenter'),
        btnFullscreen: document.getElementById('btn-fullscreen'),
        
        // Presenter panel elements
        presenterPanel: document.getElementById('presenter-panel'),
        timerDisplay: document.getElementById('timer-display'),
        btnTimerPlay: document.getElementById('btn-timer-play'),
        btnTimerReset: document.getElementById('btn-timer-reset'),
        pacingTarget: document.getElementById('pacing-target'),
        pacingStatus: document.getElementById('pacing-status'),
        scriptText: document.getElementById('script-text'),
        btnTextDec: document.getElementById('btn-text-dec'),
        btnTextInc: document.getElementById('btn-text-inc'),
        chkAutoscroll: document.getElementById('chk-autoscroll'),
        previewCurrentTitle: document.getElementById('preview-current-title'),
        previewNextTitle: document.getElementById('preview-next-title')
    };
 
    // Initialize UI
    function init() {
        loadSettings();
        updateSlideVisibility();
        setupEventListeners();
        initInteractiveComponents();
        setupSyncChannel();
    }
 
    function setupSyncChannel() {
        syncChannel.onmessage = (event) => {
            const data = event.data;
            switch(data.type) {
                case 'REQUEST_INITIAL_SYNC':
                    broadcastState();
                    break;
                case 'NAV_NEXT':
                    nextSlide();
                    break;
                case 'NAV_PREV':
                    prevSlide();
                    break;
                case 'TIMER_PLAY_PAUSE':
                    if (timerRunning) {
                        pauseTimer();
                    } else {
                        startTimer();
                    }
                    break;
                case 'TIMER_RESET':
                    resetTimer();
                    break;
            }
        };
    }
 
    function broadcastState() {
        syncChannel.postMessage({
            type: 'SYNC_STATE',
            index: currentSlide,
            theme: isDarkTheme ? 'dark' : 'light'
        });
        syncChannel.postMessage({
            type: 'SYNC_TIMER',
            seconds: timerSeconds,
            running: timerRunning
        });
    }
 
    // Load persisted settings from LocalStorage
    function loadSettings() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light') {
            isDarkTheme = false;
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        updateThemeIcon();
 
        const storedPresenter = localStorage.getItem('presenterMode');
        if (storedPresenter === 'true') {
            presenterMode = true;
            elements.appContainer.classList.add('presenter-active');
            elements.btnPresenter.classList.add('active');
        }
 
        const storedFontSize = localStorage.getItem('scriptFontSize');
        if (storedFontSize) {
            currentFontSizeIndex = fontSizes.indexOf(storedFontSize);
            if (currentFontSizeIndex === -1) currentFontSizeIndex = 1;
        }
        applyFontSize();
    }
 
    // Save settings helper
    function saveSetting(key, value) {
        localStorage.setItem(key, value);
    }
 
    // Navigation Logic
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Deactivate current slide interactive elements if needed
        cleanupSlideInteractive(currentSlide);
        
        currentSlide = index;
        updateSlideVisibility();
        
        // Trigger animations for the new active slide's interactive components
        initSlideInteractive(currentSlide);
    }
 
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }
 
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }
 
    function updateSlideVisibility() {
        // Toggle slide active classes
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
 
        // Update footer navigation buttons
        elements.btnPrev.disabled = currentSlide === 0;
        elements.btnNext.disabled = currentSlide === totalSlides - 1;
 
        // Slide Indicators
        elements.slideNumIndicator.textContent = `Slide ${currentSlide + 1} of ${totalSlides}`;
        
        // Progress Bar
        const progressPercent = (currentSlide / (totalSlides - 1)) * 100;
        elements.progressBarFill.style.width = `${progressPercent}%`;
 
        // Update script and presenter details
        elements.scriptText.textContent = slideScripts[currentSlide];
        
        // Reset script container scroll to top on slide change
        const scriptSection = document.querySelector('.script-section');
        if (scriptSection) scriptSection.scrollTop = 0;
 
        // Presenter previews
        const currentTitleEl = slides[currentSlide].querySelector('.slide-title') || slides[currentSlide].querySelector('h1') || slides[currentSlide].querySelector('h2');
        const currentTitle = currentTitleEl ? currentTitleEl.textContent : `Slide ${currentSlide + 1}`;
        elements.previewCurrentTitle.textContent = `${currentSlide + 1}. ${currentTitle}`;
 
        if (currentSlide < totalSlides - 1) {
            const nextTitleEl = slides[currentSlide + 1].querySelector('.slide-title') || slides[currentSlide + 1].querySelector('h1') || slides[currentSlide + 1].querySelector('h2');
            const nextTitle = nextTitleEl ? nextTitleEl.textContent : `Slide ${currentSlide + 2}`;
            elements.previewNextTitle.textContent = `${currentSlide + 2}. ${nextTitle}`;
        } else {
            elements.previewNextTitle.textContent = "End of Presentation";
        }
 
        updatePacingGuide();
 
        // Broadcast to presenter pop-out window
        syncChannel.postMessage({
            type: 'SYNC_SLIDE',
            index: currentSlide,
            theme: isDarkTheme ? 'dark' : 'light'
        });
    }
 
    // Presenter Timer Control
    function startTimer() {
        if (timerRunning) return;
        timerRunning = true;
        elements.btnTimerPlay.textContent = "Pause";
        
        broadcastTimerState();
 
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
            updatePacingGuide();
            handleAutoscroll();
            broadcastTimerState();
        }, 1000);
    }
 
    // Presenter Timer Pause
    function pauseTimer() {
        if (!timerRunning) return;
        timerRunning = false;
        elements.btnTimerPlay.textContent = "Resume";
        clearInterval(timerInterval);
        
        broadcastTimerState();
    }
 
    // Presenter Timer Reset
    function resetTimer() {
        pauseTimer();
        timerSeconds = 0;
        elements.btnTimerPlay.textContent = "Start";
        updateTimerDisplay();
        updatePacingGuide();
        
        broadcastTimerState();
    }
 
    function broadcastTimerState() {
        syncChannel.postMessage({
            type: 'SYNC_TIMER',
            seconds: timerSeconds,
            running: timerRunning
        });
    }
 
    function updateTimerDisplay() {
        const mins = Math.floor(timerSeconds / 60);
        const secs = timerSeconds % 60;
        elements.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
 
    function updatePacingGuide() {
        const targetMins = pacingTargets[currentSlide];
        const targetSeconds = targetMins * 60;
        
        elements.pacingTarget.textContent = `Target: < ${Math.floor(targetMins)}m ${(targetMins % 1 * 60).toString().padStart(2, '0')}s`;
        
        if (timerSeconds === 0) {
            elements.pacingStatus.textContent = "Timer not started";
            elements.pacingStatus.style.color = "var(--text-muted)";
            return;
        }
 
        const difference = timerSeconds - targetSeconds;
        
        if (difference > 60) {
            // Behind schedule by more than a minute
            elements.pacingStatus.textContent = "Behind schedule. Speed up!";
            elements.pacingStatus.style.color = "var(--accent-rose)";
        } else if (difference < -120) {
            // Ahead of schedule by more than 2 minutes
            elements.pacingStatus.textContent = "Ahead of schedule. Speak slower.";
            elements.pacingStatus.style.color = "var(--accent-amber)";
        } else {
            // On track
            elements.pacingStatus.textContent = "On track. Good pace!";
            elements.pacingStatus.style.color = "var(--accent-green)";
        }
    }
 
    // Teleprompter Autoscroll
    function handleAutoscroll() {
        if (!elements.chkAutoscroll.checked || !timerRunning) return;
        
        const scriptSection = document.querySelector('.script-section');
        if (!scriptSection) return;
 
        // Auto scroll script container downwards slowly based on current slide's average duration
        const targetMins = pacingTargets[currentSlide] - (currentSlide > 0 ? pacingTargets[currentSlide - 1] : 0);
        const durationSeconds = targetMins * 60;
        
        const scrollHeight = scriptSection.scrollHeight - scriptSection.clientHeight;
        if (scrollHeight <= 0) return;
        
        // Scroll proportionally
        const slideElapsedSeconds = timerSeconds - (currentSlide > 0 ? pacingTargets[currentSlide - 1] * 60 : 0);
        if (slideElapsedSeconds > 0 && slideElapsedSeconds <= durationSeconds) {
            const scrollRatio = slideElapsedSeconds / durationSeconds;
            scriptSection.scrollTop = scrollRatio * scrollHeight;
        }
    }
 
    // Script Text Resizing
    function adjustFontSize(direction) {
        if (direction === 'inc' && currentFontSizeIndex < fontSizes.length - 1) {
            currentFontSizeIndex++;
        } else if (direction === 'dec' && currentFontSizeIndex > 0) {
            currentFontSizeIndex--;
        }
        applyFontSize();
    }
 
    function applyFontSize() {
        const sizeClass = `script-font-${fontSizes[currentFontSizeIndex]}`;
        
        // Remove existing font classes
        fontSizes.forEach(sz => elements.scriptText.classList.remove(`script-font-${sz}`));
        
        elements.scriptText.classList.add(sizeClass);
        saveSetting('scriptFontSize', fontSizes[currentFontSizeIndex]);
    }
 
    // Presenter Mode Toggle
    function togglePresenterMode() {
        presenterMode = !presenterMode;
        if (presenterMode) {
            elements.appContainer.classList.add('presenter-active');
            elements.btnPresenter.classList.add('active');
            saveSetting('presenterMode', 'true');
            // Auto start timer if entering presenter mode
            startTimer();
        } else {
            elements.appContainer.classList.remove('presenter-active');
            elements.btnPresenter.classList.remove('active');
            saveSetting('presenterMode', 'false');
            pauseTimer();
        }
        // Force layout repaint/resize adjustments
        window.dispatchEvent(new Event('resize'));
    }
 
    // Theme Toggle
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            document.documentElement.removeAttribute('data-theme');
            saveSetting('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            saveSetting('theme', 'light');
        }
        updateThemeIcon();
        
        // Broadcast theme change to presenter pop-out
        syncChannel.postMessage({
            type: 'SYNC_THEME',
            theme: isDarkTheme ? 'dark' : 'light'
        });
    }
 
    function updateThemeIcon() {
        if (isDarkTheme) {
            // Show sun icon
            elements.btnTheme.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L18.36 16.95zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.03 0-1.41z"/></svg>`;
        } else {
            // Show moon icon
            elements.btnTheme.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-9 8.3-9.9.5-.1.9.3.8.8-.4 2 .2 4 1.6 5.4 1.4 1.4 3.4 2 5.4 1.6.5-.1.9.3.8.8-.9 4.8-5.1 8.3-9.8 8.3z"/></svg>`;
        }
    }
 
    // Fullscreen Toggle
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
 
    // Setup Event Listeners
    function setupEventListeners() {
        // Nav Buttons
        elements.btnPrev.addEventListener('click', prevSlide);
        elements.btnNext.addEventListener('click', nextSlide);
 
        // Control Buttons
        elements.btnTheme.addEventListener('click', toggleTheme);
        elements.btnPresenter.addEventListener('click', togglePresenterMode);
        elements.btnPopoutPresenter.addEventListener('click', () => {
            const presenterWindow = window.open('presenter.html', 'SemiconductorPresenterConsole', 'width=950,height=750');
            window.addEventListener('beforeunload', () => {
                if (presenterWindow && !presenterWindow.closed) {
                    presenterWindow.close();
                }
            });
        });
        elements.btnFullscreen.addEventListener('click', toggleFullscreen);
 
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                nextSlide();
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
                prevSlide();
                e.preventDefault();
            } else if (e.key === 'p' || e.key === 'P') {
                togglePresenterMode();
            } else if (e.key === 't' || e.key === 'T') {
                toggleTheme();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        });
 
        // Timer Controls
        elements.btnTimerPlay.addEventListener('click', () => {
            if (timerRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });
        elements.btnTimerReset.addEventListener('click', resetTimer);
 
        // Text Sizing Controls
        elements.btnTextDec.addEventListener('click', () => adjustFontSize('dec'));
        elements.btnTextInc.addEventListener('click', () => adjustFontSize('inc'));
 
        // Handle window resize (safeguard aspect ratio fits)
        window.addEventListener('resize', fitSlides);
        fitSlides();
    }
 
    // Fit slides inside the frame maintaining 16:9 ratio dynamically
    function fitSlides() {
        const frameWidth = elements.slideScreen.clientWidth;
        const frameHeight = elements.slideScreen.clientHeight;
        const screenNode = document.querySelector('.slide-screen');
        
        if (!screenNode) return;
        
        // Define slide core resolution (1280x720)
        const baseWidth = 1280;
        const baseHeight = 720;
        
        // Check scale
        const scaleX = (frameWidth - 40) / baseWidth;
        const scaleY = (frameHeight - 40) / baseHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Max scale 1 (do not upscale past 1280x720)
        
        screenNode.style.transform = `scale(${scale})`;
    }
 
    // ----------------------------------------------------
    // INTERACTIVE COMPONENTS INITIALIZATION & HANDLERS
    // ----------------------------------------------------
    let mapHighlightInterval = null;
 
    function initInteractiveComponents() {
        // Slide 4: Process Step Selector
        const pSteps = document.querySelectorAll('.procurement-step');
        pSteps.forEach(step => {
            step.addEventListener('click', () => {
                pSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                const title = step.getAttribute('data-title');
                const desc = step.getAttribute('data-desc');
                document.getElementById('procurement-detail-title').textContent = title;
                document.getElementById('procurement-detail-body').textContent = desc;
            });
        });

        // Slide 6: Buying Process Step Selector
        const bSteps = document.querySelectorAll('.buying-step');
        bSteps.forEach(step => {
            step.addEventListener('click', () => {
                bSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                const title = step.getAttribute('data-title');
                const desc = step.getAttribute('data-desc');
                document.getElementById('buying-detail-title').textContent = title;
                document.getElementById('buying-detail-body').textContent = desc;
            });
        });

        // Slide 11: Global Flow Step Selector
        const fSteps = document.querySelectorAll('.flow-step');
        fSteps.forEach(step => {
            step.addEventListener('click', () => {
                fSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                const title = step.getAttribute('data-title');
                const desc = step.getAttribute('data-desc');
                document.getElementById('flow-detail-title').textContent = title;
                document.getElementById('flow-detail-body').textContent = desc;
            });
        });
 
        // Slide 9: Global Supply Chain Map Nodes
        const mapNodes = document.querySelectorAll('.map-node');
        const mapLines = document.querySelectorAll('.map-connection-line');
        const tooltip = document.getElementById('map-tooltip');
 
        mapNodes.forEach(node => {
            node.addEventListener('click', () => {
                const targetLineId = node.getAttribute('data-line');
                
                mapLines.forEach(line => {
                    if (line.id === targetLineId) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                });
 
                const title = node.getAttribute('data-title');
                const desc = node.getAttribute('data-desc');
                
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    document.getElementById('map-tooltip-title').textContent = title;
                    document.getElementById('map-tooltip-body').textContent = desc;
                }
            });
        });
 
        // Slide 15: End-Use Industry Donut Chart
        const chartSegments = document.querySelectorAll('.donut-segment');
        const legendItems = document.querySelectorAll('.legend-item');
 
        function activateSegment(idx) {
            chartSegments.forEach((seg, i) => {
                if (i === idx) {
                    seg.classList.add('active');
                } else {
                    seg.classList.remove('active');
                }
            });
 
            legendItems.forEach((item, i) => {
                if (i === idx) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
 
            const labels = ["High-Performance Computing (HPC)", "Consumer Electronics", "Automotive Systems", "Industrial & IoT", "Medical & Aerospace/Defense"];
            const shares = ["37%", "32%", "15%", "10%", "6%"];
            const details = [
                "Hyperscale datacenters, GPUs, and TPU clusters. Characterized by price-inelastic demand focused on computing speed, leading-edge nodes (3nm/5nm), and advanced interposer packaging.",
                "High-volume consumer segment (smartphones, PCs). Driven by cyclical consumer upgrade cycles, utilizing leading-edge application processors mixed with mature power nodes.",
                "Focus on electric vehicle power modules (SiC/GaN) and ADAS autonomous processors. Highly vulnerable to the Bullwhip Effect, utilizing mature nodes (28nm-90nm) for microcontrollers.",
                "Factory automation, smart power grids, and IoT edge modules. Prioritizes environmental ruggedness and high lifecycle stability, built almost exclusively on legacy nodes.",
                "Aviation, critical healthcare scanners, and defense systems. Dominated by strict national security regulations, Trusted Foundry certifications, and radiation-hardened components."
            ];
 
            const detailTitle = document.getElementById('industry-detail-title');
            if (detailTitle) {
                detailTitle.textContent = labels[idx];
                document.getElementById('industry-detail-value').textContent = `Global Market Share: ${shares[idx]}`;
                document.getElementById('industry-detail-body').textContent = details[idx];
            }
        }
 
        chartSegments.forEach((seg, idx) => {
            seg.addEventListener('click', () => activateSegment(idx));
        });
 
        legendItems.forEach((item, idx) => {
            item.addEventListener('click', () => activateSegment(idx));
        });
    }
 
    // Trigger animations when slide becomes active
    function initSlideInteractive(slideIdx) {
        if (slideIdx === 3) {
            // Slide 4: select first step
            const firstStep = document.querySelector('.procurement-step');
            if (firstStep) firstStep.click();
        } else if (slideIdx === 5) {
            // Slide 6: select first step
            const firstStep = document.querySelector('.buying-step');
            if (firstStep) firstStep.click();
        } else if (slideIdx === 8) {
            // Slide 9: Trigger automatic mapping flow sequence for the global map
            const mapNodes = document.querySelectorAll('.map-node');
            const tooltip = document.getElementById('map-tooltip');
            if (tooltip) tooltip.style.opacity = '0'; // reset tooltip
            
            let currentHighlight = 0;
            const flowSequence = ['us-design', 'eu-equip', 'jp-wafer', 'tw-fab', 'my-osat'];
            
            const firstNode = document.getElementById(flowSequence[0]);
            if (firstNode) firstNode.dispatchEvent(new Event('click'));
            
            mapHighlightInterval = setInterval(() => {
                currentHighlight = (currentHighlight + 1) % flowSequence.length;
                const nextNode = document.getElementById(flowSequence[currentHighlight]);
                if (nextNode) nextNode.dispatchEvent(new Event('click'));
            }, 3500);
        } else if (slideIdx === 10) {
            // Slide 11: select first step
            const firstStep = document.querySelector('.flow-step');
            if (firstStep) firstStep.click();
        } else if (slideIdx === 14) {
            // Slide 15: Select HPC by default
            const firstLegend = document.querySelector('.legend-item');
            if (firstLegend) firstLegend.click();
        }
    }
 
    // Cleanup animations on slide exit
    function cleanupSlideInteractive(slideIdx) {
        if (slideIdx === 8) {
            if (mapHighlightInterval) {
                clearInterval(mapHighlightInterval);
                mapHighlightInterval = null;
            }
            document.querySelectorAll('.map-connection-line').forEach(line => {
                line.classList.remove('active');
            });
            const tooltip = document.getElementById('map-tooltip');
            if (tooltip) tooltip.style.opacity = '0';
        }
    }
 
    // Initialize the deck
    init();
});
