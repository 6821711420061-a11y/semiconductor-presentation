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
        1.5,   // Slide 1: Cover Title
        3.0,   // Slide 2: Executive Summary: The Procurement Paradox
        4.5,   // Slide 3: Evolution of Procurement: The Strategic Hybrid Model
        6.0,   // Slide 4: Key Procurement Challenges & Strategic Sourcing
        8.0,   // Slide 5: Digitalization & Resilience in Procurement
        10.0,  // Slide 6: The Global Supply Chain: A Web of Unprecedented Complexity
        12.0,  // Slide 7: Architecture of the Global Value Chain (GVC)
        14.0,  // Slide 8: Front-End & Back-End Bottlenecks
        16.0,  // Slide 9: SME, Materials & Geopolitical Fragmentation
        18.0,  // Slide 10: Supply Chain Resilience: Digital & Circular
        20.0,  // Slide 11: The Ubiquity of Silicon: Powering the Modern World
        21.5,  // Slide 12: Executive Summary: The Demand Landscape in 2026
        23.5,  // Slide 13: AI & Data Centers: The Generative Revolution
        25.5,  // Slide 14: Automotive: The "Smartphone on Wheels"
        27.0,  // Slide 15: Industrial, IoT & Healthcare: Intelligence at the Edge
        28.5,  // Slide 16: Consumer Electronics & Emerging Frontiers
        30.0   // Slide 17: Conclusion: A Silicon-Dependent Civilization
    ];
 
    // Speaking Script text for each slide
    const slideScripts = [
        // Slide 1: Title
        "Good morning everyone, and welcome to this strategic briefing. Today, we are reviewing 'The 2026 Semiconductor Ecosystem' with a focus on procurement, global supply chains, and end-user verticals.\n\nIn 2026, semiconductor procurement has transitioned from a back-office utility into a core strategic capability for technological growth, commercial innovation, and national security. Over this session, we will analyze how organizations can navigate this crucial field to manage risk and secure supply.",
        
        // Slide 2: Executive Summary: The Procurement Paradox
        "Let's begin with our executive summary on the procurement paradox. The semiconductor industry has reached a massive $1.3 trillion market valuation. However, this record-breaking growth is accompanied by systemic fragility. Sourcing critical logic nodes and High Bandwidth Memory (HBM) remains highly constrained. To thrive, procurement executives must pivot from traditional transactional buying to deep, long-term strategic relationship management.",
        
        // Slide 4 (Slide 3): Evolution of Procurement
        "The traditional 'Just-in-Time' inventory model is obsolete for critical semiconductor components. In 2026, the standard is a hybrid inventory model. Organizations are maintaining 3 to 6 months of buffer stock for high-value, sole-sourced components, while keeping lean, JIT structures for commoditized parts. This balances operational resilience with capital efficiency.",
        
        // Slide 5 (Slide 4): Key Procurement Challenges
        "Category management is the key tool to combat supply chain opacity. We segment the procurement landscape into Leading-edge nodes (sub-7nm) and Legacy nodes (28nm and above). Sourcing leading-edge chips requires deep, multi-year R&D partnerships, while legacy sourcing focuses on active multi-sourcing, life-cycle tracking, and securing long-term supply guarantees.",
        
        // Slide 6 (Slide 5): Digitalization & Resilience
        "Resilience in 2026 is data-driven. Leading procurement teams utilize AI-enabled 'Business Intelligence Cockpits' to map supplier networks and forecast shortages 6 to 12 months ahead. Furthermore, securing capacity requires proactive commercial structures, including capacity reservation fees and take-or-pay long-term agreements (LTAs).",
        
        // Slide 7 (Slide 6): The Global Supply Chain
        "Now we begin Part 2: The Global Supply Chain. A single microchip can cross international borders over 70 times before completion, making it the most complex value chain in industrial history. This 'Silicon Journey' connects chip designers in the US, equipment manufacturers in Europe, silicon fabricators in East Asia, and packaging facilities in Southeast Asia. This creates unmatched efficiency but extreme vulnerability to regional disruptions.",
        
        // Slide 8 (Slide 7): GVC Architecture
        "The Global Value Chain is characterized by extreme cluster concentration. The US controls research, design IP, and EDA software; Europe dominates specialized tooling, led by ASML's monopoly on EUV lithography scanners; and East Asia (specifically TSMC and Samsung) commands wafer fabrication. This high specialization means any single failure point halts the entire global system.",
        
        // Slide 9 (Slide 8): Front-End & Back-End Bottlenecks
        "While wafer fabrication nodes (like 3nm and the emerging 2nm node) capture public attention, the primary bottleneck in 2026 is back-end advanced packaging. Heterogeneous packaging techniques like Chip-on-Wafer-on-Substrate (CoWoS) and 3D stacking are highly constrained, making packaging the primary growth limiter for high-performance AI chips.",
        
        // Slide 10 (Slide 9): SME & Geopolitical Fragmentation
        "Geopolitics has fragmented the silicon landscape into a multi-polar world. Government initiatives—such as the US CHIPS Act ($52B) and massive state funding in Europe and China—have triggered a reshoring race. Crucially, raw material chokepoints like Gallium and Germanium are now active levers of trade and foreign policy.",
        
        // Slide 11 (Slide 10): Supply Chain Resilience
        "To build resilience, leading firms are mapping their supply networks down to Tier-4 and Tier-5 suppliers. Additionally, we are seeing the rise of circular supply chains, where firms recover rare earth metals and copper from e-waste to insulate themselves from mining volatility and supply disruptions.",
        
        // Slide 12 (Slide 11): The Ubiquity of Silicon
        "We now transition to Part 3: End-User Industries. Semiconductors have become the central nervous system of the global economy. 'Silicon Intensity'—the value of semiconductor content per product unit—is now the primary metric of industrial competitiveness. No modern industry can run or innovate without silicon.",
        
        // Slide 13 (Slide 12): Executive Summary: Demand Landscape
        "The demand landscape in 2026 shows a major structural shift. AI infrastructure, automotive electronics, and factory robotics are capturing the majority of growth. While traditional smartphone and PC markets face saturation, specialized automotive and AI accelerator segments are driving industry revenues to new heights.",
        
        // Slide 14 (Slide 13): AI & Data Centers
        "AI accelerators have turned data centers into massive intelligence engines, with the market approaching $500 billion. This segment is the primary driver of leading-edge 3nm and 2nm foundry nodes, consuming massive volumes of High Bandwidth Memory and advanced networking silicon.",
        
        // Slide 15 (Slide 14): Automotive: The Smartphone on Wheels
        "Electric Vehicles and Advanced Driver Assistance Systems (ADAS) are doubling the semiconductor value per vehicle, now exceeding $1,000 per unit. EVs depend heavily on Silicon Carbide (SiC) power electronics for battery efficiency, while autonomous drive systems require massive local compute power and LiDAR arrays.",
        
        // Slide 16 (Slide 15): Industrial, IoT & Healthcare
        "Edge AI is transforming industrial automation and healthcare. Industry 4.0 uses real-time edge analytics for predictive maintenance. In healthcare, semiconductors enable smart implants, wearable biosensors, and personalized diagnostics, demanding highly rugged, long-lifecycle silicon.",
        
        // Slide 17 (Slide 16): Consumer Electronics & Frontiers
        "While traditional consumer volumes mature, manufacturers are integrating Neural Processing Units (NPUs) into laptops and phones to enable on-device AI. Looking forward, emerging frontiers like quantum computing, 6G telecom, and brain-inspired neuromorphic chips are defining the roadmap toward 2030.",
        
        // Slide 18 (Slide 17): Conclusion
        "In conclusion, we have reached a state of total silicon dependency. The path to a $2 trillion global industry by the early 2030s is clear. The 'Chip Wars' are not just about manufacturing footprint; they are about which nations and companies can best harness silicon to transform their businesses. Let's summarize the key takeaways: Procurement must shift to a hybrid model; packaging is the new supply chokepoint; and AI and Automotive remain the primary engines of value and volume. Thank you, and I am open to any questions."
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
