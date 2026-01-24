/**
 * Example questions demonstrating the correct format
 * These are samples only - generate new questions for actual use
 */

// Example 1: Road Signs
const exampleRoadSign = {
  id: "RS-XX",
  topic: "road-signs",
  promptEn: "What does a triangular sign with a red border showing two children indicate?",
  promptAr: "ماذا تعني علامة مثلثة بحدود حمراء تُظهر طفلين؟",
  options: [
    { en: "Children crossing ahead", ar: "عبور أطفال قادم", correct: true },
    { en: "School zone only", ar: "منطقة مدرسة فقط", correct: false },
    { en: "Playground nearby", ar: "ملعب قريب", correct: false },
    { en: "No children allowed", ar: "ممنوع دخول الأطفال", correct: false }
  ],
  keywords: [
    { term: "triangular sign", ar: "علامة مثلثة", explainAr: "علامة تحذيرية تنبّه لمخاطر محتملة على الطريق." },
    { term: "children crossing", ar: "عبور أطفال", explainAr: "منطقة قد يعبرها أطفال - يجب تخفيف السرعة والانتباه." }
  ]
};

// Example 2: Safety Margins
const exampleSafetyMargin = {
  id: "SM-XX",
  topic: "safety-margins",
  promptEn: "In wet conditions, how much longer is your stopping distance compared to dry conditions?",
  promptAr: "في الظروف الرطبة، كم يزيد مسافة التوقف مقارنة بالظروف الجافة؟",
  options: [
    { en: "At least double", ar: "ضعف على الأقل", correct: true },
    { en: "The same distance", ar: "نفس المسافة", correct: false },
    { en: "Half the distance", ar: "نصف المسافة", correct: false },
    { en: "Three times longer", ar: "ثلاثة أضعاف", correct: false }
  ],
  keywords: [
    { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تقطعها المركبة من لحظة إدراكك للخطر حتى التوقف الكامل." },
    { term: "wet conditions", ar: "ظروف رطبة", explainAr: "أثناء المطر أو على طرق مبللة حيث يقل الاحتكاك." }
  ]
};

// Example 3: Motorway Driving
const exampleMotorway = {
  id: "MW-XX",
  topic: "motorway-driving",
  promptEn: "What should you do if you break down on a motorway?",
  promptAr: "ماذا يجب أن تفعل إذا تعطلت سيارتك على طريق سريع؟",
  options: [
    { en: "Pull onto the hard shoulder and call for help", ar: "توقف على الكتف الصلب واطلب المساعدة", correct: true },
    { en: "Stay in the left lane with hazards on", ar: "ابق في المسار الأيسر مع أضواء التحذير", correct: false },
    { en: "Drive slowly to the next exit", ar: "قد ببطء حتى المخرج التالي", correct: false },
    { en: "Stop in any lane", ar: "توقف في أي مسار", correct: false }
  ],
  keywords: [
    { term: "hard shoulder", ar: "الكتف الصلب", explainAr: "المسار الجانبي للطوارئ على الطريق السريع." },
    { term: "break down", ar: "تعطل", explainAr: "توقف المركبة عن العمل بسبب عطل ميكانيكي." }
  ]
};

module.exports = {
  exampleRoadSign,
  exampleSafetyMargin,
  exampleMotorway
};

