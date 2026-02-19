/* ═══════════════════════════════════════════════════════════════
   THE CLARITY PROTOCOL — App Logic (v2.0 Elite)
   "Consistency over Intensity" — We are what we repeatedly do.
   ═══════════════════════════════════════════════════════════════ */

// ═══ PREMIUM SERVICES ═══
import { DataVisualizer } from './services/dataVisualizer.js';
import { AchievementSystem } from './services/achievements.js';
import {
    LazyLoader,
    HapticFeedback,
    SmoothScroll,
    LoadingOptimizer,
    PerformanceMonitor,
    ScrollProgress
} from './services/performance.js';
import {
    TouchGestures,
    HeatmapCalendar,
    AchievementExport,
    SwipeNavigation
} from './services/interactivity.js';
import { PWAManager, PushNotificationManager, OfflineManager } from './services/pwa.js';
import { AnalyticsManager, EventTracker, BehaviorHeatmap } from './services/analytics.js';
import { SocialSharing, Leaderboard, CommunityChallenges } from './services/social.js';
import { ModuleManager } from './services/modules.js';
import { PDFManager } from './services/pdfManager.js';
import { workflowEngine } from './services/workflow/WorkflowEngine.js';
import { NodeEditor } from './services/workflow/NodeEditor.js';

// ═══ DATA: MASCULINE (STANDARD) ═══
const EXECUTION_PROTOCOL = {
    daily_timeline: [
        { time: "06:00", action: "Wake Up", protocol: "No Snooze / Hydrate (20oz + Salt)" },
        { time: "06:15", action: "Solar Load", protocol: "Light Filter: Morning Anchor (10m)" },
        { time: "06:30", action: "Movement", protocol: "Zone 2 Walk / Mobility" },
        { time: "07:30", action: "Deep Work Block", protocol: "Mental Clarity: The Essentialist Filter" },
        { time: "13:00", action: "Antigravity Training", protocol: "Skill Tree: Planche / Lever / Handstand" },
        { time: "20:00", action: "Digital Twilight", protocol: "Light Filter: Blue Blocker Mode" },
        { time: "22:00", action: "Sleep", protocol: "Air Sanctuary: Clean Room ON" }
    ]
};

// ═══ DATA: FEMININE (INFRADIAN) ═══
const FEMININE_PROTOCOL = {
    phases: [
        {
            name: "FOLLICULAR", days: [6, 12],
            bio_target: "ESTROGEN RISING",
            focus: "CREATION",
            neurochemistry: "Higher creativity. Verbal fluency peaks. Dopamine sensitivity increases.",
            training: "High Intensity / New Skills (HIIT/Sprinting)",
            nutrition: "Light, Fresh, Fermented (Sauerkraut, Kimchi) to metabolize estrogen.",
            biohack: "Cold Plunge OK (Estrogen improves thermoregulation)"
        },
        {
            name: "OVULATORY", days: [13, 15],
            bio_target: "PEAK ESTROGEN & TESTOSTERONE",
            focus: "EXPRESSION",
            neurochemistry: "Maximum verbal and social magnetism. Confidence peak.",
            training: "Max Power / PR Attempts (Hit heavy lifts now)",
            nutrition: "Raw Foods / Fiber Loading (Cruciferous Veg) to flush excess hormones.",
            biohack: "Max Thermal Contrast (Body is resilient)"
        },
        {
            name: "LUTEAL", days: [16, 28],
            bio_target: "PROGESTERONE DOMINANCE",
            focus: "DEEP WORK / NESTING",
            neurochemistry: "Focus turns inward. Detail-oriented. Lower stress tolerance.",
            training: "Strength Maintenance / Zone 2 (Avoid cortisol spikes)",
            nutrition: "Complex Carbs (Sweet Potato/Squash) / Warm Foods. Stabilize blood sugar.",
            biohack: "Sauna Only. NO COLD PLUNGE (Body needs warmth for lining)."
        },
        {
            name: "MENSTRUAL", days: [1, 5],
            bio_target: "HORMONE RESET",
            focus: "REFLECTION / REST",
            neurochemistry: "Right & Left brain hemispheres communicate most effectively. Intuition peaks.",
            training: "Rest / Mobility / Walking / Yoga Nidra",
            nutrition: "Iron-Rich (Red Meat/Liver) / Nutrient Dense stews.",
            biohack: "Red Light Therapy / Magnesium / Warm Baths."
        }
    ],
    daily_timeline: [
        { time: "07:00", action: "Slow Wake", protocol: "Hydrate + Minerals. No alarms if possible." },
        { time: "07:30", action: "Movement", protocol: "Cycle-Synced Yoga / Walk" },
        { time: "09:00", action: "Nourishment", protocol: "Warm Protein Breakfast (No Fasting via Cortisol)" },
        { time: "14:00", action: "Deep Work", protocol: "Creative/Strategic Block" },
        { time: "21:00", action: "Wind Down", protocol: "Red Light Therapy / Magnesium" }
    ]
};

// ═══ GUIDES: HORMONE MAP & AUDIT ═══
const NEW_GUIDES = {
    hormone_map: {
        title: "The 28-Day Hormone Map",
        content: "Your biology is not static. It is a 28-day symphony. In the Follicular phase, you are a spring coiled for action. In Luteal, you are an architect reviewing the blueprints. Fight this, and you break. Flow with it, and you become limitless."
    },
    biological_audit: {
        title: "The Biological Audit",
        content: "Stop guessing. Test. 1. Blood: CRP (Inflammation), HbA1c (Sugar), ApoB (Lipids). 2. DNA: Methylation status. 3. Environment: EMF levels, Water quality, Light spectrum execution."
    }
};

const BIOHACKING_STACK = {
    stacks: [
        {
            id: "light_filter", name: "The Light Filter", target: "Circadian Biology",
            protocols: [
                { name: "But First, Light", action: "Direct Solar Exposure", timing: "Within 30m of waking", dosage: "10-20 minutes", mechanism: "Cortisol Pulse / Melatonin Timer" },
                { name: "Digital Twilight", action: "Blue Light Elimination", timing: "2 hours before bed", mechanism: "Melatonin Protection" }
            ]
        },
        {
            id: "thermal_filter", name: "The Thermal Filter", target: "Hormetic Stress Adaptation",
            protocols: [
                { name: "The Norepinephrine Spike", action: "Cold Water Immersion (<55°F)", timing: "Morning (Pre-Deep Work)", dosage: "11 mins/week", mechanism: "Inflammation Reduction / Dopamine" },
                { name: "The Dynorphin Flush", action: "Heat Exposure (180°F+)", timing: "Post-Workout or Evening", dosage: "57 mins/week", mechanism: "Heat Shock Proteins / Mu-Opioid Sensitivity" }
            ]
        },
        {
            id: "chemical_filter", name: "The Chemical Filter", target: "Neurotransmitter Optimization",
            protocols: [
                { name: "Toxin Elimination", action: "Remove Seed Oils & Liquid Calories" },
                { name: "The Deep Work Stack", action: "Alpha-GPC 300mg + L-Theanine 200mg + Mag Threonate" }
            ]
        }
    ]
};

// Tactical Sweep Data moved to Sovereign Data or kept as constant for now
const TACTICAL_SWEEP_DATA = {
    MASCULINE: [
        { id: "m_sweep_1", category: "ENVIRONMENT", task: "Blackout Audit", detail: "Is the sleep environment 100% dark? (Tape over LEDs)", impact: "Testosterone/HGH" },
        { id: "m_sweep_2", category: "NUTRITION", task: "Seed Oil Purge", detail: "Check pantry for Canola, Sunflower, Soybean oils. Trash them.", impact: "Inflammation" },
        { id: "m_sweep_3", category: "MINDSET", task: "The Friction Audit", detail: "Identify one task you are avoiding. Do it first.", impact: "Dopamine Resensitization" },
        { id: "m_sweep_4", category: "PHYSIOLOGY", task: "Grip Strength Test", detail: "Dead hang for max time. Target: >90s.", impact: "CNS Integrity" }
    ],
    FEMININE: [
        { id: "f_sweep_1", category: "ENVIRONMENT", task: "Endocrine Defense", detail: "Check skincare for Phthalates/Parabens. Switch to biological matches.", impact: "Estrogen Balance" },
        { id: "f_sweep_2", category: "NUTRITION", task: "Cycle-Sync Pantry", detail: "Follicular/Ovulatory: Fermented foods. Luteal: Root veggies.", impact: "Progesterone Production" },
        { id: "f_sweep_3", category: "MINDSET", task: "Boundary Audit", detail: "Where are you leaking energy? Say 'No' to one obligation.", impact: "Cortisol Management" },
        { id: "f_sweep_4", category: "PHYSIOLOGY", task: "Lymphatic Flow", detail: "10 mins Legs Up Wall or Dry Brushing.", impact: "Detoxification" }
    ]
};

const SKILL_TREE = {
    pillars: [
        {
            id: "push_planche", name: "The Push (The Planche)",
            target_anatomy: ["Anterior Deltoid", "Biceps Tendon", "Pectoralis Major"],
            levels: [
                { level: 1, name: "The Frog Stand", standard: "30s Hold", cues: ["Knees on lat/tricep shelf", "Core compression"] },
                { level: 2, name: "Tuck Planche Lean", standard: "15s Hold", cues: ["Hands shoulder-width", "Lean forward past wrists"] },
                { level: 3, name: "Tuck Planche", standard: "10s Hold", cues: ["Knees to chest", "Elbows locked"] },
                { level: 4, name: "Single-Leg Tuck Planche", standard: "8s Hold", cues: ["One leg extended", "Hip stability"] },
                { level: 5, name: "Advanced Tuck Planche", standard: "Flat back", cues: ["Hips 90°", "No knee contact", "Scapula protracted"] },
                { level: 6, name: "Straddle Planche Lean", standard: "10s Hold", cues: ["Legs wide", "Progressive lean"] },
                { level: 7, name: "Half-Lay Planche", standard: "5s Hold", cues: ["Hips at 45°", "Locked elbows"] },
                { level: 8, name: "Straddle Planche Negative", standard: "3 x 5s", cues: ["Slow descent", "Control throughout"] },
                { level: 9, name: "Straddle Planche", standard: "5s Hold", cues: ["Full extension", "Parallel to ground"] },
                { level: 10, name: "Full Straddle Planche", standard: "The Sovereign Standard", cues: ["Body straight", "Hips 180°", "Locked elbows", "Scapula protracted"] }
            ]
        },
        {
            id: "pull_front_lever", name: "The Pull (The Front Lever)",
            target_anatomy: ["Latissimus Dorsi", "Teres Major", "Triceps Long Head"],
            levels: [
                { level: 1, name: "The Tuck Lever", standard: "15s Hold", cues: ["Knees to chest", "Scapula retracted", "Arms straight"] },
                { level: 2, name: "Advanced Tuck Lever", standard: "12s Hold", cues: ["Back flat", "Hips opened slightly"] },
                { level: 3, name: "Half-Lay Lever", standard: "10s Hold", cues: ["Knees at 90°", "Torso horizontal"] },
                { level: 4, name: "Single-Leg Lever", standard: "8s Hold", cues: ["One leg extended", "Hips level"] },
                { level: 5, name: "Single-Leg Extended", standard: "8s Hold", cues: ["Torso horizontal", "Hips level", "Glutes engaged"] },
                { level: 6, name: "Straddle Lever", standard: "5s Hold", cues: ["Legs wide", "Body horizontal"] },
                { level: 7, name: "Half-Lay Full", standard: "5s Hold", cues: ["Legs at 45°", "Full control"] },
                { level: 8, name: "Full Lever Negative", standard: "3 x 5s", cues: ["Controlled descent", "Full extension"] },
                { level: 9, name: "Full Front Lever", standard: "3s Hold", cues: ["Rigid plank", "Shoulder to toe"] },
                { level: 10, name: "Full Front Lever", standard: "0° Deviation", cues: ["Rigid plank", "Head neutral", "Scapula depressed"] }
            ]
        },
        {
            id: "balance_handstand", name: "The Balance (The Handstand)",
            target_anatomy: ["Proprioception", "Trapezius", "Wrist Flexors"],
            levels: [
                { level: 1, name: "Chest-to-Wall Hold", standard: "60s Hold", cues: ["Nose+toes touching wall", "Hollow body", "Ribs down"] },
                { level: 2, name: "Wall Handstand Shifts", standard: "30s Moving", cues: ["Weight shifts", "Finger corrections"] },
                { level: 3, name: "Back-to-Wall Hold", standard: "45s Hold", cues: ["Heels touching only", "Open shoulders"] },
                { level: 4, name: "Toe Pulls", standard: "10 Reps", cues: ["Gentle toe pull from wall", "Re-balance"] },
                { level: 5, name: "Freestanding Handstand", standard: "30s Hold", cues: ["Ears covered by arms", "No walking", "Finger grip"] },
                { level: 6, name: "Handstand Walk", standard: "10m Distance", cues: ["Controlled steps", "Hip adjustment"] },
                { level: 7, name: "Press to Handstand", standard: "3 Clean Reps", cues: ["Straddle or pike", "Slow press"] },
                { level: 8, name: "One-Arm Wall HS", standard: "15s per arm", cues: ["Shoulder elevation", "Weight centered"] },
                { level: 9, name: "One-Arm HS Attempts", standard: "5s per arm", cues: ["Free balance", "Micro-adjustments"] },
                { level: 10, name: "One-Arm Handstand", standard: "10s per arm", cues: ["Feet together or straddle", "The pinnacle of balance"] }
            ]
        }
    ]
};

const MENTAL_MODELS = {
    algorithms: [
        {
            id: "inversion", name: "The Inversion Filter", purpose: "Risk Management / Anti-Fragility",
            steps: [
                { step: 1, prompt: "What is the goal?", type: "text", placeholder: "Define your objective..." },
                { step: 2, prompt: "What guarantees failure?", type: "textarea", placeholder: "List 5 things that ensure ruin..." },
                { step: 3, prompt: "The Kill List", type: "result", action: "Invert the list. These are your non-negotiables." }
            ]
        },
        {
            id: "essentialist", name: "The Essentialist Filter", purpose: "Time Protection",
            steps: [
                { step: 1, prompt: "Rate the opportunity (0-100)", type: "number", placeholder: "Score..." },
                { step: 2, prompt: "The Verdict", type: "result", action: "IF score < 90 THEN NO. Only 'Hell Yes' is yes." }
            ]
        },
        {
            id: "second-order", name: "Second-Order Thinking", purpose: "Long-Term Vision",
            steps: [
                { step: 1, prompt: "What is the immediate result?", type: "text", placeholder: "The first-order consequence..." },
                { step: 2, prompt: "And then what? (Second-order)", type: "textarea", placeholder: "What happens because of that result..." },
                { step: 3, prompt: "And then what? (Third-order)", type: "textarea", placeholder: "The long-term cascade..." }
            ]
        }
    ]
};

const PROTOCOL_MODULES = [
    {
        icon: "🧠", name: "Mindset", tagline: "STOIC DISCIPLINE",
        desc: "Mental friction tasks. Journaling. Inversion thinking. Train your mind to choose hard over easy.",
        items: ["30-Day Stoic Journal", "Clarity Filter Blueprint", "Mental Model Frameworks", "Clarity Skill Tree", "Decision Prompts"]
    },
    {
        icon: "🧬", name: "Biohacking", tagline: "SYSTEM RESET",
        desc: "Thermal contrast therapy. Circadian anchoring. Grounding. The science of hormetic stress.",
        items: ["Thermal Protocol (11/60)", "Circadian Light Hygiene", "System Reset Guide", "Science Annex", "Knowledge Arsenal"]
    },
    {
        icon: "🥩", name: "Fuel", tagline: "NUTRITIONAL ALCHEMY",
        desc: "Food is code. Kill seed oils. Organic protein. Raw honey. Localized shopping for SA.",
        items: ["SA Shopping List", "Recipe & Tracker", "HGH Meal Plan", "Seed Cycling Calendar", "CNS Recovery Nutrition"]
    },
    {
        icon: "💪", name: "Movement", tagline: "HYBRID ENGINE",
        desc: "100 unique bodyweight workouts. Calisthenics progressions. Zone 2 cardio. No gym required.",
        items: ["12-Week Calisthenics Program", "Hybrid Programs (6-Pack)", "Workout Database (50+)", "Grip & Hang Training", "MetCon Finishers"]
    },
    {
        icon: "❄️", name: "Recovery", tagline: "THE RESTORATION",
        desc: "Cold plunge. Sauna. Sleep protocol. Digital sunset. The evening biohacking stack.",
        items: ["Thermal Contrast Therapy", "Sleep Architecture Protocol", "Digital Twilight System", "Raw Honey Sleep Stack", "Grounding Practice"]
    },
    {
        icon: "🚀", name: "Launch", tagline: "THE DEPLOYMENT",
        desc: "Video scripts. Content calendars. Sales funnels. Everything to deploy The Protocol globally.",
        items: ["30-Day Content Calendar", "Email Sequence", "Landing Page Copy", "Global Sales Funnel", "Sovereignty Ad Scripts"]
    }
];

// ═══ GLOBAL MAP DATA (LOADED DYNAMICALLY) ═══
// See loadSovereignMap()
let MAP_DATA = [];

// ═══ SCANNER DATA ═══
const SCANNER_RESULTS = [
    { status: "SAFE", class: "safe", details: "No seed oils detected. Ingredients: Beef, Salt, Pepper.", rec: null },
    { status: "WARNING", class: "danger", details: "DETECTED: Canola Oil, High Fructose Corn Syrup.", rec: "Organic Grass-Fed Tallow (Local)" },
    { status: "SAFE", class: "safe", details: "Verified Organic. Cold-Pressed Olive Oil.", rec: null }
];


// ═══ STATE MANAGEMENT ═══
// Using SovereignData.js now

let currentMode = SovereignData.get(SovereignData.KEYS.MODE, 'MASCULINE');

// ═══ INITIALIZATION ═══
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initDashboard();
    initProtocols();    // ← was commented out; restoring to populate Protocol Modules grid
    initSkillTree();
    checkRedMode();

    // Initialize Score
    updateSovereigntyScore();
    // simulateBiometrics();

    // Initialize 12-Week Build Tracker (The Sovereign Map)
    initBuildTracker(timelineEl);

    // Initialize Workflow Editor
    const editor = new NodeEditor('protocol-lab', workflowEngine);

    // Initialize Tactical Sweep
    initTacticalSweep();

    // Listen for sovereign data updates
    window.addEventListener('sovereign-data-update', (e) => {
        if (e.detail.key === SovereignData.KEYS.MODE) {
            currentMode = e.detail.value;
            // Full re-render on mode switch
            updateBodyClass();
            initDashboard();
            initTacticalSweep();
            updateContextualButtons();
        }
    });

    updateBodyClass();
});

// ═══ HERO PARTICLE CANVAS ═══
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((w * h) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.05
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const color = currentMode === 'FEMININE' ? '216, 160, 160' : '212, 175, 55'; // Gold or Rose Gold

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${color}, ${0.03 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
}


// ═══ NAVIGATION ═══
function initNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const header = document.getElementById('main-nav');
    const modeSwitch = document.getElementById('mode-switch');

    // Mobile Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth Scroll
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            navLinks.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');

            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll Spy & Header Glass
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 2rem';
            header.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            header.style.padding = '1.5rem 2rem';
            header.style.background = 'rgba(5, 5, 5, 0.8)';
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Mode Switch with Transition
    if (modeSwitch) {
        modeSwitch.checked = currentMode === 'FEMININE';
        updateBodyClass();

        modeSwitch.addEventListener('change', (e) => {
            const newMode = e.target.checked ? 'FEMININE' : 'MASCULINE';
            SovereignData.set(SovereignData.KEYS.MODE, newMode);
            // Listener in DOMContentLoaded handles the rest
        });
    }

    // Initial Button Update
    updateContextualButtons();
}

function updateContextualButtons() {
    const protocolBtn = document.getElementById('protocol-guide-btn');
    if (protocolBtn) {
        if (currentMode === 'FEMININE') {
            protocolBtn.textContent = 'READ: HORMONE MAP';
            protocolBtn.dataset.guide = 'hormone-map';
        } else {
            protocolBtn.textContent = 'READ: 24H BLUEPRINT';
            protocolBtn.dataset.guide = 'day-1';
        }
    }
}

function updateBodyClass() {
    if (currentMode === 'FEMININE') {
        document.body.classList.add('mode-feminine');
    } else {
        document.body.classList.remove('mode-feminine');
    }
}


// ═══ SCROLL ANIMATIONS ═══
function initScrollAnimations() {
    const elements = document.querySelectorAll('.glass-card, .protocol-card, .skill-level, .scanner-result');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}


// ═══ DAILY OPS DATA ═══
const DAILY_OPS = [
    {
        phase: "PHASE I: MORNING ANCHOR (THE WAKE)",
        items: [
            { time: "05:30", title: "WAKE PROTOCOL", action: "Eyes open. Phone Airplane Mode.", citation: "30-minute digital fast. [cite: 409]", type: "bio" },
            { time: "06:00", title: "SOLAR LOADING", action: "Direct Sunlight + Grounding.", input: "Filtered Water + Sea Salt.", widget: "timer", duration: 10, type: "pro" },
            { time: "07:00", title: "STRUCTURAL INTEGRITY", action: "First Movement.", protocol: "Dead Hang + Deep Squat Hold.", type: "physio" }
        ]
    },
    {
        phase: "PHASE II: FUEL & FIRE (THE WORK)",
        items: [
            { time: "12:00", title: "BREAK FAST", input: "Organic Protein + Living Food + Raw Honey.", type: "nutri" },
            { time: "15:00", title: "TRAINING BLOCK", action: "Option A: Calisthenics (45m) OR Option B: Zone 2 (30m).", type: "physio" },
            { time: "16:30", title: "THERMAL CONTRAST", protocol: "Sauna (20m) + Cold Plunge (3m).", widget: "tracker", type: "pro" }
        ]
    },
    {
        phase: "PHASE III: RECOVERY (THE SHIELD)",
        items: [
            { time: "18:00", title: "RE-FEED", input: "Grass-fed Protein + Organic Carbs + Celtic Salt.", type: "nutri" },
            { time: "19:00", title: "DIGITAL TWILIGHT", action: "Blue-blockers ON. Overhead lights OFF.", visual: "red-mode", type: "pro" },
            { time: "20:30", title: "PRE-SLEEP", input: "1 tsp Raw Honey + Chamomile Tea.", status: "Kitchen Closed.", type: "nutri" },
            { time: "21:00", title: "BLACK BOX", action: "Total Darkness. No Screens. Sleep.", type: "bio" }
        ]
    }
];

// ═══ DASHBOARD ═══
// ═══ DASHBOARD ═══
// ═══ DASHBOARD ═══
function initDashboard() {
    const timelineEl = document.getElementById('dashboard-timeline');
    if (!timelineEl) return;

    // Use Track Modules to get data
    let dailyOps;
    let bioState = "";

    if (currentMode === 'MASCULINE') {
        dailyOps = MaleTrack.getDailyProtocol();
        bioState = MaleTrack.getBioState();
    } else {
        dailyOps = FemaleTrack.getDailyProtocol();
        bioState = FemaleTrack.getBioState();
    }

    timelineEl.innerHTML = '';
    const completedTasks = SovereignData.get(SovereignData.KEYS.DAILY_OPS + '_' + currentMode, []);

    // Render Bio State Header (Modified to include BioWeather)
    const envTrigger = BioWeather.getEnvironmentTrigger();

    const stateHeader = document.createElement('div');
    stateHeader.className = 'ops-phase-header';
    stateHeader.style.textAlign = 'center';
    stateHeader.style.marginBottom = '20px';
    stateHeader.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--signal-dim); letter-spacing: 2px;">BIOLOGICAL OS STATE</div>
        <div style="font-size: 1.2rem; color: var(--gold); margin: 5px 0;">${bioState}</div>
        <div style="font-size: 0.7rem; color: var(--signal-muted); display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
            <span>🌞 UV IND: ${BioWeather.getSolarContext().uv_index}</span>
            <span>⚡ TRIG: ${envTrigger.action}</span>
        </div>
    `;
    timelineEl.appendChild(stateHeader);

    // Knowledge Artifact (The Truth-Based Integration)
    const dailyTruth = KnowledgeArsenal.getDailyTruth();
    const truthCard = document.createElement('div');
    truthCard.className = 'glass-card';
    truthCard.style.marginBottom = '20px';
    truthCard.style.borderLeft = '3px solid var(--gold)';
    truthCard.innerHTML = `
        <div class="ops-row" style="padding-bottom: 0;">
            <div class="ops-content">
                <div class="ops-title" style="color: var(--gold); font-size: 0.8rem;">TRUTH ARTIFACT: ${dailyTruth.tag}</div>
                <div class="ops-sub" style="font-weight: bold; margin-top: 5px;">${dailyTruth.title}</div>
            </div>
        </div>
        <div class="ops-details" style="display: block; padding-top: 10px;">
            <div class="ops-cite">${dailyTruth.citation}</div>
            <div class="ops-meta" style="margin-top: 5px; color: var(--signal-muted);">${dailyTruth.summary}</div>
             <div class="ops-meta" style="margin-top: 5px; color: var(--signal); font-style: italic;">"${dailyTruth.mechanism}"</div>
        </div>
    `;
    timelineEl.appendChild(truthCard);

    // Render Build Tracker BEFORE Daily Ops
    // actually, let's append it after for layout, or handle inside initBuildTracker via prepend
    // For now, allow initBuildTracker to handle its own placement

    dailyOps.forEach((phase, phaseIndex) => {
        const phaseEl = document.createElement('div');
        phaseEl.className = 'ops-phase';

        const header = document.createElement('div');
        header.className = 'ops-phase-header';
        header.textContent = phase.phase;
        phaseEl.appendChild(header);

        phase.items.forEach((item, itemIndex) => {
            const uniqueId = `ops_${currentMode}_${phaseIndex}_${itemIndex}`;
            const isCompleted = completedTasks.includes(uniqueId);

            const card = document.createElement('div');
            card.className = `ops-card ${isCompleted ? 'completed' : ''}`;
            card.dataset.id = uniqueId;
            card.innerHTML = `
                <div class="ops-row" onclick="toggleTaskCompletion('${uniqueId}', this.parentNode)">
                    <div class="ops-time">${item.time}</div>
                    <div class="ops-content">
                        <div class="ops-title">${item.title}</div>
                        <div class="ops-sub">${item.action}</div>
                    </div>
                    <div class="ops-status"></div>
                </div>
                <div class="ops-details">
                    <div class="ops-cite">${item.citation || "Protocol Standard"}</div>
                    <div class="ops-meta">TYPE: ${item.type.toUpperCase()}</div>
                    <button class="ops-btn" onclick="toggleTaskDetails(this.parentNode.parentNode)">DETAILS</button>
                    ${isCompleted ? '<div class="ops-tracker">EXECUTED</div>' : ''}
                </div>
            `;
            phaseEl.appendChild(card);
        });

        timelineEl.appendChild(phaseEl);
    });

    updateSovereigntyScore();

    // Initialize Tactical Sweep
    initTacticalSweep();

    // Load Sovereign Map (Logistics Agent)
    loadSovereignMap();
}

async function loadSovereignMap() {
    try {
        const response = await fetch('sovereign_map.json');
        if (!response.ok) throw new Error("Map Agent Offline");
        const data = await response.json();
        MAP_DATA = data.locations;
        renderMapWidget();
    } catch (e) {
        console.warn("Sovereign Map Load Error:", e);
        // Fallback or do nothing
    }
}

function renderMapWidget() {
    const timelineEl = document.getElementById('dashboard-timeline');
    if (!timelineEl || MAP_DATA.length === 0) return;

    let mapContainer = document.getElementById('sovereign-map-widget');
    if (!mapContainer) {
        mapContainer = document.createElement('div');
        mapContainer.id = 'sovereign-map-widget';
        mapContainer.className = 'glass-card';
        mapContainer.style.marginTop = '20px';
        mapContainer.style.border = '1px solid var(--signal-dim)';
        timelineEl.appendChild(mapContainer);
    }

    const safeCount = MAP_DATA.filter(l => l.type === 'safe').length;

    let html = `
        <div class="ops-row" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div class="ops-content">
                <div class="ops-title" style="color: var(--gold); font-size: 0.9rem;">LOGISTICS AGENT: ACTIVE</div>
                <div class="ops-sub" style="color: var(--signal);">Sources Identified: ${safeCount} Safe / ${MAP_DATA.length} Total</div>
            </div>
            <div class="ops-status" style="font-size: 1.5rem;">🌍</div>
        </div>
        <div style="padding: 1rem; max-height: 200px; overflow-y: auto;">
    `;

    MAP_DATA.forEach(loc => {
        const color = loc.type === 'safe' ? 'var(--gold)' : 'var(--danger)';
        html += `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--signal);">${loc.name}</span>
                    <span style="font-size: 0.6rem; background: ${color}; color: var(--void); padding: 2px 6px; border-radius: 4px;">${loc.type.toUpperCase()}</span>
                </div>
                <div style="font-size: 0.7rem; color: var(--signal-muted); margin-top: 4px;">${loc.desc}</div>
            </div>
        `;
    });

    html += `</div>`;
    mapContainer.innerHTML = html;
}

// ═══ TACTICAL SWEEP LOGIC ═══
function initTacticalSweep() {
    const dashboardContainer = document.querySelector('.dashboard-grid');
    if (!dashboardContainer) return;

    // Check if sweep container exists, if not create it
    let sweepContainer = document.getElementById('tactical-sweep-container');
    if (!sweepContainer) {
        sweepContainer = document.createElement('div');
        sweepContainer.id = 'tactical-sweep-container';
        sweepContainer.className = 'glass-card sweep-card';
        // Insert after timeline or at the top of dashboard grid
        const timeline = document.getElementById('dashboard-timeline');
        if (timeline && timeline.parentNode) {
            timeline.parentNode.insertBefore(sweepContainer, timeline);
        } else {
            dashboardContainer.prepend(sweepContainer);
        }
    }

    const modeData = TACTICAL_SWEEP_DATA[currentMode];
    const completedItems = SovereignData.get(SovereignData.KEYS.TACTICAL_SWEEP + '_' + currentMode, []);

    const guideLink = currentMode === 'FEMININE' ? 'guides/female-tactical-sweep.html' : 'guides/male-tactical-sweep.html';

    let html = `
        <div class="sweep-header">
            <h3><span class="icon">⚔️</span> BLACK BAG AUDIT: ${currentMode}</h3>
            <div class="sweep-actions">
                <a href="${guideLink}" target="_blank" class="ops-btn" style="font-size: 0.6rem; margin: 0; padding: 4px 8px;">READ INTEL</a>
                <div class="sweep-progress">${completedItems.length}/${modeData.length}</div>
            </div>
        </div>
        <div class="sweep-list">
    `;

    modeData.forEach(item => {
        const isChecked = completedItems.includes(item.id);
        html += `
            <div class="sweep-item ${isChecked ? 'completed' : ''}" onclick="toggleSweepItem('${item.id}', this)">
                <div class="sweep-checkbox">${isChecked ? '✓' : ''}</div>
                <div class="sweep-content">
                    <div class="sweep-task">${item.task} <span class="sweep-tag">${item.category}</span></div>
                    <div class="sweep-detail">${item.detail}</div>
                    <div class="sweep-impact">IMPACT: ${item.impact}</div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    sweepContainer.innerHTML = html;
}

function toggleSweepItem(id, el) {
    const key = SovereignData.KEYS.TACTICAL_SWEEP + '_' + currentMode;
    const completed = SovereignData.toggleItem(key, id);

    // UI Update
    const isNowChecked = completed.includes(id);
    if (isNowChecked) {
        el.classList.add('completed');
        el.querySelector('.sweep-checkbox').textContent = '✓';
        if (navigator.vibrate) navigator.vibrate(50);
    } else {
        el.classList.remove('completed');
        el.querySelector('.sweep-checkbox').textContent = '';
    }

    // Update Progress Text
    const modeData = TACTICAL_SWEEP_DATA[currentMode];
    const progressEl = el.closest('.glass-card').querySelector('.sweep-progress');
    if (progressEl) progressEl.textContent = `${completed.length}/${modeData.length}`;

    updateSovereigntyScore();
}

function toggleTaskCompletion(id, card) {
    const key = SovereignData.KEYS.DAILY_OPS + '_' + currentMode;
    const completed = SovereignData.toggleItem(key, id);

    const isNowChecked = completed.includes(id);

    if (isNowChecked) {
        card.classList.add('completed');
        if (navigator.vibrate) navigator.vibrate(50);
    } else {
        card.classList.remove('completed');
    }

    updateSovereigntyScore();
}

function checkRedMode() {
    const hour = new Date().getHours();
    const isRedTime = hour >= 19 || hour < 5;
    if (isRedTime) {
        document.body.classList.add('red-mode');
    } else {
        document.body.classList.remove('red-mode');
    }
}

function startTimer(btn, minutes) {
    if (btn.classList.contains('running')) return;
    btn.classList.add('running');
    let seconds = minutes * 60;

    const interval = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        btn.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;

        if (seconds <= 0) {
            clearInterval(interval);
            btn.textContent = "PROTOCOL COMPLETE";
            btn.classList.remove('running');
            btn.classList.add('finished');
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
    }, 1000);
}



function updateSovereigntyScore() {
    const opsCompleted = SovereignData.get(SovereignData.KEYS.DAILY_OPS + '_' + currentMode, []);
    const sweepCompleted = SovereignData.get(SovereignData.KEYS.TACTICAL_SWEEP + '_' + currentMode, []);

    // Need to get total ops from the Tracks now
    let dailyOps;
    if (currentMode === 'MASCULINE') {
        dailyOps = MaleTrack.getDailyProtocol();
    } else {
        dailyOps = FemaleTrack.getDailyProtocol();
    }

    const totalOps = dailyOps.reduce((acc, phase) => acc + phase.items.length, 0);
    const totalSweep = TACTICAL_SWEEP_DATA[currentMode].length;

    const totalItems = totalOps + totalSweep;
    const totalDone = opsCompleted.length + sweepCompleted.length;

    // Avoid division by zero
    const score = totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);

    const scoreEl = document.getElementById('score-value');
    const ringEl = document.getElementById('score-ring-fill');

    if (scoreEl) animateCount(scoreEl, score, 1500);

    if (ringEl) {
        // 534 is circumference of r=85 (approx) -> actually r=54 in HTML (2*PI*54 ≈ 339)
        // CSS says stroke-dasharray: 534.
        const maxOffset = 534;
        const offset = maxOffset - (maxOffset * score / 100);
        ringEl.style.strokeDashoffset = offset;
    }
}

function animateCount(el, target, duration) {
    const start = parseInt(el.textContent) || 0;
    const diff = target - start;
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + diff * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// ═══ BIOMETRICS SIMULATION (VIA SERVICE) ═══
/* 
   We import the service class definition directly here for simplicity in this 
   single-file build, but normally this would be an import.
   
   See services/biometrics.js for the full class structure.
*/

class DataNormalizer {
    static normalizeSamsung(data) {
        return {
            hrv: data.heart_rate_variability || 0,
            sleep_score: Math.min(100, (data.sleep.duration / 480) * 100),
            recovery_score: 100 - data.stress_score,
            source: 'Samsung'
        };
    }
    static normalizeOura(data) {
        return {
            hrv: data.readiness.score_hrv_balance,
            sleep_score: data.sleep.score,
            recovery_score: data.readiness.score,
            source: 'Oura'
        };
    }
}

class BiometricServiceAdapter {
    async fetchSamsung() {
        return {
            heart_rate_variability: Math.floor(Math.random() * (120 - 40) + 40),
            sleep: { duration: 460 + Math.random() * 60 },
            stress_score: Math.floor(Math.random() * 40)
        };
    }
}

const biometricService = new BiometricServiceAdapter();

async function simulateBiometrics() {
    const hrvEl = document.getElementById('bio-hrv');
    const sleepEl = document.getElementById('bio-sleep');
    const recoveryEl = document.getElementById('bio-recovery');
    const statusEl = document.getElementById('bio-status');

    statusEl.textContent = "● CONNECTING TO SAMSUNG HEALTH API...";
    statusEl.style.color = "var(--gold)";

    try {
        // Simulate API Latency
        await new Promise(r => setTimeout(r, 1500));

        const rawData = await biometricService.fetchSamsung();
        const data = DataNormalizer.normalizeSamsung(rawData);

        hrvEl.textContent = data.hrv + " ms";
        const hours = Math.floor(data.sleep_score * 4.8 / 60); // approx back-calc
        sleepEl.textContent = "7h 42m"; // Keep simple for UI
        recoveryEl.textContent = data.recovery_score + "%";

        statusEl.textContent = "● LIVE SYNC: SAMSUNG HEALTH";
        statusEl.style.color = "var(--success, #4CAF50)";

        // === PREMIUM: HRV Trend Chart ===
        setTimeout(() => {
            const hrvData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                hrvData.push({ date: date.toISOString().split('T')[0], value: 40 + Math.random() * 80 });
            }
            DataVisualizer.createHRVChart('hrv-chart', hrvData);
        }, 500);

        // === PREMIUM: Achievement Showcase ===
        setTimeout(() => {
            AchievementSystem.renderShowcase('achievement-showcase');
        }, 800);

        // Live update loop
        setInterval(() => {
            const currentHRV = parseInt(hrvEl.textContent);
            const variance = Math.floor(Math.random() * 5) - 2;
            hrvEl.textContent = (currentHRV + variance) + " ms";
        }, 5000);

    } catch (e) {
        statusEl.textContent = "⚠ SYNC FAILED";
        statusEl.style.color = "var(--danger)";
    }
}

// ═══ PROTOCOLS ═══
function initProtocols() {
    const grid = document.getElementById('protocol-grid');
    grid.innerHTML = ''; // Clear for re-renders if needed

    PROTOCOL_MODULES.forEach(mod => {
        const card = document.createElement('div');
        card.className = 'protocol-card glass-card'; // Added glass-card class
        card.innerHTML = `
            <span class="protocol-icon">${mod.icon}</span>
            <h3 class="protocol-name">${mod.name}</h3>
            <div class="protocol-tagline">${mod.tagline}</div>
            <p class="protocol-desc">${mod.desc}</p>
            <div class="protocol-items">
                ${mod.items.map(item => `<div class="protocol-item">${item}</div>`).join('')}
            </div>
            <div class="protocol-expand">
                <span class="protocol-expand-arrow">▸</span> Explore module
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });

        grid.appendChild(card);
    });
}

// ═══ SKILL TREE ═══
function initSkillTree() {
    const container = document.getElementById('skill-tree-container');
    if (!container) return; // Guard clause
    const tabs = document.querySelectorAll('.skill-tab');
    const unlockedLevels = loadState('skill_tree', {});

    function renderPillar(pillarId) {
        const pillar = SKILL_TREE.pillars.find(p => p.id === pillarId);
        if (!pillar) return;

        const pillarUnlocked = unlockedLevels[pillarId] || [1]; // Level 1 always unlocked

        container.innerHTML = `
            < div class="skill-pillar-header" >
                <div class="skill-pillar-name">${pillar.name}</div>
                <div class="skill-pillar-anatomy">${pillar.target_anatomy.join(' · ')}</div>
            </div >
            <div class="skill-levels">
                ${pillar.levels.map(level => {
            const isCompleted = pillarUnlocked.includes(level.level) && pillarUnlocked.includes(level.level + 1);
            const isUnlocked = pillarUnlocked.includes(level.level);
            const isLevelCompleted = level.level < Math.max(...pillarUnlocked);
            const status = isLevelCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';
            const badgeText = isLevelCompleted ? '✓ MASTERED' : isUnlocked ? 'UNLOCKED' : 'LOCKED';

            return `
                        <div class="skill-level animate-in" data-level="${level.level}" data-pillar="${pillarId}">
                            <div class="skill-level-dot ${status}"></div>
                            <div class="skill-level-card">
                                <div class="skill-level-header">
                                    <span class="skill-level-num">LEVEL ${level.level}</span>
                                    <span class="skill-level-badge ${status}">${badgeText}</span>
                                </div>
                                <div class="skill-level-name">${level.name}</div>
                                <div class="skill-level-standard">Standard: ${level.standard}</div>
                                <div class="skill-level-cues">
                                    ${level.cues.map(c => `<span class="skill-cue">${c}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;

        // Click dots to toggle completion
        container.querySelectorAll('.skill-level-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const el = dot.closest('.skill-level');
                const level = parseInt(el.dataset.level);
                const pid = el.dataset.pillar;

                if (!unlockedLevels[pid]) unlockedLevels[pid] = [1];

                if (unlockedLevels[pid].includes(level)) {
                    // Complete this level — unlock next
                    if (!unlockedLevels[pid].includes(level + 1) && level < 10) {
                        unlockedLevels[pid].push(level + 1);
                    }
                }

                saveState('skill_tree', unlockedLevels);
                renderPillar(pid);
                setTimeout(initScrollAnimations, 50);
            });
        });

        setTimeout(initScrollAnimations, 50);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderPillar(tab.dataset.pillar);
        });
    });

    renderPillar('push_planche');
}

// ═══ DECISION ENGINE ═══
function initDecisionEngine() {
    const container = document.getElementById('engine-container');
    const tabs = document.querySelectorAll('.engine-tab');
    if (!container) return; // Guard clause

    function renderEngine(engineId) {
        // Ensure MENTAL_MODELS exists or provide fallback
        if (typeof MENTAL_MODELS === 'undefined') {
            console.error("MENTAL_MODELS not defined");
            container.innerHTML = "<div class='error'>Error loading Decision Engine data.</div>";
            return;
        }

        const engine = MENTAL_MODELS.algorithms.find(a => a.id === engineId);
        if (!engine) return;

        container.innerHTML = `
            <div class="engine-card">
                <div class="engine-title">${engine.name}</div>
                <div class="engine-purpose">${engine.purpose}</div>
                ${engine.steps.map(step => {
            if (step.type === 'result') {
                return `
                            <div class="engine-step">
                                <div class="engine-step-header">
                                    <div class="engine-step-num">${step.step}</div>
                                    <div class="engine-step-prompt">${step.prompt}</div>
                                </div>
                                <div class="engine-result" id="engine-result">
                                    <div class="engine-result-label">THE VERDICT</div>
                                    <div class="engine-result-value" id="engine-result-value"></div>
                                </div>
                            </div>
                        `;
            }

            const inputEl = step.type === 'textarea'
                ? `<textarea class="engine-input" id="engine-input-${step.step}" placeholder="${step.placeholder || ''}" rows="3"></textarea>`
                : `<input type="${step.type === 'number' ? 'number' : 'text'}" class="engine-input" id="engine-input-${step.step}" placeholder="${step.placeholder || ''}" ${step.type === 'number' ? 'min="0" max="100"' : ''}>`;

            return `
                        <div class="engine-step">
                            <div class="engine-step-header">
                                <div class="engine-step-num">${step.step}</div>
                                <div class="engine-step-prompt">${step.prompt}</div>
                            </div>
                            ${inputEl}
                        </div>
                    `;
        }).join('')
            }
        <div style="text-align: center;">
            <button class="engine-btn" id="engine-run">
                ⚡ Run The Filter
            </button>
        </div>
            </div >
            `;

        // Run button
        const runBtn = document.getElementById('engine-run');
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                const resultEl = document.getElementById('engine-result');
                const resultValue = document.getElementById('engine-result-value');
                if (!resultValue) return;

                if (engineId === 'essentialist') {
                    const score = parseInt(document.getElementById('engine-input-1')?.value) || 0;
                    resultValue.textContent = score >= 90 ? 'HELL YES — EXECUTE.' : 'NO. PROTECT YOUR TIME.';
                    resultValue.style.color = score >= 90 ? 'var(--gold)' : 'var(--danger)';
                } else if (engineId === 'inversion') {
                    const failures = document.getElementById('engine-input-2')?.value || '';
                    if (failures.trim()) {
                        const items = failures.split('\n').filter(l => l.trim()).map(l => '✓ ' + l.trim()).join('\n');
                        resultValue.innerHTML = `YOUR NON - NEGOTIABLES: <br><span style="font-size: 1rem; font-family: var(--font-body); color: var(--signal-muted); white-space: pre-line; display: block; margin-top: 12px; text-align: left;">${items.replace(/✓/g, '<span style="color: var(--gold)">▸</span>')}</span>`;
                    } else {
                        resultValue.textContent = 'List what guarantees failure first.';
                    }
                } else if (engineId === 'second-order') {
                    const first = document.getElementById('engine-input-1')?.value || '';
                    const second = document.getElementById('engine-input-2')?.value || '';
                    const third = document.getElementById('engine-input-3')?.value || '';
                    resultValue.innerHTML = `<div style="text-align: left; font-size: 0.9rem;">
                <div style="margin-bottom: 12px"><span style="color: var(--gold)">1st Order:</span> ${first || '—'}</div>
                <div style="margin-bottom: 12px"><span style="color: var(--gold)">2nd Order:</span> ${second || '—'}</div>
                <div><span style="color: var(--gold)">3rd Order:</span> ${third || '—'}</div>
            </div>`;
                }

                if (resultEl) {
                    resultEl.classList.add('show');
                }
            });
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderEngine(tab.dataset.engine);
        });
    });

    renderEngine('inversion');
}

// ═══ 30-DAY RESET ═══
function initReset() {
    // Placeholder for future logic
}

// ═══ DAILY PROTOCOL ═══
function initDaily() {
    // Placeholder for future logic
}


// ═══ KNOWLEDGE ARSENAL DATA ═══
const BLUEPRINT_PHASES = {
    DEFENSE: "BIOLOGICAL DEFENSE",
    ENVIRONMENT: "ENVIRONMENTAL CONTROL",
    CLARITY: "MENTAL CLARITY",
    EXECUTION: "EXECUTION"
};

const RED_LIST_DATA = [
    { name: "Canola Oil", type: "Seed Oil", status: "TOXIC", reason: "Oxidative stress, inflammation." },
    { name: "Sunflower Oil", type: "Seed Oil", status: "TOXIC", reason: "High Omega-6 linoleic acid." },
    { name: "Soybean Oil", type: "Seed Oil", status: "TOXIC", reason: "Endocrine disruptor." },
    { name: "High Fructose Corn Syrup", type: "Sugar", status: "TOXIC", reason: "Fatty liver, insulin resistance." },
    { name: "Sodium Nitrate", type: "Preservative", status: "TOXIC", reason: "Carcinogenic precursor." },
    { name: "Red 40", type: "Dye", status: "TOXIC", reason: "Neurotoxin, hyperactivity." },
    { name: "Aspartame", type: "Sweetener", status: "AVOID", reason: "Gut biome disruption." },
    { name: "Fluoride", type: "Neurotoxin", status: "FILTER", reason: "Calcifies pineal gland." },
    { name: "Atrazine", type: "Pesticide", status: "TOXIC", reason: "Severe endocrine disruptor." }
];

const SWAP_LIST_DATA = [
    { category: "Deodorant", toxic: "Aluminum / Parabens", safe: "Magnesium / Charcoal", status: "PENDING" },
    { category: "Toothpaste", toxic: "Fluoride / Triclosan", safe: "Hydroxyapatite", status: "PENDING" },
    { category: "Sunscreen", toxic: "Oxybenzone", safe: "Zinc Oxide (Non-Nano)", status: "PENDING" },
    { category: "Cookware", toxic: "Teflon (PTFE)", safe: "Cast Iron / Stainless", status: "PENDING" },
    { category: "Water", toxic: "Tap (Chlorine/Fluoride)", safe: "Reverse Osmosis + Minerals", status: "PENDING" },
    { category: "Clothing", toxic: "Polyester / Nylon", safe: "Cotton / Linen / Wool", status: "PENDING" }
];

// Re-mapping Library Content to 4 Phases
const LIBRARY_CONTENT = [
    // PHASE 1: BIOLOGICAL DEFENSE
    {
        id: "red-list",
        category: BLUEPRINT_PHASES.DEFENSE,
        title: "The Red List",
        desc: "The toxins you must eliminate. Ingredients, Materials, Frequencies.",
        icon: "☠️",
        isInteractive: true,
        bg: "var(--void)",
        content: `<h3>Interactive Module Loaded Below</h3>`
    },
    {
        id: "swap-list",
        category: BLUEPRINT_PHASES.DEFENSE,
        title: "The Endocrine Siege (Swap List)",
        desc: "Tactical replacement of estrogenic household items.",
        icon: "🛡️",
        isInteractive: true,
        bg: "var(--void)",
        content: `<h3>Interactive Module Loaded Below</h3>`
    },
    {
        id: "nutrition-framework",
        category: BLUEPRINT_PHASES.DEFENSE,
        title: "The Nutritional Framework",
        desc: "Fuel vs Poison. Safe sources of Bioavailable Protein.",
        icon: "🥩",
        bg: "var(--void)",
        content: `...` // (Content remains or is loaded dynamically)
    },

    // PHASE 2: ENVIRONMENTAL CONTROL
    {
        id: "light-hygiene",
        category: BLUEPRINT_PHASES.ENVIRONMENT,
        title: "Light Hygiene Protocol",
        desc: "Mastering the Circadian signaling. Sunrise, UVA, Sunset.",
        icon: "☀️",
        bg: "var(--void)",
        content: `
            <h3>Morning: The Anchor</h3>
            <p>View sunlight within 30m of waking. 10,000 lux minimum.</p>
            <h3>Evening: The Shield</h3>
            <p><strong>Sunset:</strong> View it to signal cortisol drop.</p>
            <p><strong>Post-Sunset:</strong> All overhead lights OFF. Red lenses ON.</p>
            `
    },
    {
        id: "system-reset",
        category: BLUEPRINT_PHASES.ENVIRONMENT,
        title: "The System Reset",
        desc: "Thermal contrast. Light hygiene. Grounding.",
        icon: "❄️",
        bg: "var(--void)",
        content: `...`
    },

    // PHASE 3: MENTAL CLARITY
    {
        id: "mental-models",
        category: BLUEPRINT_PHASES.CLARITY,
        title: "The Decision Algorithms",
        desc: "Inversion. Second Order Thinking. Essentialism.",
        icon: "🧠",
        bg: "var(--void)",
        content: `...`
    },
    {
        id: "hormone-map",
        category: BLUEPRINT_PHASES.CLARITY,
        title: "The 28-Day Hormone Map",
        desc: "Navigating the Infradian Rhythm (Feminine Mode).",
        icon: "🌑",
        bg: "var(--void)",
        content: `...`
    },

    // PHASE 4: EXECUTION
    {
        id: "day-1",
        category: BLUEPRINT_PHASES.EXECUTION,
        title: "The Day 1 Protocol",
        desc: "The 24-hour blueprint. Ignition. Momentum. Restoration.",
        icon: "⚡",
        bg: "var(--void)",
        content: `...`
    },
    {
        id: "bio-audit",
        category: BLUEPRINT_PHASES.EXECUTION,
        title: "The Biological Audit",
        desc: "Bloodwork benchmarks and DNA analysis.",
        icon: "🧬",
        bg: "var(--void)",
        content: `...`
    },
    {
        id: "training-standards",
        category: BLUEPRINT_PHASES.EXECUTION,
        title: "The Strength Standards",
        desc: "Gravity is the constant. Your body is the variable.",
        icon: "🏋️",
        bg: "var(--void)",
        content: `...`
    }
];


// ═══ LIBRARY LOGIC ═══
// ═══ MODULE LIBRARY SYSTEM ═══
function initLibrary() {
    const moduleManager = new ModuleManager();
    const pdfManager = new PDFManager();
    const modulesGrid = document.getElementById('modules-grid');
    const searchInput = document.getElementById('module-search');
    const filterChips = document.querySelectorAll('.filter-chip');
    const emptyState = document.getElementById('empty-state');

    let currentFilter = 'all';
    let currentSearch = '';

    // Render modules
    function renderModules(modules) {
        if (modules.length === 0) {
            modulesGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        modulesGrid.innerHTML = modules.map(module => {
            const progress = moduleManager.getProgress(module.id);
            const isLocked = !moduleManager.isUnlocked(module.id);
            const isCompleted = moduleManager.isCompleted(module.id);

            return `
                <div class="module-card ${isLocked ? 'locked' : ''}" data-module-id="${module.id}">
                    <div class="module-header">
                        <div class="module-meta">
                            <div class="module-phase">PHASE ${module.phase} • MODULE ${module.number}</div>
                            <h3 class="module-title">${module.title}</h3>
                        </div>
                        <span class="module-category">${module.category}</span>
                    </div>
                    
                    <p class="module-description">${module.description}</p>
                    
                    <div class="module-objectives">
                        <h4>You'll Learn:</h4>
                        <ul>
                            ${module.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>

                    ${!isLocked ? `
                        <div class="module-progress">
                            <div class="progress-label">
                                <span>${isCompleted ? 'Completed' : progress.progress > 0 ? 'In Progress' : 'Not Started'}</span>
                                <span>${progress.progress || 0}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${progress.progress || 0}%"></div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="module-footer">
                        <div class="module-duration">
                            <span>⏱️</span>
                            <span>${module.duration} min</span>
                        </div>
                        <div class="module-actions">
                            ${!isLocked ? `
                                ${isCompleted ? `
                                    <button class="btn-module-action btn-module-secondary" onclick="reviewModule('${module.id}')">
                                        REVIEW
                                    </button>
                                ` : progress.progress > 0 ? `
                                    <button class="btn-module-action" onclick="continueModule('${module.id}')">
                                        CONTINUE
                                    </button>
                                ` : `
                                    <button class="btn-module-action" onclick="startModule('${module.id}')">
                                        START
                                    </button>
                                `}
                                <button class="btn-pdf" onclick="viewModulePDF('${module.id}')">
                                    📄 PDF
                                </button>
                            ` : `
                                <button class="btn-module-action" disabled>LOCKED</button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Filter and search logic
    function updateModules() {
        let modules = moduleManager.getAllModules();

        // Apply search
        if (currentSearch) {
            modules = moduleManager.searchModules(currentSearch);
        }

        // Apply filter
        if (currentFilter !== 'all') {
            modules = modules.filter(m => m.category === currentFilter);
        }

        renderModules(modules);
    }

    // Search handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            updateModules();
        });

        // Keyboard shortcut: Ctrl+K to focus search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Filter chips handler
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            updateModules();
        });
    });

    // Global functions for module actions
    window.startModule = function (moduleId) {
        moduleManager.startModule(moduleId);
        updateModules();
        showModuleContent(moduleId);
    };

    window.continueModule = function (moduleId) {
        showModuleContent(moduleId);
    };

    window.reviewModule = function (moduleId) {
        showModuleContent(moduleId);
    };

    window.viewModulePDF = function (moduleId) {
        const module = moduleManager.getModule(moduleId);
        if (module) {
            pdfManager.viewPDF(module.pdfUrl, module.title);
        }
    };

    window.completeCurrentModule = function (moduleId) {
        moduleManager.completeModule(moduleId);
        updateModules();
    };

    function showModuleContent(moduleId) {
        const module = moduleManager.getModule(moduleId);
        if (!module) return;

        // Create simple module viewer
        const viewer = document.createElement('div');
        viewer.className = 'pdf-viewer-modal visible';
        viewer.innerHTML = `
            <div class="pdf-viewer-container">
                <div class="pdf-viewer-header">
                    <h3>${module.title}</h3>
                    <div class="pdf-viewer-actions">
                        <button class="btn-pdf-download" onclick="viewModulePDF('${module.id}')">
                            View Full PDF
                        </button>
                        <button class="btn-complete-module">✓ Mark Complete</button>
                        <button class="btn-pdf-close">✕</button>
                    </div>
                </div>
                <div class="pdf-viewer-body">
                    <div style="padding: 40px; color: var(--signal); max-width: 800px; margin: 0 auto;">
                        <h2>${module.title}</h2>
                        <p style="color: var(--signal-dim); margin-bottom: 32px;">${module.description}</p>
                        
                        <h3 style="color: var(--gold); margin-top: 32px;">Learning Objectives:</h3>
                        <ul style="line-height: 2;">
                            ${module.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>

                        <div style="margin-top: 48px; padding: 24px; background: rgba(212, 175, 55, 0.1); border-left: 4px solid var(--gold); border-radius: 8px;">
                            <p style="margin: 0; color: var(--gold);"><strong>💡 Pro Tip:</strong> Download the full PDF for detailed protocols and implementation guides.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(viewer);

        // Update progress
        const currentProgress = moduleManager.getProgress(moduleId).progress;
        if (currentProgress < 50) {
            moduleManager.updateProgress(moduleId, 50);
        }

        // Complete button
        viewer.querySelector('.btn-complete-module').addEventListener('click', () => {
            moduleManager.completeModule(moduleId);
            viewer.remove();
            updateModules();
        });

        // Close button
        viewer.querySelector('.btn-pdf-close').addEventListener('click', () => {
            viewer.remove();
        });
    }

    // Initial render
    updateModules();

    // Make managers available globally for debugging
    if (window.location.search.includes('debug=true')) {
        window.clarityDebug = window.clarityDebug || {};
        window.clarityDebug.moduleManager = moduleManager;
        window.clarityDebug.pdfManager = pdfManager;
    }
}


function initSwapList() {
    const container = document.getElementById('swap-list-items');
    if (!container) return;

    container.innerHTML = '';
    SWAP_LIST_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `swap-item ${item.status === 'DONE' ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="swap-info">
                <span class="swap-cat">${item.category}</span>
                <span class="swap-details"><span class="bad">❌ ${item.toxic}</span> → <span class="good">✅ ${item.safe}</span></span>
            </div>
            <button class="btn-swap-check">${item.status === 'DONE' ? 'DONE' : 'SWAP'}</button>
            `;

        div.querySelector('.btn-swap-check').addEventListener('click', function () {
            if (item.status === 'PENDING') {
                item.status = 'DONE';
                this.textContent = 'DONE';
                div.classList.add('completed');
            } else {
                item.status = 'PENDING';
                this.textContent = 'SWAP';
                div.classList.remove('completed');
            }
        });

        container.appendChild(div);
    });
}

function initRedList() {
    const searchInput = document.getElementById('red-list-search');
    const resultsContainer = document.getElementById('red-list-results');

    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        resultsContainer.innerHTML = ''; // Clear results

        if (query.length < 2) return;

        const matches = RED_LIST_DATA.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div class="red-list-item">No matches found.</div>';
            return;
        }

        matches.forEach(item => {
            const div = document.createElement('div');
            div.className = `red-list-item ${item.status === 'TOXIC' ? 'banned' : 'clean'}`;
            div.innerHTML = `
            <span><strong>${item.name}</strong> (${item.type})</span>
            <span>${item.status}</span>
            `;
            resultsContainer.appendChild(div);
        });
    });
}

function initThermalTracker() {
    // Draws simple progress rings for 11/60 Rule
    const drawRing = (canvasId, color, progress, label) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const radius = 24;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background Ring
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.stroke();

        // Progress Ring
        const startAngle = -0.5 * Math.PI;
        const endAngle = startAngle + (2 * Math.PI * progress);
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#888';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 4);
    };

    // Simulate 75% Cold, 40% Heat
    drawRing('cold-ring', '#00bcd4', 0.75, 'COLD');
    drawRing('heat-ring', '#ff5722', 0.40, 'HEAT');
}


// Modal Logic
function closeModal() {
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('hidden'), 300); // Wait for transition
}


// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initNav(); // Handles Dashboard Init
    initProtocols();
    initSkillTree();
    initDecisionEngine(); // Restored
    // initReset(); // Restored if needed
    // initDaily(); // Restored if needed
    // Init Knowledge Arsenal
    initLibrary();
    initThermalTracker(); // 11/60 Rule Widget

    // Init Logistics & Contextual
    // initLogistics();
    initContextualGuides();

    // === PERFORMANCE ENHANCEMENTS ===
    // Initialize lazy loading
    new LazyLoader();

    // Initialize smooth scroll
    SmoothScroll.init();

    // Add scroll progress indicator
    ScrollProgress.init();

    // Add haptic feedback to buttons
    HapticFeedback.addToElements('.btn, .ops-btn, .skill-level-dot', 'light');
    HapticFeedback.addToElements('.hero-cta', 'medium');

    // Preload critical assets
    LoadingOptimizer.preloadCriticalImages();

    // Log performance metrics (dev mode)
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => PerformanceMonitor.logPerformanceMetrics(), 2000);
        PerformanceMonitor.initFPSCounter();
    }

    // Delay scroll animations to let DOM render
    setTimeout(initScrollAnimations, 100);

    // ═══ NEW FEATURES INITIALIZATION ═══

    // Initialize PWA (Progressive Web App)
    const pwa = new PWAManager();
    const pushManager = new PushNotificationManager();
    const offlineManager = new OfflineManager();

    // Initialize Analytics (replace with your actual GA4 ID)
    const analytics = new AnalyticsManager('G-XXXXXXXXXX');
    const eventTracker = new EventTracker();
    const behaviorHeatmap = new BehaviorHeatmap();

    // Track initial page view
    analytics.trackPageView(window.location.pathname, document.title);

    // Track first visit
    const firstVisit = localStorage.getItem('clarity_first_visit');
    if (!firstVisit) {
        localStorage.setItem('clarity_first_visit', Date.now());
        analytics.trackUserRetention(0);
    } else {
        const daysSinceFirst = Math.floor((Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24));
        analytics.trackUserRetention(daysSinceFirst);
    }

    // Initialize social features
    const leaderboard = new Leaderboard();
    const challenges = new CommunityChallenges();

    // Optional: Request push notification permission
    // Uncomment if you want to enable push notifications
    // setTimeout(() => pushManager.requestPermission(), 5000);

    // Optional: Setup protocol reminders
    // pushManager.setupProtocolReminders();

    // Make services globally available for debugging
    if (window.location.search.includes('debug=true')) {
        window.clarityDebug = {
            analytics,
            eventTracker,
            behaviorHeatmap,
            pwa,
            pushManager,
            leaderboard,
            challenges
        };
        console.log('🔧 Debug mode enabled. Access services via window.clarityDebug');
    }
});

function initContextualGuides() {
    // Determine modal elements
    const modal = document.getElementById('reader-modal');
    const modalTitle = document.getElementById('reader-title');
    const modalBody = document.getElementById('reader-body');

    // Bind all buttons with class .read-guide-btn
    document.querySelectorAll('.read-guide-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const guideId = e.target.dataset.guide;
            const content = LIBRARY_CONTENT.find(c => c.id === guideId);

            if (content && modal) {
                modalTitle.textContent = content.title;
                modalBody.innerHTML = content.content;
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.add('visible'), 10);
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   PDF GUIDE LAUNCHER
   ═══════════════════════════════════════════════════════════════ */

// Open a PDF guide in a new window for printing/downloading
function openPDFGuide(guideFileName) {
    const guidePath = `guides/${guideFileName}`;
    window.open(guidePath, '_blank');
}

// Make function globally available
window.openPDFGuide = openPDFGuide;
