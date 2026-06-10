const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
 
// Initialize presentation
let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
 
// Theme Colors
const COLOR_BG = '0B0F19';       // Deep Charcoal Navy
const COLOR_CARD = '121826';     // Graphite
const COLOR_TEXT_PRI = 'FFFFFF'; // White
const COLOR_TEXT_SEC = 'A0AEC0'; // Light Gray
const COLOR_MUTED = '505D6F';    // Dark Gray
const COLOR_ACCENT_CYAN = '00F2FE';   // Electric Cyan
const COLOR_ACCENT_GREEN = '00FF87';  // Silicon Green
const COLOR_ACCENT_PURPLE = 'C084FC'; // Electric Purple
const COLOR_ACCENT_ROSE = 'F43F5E';   // Electric Rose
const COLOR_ACCENT_AMBER = 'FBBF24';  // Amber
 
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
        color: COLOR_MUTED
    });
    
    // Speaker Notes
    if (notes) {
        slide.addNotes(notes);
    }
    
    return slide;
}
 
// Speaker notes data
const scripts = [
    // Slide 1
    "Good morning everyone, and welcome to this strategic briefing. Today, we are reviewing 'The 2026 Semiconductor Ecosystem' with a focus on procurement, global supply chains, and end-user verticals.\n\nIn 2026, semiconductor procurement has transitioned from a back-office utility into a core strategic capability for technological growth, commercial innovation, and national security. Over this session, we will analyze how organizations can navigate this crucial field to manage risk and secure supply.",
    // Slide 2
    "Let's begin with our executive summary on the procurement paradox. The semiconductor industry has reached a massive $1.3 trillion market valuation. However, this record-breaking growth is accompanied by systemic fragility. Sourcing critical logic nodes and High Bandwidth Memory (HBM) remains highly constrained. To thrive, procurement executives must pivot from traditional transactional buying to deep, long-term strategic relationship management.",
    // Slide 3
    "The traditional 'Just-in-Time' inventory model is obsolete for critical semiconductor components. In 2026, the new standard is a hybrid inventory model. Organizations are maintaining 3 to 6 months of buffer stock for high-value, sole-sourced components, while keeping lean, JIT structures for commoditized parts. This balances operational resilience with capital efficiency.",
    // Slide 4
    "Category management is the key tool to combat supply chain opacity. We segment the procurement landscape into Leading-edge nodes (sub-7nm) and Legacy nodes (28nm and above). Sourcing leading-edge chips requires deep, multi-year R&D partnerships, while legacy sourcing focuses on active multi-sourcing, life-cycle tracking, and securing long-term supply guarantees.",
    // Slide 5
    "Resilience in 2026 is data-driven. Leading procurement teams utilize AI-enabled 'Business Intelligence Cockpits' to map supplier networks and forecast shortages 6 to 12 months ahead. Furthermore, securing capacity requires proactive commercial structures, including capacity reservation fees and take-or-pay long-term agreements (LTAs).",
    // Slide 6
    "Now we begin Part 2: The Global Supply Chain. A single microchip can cross international borders over 70 times before completion, making it the most complex value chain in industrial history. This 'Silicon Journey' connects chip designers in the US, equipment manufacturers in Europe, silicon fabricators in East Asia, and packaging facilities in Southeast Asia. This creates unmatched efficiency but extreme vulnerability to regional disruptions.",
    // Slide 7
    "The Global Value Chain is characterized by extreme cluster concentration. The US controls research, design IP, and EDA software; Europe dominates specialized tooling, led by ASML's monopoly on EUV lithography scanners; and East Asia (specifically TSMC and Samsung) commands wafer fabrication. This high specialization means any single failure point halts the entire global system.",
    // Slide 8
    "While wafer fabrication nodes (like 3nm and the emerging 2nm node) capture public attention, the primary bottleneck in 2026 is back-end advanced packaging. Heterogeneous packaging techniques like Chip-on-Wafer-on-Substrate (CoWoS) and 3D stacking are highly constrained, making packaging the primary growth limiter for high-performance AI chips.",
    // Slide 9
    "Geopolitics has fragmented the silicon landscape into a multi-polar world. Government initiatives—such as the US CHIPS Act ($52B) and massive state funding in Europe and China—have triggered a reshoring race. Crucially, raw material chokepoints like Gallium and Germanium are now active levers of trade and foreign policy.",
    // Slide 10
    "To build resilience, leading firms are mapping their supply networks down to Tier-4 and Tier-5 suppliers. Additionally, we are seeing the rise of circular supply chains, where firms recover rare earth metals and copper from e-waste to insulate themselves from mining volatility and supply disruptions.",
    // Slide 11
    "We now transition to Part 3: End-User Industries. Semiconductors have become the central nervous system of the global economy. 'Silicon Intensity'—the value of semiconductor content per product unit—is now the primary metric of industrial competitiveness. No modern industry can run or innovate without silicon.",
    // Slide 12
    "The demand landscape in 2026 shows a major structural shift. AI infrastructure, automotive electronics, and factory robotics are capturing the majority of growth. While traditional smartphone and PC markets face saturation, specialized automotive and AI accelerator segments are driving industry revenues to new heights.",
    // Slide 13
    "AI accelerators have turned data centers into massive intelligence engines, with the market approaching $500 billion. This segment is the primary consumer of leading-edge 3nm and 2nm foundry nodes, consuming massive volumes of High Bandwidth Memory and advanced networking silicon.",
    // Slide 14
    "Electric Vehicles and Advanced Driver Assistance Systems (ADAS) are doubling the semiconductor value per vehicle, now exceeding $1,000 per unit. EVs depend heavily on Silicon Carbide (SiC) power electronics for battery efficiency, while autonomous drive systems require massive local compute power and LiDAR arrays.",
    // Slide 15
    "Edge AI is transforming industrial automation and healthcare. Industry 4.0 uses real-time edge analytics for predictive maintenance. In healthcare, semiconductors enable smart implants, wearable biosensors, and personalized diagnostics, demanding highly rugged, long-lifecycle silicon.",
    // Slide 16
    "While traditional consumer volumes mature, manufacturers are integrating Neural Processing Units (NPUs) into laptops and phones to enable on-device AI. Looking forward, emerging frontiers like quantum computing, 6G telecom, and brain-inspired neuromorphic chips are defining the roadmap toward 2030.",
    // Slide 17
    "In conclusion, we have reached a state of total silicon dependency. The path to a $2 global industry by the early 2030s is clear. The 'Chip Wars' are not just about manufacturing footprint; they are about who can best harness silicon to transform their businesses. Let's summarize the key takeaways: Procurement must shift to a hybrid model; packaging is the new supply chokepoint; and AI and Automotive remain the primary engines of value and volume. Thank you, and I am open to any questions."
];
 
// ==========================================
// SLIDE 1: COVER
// ==========================================
let slide1 = pptx.addSlide();
slide1.background = { color: COLOR_BG };
slide1.addNotes(scripts[0]);
 
// Cover Title
slide1.addText("The 2026 Semiconductor Ecosystem", {
    x: 0.8,
    y: 2.2,
    w: 11.5,
    h: 1.2,
    fontSize: 48,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    bold: true
});
 
// Cover Subtitle
slide1.addText("A Strategic Briefing on Procurement, Global Supply Chains, and End-User Verticals", {
    x: 0.8,
    y: 3.5,
    w: 11.5,
    h: 0.8,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Border line
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 4.4,
    w: 5.0,
    h: 0.04,
    fill: { color: COLOR_ACCENT_CYAN }
});
 
// Meta Info
slide1.addText("Presenter: Phyoe Sat Paing\nBoardroom Strategic Briefing", {
    x: 0.8,
    y: 4.8,
    w: 5.0,
    h: 0.8,
    fontSize: 14,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
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
    "- Systemic Fragility: Leading-edge fabs operate near maximum capacity, leaving the industry vulnerable to minor material delays.\n\n" +
    "- Strategic Pivot: Sourcing HBM (High Bandwidth Memory) and advanced logic requires a shift from transactional purchasing to capacity reservation models.",
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
slide3.addText("Used for standardized legacy passive elements and commoditized logic chips. Minimizes capital lock-up and inventory holding costs while keeping storage footprint low.", {
    x: 0.9,
    y: 3.8,
    w: 5.1,
    h: 2.4,
    fontSize: 18,
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
    y: 3.8,
    w: 5.1,
    h: 2.4,
    fontSize: 18,
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
slide4.addText("Leading-Edge Nodes\n\nFocus: Deep alliances, R&D partnerships, capacity reservations.", {
    x: 8.6,
    y: 1.7,
    w: 3.8,
    h: 1.9,
    fontSize: 16,
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
slide4.addText("Legacy Nodes\n\nFocus: Multi-sourcing, distributor networks, life-cycle tracking.", {
    x: 8.6,
    y: 4.4,
    w: 3.8,
    h: 1.9,
    fontSize: 16,
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
slide5.addText("AI integration automatically tracks tier-2 chemical and substrate suppliers to detect factory closures or export blocks before they ripple into final fab allocations.", {
    x: 0.8,
    y: 5.8,
    w: 11.6,
    h: 0.7,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
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
slide7.addText("USA: Design IP\n\n80%+ market share in advanced EDA software tools.", {
    x: 8.6,
    y: 1.7,
    w: 3.8,
    h: 1.9,
    fontSize: 16,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 8.4,
    y: 4.2,
    w: 4.2,
    h: 2.3,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_PURPLE, width: 1 }
});
slide7.addText("ASML (EU): Lithography\n\n100% monopsony on EUV printing technology.", {
    x: 8.6,
    y: 4.4,
    w: 3.8,
    h: 1.9,
    fontSize: 16,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
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
slide8.addText("Back-End: Advanced Packaging Chokepoint", {
    x: 7.2,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide8.addText("Integrating multiple logic dies and High Bandwidth Memory (HBM) via CoWoS interposers is more constrained than wafer printing.", {
    x: 7.2,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 18,
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
slide8.addText("Logistics bottleneck: Reaching target AI yields depends heavily on advanced back-end capacity, not just front-end print nodes.", {
    x: 0.8,
    y: 5.8,
    w: 11.6,
    h: 0.7,
    fontSize: 15,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
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
slide9.addText("CRITICAL CHOKEPOINT", {
    x: 8.4,
    y: 2.2,
    w: 4.2,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_ROSE,
    align: 'center',
    bold: true
});
slide9.addText("Gallium &\nGermanium", {
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
slide9.addText("Strict raw material export control levers", {
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
slide10.addText("Key Message: The future of the supply chain is \"Circular and Autonomous,\" using AI to self-heal and recycling to secure raw materials.", {
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
slide10.addText("Deep Supply Mapping", {
    x: 0.9,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    bold: true
});
slide10.addText("Leading manufacturers utilize digital mapping tools to trace supply down to Tier-4 and Tier-5 chemical suppliers.", {
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
slide10.addText("Circular Mineral Reclamation", {
    x: 7.2,
    y: 3.0,
    w: 5.1,
    h: 0.4,
    fontSize: 20,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_GREEN,
    bold: true
});
slide10.addText("Firms actively recycle e-waste, reclaiming trace copper, silicon, and gold substrates to buffer raw mining volatility.", {
    x: 7.2,
    y: 3.6,
    w: 5.1,
    h: 1.5,
    fontSize: 18,
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
slide10.addText("Mapping and recycling shield operations from supply disruptions and support sustainable GVC mandates.", {
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
let slide11 = createBaseSlide("PART 3: END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "The Ubiquity of Silicon: Powering the Modern World", 11, scripts[10]);
 
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
slide11.addText("KEY METRIC", {
    x: 8.4,
    y: 2.2,
    w: 4.2,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_PURPLE,
    align: 'center',
    bold: true
});
slide11.addText("Silicon\nIntensity", {
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
slide11.addText("Primary industrial competitiveness index", {
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
// SLIDE 12: THE DEMAND LANDSCAPE IN 2026
// ==========================================
let slide12 = createBaseSlide("PART 3: END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Executive Summary: The Demand Landscape in 2026", 12, scripts[11]);
 
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
 
// Columns for sectors
const sectors = [
    { title: "AI Datacenters", desc: "Nearly 50% of semiconductor industry growth and revenue is driven by high-performance AI accelerators.", color: COLOR_ACCENT_CYAN },
    { title: "Automotive", desc: "The fastest growing volume segment, requiring massive numbers of legacy control nodes and SiC power chips.", color: COLOR_ACCENT_PURPLE },
    { title: "Smartphones & PCs", desc: "Traditional core segments face volume saturation, driving consolidation and focus on specialized edge accelerators.", color: COLOR_ACCENT_GREEN }
];
 
sectors.forEach((sec, idx) => {
    let xPos = 0.6 + (idx * 4.2);
    
    slide12.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 2.8,
        w: 3.6,
        h: 3.8,
        fill: { color: COLOR_CARD },
        line: { color: COLOR_MUTED, width: 1 }
    });
    
    slide12.addText(sec.title, {
        x: xPos + 0.3,
        y: 3.1,
        w: 3.0,
        h: 0.5,
        fontSize: 20,
        fontFace: 'Helvetica',
        color: sec.color,
        bold: true
    });
    
    slide12.addText(sec.desc, {
        x: xPos + 0.3,
        y: 3.8,
        w: 3.0,
        h: 2.5,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC
    });
});
 
// ==========================================
// SLIDE 13: AI & DATA CENTERS
// ==========================================
let slide13 = createBaseSlide("PART 3: END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "AI & Data Centers: The Generative Revolution", 13, scripts[12]);
 
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
    "- Accelerator Market ($500B): Generative models and neural computing demand massive scaling of TPU and GPU nodes.\n\n" +
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
slide13.addText("ANALYST PROJECT", {
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
slide13.addText("$500B", {
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
slide13.addText("AI Accelerator market size by 2026", {
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
// SLIDE 14: AUTOMOTIVE: THE SMARTPHONE ON WHEELS
// ==========================================
let slide14 = createBaseSlide("PART 3: END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Automotive: The \"Smartphone on Wheels\"", 14, scripts[13]);
 
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
slide14.addText("ESTIMATE", {
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
slide14.addText("Silicon value content per EV unit", {
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
// SLIDE 15: INDUSTRIAL, IOT & HEALTHCARE
// ==========================================
let slide15 = createBaseSlide("PART 3: END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Industrial, IoT & Healthcare: Intelligence at the Edge", 15, scripts[14]);
 
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
let slide16 = createBaseSlide("PART 3: END-USER INDUSTRIES & APPLICATION ECOSYSTEM", "Consumer Electronics & Emerging Frontiers", 16, scripts[15]);
 
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
 
// Key Message Callout Box
slide17.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 12.0,
    h: 0.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_ACCENT_CYAN, width: 1.5 }
});
slide17.addText("Key Message: We have reached a point of \"Total Silicon Dependency.\" The path to a $2 trillion industry is certain.", {
    x: 0.8,
    y: 1.45,
    w: 11.6,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_ACCENT_CYAN,
    italic: true,
    bold: true
});
 
// Sub-statement
slide17.addText("Mastery of the semiconductor ecosystem is mastery of the future. The \"Chip Wars\" aren't just about manufacturing; they are about who can best harness silicon to transform their industries.", {
    x: 0.6,
    y: 2.4,
    w: 12.0,
    h: 0.8,
    fontSize: 18,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_SEC
});
 
// Key Takeaways label
slide17.addText("KEY TAKEAWAYS SUMMARY", {
    x: 0.6,
    y: 3.3,
    w: 12.0,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Helvetica',
    color: COLOR_TEXT_PRI,
    bold: true,
    charSpacing: 1
});
 
// 3 Takeaways Cards
const takeaways = [
    { title: "Procurement", desc: "Shift from JIT to Strategic Hybrid; resilience is the new ROI.", color: COLOR_ACCENT_CYAN },
    { title: "Supply Chain", desc: "Chokepoints in Advanced Packaging and SME are the new strategic risks.", color: COLOR_ACCENT_PURPLE },
    { title: "Industries", desc: "AI is the Value King; Automotive is the Volume King.", color: COLOR_ACCENT_GREEN }
];
 
takeaways.forEach((tk, idx) => {
    let xPos = 0.6 + (idx * 4.2);
    
    slide17.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 3.7,
        w: 3.6,
        h: 3.0,
        fill: { color: COLOR_CARD },
        line: { color: COLOR_MUTED, width: 1 }
    });
    
    slide17.addText(tk.title, {
        x: xPos + 0.3,
        y: 3.9,
        w: 3.0,
        h: 0.4,
        fontSize: 20,
        fontFace: 'Helvetica',
        color: tk.color,
        bold: true
    });
    
    slide17.addText(tk.desc, {
        x: xPos + 0.3,
        y: 4.4,
        w: 3.0,
        h: 2.1,
        fontSize: 18,
        fontFace: 'Helvetica',
        color: COLOR_TEXT_SEC
    });
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
