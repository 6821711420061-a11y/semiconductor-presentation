document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentSlide = 0;
    const totalSlides = 17;
    let isDarkTheme = true;
    let timerSeconds = 0;
    let timerRunning = false;
    
    // Script Font Size State
    const fontSizes = ['sm', 'md', 'lg', 'xl'];
    let currentFontSizeIndex = 1;
 
    // Slide Pacing Budget (seconds)
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
 
    // Slide scripts copy for standalone display
    const slideScripts = [
        // Slide 1: Title
        "Good morning everyone, and welcome to this strategic briefing. Today, we are reviewing 'The 2026 Semiconductor Ecosystem' with a focus on procurement, global supply chains, and end-user verticals.\n\nIn 2026, semiconductor procurement has transitioned from a back-office utility into a core strategic capability for technological growth, commercial innovation, and national security. Over this session, we will analyze how organizations can navigate this crucial field to manage risk and secure supply.",
        
        // Slide 2: Executive Summary: The Procurement Paradox
        "Let's begin with our executive summary on the procurement paradox. The semiconductor industry has reached a massive $1.3 trillion market valuation. However, this record-breaking growth is accompanied by systemic fragility. Sourcing critical logic nodes and High Bandwidth Memory (HBM) remains highly constrained. To thrive, procurement executives must pivot from traditional transactional buying to deep, long-term strategic relationship management.",
        
        // Slide 3: Evolution of Procurement
        "The traditional 'Just-in-Time' inventory model is obsolete for critical semiconductor components. In 2026, the new standard is a hybrid inventory model. Organizations are maintaining 3 to 6 months of buffer stock for high-value, sole-sourced components, while keeping lean, JIT structures for commoditized parts. This balances operational resilience with capital efficiency.",
        
        // Slide 4: Key Procurement Challenges
        "Category management is the key tool to combat supply chain opacity. We segment the procurement landscape into Leading-edge nodes (sub-7nm) and Legacy nodes (28nm and above). Sourcing leading-edge chips requires deep, multi-year R&D partnerships, while legacy sourcing focuses on active multi-sourcing, life-cycle tracking, and securing long-term supply guarantees.",
        
        // Slide 5: Digitalization & Resilience
        "Resilience in 2026 is data-driven. Leading procurement teams utilize AI-enabled 'Business Intelligence Cockpits' to map supplier networks and forecast shortages 6 to 12 months ahead. Furthermore, securing capacity requires proactive commercial structures, including capacity reservation fees and take-or-pay long-term agreements (LTAs).",
        
        // Slide 6: The Global Supply Chain
        "Now we begin Part 2: The Global Supply Chain. A single microchip can cross international borders over 70 times before completion, making it the most complex value chain in industrial history. This 'Silicon Journey' connects chip designers in the US, equipment manufacturers in Europe, silicon fabricators in East Asia, and packaging facilities in Southeast Asia. This creates unmatched efficiency but extreme vulnerability to regional disruptions.",
        
        // Slide 7: GVC Architecture
        "The Global Value Chain is characterized by extreme cluster concentration. The US controls research, design IP, and EDA software; Europe dominates specialized tooling, led by ASML's monopoly on EUV lithography scanners; and East Asia (specifically TSMC and Samsung) commands wafer fabrication. This high specialization means any single failure point halts the entire global system.",
        
        // Slide 8: Front-End & Back-End Bottlenecks
        "While wafer fabrication nodes (like 3nm and the emerging 2nm node) capture public attention, the primary bottleneck in 2026 is back-end advanced packaging. Heterogeneous packaging techniques like Chip-on-Wafer-on-Substrate (CoWoS) and 3D stacking are highly constrained, making packaging the primary growth limiter for high-performance AI chips.",
        
        // Slide 9: SME & Geopolitical Fragmentation
        "Geopolitics has fragmented the silicon landscape into a multi-polar world. Government initiatives—such as the US CHIPS Act ($52B) and massive state funding in Europe and China—have triggered a reshoring race. Crucially, raw material chokepoints like Gallium and Germanium are now active levers of trade and foreign policy.",
        
        // Slide 10: Supply Chain Resilience
        "To build resilience, leading firms are mapping their supply networks down to Tier-4 and Tier-5 suppliers. Additionally, we are seeing the rise of circular supply chains, where firms recover rare earth metals and copper from e-waste to insulate themselves from mining volatility and supply disruptions.",
        
        // Slide 11: The Ubiquity of Silicon
        "We now transition to Part 3: End-User Industries. Semiconductors have become the central nervous system of the global economy. 'Silicon Intensity'—the value of semiconductor content per product unit—is now the primary metric of industrial competitiveness. No modern industry can run or innovate without silicon.",
        
        // Slide 12: Executive Summary: Demand Landscape
        "The demand landscape in 2026 shows a major structural shift. AI infrastructure, automotive electronics, and factory robotics are capturing the majority of growth. While traditional smartphone and PC markets face saturation, specialized automotive and AI accelerator segments are driving industry revenues to new heights.",
        
        // Slide 13: AI & Data Centers
        "AI accelerators have turned data centers into massive intelligence engines, with the market approaching $500 billion. This segment is the primary driver of leading-edge 3nm and 2nm foundry nodes, consuming massive volumes of High Bandwidth Memory and advanced networking silicon.",
        
        // Slide 14: Automotive: The Smartphone on Wheels
        "Electric Vehicles and Advanced Driver Assistance Systems (ADAS) are doubling the semiconductor value per vehicle, now exceeding $1,000 per unit. EVs depend heavily on Silicon Carbide (SiC) power electronics for battery efficiency, while autonomous drive systems require massive local compute power and LiDAR arrays.",
        
        // Slide 15: Industrial, IoT & Healthcare
        "Edge AI is transforming industrial automation and healthcare. Industry 4.0 uses real-time edge analytics for predictive maintenance. In healthcare, semiconductors enable smart implants, wearable biosensors, and personalized diagnostics, demanding highly rugged, long-lifecycle silicon.",
        
        // Slide 16: Consumer Electronics & Frontiers
        "While traditional consumer volumes mature, manufacturers are integrating Neural Processing Units (NPUs) into laptops and phones to enable on-device AI. Looking forward, emerging frontiers like quantum computing, 6G telecom, and brain-inspired neuromorphic chips are defining the roadmap toward 2030.",
        
        // Slide 17: Conclusion
        "In conclusion, we have reached a state of total silicon dependency. The path to a $2 trillion global industry by the early 2030s is clear. The 'Chip Wars' are not just about manufacturing footprint; they are about which nations and companies can best harness silicon to transform their businesses. Let's summarize the key takeaways: Procurement must shift to a hybrid model; packaging is the new supply chokepoint; and AI and Automotive remain the primary engines of value and volume. Thank you, and I am open to any questions."
    ];
 
    // Slide Titles
    const slideTitles = [
        "The Strategic Imperative of Semiconductor Procurement",
        "Executive Summary: The Procurement Paradox",
        "Evolution of Procurement: The Strategic Hybrid Model",
        "Key Procurement Challenges & Strategic Sourcing",
        "Digitalization & Resilience in Procurement",
        "The Global Supply Chain: A Web of Unprecedented Complexity",
        "Architecture of the Global Value Chain (GVC)",
        "Front-End & Back-End Bottlenecks",
        "SME, Materials & Geopolitical Fragmentation",
        "Supply Chain Resilience: Digital & Circular",
        "The Ubiquity of Silicon: Powering the Modern World",
        "Executive Summary: The Demand Landscape in 2026",
        "AI & Data Centers: The Generative Revolution",
        "Automotive: The Smartphone on Wheels",
        "Industrial, IoT & Healthcare: Intelligence at the Edge",
        "Consumer Electronics & Emerging Frontiers",
        "Conclusion: A Silicon-Dependent Civilization"
    ];
 
    // DOM Elements
    const elements = {
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
        previewNextTitle: document.getElementById('preview-next-title'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        slideNumIndicator: document.getElementById('slide-num-indicator')
    };
 
    // Broadcast Channel for Dual Screen Sync
    const syncChannel = new BroadcastChannel('semiconductor-presentation');
 
    function init() {
        setupEventListeners();
        syncChannel.postMessage({ type: 'REQUEST_INITIAL_SYNC' });
    }
 
    // Broadcast Channel Listener
    syncChannel.onmessage = (event) => {
        const data = event.data;
        switch(data.type) {
            case 'SYNC_STATE':
            case 'SYNC_SLIDE':
                currentSlide = data.index;
                isDarkTheme = data.theme !== 'light';
                syncSlideUI();
                syncThemeUI();
                break;
            case 'SYNC_TIMER':
                timerSeconds = data.seconds;
                timerRunning = data.running;
                syncTimerUI();
                break;
            case 'SYNC_THEME':
                isDarkTheme = data.theme !== 'light';
                syncThemeUI();
                break;
        }
    };
 
    function syncSlideUI() {
        elements.slideNumIndicator.textContent = `Slide ${currentSlide + 1} of ${totalSlides}`;
        elements.scriptText.textContent = slideScripts[currentSlide];
        
        document.querySelector('.script-section').scrollTop = 0;
 
        elements.previewCurrentTitle.textContent = `${currentSlide + 1}. ${slideTitles[currentSlide]}`;
        if (currentSlide < totalSlides - 1) {
            elements.previewNextTitle.textContent = `${currentSlide + 2}. ${slideTitles[currentSlide + 1]}`;
        } else {
            elements.previewNextTitle.textContent = "End of Presentation";
        }
 
        elements.btnPrev.disabled = currentSlide === 0;
        elements.btnNext.disabled = currentSlide === totalSlides - 1;
 
        updatePacingGuide();
    }
 
    function syncTimerUI() {
        const mins = Math.floor(timerSeconds / 60);
        const secs = timerSeconds % 60;
        elements.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        elements.btnTimerPlay.textContent = timerRunning ? "Pause" : "Resume";
        updatePacingGuide();
        handleAutoscroll();
    }
 
    function syncThemeUI() {
        if (isDarkTheme) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
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
            elements.pacingStatus.textContent = "Behind schedule. Speed up!";
            elements.pacingStatus.style.color = "var(--accent-rose)";
        } else if (difference < -120) {
            elements.pacingStatus.textContent = "Ahead of schedule. Speak slower.";
            elements.pacingStatus.style.color = "var(--accent-amber)";
        } else {
            elements.pacingStatus.textContent = "On track. Good pace!";
            elements.pacingStatus.style.color = "var(--accent-green)";
        }
    }
 
    function handleAutoscroll() {
        if (!elements.chkAutoscroll.checked || !timerRunning) return;
        
        const scriptSection = document.querySelector('.script-section');
        if (!scriptSection) return;
 
        const targetMins = pacingTargets[currentSlide] - (currentSlide > 0 ? pacingTargets[currentSlide - 1] : 0);
        const durationSeconds = targetMins * 60;
        
        const scrollHeight = scriptSection.scrollHeight - scriptSection.clientHeight;
        if (scrollHeight <= 0) return;
        
        const slideElapsedSeconds = timerSeconds - (currentSlide > 0 ? pacingTargets[currentSlide - 1] * 60 : 0);
        if (slideElapsedSeconds > 0 && slideElapsedSeconds <= durationSeconds) {
            const scrollRatio = slideElapsedSeconds / durationSeconds;
            scriptSection.scrollTop = scrollRatio * scrollHeight;
        }
    }
 
    // Font resizing logic
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
        fontSizes.forEach(sz => elements.scriptText.classList.remove(`script-font-${sz}`));
        elements.scriptText.classList.add(sizeClass);
    }
 
    function setupEventListeners() {
        elements.btnPrev.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'NAV_PREV' });
        });
        elements.btnNext.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'NAV_NEXT' });
        });
 
        elements.btnTimerPlay.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'TIMER_PLAY_PAUSE' });
        });
        elements.btnTimerReset.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'TIMER_RESET' });
        });
 
        elements.btnTextDec.addEventListener('click', () => adjustFontSize('dec'));
        elements.btnTextInc.addEventListener('click', () => adjustFontSize('inc'));
 
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                syncChannel.postMessage({ type: 'NAV_NEXT' });
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
                syncChannel.postMessage({ type: 'NAV_PREV' });
                e.preventDefault();
            }
        });
    }
 
    init();
});
