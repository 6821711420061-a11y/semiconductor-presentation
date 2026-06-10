document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentSlide = 0;
    const totalSlides = 20;
    let isDarkTheme = true;
    let timerSeconds = 0;
    let timerRunning = false;
    
    // Script Font Size State
    const fontSizes = ['sm', 'md', 'lg', 'xl'];
    let currentFontSizeIndex = 1;
 
    // Slide Pacing Budget (Target cumulative minutes for the end of each slide)
    // For a 20-minute presentation across 20 slides (including transition dividers):
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
        19.0,  // Slide 19: Conclusion: A Silicon-Dependent Civilization
        20.0   // Slide 20: Thank You & Q&A (Closing ends 20:00)
    ];
 
    // Slide scripts copy for standalone display
    const slideScripts = [
        // Slide 1: Title
        "Good afternoon, Professor. My name is Phyoe Sat Paing, and today I am presenting my consolidated master briefing on the 2026 Semiconductor Ecosystem. This presentation represents an intensive, multi-layered investigation into the critical macroarchitectures of the global chip industry. I have structured this briefing directly around your three core assignment pillars: Sourcing and Procurement, Global Supply Chain Mechanics, and Downstream End-User Industries. Over the next twenty minutes, I will demonstrate how semiconductors have transitioned from basic electronic components into the ultimate instruments of global geopolitical leverage, economic insulation, and corporate competitive advantage. Let us begin with Part One, focusing on the radical evolution of microelectronic procurement.",
        
        // Slide 2: Executive Summary: The Procurement Paradox
        "When analyzing semiconductor procurement in 2026, we encounter an operational paradox. On one hand, the market cap is projecting toward a staggering 1.3 trillion dollar valuation, fueled by an insatiable global demand for artificial intelligence accelerators and electric vehicle power logic. Yet, beneath this massive valuation lies extreme systemic fragility. Leading-edge fabs are running at near maximum capacity utilization rates. This means even a minor logistics bottleneck, a localized power grid failure, or a trace material delivery delay can trigger massive downstream factory shutdowns. For advanced logic, availability rests entirely on sub-3nm allocations. Consequently, modern procurement functions have had to pivot away from transactional, short-term purchasing toward long-term capacity reservation models. Securing advanced logic is no longer a matter of price haggling; it is a matter of corporate survival.",
        
        // Slide 3: Evolution of Procurement: The Strategic Hybrid Model
        "To understand where we are today, we must look at how procurement philosophies have fundamentally shifted. For decades, the global manufacturing sector relied on pure Just-in-Time, or JIT, procurement. JIT was optimized purely for cost efficiency, keeping warehouse inventories near zero to eliminate capital lock-up. However, the semiconductor shortages of recent years exposed a fatal flaw: JIT optimizes for stable efficiency, not operational continuity. Today, pure JIT is obsolete for mission-critical components. The new standard is a Strategic Hybrid Model. As visualized on this slide, we split procurement into two distinct paths. For commoditized, legacy passive components where suppliers are abundant, we still utilize lean JIT dynamics to minimize costs. But for critical, sole-sourced nodes like High Bandwidth Memory or custom GPUs, organizations now maintain 3 to 6 months of strategic buffer stocks as an insurance policy.",
        
        // Slide 4: Key Procurement Challenges & Strategic Sourcing
        "The two primary enemies of a modern procurement executive are data opacity across the multi-tier supplier network and a reactive, 'firefighting' approach to risk mitigation. To solve this, advanced category management requires a sharp segregation of sourcing strategies based on technology nodes. On the left hand of our framework, we have Leading-Edge Nodes, which refers to sub-7nanometer fabrications. Sourcing here requires deep R&D alliances, engineering collaboration, and heavy upfront capital capacity reservations. You are dealing with virtual monopolies like TSMC. On the right side, we have Legacy Nodes—typically 28-nanometer and above. The challenge here isn't technological complexity; it's lifecycle tracking and obsolescence. For legacy chips, procurement must emphasize continuous multi-sourcing and broad distributor network qualification to ensure a single discontinued component doesn't break an entire production line.",
        
        // Slide 5: Digitalization & Resilience in Procurement
        "Building structural resilience into procurement requires a heavy investment in digitalization. Leading enterprises have deployed AI-driven 'Business Intelligence Cockpits'. These systems don't just track your direct tier-1 suppliers; they use predictive algorithms to map deep into your tier-2 and tier-3 chemical and substrate providers. If a specialized quartz mine or a neon purification plant faces an export block or an environmental closure, the AI flags it 6 to 12 months before it manifests as a shortage at the fab level. This predictive window gives companies the time needed to negotiate complex Long-Term Agreements, pay upfront reservation fees, and commit to 'take-or-pay' clauses to secure their wafer allocations. Furthermore, we are seeing a massive trend toward 'Friend-Shoring,' where sourcing paths are deliberately re-routed away from geopolitically unstable regions and into allied economic nodes to insulate operations from trade wars.",
        
        // Slide 6: Part 2 Section Divider (Transition)
        "This brings us directly to Part Two of our consolidated briefing, where we move from the procurement office to the global landscape. We will now analyze the physical architecture of the global semiconductor supply chain, examining why it is structurally prone to bottlenecks and how the market is attempting to build circular resilience models to survive geopolitical fragmentation.",
 
        // Slide 7: The Global Supply Chain: A Web of Complexity
        "The semiconductor supply chain is widely recognized as the most complex and geographically dispersed value chain in human history. As illustrated on the geographical flow map on this slide, a single integrated circuit can cross international borders over 70 times before it is finally soldered into an end-user device. This creates an extreme, hyper-specialized international division of labor. The United States serves as the anchor for design intellectual property and Electronic Design Automation software. Europe acts as the provider of advanced lithography equipment. Japan dominates the supply of ultra-pure chemical materials, while Taiwan handles the actual front-end fabrication. Finally, Southeast Asian nations like Malaysia manage the back-end assembly, testing, and packaging. This extreme dependency means that disrupting even a single region impacts the entire global electronics supply pipeline instantly.",
        
        // Slide 8: Architecture of the Global Value Chain (GVC)
        "Let's zoom into the extreme market concentrations within this Global Value Chain architecture. Value creation is highly localized into specific structural monopolies. In the United States, companies hold an 80% plus market share in advanced Electronic Design Automation software. Without software tools from firms like NVIDIA, Qualcomm, or Apple, designing a modern microchip is physically impossible. Moving to Europe, we see a near monopoly held by ASML in the Netherlands regarding Extreme Ultraviolet tools required to etch sub-7nm circuit nodes. Every single leading-edge chip on Earth requires an ASML machine. This means front-end wafer fabrication, dominated by TSMC in Taiwan and Samsung in South Korea, is entirely dependent on Western equipment and design blueprints to feed their production bases.",
        
        // Slide 9: Front-End & Back-End Bottlenecks
        "For many years, the primary focus of semiconductor innovation was front-end node scaling—the relentless race to shrink transistors down to the 2-nanometer and 1.4-nanometer thresholds. While front-end fabrication lines still require monumental capital investments, a structural shift has occurred in 2026. The primary growth bottleneck for the artificial intelligence industry has moved from the front-end to the back-end. Advanced Back-End Packaging, specifically Chip-on-Wafer-on-Substrate or CoWoS, along with 3D stacking, is the new industry chokepoint. To create a modern AI accelerator, you must seamlessly integrate multiple logic dies with surrounding High Bandwidth Memory stacks onto a specialized silicon interposer. Currently, global back-end capacity is severely constrained. Reaching target production yields depends heavily on advanced back-end capacity, not just front-end printing nodes.",
        
        // Slide 10: SME, Materials & Geopolitical Fragmentation
        "This hyper-concentration has turned the semiconductor supply chain into a prime geopolitical battleground, causing severe fragmentation. We have moved away from a unified global market into a highly regionalized, multi-polar silicon world. Governments are treating chips as assets of national sovereignty. For instance, the United States has deployed the 52 billion dollar CHIPS Act, providing massive financial subsidies to build domestic advanced logic fabs to balance the heavy East Asian concentration. Europe and China are engaged in similar multi-billion dollar state-supported reshoring initiatives. In retaliation, we see material chokepoints being leveraged as economic weapons. Strict export controls have been placed on critical trace materials like Gallium and Germanium. These elements are vital for power electronics and radar systems, and their restriction forces a global scramble for alternative supply loops.",
        
        // Slide 11: Supply Chain Resilience: Digital & Circular
        "To survive this fragmented environment, supply chain architectures are evolving from static, linear models into circular, autonomous networks. First, advanced manufacturers are utilizing deep digital mapping tools to achieve multi-tier visibility. They are tracing their supply structures past their direct partners, all the way down to Tier-4 and Tier-5 chemical facilities that supply raw acids and substrates. Second, the industry is investing heavily in Circular Mineral Reclamation. Rather than relying solely on volatile geopolitical mining nodes, firms are actively recycling electronic waste to reclaim high-purity copper, gold, and recycled silicon substrates. This circular economy integration acts as a critical strategic buffer, shielding foundry operations from raw material shocks while aligning with modern environmental sustainability mandates.",
        
        // Slide 12: Part 3 Section Divider (Transition)
        "We now move to the final assignment of our ecosystem study: Part Three, an examination of the downstream end-user industries that absorb this massive silicon output. We will analyze how different commercial sectors are integrating microchips, why demand is fracturing into a multi-speed market, and how silicon intensity has become the definitive index for industrial scaling.",
 
        // Slide 13: The Ubiquity of Silicon: Powering the Modern World
        "In 2026, we occupy a civilization of total silicon dependency. Microchips have transcended traditional computing electronics; they have become the fundamental nerve system of the broader global economy. No modern industry can function without a secure pipeline of semiconductors. Today, semiconductors control the storage, lightning-fast routing, and real-time processing of every single piece of global data. Because of this, industrial analysts now track a metric called the Silicon Intensity Index. This measures the total percentage value of silicon content embedded inside a physical product. Whether an enterprise manufactures smart municipal utility grids, high-precision medical machinery, or neural processors, their ability to scale and compete is directly bounded by the processing efficiency of their integrated silicon layers.",
        
        // Slide 14: Executive Summary: The Demand Landscape in 2026
        "The downstream demand landscape in 2026 is characterized by a stark structural divergence. We are operating in a multi-speed market where traditional core sectors are maturing while new infrastructure segments explode. As broken down on this summary chart, artificial intelligence data centers have become the supreme economic engine of the industry, now capturing nearly 50% of total semiconductor growth and revenue value. Conversely, the automotive sector has emerged as the fastest-growing volume segment. Electric vehicles and advanced driver-assistance systems require massive volumes of both legacy control nodes and silicon carbide power chips. Meanwhile, traditional volume drivers like smartphones and personal computers are facing volume saturation. This saturation is forcing consumer tech hardware developers to consolidate and pivot toward integrating specialized edge accelerators to induce new consumer replacement cycles.",
        
        // Slide 15: AI & Data Centers: The Generative Revolution
        "Let's look closer at the hyper-scale data center market, which has fundamentally evolved from passive data storage hubs into active machine-intelligence engines. The global market for dedicated AI accelerators—encompassing specialized GPUs, TPUs, and neural computing nodes—is scaling toward an annual value of 500 billion dollars. This single sector is the primary consumer of the world's most advanced sub-3nm wafer print architectures globally. The sheer computational density required to train large language models has triggered an unprecedented demand squeeze across adjacent silicon technologies. AI servers don't just require fast processors; they demand ultra-dense configurations of High Bandwidth Memory, which has faced severe market inflation, alongside customized high-speed routing interconnect silicon to manage data transit between massive server clusters.",
        
        // Slide 16: Automotive: The \"Smartphone on Wheels\"
        "Turning to the automotive sector, vehicles have effectively transformed into high-performance computers on wheels. The compounding transitions toward vehicle electrification and advanced driver-assistance systems, or ADAS, have doubled the total semiconductor bill-of-materials, now exceeding 1,000 dollars in silicon content per vehicle unit. This growth is driven by two main pillars. First, power electronics: electric vehicles rely heavily on Silicon Carbide, or SiC, power switches in high-voltage battery platforms to drive charging efficiency. Second, safety and autonomy. Level 2 and Level 3 autonomous vehicles require massive on-board computational units to handle real-time sensor fusion. A single vehicle now requires a comprehensive sourcing strategy for a massive array of chips, including radar components, ultrasonic modules, LiDAR systems, and high-resolution CMOS camera chipsets.",
        
        // Slide 17: Industrial, IoT & Healthcare: Intelligence at the Edge
        "Beyond heavy computing, we see the rise of 'Intelligence at the Edge' across industrial operations and healthcare systems. In the industrial IoT and Industry 4.0 landscape, factory floor nodes are no longer sending raw data back to centralized clouds. Instead, they use low-power edge chips to execute real-time local algorithms for automated machine vision controls and predictive maintenance. In the healthcare sector, specialized semiconductor sourcing has become a cornerstone of personalized medicine. Microchips are enabling highly reliable, long-lifecycle deployments including smart wearable diagnostics, continuous blood-glucose monitors, active health implants, and high-resolution personalized diagnostic imaging equipment. For both industrial and medical applications, silicon reliability and extended availability are prioritized over absolute nanoscale shrinking.",
        
        // Slide 18: Consumer Electronics & Emerging Frontiers
        "As traditional client consumer electronics like laptops and standard mobile handsets reach structural maturity, hardware developers are aggressively pushing architectural boundaries to kickstart new upgrade cycles. In 2026, dedicated On-Device NPU, or Neural Processing Unit, logic has become standard hardware in client electronics. This allows local generative AI execution directly on your handset without relying on cloud servers. Looking further down the horizon toward the 2030 roadmap, the industry is investing heavily in next-generation computing frontiers. This includes intensive R&D into cryogenic quantum structures, sub-terahertz 6G communications hardware blocks, and neuromorphic computing architectures that mimic the organic efficiency of the human brain to bypass traditional physical limits.",
        
        // Slide 19: Conclusion: A Silicon-Dependent Civilization
        "In conclusion, our deep-dive analysis of the 2026 semiconductor ecosystem proves that modern society has reached an inflection point of total silicon dependency. The path toward a multi-trillion-dollar global semiconductor industry is practically a certainty as microchips integrate permanently into every facet of global commerce. To summarize our key takeaways across our three assignments: In procurement, corporations must accept that pure JIT is dead; a strategic hybrid framework that treats resilience as the ultimate operational mandate is the new standard. In the global supply chain, we must recognize that back-end advanced packaging and material chokepoints are the new strategic risks. And finally, across downstream industries, while artificial intelligence remains the undisputed king of high-margin value, the automotive sector has solidified its position as the king of volume scaling. Ultimately, mastery of the semiconductor ecosystem is mastery of global industrial strategy. Thank you for your time, and I am now open to your questions and feedback.",
        
        // Slide 20: Thank You
        "Thank you everyone for your time. I would now like to open the floor to any questions and feedback you may have."
    ];to any questions you may have."
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
        "Conclusion: A Silicon-Dependent Civilization",
        "Thank You"
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
