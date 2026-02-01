/**
 * UK Driving Theory Question Generator
 * 
 * This script helps generate new, original questions for the UK Car Driving Theory Test.
 * Questions must be original and not copied from official DVSA materials.
 * 
 * Usage: Run with Node.js and provide batch specifications.
 */

// Topic definitions matching the app structure
const TOPICS = {
  'alertness': 'الانتباه والتركيز أثناء القيادة',
  'hazard-awareness': 'التنبّه للمخاطر وتوقعها',
  'road-signs': 'إشارات وعلامات الطريق',
  'safety-margins': 'مسافات الأمان والتوقف',
  'rules-of-the-road': 'قوانين الطريق وأولويات المرور',
  'vulnerable-road-users': 'مستخدمي الطريق الأكثر عرضة للخطر',
  'vehicle-handling': 'التحكم بالمركبة في مختلف الظروف',
  'incidents': 'التعامل مع الحوادث والطوارئ',
  'documents': 'الوثائق والرخص والتأمين',
  'motorway-driving': 'القيادة على الطرق السريعة',
  'other-vehicles': 'المركبات الأخرى (شاحنات – باصات – دراجات)',
  'vehicle-loading': 'تحميل المركبة والحمولة والتوازن',
  'attitude': 'سلوك السائق وآداب القيادة',
  'safety-vehicle': 'سلامة المركبة والصيانة الأساسية',
};

/**
 * Question template structure
 * 
 * {
 *   id: "AUTO-GENERATED",
 *   topic: "<topic-key>",
 *   promptEn: "<English question>",
 *   promptAr: "<Arabic translation>",
 *   options: [
 *     { en: "<option>", ar: "<translation>", correct: false },
 *     { en: "<option>", ar: "<translation>", correct: false },
 *     { en: "<option>", ar: "<translation>", correct: false },
 *     { en: "<option>", ar: "<translation>", correct: true }
 *   ],
 *   keywords: [
 *     { term: "<term>", ar: "<translation>", explainAr: "<explanation>" }
 *   ]
 * }
 */

/**
 * Batch specifications for question generation
 */
const BATCH_SPECS = {
  batch1: {
    name: 'Road Signs',
    count: 40,
    topics: ['road-signs'],
    coverage: [
      'Warning signs (bends, junctions, animals, slippery road)',
      'Regulatory signs (speed limits, no entry, no overtaking)',
      'Mandatory signs (blue direction arrows, cycle lanes)',
      'Sign shapes (triangle, circle, rectangle, octagon)',
      'Road markings (zigzag lines, give way lines, stop lines)'
    ]
  },
  batch2: {
    name: 'Speed, Distance & Safety Margins',
    count: 35,
    topics: ['safety-margins', 'vehicle-handling'],
    coverage: [
      'Stopping distances at different speeds',
      'Two-second and four-second rules',
      'Effects of rain, ice, fog',
      'Why coasting is dangerous',
      'Following distances'
    ]
  },
  batch3: {
    name: 'Motorway Driving',
    count: 45,
    topics: ['motorway-driving'],
    coverage: [
      'Lane discipline',
      'Speed limits (cars, trailers)',
      'Hard shoulder rules',
      'Breakdowns and emergency phones',
      'Reflective studs on motorways',
      'Overtaking rules'
    ]
  },
  batch4: {
    name: 'Hazard Awareness & Alertness',
    count: 30,
    topics: ['hazard-awareness', 'alertness'],
    coverage: [
      'Children near parked cars',
      'Pedestrians stepping out',
      'Cyclists swerving',
      'Tiredness and concentration',
      'Anticipation of hazards'
    ]
  },
  batch5: {
    name: 'Vulnerable Road Users',
    count: 30,
    topics: ['vulnerable-road-users'],
    coverage: [
      'Pedestrian crossings (zebra, pelican, puffin, toucan)',
      'Elderly pedestrians',
      'Cyclists and motorcyclists',
      'Horse riders',
      'Overtaking distances'
    ]
  },
  batch6: {
    name: 'Weather, Lights & Visibility',
    count: 30,
    topics: ['vehicle-handling'],
    coverage: [
      'Fog lights (front & rear)',
      'Visibility below 100 metres',
      'Driving in rain, snow, ice',
      'Dazzle at night',
      'Aquaplaning'
    ]
  },
  batch7: {
    name: 'Vehicle Safety & Documents',
    count: 30,
    topics: ['safety-vehicle', 'documents'],
    coverage: [
      'Tyre tread depth',
      'Brakes and warning lights',
      'Seat belts and child seats',
      'MOT rules',
      'Insurance requirements',
      'Eyesight rules'
    ]
  },
  batch8: {
    name: 'Incidents, Law & Attitude',
    count: 30,
    topics: ['incidents', 'attitude'],
    coverage: [
      'What to do at an accident',
      'First priorities (danger, breathing, bleeding)',
      'Dealing with aggressive drivers',
      'Mobile phone law',
      'Alcohol and drugs',
      'Fatigue and emotions'
    ]
  }
};

/**
 * Generate a unique question ID based on topic and sequence
 */
function generateQuestionId(topic, sequence) {
  const topicPrefixes = {
    'alertness': 'AL',
    'hazard-awareness': 'HZ',
    'road-signs': 'RS',
    'safety-margins': 'SM',
    'rules-of-the-road': 'RR',
    'vulnerable-road-users': 'VU',
    'vehicle-handling': 'VH',
    'incidents': 'IN',
    'documents': 'DC',
    'motorway-driving': 'MW',
    'other-vehicles': 'OV',
    'vehicle-loading': 'VL',
    'attitude': 'AT',
    'safety-vehicle': 'SV'
  };
  
  const prefix = topicPrefixes[topic] || 'QX';
  const seq = String(sequence).padStart(2, '0');
  return `${prefix}-${seq}`;
}

/**
 * Format question object as JavaScript code
 */
function formatQuestion(question) {
  const optionsStr = question.options.map(opt => 
    `      { en: ${JSON.stringify(opt.en)}, ar: ${JSON.stringify(opt.ar)}, correct: ${opt.correct} }`
  ).join(',\n');
  
  const keywordsStr = question.keywords.length > 0
    ? question.keywords.map(kw =>
        `      { term: ${JSON.stringify(kw.term)}, ar: ${JSON.stringify(kw.ar)}, explainAr: ${JSON.stringify(kw.explainAr)} }`
      ).join(',\n')
    : '';
  
  const keywordsArray = keywordsStr 
    ? `[\n${keywordsStr}\n    ]`
    : '[]';
  
  let result = `  {\n    id: "${question.id}",\n    topic: "${question.topic}",\n    promptEn: ${JSON.stringify(question.promptEn)},\n    promptAr: ${JSON.stringify(question.promptAr)},\n    options: [\n${optionsStr}\n    ],\n    keywords: ${keywordsArray}`;
  
  if (question.image) {
    result += `,\n    image: "${question.image}"`;
  }
  
  result += '\n  }';
  return result;
}

/**
 * Export batch specifications and utility functions
 */
module.exports = {
  TOPICS,
  BATCH_SPECS,
  generateQuestionId,
  formatQuestion
};

/**
 * CLI usage example
 */
if (require.main === module) {
  console.log('UK Driving Theory Question Generator');
  console.log('=====================================\n');
  console.log('Available batches:');
  Object.entries(BATCH_SPECS).forEach(([key, spec]) => {
    console.log(`  ${key}: ${spec.name} (${spec.count} questions, topics: ${spec.topics.join(', ')})`);
  });
  console.log('\nThis script provides utilities for question generation.');
  console.log('Use it as a module or integrate with AI/question generation tools.');
}

