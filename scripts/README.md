# Question Generator Scripts

This directory contains utilities for generating UK Driving Theory test questions.

## Structure

- `generate-questions.js` - Core utilities and batch specifications
- `README.md` - This file

## Usage

The question generator provides:

1. **Topic definitions** - All valid topic keys matching the app structure
2. **Batch specifications** - Pre-defined batches with coverage areas
3. **Utility functions** - For formatting and ID generation

## Batch Specifications

The generator includes 8 predefined batches:

1. **Road Signs** (40 questions) - Warning, regulatory, mandatory signs, shapes, road markings
2. **Speed, Distance & Safety Margins** (35 questions) - Stopping distances, following rules, weather effects
3. **Motorway Driving** (45 questions) - Lane discipline, speed limits, hard shoulder, breakdowns
4. **Hazard Awareness & Alertness** (30 questions) - Children, pedestrians, cyclists, tiredness
5. **Vulnerable Road Users** (30 questions) - Pedestrian crossings, elderly, cyclists, horse riders
6. **Weather, Lights & Visibility** (30 questions) - Fog lights, visibility, weather conditions, aquaplaning
7. **Vehicle Safety & Documents** (30 questions) - Tyres, brakes, seat belts, MOT, insurance
8. **Incidents, Law & Attitude** (30 questions) - Accidents, first aid, aggressive drivers, mobile phones, alcohol

## Question Format

Each question must follow this structure (matching `data/questions.ts`):

```javascript
{
  id: "AL-01",  // Auto-generated based on topic and sequence
  topic: "alertness",
  promptEn: "English question text",
  promptAr: "Arabic question text",
  options: [
    { en: "Option 1", ar: "الخيار 1", correct: false },
    { en: "Option 2", ar: "الخيار 2", correct: false },
    { en: "Option 3", ar: "الخيار 3", correct: false },
    { en: "Option 4", ar: "الخيار 4", correct: true }
  ],
  keywords: [
    { term: "keyword", ar: "الكلمة", explainAr: "Explanation in Arabic" }
  ],
  image: "/theory-images/path/to/image.jpg"  // Optional
}
```

## Important Rules

- Questions must be **ORIGINAL** - not copied from DVSA materials
- Keep Highway Code rules and meanings accurate
- Use clear, practical, exam-focused phrasing
- Provide both English and Arabic (Modern Standard Arabic)
- One correct answer, three plausible distractors
- Avoid trick questions or ambiguous wording
- Match UK rules only (speed limits, signs, laws)

## Integration

To use with AI/question generation:

1. Import the utilities:
```javascript
const { BATCH_SPECS, generateQuestionId, formatQuestion } = require('./generate-questions.js');
```

2. Generate questions following batch specifications
3. Use `generateQuestionId()` for consistent ID formatting
4. Use `formatQuestion()` to format as JavaScript code
5. Append to `data/questions.ts` maintaining existing structure

