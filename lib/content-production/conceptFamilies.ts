/**
 * Fine-grained reusable learning concepts for content production.
 *
 * Official stems (and, for generic “what does this sign mean?” items, the
 * official correct option) decide the group. Classifier rationale is only a
 * fallback. Explanations are not scanned for non-sign questions because they
 * mention too many neighbouring topics. Never invents explanations.
 */

import type { ExplanationRecommendation } from '../learning-cards/types';

export interface QuestionHint {
  promptEn?: string;
  explanationEn?: string;
  correctOptionEn?: string;
}

export interface ConceptFamily {
  slug: string;
  title: string;
}

export const CONCEPT_FAMILIES: Array<ConceptFamily & { test: RegExp }> = [
  {
    slug: 'stopping-distances',
    title: 'Stopping distances and the two-second gap',
    test: /\b(stopping distances?|thinking distance|braking distance|overall stopping|two[- ]second(?: rule)?|2[- ]second|four[- ]second|typical overall stopping|distance should you keep from the vehicle in front)\b/i,
  },
  {
    slug: 'ice-snow-skid',
    title: 'Ice, snow and skidding',
    test: /\b(icy|ice|snow|skidd?ing?|wheelspin|freezing|snowy|black ice)\b/i,
  },
  {
    slug: 'fog-lights',
    title: 'Front and rear fog lights',
    test: /\b((?:front|rear) fog lights?|fog lights?)\b/i,
  },
  {
    slug: 'fog-driving',
    title: 'Driving in fog and spray',
    test: /\b(fog|foggy|spray|visibility)\b/i,
  },
  {
    slug: 'wind-high-sided',
    title: 'Side winds and high-sided vehicles',
    test: /\b(side winds?|windy|high[- ]sided|exposed)\b/i,
  },
  {
    slug: 'suspension-shock-absorbers',
    title: 'Suspension and shock absorbers',
    test: /\b(keeps bouncing|shock absorbers?|bodywork over a wheel)\b/i,
  },
  {
    slug: 'abs-emergency-braking',
    title: 'ABS and emergency stops',
    test: /\b(anti[- ]lock|abs\b|stop (?:your vehicle )?in an emergency)\b/i,
  },
  {
    slug: 'coasting-engine-braking',
    title: 'Coasting, kick-down and engine braking',
    test: /\b(kick[- ]down|engine as a brake|engine braking|coasting|clutch (?:pedal )?down|roll in neutral|select neutral)\b/i,
  },
  {
    slug: 'hills-gradients',
    title: 'Hills, gradients and downhill control',
    test: /\b(steep hill|downhill|up a steep|facing downhill|gradient)\b/i,
  },
  {
    slug: 'hot-soft-surface',
    title: 'Hot weather and a soft road surface',
    test: /\b(soft in very hot|hot weather|soft (?:road )?surface)\b/i,
  },
  {
    slug: 'aquaplaning-wet-grip',
    title: 'Aquaplaning and tyre grip in the wet',
    test: /\b(aquaplan|losing their grip|tyres are losing)\b/i,
  },
  {
    slug: 'flood-water-brakes',
    title: 'Checking brakes after flood water',
    test: /\b(flood water|gone through flood)\b/i,
  },
  {
    slug: 'tyres-legal-pressure',
    title: 'Tyre tread, pressure and legality',
    test: /\b(tyres?|tread|under[- ]inflated|tyre pressures?)\b/i,
  },
  {
    slug: 'mot-certificate',
    title: 'MOT certificates',
    test: /\bmot\b/i,
  },
  {
    slug: 'catalytic-converter',
    title: 'Catalytic converters',
    test: /\bcatalytic converter\b/i,
  },
  {
    slug: 'vehicle-fire-risk',
    title: 'Reducing the risk of a vehicle fire',
    test: /\b(catching fire|vehicle fire|strong smell of fuel)\b/i,
  },
  {
    slug: 'fuel-spillage',
    title: 'Fuel filler caps and spillage',
    test: /\b(filler cap|fuel spillage|avoid fuel spillage)\b/i,
  },
  {
    slug: 'fuel-efficient-driving',
    title: 'Fuel-efficient driving technique',
    test: /\b(fuel consumption|waste fuel|wasting fuel|fuel[- ]efficient|drive smoothly|driving smoothly|rapid acceleration|heavy braking|driving at 70 mph|save fuel|use more fuel|fuel consumption at its highest)\b/i,
  },
  {
    slug: 'environmental-impact',
    title: 'Reducing environmental harm from vehicles',
    test: /\b(environmental harm|environmental damage|help the environment|reduce the volume of traffic|urban pollution|damage your vehicle causes to the environment|protect the environment)\b/i,
  },
  {
    slug: 'seat-belts-child-restraints',
    title: 'Seat belts and child restraints',
    test: /\b(seat belt|child (?:seat|restraint)|baby seat|airbag|under 1\.35|13-year-old|5-year-old|11-year-old|law require you to keep in good condition)\b/i,
  },
  {
    slug: 'vehicle-security',
    title: 'Vehicle security and theft deterrence',
    test: /\b(thief|stolen|broken into|valuables|radio being stolen|secure car park|leave it unattended|leaving it unattended)\b/i,
  },
  {
    slug: 'dashboard-warning-lights',
    title: 'Dashboard warning lights',
    test: /\b(this light comes on|instrument[- ]panel warning|warning light comes on|headlights are on main beam|esc indicator|electronic stability control)\b/i,
  },
  {
    slug: 'adas-driver-assistance',
    title: 'ADAS and driver assistance systems',
    test: /\b(adas|driver assistance|cruise control|blind[- ]spot monitoring|drowsiness detection|advanced driver assistance)\b/i,
  },
  {
    slug: 'journey-planning',
    title: 'Journey planning and busy times',
    test: /\b(plan (?:your )?(?:route|journey)|busy times|appointment|unexpected journey|plan rest stops)\b/i,
  },
  {
    slug: 'horn-rules',
    title: 'When you may use the horn',
    test: /\bhorn\b/i,
  },
  {
    slug: 'brake-fluid-level',
    title: 'Brake fluid level',
    test: /\b(brake[- ]fluid|level is allowed to get too low)\b/i,
  },
  {
    slug: 'oil-battery-service',
    title: 'Oil, battery and servicing',
    test: /\b(engine oil|battery|service schedule|too much oil)\b/i,
  },
  {
    slug: 'unbalanced-wheels',
    title: 'Unbalanced wheels',
    test: /\bunbalanced\b/i,
  },
  {
    slug: 'head-restraint-shoes',
    title: 'Head restraints and suitable shoes',
    test: /\b(head restraint|neck injury|suitable shoes)\b/i,
  },
  {
    slug: 'red-routes-traffic-calming',
    title: 'Red routes, humps and traffic calming',
    test: /\b(red routes?|road humps|humps in the road|chicanes|narrowings|traffic[- ]calming)\b/i,
  },
  {
    slug: 'parking-obstruction',
    title: 'Parking, obstruction and leaving a vehicle',
    test: /\b(park(?:ing|ed)? (?:your |the )?(?:vehicle|car)|cause an obstruction|leave the engine running|parking lights)\b/i,
  },
  {
    slug: 'motorway-signals-red-cross',
    title: 'Motorway overhead signals and red crosses',
    test: /\b(red cross|overhead signs|mandatory speed limit is displayed above)\b/i,
  },
  {
    slug: 'motorway-reflective-studs',
    title: 'Motorway reflective studs',
    test: /\b(reflective studs|amber reflective|red reflective studs|green reflective|studs between)\b/i,
  },
  {
    slug: 'motorway-joining-exiting',
    title: 'Joining, leaving and missing a motorway exit',
    test: /\b(joining from a slip|immediately after joining|miss the exit|before you reach your exit|slip road|countdown markers|mean on this motorway sign)\b/i,
  },
  {
    slug: 'motorway-speed-limits',
    title: 'Motorway speed limits and towing',
    test: /\b(national speed limit for a car or motorcycle on a motorway|speed limit for a car towing|towing a trailer along a three[- ]lane motorway)\b/i,
  },
  {
    slug: 'motorway-contraflow-roadworks',
    title: 'Motorway contraflows, roadworks and closed lanes',
    test: /\b(contraflow|roadworks on a motorway|lane is closed|right-hand lane is closed)\b/i,
  },
  {
    slug: 'motorway-rest-tiredness',
    title: 'Tiredness and rest on a motorway',
    test: /\b(feel tired while you.?re travelling along a motorway|stop to rest|service area)\b/i,
  },
  {
    slug: 'motorway-who-may-use',
    title: 'Who may use a motorway',
    test: /\b(prohibited from using the motorway|not allowed to use the right[- ]hand lane|which vehicles should use the left[- ]hand lane)\b/i,
  },
  {
    slug: 'motorway-breakdown',
    title: 'Motorway breakdown and the hard shoulder',
    test: /\b(emergency (?:telephone|area|roadside)|breaks? down on a motorway|rejoin the (?:main carriageway|motorway)|puncture (?:while you.?re driving on the motorway|on a motorway)|stopped? on the hard shoulder|when may you stop on a motorway|when should you use the hard shoulder|luggage falls from your vehicle|emergency area on a motorway)\b/i,
  },
  {
    slug: 'motorway-lanes-overtaking',
    title: 'Motorway lanes and overtaking',
    test: /\b((?:left|right|middle)[- ]hand lane of a (?:three[- ]lane )?motorway|three[- ]lane motorway|overtake on the left|crawler|climbing lane|how should you use the lanes|which lane should you use if there's no traffic ahead|(?:two|three)[- ]lane dual carriageway)\b/i,
  },
  {
    slug: 'cycle-route-signs',
    title: 'Cycle routes and shared-path signs',
    test: /\b(route for (?:pedestrians and )?cyclists?|cycle (?:lane|track|route)|with[- ]flow bus and cycle)\b/i,
  },
  {
    slug: 'pelican-puffin-toucan',
    title: 'Pelican, puffin and toucan crossings',
    test: /\b(pelican|puffin|toucan|allows cyclists to ride across)\b/i,
  },
  {
    slug: 'cyclists-space',
    title: 'Giving cyclists space',
    test: /\b(cyclists?|bicycle|moped|approach this cyclist|bicycle wheel)\b/i,
  },
  {
    slug: 'cpr-first-aid',
    title: 'CPR and an unresponsive casualty',
    test: /\b(cpr|cardiopulmonary|not breathing|chest compressions|circulation)\b/i,
  },
  {
    slug: 'unconscious-recovery',
    title: 'Unconscious casualties and the recovery position',
    test: /\b(unconscious|recovery position)\b/i,
  },
  {
    slug: 'motorcycle-crash-helmet',
    title: 'Motorcycle crash and helmets',
    test: /\b(motorcycle crash|helmet)\b/i,
  },
  {
    slug: 'motorcyclists-awareness',
    title: 'Looking out for motorcyclists',
    test: /\b(motorcyclists?|motorcycle\b|dipped headlights in daylight|bright clothing|look round over their right shoulder)/i,
  },
  {
    slug: 'horses-animals',
    title: 'Horses, sheep and other animals',
    test: /\b(horses?|sheep|loose sheep|animals?)\b/i,
  },
  {
    slug: 'zebra-crossings',
    title: 'Zebra crossings',
    test: /\b(zebra crossing)\b/i,
  },
  {
    slug: 'older-disabled-pedestrians',
    title: 'Older, disabled and less visible pedestrians',
    test: /\b(older (?:person|people)|wheelchair|white stick|yellow or burgundy coat|reflective clothing and carrying a bright red light|disabled person)\b/i,
  },
  {
    slug: 'children-school-crossing',
    title: 'Children, schools and crossing patrols',
    test: /\b(school crossing|school warning|school bus|ball bounces|yellow zigzag|children (?:playing|from school|running)|outside this school)\b/i,
  },
  {
    slug: 'learner-inexperienced-drivers',
    title: 'Learner and inexperienced drivers',
    test: /\b(learner|inexperienced|just passed your driving)\b/i,
  },
  {
    slug: 'powered-wheelchair-disabled-vehicle',
    title: 'Powered wheelchairs and disabled vehicles',
    test: /\b(powered vehicles used by disabled|flashing amber beacon)\b/i,
  },
  {
    slug: 'drink-drugs-medicine',
    title: 'Drink, drugs and medicines',
    test: /\b(alcohol|drinking|drugs?|medicine|drowsiness|prescribes|unfit through drink)\b/i,
  },
  {
    slug: 'illness-fitness-to-drive',
    title: 'Illness and fitness to drive',
    test: /\b(period of illness|ability to drive is impaired|fit to drive)\b/i,
  },
  {
    slug: 'tiredness-concentration',
    title: 'Tiredness, anger and concentration',
    test: /\b(tired|drowsy|sleepy|angry|argument|upset you|distraction|concentrate)\b/i,
  },
  {
    slug: 'eyesight-glasses',
    title: 'Eyesight and glasses',
    test: /\b(glasses|eyesight|number plate at the required distance)\b/i,
  },
  {
    slug: 'mirrors-blind-spots',
    title: 'Mirrors, blind spots and restricted view',
    test: /\b(blind spot|mirrors?|view is restricted|restricting your view|cannot see clearly behind|convex|anti-dazzle|dazzled by a vehicle behind|windscreen pillar)\b/i,
  },
  {
    slug: 'hazard-warning-lights',
    title: 'When to use hazard warning lights',
    test: /\b(when (?:are you allowed|may you|should you|can you) use hazard warning lights|hazard warning lights (?:while you're driving|for a short time)|warn drivers behind of the hazard)\b/i,
  },
  {
    slug: 'overtaking-safety',
    title: 'When overtaking is unsafe',
    test: /\b(overtake|overtaking|forgotten to cancel their right indicator)\b/i,
  },
  {
    slug: 'junction-priority',
    title: 'Junctions, crossroads and unmarked priority',
    test: /\b(unmarked crossroads|turn right at a crossroads|who has priority|who should wait|emerging at a junction|keep looking all the time)\b/i,
  },
  {
    slug: 'roundabouts',
    title: 'Roundabouts and turning signals',
    test: /\b(roundabout|mini[- ]roundabout|straight ahead at a roundabout)\b/i,
  },
  {
    slug: 'box-junctions',
    title: 'Box junctions',
    test: /\b(box junction)\b/i,
  },
  {
    slug: 'give-way-stop',
    title: 'Give way and stop',
    test: /\b(give way|stop sign)\b/i,
  },
  {
    slug: 'one-way-wrong-lane',
    title: 'One-way streets and being in the wrong lane',
    test: /\b(one[- ]way|wrong lane|wrong direction|wrong route)\b/i,
  },
  {
    slug: 'parking-at-night',
    title: 'Parking at night and near junctions',
    test: /\b(park at night|nearest you may park to a junction|safest place to park|parking bay for disabled)\b/i,
  },
  {
    slug: 'authorised-stop-signals',
    title: 'Who can signal you to stop',
    test: /\b(authorised to signal you to stop|police officer.*signal for you to stop|flashes the headlights and points to the left)\b/i,
  },
  {
    slug: 'headlights-dipping',
    title: 'Headlights, dipping and being seen',
    test: /\b(headlights?|main beam|dipped|dazzle|daylight starts to fade|which lights should you use)\b/i,
  },
  {
    slug: 'speed-limits',
    title: 'National and local speed limits',
    test: /\b(speed limit|street lights but no speed limit|30 mph limit generally indicated|national speed limit)\b/i,
  },
  {
    slug: 'clearway-stopping',
    title: 'Clearways and where you must not stop',
    test: /\b(clearway|urban clearway|must you stop your vehicle)\b/i,
  },
  {
    slug: 'sign-shape-colour',
    title: 'Sign shapes and background colours',
    test: /\b(triangular(?: shaped)? signs?|circular traffic signs|blue background|brown background|signs that give orders|what shape are|what shape is|shape are traffic signs)\b/i,
  },
  {
    slug: 'traffic-lights',
    title: 'Traffic lights and filter arrows',
    test: /\b(traffic lights?|red and amber|amber light|green light|red traffic light)\b/i,
  },
  {
    slug: 'zigzag-markings',
    title: 'Zigzag lines at crossings',
    test: /\b(zigzag)\b/i,
  },
  {
    slug: 'hatched-areas',
    title: 'Hatched areas and chevron markings',
    test: /\b(hatched)\b/i,
  },
  {
    slug: 'double-white-lines',
    title: 'Double solid white lines',
    test: /\b(double solid white)\b/i,
  },
  {
    slug: 'centre-and-edge-lines',
    title: 'Centre lines, edge lines and road arrows',
    test: /\b(road marking|long white lines|white line along|white arrow on the road|curved arrow road marking|stop lines|solid white line at the side|edge of the carriageway)\b/i,
  },
  {
    slug: 'arm-and-headlight-signals',
    title: 'Arm signals and flashing headlights',
    test: /\b(arm signal|flash(?:ing)? (?:its |their )?headlights|official meaning of this signal|give signals to other road users)\b/i,
  },
  {
    slug: 'level-crossing',
    title: 'Level crossings',
    test: /\b(level crossing|railway|flashing as you approach a level|warning bells|flashing red light signals)\b/i,
  },
  {
    slug: 'no-entry-prohibition-signs',
    title: 'No entry and vehicle prohibition signs',
    test: /\b(no entry|no motor vehicles|no stopping|no through road|prohibition|no motorcycles)\b/i,
  },
  {
    slug: 'direction-turn-signs',
    title: 'Turn, one-way and keep-left signs',
    test: /\b(turn left|one[- ]way system|two[- ]way traffic)\b/i,
  },
  {
    slug: 'warning-hazard-signs',
    title: 'Warning signs for hazards ahead',
    test: /\b(double bend|dual carriageway ends|pedestrians may be walking|low bridge|hump bridge|quayside|water across the road)\b/i,
  },
  {
    slug: 'bus-lane-signs',
    title: 'Bus lanes and contraflow bus lanes',
    test: /\b(bus lane|contraflow bus|with[- ]flow bus)\b/i,
  },
  {
    slug: 'tram-signs',
    title: 'Trams and tram-only routes',
    test: /\b(trams?|tram rails|diamond[- ]shaped)\b/i,
  },
  {
    slug: 'tunnel-signs',
    title: 'Tunnels',
    test: /\b(tunnel)\b/i,
  },
  {
    slug: 'bleeding-burns-shock',
    title: 'Bleeding, burns and shock',
    test: /\b(bleeding|burns?|suffering from shock|warning sign for shock)\b/i,
  },
  {
    slug: 'defibrillator-aed',
    title: 'Public access defibrillators',
    test: /\b(defibrillator|aed)\b/i,
  },
  {
    slug: 'collision-legal-duties',
    title: 'Collision reporting and legal duties',
    test: /\b(produce after you.?ve been involved|damage to another vehicle|garden wall|information should you share)\b/i,
  },
  {
    slug: 'insurance-cover',
    title: 'Motor insurance cover',
    test: /\b(insurance|third[- ]party|excess of)\b/i,
  },
  {
    slug: 'sorn-tax-v5c',
    title: 'SORN, vehicle tax and the V5C',
    test: /\b(sorn|statutory off[- ]road|vehicle tax|registration certificate|v5c|vehicle registration)\b/i,
  },
  {
    slug: 'licence-new-driver',
    title: 'Licences, penalty points and new drivers',
    test: /\b(licence|penalty points|newly qualified|supervise a learner)\b/i,
  },
  {
    slug: 'producing-documents',
    title: 'Producing documents to the police',
    test: /\b(police officer asks to see your documents|how many days)\b/i,
  },
  {
    slug: 'towing-trailers',
    title: 'Towing, trailers and noseweight',
    test: /\b(tow|trailer|caravan|noseweight|hitch|mam|authorised mass)\b/i,
  },
  {
    slug: 'roof-racks-loads',
    title: 'Roof racks and vehicle loading',
    test: /\b(roof rack|heavy load|overloaded|load be carried)\b/i,
  },
  {
    slug: 'large-vehicles-following',
    title: 'Following and overtaking large vehicles',
    test: /\b(large vehicle|lorry|long, slow|keep well back|bus at a bus stop|heavy goods vehicle|hgv)\b/i,
  },
  {
    slug: 'emergency-vehicles',
    title: 'Emergency vehicles and blue lights',
    test: /\b(ambulance|blue lights|blue flashing|green flashing beacon)\b/i,
  },
  {
    slug: 'mobile-phone-distraction',
    title: 'Mobile phones and distractions',
    test: /\b(mobile phone|gps|diverted attention|hands[- ]free)\b/i,
  },
  {
    slug: 'u-turn-reverse',
    title: 'U-turns, reversing and turning in the road',
    test: /\b(u[- ]turn|reverse|reversing)\b/i,
  },
  {
    slug: 'single-track-passing',
    title: 'Single-track roads and passing places',
    test: /\b(single[- ]track|passing place|road that.s only wide enough for one)\b/i,
  },
  {
    slug: 'following-too-close',
    title: 'Being followed too closely',
    test: /\b(followed? (?:by an? )?(?:ambulance|vehicle behind)|following (?:too )?closely|vehicle behind approaches)\b/i,
  },
];

/**
 * Generic “what does this sign mean?” items may join these families when the
 * official meaning is that same teaching point. Broader buckets stay excluded
 * so unique signs are not glued back into one visual.
 */
const SIGN_MERGE_SLUGS = new Set([
  'box-junctions',
  'level-crossing',
  'roundabouts',
  'traffic-lights',
  'motorway-signals-red-cross',
  'motorway-reflective-studs',
  'pelican-puffin-toucan',
  'zebra-crossings',
  'bus-lane-signs',
  'give-way-stop',
  'clearway-stopping',
  'one-way-wrong-lane',
  'zigzag-markings',
  'hatched-areas',
  'double-white-lines',
  'tram-signs',
  'cycle-route-signs',
  'red-routes-traffic-calming',
  'tunnel-signs',
]);

const GENERIC_SIGN_PROMPT =
  /what does this (?:sign|signal|road marking|marking|motorway sign) mean|what do these (?:signs|motorway signs|overhead signs) mean|which sign (?:means|shows|warns)/i;

const COARSE: Array<{ test: RegExp; slug: string; title: string }> = [
  { test: /stopping distances, gaps, or safety margins/i, slug: 'stopping-distances', title: 'Stopping distances and safety margins' },
  { test: /right of way, junctions, or road-rule/i, slug: 'right-of-way', title: 'Right of way and junctions' },
  { test: /hazard perception or sharing the road/i, slug: 'hazard-vulnerable', title: 'Hazards and vulnerable road users' },
  { test: /road-situation|what should you do/i, slug: 'situational-high', title: 'What should you do' },
  { test: /situational driving judgement/i, slug: 'situational-judgement', title: 'Situational driving judgement' },
  { test: /asks for judgement or a driving action/i, slug: 'action-judgement', title: 'Driving action and judgement' },
  { test: /sign\/marking image but also asks/i, slug: 'sign-plus-action', title: 'Sign plus required action' },
  { test: /official stem plus sign\/marking image/i, slug: 'sign-identification', title: 'Sign and marking identification' },
  { test: /image-answer road-sign/i, slug: 'sign-option-images', title: 'Road-sign option images' },
  { test: /factual documents\/legal recall/i, slug: 'documents', title: 'Documents and legal recall' },
  { test: /vehicle equipment or legal-safety/i, slug: 'vehicle-equipment', title: 'Vehicle equipment and legal safety' },
  { test: /illustrated item with a substantial/i, slug: 'illustrated-optional', title: 'Illustrated item (optional card)' },
  { test: /official wording already covers/i, slug: 'factual-covered', title: 'Factual point already covered' },
  { test: /leave for human review/i, slug: 'human-review', title: 'Needs human review' },
];

function matchFamily(text: string): ConceptFamily | null {
  if (!text.trim()) return null;
  const hit = CONCEPT_FAMILIES.find((rule) => rule.test.test(text));
  return hit ? { slug: hit.slug, title: hit.title } : null;
}

export function slugifyMeaning(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

function uniqueSignFamily(questionId: string, meaning: string): ConceptFamily {
  const trimmed = meaning.trim();
  if (trimmed) {
    return {
      slug: `sign-meaning-${slugifyMeaning(trimmed)}`,
      title: `Traffic sign: ${trimmed}`,
    };
  }
  return {
    slug: `unique-sign-${questionId.toLowerCase()}`,
    title: `Unique traffic sign (${questionId})`,
  };
}

export function familyFromText(
  rec: ExplanationRecommendation,
  hint?: QuestionHint | null
): ConceptFamily {
  const prompt = String(hint?.promptEn || '');
  const meaning = String(hint?.correctOptionEn || '');
  const fromPrompt = matchFamily(prompt);
  if (fromPrompt) return fromPrompt;
  if (GENERIC_SIGN_PROMPT.test(prompt)) {
    const fromMeaning = matchFamily(meaning);
    if (fromMeaning && SIGN_MERGE_SLUGS.has(fromMeaning.slug)) return fromMeaning;
    return uniqueSignFamily(rec.question_id, meaning);
  }
  const coarse = COARSE.find((rule) => rule.test.test(rec.rationale));
  if (coarse) {
    if (
      meaning &&
      (coarse.slug === 'hazard-vulnerable' ||
        coarse.slug === 'sign-identification' ||
        coarse.slug === 'sign-plus-action' ||
        coarse.slug === 'illustrated-optional')
    ) {
      return {
        slug: `scene-${slugifyMeaning(meaning)}`,
        title: `Illustrated scene: ${meaning}`,
      };
    }
    return { slug: `${rec.topic}--${coarse.slug}`, title: `${humanTopic(rec.topic)} — ${coarse.title}` };
  }
  return { slug: `${rec.topic}--topic-format`, title: humanTopic(rec.topic) };
}

export function humanTopic(topic: string): string {
  return String(topic || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function isCrossTopicFamily(slug: string): boolean {
  return !slug.includes('--');
}
