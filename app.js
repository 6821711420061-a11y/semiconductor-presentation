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
    // For a 25-minute presentation across 15 slides:
    const pacingTargets = [
        1.5,   // Slide 1: Title
        2.5,   // Slide 2: Agenda
        4.5,   // Slide 3: Theoretical Framework
        6.5,   // Slide 4: Procurement: Raw Materials & Chemicals
        8.5,   // Slide 5: Procurement: Lithography & Capital Equipment
        10.5,  // Slide 6: Procurement: Upstream EDA & IP Sourcing
        12.5,  // Slide 7: Supply Chain: GVC Map
        14.5,  // Slide 8: Supply Chain: Fabless-Foundry Disintegration
        16.5,  // Slide 9: Supply Chain: OSAT & Advanced Packaging
        18.5,  // Slide 10: Supply Chain: Risk Modeling & Resilience
        20.5,  // Slide 11: End-Use: Econometric Demand Cycles
        22.0,  // Slide 12: End-Use: High-Performance Computing & AI
        23.5,  // Slide 13: End-Use: Automotive Shortages Case Study
        25.0,  // Slide 14: End-Use: Infrastructure & Defense Sourcing
        26.0   // Slide 15: Conclusion
    ];

    // Speaking Script text for each slide
    const slideScripts = [
        // Slide 1
        "Good morning, members of the review panel and colleagues. Today, I am presenting a literature synthesis and industrial analysis on the global semiconductor ecosystem.\n\nOur research reviews the industry across three distinct academic domains. First, we analyze the economics of procurement, specifically looking at critical raw materials, chemical dependencies, and the capital-intensive equipment monopolies that shape upstream sourcing. Second, we examine the global supply chain, framing it through the lens of industrial organization, vertical disintegration, and geopolitical risk modeling. Finally, we map the end-use industries, using the 2021 automotive supply chain crisis as a primary case study of inventory failures and demand-side volatility.\n\nLet's begin by reviewing our academic frameworks.",
        
        // Slide 2
        "This literature synthesis is structured into three primary research areas:\n\n1. Procurement Sourcing Economics: Here we evaluate quartzite sand extraction, chemical purification pathways (eleven-nines purity), and the monopsony-monopoly dynamics in lithography capital systems, alongside Electronic Design Automation software licensing.\n\n2. The Global Value Chain: We analyze geographic chokepoints, the economic drivers of the Fabless-Foundry model, advanced packaging (OSAT) as a post-Moore's Law scaling mechanism, and macroeconomic simulations of supply chain disruptions.\n\n3. Downstream Industrial Integration: We review empirical data on end-use markets, focusing on the AI capex cycle, the automotive bullwhip effect, and secure sourcing regimes for critical infrastructure and defense aerospace.",
        
        // Slide 3
        "To systematically analyze the semiconductor industry, we must ground our research in three core economic and operational frameworks:\n\n- Global Value Chain (GVC) Theory: Pioneered by Gary Gereffi, GVC theory explains how value is distributed globally. In semiconductors, we observe a highly asymmetric smile curve, where high-value research and design are concentrated in the U.S. and Europe, while lower-margin assembly occurs in developing nations.\n\n- Transaction Cost Economics (TCE): Introduced by Ronald Coase and Oliver Williamson, TCE highlights how 'asset specificity' creates lock-in effects. A fab costing $15 billion represents extreme asset specificity, making foundries highly risk-sensitive and explaining why design firms outsource manufacturing.\n\n- The Bullwhip Effect: Modeled by Hau Lee, this operational concept shows how minor fluctuations in downstream demand are amplified as they move upstream, explaining the severe supply shortages and subsequent overcorrections in industrial markets.",
        
        // Slide 4
        "Our first procurement section reviews the sourcing of raw materials and chemical inputs.\n\nAcademic literature on critical raw materials highlights the extreme purity requirements of semiconductor manufacturing. Quartzite silica sand must be purified into electronic-grade polysilicon of 99.999999999% purity. Slicing these ingots into wafers requires specialized diamond saw lines and chemical-mechanical polishing (CMP) to achieve atomic flatness.\n\nFurthermore, supply chain studies emphasize severe vulnerability in chemical procurement. Fabs depend on specialized photoresists, silicon wafers, and ultra-pure water. Japan commands a near-monopoly in photoresists and silicon substrates (via Shin-Etsu and SUMCO). The 2019 Japan-South Korea export dispute serves as a prime case study of how localized chemical export restrictions can halt entire regional fabrication lines.",
        
        // Slide 5
        "Next, we review the procurement of capital equipment, focusing on Extreme Ultraviolet (EUV) photolithography.\n\nEUV lithography is the primary technical enabler of sub-7nm fabrication. Economic studies of the equipment market describe ASML's complete monopoly as a 'technological bottleneck.' This monopoly was built through decades of R&D alliances and co-investment programs with key suppliers, such as Carl Zeiss for advanced mirror optics and Trumpf for specialized laser generators.\n\nFrom a procurement perspective, these systems represent extreme capital expense. A single EUV machine costs upwards of $150 to $200 million, requiring three Boeing 747 aircraft to ship. The lead times for these machines dictate the global expansion rate of semiconductor manufacturing capacity, placing immense bargaining power in the hands of a single European firm.",
        
        // Slide 6
        "The final upstream procurement domain is intellectual property and design tools, specifically Electronic Design Automation (EDA) software.\n\nBefore physical manufacturing, chip design relies entirely on complex software modeling. Industrial organization studies show that the EDA market is highly consolidated, dominated by a triopoly: Synopsys, Cadence, and Siemens EDA. These tools represent massive intellectual property moats, making it practically impossible for new entrants to design chips without licensing their software.\n\nAdditionally, companies source chip architectures through licensing programs. ARM's proprietary ISA dominates mobile and edge computing, while RISC-V is studied as an open-source alternative designed to bypass licensing costs and trade restrictions. Sourcing design IP and EDA tools constitutes a major capital hurdle prior to physical manufacturing.",
        
        // Slide 7
        "Moving to our second assignment, we map the Global Value Chain geographically to identify systemic chokepoints.\n\nOur GVC model traces the path of a semiconductor across multiple borders. Typically, U.S. firms dominate in high-value design, European firms supply critical equipment, Japanese firms provide raw materials, and East Asian fabs (specifically TSMC in Taiwan and Samsung in Korea) handle fabrication. Final assembly, testing, and packaging (OSAT) are concentrated in Southeast Asia (Malaysia, Vietnam) and China.\n\nThis extreme specialization creates a highly efficient but fragile network. An average chip cross-borders multiple times, traveling over 25,000 miles before completion. Academic studies call this the 'multi-country production model,' highlighting that no single country possesses the technology or materials to build a modern microchip entirely within its borders.",
        
        // Slide 8
        "Within the GVC, the transition to the Fabless-Foundry model represents a major shift in industrial organization.\n\nHistorically, Integrated Device Manufacturers (IDMs) like Intel handled both design and fabrication. However, as the capital cost of building fabs rose exponentially (exceeding $15 billion for a modern fab), the industry vertically disintegrated:\n\n- Fabless firms (NVIDIA, Apple, AMD) focus entirely on design and software, avoiding massive capital expenditures.\n\n- Pure-Play Foundries (TSMC) focus solely on manufacturing on contract, building economies of scale. TSMC operates as a 'trusted intermediary,' guaranteeing clients that it will never compete with them on chip design. This business model innovation allowed TSMC to capture over 60% of global foundry revenues and over 90% of leading-edge production.",
        
        // Slide 9
        "Once fabricated on silicon wafers, chips enter the Assembly, Packaging, and Testing phase, managed by OSAT firms.\n\nIn recent literature, packaging is no longer viewed as a low-value commodity service. As physical scaling limits (Moore's Law) are approached, packaging has become a primary driver of performance. 'Advanced Packaging' techniques, such as TSMC's CoWoS (Chip-on-Wafer-on-Substrate), allow researchers to integrate multiple separate dies—such as logic cores and High-Bandwidth Memory (HBM)—into a single high-performance package.\n\nThis back-end assembly remains geographically concentrated in Southeast Asia, with Malaysia alone managing 13% of global packaging capacity. Literature identifies this back-end concentration as a significant supply chain vulnerability.",
        
        // Slide 10
        "The geographical concentration of fabrication and packaging creates severe geopolitical and macroeconomic risks.\n\nEconomic research organizations (such as the Rhodium Group and Bloomberg Economics) have simulated the impact of a localized disruption in the Taiwan Strait, due to conflicts or natural disasters. These models predict that a complete TSMC shutdown would halt global electronics assembly, causing an estimated $10 trillion loss in global GDP—equivalent to roughly 10% of global output.\n\nIn response, governments are deploying national industrial policies, such as the U.S. CHIPS Act ($52B) and the EU Chips Act ($47B), to subsidize domestic fabrication. However, academic papers note that rebuilding localized, self-sufficient supply chains is hampered by a deficit of specialized engineering labor and high construction costs.",
        
        // Slide 11
        "We now transition to our third assignment: Downstream Industrial Integration and demand dynamics.\n\nData from the Semiconductor Industry Association (SIA) and the World Semiconductor Trade Statistics (WSTS) shows that the semiconductor market is highly cyclical. Historically driven by consumer PC and smartphone cycles, the market is currently undergoing a structural shift. \n\nWe segment the end-use market into five primary economic sectors: High-Performance Computing (37%), Consumer Electronics (32%), Automotive Systems (15%), Industrial & IoT (10%), and Critical Infrastructure/Defense (6%). Each sector exhibits unique demand elasticities, lifecycle requirements, and inventory strategies.",
        
        // Slide 12
        "High-Performance Computing (HPC) and Artificial Intelligence represent the fastest-growing end-use sector.\n\nEconometric models of the AI sector highlight a massive capital expenditure (Capex) cycle driven by hyperscale cloud providers. Generative AI models require training arrays packed with specialized graphics processing units (GPUs) and application-specific integrated circuits (ASICs).\n\nThese chips demand the most advanced fabrication nodes (3nm, 5nm) and advanced packaging (CoWoS) to interface with High-Bandwidth Memory. The literature emphasizes that the HPC market is characterized by price-inelastic demand, where tech firms prioritize computational speed and power efficiency over unit cost, pushing the boundaries of leading-edge foundry nodes.",
        
        // Slide 13
        "The Automotive sector provides a critical case study of supply chain vulnerability and the Bullwhip Effect during the 2021 shortages.\n\nDuring the COVID-19 pandemic, automotive OEMs cut their chip orders, predicting a severe drop in car sales. Fabs immediately reallocated capacity to consumer electronics. When car demand recovered faster than expected, automotive manufacturers found themselves locked out of fab capacity.\n\nThis crisis highlighted the failure of Just-in-Time (JIT) inventory systems for low-cost components. Modern electric and ADAS vehicles require over 1,500 chips, mostly built on mature nodes (such as 28nm, 45nm, and 90nm) for microcontrollers. Sourcing failures in 50-cent microcontrollers halted multi-billion-dollar assembly lines, costing the automotive industry over $200 billion in lost revenue.",
        
        // Slide 14
        "Finally, we analyze secure sourcing regimes for Industrial, Medical, and Aerospace/Defense applications.\n\nThese sectors differ from consumer markets in their emphasis on reliability, lifecycle longevity, and national security. Defense applications (such as missile guidance, radar arrays, and communications satellites) require specialized radiation-hardened microchips that can operate in harsh space and military environments.\n\nTo secure these components, governments maintain Trusted Foundry Programs, certifying specific domestic fabrication lines. Since military systems remain active for decades, procurement contracts must guarantee the long-term availability of mature legacy nodes, shielding these critical sectors from the rapid obsolescence cycles of consumer electronics.",
        
        // Slide 15
        "In conclusion, our literature synthesis reveals three main findings. First, semiconductor procurement is dominated by severe material and equipment chokepoints. Second, the global supply chain has achieved extreme efficiency through vertical specialization, but at the cost of high geopolitical vulnerability. Third, downstream industries require customized supply chain strategies—ranging from leading-edge capex in AI to robust, buffer-stock inventory management in automotive and defense.\n\nFuture research must focus on the commercialization of wide-bandgap materials like Gallium Nitride and Silicon Carbide, as well as the long-term impact of government subsidization on global foundry capacity.\n\nThank you, and I look forward to your questions."
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
            elements.btnTheme.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.03 0-1.41z"/></svg>`;
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
        // Slide 4: Procurement Step Selector
        const pSteps = document.querySelectorAll('.procurement-step');
        pSteps.forEach(step => {
            step.addEventListener('click', () => {
                // Deactivate all steps
                pSteps.forEach(s => s.classList.remove('active'));
                
                // Activate clicked
                step.classList.add('active');
                
                // Update display panel content
                const title = step.getAttribute('data-title');
                const desc = step.getAttribute('data-desc');
                
                document.getElementById('procurement-detail-title').textContent = title;
                document.getElementById('procurement-detail-body').textContent = desc;
            });
        });

        // Slide 7: Global Supply Chain Map Nodes
        const mapNodes = document.querySelectorAll('.map-node');
        const mapLines = document.querySelectorAll('.map-connection-line');
        const tooltip = document.getElementById('map-tooltip');

        mapNodes.forEach(node => {
            node.addEventListener('click', () => {
                // Highlight node connection line
                const targetLineId = node.getAttribute('data-line');
                
                mapLines.forEach(line => {
                    if (line.id === targetLineId) {
                        line.classList.add('active');
                    } else {
                        line.classList.remove('active');
                    }
                });

                // Update Map Tooltip
                const title = node.getAttribute('data-title');
                const desc = node.getAttribute('data-desc');
                
                tooltip.style.opacity = '1';
                document.getElementById('map-tooltip-title').textContent = title;
                document.getElementById('map-tooltip-body').textContent = desc;
            });
        });

        // Slide 11: End-Use Industry Donut Chart
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

            // Update center explanation card or detail if available
            const labels = ["High-Performance Computing (HPC)", "Consumer Electronics", "Automotive Systems", "Industrial & IoT", "Medical & Aerospace/Defense"];
            const shares = ["37%", "32%", "15%", "10%", "6%"];
            const details = [
                "Hyperscale datacenters, GPUs, and TPU clusters. Characterized by price-inelastic demand focused on computing speed, leading-edge nodes (3nm/5nm), and advanced interposer packaging.",
                "High-volume consumer segment (smartphones, PCs). Driven by cyclical consumer upgrade cycles, utilizing leading-edge application processors mixed with mature power nodes.",
                "Focus on electric vehicle power modules (SiC/GaN) and ADAS autonomous processors. Highly vulnerable to the Bullwhip Effect, utilizing mature nodes (28nm-90nm) for microcontrollers.",
                "Factory automation, smart power grids, and IoT edge modules. Prioritizes environmental ruggedness and high lifecycle stability, built almost exclusively on legacy nodes.",
                "Aviation, critical healthcare scanners, and defense systems. Dominated by strict national security regulations, Trusted Foundry certifications, and radiation-hardened components."
            ];

            document.getElementById('industry-detail-title').textContent = labels[idx];
            document.getElementById('industry-detail-value').textContent = `Global Market Share: ${shares[idx]}`;
            document.getElementById('industry-detail-body').textContent = details[idx];
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
            // Select first step by default
            document.querySelector('.procurement-step').click();
        } else if (slideIdx === 6) {
            // Trigger automatic mapping flow sequence for the global map
            const mapNodes = document.querySelectorAll('.map-node');
            const tooltip = document.getElementById('map-tooltip');
            tooltip.style.opacity = '0'; // reset tooltip
            
            let currentHighlight = 0;
            const flowSequence = ['us-design', 'eu-equip', 'jp-wafer', 'tw-fab', 'my-osat'];
            
            // Trigger first node click
            document.getElementById(flowSequence[0]).dispatchEvent(new Event('click'));
            
            // Loop sequence
            mapHighlightInterval = setInterval(() => {
                currentHighlight = (currentHighlight + 1) % flowSequence.length;
                const nextNode = document.getElementById(flowSequence[currentHighlight]);
                if (nextNode) nextNode.dispatchEvent(new Event('click'));
            }, 3500);
        } else if (slideIdx === 10) {
            // Select HPC by default
            document.querySelector('.legend-item').click();
        }
    }

    // Cleanup animations on slide exit
    function cleanupSlideInteractive(slideIdx) {
        if (slideIdx === 6) {
            if (mapHighlightInterval) {
                clearInterval(mapHighlightInterval);
                mapHighlightInterval = null;
            }
            // Deactivate all map connection lines
            document.querySelectorAll('.map-connection-line').forEach(line => {
                line.classList.remove('active');
            });
            document.getElementById('map-tooltip').style.opacity = '0';
        }
    }

    // Initialize the deck
    init();
});
