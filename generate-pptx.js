const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
 
// Initialize presentation
let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
 
// Hook into Slide prototype to inject warm editorial typography rules
const tempSlideForProto = pptx.addSlide();
const slideProto = Object.getPrototypeOf(tempSlideForProto);
const originalAddText = slideProto.addText;
slideProto.addText = function(text, options) {
    if (typeof text === 'string' && text.includes('Key Message:')) {
        text = text.replace(/^\s*Key Message:\s*/, '');
        if (options) {
            options.fontFace = 'Bookman ITC Std';
        }
    }
    
    if (options && options.fontFace === 'Helvetica') {
        let fontName = 'Aeonik'; // Default body (Aeonik)
        
        if (options.fontSize >= 32 || options.fontSize === 36 || options.fontSize === 50 || options.fontSize === 54) {
            fontName = 'PP Mondwest'; // Display/Title (PP Mondwest)
        } else if (options.fontSize === 20 && options.bold) {
            fontName = 'PP Mondwest'; // Card Titles/Sub-headings (PP Mondwest)
        } else if (options.fontSize === 24) {
            fontName = 'PP Mondwest'; // Flow Card Numbers (PP Mondwest)
        } else if (options.fontSize === 12 || options.fontSize === 14 || options.fontSize === 10) {
            fontName = 'Aeonik'; // Category / Labels / Footers (Aeonik)
        }
        
        options.fontFace = fontName;
    }
    return originalAddText.call(this, text, options);
};
pptx._slides = []; // Clear the temporary slide so we start fresh

// Theme Colors - Warm Light Editorial Style
const COLOR_BG = 'F5F0E8';       // Warm off-white background
const COLOR_CARD = 'FFFDF8';     // Paper surface card
const COLOR_TEXT_PRI = '1A1714'; // Near-black main text
const COLOR_TEXT_SEC = '6B6560'; // Warm muted text
const COLOR_MUTED = 'E0D9D0';    // Border color
const COLOR_BORDER = 'E0D9D0';   // Border color

// Warm low-saturation accent colors mapping to original visual hierarchy
const COLOR_ACCENT_CYAN = 'B84A2F';   // Terracotta Red (primary accent)
const COLOR_ACCENT_GREEN = '768C7C';  // Sage Green
const COLOR_ACCENT_PURPLE = '9E7D84'; // Plum Rose
const COLOR_ACCENT_ROSE = 'B84A2F';   // Terracotta Red
const COLOR_ACCENT_AMBER = 'B08E66';  // Ochre
 
// Helper to set background and base formatting
function createBaseSlide(category, title, slideNum, notes) {
    let slide = pptx.addSlide();
    
    // Background color
    slide.background = { color: COLOR_BG };
    
    // Header label
    slide.addText(category, {
        x: 0.6,
        y: 0.4,
        w: 12.0,
        h: 0.3,
        fontSize: 12,
        fontFace: 'Helvetica',
        color: COLOR_ACCENT_CYAN,
        bold: true,
        charSpacing: 1.5
    });
    
    // Slide Title
    slide.addText(title, {
        x: 0.6,
        y: 0.7,
        w: 12.0,
        h: 0.6,
        fontSize: 32,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_PRI,
        bold: true
    });
    
    // Slide Footer
    slide.addText(`The 2026 Semiconductor Ecosystem | Slide ${slideNum.toString().padStart(2, '0')}`, {
        x: 0.6,
        y: 7.0,
        w: 12.0,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC
    });
    
    // Speaker Notes
    if (notes) {
        slide.addNotes(notes);
    }
    
    return slide;
}
 
// Speaker notes data
const scripts = [
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
    
    // Slide 6 (User Slide 7): The Global Supply Chain: A Web of Complexity
    "The semiconductor supply chain is widely recognized as the most complex and geographically dispersed value chain in human history. As illustrated on the geographical flow map on this slide, a single integrated circuit can cross international borders over 70 times before it is finally soldered into an end-user device. This creates an extreme, hyper-specialized international division of labor. The United States serves as the anchor for design intellectual property and Electronic Design Automation software. Europe acts as the provider of advanced lithography equipment. Japan dominates the supply of ultra-pure chemical materials, while Taiwan handles the actual front-end fabrication. Finally, Southeast Asian nations like Malaysia manage the back-end assembly, testing, and packaging. This extreme dependency means that disrupting even a single region impacts the entire global electronics supply pipeline instantly.",
    
    // Slide 7 (User Slide 8): Architecture of the Global Value Chain (GVC)
    "Let's zoom into the extreme market concentrations within this Global Value Chain architecture. Value creation is highly localized into specific structural monopolies. In the United States, companies hold an 80% plus market share in advanced Electronic Design Automation software. Without software tools from firms like NVIDIA, Qualcomm, or Apple, designing a modern microchip is physically impossible. Moving to Europe, we see a near monopoly held by ASML in the Netherlands regarding Extreme Ultraviolet tools required to etch sub-7nm circuit nodes. Every single leading-edge chip on Earth requires an ASML machine. This means front-end wafer fabrication, dominated by TSMC in Taiwan and Samsung in South Korea, is entirely dependent on Western equipment and design blueprints to feed their production bases.",
    
    // Slide 8 (User Slide 9): Front-End & Back-End Bottlenecks
    "For many years, the primary focus of semiconductor innovation was front-end node scaling—the relentless race to shrink transistors down to the 2-nanometer and 1.4-nanometer thresholds. While front-end fabrication lines still require monumental capital investments, a structural shift has occurred in 2026. The primary growth bottleneck for the artificial intelligence industry has moved from the front-end to the back-end. Advanced Back-End Packaging, specifically Chip-on-Wafer-on-Substrate or CoWoS, along with 3D stacking, is the new industry chokepoint. To create a modern AI accelerator, you must seamlessly integrate multiple logic dies with surrounding High Bandwidth Memory stacks onto a specialized silicon interposer. Currently, global back-end capacity is severely constrained. Reaching target production yields depends heavily on advanced back-end capacity, not just front-end printing nodes.",
    
    // Slide 9 (User Slide 10): SME, Materials & Geopolitical Fragmentation
    "This hyper-concentration has turned the semiconductor supply chain into a prime geopolitical battleground, causing severe fragmentation. We have moved away from a unified global market into a highly regionalized, multi-polar silicon world. Governments are treating chips as assets of national sovereignty. For instance, the United States has deployed the 52 billion dollar CHIPS Act, providing massive financial subsidies to build domestic advanced logic fabs to balance the heavy East Asian concentration. Europe and China are engaged in similar multi-billion dollar state-supported reshoring initiatives. In retaliation, we see material chokepoints being leveraged as economic weapons. Strict export controls have been placed on critical trace materials like Gallium and Germanium. These elements are vital for power electronics and radar systems, and their restriction forces a global scramble for alternative supply loops.",
    
    // Slide 10 (User Slide 11): Supply Chain Resilience: Digital & Circular
    "To survive this fragmented environment, supply chain architectures are evolving from static, linear models into circular, autonomous networks. First, advanced manufacturers are utilizing deep digital mapping tools to achieve multi-tier visibility. They are tracing their supply structures past their direct partners, all the way down to Tier-4 and Tier-5 chemical facilities that supply raw acids and substrates. Second, the industry is investing heavily in Circular Mineral Reclamation. Rather than relying solely on volatile geopolitical mining nodes, firms are actively recycling electronic waste to reclaim high-purity copper, gold, and recycled silicon substrates. This circular economy integration acts as a critical strategic buffer, shielding foundry operations from raw material shocks while aligning with modern environmental sustainability mandates.",
    
    // Slide 11 (User Slide 13): The Ubiquity of Silicon: Powering the Modern World
    "In 2026, we occupy a civilization of total silicon dependency. Microchips have transcended traditional computing electronics; they have become the fundamental nerve system of the broader global economy. No modern industry can function without a secure pipeline of semiconductors. Today, semiconductors control the storage, lightning-fast routing, and real-time processing of every single piece of global data. Because of this, industrial analysts now track a metric called the Silicon Intensity Index. This measures the total percentage value of silicon content embedded inside a physical product. Whether an enterprise manufactures smart municipal utility grids, high-precision medical machinery, or neural processors, their ability to scale and compete is directly bounded by the processing efficiency of their integrated silicon layers.",
    
    // Slide 12 (User Slide 14): Executive Summary: The Demand Landscape in 2026
    "The downstream demand landscape in 2026 is characterized by a stark structural divergence. We are operating in a multi-speed market where traditional core sectors are maturing while new infrastructure segments explode. As broken down on this summary chart, artificial intelligence data centers have become the supreme economic engine of the industry, now capturing nearly 50% of total semiconductor growth and revenue value. Conversely, the automotive sector has emerged as the fastest-growing volume segment. Electric vehicles and advanced driver-assistance systems require massive volumes of both legacy control nodes and silicon carbide power chips. Meanwhile, traditional volume drivers like smartphones and personal computers are facing volume saturation. This saturation is forcing consumer tech hardware developers to consolidate and pivot toward integrating specialized edge accelerators to induce new consumer replacement cycles.",
    
    // Slide 13 (User Slide 15): AI & Data Centers: The Generative Revolution
    "Let's look closer at the hyper-scale data center market, which has fundamentally evolved from passive data storage hubs into active machine-intelligence engines. The global market for dedicated AI accelerators—encompassing specialized GPUs, TPUs, and neural computing nodes—is scaling toward an annual value of 500 billion dollars. This single sector is the primary consumer of the world's most advanced sub-3nm wafer print architectures globally. The sheer computational density required to train large language models has triggered an unprecedented demand squeeze across adjacent silicon technologies. AI servers don't just require fast processors; they demand ultra-dense configurations of High Bandwidth Memory, which has faced severe market inflation, alongside customized high-speed routing interconnect silicon to manage data transit between massive server clusters.",
    
    // Slide 14 (User Slide 16): Automotive: The \"Smartphone on Wheels\"
    "Turning to the automotive sector, vehicles have effectively transformed into high-performance computers on wheels. The compounding transitions toward vehicle electrification and advanced driver-assistance systems, or ADAS, have doubled the total semiconductor bill-of-materials, now exceeding 1,000 dollars in silicon content per vehicle unit. This growth is driven by two main pillars. First, power electronics: electric vehicles rely heavily on Silicon Carbide, or SiC, power switches in high-voltage battery platforms to drive charging efficiency. Second, safety and autonomy. Level 2 and Level 3 autonomous vehicles require massive on-board computational units to handle real-time sensor fusion. A single vehicle now requires a comprehensive sourcing strategy for a massive array of chips, including radar components, ultrasonic modules, LiDAR systems, and high-resolution CMOS camera chipsets.",
    
    // Slide 15 (User Slide 17): Industrial, IoT & Healthcare: Intelligence at the Edge
    "Beyond heavy computing, we see the rise of 'Intelligence at the Edge' across industrial operations and healthcare systems. In the industrial IoT and Industry 4.0 landscape, factory floor nodes are no longer sending raw data back to centralized clouds. Instead, they use low-power edge chips to execute real-time local algorithms for automated machine vision controls and predictive maintenance. In the healthcare sector, specialized semiconductor sourcing has become a cornerstone of personalized medicine. Microchips are enabling highly reliable, long-lifecycle deployments including smart wearable diagnostics, continuous blood-glucose monitors, active health implants, and high-resolution personalized diagnostic imaging equipment. For both industrial and medical applications, silicon reliability and extended availability are prioritized over absolute nanoscale shrinking.",
    
    // Slide 16 (User Slide 18): Consumer Electronics & Emerging Frontiers
    "As traditional client consumer electronics like laptops and standard mobile handsets reach structural maturity, hardware developers are aggressively pushing architectural boundaries to kickstart new upgrade cycles. In 2026, dedicated On-Device NPU, or Neural Processing Unit, logic has become standard hardware in client electronics. This allows local generative AI execution directly on your handset without relying on cloud servers. Looking further down the horizon toward the 2030 roadmap, the industry is investing heavily in next-generation computing frontiers. This includes intensive R&D into cryogenic quantum structures, sub-terahertz 6G communications hardware blocks, and neuromorphic computing architectures that mimic the organic efficiency of the human brain to bypass traditional physical limits.",
    
    // Slide 17 (User Slide 19): Conclusion: A Silicon-Dependent Civilization
    "In conclusion, our deep-dive analysis of the 2026 semiconductor ecosystem proves that modern society has reached an inflection point of total silicon dependency. The path toward a multi-trillion-dollar global semiconductor industry is practically a certainty as microchips integrate permanently into every facet of global commerce. To summarize our key takeaways across our three assignments: In procurement, corporations must accept that pure JIT is dead; a strategic hybrid framework that treats resilience as the ultimate operational mandate is the new standard. In the global supply chain, we must recognize that back-end advanced packaging and material chokepoints are the new strategic risks. And finally, across downstream industries, while artificial intelligence remains the undisputed king of high-margin value, the automotive sector has solidified its position as the king of volume scaling. Ultimately, mastery of the semiconductor ecosystem is mastery of global industrial strategy. Thank you for your time, and I am now open to your questions and feedback.",
    
    // Slide 18 (User Slide 20 / Q&A): Thank You
    "Thank you everyone for your time. I would now like to open the floor to any questions and feedback you may have."
];
 
// ==========================================
// SLIDE 1: COVER
// ==========================================
let slide1 = pptx.addSlide();
slide1.background = { color: COLOR_BG };
slide1.addNotes(scripts[0]);
 
// Badge Card (CONSOLIDATED REMEDIAL BRIEFING)
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.5,
    w: 3.8,
    h: 0.4,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1 }
});
slide1.addText("CONSOLIDATED REMEDIAL BRIEFING", {
    x: 0.9,
    y: 1.55,
    w: 3.6,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true,
    charSpacing: 1.5
});

// Cover Title
slide1.addText("The 2026 Semiconductor Ecosystem", {
    x: 0.8,
    y: 2.1,
    w: 11.5,
    h: 1.2,
    fontSize: 48,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    bold: true
});
 
// Cover Subtitle
slide1.addText("A Comprehensive Analysis of Sourcing Strategies, Supply Chain Architecture, and Global End-User Industries", {
    x: 0.8,
    y: 3.3,
    w: 11.5,
    h: 0.8,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Border line
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 4.3,
    w: 5.0,
    h: 0.04,
    fill: { color: COLOR_ACCENT_CYAN }
});
 
// Meta Info
slide1.addText([
    { text: "Presenter: ", options: { color: COLOR_TEXT_SEC, fontSize: 12 } },
    { text: "Phyoe Sat Paing (ID: 6821711420061)\n", options: { color: COLOR_TEXT_PRI, bold: true, fontSize: 12 } },
    { text: "Course: ", options: { color: COLOR_TEXT_SEC, fontSize: 12 } },
    { text: "501105, logistics and supply chain management\n", options: { color: COLOR_TEXT_PRI, bold: true, fontSize: 12 } },
    { text: "Date: ", options: { color: COLOR_TEXT_SEC, fontSize: 12 } },
    { text: "June 2026", options: { color: COLOR_TEXT_PRI, bold: true, fontSize: 12 } }
], {
    x: 0.8,
    y: 4.7,
    w: 8.0,
    h: 1.5,
    fontFace: 'Helvetica'
});
 
// ==========================================
// SLIDE 2: THE PROCUREMENT PARADOX
// ==========================================
let slide2 = createBaseSlide("PART 1: PROCUREMENT OF SEMICONDUCTORS", "Executive Summary: The Procurement Paradox", 2, scripts[1]);
 
// Key Message Callout Box
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide2.addText("Key Message: Navigating a $1.3 trillion market requires balancing unprecedented growth with systemic supply chain fragility.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Body Supporting points
slide2.addText(
    "- Record-High Valuations: Growth is driven by explosive global demand for AI systems and electric vehicle power logic.\n\n" +
    "- Systemic Fragility & Node Allocation: Leading-edge fabrication is a massive chokepoint where global availability of advanced computing rests entirely on sub-3nm allocations. The concentration of Extreme Ultraviolet (EUV) lithography capacity leaves the industry vulnerable to minor material delays.\n\n" +
    "- Strategic Pivot: Sourcing HBM (High Bandwidth Memory) and advanced logic requires a shift from transactional purchasing to capacity reservation models.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 16,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Graphic Box (Stats Card)
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 5.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide2.addText("ESTIMATE", {
    x: 8.4,
    y: 2.0,
    w: 4.2,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    align: 'center',
    bold: true
});
slide2.addText("$1.3T", {
    x: 8.4,
    y: 2.5,
    w: 4.2,
    h: 1.2,
    fontSize: 54,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    align: 'center',
    bold: true
});
slide2.addText("Global Market Value\nAnalyst consensus 2026", {
    x: 8.4,
    y: 3.9,
    w: 4.2,
    h: 0.8,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    align: 'center'
});
 
// ==========================================
// SLIDE 3: EVOLUTION OF PROCUREMENT
// ==========================================
let slide3 = createBaseSlide("PART 1: PROCUREMENT OF SEMICONDUCTORS", "Evolution of Procurement: The Strategic Hybrid Model", 3, scripts[2]);
 
// Key Message Callout
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1.5 }
});
slide3.addText("Key Message: Pure JIT is obsolete; the new standard is a hybrid approach that prioritizes resilience for high-value nodes.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    italic: true,
    bold: true
});
 
// Column 1 (Left Card)
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 2.8,
    w: 5.7,
    h: 3.8,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide3.addText("Lean JIT (Commoditized Nodes)", {
    x: 0.9,
    y: 3.1,
    w: 5.1,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true
});
slide3.addText("Used for standardized legacy passive elements and commoditized logic chips. Minimizes capital lock-up and inventory holding costs. However, global supply shocks exposed severe operational risks in pure JIT models, including zero safety buffers, sudden factory halts, supplier insolvency, and shipping delays.", {
    x: 0.9,
    y: 3.7,
    w: 5.1,
    h: 2.6,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Column 2 (Right Card)
slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9,
    y: 2.8,
    w: 5.7,
    h: 3.8,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide3.addText("Strategic Buffers (Critical Nodes)", {
    x: 7.2,
    y: 3.1,
    w: 5.1,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    bold: true
});
slide3.addText("Maintaining 3 to 6 months of safety stock for sole-sourced, high-margin microcomponents (HBM, custom GPUs) to guarantee manufacturing continuity.", {
    x: 7.2,
    y: 3.7,
    w: 5.1,
    h: 2.6,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// ==========================================
// SLIDE 4: KEY PROCUREMENT CHALLENGES
// ==========================================
let slide4 = createBaseSlide("PART 1: PROCUREMENT OF SEMICONDUCTORS", "Key Procurement Challenges & Strategic Sourcing", 4, scripts[3]);
 
// Key Message Callout
slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1.5 }
});
slide4.addText("Key Message: Data opacity and reactive risk management are the primary enemies of a resilient procurement strategy.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    italic: true,
    bold: true
});
 
// Body Supporting points
slide4.addText(
    "- Category Management Sourcing: Slicing procurement into precise technology nodes (Leading-edge sub-7nm vs Legacy nodes).\n\n" +
    "- Leading-edge Sourcing: Focuses on deep co-development partnerships, engineering collaboration, and long-term volume commitments.\n\n" +
    "- Legacy Sourcing: Emphasizes multi-sourcing, second-sourcing qualification, and legacy lifecycle management to offset obsolescence.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right Side Cards
slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 2.3,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1 }
});
slide4.addText("LEADING-EDGE NODES (SUB-7NM)", {
    x: 8.6,
    y: 1.6,
    w: 3.8,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide4.addText("Focus: Secure allocation in sub-7nm alliances, multi-billion capacity reservation fees (LTAs), and joint R&D partnerships.", {
    x: 8.6,
    y: 1.95,
    w: 3.8,
    h: 1.75,
    fontSize: 13,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 4.2,
    w: 4.2,
    h: 2.3,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_AMBER, width: 1 }
});
slide4.addText("LEGACY NODES (28NM+)", {
    x: 8.6,
    y: 4.3,
    w: 3.8,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_AMBER,
    bold: true
});
slide4.addText("Focus: Broad multi-sourcing, alternate distributor qualification, spot buy strategies, and lifecycle obsolescence tracking.", {
    x: 8.6,
    y: 4.65,
    w: 3.8,
    h: 1.75,
    fontSize: 13,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// ==========================================
// SLIDE 5: DIGITALIZATION & RESILIENCE IN PROCUREMENT
// ==========================================
let slide5 = createBaseSlide("PART 1: PROCUREMENT OF SEMICONDUCTORS", "Digitalization & Resilience in Procurement", 5, scripts[4]);
 
// Key Message Callout
slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide5.addText("Key Message: AI-driven \"Business Intelligence Cockpits\" are essential for predicting shortages 6-12 months in advance.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Column 1 (Left Card)
slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 2.8,
    w: 5.7,
    h: 2.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide5.addText("LTA & Reservation Fees", {
    x: 0.9,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true
});
slide5.addText("Securing fab slots requires upfront reservation fees and take-or-pay clauses in Long-Term Agreements (LTAs) to lock down volume.", {
    x: 0.9,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Column 2 (Right Card)
slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9,
    y: 2.8,
    w: 5.7,
    h: 2.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide5.addText("Friend-Shoring Sourcing", {
    x: 7.2,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide5.addText("Decoupling supply links from high-risk locations, redirecting procurement to allied geopolitical nodes with guaranteed supply lines.", {
    x: 7.2,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Bottom banner
slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 5.7,
    w: 12.0,
    h: 0.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1 }
});
slide5.addText([
    { text: "AI Business Intelligence Cockpits: ", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: "Advanced analytics systems parse unstructured global feeds—including weather logs, border congestion, and raw chemical shortages—to build a multi-tier dependency map, tracking Tier-2/3 volatility and supplier insolvency risks before they disrupt Tier-1 deliveries.", options: { color: COLOR_TEXT_SEC, fontSize: 13 } }
], {
    x: 0.8,
    y: 5.75,
    w: 11.6,
    h: 0.8,
    fontFace: 'Helvetica'
});
 
// ==========================================
// SLIDE 6: THE GLOBAL SUPPLY CHAIN
// ==========================================
let slide6 = createBaseSlide("PART 2: THE GLOBAL SUPPLY CHAIN OF SEMICONDUCTORS", "The Global Supply Chain: A Web of Complexity", 6, scripts[5]);
 
// Key Message Callout Box
slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide6.addText("Key Message: A single chip may cross international borders over 70 times, making it the most geographically dispersed value chain in history.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Subtitle block
slide6.addText("THE SILICON JOURNEY", {
    x: 0.6,
    y: 2.8,
    w: 12.0,
    h: 0.4,
    fontSize: 16,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
 
// Step blocks (Horizontal Flow)
const steps = [
    { title: "US Design", desc: "Design & EDA Tools" },
    { title: "Dutch SME", desc: "ASML EUV Optics" },
    { title: "Taiwan Fab", desc: "TSMC Printing" },
    { title: "Japan Material", desc: "Wafers & Photoresist" },
    { title: "SE Asia Pack", desc: "OSAT Assembly" }
];
 
steps.forEach((step, idx) => {
    let xPos = 0.6 + (idx * 2.5);
    
    slide6.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 3.4,
        w: 2.0,
        h: 2.6,
        fill: { color: COLOR_CARD },
        line: { color: COLOR_MUTED, width: 1 }
    });
    
    slide6.addText((idx + 1).toString(), {
        x: xPos + 0.2,
        y: 3.6,
        w: 1.6,
        h: 0.4,
        fontSize: 24,
        fontFace: 'Helvetica',
        color: COLOR_ACCENT_CYAN,
        bold: true
    });
    
    slide6.addText(step.title, {
        x: xPos + 0.2,
        y: 4.1,
        w: 1.6,
        h: 0.4,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_PRI,
        bold: true
    });
    
    slide6.addText(step.desc, {
        x: xPos + 0.2,
        y: 4.6,
        w: 1.6,
        h: 1.2,
        fontSize: 14,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC
    });
});
 
// ==========================================
// SLIDE 7: ARCHITECTURE OF THE GVC
// ==========================================
let slide7 = createBaseSlide("PART 2: THE GLOBAL SUPPLY CHAIN OF SEMICONDUCTORS", "Architecture of the Global Value Chain (GVC)", 7, scripts[6]);
 
// Key Message Callout Box
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1.5 }
});
slide7.addText("Key Message: Value is highly concentrated in specialized clusters: U.S. (Design), Europe (Equipment), and East Asia (Manufacturing).", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    italic: true,
    bold: true
});
 
// Body supporting points
slide7.addText(
    "- Design & EDA (United States): Dominance in core processor blueprints and layout compiler systems (NVIDIA, Apple, Qualcomm).\n\n" +
    "- SME Equipment (Europe): Monopoly on Extreme Ultraviolet tools (ASML) required to etch sub-7nm circuit nodes.\n\n" +
    "- Wafer Fabrication (East Asia): TSMC (Taiwan) and Samsung (Korea) form the production base for global advanced nodes.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right Side cards
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 2.3,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1 }
});
slide7.addText("USA: DESIGN IP", {
    x: 8.6,
    y: 1.6,
    w: 3.8,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true
});
slide7.addText([
    { text: "Market Leader: U.S. design firms capture the majority of global chip value, controlling ", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "80%+ of the Electronic Design Automation (EDA)", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: " software market and holding core IP for high-end CPU/GPU microarchitectures.", options: { color: COLOR_TEXT_SEC, fontSize: 13 } }
], {
    x: 8.6,
    y: 1.95,
    w: 3.8,
    h: 1.75,
    fontFace: 'Helvetica'
});
 
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 4.2,
    w: 4.2,
    h: 2.3,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1 }
});
slide7.addText("ASML (EU): LITHOGRAPHY", {
    x: 8.6,
    y: 4.3,
    w: 3.8,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    bold: true
});
slide7.addText([
    { text: "Critical Enabler: European-based ASML holds a ", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "100% EUV (Extreme Ultraviolet) Monopsony", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: " for high-end printing scanners, making it the sole hardware gatekeeper for sub-7nm node fabrication.", options: { color: COLOR_TEXT_SEC, fontSize: 13 } }
], {
    x: 8.6,
    y: 4.65,
    w: 3.8,
    h: 1.75,
    fontFace: 'Helvetica'
});
 
// ==========================================
// SLIDE 8: FRONT-END & BACK-END BOTTLENECKS
// ==========================================
let slide8 = createBaseSlide("PART 2: THE GLOBAL SUPPLY CHAIN OF SEMICONDUCTORS", "Front-End & Back-End Bottlenecks", 8, scripts[7]);
 
// Key Message Callout Box
slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1.5 }
});
slide8.addText("Key Message: Advanced packaging (CoWoS, 3D Stacking) is the new primary growth limiter for the AI industry.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    italic: true,
    bold: true
});
 
// Front-End Card
slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 2.8,
    w: 5.7,
    h: 2.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1 }
});
slide8.addText("Front-End: Node Scaling", {
    x: 0.9,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true
});
slide8.addText("The race for the 2nm and 1.4nm nodes continues to demand immense capital investments for wafer fabrication lines.", {
    x: 0.9,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Back-End Card
slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9,
    y: 2.8,
    w: 5.7,
    h: 2.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1 }
});
slide8.addText("Back-End: CoWoS & HBM Integration", {
    x: 7.2,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide8.addText("Stacking logic dies and High Bandwidth Memory (HBM) via Chip-on-Wafer-on-Substrate (CoWoS) formats has surpassed wafer printing as the primary supply chain bottleneck.", {
    x: 7.2,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 16,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Bottom banner
slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 5.7,
    w: 12.0,
    h: 0.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1 }
});
slide8.addText([
    { text: "Logistics bottleneck: ", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: "Yield limitations are no longer dominated by front-end node lithography, but by the capacity limits of advanced back-end CoWoS and 3D stacking processes.", options: { color: COLOR_TEXT_SEC, fontSize: 13 } }
], {
    x: 0.8,
    y: 5.75,
    w: 11.6,
    h: 0.8,
    fontFace: 'Helvetica'
});
 
// ==========================================
// SLIDE 9: SME, MATERIALS & GEOPOLITICAL FRAGMENTATION
// ==========================================
let slide9 = createBaseSlide("PART 2: THE GLOBAL SUPPLY CHAIN OF SEMICONDUCTORS", "SME, Materials & Geopolitical Fragmentation", 9, scripts[8]);
 
// Key Message Callout Box
slide9.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_ROSE, width: 1.5 }
});
slide9.addText("Key Message: Geopolitics has created a \"Multi-Polar\" silicon world, where export controls and subsidies drive regionalization.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_ROSE,
    italic: true,
    bold: true
});
 
// Body points
slide9.addText(
    "- The US CHIPS Act ($52B): Funding the domestic establishment of advanced logic fabs to balance East Asian concentration.\n\n" +
    "- Europe & China Reshoring: Multi-billion dollar state-supported programs targeting semiconductor in-sourcing.\n\n" +
    "- Material Chokepoints: Strict export controls placed on critical trace materials like Gallium and Germanium.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right graphics block
slide9.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 5.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_ROSE, width: 1 }
});
slide9.addText("GALLIUM & GERMANIUM EXPORT RESTRICTIONS", {
    x: 8.6,
    y: 1.8,
    w: 3.8,
    h: 0.6,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_ROSE,
    align: 'center',
    bold: true
});
slide9.addText([
    { text: "China controls ", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "90%+ of Gallium", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: " and ", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "60%+ of Germanium", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: " sourcing. Recent export restrictions require explicit licenses, causing price volatility and sourcing delays for next-generation power electronics and optical systems.\n\n", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "Strategic Risk: ", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 11 } },
    { text: "Material bottlenecks can disrupt entire optoelectronic supply chains.", options: { color: COLOR_TEXT_SEC, fontSize: 11, italic: true } }
], {
    x: 8.6,
    y: 2.6,
    w: 3.8,
    h: 3.6,
    fontFace: 'Helvetica',
    align: 'left'
});
 
// ==========================================
// SLIDE 10: SUPPLY CHAIN RESILIENCE
// ==========================================
let slide10 = createBaseSlide("PART 2: THE GLOBAL SUPPLY CHAIN OF SEMICONDUCTORS", "Supply Chain Resilience: Digital & Circular", 10, scripts[9]);
 
// Key Message Callout
slide10.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide10.addText("Key Message: The response? Circular and Autonomous Supply Chains. We are using AI to 'self-heal' the supply chain.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Left Card
slide10.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 2.8,
    w: 5.7,
    h: 2.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide10.addText("Deep Supply Mapping & AI", {
    x: 0.9,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true
});
slide10.addText("Automatically re-routing orders when a port closes or a factory goes down. Mapping up to Tier-4 and Tier-5 suppliers.", {
    x: 0.9,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Right Card
slide10.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9,
    y: 2.8,
    w: 5.7,
    h: 2.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide10.addText("Circular Reclamation", {
    x: 7.2,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide10.addText("Transitioning to industrial e-waste harvesting to extract high-purity minerals. Recovering up to 99% of Copper, 98% of Gold, and 95% of Silicon substrates from decommissioned hardware to buffer raw mining volatility.", {
    x: 7.2,
    y: 3.6,
    w: 5.1,
    h: 1.7,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Bottom banner
slide10.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 5.7,
    w: 12.0,
    h: 0.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1 }
});
slide10.addText("Autonomous logistics systems automatically scan trade flows to reroute containers before bottleneck events cause line shutdowns.", {
    x: 0.8,
    y: 5.8,
    w: 11.6,
    h: 0.7,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// ==========================================
// SLIDE 11: THE UBIQUITY OF SILICON
// ==========================================
let slide11 = createBaseSlide("PART 3: DOWNSTREAM END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "The Ubiquity of Silicon: Powering the Modern World", 11, scripts[10]);
 
// Key Message Callout Box
slide11.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1.5 }
});
slide11.addText("Key Message: Semiconductors are the \"nerve system\" of the global economy; no modern industry can function without them.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    italic: true,
    bold: true
});
 
// Body points
slide11.addText(
    "- Central Nerve System: Microchips control the storage, routing, and processing of every piece of data globally.\n\n" +
    "- Silicon Intensity Metric: The total value of silicon content per product is the primary metric of industrial scaling.\n\n" +
    "- Ubiquitous Integration: Foundational logic layers power smart municipal grids, medical machinery, and neural processors.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right Card (Stats Card)
slide11.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 5.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide11.addText("SILICON INTENSITY INDEX", {
    x: 8.6,
    y: 1.8,
    w: 3.8,
    h: 0.6,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    align: 'center',
    bold: true
});
slide11.addText([
    { text: "Defined as ", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "the total monetary value of silicon content embedded per finished product unit", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
    { text: ". This index is the primary metric tracking how deeply semiconductors add value to downstream hardware.\n\n", options: { color: COLOR_TEXT_SEC, fontSize: 13 } },
    { text: "Value Metric: ", options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 11 } },
    { text: "Measures semiconductor reliance across all downstream products.", options: { color: COLOR_TEXT_SEC, fontSize: 11, italic: true } }
], {
    x: 8.6,
    y: 2.6,
    w: 3.8,
    h: 3.6,
    fontFace: 'Helvetica',
    align: 'left'
});
 
// ==========================================
// SLIDE 12: THE DEMAND LANDSCAPE IN 2026
// ==========================================
let slide12 = createBaseSlide("PART 3: DOWNSTREAM END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Executive Summary: The Demand Landscape in 2026", 12, scripts[11]);
 
// Key Message Callout Box
slide12.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide12.addText("Key Message: Demand is shifting from traditional computing toward AI infrastructure, Automotive, and Industrial Automation.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Table Header labels at y: 2.4
slide12.addText("INDUSTRY SEGMENT", {
    x: 0.8,
    y: 2.4,
    w: 2.5,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    bold: true
});
slide12.addText("GROWTH SPEED & STATUS", {
    x: 3.5,
    y: 2.4,
    w: 3.5,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    bold: true
});
slide12.addText("SOURCING & TECHNOLOGY FOCUS", {
    x: 7.2,
    y: 2.4,
    w: 5.2,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    bold: true
});

const horizontalRows = [
    {
        segment: "AI Datacenters",
        growth: "50% CAGR (Exponential Value Growth)",
        growthBold: "50% CAGR",
        focus: "GPUs, HBM (High Bandwidth Memory), advanced optical links, sub-3nm allocations.",
        color: COLOR_ACCENT_CYAN
    },
    {
        segment: "Automotive",
        growth: "Fastest Volume Growth (High Intensity scaling)",
        growthBold: "Fastest Volume Growth",
        focus: "ADAS logic, Lidar, Silicon Carbide (SiC) power logic, 28nm+ legacy microcontrollers.",
        color: COLOR_ACCENT_PURPLE
    },
    {
        segment: "Smartphones & PCs",
        growth: "Volume Saturation (Flat/Steady volume growth)",
        growthBold: "Volume Saturation",
        focus: "Edge-AI acceleration NPUs, standard application processors, memory, sensor logic.",
        color: COLOR_ACCENT_GREEN
    }
];

horizontalRows.forEach((row, idx) => {
    let yPos = 2.8 + (idx * 1.3); // y: 2.8, 4.1, 5.4
    
    // Draw row card background
    slide12.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6,
        y: yPos,
        w: 12.0,
        h: 1.1,
        fill: { color: COLOR_CARD },
        line: { color: COLOR_MUTED, width: 1 }
    });
    
    // Segment Name (Col 1)
    slide12.addText(row.segment, {
        x: 0.8,
        y: yPos + 0.3,
        w: 2.5,
        h: 0.5,
        fontSize: 16,
        fontFace: 'Helvetica',
        color: row.color,
        bold: true
    });
    
    // Growth Status (Col 2)
    const growthParts = row.growth.split(row.growthBold);
    slide12.addText([
        { text: row.growthBold, options: { bold: true, color: COLOR_TEXT_PRI, fontSize: 13 } },
        { text: growthParts[1] || "", options: { color: COLOR_TEXT_SEC, fontSize: 13 } }
    ], {
        x: 3.5,
        y: yPos + 0.3,
        w: 3.3,
        h: 0.5,
        fontFace: 'Helvetica'
    });
    
    // Focus (Col 3)
    slide12.addText(row.focus, {
        x: 7.2,
        y: yPos + 0.2,
        w: 5.2,
        h: 0.7,
        fontSize: 13,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC
    });
});
 
// ==========================================
// SLIDE 13: AI & DATA CENTERS
// ==========================================
let slide13 = createBaseSlide("PART 3: DOWNSTREAM END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "AI & Data Centers: The Generative Revolution", 13, scripts[12]);
 
// Key Message Callout Box
slide13.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1.5 }
});
slide13.addText("Key Message: Data centers have evolved into \"Intelligence Engines,\" consuming the highest-value silicon ever produced.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    italic: true,
    bold: true
});
 
// Body points
slide13.addText(
    "- Accelerator Market ($500B+): Generative models and neural computing demand massive scaling of TPU and GPU nodes.\n\n" +
    "- Sub-3nm Node Sourcing: The primary consumers of the most advanced wafer print architectures globally.\n\n" +
    "- Memory & Interconnect: Demands extreme density of High Bandwidth Memory (HBM) and customized routing interconnect silicon.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right stats card
slide13.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 5.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1 }
});
slide13.addText("CONSENSUS FORECAST", {
    x: 8.4,
    y: 2.2,
    w: 4.2,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    align: 'center',
    bold: true
});
slide13.addText("$500B+", {
    x: 8.4,
    y: 2.8,
    w: 4.2,
    h: 1.2,
    fontSize: 54,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    align: 'center',
    bold: true
});
slide13.addText("AI Accelerator Market Projected Size by 2026", {
    x: 8.5,
    y: 4.2,
    w: 4.0,
    h: 0.8,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    align: 'center',
    bold: true
});
 
// ==========================================
// SLIDE 14: AUTOMOTIVE: THE SMARTPHONE ON WHEELS
// ==========================================
let slide14 = createBaseSlide("PART 3: DOWNSTREAM END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Automotive: The \"Smartphone on Wheels\"", 14, scripts[13]);
 
// Key Message Callout Box
slide14.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide14.addText("Key Message: The transition to EVs and ADAS is doubling semiconductor content per vehicle, reaching over $1,000 per unit.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Body points
slide14.addText(
    "- Silicon Carbide (SiC) Power: Drives high-efficiency power switches in high-voltage EV battery platforms.\n\n" +
    "- ADAS Autonomous Compute: Self-driving capabilities demand heavy on-board computational units for sensor fusion.\n\n" +
    "- Sensor Arrays Sourcing: Vehicles integrate multiple LiDAR, radar, and camera chip sets for 360-degree coverage.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right Card (Stats Card)
slide14.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 5.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide14.addText("EV CONTENT GROWTH", {
    x: 8.4,
    y: 2.2,
    w: 4.2,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    align: 'center',
    bold: true
});
slide14.addText("$1,000+", {
    x: 8.4,
    y: 2.8,
    w: 4.2,
    h: 1.2,
    fontSize: 50,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    align: 'center',
    bold: true
});
slide14.addText("$1,000+ semiconductor content per EV unit", {
    x: 8.5,
    y: 4.2,
    w: 4.0,
    h: 0.8,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    align: 'center',
    bold: true
});
 
// ==========================================
// SLIDE 15: INDUSTRIAL, IOT & HEALTHCARE
// ==========================================
let slide15 = createBaseSlide("PART 3: DOWNSTREAM END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Industrial, IoT & Healthcare: Intelligence at the Edge", 15, scripts[14]);
 
// Key Message Callout Box
slide15.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 12.0,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1.5 }
});
slide15.addText("Key Message: Edge AI is transforming manufacturing and healthcare, prioritizing long-lifecycle, high-reliability silicon.", {
    x: 0.8,
    y: 1.6,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    italic: true,
    bold: true
});
 
// Column 1 (Left Card)
slide15.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 2.8,
    w: 5.7,
    h: 3.8,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1 }
});
slide15.addText("Industry 4.0 Edge Analytics", {
    x: 0.9,
    y: 3.1,
    w: 5.1,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    bold: true
});
slide15.addText("Factory floor nodes execute real-time local algorithms for predictive maintenance and machine vision controls, utilizing highly rugged legacy processes.", {
    x: 0.9,
    y: 3.8,
    w: 5.1,
    h: 2.4,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Column 2 (Right Card)
slide15.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9,
    y: 2.8,
    w: 5.7,
    h: 3.8,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1 }
});
slide15.addText("Healthcare Personalized Sourcing", {
    x: 7.2,
    y: 3.1,
    w: 5.1,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide15.addText("Semiconductors enable smart wearable diagnostics, active health implants, and personalized diagnostics. Requires extreme reliability certifications.", {
    x: 7.2,
    y: 3.8,
    w: 5.1,
    h: 2.4,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// ==========================================
// SLIDE 16: CONSUMER ELECTRONICS & EMERGING FRONTIERS
// ==========================================
let slide16 = createBaseSlide("PART 3: DOWNSTREAM END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Consumer Electronics & Emerging Frontiers", 16, scripts[15]);
 
// Key Message Callout Box
slide16.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 1.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_GREEN, width: 1.5 }
});
slide16.addText("Key Message: While traditional consumer tech matures, frontiers like Quantum, 6G, and Neuromorphic computing define the 2030 roadmap.", {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    italic: true,
    bold: true
});
 
// Body points
slide16.addText(
    "- On-Device NPU Logic: Integrating Neural Processing Units (NPUs) into laptops and mobile phones to enable local AI execution.\n\n" +
    "- Neuromorphic Computing: Researching brain-inspired architectures targeting extreme computing power efficiency.\n\n" +
    "- Next-Gen Frontiers: Developing quantum structures and 6G communications hardware blocks.",
    {
        x: 0.6,
        y: 2.8,
        w: 7.2,
        h: 3.8,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC,
        bullet: true
    }
);
 
// Right Card
slide16.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 1.5,
    w: 4.2,
    h: 5.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});
slide16.addText("NPU CORES", {
    x: 8.4,
    y: 2.2,
    w: 4.2,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    align: 'center',
    bold: true
});
slide16.addText("Client AI", {
    x: 8.4,
    y: 2.8,
    w: 4.2,
    h: 1.2,
    fontSize: 36,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    align: 'center',
    bold: true
});
slide16.addText("Standard hardware in 2026 client electronics (laptops, phones)", {
    x: 8.4,
    y: 4.2,
    w: 4.2,
    h: 0.8,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC,
    align: 'center'
});
 
// ==========================================
// SLIDE 17: CONCLUSION
// ==========================================
let slide17 = createBaseSlide("SUMMARY & ROADMAP", "Conclusion: A Silicon-Dependent Civilization", 17, scripts[16]);

// Key Message Callout Box (Left Column: w=6.0)
slide17.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 6.0,
    h: 0.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide17.addText("Key Message: We have reached a point of \"Total Silicon Dependency.\" The path to a $2 trillion industry is certain.", {
    x: 0.8,
    y: 1.35,
    w: 5.6,
    h: 0.8,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});

// Sub-statement
slide17.addText("Mastery of the semiconductor ecosystem is mastery of the future. The \"Chip Wars\" aren't just about manufacturing; they are about who can best harness silicon to transform their industries.", {
    x: 0.6,
    y: 2.3,
    w: 6.0,
    h: 1.0,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});

// Key Takeaways label
slide17.addText("KEY TAKEAWAYS SUMMARY", {
    x: 0.6,
    y: 3.4,
    w: 6.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    bold: true,
    charSpacing: 1
});

// 3 Takeaways Cards (stacked vertically)
const takeaways = [
    { title: "Procurement", desc: "Shift from JIT to Strategic Hybrid; resilience is the new ROI.", color: COLOR_ACCENT_CYAN },
    { title: "Supply Chain", desc: "Chokepoints in Advanced Packaging and SME are the new strategic risks.", color: COLOR_ACCENT_PURPLE },
    { title: "Downstream End-User Industries", desc: "AI is the Value King; Automotive is the Volume King.", color: COLOR_ACCENT_GREEN }
];

takeaways.forEach((tk, idx) => {
    let yPos = 3.8 + (idx * 0.95);
    
    slide17.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6,
        y: yPos,
        w: 6.0,
        h: 0.8,
        fill: { color: COLOR_CARD },
        line: { color: COLOR_MUTED, width: 1 }
    });
    
    slide17.addText(tk.title, {
        x: 0.8,
        y: yPos + 0.1,
        w: 5.6,
        h: 0.25,
        fontSize: 13,
        fontFace: 'Helvetica',
        color: tk.color,
        bold: true
    });
    
    slide17.addText(tk.desc, {
        x: 0.8,
        y: yPos + 0.35,
        w: 5.6,
        h: 0.4,
        fontSize: 11,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC
    });
});

// Right Column: Infographic Image Card & Image
slide17.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9,
    y: 1.3,
    w: 5.9,
    h: 5.4,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});

slide17.addImage({
    path: 'critical_materials.png',
    x: 7.0,
    y: 1.4,
    w: 5.7,
    h: 5.2
});

// ==========================================
// SLIDE 18 (HTML SLIDE 20): THANK YOU
// ==========================================
let slide18 = pptx.addSlide();
slide18.background = { color: COLOR_BG };
slide18.addNotes(scripts[17]);

// Left Column: Thank You details
// "THE END" Tag
slide18.addText("THE END", {
    x: 0.8,
    y: 1.8,
    w: 5.0,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true,
    charSpacing: 1.5
});

// Thank You Title
slide18.addText("Thank You", {
    x: 0.8,
    y: 2.3,
    w: 5.0,
    h: 1.2,
    fontSize: 56,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    bold: true
});

// Slogan
slide18.addText("Mastery of the semiconductor ecosystem is mastery of the future.", {
    x: 0.8,
    y: 3.6,
    w: 5.0,
    h: 0.8,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});

// Border line
slide18.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 4.5,
    w: 4.0,
    h: 0.04,
    fill: { color: COLOR_ACCENT_CYAN }
});

// Meta Info
slide18.addText("Presenter: Phyoe Sat Paing (ID: 6821711420061)\nCourse: 501105, logistics and supply chain management\nDate: June 2026", {
    x: 0.8,
    y: 4.8,
    w: 5.0,
    h: 1.2,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});

// Right Column: References Card & 2-column lists
slide18.addShape(pptx.shapes.RECTANGLE, {
    x: 6.4,
    y: 1.3,
    w: 6.3,
    h: 5.4,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_MUTED, width: 1 }
});

slide18.addText("References", {
    x: 6.6,
    y: 1.5,
    w: 5.9,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica', // maps to PP Mondwest since fontSize=20 and bold=true
    color: COLOR_ACCENT_CYAN,
    bold: true
});

const refCol1Text = [
    { text: "1. Gartner: Revenue Forecast\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.gartner.com/en/newsroom/press-releases/...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "2. Phihong: JIT vs JIC Sourcing\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.phihong.com/just-in-time-vs-just-in-case...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "3. Maria O.: Supply Chain Continuity\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.linkedin.com/posts/pmochoamc...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "4. Porsche: Semiconductor Superiority\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.porsche-consulting.com/sites/...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "5. CSET: Semiconductor Supply Chain\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://cset.georgetown.edu/publication/...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "6. CSIS: Mineral Demands for Resilient\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.csis.org/analysis/mineral-demands...\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } }
];

const refCol2Text = [
    { text: "7. SIA: Emerging Resilience\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.semiconductors.org/emerging-resilience...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "8. A. Masood: Semiconductors in 2026\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://medium.com/@adnanmasood/semiconductors...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "9. OECD: Mapping the Value Chain\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.oecd.org/content/dam/oecd/en/...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "10. Deloitte: 2026 Industry Outlook\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.deloitte.com/us/en/insights/...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "11. GM Insights: Aerospace Market Size\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.gminsights.com/industry-analysis/...\n\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } },
    { text: "12. Edge Silica: AI & EVs Trends\n", options: { bold: true, fontSize: 8.5, color: COLOR_TEXT_PRI } },
    { text: "https://www.linkedin.com/posts/edgesilica...\n", options: { fontSize: 8, color: COLOR_ACCENT_CYAN } }
];

slide18.addText(refCol1Text, { x: 6.6, y: 2.0, w: 2.9, h: 4.4, fontFace: 'Helvetica' });
slide18.addText(refCol2Text, { x: 9.6, y: 2.0, w: 2.9, h: 4.4, fontFace: 'Helvetica' });

// Slide Footer
slide18.addText("The 2026 Semiconductor Ecosystem | Slide 18", {
    x: 0.6,
    y: 7.0,
    w: 12.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});

// ==========================================
// SAVE PRESENTATION
// ==========================================
const outputDir = '/Users/hylo/Documents/antigravity/jolly-carson/output';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
 
pptx.writeFile({ fileName: path.join(outputDir, 'semiconductor-ecosystem-2026.pptx') })
    .then(fileName => {
        console.log(`PPTX successfully created at: ${fileName}`);
    })
    .catch(err => {
        console.error('Error writing PPTX:', err);
    });
