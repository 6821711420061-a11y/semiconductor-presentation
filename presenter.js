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
 
    // Slide scripts copy for standalone display
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
 
    // Slide Titles
    const slideTitles = [
        "Title Slide",
        "30-minute presentation plan",
        "Why semiconductors matter",
        "From silicon to a finished chip",
        "Procurement of semiconductors",
        "How semiconductor buying usually works",
        "What exactly must be sourced?",
        "Main risks and how companies reduce them",
        "The global semiconductor supply chain",
        "Who does what in the chip chain?",
        "From design file to final product",
        "Why semiconductor supply chains become fragile",
        "Industries that semiconductors end up using",
        "Automotive and electric vehicles",
        "AI, data centers, healthcare, and industry",
        "Key takeaways",
        "Sources used"
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
