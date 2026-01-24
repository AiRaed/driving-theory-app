# Question Generation Prompts

Use these prompts with AI systems to generate questions following the exact format required.

## Master Prompt Template

```
You are a UK Driving Theory content generator.

Your task is to create NEW, ORIGINAL practice questions for the UK Car Driving Theory Test.

IMPORTANT LEGAL RULES:
- Do NOT copy or closely paraphrase any official DVSA or third-party copyrighted questions.
- Questions must be ORIGINAL, rewritten in your own words.
- Keep the meaning, rules, and outcomes accurate according to the Highway Code.

STYLE & DIFFICULTY:
- Use DVSA-style phrasing (clear, practical, exam-focused).
- One correct answer only.
- Three plausible but clearly incorrect distractors.
- Avoid trick questions or ambiguous wording.
- Focus on helping learners PASS the theory test.

LANGUAGES:
- Provide BOTH English and Arabic.
- Arabic must be clear Modern Standard Arabic (not dialect).
- Arabic meaning must match the English exactly.

OUTPUT FORMAT:
Return ONLY valid JavaScript objects (no explanations, no markdown).

Each question must follow this exact structure:

{
  id: "AUTO-GENERATED",
  topic: "<topic-key>",
  promptEn: "<English question>",
  promptAr: "<Arabic translation>",
  options: [
    { en: "<option>", ar: "<translation>", correct: false },
    { en: "<option>", ar: "<translation>", correct: false },
    { en: "<option>", ar: "<translation>", correct: false },
    { en: "<option>", ar: "<translation>", correct: true }
  ],
  keywords: [
    { term: "<term>", ar: "<translation>", explainAr: "<explanation in Arabic>" }
  ]
}

GENERAL RULES:
- Do NOT reuse question ideas already covered in previous batches.
- Match UK rules ONLY (UK speed limits, UK road signs, UK laws).
- Use realistic scenarios (roads, weather, traffic).
- Topics must match the existing app categories exactly.

TOPICS (use exactly as shown):
- alertness
- hazard-awareness
- road-signs
- safety-margins
- rules-of-the-road
- vulnerable-road-users
- vehicle-handling
- motorway-driving
- other-vehicles
- vehicle-loading
- safety-vehicle
- documents
- incidents
- attitude
- general
```

---

## Batch 1: Road Signs (40 questions)

```
Using the Master Prompt rules,
generate 40 NEW questions for topic: "road-signs".

Coverage MUST include:
- Warning signs (bends, junctions, animals, slippery road)
- Regulatory signs (speed limits, no entry, no overtaking)
- Mandatory signs (blue direction arrows, cycle lanes)
- Sign shapes (triangle, circle, rectangle, octagon)
- Road markings (zigzag lines, give way lines, stop lines)

Do NOT repeat ideas.
Return ONLY question objects.
```

---

## Batch 2: Speed, Distance & Safety Margins (35 questions)

```
Using the Master Prompt rules,
generate 35 NEW questions split across:

- topic: "safety-margins"
- topic: "vehicle-handling"

Coverage MUST include:
- Stopping distances at different speeds
- Two-second and four-second rules
- Effects of rain, ice, fog
- Why coasting is dangerous
- Following distances

Return ONLY question objects.
```

---

## Batch 3: Motorway Driving (45 questions)

```
Using the Master Prompt rules,
generate 45 NEW questions for topic: "motorway-driving".

Coverage MUST include:
- Lane discipline
- Speed limits (cars, trailers)
- Hard shoulder rules
- Breakdowns and emergency phones
- Reflective studs on motorways
- Overtaking rules

Return ONLY question objects.
```

---

## Batch 4: Hazard Awareness & Alertness (30 questions)

```
Using the Master Prompt rules,
generate 30 NEW questions split across:

- topic: "hazard-awareness"
- topic: "alertness"

Coverage MUST include:
- Children near parked cars
- Pedestrians stepping out
- Cyclists swerving
- Tiredness and concentration
- Anticipation of hazards

Return ONLY question objects.
```

---

## Batch 5: Vulnerable Road Users (30 questions)

```
Using the Master Prompt rules,
generate 30 NEW questions for topic: "vulnerable-road-users".

Coverage MUST include:
- Pedestrian crossings (zebra, pelican, puffin, toucan)
- Elderly pedestrians
- Cyclists and motorcyclists
- Horse riders
- Overtaking distances

Return ONLY question objects.
```

---

## Batch 6: Weather, Lights & Visibility (30 questions)

```
Using the Master Prompt rules,
generate 30 NEW questions split across:

- topic: "vehicle-handling"
- topic: "general"

Coverage MUST include:
- Fog lights (front & rear)
- Visibility below 100 metres
- Driving in rain, snow, ice
- Dazzle at night
- Aquaplaning

Return ONLY question objects.
```

---

## Batch 7: Vehicle Safety & Documents (30 questions)

```
Using the Master Prompt rules,
generate 30 NEW questions split across:

- topic: "safety-vehicle"
- topic: "documents"

Coverage MUST include:
- Tyre tread depth
- Brakes and warning lights
- Seat belts and child seats
- MOT rules
- Insurance requirements
- Eyesight rules

Return ONLY question objects.
```

---

## Batch 8: Incidents, Law & Attitude (30 questions)

```
Using the Master Prompt rules,
generate 30 NEW questions split across:

- topic: "incidents"
- topic: "attitude"

Coverage MUST include:
- What to do at an accident
- First priorities (danger, breathing, bleeding)
- Dealing with aggressive drivers
- Mobile phone law
- Alcohol and drugs
- Fatigue and emotions

Return ONLY question objects.
```

---

## Usage Notes

1. Generate questions in batches to avoid repetition
2. After each batch, review existing questions to ensure no duplication
3. Update question IDs sequentially (e.g., RS-25, RS-26, etc.)
4. Add generated questions to `data/questions.ts` maintaining the array structure
5. Test questions for clarity and accuracy before adding to production

