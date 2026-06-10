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
    // For a 20-minute presentation across 19 slides (including transition dividers):
    const pacingTargets = [
        1.5,   // Slide 1: Cover Title (Intro 0:00 - 1:30)
        2.6,   // Slide 2: Executive Summary: The Procurement Paradox
        3.7,   // Slide 3: Evolution of Procurement: The Strategic Hybrid Model
        4.8,   // Slide 4: Key Procurement Challenges & Strategic Sourcing
        6.0,   // Slide 5: Digitalization & Resilience in Procurement (Part 1 ends 6:00)
        6.2,   // Slide 6: Part 2 Section Divider (Transition)
        7.2,   // Slide 7: The Global Supply Chain: A Web of Complexity
        8.2,   // Slide 8: Architecture of the Global Value Chain (GVC)
        9.2,   // Slide 9: Front-End & Back-End Bottlenecks
        10.2,  // Slide 10: SME, Materials & Geopolitical Fragmentation
        11.0,  // Slide 11: Supply Chain Resilience: Digital & Circular (Part 2 ends 11:00)
        11.2,  // Slide 12: Part 3 Section Divider (Transition)
        12.2,  // Slide 13: The Ubiquity of Silicon: Powering the Modern World
        13.2,  // Slide 14: Executive Summary: The Demand Landscape in 2026
        14.2,  // Slide 15: AI & Data Centers: The Generative Revolution
        15.2,  // Slide 16: Automotive: The "Smartphone on Wheels"
        16.2,  // Slide 17: Industrial, IoT & Healthcare: Intelligence at the Edge
        17.0,  // Slide 18: Consumer Electronics & Emerging Frontiers (Part 3 ends 17:00)
        20.0   // Slide 19: Conclusion: A Silicon-Dependent Civilization (Closing ends 20:00)
    ];
 
    // Speaking Script text for each slide
    const slideScripts = [
        // Slide 1: Title
        "Hello everyone. I’m Manus, and today we are conducting a deep-dive into the 'nerve system' of our modern civilization: the 2026 Semiconductor Ecosystem. Over the next 20 minutes, we are going to move beyond the headlines of 'chip shortages' and look at the actual structural mechanics of how silicon is procured, how it moves across the globe, and finally, how it is fundamentally rewriting the DNA of every major industry. Whether you are an investor, a procurement lead, or a strategic planner, this briefing is designed to give you the high-ground view of the $1.3 trillion silicon economy.",
        
        // Slide 2: Executive Summary: The Procurement Paradox
        "We start with the 'Procurement Paradox.' In 2026, we are seeing record-breaking revenue, yet the supply chain has never felt more fragile. Why? Because the 'Just-in-Time' model we spent thirty years perfecting was built for a world of stability—not the world of 'Chip Wars' and AI super-cycles we live in today.",
        
        // Slide 3: Evolution of Procurement
        "To survive, elite firms have pivoted to a Strategic Hybrid Model. We aren't just stockpiling everything—that’s expensive and inefficient. Instead, we are using 'Just-in-Case' logic for the high-value nodes: the 3nm processors and the High Bandwidth Memory that power AI. For everything else, we keep it lean. It’s about being surgical with your inventory.",
        
        // Slide 4: Key Procurement Challenges
        "But you can't be surgical if you're blind. The biggest challenge in 2026 is Data Opacity. Most firms don't know who their Tier-3 or Tier-4 suppliers are. We are solving this through Category Management—segmenting our sourcing by technology node. We treat a 28nm legacy microcontroller for a car window very differently than a 2nm AI accelerator for a data center.",
        
        // Slide 5: Digitalization & Resilience
        "Finally, look at the digitalization of the 'Buy' side. We are now using Business Intelligence Cockpits that use AI to scan geopolitical signals and weather patterns to predict shortages six months out. We are also seeing a rise in 'Friend-Shoring' and Long-Term Agreements. In 2026, a handshake isn't enough; you need 'take-or-pay' contracts and reservation fees to ensure you aren't left behind in the next allocation cycle.",
        
        // Slide 6: Part 2 Section Divider
        "Now, let's look at the 'Silicon Journey.' We move into Part 2: The Global Supply Chain Web, where we trace how chips move across borders, where the key bottlenecks lie, and how geopolitics and circular logic are rewriting supply chain strategies.",

        // Slide 7: The Global Supply Chain
        "Now, let's look at the 'Silicon Journey.' A single chip might cross 70 borders before it ever reaches a consumer. This is the most complex logistical web ever built. It’s a masterpiece of efficiency, but it’s also a 'Chokepoint Architecture.'",
        
        // Slide 8: GVC Architecture
        "The value is incredibly concentrated. The U.S. owns the design; the Netherlands owns the lithography equipment; and East Asia—specifically Taiwan and South Korea—owns the fabrication. TSMC isn't just a company; it is a systemic pillar of the global economy. If that pillar shakes, the whole world feels it.",
        
        // Slide 9: Front-End & Back-End Bottlenecks
        "The new bottleneck in 2026 isn't just the fab; it's the 'Back-End.' We’ve reached the limits of traditional chip design, so we are now 'stacking' chips using advanced packaging like CoWoS. This is where the AI war is being fought. If you can't get capacity in an advanced packaging facility, it doesn't matter how many wafers you can print.",
        
        // Slide 10: SME & Geopolitical Fragmentation
        "And we cannot ignore the 'Chip Wars.' Geopolitics is now a primary architect of the supply chain. Between the U.S. CHIPS Act and China’s massive 'In-Sourcing' push, we are moving toward a multi-polar silicon world. Critical materials like Gallium and Germanium are now being used as strategic levers in a global game of chess.",
        
        // Slide 11: Supply Chain Resilience
        "The response? Circular and Autonomous Supply Chains. We are using AI to 'self-heal' the supply chain—automatically re-routing orders when a port closes or a factory goes down. And we are starting to recycle. We are mining the 'urban mine'—recovering rare earth elements from old electronics to reduce our dependency on volatile mining regions.",
        
        // Slide 12: Part 3 Section Divider
        "Next, we explore Part 3: The End-User Revolution. Sourcing and supply chains ultimately feed into products. We will see how AI, automotive, edge computing, and future computing platforms are driving total silicon dependency across every industry.",

        // Slide 13: The Ubiquity of Silicon
        "So, where does all this silicon end up? Everywhere. We have reached 'Total Silicon Dependency.' Every industry is now a 'tech industry' because every industry is built on chips.",
        
        // Slide 14: Executive Summary: Demand Landscape
        "The demand landscape is shifting. While PCs and smartphones are maturing, AI Infrastructure and Automotive are exploding. AI and Data Centers now drive nearly half of the industry’s total value. We are in a 'multi-speed' market where the high-end is racing ahead while the low-end stabilizes.",
        
        // Slide 15: AI & Data Centers
        "Look at the Data Center. It’s no longer just a place to store files; it’s an 'Intelligence Engine.' We are spending $500 billion a year on AI accelerators. This is the segment that is pushing us to 2nm and beyond. It is the 'Value King' of the semiconductor world.",
        
        // Slide 16: Automotive: The Smartphone on Wheels
        "Then there is the car—the 'Smartphone on Wheels.' An EV in 2026 has over $1,000 worth of chips in it. We are talking about Silicon Carbide for power efficiency and massive SoCs for autonomous driving. The car has become a high-performance computer that just happens to have wheels.",
        
        // Slide 17: Industrial, IoT & Healthcare
        "In the Industrial and Healthcare sectors, we are seeing the rise of 'Edge AI.' We aren't sending data to the cloud anymore; we are processing it right there on the factory floor or inside a medical implant. This requires ultra-reliable, long-lifecycle silicon that can survive for fifteen years in harsh environments.",
        
        // Slide 18: Consumer Electronics & Frontiers
        "And looking at the horizon—Quantum, 6G, and Neuromorphic computing. These aren't science fiction anymore. We are already building the 2030 roadmap. We are designing chips that work like the human brain and networks that make 5G look like dial-up. The innovation cycle is actually accelerating.",
        
        // Slide 19: Conclusion
        "To conclude, the 2026 ecosystem tells us one thing: Silicon Intensity is the new gold standard. The winners of the next decade won't just be the ones with the best software; they will be the ones who master the procurement, the supply chain, and the application of these chips.\n\nBefore we go, look at this infographic. These are the five materials that keep the lights on. From Gallium in your 5G phone to Neon in the lasers that print the chips, these are the true foundations. Most of these are concentrated in a few regions, which is why the 'Silicon Journey' is as much about geology as it is about geometry.\n\nThe 'Chip Wars' are far from over. In fact, they are just beginning. Mastery of this ecosystem is mastery of the future. Thank you for your time."
    ];
 
    // DOM Elements
    const elements = {
        appContainer: document.getElementById('app-container'),
        slideScreen: document.getElementById('slides-frame'),
        slides: document.querySelectorAll('.slide'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        slideNumIndicator: document.getElementById('slide-num-indicator'),
        progressBarFill: document.getElementById('sidebar-progress-fill'),
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
        if (window.lucide) {
            lucide.createIcons();
        }
        loadSettings();
        setupSidebarLinks();
        updateSlideVisibility();
        setupEventListeners();
        initInteractiveComponents();
        setupSyncChannel();
    }

    function setupSidebarLinks() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const idx = parseInt(link.getAttribute('data-index'), 10);
                goToSlide(idx);
                e.preventDefault();
            });
        });
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
        if (storedTheme === 'dark') {
            isDarkTheme = true;
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            isDarkTheme = false;
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
 
        // Update navigation buttons
        if (elements.btnPrev) elements.btnPrev.disabled = currentSlide === 0;
        if (elements.btnNext) elements.btnNext.disabled = currentSlide === totalSlides - 1;
 
        // Slide Indicators
        if (elements.slideNumIndicator) {
            elements.slideNumIndicator.textContent = `Slide ${currentSlide + 1} of ${totalSlides}`;
        }
        
        // Update sidebar links active class
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            const idx = parseInt(link.getAttribute('data-index'), 10);
            if (idx === currentSlide) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Progress Bar
        if (elements.progressBarFill) {
            const progressPercent = (currentSlide / (totalSlides - 1)) * 100;
            elements.progressBarFill.style.width = `${progressPercent}%`;
        }
 
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
            document.documentElement.setAttribute('data-theme', 'dark');
            saveSetting('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
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
        if (!elements.btnTheme) return;
        elements.btnTheme.innerHTML = `<i data-lucide="${isDarkTheme ? 'sun' : 'moon'}" class="lucide-sm"></i>`;
        if (window.lucide) {
            lucide.createIcons();
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
