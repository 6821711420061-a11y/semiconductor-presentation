document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentSlide = 0;
    const totalSlides = 19;
    let isDarkTheme = true;
    let timerSeconds = 0;
    let timerRunning = false;
    
    // Script Font Size State
    const fontSizes = ['sm', 'md', 'lg', 'xl'];
    let currentFontSizeIndex = 1;
 
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
 
    // Slide scripts copy for standalone display
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
 
    // Slide Titles
    const slideTitles = [
        "The 2026 Semiconductor Ecosystem",
        "Executive Summary: The Procurement Paradox",
        "Evolution of Procurement: The Strategic Hybrid Model",
        "Key Procurement Challenges & Strategic Sourcing",
        "Digitalization & Resilience in Procurement",
        "Part 2: The Global Supply Chain of Semiconductors",
        "The Global Supply Chain: A Web of Complexity",
        "Architecture of the Global Value Chain (GVC)",
        "Front-End & Back-End Bottlenecks",
        "SME, Materials & Geopolitical Fragmentation",
        "Supply Chain Resilience: Digital & Circular",
        "Part 3: End-User Industries & Application Ecosystem",
        "The Ubiquity of Silicon: Powering the Modern World",
        "Executive Summary: The Demand Landscape in 2026",
        "AI & Data Centers: The Generative Revolution",
        "Automotive: The \"Smartphone on Wheels\"",
        "Industrial, IoT & Healthcare: Intelligence at the Edge",
        "Consumer Electronics & Emerging Frontiers",
        "Conclusion: A Silicon-Dependent Civilization"ization"
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
        if (window.lucide) {
            lucide.createIcons();
        }
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
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
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
