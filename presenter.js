document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentSlide = 0;
    const totalSlides = 15;
    let isDarkTheme = true;
    let timerSeconds = 0;
    let timerRunning = false;
    
    // Script Font Size State
    const fontSizes = ['sm', 'md', 'lg', 'xl'];
    let currentFontSizeIndex = 1;

    // Slide Pacing Budget (seconds)
    const pacingTargets = [
        1.5, 2.5, 4.5, 6.5, 8.5, 10.5, 12.5, 14.5, 16.5, 18.5, 20.5, 22.0, 23.5, 25.0, 26.0
    ];

    // Slide scripts copy for standalone display
    const slideScripts = [
        "Welcome everyone to this presentation. Today we are going to talk about one of the most critical foundation blocks of our modern society: Semiconductors.\n\nOver the next 25 to 30 minutes, we will explore three key assignments. First, the procurement of semiconductors, meaning how we source the extreme raw materials and equipment to make them. Second, we will look at the global supply chain, which is arguably the most complex and distributed logistics network on Earth. Finally, we'll discuss the end-use industries that consume these chips, from artificial intelligence to automotive and defense systems.\n\nLet's get started.",
        "Here is the agenda for our session. We will break this talk down into three key pillars:\n\n1. Procurement: Sourcing silicon, specialized chemicals, and photolithography machines like EUV from ASML, as well as electronic design software.\n\n2. The Global Supply Chain: How design flows into manufacturing, the difference between fabless companies and foundries like TSMC, the final testing and assembly, and the geopolitical bottlenecks.\n\n3. End-Use Industries: A detailed breakdown of where these chips go, focusing on high-performance computing, automotive, consumer devices, and industrial/military applications.",
        "Before diving into procurement, let's establish a foundational understanding of what a semiconductor actually is.\n\nA semiconductor is a material, typically silicon, that has electrical conductivity properties between a conductor (like copper) and an insulator (like rubber). By applying small electrical currents, we can use these materials as switches, or transistors, representing binary 1s and 0s.\n\nUnder Moore's Law, the number of transistors on a microchip doubles roughly every two years. Today's leading-edge chips pack tens of billions of transistors into an area the size of a fingernail, with features measured in nanometers—smaller than a strand of DNA.",
        "Let's cover Assignment 1: Semiconductor Procurement, beginning with raw materials.\n\nThe process starts with silicon sand, or quartzite. This is refined into metallurgical-grade silicon and then purified into polysilicon of electronic grade—requiring an astonishing purity level of 99.999999999%, often referred to as 'eleven nines.'\n\nThis polysilicon is melted and grown into a single crystal silicon ingot, which is sliced with high-precision wire saws into wafers. These wafers are polished to an atomic scale.\n\nBeyond silicon, fabs must procure specialized high-purity chemicals, photoresists (which react to light), and gases like silane and phosphine, plus millions of gallons of ultra-pure water daily. Sourcing these chemicals is a highly specialized process, with Japan supplying over 70% of critical photoresists globally.",
        "Next in procurement is photolithography and capital equipment.\n\nThis is the most expensive and complex step in chip making. Fabs must procure lithography machines, which act like ultra-precise slide projectors, printing microscopic circuit designs onto the silicon wafer.\n\nASML, a company in the Netherlands, has a 100% monopoly on Extreme Ultraviolet, or EUV, lithography machines. Each EUV machine costs upwards of $150 to $200 million, contains over 100,000 parts, uses Zeiss mirrors polished to atomic flatness, and requires three Boeing 747s to ship. Without procuring these specific machines, manufacturing chips below 7 nanometers is practically impossible.",
        "The final pillar of semiconductor procurement is design intellectual property and software.\n\nBefore you manufacture a chip, you must design it. This requires Electronic Design Automation (EDA) software. The EDA market is dominated by three companies, mostly based in the U.S.: Synopsys, Cadence, and Siemens EDA. These tools allow engineers to model and verify circuits containing billions of transistors.\n\nAdditionally, companies procure chip architecture IP rather than designing from scratch. ARM licenses its architecture to companies like Apple and Qualcomm, while RISC-V is gaining ground as an open-source alternative. Sourcing software licenses and IP blocks is a major capital cost before a single wafer is ever baked.",
        "Now let's transition to Assignment 2: The Global Supply Chain.\n\nThis map demonstrates the highly globalized nature of semiconductor manufacturing. A single chip can travel over 25,000 miles, cross international borders 70 times, and take up to 100 days to complete.\n\nTypically, U.S. and European firms dominate chip design and software. The equipment comes from the Netherlands (ASML), Japan, and the U.S. Raw materials are sourced from Japan and Germany. Wafer fabrication occurs primarily in Taiwan (TSMC) and South Korea (Samsung). Assembly and testing take place in Southeast Asia, particularly Malaysia and China. It is a highly interconnected web with no single country self-sufficient.",
        "Within the supply chain, the industry split into the Fabless-Foundry model in the late 1980s.\n\n- Fabless companies, like NVIDIA, Apple, AMD, and Qualcomm, focus entirely on design, marketing, and software. They own no factories (fabs) because building a modern 3nm fab costs over $15-20 billion.\n\n- Pure-play Foundries, pioneered by TSMC (Taiwan Semiconductor Manufacturing Company) in Taiwan, manufacture chips designed by others. TSMC commands over 60% of global foundry revenues and over 90% of leading-edge production.\n\n- Integrated Device Manufacturers, or IDMs, like Intel and Samsung, both design and manufacture their own chips, though Intel is now moving toward a split foundry model to compete with TSMC.",
        "Once a wafer is fabricated, it must undergo Assembly, Packaging, and Testing, often outsourced to OSAT companies (Outsourced Semiconductor Assembly and Test).\n\nThe circular wafer is diced into individual square chips (dies). These dies are mounted on lead frames or substrates, wired (wire-bonding or flip-chip), and encapsulated in protective plastic or ceramic cases.\n\nAdvanced packaging has become critical to extending Moore's Law. Technologies like TSMC's CoWoS (Chip-on-Wafer-on-Substrate) allow multiple dies (like HBM memory and GPU cores) to be stacked side-by-side on a silicon interposer. Southeast Asia, specifically Malaysia, accounts for about 13% of global back-end testing and packaging.",
        "The extreme concentration of the supply chain creates significant geopolitical bottlenecks and vulnerabilities.\n\nTSMC alone produces over 90% of the world's advanced processors. If Taiwan's fabs were disrupted due to an earthquake, conflict, or water shortage, it is estimated it would cost the global economy trillions of dollars and halt electronics production worldwide.\n\nIn response, governments are trying to build supply chain resilience. The U.S. passed the $52B CHIPS Act, and the European Union passed the EU Chips Act to fund local foundries. However, rebuilding complete domestic supply chains is incredibly difficult and will take decades due to the lack of specialized labor and ecosystem concentration.",
        "Now, let's explore Assignment 3: End-Use Industries that rely on semiconductors, starting with High-Performance Computing and AI.\n\nThis is the fastest-growing sector, driven by generative AI models like ChatGPT. Large language models require massive datacenters packed with thousands of GPUs and specialized AI accelerators, like NVIDIA's H100 or Blackwell chips.\n\nThese chips require the most advanced fabrication processes (3nm and 4nm) and advanced packaging (CoWoS) to handle high-bandwidth memory. HPC is driving the demand for cutting-edge nodes, pushing foundries to invest in 2nm and 1.4nm technologies.",
        "The second major end-use industry is Consumer Electronics, historically the volume driver of the industry.\n\nSmartphones, PCs, laptops, and tablets consume an enormous volume of chips. A single modern smartphone contains a leading-edge application processor (like Apple's A-series), 5G modems, image sensors, power management integrated circuits (PMICs), and flash memory.\n\nWhile computing power is key, consumer electronics are highly cost-sensitive and rely on a mix of leading-edge nodes for the main processors and mature nodes for peripheral chips.",
        "The third end-use industry is Automotive, which has seen its semiconductor content skyrocket.\n\nModern cars are essentially 'computers on wheels.' Electric vehicles (EVs) require specialized power semiconductors (using Silicon Carbide - SiC) to manage high voltages and batteries. Advanced Driver Assistance Systems (ADAS) and autonomous driving require powerful processors, cameras, and radar sensors.\n\nInterestingly, the automotive industry relies heavily on mature nodes (like 28nm, 40nm, and 90nm) for microcontrollers. During the 2021 shortages, automotive factories halted not because of a lack of AI chips, but because they couldn't procure 50-cent microcontrollers for window wipers.",
        "Finally, we have Industrial, Medical, and Aerospace/Defense industries.\n\n- Industrial applications include factory automation, smart grids, and robotics, which require rugged analog sensors and power management chips.\n\n- Medical devices range from MRI scanners and pacemakers to digital thermometers, demanding high reliability.\n\n- Aerospace and Defense require specialized, radiation-hardened chips for satellites, missiles, guidance systems, and communications. Because these systems have lifecycles spanning decades, they rely heavily on secure, trusted foundries producing mature, highly stable nodes.",
        "In conclusion, we have traveled through the entire semiconductor lifecycle.\n\nWe saw that procurement is highly specialized, relying on extreme materials and monopolistic equipment like ASML's EUV. We learned that the global supply chain is incredibly efficient but fragile, with critical bottlenecks in Taiwan. Finally, we looked at how semiconductors power every pillar of modern society, from AI datacenters to everyday vehicles.\n\nLooking forward, new materials like Gallium Nitride and Silicon Carbide, along with quantum computing, will define the next era of technology. Sourcing and securing these chips remains the ultimate geopolitical challenge of our time.\n\nThank you, and I am open to any questions."
    ];

    // Slide Titles
    const slideTitles = [
        "Title Slide",
        "Presentation Agenda",
        "Theoretical Framework",
        "Procurement: Raw Materials",
        "Procurement: Lithography & Equipment",
        "Procurement: Design & EDA",
        "Supply Chain: GVC Map",
        "Supply Chain: Models",
        "Supply Chain: OSAT Packaging",
        "Supply Chain: Risks & Resilience",
        "End-Use: Econometric Demand",
        "End-Use: HPC & AI Capex",
        "End-Use: Automotive Shortages",
        "End-Use: Infrastructure & Defense",
        "Conclusion & Future"
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
        // Request current state from the main presentation window upon load
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
        
        // Reset scroll position on slide change
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
        // Navigation clicks (send commands back to main presentation)
        elements.btnPrev.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'NAV_PREV' });
        });
        elements.btnNext.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'NAV_NEXT' });
        });

        // Timer clicks (send commands back to main presentation)
        elements.btnTimerPlay.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'TIMER_PLAY_PAUSE' });
        });
        elements.btnTimerReset.addEventListener('click', () => {
            syncChannel.postMessage({ type: 'TIMER_RESET' });
        });

        // Text Sizing clicks
        elements.btnTextDec.addEventListener('click', () => adjustFontSize('dec'));
        elements.btnTextInc.addEventListener('click', () => adjustFontSize('inc'));

        // Keyboard navigation forward-controls from this window
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
