/**
 * Original English hint drafts for admin review.
 *
 * Wording is written for learners and is not a copy of the official DVSA
 * explanation. The official text is used only to choose which rule applies.
 * Drafts are unreviewed and must not be shown to learners until an admin saves.
 */

export interface HintDraftInput {
  prompt: string;
  explanation?: string | null;
  topic?: string | null;
}

export interface HintDraftResult {
  english: string;
  rule_id: string;
}

type Rule = {
  id: string;
  test: (prompt: string, explanation: string) => boolean;
  english: string;
};

function has(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

const RULES: Rule[] = [
  {
    id: 'cpr-child',
    test: (p) => has(p, /cpr|cardiopulmonary/i) && has(p, /child|6-year|infant/i),
    english:
      'Child chest compressions are gentler than adult ones. For a child you may need only one hand, and you press a little less deeply than you would for an adult. For a baby, use two fingers and press about a third of the chest depth. Keep the rate steady and do not stop to guess.',
  },
  {
    id: 'cpr-depth',
    test: (p, e) => has(p + e, /cpr|cardiopulmonary/i) && has(p + e, /depth|centimetre|5 to 6|5-6/i),
    english:
      'If an adult is not breathing normally, circulation has to be kept going by hand. Put two hands in the centre of the chest and press down about 5 to 6 centimetres. The depth matters: too shallow does not move blood, and you should not lean on the chest between presses.',
  },
  {
    id: 'cpr-rate',
    test: (p, e) => has(p + e, /cpr|cardiopulmonary/i) && has(p + e, /rate|how fast|times per minute|twice a second|twice per second/i),
    english:
      'Chest compressions only work if they are fast enough to keep blood moving. Aim for about two presses every second, which is 120 a minute, and keep going until the person breathes normally or a trained responder takes over.',
  },
  {
    id: 'cpr-general',
    test: (p, e) => has(p + e, /cpr|cardiopulmonary|not breathing/i),
    english:
      'When someone is unconscious and not breathing normally, chest compressions keep blood moving until help arrives. Make the scene safe, get the emergency services coming, and do not abandon compressions to look for equipment unless another person can take over.',
  },
  {
    id: 'aed',
    test: (p, e) => has(p + e, /defibrillator|aed\b/i),
    english:
      'A public defibrillator speaks its own instructions, so you do not need training before you fetch or use one. Send someone else for it while compressions continue, and switch it on as soon as it arrives. Anyone can use it.',
  },
  {
    id: 'recovery-shock-bleed',
    test: (p, e) => has(p + e, /recovery position|shock|bleeding|burns/i),
    english:
      'Deal with what is killing the person first. Heavy bleeding needs firm pressure on the wound if nothing is stuck in it. An unconscious person who is breathing goes in the recovery position so the airway stays open. Shock needs warmth and reassurance, and you should not give food or drink. Do not move someone unless they are in immediate danger.',
  },
  {
    id: 'helmet-incident',
    test: (p, e) => has(p + e, /helmet/i),
    english:
      'Leave a motorcyclist’s helmet on unless the airway is blocked and you cannot clear it any other way. Removing it can worsen a neck injury. Support the head and wait for the emergency services when the person is breathing.',
  },
  {
    id: 'incident-first',
    test: (p, e) => has(p + e, /incident|collision|crash|injured/i) && has(p, /first|help|should you|could you|must you/i),
    english:
      'At a crash, your first job is to keep yourself and others from being hit again. Warn traffic, switch on hazard lights if you can do so safely, and call the emergency services. Only then help the injured, and do not move a casualty who is breathing unless they are in danger.',
  },
  {
    id: 'stopping-ice',
    test: (p, e) => has(p + e, /stopping distance|icy|ice/i) && has(p + e, /10 times|ten times|icy/i),
    english:
      'Ice cuts tyre grip so sharply that the gap you need can grow to about ten times the dry stopping distance. Slow down early, use gentle steering and brakes, and do not assume ABS will save a gap that is too short.',
  },
  {
    id: 'stopping-wet-gap',
    test: (p, e) => has(p + e, /wet road|in the wet|wet weather|surface spray/i) && has(p + e, /second|gap|separation/i),
    english:
      'A two-second gap is the dry-road minimum. Water reduces grip, so double that gap to at least four seconds on a wet road. Pick a fixed point and make sure you pass it at least four seconds after the vehicle in front.',
  },
  {
    id: 'stopping-two-second',
    test: (p, e) => has(p + e, /two-second|2-second|time gap|separation gap|too close|too closely/i),
    english:
      'The safe gap is a time, not a guess in car lengths. On a dry road leave at least two seconds. Choose a stationary object, and you should reach it no sooner than two seconds after the vehicle in front has passed it. Increase the gap in rain, fog or when tired.',
  },
  {
    id: 'stopping-distance-method',
    test: (p, e) => has(p + e, /stopping distance|thinking distance|braking distance/i),
    english:
      'Overall stopping distance is thinking distance plus braking distance. Thinking distance is travelled before the brakes start to work and it grows with speed. Braking distance is longer on wet, icy or loose surfaces and when the tyres or brakes are poor. Do not answer with only one of those two parts when the question asks for the overall distance.',
  },
  {
    id: 'skid-abs',
    test: (p, e) => has(p + e, /skid|anti-lock|abs\b|aquaplan/i),
    english:
      'A skid means the tyres have lost grip, usually because of too much speed, harsh braking or a poor surface. Ease off the accelerator and steer gently in the direction you want to go. ABS lets you steer while braking hard, but it does not shorten the stop on ice or loose gravel, and it cannot grip a road that is not there.',
  },
  {
    id: 'coasting',
    test: (p, e) => has(p + e, /coasting|neutral|clutch/i) && has(p + e, /downhill|engine brak|neutral/i),
    english:
      'Coasting — rolling in neutral or with the clutch down — takes away engine braking. The car speeds up more easily downhill and you have less control if you need to accelerate or slow. Stay in a gear that matches the speed, especially on a hill.',
  },
  {
    id: 'fog-lights-driving',
    test: (p, e) => has(p + e, /fog/i),
    english:
      'Use fog lights only when visibility is seriously reduced, which is when you cannot see more than about 100 metres. They dazzle other people if you leave them on in clear weather. In fog, slow down so you can stop in the distance you can see, and use dipped headlights.',
  },
  {
    id: 'lights-dazzle',
    test: (p, e) => has(p + e, /dazzl|main beam|dipped|headlights|fog light/i),
    english:
      'Use the light that lets you see without blinding someone else. Dip your headlights for oncoming traffic, when following, and in a lit built-up area. Main beam is for dark open roads with no one ahead. Fog lights are not a substitute for dipped headlights and should be switched off once you can see clearly.',
  },
  {
    id: 'motorway-breakdown',
    test: (p, e) => has(p + e, /hard shoulder|emergency telephone|breaks? down on a motorway|emergency area/i),
    english:
      'If you break down on a motorway, get the car off the live lanes if you can, onto the hard shoulder or an emergency area. Leave the vehicle from the side away from traffic and stand well back, up the bank if there is one. Walk to the nearest emergency phone in the direction of the arrows, and do not try to rejoin until there is a safe gap.',
  },
  {
    id: 'red-cross',
    test: (p, e) => has(p + e, /red cross/i),
    english:
      'A red cross above a lane means that lane is closed. Move out of it as soon as you can do so safely, even if the lane looks empty. A red cross above the hard shoulder means the hard shoulder is not open as a running lane. Do not drive under a red cross.',
  },
  {
    id: 'reflective-studs',
    test: (p, e) => has(p + e, /reflective studs/i),
    english:
      'Motorway studs are a colour code, not decoration. Amber is the right-hand edge, red is the left-hand edge beside the hard shoulder, green marks a slip road, and white separates the lanes. Use the colours to know which edge you are near when it is dark or wet.',
  },
  {
    id: 'motorway-lanes',
    test: (p, e) => has(p + e, /right-hand lane|left-hand lane|crawler|climbing lane|three-lane motorway/i),
    english:
      'Use the nearside lane for normal driving and the outer lane only while you are passing someone. Move back in once you have passed. Some slower vehicles are not allowed in the outer lane. A climbing lane on a hill lets those vehicles stay out of the way.',
  },
  {
    id: 'motorway-general',
    test: (p, e) => has(p + e, /motorway/i),
    english:
      'Motorway driving is about lane discipline, early signs and matching your speed to the conditions. Stay left unless overtaking, do not stop on the carriageway, and obey overhead signals at once. Learners and some slow vehicles are not allowed on the motorway at all.',
  },
  {
    id: 'cyclists-horses',
    test: (p, e) => has(p + e, /cyclist|horse/i),
    english:
      'People on bicycles and horses are slower and less protected than cars. Give them at least as much room as you would when overtaking a car — about a car’s width where you can — and pass slowly. Expect a cyclist to look behind or move out at a junction, and do not sound the horn or rev next to a horse.',
  },
  {
    id: 'pedestrians-vulnerable',
    test: (p, e) => has(p + e, /pedestrian|child|school|older people|white stick|disabled/i),
    english:
      'The people most at risk are those on foot, especially children, older people and anyone who cannot see or hear you well. Slow down near schools, parked cars and crossings, and be ready to stop. A white stick, a guide dog or reflective clothing is a warning to give that person time and space.',
  },
  {
    id: 'crossings',
    test: (p, e) => has(p + e, /pelican|puffin|toucan|zebra|crossing/i),
    english:
      'Crossings give people on foot priority once they are using them. A pelican’s flashing amber means you may go only if the crossing is clear. A puffin uses sensors and does not flash amber in the same way. A toucan is shared with cyclists, so look for people riding as well as walking. Never wave someone across or hurry them.',
  },
  {
    id: 'junction-priority',
    test: (p, e) => has(p + e, /priority|give way|right of way|crossroads|box junction|roundabout/i),
    english:
      'Priority is something you give, not something you take. At an unmarked junction, watch the traffic from your right. A stop line means stop and look, even if you think it is clear. On a roundabout, give way to traffic already on it and signal when you are leaving. Do not enter a box junction unless your exit is clear.',
  },
  {
    id: 'traffic-lights',
    test: (p, e) => has(p + e, /traffic light|red and amber|green light|amber light/i),
    english:
      'Red means stop. Red with amber means stop and wait: the next light will be green, but you must not move yet. Amber on its own means stop unless you are so close that stopping would cause a crash. A green light means go only if the way is clear — you still wait if the junction is blocked or a pedestrian is crossing.',
  },
  {
    id: 'level-crossing',
    test: (p, e) => has(p + e, /level crossing|railway/i),
    english:
      'Treat a level crossing as closed until you can see it is safe. If the red lights keep flashing after a train, another train may be coming, so wait. If your vehicle stalls on the crossing, get everyone out and clear of the tracks, then call the signal operator. Do not try to push the car clear if a train is coming.',
  },
  {
    id: 'overtaking',
    test: (p, e) => has(p + e, /overtak/i),
    english:
      'Overtake only when you can see far enough and you will not force anyone else to change speed or direction. Do not overtake on a bend, the brow of a hill, a junction, or where the road marking forbids it. After passing, move back only when you can see the overtaken vehicle in your mirror.',
  },
  {
    id: 'mirrors-blind',
    test: (p, e) => has(p + e, /mirror|blind spot/i),
    english:
      'Mirrors show most of what is behind, but not the blind spots beside you. Check mirrors before you signal, change speed or change direction, then look over your shoulder before you move sideways. A convex mirror covers more area but makes vehicles look further away than they are.',
  },
  {
    id: 'alcohol-drugs-tired',
    test: (p, e) => has(p + e, /alcohol|drink|drug|tired|fatigue|concentrat|distract|medicine|mobile phone|sat nav/i),
    english:
      'Anything that slows your reactions makes a crash more likely. Alcohol, drugs, some medicines, tiredness and a phone all do that, even hands-free. If you feel drowsy, stop in a safe place. Do not start a journey when you are over the limit or unfit, and do not try to calculate whether you are “just under”.',
  },
  {
    id: 'horn',
    test: (p, e) => has(p + e, /\bhorn\b/i),
    english:
      'The horn is a warning of danger, not a way to express impatience. Use it only when someone might not have seen you. Do not sound it when stationary, except to avoid a danger, and avoid using it in a built-up area between 11.30 pm and 7 am unless there is a danger.',
  },
  {
    id: 'speed-towing',
    test: (p, e) => has(p + e, /towing|trailer|caravan/i) && has(p + e, /speed limit|mph/i),
    english:
      'A car towing a trailer or caravan has a lower limit than a car on its own. On a motorway and on a dual carriageway the limit is 60 mph, and it is 50 mph on a single carriageway, unless a lower sign applies. The national car limits do not carry over to the combination.',
  },
  {
    id: 'towing-load',
    test: (p, e) => has(p + e, /tow|trailer|caravan|roof rack|overload|noseweight/i),
    english:
      'A load changes how the car brakes, steers and sits in side wind. Keep the weight low and secure, do not let passengers ride in a towed caravan, and check the car’s towing limit and noseweight in the handbook. A new driver is also limited in the trailer mass they may tow.',
  },
  {
    id: 'weather-wind',
    test: (p, e) => has(p + e, /wind|spray|flood|snow|hot weather|soft/i),
    english:
      'Weather changes both grip and the space you need. Side wind pushes high-sided vehicles and you as you leave a shelter. Spray means slow down and keep your distance. After flood water, test the brakes. In snow, gentle control and a low gear help you move off without spinning the wheels.',
  },
  {
    id: 'hazard-scene',
    test: (p) => has(p, /hazard|what should the driver|arrowed|be aware|anticipate|especially aware/i),
    english:
      'Look for the person or vehicle that is about to do something unexpected. Parked cars hide children and opening doors. A pedestrian already in the road, a cyclist you are following, or a vehicle about to turn all need you to ease off early rather than wait until you are on top of them.',
  },
  {
    id: 'signs-action',
    test: (p) => has(p, /when you see this sign|this signal|what should you do/i),
    english:
      'Read the sign as an instruction for the situation, not as a name to memorise. A stop or give-way sign still needs you to judge the gap. A warning sign means look for that hazard and be ready to slow down. Do the action that keeps you and others safe, even if the sign looks familiar.',
  },
  {
    id: 'documents-legal',
    test: (p, e) =>
      has(p + e, /licence|insurance|mot\b|tax|sorn|seat belt|eyesight|glasses|registration certificate|poor health/i),
    english:
      'These rules are legal duties, not tips. You must be fit to drive, wear a seat belt unless an exemption applies, and keep the vehicle insured and roadworthy. If your eyesight no longer meets the standard, stop driving and tell the licensing authority. After a collision that causes damage, you must stop and exchange details.',
  },
  {
    id: 'parking',
    test: (p, e) => has(p + e, /park|clearway|red route|zigzag/i),
    english:
      'Park only where you will not block vision, access or a special bay. Do not stop on a clearway or urban clearway during its hours, on yellow zigzags outside a school, or in a disabled bay unless you are entitled to. At night, face the direction of traffic and do not leave the car where it forces others wide.',
  },
  {
    id: 'following-position',
    test: (p) => has(p, /position in good time|turn right ahead/i),
    english:
      'Get into the correct lane early so people behind understand what you are about to do. A late move forces others to brake and hides your intention.',
  },
  {
    id: 'emerging-view',
    test: (p) => has(p, /emerging|restricted|must you do at this junction|junction on the left be kept clear/i),
    english:
      'If you cannot see the road you are joining, creep forward until you can, and do not rely on someone else stopping. Keep a junction exit clear so traffic is not trapped across the path of others.',
  },
  {
    id: 'older-new-drivers',
    test: (p) => has(p, /older drivers|inexperienced/i),
    english:
      'Allow extra time for drivers who may react more slowly or hesitate. That includes older people and newly qualified drivers. Do not pressure them by following closely or flashing.',
  },
  {
    id: 'traffic-calming',
    test: (p) => has(p, /traffic-calming|road humps/i),
    english:
      'Road humps and other calming measures are there to slow traffic. Ease off in good time and drive over them slowly. Do not swerve between them.',
  },
  {
    id: 'edge-line',
    test: (p) => has(p, /solid white line at the side/i),
    english:
      'A solid white line along the edge of the road marks the side of the carriageway. Do not cross it unless you have a reason, such as stopping in an emergency or passing a blockage.',
  },
  {
    id: 'trams',
    test: (p) => has(p, /tram/i),
    english:
      'Tram rails are slippery and the tram cannot steer around you. Do not drive on the rails, and give trams room at stops where passengers cross.',
  },
  {
    id: 'stop-sign-reason',
    test: (p) => has(p, /stop' sign|stop sign and a stop line/i),
    english:
      'A stop sign is used where the view is so poor that a give-way line would not be enough. You must actually stop and look, even when the road seems quiet.',
  },
  {
    id: 'police-signal',
    test: (p) => has(p, /police officer/i),
    english:
      'A police officer’s signal overrides the lights and the signs. If you are signalled to stop, pull up safely. Flashing headlights and a pointed direction from a following police car means pull over on that side.',
  },
  {
    id: 'arm-signal',
    test: (p) => has(p, /arm signal/i),
    english:
      'An arm signal repeats your indicator when another person might miss the lights. For a left turn, extend your left arm straight out. Use it clearly, then return both hands to the wheel.',
  },
  {
    id: 'signal-timing',
    test: (p) => has(p, /when should you signal|pull up just after/i),
    english:
      'Signal early enough to warn others, but not so early that your signal describes the wrong junction. If you are stopping just after a junction, wait until you have passed it before you signal, so nobody thinks you are turning in.',
  },
  {
    id: 'temporary-limit',
    test: (p) => has(p, /temporary speed limit|roadworks/i),
    english:
      'A temporary limit at roadworks replaces the normal limit while it is shown. Obey the posted figure even if the road looks clear. The lower speed is there because workers or a changed layout may be just ahead.',
  },
  {
    id: 'reverse-main',
    test: (p) => has(p, /reverse from a side road|reversing into a side road/i),
    english:
      'Reversing into a main road means you are backing into traffic you cannot see well. It is safer to reverse into the side road while the way is clear, then drive out forwards.',
  },
  {
    id: 'bus-lane',
    test: (p) => has(p, /bus lane/i),
    english:
      'Use a bus lane only when the sign says your vehicle and the time of day are allowed. Outside those times, or when the lane is reserved, stay out of it.',
  },
  {
    id: 'secure-unattended',
    test: (p) => has(p, /unattended|broken into|radio being stolen/i),
    english:
      'Take valuables with you or lock them out of sight, close the windows, and lock the car. A visible bag or radio is an invitation. At night, park where the car can be seen.',
  },
  {
    id: 'journey-planning',
    test: (p) => has(p, /plan your route|appointment|busy times|volume of traffic/i),
    english:
      'Leave enough time for the journey, including rest stops, and avoid the busiest hours when you can. Planning the route before you move means you are not reading a map or rushing because you are late.',
  },
  {
    id: 'driver-fitness',
    test: (p) => has(p, /suitable shoes|battery|four-wheel-drive|stability control|blind-spot monitoring|markers/i),
    english:
      'Small details still change control of the car. Wear shoes that let you feel the pedals, keep driver-assistance sensors clean, and remember that four-wheel drive and stability control do not let you ignore ice or speed. Dispose of a battery at a proper recycling point, and learn what the warning markers on a large vehicle are telling you.',
  },
  {
    id: 'vehicle-control',
    test: (p, e) => has(p + e, /brake|tyre|steering|engine|kick-down|cruise/i),
    english:
      'The car only responds as well as its tyres, brakes and the gear you are in. Under-inflated or worn tyres lengthen the stop. Engine braking helps you slow without riding the brake, especially downhill. Driver aids such as cruise control or stability control help, but they do not replace looking ahead and leaving a gap.',
  },
];

const TOPIC_FALLBACK: Record<string, string> = {
  alertness:
    'Stay aware of the whole scene, not only the vehicle in front. Check what is behind and beside you before you change course, and remove anything that takes your attention off the road.',
  attitude:
    'A calm style gives everyone more time. Leave space, do not punish another driver’s mistake, and let people merge or cross when it is safe.',
  'hazard-awareness':
    'The hazard is usually the thing that is about to move into your path. Ease off as soon as you see it so you still have a choice.',
  incidents:
    'Make the scene safe, call for help, and look after the injured without creating a second collision. Do not move a breathing casualty unless they are in danger.',
  'motorway-driving':
    'On a motorway, keep left unless you are overtaking, obey the overhead signals, and do not stop on the carriageway.',
  'other-vehicles':
    'Large and slow vehicles need more room to turn, stop and be passed. Give them space and do not assume they can move over for you.',
  'road-signs':
    'Use the sign to decide the next safe action. Shape and colour tell you whether it is an order, a warning or information, and you still have to look at the road.',
  'rules-of-the-road':
    'Follow the marking and the priority even when another driver seems to be waving you on. If you are unsure, wait.',
  'safety-vehicle':
    'A fault in the tyres, brakes, lights or steering is a reason to stop using the car, not a warning to ignore until the next journey.',
  'safety-margins':
    'The gap in front of you is your thinking time. Increase it when the road is wet, icy, foggy or when you are tired.',
  'vehicle-handling':
    'Match your speed and gear to the road surface. Smooth steering and braking keep the tyres gripping.',
  'vehicle-loading':
    'A badly loaded or overweight vehicle steers and brakes differently. Secure the load and stay within the limits for the car and your licence.',
  'vulnerable-road-users':
    'People walking, riding or using a mobility vehicle have less protection. Slow down and give them room before you think you need to.',
  documents:
    'Keep the legal documents and the vehicle’s condition up to date. These questions have a set answer in the rules, so learn the duty rather than a shortcut.',
};

const SITUATION_CLAUSES: Array<{ test: RegExp; text: string }> = [
  {
    test: /icy|ice|snow/i,
    text: 'Here the surface is cold and slippery, so a normal dry-road gap is far too short.',
  },
  {
    test: /wet/i,
    text: 'Here the road is wet, so allow more room and more time than you would when it is dry.',
  },
  {
    test: /fog/i,
    text: 'Here you are dealing with fog, so you must be able to stop within the distance you can see.',
  },
  {
    test: /night|dark|dazzl/i,
    text: 'Here it is dark, so choose lights that let you see without dazzling other people.',
  },
  {
    test: /motorway/i,
    text: 'This is on a motorway, so lane choice and the overhead signals matter as much as your speed.',
  },
  {
    test: /roundabout/i,
    text: 'At this roundabout, give way to traffic already circulating and signal as you leave.',
  },
  {
    test: /level crossing|railway/i,
    text: 'This is a railway crossing, so wait until the warning has fully ended.',
  },
  {
    test: /cyclist/i,
    text: 'A cyclist is part of this situation, so leave them room and expect a change of position.',
  },
  {
    test: /horse/i,
    text: 'A horse is easily startled, so pass wide and slowly.',
  },
  {
    test: /child|school/i,
    text: 'Children may move without looking, especially near a school or between parked cars.',
  },
  {
    test: /towing|trailer|caravan/i,
    text: 'The vehicle is towing, so the limits and the handling are not the same as for a car alone.',
  },
];

function specificClause(prompt: string, english: string): string {
  const extra = SITUATION_CLAUSES.find((clause) => clause.test.test(prompt) && !english.includes(clause.text.slice(0, 24)));
  return extra ? ` ${extra.text}` : '';
}

export function composeLearnerHint(input: HintDraftInput): HintDraftResult {
  const prompt = String(input.prompt || '');
  const explanation = String(input.explanation || '');
  const topic = String(input.topic || '');
  const matched = RULES.find((rule) => rule.test(prompt, explanation));
  const base = matched
    ? { english: matched.english, rule_id: matched.id }
    : {
        english: TOPIC_FALLBACK[topic] || TOPIC_FALLBACK['rules-of-the-road'],
        rule_id: `topic:${topic || 'general'}`,
      };
  return {
    english: `${base.english}${specificClause(prompt, base.english)}`.trim(),
    rule_id: base.rule_id,
  };
}
