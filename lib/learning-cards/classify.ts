/**
 * Phase 5B explanation-card classifier.
 *
 * Uses official question text, options, topic, image flags, and existing
 * explanation_en as inputs. Does not invent explanations. Recommendations
 * are pedagogical suggestions only — never DVSA-approved.
 */

import {
  CLASSIFIER_VERSION,
  type ExplanationClassification,
  type ExplanationFormat,
  type ExplanationPriority,
  type ExplanationRecommendation,
} from './types';

export interface ClassifyQuestionInput {
  id: string;
  topic: string;
  promptEn: string;
  options: Array<{ en?: string; image?: string | null }>;
  explanationEn?: string | null;
  image?: string | null;
  answerImageUrls?: Array<string | null | undefined>;
}

const SIGN_ID =
  /\b(this sign|this marking|this signal|this road marking|this traffic sign|shown in the picture|shown below|what does this (sign|marking|signal) mean|which sign|which of these signs)\b/i;

const SITUATION =
  /\b(what should you (do|be)|what would you|why (should|would|must|do)|right of way|give way|priority|stopping distance|thinking distance|braking distance|overall stopping|two[- ]second|four[- ]second|hazard|vulnerable|pedestrian|cyclist|horse rider|junction|roundabout|box junction|overtake|blind spot|u-turn|fog|ice|snow|aquaplan|night|dark|rain|motorway|hard shoulder)\b/i;

const DISTANCE =
  /\b(stopping distance|thinking distance|braking distance|overall stopping|two[- ]second|4[- ]second|gap of|metres? behind)\b/i;

const JUNCTION_RIGHT_OF_WAY =
  /\b(right of way|give way|who has priority|who should wait|emerging|crossroads|box junction|filter lane)\b/i;

const FACTUAL_DOCS =
  /\b(insurance|mot |log book|photocard|driving licence|counterpart|sorn|vehicle registration|theory test certificate)\b/i;

const HIGH_TOPICS = new Set([
  'safety-margins',
  'hazard-awareness',
  'rules-of-the-road',
  'vulnerable-road-users',
]);

const MEDIUM_TOPICS = new Set([
  'alertness',
  'attitude',
  'motorway-driving',
  'vehicle-handling',
  'incidents',
  'other-vehicles',
  'vehicle-loading',
]);

export function classifyExplanationNeed(q: ClassifyQuestionInput): ExplanationRecommendation {
  const prompt = String(q.promptEn || '');
  const expl = String(q.explanationEn || '');
  const topic = String(q.topic || '');
  const hasImage = Boolean(q.image && String(q.image).trim());
  const hasOptionImages = (q.options || []).some((o) => Boolean(o.image && String(o.image).trim()))
    || (q.answerImageUrls || []).some((u) => Boolean(u && String(u).trim()));
  const signId = SIGN_ID.test(prompt) || (topic === 'road-signs' && hasImage && !SITUATION.test(prompt));
  const situational = SITUATION.test(prompt) || DISTANCE.test(prompt) || DISTANCE.test(expl);
  const rightOfWay = JUNCTION_RIGHT_OF_WAY.test(prompt) || JUNCTION_RIGHT_OF_WAY.test(expl);
  const docsFactual = topic === 'documents' || FACTUAL_DOCS.test(prompt);

  let recommended: ExplanationClassification;
  let rationale: string;
  let priority: ExplanationPriority;
  let format: ExplanationFormat;

  if (signId && !situational && !rightOfWay) {
    recommended = 'image_is_enough';
    priority = 'low';
    format = 'image';
    rationale =
      'Official stem plus sign/marking image, correct option, and existing official explanation are enough; a custom card is not a priority.';
  } else if (DISTANCE.test(prompt) || DISTANCE.test(expl) || topic === 'safety-margins') {
    recommended = 'needs_explanation';
    priority = 'high';
    format = 'diagram';
    rationale =
      'Stopping distances, gaps, or safety margins benefit from an extra educational diagram beyond the official explanation.';
  } else if (rightOfWay || topic === 'rules-of-the-road' && situational) {
    recommended = 'needs_explanation';
    priority = 'high';
    format = hasImage ? 'image' : 'diagram';
    rationale =
      'Right of way, junctions, or road-rule reasoning is a good candidate for a custom explanation card.';
  } else if (topic === 'hazard-awareness' || topic === 'vulnerable-road-users' || /hazard|vulnerable|pedestrian|cyclist/i.test(prompt)) {
    recommended = 'needs_explanation';
    priority = 'high';
    format = hasImage ? 'image' : 'text';
    rationale =
      'Hazard perception or sharing the road with vulnerable users usually needs extra reasoning, not only the official answer.';
  } else if (situational && HIGH_TOPICS.has(topic)) {
    recommended = 'needs_explanation';
    priority = 'high';
    format = hasImage ? 'image' : 'text';
    rationale = 'This is a road-situation / “what should you do” item where a custom card can teach the why.';
  } else if (situational && MEDIUM_TOPICS.has(topic)) {
    recommended = 'needs_explanation';
    priority = 'medium';
    format = /motorway|hard shoulder|fog|ice/i.test(prompt) ? 'video' : hasImage ? 'image' : 'text';
    rationale = 'Situational driving judgement in this topic is likely to benefit from an extra explanation.';
  } else if (signId && situational) {
    recommended = 'review_later';
    priority = 'medium';
    format = 'image';
    rationale =
      'Has a sign/marking image but also asks for action or judgement. A human should decide if a custom card adds value.';
  } else if (docsFactual && !situational) {
    recommended = 'image_is_enough';
    priority = 'low';
    format = 'text';
    rationale =
      'Mostly factual documents/legal recall. Official question, answer, and explanation are usually sufficient.';
  } else if (topic === 'road-signs' && hasOptionImages && !situational) {
    recommended = 'image_is_enough';
    priority = 'low';
    format = 'image';
    rationale = 'Image-answer road-sign identification: official options and explanation are sufficient.';
  } else if (topic === 'safety-vehicle' && !situational) {
    recommended = 'image_is_enough';
    priority = 'low';
    format = 'text';
    rationale = 'Vehicle equipment or legal-safety recall with a complete official explanation; custom card not a priority.';
  } else if (hasImage && !situational && expl.length > 80) {
    recommended = 'image_is_enough';
    priority = 'low';
    format = 'image';
    rationale =
      'Illustrated item with a substantial official explanation. A custom card is optional, not required.';
  } else if (!situational && !hasImage && expl.length > 40 && (docsFactual || topic === 'safety-vehicle' || topic === 'documents')) {
    recommended = 'image_is_enough';
    priority = 'low';
    format = 'text';
    rationale = 'Official wording already covers this factual point; extra card is not a priority.';
  } else if (situational) {
    recommended = 'needs_explanation';
    priority = MEDIUM_TOPICS.has(topic) ? 'medium' : 'medium';
    format = 'text';
    rationale = 'Asks for judgement or a driving action; an extra explanation card is likely useful.';
  } else {
    recommended = 'review_later';
    priority = 'low';
    format = hasImage ? 'image' : 'text';
    rationale =
      'Not clearly a sign-only item and not clearly a reasoning item. Leave for human review before commissioning a card.';
  }

  return {
    question_id: q.id,
    topic,
    has_image: hasImage,
    has_option_images: hasOptionImages,
    recommended_classification: recommended,
    rationale,
    priority,
    suggested_format: format,
    classifier_version: CLASSIFIER_VERSION,
    dvsa_approved: false,
  };
}
