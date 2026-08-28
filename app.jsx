// ─────────────────────────────────────────────────────────────
// THE SELF-LED ROADMAP — Caitlin Pieters Studio
// Cloud → Rainbow (Clarity, Visibility, Connection, Flow) → Gold
// Ends in an AI-generated roadmap: top 3 priorities + the one
// thing to focus on first, in Cait's voice, styled like her own
// Website Strategy Roadmap deck.
// ─────────────────────────────────────────────────────────────

const { useState, useEffect } = React;

const INK = "#18100F";
const PAPER = "#FAFAF8";
const PINK = "#FA348C";
const STONE = "#8C8578";
const LINE = "#DFDACE";

const BOOKING_URL = "https://www.caitlinpieters.com/booking-calendar/website-strategy-roadmap-session";

const CloudIcon = () => (
<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
<path
d="M14 32c-4.4 0-8-3.4-8-7.6 0-3.8 2.9-6.9 6.7-7.5C13.6 12.8 17.7 10 22.4 10c5.6 0 10.2 4 11 9.2 3.8.5 6.6 3.6 6.6 7.3 0 4.1-3.5 7.5-7.9 7.5H14z"
stroke={PINK}
strokeWidth="1.6"
fill="none"
/>
</svg>
);

const RainbowIcon = () => (
<svg width="52" height="34" viewBox="0 0 60 40" fill="none">
<path d="M2 38a28 28 0 0 1 56 0" stroke={PINK} strokeWidth="1.4" fill="none" />
<path d="M10 38a20 20 0 0 1 40 0" stroke={PINK} strokeWidth="1.4" fill="none" opacity="0.7" />
<path d="M18 38a12 12 0 0 1 24 0" stroke={PINK} strokeWidth="1.4" fill="none" opacity="0.45" />
</svg>
);

const GoldIcon = () => (
<svg width="40" height="40" viewBox="0 0 48 48" fill="none">
<path
d="M24 6 L27 20 L41 24 L27 28 L24 42 L21 28 L7 24 L21 20 Z"
stroke={PINK}
strokeWidth="1.6"
fill="none"
strokeLinejoin="round"
/>
</svg>
);

// Textarea with optional voice-to-text. Falls back silently to typing only
// on browsers without SpeechRecognition support (notably Safari/iOS).
const BANDS = [
{
key: "clarity",
label: "Clarity",
sub: "How your business is positioned and communicated.",
questions: [
"Is it immediately obvious what you do and who you help?",
"Does your homepage quickly orient people around what you do before asking them to go deeper into your story?",
"Are your offers easy to find, understand, and tell apart?",
"Does your website reflect the business you run today, or the one you ran two years ago?",
"Does what makes you different come through strongly and early?",
"Are you attracting the right clients?",
],
},
{
key: "visibility",
label: "Visibility",
sub: "How people discover your business.",
questions: [
"Can people actually find your business?",
"Is your expertise visible where your ideal clients are already looking?",
"Do warm referrals and word-of-mouth land on a page that converts them?",
"Are there visibility opportunities you're missing?",
"Is your visibility strategy sustainable for your time and energy?",
],
},
{
key: "connection",
label: "Connection",
sub: "How trust and resonance are built.",
questions: [
"Does your website build trust quickly, within the first few seconds?",
"Does the brand feel aligned, human, and recognisably you?",
"Do prospective clients feel guided and understood?",
"Does the overall experience feel cohesive and reassuring?",
],
},
{
key: "flow",
label: "Flow",
sub: "How people move from interest to action.",
questions: [
"Is your website easy to navigate, or is there too much to choose from?",
"Does the enquiry or booking process feel smooth?",
"Is there anywhere visitors might get stuck, lost, or unsure what to do next?",
"Does the experience feel intentional from first click to booked appointment?",
],
},
];

const STEPS = [
"cover",
"journey-intro",
"cloud",
"gold",
"rainbow-intro",
...BANDS.map((b) => b.key),
"generating",
"result",
];

function App() {
const [i, setI] = useState(0);
const [website, setWebsite] = useState("");
const [social, setSocial] = useState("");
const [cloud, setCloud] = useState("");
const [gold, setGold] = useState("");
const [bandAnswers, setBandAnswers] = useState({});
const [roadmap, setRoadmap] = useState(null);
const [notes, setNotes] = useState("");
const [error, setError] = useState("");
const [copied, setCopied] = useState(false);

const stepId = STEPS[i];
const next = () => setI((v) => Math.min(v + 1, STEPS.length - 1));
const back = () => setI((v) => Math.max(v - 1, 0));

useEffect(() => {
window.scrollTo(0, 0);
}, [i]);

useEffect(() => {
window.scrollTo({ top: 0, behavior: "auto" });
}, [i]);

const restart = () => {
setWebsite("");
setSocial("");
setCloud("");
setGold("");
setNotes("");
setBandAnswers({});
setRoadmap(null);
setError("");
setI(0);
};

const generate = async () => {
setI(STEPS.indexOf("generating"));
setError("");
try {
const payload = {
website: website.trim(),
social: social.trim(),
cloud: cloud.trim(),
gold: gold.trim(),
clarity: bandAnswers.clarity?.trim() || "",
visibility: bandAnswers.visibility?.trim() || "",
connection: bandAnswers.connection?.trim() || "",
flow: bandAnswers.flow?.trim() || "",
};

const response = await fetch("/api/roadmap", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});

const data = await response.json();

if (!response.ok) {
setError(data.error || "Something went wrong. Please try again.");
setI(STEPS.indexOf("flow"));
return;
}

setRoadmap(data);
setI(STEPS.indexOf("result"));
} catch (e) {
setError("Something went wrong generating your roadmap. Give it another try.");
setI(STEPS.indexOf("flow"));
}
};

const progLabel = () => {
const bandIdx = BANDS.findIndex((b) => b.key === stepId);
if (bandIdx >= 0) return `${bandIdx + 1} / ${BANDS.length}`;
return "";
};

const roadmapText = () => {
if (!roadmap) return "";
return `WEBSITE STRATEGY ROADMAP

${roadmap.intro}

RECOMMENDED PRIORITIES

01 — ${roadmap.priorities[0]?.title}
${roadmap.priorities[0]?.why}

02 — ${roadmap.priorities[1]?.title}
${roadmap.priorities[1]?.why}

03 — ${roadmap.priorities[2]?.title}
${roadmap.priorities[2]?.why}

START HERE
${roadmap.oneThing}

NEXT STEP
${roadmap.nextStep}

---
Generated by Caitlin Pieters Studio
www.caitlinpieters.com`;
};

const copyToClipboard = async () => {
if (!roadmap) return;
try {
await navigator.clipboard.writeText(roadmapText());
setCopied(true);
setTimeout(() => setCopied(false), 2200);
} catch (err) {
// Clipboard permissions can fail in some browsers — fall back to
// selecting the textarea so the person can still copy manually.
const el = document.getElementById("roadmapTextarea");
if (el) {
el.focus();
el.select();
}
}
};

const downloadPDF = () => {
if (!roadmap || !window.jspdf) return;
const { jsPDF } = window.jspdf;
const doc = new jsPDF({ unit: "pt", format: "a4" });
const marginX = 56;
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const maxWidth = pageWidth - marginX * 2;
let y = 72;

const pinkRGB = [250, 52, 140];
const inkRGB = [24, 16, 15];
const stoneRGB = [140, 133, 120];

const checkPageBreak = (neededHeight) => {
if (y + neededHeight > pageHeight - 64) {
doc.addPage();
y = 72;
}
};
const writeHeading = (text, size = 11) => {
checkPageBreak(size + 18);
doc.setFont("helvetica", "bold");
doc.setFontSize(size);
doc.setTextColor(...pinkRGB);
doc.text(text, marginX, y);
y += size + 12;
};
const writeBody = (text, size = 11) => {
doc.setFont("helvetica", "normal");
doc.setFontSize(size);
doc.setTextColor(...inkRGB);
const lines = doc.splitTextToSize(text || "", maxWidth);
lines.forEach((line) => {
checkPageBreak(size + 6);
doc.text(line, marginX, y);
y += size + 6;
});
y += 12;
};

doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(...inkRGB);
doc.text("Website Strategy Roadmap", marginX, y);
y += 36;

writeBody(roadmap.intro, 11.5);

writeHeading("RECOMMENDED PRIORITIES", 12);
roadmap.priorities.forEach((p, idx) => {
writeHeading(`${String(idx + 1).padStart(2, "0")} — ${p.title}`, 12);
doc.setTextColor(...inkRGB);
writeBody(p.why);
});

writeHeading("START HERE", 12);
writeBody(roadmap.oneThing);

writeHeading("NEXT STEP", 12);
writeBody(roadmap.nextStep);

y += 8;
checkPageBreak(30);
doc.setFont("helvetica", "italic");
doc.setFontSize(9.5);
doc.setTextColor(...stoneRGB);
doc.text("Generated by Caitlin Pieters Studio — www.caitlinpieters.com", marginX, y);

doc.save("Website-Strategy-Roadmap.pdf");
};

return (
<div style={styles.shell}>
<style>{css}</style>
<div style={styles.stage}>
{!["cover", "generating", "result"].includes(stepId) && (
<div style={styles.topBar}>
<button style={styles.backBtn} onClick={back}>← Back</button>
{progLabel() && <span style={styles.progLabel}>{progLabel()}</span>}
</div>
)}

{/* COVER */}
{stepId === "cover" && (
<div className="fade">
<div style={styles.eyebrowDash}>CLOUD → RAINBOW → GOLD</div>
<h1 style={styles.coverTitle}>Website Strategy Roadmap</h1>
<p style={styles.body}>
A self-led way to step back, look at where your business is now, where you want it to go next, and what deserves your attention in between.
</p>
<p style={styles.body}>
You'll work through my Cloud → Rainbow → Gold framework and finish with three personalised priorities to help you see where the strongest opportunities are right now.
</p>
<p style={styles.hint}>Takes around 10 minutes.</p>

<label style={styles.fieldLabel}>Your website</label>
<input
style={styles.textInput}
type="text"
placeholder="e.g. www.yourbusiness.com"
value={website}
onChange={(e) => setWebsite(e.target.value)}
/>

<label style={{ ...styles.fieldLabel, marginTop: 22 }}>
A social profile you use most for your business <span style={styles.fieldOptional}>(optional)</span>
</label>
<input
style={styles.textInput}
type="text"
placeholder="e.g. LinkedIn or Instagram profile link"
value={social}
onChange={(e) => setSocial(e.target.value)}
/>

<p style={{ ...styles.hint, marginTop: 20 }}>
Your website and social links help shape the personalised recommendations at the end.
</p>
<button style={styles.primaryBtn} onClick={next}>Begin →</button>
</div>
)}

{/* JOURNEY INTRO — Cloud, Rainbow, Gold explained together as one story */}
{stepId === "journey-intro" && (
<div className="fade">
<div style={styles.eyebrowDash}>THE FRAMEWORK</div>
<h2 style={styles.title}>
The Cloud, the <span style={styles.pinkItalic}>Rainbow</span>, and the Gold.
</h2>
<p style={styles.body}>
A simple way to step back and see where your business is now, where you want it to
go next, and what deserves your attention in between.
</p>

<div style={styles.journey}>
<div style={styles.journeyStep}>
<CloudIcon />
<div style={styles.journeyLabel}>THE CLOUD</div>
<div style={styles.journeyCaption}>Where you are now — what feels out of step, unclear or ready to change.</div>
</div>

<div style={styles.journeyConnector}>
<div style={styles.journeyLine} />
<div style={styles.journeyArrow}>↓</div>
</div>

<div style={styles.journeyStep}>
<RainbowIcon />
<div style={styles.journeyLabel}>THE RAINBOW</div>
<div style={styles.journeyCaption}>
Clarity, Visibility, Connection and Flow — the four lenses we'll use to uncover the opportunities in between.
</div>
</div>

<div style={styles.journeyConnector}>
<div style={styles.journeyLine} />
<div style={styles.journeyArrow}>↓</div>
</div>

<div style={styles.journeyStep}>
<GoldIcon />
<div style={styles.journeyLabel}>THE GOLD</div>
<div style={styles.journeyCaption}>Where you're heading — the business and online presence you want to grow into.</div>
</div>
</div>

<button style={styles.primaryBtn} onClick={next}>Start with the Cloud →</button>
</div>
)}

{/* CLOUD PROMPT */}
{stepId === "cloud" && (
<div className="fade">
<div style={styles.eyebrowDash}>THE CLOUD</div>
<h2 style={styles.title}>What feels out of step with where your business is now?</h2>
<p style={styles.body}>
Think about the business as a whole — your website, messaging, offers, visibility, client experience and the way you're currently showing up.
</p>
<p style={styles.body}>
What has changed? What no longer feels like the best reflection of where the business is now? What are you starting to notice needs to move with you?
</p>
<textarea
value={cloud}
onChange={(e) => setCloud(e.target.value)}
rows={4}
placeholder="Write whatever comes to mind…"
style={styles.textarea}
/>
<button style={styles.primaryBtn} onClick={next}>Continue →</button>
</div>
)}

{/* GOLD PROMPT */}
{stepId === "gold" && (
<div className="fade">
<div style={styles.eyebrowDash}>THE GOLD</div>
<h2 style={styles.title}>Imagine your business a year from now, having grown into its next version. What does that look like?</h2>
<p style={styles.body}>
Think about the work you're doing, the clients you're working with, what you're known for, how the business is growing, and how you want it to feel and work.
</p>
<textarea
value={gold}
onChange={(e) => setGold(e.target.value)}
rows={4}
placeholder="Write whatever comes to mind…"
style={styles.textarea}
/>
<button style={styles.primaryBtn} onClick={next}>Continue →</button>
</div>
)}

{/* RAINBOW INTRO — brief bridge into the four bands */}
{stepId === "rainbow-intro" && (
<div className="fade">
<div style={styles.eyebrowDash}>THE RAINBOW</div>
<h2 style={styles.title}>This is where we find the route forward.</h2>
<p style={styles.body}>
We're going to look at your business through four lenses — Clarity, Visibility,
Connection and Flow.
</p>
<p style={styles.body}>
Don't rush these. The more specific you are about what you're noticing, the more
useful and personalised your roadmap will be at the end.
</p>
<p style={styles.body}>
You don't need to answer every question individually. Use them to notice what
feels most relevant to your business right now.
</p>

<div style={styles.rainbowPath}>
<div style={styles.rainbowLens}>CLARITY</div>
<div style={styles.rainbowArrow}>→</div>
<div style={styles.rainbowLens}>VISIBILITY</div>
<div style={styles.rainbowArrow}>→</div>
<div style={styles.rainbowLens}>CONNECTION</div>
<div style={styles.rainbowArrow}>→</div>
<div style={styles.rainbowLens}>FLOW</div>
</div>

<button style={{ ...styles.primaryBtn, marginTop: 34 }} onClick={next}>Start with Clarity →</button>
</div>
)}

{/* BANDS */}
{BANDS.map(
(b) =>
stepId === b.key && (
<div className="fade" key={b.key}>
<div style={styles.eyebrowDash}>THE RAINBOW — {b.label.toUpperCase()}</div>
{b.key === "clarity" ? (
<>
<h2 style={styles.title}>{b.sub}</h2>
<h3 style={styles.subheading}>What needs to become clearer as you move towards the Gold you described?</h3>

<div style={styles.thinkAbout}>
<p style={styles.thinkLabel}>Think about:</p>
<ul style={styles.focusList}>
<li style={styles.focusItem}><strong>Positioning</strong> — As you move towards the Gold you described, how do you want people to think about your business and the work you do? Does the title or label you currently use still capture the full value of what you actually bring?</li>
<li style={styles.focusItem}><strong>Offers</strong> — Which offers do you want to lead with, and is it clear who each one is for and how they're different?</li>
<li style={styles.focusItem}><strong>Differentiation</strong> — What do clients consistently value or reflect back to you about the way you work? Is there something there that makes you different, but that you haven't fully articulated or made visible yet?</li>
<li style={styles.focusItem}><strong>Who it's for</strong> — How specific are you being about the people your work is really for? Are you trying to speak broadly, or could being more specific actually help the right people recognise themselves more quickly?</li>
</ul>
</div>
</>
) : b.key === "visibility" ? (
<>
<h2 style={styles.title}>How the right people discover, notice and understand your expertise.</h2>
<h3 style={styles.subheading}>What would need to change for the right people to find and recognise you more readily?</h3>

<div style={styles.thinkAbout}>
<p style={styles.thinkLabel}>Think about:</p>
<ul style={styles.focusList}>
<li style={styles.focusItem}><strong>What you're known for</strong> — Is the work you most want to be doing actually the work you're most visible for?</li>
<li style={styles.focusItem}><strong>Discoverability</strong> — If someone was actively looking for the kind of help you offer, where would they realistically find you?</li>
<li style={styles.focusItem}><strong>Relationships & referrals</strong> — Which people, networks, collaborations or referral routes already bring the right opportunities, and where could you build on that?</li>
<li style={styles.focusItem}><strong>Content & expertise</strong> — Are you making enough of your thinking, experience and point of view visible for people to understand the depth of what you do?</li>
<li style={styles.focusItem}><strong>Sustainable visibility</strong> — Which ways of showing up actually suit you and the way you want to run your business?</li>
<li style={styles.focusItem}><strong>Direct outreach</strong> — Are there people, businesses or opportunities you could approach more directly rather than waiting to be discovered?</li>
</ul>
</div>
</>
) : b.key === "connection" ? (
<>
<h2 style={styles.title}>How trust and connection are built before someone works with you.</h2>
<h3 style={styles.subheading}>What needs to come across for the right person to feel confident choosing you?</h3>

<div style={styles.thinkAbout}>
<p style={styles.thinkLabel}>Think about:</p>
<ul style={styles.focusList}>
<li style={styles.focusItem}><strong>Trust & credibility</strong> — What helps people feel confident in your experience, expertise and ability to deliver?</li>
<li style={styles.focusItem}><strong>Empathy</strong> — Do people get the sense that you really understand them, their world and what matters to them?</li>
<li style={styles.focusItem}><strong>Story</strong> — Is there something about your journey, experience or perspective that helps people understand why you do this work the way you do?</li>
<li style={styles.focusItem}><strong>Your way of working</strong> — What do people need to understand about how you think, work and support clients to know whether you're the right fit for them?</li>
</ul>
</div>
</>
) : b.key === "flow" ? (
<>
<h2 style={styles.title}>{b.sub}</h2>
<h3 style={styles.subheading}>What are you noticing about how easily people can move through your business and take the next step?</h3>

<div style={styles.thinkAbout}>
<p style={styles.thinkLabel}>Think about:</p>
<ul style={styles.focusList}>
<li style={styles.focusItem}><strong>Navigation & usability</strong> — Can people find what they need without having to work it out?</li>
<li style={styles.focusItem}><strong>Client journey</strong> — Is there a clear path from discovering you to understanding your offers and deciding what to do next?</li>
<li style={styles.focusItem}><strong>Enquiry & booking flow</strong> — Is it easy for the right people to enquire, book or buy?</li>
<li style={styles.focusItem}><strong>Next steps</strong> — Are you clear about what you want people to do on each key page?</li>
<li style={styles.focusItem}><strong>Systems & automations</strong> — Are there places where follow-up, onboarding or delivery could feel smoother and more intentional?</li>
</ul>
</div>
</>
) : (
<>
<h2 style={styles.title}>{b.sub}</h2>
<div style={styles.qList}>
{b.questions.map((q, idx) => (
<div key={idx} style={styles.qItem}>{q}</div>
))}
</div>
<p style={{ ...styles.body, marginTop: 22 }}>What stands out to you as you read these?</p>
</>
)}
<textarea
value={bandAnswers[b.key] || ""}
onChange={(e) => setBandAnswers((a) => ({ ...a, [b.key]: e.target.value }))}
rows={4}
placeholder={b.key === "clarity" ? "For example: \"I want to be known more for the strategic side of my work, but I still find myself describing what I do in the same way I did a couple of years ago…\"" : b.key === "visibility" ? "For example: \"Most of my best work still comes through referrals. I'd like to become more visible for the strategic side of what I do, especially on LinkedIn, and I know I'm not really using my email list at the moment.\"" : b.key === "connection" ? "For example: \"People usually understand the value once we've spoken, but I don't think they get the full picture beforehand. My background and the way I work are a big part of why clients choose me, and I'm not really communicating that yet.\"" : b.key === "flow" ? "For example: \"People seem interested, but I have too many different routes to contact me and I'm not sure which one I actually want them to take…\"" : "Write whatever comes up, even if it's just one line…"}
style={styles.textarea}
/>
<button style={styles.primaryBtn} onClick={b.key === "flow" ? generate : next}>
{b.key === "flow" ? "Generate my roadmap →" : "Continue →"}
</button>
{error && b.key === "flow" && <p style={styles.errorText}>{error}</p>}
</div>
)
)}

{/* GENERATING */}
{stepId === "generating" && (
<div className="fade" style={styles.genWrap}>
<div style={styles.eyebrowDash}>BUILDING YOUR ROADMAP</div>
<h2 style={styles.title}>Give me a moment to look at what you've shared…</h2>
<div style={styles.spinner} />
</div>
)}

{/* RESULT */}
{stepId === "result" && roadmap && (
<div className="fade">
<div style={styles.topBar}>
<button style={styles.backBtn} onClick={() => setI(STEPS.indexOf("flow"))}>← Review your answers</button>
</div>
<div style={styles.eyebrowDash}>BIGGEST OPPORTUNITIES</div>
<h2 style={styles.title}>
What I'd <span style={styles.pinkItalic}>focus</span> on next.
</h2>

<div style={styles.priorityLabel}>WHAT I'M NOTICING</div>
<p style={styles.body}>{roadmap.intro}</p>

<div style={styles.priorityLabel}>YOUR THREE PRIORITIES</div>
<div style={styles.priorityList}>
{roadmap.priorities.map((p, idx) => (
<div key={idx} style={styles.priorityRow}>
<div style={styles.priorityNum}>{String(idx + 1).padStart(2, "0")}</div>
<div>
<div style={styles.priorityTitle}>{p.title}</div>
<div style={styles.priorityWhy}>{p.why}</div>
</div>
</div>
))}
</div>

<div style={styles.oneThingBox}>
<div style={styles.priorityLabel}>START HERE</div>
<p style={styles.oneThingText}>{roadmap.oneThing}</p>
</div>

<div style={styles.nextStepBox}>
<div style={styles.priorityLabel}>NEXT STEP</div>
<p style={{ ...styles.body, marginBottom: 20 }}>{roadmap.nextStep}</p>
<a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={styles.bookingLink}>
Book your Website Strategy Roadmap Session →
</a>
</div>

<div style={styles.downloadBox}>
<div style={styles.priorityLabel}>SAVE YOUR ROADMAP</div>
<div style={styles.saveRow}>
<button style={styles.secondaryBtn} onClick={copyToClipboard}>
{copied ? "✓ Copied" : "📋 Copy text"}
</button>
<button style={styles.secondaryBtn} onClick={downloadPDF}>⬇ Download PDF</button>
</div>
<textarea
id="roadmapTextarea"
readOnly
value={roadmapText()}
style={styles.copyableText}
/>
<p style={styles.copyInstruction}>Or select the text above and copy it manually</p>
</div>

<button style={styles.ghostBtn} onClick={restart}>↺ Start again</button>
</div>
)}
</div>
</div>
);
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600&display=swap');
* { box-sizing: border-box; }
body { margin: 0; }
.fade { animation: fade 0.5s cubic-bezier(0.16,1,0.3,1); }
@keyframes fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
textarea::placeholder { color: ${STONE}99; }
button, a { font-family: 'Inter', sans-serif; cursor: pointer; }
button:active { transform: scale(0.985); }
`;

const styles = {
shell: { minHeight: "100vh", background: PAPER, fontFamily: "'Inter', sans-serif", color: INK, display: "flex", justifyContent: "center" },
stage: { width: "100%", maxWidth: 640, padding: "24px 26px 70px" },
topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 28px" },
backBtn: { background: "transparent", border: "none", color: STONE, fontSize: 13, fontWeight: 500, padding: 0 },
progLabel: { fontSize: 12, letterSpacing: "0.08em", color: STONE, fontWeight: 500 },

eyebrowDash: { display: "flex", alignItems: "center", gap: 10, fontSize: 11.5, letterSpacing: "0.22em", color: PINK, fontWeight: 600, marginBottom: 20, marginTop: 6 },
coverTitle: { fontFamily: "'Fraunces', serif", fontSize: "clamp(34px, 8vw, 54px)", lineHeight: 1.08, fontWeight: 700, color: INK, marginBottom: 22, marginTop: 4 },
title: { fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 6vw, 36px)", lineHeight: 1.18, fontWeight: 700, color: INK, marginBottom: 18 },
subheading: { fontFamily: "'Fraunces', serif", fontSize: 18, lineHeight: 1.35, fontWeight: 600, color: INK, marginBottom: 20, fontStyle: "italic" },
pinkItalic: { color: PINK, fontStyle: "italic", fontWeight: 600 },
thinkAbout: { marginBottom: 24 },
thinkLabel: { fontSize: 14, fontWeight: 600, color: INK, marginBottom: 12, display: "block" },
focusList: { listStyle: "none", padding: 0, margin: 0 },

// List items within focusList
focusItem: { fontSize: 15, lineHeight: 1.6, color: `${INK}aa`, marginBottom: 14, paddingLeft: 0 },
body: { fontSize: 16, lineHeight: 1.65, color: `${INK}cc`, fontWeight: 400, marginBottom: 26, maxWidth: 540 },
hint: { fontSize: 13.5, color: STONE, fontStyle: "italic", marginBottom: 36 },
journey: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px", marginTop: 10 },
journeyStep: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, maxWidth: 300 },
journeyConnector: { display: "flex", flexDirection: "column", alignItems: "center", margin: "2px 0" },
journeyLine: { width: 1, height: 26, background: LINE },
journeyArrow: { fontSize: 13, color: PINK, marginTop: -4, lineHeight: 1 },
journeyLabel: { fontSize: 11.5, letterSpacing: "0.2em", color: INK, fontWeight: 700, marginTop: 4 },
journeyCaption: { fontSize: 14, lineHeight: 1.5, color: `${INK}aa`, fontWeight: 400 },
rainbowPath: { display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8, padding: "24px 0", marginTop: 20, marginBottom: 12 },
rainbowLens: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: PINK, padding: "8px 12px", border: `1px solid ${PINK}`, borderRadius: 6 },
rainbowArrow: { fontSize: 16, color: PINK, marginTop: 2 },
fieldLabel: { display: "block", fontSize: 12.5, letterSpacing: "0.04em", fontWeight: 600, color: INK, marginBottom: 8 },
fieldOptional: { color: STONE, fontWeight: 400, fontStyle: "italic" },
textInput: { width: "100%", background: "transparent", border: "none", borderBottom: `2px solid ${LINE}`, padding: "8px 2px 12px", fontSize: 15.5, fontFamily: "'Inter', sans-serif", fontWeight: 300, color: INK, outline: "none" },

qList: { display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${LINE}`, paddingTop: 16 },
qItem: { fontSize: 14.5, lineHeight: 1.5, color: `${INK}bb`, paddingBottom: 10, borderBottom: `1px solid ${LINE}` },

textarea: { width: "100%", background: "transparent", border: "none", borderBottom: `2px solid ${LINE}`, padding: "10px 2px 16px", fontSize: 16.5, fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.6, color: INK, outline: "none", resize: "vertical", marginBottom: 12 },

primaryBtn: { display: "block", background: INK, color: PAPER, border: "none", borderRadius: 999, padding: "16px 30px", fontSize: 14, letterSpacing: "0.02em", fontWeight: 600, margin: "34px auto 0" },
primaryLink: { display: "inline-block", background: PINK, color: PAPER, borderRadius: 999, padding: "16px 30px", fontSize: 14, letterSpacing: "0.02em", fontWeight: 600, textDecoration: "none" },
ghostBtn: { display: "block", background: "transparent", border: "none", color: STONE, fontSize: 13.5, fontWeight: 500, marginTop: 16, padding: 0, margin: "16px auto 0" },
errorText: { fontSize: 13.5, color: PINK, marginTop: 14 },

genWrap: { paddingTop: "20vh", paddingBottom: "20vh", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh" },
spinner: { width: 34, height: 34, borderRadius: "50%", border: `3px solid ${LINE}`, borderTopColor: PINK, marginTop: 26, animation: "spin 0.9s linear infinite" },

priorityLabel: { fontSize: 11.5, letterSpacing: "0.2em", color: PINK, fontWeight: 700, marginBottom: 16, marginTop: 8 },
priorityList: { display: "flex", flexDirection: "column", gap: 0, marginBottom: 32 },
priorityRow: { display: "flex", gap: 20, padding: "18px 0", borderBottom: `1px solid ${LINE}` },
priorityNum: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 22, color: STONE, minWidth: 30 },
priorityTitle: { fontSize: 16.5, fontWeight: 600, color: INK, marginBottom: 6 },
priorityWhy: { fontSize: 14.5, lineHeight: 1.55, color: `${INK}aa`, fontWeight: 400 },

oneThingBox: { borderTop: `1px solid ${LINE}`, paddingTop: 26, marginBottom: 32 },
oneThingText: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 20, lineHeight: 1.5, color: INK, fontWeight: 500 },

nextStepBox: { borderTop: `1px solid ${LINE}`, paddingTop: 26, paddingBottom: 8 },
notesBox: { borderTop: `1px solid ${LINE}`, paddingTop: 26, marginBottom: 32 },
downloadBox: { textAlign: "center", borderTop: `1px solid ${LINE}`, marginTop: 40, paddingTop: 32, marginBottom: 40 },
downloadBtn: { display: "block", background: INK, color: PAPER, border: "none", borderRadius: 999, padding: "14px 28px", fontSize: 13.5, letterSpacing: "0.02em", fontWeight: 600, margin: "0 auto" },
saveRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 },
secondaryBtn: { display: "inline-flex", alignItems: "center", gap: 7, background: "white", border: `1.5px solid ${PINK}`, color: PINK, borderRadius: 999, padding: "11px 20px", fontSize: 13.5, fontWeight: 600, letterSpacing: "0.01em" },
copyableText: { width: "100%", height: "260px", padding: "16px", fontSize: 13, lineHeight: "1.6", fontFamily: "monospace", border: `1px solid ${LINE}`, borderRadius: 8, resize: "vertical", backgroundColor: PAPER, color: INK },
copyInstruction: { fontSize: 12, color: STONE, marginTop: 12, fontWeight: 500 },
bookingLink: { display: "inline-block", background: INK, color: PAPER, borderRadius: 999, padding: "14px 28px", fontSize: 14, letterSpacing: "0.02em", fontWeight: 600, textDecoration: "none", marginTop: 20 },
waysBox: { borderTop: `1px solid ${LINE}`, paddingTop: 26, marginBottom: 32 },
waysGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 18, marginTop: 18 },
wayCard: { border: `1px solid ${LINE}`, borderRadius: 12, padding: 18, textAlign: "center" },
wayTitle: { fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: INK, marginBottom: 6 },
wayPrice: { fontSize: 13, fontWeight: 600, color: PINK, marginBottom: 10 },
wayDesc: { fontSize: 14, lineHeight: 1.5, color: `${INK}aa`, marginBottom: 16 },
wayBtn: { display: "inline-block", background: INK, color: PAPER, borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none" },
};


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
