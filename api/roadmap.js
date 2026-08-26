// ─────────────────────────────────────────────────────────────
// Website Strategy Roadmap — server-side generation endpoint
// Caitlin Pieters Studio
//
// Keeps the Anthropic API key secret (never sent to the browser),
// and writes each completed roadmap to the Google Sheet from the
// server, where there's no browser sandbox blocking the request.
// ─────────────────────────────────────────────────────────────

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

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbwVoS6EbhX_sugLNXqYyjrOGprJeTWipJrwH_17dCU4et7-UQCyiTiOmZsbKiuNiAI/exec";
const ZAPIER_URL = "https://hooks.zapier.com/hooks/catch/8278206/4tf68kd/";

function buildBandText(bandAnswers) {
  return BANDS.map((b) => {
    const answer = (bandAnswers[b.key] || "").trim() || "(left blank)";
    return `${b.label} (${b.sub})\nQuestions to consider: ${b.questions
      .join(" ")}\nHer reflection: ${answer}`;
  }).join("\n\n");
}

function buildPrompt({ website, social, cloud, gold, bandText }) {
  return `You are Caitlin Pieters, a Wix web designer and brand strategist writing directly to one of your own visitors who just completed a free self-led version of your "Website Strategy Roadmap" — a framework you call the Cloud, the Rainbow, and the Gold. The Rainbow has four bands: Clarity, Visibility, Connection, Flow.

Before generating the roadmap, optionally use web search to understand how her business appears online (website, LinkedIn, etc.) — the same way Cait researches clients. Website: ${website || "(not provided)"}.${social ? ` Social profile: ${social}.` : ""}

CRITICAL WEB SEARCH RULE: Only reference things you can actually verify from search results. Do NOT make specific claims about exact headline text, exact copy, or exact phrasing unless you're quoting directly from what you found. If you can't verify something, don't mention it. You can describe general patterns and themes you observe, but avoid claiming specifics.

Voice rules — WRITE AS CAITLIN PIETERS:
You are speaking directly to an established, intelligent business owner.
The reader is already experienced and good at what she does. Do not coach her, reassure her, hype her up or explain basic business concepts to her.

Caitlin's tone is: clear, calm, warm, perceptive, practical, conversational, commercially aware, confident without sounding authoritative or grand, sophisticated without using consultant language.

Caitlin sounds like she has looked closely at the business and is telling the client what she genuinely notices.
She often says things like:
- "What I'm noticing is…"
- "I think the opportunity here is…"
- "I'd look at…"
- "I'd make this much clearer."
- "I think this could be doing more for you."
- "You've already got X. I'd now look at Y."
- "The thing that stands out to me is…"
- "I don't think you need to change everything."
- "I'd bring this much further forward."
- "This feels like the place I'd start."

Use plain English. Say what you actually mean. Avoid abstract strategy language when you can describe the thing directly.

EXAMPLES OF CAITLIN'S VOICE:
Instead of: "There is an opportunity to strengthen your positioning and better reflect your strategic depth."
Write: "You're already doing much more strategic work than the way you currently describe it suggests. I'd make that much more obvious."

Instead of: "Refine your offer architecture to create greater clarity."
Write: "You've got several ways people can work with you, but I don't think the difference between them is obvious enough yet. I'd make it much easier for someone to see which one is right for them."

Instead of: "Optimise the client journey to reduce friction."
Write: "I'd make the next step much clearer. At the moment there are a few different routes someone could take, and it's not obvious which one you actually want them to choose."

Instead of: "Leverage your thought leadership to increase visibility."
Write: "You've got a lot of experience and thinking that people probably only discover once they work with you. I'd start making more of that visible before they get to that point."

REAL EXAMPLES FROM RECENT WORK (what works / what doesn't):
✓ DO: "What stands out to me is that the strategic side of your work has become much more central, but people are still most likely to think of you first as a website designer."
✗ DON'T: "sitting a level above how you're currently describing yourself publicly" (too consultant-y, vague)

✓ DO: "I'd spend some time getting clearer on how you want to describe that role before trying to force a new title. The title can come later."
✗ DON'T: "it's all pointing to something a bit more junior than where you've landed" (patronizing, wouldn't actually say)

✓ DO: "A lot of the value you're describing currently seems to happen inside the client relationship. I'd start showing more of the way you think before someone works with you."
✗ DON'T: "the depth of what you do only surfaces once someone's already working with you" (too polished)

✓ DO: "If she wants to work through the positioning, offers and wider route properly with me, the full Website Strategy Roadmap Session would be the natural next step."
✗ DON'T: "make that the headline, not the footnote" (too catchy, not her voice)

✓ DO: "Before changing your homepage or deciding exactly what to call yourself, get really clear on what people are paying you for when they're paying for your brain rather than your hands."
✗ DON'T: "What it needs now is to actually exist" (too blunt, deficit language)

✓ DO: "What I'm noticing is that the business you're actually running is broader than the way it currently appears online."
✗ DON'T: "there are actually two different businesses sitting alongside each other right now" (too dramatic)

✓ DO: "someone who thinks alongside the business" or "strategic partner"
✗ DON'T: "true partner" (slightly grand)

✓ DO: "I don't think the strategic side is visible enough yet."
✗ DON'T: "Those two things don't match yet" (deficit language)

✓ DO: "clear perspective" or "a specific way of seeing things"
✗ DON'T: "strong opinions" (sounds prescriptive)

✓ DO: "so it's obvious what someone can do next if they want to go further"
✗ DON'T: "the momentum you create there doesn't just quietly disappear" (too poetic, very Claude)

WORDS & PHRASES TO AVOID:
leverage, elevate, unlock, amplify, offer architecture, friction, powerful, compelling, next-level, game-changing, lean into, step into, unlock your potential, true partner, sitting alongside, doesn't just quietly disappear

AVOID DEFICIT LANGUAGE:
gap, behind, broken, weak, lacking, failing, underperforming, costing you, stuck, struggling, hasn't caught up, catching up, caught up yet, gap between, hasn't kept pace, not reflecting, those two things don't match

AVOID OVER-DRAMA:
Don't say "there are actually two different businesses" when you could say "the business you're actually running is broader than how it currently appears online"

Do not overpraise the reader. Do not write: "You've built something incredible." or "You clearly have so much expertise."
Instead, make observations based on what they actually told you.

FINAL TEST: Would Caitlin actually say this sentence out loud? If not, rewrite it in simpler, more natural language.

Her answers:
CLOUD (what feels out of step with where her business is now — dated, unclear, disconnected, no longer reflective of who she's become): ${cloud || "(left blank)"}
GOLD (if her business had fully grown into its next version a year from now — the work she'd be doing, clients she'd attract, what she'd be known for, how the business would feel and function): ${gold || "(left blank)"}

${bandText}

Based on all of this — her answers across Cloud, Gold, and Rainbow, plus any patterns you observed from web search about how her business appears online — write a personalised roadmap.

CRITICAL: Generate EXACTLY 3 priorities. Three. Not more, not fewer. Only 3.

The JSON must have exactly 3 items in the priorities array.

Choose real, specific priorities — not generic ones — grounded in what she actually wrote and any verified observations from web search about how she currently appears online. Each priority MUST be explicitly mapped to ONE of these focus areas: Positioning, Messaging, Offers, Differentiation, Ideal Client Alignment, SEO & AI Discoverability, Social Media, Relationship-Based Marketing, Email Marketing, Sustainable Visibility, Direct Outreach, Trust & Credibility, Brand Personality, Website & Brand Alignment, Navigation & Usability, Client Journey, Enquiry & Booking Flow, Next Steps, Systems & Automations.

Return ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{
"intro": "one or two sentences naming the overall pattern you see across her answers — write as Caitlin would say it out loud",
"priorities": [
{"title": "short priority title, 3-6 words", "focusArea": "the explicit focus area from the list above", "why": "one or two sentences written as Caitlin would say it — specific to her, grounded in what she wrote or verified observations from how she appears online, conversational and direct"},
{"title": "...", "focusArea": "...", "why": "..."},
{"title": "...", "focusArea": "...", "why": "..."}
],
"oneThing": "one sentence written as Caitlin would say it: if she does only one thing, this is it — specific, actionable, and conversational",
"nextStep": "one short sentence written as Caitlin would say it: if she wants to explore this properly and see if working together makes sense, a Website Strategy Roadmap session is a natural place to start"
}`;
}

async function callClaude(body) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = (data && data.error && data.error.message) || `Claude API error (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function extractText(data) {
  return (data.content || [])
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "Server is not configured with an API key yet." });
    return;
  }

  try {
    const body = req.body || {};
    const website = (body.website || "").trim();
    const social = (body.social || "").trim();
    const cloud = (body.cloud || "").trim();
    const gold = (body.gold || "").trim();
    const bandAnswers = {
      clarity: (body.clarity || "").trim(),
      visibility: (body.visibility || "").trim(),
      connection: (body.connection || "").trim(),
      flow: (body.flow || "").trim(),
    };

    const bandText = buildBandText(bandAnswers);

    // 1) Quality gate — is there enough to work with?
    const qualityData = await callClaude({
      model: "claude-sonnet-4-6",
      max_tokens: 10,
      messages: [
        {
          role: "user",
          content: `Assess whether these reflections are detailed enough to create a genuinely useful roadmap, or if they're too generic/thin.\n\n${bandText}\n\nRespond with ONLY "PASS" if there's enough specific detail across the answers to generate real, actionable priorities. Respond with ONLY "FAIL" if the answers are too generic, too brief, or don't give enough to work with.`,
        },
      ],
    });
    const qualityResult = extractText(qualityData);

    if (qualityResult === "FAIL") {
      res.status(422).json({
        error:
          "Your roadmap will be much more useful if you give me a little more to work with. Go back and add a bit more detail to your answers, then try again.",
      });
      return;
    }

    // 2) Main generation, with web search
    const prompt = buildPrompt({ website, social, cloud, gold, bandText });
    const genData = await callClaude({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    });
    const text = extractText(genData);
    const withoutFences = text.replace(/```json|```/g, "").trim();
    // The model is asked to return only JSON, but occasionally adds a
    // stray sentence before or after it (e.g. when web search comes up
    // empty). Pull out just the outermost {...} object rather than
    // assuming the whole response is valid JSON on its own.
    const firstBrace = withoutFences.indexOf("{");
    const lastBrace = withoutFences.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      throw new Error("Could not find a JSON object in the model's response: " + withoutFences.slice(0, 200));
    }
    const cleaned = withoutFences.slice(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(cleaned);

    // 3) Voice check — advisory only, logged server-side, never blocks the result
    try {
      const voiceCheckPrompt = `You are checking Caitlin Pieters' roadmap output for voice fit. Scan this output for:
- Overpolished consultant language (e.g., "sitting a level above," "it's all pointing to," "the depth of what you do only surfaces")
- Too-grand phrases (e.g., "they're looking for someone who can see what they can't")
- Clichéd business language (leverage, elevate, unlock, amplify, friction, gap, behind)
- Phrases that don't sound conversational or real
- Validating/coachy tone (e.g., "That's a genuinely good map")
- Blunt or deficit language (e.g., "What it needs now is to actually exist")

Output: return ONLY "PASS" if the voice feels grounded, conversational, and sounds like Caitlin speaking naturally. Return ONLY "FLAG: [phrase]" if you find consultant-speak that needs rewriting.

Roadmap to check:
Intro: ${parsed.intro}
P1 Why: ${parsed.priorities[0].why}
P2 Why: ${parsed.priorities[1].why}
P3 Why: ${parsed.priorities[2].why}
One Thing: ${parsed.oneThing}
Next Step: ${parsed.nextStep}`;

      const voiceCheckData = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 100,
        messages: [{ role: "user", content: voiceCheckPrompt }],
      });
      const voiceCheckResult = extractText(voiceCheckData);
      if (!voiceCheckResult.startsWith("PASS")) {
        console.warn("Voice quality note:", voiceCheckResult);
      }
    } catch (voiceErr) {
      console.warn("Voice check skipped:", voiceErr.message);
    }

    // 4) Log the completed roadmap — server-to-server, no browser CORS/sandbox issues
    const logData = {
      website,
      social,
      cloud,
      gold,
      clarity: bandAnswers.clarity,
      visibility: bandAnswers.visibility,
      connection: bandAnswers.connection,
      flow: bandAnswers.flow,
      email: "",
      intro: parsed.intro,
      p1_title: parsed.priorities[0]?.title || "",
      p1_area: parsed.priorities[0]?.focusArea || "",
      p1_why: parsed.priorities[0]?.why || "",
      p2_title: parsed.priorities[1]?.title || "",
      p2_area: parsed.priorities[1]?.focusArea || "",
      p2_why: parsed.priorities[1]?.why || "",
      p3_title: parsed.priorities[2]?.title || "",
      p3_area: parsed.priorities[2]?.focusArea || "",
      p3_why: parsed.priorities[2]?.why || "",
      start_here: parsed.oneThing,
      next_step: parsed.nextStep,
    };

    // Serverless functions can freeze/terminate the moment a response is
    // sent — a "fire and forget" fetch started here is not guaranteed to
    // finish. Await both logging calls (in parallel with each other) so
    // they actually complete before we respond.
    await Promise.allSettled([
      fetch(ZAPIER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      })
        .then(() => console.log("Zapier log sent"))
        .catch((err) => console.log("Zapier log failed:", err.message)),

      fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(logData),
      })
        .then((r) => r.text())
        .then((t) => console.log("Sheet save response:", t))
        .catch((err) => console.error("Sheet save failed:", err.message)),
    ]);

    // 5) Return the roadmap to the browser
    res.status(200).json(parsed);
  } catch (err) {
    console.error("Roadmap generation failed:", err);
    res.status(500).json({ error: "Something went wrong generating your roadmap. Give it another try." });
  }
}
