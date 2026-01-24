export interface Question {
  id: string;
  topic: string;
  promptEn: string;
  promptAr: string;
  options: { en: string; ar: string; correct: boolean }[];
  keywords: { term: string; ar: string; explainAr: string }[];
  image?: string; // path to an image in /public
}

export const questions: Question[] = [
  // --- ALERTNESS ---

  {
    id: "AL-01",
    topic: "alertness",
    promptEn: "When driving on a quiet road, what should you do regularly to stay aware of traffic behind you?",
    promptAr: "عند القيادة على طريق هادئ، ماذا يجب أن تفعل بانتظام لتبقى منتبهاً لحركة المرور خلفك؟",
    options: [
      { en: "Check your mirrors frequently", ar: "تحقق من المرايا بشكل متكرر", correct: true },
      { en: "Turn on your hazard lights", ar: "شغّل أضواء التحذير", correct: false },
      { en: "Drive in the middle of the road", ar: "قد في منتصف الطريق", correct: false },
      { en: "Speed up to avoid vehicles behind you", ar: "زد السرعة لتتجنب المركبات خلفك", correct: false }
    ],
    keywords: [
      { term: "mirrors", ar: "المرايا", explainAr: "تساعدك على رؤية المركبات خلفك وعلى الجانبين." },
      { term: "aware", ar: "منتبه", explainAr: "مدرك لما يحدث حولك أثناء القيادة." }
    ]
  },

  {
    id: "AL-02",
    topic: "alertness",
    promptEn: "You're looking for a house number while driving. What is the main risk?",
    promptAr: "أنت تبحث عن رقم منزل أثناء القيادة. ما هو الخطر الرئيسي؟",
    options: [
      { en: "Losing concentration on the road ahead", ar: "فقدان التركيز على الطريق أمامك", correct: true },
      { en: "Driving faster than normal", ar: "القيادة أسرع من المعتاد", correct: false },
      { en: "Forgetting to use indicators", ar: "نسيان استخدام الإشارات", correct: false },
      { en: "Causing your engine to stall", ar: "توقف المحرك", correct: false }
    ],
    keywords: [
      { term: "concentration", ar: "التركيز", explainAr: "قدرتك على متابعة الطريق دون تشتت." }
    ]
  },

  {
    id: "AL-03",
    topic: "alertness",
    promptEn: "What is a clear sign that you're becoming tired while driving?",
    promptAr: "ما العلامة الواضحة التي تدل على أنك بدأت تشعر بالتعب أثناء القيادة؟",
    options: [
      { en: "Difficulty keeping a steady speed", ar: "صعوبة الحفاظ على سرعة ثابتة", correct: true },
      { en: "Driving much faster", ar: "القيادة أسرع بكثير", correct: false },
      { en: "Feeling more confident", ar: "الشعور بثقة أكبر", correct: false },
      { en: "Sharper vision", ar: "رؤية أوضح", correct: false }
    ],
    keywords: [
      { term: "steady speed", ar: "سرعة ثابتة", explainAr: "علامة على أنك ما زلت مسيطر ومركز." }
    ]
  },

  {
    id: "AL-04",
    topic: "alertness",
    promptEn: "Before changing lanes, what should you do besides checking mirrors?",
    promptAr: "قبل تغيير المسار، ماذا يجب أن تفعل بالإضافة إلى فحص المرايا؟",
    options: [
      { en: "Check your blind spot", ar: "افحص النقطة العمياء", correct: true },
      { en: "Increase your speed", ar: "زد سرعتك", correct: false },
      { en: "Flash your headlights", ar: "ومض أضواء سيارتك", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false }
    ],
    keywords: [
      { term: "blind spot", ar: "النقطة العمياء", explainAr: "منطقة لا تظهر في المرايا ويجب رؤيتها بالتفاتة سريعة." }
    ]
  },

  {
    id: "AL-05",
    topic: "alertness",
    promptEn: "Why is using a handheld mobile phone while driving dangerous?",
    promptAr: "لماذا يعتبر استخدام هاتف محمول باليد أثناء القيادة خطيراً؟",
    options: [
      { en: "It distracts your attention from the road", ar: "لأنه يشتت انتباهك عن الطريق", correct: true },
      { en: "It improves reaction time", ar: "يحسن زمن الاستجابة", correct: false },
      { en: "It saves fuel", ar: "يوفر الوقود", correct: false },
      { en: "It helps you focus more", ar: "يساعد على التركيز أكثر", correct: false }
    ],
    keywords: [
      { term: "distracts", ar: "يشتت", explainAr: "يبعد تركيزك عن متابعة الطريق." }
    ]
  },

  {
    id: "AL-06",
    topic: "alertness",
    promptEn: "You are following a large vehicle. How can you improve your view of the road ahead?",
    promptAr: "أنت تتبع مركبة كبيرة. كيف يمكنك تحسين رؤيتك للطريق أمامك؟",
    options: [
      { en: "Keep a longer distance", ar: "حافظ على مسافة أطول", correct: true },
      { en: "Move closer to the vehicle", ar: "اقترب من المركبة", correct: false },
      { en: "Drive on the pavement", ar: "قد على الرصيف", correct: false },
      { en: "Use high-beam headlights", ar: "استخدم الأضواء العالية", correct: false }
    ],
    keywords: [
      { term: "distance", ar: "مسافة", explainAr: "ترك مسافة يسمح لك برؤية أفضل وردّة فعل أسرع." }
    ]
  },

  {
    id: "AL-5201",
    topic: "alertness",
    promptEn: "You are driving on a long, straight road and start to feel drowsy. What should you do?",
    promptAr: "أثناء القيادة على طريق طويل ومستقيم، تبدأ بالشعور بالنعاس. ماذا يجب أن تفعل؟",
    options: [
      { en: "Open a window and keep driving", ar: "فتح النافذة ومتابعة القيادة", correct: false },
      { en: "Stop in a safe place and take a break", ar: "التوقف في مكان آمن وأخذ استراحة", correct: true },
      { en: "Increase your speed to stay alert", ar: "زيادة السرعة للبقاء متيقظًا", correct: false },
      { en: "Turn the radio volume up", ar: "رفع صوت الراديو", correct: false }
    ],
    keywords: [
      { term: "drowsy", ar: "نعاس", explainAr: "الشعور بالنعاس أثناء القيادة خطر جدًا ويجب التوقف فورًا." },
      { term: "fatigue", ar: "إرهاق", explainAr: "الإرهاق يقلل من قدرتك على التركيز ورد الفعل." },
      { term: "break", ar: "استراحة", explainAr: "أخذ استراحة ضروري عند الشعور بالتعب أو النعاس." }
    ]
  },

  {
    id: "AL-5202",
    topic: "alertness",
    promptEn: "How can tiredness affect your driving?",
    promptAr: "كيف يمكن أن يؤثر التعب على قيادتك؟",
    options: [
      { en: "It improves reaction time", ar: "يحسن سرعة رد الفعل", correct: false },
      { en: "It reduces concentration and reaction time", ar: "يقلل التركيز وسرعة رد الفعل", correct: true },
      { en: "It has no effect in daylight", ar: "ليس له تأثير في النهار", correct: false },
      { en: "It only affects new drivers", ar: "يؤثر فقط على السائقين الجدد", correct: false }
    ],
    keywords: [
      { term: "tiredness", ar: "تعب", explainAr: "التعب يؤثر على جميع السائقين بغض النظر عن الخبرة." },
      { term: "reaction time", ar: "سرعة رد الفعل", explainAr: "التعب يبطئ من سرعة رد الفعل مما يزيد من خطر الحوادث." },
      { term: "concentration", ar: "تركيز", explainAr: "التركيز ضروري للقيادة الآمنة والتعب يقلله بشكل كبير." }
    ]
  },

  {
    id: "AL-5203",
    topic: "alertness",
    promptEn: "You have been driving for two hours without a break. What is the safest action?",
    promptAr: "قدت السيارة لمدة ساعتين دون استراحة. ما الإجراء الأكثر أمانًا؟",
    options: [
      { en: "Continue driving if traffic is light", ar: "متابعة القيادة إذا كانت الحركة خفيفة", correct: false },
      { en: "Take a break for at least 15 minutes", ar: "أخذ استراحة لا تقل عن 15 دقيقة", correct: true },
      { en: "Drink an energy drink and continue", ar: "شرب مشروب طاقة والمتابعة", correct: false },
      { en: "Lower the temperature in the car", ar: "خفض درجة حرارة السيارة", correct: false }
    ],
    keywords: [
      { term: "long journey", ar: "رحلة طويلة", explainAr: "الرحلات الطويلة تتطلب استراحات منتظمة للبقاء متيقظًا." },
      { term: "break", ar: "استراحة", explainAr: "يُنصح بأخذ استراحة كل ساعتين على الأقل أثناء القيادة الطويلة." },
      { term: "fatigue", ar: "إرهاق", explainAr: "الإرهاق يتراكم مع الوقت ويزيد من خطر الحوادث." }
    ]
  },

  {
    id: "AL-5204",
    topic: "alertness",
    promptEn: "Why is it dangerous to drive when you are angry or upset?",
    promptAr: "لماذا تعتبر القيادة أثناء الغضب أو الانزعاج خطيرة؟",
    options: [
      { en: "You may drive faster than normal", ar: "قد تقود أسرع من المعتاد", correct: false },
      { en: "Your judgement and concentration can be affected", ar: "قد يتأثر حكمك وتركيزك", correct: true },
      { en: "It only affects night driving", ar: "يؤثر فقط على القيادة الليلية", correct: false },
      { en: "Other drivers will notice", ar: "سيراك السائقون الآخرون", correct: false }
    ],
    keywords: [
      { term: "emotions", ar: "مشاعر", explainAr: "المشاعر القوية مثل الغضب تؤثر على قدرتك على القيادة بأمان." },
      { term: "anger", ar: "غضب", explainAr: "الغضب يضعف الحكم والتركيز ويزيد من السلوك العدواني في القيادة." },
      { term: "judgement", ar: "حكم", explainAr: "الحكم السليم ضروري لاتخاذ قرارات آمنة أثناء القيادة." }
    ]
  },

  {
    id: "AL-5205",
    topic: "alertness",
    promptEn: "What should you do if you feel stressed before starting a journey?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت بالتوتر قبل بدء الرحلة؟",
    options: [
      { en: "Start driving to calm down", ar: "البدء بالقيادة للهدوء", correct: false },
      { en: "Delay your journey until you feel calmer", ar: "تأجيل الرحلة حتى تشعر بالهدوء", correct: true },
      { en: "Drive faster to get it over with", ar: "القيادة بسرعة لإنهائها", correct: false },
      { en: "Ignore the feeling", ar: "تجاهل الشعور", correct: false }
    ],
    keywords: [
      { term: "stress", ar: "توتر", explainAr: "التوتر يؤثر على التركيز واتخاذ القرارات أثناء القيادة." },
      { term: "emotions", ar: "مشاعر", explainAr: "من المهم أن تكون في حالة ذهنية هادئة قبل القيادة." },
      { term: "safe driving", ar: "قيادة آمنة", explainAr: "القيادة الآمنة تتطلب حالة ذهنية مستقرة وهادئة." }
    ]
  },

  {
    id: "AL-5206",
    topic: "alertness",
    promptEn: "How does alcohol affect your ability to drive?",
    promptAr: "كيف يؤثر الكحول على قدرتك على القيادة؟",
    options: [
      { en: "It improves confidence", ar: "يزيد الثقة", correct: false },
      { en: "It reduces coordination and reaction time", ar: "يقلل التناسق وسرعة رد الفعل", correct: true },
      { en: "It only affects new drivers", ar: "يؤثر فقط على السائقين الجدد", correct: false },
      { en: "It has no effect in small amounts", ar: "ليس له تأثير بكميات صغيرة", correct: false }
    ],
    keywords: [
      { term: "alcohol", ar: "كحول", explainAr: "الكحول يؤثر على جميع السائقين حتى بكميات صغيرة." },
      { term: "reaction time", ar: "سرعة رد الفعل", explainAr: "الكحول يبطئ من سرعة رد الفعل بشكل كبير." },
      { term: "coordination", ar: "تناسق", explainAr: "الكحول يقلل من التناسق الحركي والقدرة على التحكم في السيارة." }
    ]
  },

  {
    id: "AL-5207",
    topic: "alertness",
    promptEn: "You are driving late at night and feel your eyes closing. What should you do?",
    promptAr: "أثناء القيادة في وقت متأخر من الليل، تشعر بأن عينيك تُغلقان. ماذا يجب أن تفعل؟",
    options: [
      { en: "Open the window and continue", ar: "فتح النافذة والمتابعة", correct: false },
      { en: "Stop safely and rest or sleep", ar: "التوقف بأمان والراحة أو النوم", correct: true },
      { en: "Drink coffee and continue immediately", ar: "شرب القهوة والمتابعة فورًا", correct: false },
      { en: "Increase radio volume", ar: "رفع صوت الراديو", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "قيادة ليلية", explainAr: "القيادة الليلية تتطلب يقظة إضافية بسبب التعب الطبيعي." },
      { term: "sleepy", ar: "نعاس", explainAr: "الشعور بالنعاس أثناء القيادة خطر جدًا ويجب التوقف فورًا." },
      { term: "rest", ar: "راحة", explainAr: "الراحة أو النوم ضروريان عند الشعور بالنعاس الشديد." }
    ]
  },

  {
    id: "AL-5208",
    topic: "alertness",
    promptEn: "Why is using a mobile phone while driving dangerous?",
    promptAr: "لماذا يعتبر استخدام الهاتف المحمول أثناء القيادة خطيرًا؟",
    options: [
      { en: "It increases fuel use", ar: "يزيد استهلاك الوقود", correct: false },
      { en: "It distracts your attention from the road", ar: "يشتت انتباهك عن الطريق", correct: true },
      { en: "It affects only slow driving", ar: "يؤثر فقط على القيادة البطيئة", correct: false },
      { en: "It improves reaction speed", ar: "يحسن سرعة رد الفعل", correct: false }
    ],
    keywords: [
      { term: "mobile phone", ar: "هاتف محمول", explainAr: "استخدام الهاتف المحمول أثناء القيادة محظور قانونيًا وخطير جدًا." },
      { term: "distraction", ar: "إلهاء", explainAr: "الإلهاء أثناء القيادة يقلل من التركيز ويزيد من خطر الحوادث." },
      { term: "attention", ar: "انتباه", explainAr: "الانتباه الكامل للطريق ضروري للقيادة الآمنة." }
    ]
  },

  {
    id: "AL-5209",
    topic: "alertness",
    promptEn: "What is the best way to stay alert on a long journey?",
    promptAr: "ما أفضل طريقة للحفاظ على اليقظة في رحلة طويلة؟",
    options: [
      { en: "Drive faster", ar: "القيادة بسرعة أكبر", correct: false },
      { en: "Take regular breaks", ar: "أخذ استراحات منتظمة", correct: true },
      { en: "Listen to loud music only", ar: "الاستماع لموسيقى صاخبة فقط", correct: false },
      { en: "Open the window", ar: "فتح النافذة", correct: false }
    ],
    keywords: [
      { term: "long journey", ar: "رحلة طويلة", explainAr: "الرحلات الطويلة تتطلب تخطيطًا ووعيًا بالحاجة للراحة." },
      { term: "alertness", ar: "يقظة", explainAr: "اليقظة ضرورية للقيادة الآمنة وخاصة في الرحلات الطويلة." },
      { term: "breaks", ar: "استراحات", explainAr: "الاستراحات المنتظمة تساعد على الحفاظ على اليقظة والتركيز." }
    ]
  },

  {
    id: "AL-5210",
    topic: "alertness",
    promptEn: "Why is concentration important when driving?",
    promptAr: "لماذا يعتبر التركيز مهمًا أثناء القيادة؟",
    options: [
      { en: "To reduce fuel consumption", ar: "لتقليل استهلاك الوقود", correct: false },
      { en: "To respond quickly to hazards", ar: "للاستجابة السريعة للمخاطر", correct: true },
      { en: "To impress other drivers", ar: "لإبهار السائقين الآخرين", correct: false },
      { en: "To drive faster", ar: "للقيادة بشكل أسرع", correct: false }
    ],
    keywords: [
      { term: "concentration", ar: "تركيز", explainAr: "التركيز الكامل على الطريق ضروري لرصد المخاطر والاستجابة لها." },
      { term: "hazards", ar: "مخاطر", explainAr: "المخاطر على الطريق تتطلب استجابة سريعة وتركيزًا كاملاً." },
      { term: "reaction", ar: "رد فعل", explainAr: "التركيز الجيد يسمح برد فعل أسرع وأكثر فعالية للمخاطر." }
    ]
  },

  {
    id: "AL-5211",
    topic: "alertness",
    promptEn: "You are driving after a poor night's sleep. What risk does this increase?",
    promptAr: "تقود السيارة بعد نوم سيئ في الليلة السابقة. ما الخطر الذي يزداد بسبب ذلك؟",
    options: [
      { en: "Better decision-making", ar: "اتخاذ قرارات أفضل", correct: false },
      { en: "Slower reactions and reduced awareness", ar: "بطء ردود الفعل وانخفاض الانتباه", correct: true },
      { en: "Improved concentration", ar: "تحسن التركيز", correct: false },
      { en: "No change to driving ability", ar: "لا يوجد تغيير على القدرة على القيادة", correct: false }
    ],
    keywords: [
      { term: "lack of sleep", ar: "نقص النوم", explainAr: "النوم السيئ يقلل من اليقظة ويزيد من خطر الحوادث." },
      { term: "reaction time", ar: "زمن رد الفعل", explainAr: "النوم السيئ يبطئ من سرعة رد الفعل عند مواجهة المخاطر." },
      { term: "awareness", ar: "الانتباه", explainAr: "الانتباه الكامل ضروري لرصد المخاطر على الطريق." }
    ]
  },

  {
    id: "AL-5212",
    topic: "alertness",
    promptEn: "What is a common early warning sign of driver fatigue?",
    promptAr: "ما إحدى العلامات المبكرة الشائعة لتعب السائق؟",
    options: [
      { en: "Improved focus", ar: "تحسن التركيز", correct: false },
      { en: "Difficulty keeping your eyes open", ar: "صعوبة في إبقاء العينين مفتوحتين", correct: true },
      { en: "Faster reactions", ar: "ردود فعل أسرع", correct: false },
      { en: "Increased confidence", ar: "زيادة الثقة", correct: false }
    ],
    keywords: [
      { term: "fatigue", ar: "التعب", explainAr: "التعب يقلل من قدرة السائق على التركيز والاستجابة." },
      { term: "warning signs", ar: "علامات التحذير", explainAr: "من المهم التعرف على علامات التعب مبكرًا لتجنب الحوادث." },
      { term: "sleepy", ar: "نعاس", explainAr: "الشعور بالنعاس أثناء القيادة خطر جدًا ويجب التوقف فورًا." }
    ]
  },

  {
    id: "AL-5213",
    topic: "alertness",
    promptEn: "Why is it dangerous to rely on caffeine to stay awake while driving?",
    promptAr: "لماذا يعتبر الاعتماد على الكافيين للبقاء مستيقظًا أثناء القيادة أمرًا خطيرًا؟",
    options: [
      { en: "It improves long-term alertness", ar: "يحسن اليقظة على المدى الطويل", correct: false },
      { en: "Its effect is temporary and does not replace rest", ar: "تأثيره مؤقت ولا يعوض النوم", correct: true },
      { en: "It affects fuel efficiency", ar: "يؤثر على كفاءة الوقود", correct: false },
      { en: "It only works at night", ar: "يعمل فقط ليلاً", correct: false }
    ],
    keywords: [
      { term: "caffeine", ar: "الكافيين", explainAr: "الكافيين لا يعوض النوم الحقيقي وله تأثير مؤقت فقط." },
      { term: "fatigue", ar: "التعب", explainAr: "التعب يحتاج إلى راحة حقيقية وليس فقط منبهات." },
      { term: "temporary effect", ar: "تأثير مؤقت", explainAr: "تأثير الكافيين مؤقت ولا يحل مشكلة التعب الأساسية." }
    ]
  },

  {
    id: "AL-5214",
    topic: "alertness",
    promptEn: "You are driving and keep missing road signs. What is the most likely cause?",
    promptAr: "أثناء القيادة، تلاحظ أنك تفوّت إشارات الطريق باستمرار. ما السبب الأكثر احتمالاً؟",
    options: [
      { en: "Poor road layout", ar: "تخطيط طريق سيئ", correct: false },
      { en: "Reduced concentration", ar: "انخفاض التركيز", correct: true },
      { en: "Vehicle fault", ar: "عطل في المركبة", correct: false },
      { en: "Weather conditions only", ar: "الطقس فقط", correct: false }
    ],
    keywords: [
      { term: "missed signs", ar: "إشارات مفقودة", explainAr: "تفويت إشارات الطريق يشير إلى فقدان التركيز." },
      { term: "concentration", ar: "التركيز", explainAr: "التركيز الكامل ضروري لرصد جميع إشارات الطريق." },
      { term: "attention", ar: "الانتباه", explainAr: "الانتباه المستمر للطريق وإشاراته ضروري للسلامة." }
    ]
  },

  {
    id: "AL-5215",
    topic: "alertness",
    promptEn: "What should you do if you feel unwell before driving?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت بالتوعك قبل القيادة؟",
    options: [
      { en: "Drive slowly and continue", ar: "القيادة ببطء والمتابعة", correct: false },
      { en: "Avoid driving until you feel fit", ar: "تجنب القيادة حتى تشعر بأنك بخير", correct: true },
      { en: "Drink coffee and start driving", ar: "شرب القهوة والبدء بالقيادة", correct: false },
      { en: "Open the window", ar: "فتح النافذة", correct: false }
    ],
    keywords: [
      { term: "illness", ar: "المرض", explainAr: "المرض يقلل من قدرة السائق على التركيز والاستجابة." },
      { term: "fitness to drive", ar: "اللياقة للقيادة", explainAr: "يجب أن تكون بصحة جيدة ولياقة كاملة قبل القيادة." },
      { term: "safety", ar: "السلامة", explainAr: "السلامة تتطلب أن يكون السائق في حالة صحية جيدة." }
    ]
  },

  {
    id: "AL-5216",
    topic: "alertness",
    promptEn: "Why can driving for long periods without stopping reduce safety?",
    promptAr: "لماذا يمكن أن تقل السلامة عند القيادة لفترات طويلة دون توقف؟",
    options: [
      { en: "Fuel consumption increases", ar: "يزداد استهلاك الوقود", correct: false },
      { en: "Concentration and reaction time decrease", ar: "ينخفض التركيز وسرعة رد الفعل", correct: true },
      { en: "Speed limits change", ar: "تتغير حدود السرعة", correct: false },
      { en: "The engine overheats", ar: "يسخن المحرك", correct: false }
    ],
    keywords: [
      { term: "long driving", ar: "القيادة الطويلة", explainAr: "القيادة لفترات طويلة تسبب التعب وتقلل من التركيز." },
      { term: "concentration", ar: "التركيز", explainAr: "التركيز يقل مع طول مدة القيادة دون راحة." },
      { term: "reaction time", ar: "زمن رد الفعل", explainAr: "التعب يبطئ من سرعة رد الفعل عند مواجهة المخاطر." }
    ]
  },

  {
    id: "AL-5217",
    topic: "alertness",
    promptEn: "How can emotional stress affect your driving?",
    promptAr: "كيف يمكن أن يؤثر التوتر العاطفي على قيادتك؟",
    options: [
      { en: "It improves awareness", ar: "يحسن الانتباه", correct: false },
      { en: "It can lead to poor judgement and mistakes", ar: "قد يؤدي إلى سوء التقدير وارتكاب أخطاء", correct: true },
      { en: "It has no effect on driving", ar: "ليس له أي تأثير", correct: false },
      { en: "It only affects experienced drivers", ar: "يؤثر فقط على السائقين ذوي الخبرة", correct: false }
    ],
    keywords: [
      { term: "stress", ar: "التوتر", explainAr: "التوتر العاطفي يشتت الانتباه ويؤثر على قدرة اتخاذ القرارات." },
      { term: "judgement", ar: "التقدير", explainAr: "التوتر يضعف قدرة السائق على التقدير الصحيح للمواقف." },
      { term: "mistakes", ar: "الأخطاء", explainAr: "التوتر يزيد من احتمالية ارتكاب الأخطاء أثناء القيادة." }
    ]
  },

  {
    id: "AL-5218",
    topic: "alertness",
    promptEn: "What is the safest action if your concentration starts to wander while driving?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا بدأ تركيزك يتشتت أثناء القيادة؟",
    options: [
      { en: "Drive faster to refocus", ar: "القيادة أسرع لإعادة التركيز", correct: false },
      { en: "Stop safely and take a break", ar: "التوقف بأمان وأخذ استراحة", correct: true },
      { en: "Ignore it and continue", ar: "تجاهله والمتابعة", correct: false },
      { en: "Turn up the music", ar: "رفع صوت الموسيقى", correct: false }
    ],
    keywords: [
      { term: "loss of focus", ar: "فقدان التركيز", explainAr: "فقدان التركيز أثناء القيادة خطر ويحتاج إلى إجراء فوري." },
      { term: "break", ar: "استراحة", explainAr: "أخذ استراحة يساعد على استعادة التركيز واليقظة." },
      { term: "safe driving", ar: "القيادة الآمنة", explainAr: "القيادة الآمنة تتطلب تركيزًا كاملاً في جميع الأوقات." }
    ]
  },

  {
    id: "AL-5219",
    topic: "alertness",
    promptEn: "Why is it important to be mentally alert when driving in busy traffic?",
    promptAr: "لماذا من المهم أن تكون متيقظًا ذهنيًا عند القيادة في حركة مرور كثيفة؟",
    options: [
      { en: "To reduce journey time", ar: "لتقليل زمن الرحلة", correct: false },
      { en: "To respond quickly to changing situations", ar: "للاستجابة السريعة للمواقف المتغيرة", correct: true },
      { en: "To drive closer to other vehicles", ar: "للقيادة قرب المركبات الأخرى", correct: false },
      { en: "To increase speed safely", ar: "لزيادة السرعة بأمان", correct: false }
    ],
    keywords: [
      { term: "busy traffic", ar: "حركة مرور كثيفة", explainAr: "الحركة المرورية الكثيفة تتطلب انتباهًا وتركيزًا أكبر." },
      { term: "mental alertness", ar: "اليقظة الذهنية", explainAr: "اليقظة الذهنية ضرورية للاستجابة السريعة للمواقف المتغيرة." },
      { term: "reaction", ar: "رد الفعل", explainAr: "الاستجابة السريعة للمواقف المتغيرة تتطلب يقظة ذهنية كاملة." }
    ]
  },

  {
    id: "AL-5220",
    topic: "alertness",
    promptEn: "What is the main benefit of planning regular rest breaks on long journeys?",
    promptAr: "ما الفائدة الأساسية من التخطيط لاستراحات منتظمة في الرحلات الطويلة؟",
    options: [
      { en: "Saving fuel", ar: "توفير الوقود", correct: false },
      { en: "Maintaining alertness and reducing fatigue", ar: "الحفاظ على اليقظة وتقليل التعب", correct: true },
      { en: "Avoiding traffic delays", ar: "تجنب التأخير المروري", correct: false },
      { en: "Improving vehicle performance", ar: "تحسين أداء المركبة", correct: false }
    ],
    keywords: [
      { term: "rest breaks", ar: "استراحات", explainAr: "الاستراحات المنتظمة ضرورية للحفاظ على اليقظة أثناء الرحلات الطويلة." },
      { term: "long journey", ar: "رحلة طويلة", explainAr: "الرحلات الطويلة تتطلب تخطيطًا للاستراحات للحفاظ على السلامة." },
      { term: "alertness", ar: "اليقظة", explainAr: "الحفاظ على اليقظة أثناء الرحلات الطويلة يتطلب استراحات منتظمة." }
    ]
  },

  // --- HAZARD AWARENESS ---

  {
    id: "HZ-01",
    topic: "hazard-awareness",
    promptEn: "A ball rolls into the road ahead. What should you do?",
    promptAr: "تتدحرج كرة إلى الطريق أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Speed up to pass quickly", ar: "زد السرعة لتتجاوز بسرعة", correct: false },
      { en: "Slow down and be ready to stop", ar: "خفّف السرعة واستعد للتوقف", correct: true },
      { en: "Ignore it", ar: "تجاهلها", correct: false },
      { en: "Use your horn continuously", ar: "استخدم البوق باستمرار", correct: false }
    ],
    keywords: [
      { term: "hazard", ar: "خطر محتمل", explainAr: "قد يكون هناك طفل يركض خلف الكرة." }
    ]
  },

  {
    id: "HZ-02",
    topic: "hazard-awareness",
    promptEn: "A pedestrian is looking at their phone while approaching a crossing. What should you expect?",
    promptAr: "أحد المشاة ينظر إلى هاتفه أثناء اقترابه من ممر المشاة. ماذا يجب أن تتوقع؟",
    options: [
      { en: "They will wait for your signal", ar: "سينتظرون إشارة منك", correct: false },
      { en: "They won't cross at all", ar: "لن يعبروا أبداً", correct: false },
      { en: "They may step into the road without looking", ar: "قد يخطون للطريق دون أن ينظروا", correct: true },
      { en: "They will walk faster to avoid you", ar: "سيمشون أسرع لتفاديك", correct: false }
    ],
    keywords: [
      { term: "pedestrian", ar: "مشاة", explainAr: "الأشخاص الذين يعبرون الطريق." }
    ]
  },

  {
    id: "HZ-03",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle signaling left but continuing straight. What does this suggest?",
    promptAr: "ترى مركبة تشغّل إشارة اليسار لكنها تستمر بشكل مستقيم. ماذا يعني ذلك؟",
    options: [
      { en: "They want you to overtake", ar: "يريدونك أن تتجاوز", correct: false },
      { en: "They are avoiding a hazard", ar: "يتجنبون خطراً", correct: false },
      { en: "The driver may not have cancelled the signal", ar: "قد يكون السائق لم يُلغِ الإشارة", correct: true },
      { en: "They want to stop immediately", ar: "يريدون التوقف فوراً", correct: false }
    ],
    keywords: [
      { term: "signal", ar: "إشارة", explainAr: "إشارة الانعطاف قد تبقى شغالة بالخطأ." }
    ]
  },

  {
    id: "HZ-04",
    topic: "hazard-awareness",
    promptEn: "Traffic ahead suddenly slows down. What should you do?",
    promptAr: "تباطأت حركة المرور أمامك فجأة. ماذا يجب أن تفعل؟",
    options: [
      { en: "Brake early and gently", ar: "استخدم الفرامل مبكرًا وبلطف", correct: true },
      { en: "Brake hard at the last moment", ar: "استخدم الفرامل بقوة في اللحظة الأخيرة", correct: false },
      { en: "Increase speed", ar: "زد السرعة", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-05",
    topic: "hazard-awareness",
    promptEn: "Why should you be cautious on a narrow country road?",
    promptAr: "لماذا يجب أن تكون حذراً على طريق ريفي ضيق؟",
    options: [
      { en: "There may be hidden hazards around bends", ar: "قد تكون هناك مخاطر مخفية خلف المنعطفات", correct: true },
      { en: "The road is always one-way", ar: "الطريق دائماً باتجاه واحد", correct: false },
      { en: "Speed limits are higher", ar: "حدود السرعة أعلى", correct: false },
      { en: "No vehicles use these roads", ar: "لا توجد مركبات على هذه الطرق", correct: false }
    ],
    keywords: [
      { term: "bends", ar: "منعطفات", explainAr: "قد تخفي مركبات قادمة أو مشاة." }
    ]
  },

  {
    id: "HZ-06",
    topic: "hazard-awareness",
    promptEn: "A cyclist ahead is swerving side to side. What should you do?",
    promptAr: "هناك درّاج أمامك يتحرك بشكل غير مستقر يميناً ويساراً. ماذا يجب أن تفعل؟",
    options: [
      { en: "Slow down and give extra space", ar: "خفف السرعة واترك مساحة إضافية", correct: true },
      { en: "Overtake immediately", ar: "تجاوز فوراً", correct: false },
      { en: "Use your horn", ar: "استخدم البوق", correct: false },
      { en: "Flash headlights", ar: "ومض بالأضواء", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-07",
    topic: "hazard-awareness",
    promptEn: "A car is reversing out of a driveway. What should you do?",
    promptAr: "هناك سيارة ترجع للخلف من ممر خاص. ماذا يجب أن تفعل؟",
    options: [
      { en: "Be prepared to stop", ar: "كن مستعداً للتوقف", correct: true },
      { en: "Increase your speed", ar: "زد سرعتك", correct: false },
      { en: "Drive around it quickly", ar: "قد حولها بسرعة", correct: false },
      { en: "Ignore it", ar: "تجاهلها", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-08",
    topic: "hazard-awareness",
    promptEn: "Heavy rain reduces visibility. What should you do?",
    promptAr: "المطر الغزير يقلل الرؤية. ماذا يجب أن تفعل؟",
    options: [
      { en: "Reduce speed and increase the gap", ar: "خفّف السرعة وزِد المسافة", correct: true },
      { en: "Drive close to the car ahead", ar: "قد قريباً جداً من السيارة التي أمامك", correct: false },
      { en: "Use full-beam headlights", ar: "استخدم الأضواء العالية", correct: false },
      { en: "Stop in the middle of the road", ar: "توقّف في منتصف الطريق", correct: false }
    ],
    keywords: []
  },

  // --- HAZARD AWARENESS (EXTRA) ---

  {
    id: "HZ-09",
    topic: "hazard-awareness",
    promptEn: "Why should you avoid driving too close to parked cars?",
    promptAr: "لماذا يجب أن تتجنب القيادة قريبًا جدًا من السيارات المتوقفة؟",
    options: [
      { en: "A door may open suddenly", ar: "قد يُفتَح باب فجأة", correct: true },
      { en: "You will save fuel", ar: "سيوفر لك الوقود", correct: false },
      { en: "Parked cars always stay still", ar: "السيارات المتوقفة لا تتحرك أبداً", correct: false },
      { en: "It reduces road noise", ar: "يقلل الضوضاء", correct: false }
    ],
    keywords: [
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "فتح الباب المفاجئ أحد أخطر أسباب الحوادث." }
    ]
  },

  {
    id: "HZ-10",
    topic: "hazard-awareness",
    promptEn: "You are driving behind a motorcyclist on a wet road. What should you expect?",
    promptAr: "أنت تقود خلف درّاج ناري على طريق مبلل. ماذا يجب أن تتوقع؟",
    options: [
      { en: "They may need to change direction suddenly", ar: "قد يغير الاتجاه فجأة", correct: true },
      { en: "They will stop faster than a car", ar: "سيتوقف أسرع من السيارة", correct: false },
      { en: "They are unaffected by wet roads", ar: "الطريق المبلل لا يؤثر عليهم", correct: false },
      { en: "They will always ride on the far left", ar: "سيبقون دائمًا في أقصى اليسار", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-11",
    topic: "hazard-awareness",
    promptEn: "What should you do when passing a cyclist in windy conditions?",
    promptAr: "ماذا يجب أن تفعل عند تجاوز درّاج في أجواء عاصفة؟",
    options: [
      { en: "Give extra room because wind may push them sideways", ar: "اترك مسافة إضافية لأن الريح قد تدفعه جانبياً", correct: true },
      { en: "Overtake very close to give them shelter", ar: "تتجاوز قربه جداً لحمايته", correct: false },
      { en: "Use your horn to warn them", ar: "تستخدم البوق لتحذيره", correct: false },
      { en: "Drive behind them at high speed", ar: "تقود خلفه بسرعة عالية", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-12",
    topic: "hazard-awareness",
    promptEn: "A driver flashes their headlights at you. What could this mean?",
    promptAr: "سائق يومض بالأضواء باتجاهك. ماذا قد يعني ذلك؟",
    options: [
      { en: "They are warning you of a hazard", ar: "قد يحذرونك من خطر", correct: true },
      { en: "They want to race", ar: "يريدون السباق", correct: false },
      { en: "They are angry at you", ar: "غاضبون منك", correct: false },
      { en: "They need you to overtake them", ar: "يريدونك أن تتجاوزهم", correct: false }
    ],
    keywords: [
      { term: "flashing headlights", ar: "وميض الأضواء", explainAr: "ليس إشارة أولوية، بل لتنبيهك غالباً لشيء ما." }
    ]
  },

  {
    id: "HZ-13",
    topic: "hazard-awareness",
    promptEn: "Why must you keep well back when driving behind a large vehicle?",
    promptAr: "لماذا يجب أن تبقى على مسافة كبيرة عند القيادة خلف مركبة كبيرة؟",
    options: [
      { en: "You need a clear view of the road ahead", ar: "تحتاج رؤية واضحة للطريق أمامك", correct: true },
      { en: "Large vehicles always reverse suddenly", ar: "المركبات الكبيرة ترجع للخلف فجأة", correct: false },
      { en: "To prevent damage from tyre spray", ar: "لتجنب رذاذ الإطارات", correct: false },
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-14",
    topic: "hazard-awareness",
    promptEn: "A pedestrian with a white cane is waiting to cross. What should you do?",
    promptAr: "أحد المشاة يحمل عصاً بيضاء وينتظر العبور. ماذا يجب أن تفعل؟",
    options: [
      { en: "Be prepared to stop—they are visually impaired", ar: "استعد للتوقف — هذا الشخص يعاني من ضعف بصري", correct: true },
      { en: "Drive quickly before they step out", ar: "تمر بسرعة قبل أن يعبر", correct: false },
      { en: "Sound your horn lightly", ar: "تستخدم البوق قليلاً", correct: false },
      { en: "Ignore them unless they step out", ar: "تتجاهلهم إلى أن يدخلوا الطريق", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-15",
    topic: "hazard-awareness",
    promptEn: "You see a horse rider ahead. What should you do?",
    promptAr: "ترى راكب حصان أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Slow down and give them plenty of room", ar: "خفف السرعة واترك مسافة جانبية كافية", correct: true },
      { en: "Use horn to warn them", ar: "تستخدم البوق لتحذيرهم", correct: false },
      { en: "Drive close to make them move", ar: "تقود قريباً لدفعهم جانبا", correct: false },
      { en: "Pass them at high speed", ar: "تتجاوزهم بسرعة عالية", correct: false }
    ],
    keywords: []
  },


  {
    id: "HZ-17",
    topic: "hazard-awareness",
    promptEn: "What is the main danger of driving through a residential area?",
    promptAr: "ما الخطر الرئيسي عند القيادة في منطقة سكنية؟",
    options: [
      { en: "Children may run into the road", ar: "قد يركض الأطفال إلى الطريق", correct: true },
      { en: "There are no road markings", ar: "لا توجد علامات طريق", correct: false },
      { en: "The road surface is smoother", ar: "سطح الطريق أنعم", correct: false },
      { en: "Vehicles always travel slowly", ar: "المركبات تسير ببطء دائماً", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-18",
    topic: "hazard-awareness",
    promptEn: "Why should you avoid sudden steering or braking in wet conditions?",
    promptAr: "لماذا يجب تجنب التوجيه الحاد أو الفرملة المفاجئة في الظروف الممطرة؟",
    options: [
      { en: "It may cause skidding", ar: "قد يؤدي للانزلاق", correct: true },
      { en: "It improves tyre grip", ar: "يحسن تماسك الإطارات", correct: false },
      { en: "It dries the brakes faster", ar: "يجفف الفرامل أسرع", correct: false },
      { en: "It makes you more visible", ar: "يجعلك أكثر وضوحاً", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-19",
    topic: "hazard-awareness",
    promptEn: "You are driving on a country road and see farm animals ahead. What should you do?",
    promptAr: "أنت تقود على طريق ريفي وتلاحظ حيوانات مزرعة أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Slow down and be ready to stop", ar: "خفف السرعة واستعد للتوقف", correct: true },
      { en: "Use your horn to move them", ar: "تستخدم البوق لتحريكهم", correct: false },
      { en: "Drive close to them", ar: "تقود ملاصقاً لهم", correct: false },
      { en: "Accelerate to avoid them", ar: "تسرع لتتجنبهم", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-20",
    topic: "hazard-awareness",
    promptEn: "Why are parked cars a particular danger when you're passing?",
    promptAr: "لماذا تعتبر السيارات المتوقفة خطرة عندما تمر بجانبها؟",
    options: [
      { en: "Someone may open a door or step out suddenly", ar: "قد يفتح أحدهم الباب فجأة أو يخرج إلى الطريق", correct: true },
      { en: "They always remain empty", ar: "تظل فارغة دائماً", correct: false },
      { en: "They reduce your visibility by law", ar: "تقلل من رؤيتك قانونياً", correct: false },
      { en: "They force you to speed up", ar: "تجبرك على زيادة السرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-21",
    topic: "hazard-awareness",
    promptEn: "A pedestrian suddenly steps into the road from between parked cars. What should you do first?",
    promptAr: "مشاة يدخل فجأة للطريق من بين السيارات المتوقفة. ما أول ما يجب أن تفعله؟",
    options: [
      { en: "Brake firmly", ar: "تستخدم الفرامل بقوة", correct: true },
      { en: "Flash your headlights", ar: "تومض بالأضواء", correct: false },
      { en: "Sound your horn", ar: "تستخدم البوق", correct: false },
      { en: "Accelerate past them", ar: "تسرع لتتجاوزهم", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-22",
    topic: "hazard-awareness",
    promptEn: "You approach a pelican crossing where the lights are flashing amber. What should you do?",
    promptAr: "تقترب من معبر مشاة (Pelican) والأضواء تومض باللون الكهرماني. ماذا تفعل؟",
    options: [
      { en: "Give way to pedestrians who are still crossing", ar: "تفسح الطريق للمشاة الذين لا يزالون يعبرون", correct: true },
      { en: "Drive immediately", ar: "تقود فوراً", correct: false },
      { en: "Sound your horn to warn pedestrians", ar: "تستخدم البوق لتحذير المشاة", correct: false },
      { en: "Flash lights to signal pedestrians", ar: "تومض بالأضواء للمشاة", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-23",
    topic: "hazard-awareness",
    promptEn: "Why should you check mirrors before slowing down?",
    promptAr: "لماذا يجب عليك فحص المرايا قبل تخفيف السرعة؟",
    options: [
      { en: "To know how traffic behind you may react", ar: "لتعرف كيف قد تتصرف المركبات خلفك", correct: true },
      { en: "To improve fuel economy", ar: "لتحسين استهلاك الوقود", correct: false },
      { en: "To check if your lights work", ar: "للتأكد من عمل أضوائك", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false }
    ],
    keywords: []
  },

  {
    id: "HZ-5001",
    topic: "hazard-awareness",
    promptEn: "You are driving past a line of parked cars and see a child's ball roll into the road ahead. What should you do?",
    promptAr: "أثناء القيادة بجانب صف من السيارات المتوقفة، ترى كرة طفل تتدحرج إلى الطريق أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Sound the horn and continue", ar: "استخدام البوق والمتابعة", correct: false },
      { en: "Slow down and be ready to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Swerve around the ball", ar: "الانحراف لتجاوز الكرة", correct: false },
      { en: "Accelerate to pass quickly", ar: "التسارع للمرور بسرعة", correct: false }
    ],
    keywords: [
      { term: "children", ar: "أطفال", explainAr: "الأطفال قد يركضون خلف الكرة دون النظر إلى الطريق." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تحجب رؤية الأطفال أو المشاة." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها." }
    ]
  },

  {
    id: "HZ-5002",
    topic: "hazard-awareness",
    promptEn: "You are approaching a junction and your view is blocked by buildings. What is the safest action?",
    promptAr: "تقترب من تقاطع ورؤيتك محجوبة بسبب المباني. ما الإجراء الأكثر أمانًا؟",
    options: [
      { en: "Move out quickly to check the road", ar: "الخروج بسرعة لفحص الطريق", correct: false },
      { en: "Edge forward slowly while looking carefully", ar: "التقدم ببطء مع المراقبة بعناية", correct: true },
      { en: "Sound the horn before moving", ar: "استخدام البوق قبل التحرك", correct: false },
      { en: "Rely on other drivers to stop", ar: "الاعتماد على توقف السائقين الآخرين", correct: false }
    ],
    keywords: [
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة حيث قد تأتي المركبات من اتجاهات مختلفة." },
      { term: "restricted view", ar: "رؤية محدودة", explainAr: "عندما تحجب المباني أو الأشياء الأخرى رؤيتك للطريق." },
      { term: "observation", ar: "المراقبة", explainAr: "فحص الطريق بعناية قبل التحرك." }
    ]
  },

  {
    id: "HZ-5003",
    topic: "hazard-awareness",
    promptEn: "You see a cyclist ahead looking over their shoulder. What hazard should you anticipate?",
    promptAr: "ترى درّاجًا أمامك ينظر فوق كتفه. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist may stop suddenly", ar: "قد يتوقف الدرّاج فجأة", correct: false },
      { en: "The cyclist may turn or change direction", ar: "قد ينعطف الدرّاج أو يغيّر اتجاهه", correct: true },
      { en: "The cyclist is about to speed up", ar: "الدرّاج على وشك زيادة السرعة", correct: false },
      { en: "The cyclist is leaving the road", ar: "الدرّاج سيغادر الطريق", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "درّاج", explainAr: "شخص يركب دراجة هوائية على الطريق." },
      { term: "observation", ar: "المراقبة", explainAr: "مراقبة سلوك الدرّاجين والمركبات الأخرى للتنبؤ بحركاتهم." },
      { term: "change direction", ar: "تغيير الاتجاه", explainAr: "عندما يغير الدرّاج أو السائق اتجاهه أو مساره." }
    ]
  },

  {
    id: "HZ-5004",
    topic: "hazard-awareness",
    promptEn: "You are driving in town and see a bus stopped at a bus stop ahead. What hazard should you be prepared for?",
    promptAr: "أثناء القيادة داخل المدينة، ترى حافلة متوقفة عند موقف الحافلات أمامك. ما الخطر الذي يجب الاستعداد له؟",
    options: [
      { en: "The bus may remain stationary for a long time", ar: "قد تبقى الحافلة متوقفة لفترة طويلة", correct: false },
      { en: "Pedestrians may cross the road from in front of the bus", ar: "قد يعبر مشاة الطريق من أمام الحافلة", correct: true },
      { en: "The bus will reverse suddenly", ar: "ستقوم الحافلة بالرجوع للخلف فجأة", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "bus stop", ar: "موقف حافلات", explainAr: "مكان مخصص لتوقف الحافلات لركوب أو نزول الركاب." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام وقد يعبرون الطريق." },
      { term: "hidden hazard", ar: "خطر مخفي", explainAr: "خطر لا يمكن رؤيته مباشرة، مثل مشاة يعبرون من خلف حافلة متوقفة." }
    ]
  },

  {
    id: "HZ-5005",
    topic: "hazard-awareness",
    promptEn: "You are driving on a country road and see mud on the road surface. What hazard should you expect?",
    promptAr: "أثناء القيادة على طريق ريفي، ترى طينًا على سطح الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved tyre grip", ar: "تحسّن تماسك الإطارات", correct: false },
      { en: "A slippery road surface", ar: "سطح طريق زلق", correct: true },
      { en: "A speed limit increase", ar: "زيادة في حد السرعة", correct: false },
      { en: "Road closure ahead", ar: "إغلاق الطريق أمامك", correct: false }
    ],
    keywords: [
      { term: "country road", ar: "طريق ريفي", explainAr: "طريق في المناطق الريفية قد يكون أضيق وأقل صيانة من الطرق الحضرية." },
      { term: "mud", ar: "طين", explainAr: "طين على سطح الطريق يقلل من تماسك الإطارات." },
      { term: "slippery surface", ar: "سطح زلق", explainAr: "سطح الطريق الذي يقلل من تماسك الإطارات ويزيد من خطر الانزلاق." }
    ]
  },

  {
    id: "HZ-5006",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet road and see brake lights come on suddenly several vehicles ahead. What should you do?",
    promptAr: "أثناء القيادة على طريق مبلل، ترى أضواء الفرامل تشتعل فجأة لعدة مركبات أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Maintain speed until closer", ar: "الحفاظ على السرعة حتى الاقتراب", correct: false },
      { en: "Ease off the accelerator and prepare to brake", ar: "رفع القدم عن الوقود والاستعداد للكبح", correct: true },
      { en: "Change lanes immediately", ar: "تغيير المسار فورًا", correct: false },
      { en: "Sound the horn to warn others", ar: "استخدام البوق لتنبيه الآخرين", correct: false }
    ],
    keywords: [
      { term: "wet road", ar: "طريق مبلل", explainAr: "طريق رطب يقلل من تماسك الإطارات ويزيد من مسافة التوقف." },
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "أضواء في مؤخرة المركبة تشتعل عند الضغط على الفرامل، تشير إلى تباطؤ أو توقف المركبة." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها والاستعداد لها." }
    ]
  },

  {
    id: "HZ-5007",
    topic: "hazard-awareness",
    promptEn: "You see an elderly pedestrian waiting near the kerb ahead. What hazard should you anticipate?",
    promptAr: "ترى شخصًا مسنًا ينتظر بالقرب من حافة الرصيف أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will wait for traffic to clear", ar: "سينتظر حتى يخلو الطريق", correct: false },
      { en: "They may step into the road more slowly or unexpectedly", ar: "قد يخطو إلى الطريق ببطء أو بشكل غير متوقع", correct: true },
      { en: "They will signal before crossing", ar: "سيعطي إشارة قبل العبور", correct: false },
      { en: "They are waiting for a bus only", ar: "ينتظر الحافلة فقط", correct: false }
    ],
    keywords: [
      { term: "elderly pedestrians", ar: "مشاة مسنون", explainAr: "المشاة المسنون قد يتحركون ببطء أو بشكل غير متوقع عند عبور الطريق." },
      { term: "crossing", ar: "عبور", explainAr: "عندما يعبر المشاة الطريق، يجب أن تكون مستعدًا للتوقف." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها والاستعداد لها." }
    ]
  },

  {
    id: "HZ-5008",
    topic: "hazard-awareness",
    promptEn: "You are approaching a bend and see warning signs for farm traffic. What hazard should you expect?",
    promptAr: "تقترب من منعطف وترى إشارات تحذير لمرور مركبات زراعية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Fast-moving sports cars", ar: "سيارات رياضية سريعة", correct: false },
      { en: "Slow-moving or large agricultural vehicles", ar: "مركبات زراعية كبيرة أو بطيئة الحركة", correct: true },
      { en: "Road closure ahead", ar: "إغلاق الطريق أمامك", correct: false },
      { en: "A change in speed limit only", ar: "تغيير في حد السرعة فقط", correct: false }
    ],
    keywords: [
      { term: "farm traffic", ar: "مرور زراعي", explainAr: "مركبات زراعية كبيرة وبطيئة الحركة قد تظهر على الطريق." },
      { term: "slow vehicles", ar: "مركبات بطيئة", explainAr: "مركبات تتحرك بسرعة أقل من المعتاد، تتطلب التباطؤ والمرور بحذر." },
      { term: "bend", ar: "منعطف", explainAr: "انحناء في الطريق يقلل من الرؤية ويجعل من الصعب رؤية المركبات القادمة." }
    ]
  },

  {
    id: "HZ-5009",
    topic: "hazard-awareness",
    promptEn: "You notice a vehicle ahead signalling right but slowing down near a junction. What hazard should you anticipate?",
    promptAr: "تلاحظ مركبة أمامك تعطي إشارة انعطاف يمينًا وتُبطئ قرب تقاطع. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle may reverse", ar: "قد تقوم المركبة بالرجوع للخلف", correct: false },
      { en: "The vehicle may turn across your path", ar: "قد تنعطف المركبة قاطعة طريقك", correct: true },
      { en: "The vehicle will stop permanently", ar: "ستتوقف المركبة نهائيًا", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "turning vehicle", ar: "مركبة منعطفة", explainAr: "مركبة تنعطف أو تغير اتجاهها، قد تقطع مسارك." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة حيث قد تأتي المركبات من اتجاهات مختلفة." },
      { term: "path crossing", ar: "قطع المسار", explainAr: "عندما تعبر مركبة أو مشاة مسارك، يجب أن تكون مستعدًا للتباطؤ أو التوقف." }
    ]
  },

  {
    id: "HZ-5010",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see pedestrians wearing dark clothing ahead. What should you do?",
    promptAr: "أثناء القيادة ليلاً، ترى مشاة يرتدون ملابس داكنة أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Maintain speed and rely on headlights", ar: "الحفاظ على السرعة والاعتماد على الأضواء", correct: false },
      { en: "Slow down and be prepared to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Flash your headlights repeatedly", ar: "وميض الأضواء بشكل متكرر", correct: false },
      { en: "Sound the horn to alert them", ar: "استخدام البوق لتنبيههم", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "القيادة الليلية", explainAr: "القيادة في الظلام تتطلب مزيدًا من الحذر والانتباه بسبب قلة الرؤية." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام وقد يعبرون الطريق." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية المشاة والمركبات الأخرى على الطريق، خاصة في الليل أو في ظروف الطقس السيئة." }
    ]
  },

  {
    id: "RS-01",
    topic: "road-signs",
    promptEn: "A sign showing a red car beside a black car means:",
    promptAr: "إشارة تُظهر سيارة حمراء بجانب سيارة سوداء تعني:",
    options: [
      { en: "No overtaking", ar: "ممنوع التجاوز", correct: true },
      { en: "Overtaking allowed", ar: "التجاوز مسموح", correct: false },
      { en: "End of restriction", ar: "نهاية القيد", correct: false },
      { en: "Two-way traffic", ar: "طريق باتجاهين", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "مرورك أمام مركبة أخرى تسير في نفس الاتجاه." }
    ],
    image: "/theory-images/signs/signs_q001_no-overtaking.png"
  },

  {
    id: "RS-02",
    topic: "road-signs",
    promptEn: "A sign with two arrows facing opposite directions means:",
    promptAr: "علامة عليها سهمان باتجاهين متعاكسين تعني:",
    options: [
      { en: "Two-way traffic", ar: "طريق باتجاهين", correct: true },
      { en: "Dual carriageway", ar: "طريق مزدوج", correct: false },
      { en: "Give way", ar: "أعطِ أولوية المرور", correct: false },
      { en: "End of motorway", ar: "نهاية الطريق السريع", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q002_two-way-traffic.png"
  },

  {
    id: "RS-03",
    topic: "road-signs",
    promptEn: "You're driving on a country road after heavy rain and see a triangular warning sign showing a car with skid marks. What hazard should you prepare for?",
    promptAr: "أنت تقود على طريق ريفي بعد أمطار غزيرة وترى علامة تحذير مثلثة تُظهر سيارة مع آثار انزلاق. ما الخطر الذي يجب أن تستعد له؟",
    options: [
      { en: "The road surface may be slippery ahead", ar: "سطح الطريق قد يكون زلقاً أمامك", correct: true },
      { en: "Roadworks are ahead", ar: "أعمال طرق أمامك", correct: false },
      { en: "A tyre repair shop is nearby", ar: "محل إصلاح إطارات قريب", correct: false },
      { en: "Speed bumps are ahead", ar: "مطبات سرعة أمامك", correct: false }
    ],
    keywords: [
      { term: "slippery", ar: "زلق", explainAr: "مكان قد تفقد فيه العجلات تماسكها خصوصاً مع المطر أو الثلج." }
    ],
    image: "/theory-images/signs/signs_q003_slippery-road.png"
  },

  {
    id: "RS-04",
    topic: "road-signs",
    promptEn: "A red upside-down triangle means:",
    promptAr: "مثلث مقلوب ذو إطار أحمر يعني:",
    options: [
      { en: "Give way", ar: "أعطِ أولوية المرور", correct: true },
      { en: "Stop", ar: "توقف", correct: false },
      { en: "No stopping", ar: "ممنوع التوقف", correct: false },
      { en: "Maximum speed", ar: "السرعة القصوى", correct: false }
    ],
    keywords: [
      { term: "give way", ar: "أعطِ أولوية المرور", explainAr: "يجب أن تسمح للمركبات على الطريق الرئيسي بالمرور قبل أن تدخل." }
    ],
    image: "/theory-images/signs/signs_q004_give-way.png"
  },

  {
    id: "RS-05",
    topic: "road-signs",
    promptEn: "You're approaching a junction and see a triangular warning sign with a cross shape. What should you expect ahead?",
    promptAr: "أنت تقترب من تقاطع وترى علامة تحذير مثلثة على شكل صليب. ماذا يجب أن تتوقع أمامك؟",
    options: [
      { en: "A crossroads where traffic may cross your path", ar: "تقاطع قد يعبر فيه مرور طريقك", correct: true },
      { en: "A railway level crossing", ar: "معبر سكة حديد", correct: false },
      { en: "A one-way street ahead", ar: "شارع باتجاه واحد أمامك", correct: false },
      { en: "A hospital entrance", ar: "مدخل مستشفى", correct: false }
    ],
    keywords: [
      { term: "crossroads", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة حيث قد يعبر المرور من عدة اتجاهات." }
    ],
    image: "/theory-images/signs/signs_q005_crossroads.png"
  },

  {
    id: "RS-06",
    topic: "road-signs",
    promptEn: "A sign with a windsock symbol warns of:",
    promptAr: "علامة عليها رمز قمع الرياح تحذّر من:",
    options: [
      { en: "Side winds", ar: "رياح جانبية", correct: true },
      { en: "Snow", ar: "ثلج", correct: false },
      { en: "Tunnel ahead", ar: "نفق أمامك", correct: false },
      { en: "Road narrows", ar: "الطريق يضيق", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q006_side-winds.png"
  },

  // --- SAFETY MARGINS ---

  {
    id: "SM-01",
    topic: "safety-margins",
    promptEn: "On a dry road, what is the minimum safe time gap you should leave to the vehicle in front?",
    promptAr: "على طريق جاف، ما هي أقل فجوة زمنية آمنة يجب أن تتركها للمركبة أمامك؟",
    options: [
      { en: "Two seconds", ar: "ثانيتان", correct: true },
      { en: "One second", ar: "ثانية واحدة", correct: false },
      { en: "Four seconds", ar: "أربع ثوانٍ", correct: false },
      { en: "Half a second", ar: "نصف ثانية", correct: false }
    ],
    keywords: [
      { term: "time gap", ar: "فجوة زمنية", explainAr: "الفترة بين مرور السيارة التي أمامك بنقطة معينة ومرورك أنت بنفس النقطة." },
      { term: "two-second rule", ar: "قاعدة الثانيتين", explainAr: "قاعدة السلامة التي تنص على ترك فجوة زمنية لا تقل عن ثانيتين بينك وبين المركبة أمامك." },
      { term: "dry road", ar: "طريق جاف", explainAr: "طريق غير مبلل بالمطر أو الثلج، يوفر تماسكًا أفضل للإطارات." }
    ]
  },

  {
    id: "SM-02",
    topic: "safety-margins",
    promptEn: "In wet weather, how should you change the normal two-second rule?",
    promptAr: "في الطقس الماطر، كيف يجب أن تعدّل قاعدة الثانيتين المعتادة؟",
    options: [
      { en: "Double it to four seconds", ar: "تضاعفها لتصبح أربع ثوانٍ", correct: true },
      { en: "Keep it at two seconds", ar: "تتركها ثانيتين", correct: false },
      { en: "Reduce it to one second", ar: "تخفّضها لثانية واحدة", correct: false },
      { en: "It doesn't matter in the rain", ar: "لا يهم في المطر", correct: false }
    ],
    keywords: [
      { term: "wet weather", ar: "طقس ماطر", explainAr: "المطر يزيد من مسافة التوقف، لذلك تحتاج لمسافة أمان أكبر." }
    ]
  },

  {
    id: "SM-03",
    topic: "safety-margins",
    promptEn: "A car is travelling very close behind you (tailgating). What is the safest thing to do?",
    promptAr: "سيارة تسير قريبة جداً من خلفك (القيادة الملاصقة). ما هو التصرف الأكثر أماناً؟",
    options: [
      { en: "Increase the gap to the vehicle in front to give yourself more reaction time", ar: "زِد المسافة بينك وبين السيارة التي أمامك لإعطاء نفسك وقت تفاعل أطول", correct: true },
      { en: "Brake sharply to warn them", ar: "استعمل الفرامل بقوة لتحذيرهم", correct: false },
      { en: "Speed up to get away from them", ar: "زد السرعة لتبتعد عنهم", correct: false },
      { en: "Move to the hard shoulder immediately", ar: "انتقل فوراً إلى الكتف", correct: false }
    ],
    keywords: [
      { term: "tailgating", ar: "القيادة الملاصقة", explainAr: "القيادة قريباً جداً من المركبة التي أمامك، مما يقلل من وقت التفاعل ويزيد من خطر الحوادث." },
      { term: "safety margin", ar: "هامش أمان", explainAr: "المسافة والوقت الكافيان للاستجابة بأمان للمخاطر." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي تحتاجه للاستجابة للموقف المفاجئ." }
    ]
  },

  {
    id: "SM-04",
    topic: "safety-margins",
    promptEn: "On icy roads, how should you adjust your overall stopping distance?",
    promptAr: "على الطرق الجليدية، كيف يجب أن تعدّل مسافة التوقف الإجمالية؟",
    options: [
      { en: "Allow up to ten times the normal distance", ar: "تجعلها تصل حتى عشرة أضعاف المسافة العادية", correct: true },
      { en: "Keep the same distance", ar: "تحافظ على نفس المسافة", correct: false },
      { en: "Reduce the distance slightly", ar: "تخفّض المسافة قليلاً", correct: false },
      { en: "Only rely on your ABS", ar: "تعتمد فقط على نظام الفرملة ABS", correct: false }
    ],
    keywords: [
      { term: "icy roads", ar: "طرق جليدية", explainAr: "عند وجود جليد قد تفقد العجلات التماسك بسهولة كبيرة." }
    ]
  },

  {
    id: "SM-05",
    topic: "safety-margins",
    promptEn: "When driving down a steep hill, how can you control your speed safely?",
    promptAr: "عند القيادة نزولاً على منحدر حاد، كيف يمكنك التحكم بالسرعة بأمان؟",
    options: [
      { en: "Select a lower gear and use the brakes gently", ar: "اختر غياراً منخفضاً واستخدم الفرامل بلطف", correct: true },
      { en: "Coast in neutral to save fuel", ar: "قد على الفاضي (نيوترال) لتوفير الوقود", correct: false },
      { en: "Use the clutch and free-wheel", ar: "ابقِ الدبرياج مضغوطاً واترك السيارة تتدحرج", correct: false },
      { en: "Apply the handbrake continuously", ar: "استخدم فرامل اليد بشكل مستمر", correct: false }
    ],
    keywords: [
      { term: "lower gear", ar: "غيار منخفض", explainAr: "يساعد المحرك على كبح السيارة وعدم تسارعها في النزول." }
    ]
  },

  // --- RULES OF THE ROAD ---

  {
    id: "RR-01",
    topic: "rules-of-the-road",
    promptEn: "What is usually the speed limit on a single carriageway road for cars, unless signs show otherwise?",
    promptAr: "ما هو عادةً حد السرعة على طريق بمسار واحد لكل اتجاه للسيارات، ما لم تُظهِر العلامات خلاف ذلك؟",
    options: [
      { en: "60 mph", ar: "٦٠ ميل/ساعة", correct: true },
      { en: "30 mph", ar: "٣٠ ميل/ساعة", correct: false },
      { en: "40 mph", ar: "٤٠ ميل/ساعة", correct: false },
      { en: "70 mph", ar: "٧٠ ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "single carriageway", ar: "طريق ذو مسار واحد لكل اتجاه", explainAr: "لا يوجد فاصل مادي بين الاتجاهين، حتى لو كان فيه عدة مسارات." }
    ]
  },

  {
    id: "RR-02",
    topic: "rules-of-the-road",
    promptEn: "You are on a road with street lights and no speed limit signs. What is the usual speed limit for cars?",
    promptAr: "أنت على طريق فيه أعمدة إنارة ولا توجد لافتات لحد السرعة. ما هو حد السرعة المعتاد للسيارات؟",
    options: [
      { en: "30 mph", ar: "٣٠ ميل/ساعة", correct: true },
      { en: "20 mph", ar: "٢٠ ميل/ساعة", correct: false },
      { en: "40 mph", ar: "٤٠ ميل/ساعة", correct: false },
      { en: "50 mph", ar: "٥٠ ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "street lights", ar: "أعمدة إنارة", explainAr: "وجودها غالباً يدل على منطقة مبنية بحد سرعة 30 ميل/ساعة ما لم يُذكر غير ذلك." }
    ]
  },

  {
    id: "RR-03",
    topic: "rules-of-the-road",
    promptEn: "At a junction, which traffic should you normally give way to?",
    promptAr: "عند تقاطع، لأي حركة مرور يجب أن تعطي أولوية المرور عادةً؟",
    options: [
      { en: "Traffic on the main road", ar: "حركة المرور على الطريق الرئيسي", correct: true },
      { en: "Traffic turning into the side road", ar: "السيارات التي تنعطف إلى الطريق الفرعي", correct: false },
      { en: "Traffic emerging from minor roads", ar: "السيارات الخارجة من الطرق الفرعية", correct: false },
      { en: "Traffic that is slower than you", ar: "السيارات الأبطأ منك", correct: false }
    ],
    keywords: [
      { term: "give way", ar: "أعطِ أولوية المرور", explainAr: "اسمح للمستخدمين على الطريق الرئيسي بالمرور قبل أن تتحرك." }
    ]
  },

  {
    id: "RR-04",
    topic: "rules-of-the-road",
    promptEn: "On a multi-lane carriageway, which lane should you normally use for travelling?",
    promptAr: "على طريق متعدد المسارات، أي مسار يجب أن تستخدمه عادةً للسير؟",
    options: [
      { en: "The left-hand lane", ar: "المسار الأيسر (في بريطانيا)", correct: true },
      { en: "The right-hand lane at all times", ar: "المسار الأيمن في كل الأوقات", correct: false },
      { en: "Any lane you like", ar: "أي مسار تختاره", correct: false },
      { en: "The middle lane only", ar: "المسار الأوسط فقط", correct: false }
    ],
    keywords: [
      { term: "multi-lane", ar: "متعدد المسارات", explainAr: "طريق فيه أكثر من مسار واحد في كل اتجاه؛ المسار الأيسر مخصص للسير العادي." }
    ]
  },

  {
    id: "RR-05",
    topic: "rules-of-the-road",
    promptEn: "When must you stop at a STOP sign at a junction?",
    promptAr: "متى يجب أن تتوقف عند إشارة (STOP) في تقاطع؟",
    options: [
      { en: "Every time, even if the road looks clear", ar: "في كل مرة، حتى لو بدا الطريق خالياً", correct: true },
      { en: "Only if there is other traffic", ar: "فقط إذا كانت هناك حركة مرور أخرى", correct: false },
      { en: "Only at night", ar: "فقط في الليل", correct: false },
      { en: "Only if you want to turn right", ar: "فقط إذا أردت الانعطاف يميناً", correct: false }
    ],
    keywords: [
      { term: "STOP sign", ar: "إشارة توقف STOP", explainAr: "تعني التوقف التام ثم المتابعة عندما يكون الطريق آمناً." }
    ]
  },

  // --- VULNERABLE ROAD USERS ---

  {
    id: "VU-01",
    topic: "vulnerable-road-users",
    promptEn: "You are approaching a zebra crossing and pedestrians are waiting to cross. What should you do?",
    promptAr: "أنت تقترب من ممر مشاة (زِيبرا) وهناك أشخاص ينتظرون العبور. ماذا يجب أن تفعل؟",
    options: [
      { en: "Slow down and be ready to stop. Give way to pedestrians who have started to cross and be prepared for those about to step onto the crossing", ar: "خفّف السرعة واستعِد للتوقف. أعطِ أولوية المرور للمشاة الذين بدأوا العبور واستعِد لأولئك الذين على وشك الصعود إلى الممر", correct: true },
      { en: "Continue at the same speed if they haven't stepped onto the crossing", ar: "تابِع بنفس السرعة إذا لم يصعدوا على الممر بعد", correct: false },
      { en: "Wave at them to wait until you pass", ar: "لوّح لهم كي ينتظروا حتى تمرّ", correct: false },
      { en: "Use your horn to warn them", ar: "استخدم البوق لتحذيرهم", correct: false }
    ],
    keywords: [
      { term: "zebra crossing", ar: "ممر مشاة مخطّط (زِيبرا)", explainAr: "ممر مشاة بخطوط بيضاء حيث للمشاة أولوية العبور." },
      { term: "give way", ar: "أعطِ أولوية المرور", explainAr: "السماح للمشاة بالعبور قبل أن تتحرك." }
    ]
  },

  {
    id: "VU-02",
    topic: "vulnerable-road-users",
    promptEn: "You see children playing near the road and a ball rolls into the street. What should you expect?",
    promptAr: "ترى أطفالاً يلعبون بالقرب من الطريق وتدحرجت كرة إلى الشارع. ماذا يجب أن تتوقع؟",
    options: [
      { en: "A child may run into the road", ar: "قد يركض طفل إلى الطريق", correct: true },
      { en: "The children will wait on the pavement", ar: "سوف ينتظر الأطفال على الرصيف", correct: false },
      { en: "It is safe to increase your speed", ar: "من الآمن أن تزيد سرعتك", correct: false },
      { en: "Only the ball is a hazard, not the children", ar: "الخطر هو الكرة فقط وليس الأطفال", correct: false }
    ],
    keywords: [
      { term: "hazard", ar: "خطر محتمل", explainAr: "شيء قد يسبب حادثاً، مثل طفل يركض خلف الكرة." }
    ]
  },

  {
    id: "VU-03",
    topic: "vulnerable-road-users",
    promptEn: "An elderly person is crossing the road very slowly. What should you do?",
    promptAr: "شخص مسنّ يعبر الطريق ببطء شديد. ماذا يجب أن تفعل؟",
    options: [
      { en: "Be patient and allow them plenty of time to cross", ar: "كن صبوراً ودَع له وقتاً كافياً ليعبر", correct: true },
      { en: "Rev your engine to hurry them up", ar: "زد من صوت المحرك لتجبره على الإسراع", correct: false },
      { en: "Drive around them if there's space", ar: "قد حوله إذا كان هناك متّسع", correct: false },
      { en: "Flash your headlights repeatedly", ar: "ومِض بالأضواء بشكل متكرر", correct: false }
    ],
    keywords: [
      { term: "elderly", ar: "كبير في السن", explainAr: "حركة بطيئة ووقت أطول للعبور، يحتاج صبراً إضافياً من السائق." }
    ]
  },

  {
    id: "VU-04",
    topic: "vulnerable-road-users",
    promptEn: "You are following a cyclist on a narrow road. When is it safest to overtake?",
    promptAr: "أنت تتبع درّاجاً على طريق ضيّق. متى يكون التجاوز أكثر أماناً؟",
    options: [
      { en: "When you can give them plenty of space and see the road is clear", ar: "عندما تستطيع ترك مسافة جانبية كافية وترى أن الطريق خالٍ أمامك", correct: true },
      { en: "Immediately, even if another vehicle is coming", ar: "فوراً، حتى لو كانت هناك مركبة قادمة", correct: false },
      { en: "When you are right behind them with your horn sounding", ar: "عندما تكون ملاصقاً له وتستخدم البوق", correct: false },
      { en: "When they are going downhill", ar: "عندما يكون في نزول", correct: false }
    ],
    keywords: [
      { term: "overtake", ar: "تتجاوز", explainAr: "تمر أمام مستخدم طريق آخر، ويجب ترك مسافة أمان جانبية." }
    ]
  },

  {
    id: "VU-05",
    topic: "vulnerable-road-users",
    promptEn: "You see a horse and rider on the road ahead. How should you pass them?",
    promptAr: "ترى حصاناً وراكبه على الطريق أمامك. كيف يجب أن تتجاوزهما؟",
    options: [
      { en: "Slow down and pass with plenty of room", ar: "خفّف السرعة وتجاوز مع ترك مسافة جانبية كافية", correct: true },
      { en: "Use your horn to warn them", ar: "استخدم البوق لتحذيرهما", correct: false },
      { en: "Pass as close as possible to save time", ar: "تجاوز بأقرب مسافة لتوفّر الوقت", correct: false },
      { en: "Flash headlights and accelerate", ar: "ومِض بالأضواء ثم زد السرعة", correct: false }
    ],
    keywords: [
      { term: "horse and rider", ar: "حصان وراكبه", explainAr: "الحيوانات قد تخاف من الضوضاء، لذلك يجب أن تمر بهدوء وبمسافة كافية." }
    ]
  },

  {
    id: "VU-06",
    topic: "vulnerable-road-users",
    promptEn: "A person in a wheelchair is waiting to cross at a junction. What should you do?",
    promptAr: "شخص على كرسي متحرك ينتظر العبور عند تقاطع. ماذا يجب أن تفعل؟",
    options: [
      { en: "Be prepared to stop and let them cross safely", ar: "كن مستعداً للتوقف ودَعْه يعبر بأمان", correct: true },
      { en: "Drive through quickly before they move", ar: "مرّ بسرعة قبل أن يتحرك", correct: false },
      { en: "Ignore them if there is no crossing marked", ar: "تجاهلهم إذا لم يكن هناك معبر مشاة مرسوم", correct: false },
      { en: "Sound the horn so they hurry", ar: "استخدم البوق ليُسرعوا", correct: false }
    ],
    keywords: [
      { term: "wheelchair", ar: "كرسي متحرك", explainAr: "مستخدم طريق قد يحتاج وقتاً أطول ومساحة أكبر للعبور." }
    ]
  },

  {
    id: "VU-07",
    topic: "vulnerable-road-users",
    promptEn: "Why should you take special care when turning at a junction where there are motorcyclists?",
    promptAr: "لماذا يجب أن تكون حذراً بشكل خاص عند الانعطاف في تقاطع يوجد فيه سائقي دراجات نارية؟",
    options: [
      { en: "They are smaller and harder to see", ar: "لأنهم أصغر حجماً وأصعب في الرؤية", correct: true },
      { en: "They always have priority", ar: "لأن لديهم أولوية دائماً", correct: false },
      { en: "They are protected by their vehicles", ar: "لأن مركباتهم تحميهم جيداً", correct: false },
      { en: "They must always stop at junctions", ar: "لأن عليهم التوقف دائماً عند التقاطعات", correct: false }
    ],
    keywords: [
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "أجسام صغيرة وسرعة عالية، يصعب رؤيتهم في المرايا والتقاطعات." }
    ]
  },

  {
    id: "VU-08",
    topic: "vulnerable-road-users",
    promptEn: "You are passing a line of parked cars and see a cyclist ahead. What is the main danger?",
    promptAr: "أنت تمر بجانب صف من السيارات المتوقفة وترى درّاجاً أمامك. ما هو الخطر الرئيسي؟",
    options: [
      { en: "A car door may open and force the cyclist to move out", ar: "قد تُفتح باب سيارة فيندفع الدرّاج إلى الخارج", correct: true },
      { en: "The cyclist will always stay close to the kerb", ar: "الدرّاج سيبقى دائماً ملاصقاً للحافة", correct: false },
      { en: "Parked cars are never a hazard", ar: "السيارات المتوقفة لا تشكل خطراً أبداً", correct: false },
      { en: "The cyclist will immediately stop", ar: "سيتوقف الدرّاج فوراً", correct: false }
    ],
    keywords: [
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "فتح الأبواب بشكل مفاجئ قد يدفع الدرّاج أو المشاة نحو مسارك." }
    ]
  },

  {
    id: "VRU-5401",
    topic: "vulnerable-road-users",
    promptEn: "Why should you take extra care near schools?",
    promptAr: "لماذا يجب عليك توخي الحذر الزائد قرب المدارس؟",
    options: [
      { en: "Traffic moves faster", ar: "تكون حركة المرور أسرع", correct: false },
      { en: "Children may behave unpredictably", ar: "قد يتصرف الأطفال بشكل غير متوقع", correct: true },
      { en: "Roads are always narrower", ar: "الطرق تكون أضيق دائمًا", correct: false },
      { en: "Parking is restricted", ar: "الوقوف يكون مقيدًا", correct: false }
    ],
    keywords: [
      { term: "schools", ar: "المدارس", explainAr: "مناطق قد يكون فيها أطفال يتصرفون بشكل غير متوقع." },
      { term: "children", ar: "الأطفال", explainAr: "مستخدمو طريق ضعفاء قد لا يتصرفون بشكل متوقع." },
      { term: "unpredictable", ar: "غير متوقع", explainAr: "سلوك قد يتغير فجأة دون تحذير." }
    ]
  },

  {
    id: "VRU-5402",
    topic: "vulnerable-road-users",
    promptEn: "How should you react when you see an elderly pedestrian waiting to cross?",
    promptAr: "كيف يجب أن تتصرف عند رؤية شخص مسن ينتظر عبور الطريق؟",
    options: [
      { en: "Assume they will wait", ar: "تفترض أنه سينتظر", correct: false },
      { en: "Be patient and prepared to stop", ar: "التحلي بالصبر والاستعداد للتوقف", correct: true },
      { en: "Signal them to hurry", ar: "الإشارة لهم بالإسراع", correct: false },
      { en: "Drive closer to warn them", ar: "الاقتراب لتحذيرهم", correct: false }
    ],
    keywords: [
      { term: "elderly", ar: "كبار السن", explainAr: "أشخاص قد يحتاجون وقتًا أطول للعبور وتقدير المرور." },
      { term: "pedestrians", ar: "المشاة", explainAr: "مستخدمو طريق على الأقدام يحتاجون حماية خاصة." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالهدوء وإعطاء الوقت الكافي للآخرين." }
    ]
  },

  {
    id: "VRU-5403",
    topic: "vulnerable-road-users",
    promptEn: "Why are children considered vulnerable road users?",
    promptAr: "لماذا يُعتبر الأطفال من مستخدمي الطريق الضعفاء؟",
    options: [
      { en: "They know traffic rules well", ar: "يعرفون قواعد المرور جيدًا", correct: false },
      { en: "They may misjudge speed and distance", ar: "قد يسيئون تقدير السرعة والمسافة", correct: true },
      { en: "They only walk on pavements", ar: "يسيرون فقط على الأرصفة", correct: false },
      { en: "They always use crossings", ar: "يستخدمون المعابر دائمًا", correct: false }
    ],
    keywords: [
      { term: "children", ar: "الأطفال", explainAr: "مستخدمو طريق ضعفاء قد لا يفهمون المخاطر بشكل كامل." },
      { term: "judgement", ar: "التقدير", explainAr: "القدرة على تقييم السرعة والمسافة بشكل صحيح." },
      { term: "distance", ar: "المسافة", explainAr: "المسافة بينك وبين مستخدمي الطريق الآخرين." }
    ]
  },

  {
    id: "VRU-5404",
    topic: "vulnerable-road-users",
    promptEn: "What should you do when driving near a pedestrian crossing with children nearby?",
    promptAr: "ماذا يجب أن تفعل عند القيادة قرب ممر مشاة مع وجود أطفال قريبين؟",
    options: [
      { en: "Maintain speed if lights are green", ar: "الحفاظ على السرعة إذا كانت الإشارة خضراء", correct: false },
      { en: "Slow down and be ready to stop", ar: "التخفيف والاستعداد للتوقف", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false }
    ],
    keywords: [
      { term: "children", ar: "الأطفال", explainAr: "مستخدمو طريق ضعفاء يحتاجون حماية خاصة." },
      { term: "crossing", ar: "المعبر", explainAr: "مكان مخصص لعبور المشاة." },
      { term: "slow down", ar: "التخفيف", explainAr: "تقليل السرعة للاستعداد للتوقف." }
    ]
  },

  {
    id: "VRU-5405",
    topic: "vulnerable-road-users",
    promptEn: "Why should you not wave pedestrians across the road?",
    promptAr: "لماذا لا يجب عليك الإشارة للمشاة بالعبور؟",
    options: [
      { en: "Other road users may not understand your signal, and it can put pedestrians at risk", ar: "قد لا يفهم مستخدمو الطريق الآخرون إشارتك، وقد يعرّض ذلك المشاة للخطر", correct: true },
      { en: "Pedestrians dislike it", ar: "المشاة لا يحبون ذلك", correct: false },
      { en: "It delays traffic", ar: "يؤخر حركة المرور", correct: false },
      { en: "It is only allowed at zebra crossings", ar: "يُسمح به فقط عند ممرات المشاة", correct: false }
    ],
    keywords: [
      { term: "pedestrians", ar: "المشاة", explainAr: "مستخدمو طريق على الأقدام." },
      { term: "signals", ar: "الإشارات", explainAr: "التواصل مع مستخدمي الطريق الآخرين." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على سلامة الجميع على الطريق." }
    ]
  },

  {
    id: "VRU-5406",
    topic: "vulnerable-road-users",
    promptEn: "How should you drive near areas where children play?",
    promptAr: "كيف يجب أن تقود قرب المناطق التي يلعب فيها الأطفال؟",
    options: [
      { en: "At the speed limit", ar: "وفق حد السرعة", correct: false },
      { en: "Slowly and with increased awareness", ar: "ببطء ومع انتباه متزايد", correct: true },
      { en: "Close to the kerb", ar: "قريبًا من الرصيف", correct: false },
      { en: "Using the horn frequently", ar: "باستخدام البوق كثيرًا", correct: false }
    ],
    keywords: [
      { term: "children playing", ar: "الأطفال يلعبون", explainAr: "مناطق قد يخرج منها أطفال فجأة إلى الطريق." },
      { term: "slow speed", ar: "السرعة البطيئة", explainAr: "القيادة بسرعة منخفضة للاستعداد لأي طوارئ." },
      { term: "awareness", ar: "الانتباه", explainAr: "التركيز والمراقبة المستمرة للطريق." }
    ]
  },

  {
    id: "VRU-5407",
    topic: "vulnerable-road-users",
    promptEn: "What should you do if a pedestrian starts crossing without looking?",
    promptAr: "ماذا يجب أن تفعل إذا بدأ أحد المشاة بالعبور دون النظر؟",
    options: [
      { en: "Continue driving", ar: "متابعة القيادة", correct: false },
      { en: "Be prepared to stop safely", ar: "الاستعداد للتوقف بأمان", correct: true },
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false },
      { en: "Sound the horn aggressively", ar: "استخدام البوق بعنف", correct: false }
    ],
    keywords: [
      { term: "pedestrians", ar: "المشاة", explainAr: "مستخدمو طريق على الأقدام." },
      { term: "crossing", ar: "العبور", explainAr: "الانتقال من جانب الطريق إلى الجانب الآخر." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على سلامة الجميع." }
    ]
  },

  {
    id: "VRU-5408",
    topic: "vulnerable-road-users",
    promptEn: "Why should you allow more time when elderly people are crossing?",
    promptAr: "لماذا يجب أن تمنح وقتًا أطول عند عبور كبار السن؟",
    options: [
      { en: "They walk slower", ar: "لأنهم يمشون ببطء", correct: false },
      { en: "They may take longer to judge traffic", ar: "قد يحتاجون وقتًا أطول لتقدير المرور", correct: true },
      { en: "They expect priority", ar: "يتوقعون الأولوية", correct: false },
      { en: "They always use crossings", ar: "يستخدمون المعابر دائمًا", correct: false }
    ],
    keywords: [
      { term: "elderly", ar: "كبار السن", explainAr: "أشخاص قد يحتاجون وقتًا أطول لتقييم الوضع." },
      { term: "crossing time", ar: "وقت العبور", explainAr: "المدة التي يحتاجها شخص لعبور الطريق." },
      { term: "judgement", ar: "التقدير", explainAr: "القدرة على تقييم الوضع المروري." }
    ]
  },

  {
    id: "VRU-5409",
    topic: "vulnerable-road-users",
    promptEn: "What is the safest approach when pedestrians are close to the kerb?",
    promptAr: "ما هو التصرف الأكثر أمانًا عندما يكون المشاة قريبين من الرصيف؟",
    options: [
      { en: "Drive closer to them", ar: "القيادة أقرب إليهم", correct: false },
      { en: "Reduce speed and be prepared to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Maintain speed", ar: "الحفاظ على السرعة", correct: false },
      { en: "Use the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "pedestrians", ar: "المشاة", explainAr: "مستخدمو طريق على الأقدام." },
      { term: "kerb", ar: "حافة الرصيف", explainAr: "حافة الطريق حيث يقف المشاة." },
      { term: "slow down", ar: "التخفيف", explainAr: "تقليل السرعة للاستعداد للتوقف." }
    ]
  },

  {
    id: "VRU-5410",
    topic: "vulnerable-road-users",
    promptEn: "Why must drivers be especially careful near pedestrian crossings?",
    promptAr: "لماذا يجب على السائقين توخي الحذر الشديد قرب ممرات المشاة؟",
    options: [
      { en: "Traffic lights may fail", ar: "قد تفشل إشارات المرور", correct: false },
      { en: "Pedestrians may cross unexpectedly", ar: "قد يعبر المشاة بشكل غير متوقع", correct: true },
      { en: "Roads are narrower", ar: "الطرق أضيق", correct: false },
      { en: "Speed limits change", ar: "تتغير حدود السرعة", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossings", ar: "ممرات المشاة", explainAr: "أماكن مخصصة لعبور المشاة." },
      { term: "priority", ar: "الأولوية", explainAr: "الحق في المرور قبل الآخرين." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على سلامة الجميع." }
    ]
  },

  {
    id: "VRU-5411",
    topic: "vulnerable-road-users",
    promptEn: "Why should you give cyclists plenty of room when overtaking?",
    promptAr: "لماذا يجب أن تمنح راكبي الدراجات مسافة جانبية كافية عند التجاوز؟",
    options: [
      { en: "They travel very fast", ar: "لأنهم يسيرون بسرعة كبيرة", correct: false },
      { en: "They may wobble or swerve suddenly", ar: "قد يتمايلون أو ينحرفون فجأة", correct: true },
      { en: "They always stop at junctions", ar: "يتوقفون دائمًا عند التقاطعات", correct: false },
      { en: "They are easier to see", ar: "من السهل رؤيتهم", correct: false }
    ],
    keywords: [
      { term: "cyclists", ar: "راكبو الدراجات", explainAr: "مستخدمو طريق ضعفاء يحتاجون مساحة آمنة عند التجاوز." },
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أخرى تسير في نفس الاتجاه." },
      { term: "space", ar: "المساحة", explainAr: "المسافة الآمنة التي يجب تركها عند التجاوز." }
    ]
  },

  {
    id: "VRU-5412",
    topic: "vulnerable-road-users",
    promptEn: "What should you do when approaching a cyclist riding near parked cars?",
    promptAr: "ماذا يجب أن تفعل عند الاقتراب من درّاج يسير قرب سيارات متوقفة؟",
    options: [
      { en: "Overtake quickly", ar: "التجاوز بسرعة", correct: false },
      { en: "Expect the cyclist to move out to avoid opening doors", ar: "تتوقع أن يبتعد الدرّاج لتجنب أبواب تُفتح", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Drive closer to the kerb", ar: "القيادة أقرب إلى الرصيف", correct: false }
    ],
    keywords: [
      { term: "cyclists", ar: "راكبو الدراجات", explainAr: "مستخدمو طريق ضعفاء يحتاجون مساحة آمنة." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تُفتح أبوابها فجأة." },
      { term: "opening doors", ar: "فتح الأبواب", explainAr: "خطر قد يدفع الدرّاج نحو مسارك." }
    ]
  },

  {
    id: "VRU-5413",
    topic: "vulnerable-road-users",
    promptEn: "Why can motorcyclists be difficult to see at junctions?",
    promptAr: "لماذا قد يكون من الصعب رؤية سائقي الدراجات النارية عند التقاطعات؟",
    options: [
      { en: "They always ride fast", ar: "يسيرون دائمًا بسرعة", correct: false },
      { en: "They are smaller and less visible", ar: "حجمهم أصغر وأقل وضوحًا", correct: true },
      { en: "They ignore traffic signs", ar: "يتجاهلون إشارات المرور", correct: false },
      { en: "They stay in the centre of the road", ar: "يبقون في منتصف الطريق", correct: false }
    ],
    keywords: [
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "مستخدمو طريق قد يكونون أصغر حجماً وأصعب في الرؤية." },
      { term: "junctions", ar: "التقاطعات", explainAr: "نقاط التقاء طرق حيث يجب توخي الحذر الشديد." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية مستخدمي الطريق الآخرين." }
    ]
  },

  {
    id: "VRU-5414",
    topic: "vulnerable-road-users",
    promptEn: "What should you do before turning left at a junction where a cyclist is present?",
    promptAr: "ماذا يجب أن تفعل قبل الانعطاف يسارًا عند تقاطع يوجد فيه درّاج؟",
    options: [
      { en: "Accelerate before turning", ar: "التسارع قبل الانعطاف", correct: false },
      { en: "Check mirrors and blind spots carefully", ar: "فحص المرايا والنقاط العمياء بعناية", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Signal late", ar: "إعطاء إشارة متأخرة", correct: false }
    ],
    keywords: [
      { term: "turning left", ar: "الانعطاف يسارًا", explainAr: "تغيير الاتجاه إلى اليسار." },
      { term: "cyclists", ar: "راكبو الدراجات", explainAr: "مستخدمو طريق ضعفاء قد يكونون في النقاط العمياء." },
      { term: "blind spot", ar: "النقطة العمياء", explainAr: "منطقة لا يمكن رؤيتها في المرايا." }
    ]
  },

  {
    id: "VRU-5415",
    topic: "vulnerable-road-users",
    promptEn: "Why should you look out for motorcyclists when overtaking?",
    promptAr: "لماذا يجب أن تنتبه لسائقي الدراجات النارية عند التجاوز؟",
    options: [
      { en: "They often overtake quickly", ar: "غالبًا ما يتجاوزون بسرعة", correct: true },
      { en: "They always slow down", ar: "يتباطؤون دائمًا", correct: false },
      { en: "They use hazard lights", ar: "يستخدمون أضواء التحذير", correct: false },
      { en: "They stay behind cars", ar: "يبقون خلف السيارات", correct: false }
    ],
    keywords: [
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "مستخدمو طريق قد يتجاوزون بسرعة." },
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أخرى تسير في نفس الاتجاه." },
      { term: "speed", ar: "السرعة", explainAr: "معدل الحركة الذي قد يكون عالياً للدراجات النارية." }
    ]
  },

  {
    id: "VRU-5416",
    topic: "vulnerable-road-users",
    promptEn: "How should you pass a group of cyclists riding together?",
    promptAr: "كيف يجب أن تتجاوز مجموعة من راكبي الدراجات يسيرون معًا؟",
    options: [
      { en: "Pass between them", ar: "التجاوز بينهم", correct: false },
      { en: "Allow extra room and overtake when safe", ar: "منح مساحة إضافية والتجاوز عندما يكون آمنًا", correct: true },
      { en: "Sound the horn repeatedly", ar: "استخدام البوق بشكل متكرر", correct: false },
      { en: "Drive very close", ar: "القيادة قريبًا جدًا", correct: false }
    ],
    keywords: [
      { term: "group of cyclists", ar: "مجموعة من راكبي الدراجات", explainAr: "عدة درّاجين يسيرون معاً يحتاجون مساحة أكبر." },
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أخرى تسير في نفس الاتجاه." },
      { term: "space", ar: "المساحة", explainAr: "المسافة الآمنة التي يجب تركها عند التجاوز." }
    ]
  },

  {
    id: "VRU-5417",
    topic: "vulnerable-road-users",
    promptEn: "Why should you be careful when driving near motorcyclists in windy conditions?",
    promptAr: "لماذا يجب أن تكون حذرًا عند القيادة قرب دراجات نارية في ظروف رياح؟",
    options: [
      { en: "They may stop suddenly", ar: "قد يتوقفون فجأة", correct: false },
      { en: "They may be blown off course", ar: "قد تنحرف الدراجة بسبب الرياح", correct: true },
      { en: "They always ride slowly", ar: "يسيرون دائمًا ببطء", correct: false },
      { en: "They use special lanes", ar: "يستخدمون مسارات خاصة", correct: false }
    ],
    keywords: [
      { term: "windy conditions", ar: "ظروف رياح", explainAr: "الرياح القوية قد تؤثر على استقرار الدراجات النارية." },
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "مستخدمو طريق قد تتأثر دراجاتهم بالرياح." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه المركبة بشكل آمن." }
    ]
  },

  {
    id: "VRU-5418",
    topic: "vulnerable-road-users",
    promptEn: "What should you do if a cyclist signals to turn right ahead of you?",
    promptAr: "ماذا يجب أن تفعل إذا أعطى درّاج إشارة انعطاف يمينًا أمامك؟",
    options: [
      { en: "Overtake on the left", ar: "التجاوز من اليسار", correct: false },
      { en: "Slow down and allow them space to turn", ar: "التخفيف ومنحهم مساحة للانعطاف", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Accelerate past them", ar: "التسارع لتجاوزهم", correct: false }
    ],
    keywords: [
      { term: "cyclist signalling", ar: "إشارة الدرّاج", explainAr: "إشارة يدوية أو ضوئية من الدرّاج." },
      { term: "turning right", ar: "الانعطاف يمينًا", explainAr: "تغيير الاتجاه إلى اليمين." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالهدوء وإعطاء الوقت الكافي للآخرين." }
    ]
  },

  {
    id: "VRU-5419",
    topic: "vulnerable-road-users",
    promptEn: "Why should you double-check for motorcyclists before changing lanes?",
    promptAr: "لماذا يجب أن تتحقق مرتين من وجود دراجات نارية قبل تغيير المسار؟",
    options: [
      { en: "They always use indicators", ar: "يستخدمون الإشارات دائمًا", correct: false },
      { en: "They can be hidden in blind spots", ar: "قد يكونون مخفيين في النقاط العمياء", correct: true },
      { en: "They travel slowly", ar: "يسيرون ببطء", correct: false },
      { en: "They stay in one lane", ar: "يبقون في مسار واحد", correct: false }
    ],
    keywords: [
      { term: "blind spots", ar: "النقاط العمياء", explainAr: "مناطق لا يمكن رؤيتها في المرايا." },
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "مستخدمو طريق قد يكونون مخفيين في النقاط العمياء." },
      { term: "lane change", ar: "تغيير المسار", explainAr: "الانتقال من مسار إلى آخر." }
    ]
  },

  {
    id: "VRU-5420",
    topic: "vulnerable-road-users",
    promptEn: "How can you reduce risk to cyclists when driving in traffic?",
    promptAr: "كيف يمكنك تقليل الخطر على راكبي الدراجات أثناء القيادة في المرور؟",
    options: [
      { en: "Drive close behind them", ar: "القيادة خلفهم عن قرب", correct: false },
      { en: "Be patient and give them space", ar: "التحلي بالصبر ومنحهم مساحة", correct: true },
      { en: "Use the horn to warn them", ar: "استخدام البوق لتحذيرهم", correct: false },
      { en: "Overtake whenever possible", ar: "التجاوز كلما أمكن", correct: false }
    ],
    keywords: [
      { term: "cyclists", ar: "راكبو الدراجات", explainAr: "مستخدمو طريق ضعفاء يحتاجون حماية خاصة." },
      { term: "traffic", ar: "المرور", explainAr: "حركة المركبات على الطريق." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالهدوء وإعطاء الوقت الكافي للآخرين." }
    ]
  },

  {
    id: "VRU-5421",
    topic: "vulnerable-road-users",
    promptEn: "Why should you slow down when approaching a horse and rider?",
    promptAr: "لماذا يجب عليك التخفيف عند الاقتراب من حصان وفارس؟",
    options: [
      { en: "Horses always stay calm", ar: "الخيول تبقى هادئة دائمًا", correct: false },
      { en: "Horses can be easily startled by noise or movement", ar: "يمكن أن تفزع الخيول بسهولة بسبب الضوضاء أو الحركة", correct: true },
      { en: "Horse riders must give way", ar: "يجب على الفارس إعطاء الأولوية", correct: false },
      { en: "Horses move very fast", ar: "الخيول تتحرك بسرعة كبيرة", correct: false }
    ],
    keywords: [
      { term: "horse riders", ar: "الفارسون", explainAr: "مستخدمو طريق ضعفاء يحتاجون حماية خاصة بسبب قابلية الخيول للفزع." },
      { term: "slow down", ar: "التخفيف", explainAr: "تقليل السرعة لتجنب إخافة الخيول وحماية الفارسين." },
      { term: "startle", ar: "فزع", explainAr: "رد فعل مفاجئ للخيول قد يسبب حوادث." }
    ]
  },

  {
    id: "VRU-5422",
    topic: "vulnerable-road-users",
    promptEn: "You see a mobility scooter being used near the edge of the road. What should you do?",
    promptAr: "ترى دراجة تنقل كهربائية تُستخدم قرب حافة الطريق. ماذا يجب أن تفعل؟",
    options: [
      { en: "Slow down and give plenty of room, as they may need to move out to avoid obstacles", ar: "خفّف السرعة واترك مسافة جانبية كافية، لأنهم قد يحتاجون للتحرك لتجنب العوائق", correct: true },
      { en: "Drive close to encourage them to move onto the pavement", ar: "قد قريباً لتشجيعهم على الانتقال إلى الرصيف", correct: false },
      { en: "Sound your horn to warn them of your presence", ar: "استخدم البوق لتحذيرهم من وجودك", correct: false },
      { en: "Assume they will always stay at the edge", ar: "افترض أنهم سيبقون دائماً عند الحافة", correct: false }
    ],
    keywords: [
      { term: "mobility scooter", ar: "دراجة تنقل كهربائية", explainAr: "مركبة صغيرة يستخدمها الأشخاص ذوو القدرة المحدودة على الحركة." },
      { term: "road edge", ar: "حافة الطريق", explainAr: "حافة الطريق حيث قد يستخدم مستخدمو الدراجات الكهربائية الطريق." },
      { term: "obstacles", ar: "عوائق", explainAr: "أشياء على الطريق قد تجبر مستخدم الدراجة على التحرك." }
    ]
  },

  {
    id: "VRU-5423",
    topic: "vulnerable-road-users",
    promptEn: "Why should you be cautious around mobility scooters?",
    promptAr: "لماذا يجب أن تكون حذرًا عند وجود دراجات تنقل كهربائية؟",
    options: [
      { en: "They move very fast", ar: "تتحرك بسرعة كبيرة", correct: false },
      { en: "They are slower and less visible", ar: "أبطأ وأقل وضوحًا", correct: true },
      { en: "They always stay on pavements", ar: "تبقى دائمًا على الأرصفة", correct: false },
      { en: "They ignore road rules", ar: "تتجاهل قواعد الطريق", correct: false }
    ],
    keywords: [
      { term: "mobility scooters", ar: "دراجات التنقل الكهربائية", explainAr: "مركبات صغيرة يستخدمها الأشخاص ذوو القدرة المحدودة على الحركة." },
      { term: "visibility", ar: "الوضوح", explainAr: "القدرة على رؤية مستخدمي الطريق الآخرين." },
      { term: "slow users", ar: "مستخدمون بطيئون", explainAr: "مستخدمو طريق يتحركون ببطء ويحتاجون حماية خاصة." }
    ]
  },

  {
    id: "VRU-5424",
    topic: "vulnerable-road-users",
    promptEn: "What should you do when approaching a pedestrian using a wheelchair?",
    promptAr: "ماذا يجب أن تفعل عند الاقتراب من مشاة يستخدم كرسيًا متحركًا؟",
    options: [
      { en: "Assume they will wait", ar: "تفترض أنه سينتظر", correct: false },
      { en: "Be patient and prepared to stop", ar: "التحلي بالصبر والاستعداد للتوقف", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Drive closer to warn them", ar: "الاقتراب لتحذيره", correct: false }
    ],
    keywords: [
      { term: "wheelchair", ar: "كرسي متحرك", explainAr: "جهاز يستخدمه الأشخاص ذوو القدرة المحدودة على الحركة." },
      { term: "pedestrians", ar: "المشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالهدوء وإعطاء الوقت الكافي للآخرين." }
    ]
  },

  {
    id: "VRU-5425",
    topic: "vulnerable-road-users",
    promptEn: "What should you be particularly aware of when driving in an urban area with parked cars on both sides of the road?",
    promptAr: "ما الذي يجب أن تكون حذراً منه بشكل خاص عند القيادة في منطقة حضرية مع سيارات متوقفة على جانبي الطريق؟",
    options: [
      { en: "Pedestrians may emerge from between parked cars without warning", ar: "قد يظهر المشاة من بين السيارات المتوقفة دون تحذير", correct: true },
      { en: "Parked cars always indicate when someone is about to exit", ar: "السيارات المتوقفة تشير دائماً عندما يكون شخص على وشك الخروج", correct: false },
      { en: "Pedestrians will always use designated crossings", ar: "المشاة سيستخدمون دائماً المعابر المخصصة", correct: false },
      { en: "The speed limit is automatically reduced in such areas", ar: "حد السرعة يُقلل تلقائياً في هذه المناطق", correct: false }
    ],
    keywords: [
      { term: "urban area", ar: "منطقة حضرية", explainAr: "منطقة مبنية قد تكون فيها سيارات متوقفة ومشاة." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تحجب رؤية المشاة." },
      { term: "pedestrians emerging", ar: "ظهور المشاة", explainAr: "المشاة قد يظهرون فجأة من بين السيارات المتوقفة." }
    ]
  },

  {
    id: "VRU-5426",
    topic: "vulnerable-road-users",
    promptEn: "What is the safest behaviour when driving near road workers?",
    promptAr: "ما هو السلوك الأكثر أمانًا عند القيادة قرب عمّال الطرق؟",
    options: [
      { en: "Maintain normal speed", ar: "الحفاظ على السرعة العادية", correct: false },
      { en: "Reduce speed and watch for signals", ar: "تخفيف السرعة والانتباه للإشارات", correct: true },
      { en: "Use the horn", ar: "استخدام البوق", correct: false },
      { en: "Overtake if possible", ar: "التجاوز إن أمكن", correct: false }
    ],
    keywords: [
      { term: "road workers", ar: "عمّال الطرق", explainAr: "الأشخاص الذين يعملون على إصلاح أو صيانة الطرق." },
      { term: "temporary hazards", ar: "مخاطر مؤقتة", explainAr: "أخطار تظهر مؤقتًا على الطريق مثل أعمال الصيانة." },
      { term: "slow down", ar: "التخفيف", explainAr: "تقليل السرعة لضمان السلامة." }
    ]
  },

  {
    id: "VRU-5427",
    topic: "vulnerable-road-users",
    promptEn: "Why are people walking with guide dogs considered vulnerable?",
    promptAr: "لماذا يُعتبر الأشخاص الذين يستخدمون كلاب إرشاد من الفئات الضعيفة؟",
    options: [
      { en: "They walk slowly", ar: "يمشون ببطء", correct: false },
      { en: "They may have limited vision", ar: "قد يكون لديهم ضعف في البصر", correct: true },
      { en: "They ignore traffic", ar: "يتجاهلون المرور", correct: false },
      { en: "They always cross at crossings", ar: "يعبرون دائمًا عند المعابر", correct: false }
    ],
    keywords: [
      { term: "guide dogs", ar: "كلاب الإرشاد", explainAr: "كلاب مدربة لمساعدة الأشخاص ذوي ضعف البصر." },
      { term: "visual impairment", ar: "ضعف البصر", explainAr: "قدرة محدودة على الرؤية قد تؤثر على القدرة على ملاحظة المرور." },
      { term: "vulnerable", ar: "ضعيف", explainAr: "أكثر عرضة للخطر ويحتاج حماية خاصة." }
    ]
  },

  {
    id: "VRU-5428",
    topic: "vulnerable-road-users",
    promptEn: "What should you do when you see people walking in the road on a narrow country lane?",
    promptAr: "ماذا يجب أن تفعل عند رؤية مشاة يسيرون في الطريق على مسار ريفي ضيق؟",
    options: [
      { en: "Drive close to them", ar: "القيادة قربهم", correct: false },
      { en: "Slow down and give them space", ar: "التخفيف ومنحهم مساحة", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false }
    ],
    keywords: [
      { term: "country lanes", ar: "المسارات الريفية", explainAr: "طرق ضيقة في المناطق الريفية قد لا تحتوي على أرصفة." },
      { term: "pedestrians", ar: "المشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام." },
      { term: "space", ar: "مساحة", explainAr: "المسافة الكافية لضمان سلامة المشاة." }
    ]
  },

  {
    id: "VRU-5429",
    topic: "vulnerable-road-users",
    promptEn: "Why must drivers be patient with vulnerable road users?",
    promptAr: "لماذا يجب على السائقين التحلي بالصبر مع مستخدمي الطريق الضعفاء؟",
    options: [
      { en: "To avoid delays", ar: "لتجنب التأخير", correct: false },
      { en: "Because they need more time and space", ar: "لأنهم يحتاجون وقتًا ومساحة أكبر", correct: true },
      { en: "Because traffic laws require it only", ar: "لأن القانون يفرض ذلك فقط", correct: false },
      { en: "Because they drive faster", ar: "لأنهم يقودون أسرع", correct: false }
    ],
    keywords: [
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالهدوء وإعطاء الوقت الكافي للآخرين." },
      { term: "vulnerable users", ar: "مستخدمو طريق ضعفاء", explainAr: "مستخدمو طريق يحتاجون حماية خاصة مثل المشاة والدراجين." },
      { term: "safety", ar: "السلامة", explainAr: "حماية الأرواح وتجنب الحوادث." }
    ]
  },

  {
    id: "VRU-5430",
    topic: "vulnerable-road-users",
    promptEn: "What is your responsibility towards vulnerable road users?",
    promptAr: "ما هي مسؤوليتك تجاه مستخدمي الطريق الضعفاء؟",
    options: [
      { en: "Expect them to follow rules perfectly", ar: "توقع التزامهم التام بالقواعد", correct: false },
      { en: "Anticipate mistakes and protect them", ar: "توقع الأخطاء وحمايتهم", correct: true },
      { en: "Drive faster to pass them", ar: "القيادة أسرع لتجاوزهم", correct: false },
      { en: "Ignore them if delayed", ar: "تجاهلهم إذا تسببوا بتأخير", correct: false }
    ],
    keywords: [
      { term: "responsibility", ar: "المسؤولية", explainAr: "الواجب الأخلاقي والقانوني لحماية الآخرين." },
      { term: "anticipation", ar: "التوقع", explainAr: "التنبؤ بالأخطاء المحتملة والاستعداد لها." },
      { term: "protection", ar: "الحماية", explainAr: "اتخاذ إجراءات لضمان سلامة مستخدمي الطريق الضعفاء." }
    ]
  },

  // --- VEHICLE HANDLING ---

  {
    id: "VH-01",
    topic: "vehicle-handling",
    promptEn: "When driving at night on a poorly lit road, what should you do to improve your visibility?",
    promptAr: "عند القيادة ليلاً على طريق قليل الإضاءة، ماذا يجب أن تفعل لتحسين الرؤية؟",
    options: [
      { en: "Use dipped headlights", ar: "استخدم الأضواء المنخفضة", correct: true },
      { en: "Use full-beam headlights at all times", ar: "استخدم الأضواء العالية طوال الوقت", correct: false },
      { en: "Drive with only parking lights", ar: "قد باستخدام أضواء الاصطفاف فقط", correct: false },
      { en: "Follow other cars very closely", ar: "اتبع السيارات الأخرى عن قرب شديد", correct: false }
    ],
    keywords: [
      { term: "dipped headlights", ar: "الأضواء المنخفضة", explainAr: "تُستخدم للرؤية أمامك دون إبهار السائقين الآخرين." }
    ]
  },

  {
    id: "VH-02",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid harsh braking on a wet road?",
    promptAr: "لماذا يجب تجنب الفرملة القوية على طريق مبلل؟",
    options: [
      { en: "It can cause the wheels to lock and skid", ar: "قد يتسبب في انغلاق العجلات وانزلاق المركبة", correct: true },
      { en: "It will reduce brake wear", ar: "يقلل من تآكل الفرامل", correct: false },
      { en: "Other drivers expect harsh braking", ar: "السائقون الآخرون يتوقعون الفرملة القوية", correct: false },
      { en: "It helps you stop faster", ar: "يساعدك على التوقف أسرع", correct: false }
    ],
    keywords: [
      { term: "skid", ar: "انزلاق", explainAr: "تفقد الإطارات تماسكها وتبدأ المركبة بالتحرك بشكل غير مسيطر عليه." }
    ]
  },

  {
    id: "VH-03",
    topic: "vehicle-handling",
    promptEn: "You are driving downhill. How can you control your vehicle's speed safely?",
    promptAr: "أنت تقود نزولاً على منحدر. كيف يمكنك التحكم بسرعة مركبتك بأمان؟",
    options: [
      { en: "Select a lower gear and use brakes gently", ar: "استخدم غياراً منخفضاً مع فرملة لطيفة", correct: true },
      { en: "Coast in neutral to save fuel", ar: "قد على الفاضي (نيوترال) لتوفير الوقود", correct: false },
      { en: "Press the clutch and free-wheel", ar: "استخدم الدبرياج واترك السيارة تتدحرج", correct: false },
      { en: "Brake harshly all the way down", ar: "استخدم الفرامل بقوة طوال النزول", correct: false }
    ],
    keywords: [
      { term: "lower gear", ar: "غيار منخفض", explainAr: "يساعد المحرك على السيطرة على السرعة دون الاعتماد الكامل على الفرامل." }
    ]
  },

  {
    id: "VH-04",
    topic: "vehicle-handling",
    promptEn: "What should you do if your vehicle begins to skid on ice?",
    promptAr: "ماذا يجب أن تفعل إذا بدأت مركبتك بالانزلاق على الجليد؟",
    options: [
      { en: "Steer gently in the same direction as the skid", ar: "وجّه المقود بلطف باتجاه الانزلاق", correct: true },
      { en: "Brake hard immediately", ar: "اضغط الفرامل بشدة فوراً", correct: false },
      { en: "Accelerate to regain control", ar: "زد السرعة لاستعادة السيطرة", correct: false },
      { en: "Turn the wheel opposite to the skid sharply", ar: "لفّ المقود بعكس الانزلاق بقوة", correct: false }
    ],
    keywords: [
      { term: "skid", ar: "انزلاق", explainAr: "حركة فقدان التماسك بسبب الجليد أو المطر." }
    ]
  },

  {
    id: "VH-05",
    topic: "vehicle-handling",
    promptEn: "On a sharp bend, how should you adjust your speed?",
    promptAr: "في منعطف حاد، كيف يجب أن تعدّل سرعتك؟",
    options: [
      { en: "Slow down before entering the bend", ar: "خفّف السرعة قبل دخول المنعطف", correct: true },
      { en: "Brake hard inside the bend", ar: "استخدم الفرامل بقوة داخل المنعطف", correct: false },
      { en: "Accelerate through the bend", ar: "زد السرعة داخل المنعطف", correct: false },
      { en: "Stop completely before turning", ar: "توقف كلياً قبل الانعطاف", correct: false }
    ],
    keywords: [
      { term: "sharp bend", ar: "منعطف حاد", explainAr: "انحناء قوي في الطريق يحتاج لتخفيض السرعة قبل دخوله." }
    ]
  },

  {
    id: "VH-06",
    topic: "vehicle-handling",
    promptEn: "When driving through a flooded area, what should you do?",
    promptAr: "عند القيادة عبر منطقة مغمورة بالمياه، ماذا يجب أن تفعل؟",
    options: [
      { en: "Drive slowly in a low gear", ar: "قد ببطء وبغيار منخفض", correct: true },
      { en: "Drive fast to clear the water quickly", ar: "قد بسرعة لتجاوز الماء سريعاً", correct: false },
      { en: "Switch to neutral", ar: "ضع الغيار على الفاضي", correct: false },
      { en: "Use cruise control", ar: "استخدم مثبت السرعة", correct: false }
    ],
    keywords: [
      { term: "flooded area", ar: "منطقة مغمورة بالمياه", explainAr: "القيادة بسرعة فوق الماء قد تسبب فقدان السيطرة أو دخول الماء للمحرك." }
    ]
  },

  {
    id: "VH-07",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid coasting (driving in neutral) down a hill?",
    promptAr: "لماذا يجب تجنب القيادة على الفاضي (نيوترال) عند النزول من منحدر؟",
    options: [
      { en: "You have less control over steering and braking", ar: "يقل التحكم بالمقود والفرامل", correct: true },
      { en: "It increases fuel consumption", ar: "يزيد استهلاك الوقود", correct: false },
      { en: "It reduces tyre wear", ar: "يقلل من تآكل الإطارات", correct: false },
      { en: "It helps the brakes cool down", ar: "يساعد على تبريد الفرامل", correct: false }
    ],
    keywords: [
      { term: "coasting", ar: "السير على الفاضي", explainAr: "فصل المحرك يقلل سيطرتك على المركبة خصوصاً عند المنحدرات." }
    ]
  },

  {
    id: "VH-08",
    topic: "vehicle-handling",
    promptEn: "In windy conditions, which vehicles are most affected by side winds?",
    promptAr: "في الأجواء العاصفة، أي المركبات تتأثر أكثر بالرياح الجانبية؟",
    options: [
      { en: "High-sided vehicles like vans and lorries", ar: "المركبات العالية مثل الفانات والشاحنات", correct: true },
      { en: "Sports cars", ar: "سيارات رياضية منخفضة", correct: false },
      { en: "Motorcycles only", ar: "الدراجات النارية فقط", correct: false },
      { en: "Cars with small engines", ar: "السيارات الصغيرة ضعيفة المحرك", correct: false }
    ],
    keywords: [
      { term: "side winds", ar: "رياح جانبية", explainAr: "الرياح التي تدفع السيارة من الجانب، تؤثر بشكل أكبر على المركبات العالية." }
    ]
  },

  // --- INCIDENTS ---

  {
    id: "IN-01",
    topic: "incidents",
    promptEn: "Your vehicle breaks down on a busy road. What is the first thing you should do?",
    promptAr: "تعطّلت مركبتك على طريق مزدحم. ما أول شيء يجب أن تفعله؟",
    options: [
      { en: "Use your hazard warning lights", ar: "شغّل أضواء التحذير", correct: true },
      { en: "Stand in the road and wave traffic around", ar: "قف في منتصف الطريق ووجّه حركة المرور بيديك", correct: false },
      { en: "Open the bonnet and wait beside the car", ar: "افتح غطاء المحرك وانتظر بجانب السيارة", correct: false },
      { en: "Push the car to the middle of the road", ar: "ادفع السيارة إلى منتصف الطريق", correct: false }
    ],
    keywords: [
      { term: "hazard warning lights", ar: "أضواء التحذير", explainAr: "تشغّل أضواء الإشارة الأربعة معاً لتنبيه السائقين الآخرين لوجود مشكلة." }
    ]
  },

  {
    id: "IN-02",
    topic: "incidents",
    promptEn: "You have stopped in a tunnel due to a breakdown. What should you do?",
    promptAr: "توقفت في نفق بسبب عطل. ماذا يجب أن تفعل؟",
    options: [
      { en: "Switch on hazard lights and call for help", ar: "شغّل أضواء التحذير واتصل بخدمة المساعدة", correct: true },
      { en: "Leave the vehicle in gear and walk back through the tunnel", ar: "اترك السيارة على الغيار وامشِ عائداً عبر النفق", correct: false },
      { en: "Turn off all lights to save the battery", ar: "أطفئ جميع الأضواء لتوفير البطارية", correct: false },
      { en: "Stand directly behind your car to warn others", ar: "قِف مباشرة خلف السيارة لتحذير الآخرين", correct: false }
    ],
    keywords: [
      { term: "tunnel", ar: "نفق", explainAr: "مكان مغلق، لذلك من المهم أن تكون سيارتك مرئية قدر الإمكان." }
    ]
  },

  {
    id: "IN-03",
    topic: "incidents",
    promptEn: "You arrive at the scene of a crash. Someone is unconscious but breathing. What should you do first?",
    promptAr: "وصلت إلى مكان حادث وهناك شخص فاقد الوعي لكنه يتنفس. ما أول شيء يجب أن تفعله؟",
    options: [
      { en: "Make sure the area is safe and call the emergency services", ar: "تتأكد أن المكان آمن وتتصل بخدمات الطوارئ", correct: true },
      { en: "Move them immediately out of the vehicle", ar: "تنقل المصاب فوراً خارج المركبة", correct: false },
      { en: "Give them something to drink", ar: "تعطيه شيئاً ليشربه", correct: false },
      { en: "Try to make them walk", ar: "تحاول أن تجعله يمشي", correct: false }
    ],
    keywords: [
      { term: "emergency services", ar: "خدمات الطوارئ", explainAr: "اتصل برقم 999 أو 112 لطلب الإسعاف أو الشرطة أو الإطفاء." }
    ]
  },

  {
    id: "IN-04",
    topic: "incidents",
    promptEn: "When should you NOT move a person who has been injured in a collision?",
    promptAr: "متى لا يجب عليك تحريك شخص أُصيب في حادث تصادم؟",
    options: [
      { en: "When they are complaining of neck or back pain", ar: "عندما يشتكي من ألم في الرقبة أو الظهر", correct: true },
      { en: "When the vehicle is on fire", ar: "عندما تكون المركبة مشتعلة بالنار", correct: false },
      { en: "When the road is completely blocked", ar: "عندما يكون الطريق مغلقاً تماماً", correct: false },
      { en: "When it is raining heavily", ar: "عندما تهطل أمطار غزيرة", correct: false }
    ],
    keywords: [
      { term: "collision", ar: "تصادم", explainAr: "حادث اصطدام قد يسبب إصابات في العمود الفقري، لذلك تحريك المصاب قد يزيد الضرر." }
    ]
  },

  {
    id: "IN-05",
    topic: "incidents",
    promptEn: "Your vehicle catches fire while you are driving. What should you do?",
    promptAr: "اشتعلت النيران في مركبتك أثناء القيادة. ماذا يجب أن تفعل؟",
    options: [
      { en: "Stop, switch off the engine, move everyone away and call the fire service", ar: "تتوقف وتطفئ المحرك وتبعد الجميع عن السيارة وتتصل بالإطفاء", correct: true },
      { en: "Keep driving to reach a garage", ar: "تواصل القيادة حتى تصل إلى كراج", correct: false },
      { en: "Open the bonnet to cool the engine", ar: "تفتح غطاء المحرك لتبريده", correct: false },
      { en: "Throw water over the engine while it's running", ar: "ترش الماء على المحرك وهو يعمل", correct: false }
    ],
    keywords: [
      { term: "fire service", ar: "خدمة الإطفاء", explainAr: "اتصل فوراً بالطوارئ إذا اشتعلت النيران بالمركبة." }
    ]
  },

  {
    id: "IN-06",
    topic: "incidents",
    promptEn: "You see a hazard ahead and need to warn drivers behind you. What is the best way to do this?",
    promptAr: "رأيت خطراً أمامك وتحتاج لتحذير السائقين خلفك. ما أفضل طريقة لذلك؟",
    options: [
      { en: "Slow down smoothly so your brake lights warn drivers behind", ar: "خفّف السرعة بسلاسة حتى تُظهر أضواء الفرامل للسائقين خلفك", correct: true },
      { en: "Switch your headlights on and off quickly", ar: "تُشغّل وتُطفئ الأضواء الأمامية بسرعة", correct: false },
      { en: "Sound your horn continuously", ar: "تستخدم البوق باستمرار", correct: false },
      { en: "Wave your arm out of the window", ar: "تُلوّح بذراعك من النافذة", correct: false }
    ],
    keywords: [
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "تخبر السائقين خلفك أنك تُبطئ أو ستتوقف." }
    ]
  },

  {
    id: "IN-07",
    topic: "incidents",
    promptEn: "Your vehicle has a puncture on a motorway and you manage to stop on the hard shoulder. What should you do?",
    promptAr: "أصابت مركبتك بنشر على الطريق السريع وتمكّنت من التوقف على كتف الطريق. ماذا يجب أن تفعل؟",
    options: [
      { en: "Leave the vehicle by the passenger side and wait behind the barrier", ar: "تخرج من جهة الراكب وتنتظر خلف الحاجز", correct: true },
      { en: "Sit in the car with your seatbelt on", ar: "تجلس داخل السيارة مع وضع حزام الأمان", correct: false },
      { en: "Stand in front of the car to warn traffic", ar: "تقف أمام السيارة لتحذير حركة المرور", correct: false },
      { en: "Place a warning triangle on the motorway", ar: "تضع مثلث تحذير على الطريق السريع", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "الجانب الأيسر على الطرق السريعة يُستخدم للحالات الطارئة فقط، ويجب مغادرة السيارة والوقوف في مكان آمن." }
    ]
  },

  {
    id: "IN-08",
    topic: "incidents",
    promptEn: "When are you allowed to use a warning triangle?",
    promptAr: "متى يُسمح لك باستخدام مثلث التحذير؟",
    options: [
      { en: "On normal roads, but never on motorways", ar: "على الطرق العادية فقط، وليس على الطرق السريعة", correct: true },
      { en: "On motorways only", ar: "على الطرق السريعة فقط", correct: false },
      { en: "Anywhere, including inside tunnels", ar: "في أي مكان، حتى داخل الأنفاق", correct: false },
      { en: "Only in good weather conditions", ar: "فقط في الأحوال الجوية الجيدة", correct: false }
    ],
    keywords: [
      { term: "warning triangle", ar: "مثلث التحذير", explainAr: "يوضع على بعد مناسب خلف المركبة المتعطلة على الطرق العادية، لكن لا يُستخدم على الطرق السريعة." }
    ]
  },

  // --- DOCUMENTS ---

  {
    id: "DC-01",
    topic: "documents",
    promptEn: "A police officer asks to see your driving licence and insurance. You don't have them with you. What should you do?",
    promptAr: "شرطي يطلب رؤية رخصة القيادة والتأمين، وليس معك هذه الوثائق. ماذا يجب أن تفعل؟",
    options: [
      { en: "Produce them at a police station within 7 days", ar: "تُبرزها في مركز شرطة خلال ٧ أيام", correct: true },
      { en: "Ignore the request and drive away", ar: "تتجاهل الطلب وتغادر", correct: false },
      { en: "Show any old documents you have", ar: "تُظهِر أي وثائق قديمة لديك", correct: false },
      { en: "Tell the officer you'll email them one day", ar: "تقول للشرطي إنك سترسلها بالبريد الإلكتروني لاحقاً", correct: false }
    ],
    keywords: [
      { term: "driving licence", ar: "رخصة القيادة", explainAr: "وثيقة رسمية تثبت أنك مسموح لك قانونياً بالقيادة." },
      { term: "insurance", ar: "التأمين", explainAr: "وثيقة تغطي تكاليف الأضرار أو الإصابات في الحوادث." }
    ]
  },

  {
    id: "DC-02",
    topic: "documents",
    promptEn: "What does third-party insurance cover?",
    promptAr: "ماذا يغطي التأمين من نوع الطرف الثالث (Third-party)؟",
    options: [
      { en: "Damage or injury you cause to others", ar: "الأضرار أو الإصابات التي تسببها للآخرين", correct: true },
      { en: "Any damage to your own vehicle", ar: "أي ضرر يصيب سيارتك أنت", correct: false },
      { en: "Breakdown recovery and MOT cost", ar: "سحب السيارة عند العطل وتكاليف الفحص السنوي", correct: false },
      { en: "The cost of fuel and servicing", ar: "تكاليف الوقود والصيانة", correct: false }
    ],
    keywords: [
      { term: "third-party", ar: "طرف ثالث", explainAr: "أبسط نوع تأمين إلزامي يغطي فقط ضرر الآخرين وليس سيارتك." }
    ]
  },

  {
    id: "DC-03",
    topic: "documents",
    promptEn: "For how long is an MOT certificate normally valid?",
    promptAr: "كم مدة صلاحية شهادة فحص الـ MOT عادةً؟",
    options: [
      { en: "One year", ar: "سنة واحدة", correct: true },
      { en: "Six months", ar: "ستة أشهر", correct: false },
      { en: "Two years", ar: "سنتان", correct: false },
      { en: "Until the vehicle is sold", ar: "حتى تُباع المركبة", correct: false }
    ],
    keywords: [
      { term: "MOT certificate", ar: "شهادة MOT", explainAr: "إثبات أن السيارة اجتازت الفحص الفني السنوي المطلوب قانونياً." }
    ]
  },

  {
    id: "DC-04",
    topic: "documents",
    promptEn: "When must you notify the DVLA about a change of address?",
    promptAr: "متى يجب عليك إبلاغ الـ DVLA بتغيير عنوان سكنك؟",
    options: [
      { en: "As soon as you change your permanent address", ar: "حالما تغيّر عنوان سكنك الدائم", correct: true },
      { en: "Only when your licence expires", ar: "فقط عند انتهاء صلاحية رخصتك", correct: false },
      { en: "Only if you buy a new car", ar: "فقط إذا اشتريت سيارة جديدة", correct: false },
      { en: "You never need to inform them", ar: "لا تحتاج لإبلاغهم أبداً", correct: false }
    ],
    keywords: [
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." }
    ]
  },

  {
    id: "DC-05",
    topic: "documents",
    promptEn: "What does a Statutory Off Road Notification (SORN) declare?",
    promptAr: "ماذا تعلن وثيقة الـ SORN (إخراج السيارة من الطريق)؟",
    options: [
      { en: "That the vehicle is not being used or kept on public roads", ar: "أن السيارة لا تُستخدم ولا تُحفظ على الطرق العامة", correct: true },
      { en: "That the vehicle has passed its MOT", ar: "أن السيارة اجتازت فحص الـ MOT", correct: false },
      { en: "That the vehicle is insured for any driver", ar: "أن السيارة مؤمّنة لأي سائق", correct: false },
      { en: "That the vehicle can be driven without tax", ar: "أن السيارة يمكن قيادتها بدون ضريبة", correct: false }
    ],
    keywords: [
      { term: "SORN", ar: "SORN", explainAr: "تصرّح بأن السيارة خارج الاستخدام على الطرق العامة، لذلك لا تحتاج ضريبة أو تأمين ما دامت متوقفة خارج الطريق." }
    ]
  },

  {
    id: "DC-06",
    topic: "documents",
    promptEn: "Which document must you keep in the vehicle when driving abroad in Europe?",
    promptAr: "أي وثيقة يجب الاحتفاظ بها في السيارة عند القيادة خارج بريطانيا في أوروبا؟",
    options: [
      { en: "Your vehicle registration document (V5C)", ar: "وثيقة تسجيل المركبة (V5C)", correct: true },
      { en: "Your service history", ar: "سجل الصيانة", correct: false },
      { en: "Your fuel receipts", ar: "فواتير الوقود", correct: false },
      { en: "Garage invoices", ar: "فواتير الورشة (الكراج)", correct: false }
    ],
    keywords: [
      { term: "V5C", ar: "V5C", explainAr: "وثيقة تسجيل السيارة التي تُظهر تفاصيل المالك والمركبة." }
    ]
  },

  // --- MOTORWAY DRIVING ---

  {
    id: "MW-01",
    topic: "motorway-driving",
    promptEn: "When joining a motorway, what should you do on the slip road?",
    promptAr: "عند الانضمام إلى الطريق السريع، ماذا يجب أن تفعل على مسار الاندماج (Slip road)؟",
    options: [
      { en: "Match your speed to the traffic on the motorway", ar: "ضَبِط سرعتك لتتناسب مع سرعة حركة المرور على الطريق السريع", correct: true },
      { en: "Stop at the end of the slip road", ar: "تتوقف عند نهاية مسار الاندماج", correct: false },
      { en: "Drive slowly to avoid danger", ar: "تقود ببطء لتجنب الخطر", correct: false },
      { en: "Always use the horn before joining", ar: "تستخدم البوق دائماً قبل الاندماج", correct: false }
    ],
    keywords: [
      { term: "slip road", ar: "مسار الاندماج", explainAr: "المسار الذي تستخدمه لتصل إلى سرعة مناسبة قبل الدخول إلى الطريق السريع." }
    ]
  },

  {
    id: "MW-02",
    topic: "motorway-driving",
    promptEn: "Which lane should you normally use for traveling on a motorway?",
    promptAr: "أي مسار يجب أن تستخدمه عادةً عند القيادة على الطريق السريع؟",
    options: [
      { en: "The left-hand lane", ar: "المسار الأيسر", correct: true },
      { en: "The middle lane", ar: "المسار الأوسط", correct: false },
      { en: "Any lane you prefer", ar: "أي مسار تفضّله", correct: false },
      { en: "The right-hand lane only", ar: "المسار الأيمن فقط", correct: false }
    ],
    keywords: [
      { term: "left-hand lane", ar: "المسار الأيسر", explainAr: "المسار الأساسي للسير العادي، والممرات الأخرى للتجاوز." }
    ]
  },

  {
    id: "MW-03",
    topic: "motorway-driving",
    promptEn: "When are you allowed to stop on the hard shoulder of a motorway?",
    promptAr: "متى يُسمح لك بالتوقف على الكتف الجانبي للطريق السريع؟",
    options: [
      { en: "In an emergency only", ar: "في حالة طارئة فقط", correct: true },
      { en: "To make a phone call", ar: "لإجراء مكالمة هاتفية", correct: false },
      { en: "To check your map", ar: "لتفقد الخريطة", correct: false },
      { en: "To rest if you feel tired", ar: "للراحة إذا شعرت بالتعب", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "الكتف الجانبي", explainAr: "يُستخدم فقط لحالات الطوارئ ولا يُستخدم للوقوف العادي." }
    ]
  },

  {
    id: "MW-04",
    topic: "motorway-driving",
    promptEn: "What do countdown markers on the left side of a motorway indicate?",
    promptAr: "ماذا تشير علامات العد التنازلي على الجانب الأيسر من الطريق السريع؟",
    options: [
      { en: "The distance to the next exit", ar: "المسافة المتبقية حتى المخرج التالي", correct: true },
      { en: "The speed limit is changing ahead", ar: "أن حد السرعة سيتغير قريباً", correct: false },
      { en: "Roadworks ahead", ar: "أعمال طرق أمامك", correct: false },
      { en: "Lane closure ahead", ar: "إغلاق مسار قريباً", correct: false }
    ],
    keywords: [
      { term: "countdown markers", ar: "علامات العد التنازلي", explainAr: "ثلاثة خطوط على جانب الطريق تدل على اقترابك من المخرج." }
    ]
  },

  {
    id: "MW-05",
    topic: "motorway-driving",
    promptEn: "You miss your exit on a motorway. What should you do?",
    promptAr: "فاتك المخرج على الطريق السريع. ماذا يجب أن تفعل؟",
    options: [
      { en: "Continue to the next exit", ar: "تتابع إلى المخرج التالي", correct: true },
      { en: "Reverse back to the exit", ar: "ترجع إلى الخلف للوصول للمخرج", correct: false },
      { en: "Stop immediately and turn around", ar: "تتوقف فوراً وتستدير", correct: false },
      { en: "Drive onto the hard shoulder and reverse", ar: "تدخل على الكتف وترجع للخلف", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-06",
    topic: "motorway-driving",
    promptEn: "What should you do if traffic is joining from a slip road on your left?",
    promptAr: "ماذا يجب أن تفعل إذا كانت حركة المرور تندمج من مسار اندماج على يسارك؟",
    options: [
      { en: "Adjust speed or change lanes to help them join safely", ar: "تعدّل سرعتك أو تغيّر مسارك لمساعدتهم على الاندماج بأمان", correct: true },
      { en: "Block them by speeding up", ar: "تمنعهم عبر زيادة السرعة", correct: false },
      { en: "Sound your horn at them", ar: "تستخدم البوق ضدهم", correct: false },
      { en: "Ignore them completely", ar: "تتجاهلهم تماماً", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-07",
    topic: "motorway-driving",
    promptEn: "If you feel tired while driving on a motorway, what should you do?",
    promptAr: "إذا شعرت بالتعب أثناء القيادة على الطريق السريع، ماذا يجب أن تفعل؟",
    options: [
      { en: "Leave the motorway at the next exit and rest", ar: "تخرج من الطريق عند أقرب مخرج وتستريح", correct: true },
      { en: "Slow down on the hard shoulder", ar: "تخفّف السرعة على الكتف", correct: false },
      { en: "Turn on hazard lights and keep driving", ar: "تشغّل الهزارْد وتُكمل القيادة", correct: false },
      { en: "Drink coffee while driving faster", ar: "تشرب قهوة وتزيد السرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-08",
    topic: "motorway-driving",
    promptEn: "On a motorway, which lane should you use to overtake?",
    promptAr: "على الطريق السريع، أي مسار يجب أن تستخدمه لتجاوز مركبة أخرى؟",
    options: [
      { en: "The right-hand lane", ar: "المسار الأيمن", correct: true },
      { en: "The left-hand lane", ar: "المسار الأيسر", correct: false },
      { en: "The middle lane only", ar: "المسار الأوسط فقط", correct: false },
      { en: "Any lane you choose", ar: "أي مسار تختاره", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-09",
    topic: "motorway-driving",
    promptEn: "What is the national speed limit for cars on a motorway?",
    promptAr: "ما هو حد السرعة الوطني للسيارات على الطريق السريع؟",
    options: [
      { en: "70 mph", ar: "٧٠ ميل/ساعة", correct: true },
      { en: "60 mph", ar: "٦٠ ميل/ساعة", correct: false },
      { en: "50 mph", ar: "٥٠ ميل/ساعة", correct: false },
      { en: "80 mph", ar: "٨٠ ميل/ساعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-10",
    topic: "motorway-driving",
    promptEn: "What should you do if you see a red 'X' sign above your lane on a smart motorway?",
    promptAr: "ماذا يجب أن تفعل إذا رأيت علامة (X) حمراء فوق مسارك على طريق سريع ذكي؟",
    options: [
      { en: "Leave the lane as soon as it is safe", ar: "تغادر المسار فور أن يكون ذلك آمناً", correct: true },
      { en: "Continue driving normally in that lane", ar: "تُكمل القيادة بشكل طبيعي في ذاك المسار", correct: false },
      { en: "Turn on hazard lights and stay in your lane", ar: "تشغّل الهزارْد وتبقى في مسارك", correct: false },
      { en: "Stop immediately in that lane", ar: "تتوقف فوراً داخل المسار", correct: false }
    ],
    keywords: [
      { term: "smart motorway", ar: "طريق سريع ذكي", explainAr: "يستخدم شاشات إلكترونية لإدارة السرعات والمسارات." }
    ]
  },

  // --- OTHER TYPES OF VEHICLES ---

  {
    id: "OV-01",
    topic: "other-vehicles",
    promptEn: "You are following a large lorry. What should you do to see the road ahead more clearly?",
    promptAr: "أنت تتبع شاحنة كبيرة. ماذا يجب أن تفعل لترى الطريق أمامك بشكل أوضح؟",
    options: [
      { en: "Stay further back to increase your view of the road", ar: "تبقى على مسافة أبعد لتوسيع مجال الرؤية أمامك", correct: true },
      { en: "Drive very close behind the lorry", ar: "تقود ملاصقاً للشاحنة", correct: false },
      { en: "Overtake immediately, even if you can't see ahead", ar: "تتجاوز فوراً حتى لو لم ترَ الطريق جيداً", correct: false },
      { en: "Use full-beam headlights", ar: "تستخدم الأضواء العالية", correct: false }
    ],
    keywords: [
      { term: "lorry", ar: "شاحنة كبيرة", explainAr: "مركبة كبيرة تحجب الرؤية أمامك إذا كنت قريباً منها." }
    ]
  },

  {
    id: "OV-02",
    topic: "other-vehicles",
    promptEn: "A long vehicle is turning left but swings out to the right first. What should you do?",
    promptAr: "مركبة طويلة تنعطف لليسار لكنها تنحرف لليمين أولاً. ماذا يجب أن تفعل؟",
    options: [
      { en: "Stay behind and do not try to pass on the left", ar: "تبقى خلفها ولا تحاول المرور من اليسار", correct: true },
      { en: "Drive alongside it on the left to get past", ar: "تقود بجانبها من اليسار لتتجاوزها", correct: false },
      { en: "Use your horn and overtake on the right", ar: "تستخدم البوق وتتجاوز من اليمين", correct: false },
      { en: "Pull up very close behind it", ar: "تقترب منها كثيراً من الخلف", correct: false }
    ],
    keywords: [
      { term: "long vehicle", ar: "مركبة طويلة", explainAr: "كالشاحنات أو الباصات التي تحتاج مساحة أكبر للانعطاف." }
    ]
  },

  {
    id: "OV-03",
    topic: "other-vehicles",
    promptEn: "You intend to overtake a long, slow-moving vehicle. What is the main risk?",
    promptAr: "تنوي تجاوز مركبة طويلة تسير ببطء. ما هو الخطر الرئيسي؟",
    options: [
      { en: "You will need more time and distance to overtake safely", ar: "ستحتاج وقتاً ومسافة أطول لتجاوزها بأمان", correct: true },
      { en: "The vehicle will always pull over for you", ar: "هذه المركبة ستتنحى جانباً دائماً لتسمح لك", correct: false },
      { en: "Your car will use less fuel", ar: "سيارتك ستستهلك وقوداً أقل", correct: false },
      { en: "You can overtake in short gaps easily", ar: "يمكنك التجاوز في فترات قصيرة بسهولة", correct: false }
    ],
    keywords: [
      { term: "overtake", ar: "تتجاوز", explainAr: "تمر أمام مركبة أخرى، وتحتاج مسافة رؤية كافية." }
    ]
  },

  {
    id: "OV-04",
    topic: "other-vehicles",
    promptEn: "Why must you take extra care at junctions where motorcyclists are present?",
    promptAr: "لماذا يجب أن تكون أكثر حذراً عند التقاطعات التي يوجد فيها سائقي دراجات نارية؟",
    options: [
      { en: "They are smaller and can be easily hidden from view", ar: "لأنهم أصغر حجماً وقد يختفون عن مجال رؤيتك بسهولة", correct: true },
      { en: "They always have right of way", ar: "لأن لديهم أولوية المرور دائماً", correct: false },
      { en: "They always travel at very low speeds", ar: "لأنهم يسيرون بسرعات منخفضة دائماً", correct: false },
      { en: "They are protected by their vehicles", ar: "لأن مركباتهم تحميهم بشكل كبير", correct: false }
    ],
    keywords: [
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "من الصعب ملاحظتهم في المرايا والتقاطعات لصغر حجمهم." }
    ]
  },

  {
    id: "OV-05",
    topic: "other-vehicles",
    promptEn: "You see a bus signalling to pull away from a bus stop in a built-up area. What should you do?",
    promptAr: "ترى حافلة تُشغّل إشارة لتغادر موقف الباص في منطقة مبنية. ماذا يجب أن تفعل؟",
    options: [
      { en: "Be prepared to slow down and let it move out", ar: "تكون مستعداً لتخفيف السرعة والسماح لها بالتحرك", correct: true },
      { en: "Speed up to pass before it moves", ar: "تزيد السرعة لتتجاوزها قبل أن تتحرك", correct: false },
      { en: "Sound your horn to warn the driver", ar: "تستخدم البوق لتحذير السائق", correct: false },
      { en: "Flash your headlights and maintain speed", ar: "تومض بالأضواء وتُحافظ على سرعتك", correct: false }
    ],
    keywords: [
      { term: "built-up area", ar: "منطقة مبنية", explainAr: "منطقة فيها مبانٍ وسكان، وغالباً ما تكون السرعة محدودة (مثل 30 mph)." }
    ]
  },

  {
    id: "OV-06",
    topic: "other-vehicles",
    promptEn: "You are following a tractor on a narrow road. What should you do if you cannot overtake safely?",
    promptAr: "أنت تتبع جرّاراً (Tractor) على طريق ضيق، ولا تستطيع التجاوز بأمان. ماذا يجب أن تفعل؟",
    options: [
      { en: "Stay behind and be patient", ar: "تبقى خلفه وتتحلّى بالصبر", correct: true },
      { en: "Drive on the pavement to pass", ar: "تقود على الرصيف لتتجاوزه", correct: false },
      { en: "Keep flashing your headlights", ar: "تومض بالأضواء باستمرار", correct: false },
      { en: "Use your horn until it pulls over", ar: "تستخدم البوق حتى يبتعد عن الطريق", correct: false }
    ],
    keywords: [
      { term: "tractor", ar: "جرّار زراعي", explainAr: "مركبة بطيئة وقد تشغل عرض الطريق، لكن التجاوز يجب أن يكون فقط عندما تكون الرؤية والمسافة كافية." }
    ]
  },

  {
    id: "OV-07",
    topic: "other-vehicles",
    promptEn: "Why should you allow extra room when following a motorcyclist in wet conditions?",
    promptAr: "لماذا يجب أن تترك مسافة إضافية عند اتباع درّاج ناري في ظروف جوية ماطرة؟",
    options: [
      { en: "They may need to change direction suddenly to avoid surface water", ar: "قد يحتاج لتغيير اتجاهه فجأة لتفادي تجمعات المياه", correct: true },
      { en: "They always stop much faster than cars", ar: "لأنهم يتوقفون أسرع من السيارات دائماً", correct: false },
      { en: "They are not affected by wet roads", ar: "لأن الطرق المبللة لا تؤثر عليهم", correct: false },
      { en: "They don't use their brakes in the rain", ar: "لأنهم لا يستخدمون الفرامل في المطر", correct: false }
    ],
    keywords: [
      { term: "surface water", ar: "مياه على سطح الطريق", explainAr: "تجمعات الماء قد تتسبب في انزلاق، فيحتاج الدرّاج للمناورة لتفاديها." }
    ]
  },

  {
    id: "OV-08",
    topic: "other-vehicles",
    promptEn: "You're approaching a tramway or bus lane that you're not allowed to use. What should you do?",
    promptAr: "أنت تقترب من مسار ترام أو حافلات غير مسموح لك باستخدامه. ماذا يجب أن تفعل؟",
    options: [
      { en: "Stay out of the lane and follow the signs and road markings", ar: "تبقى خارج المسار وتتبع اللوحات والعلامات على الطريق", correct: true },
      { en: "Use the lane if it looks clear", ar: "تستخدم المسار إذا بدا خالياً", correct: false },
      { en: "Drive in the lane to overtake slower traffic", ar: "تقود داخل المسار لتتجاوز المركبات البطيئة", correct: false },
      { en: "Use the lane only at night", ar: "تستخدم المسار ليلاً فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "OV-6101",
    topic: "other-vehicles",
    promptEn: "Why should you be especially cautious when overtaking a long vehicle?",
    promptAr: "لماذا يجب أن تكون حذرًا بشكل خاص عند تجاوز مركبة طويلة؟",
    options: [
      { en: "It may suddenly stop", ar: "قد تتوقف فجأة", correct: false },
      { en: "It takes longer to pass safely", ar: "تحتاج وقتًا أطول للتجاوز بأمان", correct: true },
      { en: "It always drives slowly", ar: "تقود دائمًا ببطء", correct: false },
      { en: "It blocks road signs", ar: "تحجب إشارات الطريق", correct: false }
    ],
    keywords: [
      { term: "long vehicle", ar: "مركبة طويلة", explainAr: "مركبة طويلة مثل الشاحنات أو الحافلات التي تحتاج مسافة أكبر للتجاوز بأمان." },
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى في نفس الاتجاه." },
      { term: "safety", ar: "الأمان", explainAr: "ضمان عدم تعريض نفسك أو الآخرين للخطر." }
    ]
  },

  {
    id: "OV-6102",
    topic: "other-vehicles",
    promptEn: "What should you do when a bus signals to move away from a bus stop?",
    promptAr: "ماذا يجب أن تفعل عندما تشير الحافلة إلى نيتها مغادرة موقف الحافلات؟",
    options: [
      { en: "Speed up to pass it", ar: "زيادة السرعة لتجاوزها", correct: false },
      { en: "Give way if it is safe to do so", ar: "إعطاؤها الأولوية إذا كان ذلك آمنًا", correct: true },
      { en: "Sound your horn", ar: "استخدام البوق", correct: false },
      { en: "Stop immediately", ar: "التوقف فورًا", correct: false }
    ],
    keywords: [
      { term: "bus", ar: "حافلة", explainAr: "مركبة نقل عام قد تتوقف وتنطلق من محطات محددة." },
      { term: "giving way", ar: "إعطاء الأولوية", explainAr: "السماح لمركبة أخرى بالمرور أولاً." },
      { term: "bus stop", ar: "موقف الحافلات", explainAr: "مكان محدد تتوقف فيه الحافلات لركوب أو نزول الركاب." }
    ]
  },

  {
    id: "OV-6103",
    topic: "other-vehicles",
    promptEn: "Why should you allow extra room when overtaking a cyclist?",
    promptAr: "لماذا يجب ترك مسافة إضافية عند تجاوز دراجة هوائية؟",
    options: [
      { en: "Cyclists always ride unpredictably", ar: "الدراجات دائمًا غير متوقعة", correct: false },
      { en: "Cyclists may swerve to avoid hazards", ar: "قد تنحرف الدراجات لتجنب مخاطر", correct: true },
      { en: "Cyclists travel very slowly", ar: "الدراجات بطيئة جدًا", correct: false },
      { en: "Cyclists must give way to cars", ar: "الدراجات يجب أن تعطي أولوية للسيارات", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "راكب دراجة", explainAr: "شخص يركب دراجة هوائية على الطريق." },
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى في نفس الاتجاه." },
      { term: "clearance", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة التي تتجاوزها." }
    ]
  },

  {
    id: "OV-6104",
    topic: "other-vehicles",
    promptEn: "What is a common hazard when driving near agricultural vehicles?",
    promptAr: "ما الخطر الشائع عند القيادة قرب المركبات الزراعية؟",
    options: [
      { en: "High speed movement", ar: "حركة عالية السرعة", correct: false },
      { en: "Mud or debris on the road", ar: "وحل أو مخلفات على الطريق", correct: true },
      { en: "Bright headlights", ar: "أضواء قوية", correct: false },
      { en: "Sudden lane changes", ar: "تغييرات مسار مفاجئة", correct: false }
    ],
    keywords: [
      { term: "agricultural vehicles", ar: "المركبات الزراعية", explainAr: "مركبات تستخدم في الزراعة مثل الجرارات والحصادات." },
      { term: "mud", ar: "وحل", explainAr: "طين رطب قد يتركه على الطريق من الحقول." },
      { term: "hazard", ar: "خطر", explainAr: "شيء قد يسبب حادث أو مشكلة على الطريق." }
    ]
  },

  {
    id: "OV-6105",
    topic: "other-vehicles",
    promptEn: "Why should you be cautious when passing animals on the road?",
    promptAr: "لماذا يجب الحذر عند المرور بجانب الحيوانات على الطريق؟",
    options: [
      { en: "They always stay still", ar: "تبقى ثابتة دائمًا", correct: false },
      { en: "They may move unpredictably", ar: "قد تتحرك بشكل غير متوقع", correct: true },
      { en: "They are trained to avoid cars", ar: "مدربة على تجنب السيارات", correct: false },
      { en: "They only appear at night", ar: "تظهر فقط ليلًا", correct: false }
    ],
    keywords: [
      { term: "animals", ar: "حيوانات", explainAr: "حيوانات قد تكون على الطريق أو بجانبه." },
      { term: "unpredictable", ar: "غير متوقع", explainAr: "شيء قد يتحرك أو يتصرف بطريقة لا يمكن توقعها." },
      { term: "rural roads", ar: "طرق ريفية", explainAr: "طرق في المناطق الريفية حيث قد تكون الحيوانات أكثر شيوعًا." }
    ]
  },

  {
    id: "OV-6106",
    topic: "other-vehicles",
    promptEn: "What should you do when approaching a tram on the road?",
    promptAr: "ماذا يجب أن تفعل عند الاقتراب من ترام على الطريق؟",
    options: [
      { en: "Assume it can steer to avoid you", ar: "افتراض أنه يمكنه الانحراف", correct: false },
      { en: "Give it priority and allow extra space", ar: "إعطاؤه أولوية وترك مسافة إضافية", correct: true },
      { en: "Overtake quickly", ar: "التجاوز بسرعة", correct: false },
      { en: "Sound your horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "tram", ar: "ترام", explainAr: "مركبة نقل عام تسير على قضبان ثابتة في الطريق." },
      { term: "priority", ar: "أولوية", explainAr: "الحق في المرور أولاً." },
      { term: "fixed tracks", ar: "قضبان ثابتة", explainAr: "قضبان لا يمكن للترام الانحراف عنها." }
    ]
  },

  {
    id: "OV-6107",
    topic: "other-vehicles",
    promptEn: "Why should you leave more space behind a motorcycle than a car?",
    promptAr: "لماذا يجب ترك مسافة أكبر خلف دراجة نارية مقارنة بسيارة؟",
    options: [
      { en: "Motorcycles have poor brakes", ar: "مكابحها ضعيفة", correct: false },
      { en: "They can slow down or stop quickly", ar: "يمكنها التباطؤ أو التوقف بسرعة", correct: true },
      { en: "They are wider", ar: "أعرض", correct: false },
      { en: "They must use the hard shoulder", ar: "يجب أن تستخدم كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "motorcycle", ar: "دراجة نارية", explainAr: "مركبة ذات عجلتين أسرع وأخف من السيارة." },
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها خلف المركبة أمامك." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "التوقف بسرعة دون تحذير مسبق." }
    ]
  },

  {
    id: "OV-6108",
    topic: "other-vehicles",
    promptEn: "What should you be aware of when driving near a horse and rider?",
    promptAr: "ما الذي يجب الانتباه له عند القيادة قرب حصان وفارس؟",
    options: [
      { en: "Horses are not affected by noise", ar: "الخيول لا تتأثر بالضجيج", correct: false },
      { en: "Horses can be startled by sudden sounds", ar: "قد تفزع الخيول من الأصوات المفاجئة", correct: true },
      { en: "Horses must give way to cars", ar: "الخيول يجب أن تعطي أولوية للسيارات", correct: false },
      { en: "Riders will always signal", ar: "الفرسان دائمًا يشيرون", correct: false }
    ],
    keywords: [
      { term: "horse rider", ar: "فارس", explainAr: "شخص يركب حصانًا على الطريق." },
      { term: "animals", ar: "حيوانات", explainAr: "الخيول حيوانات قد تفزع من الأصوات أو الحركات المفاجئة." },
      { term: "noise", ar: "ضجيج", explainAr: "الأصوات العالية أو المفاجئة التي قد تخيف الحيوانات." }
    ]
  },

  {
    id: "OV-6109",
    topic: "other-vehicles",
    promptEn: "Why can articulated lorries be difficult to overtake safely?",
    promptAr: "لماذا قد يكون تجاوز الشاحنات المقطورة صعبًا بأمان؟",
    options: [
      { en: "They accelerate quickly", ar: "تتسارع بسرعة", correct: false },
      { en: "They are long and reduce visibility", ar: "طويلة وتقلل الرؤية", correct: true },
      { en: "They always change lanes", ar: "تغير المسارات دائمًا", correct: false },
      { en: "They use warning lights", ar: "تستخدم أضواء تحذير", correct: false }
    ],
    keywords: [
      { term: "articulated lorry", ar: "شاحنة مقطورة", explainAr: "شاحنة كبيرة مع مقطورة متصلة بها، مما يجعلها طويلة جدًا." },
      { term: "visibility", ar: "الرؤية", explainAr: "قدرتك على رؤية الطريق والمركبات الأخرى." },
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى في نفس الاتجاه." }
    ]
  },

  {
    id: "OV-6110",
    topic: "other-vehicles",
    promptEn: "What is the safest approach when following a slow-moving vehicle on a narrow road?",
    promptAr: "ما التصرف الأكثر أمانًا عند اتباع مركبة بطيئة على طريق ضيق؟",
    options: [
      { en: "Overtake immediately", ar: "التجاوز فورًا", correct: false },
      { en: "Be patient and wait for a safe opportunity", ar: "التحلي بالصبر وانتظار فرصة آمنة", correct: true },
      { en: "Sound the horn to warn them", ar: "استخدام البوق للتحذير", correct: false },
      { en: "Drive very close to encourage speed", ar: "الاقتراب لتشجيع السرعة", correct: false }
    ],
    keywords: [
      { term: "slow vehicle", ar: "مركبة بطيئة", explainAr: "مركبة تسير بسرعة أقل من السرعة الطبيعية للطريق." },
      { term: "narrow road", ar: "طريق ضيق", explainAr: "طريق بمساحة محدودة للمرور والتجاوز." },
      { term: "patience", ar: "صبر", explainAr: "القدرة على الانتظار حتى تتاح فرصة آمنة للتجاوز." }
    ]
  },

  // --- VEHICLE LOADING ---

  {
    id: "VL-01",
    topic: "vehicle-loading",
    promptEn: "How does carrying a heavy load affect your vehicle?",
    promptAr: "كيف يؤثر حمل حمولة ثقيلة على مركبتك؟",
    options: [
      { en: "It increases stopping distance", ar: "يزيد مسافة التوقف", correct: true },
      { en: "It improves braking performance", ar: "يحسن أداء الفرامل", correct: false },
      { en: "It makes the vehicle accelerate faster", ar: "يجعل المركبة تتسارع أسرع", correct: false },
      { en: "It has no effect on handling", ar: "لا يؤثر أبداً على التحكم", correct: false }
    ],
    keywords: [
      { term: "heavy load", ar: "حمولة ثقيلة", explainAr: "الوزن الزائد يجعل التوقف أصعب ويزيد الضغط على الفرامل." }
    ]
  },

  {
    id: "VL-02",
    topic: "vehicle-loading",
    promptEn: "What should you do after loading your vehicle heavily?",
    promptAr: "ماذا يجب أن تفعل بعد تحميل مركبتك بحمولة ثقيلة؟",
    options: [
      { en: "Increase tyre pressure if needed", ar: "ترفع ضغط الإطارات إذا لزم الأمر", correct: true },
      { en: "Decrease tyre pressure", ar: "تخفّض ضغط الإطارات", correct: false },
      { en: "Turn off ABS", ar: "تُطفئ نظام ABS", correct: false },
      { en: "Use high-beam headlights", ar: "تستخدم الأضواء العالية", correct: false }
    ],
    keywords: [
      { term: "tyre pressure", ar: "ضغط الإطارات", explainAr: "الحمولة الثقيلة تحتاج ضغطاً أعلى قليلاً حسب مواصفات السيارة." }
    ]
  },

  {
    id: "VL-03",
    topic: "vehicle-loading",
    promptEn: "If your load sticks out at the back, what must you do?",
    promptAr: "إذا كانت الحمولة بارزة من الخلف، ماذا يجب عليك أن تفعل؟",
    options: [
      { en: "Mark it clearly so other drivers can see it", ar: "تعلّمها بوضوح ليتمكن السائقون من رؤيتها", correct: true },
      { en: "Drive faster to reduce danger", ar: "تقود أسرع لتقليل الخطر", correct: false },
      { en: "Ignore it unless it is very long", ar: "تتجاهلها إلا إذا كانت طويلة جداً", correct: false },
      { en: "Cover it completely with a cloth", ar: "تغطيها بالكامل بقطعة قماش", correct: false }
    ],
    keywords: [
      { term: "mark it", ar: "وضع علامة", explainAr: "استخدام قطعة عاكسة أو لوحة تحذير للحمولات البارزة." }
    ]
  },

  {
    id: "VL-04",
    topic: "vehicle-loading",
    promptEn: "What happens if your load is not secured properly?",
    promptAr: "ماذا يحدث إذا لم يتم تثبيت الحمولة بشكل صحيح؟",
    options: [
      { en: "It may fall off and cause danger", ar: "قد تسقط وتتسبب بخطر", correct: true },
      { en: "It improves fuel efficiency", ar: "يحسن استهلاك الوقود", correct: false },
      { en: "It reduces stopping distance", ar: "يقلل مسافة التوقف", correct: false },
      { en: "It helps vehicle stability", ar: "يساعد على استقرار السيارة", correct: false }
    ],
    keywords: [
      { term: "secured", ar: "مثبتة", explainAr: "تثبيت غير محكم قد يجعل الحمولة تتحرك أو تسقط." }
    ]
  },

  {
    id: "VL-05",
    topic: "vehicle-loading",
    promptEn: "Why is it important not to overload your vehicle?",
    promptAr: "لماذا من المهم ألا تقوم بتحميل سيارتك فوق الحد المسموح؟",
    options: [
      { en: "It affects steering and braking", ar: "يؤثر على التوجيه والفرملة", correct: true },
      { en: "It improves cornering", ar: "يحسن الانعطاف", correct: false },
      { en: "It reduces tyre grip", ar: "يزيد تماسك الإطارات", correct: false },
      { en: "It makes the vehicle more stable", ar: "يجعل المركبة أكثر ثباتاً", correct: false }
    ],
    keywords: []
  },

  {
    id: "VL-06",
    topic: "vehicle-loading",
    promptEn: "What should you check after placing roof luggage on your car?",
    promptAr: "ماذا يجب أن تفحص بعد تثبيت حمولة على سقف السيارة؟",
    options: [
      { en: "That the roof rack is secure and the load is tied properly", ar: "أن حامل السقف مثبت جيداً والحمولة مربوطة بإحكام", correct: true },
      { en: "That windows are closed", ar: "أن النوافذ مغلقة", correct: false },
      { en: "That the fuel tank is full", ar: "أن خزان الوقود ممتلئ", correct: false },
      { en: "That headlights are on", ar: "أن الأضواء مشغلة", correct: false }
    ],
    keywords: []
  },

  {
    id: "VL-07",
    topic: "vehicle-loading",
    promptEn: "How does extra weight affect fuel consumption?",
    promptAr: "كيف يؤثر الوزن الزائد على استهلاك الوقود؟",
    options: [
      { en: "It increases fuel consumption", ar: "يزيد من استهلاك الوقود", correct: true },
      { en: "It reduces consumption", ar: "يقلل الاستهلاك", correct: false },
      { en: "It has no effect", ar: "لا يؤثر", correct: false },
      { en: "It improves engine performance", ar: "يحسن أداء المحرك", correct: false }
    ],
    keywords: []
  },

  {
    id: "VL-08",
    topic: "vehicle-loading",
    promptEn: "After loading the car, why should you adjust your headlights?",
    promptAr: "بعد تحميل السيارة، لماذا يجب عليك تعديل مستوى الأضواء الأمامية؟",
    options: [
      { en: "The extra weight may raise the front and dazzle other drivers", ar: "الوزن الزائد قد يرفع مقدمة السيارة ويُبهر السائقين الآخرين", correct: true },
      { en: "The lights may stop working", ar: "قد تتوقف الأضواء عن العمل", correct: false },
      { en: "It reduces brake wear", ar: "يقلل من تآكل الفرامل", correct: false },
      { en: "It improves cornering", ar: "يحسن الانعطاف", correct: false }
    ],
    keywords: [
      { term: "dazzle", ar: "إبهار", explainAr: "ضوء أمامي مرتفع يؤذي رؤية السائقين الآخرين." }
    ]
  },

  {
    id: "VL-6201",
    topic: "vehicle-loading",
    promptEn: "Why should heavy items be placed low and close to the centre of the vehicle?",
    promptAr: "لماذا يجب وضع الأغراض الثقيلة في الأسفل وقريبة من مركز المركبة؟",
    options: [
      { en: "To make loading easier", ar: "لتسهيل التحميل", correct: false },
      { en: "To improve stability and handling", ar: "لتحسين الثبات والتحكم", correct: true },
      { en: "To reduce fuel use", ar: "لتقليل استهلاك الوقود", correct: false },
      { en: "To improve visibility", ar: "لتحسين الرؤية", correct: false }
    ],
    keywords: [
      { term: "heavy load", ar: "حمولة ثقيلة", explainAr: "الأغراض التي تزيد من وزن المركبة بشكل كبير." },
      { term: "stability", ar: "الثبات", explainAr: "قدرة المركبة على الحفاظ على توازنها أثناء القيادة." },
      { term: "centre of gravity", ar: "مركز الثقل", explainAr: "النقطة التي يتركز عندها وزن المركبة." }
    ]
  },
  {
    id: "VL-6202",
    topic: "vehicle-loading",
    promptEn: "What is the main risk of carrying an unsecured load?",
    promptAr: "ما الخطر الرئيسي لحمل حمولة غير مثبتة؟",
    options: [
      { en: "Increased fuel consumption", ar: "زيادة استهلاك الوقود", correct: false },
      { en: "Load shifting and loss of control", ar: "تحرك الحمولة وفقدان السيطرة", correct: true },
      { en: "Engine overheating", ar: "سخونة المحرك", correct: false },
      { en: "Brake lights failure", ar: "تعطل أضواء الفرامل", correct: false }
    ],
    keywords: [
      { term: "unsecured load", ar: "حمولة غير مثبتة", explainAr: "حمولة لم يتم تثبيتها بشكل صحيح داخل المركبة." },
      { term: "control", ar: "السيطرة", explainAr: "قدرة السائق على التحكم في حركة المركبة." },
      { term: "safety", ar: "الأمان", explainAr: "حماية السائق والركاب والمشاة من الحوادث." }
    ]
  },
  {
    id: "VL-6203",
    topic: "vehicle-loading",
    promptEn: "Why must your load not obscure your lights or number plate?",
    promptAr: "لماذا يجب ألا تحجب الحمولة الأضواء أو لوحة الأرقام؟",
    options: [
      { en: "It reduces fuel efficiency", ar: "يقلل كفاءة الوقود", correct: false },
      { en: "It makes the vehicle illegal and unsafe", ar: "يجعل المركبة غير قانونية وغير آمنة", correct: true },
      { en: "It affects engine performance", ar: "يؤثر على أداء المحرك", correct: false },
      { en: "It increases tyre wear", ar: "يزيد تآكل الإطارات", correct: false }
    ],
    keywords: [
      { term: "lights", ar: "الأضواء", explainAr: "أضواء المركبة التي يجب أن تكون مرئية للآخرين." },
      { term: "number plate", ar: "لوحة الأرقام", explainAr: "اللوحة التي تحمل رقم تسجيل المركبة." },
      { term: "legal", ar: "قانوني", explainAr: "متوافق مع القوانين واللوائح المرورية." }
    ]
  },
  {
    id: "VL-6204",
    topic: "vehicle-loading",
    promptEn: "What should you do before carrying a roof load?",
    promptAr: "ماذا يجب أن تفعل قبل حمل حمولة على السقف؟",
    options: [
      { en: "Increase tyre pressure only", ar: "زيادة ضغط الإطارات فقط", correct: false },
      { en: "Check the maximum permitted roof load", ar: "التحقق من الحد الأقصى المسموح لحمولة السقف", correct: true },
      { en: "Remove head restraints", ar: "إزالة مساند الرأس", correct: false },
      { en: "Reduce engine oil level", ar: "خفض مستوى زيت المحرك", correct: false }
    ],
    keywords: [
      { term: "roof load", ar: "حمولة السقف", explainAr: "الأغراض التي يتم وضعها على سطح المركبة." },
      { term: "maximum weight", ar: "الحد الأقصى للوزن", explainAr: "أكبر وزن مسموح به للمركبة أو جزء منها." },
      { term: "vehicle limits", ar: "حدود المركبة", explainAr: "القيود المفروضة على قدرة تحميل المركبة." }
    ]
  },
  {
    id: "VL-6205",
    topic: "vehicle-loading",
    promptEn: "How can a heavy roof load affect your driving?",
    promptAr: "كيف يمكن أن تؤثر الحمولة الثقيلة على السقف على قيادتك؟",
    options: [
      { en: "Shorter stopping distance", ar: "تقليل مسافة التوقف", correct: false },
      { en: "Reduced stability, especially in bends", ar: "انخفاض الثبات خاصة في المنعطفات", correct: true },
      { en: "Improved acceleration", ar: "تحسن التسارع", correct: false },
      { en: "Lighter steering", ar: "توجيه أخف", correct: false }
    ],
    keywords: [
      { term: "roof load", ar: "حمولة السقف", explainAr: "الأغراض التي يتم وضعها على سطح المركبة." },
      { term: "stability", ar: "الثبات", explainAr: "قدرة المركبة على الحفاظ على توازنها أثناء القيادة." },
      { term: "bends", ar: "المنعطفات", explainAr: "الأماكن التي ينحني فيها الطريق." }
    ]
  },
  {
    id: "VL-6206",
    topic: "vehicle-loading",
    promptEn: "What should you do if your load extends beyond the rear of your vehicle?",
    promptAr: "ماذا يجب أن تفعل إذا امتدت الحمولة خارج مؤخرة المركبة؟",
    options: [
      { en: "Ignore it if it is secure", ar: "تجاهلها إذا كانت مثبتة", correct: false },
      { en: "Use a clearly visible warning marker if required", ar: "استخدام علامة تحذير واضحة إذا لزم الأمر", correct: true },
      { en: "Drive only at night", ar: "القيادة ليلًا فقط", correct: false },
      { en: "Remove the number plate", ar: "إزالة لوحة الأرقام", correct: false }
    ],
    keywords: [
      { term: "overhanging load", ar: "حمولة متدلية", explainAr: "حمولة تمتد خارج حدود المركبة." },
      { term: "warning marker", ar: "علامة تحذير", explainAr: "علامة واضحة تنبه السائقين الآخرين للحمولة المتدلية." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية المركبة والحمولة بوضوح." }
    ]
  },
  {
    id: "VL-6207",
    topic: "vehicle-loading",
    promptEn: "Why should you adjust your driving when towing a trailer?",
    promptAr: "لماذا يجب تعديل أسلوب قيادتك عند سحب مقطورة؟",
    options: [
      { en: "Because steering becomes lighter", ar: "لأن التوجيه يصبح أخف", correct: false },
      { en: "Because stopping distances increase", ar: "لأن مسافة التوقف تزيد", correct: true },
      { en: "Because fuel use decreases", ar: "لأن استهلاك الوقود ينخفض", correct: false },
      { en: "Because speed limits increase", ar: "لأن حدود السرعة تزيد", correct: false }
    ],
    keywords: [
      { term: "trailer", ar: "مقطورة", explainAr: "مركبة يتم سحبها خلف مركبة أخرى." },
      { term: "towing", ar: "السحب", explainAr: "عملية سحب مقطورة أو مركبة أخرى." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا." }
    ]
  },
  {
    id: "VL-6208",
    topic: "vehicle-loading",
    promptEn: "What is the safest way to secure a load inside your vehicle?",
    promptAr: "ما الطريقة الأكثر أمانًا لتثبيت الحمولة داخل المركبة؟",
    options: [
      { en: "Place it loosely behind seats", ar: "وضعها بشكل غير محكم خلف المقاعد", correct: false },
      { en: "Use proper restraints or straps", ar: "استخدام أربطة أو وسائل تثبيت مناسبة", correct: true },
      { en: "Rely on vehicle weight", ar: "الاعتماد على وزن المركبة", correct: false },
      { en: "Stack items high", ar: "تكديس الأغراض عاليًا", correct: false }
    ],
    keywords: [
      { term: "secure load", ar: "حمولة مثبتة", explainAr: "حمولة تم تثبيتها بشكل صحيح وآمن." },
      { term: "straps", ar: "أربطة", explainAr: "أشرطة تستخدم لتثبيت الحمولة في مكانها." },
      { term: "interior safety", ar: "الأمان الداخلي", explainAr: "حماية الركاب من الأغراض المتحركة داخل المركبة." }
    ]
  },
  {
    id: "VL-6209",
    topic: "vehicle-loading",
    promptEn: "Why should you check your load during a long journey?",
    promptAr: "لماذا يجب فحص الحمولة أثناء الرحلات الطويلة؟",
    options: [
      { en: "To reduce noise", ar: "لتقليل الضوضاء", correct: false },
      { en: "To ensure it has not shifted or loosened", ar: "للتأكد من أنها لم تتحرك أو ترتخِ", correct: true },
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To avoid stopping later", ar: "لتجنب التوقف لاحقًا", correct: false }
    ],
    keywords: [
      { term: "long journey", ar: "رحلة طويلة", explainAr: "رحلة تستغرق وقتًا طويلاً." },
      { term: "load check", ar: "فحص الحمولة", explainAr: "التأكد من أن الحمولة ما زالت مثبتة بشكل صحيح." },
      { term: "safety", ar: "الأمان", explainAr: "حماية السائق والركاب والمشاة من الحوادث." }
    ]
  },
  {
    id: "VL-6210",
    topic: "vehicle-loading",
    promptEn: "What effect can an overloaded vehicle have on braking?",
    promptAr: "ما تأثير تحميل المركبة بأكثر من طاقتها على الفرملة؟",
    options: [
      { en: "Shorter braking distance", ar: "مسافة فرملة أقصر", correct: false },
      { en: "Longer braking distance", ar: "مسافة فرملة أطول", correct: true },
      { en: "No effect", ar: "لا تأثير", correct: false },
      { en: "Improved grip", ar: "تماسك أفضل", correct: false }
    ],
    keywords: [
      { term: "overloading", ar: "التحميل الزائد", explainAr: "تحميل المركبة بأكثر من قدرتها المحددة." },
      { term: "braking", ar: "الفرملة", explainAr: "عملية إبطاء أو إيقاف المركبة باستخدام الفرامل." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا." }
    ]
  },

  // --- ATTITUDE ---

  {
    id: "AT-01",
    topic: "attitude",
    promptEn: "You are being followed very closely (tailgated) by another driver. What should you do?",
    promptAr: "سائق آخر يلتصق بسيارتك من الخلف (Tailgating). ماذا يجب أن تفعل؟",
    options: [
      { en: "Increase the gap in front of you to reduce risk", ar: "زد المسافة أمامك لتقليل الخطر", correct: true },
      { en: "Brake sharply to warn them", ar: "استخدم الفرامل بقوة لتحذيرهم", correct: false },
      { en: "Speed up to get away", ar: "زد السرعة لتبتعد عنهم", correct: false },
      { en: "Wave your arm out of the window", ar: "لوّح بذراعك من النافذة", correct: false }
    ],
    keywords: [
      { term: "tailgating", ar: "الالتصاق الخلفي", explainAr: "قيادة سيارة خلفك بمسافة قصيرة جداً مما يزيد خطر الاصطدام." }
    ]
  },

  {
    id: "AT-02",
    topic: "attitude",
    promptEn: "Why should you allow extra room when following a learner driver?",
    promptAr: "لماذا يجب أن تترك مسافة إضافية عند اتباع سائق مبتدئ؟",
    options: [
      { en: "They may not react quickly or may hesitate", ar: "قد لا يتصرف بسرعة وقد يتردد", correct: true },
      { en: "They always drive too fast", ar: "لأنهم دائماً يقودون بسرعة عالية", correct: false },
      { en: "They know the road better than you", ar: "لأنهم يعرفون الطريق أكثر منك", correct: false },
      { en: "They will never make mistakes", ar: "لن يرتكبوا أخطاء أبداً", correct: false }
    ],
    keywords: [
      { term: "learner driver", ar: "سائق مبتدئ", explainAr: "شخص يتعلم القيادة وقد يتصرف ببطء أو يتردد." }
    ]
  },

  {
    id: "AT-03",
    topic: "attitude",
    promptEn: "Another driver shouts or behaves aggressively toward you. What should you do?",
    promptAr: "سائق آخر يصرخ أو يتصرف بعدوانية تجاهك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Stay calm and do not react", ar: "ابقَ هادئاً ولا تردّ عليه", correct: true },
      { en: "Challenge them to prove you are right", ar: "تتحداهم لتثبت أنك على حق", correct: false },
      { en: "Follow them and confront them", ar: "تتبعهم وتواجههم", correct: false },
      { en: "Use your horn repeatedly", ar: "تستخدم البوق بشكل مستمر", correct: false }
    ],
    keywords: [
      { term: "aggressive", ar: "عدواني", explainAr: "التصرف العدواني يمكن أن يزيد الخطر على الطريق." }
    ]
  },

  {
    id: "AT-04",
    topic: "attitude",
    promptEn: "How should you treat older drivers or pedestrians?",
    promptAr: "كيف يجب أن تعامل السائقين أو المشاة كبار السن؟",
    options: [
      { en: "Be patient because they may take longer to react", ar: "كن صبوراً لأن ردود أفعالهم قد تكون أبطأ", correct: true },
      { en: "Drive close to them to encourage them to move", ar: "قد قريباً منهم لتجبرهم على التحرك", correct: false },
      { en: "Overtake them immediately", ar: "تتجاوزهم فوراً", correct: false },
      { en: "Use your horn to warn them", ar: "تستخدم البوق لتحذيرهم", correct: false }
    ],
    keywords: []
  },

  {
    id: "AT-05",
    topic: "attitude",
    promptEn: "When should you signal your intention to turn?",
    promptAr: "متى يجب أن تعطي إشارة نيتك في الانعطاف؟",
    options: [
      { en: "In good time so other road users can react", ar: "بوقت مناسب ليتمكن الآخرون من الاستجابة", correct: true },
      { en: "Only when you start turning", ar: "فقط عند بدء الانعطاف", correct: false },
      { en: "Only if someone is behind you", ar: "فقط إذا كانت هناك سيارة خلفك", correct: false },
      { en: "Only in heavy traffic", ar: "فقط في الازدحام", correct: false }
    ],
    keywords: [
      { term: "signal", ar: "إشارة", explainAr: "تعلم الآخرين بما تنوي فعله قبل القيام به." }
    ]
  },

  {
    id: "AT-06",
    topic: "attitude",
    promptEn: "You want to overtake but the driver in front keeps increasing their speed. What should you do?",
    promptAr: "ترغب في التجاوز لكن السائق أمامك يزيد سرعته باستمرار. ماذا يجب أن تفعل؟",
    options: [
      { en: "Abandon the overtake and drop back safely", ar: "ألغِ محاولة التجاوز وارجع لمسافة آمنة", correct: true },
      { en: "Continue overtaking at any cost", ar: "تُكمل التجاوز مهما كان", correct: false },
      { en: "Sound your horn until they slow down", ar: "تستخدم البوق حتى يبطئ", correct: false },
      { en: "Flash your lights to force them to slow", ar: "تومض بالأضواء لإجبارهم على الإبطاء", correct: false }
    ],
    keywords: []
  },

  {
    id: "AT-07",
    topic: "attitude",
    promptEn: "You are on a narrow road and a driver coming towards you doesn't seem willing to slow down. What should you do?",
    promptAr: "أنت على طريق ضيّق وسائق قادم باتجاهك لا يبدو أنه مستعد لتخفيف السرعة. ماذا تفعل؟",
    options: [
      { en: "Slow down and be prepared to stop", ar: "تخفف السرعة وتكون مستعداً للتوقف", correct: true },
      { en: "Speed up to pass quickly", ar: "تزيد السرعة لتتجاوز بسرعة", correct: false },
      { en: "Hold your position firmly", ar: "تتشبث بمكانك", correct: false },
      { en: "Use your horn aggressively", ar: "تستخدم البوق بعدوانية", correct: false }
    ],
    keywords: []
  },

  {
    id: "AT-08",
    topic: "attitude",
    promptEn: "What should you do when a bus is pulling off from a bus stop?",
    promptAr: "ماذا يجب أن تفعل عندما تغادر حافلة موقفها؟",
    options: [
      { en: "Be prepared to slow down and let it out", ar: "تكون مستعداً لتخفيف السرعة والسماح لها بالاندماج", correct: true },
      { en: "Accelerate to pass before it moves", ar: "تزيد السرعة لتتجاوزها قبل أن تتحرك", correct: false },
      { en: "Use the horn to warn the driver", ar: "تستخدم البوق لتحذير السائق", correct: false },
      { en: "Drive very close behind it", ar: "تقود ملاصقاً لها", correct: false }
    ],
    keywords: []
  },

  {
    id: "AT-09",
    topic: "attitude",
    promptEn: "When is it acceptable to use your horn?",
    promptAr: "متى يُسمح لك باستخدام البوق؟",
    options: [
      { en: "When another road user is unaware of your presence", ar: "عندما لا يكون مستخدم الطريق الآخر مدركاً لوجودك", correct: true },
      { en: "To express frustration at other drivers", ar: "لتظهر غضبك من السائقين", correct: false },
      { en: "To tell someone to move faster", ar: "لتطلب من أحدهم أن يسرع", correct: false },
      { en: "When stopped in traffic", ar: "عندما تكون متوقفاً في الازدحام", correct: false }
    ],
    keywords: [
      { term: "horn", ar: "البوق", explainAr: "يستخدم لتنبيه الآخرين فقط—not out of anger." }
    ]
  },

  {
    id: "AT-10",
    topic: "attitude",
    promptEn: "If another driver pulls out sharply in front of you, what should you do?",
    promptAr: "إذا خرج سائق آخر فجأة أمامك، ماذا يجب أن تفعل؟",
    options: [
      { en: "Stay calm and slow down to avoid danger", ar: "ابقَ هادئاً وخفف السرعة لتجنب الخطر", correct: true },
      { en: "Chase them to show your anger", ar: "تلاحقهم لتظهر غضبك", correct: false },
      { en: "Use your horn repeatedly", ar: "تستخدم البوق بشكل متكرر", correct: false },
      { en: "Flash your headlights aggressively", ar: "تومض بالأضواء بشكل عدواني", correct: false }
    ],
    keywords: []
  },

  {
    id: "AT-11",
    topic: "attitude",
    promptEn: "Why should you avoid pushing through a queue of traffic?",
    promptAr: "لماذا يجب تجنب التسلل القسري بين السيارات في الازدحام (Pushing through)؟",
    options: [
      { en: "It annoys other drivers and increases danger", ar: "يزعج السائقين الآخرين ويزيد الخطر", correct: true },
      { en: "It saves fuel", ar: "يوفر الوقود", correct: false },
      { en: "It is required to reach your destination on time", ar: "مطلوب للوصول في الوقت", correct: false },
      { en: "It is recommended in busy cities", ar: "موصى به في المدن المزدحمة", correct: false }
    ],
    keywords: []
  },

  {
    id: "AT-12",
    topic: "attitude",
    promptEn: "Why is it important to be considerate toward other road users?",
    promptAr: "لماذا من المهم أن تكون لطيفاً ومراعياً لمستخدمي الطريق الآخرين؟",
    options: [
      { en: "It helps reduce stress and improves safety", ar: "يساعد على تخفيف التوتر ويحسّن السلامة", correct: true },
      { en: "It gives you legal priority", ar: "يمنحك أولوية قانونية", correct: false },
      { en: "It lets you drive faster", ar: "يسمح لك بالقيادة أسرع", correct: false },
      { en: "It makes other drivers move aside", ar: "يجعل الآخرين يبتعدون عن طريقك", correct: false }
    ],
    keywords: []
  },

  // --- SAFETY & YOUR VEHICLE ---

  {
    id: "SV-01",
    topic: "safety-vehicle",
    promptEn: "What should you check to ensure your tyres are safe for driving?",
    promptAr: "ما الذي يجب أن تتحققه لتتأكد أن الإطارات آمنة للقيادة؟",
    options: [
      { en: "They have at least 1.6 mm tread depth", ar: "أن عمق النقشة لا يقل عن 1.6 مم", correct: true },
      { en: "They are filled beyond maximum pressure", ar: "أن يكون الضغط أعلى من الحد الأقصى", correct: false },
      { en: "They have smooth tread all around", ar: "أن تكون بدون نقشة", correct: false },
      { en: "They match the colour of the car", ar: "أن يكون لونها مطابقاً للسيارة", correct: false }
    ],
    keywords: [
      { term: "tread depth", ar: "عمق النقشة", explainAr: "أقل عمق مسموح هو 1.6 مم لضمان الثبات وإخراج الماء." }
    ]
  },

  {
    id: "SV-02",
    topic: "safety-vehicle",
    promptEn: "Your car pulls to one side when braking. What is the likely cause?",
    promptAr: "سيارتك تنحرف إلى جانب واحد عند استخدام الفرامل. ما السبب المحتمل؟",
    options: [
      { en: "A brake fault", ar: "عطل في الفرامل", correct: true },
      { en: "High tyre pressure", ar: "ضغط الإطارات مرتفع", correct: false },
      { en: "Low fuel level", ar: "مستوى الوقود منخفض", correct: false },
      { en: "Dirty headlights", ar: "مصابيح أمامية متّسخة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-03",
    topic: "safety-vehicle",
    promptEn: "What should you do if your brakes feel spongy or soft?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت أن الفرامل إسفنجية أو ناعمة؟",
    options: [
      { en: "Have the brake system checked immediately", ar: "تفحص نظام الفرامل فوراً", correct: true },
      { en: "Continue driving normally", ar: "تواصل القيادة بشكل طبيعي", correct: false },
      { en: "Pump the brakes continuously", ar: "تضغط الفرامل بشكل متكرر باستمرار", correct: false },
      { en: "Increase your speed to reduce brake use", ar: "تزيد السرعة لتقلل استخدام الفرامل", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-04",
    topic: "safety-vehicle",
    promptEn: "ABS helps by preventing the wheels from:",
    promptAr: "يعمل نظام الـ ABS على منع العجلات من:",
    options: [
      { en: "Locking up under heavy braking", ar: "الانغلاق أثناء الفرملة القوية", correct: true },
      { en: "Rotating freely at high speeds", ar: "الدوران الحر بسرعات عالية", correct: false },
      { en: "Turning left unexpectedly", ar: "الانعطاف يساراً بشكل مفاجئ", correct: false },
      { en: "Losing tyre pressure", ar: "فقدان ضغط الإطارات", correct: false }
    ],
    keywords: [
      { term: "ABS", ar: "نظام ABS", explainAr: "يسمح بالتحكم بالتوجيه أثناء الفرملة الشديدة." }
    ]
  },

  {
    id: "SV-05",
    topic: "safety-vehicle",
    promptEn: "What does it mean if your vehicle bounces excessively after driving over a bump?",
    promptAr: "ماذا يعني إذا ارتدت سيارتك بشكل زائد بعد المرور فوق مطب؟",
    options: [
      { en: "Worn shock absorbers", ar: "مساعدين (Shock absorbers) تالفين", correct: true },
      { en: "Low tyre tread", ar: "نقشة الإطار منخفضة", correct: false },
      { en: "A slipping clutch", ar: "الدبرياج ينزلق", correct: false },
      { en: "Poor steering alignment", ar: "اختلال في توازن التوجيه", correct: false }
    ],
    keywords: [
      { term: "shock absorbers", ar: "المساعدين", explainAr: "يمتصون الاهتزاز؛ تلفهم يجعل السيارة ترتد فوق المطبّات." }
    ]
  },

  {
    id: "SV-06",
    topic: "safety-vehicle",
    promptEn: "What should you do if your vehicle is suffering from excessive engine smoke?",
    promptAr: "ماذا يجب أن تفعل إذا كانت سيارتك تُخرج دخاناً زائداً؟",
    options: [
      { en: "Have the vehicle checked as soon as possible", ar: "تفحص السيارة بأسرع وقت", correct: true },
      { en: "Ignore it if the car still drives", ar: "تتجاهله طالما السيارة تمشي", correct: false },
      { en: "Drive faster to burn the smoke", ar: "تزيد السرعة لحرق الدخان", correct: false },
      { en: "Turn off the ABS system", ar: "تُطفئ نظام ABS", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-07",
    topic: "safety-vehicle",
    promptEn: "Under-inflated tyres can cause:",
    promptAr: "الإطارات منخفضة الضغط يمكن أن تسبب:",
    options: [
      { en: "Poor steering control", ar: "ضعف التحكم بالتوجيه", correct: true },
      { en: "Better fuel economy", ar: "اقتصاد وقود أفضل", correct: false },
      { en: "Improved cornering", ar: "تحسين الانعطاف", correct: false },
      { en: "Reduced stopping distance", ar: "تقليل مسافة التوقف", correct: false }
    ],
    keywords: [
      { term: "under-inflated", ar: "ضغط منخفض", explainAr: "الإطار غير المنفوخ جيدًا يزيد الاحتكاك ويضعف التحكم." }
    ]
  },

  {
    id: "SV-08",
    topic: "safety-vehicle",
    promptEn: "What could it mean if your steering feels very heavy?",
    promptAr: "ماذا قد يعني إذا كان المقود ثقيلًا جدًا؟",
    options: [
      { en: "The power steering fluid is low", ar: "سائل المقود الهيدروليكي منخفض", correct: true },
      { en: "Tyres are over-inflated", ar: "الإطارات منفوخة أكثر من اللازم", correct: false },
      { en: "Fuel level is too high", ar: "مستوى الوقود مرتفع جداً", correct: false },
      { en: "ABS is malfunctioning", ar: "نظام ABS فيه خلل", correct: false }
    ],
    keywords: [
      { term: "power steering", ar: "التوجيه المعزز", explainAr: "يقلل الجهد في تدوير المقود، وانخفاض السائل يجعله ثقيلاً." }
    ]
  },

  {
    id: "SV-09",
    topic: "safety-vehicle",
    promptEn: "Worn tyres can cause:",
    promptAr: "الإطارات البالية يمكن أن تسبب:",
    options: [
      { en: "Reduced grip on the road", ar: "انخفاض التماسك على الطريق", correct: true },
      { en: "Improved braking", ar: "تحسين الفرملة", correct: false },
      { en: "Longer tyre life", ar: "عمر أطول للإطار", correct: false },
      { en: "Better fuel economy", ar: "اقتصاد أفضل للوقود", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-10",
    topic: "safety-vehicle",
    promptEn: "What is the main reason for keeping your windscreen clean?",
    promptAr: "ما السبب الرئيسي للحفاظ على نظافة الزجاج الأمامي؟",
    options: [
      { en: "To ensure maximum visibility", ar: "لضمان أقصى قدر من الرؤية", correct: true },
      { en: "To improve fuel economy", ar: "لتحسين استهلاك الوقود", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false },
      { en: "To prevent engine overheating", ar: "لتجنب ارتفاع حرارة المحرك", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-11",
    topic: "safety-vehicle",
    promptEn: "What could cause your vehicle to skid?",
    promptAr: "ما الذي قد يتسبب في انزلاق سيارتك؟",
    options: [
      { en: "Heavy braking or harsh acceleration", ar: "الفرملة القوية أو التسارع المفاجئ", correct: true },
      { en: "Driving slowly at all times", ar: "القيادة ببطء دائمًا", correct: false },
      { en: "Using dipped headlights", ar: "استخدام الأضواء المنخفضة", correct: false },
      { en: "Keeping tyres over-inflated", ar: "نفخ الإطارات فوق الحد", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-12",
    topic: "safety-vehicle",
    promptEn: "When should you check engine oil levels?",
    promptAr: "متى يجب عليك التحقق من مستوى زيت المحرك؟",
    options: [
      { en: "When the engine is cold", ar: "عندما يكون المحرك بارداً", correct: true },
      { en: "Immediately after driving", ar: "مباشرة بعد القيادة", correct: false },
      { en: "Only every 6 months", ar: "فقط كل 6 أشهر", correct: false },
      { en: "Only before a long trip", ar: "فقط قبل رحلة طويلة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-13",
    topic: "safety-vehicle",
    promptEn: "What should you do if your coolant level becomes low?",
    promptAr: "ماذا يجب أن تفعل إذا انخفض مستوى سائل التبريد؟",
    options: [
      { en: "Have it topped up immediately", ar: "تقوم بتزويده فوراً", correct: true },
      { en: "Drive faster to cool the engine", ar: "تزيد السرعة لتبريد المحرك", correct: false },
      { en: "Ignore it if the car is running", ar: "تتجاهله طالما السيارة تعمل", correct: false },
      { en: "Turn off the ABS system", ar: "تُطفئ نظام ABS", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-14",
    topic: "safety-vehicle",
    promptEn: "What is the correct pressure for your tyres?",
    promptAr: "ما هو ضغط الإطارات الصحيح؟",
    options: [
      { en: "As stated in the vehicle manual", ar: "كما هو مذكور في كتيب السيارة", correct: true },
      { en: "Whatever feels comfortable", ar: "أي شيء يبدو مريحاً", correct: false },
      { en: "Always maximum pressure", ar: "دائماً أعلى ضغط", correct: false },
      { en: "Always minimum pressure", ar: "دائماً أدنى ضغط", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-15",
    topic: "safety-vehicle",
    promptEn: "What is the main cause of rapid tyre wear?",
    promptAr: "ما السبب الرئيسي للتآكل السريع للإطارات؟",
    options: [
      { en: "Incorrect wheel alignment", ar: "عدم اتزان العجلات", correct: true },
      { en: "Correct tyre pressure", ar: "ضغط الإطار الصحيح", correct: false },
      { en: "Low fuel level", ar: "انخفاض الوقود", correct: false },
      { en: "Clean headlights", ar: "مصابيح نظيفة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-16",
    topic: "safety-vehicle",
    promptEn: "What should you check if your vehicle pulls to one side while driving?",
    promptAr: "ماذا يجب أن تتحقق إذا كانت سيارتك تنحرف إلى جانب واحد أثناء القيادة؟",
    options: [
      { en: "Tyre pressure or wheel alignment", ar: "ضغط الإطارات أو اتزان العجلات", correct: true },
      { en: "Fuel tank level", ar: "مستوى خزان الوقود", correct: false },
      { en: "Air conditioning", ar: "مكيف الهواء", correct: false },
      { en: "Radio and speakers", ar: "الراديو ومكبرات الصوت", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-17",
    topic: "safety-vehicle",
    promptEn: "What can cause your engine to overheat?",
    promptAr: "ما الذي قد يسبب ارتفاع حرارة المحرك؟",
    options: [
      { en: "Low coolant level", ar: "انخفاض سائل التبريد", correct: true },
      { en: "Clean air filter", ar: "فلتر هواء نظيف", correct: false },
      { en: "Low tyre pressure", ar: "ضغط إطارات منخفض", correct: false },
      { en: "New spark plugs", ar: "شمعات احتراق جديدة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-18",
    topic: "safety-vehicle",
    promptEn: "What should you do if your battery warning light comes on while driving?",
    promptAr: "ماذا يجب أن تفعل إذا ظهر ضوء تحذير البطارية أثناء القيادة؟",
    options: [
      { en: "Have the charging system checked as soon as possible", ar: "تفحص نظام الشحن بأسرع وقت", correct: true },
      { en: "Continue normally until the car stops", ar: "تواصل القيادة حتى تتوقف السيارة", correct: false },
      { en: "Turn off your headlights to save power", ar: "تطفئ الأضواء لتوفير الطاقة", correct: false },
      { en: "Disconnect the battery while driving", ar: "تفصل البطارية أثناء القيادة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-19",
    topic: "safety-vehicle",
    promptEn: "What is the benefit of anti-lock brakes (ABS) in an emergency?",
    promptAr: "ما فائدة الفرامل المانعة للانغلاق (ABS) في حالة الطوارئ؟",
    options: [
      { en: "They help you steer while braking hard", ar: "تساعدك على التوجيه أثناء الفرملة الشديدة", correct: true },
      { en: "They stop the vehicle instantly", ar: "توقف المركبة فوراً", correct: false },
      { en: "They reduce tyre wear", ar: "تقلل تآكل الإطارات", correct: false },
      { en: "They increase fuel economy", ar: "تحسن استهلاك الوقود", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-20",
    topic: "safety-vehicle",
    promptEn: "When should you check tyre pressure for accurate reading?",
    promptAr: "متى يجب فحص ضغط الهواء في الإطارات للحصول على قراءة دقيقة؟",
    options: [
      { en: "When the tyres are cold", ar: "عندما تكون الإطارات باردة", correct: true },
      { en: "After long driving", ar: "بعد قيادة طويلة", correct: false },
      { en: "Right after a high-speed drive", ar: "بعد رحلة سريعة مباشرة", correct: false },
      { en: "Only during an MOT test", ar: "فقط أثناء فحص الـ MOT", correct: false }
    ],
    keywords: []
  },

  // --- ALERTNESS (EXTRA) ---

  {
    id: "AL-07",
    topic: "alertness",
    promptEn: "You are driving for a long distance. What is the best way to avoid tiredness?",
    promptAr: "أنت تقود لمسافة طويلة. ما أفضل طريقة لتجنب التعب؟",
    options: [
      { en: "Take regular breaks", ar: "أخذ فترات راحة منتظمة", correct: true },
      { en: "Open the window fully", ar: "فتح النافذة بالكامل", correct: false },
      { en: "Turn up the radio volume", ar: "رفع صوت الراديو", correct: false },
      { en: "Drink sugary drinks only", ar: "شرب مشروبات سكرية فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-08",
    topic: "alertness",
    promptEn: "What is the main cause of reduced concentration while driving?",
    promptAr: "ما السبب الرئيسي لانخفاض التركيز أثناء القيادة؟",
    options: [
      { en: "Tiredness", ar: "التعب", correct: true },
      { en: "Driving on new roads", ar: "القيادة على طرق جديدة", correct: false },
      { en: "Having passengers in the back", ar: "وجود ركاب في الخلف", correct: false },
      { en: "Clean mirrors", ar: "مرايا نظيفة", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-09",
    topic: "alertness",
    promptEn: "You are dazzled by the headlights of an oncoming vehicle. What should you do?",
    promptAr: "أُبهرت من أضواء مركبة قادمة باتجاهك. ماذا تفعل؟",
    options: [
      { en: "Slow down and look to the left edge of the road", ar: "تخفف السرعة وتنظر إلى حافة الطريق اليسرى", correct: true },
      { en: "Flash your headlights repeatedly", ar: "تومض بالأضواء عدة مرات", correct: false },
      { en: "Look directly at the lights", ar: "تنظر مباشرة إلى الأضواء", correct: false },
      { en: "Increase speed to pass quickly", ar: "تزيد السرعة لتتجاوز بسرعة", correct: false }
    ],
    keywords: [
      { term: "dazzled", ar: "مُبهَر", explainAr: "ضوء قوي يمنعك من رؤية الطريق بوضوح." }
    ]
  },

  {
    id: "AL-10",
    topic: "alertness",
    promptEn: "When should you avoid using a mobile phone while driving?",
    promptAr: "متى يجب عليك تجنب استخدام الهاتف المحمول أثناء القيادة؟",
    options: [
      { en: "Always while the vehicle is moving", ar: "دائمًا أثناء حركة المركبة", correct: true },
      { en: "Only when driving fast", ar: "فقط عند القيادة بسرعة عالية", correct: false },
      { en: "Only on motorways", ar: "فقط على الطرق السريعة", correct: false },
      { en: "Only when alone", ar: "فقط عندما تكون وحيدًا", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-11",
    topic: "alertness",
    promptEn: "What should you do when a vehicle behind wants to overtake you?",
    promptAr: "ماذا يجب أن تفعل عندما تريد مركبة خلفك تجاوزك؟",
    options: [
      { en: "Allow them to overtake safely", ar: "تسمح لهم بالتجاوز بأمان", correct: true },
      { en: "Speed up to block them", ar: "تزيد السرعة لمنعهم", correct: false },
      { en: "Move to the right suddenly", ar: "تتحرك يمينًا فجأة", correct: false },
      { en: "Use your horn to warn them", ar: "تستخدم البوق لتحذيرهم", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-12",
    topic: "alertness",
    promptEn: "Why is scanning the road ahead important?",
    promptAr: "لماذا يعتبر مسح الطريق أمامك مهمًا؟",
    options: [
      { en: "It lets you anticipate hazards early", ar: "يسمح لك بتوقع المخاطر مبكرًا", correct: true },
      { en: "It improves tyre wear", ar: "يحسن تآكل الإطارات", correct: false },
      { en: "It reduces headlights glare", ar: "يقلل وهج الأضواء", correct: false },
      { en: "It gives more fuel efficiency", ar: "يوفر استهلاك الوقود", correct: false }
    ],
    keywords: [
      { term: "anticipate", ar: "يتوقع", explainAr: "معرفة ما قد يحدث قبل حدوثه." }
    ]
  },

  {
    id: "AL-13",
    topic: "alertness",
    promptEn: "What is the main purpose of the two-second rule?",
    promptAr: "ما الغرض الرئيسي من قاعدة الثانيتين؟",
    options: [
      { en: "To allow a safe stopping distance", ar: "لترك مسافة توقف آمنة", correct: true },
      { en: "To help with overtaking", ar: "للمساعدة على التجاوز", correct: false },
      { en: "To reduce wear on tyres", ar: "لتقليل تآكل الإطارات", correct: false },
      { en: "To increase fuel efficiency", ar: "لزيادة الاقتصاد في الوقود", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-14",
    topic: "alertness",
    promptEn: "When should you check your mirrors?",
    promptAr: "متى يجب عليك فحص مرايا سيارتك؟",
    options: [
      { en: "Before changing speed or direction", ar: "قبل تغيير السرعة أو الاتجاه", correct: true },
      { en: "Only when parked", ar: "فقط عندما تكون متوقفًا", correct: false },
      { en: "Only at night", ar: "فقط في الليل", correct: false },
      { en: "Only when reversing", ar: "فقط عند الرجوع للخلف", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-15",
    topic: "alertness",
    promptEn: "Why is it important to keep your windscreen clear?",
    promptAr: "لماذا من المهم الحفاظ على نظافة الزجاج الأمامي؟",
    options: [
      { en: "To maintain good visibility", ar: "للحفاظ على رؤية جيدة", correct: true },
      { en: "To improve fuel efficiency", ar: "لتحسين استهلاك الوقود", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false },
      { en: "To avoid interior fogging", ar: "لتجنب الضباب الداخلي فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-16",
    topic: "alertness",
    promptEn: "What may help you stay alert on long journeys?",
    promptAr: "ما الذي قد يساعدك على البقاء منتبهًا في الرحلات الطويلة؟",
    options: [
      { en: "Taking short breaks", ar: "أخذ استراحات قصيرة", correct: true },
      { en: "Turning the heater on high", ar: "تشغيل المدفأة على أعلى مستوى", correct: false },
      { en: "Driving with one hand", ar: "القيادة بيد واحدة", correct: false },
      { en: "Listening to loud music", ar: "الاستماع لموسيقى عالية", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-17",
    topic: "alertness",
    promptEn: "What should you do if you are feeling very tired while driving?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت بتعب شديد أثناء القيادة؟",
    options: [
      { en: "Stop and rest as soon as possible", ar: "تتوقف وتستريح بأقرب وقت", correct: true },
      { en: "Drink water and continue", ar: "تشرب ماءً وتتابع", correct: false },
      { en: "Turn on the radio loudly", ar: "تشغّل الراديو بصوت عال", correct: false },
      { en: "Drive faster to reach sooner", ar: "تسرع لتصل بسرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-18",
    topic: "alertness",
    promptEn: "Why is tailgating dangerous?",
    promptAr: "لماذا يعتبر الالتصاق الخلفي (Tailgating) خطيراً؟",
    options: [
      { en: "You may not have enough time to stop if the vehicle ahead brakes", ar: "لن يكون لديك وقت كافٍ للتوقف إذا فرملت السيارة أمامك", correct: true },
      { en: "It improves fuel efficiency", ar: "يحسن استهلاك الوقود", correct: false },
      { en: "It helps overtaking", ar: "يساعد على التجاوز", correct: false },
      { en: "It gives better visibility", ar: "يعطي رؤية أفضل", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-19",
    topic: "alertness",
    promptEn: "What should you do if sunlight makes it hard to see ahead?",
    promptAr: "ماذا يجب أن تفعل إذا جعلت أشعة الشمس رؤية الطريق صعبة؟",
    options: [
      { en: "Use the sun visor and reduce speed", ar: "تستخدم مظلة الشمس وتخفف السرعة", correct: true },
      { en: "Speed up to avoid the glare", ar: "تسرع لتتجنب الوهج", correct: false },
      { en: "Look directly at the sun for guidance", ar: "تنظر مباشرة إلى الشمس!", correct: false },
      { en: "Turn on full-beam headlights", ar: "تشغّل الأضواء العالية", correct: false }
    ],
    keywords: []
  },

  {
    id: "AL-20",
    topic: "alertness",
    promptEn: "How does alcohol affect driving ability?",
    promptAr: "كيف يؤثر الكحول على القدرة على القيادة؟",
    options: [
      { en: "It reduces concentration and slows reaction time", ar: "يقلل التركيز ويبطئ زمن الاستجابة", correct: true },
      { en: "It improves confidence and accuracy", ar: "يحسن الثقة والدقة", correct: false },
      { en: "It increases alertness", ar: "يزيد الانتباه", correct: false },
      { en: "It sharpens your vision", ar: "يحسن الرؤية", correct: false }
    ],
    keywords: []
  },

  // --- ROAD SIGNS (ADVANCED) ---

  {
    id: "RS-07",
    topic: "road-signs",
    promptEn: "A circular sign with a red border and a number '30' means:",
    promptAr: "إشارة دائرية بحافة حمراء بداخلها الرقم 30 تعني:",
    image: "/theory-images/signs/signs_q007_speed-limit-30.png",
    options: [
      { en: "Maximum speed limit is 30 mph", ar: "السرعة القصوى المسموح بها 30 ميل/ساعة", correct: true },
      { en: "Minimum speed is 30 mph", ar: "السرعة الدنيا 30 ميل/ساعة", correct: false },
      { en: "Recommended speed is 30 mph", ar: "السرعة الموصى بها 30 ميل/ساعة", correct: false },
      { en: "Average speed is 30 mph", ar: "السرعة المتوسطة 30 ميل/ساعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-08",
    topic: "road-signs",
    promptEn: "A blue circular sign with a white arrow pointing left means:",
    promptAr: "إشارة دائرية زرقاء عليها سهم أبيض يشير لليسار تعني:",
    image: "/theory-images/signs/signs_q008_turn-left-only.png",
    options: [
      { en: "Turn left ahead only", ar: "يجب الانعطاف يساراً فقط", correct: true },
      { en: "No left turn", ar: "ممنوع الانعطاف يساراً", correct: false },
      { en: "Give way to the left", ar: "أعطِ أولوية للقادم من اليسار", correct: false },
      { en: "One-way street to the right", ar: "شارع باتجاه واحد لليمين", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-08A",
    topic: "road-signs",
    promptEn: "A blue circular sign with a white arrow pointing right means:",
    promptAr: "إشارة دائرية زرقاء عليها سهم أبيض يشير لليمين تعني:",
    image: "/theory-images/signs/signs_q009_turn-right-only.png",
    options: [
      { en: "Turn right ahead only", ar: "يجب الانعطاف يميناً فقط", correct: true },
      { en: "No right turn", ar: "ممنوع الانعطاف يميناً", correct: false },
      { en: "Give way to the right", ar: "أعطِ أولوية للقادم من اليمين", correct: false },
      { en: "One-way street to the left", ar: "شارع باتجاه واحد لليسار", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-09",
    topic: "road-signs",
    promptEn: "You're driving through a residential area and see a triangular warning sign showing two children. What should you be prepared for?",
    promptAr: "أنت تقود في منطقة سكنية وترى علامة تحذير مثلثة تُظهر طفلين. ماذا يجب أن تكون مستعداً له؟",
    image: "/theory-images/signs/signs_q010_children-warning.png",
    options: [
      { en: "Children may suddenly appear or cross the road, especially near schools", ar: "قد يظهر أطفال فجأة أو يعبرون الطريق، خاصة قرب المدارس", correct: true },
      { en: "A playground is closed ahead", ar: "ملعب مغلق أمامك", correct: false },
      { en: "Children are not allowed in this area", ar: "الأطفال غير مسموح لهم في هذه المنطقة", correct: false },
      { en: "Only school buses can use this road", ar: "حافلات المدارس فقط يمكنها استخدام هذا الطريق", correct: false }
    ],
    keywords: [
      { term: "children crossing", ar: "عبور أطفال", explainAr: "الأطفال قد لا يكونون منتبهين للطرق وقد يظهرون فجأة." }
    ]
  },

  {
    id: "RS-10",
    topic: "road-signs",
    promptEn: "What does a blue circular sign with a red border and a red cross (X) mean?",
    promptAr: "ماذا تعني إشارة دائرية زرقاء ذات إطار أحمر وعلامة X حمراء؟",
    image: "/theory-images/signs/signs_q011_no-entry.png",
    options: [
      { en: "No stopping at any time", ar: "ممنوع التوقف كليًا", correct: true },
      { en: "No parking", ar: "ممنوع الوقوف", correct: false },
      { en: "End of restrictions", ar: "نهاية القيود", correct: false },
      { en: "Bus stop only", ar: "موقف حافلات فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-11",
    topic: "road-signs",
    promptEn: "You see a triangular warning sign showing a bend to the left. What does it warn you about?",
    promptAr: "ترى علامة تحذير مثلثة تُظهر منعطفًا إلى اليسار. ممّ تُحذّرك هذه العلامة؟",
    image: "/theory-images/signs/signs_q012_bend-to-left.png",
    options: [
      { en: "Bend to the left ahead", ar: "منعطف إلى اليسار أمامك", correct: true },
      { en: "Junction on the left", ar: "تقاطع على اليسار", correct: false },
      { en: "Road narrows on the left", ar: "الطريق يضيق من اليسار", correct: false },
      { en: "No left turn", ar: "ممنوع الانعطاف يسارًا", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-12",
    topic: "road-signs",
    promptEn: "A triangular sign showing a train without a barrier warns of:",
    promptAr: "إشارة مثلثة عليها قطار بدون حاجز تعني:",
    image: "/theory-images/signs/signs_q013_level-crossing-no-barrier.png",
    options: [
      { en: "Level crossing without a barrier", ar: "معبر سكة حديد بدون حاجز", correct: true },
      { en: "Level crossing with a barrier", ar: "معبر سكة حديد مع حاجز", correct: false },
      { en: "Tramway only", ar: "مسار ترام فقط", correct: false },
      { en: "End of railway zone", ar: "نهاية منطقة السكة الحديد", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-13",
    topic: "road-signs",
    promptEn: "A sign with a car and motorcycle in a red circle means:",
    promptAr: "إشارة عليها سيارة ودراجة نارية داخل دائرة حمراء تعني:",
    image: "/theory-images/signs/signs_q014_no-motor-vehicles.png",
    options: [
      { en: "No motor vehicles", ar: "ممنوع دخول المركبات الآلية", correct: true },
      { en: "Cars only", ar: "سيارات فقط", correct: false },
      { en: "Motorcycles only", ar: "دراجات نارية فقط", correct: false },
      { en: "End of speed restriction", ar: "نهاية حد السرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-14",
    topic: "road-signs",
    promptEn: "You're driving along a main road and see a triangular warning sign showing a roundabout symbol. What should you prepare for?",
    promptAr: "أنت تقود على طريق رئيسي وترى علامة تحذير مثلثة تُظهر رمز دوّار. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q015_roundabout-ahead.png",
    options: [
      { en: "A roundabout ahead where you'll need to give way to traffic already on it", ar: "دوّار أمامك حيث يجب إعطاء الأولوية للمرور الموجود عليه", correct: true },
      { en: "A mini-roundabout only", ar: "دوّار صغير فقط", correct: false },
      { en: "No U-turns are allowed", ar: "الاستدارة ممنوعة", correct: false },
      { en: "One-way traffic system ahead", ar: "نظام طريق باتجاه واحد أمامك", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوّار", explainAr: "تقاطع دائري حيث يجب إعطاء الأولوية للمرور الموجود على الدوّار." }
    ]
  },

  {
    id: "RS-15",
    topic: "road-signs",
    promptEn: "A blue circular sign with a white bicycle symbol means:",
    promptAr: "إشارة دائرية زرقاء عليها رمز دراجة هوائية أبيض تعني:",
    image: "/theory-images/signs/signs_q016_cycle-route-only.png",
    options: [
      { en: "Cycle route only", ar: "مسار مخصص للدراجات الهوائية فقط", correct: true },
      { en: "No cycling", ar: "ممنوع ركوب الدراجات", correct: false },
      { en: "Shared route with cars", ar: "مسار مشترك مع السيارات", correct: false },
      { en: "Cycle parking only", ar: "منطقة ركن دراجات فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-16",
    topic: "road-signs",
    promptEn: "A rectangular sign with a red diagonal line across a black camera symbol means:",
    promptAr: "إشارة مستطيلة عليها خط أحمر مائل فوق رمز كاميرا سوداء تعني:",
    image: "/theory-images/signs/signs_q017_end-speed-camera-zone.png",
    options: [
      { en: "End of speed camera zone", ar: "نهاية منطقة كاميرات السرعة", correct: true },
      { en: "Speed cameras begin", ar: "بداية كاميرات السرعة", correct: false },
      { en: "No photography allowed", ar: "ممنوع التصوير", correct: false },
      { en: "Traffic lights ahead", ar: "إشارة مرور أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-17",
    topic: "road-signs",
    promptEn: "You're driving on a mountain road and see a triangular warning sign showing falling rocks. What hazard should you be aware of?",
    promptAr: "أنت تقود على طريق جبلي وترى علامة تحذير مثلثة تُظهر صخوراً متساقطة. ما الخطر الذي يجب أن تكون مدركاً له؟",
    image: "/theory-images/signs/signs_q018_falling-rocks.png",
    options: [
      { en: "Rocks may fall or have fallen onto the road ahead", ar: "قد تسقط صخور أو تكون قد سقطت على الطريق أمامك", correct: true },
      { en: "Roadworks are taking place ahead", ar: "أعمال طرق جارية أمامك", correct: false },
      { en: "Loose gravel on the road surface only", ar: "حصى صغيرة على سطح الطريق فقط", correct: false },
      { en: "The road surface is slippery", ar: "سطح الطريق زلق", correct: false }
    ],
    keywords: [
      { term: "falling rocks", ar: "صخور متساقطة", explainAr: "خطر وجود صخور على الطريق قد تتسبب في حوادث خطيرة." }
    ]
  },

  {
    id: "RS-18",
    topic: "road-signs",
    promptEn: "A rectangular sign with a white 'H' on a blue background usually means:",
    promptAr: "إشارة مستطيلة عليها حرف H أبيض على خلفية زرقاء تعني عادةً:",
    image: "/theory-images/signs/signs_q019_hospital.png",
    options: [
      { en: "Hospital nearby", ar: "مستشفى قريب", correct: true },
      { en: "Hotel zone", ar: "منطقة فندق", correct: false },
      { en: "Helicopter landing", ar: "منطقة هبوط طائرات مروحية", correct: false },
      { en: "Highway", ar: "طريق سريع", correct: false }
    ],
    keywords: [
      { term: "hospital", ar: "مستشفى", explainAr: "علامة معلوماتية تشير إلى وجود مستشفى قريب." }
    ]
  },


  {
    id: "RS-20",
    topic: "road-signs",
    promptEn: "A blue rectangular sign with a car symbol in a lane overhead usually indicates:",
    promptAr: "إشارة مستطيلة زرقاء فوق المسار عليها رمز سيارة تعني عادةً:",
    image: "/theory-images/signs/signs_q020_lane-open-cars.png",
    options: [
      { en: "Lane available for traffic", ar: "المسار متاح لحركة المرور", correct: true },
      { en: "Lane closed", ar: "المسار مغلق", correct: false },
      { en: "Bus lane only", ar: "مسار حافلات فقط", correct: false },
      { en: "Hard shoulder", ar: "الكتف الجانبي", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-21",
    topic: "road-signs",
    promptEn: "On a motorway, a red 'X' shown on an overhead sign above your lane means:",
    promptAr: "على الطريق السريع، علامة X حمراء فوق مسارك تعني:",
    image: "/theory-images/motorway/motorway_q021_red-x-lane-closed.png",
    options: [
      { en: "You must not use this lane", ar: "يُمنع استخدام هذا المسار", correct: true },
      { en: "You have priority in this lane", ar: "لديك أولوية في هذا المسار", correct: false },
      { en: "You should drive faster", ar: "يجب أن تقود أسرع", correct: false },
      { en: "Buses only may use this lane", ar: "يُسمح للحافلات فقط باستخدام المسار", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-26",
    topic: "road-signs",
    promptEn: "What does a red circular sign with a U-turn symbol crossed out mean?",
    promptAr: "ماذا تعني إشارة دائرية حمراء عليها رمز الاستدارة (U-turn) مشطوب؟",
    image: "/theory-images/signs/signs_q026_no-u-turn.png",
    options: [
      { en: "No U-turn", ar: "ممنوع الاستدارة", correct: true },
      { en: "No right turn", ar: "ممنوع الانعطاف يمينًا", correct: false },
      { en: "End of speed limit", ar: "نهاية حد السرعة", correct: false },
      { en: "Two-way traffic ahead", ar: "حركة مرور باتجاهين أمامك", correct: false }
    ],
    keywords: [
      { term: "U-turn", ar: "استدارة", explainAr: "الاستدارة الكاملة 180 درجة لتغيير اتجاه السيارة." },
      { term: "prohibition sign", ar: "إشارة منع", explainAr: "إشارة دائرية حمراء تعني منع فعل معين على الطريق." }
    ]
  },

  // --- VEHICLE HANDLING (EXTRA) ---

  {
    id: "VH-09",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid harsh acceleration when pulling away?",
    promptAr: "لماذا يجب أن تتجنب التسارع القوي عند الانطلاق؟",
    options: [
      { en: "It can cause wheelspin and loss of control", ar: "قد يسبب دوران العجلات وفقدان السيطرة", correct: true },
      { en: "It improves fuel economy", ar: "يحسن استهلاك الوقود", correct: false },
      { en: "It reduces tyre wear", ar: "يقلل تآكل الإطارات", correct: false },
      { en: "It helps warm up the engine faster", ar: "يساعد على تسخين المحرك أسرع", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-10",
    topic: "vehicle-handling",
    promptEn: "On a bend, what happens if you brake hard while turning?",
    promptAr: "في منعطف، ماذا قد يحدث إذا استخدمت الفرامل بقوة أثناء الانعطاف؟",
    options: [
      { en: "The vehicle may skid or lose stability", ar: "قد تنزلق المركبة أو تفقد توازنها", correct: true },
      { en: "The turn becomes smoother", ar: "يصبح المنعطف أكثر سلاسة", correct: false },
      { en: "Tyre wear is reduced", ar: "يتقلل تآكل الإطارات", correct: false },
      { en: "The engine cools down", ar: "يبرد المحرك", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-11",
    topic: "vehicle-handling",
    promptEn: "What should you do when your vehicle starts to aquaplane (riding on water)?",
    promptAr: "ماذا يجب أن تفعل عندما تبدأ سيارتك بالانزلاق فوق الماء (Aquaplane)؟",
    options: [
      { en: "Ease off the accelerator and don't brake suddenly", ar: "ترفع قدمك عن البنزين دون فرملة مفاجئة", correct: true },
      { en: "Brake hard immediately", ar: "تستخدم الفرامل بقوة فوراً", correct: false },
      { en: "Turn the steering sharply", ar: "تلف المقود بقوة", correct: false },
      { en: "Accelerate to clear the water", ar: "تسرع لتتجاوز الماء", correct: false }
    ],
    keywords: [
      { term: "aquaplane", ar: "الانزلاق فوق الماء", explainAr: "عندما تطفو الإطارات فوق الماء وتفقد التماسك مع الطريق." }
    ]
  },

  {
    id: "VH-12",
    topic: "vehicle-handling",
    promptEn: "In very windy conditions on an open road, which vehicles are most at risk?",
    promptAr: "في الرياح الشديدة على طريق مفتوح، أي المركبات أكثر عرضة للخطر؟",
    options: [
      { en: "High-sided vehicles such as lorries and vans", ar: "المركبات العالية مثل الشاحنات والفانات", correct: true },
      { en: "Small sports cars", ar: "السيارات الرياضية الصغيرة", correct: false },
      { en: "Vehicles with low mileage", ar: "السيارات قليلة الكيلومترات", correct: false },
      { en: "Vehicles with ABS", ar: "السيارات المزودة بـ ABS", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-13",
    topic: "vehicle-handling",
    promptEn: "Why is it dangerous to leave your vehicle in neutral while going downhill?",
    promptAr: "لماذا يعتبر ترك سيارتك على الفاضي (نيوترال) أثناء النزول من منحدر أمراً خطيراً؟",
    options: [
      { en: "You have less engine braking and less control", ar: "تفقد فرملة المحرك ويقل التحكم بالمركبة", correct: true },
      { en: "It reduces fuel use too much", ar: "يقلل استهلاك الوقود كثيراً", correct: false },
      { en: "It makes steering lighter", ar: "يجعل المقود أخف", correct: false },
      { en: "It improves tyre grip", ar: "يحسن تماسك الإطارات", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-14",
    topic: "vehicle-handling",
    promptEn: "What should you do if your vehicle has a manual handbrake and you stop on a steep hill?",
    promptAr: "ماذا يجب أن تفعل إذا كانت سيارتك مزودة بفرامل يد وتوقفت على منحدر حاد؟",
    options: [
      { en: "Apply the handbrake firmly and select first gear", ar: "تشُدّ فرامل اليد بقوة وتضع الغيار الأول", correct: true },
      { en: "Leave it in neutral without handbrake", ar: "تترك السيارة على الفاضي بدون فرامل يد", correct: false },
      { en: "Use only the footbrake", ar: "تستخدم دواسة الفرامل فقط", correct: false },
      { en: "Switch off the engine and leave in gear without handbrake", ar: "تطفئ المحرك وتضع الغيار بدون فرامل يد", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-15",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid braking heavily on loose gravel or stones?",
    promptAr: "لماذا يجب تجنب الفرملة بقوة على طريق به حصى أو حجارة صغيرة؟",
    options: [
      { en: "The wheels may lock and steering control may be lost", ar: "قد تنغلق العجلات وتفقد التحكم بالتوجيه", correct: true },
      { en: "It will clean the tyres", ar: "سيُنظّف الإطارات", correct: false },
      { en: "It increases grip", ar: "يزيد التماسك", correct: false },
      { en: "It improves braking distance", ar: "يحسّن مسافة التوقف", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-16",
    topic: "vehicle-handling",
    promptEn: "Your vehicle starts to skid because of excessive speed on a bend. What is the first thing you should do?",
    promptAr: "بدأت سيارتك بالانزلاق بسبب السرعة الزائدة في منعطف. ما أول ما يجب أن تفعله؟",
    options: [
      { en: "Reduce your speed by easing off the accelerator", ar: "تقلل السرعة برفع قدمك عن البنزين", correct: true },
      { en: "Brake as hard as possible", ar: "تضغط الفرامل بأقصى قوة", correct: false },
      { en: "Steer violently in the opposite direction", ar: "تلف المقود بعنف بالعكس", correct: false },
      { en: "Change to a higher gear", ar: "تنقل لغيار أعلى", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-17",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid overloading your vehicle's roof rack?",
    promptAr: "لماذا يجب تجنب تحميل حامل السقف أكثر من اللازم؟",
    options: [
      { en: "It raises the vehicle's centre of gravity and affects stability", ar: "يرفع مركز ثقل السيارة ويؤثر على ثباتها", correct: true },
      { en: "It improves fuel economy", ar: "يحسن استهلاك الوقود", correct: false },
      { en: "It reduces wind noise", ar: "يقلل ضجيج الهواء", correct: false },
      { en: "It sharpens steering", ar: "يحسن التوجيه", correct: false }
    ],
    keywords: []
  },

  {
    id: "VH-18",
    topic: "vehicle-handling",
    promptEn: "You are driving through standing water on the road. After exiting, what should you check?",
    promptAr: "تخوض بسيارتك عبر مياه متجمعة على الطريق. بعد الخروج، ماذا يجب أن تتحقق؟",
    options: [
      { en: "Gently test your brakes", ar: "تختبر الفرامل بلطف", correct: true },
      { en: "Switch off your lights", ar: "تطفئ الأضواء", correct: false },
      { en: "Change immediately to a higher gear", ar: "تنقل فوراً لغيار أعلى", correct: false },
      { en: "Drive faster to dry the tyres", ar: "تسرع لتجف الإطارات", correct: false }
    ],
    keywords: []
  },

  // --- MOTORWAY (EXTRA) ---

  {
    id: "MW-11",
    topic: "motorway-driving",
    promptEn: "On a motorway, when are you allowed to use the hard shoulder as a running lane?",
    promptAr: "على الطريق السريع، متى يُسمح لك باستخدام الكتف الجانبي كمسار سير؟",
    options: [
      { en: "Only when signs show it is open as a lane", ar: "فقط عندما تشير اللوحات الإلكترونية أنه مفتوح كمسار", correct: true },
      { en: "Whenever traffic is heavy", ar: "عندما يكون الازدحام شديداً دائماً", correct: false },
      { en: "At night only", ar: "ليلاً فقط", correct: false },
      { en: "When you want to drive faster", ar: "عندما تريد القيادة أسرع", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-12",
    topic: "motorway-driving",
    promptEn: "When joining a motorway from a slip road, who has priority?",
    promptAr: "عند الانضمام إلى الطريق السريع من طريق الاندماج، من له أولوية المرور؟",
    options: [
      { en: "Traffic already on the motorway has priority", ar: "حركة المرور الموجودة على الطريق السريع لها الأولوية", correct: true },
      { en: "Traffic joining from the slip road has priority", ar: "حركة المرور المنضمة من طريق الاندماج لها الأولوية", correct: false },
      { en: "The faster vehicle has priority", ar: "المركبة الأسرع لها الأولوية", correct: false },
      { en: "Priority alternates between lanes", ar: "الأولوية تتبادل بين المسارات", correct: false }
    ],
    keywords: [
      { term: "joining motorway", ar: "الانضمام إلى الطريق السريع", explainAr: "عملية الدخول إلى الطريق السريع من طريق فرعي." },
      { term: "priority", ar: "أولوية المرور", explainAr: "حق المرور في المضي قدمًا قبل المركبات الأخرى." },
      { term: "slip road", ar: "طريق الاندماج", explainAr: "المسار الذي تستخدمه للدخول إلى الطريق السريع." }
    ]
  },

  {
    id: "MW-13",
    topic: "motorway-driving",
    promptEn: "On a motorway, what do amber flashing lights on overhead signs warn you about?",
    promptAr: "على الطريق السريع، ماذا تحذّرك الأضواء الكهرمانية الوامضة على اللوحات العلوية؟",
    options: [
      { en: "There is a hazard or temporary restriction ahead", ar: "هناك خطر أو قيود مؤقتة أمامك", correct: true },
      { en: "The motorway is closing immediately", ar: "سيُغلق الطريق السريع فوراً", correct: false },
      { en: "Only that services are near", ar: "فقط أن محطة خدمات قريبة", correct: false },
      { en: "You must leave at the next exit", ar: "يجب أن تخرج عند المخرج التالي حتماً", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-14",
    topic: "motorway-driving",
    promptEn: "What is the purpose of a crawler lane on a motorway or dual carriageway?",
    promptAr: "ما الغرض من مسار الزحف (Crawler lane) على الطرق السريعة أو ذات المسارين؟",
    options: [
      { en: "To assist slow-moving vehicles on steep hills", ar: "لمساعدة المركبات البطيئة على المنحدرات الحادة", correct: true },
      { en: "For motorcycles only", ar: "للدراجات النارية فقط", correct: false },
      { en: "For overtaking at high speed", ar: "للتجاوز بسرعات عالية", correct: false },
      { en: "For emergency vehicles only", ar: "لمركبات الطوارئ فقط", correct: false }
    ],
    keywords: [
      { term: "crawler lane", ar: "مسار زحف", explainAr: "مسار إضافي لناقلات البضائع والمركبات البطيئة على المنحدرات." }
    ]
  },

  {
    id: "MW-15",
    topic: "motorway-driving",
    promptEn: "You see a red 'X' over the right-hand lane and a speed limit over the left lanes. What should you do?",
    promptAr: "ترى علامة X حمراء فوق المسار الأيمن وحد السرعة فوق المسارات الأخرى. ماذا يجب أن تفعل؟",
    options: [
      { en: "Leave the right-hand lane and obey the speed limit in the open lanes", ar: "تغادر المسار الأيمن وتلتزم بحد السرعة في المسارات المفتوحة", correct: true },
      { en: "Stay in the right-hand lane until the next exit", ar: "تبقى في المسار الأيمن حتى المخرج", correct: false },
      { en: "Ignore the red X if the lane seems clear", ar: "تتجاهل علامة الـ X إذا بدا المسار خالياً", correct: false },
      { en: "Speed up in the right-hand lane", ar: "تزيد السرعة في المسار الأيمن", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-16",
    topic: "motorway-driving",
    promptEn: "When should you use the right-hand lane on a three-lane motorway?",
    promptAr: "متى يجب أن تستخدم المسار الأيمن على طريق سريع بثلاثة مسارات؟",
    options: [
      { en: "Only when overtaking slower vehicles in the middle lane", ar: "فقط عند تجاوز المركبات الأبطأ في المسار الأوسط", correct: true },
      { en: "For normal driving at all times", ar: "للقيادة العادية دائماً", correct: false },
      { en: "When joining the motorway", ar: "عند الانضمام للطريق السريع", correct: false },
      { en: "When leaving the motorway", ar: "عند مغادرة الطريق السريع", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-17",
    topic: "motorway-driving",
    promptEn: "You break down on a motorway. Where should you wait for help?",
    promptAr: "تعطلت سيارتك على الطريق السريع. أين يجب أن تنتظر المساعدة؟",
    options: [
      { en: "On the grass verge or behind the barrier if possible", ar: "على العشب أو خلف الحاجز إن أمكن", correct: true },
      { en: "In the driver's seat with hazard lights on", ar: "في مقعد السائق مع تشغيل الهزارْد", correct: false },
      { en: "Standing in front of the car", ar: "واقفاً أمام السيارة", correct: false },
      { en: "In the hard shoulder, next to the traffic", ar: "على الكتف بجانب حركة المرور", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-18",
    topic: "motorway-driving",
    promptEn: "When leaving a motorway, why is it important to check your speed?",
    promptAr: "عند مغادرة الطريق السريع، لماذا من المهم فحص سرعتك؟",
    options: [
      { en: "Your sense of speed may be distorted after fast driving", ar: "قد يكون إحساسك بالسرعة مضطرباً بعد القيادة السريعة", correct: true },
      { en: "You must always stop at the end of the slip road", ar: "يجب عليك التوقف في نهاية مسار الخروج", correct: false },
      { en: "Other roads always have higher speed limits", ar: "الطرق الأخرى دائماً أسرع", correct: false },
      { en: "Speed cameras aren't used off the motorway", ar: "لا توجد كاميرات سرعة خارج الطريق السريع", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-19",
    topic: "motorway-driving",
    promptEn: "What is the safest way to rejoin traffic from the hard shoulder on a smart motorway?",
    promptAr: "ما الطريقة الأكثر أماناً للعودة إلى حركة المرور من الكتف على طريق سريع ذكي؟",
    options: [
      { en: "Wait for a safe gap and build up speed on the hard shoulder before moving out", ar: "تنتظر فجوة آمنة وتزيد سرعتك على الكتف قبل الخروج", correct: true },
      { en: "Move out immediately at low speed", ar: "تخرج فوراً بسرعة منخفضة", correct: false },
      { en: "Rely on other drivers to slow down", ar: "تعتمد على أن يبطئ الآخرون", correct: false },
      { en: "Reverse along the hard shoulder to the previous exit", ar: "ترجع للخلف على الكتف حتى المخرج السابق", correct: false }
    ],
    keywords: []
  },

  {
    id: "MW-20",
    topic: "motorway-driving",
    promptEn: "When should you use hazard warning lights on a motorway?",
    promptAr: "متى يجب استخدام أضواء التحذير (الهزارْد) على الطريق السريع؟",
    options: [
      { en: "When traffic ahead is slowing suddenly and you are behind", ar: "عندما تتباطأ حركة المرور فجأة أمامك وأنت خلفهم", correct: true },
      { en: "When you are driving above the speed limit", ar: "عندما تقود فوق حد السرعة", correct: false },
      { en: "To warn drivers that you are tired", ar: "لتحذير الآخرين بأنك متعب", correct: false },
      { en: "To thank another driver", ar: "لشكر سائق آخر", correct: false }
    ],
    keywords: []
  },

  // --- RULES OF THE ROAD (EXTRA) ---

  {
    id: "RR-06",
    topic: "rules-of-the-road",
    promptEn: "At a roundabout, when should you signal left?",
    promptAr: "في الدوّار، متى يجب عليك تشغيل إشارة اليسار؟",
    options: [
      { en: "When you are about to leave the roundabout", ar: "عند اقترابك من الخروج من الدوار", correct: true },
      { en: "When entering the roundabout", ar: "عند دخول الدوار", correct: false },
      { en: "When passing the first exit only", ar: "عند تجاوز المخرج الأول فقط", correct: false },
      { en: "You should never signal on roundabouts", ar: "لا يجب استخدام الإشارة على الإطلاق", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-07",
    topic: "rules-of-the-road",
    promptEn: "You arrive at a junction with a 'Give Way' sign. What must you do?",
    promptAr: "وصلت إلى تقاطع توجد فيه إشارة 'Give Way'. ماذا يجب أن تفعل؟",
    options: [
      { en: "Allow traffic on the main road to pass", ar: "تفسح الطريق لحركة المرور على الطريق الرئيسي", correct: true },
      { en: "Proceed immediately", ar: "تتابع فوراً", correct: false },
      { en: "Sound your horn and continue", ar: "تستخدم البوق وتتابع", correct: false },
      { en: "Speed up to join the main road faster", ar: "تسرع للاندماج بسرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-08",
    topic: "rules-of-the-road",
    promptEn: "You want to turn right onto a dual carriageway. What should you ensure first?",
    promptAr: "تريد الانعطاف يمينًا إلى طريق مزدوج. ماذا يجب أن تتأكد منه أولاً؟",
    options: [
      { en: "There is a safe gap in the traffic from both directions", ar: "وجود فجوة آمنة في حركة المرور من كلا الاتجاهين", correct: true },
      { en: "The central reservation is empty", ar: "الجزيرة الوسطى فارغة", correct: false },
      { en: "There are no vehicles behind you", ar: "لا توجد مركبات خلفك", correct: false },
      { en: "You can accelerate quickly", ar: "يمكنك التسارع بسرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-09",
    topic: "rules-of-the-road",
    promptEn: "When should you use dipped headlights?",
    promptAr: "متى يجب استخدام الأضواء المنخفضة؟",
    options: [
      { en: "When driving at night in built-up areas", ar: "عند القيادة ليلاً في المناطق المبنية", correct: true },
      { en: "When no one is around at all", ar: "عندما لا يوجد أحد حولك", correct: false },
      { en: "Only when overtaking", ar: "فقط عند التجاوز", correct: false },
      { en: "Never at night", ar: "لا تُستخدم ليلاً", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-10",
    topic: "rules-of-the-road",
    promptEn: "What must you do when approaching roadworks controlled by temporary traffic lights?",
    promptAr: "ماذا يجب أن تفعل عند الاقتراب من أعمال طرق تتحكم بها إشارات مرور مؤقتة؟",
    options: [
      { en: "Obey the signals as normal", ar: "تتبع الإشارات كالمعتاد", correct: true },
      { en: "Ignore them if the road looks clear", ar: "تتجاهلها إذا بدا الطريق خالياً", correct: false },
      { en: "Sound your horn before crossing", ar: "تستخدم البوق قبل العبور", correct: false },
      { en: "Accelerate to pass quickly", ar: "تسرع للمرور بسرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-11",
    topic: "rules-of-the-road",
    promptEn: "You are on a road with two lanes going in your direction. When should you use the right-hand lane?",
    promptAr: "أنت على طريق فيه مساران باتجاهك. متى يجب استخدام المسار الأيمن؟",
    options: [
      { en: "When overtaking or turning right", ar: "عند التجاوز أو الانعطاف يمينًا", correct: true },
      { en: "For normal driving", ar: "للسير العادي", correct: false },
      { en: "When driving slowly", ar: "عند القيادة ببطء", correct: false },
      { en: "When looking for a parking spot", ar: "عند البحث عن موقف", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-12",
    topic: "rules-of-the-road",
    promptEn: "You are driving in a built-up area. What is usually the speed limit?",
    promptAr: "أنت تقود في منطقة مبنية. ما هو حد السرعة المعتاد؟",
    options: [
      { en: "30 mph", ar: "٣٠ ميل/ساعة", correct: true },
      { en: "40 mph", ar: "٤٠ ميل/ساعة", correct: false },
      { en: "50 mph", ar: "٥٠ ميل/ساعة", correct: false },
      { en: "20 mph only at night", ar: "٢٠ ميل/ساعة ليلاً فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-13",
    topic: "rules-of-the-road",
    promptEn: "You see a bus signaling to move away from a stop in a busy area. What should you do?",
    promptAr: "ترى حافلة تُشغل إشارة لتغادر موقفها في منطقة مزدحمة. ماذا يجب أن تفعل؟",
    options: [
      { en: "Be prepared to slow down and let it move", ar: "تستعد لتخفيف السرعة والسماح لها بالتحرك", correct: true },
      { en: "Overtake quickly before it moves", ar: "تتجاوز بسرعة قبل أن تتحرك", correct: false },
      { en: "Sound your horn at the bus", ar: "تستخدم البوق تجاه الحافلة", correct: false },
      { en: "Drive close behind it", ar: "تقود ملاصقاً لها", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-14",
    topic: "rules-of-the-road",
    promptEn: "Why must you not stop on a clearway?",
    promptAr: "لماذا يجب ألا تتوقف على طريق Clearway؟",
    options: [
      { en: "Stopping is prohibited except for emergencies", ar: "ممنوع التوقف إلا في حالات الطوارئ", correct: true },
      { en: "It is a private road", ar: "لأنه طريق خاص", correct: false },
      { en: "Only residents may stop there", ar: "يُسمح للسكان فقط بالتوقف", correct: false },
      { en: "Buses use it only", ar: "تستخدمه الحافلات فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-15",
    topic: "rules-of-the-road",
    promptEn: "Where would you expect to see a 'No stopping' sign?",
    promptAr: "أين تتوقع أن ترى إشارة 'ممنوع التوقف'؟",
    options: [
      { en: "On busy main roads", ar: "على الطرق الرئيسية المزدحمة", correct: true },
      { en: "In quiet country lanes", ar: "في طرق ريفية هادئة", correct: false },
      { en: "Inside car parks", ar: "داخل مواقف السيارات", correct: false },
      { en: "Next to playgrounds only", ar: "بجانب الملاعب فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-16",
    topic: "rules-of-the-road",
    promptEn: "When can you cross a solid white line in the centre of the road?",
    promptAr: "متى يمكنك عبور خط أبيض صلب في منتصف الطريق؟",
    options: [
      { en: "To pass a stationary vehicle or cyclist", ar: "لتجاوز مركبة متوقفة أو درّاج بطيء", correct: true },
      { en: "To overtake vehicles at speed", ar: "لتجاوز مركبات بسرعة", correct: false },
      { en: "Whenever the road looks clear", ar: "في أي وقت يبدو الطريق خالياً", correct: false },
      { en: "To turn around in the road", ar: "للقيام باستدارة في الطريق", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-17",
    topic: "rules-of-the-road",
    promptEn: "A flashing amber beacon on a vehicle means:",
    promptAr: "ضوء كهرماني وامض على مركبة يعني:",
    options: [
      { en: "It is a slow-moving or disabled vehicle", ar: "مركبة بطيئة أو فيها عطل", correct: true },
      { en: "The driver is signaling to overtake", ar: "السائق يطلب التجاوز", correct: false },
      { en: "The driver is giving way", ar: "السائق يفسح الطريق", correct: false },
      { en: "A police vehicle", ar: "مركبة شرطة", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-18",
    topic: "rules-of-the-road",
    promptEn: "You are on a dual carriageway. What does a solid white line at the edge of the road mean?",
    promptAr: "أنت على طريق ذي مسارين (Dual carriageway). ماذا يعني الخط الأبيض الصلب على حافة الطريق؟",
    options: [
      { en: "Edge of the carriageway", ar: "حافة الطريق", correct: true },
      { en: "Lane is closed", ar: "المسار مغلق", correct: false },
      { en: "Bus lane begins", ar: "بداية مسار الحافلات", correct: false },
      { en: "Cycle lane only", ar: "مسار دراجات فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-19",
    topic: "rules-of-the-road",
    promptEn: "What should you do if the road ahead is blocked by animals?",
    promptAr: "ماذا يجب أن تفعل إذا كان الطريق أمامك مسدوداً بالحيوانات؟",
    options: [
      { en: "Stop and wait patiently", ar: "تتوقف وتنتظر بصبر", correct: true },
      { en: "Sound your horn aggressively", ar: "تستخدم البوق بعدوانية", correct: false },
      { en: "Drive close to move them aside", ar: "تقود قريباً لدفعهم جانباً", correct: false },
      { en: "Flash headlights at them", ar: "تومض بالأضواء", correct: false }
    ],
    keywords: []
  },

  {
    id: "RR-20",
    topic: "rules-of-the-road",
    promptEn: "What should you do when approaching a mini-roundabout?",
    promptAr: "ماذا يجب أن تفعل عند الاقتراب من دوّار صغير (Mini-roundabout)؟",
    options: [
      { en: "Give way to traffic from the right", ar: "تفسح الطريق للقادم من اليمين", correct: true },
      { en: "Give way to traffic from the left", ar: "تفسح الطريق للقادم من اليسار", correct: false },
      { en: "Ignore all markings", ar: "تتجاهل العلامات", correct: false },
      { en: "Use hazard lights", ar: "تشغّل أضواء التحذير", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5311",
    topic: "rules-of-the-road",
    promptEn: "When turning right at a junction, where should you position your vehicle?",
    promptAr: "عند الانعطاف يمينًا عند تقاطع، أين يجب أن تتموضع مركبتك؟",
    options: [
      { en: "Close to the left-hand kerb", ar: "قريبًا من الرصيف الأيسر", correct: false },
      { en: "In the centre of the road", ar: "في منتصف الطريق", correct: false },
      { en: "Just left of the centre line", ar: "قليلًا إلى يسار خط المنتصف", correct: true },
      { en: "Anywhere as long as you signal", ar: "في أي مكان طالما تعطي إشارة", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5312",
    topic: "rules-of-the-road",
    promptEn: "When must you use your indicators?",
    promptAr: "متى يجب عليك استخدام إشارات الانعطاف؟",
    options: [
      { en: "Only when other drivers are present", ar: "فقط عندما يكون هناك سائقون آخرون", correct: false },
      { en: "Only at junctions", ar: "فقط عند التقاطعات", correct: false },
      { en: "Whenever your actions may affect other road users", ar: "عندما قد تؤثر تصرفاتك على مستخدمي الطريق الآخرين", correct: true },
      { en: "Only in busy traffic", ar: "فقط في الازدحام", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5313",
    topic: "rules-of-the-road",
    promptEn: "When should you cancel your signal after turning?",
    promptAr: "متى يجب عليك إلغاء إشارة الانعطاف بعد الانعطاف؟",
    options: [
      { en: "Immediately after starting the turn", ar: "فور بدء الانعطاف", correct: false },
      { en: "After completing the manoeuvre", ar: "بعد إكمال المناورة", correct: true },
      { en: "After checking mirrors", ar: "بعد فحص المرايا", correct: false },
      { en: "Only if traffic is behind you", ar: "فقط إذا كان هناك مرور خلفك", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5314",
    topic: "rules-of-the-road",
    promptEn: "What should you do if traffic lights change to amber while you are approaching?",
    promptAr: "ماذا يجب أن تفعل إذا تحولت إشارة المرور إلى اللون الكهرماني أثناء اقترابك؟",
    options: [
      { en: "Accelerate to get through", ar: "التسارع للمرور", correct: false },
      { en: "Stop if it is safe to do so", ar: "التوقف إذا كان ذلك آمنًا", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Ignore the signal", ar: "تجاهل الإشارة", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5315",
    topic: "rules-of-the-road",
    promptEn: "When turning left at a junction, what should you check for?",
    promptAr: "عند الانعطاف يسارًا عند تقاطع، ماذا يجب أن تتحقق منه؟",
    options: [
      { en: "Only vehicles coming from the right", ar: "فقط المركبات القادمة من اليمين", correct: false },
      { en: "Pedestrians and cyclists", ar: "المشاة وراكبي الدراجات", correct: true },
      { en: "Traffic lights only", ar: "إشارات المرور فقط", correct: false },
      { en: "Road signs only", ar: "إشارات الطريق فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5316",
    topic: "rules-of-the-road",
    promptEn: "What does it mean if you see a broken white line along the centre of the road?",
    promptAr: "ماذا يعني وجود خط أبيض متقطع في منتصف الطريق؟",
    options: [
      { en: "No overtaking allowed", ar: "يُمنع التجاوز", correct: false },
      { en: "Overtaking is allowed if safe", ar: "يُسمح بالتجاوز إذا كان آمنًا", correct: true },
      { en: "Road narrows ahead", ar: "الطريق يضيق أمامك", correct: false },
      { en: "Speed limit changes", ar: "يتغير حد السرعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5317",
    topic: "rules-of-the-road",
    promptEn: "What should you do before changing lanes?",
    promptAr: "ماذا يجب أن تفعل قبل تغيير المسار؟",
    options: [
      { en: "Signal and move immediately", ar: "إعطاء إشارة والتحرك فورًا", correct: false },
      { en: "Check mirrors and blind spots", ar: "فحص المرايا والنقاط العمياء", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Slow down sharply", ar: "التباطؤ بشكل حاد", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5318",
    topic: "rules-of-the-road",
    promptEn: "When approaching a junction with a GIVE WAY sign, what must you do?",
    promptAr: "عند الاقتراب من تقاطع يحمل إشارة إعطاء الأولوية (Give Way)، ماذا يجب أن تفعل؟",
    options: [
      { en: "Stop completely", ar: "التوقف تمامًا", correct: false },
      { en: "Slow down and give way if necessary", ar: "التخفيف وإعطاء الأولوية إذا لزم الأمر", correct: true },
      { en: "Accelerate through", ar: "التسارع للمرور", correct: false },
      { en: "Ignore traffic on the main road", ar: "تجاهل المرور على الطريق الرئيسي", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5319",
    topic: "rules-of-the-road",
    promptEn: "When should you NOT overtake another vehicle?",
    promptAr: "متى يجب عليك عدم تجاوز مركبة أخرى؟",
    options: [
      { en: "On a straight, clear road", ar: "على طريق مستقيم وواضح", correct: false },
      { en: "When approaching a junction or bend", ar: "عند الاقتراب من تقاطع أو منعطف", correct: true },
      { en: "When traffic is light", ar: "عندما يكون المرور خفيفًا", correct: false },
      { en: "On a dual carriageway", ar: "على طريق مزدوج", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5320",
    topic: "rules-of-the-road",
    promptEn: "Why should you keep a safe distance from the vehicle in front?",
    promptAr: "لماذا يجب عليك الحفاظ على مسافة أمان مع المركبة التي أمامك؟",
    options: [
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To allow enough time to react and stop safely", ar: "لإتاحة وقت كافٍ للاستجابة والتوقف بأمان", correct: true },
      { en: "To drive faster", ar: "للقيادة بشكل أسرع", correct: false },
      { en: "To block other vehicles", ar: "لمنع المركبات الأخرى", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5321",
    topic: "rules-of-the-road",
    promptEn: "What should you do if another driver flashes their headlights at you?",
    promptAr: "ماذا يجب أن تفعل إذا قام سائق آخر بوميض أضواءه تجاهك؟",
    options: [
      { en: "Assume they are giving way", ar: "تفترض أنه يعطيك أولوية المرور", correct: false },
      { en: "Proceed only if you are sure it is safe", ar: "تتحرك فقط إذا كنت متأكدًا أن ذلك آمن", correct: true },
      { en: "Speed up immediately", ar: "تزيد السرعة فورًا", correct: false },
      { en: "Always stop", ar: "تتوقف دائمًا", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5322",
    topic: "rules-of-the-road",
    promptEn: "When should you use your horn?",
    promptAr: "متى يجب عليك استخدام البوق؟",
    options: [
      { en: "To express annoyance", ar: "للتعبير عن الانزعاج", correct: false },
      { en: "To warn others of your presence", ar: "لتحذير الآخرين من وجودك", correct: true },
      { en: "To encourage pedestrians to cross", ar: "لتشجيع المشاة على العبور", correct: false },
      { en: "To signal priority", ar: "لإعطاء أولوية المرور", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5323",
    topic: "rules-of-the-road",
    promptEn: "What should you do if road markings are unclear due to weather conditions?",
    promptAr: "ماذا يجب أن تفعل إذا كانت علامات الطريق غير واضحة بسبب الطقس؟",
    options: [
      { en: "Ignore the markings", ar: "تتجاهل العلامات", correct: false },
      { en: "Rely on road signs and drive with extra care", ar: "تعتمد على الإشارات وتقود بحذر إضافي", correct: true },
      { en: "Drive faster to clear the area", ar: "تقود بسرعة لتجاوز المنطقة", correct: false },
      { en: "Stop until markings reappear", ar: "تتوقف حتى تظهر العلامات", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5324",
    topic: "rules-of-the-road",
    promptEn: "When must you obey traffic signs even if the road seems clear?",
    promptAr: "متى يجب عليك الالتزام بإشارات المرور حتى لو بدا الطريق خاليًا؟",
    options: [
      { en: "Only during busy periods", ar: "فقط في أوقات الازدحام", correct: false },
      { en: "At all times", ar: "في جميع الأوقات", correct: true },
      { en: "Only in daylight", ar: "فقط في النهار", correct: false },
      { en: "Only when other drivers are present", ar: "فقط عند وجود سائقين آخرين", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5325",
    topic: "rules-of-the-road",
    promptEn: "What should you do if you miss your exit on a main road?",
    promptAr: "ماذا يجب أن تفعل إذا فاتك المخرج على طريق رئيسي؟",
    options: [
      { en: "Stop and reverse carefully", ar: "تتوقف وتعود للخلف بحذر", correct: false },
      { en: "Continue to the next safe turning point", ar: "تتابع حتى أقرب مكان آمن للالتفاف", correct: true },
      { en: "Make a U-turn immediately", ar: "تقوم باستدارة فورًا", correct: false },
      { en: "Turn sharply across traffic", ar: "تنعطف بشكل حاد عبر المرور", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5326",
    topic: "rules-of-the-road",
    promptEn: "Why should you avoid tailgating the vehicle in front?",
    promptAr: "لماذا يجب عليك تجنب القيادة ملاصقًا للمركبة التي أمامك؟",
    options: [
      { en: "It increases fuel use", ar: "يزيد استهلاك الوقود", correct: false },
      { en: "It reduces your stopping distance and reaction time", ar: "يقلل مسافة التوقف ووقت رد الفعل", correct: true },
      { en: "It improves traffic flow", ar: "يحسن تدفق المرور", correct: false },
      { en: "It is allowed in slow traffic", ar: "مسموح في المرور البطيء", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5327",
    topic: "rules-of-the-road",
    promptEn: "When driving in residential areas, what should you be particularly aware of?",
    promptAr: "عند القيادة في المناطق السكنية، ما الذي يجب أن تكون حذرًا منه بشكل خاص؟",
    options: [
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false },
      { en: "Children and pedestrians", ar: "الأطفال والمشاة", correct: true },
      { en: "Motorway traffic", ar: "حركة المرور السريعة", correct: false },
      { en: "Wide junctions", ar: "تقاطعات واسعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5328",
    topic: "rules-of-the-road",
    promptEn: "What is the safest response to aggressive driving by another road user?",
    promptAr: "ما هو التصرف الأكثر أمانًا تجاه سائق عدواني؟",
    options: [
      { en: "Respond with gestures", ar: "الرد بإشارات", correct: false },
      { en: "Stay calm and keep your distance", ar: "البقاء هادئًا والحفاظ على مسافة", correct: true },
      { en: "Brake sharply", ar: "الكبح بشكل مفاجئ", correct: false },
      { en: "Sound the horn repeatedly", ar: "استخدام البوق بشكل متكرر", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5329",
    topic: "rules-of-the-road",
    promptEn: "Why should you plan your route before starting a journey?",
    promptAr: "لماذا يجب عليك التخطيط لرحلتك قبل البدء؟",
    options: [
      { en: "To avoid traffic laws", ar: "لتجنب قوانين المرور", correct: false },
      { en: "To reduce stress and avoid sudden decisions", ar: "لتقليل التوتر وتجنب قرارات مفاجئة", correct: true },
      { en: "To drive faster", ar: "للقيادة بشكل أسرع", correct: false },
      { en: "To impress other drivers", ar: "لإبهار السائقين الآخرين", correct: false }
    ],
    keywords: []
  },

  {
    id: "ROR-5330",
    topic: "rules-of-the-road",
    promptEn: "What is your main responsibility as a driver?",
    promptAr: "ما هي مسؤوليتك الأساسية كسائق؟",
    options: [
      { en: "To reach your destination quickly", ar: "الوصول بسرعة", correct: false },
      { en: "To drive safely and consider other road users", ar: "القيادة بأمان ومراعاة مستخدمي الطريق الآخرين", correct: true },
      { en: "To assert priority", ar: "فرض الأولوية", correct: false },
      { en: "To follow other drivers", ar: "اتباع السائقين الآخرين", correct: false }
    ],
    keywords: []
  },

  // --- SAFETY & YOUR VEHICLE (EXTRA) ---

  {
    id: "SV-21",
    topic: "safety-vehicle",
    promptEn: "How often should you check the condition of your tyres?",
    promptAr: "كل كم من الوقت يجب أن تتحقق من حالة الإطارات؟",
    options: [
      { en: "At least once a week", ar: "مرة واحدة على الأقل في الأسبوع", correct: true },
      { en: "Once a year", ar: "مرة في السنة", correct: false },
      { en: "Only before MOT", ar: "فقط قبل فحص الـ MOT", correct: false },
      { en: "Only if you notice a problem", ar: "فقط إذا لاحظت مشكلة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-22",
    topic: "safety-vehicle",
    promptEn: "What is the purpose of head restraints on seats?",
    promptAr: "ما فائدة مساند الرأس على المقاعد؟",
    options: [
      { en: "To reduce risk of neck injury in a collision", ar: "لتقليل خطر إصابة الرقبة في التصادم", correct: true },
      { en: "To make the seat more comfortable", ar: "لجعل المقعد أكثر راحة", correct: false },
      { en: "To help you sleep while driving", ar: "لتساعدك على النوم أثناء القيادة", correct: false },
      { en: "To improve rear visibility", ar: "لتحسين الرؤية الخلفية", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-23",
    topic: "safety-vehicle",
    promptEn: "What can cause uneven tyre wear?",
    promptAr: "ما الذي قد يسبب تآكل غير متساوٍ للإطارات؟",
    options: [
      { en: "Incorrect wheel alignment", ar: "عدم اتزان العجلات", correct: true },
      { en: "Correct tyre pressure", ar: "ضغط الإطار الصحيح", correct: false },
      { en: "Using dipped headlights", ar: "استخدام الأضواء المنخفضة", correct: false },
      { en: "Low fuel level", ar: "انخفاض الوقود", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-24",
    topic: "safety-vehicle",
    promptEn: "When should you use the rear fog lights?",
    promptAr: "متى يجب عليك استخدام أضواء الضباب الخلفية؟",
    options: [
      { en: "When visibility is seriously reduced (e.g., in thick fog)", ar: "عندما تكون الرؤية منخفضة جدًا (مثل الضباب الكثيف)", correct: true },
      { en: "When driving at night in a city", ar: "عند القيادة ليلاً داخل المدينة", correct: false },
      { en: "When it's slightly raining", ar: "عند تساقط مطر خفيف", correct: false },
      { en: "Whenever you use front fog lights", ar: "كلما استخدمت أضواء الضباب الأمامية", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-25",
    topic: "safety-vehicle",
    promptEn: "How can you reduce the risk of your vehicle being stolen?",
    promptAr: "كيف يمكنك تقليل خطر سرقة سيارتك؟",
    options: [
      { en: "Always lock the car and remove the keys", ar: "تُقفِل السيارة دائماً وتزيل المفاتيح", correct: true },
      { en: "Leave windows slightly open", ar: "تترك النوافذ مفتوحة قليلاً", correct: false },
      { en: "Leave the engine running if you are quick", ar: "تترك المحرك يعمل إذا كنت سريعاً", correct: false },
      { en: "Hide the keys inside the car", ar: "تخفي المفاتيح داخل السيارة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-26",
    topic: "safety-vehicle",
    promptEn: "What can excessive or uneven brake wear indicate?",
    promptAr: "ماذا قد يشير تآكل الفرامل المفرط أو غير المتساوي؟",
    options: [
      { en: "A fault in the braking system", ar: "وجود عطل في نظام الفرامل", correct: true },
      { en: "Correct use of gears", ar: "الاستخدام الصحيح للغيار", correct: false },
      { en: "High quality brake pads", ar: "نوعية جيدة من فحمات الفرامل", correct: false },
      { en: "Normal driving style", ar: "أسلوب قيادة طبيعي", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-27",
    topic: "safety-vehicle",
    promptEn: "When might your braking distance be longer than normal?",
    promptAr: "متى يمكن أن تكون مسافة التوقف أطول من المعتاد؟",
    options: [
      { en: "When tyres are worn or pressures are low", ar: "عندما تكون الإطارات بالية أو ضغطها منخفض", correct: true },
      { en: "When the car is new", ar: "عندما تكون السيارة جديدة", correct: false },
      { en: "When the road is dry and clean", ar: "عندما يكون الطريق جافًا ونظيفًا", correct: false },
      { en: "When you are alone in the car", ar: "عندما تكون وحدك في السيارة", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-28",
    topic: "safety-vehicle",
    promptEn: "What should you check before a long journey?",
    promptAr: "ماذا يجب أن تتحقق قبل رحلة طويلة؟",
    options: [
      { en: "Oil, coolant, tyres, and lights", ar: "الزيت، سائل التبريد، الإطارات، والأضواء", correct: true },
      { en: "Only the fuel level", ar: "فقط مستوى الوقود", correct: false },
      { en: "Only cleanliness of the car", ar: "فقط نظافة السيارة", correct: false },
      { en: "Only the horn", ar: "فقط البوق", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-29",
    topic: "safety-vehicle",
    promptEn: "What can happen if you drive with low engine oil?",
    promptAr: "ماذا يمكن أن يحدث إذا قدت بمستوى زيت محرك منخفض؟",
    options: [
      { en: "The engine may be seriously damaged", ar: "قد يتعرض المحرك لضرر شديد", correct: true },
      { en: "The tyres will last longer", ar: "الإطارات تدوم أكثر", correct: false },
      { en: "The car will use less fuel", ar: "السيارة تستهلك وقوداً أقل", correct: false },
      { en: "Braking distance is reduced", ar: "مسافة التوقف تقل", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-30",
    topic: "safety-vehicle",
    promptEn: "What does it mean if your temperature warning light comes on while driving?",
    promptAr: "ماذا يعني ظهور ضوء تحذير الحرارة أثناء القيادة؟",
    options: [
      { en: "The engine is overheating", ar: "المحرك ترتفع حرارته", correct: true },
      { en: "The tyres are overheating", ar: "الإطارات ترتفع حرارتها", correct: false },
      { en: "The air conditioning is broken", ar: "مكيف الهواء معطل", correct: false },
      { en: "The battery is fully charged", ar: "البطارية مشحونة بالكامل", correct: false }
    ],
    keywords: []
  },

  {
    id: "SV-6301",
    topic: "safety-vehicle",
    promptEn: "Why should you regularly check your tyre pressures?",
    promptAr: "لماذا يجب فحص ضغط الإطارات بانتظام؟",
    options: [
      { en: "To improve radio reception", ar: "لتحسين استقبال الراديو", correct: false },
      { en: "To maintain safe handling and braking", ar: "للحفاظ على التحكم والفرملة الآمنة", correct: true },
      { en: "To reduce engine noise", ar: "لتقليل ضوضاء المحرك", correct: false },
      { en: "To increase battery life", ar: "لإطالة عمر البطارية", correct: false }
    ],
    keywords: [
      { term: "tyre pressure", ar: "ضغط الإطارات", explainAr: "الضغط الصحيح يضمن التحكم الآمن والفرملة الفعالة." },
      { term: "handling", ar: "التحكم", explainAr: "قدرة السيارة على الاستجابة لتوجيهات السائق." },
      { term: "braking", ar: "الفرملة", explainAr: "عملية إيقاف أو إبطاء السيارة." }
    ]
  },

  {
    id: "SV-6302",
    topic: "safety-vehicle",
    promptEn: "What does a spongy brake pedal usually indicate?",
    promptAr: "ماذا يدل عليه دواسة فرامل إسفنجية؟",
    options: [
      { en: "Worn tyres", ar: "إطارات مهترئة", correct: false },
      { en: "Air in the braking system", ar: "وجود هواء في نظام الفرامل", correct: true },
      { en: "Low fuel level", ar: "انخفاض الوقود", correct: false },
      { en: "Overheated engine", ar: "سخونة المحرك", correct: false }
    ],
    keywords: [
      { term: "brakes", ar: "الفرامل", explainAr: "نظام إيقاف السيارة." },
      { term: "spongy pedal", ar: "دواسة إسفنجية", explainAr: "دواسة الفرامل التي تشعر بالليونة أو الإسفنجية." },
      { term: "air in system", ar: "هواء في النظام", explainAr: "وجود هواء في نظام الفرامل يقلل من فعاليتها." }
    ]
  },

  {
    id: "SV-6303",
    topic: "safety-vehicle",
    promptEn: "Why must your headlights be clean and working correctly?",
    promptAr: "لماذا يجب أن تكون المصابيح الأمامية نظيفة وتعمل بشكل صحيح؟",
    options: [
      { en: "To improve fuel efficiency", ar: "لتحسين كفاءة الوقود", correct: false },
      { en: "To see and be seen clearly", ar: "لرؤية الطريق وأن تُرى بوضوح", correct: true },
      { en: "To avoid engine damage", ar: "لتجنب تلف المحرك", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false }
    ],
    keywords: [
      { term: "headlights", ar: "المصابيح الأمامية", explainAr: "الأضواء الأمامية للسيارة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على الرؤية والظهور للآخرين." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على السلامة أثناء القيادة." }
    ]
  },

  {
    id: "SV-6304",
    topic: "safety-vehicle",
    promptEn: "What should you do if a warning light comes on while driving?",
    promptAr: "ماذا يجب أن تفعل إذا أضاءت لمبة تحذير أثناء القيادة؟",
    options: [
      { en: "Ignore it if the car feels normal", ar: "تجاهلها إذا بدت المركبة طبيعية", correct: false },
      { en: "Deal with the problem as soon as it is safe", ar: "معالجة المشكلة بأسرع وقت ممكن وبأمان", correct: true },
      { en: "Switch off the light manually", ar: "إطفاء اللمبة يدويًا", correct: false },
      { en: "Increase speed to finish the journey", ar: "زيادة السرعة لإنهاء الرحلة", correct: false }
    ],
    keywords: [
      { term: "warning light", ar: "لمبة تحذير", explainAr: "ضوء على لوحة القيادة يشير إلى مشكلة محتملة." },
      { term: "dashboard", ar: "لوحة القيادة", explainAr: "لوحة المعلومات في السيارة." },
      { term: "vehicle safety", ar: "أمان المركبة", explainAr: "سلامة المركبة وسلامة القيادة." }
    ]
  },

  {
    id: "SV-6305",
    topic: "safety-vehicle",
    promptEn: "Why is it dangerous to drive with worn tyres?",
    promptAr: "لماذا تعتبر القيادة بإطارات مهترئة خطيرة؟",
    options: [
      { en: "They reduce fuel economy", ar: "تقلل اقتصاد الوقود", correct: false },
      { en: "They reduce grip and increase stopping distance", ar: "تقلل التماسك وتزيد مسافة التوقف", correct: true },
      { en: "They increase engine noise", ar: "تزيد ضوضاء المحرك", correct: false },
      { en: "They affect the battery", ar: "تؤثر على البطارية", correct: false }
    ],
    keywords: [
      { term: "worn tyres", ar: "إطارات مهترئة", explainAr: "إطارات فقدت عمق النقشة أو أصبحت تالفة." },
      { term: "grip", ar: "التماسك", explainAr: "قدرة الإطارات على التمسك بالطريق." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة اللازمة لإيقاف السيارة تماماً." }
    ]
  },

  {
    id: "SV-6306",
    topic: "safety-vehicle",
    promptEn: "What is the legal minimum tread depth for car tyres?",
    promptAr: "ما الحد الأدنى القانوني لعمق مداس إطارات السيارة؟",
    options: [
      { en: "1.0 mm", ar: "1.0 مم", correct: false },
      { en: "1.6 mm", ar: "1.6 مم", correct: true },
      { en: "2.0 mm", ar: "2.0 مم", correct: false },
      { en: "3.0 mm", ar: "3.0 مم", correct: false }
    ],
    keywords: [
      { term: "tread depth", ar: "عمق المداس", explainAr: "عمق النقشة على الإطار، الحد الأدنى القانوني هو 1.6 مم." },
      { term: "tyres", ar: "الإطارات", explainAr: "العجلات المطاطية للسيارة." },
      { term: "legal limit", ar: "الحد القانوني", explainAr: "الحد الأدنى المطلوب قانونياً." }
    ]
  },

  {
    id: "SV-6307",
    topic: "safety-vehicle",
    promptEn: "Why should you check your brakes after driving through deep water?",
    promptAr: "لماذا يجب فحص الفرامل بعد القيادة عبر مياه عميقة؟",
    options: [
      { en: "To cool them down", ar: "لتبريدها", correct: false },
      { en: "To make sure they are working properly", ar: "للتأكد من أنها تعمل بشكل صحيح", correct: true },
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false }
    ],
    keywords: [
      { term: "brakes", ar: "الفرامل", explainAr: "نظام إيقاف السيارة." },
      { term: "water", ar: "الماء", explainAr: "المياه قد تؤثر على فعالية الفرامل." },
      { term: "effectiveness", ar: "الفعالية", explainAr: "قدرة الفرامل على العمل بشكل صحيح." }
    ]
  },

  {
    id: "SV-6308",
    topic: "safety-vehicle",
    promptEn: "What could indicate a fault in your steering system?",
    promptAr: "ما الذي قد يدل على وجود خلل في نظام التوجيه؟",
    options: [
      { en: "Heavier than normal steering", ar: "توجيه أثقل من المعتاد", correct: true },
      { en: "Brighter headlights", ar: "أضواء أمامية أقوى", correct: false },
      { en: "Improved fuel economy", ar: "تحسن اقتصاد الوقود", correct: false },
      { en: "Quieter engine noise", ar: "محرك أكثر هدوءًا", correct: false }
    ],
    keywords: [
      { term: "steering fault", ar: "خلل في التوجيه", explainAr: "مشكلة في نظام توجيه السيارة." },
      { term: "heavy steering", ar: "توجيه ثقيل", explainAr: "صعوبة في تحريك عجلة القيادة." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه السيارة." }
    ]
  },

  {
    id: "SV-6309",
    topic: "safety-vehicle",
    promptEn: "Why should windscreens and windows be kept clean?",
    promptAr: "لماذا يجب إبقاء الزجاج الأمامي والنوافذ نظيفة؟",
    options: [
      { en: "To reduce glare and improve visibility", ar: "لتقليل الوهج وتحسين الرؤية", correct: true },
      { en: "To improve heating efficiency", ar: "لتحسين كفاءة التدفئة", correct: false },
      { en: "To protect paintwork", ar: "لحماية الطلاء", correct: false },
      { en: "To prevent engine damage", ar: "لمنع تلف المحرك", correct: false }
    ],
    keywords: [
      { term: "windscreen", ar: "الزجاج الأمامي", explainAr: "الزجاج الأمامي للسيارة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على الرؤية بوضوح." },
      { term: "glare", ar: "الوهج", explainAr: "الضوء الساطع الذي يزعج الرؤية." }
    ]
  },

  {
    id: "SV-6310",
    topic: "safety-vehicle",
    promptEn: "What is the safest action if your vehicle pulls to one side when braking?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا انحرفت المركبة إلى جهة واحدة عند الفرملة؟",
    options: [
      { en: "Brake harder to correct it", ar: "الضغط أكثر على الفرامل", correct: false },
      { en: "Have the braking system checked as soon as possible", ar: "فحص نظام الفرامل بأسرع وقت ممكن", correct: true },
      { en: "Ignore it if it stops straight", ar: "تجاهله إذا توقفت مستقيمة", correct: false },
      { en: "Reduce tyre pressure", ar: "خفض ضغط الإطارات", correct: false }
    ],
    keywords: [
      { term: "braking fault", ar: "خلل في الفرامل", explainAr: "مشكلة في نظام الفرامل." },
      { term: "vehicle pulls", ar: "انحراف المركبة", explainAr: "انحراف السيارة إلى جانب عند الفرملة." },
      { term: "safety check", ar: "فحص الأمان", explainAr: "فحص المركبة للتأكد من سلامتها." }
    ]
  },

  // --- INCIDENTS (EXTRA) ---

  {
    id: "IN-09",
    topic: "incidents",
    promptEn: "You are involved in a minor collision with another vehicle. No one is injured. What must you do?",
    promptAr: "تعرضت لحادث بسيط مع مركبة أخرى، دون إصابات. ماذا يجب عليك أن تفعل؟",
    options: [
      { en: "Stop and exchange name, address, and details", ar: "تتوقف وتتبادل الاسم والعنوان والتفاصيل", correct: true },
      { en: "Drive away if the damage is small", ar: "تغادر إذا كان الضرر بسيطاً", correct: false },
      { en: "Only report it to your insurance later", ar: "تخبر شركة التأمين لاحقاً فقط", correct: false },
      { en: "Ignore it if the other driver seems calm", ar: "تتجاهل الحادث إذا بدا السائق الآخر هادئاً", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-10",
    topic: "incidents",
    promptEn: "If someone is injured in a collision, what must you do at the scene?",
    promptAr: "إذا أصيب شخص في حادث تصادم، ماذا يجب أن تفعل في مكان الحادث؟",
    options: [
      { en: "Call the emergency services and give details", ar: "تتصل بالطوارئ وتقدم التفاصيل", correct: true },
      { en: "Move the injured person immediately", ar: "تنقل المصاب فوراً", correct: false },
      { en: "Give them something to eat", ar: "تعطيه شيئاً ليأكله", correct: false },
      { en: "Offer them cigarettes to calm them", ar: "تعطيه سيجارة لتهدئته", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-11",
    topic: "incidents",
    promptEn: "What should you do if fuel has spilled on the road after an incident?",
    promptAr: "ماذا يجب أن تفعل إذا انسكب الوقود على الطريق بعد حادث؟",
    options: [
      { en: "Warn other road users and call emergency services", ar: "تحذر مستخدمي الطريق وتتصل بالطوارئ", correct: true },
      { en: "Light a cigarette away from it", ar: "تشعل سيجارة بعيداً عن ذلك", correct: false },
      { en: "Ignore it if traffic is light", ar: "تتجاهله إذا كانت حركة المرور خفيفة", correct: false },
      { en: "Wash it away with water", ar: "تحاول غسله بالماء", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-12",
    topic: "incidents",
    promptEn: "Why is it dangerous to place a warning triangle on a motorway?",
    promptAr: "لماذا يعتبر وضع مثلث التحذير على الطريق السريع أمراً خطيراً؟",
    options: [
      { en: "Because you would have to walk on the motorway", ar: "لأنك تضطر للمشي على الطريق السريع", correct: true },
      { en: "Because it confuses drivers", ar: "لأنه يربك السائقين", correct: false },
      { en: "Because motorways have better lighting", ar: "لأن الطرق السريعة مضيئة بشكل أفضل", correct: false },
      { en: "Because it is not visible at high speeds", ar: "لأنه غير مرئي عند السرعات العالية", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-13",
    topic: "incidents",
    promptEn: "You witness a collision but are not involved. What should you do?",
    promptAr: "شهدت حادث تصادم دون أن تكون طرفاً فيه. ماذا يجب أن تفعل؟",
    options: [
      { en: "Stop safely and offer help if you can", ar: "تتوقف بأمان وتعرض المساعدة إن كنت قادراً", correct: true },
      { en: "Drive away quickly to avoid delay", ar: "تغادر بسرعة لتجنب التأخير", correct: false },
      { en: "Take photos and leave", ar: "تلتقط صوراً وتغادر", correct: false },
      { en: "Block the road to stop traffic", ar: "تغلق الطريق لإيقاف الحركة", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-14",
    topic: "incidents",
    promptEn: "Why should you not remove a motorcyclist's helmet if they are injured?",
    promptAr: "لماذا لا يجب إزالة خوذة سائق الدراجة النارية إذا كان مصاباً؟",
    options: [
      { en: "You may cause more injury, especially to the neck", ar: "قد تسبب له إصابة أكبر، خاصة في الرقبة", correct: true },
      { en: "The helmet is not important", ar: "لأن الخوذة ليست مهمة", correct: false },
      { en: "They will remove it themselves", ar: "لأنهم سيزيلونها بأنفسهم", correct: false },
      { en: "The police must do it", ar: "الشرطة فقط تزيلها", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-15",
    topic: "incidents",
    promptEn: "If you are the first person to arrive at a crash involving dangerous goods (like tanker trucks), what should you do?",
    promptAr: "إذا كنت أول من يصل لحادث يشمل مواد خطرة (مثل شاحنة صهريج)، ماذا يجب أن تفعل؟",
    options: [
      { en: "Keep well away and call emergency services immediately", ar: "تبتعد لمسافة آمنة وتتصل بالطوارئ فوراً", correct: true },
      { en: "Approach and try to move containers", ar: "تقترب وتحاول تحريك الحاويات", correct: false },
      { en: "Ignore it if there is no fire", ar: "تتجاهله إذا لم يكن هناك حريق", correct: false },
      { en: "Smoke a cigarette away from the scene", ar: "تشعل سيجارة بعيداً قليلاً عن المكان", correct: false }
    ],
    keywords: []
  },

  {
    id: "IN-16",
    topic: "incidents",
    promptEn: "Why should you switch off vehicle engines at an accident scene if possible?",
    promptAr: "لماذا يجب إطفاء محركات المركبات في موقع الحادث إن أمكن؟",
    options: [
      { en: "To reduce the risk of fire", ar: "لتقليل خطر الحريق", correct: true },
      { en: "To reduce traffic noise", ar: "لتقليل ضوضاء المرور", correct: false },
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To prevent flat batteries", ar: "لمنع نفاد البطارية", correct: false }
    ],
    keywords: [
      { term: "engine off", ar: "إطفاء المحرك", explainAr: "إيقاف تشغيل محرك المركبة لتقليل المخاطر." },
      { term: "fire risk", ar: "خطر الحريق", explainAr: "احتمالية اندلاع حريق بسبب الوقود أو الأبخرة." }
    ]
  },

  // --- GENERAL / MIXED THEORY ---

  {
    id: "GN-01",
    topic: "general",
    promptEn: "What is the normal national speed limit on a single carriageway road for cars and motorcycles?",
    promptAr: "ما هو حد السرعة الوطني الطبيعي على طريق بمسار واحد لكل اتجاه للسيارات والدراجات النارية؟",
    options: [
      { en: "60 mph", ar: "٦٠ ميل/ساعة", correct: true },
      { en: "50 mph", ar: "٥٠ ميل/ساعة", correct: false },
      { en: "70 mph", ar: "٧٠ ميل/ساعة", correct: false },
      { en: "40 mph", ar: "٤٠ ميل/ساعة", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-02",
    topic: "general",
    promptEn: "In which of these situations should you use your headlights during the day?",
    promptAr: "في أي من هذه الحالات يجب استخدام أضواء السيارة أثناء النهار؟",
    options: [
      { en: "When visibility is poor, such as in heavy rain", ar: "عند ضعف الرؤية مثل المطر الغزير", correct: true },
      { en: "On a bright sunny day", ar: "في يوم مشمس جداً", correct: false },
      { en: "Only when parked", ar: "فقط عند ركن السيارة", correct: false },
      { en: "When driving slowly in a car park", ar: "عند القيادة ببطء في موقف سيارات", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-03",
    topic: "general",
    promptEn: "What should you do before starting a long journey at night?",
    promptAr: "ماذا يجب أن تفعل قبل بدء رحلة طويلة ليلاً؟",
    options: [
      { en: "Make sure you are well rested", ar: "تتأكد أنك حصلت على راحة كافية", correct: true },
      { en: "Drink a lot of coffee and energy drinks", ar: "تشرب كمية كبيرة من القهوة ومشروبات الطاقة", correct: false },
      { en: "Rely on loud music to keep you awake", ar: "تعتمد على الموسيقى العالية حتى لا تنام", correct: false },
      { en: "Drive faster to finish earlier", ar: "تقود بسرعة أكبر لتنهي مبكراً", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-04",
    topic: "general",
    promptEn: "Why is it important to keep your distance from the vehicle in front?",
    promptAr: "لماذا من المهم أن تحافظ على مسافة بينك وبين المركبة أمامك؟",
    options: [
      { en: "To allow time to react and stop if needed", ar: "لتسمح لنفسك بوقت كافٍ للاستجابة والتوقف عند الحاجة", correct: true },
      { en: "To make other drivers overtake you", ar: "ليتجاوزك الآخرون", correct: false },
      { en: "To improve fuel consumption", ar: "لتحسين استهلاك الوقود", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-05",
    topic: "general",
    promptEn: "At a pelican crossing with flashing amber lights, what must you do?",
    promptAr: "في معبر مشاة من نوع Pelican بإشارة كهرمانية وامضة، ماذا يجب أن تفعل؟",
    options: [
      { en: "Give way to pedestrians already on the crossing", ar: "تفسح الطريق للمشاة الذين على المعبر", correct: true },
      { en: "Drive through if you are in a hurry", ar: "تعبر إذا كنت مستعجلاً", correct: false },
      { en: "Sound your horn at pedestrians", ar: "تستخدم البوق تجاه المشاة", correct: false },
      { en: "Flash your headlights at pedestrians", ar: "تومض الأضواء للمشاة", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-06",
    topic: "general",
    promptEn: "What is the safest way to deal with a blind corner on a narrow road?",
    promptAr: "ما الطريقة الأكثر أماناً للتعامل مع منعطف أعمى على طريق ضيق؟",
    options: [
      { en: "Slow down and keep to your side", ar: "تخفف السرعة وتبقى في جانبك من الطريق", correct: true },
      { en: "Drive in the middle of the road", ar: "تقود في منتصف الطريق", correct: false },
      { en: "Sound your horn continuously", ar: "تستخدم البوق باستمرار", correct: false },
      { en: "Speed up briefly then brake", ar: "تزيد السرعة قليلاً ثم تفرمل", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-07",
    topic: "general",
    promptEn: "Why is it important to adjust your driving style in bad weather?",
    promptAr: "لماذا من المهم تعديل أسلوب القيادة في الأحوال الجوية السيئة؟",
    options: [
      { en: "Because stopping distances increase and visibility is reduced", ar: "لأن مسافة التوقف تزيد والرؤية تقل", correct: true },
      { en: "Because police don't work in bad weather", ar: "لأن الشرطة لا تعمل في الطقس السيئ", correct: false },
      { en: "Because speed limits are cancelled", ar: "لأن حدود السرعة تُلغى", correct: false },
      { en: "Because tyres are not needed", ar: "لأن الإطارات لا تهم", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-08",
    topic: "general",
    promptEn: "What is the main benefit of using mirrors properly?",
    promptAr: "ما الفائدة الرئيسية من استخدام المرايا بشكل صحيح؟",
    options: [
      { en: "To be aware of what is happening behind and around you", ar: "لتكون على علم بما يحدث خلفك وحولك", correct: true },
      { en: "To check your appearance", ar: "لتتفقد مظهرك", correct: false },
      { en: "To reduce fuel consumption", ar: "لتقليل استهلاك الوقود", correct: false },
      { en: "To adjust the radio", ar: "لتعديل الراديو", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-09",
    topic: "general",
    promptEn: "What is the main hazard when turning right from a main road into a side road?",
    promptAr: "ما الخطر الرئيسي عند الانعطاف يميناً من طريق رئيسي إلى طريق فرعي؟",
    options: [
      { en: "Oncoming traffic and pedestrians crossing", ar: "حركة المرور القادمة والمشاة الذين يعبرون", correct: true },
      { en: "Vehicles behind you only", ar: "المركبات خلفك فقط", correct: false },
      { en: "Parked cars on the side road only", ar: "السيارات المتوقفة على الطريق الفرعي فقط", correct: false },
      { en: "The surface of the side road", ar: "سطح الطريق الفرعي", correct: false }
    ],
    keywords: []
  },

  {
    id: "GN-10",
    topic: "general",
    promptEn: "When is it particularly important to check your blind spot?",
    promptAr: "متى يكون من المهم بشكل خاص فحص النقطة العمياء؟",
    options: [
      { en: "Before changing lanes or moving off", ar: "قبل تغيير المسار أو الانطلاق", correct: true },
      { en: "When driving straight on a clear road", ar: "عند القيادة بشكل مستقيم على طريق خالٍ", correct: false },
      { en: "When stopped at traffic lights", ar: "أثناء الوقوف عند الإشارة", correct: false },
      { en: "When reversing in a car park", ar: "عند الرجوع في موقف سيارات", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-01",
    topic: "hazard-awareness",
    promptEn: "Why should you reduce speed when approaching a pelican crossing with flashing amber lights?",
    promptAr: "لماذا يجب تخفيف السرعة عند الاقتراب من معبر مشاة (Pelican) بأضواء كهرمانية وامضة؟",
    options: [
      { en: "Pedestrians may still be crossing", ar: "قد يكون المشاة لا يزالون يعبرون", correct: true },
      { en: "The crossing is always clear", ar: "المعبر خالٍ دائماً", correct: false },
      { en: "Cars behind expect you to go", ar: "السيارات خلفك تتوقع أن تكمل", correct: false },
      { en: "It reduces fuel use", ar: "يقلل استهلاك الوقود", correct: false }
    ],
    keywords: []
  },


  {
    id: "MX-03",
    topic: "motorway-driving",
    promptEn: "When joining a motorway, what is your priority?",
    promptAr: "عند الانضمام للطريق السريع، ما أولويتك؟",
    options: [
      { en: "Match your speed to merge safely", ar: "مجاراة السرعة للاندماج بأمان", correct: true },
      { en: "Stop at end of slip road", ar: "التوقف في نهاية مسار الاندماج", correct: false },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-04",
    topic: "alertness",
    promptEn: "What is the main risk of adjusting the radio while driving?",
    promptAr: "ما الخطر الرئيسي عند تعديل الراديو أثناء القيادة؟",
    options: [
      { en: "It distracts you from the road", ar: "يشغلك عن الطريق", correct: true },
      { en: "It drains the battery", ar: "يُضعف البطارية", correct: false },
      { en: "It improves focus", ar: "يحسن التركيز", correct: false },
      { en: "It helps passengers", ar: "يساعد الركاب", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-05",
    topic: "vulnerable-road-users",
    promptEn: "Why should you leave extra space when overtaking a cyclist?",
    promptAr: "لماذا يجب أن تترك مسافة إضافية عند تجاوز درّاج؟",
    options: [
      { en: "They may wobble or swerve suddenly", ar: "قد يفقدون التوازن أو ينحرفون فجأة", correct: true },
      { en: "They never change direction while riding", ar: "لا يغيرون اتجاههم أبداً أثناء الركوب", correct: false },
      { en: "They must always give way to cars", ar: "يجب أن يعطوا دائماً أولوية المرور للسيارات", correct: false },
      { en: "It is illegal to drive near them", ar: "من غير القانوني القيادة قربهم", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أو مستخدم طريق آخر." },
      { term: "cyclist", ar: "درّاج", explainAr: "راكب دراجة هوائية يحتاج مساحة آمنة." },
      { term: "wobble", ar: "فقدان التوازن", explainAr: "حركة غير مستقرة قد تجعل الدرّاج ينحرف." }
    ]
  },

  {
    id: "MX-06",
    topic: "hazard-awareness",
    promptEn: "What should you do in thick fog?",
    promptAr: "ماذا يجب فعله في الضباب الكثيف؟",
    options: [
      { en: "Use dipped headlights and slow down", ar: "تشغيل الأضواء المنخفضة وتخفيف السرعة", correct: true },
      { en: "Use full beam", ar: "استخدام الأضواء العالية", correct: false },
      { en: "Drive close ahead", ar: "القيادة ملاصقاً للسيارة أمامك", correct: false },
      { en: "Hazards only", ar: "تشغيل الهزارْد فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-07",
    topic: "safety-vehicle",
    promptEn: "If a tyre bursts while driving, what should you do?",
    promptAr: "ماذا تفعل إذا انفجر إطار أثناء القيادة؟",
    options: [
      { en: "Grip the steering wheel firmly and slow down gradually", ar: "تمسك المقود وتخفف تدريجياً", correct: true },
      { en: "Brake harshly", ar: "تضغط الفرامل بقوة", correct: false },
      { en: "Accelerate", ar: "تسرع", correct: false },
      { en: "Turn sharply", ar: "تلف المقود بقوة", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-08",
    topic: "alertness",
    promptEn: "Why look over your shoulder before changing lanes?",
    promptAr: "لماذا تنظر فوق كتفك قبل تغيير المسار؟",
    options: [
      { en: "To check your blind spot", ar: "للتأكد من النقطة العمياء", correct: true },
      { en: "To impress others", ar: "لإبهار الآخرين", correct: false },
      { en: "To adjust seat", ar: "لتعديل المقعد", correct: false },
      { en: "To check GPS", ar: "لفحص الخرائط", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-09",
    topic: "vulnerable-road-users",
    promptEn: "What should you expect when driving in a pedestrian-only zone?",
    promptAr: "ماذا يجب أن تتوقع عند القيادة في منطقة مخصصة للمشاة فقط؟",
    options: [
      { en: "Pedestrians may move slowly and unpredictably", ar: "قد يتحرك المشاة ببطء وبشكل غير متوقع", correct: true },
      { en: "Fast-moving vehicles will be present", ar: "ستكون هناك مركبات سريعة الحركة", correct: false },
      { en: "The roads will be wider than normal", ar: "ستكون الطرق أوسع من المعتاد", correct: false },
      { en: "There will be no pedestrians present", ar: "لن يكون هناك مشاة", correct: false }
    ],
    keywords: [
      { term: "pedestrian-only zone", ar: "منطقة مخصصة للمشاة فقط", explainAr: "منطقة مخصصة للمشاة حيث قد يُسمح بالقيادة بقيود معينة." },
      { term: "unpredictable", ar: "غير متوقع", explainAr: "سلوك قد يتغير فجأة دون تحذير." },
      { term: "pedestrians", ar: "المشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام." }
    ]
  },

  {
    id: "MX-10",
    topic: "safety-vehicle",
    promptEn: "How should you brake on a slippery road with ABS?",
    promptAr: "كيف تفرمل على طريق زلق مع ABS؟",
    options: [
      { en: "Brake firmly + let ABS work", ar: "تضغط بقوة وتترك ABS يعمل", correct: true },
      { en: "Pump brakes", ar: "تضغط الفرامل عدة مرات", correct: false },
      { en: "Avoid braking", ar: "تتجنب الفرملة", correct: false },
      { en: "Use handbrake", ar: "تستخدم فرامل اليد", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-11",
    topic: "rules-of-the-road",
    promptEn: "Approaching a sharp bend on a rural road—what do you do?",
    promptAr: "تقترب من منعطف حاد بطريق ريفي، ماذا تفعل؟",
    options: [
      { en: "Slow down before entering", ar: "تخفف قبل الدخول", correct: true },
      { en: "Brake inside bend", ar: "تفرمل داخل المنعطف", correct: false },
      { en: "Accelerate", ar: "تسرع", correct: false },
      { en: "Stay in middle", ar: "تبقى بالمنتصف", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-12",
    topic: "motorway-driving",
    promptEn: "After long motorway driving, what effect occurs?",
    promptAr: "بعد قيادة طويلة على الطريق السريع، ما التأثير الشائع؟",
    options: [
      { en: "Feel slower than actual", ar: "تشعر أنك أبطأ مما أنت فعلاً", correct: true },
      { en: "Drive faster", ar: "تقود أسرع", correct: false },
      { en: "Brake failure", ar: "الفرامل تتوقف", correct: false },
      { en: "Better vision", ar: "رؤية أفضل", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-13",
    topic: "hazard-awareness",
    promptEn: "In a narrow street with parked cars—what first?",
    promptAr: "شارع ضيق مع سيارات متوقفة—ماذا تفعل أولاً؟",
    options: [
      { en: "Slow & prepare to stop", ar: "تخفف وتستعد للتوقف", correct: true },
      { en: "Flash headlights", ar: "تومض بالأضواء", correct: false },
      { en: "Drive in middle", ar: "تقود في المنتصف", correct: false },
      { en: "Sound horn", ar: "تستخدم البوق", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-14",
    topic: "alertness",
    promptEn: "What shows slower reaction time?",
    promptAr: "ما علامة أن زمن استجابتك أصبح أبطأ؟",
    options: [
      { en: "Braking later", ar: "التوقف متأخراً", correct: true },
      { en: "Driving faster", ar: "القيادة أسرع", correct: false },
      { en: "Sharper vision", ar: "رؤية أوضح", correct: false },
      { en: "More confidence", ar: "ثقة أعلى", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-15",
    topic: "safety-vehicle",
    promptEn: "Smoke from bonnet—what do you do?",
    promptAr: "يظهر دخان من غطاء المحرك، ماذا تفعل؟",
    options: [
      { en: "Stop, turn off engine, move away", ar: "تتوقف، تطفئ، وتبتعد", correct: true },
      { en: "Drive faster", ar: "تسرع", correct: false },
      { en: "Open bonnet", ar: "تفتح الغطاء", correct: false },
      { en: "Pour water", ar: "ترش الماء", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-16",
    topic: "vulnerable-road-users",
    promptEn: "When approaching a roundabout, where should you expect cyclists to position themselves?",
    promptAr: "عند الاقتراب من دوار، أين يجب أن تتوقع أن يضع راكبو الدراجات أنفسهم؟",
    options: [
      { en: "They may be in the centre of the lane or taking the full lane for safety", ar: "قد يكونون في منتصف المسار أو يشغلون المسار بالكامل للأمان", correct: true },
      { en: "They will always stay close to the left-hand kerb", ar: "سيبقون دائماً قريبين من الرصيف الأيسر", correct: false },
      { en: "They must use a separate cycle lane if available", ar: "يجب أن يستخدموا مسار دراجات منفصل إن وُجد", correct: false },
      { en: "They will always give way to cars at roundabouts", ar: "سيعطون دائماً أولوية المرور للسيارات في الدوارات", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث قد يشغل الدرّاجون المسار بالكامل للأمان." },
      { term: "cyclist positioning", ar: "موضع الدرّاج", explainAr: "الدرّاجون قد يشغلون المسار بالكامل لتجنب التجاوز غير الآمن." },
      { term: "lane", ar: "مسار", explainAr: "المسار الذي يسير فيه المركبات أو الدرّاجون." }
    ]
  },

  {
    id: "MX-17",
    topic: "hazard-awareness",
    promptEn: "What increases aquaplaning risk?",
    promptAr: "ما يزيد خطر الانزلاق فوق الماء؟",
    options: [
      { en: "High speed in heavy rain", ar: "سرعة عالية مع مطر غزير", correct: true },
      { en: "Driving slowly", ar: "القيادة ببطء", correct: false },
      { en: "Warm tyres", ar: "إطارات دافئة", correct: false },
      { en: "Clean road", ar: "طريق نظيف", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-18",
    topic: "rules-of-the-road",
    promptEn: "Why avoid overtaking near junctions?",
    promptAr: "لماذا تجنب التجاوز قرب التقاطعات؟",
    options: [
      { en: "A vehicle may emerge", ar: "قد تظهر مركبة فجأة", correct: true },
      { en: "Always safe", ar: "دائماً آمن", correct: false },
      { en: "Fuel efficiency", ar: "توفير وقود", correct: false },
      { en: "Better visibility", ar: "رؤية أفضل", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-19",
    topic: "rules-of-the-road",
    promptEn: "Corner too fast—what happens?",
    promptAr: "ماذا يحدث عند أخذ منعطف بسرعة عالية؟",
    options: [
      { en: "Car may skid outward", ar: "قد تنزلق السيارة للخارج", correct: true },
      { en: "Better stability", ar: "ثبات أفضل", correct: false },
      { en: "Saves fuel", ar: "يوفر الوقود", correct: false },
      { en: "Improves grip", ar: "يحسن التماسك", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-20",
    topic: "vulnerable-road-users",
    promptEn: "You are approaching a zebra crossing that has a central island dividing it into two parts. How should you treat this crossing?",
    promptAr: "أنت تقترب من ممر مشاة (زِيبرا) فيه جزيرة وسطية تقسمه إلى جزئين. كيف يجب أن تتعامل مع هذا الممر؟",
    options: [
      { en: "Treat each part as a separate crossing and give way to pedestrians on your side", ar: "تعامل مع كل جزء كمعبر منفصل وأعطِ أولوية المرور للمشاة على جانبك", correct: true },
      { en: "Only give way if pedestrians are on both sides", ar: "أعطِ أولوية المرور فقط إذا كان المشاة على كلا الجانبين", correct: false },
      { en: "You have priority because of the central island", ar: "لديك أولوية المرور بسبب الجزيرة الوسطية", correct: false },
      { en: "Sound your horn to warn pedestrians before crossing", ar: "استخدم البوق لتحذير المشاة قبل العبور", correct: false }
    ],
    keywords: [
      { term: "zebra crossing", ar: "ممر مشاة (زِيبرا)", explainAr: "ممر مشاة بخطوط بيضاء." },
      { term: "central island", ar: "جزيرة وسطية", explainAr: "منطقة آمنة في منتصف الممر تقسمه إلى جزئين." },
      { term: "separate crossing", ar: "معبر منفصل", explainAr: "كل جزء من الممر يُعتبر معبراً مستقلاً." }
    ]
  },

  {
    id: "MX-21",
    topic: "hazard-awareness",
    promptEn: "Herd animals crossing—what do you do?",
    promptAr: "قطيع حيوانات يعبر الطريق—ماذا تفعل؟",
    options: [
      { en: "Stop and wait", ar: "تتوقف وتنتظر", correct: true },
      { en: "Horn", ar: "بوق", correct: false },
      { en: "Drive between", ar: "تعبر بينهم", correct: false },
      { en: "Flash lights", ar: "وميض الأضواء", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-22",
    topic: "rules-of-the-road",
    promptEn: "Blue circular sign with bicycle symbol means:",
    promptAr: "دائرة زرقاء عليها دراجة هوائية تعني:",
    options: [
      { en: "Cycle-only route", ar: "مسار للدراجات فقط", correct: true },
      { en: "No cycling", ar: "ممنوع الدراجات", correct: false },
      { en: "Shared lane", ar: "مسار مشترك", correct: false },
      { en: "Parking", ar: "موقف", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-23",
    topic: "safety-vehicle",
    promptEn: "When ABS activates?",
    promptAr: "متى يعمل نظام ABS؟",
    options: [
      { en: "When wheels begin locking", ar: "عندما تبدأ العجلات بالانغلاق", correct: true },
      { en: "High speed only", ar: "فقط عند السرعة العالية", correct: false },
      { en: "Cornering", ar: "أثناء الانعطاف", correct: false },
      { en: "Dry roads only", ar: "الطرق الجافة فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-24",
    topic: "safety-vehicle",
    promptEn: "Wipers fail in heavy rain—what do you do?",
    promptAr: "تعطلت ماسحات المطر—ماذا تفعل؟",
    options: [
      { en: "Pull over safely", ar: "تتوقف بأمان", correct: true },
      { en: "Continue slowly", ar: "تكمل ببطء", correct: false },
      { en: "Hazards only", ar: "الهزارْد فقط", correct: false },
      { en: "Speed up", ar: "تسرع", correct: false }
    ],
    keywords: []
  },

  {
    id: "MX-25",
    topic: "rules-of-the-road",
    promptEn: "When to dip headlights at night?",
    promptAr: "متى تخفض الأضواء ليلاً؟",
    options: [
      { en: "When another user approaches", ar: "عندما يقترب مستخدم طريق آخر", correct: true },
      { en: "Always use high beam", ar: "دائماً الأضواء العالية", correct: false },
      { en: "Only in cities", ar: "فقط في المدن", correct: false },
      { en: "When following a bus", ar: "خلف الحافلات", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-2001",
    topic: "road-signs",
    promptEn: "You see an upside-down triangular sign with a red border at a junction. What does it mean?",
    promptAr: "ترى علامة مثلثة مقلوبة ذات إطار أحمر عند تقاطع. ماذا تعني؟",
    image: "/theory-images/signs/signs_q022_give-way-junction.png",
    options: [
      { en: "You must stop and switch off the engine", ar: "يجب أن تتوقف وتطفئ المحرك", correct: false },
      { en: "You have priority over traffic on the main road", ar: "لديك أولوية المرور على الطريق الرئيسي", correct: false },
      { en: "You must give way to traffic on the main road", ar: "يجب أن تفسح الطريق لحركة المرور على الطريق الرئيسي", correct: true },
      { en: "No vehicles are allowed to enter the junction", ar: "لا يُسمح لأي مركبات بدخول التقاطع", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-2002",
    topic: "road-signs",
    promptEn: "What does an octagonal red sign with the word 'STOP' tell you to do?",
    promptAr: "ماذا تطلب منك علامة حمراء ثُمانية الشكل مكتوب عليها كلمة 'STOP'؟",
    image: "/theory-images/signs/signs_q023_stop.png",
    options: [
      { en: "Slow down and continue if the road looks clear", ar: "خفف السرعة وتابع إذا بدا الطريق خالياً", correct: false },
      { en: "Stop only if there are pedestrians crossing", ar: "تتوقف فقط إذا كان هناك مشاة يعبرون", correct: false },
      { en: "Stop and give way only to vehicles from the left", ar: "تتوقف وتفسح الطريق فقط للمركبات القادمة من اليسار", correct: false },
      { en: "Stop completely at the stop line before proceeding", ar: "تتوقف توقفاً تاماً عند خط التوقف قبل المتابعة", correct: true }
    ],
    keywords: []
  },

  {
    id: "RS-2003",
    topic: "road-signs",
    promptEn: "You approach a red circular sign with a white horizontal bar. What does this sign mean?",
    promptAr: "تقترب من علامة دائرية حمراء بداخلها شريط أبيض أفقي. ماذا تعني هذه العلامة؟",
    image: "/theory-images/signs/signs_q024_no-entry.png",
    options: [
      { en: "No entry for vehicles", ar: "ممنوع دخول المركبات", correct: true },
      { en: "No stopping at any time", ar: "ممنوع التوقف في أي وقت", correct: false },
      { en: "End of restrictions", ar: "نهاية القيود", correct: false },
      { en: "Two-way traffic ahead", ar: "حركة مرور باتجاهين أمامك", correct: false }
    ],
    keywords: []
  },



  {
    id: "RS-2006",
    topic: "road-signs",
    promptEn: "You see a circular sign with a red border showing '30'. What does it mean?",
    promptAr: "ترى علامة دائرية ذات إطار أحمر وبداخلها الرقم 30. ماذا تعني؟",
    options: [
      { en: "Minimum speed is 30 mph", ar: "السرعة الدنيا هي 30 ميل/ساعة", correct: false },
      { en: "Recommended speed is 30 mph", ar: "السرعة الموصى بها هي 30 ميل/ساعة", correct: false },
      { en: "Maximum speed is 30 mph", ar: "السرعة القصوى هي 30 ميل/ساعة", correct: true },
      { en: "Average speed must be 30 mph", ar: "يجب أن تكون السرعة المتوسطة 30 ميل/ساعة", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q007_speed-limit-30.png"
  },



  {
    id: "RS-2009",
    topic: "road-signs",
    promptEn: "What does this warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية؟",
    image: "/theory-images/signs/signs_q027_zebra-crossing-warning.png",
    options: [
      { en: "Zebra crossing ahead", ar: "معبر مشاة (زِيبرا) أمامك", correct: true },
      { en: "Pedestrian-only zone", ar: "منطقة مخصصة للمشاة فقط", correct: false },
      { en: "Traffic lights ahead", ar: "إشارات ضوئية أمامك", correct: false },
      { en: "School entrance only", ar: "مدخل مدرسة فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-2010",
    topic: "road-signs",
    promptEn: "What does this warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية؟",
    image: "/theory-images/signs/signs_q028_double-bend-first-left-warning.png",
    options: [
      { en: "Double bend ahead, first to the left", ar: "منعطفان متتاليان، الأول إلى اليسار", correct: true },
      { en: "Road narrows on the left", ar: "الطريق يضيق من اليسار", correct: false },
      { en: "Sharp right turn only", ar: "انعطاف حاد إلى اليمين فقط", correct: false },
      { en: "Slippery road ahead", ar: "طريق زلق أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-2011",
    topic: "road-signs",
    promptEn: "What does a blue circular sign with a red border and a single red diagonal line mean?",
    promptAr: "ماذا تعني إشارة دائرية زرقاء ذات إطار أحمر وخط أحمر مائل واحد؟",
    image: "/theory-images/signs/signs_q029_no-parking.png",
    options: [
      { en: "No parking", ar: "ممنوع الوقوف", correct: true },
      { en: "No stopping at any time", ar: "ممنوع التوقف في أي وقت", correct: false },
      { en: "Parking is permitted", ar: "الوقوف مسموح", correct: false },
      { en: "End of parking restrictions", ar: "نهاية قيود الوقوف", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-2012",
    topic: "road-signs",
    promptEn: "You're driving through a forest area at dusk and see a triangular warning sign showing a deer. What hazard should you be alert for?",
    promptAr: "أنت تقود في منطقة غابات عند الغسق وترى علامة تحذير مثلثة تُظهر غزالاً. ما الخطر الذي يجب أن تكون منتبهاً له؟",
    image: "/theory-images/signs/signs_q029_wild-animals.png",
    options: [
      { en: "Wild animals may suddenly appear and cross the road", ar: "قد تظهر حيوانات برية فجأة وتعبر الطريق", correct: true },
      { en: "A wildlife park entrance is ahead", ar: "مدخل حديقة حيوانات برية أمامك", correct: false },
      { en: "Only farm vehicles are allowed on this road", ar: "المركبات الزراعية فقط مسموحة على هذا الطريق", correct: false },
      { en: "A hunting area is ahead", ar: "منطقة صيد أمامك", correct: false }
    ],
    keywords: [
      { term: "wild animals", ar: "حيوانات برية", explainAr: "الحيوانات البرية قد تظهر فجأة على الطريق خاصة عند الفجر والغسق." }
    ]
  },

  {
    id: "RS-2013",
    topic: "road-signs",
    promptEn: "What does a red circular sign with a white background and a horn symbol crossed out mean?",
    promptAr: "ماذا تعني علامة دائرية حمراء بخلفية بيضاء وبداخلها بوق مشطوب؟",
    image: "/theory-images/signs/signs_q030_no-sounding-horn.png",
    options: [
      { en: "Use your horn only in emergencies", ar: "استخدم البوق فقط في حالات الطوارئ", correct: false },
      { en: "No sounding of horns", ar: "ممنوع استخدام البوق", correct: true },
      { en: "Quiet zone ahead", ar: "منطقة هادئة أمامك", correct: false },
      { en: "Horn recommended in this area", ar: "يُنصح باستخدام البوق في هذه المنطقة", correct: false }
    ],
    keywords: []
  },


  {
    id: "RS-2015",
    topic: "road-signs",
    promptEn: "You're approaching a bridge and see a triangular warning sign showing the road narrowing on both sides. What should you prepare for?",
    promptAr: "أنت تقترب من جسر وترى علامة تحذير مثلثة تُظهر أن الطريق يضيق من الجانبين. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q031_road-narrow.png",
    options: [
      { en: "Reduced road width requiring slower speed and extra caution", ar: "عرض طريق مقلص يتطلب سرعة أقل وحذراً إضافياً", correct: true },
      { en: "You should speed up to pass through quickly", ar: "يجب أن تسرع للمرور بسرعة", correct: false },
      { en: "You can use the centre of the road", ar: "يمكنك استخدام منتصف الطريق", correct: false },
      { en: "Overtake vehicles before reaching the narrow section", ar: "تجاوز المركبات قبل الوصول للقسم الضيق", correct: false }
    ],
    keywords: [
      { term: "narrowing", ar: "تضييق", explainAr: "عندما يصبح الطريق أضيق من كلا الجانبين." }
    ]
  },
  {
    id: "RS-2016",
    topic: "road-signs",
    promptEn: "You see a blue rectangular sign with a white motorway symbol. What does this sign indicate?",
    promptAr: "ترى علامة مستطيلة زرقاء عليها رمز الطريق السريع باللون الأبيض. ماذا تشير هذه العلامة؟",
    image: "/theory-images/signs/signs_q032_motorway-ahead.png",
    options: [
      { en: "End of motorway", ar: "نهاية الطريق السريع", correct: false },
      { en: "Motorway ahead", ar: "طريق سريع أمامك", correct: true },
      { en: "Dual carriageway ahead", ar: "طريق مزدوج أمامك", correct: false },
      { en: "Service area ahead", ar: "منطقة خدمات أمامك", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2017",
    topic: "road-signs",
    promptEn: "What does a broken white line across the road at a junction mean?",
    promptAr: "ماذا يعني وجود خط أبيض متقطع عبر الطريق عند تقاطع؟",
    image: "/theory-images/signs/signs_q033_broken-white-line-junction.png",
    options: [
      { en: "You must stop completely", ar: "يجب أن تتوقف توقفاً تاماً", correct: false },
      { en: "You must give way if necessary", ar: "يجب أن تفسح الطريق إذا لزم الأمر", correct: true },
      { en: "Overtaking is not allowed", ar: "ممنوع التجاوز", correct: false },
      { en: "Parking is prohibited", ar: "ممنوع الوقوف", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2018",
    topic: "road-signs",
    promptEn: "A blue circular sign shows a white arrow pointing straight ahead. What does it mean?",
    promptAr: "تُظهر علامة دائرية زرقاء سهماً أبيض يشير إلى الأمام. ماذا تعني؟",
    image: "/theory-images/signs/signs_q034_straight-ahead-onl.png",
    options: [
      { en: "You must go straight ahead only", ar: "يجب أن تسير إلى الأمام فقط", correct: true },
      { en: "No entry straight ahead", ar: "ممنوع السير إلى الأمام", correct: false },
      { en: "Traffic ahead must turn left", ar: "يجب على المرور أمامك الانعطاف يساراً", correct: false },
      { en: "Road ends ahead", ar: "نهاية الطريق أمامك", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2020",
    topic: "road-signs",
    promptEn: "A warning sign shows a hump in the road. What should you expect?",
    promptAr: "تُظهر علامة تحذير وجود مطب في الطريق. ماذا يجب أن تتوقع؟",
    image: "/theory-images/signs/signs_q035_speed-humps-ahead.png",
    options: [
      { en: "A steep hill ahead", ar: "منحدر حاد أمامك", correct: false },
      { en: "Speed humps ahead", ar: "مطبات سرعة أمامك", correct: true },
      { en: "Uneven road surface only in wet weather", ar: "سطح طريق غير مستوٍ فقط في الطقس الماطر", correct: false },
      { en: "Road closed ahead", ar: "الطريق مغلق أمامك", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2022",
    topic: "road-signs",
    promptEn: "What does a circular sign with a red border and a motorcycle symbol indicate?",
    promptAr: "ماذا تعني علامة دائرية ذات إطار أحمر وبداخلها رمز دراجة نارية؟",
    image: "/theory-images/signs/signs_q036_no-motorcycles.png",
    options: [
      { en: "Motorcycles only", ar: "الدراجات النارية فقط", correct: false },
      { en: "No motorcycles allowed", ar: "ممنوع مرور الدراجات النارية", correct: true },
      { en: "End of motorcycle restriction", ar: "نهاية قيود الدراجات النارية", correct: false },
      { en: "Motorcycle route recommended", ar: "مسار مُوصى به للدراجات النارية", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2023",
    topic: "road-signs",
    promptEn: "A sign shows a red circle with a white background and a lorry symbol. What does it mean?",
    promptAr: "تُظهر علامة دائرة حمراء بخلفية بيضاء ورمز شاحنة. ماذا تعني؟",
    image: "/theory-images/signs/signs_q037_no-goods-vehicles.png",
    options: [
      { en: "Lorries must use this route", ar: "يجب على الشاحنات استخدام هذا الطريق", correct: false },
      { en: "No goods vehicles allowed", ar: "ممنوع مرور مركبات البضائع", correct: true },
      { en: "End of goods vehicle restriction", ar: "نهاية قيود مركبات البضائع", correct: false },
      { en: "Heavy vehicles only", ar: "مركبات ثقيلة فقط", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2024",
    topic: "road-signs",
    promptEn: "You see a blue sign showing a white arrow pointing both left and right. What does this mean?",
    promptAr: "ترى علامة زرقاء تُظهر سهماً أبيض يشير إلى اليمين واليسار. ماذا تعني؟",
    image: "/theory-images/signs/signs_q038_turn-left-or-right.png",
    options: [
      { en: "You must turn either left or right", ar: "يجب أن تنعطف إما يميناً أو يساراً", correct: true },
      { en: "No U-turns allowed", ar: "ممنوع الالتفاف", correct: false },
      { en: "Two-way traffic ahead", ar: "حركة مرور باتجاهين أمامك", correct: false },
      { en: "Road narrows on both sides", ar: "الطريق يضيق من الجانبين", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2025",
    topic: "road-signs",
    promptEn: "You see a hatched area with diagonal white lines bordered by broken white lines. What does this mean and when can you enter it?",
    promptAr: "ترى منطقة مظللة بخطوط بيضاء مائلة محاطة بخطوط بيضاء متقطعة. ماذا يعني هذا ومتى يمكنك دخولها؟",
    image: "/theory-images/signs/signs_q039_hatched-area-broken-lines.png",
    options: [
      { en: "Never enter - it separates traffic lanes", ar: "لا تدخل أبدًا - تفصل بين مسارات المرور", correct: false },
      { en: "Enter only if necessary and safe, and only if the broken line is on your side", ar: "ادخل فقط إذا كان ضروريًا وآمنًا، وفقط إذا كان الخط المتقطع على جانبك", correct: true },
      { en: "Emergency vehicles only", ar: "للمركبات الطوارئ فقط", correct: false },
      { en: "Overtaking mandatory", ar: "التجاوز إلزامي", correct: false }
    ],
    keywords: [
      { term: "hatched area", ar: "منطقة مظللة", explainAr: "منطقة بخطوط مائلة تفصل بين مسارات المرور - يمكن دخولها فقط عند الضرورة والسلامة." },
      { term: "broken border", ar: "حد متقطع", explainAr: "الحد المتقطع يعني أنه يمكن دخول المنطقة إذا كان الخط المتقطع على جانبك." },
      { term: "traffic separation", ar: "فصل المرور", explainAr: "فصل مسارات المرور في اتجاهات مختلفة." }
    ]
  },
  {
    id: "RS-2026",
    topic: "road-signs",
    promptEn: "What does this circular sign with a red border and a crossed right-turn arrow mean?",
    promptAr: "ماذا تعني هذه الإشارة الدائرية ذات الإطار الأحمر والسهم المتجه لليمين وعليه خط؟",
    image: "/theory-images/signs/signs_q041_no-right-turn.png",
    options: [
      { en: "No right turn", ar: "ممنوع الانعطاف لليمين", correct: true },
      { en: "Turn right only", ar: "انعطف لليمين فقط", correct: false },
      { en: "No U-turn", ar: "ممنوع الدوران", correct: false },
      { en: "One-way road to the right", ar: "طريق باتجاه واحد إلى اليمين", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2027",
    topic: "road-signs",
    promptEn: "You're driving on a main road and see a triangular warning sign showing traffic lights. What should you prepare for?",
    promptAr: "أنت تقود على طريق رئيسي وترى علامة تحذير مثلثة تُظهر إشارات ضوئية. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q041_traffic-lights-ahead.png",
    options: [
      { en: "Traffic lights ahead that may change to red", ar: "إشارات ضوئية أمامك قد تتغير إلى الأحمر", correct: true },
      { en: "A pedestrian crossing with no lights", ar: "ممر مشاة بدون إشارات", correct: false },
      { en: "The road is closed ahead", ar: "الطريق مغلق أمامك", correct: false },
      { en: "A police checkpoint is ahead", ar: "حاجز شرطة أمامك", correct: false }
    ],
    keywords: [
      { term: "traffic lights", ar: "إشارات ضوئية", explainAr: "إشارات مرور قد تتطلب التوقف عند تغييرها إلى الأحمر." }
    ]
  },
  {
    id: "RS-2028",
    topic: "road-signs",
    promptEn: "What does a rectangular sign showing a white speed camera symbol on a blue background indicate?",
    promptAr: "ماذا تعني علامة مستطيلة تُظهر رمز كاميرا سرعة بيضاء على خلفية زرقاء؟",
    image: "/theory-images/signs/signs_q042_speed-camera.png",
    options: [
      { en: "Speed limit ends ahead", ar: "نهاية حد السرعة أمامك", correct: false },
      { en: "Average speed check zone", ar: "منطقة مراقبة سرعة متوسطة", correct: false },
      { en: "Speed camera information", ar: "معلومات عن وجود كاميرا سرعة", correct: true },
      { en: "Police speed enforcement only", ar: "مراقبة سرعة من الشرطة فقط", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2029",
    topic: "road-signs",
    promptEn: "You see a triangular warning sign showing a bicycle. What does this warn you about?",
    promptAr: "ترى علامة تحذير مثلثة تُظهر دراجة. مما تحذّرك هذه العلامة؟",
    image: "/theory-images/signs/signs_q043_cyclists-ahead.png",
    options: [
      { en: "Cycle route only", ar: "مسار مخصص للدراجات فقط", correct: false },
      { en: "Cyclists crossing or using the road", ar: "دراجون قد يعبرون الطريق أو يستخدمونه", correct: true },
      { en: "End of cycle lane", ar: "نهاية مسار الدراجات", correct: false },
      { en: "No bicycles allowed", ar: "ممنوع مرور الدراجات", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2030",
    topic: "road-signs",
    promptEn: "A blue circular sign shows a white horizontal bar. What instruction does this give?",
    promptAr: "تُظهر علامة دائرية زرقاء شريطًا أبيض أفقيًا. ماذا تطلب منك هذه العلامة؟",
    image: "/theory-images/signs/signs_q044_pass-either-side.png",
    options: [
      { en: "Pass either side to reach the same destination", ar: "المرور من أي جانب للوصول لنفس الوجهة", correct: true },
      { en: "No entry for vehicles", ar: "ممنوع دخول المركبات", correct: false },
      { en: "Road closed ahead", ar: "الطريق مغلق أمامك", correct: false },
      { en: "Keep left only", ar: "الالتزام باليسار فقط", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2031",
    topic: "road-signs",
    promptEn: "You're driving on a main road and see a triangular warning sign showing a side road joining from the left. What hazard should you anticipate?",
    promptAr: "أنت تقود على طريق رئيسي وترى علامة تحذير مثلثة تُظهر طريقاً جانبياً ينضم من اليسار. ما الخطر الذي يجب أن تتوقعه؟",
    image: "/theory-images/signs/signs_q045_side-road-joining-left.png",
    options: [
      { en: "Vehicles may emerge from the side road and join your path", ar: "قد تظهر مركبات من الطريق الجانبي وتنضم إلى مسارك", correct: true },
      { en: "Traffic from the left always has priority", ar: "المرور من اليسار له دائماً الأولوية", correct: false },
      { en: "You must overtake before the junction", ar: "يجب أن تتجاوز قبل التقاطع", correct: false },
      { en: "The road becomes one-way ahead", ar: "الطريق يصبح باتجاه واحد أمامك", correct: false }
    ],
    keywords: [
      { term: "side road", ar: "طريق جانبي", explainAr: "طريق ثانوي ينضم إلى الطريق الرئيسي وقد تظهر منه مركبات." }
    ]
  },
  {
    id: "RS-2032",
    topic: "road-signs",
    promptEn: "What does this triangular warning sign showing two arrows in opposite directions mean?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية المثلثة التي تُظهر سهمين باتجاهين متعاكسين؟",
    image: "/theory-images/signs/signs_q047_two-way-traffic-crosses-one-way.png",
    options: [
      { en: "Two-way traffic crosses a one-way road", ar: "حركة مرور باتجاهين تتقاطع مع طريق باتجاه واحد", correct: true },
      { en: "Road narrows ahead", ar: "الطريق يضيق أمامك", correct: false },
      { en: "One-way road ends", ar: "نهاية الطريق باتجاه واحد", correct: false },
      { en: "Traffic must turn right", ar: "يجب أن ينعطف المرور يميناً", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2033",
    topic: "road-signs",
    promptEn: "A circular sign with a red border shows '20'. Where is this limit commonly used?",
    promptAr: "تُظهر علامة دائرية ذات إطار أحمر الرقم 20. أين يُستخدم هذا الحد غالبًا؟",
    image: "/theory-images/signs/signs_q047_speed-limit-20.png",
    options: [
      { en: "On motorways during roadworks", ar: "على الطرق السريعة أثناء أعمال الطرق", correct: false },
      { en: "In residential or school areas", ar: "في المناطق السكنية أو قرب المدارس", correct: true },
      { en: "On rural single carriageways", ar: "على الطرق الريفية أحادية المسار", correct: false },
      { en: "At the end of dual carriageways", ar: "عند نهاية الطرق المزدوجة", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2034",
    topic: "road-signs",
    promptEn: "A blue circular sign shows white symbols of a pedestrian and a bicycle together. What does this mean?",
    promptAr: "إشارة دائرية زرقاء تُظهر رموزًا بيضاء لمشاة ودراجة معًا. ماذا تعني؟",
    image: "/theory-images/signs/signs_q048_shared-pedestrian-cycle-route.png",
    options: [
      { en: "Shared route for pedestrians and cyclists", ar: "مسار مشترك للمشاة والدراجات", correct: true },
      { en: "Cycle route only", ar: "مسار مخصص للدراجات فقط", correct: false },
      { en: "No pedestrians allowed", ar: "ممنوع مرور المشاة", correct: false },
      { en: "End of cycle lane", ar: "نهاية مسار الدراجات", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2035",
    topic: "road-signs",
    promptEn: "What does a white arrow painted on the road surface pointing left indicate?",
    promptAr: "ماذا يشير سهم أبيض مرسوم على سطح الطريق ويتجه نحو اليسار؟",
    image: "/theory-images/signs/signs_q049_road-surface-arrow-left.png",
    options: [
      { en: "You must turn left at the junction ahead", ar: "يجب أن تنعطف يسارًا عند التقاطع القادم", correct: true },
      { en: "No left turn allowed", ar: "ممنوع الانعطاف يسارًا", correct: false },
      { en: "Road narrows on the left", ar: "الطريق يضيق من اليسار", correct: false },
      { en: "Traffic from the left has priority", ar: "المرور من اليسار له أولوية", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-2036",
    topic: "road-signs",
    promptEn: "You're approaching a busy area and see a triangular warning sign showing a queue of vehicles. What should you prepare for?",
    promptAr: "أنت تقترب من منطقة مزدحمة وترى علامة تحذير مثلثة تُظهر طابوراً من المركبات. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q050_queue-of-vehicles-ahead.png",
    options: [
      { en: "Slow-moving or stationary traffic ahead requiring reduced speed", ar: "حركة مرور بطيئة أو متوقفة أمامك تتطلب تقليل السرعة", correct: true },
      { en: "A one-way traffic system ahead", ar: "نظام طريق باتجاه واحد أمامك", correct: false },
      { en: "The speed limit increases ahead", ar: "حد السرعة يزيد أمامك", correct: false },
      { en: "Roadworks are ending ahead", ar: "أعمال الطرق تنتهي أمامك", correct: false }
    ],
    keywords: [
      { term: "queue", ar: "طابور", explainAr: "صف من المركبات المتوقفة أو البطيئة التي قد تتطلب التباطؤ أو التوقف." }
    ]
  },
  {
    id: "RS-2037",
    topic: "road-signs",
    promptEn: "What does a circular sign with a red border and a weight shown in tonnes indicate?",
    promptAr: "ماذا تعني علامة دائرية ذات إطار أحمر تُظهر وزنًا بالطن؟",
    options: [
      { en: "Minimum weight required to use the road", ar: "الحد الأدنى للوزن المطلوب لاستخدام الطريق", correct: false },
      { en: "Maximum permitted vehicle weight", ar: "الحد الأقصى المسموح به لوزن المركبة", correct: true },
      { en: "Recommended weight limit only", ar: "حد وزن موصى به فقط", correct: false },
      { en: "Weight limit applies only at night", ar: "حد الوزن ينطبق فقط ليلاً", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q051_weight-limit-18t.png"
  },
  {
    id: "RS-2038",
    topic: "road-signs",
    promptEn: "You see a blue rectangular sign showing a fuel pump symbol. What does this indicate?",
    promptAr: "ترى علامة مستطيلة زرقاء تُظهر رمز مضخة وقود. ماذا تشير هذه العلامة؟",
    options: [
      { en: "Fuel station available ahead", ar: "محطة وقود متوفرة أمامك", correct: true },
      { en: "Fuel vehicles only route", ar: "طريق مخصص لمركبات الوقود فقط", correct: false },
      { en: "End of motorway services", ar: "نهاية خدمات الطريق السريع", correct: false },
      { en: "Hazardous materials ahead", ar: "مواد خطرة أمامك", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q052_fuel-station-ahead.png"
  },
  {
    id: "RS-2039",
    topic: "road-signs",
    promptEn: "You're driving on a country road and see a triangular warning sign showing the road narrowing on the right. What should you do?",
    promptAr: "أنت تقود على طريق ريفي وترى علامة تحذير مثلثة تُظهر أن الطريق يضيق من اليمين. ماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q053_road-narrows-right.png",
    options: [
      { en: "Be prepared to slow down and position your vehicle for the reduced width", ar: "كن مستعداً لتقليل السرعة ووضع مركبتك للعرض المقلص", correct: true },
      { en: "Move immediately to the right side", ar: "انتقل فوراً إلى الجانب الأيمن", correct: false },
      { en: "Overtake any slower vehicles before the narrowing", ar: "تجاوز أي مركبات أبطأ قبل التضييق", correct: false },
      { en: "Stop and wait for oncoming traffic to pass", ar: "توقف وانتظر مرور المركبات القادمة", correct: false }
    ],
    keywords: [
      { term: "road narrows", ar: "الطريق يضيق", explainAr: "الطريق يصبح أضيق مما يتطلب الحذر والتباطؤ." }
    ]
  },
  {
    id: "RS-2040",
    topic: "road-signs",
    promptEn: "What does a rectangular sign with white text on a brown background usually indicate?",
    promptAr: "ماذا تشير عادةً العلامة المستطيلة ذات الكتابة البيضاء على خلفية بنية؟",
    options: [
      { en: "Tourist attractions or places of interest", ar: "معالم سياحية أو أماكن ذات أهمية", correct: true },
      { en: "Motorway directions only", ar: "اتجاهات الطريق السريع فقط", correct: false },
      { en: "Local diversion route", ar: "طريق تحويل محلي", correct: false },
      { en: "Emergency information", ar: "معلومات طوارئ", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q054_tourist-attractions.png"
  },
  {
    id: "RS-2041",
    topic: "road-signs",
    promptEn: "You're driving in hilly countryside and see a triangular warning sign showing a steep downward slope. What should you prepare for?",
    promptAr: "أنت تقود في منطقة جبلية وترى علامة تحذير مثلثة تُظهر منحدراً شديداً إلى الأسفل. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q055_steep-hill-downward.png",
    options: [
      { en: "A steep downhill section where you'll need to control your speed carefully", ar: "منحدر شديد إلى الأسفل حيث ستحتاج للتحكم بالسرعة بعناية", correct: true },
      { en: "A steep uphill climb ahead", ar: "صعود حاد إلى الأعلى أمامك", correct: false },
      { en: "An uneven road surface only", ar: "سطح طريق غير مستوٍ فقط", correct: false },
      { en: "The end of the hill section", ar: "نهاية قسم التل", correct: false }
    ],
    keywords: [
      { term: "steep hill", ar: "منحدر حاد", explainAr: "منحدر شديد يتطلب استخدام غيار منخفض والتحكم بالسرعة." }
    ]
  },
  {
    id: "RS-2042",
    topic: "road-signs",
    promptEn: "What does a circular sign with a red border and a height shown in metres indicate?",
    promptAr: "ماذا تعني علامة دائرية ذات إطار أحمر تُظهر ارتفاعًا بالأمتار؟",
    options: [
      { en: "Minimum vehicle height required", ar: "الحد الأدنى لارتفاع المركبة المطلوب", correct: false },
      { en: "Recommended height only", ar: "ارتفاع موصى به فقط", correct: false },
      { en: "Maximum permitted vehicle height", ar: "الحد الأقصى المسموح به لارتفاع المركبة", correct: true },
      { en: "Height restriction applies at night only", ar: "قيد الارتفاع ينطبق ليلاً فقط", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q056_height-limit-2m.png"
  },
  {
    id: "RS-2043",
    topic: "road-signs",
    promptEn: "You see a blue rectangular sign showing a white telephone symbol. What does it indicate?",
    promptAr: "ترى علامة مستطيلة زرقاء تُظهر رمز هاتف أبيض. ماذا تشير هذه العلامة؟",
    options: [
      { en: "Mobile phone use permitted", ar: "مسموح استخدام الهاتف المحمول", correct: false },
      { en: "Public telephone available nearby", ar: "هاتف عمومي متوفر بالقرب", correct: true },
      { en: "Emergency vehicles only", ar: "مركبات الطوارئ فقط", correct: false },
      { en: "Police station ahead", ar: "مركز شرطة أمامك", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q057_public-telephone.png"
  },
  {
    id: "RS-2044",
    topic: "road-signs",
    promptEn: "A warning sign shows a humpback bridge. What hazard should you expect?",
    promptAr: "تُظهر علامة تحذير جسرًا مقوسًا. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Limited visibility over the bridge", ar: "رؤية محدودة فوق الجسر", correct: true },
      { en: "Slippery surface on the bridge", ar: "سطح زلق على الجسر", correct: false },
      { en: "Bridge closed to traffic", ar: "الجسر مغلق أمام المرور", correct: false },
      { en: "Low height restriction only", ar: "قيد ارتفاع منخفض فقط", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q058_humpback-bridge.png"
  },
  {
    id: "RS-2045",
    topic: "road-signs",
    promptEn: "What does a white arrow painted on the road surface pointing straight ahead indicate?",
    promptAr: "ماذا يشير السهم الأبيض المرسوم على سطح الطريق والمتجه إلى الأمام؟",
    options: [
      { en: "You must proceed straight ahead", ar: "يجب أن تسير إلى الأمام فقط", correct: true },
      { en: "No entry straight ahead", ar: "ممنوع السير إلى الأمام", correct: false },
      { en: "Road ends ahead", ar: "نهاية الطريق أمامك", correct: false },
      { en: "Traffic must turn left or right", ar: "يجب على المرور الانعطاف يمينًا أو يسارًا", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q059_road-surface-arrow-straight.png"
  },
  {
    id: "RS-2047",
    topic: "road-signs",
    promptEn: "What does a circular sign with a red border and a width shown in metres indicate?",
    promptAr: "ماذا تعني علامة دائرية ذات إطار أحمر تُظهر عرضًا بالأمتار؟",
    options: [
      { en: "Minimum road width ahead", ar: "الحد الأدنى لعرض الطريق أمامك", correct: false },
      { en: "Recommended vehicle width", ar: "عرض موصى به للمركبات", correct: false },
      { en: "Maximum permitted vehicle width", ar: "الحد الأقصى المسموح به لعرض المركبة", correct: true },
      { en: "Width restriction applies to lorries only", ar: "قيد العرض ينطبق على الشاحنات فقط", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q060_width-limit-2m.png"
  },
  {
    id: "RS-2048",
    topic: "road-signs",
    promptEn: "You see a blue rectangular sign showing a white bus symbol. What does this sign indicate?",
    promptAr: "ترى علامة مستطيلة زرقاء تُظهر رمز حافلة أبيض. ماذا تشير هذه العلامة؟",
    options: [
      { en: "Bus lane ahead", ar: "مسار حافلات أمامك", correct: true },
      { en: "Buses must stop ahead", ar: "يجب على الحافلات التوقف أمامك", correct: false },
      { en: "Bus-only road", ar: "طريق مخصص للحافلات فقط", correct: false },
      { en: "End of bus lane", ar: "نهاية مسار الحافلات", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q061_bus-lane-ahead.png"
  },
  {
    id: "RS-2049",
    topic: "road-signs",
    promptEn: "A warning sign shows a low-flying aircraft symbol. What does this warn you about?",
    promptAr: "تُظهر علامة تحذير رمز طائرة تحلّق على ارتفاع منخفض. مما تحذّرك هذه العلامة؟",
    options: [
      { en: "An airport terminal ahead", ar: "مبنى مطار أمامك", correct: false },
      { en: "Noise from low-flying aircraft", ar: "ضجيج طائرات تحلّق على ارتفاع منخفض", correct: true },
      { en: "Restricted airspace", ar: "مجال جوي مقيّد", correct: false },
      { en: "Emergency landing area", ar: "منطقة هبوط طارئ", correct: false }
    ],
    keywords: [],
    image: "/theory-images/signs/signs_q062_low-flying-aircraft.png"
  },
  {
    id: "RS-2050",
    topic: "road-signs",
    promptEn: "You see a solid white line along the left edge of the carriageway. What does this mark and how should you drive?",
    promptAr: "ترى خطًا أبيض متصلًا على الحافة اليسرى للطريق. ماذا يحدد هذا وكيف يجب أن تقود؟",
    image: "/theory-images/signs/signs_q063_solid-white-line-edge.png",
    options: [
      { en: "Edge of carriageway - stay to the right of this line", ar: "حافة الطريق - ابق على يمين هذا الخط", correct: true },
      { en: "Cycle lane - cyclists only", ar: "مسار دراجات - للدراجين فقط", correct: false },
      { en: "No overtaking zone - do not cross", ar: "منطقة ممنوع التجاوز - لا تعبر", correct: false },
      { en: "Parking area - you may park here", ar: "منطقة وقوف - يمكنك الوقوف هنا", correct: false }
    ],
    keywords: [
      { term: "edge of carriageway", ar: "حافة الطريق", explainAr: "الخط الذي يحدد حافة الجزء المخصص لحركة المركبات." },
      { term: "solid white line", ar: "خط أبيض متصل", explainAr: "خط أبيض متصل يحدد حدود الطريق." },
      { term: "carriageway", ar: "الطريق", explainAr: "جزء الطريق المخصص لحركة المركبات." }
    ]
  },

  {
    id: "RS-6001",
    topic: "road-signs",
    promptEn: "What does a triangular road sign with a red border always indicate?",
    promptAr: "ماذا تشير إليه دائمًا إشارة طريق مثلثة ذات إطار أحمر؟",
    options: [
      { en: "Information", ar: "معلومات", correct: false },
      { en: "Mandatory instruction", ar: "تعليمات إلزامية", correct: false },
      { en: "Warning of a hazard ahead", ar: "تحذير من خطر قادم", correct: true },
      { en: "Direction to a destination", ar: "اتجاه إلى وجهة", correct: false }
    ],
    keywords: [
      { term: "triangle sign", ar: "إشارة مثلثة", explainAr: "شكل إشارة التحذير الذي ينبهك إلى خطر قادم." },
      { term: "warning", ar: "تحذير", explainAr: "إشارة تنبهك إلى خطر أو حالة خطيرة على الطريق." },
      { term: "shape", ar: "شكل", explainAr: "التصميم الهندسي للإشارة الذي يساعدك على فهم معناها." }
    ],
    image: "/theory-images/signs/signs_q064_warning-triangle-general.png"
  },

  {
    id: "RS-6002",
    topic: "road-signs",
    promptEn: "What does a blue circular sign usually tell you?",
    promptAr: "ماذا تخبرك عادة الإشارة الدائرية الزرقاء؟",
    options: [
      { en: "A warning", ar: "تحذير", correct: false },
      { en: "A prohibition", ar: "منع", correct: false },
      { en: "A mandatory instruction", ar: "تعليمات إلزامية", correct: true },
      { en: "Temporary information", ar: "معلومات مؤقتة", correct: false }
    ],
    keywords: [
      { term: "blue circle", ar: "دائرة زرقاء", explainAr: "شكل ولون إشارة التعليمات الإلزامية التي يجب اتباعها." },
      { term: "mandatory", ar: "إلزامي", explainAr: "شيء يجب عليك فعله بموجب القانون." },
      { term: "sign shapes", ar: "أشكال الإشارات", explainAr: "الأشكال المختلفة للإشارات التي تحدد معناها." }
    ],
    image: "/theory-images/signs/signs_q065_blue-circle-mandatory.png"
  },

  {
    id: "RS-6003",
    topic: "road-signs",
    promptEn: "What does a red circular sign usually indicate?",
    promptAr: "ماذا تعني عادة الإشارة الدائرية الحمراء؟",
    options: [
      { en: "Information only", ar: "معلومات فقط", correct: false },
      { en: "A warning", ar: "تحذير", correct: false },
      { en: "A restriction or prohibition", ar: "قيد أو منع", correct: true },
      { en: "A recommended route", ar: "طريق مُوصى به", correct: false }
    ],
    keywords: [
      { term: "red circle", ar: "دائرة حمراء", explainAr: "شكل ولون إشارة المنع أو القيد." },
      { term: "prohibition", ar: "منع", explainAr: "إشارة تمنعك من القيام بفعل معين." },
      { term: "restriction", ar: "قيد", explainAr: "حد أو قيد على ما يمكنك فعله على الطريق." }
    ],
    image: "/theory-images/signs/signs_q066_red-circle-restriction.png"
  },

  {
    id: "RS-6004",
    topic: "road-signs",
    promptEn: "What do white rectangular signs usually provide?",
    promptAr: "ماذا تقدم عادة الإشارات المستطيلة البيضاء؟",
    options: [
      { en: "Mandatory rules", ar: "قواعد إلزامية", correct: false },
      { en: "Warnings only", ar: "تحذيرات فقط", correct: false },
      { en: "Information and directions", ar: "معلومات واتجاهات", correct: true },
      { en: "Temporary hazards", ar: "مخاطر مؤقتة", correct: false }
    ],
    keywords: [
      { term: "rectangular signs", ar: "إشارات مستطيلة", explainAr: "إشارات على شكل مستطيل توفر معلومات واتجاهات." },
      { term: "information", ar: "معلومات", explainAr: "بيانات مفيدة عن الطريق أو المنطقة." },
      { term: "directions", ar: "اتجاهات", explainAr: "معلومات عن الاتجاهات والوجهات على الطريق." }
    ],
    image: "/theory-images/signs/signs_q067_white-rectangular-information.png"
  },

  {
    id: "RS-6005",
    topic: "road-signs",
    promptEn: "What does a STOP sign require you to do?",
    promptAr: "ماذا تطلب منك إشارة التوقف (STOP)؟",
    options: [
      { en: "Slow down and look", ar: "التخفيف والنظر", correct: false },
      { en: "Stop only if traffic is coming", ar: "التوقف فقط عند وجود مرور", correct: false },
      { en: "Stop completely before the line", ar: "التوقف الكامل قبل الخط", correct: true },
      { en: "Give way without stopping", ar: "إعطاء أولوية دون توقف", correct: false }
    ],
    keywords: [
      { term: "STOP sign", ar: "إشارة التوقف", explainAr: "إشارة تطلب منك التوقف الكامل قبل الخط." },
      { term: "mandatory stop", ar: "توقف إلزامي", explainAr: "توقف مطلوب بموجب القانون عند إشارة التوقف." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." }
    ],
    image: "/theory-images/signs/signs_q068_stop-sign.png"
  },

  {
    id: "RS-6006",
    topic: "road-signs",
    promptEn: "You see white zigzag lines painted on the road near a pedestrian crossing. What must you do?",
    promptAr: "ترى خطوطًا بيضاء متعرجة مرسومة على الطريق قرب ممر مشاة. ماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q069_white-zigzag-pedestrian-crossing.png",
    options: [
      { en: "Stop and wait for pedestrians", ar: "توقف وانتظر المشاة", correct: false },
      { en: "Do not stop or park in this area", ar: "لا تتوقف أو تقف في هذه المنطقة", correct: true },
      { en: "Reduce speed to 20 mph", ar: "خفف السرعة إلى 20 ميلاً في الساعة", correct: false },
      { en: "Overtake only if safe", ar: "تجاوز فقط إذا كان آمنًا", correct: false }
    ],
    keywords: [
      { term: "zigzag lines", ar: "خطوط متعرجة", explainAr: "علامات على الطريق تحظر التوقف أو الوقوف لضمان رؤية واضحة للمشاة." },
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "منطقة مخصصة لعبور المشاة بأمان." },
      { term: "no stopping", ar: "ممنوع التوقف", explainAr: "قيد يمنعك من التوقف في منطقة معينة." }
    ]
  },

  {
    id: "RS-6007",
    topic: "road-signs",
    promptEn: "You approach a junction and see a broken white line across your lane. What must you do?",
    promptAr: "تقترب من تقاطع وترى خطًا أبيض متقطعًا عبر مسارك. ماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q070_broken-white-line-give-way.png",
    options: [
      { en: "Stop completely before the line", ar: "توقف تمامًا قبل الخط", correct: false },
      { en: "Give way to traffic on the major road", ar: "أفسح الطريق للمركبات على الطريق الرئيسي", correct: true },
      { en: "Continue at the same speed", ar: "تابع بنفس السرعة", correct: false },
      { en: "Sound your horn before proceeding", ar: "استخدم البوق قبل المتابعة", correct: false }
    ],
    keywords: [
      { term: "give way line", ar: "خط إعطاء الأولوية", explainAr: "خط متقطع على الطريق يشير إلى ضرورة إعطاء الأولوية للمركبات على الطريق الرئيسي." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." },
      { term: "broken line", ar: "خط متقطع", explainAr: "خط أبيض متقطع يشير إلى إعطاء الأولوية وليس التوقف الإلزامي." }
    ]
  },

  {
    id: "RS-6008",
    topic: "road-signs",
    promptEn: "You see a single yellow line painted along the kerb. What does this mean and what should you do?",
    promptAr: "ترى خطًا أصفر واحدًا مرسومًا على طول حافة الرصيف. ماذا يعني هذا وماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q071_single-yellow-line-kerb.png",
    options: [
      { en: "No waiting at any time - do not stop here", ar: "ممنوع الانتظار في أي وقت - لا تتوقف هنا", correct: false },
      { en: "Waiting restricted at certain times - check nearby signs for times", ar: "الانتظار مقيّد في أوقات معينة - تحقق من اللوحات القريبة للأوقات", correct: true },
      { en: "Loading only - you may load or unload", ar: "التحميل فقط - يمكنك التحميل أو التفريغ", correct: false },
      { en: "Residents only - parking for residents", ar: "للسكان فقط - وقوف للسكان", correct: false }
    ],
    keywords: [
      { term: "single yellow line", ar: "خط أصفر واحد", explainAr: "علامة على جانب الطريق تشير إلى قيود انتظار في أوقات معينة - تحقق من اللوحات القريبة." },
      { term: "waiting restrictions", ar: "قيود الانتظار", explainAr: "قواعد تحد من متى يمكنك الانتظار أو الوقوف." },
      { term: "kerb", ar: "حافة الرصيف", explainAr: "الحافة المرتفعة على جانب الطريق." }
    ]
  },

  {
    id: "RS-6009",
    topic: "road-signs",
    promptEn: "You see double yellow lines painted along the kerb. What must you do?",
    promptAr: "ترى خطين أصفرين مرسومين على طول حافة الرصيف. ماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q072_double-yellow-lines-kerb.png",
    options: [
      { en: "Do not wait or park here at any time", ar: "لا تنتظر أو تقف هنا في أي وقت", correct: true },
      { en: "Parking allowed during the day only", ar: "الوقوف مسموح خلال النهار فقط", correct: false },
      { en: "Loading and unloading allowed", ar: "التحميل والتفريغ مسموح", correct: false },
      { en: "Parking for residents only", ar: "وقوف للسكان فقط", correct: false }
    ],
    keywords: [
      { term: "double yellow lines", ar: "خطان أصفران", explainAr: "علامة على جانب الطريق تحظر الانتظار أو الوقوف في جميع الأوقات." },
      { term: "no waiting", ar: "ممنوع الانتظار", explainAr: "قيد يمنعك من الانتظار أو الوقوف في منطقة معينة في أي وقت." },
      { term: "kerb", ar: "حافة الرصيف", explainAr: "الحافة المرتفعة على جانب الطريق." }
    ]
  },

  {
    id: "RS-6009A",
    topic: "road-signs",
    promptEn: "You see a solid white line across your lane at a junction with a STOP sign. What must you do?",
    promptAr: "ترى خطًا أبيض متصلًا عبر مسارك عند تقاطع مع إشارة STOP. ماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q073_stop-line-solid-white.png",
    options: [
      { en: "Stop completely at or before the line, then proceed when safe", ar: "توقف تمامًا عند أو قبل الخط، ثم تابع عندما يكون آمنًا", correct: true },
      { en: "Slow down and give way if necessary", ar: "خفف السرعة وأفسح الطريق إذا لزم الأمر", correct: false },
      { en: "Stop only if there is other traffic", ar: "توقف فقط إذا كان هناك مرور آخر", correct: false },
      { en: "Continue if the road looks clear", ar: "تابع إذا بدا الطريق خالياً", correct: false }
    ],
    keywords: [
      { term: "stop line", ar: "خط التوقف", explainAr: "خط أبيض متصل عبر الطريق يشير إلى نقطة التوقف الإلزامي." },
      { term: "stop sign", ar: "إشارة توقف", explainAr: "إشارة ثمانية الشكل تحدد التوقف الإلزامي." },
      { term: "complete stop", ar: "توقف تام", explainAr: "يجب التوقف تمامًا عند خط التوقف قبل المتابعة." }
    ]
  },

  {
    id: "RS-6010",
    topic: "road-signs",
    promptEn: "What do temporary road signs with a yellow background usually indicate?",
    promptAr: "ماذا تشير عادة إشارات الطريق ذات الخلفية الصفراء؟",
    image: "/theory-images/signs/signs_q074_temporary-sign-yellow.png",
    options: [
      { en: "Permanent traffic rules", ar: "قواعد دائمة", correct: false },
      { en: "Motorway information", ar: "معلومات الطريق السريع", correct: false },
      { en: "Temporary road works or conditions", ar: "أعمال طريق أو ظروف مؤقتة", correct: true },
      { en: "Tourist attractions", ar: "معالم سياحية", correct: false }
    ],
    keywords: [
      { term: "temporary signs", ar: "إشارات مؤقتة", explainAr: "إشارات توضع لفترة محددة بسبب ظروف خاصة." },
      { term: "roadworks", ar: "أعمال طريق", explainAr: "أعمال صيانة أو بناء على الطريق." },
      { term: "yellow background", ar: "خلفية صفراء", explainAr: "لون خلفية الإشارات المؤقتة." }
    ]
  },

  {
    id: "RS-6011",
    topic: "road-signs",
    promptEn: "What does a speed limit sign without a red circle usually indicate?",
    promptAr: "ماذا يعني تحديد السرعة دون دائرة حمراء حول الرقم؟",
    image: "/theory-images/signs/signs_q075_advisory-speed.png",
    options: [
      { en: "Maximum legal speed", ar: "السرعة القصوى القانونية", correct: false },
      { en: "Advisory speed only", ar: "سرعة إرشادية فقط", correct: true },
      { en: "Minimum speed", ar: "السرعة الدنيا", correct: false },
      { en: "Average speed zone", ar: "منطقة سرعة متوسطة", correct: false }
    ],
    keywords: [
      { term: "advisory speed", ar: "سرعة إرشادية", explainAr: "سرعة موصى بها ولكنها غير إلزامية قانونياً." },
      { term: "warning signs", ar: "إشارات تحذيرية", explainAr: "إشارات تنبهك إلى ظروف قد تتطلب تقليل السرعة." },
      { term: "speed", ar: "سرعة", explainAr: "معدل الحركة للمركبة." }
    ]
  },

  {
    id: "RS-6012",
    topic: "road-signs",
    promptEn: "What does a blue rectangular sign on a motorway usually show?",
    promptAr: "ماذا تُظهر عادة الإشارة المستطيلة الزرقاء على الطريق السريع؟",
    image: "/theory-images/signs/signs_q076_motorway-info.png",
    options: [
      { en: "Warnings", ar: "تحذيرات", correct: false },
      { en: "Tourist attractions", ar: "معالم سياحية", correct: false },
      { en: "Directions and services", ar: "اتجاهات وخدمات", correct: true },
      { en: "Temporary diversions", ar: "تحويلات مؤقتة", correct: false }
    ],
    keywords: [
      { term: "motorway signs", ar: "إشارات الطريق السريع", explainAr: "إشارات خاصة بالطرق السريعة." },
      { term: "blue rectangle", ar: "مستطيل أزرق", explainAr: "شكل ولون إشارات المعلومات والخدمات على الطرق السريعة." },
      { term: "services", ar: "خدمات", explainAr: "مرافق مثل محطات الوقود والمطاعم على الطريق السريع." }
    ]
  },

  {
    id: "RS-6013",
    topic: "road-signs",
    promptEn: "What does a white arrow on a blue circular sign mean?",
    promptAr: "ماذا يعني السهم الأبيض على إشارة دائرية زرقاء؟",
    image: "/theory-images/signs/signs_q077_blue-circle-mandatory-direction.png",
    options: [
      { en: "Direction advised", ar: "اتجاه مقترح", correct: false },
      { en: "Direction you must follow", ar: "اتجاه يجب اتباعه", correct: true },
      { en: "No entry", ar: "ممنوع الدخول", correct: false },
      { en: "One-way road", ar: "طريق باتجاه واحد", correct: false }
    ],
    keywords: [
      { term: "mandatory direction", ar: "اتجاه إلزامي", explainAr: "اتجاه يجب عليك اتباعه بموجب القانون." },
      { term: "blue sign", ar: "إشارة زرقاء", explainAr: "إشارة دائرية زرقاء تشير إلى تعليمات إلزامية." },
      { term: "arrow", ar: "سهم", explainAr: "رمز يشير إلى الاتجاه المطلوب." }
    ]
  },

  {
    id: "RS-6014",
    topic: "road-signs",
    promptEn: "What does a continuous white line along the edge of the road indicate?",
    promptAr: "ماذا يدل الخط الأبيض المتصل على حافة الطريق؟",
    image: "/theory-images/signs/signs_q078_white-line-edg.png",
    options: [
      { en: "No overtaking", ar: "ممنوع التجاوز", correct: false },
      { en: "Edge of the carriageway", ar: "حافة الطريق", correct: true },
      { en: "Cycle lane", ar: "مسار دراجات", correct: false },
      { en: "Bus lane", ar: "مسار حافلات", correct: false }
    ],
    keywords: [
      { term: "edge line", ar: "خط الحافة", explainAr: "خط يحدد حافة الطريق القابل للقيادة." },
      { term: "carriageway", ar: "الطريق", explainAr: "جزء الطريق المخصص لحركة المركبات." },
      { term: "road markings", ar: "علامات الطريق", explainAr: "علامات مرسومة على سطح الطريق توفر معلومات للمركبات." }
    ]
  },

  {
    id: "RS-6015",
    topic: "road-signs",
    promptEn: "What should you do if road signs seem to contradict road markings?",
    promptAr: "ماذا يجب أن تفعل إذا بدت إشارات الطريق متعارضة مع علامات الطريق؟",
    image: "/theory-images/signs/signs_q079_signs-vs-road-markings-priority.png",
    options: [
      { en: "Follow road markings", ar: "اتباع علامات الطريق", correct: false },
      { en: "Follow road signs", ar: "اتباع إشارات الطريق", correct: true },
      { en: "Ignore both", ar: "تجاهل الاثنين", correct: false },
      { en: "Stop and wait", ar: "التوقف والانتظار", correct: false }
    ],
    keywords: [
      { term: "signs vs markings", ar: "الإشارات مقابل العلامات", explainAr: "الفرق بين إشارات الطريق وعلامات الطريق المرسومة." },
      { term: "priority", ar: "الأولوية", explainAr: "ما يجب اتباعه عندما تكون هناك تعارضات." },
      { term: "rules", ar: "قواعد", explainAr: "القوانين واللوائح التي تحكم استخدام الطريق." }
    ]
  },
  {
    id: "RS-6016",
    topic: "road-signs",
    promptEn: "What does an upside-down triangular sign at a junction mean?",
    promptAr: "ماذا تعني الإشارة المثلثة المقلوبة رأسًا على عقب عند التقاطع؟",
    image: "/theory-images/signs/signs_q080_give-way_triangle_junction.png",
    options: [
      { en: "Stop", ar: "توقف", correct: false },
      { en: "Give way", ar: "إعطاء أولوية", correct: true },
      { en: "No entry", ar: "ممنوع الدخول", correct: false },
      { en: "Warning of danger", ar: "تحذير من خطر", correct: false }
    ],
    keywords: [
      { term: "give way sign", ar: "إشارة إعطاء الأولوية", explainAr: "إشارة مثلثة مقلوبة تطلب من السائقين إعطاء الأولوية للمركبات على الطريق الرئيسي." },
      { term: "triangle", ar: "مثلث", explainAr: "شكل الإشارة التحذيرية أو الإرشادية." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." }
    ]
  },
  {
    id: "RS-6017",
    topic: "road-signs",
    promptEn: "What does a blue circular sign showing a mini-roundabout indicate?",
    promptAr: "ماذا تعني هذه الإشارة الدائرية الزرقاء التي تُظهر دوّارًا صغيرًا؟",
    image: "/theory-images/signs/signs_q082_mini-roundabout.png",
    options: [
      { en: "Mini-roundabout ahead – give way to traffic from the right", ar: "دوّار صغير أمامك – أعطِ الأولوية للمركبات القادمة من اليمين", correct: true },
      { en: "One-way traffic only", ar: "طريق باتجاه واحد فقط", correct: false },
      { en: "No entry for vehicles", ar: "ممنوع دخول المركبات", correct: false },
      { en: "Two-way traffic crosses ahead", ar: "حركة مرور باتجاهين تتقاطع أمامك", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-6018",
    topic: "road-signs",
    promptEn: "What does a red and white striped bollard usually show?",
    promptAr: "ماذا يدل عادة العمود ذو الخطوط الحمراء والبيضاء؟",
    image: "/theory-images/signs/signs_q082_red-white-bollard-obstruction.png",
    options: [
      { en: "Road narrowing", ar: "تضييق الطريق", correct: false },
      { en: "Side of an obstruction", ar: "جانب عائق", correct: true },
      { en: "Speed limit change", ar: "تغيير حد السرعة", correct: false },
      { en: "Pedestrian crossing", ar: "ممر مشاة", correct: false }
    ],
    keywords: [
      { term: "bollard", ar: "عمود", explainAr: "عمود قصير يستخدم لتحديد حدود الطريق أو العوائق." },
      { term: "obstruction", ar: "عائق", explainAr: "شيء يعيق أو يحد من حركة المرور." },
      { term: "road layout", ar: "تخطيط الطريق", explainAr: "كيفية ترتيب وتنظيم الطريق." }
    ]
  },
  {
    id: "RS-6019",
    topic: "road-signs",
    promptEn: "What does a series of diagonal white lines across the road before a hazard mean?",
    promptAr: "ماذا تعني الخطوط البيضاء المائلة المتتالية عبر الطريق قبل خطر؟",
    image: "/theory-images/signs/signs_q083_diagonal-white-lines-hazard-warning.png",
    options: [
      { en: "No overtaking zone", ar: "منطقة ممنوع التجاوز", correct: false },
      { en: "Traffic calming only", ar: "تهدئة مرور فقط", correct: false },
      { en: "Reduce speed and be prepared to stop", ar: "خفف السرعة واستعد للتوقف", correct: true },
      { en: "End of speed limit", ar: "نهاية حد السرعة", correct: false }
    ],
    keywords: [
      { term: "hazard markings", ar: "علامات الخطر", explainAr: "علامات على الطريق تحذر من خطر قادم." },
      { term: "reduce speed", ar: "تقليل السرعة", explainAr: "التباطؤ للتعامل مع خطر محتمل." },
      { term: "road warning", ar: "تحذير على الطريق", explainAr: "إشارة أو علامة تحذيرية على الطريق." }
    ]
  },
  {
    id: "RS-6020",
    topic: "road-signs",
    promptEn: "What does a green rectangular sign usually indicate?",
    promptAr: "ماذا تشير إليه عادة الإشارة المستطيلة الخضراء؟",
    image: "/theory-images/signs/signs_q084_green-rectangular-primary-route-directions.png",
    options: [
      { en: "Motorway directions", ar: "اتجاهات طريق سريع", correct: false },
      { en: "Primary route directions", ar: "اتجاهات طريق رئيسي", correct: true },
      { en: "Tourist information", ar: "معلومات سياحية", correct: false },
      { en: "Temporary diversion", ar: "تحويلة مؤقتة", correct: false }
    ],
    keywords: [
      { term: "green sign", ar: "إشارة خضراء", explainAr: "الإشارات الخضراء عادة ما تشير إلى الطرق الرئيسية والاتجاهات." },
      { term: "primary route", ar: "طريق رئيسي", explainAr: "طريق مهم يربط بين المدن والمناطق الرئيسية." },
      { term: "directions", ar: "اتجاهات", explainAr: "معلومات توجيهية للمساعدة في التنقل." }
    ]
  },
  {
    id: "RS-6021",
    topic: "road-signs",
    promptEn: "What does a speed limit sign with a black diagonal line through it mean?",
    promptAr: "ماذا يعني تحديد سرعة عليه خط أسود مائل؟",
    image: "/theory-images/signs/signs_q085_end-of-speed-limit.png",
    options: [
      { en: "Advisory speed", ar: "سرعة إرشادية", correct: false },
      { en: "End of speed limit", ar: "نهاية حد السرعة", correct: true },
      { en: "Minimum speed", ar: "السرعة الدنيا", correct: false },
      { en: "Average speed zone", ar: "منطقة سرعة متوسطة", correct: false }
    ],
    keywords: [
      { term: "end of speed limit", ar: "نهاية حد السرعة", explainAr: "إشارة تشير إلى انتهاء حد السرعة المحدد سابقاً." },
      { term: "black diagonal", ar: "خط أسود مائل", explainAr: "خط مائل أسود يشير إلى إلغاء أو انتهاء القيد." },
      { term: "sign meaning", ar: "معنى الإشارة", explainAr: "ما تعنيه الإشارة المرورية." }
    ]
  },
  {
    id: "RS-6022",
    topic: "road-signs",
    promptEn: "What do white zigzag lines near a school crossing indicate?",
    promptAr: "ماذا تعني الخطوط البيضاء المتعرجة قرب معبر مدرسة؟",
    image: "/theory-images/signs/signs_q086_white-zigzag-school-crossing.png",
    options: [
      { en: "Parking allowed briefly", ar: "الوقوف مسموح مؤقتًا", correct: false },
      { en: "No stopping or parking", ar: "ممنوع التوقف أو الوقوف", correct: true },
      { en: "Bus stop area", ar: "منطقة توقف حافلات", correct: false },
      { en: "Drop-off zone only", ar: "منطقة إنزال فقط", correct: false }
    ],
    keywords: [
      { term: "school crossing", ar: "معبر مدرسة", explainAr: "ممر آمن للأطفال للعبور إلى المدرسة." },
      { term: "zigzag", ar: "متعرج", explainAr: "خطوط متعرجة على الطريق تشير إلى قيود خاصة." },
      { term: "no stopping", ar: "ممنوع التوقف", explainAr: "منطقة لا يُسمح فيها بالتوقف أو الوقوف." }
    ]
  },
  {
    id: "RS-6023",
    topic: "road-signs",
    promptEn: "What does a temporary speed limit sign at roadworks require you to do?",
    promptAr: "ماذا يتطلب منك تحديد السرعة المؤقت عند أعمال الطرق؟",
    image: "/theory-images/signs/signs_q087_temporary-speed-limit-roadworks.png",
    options: [
      { en: "Treat it as a recommendation", ar: "اعتباره إرشاديًا", correct: false },
      { en: "Obey it as a legal limit", ar: "الالتزام به كحد قانوني", correct: true },
      { en: "Ignore it at night", ar: "تجاهله ليلًا", correct: false },
      { en: "Follow other drivers", ar: "اتباع السائقين الآخرين", correct: false }
    ],
    keywords: [
      { term: "temporary speed limit", ar: "حد سرعة مؤقت", explainAr: "حد سرعة مؤقت يتم تطبيقه في مناطق أعمال الطرق." },
      { term: "roadworks", ar: "أعمال الطرق", explainAr: "أعمال صيانة أو إصلاح على الطريق." },
      { term: "legal", ar: "قانوني", explainAr: "مطلوب بموجب القانون ويجب اتباعه." }
    ]
  },
  {
    id: "RS-6024",
    topic: "road-signs",
    promptEn: "You see a solid white line along the centre of the road. What does this mean and what must you do?",
    promptAr: "ترى خطًا أبيض متصلًا في منتصف الطريق. ماذا يعني هذا وماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q088_solid-white-centre-line_no-overtaking.png",
    options: [
      { en: "Do not cross or straddle this line to overtake", ar: "لا تعبر أو تمتد على هذا الخط للتجاوز", correct: true },
      { en: "Overtaking allowed if safe", ar: "التجاوز مسموح إذا كان آمنًا", correct: false },
      { en: "One-way road ahead", ar: "طريق باتجاه واحد قادم", correct: false },
      { en: "Bus lane marking", ar: "علامة مسار حافلات", correct: false }
    ],
    keywords: [
      { term: "solid white line", ar: "خط أبيض متصل", explainAr: "خط أبيض متصل في منتصف الطريق يحظر عبوره أو التمدد عليه للتجاوز." },
      { term: "no overtaking", ar: "ممنوع التجاوز", explainAr: "منع تجاوز المركبات الأخرى في هذا القسم من الطريق." },
      { term: "centre line", ar: "خط الوسط", explainAr: "الخط الذي يقسم الطريق إلى قسمين." }
    ]
  },
  {
    id: "RS-6025",
    topic: "road-signs",
    promptEn: "What does a triangular warning sign with an exclamation mark and a plate reading 'Hidden dip' warn you about?",
    promptAr: "ماذا تحذّر هذه الإشارة التحذيرية المثلثة مع لوحة مكتوب عليها (منخفض مخفي)؟",
    image: "/theory-images/signs/signs_q090_hidden-dip.png",
    options: [
      { en: "A sudden dip in the road that may not be visible ahead", ar: "منخفض مفاجئ في الطريق قد لا يكون مرئيًا أمامك", correct: true },
      { en: "Slippery road surface", ar: "سطح طريق زلق", correct: false },
      { en: "Road narrows ahead", ar: "الطريق يضيق أمامك", correct: false },
      { en: "Steep hill ahead", ar: "تل شديد الانحدار أمامك", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-6026",
    topic: "road-signs",
    promptEn: "What does a sign showing traffic lights crossed out usually indicate?",
    promptAr: "ماذا تعني إشارة تُظهر إشارات مرور مشطوبة؟",
    image: "/theory-images/signs/signs_q091_traffic-signals-not-in-use.png",
    options: [
      { en: "Traffic signals are not operating and you should follow road signs or markings", ar: "الإشارات الضوئية غير عاملة ويجب عليك اتباع علامات الطريق أو العلامات الأرضية", correct: true },
      { en: "Temporary traffic lights ahead", ar: "إشارات مرور مؤقتة أمامك", correct: false },
      { en: "Pedestrian crossing controlled by signals", ar: "معبر مشاة مُتحكم به بواسطة إشارات", correct: false },
      { en: "Traffic lights working normally", ar: "الإشارات الضوئية تعمل بشكل طبيعي", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-6027",
    topic: "road-signs",
    promptEn: "What does a triangular warning sign showing a snowflake usually warn you about?",
    promptAr: "ماذا تحذّر عادةً إشارة تحذير مثلثة تحتوي على رمز الثلج؟",
    image: "/theory-images/signs/signs_q092_snow-or-ice-warning.png",
    options: [
      { en: "Slippery road due to snow or ice ahead", ar: "طريق زلق بسبب الثلج أو الجليد أمامك", correct: true },
      { en: "Strong winds likely", ar: "رياح قوية محتملة", correct: false },
      { en: "Foggy conditions ahead", ar: "ظروف ضبابية أمامك", correct: false },
      { en: "Loose gravel on the road", ar: "حصى متفكك على الطريق", correct: false }
    ],
    keywords: []
  },
  {
    id: "RS-6028",
    topic: "road-signs",
    promptEn: "What does a broken yellow line at the edge of the road usually indicate?",
    promptAr: "ماذا يدل الخط الأصفر المتقطع على حافة الطريق عادة؟",
    image: "/theory-images/signs/signs_q092_broken-yellow-line-edge_waiting-restrictions.png",
    options: [
      { en: "No waiting at any time", ar: "ممنوع الانتظار دائمًا", correct: false },
      { en: "Waiting restrictions at certain times", ar: "قيود انتظار في أوقات محددة", correct: true },
      { en: "No loading", ar: "ممنوع التحميل", correct: false },
      { en: "Bus stop", ar: "موقف حافلات", correct: false }
    ],
    keywords: [
      { term: "yellow line", ar: "خط أصفر", explainAr: "خط أصفر على حافة الطريق يشير إلى قيود الانتظار." },
      { term: "waiting restrictions", ar: "قيود الانتظار", explainAr: "قيود على متى يمكنك الانتظار أو الوقوف." },
      { term: "kerb", ar: "حافة الرصيف", explainAr: "حافة الرصيف أو الطريق." }
    ]
  },
  {
    id: "RS-6029",
    topic: "road-signs",
    promptEn: "What should you do if a sign is partially obscured but road markings are clear?",
    promptAr: "ماذا يجب أن تفعل إذا كانت الإشارة محجوبة جزئيًا لكن علامات الطريق واضحة؟",
    image: "/theory-images/signs/signs_q093_obscured-sign_follow-road-markings.png",
    options: [
      { en: "Ignore both", ar: "تجاهل الاثنين", correct: false },
      { en: "Follow the road markings", ar: "اتباع علامات الطريق", correct: true },
      { en: "Stop and wait", ar: "التوقف والانتظار", correct: false },
      { en: "Follow other vehicles", ar: "اتباع المركبات الأخرى", correct: false }
    ],
    keywords: [
      { term: "obscured signs", ar: "إشارات محجوبة", explainAr: "إشارات غير مرئية بوضوح بسبب عائق أو ظروف." },
      { term: "road markings", ar: "علامات الطريق", explainAr: "علامات مرسومة على سطح الطريق." },
      { term: "priority", ar: "الأولوية", explainAr: "ما يجب اتباعه عندما تكون هناك تعارضات." }
    ]
  },
  {
    id: "RS-6030",
    topic: "road-signs",
    promptEn: "Why should you always read supplementary plates under road signs?",
    promptAr: "لماذا يجب دائمًا قراءة اللوحات الإضافية أسفل إشارات الطريق؟",
    image: "/theory-images/signs/signs_q094_supplementary-plate-extra-details.png",
    options: [
      { en: "They repeat the same rule", ar: "تكرر نفس القاعدة", correct: false },
      { en: "They give extra details such as times or conditions", ar: "تعطي تفاصيل إضافية مثل الأوقات أو الشروط", correct: true },
      { en: "They are optional information", ar: "معلومات اختيارية", correct: false },
      { en: "They only apply to buses", ar: "تنطبق فقط على الحافلات", correct: false }
    ],
    keywords: [
      { term: "supplementary plates", ar: "لوحات إضافية", explainAr: "لوحات صغيرة تحت الإشارات الرئيسية تعطي تفاصيل إضافية." },
      { term: "conditions", ar: "شروط", explainAr: "ظروف أو حالات معينة تنطبق فيها القاعدة." },
      { term: "times", ar: "أوقات", explainAr: "أوقات محددة تنطبق فيها القاعدة أو القيد." }
    ]
  },

  {
    id: "SM-3001",
    topic: "safety-margins",
    promptEn: "In good driving conditions, what is the recommended minimum following distance behind the vehicle in front?",
    promptAr: "في ظروف قيادة جيدة، ما هي مسافة التتبّع الدنيا الموصى بها خلف المركبة التي أمامك؟",
    options: [
      { en: "One second", ar: "ثانية واحدة", correct: false },
      { en: "Two seconds", ar: "ثانيتان", correct: true },
      { en: "Three seconds", ar: "ثلاث ثوانٍ", correct: false },
      { en: "Four seconds", ar: "أربع ثوانٍ", correct: false }
    ],
    keywords: [
      { term: "following distance", ar: "مسافة التتبّع", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها بين مركبتك والمركبة التي أمامك." },
      { term: "two-second rule", ar: "قاعدة الثانيتين", explainAr: "قاعدة عامة للحفاظ على مسافة أمان آمنة خلف المركبة التي أمامك." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت للتفاعل والتوقف بأمان." }
    ]
  },

  {
    id: "SM-3002",
    topic: "safety-margins",
    promptEn: "How should your following distance change when driving on a wet road?",
    promptAr: "كيف يجب أن تتغير مسافة التتبّع عند القيادة على طريق مبلل؟",
    options: [
      { en: "Remain the same as in dry conditions", ar: "تبقى كما هي في الظروف الجافة", correct: false },
      { en: "Be reduced to maintain traffic flow", ar: "تُخفّض للحفاظ على انسياب المرور", correct: false },
      { en: "Be increased to at least four seconds", ar: "تُزاد إلى أربع ثوانٍ على الأقل", correct: true },
      { en: "Only increased at night", ar: "تُزاد فقط أثناء الليل", correct: false }
    ],
    keywords: [
      { term: "wet roads", ar: "طرق مبللة", explainAr: "الطرق المبللة بالمطر تقلل من تماسك الإطارات وتزيد من مسافة التوقف." },
      { term: "following distance", ar: "مسافة التتبّع", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها بين مركبتك والمركبة التي أمامك." },
      { term: "four-second rule", ar: "قاعدة الأربع ثوانٍ", explainAr: "قاعدة للحفاظ على مسافة أمان أكبر على الطرق المبللة أو في ظروف صعبة." }
    ]
  },

  {
    id: "SM-3003",
    topic: "safety-margins",
    promptEn: "Why should you increase your following distance when driving at higher speeds?",
    promptAr: "لماذا يجب زيادة مسافة التتبّع عند القيادة بسرعات أعلى؟",
    options: [
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because stopping distance becomes longer", ar: "لأن مسافة التوقف تصبح أطول", correct: true },
      { en: "Because vehicles are harder to see", ar: "لأن المركبات تصبح أصعب رؤية", correct: false },
      { en: "Because speed limits may change", ar: "لأن حدود السرعة قد تتغير", correct: false }
    ],
    keywords: [
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة الإجمالية التي تحتاجها السيارة للتوقف تماماً، وتشمل مسافة التفاعل ومسافة الفرملة." },
      { term: "speed", ar: "السرعة", explainAr: "كلما زادت السرعة، زادت مسافة التوقف المطلوبة." },
      { term: "safety margin", ar: "هامش الأمان", explainAr: "المسافة الإضافية التي تمنحك الوقت للتفاعل مع المواقف غير المتوقعة." }
    ]
  },

  {
    id: "SM-3004",
    topic: "safety-margins",
    promptEn: "What is the main danger of driving too close to the vehicle in front?",
    promptAr: "ما هو الخطر الرئيسي من القيادة بالقرب الشديد من المركبة التي أمامك؟",
    options: [
      { en: "Reduced fuel efficiency", ar: "انخفاض كفاءة الوقود", correct: false },
      { en: "Limited engine cooling", ar: "ضعف تبريد المحرك", correct: false },
      { en: "Less time to react and stop safely", ar: "وقت أقل للتفاعل والتوقف بأمان", correct: true },
      { en: "Difficulty seeing road signs", ar: "صعوبة رؤية إشارات الطريق", correct: false }
    ],
    keywords: [
      { term: "tailgating", ar: "الالتصاق الخلفي", explainAr: "القيادة قريباً جداً من المركبة التي أمامك، مما يقلل من وقت التفاعل ويزيد من خطر الحوادث." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي يستغرقه السائق لملاحظة الخطر والبدء في الاستجابة." },
      { term: "risk", ar: "الخطر", explainAr: "احتمالية حدوث حادث أو موقف خطير." }
    ]
  },

  {
    id: "SM-3005",
    topic: "safety-margins",
    promptEn: "Why should you leave a much larger following distance when following a large vehicle?",
    promptAr: "لماذا يجب ترك مسافة تتبّع أكبر بكثير عند اتباع مركبة كبيرة؟",
    options: [
      { en: "Because large vehicles travel faster", ar: "لأن المركبات الكبيرة تسير أسرع", correct: false },
      { en: "Because your view of the road ahead is reduced and blocked", ar: "لأن رؤيتك للطريق أمامك تكون محدودة ومحجوبة", correct: true },
      { en: "Because large vehicles stop more quickly", ar: "لأن المركبات الكبيرة تتوقف أسرع", correct: false },
      { en: "Because fuel consumption is higher", ar: "لأن استهلاك الوقود أعلى", correct: false }
    ],
    keywords: [
      { term: "large vehicles", ar: "المركبات الكبيرة", explainAr: "الشاحنات والحافلات والمركبات الكبيرة الأخرى التي قد تحجب رؤيتك للطريق أمامك." },
      { term: "following distance", ar: "مسافة التتبّع", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها بينك وبين المركبة التي أمامك." },
      { term: "reduced visibility", ar: "رؤية محدودة", explainAr: "عندما لا تستطيع رؤية الطريق أمام المركبة التي أمامك بوضوح بسبب حجمها." }
    ]
  },

  {
    id: "SM-3006",
    topic: "safety-margins",
    promptEn: "What should you do to maintain a safe following distance in fog or reduced visibility?",
    promptAr: "ماذا يجب أن تفعل للحفاظ على مسافة تتبّع آمنة أثناء القيادة في الضباب أو الرؤية المحدودة؟",
    options: [
      { en: "Follow the vehicle in front closely using its lights", ar: "اتبع المركبة التي أمامك عن قرب باستخدام أضوائها", correct: false },
      { en: "Use the two-second rule as normal", ar: "استخدم قاعدة الثانيتين كالمعتاد", correct: false },
      { en: "Increase the gap significantly and be able to stop within the distance you can see", ar: "زد المسافة بشكل كبير وتمكّن من التوقف ضمن المسافة التي تستطيع رؤيتها", correct: true },
      { en: "Drive at the speed limit to keep traffic moving", ar: "قد بسرعة الحد الأقصى للحفاظ على حركة المرور", correct: false }
    ],
    keywords: [
      { term: "fog", ar: "الضباب", explainAr: "ظروف الطقس التي تقلل الرؤية بشكل كبير وتتطلب مسافات توقف أطول." },
      { term: "reduced visibility", ar: "رؤية محدودة", explainAr: "عندما تكون قدرتك على رؤية الطريق والمركبات محدودة بسبب الضباب أو الظروف الجوية." },
      { term: "following distance", ar: "مسافة التتبّع", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها بينك وبين المركبة التي أمامك." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت الكافي للتفاعل مع أي موقف غير متوقع." }
    ]
  },

  {
    id: "SM-3007",
    topic: "safety-margins",
    promptEn: "Why is tailgating especially dangerous on motorways?",
    promptAr: "لماذا تُعد القيادة القريبة جدًا من المركبة الأمامية خطيرة بشكل خاص على الطرق السريعة؟",
    options: [
      { en: "Because speed limits are higher", ar: "لأن حدود السرعة أعلى", correct: false },
      { en: "Because stopping distances are much longer at high speeds", ar: "لأن مسافات التوقف أطول بكثير عند السرعات العالية", correct: true },
      { en: "Because lanes are narrower", ar: "لأن المسارات أضيق", correct: false },
      { en: "Because headlights are brighter", ar: "لأن الأضواء أقوى", correct: false }
    ],
    keywords: [
      { term: "tailgating", ar: "الالتصاق الخلفي", explainAr: "القيادة قريباً جداً من المركبة التي أمامك، مما يقلل من وقت التفاعل ويزيد من خطر الحوادث." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق عالي السرعة مع سرعات أعلى ومسافات توقف أطول." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة الإجمالية التي تحتاجها السيارة للتوقف تماماً، وتشمل مسافة التفاعل ومسافة الفرملة." }
    ]
  },

  {
    id: "SM-3008",
    topic: "safety-margins",
    promptEn: "When driving on icy roads, how should your following distance compare to normal conditions?",
    promptAr: "عند القيادة على طرق مغطاة بالجليد، كيف يجب أن تكون مسافة التتبّع مقارنة بالظروف العادية؟",
    options: [
      { en: "The same as normal", ar: "نفس المسافة المعتادة", correct: false },
      { en: "Twice the normal distance", ar: "ضعف المسافة المعتادة", correct: false },
      { en: "Much greater than normal", ar: "أكبر بكثير من المعتاد", correct: true },
      { en: "Only slightly increased", ar: "أكبر بقليل فقط", correct: false }
    ],
    keywords: [
      { term: "ice", ar: "الجليد", explainAr: "ظروف الطريق الزلقة التي تقلل من قوة الفرملة وتزيد من مسافة التوقف." },
      { term: "following distance", ar: "مسافة التتبّع", explainAr: "المسافة بين مركبتك والمركبة التي أمامك." },
      { term: "slippery roads", ar: "طرق زلقة", explainAr: "الطرق التي تقلل من قوة الفرملة وتتطلب مسافات توقف أطول." }
    ]
  },

  {
    id: "SM-3009",
    topic: "safety-margins",
    promptEn: "What is the main benefit of keeping a safe distance from the vehicle in front?",
    promptAr: "ما الفائدة الرئيسية من الحفاظ على مسافة آمنة خلف المركبة التي أمامك؟",
    options: [
      { en: "Improved fuel efficiency", ar: "تحسين كفاءة الوقود", correct: false },
      { en: "More time to react to hazards", ar: "وقت أطول للتفاعل مع المخاطر", correct: true },
      { en: "Less engine wear", ar: "تقليل تآكل المحرك", correct: false },
      { en: "Reduced wind resistance", ar: "تقليل مقاومة الهواء", correct: false }
    ],
    keywords: [
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي يستغرقه السائق لملاحظة الخطر والبدء في الاستجابة." },
      { term: "hazard awareness", ar: "الوعي بالمخاطر", explainAr: "القدرة على التعرف على المخاطر المحتملة على الطريق." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "المسافة الكافية بين المركبات التي تمنح الوقت للتفاعل بأمان." }
    ]
  },

  {
    id: "SM-3010",
    topic: "safety-margins",
    promptEn: "When following a motorcycle, why should you allow a larger safety gap?",
    promptAr: "عند اتباع دراجة نارية، لماذا يجب ترك مسافة أمان أكبر؟",
    options: [
      { en: "Motorcycles always travel faster", ar: "الدراجات النارية تسير دائمًا أسرع", correct: false },
      { en: "Motorcyclists may need to swerve suddenly", ar: "قد يضطر سائق الدراجة للانحراف فجأة", correct: true },
      { en: "Motorcycles have weaker brakes", ar: "فرامل الدراجات أضعف", correct: false },
      { en: "Motorcycles use less road space", ar: "الدراجات تستخدم مساحة أقل من الطريق", correct: false }
    ],
    keywords: [
      { term: "motorcyclists", ar: "سائقي الدراجات النارية", explainAr: "مستخدمي الطريق الضعفاء الذين قد يحتاجون للانحراف فجأة لتجنب المخاطر." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت الكافي للتفاعل مع أي موقف غير متوقع." },
      { term: "vulnerable users", ar: "مستخدمي الطريق الضعفاء", explainAr: "المشاة وراكبي الدراجات وسائقي الدراجات النارية الذين هم أكثر عرضة للإصابة في الحوادث." }
    ]
  },

  {
    id: "SM-3011",
    topic: "safety-margins",
    promptEn: "When driving downhill, why should you leave a larger safety gap?",
    promptAr: "عند القيادة نزولاً، لماذا يجب ترك مسافة أمان أكبر؟",
    options: [
      { en: "Because engines use more fuel downhill", ar: "لأن المحركات تستهلك وقوداً أكثر عند النزول", correct: false },
      { en: "Because braking distances can increase", ar: "لأن مسافة الكبح قد تزداد", correct: true },
      { en: "Because road signs are harder to see", ar: "لأن إشارات الطريق تصبح أصعب رؤية", correct: false },
      { en: "Because traffic moves faster downhill", ar: "لأن حركة المرور أسرع عند النزول", correct: false }
    ],
    keywords: [
      { term: "downhill", ar: "نزولاً", explainAr: "القيادة على منحدر نزولي حيث تزداد قوة الجاذبية وتطول مسافة الكبح." },
      { term: "braking distance", ar: "مسافة الكبح", explainAr: "المسافة التي تقطعها السيارة من لحظة الضغط على الفرامل حتى التوقف التام." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "المسافة الكافية بين المركبات التي تمنح الوقت للتفاعل بأمان." }
    ]
  },

  {
    id: "SM-3012",
    topic: "safety-margins",
    promptEn: "What should you do if another driver moves into the safe gap you have left?",
    promptAr: "ماذا يجب أن تفعل إذا دخل سائق آخر إلى مسافة الأمان التي تركتها أمامك؟",
    options: [
      { en: "Maintain your speed to discourage them", ar: "حافظ على سرعتك لردعهم", correct: false },
      { en: "Sound your horn to warn them", ar: "استخدم البوق لتحذيرهم", correct: false },
      { en: "Drop back to re-establish a safe distance", ar: "خفف السرعة لإعادة إنشاء مسافة أمان", correct: true },
      { en: "Overtake immediately", ar: "تجاوز فوراً", correct: false }
    ],
    keywords: [
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "المسافة الكافية بين المركبات التي تمنح الوقت للتفاعل بأمان." },
      { term: "traffic flow", ar: "تدفق المرور", explainAr: "حركة المركبات على الطريق بشكل منظم وآمن." },
      { term: "defensive driving", ar: "القيادة الدفاعية", explainAr: "أسلوب قيادة يركز على السلامة والتنبؤ بالمخاطر المحتملة." }
    ]
  },

  {
    id: "SM-3013",
    topic: "safety-margins",
    promptEn: "Why is it important to keep a safe distance when driving in heavy rain?",
    promptAr: "لماذا من المهم الحفاظ على مسافة آمنة عند القيادة في أمطار غزيرة؟",
    options: [
      { en: "Because visibility is always perfect", ar: "لأن الرؤية تكون دائماً مثالية", correct: false },
      { en: "Because tyres can lose grip more easily", ar: "لأن الإطارات قد تفقد التماسك بسهولة", correct: true },
      { en: "Because engines may overheat", ar: "لأن المحركات قد تسخن", correct: false },
      { en: "Because speed limits change automatically", ar: "لأن حدود السرعة تتغير تلقائياً", correct: false }
    ],
    keywords: [
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "ظروف الطقس التي تقلل الرؤية وتزيد من خطر الانزلاق." },
      { term: "aquaplaning", ar: "الانزلاق المائي", explainAr: "ظاهرة تفقد فيها الإطارات التماسك مع سطح الطريق بسبب طبقة الماء." },
      { term: "traction", ar: "التماسك", explainAr: "قوة الاحتكاك بين الإطارات وسطح الطريق التي تمنع الانزلاق." }
    ]
  },

  {
    id: "SM-3014",
    topic: "safety-margins",
    promptEn: "What is the safest action if you feel pressured by a vehicle following too closely?",
    promptAr: "ما هو الإجراء الأكثر أماناً إذا شعرت بضغط من مركبة تتبعك عن قرب شديد؟",
    options: [
      { en: "Brake sharply to warn them", ar: "اكبح بقوة لتحذيرهم", correct: false },
      { en: "Increase your speed to escape", ar: "زد سرعتك للهروب", correct: false },
      { en: "Increase the gap in front to reduce braking needs", ar: "زد المسافة أمامك لتقليل الحاجة للكبح", correct: true },
      { en: "Move to the centre of the road", ar: "انتقل إلى وسط الطريق", correct: false }
    ],
    keywords: [
      { term: "tailgater", ar: "مُلتصق خلفي", explainAr: "سائق يتبع مركبة أخرى عن قرب شديد مما يشكل خطراً على السلامة." },
      { term: "pressure", ar: "ضغط", explainAr: "الشعور بالتهديد أو الإجبار من قبل سائق آخر على الطريق." },
      { term: "defensive driving", ar: "القيادة الدفاعية", explainAr: "أسلوب قيادة يركز على السلامة والتنبؤ بالمخاطر المحتملة." }
    ]
  },

  {
    id: "SM-3015",
    topic: "safety-margins",
    promptEn: "When should you leave extra space around your vehicle at junctions?",
    promptAr: "متى يجب ترك مساحة إضافية حول مركبتك عند التقاطعات؟",
    options: [
      { en: "Only when traffic is light", ar: "فقط عندما تكون حركة المرور خفيفة", correct: false },
      { en: "When visibility is restricted", ar: "عندما تكون الرؤية محدودة", correct: true },
      { en: "Only during daylight", ar: "فقط أثناء النهار", correct: false },
      { en: "When road markings are clear", ar: "عندما تكون علامات الطريق واضحة", correct: false }
    ],
    keywords: [
      { term: "junctions", ar: "التقاطعات", explainAr: "نقاط التقاء الطرق حيث يجب توخي الحذر الشديد." },
      { term: "restricted view", ar: "رؤية محدودة", explainAr: "عندما لا تستطيع رؤية الطريق بوضوح بسبب العوائق أو الظروف." },
      { term: "safety margin", ar: "هامش الأمان", explainAr: "المسافة أو الوقت الإضافي الذي تتركه للتفاعل مع المواقف غير المتوقعة." }
    ]
  },


  {
    id: "SM-3017",
    topic: "safety-margins",
    promptEn: "What is the safest approach to maintain a safe distance in slow-moving traffic?",
    promptAr: "ما هو الأسلوب الأكثر أمانًا للحفاظ على مسافة آمنة في حركة المرور البطيئة؟",
    options: [
      { en: "Keep very close to prevent others from cutting in", ar: "الاقتراب الشديد لمنع الآخرين من الدخول", correct: false },
      { en: "Maintain a steady gap and be prepared to stop", ar: "الحفاظ على مسافة ثابتة والاستعداد للتوقف", correct: true },
      { en: "Accelerate sharply when gaps appear", ar: "التسارع الحاد عند ظهور فراغات", correct: false },
      { en: "Rely on hazard lights", ar: "الاعتماد على أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "slow traffic", ar: "حركة المرور البطيئة", explainAr: "الظروف التي تسير فيها المركبات ببطء أو تتوقف بشكل متكرر." },
      { term: "safe gap", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة أمامك للتفاعل بأمان." },
      { term: "preparedness", ar: "الاستعداد", explainAr: "كونك جاهزاً للتفاعل مع المواقف غير المتوقعة على الطريق." }
    ]
  },

  {
    id: "SM-3018",
    topic: "safety-margins",
    promptEn: "When driving at night, why is a safe following distance especially important?",
    promptAr: "لماذا تُعد مسافة التتبّع الآمنة مهمة بشكل خاص عند القيادة ليلاً؟",
    options: [
      { en: "Because headlights reduce braking ability", ar: "لأن الأضواء تقلل من قدرة الكبح", correct: false },
      { en: "Because visibility is reduced and hazards are harder to spot", ar: "لأن الرؤية أقل والمخاطر أصعب في الاكتشاف", correct: true },
      { en: "Because speed limits are lower", ar: "لأن حدود السرعة أقل", correct: false },
      { en: "Because roads are always busier", ar: "لأن الطرق تكون دائماً أكثر ازدحامًا", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "القيادة ليلاً", explainAr: "القيادة في الظلام حيث تكون الرؤية محدودة." },
      { term: "visibility", ar: "الرؤية", explainAr: "قدرتك على رؤية الطريق والمركبات والمخاطر من حولك." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي تحتاجه للاستجابة للمواقف على الطريق." }
    ]
  },

  {
    id: "SM-3019",
    topic: "safety-margins",
    promptEn: "What should you do to maintain a safe margin if the vehicle in front stops suddenly?",
    promptAr: "ماذا يجب أن تفعل للحفاظ على هامش أمان إذا توقفت المركبة أمامك فجأة؟",
    options: [
      { en: "Swerve into another lane immediately", ar: "الانحراف فورًا إلى مسار آخر", correct: false },
      { en: "Brake firmly while keeping control", ar: "الكبح بقوة مع الحفاظ على السيطرة", correct: true },
      { en: "Sound the horn continuously", ar: "استخدام البوق باستمرار", correct: false },
      { en: "Accelerate to pass the vehicle", ar: "التسارع لتجاوز المركبة", correct: false }
    ],
    keywords: [
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "عندما تتوقف المركبة أمامك فجأة دون سابق إنذار." },
      { term: "braking", ar: "الكبح", explainAr: "استخدام المكابح لإبطاء أو إيقاف المركبة." },
      { term: "control", ar: "السيطرة", explainAr: "الحفاظ على التحكم في المركبة أثناء الكبح أو المناورة." }
    ]
  },

  {
    id: "SM-3020",
    topic: "safety-margins",
    promptEn: "When is it most important to leave extra space in front of your vehicle?",
    promptAr: "متى يكون من الأهم ترك مسافة إضافية أمام مركبتك؟",
    options: [
      { en: "When driving in clear, dry conditions", ar: "عند القيادة في ظروف جافة وواضحة", correct: false },
      { en: "When approaching hazards or areas of uncertainty", ar: "عند الاقتراب من مخاطر أو مناطق غير واضحة", correct: true },
      { en: "When travelling at very low speeds", ar: "عند السير بسرعات منخفضة جدًا", correct: false },
      { en: "When road signs are frequent", ar: "عندما تكون إشارات الطريق كثيرة", correct: false }
    ],
    keywords: [
      { term: "hazards", ar: "المخاطر", explainAr: "أي شيء على الطريق قد يشكل خطراً مثل الحفر أو الحطام أو المركبات المتوقفة." },
      { term: "uncertainty", ar: "عدم اليقين", explainAr: "المناطق أو المواقف التي لا تكون فيها متأكداً مما قد يحدث." },
      { term: "extra space", ar: "مسافة إضافية", explainAr: "المسافة الإضافية التي تتركها أمامك للسماح بوقت رد فعل أكبر." }
    ]
  },

  {
    id: "SM-3021",
    topic: "safety-margins",
    promptEn: "Why should you allow a greater following distance when driving in strong winds?",
    promptAr: "لماذا يجب ترك مسافة تتبّع أكبر عند القيادة في رياح قوية؟",
    options: [
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because vehicles may be blown off course unexpectedly", ar: "لأن المركبات قد تنحرف فجأة عن مسارها", correct: true },
      { en: "Because speed limits are reduced", ar: "لأن حدود السرعة تُخفض", correct: false },
      { en: "Because roads become wider", ar: "لأن الطرق تصبح أوسع", correct: false }
    ],
    keywords: [
      { term: "strong winds", ar: "رياح قوية", explainAr: "الرياح القوية يمكن أن تدفع المركبات عن مسارها، خاصة المركبات الكبيرة أو الخفيفة." },
      { term: "vehicle control", ar: "التحكم بالمركبة", explainAr: "قدرتك على الحفاظ على المركبة في مسارها الصحيح رغم الظروف الخارجية." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت للتفاعل مع التغيرات المفاجئة في حركة المركبات." }
    ]
  },

  {
    id: "SM-3022",
    topic: "safety-margins",
    promptEn: "What is the safest way to judge a safe following distance?",
    promptAr: "ما الطريقة الأكثر أمانًا لتقدير مسافة تتبّع آمنة؟",
    options: [
      { en: "By counting car lengths", ar: "بعدّ أطوال السيارات", correct: false },
      { en: "By using a time-based gap", ar: "باستخدام فجوة زمنية", correct: true },
      { en: "By watching the speedometer", ar: "بمراقبة عداد السرعة", correct: false },
      { en: "By matching the speed of the vehicle ahead", ar: "بمجاراة سرعة المركبة الأمامية", correct: false }
    ],
    keywords: [
      { term: "time gap", ar: "فجوة زمنية", explainAr: "الوقت بين مرور المركبة التي أمامك بنقطة معينة ومرورك أنت بنفس النقطة." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت للتفاعل والتوقف بأمان." },
      { term: "two-second rule", ar: "قاعدة الثانيتين", explainAr: "قاعدة عامة للحفاظ على مسافة أمان آمنة خلف المركبة التي أمامك." }
    ]
  },

  {
    id: "SM-3023",
    topic: "safety-margins",
    promptEn: "When following a vehicle that frequently brakes, what should you do?",
    promptAr: "عند اتباع مركبة تكبح بشكل متكرر، ماذا يجب أن تفعل؟",
    options: [
      { en: "Move closer to reduce gaps", ar: "الاقتراب لتقليل الفجوات", correct: false },
      { en: "Leave a larger gap to allow more reaction time", ar: "ترك مسافة أكبر لإتاحة وقت أطول للتفاعل", correct: true },
      { en: "Overtake immediately", ar: "التجاوز فورًا", correct: false },
      { en: "Sound your horn to warn the driver", ar: "استخدام البوق لتحذير السائق", correct: false }
    ],
    keywords: [
      { term: "frequent braking", ar: "الكبح المتكرر", explainAr: "عندما تكبح المركبة التي أمامك بشكل متكرر وغير متوقع، مما يشير إلى عدم استقرار حركتها." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي يستغرقه السائق لملاحظة الخطر والبدء في الاستجابة." },
      { term: "defensive driving", ar: "القيادة الدفاعية", explainAr: "أسلوب قيادة يركز على توقع المخاطر واتخاذ إجراءات وقائية." }
    ]
  },

  {
    id: "SM-3024",
    topic: "safety-margins",
    promptEn: "Why should you avoid closing the gap too quickly when traffic starts moving?",
    promptAr: "لماذا يجب تجنب تقليل المسافة بسرعة عندما تبدأ حركة المرور بالتحرك؟",
    options: [
      { en: "It increases engine wear", ar: "يزيد من تآكل المحرك", correct: false },
      { en: "It reduces your ability to react if traffic stops again", ar: "يقلل من قدرتك على التفاعل إذا توقفت الحركة مرة أخرى", correct: true },
      { en: "It affects fuel efficiency only", ar: "يؤثر فقط على كفاءة الوقود", correct: false },
      { en: "It blocks other drivers", ar: "يعيق السائقين الآخرين", correct: false }
    ],
    keywords: [
      { term: "traffic flow", ar: "تدفق المرور", explainAr: "حركة المركبات على الطريق، والتي قد تتوقف وتتحرك بشكل متقطع." },
      { term: "reaction", ar: "التفاعل", explainAr: "قدرتك على الاستجابة بسرعة للمواقف المتغيرة على الطريق." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت للتفاعل والتوقف بأمان." }
    ]
  },

  {
    id: "SM-3025",
    topic: "safety-margins",
    promptEn: "When driving on a road with poor visibility ahead, what safety margin should you apply?",
    promptAr: "عند القيادة على طريق ذي رؤية ضعيفة أمامك، ما هامش الأمان الذي يجب تطبيقه؟",
    options: [
      { en: "Drive at the speed limit regardless", ar: "القيادة بسرعة الحد الأقصى بغض النظر", correct: false },
      { en: "Be able to stop within the distance you can see to be clear", ar: "القدرة على التوقف ضمن المسافة التي تستطيع رؤيتها خالية", correct: true },
      { en: "Rely on other vehicles' lights", ar: "الاعتماد على أضواء المركبات الأخرى", correct: false },
      { en: "Maintain the same gap as in clear conditions", ar: "الحفاظ على نفس المسافة كما في الظروف الواضحة", correct: false }
    ],
    keywords: [
      { term: "poor visibility", ar: "رؤية ضعيفة", explainAr: "عندما تكون قدرتك على رؤية الطريق أمامك محدودة بسبب الضباب أو المطر أو الظلام." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة الإجمالية التي تحتاجها السيارة للتوقف تماماً، وتشمل مسافة التفاعل ومسافة الفرملة." },
      { term: "safety rule", ar: "قاعدة الأمان", explainAr: "مبدأ أساسي في القيادة الآمنة: يجب أن تكون قادراً على التوقف ضمن المسافة المرئية." }
    ]
  },

  {
    id: "SM-3026",
    topic: "safety-margins",
    promptEn: "Why should you leave extra space when following a vehicle towing a trailer?",
    promptAr: "لماذا يجب ترك مسافة أمان إضافية عند اتباع مركبة تسحب مقطورة؟",
    options: [
      { en: "Because trailers always travel faster", ar: "لأن المقطورات تسير دائمًا أسرع", correct: false },
      { en: "Because stopping distances can be longer and visibility reduced", ar: "لأن مسافات التوقف قد تكون أطول والرؤية أقل", correct: true },
      { en: "Because trailers are narrower", ar: "لأن المقطورات أضيق", correct: false },
      { en: "Because overtaking is always prohibited", ar: "لأن التجاوز ممنوع دائمًا", correct: false }
    ],
    keywords: [
      { term: "trailers", ar: "المقطورات", explainAr: "مركبات يتم سحبها خلف مركبة أخرى، وتتطلب مسافة توقف أطول." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة الإجمالية التي تحتاجها المركبة والمقطورة للتوقف تماماً." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "المسافة الكافية التي تمنحك الوقت للتفاعل والتوقف بأمان." }
    ]
  },

  {
    id: "SM-3027",
    topic: "safety-margins",
    promptEn: "What is the safest response if traffic ahead starts slowing unexpectedly?",
    promptAr: "ما هو التصرف الأكثر أمانًا إذا بدأت حركة المرور أمامك بالتباطؤ بشكل غير متوقع؟",
    options: [
      { en: "Maintain speed until you are close", ar: "الحفاظ على السرعة حتى تقترب", correct: false },
      { en: "Ease off the accelerator and increase the gap", ar: "رفع القدم عن الوقود وزيادة المسافة", correct: true },
      { en: "Change lanes immediately without checking", ar: "تغيير المسار فورًا دون فحص", correct: false },
      { en: "Sound the horn to alert others", ar: "استخدام البوق لتنبيه الآخرين", correct: false }
    ],
    keywords: [
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع التغييرات في حركة المرور والاستعداد لها مسبقاً." },
      { term: "traffic slowing", ar: "تباطؤ المرور", explainAr: "عندما تبدأ حركة المرور بالتباطؤ بشكل غير متوقع، مما يتطلب رد فعل فوري." },
      { term: "defensive driving", ar: "القيادة الدفاعية", explainAr: "أسلوب قيادة يركز على توقع المخاطر واتخاذ إجراءات وقائية." }
    ]
  },

  {
    id: "SM-3028",
    topic: "safety-margins",
    promptEn: "Why is a larger safety margin needed when roads are covered with fallen leaves?",
    promptAr: "لماذا يلزم هامش أمان أكبر عندما تكون الطرق مغطاة بأوراق متساقطة؟",
    options: [
      { en: "Because leaves improve tyre grip", ar: "لأن الأوراق تحسّن تماسك الإطارات", correct: false },
      { en: "Because wet leaves can be very slippery", ar: "لأن الأوراق المبللة قد تكون زلِقة جدًا", correct: true },
      { en: "Because speed limits are reduced", ar: "لأن حدود السرعة تُخفض", correct: false },
      { en: "Because roads become narrower", ar: "لأن الطرق تصبح أضيق", correct: false }
    ],
    keywords: [
      { term: "fallen leaves", ar: "أوراق متساقطة", explainAr: "أوراق الأشجار التي تسقط على الطريق، خاصة عندما تكون مبللة." },
      { term: "slippery surface", ar: "سطح زلق", explainAr: "سطح الطريق الذي يقلل من تماسك الإطارات ويزيد من مسافة التوقف." },
      { term: "traction", ar: "التماسك", explainAr: "قدرة الإطارات على التمسك بسطح الطريق والتحكم في السيارة." }
    ]
  },

  {
    id: "SM-3029",
    topic: "safety-margins",
    promptEn: "When approaching roadworks, why should you increase your safety margin?",
    promptAr: "عند الاقتراب من أعمال الطرق، لماذا يجب زيادة هامش الأمان؟",
    options: [
      { en: "Because roadworks always mean lower speed limits", ar: "لأن أعمال الطرق تعني دائمًا حدود سرعة أقل", correct: false },
      { en: "Because lanes may narrow and traffic may stop suddenly", ar: "لأن المسارات قد تضيق وقد تتوقف الحركة فجأة", correct: true },
      { en: "Because overtaking is encouraged", ar: "لأن التجاوز مُشجَّع", correct: false },
      { en: "Because visibility always improves", ar: "لأن الرؤية تتحسن دائمًا", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال الطرق", explainAr: "أعمال الصيانة أو البناء على الطريق التي قد تغير تدفق المرور." },
      { term: "lane narrowing", ar: "تضييق المسار", explainAr: "عندما تصبح المسارات أضيق بسبب أعمال الطرق، مما يقلل من مساحة القيادة." },
      { term: "sudden stops", ar: "توقفات مفاجئة", explainAr: "عندما تتوقف حركة المرور فجأة بسبب أعمال الطرق أو إشارات المرور." }
    ]
  },

  {
    id: "SM-3030",
    topic: "safety-margins",
    promptEn: "Why is it important to keep a safe distance when driving in bright sunlight?",
    promptAr: "لماذا من المهم الحفاظ على مسافة آمنة عند القيادة في ضوء الشمس الساطع؟",
    options: [
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because glare can reduce visibility and reaction time", ar: "لأن الوهج قد يقلل الرؤية ووقت التفاعل", correct: true },
      { en: "Because roads become slippery", ar: "لأن الطرق تصبح زلِقة", correct: false },
      { en: "Because traffic is lighter", ar: "لأن حركة المرور تكون أخف", correct: false }
    ],
    keywords: [
      { term: "glare", ar: "الوهج", explainAr: "ضوء الشمس الساطع الذي يقلل من وضوح الرؤية ويجعل من الصعب رؤية الطريق والمركبات الأخرى." },
      { term: "sunlight", ar: "ضوء الشمس", explainAr: "الضوء الطبيعي من الشمس الذي قد يسبب وهجاً ويؤثر على الرؤية." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي يستغرقه السائق لملاحظة الخطر والبدء في الاستجابة." }
    ]
  },

  {
    id: "SM-3031",
    topic: "safety-margins",
    promptEn: "When driving in stop-start traffic, what is the safest way to manage your following distance?",
    promptAr: "عند القيادة في حركة مرور متوقفة ومتقطعة، ما الطريقة الأكثر أمانًا لإدارة مسافة التتبّع؟",
    options: [
      { en: "Close the gap to stop others cutting in", ar: "تقليص المسافة لمنع الآخرين من الدخول", correct: false },
      { en: "Keep a steady gap and move smoothly", ar: "الحفاظ على مسافة ثابتة والتحرك بسلاسة", correct: true },
      { en: "Accelerate quickly whenever traffic moves", ar: "التسارع بسرعة كلما تحرك المرور", correct: false },
      { en: "Rely on hazard warning lights", ar: "الاعتماد على أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "stop-start traffic", ar: "حركة مرور متوقفة ومتقطعة", explainAr: "حالة حركة المرور التي تتوقف وتتحرك بشكل متكرر، عادة في الازدحام." },
      { term: "smooth driving", ar: "القيادة السلسة", explainAr: "أسلوب قيادة يتضمن تسارع وتباطؤ تدريجي بدلاً من الحركات المفاجئة." },
      { term: "safe gap", ar: "مسافة آمنة", explainAr: "المسافة الكافية بين سيارتك والسيارة أمامك للسماح بالتوقف الآمن." }
    ]
  },

  {
    id: "SM-3032",
    topic: "safety-margins",
    promptEn: "Why should you increase your safety margin when driving on unfamiliar roads?",
    promptAr: "لماذا يجب زيادة هامش الأمان عند القيادة على طرق غير مألوفة؟",
    options: [
      { en: "Because speed limits are usually higher", ar: "لأن حدود السرعة تكون عادة أعلى", correct: false },
      { en: "Because hazards and road layouts may be unexpected", ar: "لأن المخاطر وتخطيط الطريق قد يكونان غير متوقعين", correct: true },
      { en: "Because traffic is always heavier", ar: "لأن حركة المرور تكون دائماً أثقل", correct: false },
      { en: "Because road signs are easier to see", ar: "لأن إشارات الطريق أسهل رؤية", correct: false }
    ],
    keywords: [
      { term: "unfamiliar roads", ar: "طرق غير مألوفة", explainAr: "طرق لم تكن قد سافرت عليها من قبل أو لا تعرفها جيداً." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر والاستعداد لها قبل حدوثها." },
      { term: "hazard awareness", ar: "الوعي بالمخاطر", explainAr: "القدرة على التعرف على المخاطر المحتملة على الطريق والاستجابة لها." }
    ]
  },

  {
    id: "SM-3033",
    topic: "safety-margins",
    promptEn: "What is the safest action if the vehicle in front of you is obscured by spray on a wet motorway?",
    promptAr: "ما هو الإجراء الأكثر أمانًا إذا كانت المركبة أمامك محجوبة برذاذ الماء على طريق سريع مبلل؟",
    options: [
      { en: "Move closer to improve visibility", ar: "الاقتراب لتحسين الرؤية", correct: false },
      { en: "Increase the gap until visibility improves", ar: "زيادة المسافة حتى تتحسن الرؤية", correct: true },
      { en: "Switch to full beam headlights", ar: "تشغيل الضوء العالي", correct: false },
      { en: "Overtake immediately", ar: "التجاوز فورًا", correct: false }
    ],
    keywords: [
      { term: "spray", ar: "الرذاذ", explainAr: "قطرات الماء التي تنتشر من المركبات على الطرق المبللة، مما يقلل الرؤية." },
      { term: "wet motorway", ar: "طريق سريع مبلل", explainAr: "طريق سريع مغطى بالماء من المطر أو الظروف الرطبة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الطريق والمركبات الأخرى بوضوح." }
    ]
  },

  {
    id: "SM-3034",
    topic: "safety-margins",
    promptEn: "Why should you leave a greater safety margin when driving while tired?",
    promptAr: "لماذا يجب ترك هامش أمان أكبر عند القيادة أثناء الشعور بالتعب؟",
    options: [
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because reaction times are slower", ar: "لأن زمن التفاعل يصبح أبطأ", correct: true },
      { en: "Because roads become quieter", ar: "لأن الطرق تصبح أهدأ", correct: false },
      { en: "Because headlights are less effective", ar: "لأن الأضواء تصبح أقل فعالية", correct: false }
    ],
    keywords: [
      { term: "tiredness", ar: "التعب", explainAr: "حالة من الإرهاق الجسدي أو العقلي التي تؤثر على قدرة السائق على القيادة بأمان." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي يستغرقه السائق لملاحظة الخطر والبدء في الاستجابة." },
      { term: "driver condition", ar: "حالة السائق", explainAr: "الحالة الجسدية والعقلية للسائق التي تؤثر على قدرته على القيادة بأمان." }
    ]
  },

  {
    id: "SM-3035",
    topic: "safety-margins",
    promptEn: "When approaching a pedestrian crossing with limited visibility, what safety margin should you apply?",
    promptAr: "عند الاقتراب من ممر مشاة مع رؤية محدودة، ما هامش الأمان الذي يجب تطبيقه؟",
    options: [
      { en: "Maintain speed and watch carefully", ar: "الحفاظ على السرعة والانتباه فقط", correct: false },
      { en: "Slow down and be ready to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Sound the horn to warn pedestrians", ar: "استخدام البوق لتحذير المشاة", correct: false },
      { en: "Move closer to the crossing", ar: "الاقتراب أكثر من الممر", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر المشاة", explainAr: "منطقة محددة على الطريق مخصصة لعبور المشاة بأمان." },
      { term: "limited view", ar: "رؤية محدودة", explainAr: "عندما تكون الرؤية غير كاملة بسبب العوائق أو الظروف." },
      { term: "preparedness", ar: "الاستعداد", explainAr: "كونك جاهزاً للاستجابة بسرعة للتغيرات في حركة المرور أو المخاطر." }
    ]
  },

  {
    id: "SM-3036",
    topic: "safety-margins",
    promptEn: "Why should you leave extra space when following a vehicle displaying hazard warning lights?",
    promptAr: "لماذا يجب ترك مسافة إضافية عند اتباع مركبة تشغّل أضواء التحذير؟",
    options: [
      { en: "Because the vehicle may be travelling faster than normal", ar: "لأن المركبة قد تسير أسرع من المعتاد", correct: false },
      { en: "Because the vehicle may slow or stop suddenly", ar: "لأن المركبة قد تُبطئ أو تتوقف فجأة", correct: true },
      { en: "Because overtaking is compulsory", ar: "لأن التجاوز إلزامي", correct: false },
      { en: "Because the road surface is always slippery", ar: "لأن سطح الطريق يكون دائمًا زلقًا", correct: false }
    ],
    keywords: [
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "أضواء برتقالية تومض في نفس الوقت لتحذير السائقين الآخرين من وجود خطر أو مشكلة." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "عندما تتوقف المركبة أمامك فجأة دون سابق إنذار." },
      { term: "safe gap", ar: "مسافة أمان", explainAr: "المسافة الكافية بينك وبين المركبة أمامك للسماح بالتوقف الآمن في حالة الطوارئ." }
    ]
  },

  {
    id: "SM-3037",
    topic: "safety-margins",
    promptEn: "When driving behind a vehicle at night without rear lights, what is the safest response?",
    promptAr: "عند القيادة خلف مركبة ليلاً دون أضواء خلفية، ما التصرف الأكثر أمانًا؟",
    options: [
      { en: "Drive closer so the driver notices you", ar: "الاقتراب ليلاحظك السائق", correct: false },
      { en: "Increase the distance and be prepared to stop", ar: "زيادة المسافة والاستعداد للتوقف", correct: true },
      { en: "Flash your headlights continuously", ar: "وميض الأضواء باستمرار", correct: false },
      { en: "Overtake immediately if possible", ar: "التجاوز فورًا إن أمكن", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "القيادة ليلاً", explainAr: "القيادة في الظلام حيث تكون الرؤية محدودة." },
      { term: "unlit vehicle", ar: "مركبة غير مضاءة", explainAr: "مركبة لا تعمل أضواءها الخلفية، مما يجعلها صعبة الرؤية." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الطريق والمركبات الأخرى بوضوح." }
    ]
  },

  {
    id: "SM-3038",
    topic: "safety-margins",
    promptEn: "Why should you allow a larger safety margin when approaching a bend?",
    promptAr: "لماذا يجب ترك هامش أمان أكبر عند الاقتراب من منعطف؟",
    options: [
      { en: "Because bends always have lower speed limits", ar: "لأن المنعطفات لها دائمًا حدود سرعة أقل", correct: false },
      { en: "Because hazards ahead may not be visible", ar: "لأن المخاطر أمامك قد لا تكون مرئية", correct: true },
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because road markings disappear", ar: "لأن علامات الطريق تختفي", correct: false }
    ],
    keywords: [
      { term: "bends", ar: "منعطفات", explainAr: "منحنيات في الطريق قد تخفي مركبات قادمة أو مشاة." },
      { term: "limited view", ar: "رؤية محدودة", explainAr: "عندما تكون الرؤية غير كاملة بسبب العوائق أو الظروف." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها." }
    ]
  },


  {
    id: "SM-3040",
    topic: "safety-margins",
    promptEn: "When driving in heavy traffic near junctions, why is a larger safety margin important?",
    promptAr: "عند القيادة في ازدحام مروري قرب التقاطعات، لماذا يُعد هامش الأمان الأكبر مهمًا؟",
    options: [
      { en: "Because engines may stall", ar: "لأن المحركات قد تتوقف", correct: false },
      { en: "Because vehicles may change direction or stop suddenly", ar: "لأن المركبات قد تغيّر اتجاهها أو تتوقف فجأة", correct: true },
      { en: "Because road signs are unclear", ar: "لأن إشارات الطريق غير واضحة", correct: false },
      { en: "Because speed limits are reduced", ar: "لأن حدود السرعة تُخفض", correct: false }
    ],
    keywords: [
      { term: "junctions", ar: "التقاطعات", explainAr: "نقاط التقاء طرق متعددة حيث قد تغير المركبات اتجاهها." },
      { term: "heavy traffic", ar: "ازدحام مروري", explainAr: "حالة يكون فيها عدد كبير من المركبات على الطريق في نفس الوقت." },
      { term: "sudden manoeuvres", ar: "مناورات مفاجئة", explainAr: "تغييرات مفاجئة في الاتجاه أو السرعة من قبل المركبات الأخرى." }
    ]
  },

  {
    id: "SM-3041",
    topic: "safety-margins",
    promptEn: "Why should you increase your safety margin when driving behind a bus?",
    promptAr: "لماذا يجب زيادة هامش الأمان عند القيادة خلف حافلة؟",
    options: [
      { en: "Because buses always travel faster", ar: "لأن الحافلات تسير دائمًا أسرع", correct: false },
      { en: "Because buses may stop frequently and unexpectedly", ar: "لأن الحافلات قد تتوقف بشكل متكرر ومفاجئ", correct: true },
      { en: "Because buses have better brakes", ar: "لأن الحافلات تمتلك فرامل أفضل", correct: false },
      { en: "Because overtaking buses is prohibited", ar: "لأن تجاوز الحافلات ممنوع", correct: false }
    ],
    keywords: [
      { term: "bus", ar: "حافلة", explainAr: "مركبة كبيرة تنقل الركاب وقد تتوقف بشكل متكرر." },
      { term: "frequent stops", ar: "توقفات متكررة", explainAr: "توقف المركبة عدة مرات لركوب أو نزول الركاب." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة أمامك للتفاعل بأمان." }
    ]
  },

  {
    id: "SM-3042",
    topic: "safety-margins",
    promptEn: "What safety margin should you allow when driving on a narrow road?",
    promptAr: "ما هامش الأمان الذي يجب تركه عند القيادة على طريق ضيق؟",
    options: [
      { en: "Drive close to other vehicles to avoid delays", ar: "الاقتراب من المركبات الأخرى لتجنب التأخير", correct: false },
      { en: "Allow extra space in case oncoming traffic appears", ar: "ترك مساحة إضافية في حال ظهور حركة مرور معاكسة", correct: true },
      { en: "Increase speed to clear the road quickly", ar: "زيادة السرعة لعبور الطريق بسرعة", correct: false },
      { en: "Rely on the horn to warn others", ar: "الاعتماد على البوق لتحذير الآخرين", correct: false }
    ],
    keywords: [
      { term: "narrow road", ar: "طريق ضيق", explainAr: "طريق بمساحة محدودة قد لا يتسع لمركبتين بسهولة." },
      { term: "oncoming traffic", ar: "حركة مرور معاكسة", explainAr: "المركبات القادمة من الاتجاه المعاكس." },
      { term: "space", ar: "مساحة", explainAr: "المسافة والمساحة المتاحة للقيادة بأمان." }
    ]
  },

  {
    id: "SM-3043",
    topic: "safety-margins",
    promptEn: "Why is it important to keep a safety margin when approaching parked vehicles?",
    promptAr: "لماذا من المهم الحفاظ على هامش أمان عند الاقتراب من مركبات متوقفة؟",
    options: [
      { en: "Because parked vehicles reduce speed limits", ar: "لأن المركبات المتوقفة تقلل حدود السرعة", correct: false },
      { en: "Because doors may open or pedestrians may step out", ar: "لأن الأبواب قد تُفتح أو قد يخرج مشاة فجأة", correct: true },
      { en: "Because road signs may be hidden", ar: "لأن إشارات الطريق قد تكون مخفية", correct: false },
      { en: "Because parking is always temporary", ar: "لأن الوقوف يكون دائمًا مؤقتًا", correct: false }
    ],
    keywords: [
      { term: "parked vehicles", ar: "مركبات متوقفة", explainAr: "المركبات المتوقفة على جانب الطريق." },
      { term: "door opening", ar: "فتح الباب", explainAr: "إمكانية فتح باب المركبة المتوقفة فجأة." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام وقد يظهرون فجأة من خلف المركبات المتوقفة." }
    ]
  },


  {
    id: "SM-3045",
    topic: "safety-margins",
    promptEn: "What is the safest action if your safety margin suddenly reduces?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا تقلّص هامش الأمان أمامك فجأة؟",
    options: [
      { en: "Accelerate to restore distance", ar: "التسارع لاستعادة المسافة", correct: false },
      { en: "Brake sharply to regain control", ar: "الكبح بقوة لاستعادة السيطرة", correct: false },
      { en: "Ease off and re-establish a safe gap smoothly", ar: "التخفيف تدريجيًا وإعادة إنشاء مسافة أمان بسلاسة", correct: true },
      { en: "Sound the horn to alert other drivers", ar: "استخدام البوق لتنبيه السائقين الآخرين", correct: false }
    ],
    keywords: [
      { term: "safe gap", ar: "مسافة أمان", explainAr: "المسافة الآمنة بينك وبين المركبة أمامك." },
      { term: "smooth driving", ar: "قيادة سلسة", explainAr: "القيادة بسلاسة دون حركات مفاجئة أو عنيفة." },
      { term: "control", ar: "سيطرة", explainAr: "القدرة على التحكم في المركبة بشكل آمن." }
    ]
  },

  {
    id: "SM-3046",
    topic: "safety-margins",
    promptEn: "Why should you increase your safety margin when driving in mist or light fog?",
    promptAr: "لماذا يجب زيادة هامش الأمان عند القيادة في ضباب خفيف أو غشاوة؟",
    options: [
      { en: "Because speed limits are higher", ar: "لأن حدود السرعة تكون أعلى", correct: false },
      { en: "Because visibility is reduced and hazards appear later", ar: "لأن الرؤية أقل وتظهر المخاطر متأخرة", correct: true },
      { en: "Because roads are quieter", ar: "لأن الطرق تكون أهدأ", correct: false },
      { en: "Because headlights are more powerful", ar: "لأن الأضواء أقوى", correct: false }
    ],
    keywords: [
      { term: "mist", ar: "ضباب خفيف", explainAr: "ظروف الطقس التي تقلل الرؤية بشكل معتدل." },
      { term: "light fog", ar: "غشاوة", explainAr: "ضباب خفيف يقلل من وضوح الرؤية على الطريق." },
      { term: "visibility", ar: "الرؤية", explainAr: "قدرتك على رؤية الطريق والمركبات الأخرى بوضوح." }
    ]
  },

  {
    id: "SM-3047",
    topic: "safety-margins",
    promptEn: "When driving behind a vehicle that frequently signals and changes lanes, what should you do?",
    promptAr: "عند القيادة خلف مركبة تغيّر المسارات كثيرًا وتستخدم الإشارات باستمرار، ماذا يجب أن تفعل؟",
    options: [
      { en: "Move closer to prevent lane changes", ar: "الاقتراب لمنع تغيير المسار", correct: false },
      { en: "Leave extra space and anticipate sudden manoeuvres", ar: "ترك مسافة إضافية وتوقّع مناورات مفاجئة", correct: true },
      { en: "Overtake as soon as possible", ar: "التجاوز بأسرع وقت", correct: false },
      { en: "Sound the horn to warn the driver", ar: "استخدام البوق لتحذير السائق", correct: false }
    ],
    keywords: [
      { term: "lane changes", ar: "تغيير المسارات", explainAr: "الانتقال من مسار إلى آخر على الطريق." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر والاستعداد لها قبل حدوثها." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة أمامك للاستجابة بأمان." }
    ]
  },

  {
    id: "SM-3048",
    topic: "safety-margins",
    promptEn: "Why is a larger safety margin needed when approaching areas with pedestrians nearby?",
    promptAr: "لماذا يلزم هامش أمان أكبر عند الاقتراب من مناطق يوجد فيها مشاة؟",
    options: [
      { en: "Because pedestrians always wait", ar: "لأن المشاة ينتظرون دائمًا", correct: false },
      { en: "Because pedestrians may step into the road unexpectedly", ar: "لأن المشاة قد يخطون إلى الطريق بشكل مفاجئ", correct: true },
      { en: "Because speed limits do not apply", ar: "لأن حدود السرعة لا تنطبق", correct: false },
      { en: "Because vehicles stop automatically", ar: "لأن المركبات تتوقف تلقائيًا", correct: false }
    ],
    keywords: [
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام وقد يظهرون فجأة على الطريق." },
      { term: "urban areas", ar: "مناطق حضرية", explainAr: "المناطق المأهولة بالسكان حيث يوجد مشاة وحركة مرور كثيفة." },
      { term: "unexpected hazards", ar: "مخاطر غير متوقعة", explainAr: "المواقف الخطرة التي قد تظهر فجأة دون سابق إنذار." }
    ]
  },

  {
    id: "SM-3049",
    topic: "safety-margins",
    promptEn: "When driving on a road with changing speed limits, how can a safe margin help?",
    promptAr: "عند القيادة على طريق تتغيّر فيه حدود السرعة، كيف يساعد هامش الأمان؟",
    options: [
      { en: "It allows you to ignore speed signs", ar: "يسمح لك بتجاهل إشارات السرعة", correct: false },
      { en: "It gives you time to adjust speed smoothly", ar: "يمنحك وقتًا لتعديل السرعة بسلاسة", correct: true },
      { en: "It increases fuel consumption", ar: "يزيد من استهلاك الوقود", correct: false },
      { en: "It prevents other drivers overtaking", ar: "يمنع السائقين الآخرين من التجاوز", correct: false }
    ],
    keywords: [
      { term: "speed limits", ar: "حدود السرعة", explainAr: "الحد الأقصى للسرعة المسموح بها على الطريق." },
      { term: "adjustment", ar: "تعديل", explainAr: "تغيير السرعة بشكل تدريجي وآمن." },
      { term: "smooth driving", ar: "قيادة سلسة", explainAr: "القيادة بسلاسة دون حركات مفاجئة أو عنيفة." }
    ]
  },

  {
    id: "SM-3050",
    topic: "safety-margins",
    promptEn: "What is the main purpose of maintaining safety margins at all times?",
    promptAr: "ما الهدف الرئيسي من الحفاظ على هوامش الأمان في جميع الأوقات؟",
    options: [
      { en: "To reduce journey time", ar: "لتقليل زمن الرحلة", correct: false },
      { en: "To give yourself time and space to react safely", ar: "لمنح نفسك الوقت والمساحة للتصرف بأمان", correct: true },
      { en: "To improve fuel economy only", ar: "لتحسين اقتصاد الوقود فقط", correct: false },
      { en: "To avoid traffic fines", ar: "لتجنب المخالفات المرورية", correct: false }
    ],
    keywords: [
      { term: "safety margins", ar: "هوامش الأمان", explainAr: "المسافة والوقت الكافيان للاستجابة بأمان للمخاطر." },
      { term: "reaction time", ar: "وقت التفاعل", explainAr: "الوقت الذي تحتاجه للاستجابة للموقف المفاجئ." },
      { term: "space", ar: "مساحة", explainAr: "المسافة والمساحة المتاحة للقيادة بأمان." }
    ]
  },

  // --- MOTORWAY DRIVING (Additional Questions) ---

  {
    id: "MW-4001",
    topic: "motorway-driving",
    promptEn: "When joining a motorway, what is the safest way to use the slip road?",
    promptAr: "عند الانضمام إلى طريق سريع، ما الطريقة الأكثر أمانًا لاستخدام طريق الدخول (Slip Road)؟",
    options: [
      { en: "Stop at the end of the slip road", ar: "التوقف عند نهاية طريق الدخول", correct: false },
      { en: "Build up speed to match the traffic on the motorway", ar: "زيادة السرعة لتتوافق مع حركة المرور على الطريق السريع", correct: true },
      { en: "Join at a slow speed and accelerate later", ar: "الدخول بسرعة منخفضة ثم التسارع لاحقًا", correct: false },
      { en: "Use hazard lights when joining", ar: "استخدام أضواء التحذير عند الدخول", correct: false }
    ],
    keywords: [
      { term: "slip road", ar: "طريق الدخول", explainAr: "المسار الذي تستخدمه للدخول إلى الطريق السريع." },
      { term: "joining motorway", ar: "الانضمام إلى الطريق السريع", explainAr: "عملية الدخول إلى الطريق السريع من طريق فرعي." },
      { term: "matching speed", ar: "تطابق السرعة", explainAr: "ضبط سرعتك لتتوافق مع سرعة المركبات على الطريق السريع." }
    ]
  },

  {
    id: "MW-4002",
    topic: "motorway-driving",
    promptEn: "Which lane should you normally use when driving on a motorway?",
    promptAr: "أي مسار يجب استخدامه عادةً عند القيادة على الطريق السريع؟",
    options: [
      { en: "The right-hand lane", ar: "المسار الأيمن", correct: false },
      { en: "The middle lane", ar: "المسار الأوسط", correct: false },
      { en: "The left-hand lane unless overtaking", ar: "المسار الأيسر إلا عند التجاوز", correct: true },
      { en: "Any lane that appears clear", ar: "أي مسار يبدو خاليًا", correct: false }
    ],
    keywords: [
      { term: "lane discipline", ar: "انضباط المسار", explainAr: "استخدام المسار الصحيح وفقًا للقواعد المرورية." },
      { term: "left lane", ar: "المسار الأيسر", explainAr: "المسار الأساسي للسير العادي على الطريق السريع." },
      { term: "overtaking", ar: "التجاوز", explainAr: "تجاوز مركبة أخرى باستخدام المسار الأيمن." }
    ]
  },

  {
    id: "MW-4003",
    topic: "motorway-driving",
    promptEn: "After completing an overtake on a motorway, what should you do?",
    promptAr: "بعد إكمال التجاوز على الطريق السريع، ماذا يجب أن تفعل؟",
    options: [
      { en: "Return to the left-hand lane when safe", ar: "العودة إلى المسار الأيسر عندما يكون ذلك آمناً", correct: true },
      { en: "Stay in the right-hand lane", ar: "البقاء في المسار الأيمن", correct: false },
      { en: "Move to the middle lane immediately", ar: "الانتقال إلى المسار الأوسط فوراً", correct: false },
      { en: "Continue in any lane you prefer", ar: "المتابعة في أي مسار تفضله", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "تجاوز مركبة أخرى باستخدام المسار الأيمن." },
      { term: "lane discipline", ar: "انضباط المسار", explainAr: "استخدام المسار الصحيح وفقًا للقواعد المرورية." },
      { term: "left lane", ar: "المسار الأيسر", explainAr: "المسار الأساسي للسير العادي على الطريق السريع." }
    ]
  },

  {
    id: "MW-4004",
    topic: "motorway-driving",
    promptEn: "When may you use the hard shoulder on a motorway?",
    promptAr: "متى يُسمح باستخدام كتف الطريق (Hard Shoulder) على الطريق السريع؟",
    options: [
      { en: "To answer a mobile phone", ar: "للرد على الهاتف المحمول", correct: false },
      { en: "To rest when feeling tired", ar: "للراحة عند الشعور بالتعب", correct: false },
      { en: "In an emergency or breakdown", ar: "في حالة طوارئ أو عطل", correct: true },
      { en: "When traffic is heavy", ar: "عند ازدحام المرور", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "المسار الجانبي المخصص لحالات الطوارئ فقط." },
      { term: "emergency", ar: "طوارئ", explainAr: "حالة خطيرة تتطلب توقف فوري." },
      { term: "breakdown", ar: "عطل", explainAr: "عطل ميكانيكي في المركبة يمنعها من الاستمرار." }
    ]
  },

  {
    id: "MW-4005",
    topic: "motorway-driving",
    promptEn: "Why is it important to check mirrors and blind spots before changing lanes on a motorway?",
    promptAr: "لماذا من المهم فحص المرايا والنقاط العمياء قبل تغيير المسار على الطريق السريع؟",
    options: [
      { en: "Because lanes are narrower", ar: "لأن المسارات أضيق", correct: false },
      { en: "Because vehicles may be travelling at high speed", ar: "لأن المركبات قد تسير بسرعات عالية", correct: true },
      { en: "Because indicators are optional", ar: "لأن الإشارات اختيارية", correct: false },
      { en: "Because speed limits change", ar: "لأن حدود السرعة تتغير", correct: false }
    ],
    keywords: [
      { term: "lane change", ar: "تغيير المسار", explainAr: "الانتقال من مسار إلى آخر على الطريق." },
      { term: "blind spot", ar: "النقطة العمياء", explainAr: "منطقة لا تظهر في المرايا ويجب فحصها بالتفاتة سريعة." },
      { term: "high speed", ar: "سرعة عالية", explainAr: "السرعات العالية على الطرق السريعة تتطلب حذر أكبر." }
    ]
  },

  {
    id: "MW-4006",
    topic: "motorway-driving",
    promptEn: "What is the national speed limit for cars on a motorway unless signs show otherwise?",
    promptAr: "ما هو حد السرعة الوطني للسيارات على الطريق السريع ما لم تُظهر الإشارات خلاف ذلك؟",
    options: [
      { en: "60 mph", ar: "60 ميل/ساعة", correct: false },
      { en: "65 mph", ar: "65 ميل/ساعة", correct: false },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: true },
      { en: "75 mph", ar: "75 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "speed limit", ar: "حد السرعة", explainAr: "الحد الأقصى للسرعة المسموح بها قانونيًا على الطريق." },
      { term: "motorway", ar: "طريق سريع", explainAr: "طريق رئيسي متعدد المسارات للحركة السريعة." },
      { term: "national speed", ar: "السرعة الوطنية", explainAr: "حد السرعة القياسي المطبق على الطرق السريعة." }
    ]
  },

  {
    id: "MW-4007",
    topic: "motorway-driving",
    promptEn: "What should you do if your vehicle breaks down on the motorway?",
    promptAr: "ماذا يجب أن تفعل إذا تعطلت مركبتك على الطريق السريع؟",
    options: [
      { en: "Stop in your lane and switch on hazard lights", ar: "التوقف في مسارك وتشغيل أضواء التحذير", correct: false },
      { en: "Pull onto the hard shoulder and leave the vehicle if safe", ar: "الانتقال إلى كتف الطريق ومغادرة المركبة إذا كان آمنًا", correct: true },
      { en: "Attempt to repair the vehicle in your lane", ar: "محاولة إصلاح المركبة في المسار", correct: false },
      { en: "Reverse to the nearest exit", ar: "الرجوع للخلف إلى أقرب مخرج", correct: false }
    ],
    keywords: [
      { term: "breakdown", ar: "عطل", explainAr: "عطل ميكانيكي يمنع المركبة من الاستمرار في السير." },
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "المسار الجانبي المخصص لحالات الطوارئ فقط." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على سلامتك وسلامة الآخرين على الطريق." }
    ]
  },

  {
    id: "MW-4008",
    topic: "motorway-driving",
    promptEn: "Why should you keep well back from the vehicle in front when driving on a motorway?",
    promptAr: "لماذا يجب الحفاظ على مسافة كبيرة خلف المركبة التي أمامك عند القيادة على الطريق السريع؟",
    options: [
      { en: "Because fuel consumption is lower", ar: "لأن استهلاك الوقود أقل", correct: false },
      { en: "Because stopping distances are longer at high speeds", ar: "لأن مسافات التوقف أطول عند السرعات العالية", correct: true },
      { en: "Because overtaking is easier", ar: "لأن التجاوز أسهل", correct: false },
      { en: "Because road signs are clearer", ar: "لأن إشارات الطريق أوضح", correct: false }
    ],
    keywords: [
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها خلف المركبة الأمامية." },
      { term: "high speed", ar: "سرعة عالية", explainAr: "السرعات العالية على الطرق السريعة تتطلب مسافات توقف أطول." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة الكلية اللازمة لإيقاف المركبة بأمان." }
    ]
  },

  {
    id: "MW-4009",
    topic: "motorway-driving",
    promptEn: "When may you overtake on the left on a motorway?",
    promptAr: "متى يُسمح بالتجاوز من اليسار على الطريق السريع؟",
    options: [
      { en: "At any time if traffic is moving", ar: "في أي وقت إذا كانت حركة المرور تتحرك", correct: false },
      { en: "When traffic in the right-hand lanes is moving more slowly in queues", ar: "عندما تكون حركة المرور في المسارات اليمنى أبطأ في طوابير", correct: true },
      { en: "When driving above the speed limit", ar: "عند القيادة فوق حد السرعة", correct: false },
      { en: "When using the hard shoulder", ar: "عند استخدام كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "undertaking", ar: "التجاوز من اليسار", explainAr: "تجاوز مركبة من الجانب الأيسر، مسموح فقط في حالات محددة." },
      { term: "left lane", ar: "المسار الأيسر", explainAr: "المسار الأساسي للسير العادي على الطريق السريع." },
      { term: "queues", ar: "طوابير", explainAr: "صفوف من المركبات تتحرك ببطء أو متوقفة." }
    ]
  },

  {
    id: "MW-4010",
    topic: "motorway-driving",
    promptEn: "What does a red cross above a motorway lane indicate?",
    promptAr: "ماذا يشير وجود علامة صليب أحمر فوق أحد مسارات الطريق السريع؟",
    options: [
      { en: "Lane open but slow", ar: "المسار مفتوح ولكن بطيء", correct: false },
      { en: "Lane closed to traffic", ar: "المسار مغلق أمام المرور", correct: true },
      { en: "Use lane for emergencies only", ar: "استخدام المسار للطوارئ فقط", correct: false },
      { en: "End of speed restriction", ar: "نهاية قيود السرعة", correct: false }
    ],
    keywords: [
      { term: "red cross", ar: "صليب أحمر", explainAr: "علامة تشير إلى أن المسار مغلق ولا يجب استخدامه." },
      { term: "lane closed", ar: "مسار مغلق", explainAr: "مسار غير متاح للاستخدام بسبب أعمال صيانة أو حادث." },
      { term: "smart motorway", ar: "طريق سريع ذكي", explainAr: "طريق سريع يستخدم إشارات ديناميكية للتحكم في حركة المرور." }
    ]
  },

  {
    id: "MW-4011",
    topic: "motorway-driving",
    promptEn: "What should you do if traffic on a motorway suddenly slows or stops ahead?",
    promptAr: "ماذا يجب أن تفعل إذا تباطأت حركة المرور أو توقفت فجأة أمامك على الطريق السريع؟",
    options: [
      { en: "Brake sharply without warning", ar: "الكبح بقوة دون تحذير", correct: false },
      { en: "Use hazard warning lights briefly to warn traffic behind", ar: "استخدام أضواء التحذير لفترة قصيرة لتنبيه المرور خلفك", correct: true },
      { en: "Move onto the hard shoulder immediately", ar: "الانتقال فورًا إلى كتف الطريق", correct: false },
      { en: "Sound the horn continuously", ar: "استخدام البوق باستمرار", correct: false }
    ],
    keywords: [
      { term: "sudden congestion", ar: "ازدحام مفاجئ", explainAr: "تباطؤ أو توقف غير متوقع لحركة المرور على الطريق." },
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "أضواء تتحذير تستخدم لتنبيه السائقين الآخرين إلى خطر أو موقف طارئ." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "ممارسات القيادة الآمنة على الطرق السريعة عالية السرعة." }
    ]
  },

  {
    id: "MW-4012",
    topic: "motorway-driving",
    promptEn: "Why should you avoid driving alongside another vehicle for long periods on a motorway?",
    promptAr: "لماذا يجب تجنب القيادة بمحاذاة مركبة أخرى لفترة طويلة على الطريق السريع؟",
    options: [
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because it reduces escape routes if a hazard occurs", ar: "لأنه يقلل من طرق الهروب إذا ظهر خطر", correct: true },
      { en: "Because it is illegal", ar: "لأنه غير قانوني", correct: false },
      { en: "Because it blocks road signs", ar: "لأنه يحجب إشارات الطريق", correct: false }
    ],
    keywords: [
      { term: "lane discipline", ar: "انضباط المسار", explainAr: "الحفاظ على المسار الصحيح وتجنب القيادة بجانب مركبات أخرى." },
      { term: "escape routes", ar: "طرق الهروب", explainAr: "المسارات المتاحة للتحرك بعيدًا عن الخطر في حالة الطوارئ." },
      { term: "motorway driving", ar: "القيادة على الطريق السريع", explainAr: "مهارات وممارسات القيادة على الطرق السريعة متعددة المسارات." }
    ]
  },

  {
    id: "MW-4013",
    topic: "motorway-driving",
    promptEn: "What should you do before rejoining the motorway after stopping on the hard shoulder?",
    promptAr: "ماذا يجب أن تفعل قبل العودة إلى الطريق السريع بعد التوقف على كتف الطريق؟",
    options: [
      { en: "Join immediately at low speed", ar: "الدخول فورًا بسرعة منخفضة", correct: false },
      { en: "Build up speed on the hard shoulder and look for a safe gap", ar: "زيادة السرعة على كتف الطريق والبحث عن فجوة آمنة", correct: true },
      { en: "Wait for another driver to signal you in", ar: "الانتظار حتى يشير لك سائق آخر بالدخول", correct: false },
      { en: "Use hazard lights while rejoining", ar: "استخدام أضواء التحذير أثناء الدخول", correct: false }
    ],
    keywords: [
      { term: "rejoining motorway", ar: "العودة إلى الطريق السريع", explainAr: "الانضمام مرة أخرى إلى حركة المرور على الطريق السريع بعد التوقف." },
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "المسار الجانبي المخصص لحالات الطوارئ فقط، وليس للقيادة العادية." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "مسافة كافية بين المركبات للانضمام بأمان إلى حركة المرور." }
    ]
  },

  {
    id: "MW-4014",
    topic: "motorway-driving",
    promptEn: "Why should you check overhead gantry signals regularly on smart motorways?",
    promptAr: "لماذا يجب فحص إشارات الجسور العلوية بانتظام على الطرق السريعة الذكية؟",
    options: [
      { en: "Because they only show speed limits", ar: "لأنها تُظهر حدود السرعة فقط", correct: false },
      { en: "Because lane closures or hazards may be shown", ar: "لأنها قد تُظهر إغلاق مسارات أو مخاطر", correct: true },
      { en: "Because they replace road markings", ar: "لأنها تستبدل علامات الطريق", correct: false },
      { en: "Because mirrors are not needed", ar: "لأن المرايا ليست ضرورية", correct: false }
    ],
    keywords: [
      { term: "smart motorway", ar: "طريق سريع ذكي", explainAr: "طريق سريع يستخدم إشارات ديناميكية للتحكم في حركة المرور والسرعة." },
      { term: "gantry signals", ar: "إشارات الجسور العلوية", explainAr: "لوحات إلكترونية معلقة فوق الطريق تعرض معلومات مهمة عن السرعة وإغلاق المسارات." },
      { term: "lane control", ar: "التحكم في المسارات", explainAr: "نظام إدارة المسارات ديناميكيًا لتحسين تدفق المرور والسلامة." }
    ]
  },

  {
    id: "MW-4015",
    topic: "motorway-driving",
    promptEn: "When driving on a motorway in heavy rain, how should you adjust your driving?",
    promptAr: "عند القيادة على الطريق السريع في أمطار غزيرة، كيف يجب أن تعدّل قيادتك؟",
    options: [
      { en: "Maintain speed to avoid spray", ar: "الحفاظ على السرعة لتجنب الرذاذ", correct: false },
      { en: "Increase following distance and reduce speed", ar: "زيادة مسافة التتبّع وتخفيف السرعة", correct: true },
      { en: "Use the hard shoulder if visibility is poor", ar: "استخدام كتف الطريق إذا كانت الرؤية ضعيفة", correct: false },
      { en: "Overtake slower vehicles quickly", ar: "تجاوز المركبات الأبطأ بسرعة", correct: false }
    ],
    keywords: [
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "هطول مطر شديد يقلل من الرؤية والالتصاق بالطريق." },
      { term: "spray", ar: "الرذاذ", explainAr: "رذاذ الماء الذي تثيره المركبات على الطريق المبتل، مما يقلل الرؤية." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "ممارسات القيادة الآمنة على الطرق السريعة، خاصة في الظروف الجوية السيئة." }
    ]
  },

  {
    id: "MW-4016",
    topic: "motorway-driving",
    promptEn: "What do amber reflective studs on a motorway indicate?",
    promptAr: "ماذا تشير العواكس الضوئية الكهرمانية على الطريق السريع؟",
    options: [
      { en: "The left edge between lane and hard shoulder", ar: "الحافة اليسرى بين المسار والكتف", correct: false },
      { en: "Lane divisions between motorway lanes", ar: "الفواصل بين مسارات الطريق السريع", correct: false },
      { en: "The right edge of the carriageway near the central reservation", ar: "الحافة اليمنى للطريق قرب الجزيرة الوسطية", correct: true },
      { en: "Slip road entry or exit points", ar: "مداخل أو مخارج طرق الانضمام", correct: false }
    ],
    keywords: [
      { term: "reflective studs", ar: "العواكس الضوئية", explainAr: "علامات عاكسة على سطح الطريق تساعد في تحديد المسارات في الظلام أو الأحوال الجوية السيئة." },
      { term: "amber studs", ar: "العواكس الكهرمانية", explainAr: "عواكس ضوئية بلون كهرماني تشير إلى الحافة اليمنى للطريق قرب الجزيرة الوسطية." },
      { term: "central reservation", ar: "الجزيرة الوسطية", explainAr: "الحاجز الذي يفصل بين اتجاهي السير على الطريق السريع." }
    ]
  },

  {
    id: "MW-4017",
    topic: "motorway-driving",
    promptEn: "When approaching roadworks on a motorway, what should you do first?",
    promptAr: "عند الاقتراب من أعمال طرق على الطريق السريع، ما أول إجراء يجب القيام به؟",
    options: [
      { en: "Change lanes suddenly to avoid delays", ar: "تغيير المسار فجأة لتجنب التأخير", correct: false },
      { en: "Check mirrors and reduce speed early", ar: "فحص المرايا وتخفيف السرعة مبكرًا", correct: true },
      { en: "Use the hard shoulder to pass traffic", ar: "استخدام كتف الطريق لتجاوز المرور", correct: false },
      { en: "Ignore temporary speed limits", ar: "تجاهل حدود السرعة المؤقتة", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال الطرق", explainAr: "أعمال صيانة أو بناء على الطريق تتطلب توخي الحذر والالتزام بحدود السرعة المؤقتة." },
      { term: "temporary limits", ar: "حدود السرعة المؤقتة", explainAr: "قيود سرعة مؤقتة تُفرض أثناء أعمال الطرق لضمان سلامة العمال والمركبات." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع التغييرات في حركة المرور والاستعداد لها مبكرًا." }
    ]
  },

  {
    id: "MW-4018",
    topic: "motorway-driving",
    promptEn: "Why should you avoid stopping on the hard shoulder unless it is an emergency?",
    promptAr: "لماذا يجب تجنب التوقف على كتف الطريق إلا في حالة طوارئ؟",
    options: [
      { en: "Because it is uncomfortable", ar: "لأنه غير مريح", correct: false },
      { en: "Because it is dangerous and for emergencies only", ar: "لأنه خطير ومخصص للطوارئ فقط", correct: true },
      { en: "Because fuel consumption increases", ar: "لأن استهلاك الوقود يزداد", correct: false },
      { en: "Because it blocks emergency phones", ar: "لأنه يعيق هواتف الطوارئ", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "المسار الجانبي المخصص لحالات الطوارئ فقط، وليس للاستخدام العادي أو التوقف غير الضروري." },
      { term: "emergency use", ar: "الاستخدام في الطوارئ", explainAr: "استخدام كتف الطريق فقط في حالات الطوارئ الحقيقية مثل الأعطال الميكانيكية أو الحوادث." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "ممارسات القيادة الآمنة على الطرق السريعة لحماية نفسك والآخرين." }
    ]
  },

  {
    id: "MW-4019",
    topic: "motorway-driving",
    promptEn: "If your vehicle breaks down on a smart motorway and you cannot reach a refuge area, what should you do?",
    promptAr: "إذا تعطلت مركبتك على طريق سريع ذكي ولم تتمكن من الوصول إلى منطقة ملجأ، ماذا يجب أن تفعل؟",
    options: [
      { en: "Stop in the left-hand lane, switch on hazard lights, and exit the vehicle safely", ar: "التوقف في المسار الأيسر وتشغيل أضواء التحذير ومغادرة المركبة بأمان", correct: true },
      { en: "Continue driving slowly to find a refuge area", ar: "متابعة القيادة ببطء للعثور على منطقة ملجأ", correct: false },
      { en: "Stop in any lane and wait for help", ar: "التوقف في أي مسار والانتظار للمساعدة", correct: false },
      { en: "Reverse to the nearest exit", ar: "الرجوع للخلف إلى أقرب مخرج", correct: false }
    ],
    keywords: [
      { term: "breakdown", ar: "عطل", explainAr: "عطل ميكانيكي يمنع المركبة من الاستمرار في السير." },
      { term: "refuge area", ar: "منطقة الملجأ", explainAr: "منطقة آمنة على الطريق السريع الذكي للوقوف في حالات الطوارئ." },
      { term: "smart motorway", ar: "الطريق السريع الذكي", explainAr: "طريق سريع يستخدم إشارات إلكترونية للتحكم في المسارات وقد لا يحتوي على كتف تقليدي." }
    ]
  },

  {
    id: "MW-4020",
    topic: "motorway-driving",
    promptEn: "Why is it important to signal in good time before leaving a motorway?",
    promptAr: "لماذا من المهم استخدام الإشارة في وقت مناسب قبل مغادرة الطريق السريع؟",
    options: [
      { en: "Because it reduces fuel consumption", ar: "لأنه يقلل استهلاك الوقود", correct: false },
      { en: "Because it helps other drivers anticipate your actions", ar: "لأنه يساعد السائقين الآخرين على توقّع تصرفاتك", correct: true },
      { en: "Because it is optional on motorways", ar: "لأنه اختياري على الطرق السريعة", correct: false },
      { en: "Because lane markings are unclear", ar: "لأن علامات المسارات غير واضحة", correct: false }
    ],
    keywords: [
      { term: "leaving motorway", ar: "مغادرة الطريق السريع", explainAr: "الخروج من الطريق السريع إلى طريق عادي أو منطقة خدمة." },
      { term: "signalling", ar: "الإشارة", explainAr: "استخدام إشارات الانعطاف لإعلام السائقين الآخرين بنيتك في تغيير الاتجاه أو المسار." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع تصرفات السائقين الآخرين والاستعداد لها، مما يحسن السلامة على الطريق." }
    ]
  },

  {
    id: "MW-4021",
    topic: "motorway-driving",
    promptEn: "What do green reflective studs on a motorway indicate?",
    promptAr: "ماذا تشير العواكس الضوئية الخضراء على الطريق السريع؟",
    options: [
      { en: "Slip road entry or exit points", ar: "مداخل أو مخارج طرق الانضمام", correct: true },
      { en: "The edge of the carriageway", ar: "حافة الطريق", correct: false },
      { en: "The central reservation", ar: "الجزيرة الوسطية", correct: false },
      { en: "Lane closures ahead", ar: "إغلاق مسارات أمامك", correct: false }
    ],
    keywords: [
      { term: "green studs", ar: "العواكس الضوئية الخضراء", explainAr: "عواكس ضوئية خضراء تستخدم لتحديد مواقع مداخل ومخارج طرق الانضمام على الطريق السريع." },
      { term: "slip road", ar: "طريق الانضمام", explainAr: "طريق جانبي يسمح بالانضمام إلى الطريق السريع أو الخروج منه." },
      { term: "motorway markings", ar: "علامات الطريق السريع", explainAr: "العلامات والعواكس الضوئية المستخدمة لتوجيه السائقين على الطرق السريعة." }
    ]
  },

  {
    id: "MW-4022",
    topic: "motorway-driving",
    promptEn: "When driving in fog on a motorway, what should you do to reduce the risk of a collision?",
    promptAr: "عند القيادة في الضباب على الطريق السريع، ماذا يجب أن تفعل لتقليل خطر الاصطدام؟",
    options: [
      { en: "Follow the rear lights of the vehicle ahead closely", ar: "اتباع الأضواء الخلفية للمركبة الأمامية عن قرب", correct: false },
      { en: "Increase your following distance and reduce speed", ar: "زيادة مسافة التتبّع وتخفيف السرعة", correct: true },
      { en: "Use full beam headlights", ar: "استخدام الضوء العالي", correct: false },
      { en: "Drive on the hard shoulder", ar: "القيادة على كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "fog", ar: "الضباب", explainAr: "ظروف رؤية ضعيفة بسبب الضباب، مما يقلل من مدى الرؤية ويزيد من خطر الحوادث." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الطريق والمركبات الأخرى بوضوح، وهي ضرورية للقيادة الآمنة." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "ممارسات القيادة الآمنة على الطرق السريعة، خاصة في الظروف الجوية الصعبة." }
    ]
  },

  {
    id: "MW-4023",
    topic: "motorway-driving",
    promptEn: "Why should you avoid flashing your headlights to force another driver to move over on a motorway?",
    promptAr: "لماذا يجب تجنب وميض الأضواء لإجبار سائق آخر على تغيير المسار على الطريق السريع؟",
    options: [
      { en: "Because it uses more battery power", ar: "لأنه يستهلك طاقة البطارية", correct: false },
      { en: "Because it can be distracting and cause unsafe reactions", ar: "لأنه قد يشتت الانتباه ويسبب تصرفات غير آمنة", correct: true },
      { en: "Because headlights are not allowed at night", ar: "لأن استخدام الأضواء غير مسموح ليلاً", correct: false },
      { en: "Because lane changes are prohibited", ar: "لأن تغيير المسار ممنوع", correct: false }
    ],
    keywords: [
      { term: "headlight flashing", ar: "وميض الأضواء", explainAr: "تشغيل وإطفاء الأضواء بسرعة لإرسال إشارة، ولكن استخدامها لإجبار السائقين الآخرين يعتبر قيادة عدوانية." },
      { term: "aggressive driving", ar: "القيادة العدوانية", explainAr: "سلوكيات القيادة العدوانية التي تزيد من خطر الحوادث وتخلق بيئة قيادة غير آمنة." },
      { term: "motorway etiquette", ar: "آداب القيادة على الطريق السريع", explainAr: "الممارسات الصحيحة والسلوكيات المهذبة عند القيادة على الطرق السريعة." }
    ]
  },

  {
    id: "MW-4024",
    topic: "motorway-driving",
    promptEn: "What is the safest action if your vehicle starts to aquaplane on a motorway?",
    promptAr: "ما هو الإجراء الأكثر أمانًا إذا بدأت مركبتك بالانزلاق المائي على الطريق السريع؟",
    options: [
      { en: "Brake firmly to regain control", ar: "الكبح بقوة لاستعادة السيطرة", correct: false },
      { en: "Ease off the accelerator and steer gently", ar: "رفع القدم عن الوقود والتوجيه بلطف", correct: true },
      { en: "Accelerate to clear the water", ar: "التسارع لتجاوز المياه", correct: false },
      { en: "Change lanes immediately", ar: "تغيير المسار فورًا", correct: false }
    ],
    keywords: [
      { term: "aquaplaning", ar: "الانزلاق المائي", explainAr: "ظاهرة تحدث عندما يفقد الإطار التماس مع سطح الطريق بسبب طبقة من الماء، مما يؤدي إلى فقدان السيطرة." },
      { term: "wet motorway", ar: "الطريق السريع الرطب", explainAr: "الطريق السريع المغطى بالماء بسبب المطر، مما يزيد من خطر الانزلاق المائي." },
      { term: "vehicle control", ar: "السيطرة على المركبة", explainAr: "القدرة على التحكم في المركبة والحفاظ على الاستقرار، خاصة في الظروف الصعبة." }
    ]
  },

  {
    id: "MW-4025",
    topic: "motorway-driving",
    promptEn: "Why should you keep well back when following a lorry on a motorway?",
    promptAr: "لماذا يجب الحفاظ على مسافة كبيرة عند اتباع شاحنة على الطريق السريع؟",
    options: [
      { en: "Because lorries always travel slowly", ar: "لأن الشاحنات تسير ببطء دائمًا", correct: false },
      { en: "Because your view ahead may be blocked", ar: "لأن رؤيتك للطريق أمامك قد تكون محجوبة", correct: true },
      { en: "Because lorries are not allowed to change lanes", ar: "لأن الشاحنات لا يُسمح لها بتغيير المسار", correct: false },
      { en: "Because fuel economy improves", ar: "لأن اقتصاد الوقود يتحسن", correct: false }
    ],
    keywords: [
      { term: "lorry", ar: "شاحنة", explainAr: "مركبة كبيرة تستخدم لنقل البضائع، وقد تحجب الرؤية أمام السائقين الآخرين." },
      { term: "blocked view", ar: "الرؤية المحجوبة", explainAr: "عدم القدرة على رؤية الطريق أمامك بسبب مركبة كبيرة أمامك، مما يقلل من وقت رد الفعل المتاح." },
      { term: "safe distance", ar: "المسافة الآمنة", explainAr: "المسافة الكافية بين مركبتك والمركبة أمامك للسماح بالوقت الكافي للرد على أي تغييرات مفاجئة." }
    ]
  },

  {
    id: "MW-4026",
    topic: "motorway-driving",
    promptEn: "What do red reflective studs on a motorway indicate?",
    promptAr: "ماذا تشير العواكس الضوئية الحمراء على الطريق السريع؟",
    options: [
      { en: "Lane divisions between motorway lanes", ar: "فواصل المسارات بين مسارات الطريق السريع", correct: false },
      { en: "The central reservation", ar: "الجزيرة الوسطية", correct: false },
      { en: "Slip road entry or exit points", ar: "مداخل أو مخارج طرق الانضمام", correct: false },
      { en: "The left edge of the carriageway between lane and hard shoulder", ar: "الحافة اليسرى للطريق بين المسار والكتف الجانبي", correct: true }
    ],
    keywords: [
      { term: "red studs", ar: "العواكس الضوئية الحمراء", explainAr: "علامات عاكسة حمراء على الطريق السريع تشير إلى الحافة اليسرى للطريق بين المسار والكتف الجانبي." },
      { term: "hard shoulder", ar: "الكتف الجانبي", explainAr: "المسار الجانبي المخصص لحالات الطوارئ فقط." },
      { term: "motorway markings", ar: "علامات الطريق السريع", explainAr: "العلامات والعواكس الضوئية الملونة على الطريق السريع التي تساعد السائقين على تحديد المسارات والمناطق المختلفة." }
    ]
  },

  {
    id: "MW-4027",
    topic: "motorway-driving",
    promptEn: "When should you use hazard warning lights on a motorway?",
    promptAr: "متى يجب استخدام أضواء التحذير على الطريق السريع؟",
    options: [
      { en: "When changing lanes", ar: "عند تغيير المسار", correct: false },
      { en: "When slowing suddenly to warn traffic behind", ar: "عند التباطؤ المفاجئ لتحذير المرور خلفك", correct: true },
      { en: "When driving in heavy rain", ar: "عند القيادة في أمطار غزيرة", correct: false },
      { en: "When overtaking large vehicles", ar: "عند تجاوز مركبات كبيرة", correct: false }
    ],
    keywords: [
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "الأضواء البرتقالية التي تُستخدم لتحذير السائقين الآخرين من خطر أو موقف طارئ على الطريق." },
      { term: "sudden slowing", ar: "التباطؤ المفاجئ", explainAr: "الحد من السرعة بشكل مفاجئ بسبب عائق أو خطر على الطريق، مما يتطلب تحذير المركبات خلفك." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "الممارسات والإجراءات اللازمة للقيادة الآمنة على الطرق السريعة، بما في ذلك الاستخدام الصحيح لأضواء التحذير." }
    ]
  },

  {
    id: "MW-4028",
    topic: "motorway-driving",
    promptEn: "What are emergency refuge areas on a smart motorway used for?",
    promptAr: "ما هي استخدامات مناطق الملجأ الطارئة على الطريق السريع الذكي؟",
    options: [
      { en: "Safe places to stop in an emergency when you cannot reach an exit", ar: "أماكن آمنة للتوقف في حالات الطوارئ عندما لا يمكنك الوصول إلى مخرج", correct: true },
      { en: "Regular parking spaces for tired drivers", ar: "أماكن وقوف عادية للسائقين المتعبين", correct: false },
      { en: "Overtaking lanes for faster vehicles", ar: "مسارات تجاوز للمركبات الأسرع", correct: false },
      { en: "Areas to turn around and go back", ar: "مناطق للاستدارة والعودة للخلف", correct: false }
    ],
    keywords: [
      { term: "refuge area", ar: "منطقة الملجأ", explainAr: "منطقة آمنة على الطريق السريع الذكي للوقوف في حالات الطوارئ عندما لا يوجد كتف تقليدي." },
      { term: "smart motorway", ar: "الطريق السريع الذكي", explainAr: "طريق سريع يستخدم إشارات إلكترونية للتحكم في المسارات وقد لا يحتوي على كتف تقليدي." },
      { term: "emergency", ar: "طوارئ", explainAr: "حالة خطيرة تتطلب توقف فوري مثل الأعطال الميكانيكية." }
    ]
  },

  {
    id: "MW-4029",
    topic: "motorway-driving",
    promptEn: "Why should you plan rest breaks on long motorway journeys?",
    promptAr: "لماذا يجب التخطيط لفترات راحة في الرحلات الطويلة على الطريق السريع؟",
    options: [
      { en: "To reduce fuel costs", ar: "لتقليل تكاليف الوقود", correct: false },
      { en: "To maintain concentration and reduce fatigue", ar: "للحفاظ على التركيز وتقليل التعب", correct: true },
      { en: "To avoid speed cameras", ar: "لتجنب كاميرات السرعة", correct: false },
      { en: "To check tyre pressures frequently", ar: "لفحص ضغط الإطارات بشكل متكرر", correct: false }
    ],
    keywords: [
      { term: "rest breaks", ar: "فترات الراحة", explainAr: "فترات التوقف المؤقتة أثناء الرحلة الطويلة للراحة وتجديد النشاط والتركيز." },
      { term: "fatigue", ar: "التعب", explainAr: "الشعور بالإرهاق والنعاس أثناء القيادة، مما يقلل من التركيز ويزيد من خطر الحوادث." },
      { term: "long journeys", ar: "الرحلات الطويلة", explainAr: "الرحلات التي تستغرق وقتًا طويلاً على الطريق السريع، وتتطلب تخطيطًا للراحة للحفاظ على السلامة." }
    ]
  },

  {
    id: "MW-4030",
    topic: "motorway-driving",
    promptEn: "What is the safest action if you see debris on the motorway ahead?",
    promptAr: "ما هو الإجراء الأكثر أمانًا إذا رأيت حطامًا على الطريق السريع أمامك؟",
    options: [
      { en: "Swerve suddenly to avoid it", ar: "الانحراف فجأة لتجنبه", correct: false },
      { en: "Slow down safely and warn traffic behind if necessary", ar: "التباطؤ بأمان وتنبيه المرور خلفك إذا لزم الأمر", correct: true },
      { en: "Stop in your lane and remove it", ar: "التوقف في مسارك وإزالته", correct: false },
      { en: "Drive onto the hard shoulder immediately", ar: "الانتقال فورًا إلى كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "debris", ar: "الحطام", explainAr: "أشياء أو مواد على الطريق قد تشكل خطرًا على المركبات، مثل قطع الإطارات أو الأحجار أو غيرها." },
      { term: "road hazard", ar: "خطر على الطريق", explainAr: "أي شيء على الطريق قد يشكل خطرًا على السائقين، مثل الحطام أو الحفر أو السوائل المسكوبة." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "الممارسات والإجراءات اللازمة للتعامل مع المخاطر والمواقف الطارئة على الطرق السريعة بأمان." }
    ]
  },

  {
    id: "MW-4031",
    topic: "motorway-driving",
    promptEn: "What should you do if you break down on a motorway and cannot reach the hard shoulder?",
    promptAr: "ماذا يجب أن تفعل إذا تعطلت مركبتك على الطريق السريع ولم تتمكن من الوصول إلى كتف الطريق؟",
    options: [
      { en: "Stay in the vehicle with hazard lights on", ar: "البقاء داخل المركبة مع تشغيل أضواء التحذير", correct: false },
      { en: "Switch on hazard lights and stay behind the safety barrier if possible", ar: "تشغيل أضواء التحذير والبقاء خلف حاجز الأمان إن أمكن", correct: true },
      { en: "Attempt to push the vehicle to the hard shoulder", ar: "محاولة دفع المركبة إلى كتف الطريق", correct: false },
      { en: "Wave to approaching traffic for help", ar: "التلويح لحركة المرور طلبًا للمساعدة", correct: false }
    ],
    keywords: [
      { term: "breakdown", ar: "تعطل المركبة", explainAr: "عندما تتوقف المركبة عن العمل بشكل مفاجئ على الطريق." },
      { term: "unable to reach hard shoulder", ar: "عدم القدرة على الوصول إلى كتف الطريق", explainAr: "عندما لا يمكنك نقل المركبة المعطلة إلى كتف الطريق بسبب موقعها أو حالتها." },
      { term: "safety barrier", ar: "حاجز الأمان", explainAr: "حاجز فاصل على جانب الطريق السريع يوفر الحماية من حركة المرور." }
    ]
  },

  {
    id: "MW-4032",
    topic: "motorway-driving",
    promptEn: "Why should you avoid reversing on a motorway?",
    promptAr: "لماذا يجب تجنب الرجوع للخلف على الطريق السريع؟",
    options: [
      { en: "Because it increases fuel consumption", ar: "لأنه يزيد من استهلاك الوقود", correct: false },
      { en: "Because it is illegal and extremely dangerous", ar: "لأنه غير قانوني وخطير للغاية", correct: true },
      { en: "Because hazard lights must be used", ar: "لأن أضواء التحذير يجب استخدامها", correct: false },
      { en: "Because speed limits change", ar: "لأن حدود السرعة تتغير", correct: false }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة المركبة في الاتجاه المعاكس على الطريق السريع." },
      { term: "illegal", ar: "غير قانوني", explainAr: "ممنوع بموجب القانون ويعرضك للعقوبات." },
      { term: "motorway danger", ar: "خطر الطريق السريع", explainAr: "المواقف الخطيرة التي يمكن أن تحدث على الطرق السريعة بسبب السرعات العالية." }
    ]
  },

  {
    id: "MW-4033",
    topic: "motorway-driving",
    promptEn: "What is the safest way to leave a motorway?",
    promptAr: "ما الطريقة الأكثر أمانًا لمغادرة الطريق السريع؟",
    options: [
      { en: "Slow down sharply on the main carriageway", ar: "التباطؤ الحاد على المسار الرئيسي", correct: false },
      { en: "Signal early and reduce speed on the slip road", ar: "استخدام الإشارة مبكرًا وتخفيف السرعة على طريق الخروج", correct: true },
      { en: "Change lanes at the last moment", ar: "تغيير المسار في اللحظة الأخيرة", correct: false },
      { en: "Use hazard lights when exiting", ar: "استخدام أضواء التحذير عند الخروج", correct: false }
    ],
    keywords: [
      { term: "leaving motorway", ar: "مغادرة الطريق السريع", explainAr: "الخروج من الطريق السريع إلى طريق آخر أو منطقة الخدمة." },
      { term: "slip road", ar: "طريق الخروج", explainAr: "الطريق المخصص للخروج من الطريق السريع بأمان." },
      { term: "signalling", ar: "الإشارة", explainAr: "استخدام إشارات المركبة لإعلام السائقين الآخرين بنيتك في تغيير الاتجاه." }
    ]
  },

  {
    id: "MW-4034",
    topic: "motorway-driving",
    promptEn: "Why should you keep a steady speed when driving through roadworks on a motorway?",
    promptAr: "لماذا يجب الحفاظ على سرعة ثابتة عند القيادة عبر أعمال الطرق على الطريق السريع؟",
    options: [
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To maintain traffic flow and safety in narrowed lanes", ar: "للحفاظ على انسياب المرور والسلامة في المسارات الضيقة", correct: true },
      { en: "To avoid speed cameras", ar: "لتجنب كاميرات السرعة", correct: false },
      { en: "To overtake slower vehicles", ar: "لتجاوز المركبات الأبطأ", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال الطرق", explainAr: "أعمال الصيانة أو البناء على الطريق التي قد تضيق المسارات." },
      { term: "steady speed", ar: "سرعة ثابتة", explainAr: "الحفاظ على سرعة موحدة دون تسارع أو تباطؤ مفاجئ." },
      { term: "lane narrowing", ar: "تضييق المسارات", explainAr: "عندما تصبح المسارات أضيق بسبب أعمال الطرق أو الحواجز." }
    ]
  },

  {
    id: "MW-4035",
    topic: "motorway-driving",
    promptEn: "When driving at night on a motorway, why should you use dipped headlights?",
    promptAr: "عند القيادة ليلاً على الطريق السريع، لماذا يجب استخدام الأضواء المنخفضة؟",
    options: [
      { en: "To reduce fuel consumption", ar: "لتقليل استهلاك الوقود", correct: false },
      { en: "To avoid dazzling other road users", ar: "لتجنب إبهار مستخدمي الطريق الآخرين", correct: true },
      { en: "To increase speed safely", ar: "لزيادة السرعة بأمان", correct: false },
      { en: "To signal other drivers", ar: "لإعطاء إشارة للسائقين الآخرين", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "القيادة ليلاً", explainAr: "القيادة في الظلام عندما تكون الرؤية محدودة." },
      { term: "dipped headlights", ar: "الأضواء المنخفضة", explainAr: "الأضواء الأمامية الموجهة للأسفل لتجنب إبهار السائقين الآخرين." },
      { term: "dazzle", ar: "الإبهار", explainAr: "التأثير المؤذي للضوء الساطع على عيون السائقين الآخرين مما يقلل من قدرتهم على الرؤية." }
    ]
  },

  {
    id: "MW-4036",
    topic: "motorway-driving",
    promptEn: "What should you do if you see a speed limit displayed on an overhead gantry?",
    promptAr: "ماذا يجب أن تفعل إذا رأيت حد سرعة معروضًا على لوحة علوية فوق الطريق السريع؟",
    options: [
      { en: "Ignore it if traffic is flowing freely", ar: "تجاهله إذا كانت حركة المرور سلسة", correct: false },
      { en: "Treat it as advisory only", ar: "اعتباره إرشاديًا فقط", correct: false },
      { en: "Obey it as a mandatory speed limit", ar: "الالتزام به كحد سرعة إلزامي", correct: true },
      { en: "Follow the speed of the vehicle ahead", ar: "اتباع سرعة المركبة التي أمامك", correct: false }
    ],
    keywords: [
      { term: "gantry speed", ar: "حد السرعة على اللوحة العلوية", explainAr: "حد السرعة المعروض على اللوحات العلوية فوق الطريق السريع وهو إلزامي." },
      { term: "smart motorway", ar: "الطريق السريع الذكي", explainAr: "طريق سريع يستخدم تقنيات متقدمة لإدارة حركة المرور والسرعة." },
      { term: "mandatory limit", ar: "حد السرعة الإلزامي", explainAr: "حد السرعة الذي يجب الالتزام به قانونيًا وليس مجرد إرشاد." }
    ]
  },

  {
    id: "MW-4037",
    topic: "motorway-driving",
    promptEn: "Why should you avoid driving in another vehicle's blind spot on a motorway?",
    promptAr: "لماذا يجب تجنب القيادة في النقطة العمياء لمركبة أخرى على الطريق السريع؟",
    options: [
      { en: "Because it wastes fuel", ar: "لأنه يهدر الوقود", correct: false },
      { en: "Because the driver may not see you when changing lanes", ar: "لأن السائق قد لا يراك عند تغيير المسار", correct: true },
      { en: "Because it is illegal", ar: "لأنه غير قانوني", correct: false },
      { en: "Because road markings disappear", ar: "لأن علامات الطريق تختفي", correct: false }
    ],
    keywords: [
      { term: "blind spot", ar: "النقطة العمياء", explainAr: "منطقة حول المركبة لا يمكن رؤيتها في المرايا وتتطلب الالتفات للتحقق منها." },
      { term: "lane change", ar: "تغيير المسار", explainAr: "الانتقال من مسار إلى آخر على الطريق السريع." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "الممارسات والسلوكيات التي تحافظ على السلامة على الطرق السريعة." }
    ]
  },

  {
    id: "MW-4038",
    topic: "motorway-driving",
    promptEn: "What is the safest action if you see an emergency vehicle approaching from behind on a motorway?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا رأيت مركبة طوارئ تقترب من الخلف على الطريق السريع؟",
    options: [
      { en: "Brake sharply and stop immediately", ar: "الكبح بقوة والتوقف فورًا", correct: false },
      { en: "Maintain speed until it passes", ar: "الحفاظ على السرعة حتى تمر", correct: false },
      { en: "Move left if safe and allow it to pass", ar: "الانتقال يسارًا إذا كان آمنًا والسماح لها بالمرور", correct: true },
      { en: "Drive onto the hard shoulder", ar: "القيادة إلى كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "emergency vehicle", ar: "مركبة الطوارئ", explainAr: "مركبة الخدمات الطبية أو الإطفاء أو الشرطة التي تحتاج إلى المرور بسرعة." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق عالي السرعة مخصص للمركبات السريعة مع مسارات متعددة." },
      { term: "giving way", ar: "إفساح المجال", explainAr: "السماح لمركبة أخرى بالمرور أو التقدم بأمان." }
    ]
  },

  {
    id: "MW-4039",
    topic: "motorway-driving",
    promptEn: "Why is it important to keep your vehicle well maintained before a long motorway journey?",
    promptAr: "لماذا من المهم التأكد من أن مركبتك بحالة جيدة قبل رحلة طويلة على الطريق السريع؟",
    options: [
      { en: "To improve fuel economy only", ar: "لتحسين اقتصاد الوقود فقط", correct: false },
      { en: "To reduce the risk of breakdowns at high speed", ar: "لتقليل خطر الأعطال عند السرعات العالية", correct: true },
      { en: "To avoid toll charges", ar: "لتجنب رسوم الطرق", correct: false },
      { en: "To allow higher speeds", ar: "للسماح بسرعات أعلى", correct: false }
    ],
    keywords: [
      { term: "vehicle checks", ar: "فحص المركبة", explainAr: "التحقق من حالة المركبة وملاءمتها للقيادة قبل الرحلة." },
      { term: "breakdown prevention", ar: "منع الأعطال", explainAr: "اتخاذ الإجراءات اللازمة لتقليل احتمالية تعطل المركبة أثناء القيادة." },
      { term: "long journey", ar: "رحلة طويلة", explainAr: "رحلة تستغرق وقتًا طويلاً وتتطلب استعدادًا خاصًا للمركبة." }
    ]
  },

  {
    id: "MW-4040",
    topic: "motorway-driving",
    promptEn: "When driving on a motorway, why should you always plan your lane changes early?",
    promptAr: "عند القيادة على الطريق السريع، لماذا يجب التخطيط لتغيير المسار مبكرًا دائمًا؟",
    options: [
      { en: "To block other vehicles", ar: "لإعاقة المركبات الأخرى", correct: false },
      { en: "To reduce sudden manoeuvres and risk", ar: "لتقليل المناورات المفاجئة والمخاطر", correct: true },
      { en: "To maintain maximum speed", ar: "للحفاظ على أقصى سرعة", correct: false },
      { en: "To avoid using indicators", ar: "لتجنب استخدام الإشارات", correct: false }
    ],
    keywords: [
      { term: "lane planning", ar: "تخطيط المسار", explainAr: "التفكير المسبق في تغييرات المسار قبل تنفيذها." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع ما سيحدث على الطريق والاستعداد له مسبقًا." },
      { term: "safe driving", ar: "القيادة الآمنة", explainAr: "ممارسة القيادة بطريقة تقلل من المخاطر والحوادث." }
    ]
  },

  {
    id: "MW-4041",
    topic: "motorway-driving",
    promptEn: "What should you do if you see a warning sign for congestion ahead on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا رأيت علامة تحذير تشير إلى ازدحام مروري أمامك على الطريق السريع؟",
    options: [
      { en: "Maintain speed to avoid delaying traffic", ar: "الحفاظ على السرعة لتجنب تأخير المرور", correct: false },
      { en: "Reduce speed early and increase the gap in front", ar: "تخفيف السرعة مبكرًا وزيادة المسافة أمامك", correct: true },
      { en: "Move immediately to the right-hand lane", ar: "الانتقال فورًا إلى المسار الأيمن", correct: false },
      { en: "Switch on hazard lights continuously", ar: "تشغيل أضواء التحذير بشكل مستمر", correct: false }
    ],
    keywords: [
      { term: "congestion warning", ar: "تحذير الازدحام", explainAr: "علامة تحذيرية تشير إلى وجود ازدحام مروري قادم على الطريق." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع ما سيحدث على الطريق والاستعداد له مسبقًا." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "ممارسات القيادة الآمنة على الطرق السريعة." }
    ]
  },

  {
    id: "MW-4042",
    topic: "motorway-driving",
    promptEn: "Why should you avoid driving for long periods in the right-hand lane of a motorway?",
    promptAr: "لماذا يجب تجنب القيادة لفترات طويلة في المسار الأيمن على الطريق السريع؟",
    options: [
      { en: "Because speed limits are lower", ar: "لأن حدود السرعة أقل", correct: false },
      { en: "Because it can block faster traffic and increase risk", ar: "لأنه قد يعيق المرور الأسرع ويزيد الخطر", correct: true },
      { en: "Because the road surface is uneven", ar: "لأن سطح الطريق غير مستوٍ", correct: false },
      { en: "Because it uses more fuel", ar: "لأنه يستهلك وقودًا أكثر", correct: false }
    ],
    keywords: [
      { term: "lane discipline", ar: "انضباط المسار", explainAr: "استخدام المسارات بشكل صحيح وفقًا للقواعد." },
      { term: "right lane", ar: "المسار الأيمن", explainAr: "المسار المخصص للتجاوز وليس للقيادة المستمرة." },
      { term: "traffic flow", ar: "تدفق المرور", explainAr: "حركة المرور السلسة والمنظمة على الطريق." }
    ]
  },

  {
    id: "MW-4043",
    topic: "motorway-driving",
    promptEn: "When approaching a motorway exit, when should you begin to reduce your speed?",
    promptAr: "عند الاقتراب من مخرج طريق سريع، متى يجب البدء بتخفيف السرعة؟",
    options: [
      { en: "On the main carriageway before the exit", ar: "على المسار الرئيسي قبل المخرج", correct: false },
      { en: "After entering the slip road", ar: "بعد الدخول إلى طريق الخروج", correct: true },
      { en: "As soon as you see the exit sign", ar: "فور رؤية إشارة المخرج", correct: false },
      { en: "Only when traffic slows", ar: "فقط عندما تتباطأ حركة المرور", correct: false }
    ],
    keywords: [
      { term: "motorway exit", ar: "مخرج الطريق السريع", explainAr: "نقطة الخروج من الطريق السريع إلى طريق آخر." },
      { term: "slip road", ar: "مسار الخروج", explainAr: "المسار الذي تستخدمه للخروج من الطريق السريع بأمان." },
      { term: "speed control", ar: "التحكم في السرعة", explainAr: "إدارة السرعة بشكل مناسب للظروف والموقع." }
    ]
  },

  {
    id: "MW-4044",
    topic: "motorway-driving",
    promptEn: "What is the safest action if traffic is stopped on a smart motorway and no hard shoulder is available?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا توقفت حركة المرور على طريق سريع ذكي ولا يوجد كتف طريق؟",
    options: [
      { en: "Leave the vehicle immediately", ar: "مغادرة المركبة فورًا", correct: false },
      { en: "Stay in the vehicle with seatbelt on unless told otherwise", ar: "البقاء داخل المركبة مع ربط حزام الأمان ما لم يُطلب غير ذلك", correct: true },
      { en: "Walk to the nearest emergency phone", ar: "المشي إلى أقرب هاتف طوارئ", correct: false },
      { en: "Turn around and leave the motorway", ar: "الاستدارة ومغادرة الطريق السريع", correct: false }
    ],
    keywords: [
      { term: "smart motorway", ar: "طريق سريع ذكي", explainAr: "طريق سريع يستخدم شاشات إلكترونية لإدارة السرعات والمسارات." },
      { term: "stopped traffic", ar: "المرور المتوقف", explainAr: "حالة توقف حركة المرور على الطريق." },
      { term: "vehicle safety", ar: "سلامة المركبة", explainAr: "الإجراءات الآمنة عند التوقف على الطريق السريع." }
    ]
  },

  {
    id: "MW-4045",
    topic: "motorway-driving",
    promptEn: "Why should you always be alert for sudden lane closures on a motorway?",
    promptAr: "لماذا يجب أن تكون دائمًا متنبّهًا لإغلاقات مفاجئة للمسارات على الطريق السريع؟",
    options: [
      { en: "Because roadworks appear without warning", ar: "لأن أعمال الطرق تظهر دون تحذير", correct: false },
      { en: "Because overhead signals may close lanes quickly", ar: "لأن الإشارات العلوية قد تغلق المسارات بسرعة", correct: true },
      { en: "Because mirrors are unreliable", ar: "لأن المرايا غير موثوقة", correct: false },
      { en: "Because speed limits change often", ar: "لأن حدود السرعة تتغير كثيرًا", correct: false }
    ],
    keywords: [
      { term: "lane closure", ar: "إغلاق المسار", explainAr: "إغلاق مسار أو أكثر على الطريق السريع لأسباب مثل الحوادث أو أعمال الصيانة." },
      { term: "gantry signals", ar: "الإشارات العلوية", explainAr: "اللوحات الإلكترونية المعلقة فوق الطريق التي تعرض تعليمات السرعة وإغلاق المسارات." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع ما سيحدث على الطريق والاستعداد له مسبقًا." }
    ]
  },

  {
    id: "HZ-5011",
    topic: "hazard-awareness",
    promptEn: "You are driving past a school and see warning signs but no children in sight. What hazard should you still anticipate?",
    promptAr: "أثناء القيادة بجانب مدرسة، ترى إشارات تحذير لكن لا ترى أطفالًا. ما الخطر الذي يجب أن تتوقعه رغم ذلك؟",
    options: [
      { en: "No hazard as long as the road is clear", ar: "لا يوجد خطر طالما الطريق خالٍ", correct: false },
      { en: "Children may appear suddenly from behind parked vehicles", ar: "قد يظهر أطفال فجأة من خلف سيارات متوقفة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "A speed limit increase", ar: "زيادة في حد السرعة", correct: false }
    ],
    keywords: [
      { term: "school area", ar: "منطقة مدرسة", explainAr: "مناطق المدارس تتطلب حذرًا خاصًا لأن الأطفال قد يظهرون فجأة من أماكن غير مرئية." },
      { term: "children", ar: "أطفال", explainAr: "الأطفال قد لا يكونون مرئيين لكنهم قد يظهرون فجأة من خلف السيارات المتوقفة أو الأشياء الأخرى." },
      { term: "hidden hazard", ar: "خطر مخفي", explainAr: "خطر غير مرئي مباشرة لكن يجب توقعه بناءً على السياق والعلامات التحذيرية." }
    ]
  },

  {
    id: "HZ-5012",
    topic: "hazard-awareness",
    promptEn: "You are following a vehicle that is drifting slightly within its lane. What hazard should you anticipate?",
    promptAr: "أثناء اتباع مركبة تنحرف قليلًا داخل مسارها، ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver may be tired or distracted", ar: "قد يكون السائق متعبًا أو مشتت الانتباه", correct: true },
      { en: "The vehicle is preparing to overtake", ar: "تستعد المركبة للتجاوز", correct: false },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false },
      { en: "The vehicle is signalling a turn", ar: "المركبة تعطي إشارة انعطاف", correct: false }
    ],
    keywords: [
      { term: "drifting", ar: "انحراف", explainAr: "حركة غير منتظمة للمركبة داخل مسارها قد تشير إلى قائد متعب أو مشتت." },
      { term: "tired driver", ar: "سائق متعب", explainAr: "السائق المتعب قد يفقد السيطرة على المركبة ويشكل خطرًا على نفسه والآخرين." },
      { term: "loss of control", ar: "فقدان السيطرة", explainAr: "عدم قدرة السائق على التحكم الكامل في المركبة بسبب التعب أو التشتت." }
    ]
  },

  {
    id: "HZ-5013",
    topic: "hazard-awareness",
    promptEn: "You see a pedestrian looking at their mobile phone while standing near the kerb. What hazard should you expect?",
    promptAr: "ترى مشاة ينظرون إلى هاتفهم المحمول أثناء الوقوف قرب حافة الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They are waiting for a call", ar: "ينتظرون مكالمة", correct: false },
      { en: "They may step into the road without looking", ar: "قد يخطون إلى الطريق دون الانتباه", correct: true },
      { en: "They will cross only at a crossing", ar: "سيعبرون فقط عند ممر المشاة", correct: false },
      { en: "They are signalling traffic to stop", ar: "يعطون إشارة للمرور للتوقف", correct: false }
    ],
    keywords: [
      { term: "mobile phone", ar: "هاتف محمول", explainAr: "استخدام الهاتف المحمول يشتت انتباه المشاة وقد يجعلهم يخطون إلى الطريق دون النظر." },
      { term: "pedestrian", ar: "مشاة", explainAr: "المشاة المشتتون قد لا يلاحظون المركبات القادمة." },
      { term: "distraction", ar: "تشتت", explainAr: "أي شيء يشتت انتباه المشاة أو السائقين يزيد من خطر الحوادث." }
    ]
  },

  {
    id: "HZ-5014",
    topic: "hazard-awareness",
    promptEn: "You are driving on a rural road and see animals grazing near the roadside. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق ريفي، ترى حيوانات ترعى قرب جانب الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Animals will stay away from the road", ar: "ستبقى الحيوانات بعيدًا عن الطريق", correct: false },
      { en: "Animals may move onto the road suddenly", ar: "قد تدخل الحيوانات الطريق فجأة", correct: true },
      { en: "The road surface will improve", ar: "سيتحسن سطح الطريق", correct: false },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "animals", ar: "حيوانات", explainAr: "الحيوانات قرب الطريق قد تتحرك فجأة إلى الطريق دون تحذير." },
      { term: "rural road", ar: "طريق ريفي", explainAr: "الطرق الريفية قد تحتوي على حيوانات ترعى قربها." },
      { term: "unexpected hazard", ar: "خطر غير متوقع", explainAr: "خطر قد يظهر فجأة دون علامات تحذيرية واضحة." }
    ]
  },

  {
    id: "HZ-5015",
    topic: "hazard-awareness",
    promptEn: "You are approaching traffic lights that have been green for some time. What hazard should you anticipate?",
    promptAr: "تقترب من إشارات مرور كانت خضراء لفترة من الوقت. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The lights will remain green", ar: "ستبقى الإشارة خضراء", correct: false },
      { en: "The lights may change soon and traffic may stop", ar: "قد تتغير الإشارة قريبًا وقد يتوقف المرور", correct: true },
      { en: "Pedestrians will start crossing immediately", ar: "سيبدأ المشاة بالعبور فورًا", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "traffic lights", ar: "إشارات المرور", explainAr: "إشارات المرور تتغير دوريًا ويجب توقع تغييرها خاصة إذا كانت خضراء لفترة طويلة." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع تغيير الإشارات والاستعداد للتوقف." },
      { term: "signal change", ar: "تغيير الإشارة", explainAr: "تغيير إشارة المرور من الأخضر إلى الأحمر يتطلب الاستعداد للتوقف." }
    ]
  },

  {
    id: "HZ-5016",
    topic: "hazard-awareness",
    promptEn: "You are driving past a line of parked cars and notice a car door starting to open. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب صف من السيارات المتوقفة، تلاحظ باب سيارة يبدأ بالفتح. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will pull away immediately", ar: "ستتحرك المركبة فورًا", correct: false },
      { en: "A pedestrian may step into your path", ar: "قد يخرج شخص إلى طريقك", correct: true },
      { en: "The road surface will change", ar: "سيتغير سطح الطريق", correct: false },
      { en: "Traffic lights ahead will change", ar: "ستتغير إشارات المرور أمامك", correct: false }
    ],
    keywords: [
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تحتوي على ركاب يفتحون الأبواب أو يخرجون فجأة." },
      { term: "opening door", ar: "باب مفتوح", explainAr: "فتح باب سيارة متوقفة قد يشكل خطرًا على المركبات المارة والمشاة." },
      { term: "pedestrian hazard", ar: "خطر المشاة", explainAr: "قد يخرج شخص من السيارة المتوقفة إلى طريقك دون تحذير." }
    ]
  },

  {
    id: "HZ-5017",
    topic: "hazard-awareness",
    promptEn: "You are approaching a bend and see brake lights ahead. What should you anticipate?",
    promptAr: "تقترب من منعطف وترى أضواء الفرامل أمامك. ما الذي يجب أن تتوقعه؟",
    options: [
      { en: "The road surface will improve", ar: "سيتحسن سطح الطريق", correct: false },
      { en: "Traffic ahead may be slowing or stopping", ar: "قد تتباطأ أو تتوقف حركة المرور أمامك", correct: true },
      { en: "The bend will straighten soon", ar: "سيستقيم المنعطف قريبًا", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "bend", ar: "منعطف", explainAr: "المنعطفات تقلل من الرؤية وتتطلب الحذر والاستعداد للتوقف." },
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "أضواء الفرامل تشير إلى أن المركبات أمامك تبطئ أو تتوقف." },
      { term: "slowing traffic", ar: "حركة مرور بطيئة", explainAr: "المرور البطيء أو المتوقف يتطلب منك تقليل السرعة والاستعداد للتوقف." }
    ]
  },

  {
    id: "HZ-5018",
    topic: "hazard-awareness",
    promptEn: "You see a cyclist riding close to the kerb and approaching a junction. What hazard should you expect?",
    promptAr: "ترى درّاجًا يسير قرب حافة الطريق ويقترب من تقاطع. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will stop completely", ar: "سيتوقف الدرّاج تمامًا", correct: false },
      { en: "The cyclist may move out to turn or avoid hazards", ar: "قد يبتعد الدرّاج عن الحافة للانعطاف أو لتجنب مخاطر", correct: true },
      { en: "The cyclist will dismount", ar: "سينزل الدرّاج عن الدراجة", correct: false },
      { en: "The cyclist will increase speed", ar: "سيزيد الدرّاج سرعته", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "درّاج", explainAr: "الدرّاجون قد يغيرون موضعهم فجأة لتجنب المخاطر أو للانعطاف." },
      { term: "junction", ar: "تقاطع", explainAr: "التقاطعات هي نقاط حرجة حيث قد يغير الدرّاجون اتجاههم." },
      { term: "changing position", ar: "تغيير الموضع", explainAr: "الدرّاجون قد يبتعدون عن الحافة للانعطاف أو لتجنب الحفر أو العوائق." }
    ]
  },

  {
    id: "HZ-5019",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy rain and see standing water on the road. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في أمطار غزيرة، ترى مياهًا راكدة على الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved tyre grip", ar: "تحسّن تماسك الإطارات", correct: false },
      { en: "Risk of aquaplaning", ar: "خطر الانزلاق المائي", correct: true },
      { en: "A sudden speed limit increase", ar: "زيادة مفاجئة في حد السرعة", correct: false },
      { en: "Road closure ahead", ar: "إغلاق الطريق أمامك", correct: false }
    ],
    keywords: [
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "الأمطار الغزيرة تقلل من الرؤية وتزيد من خطر الانزلاق." },
      { term: "standing water", ar: "مياه راكدة", explainAr: "المياه الراكدة على الطريق قد تسبب الانزلاق المائي." },
      { term: "aquaplaning", ar: "الانزلاق المائي", explainAr: "ظاهرة تحدث عندما تفقد الإطارات التماس مع سطح الطريق بسبب طبقة الماء." }
    ]
  },

  {
    id: "HZ-5020",
    topic: "hazard-awareness",
    promptEn: "You notice a vehicle ahead indicating left but slowing down near a driveway. What hazard should you anticipate?",
    promptAr: "تلاحظ مركبة أمامك تعطي إشارة انعطاف يسارًا وتُبطئ قرب مدخل منزل. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle may stop suddenly to turn", ar: "قد تتوقف المركبة فجأة للانعطاف", correct: true },
      { en: "The vehicle will continue straight ahead", ar: "ستتابع المركبة السير للأمام", correct: false },
      { en: "The vehicle will reverse", ar: "ستقوم المركبة بالرجوع للخلف", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "turning vehicle", ar: "مركبة منعطفة", explainAr: "المركبة التي تعطي إشارة انعطاف قد تتوقف فجأة للانعطاف." },
      { term: "driveway", ar: "مدخل منزل", explainAr: "المداخل الخاصة قد تتطلب من المركبات التوقف قبل الانعطاف." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "المركبات التي تنعطف قد تتوقف فجأة مما يتطلب منك الحذر والاستعداد." }
    ]
  },

  {
    id: "HZ-5021",
    topic: "hazard-awareness",
    promptEn: "You are driving on a narrow road and see an oncoming vehicle partly on your side. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق ضيق، ترى مركبة قادمة جزئيًا على مسارك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will stop and reverse", ar: "ستتوقف المركبة وتعود للخلف", correct: false },
      { en: "You may need to slow down or give way", ar: "قد تحتاج إلى التخفيف أو إعطاء الطريق", correct: true },
      { en: "The road will widen immediately", ar: "سيتسع الطريق فورًا", correct: false },
      { en: "The vehicle will turn off", ar: "ستنحرف المركبة إلى طريق آخر", correct: false }
    ],
    keywords: [
      { term: "narrow road", ar: "طريق ضيق", explainAr: "الطرق الضيقة تتطلب حذرًا إضافيًا عند مواجهة مركبات قادمة." },
      { term: "oncoming traffic", ar: "مرور قادم", explainAr: "المركبات القادمة من الاتجاه المعاكس قد تحتاج إلى إعطاء الطريق." },
      { term: "giving way", ar: "إعطاء الطريق", explainAr: "التخفيف أو التوقف لإتاحة المجال لمركبة أخرى." }
    ]
  },

  {
    id: "HZ-5022",
    topic: "hazard-awareness",
    promptEn: "You see roadworks ahead with workers close to the carriageway. What hazard should you expect?",
    promptAr: "ترى أعمال طرق أمامك مع عمّال قريبين من مسار السير. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved road surface", ar: "تحسّن سطح الطريق", correct: false },
      { en: "Narrower lanes and sudden stops", ar: "مسارات أضيق وتوقفات مفاجئة", correct: true },
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false },
      { en: "Less traffic ahead", ar: "حركة مرور أقل أمامك", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال طرق", explainAr: "أعمال الصيانة أو البناء على الطريق قد تقلل من المساحة المتاحة." },
      { term: "workers", ar: "عمّال", explainAr: "وجود العمال على الطريق يتطلب حذرًا إضافيًا وتخفيف السرعة." },
      { term: "lane narrowing", ar: "تضييق المسارات", explainAr: "قد تصبح المسارات أضيق في مناطق أعمال الطرق." }
    ]
  },

  {
    id: "HZ-5023",
    topic: "hazard-awareness",
    promptEn: "You notice a horse rider ahead on a country road. What hazard should you anticipate?",
    promptAr: "تلاحظ فارسًا على حصان أمامك على طريق ريفي. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The horse may be startled by noise or movement", ar: "قد يفزع الحصان بسبب الضوضاء أو الحركة", correct: true },
      { en: "The rider will signal before stopping", ar: "سيعطي الفارس إشارة قبل التوقف", correct: false },
      { en: "The horse will move faster than traffic", ar: "سيسير الحصان أسرع من المرور", correct: false },
      { en: "The road will be closed", ar: "سيتم إغلاق الطريق", correct: false }
    ],
    keywords: [
      { term: "horse rider", ar: "فارس على حصان", explainAr: "الخيول قد تفزع بسهولة من الضوضاء أو الحركة المفاجئة." },
      { term: "country road", ar: "طريق ريفي", explainAr: "الطرق الريفية قد تحتوي على مستخدمي طريق متنوعين." },
      { term: "unpredictable", ar: "غير متوقع", explainAr: "الخيول قد تتصرف بشكل غير متوقع عند الاضطراب." }
    ]
  },

  {
    id: "HZ-5024",
    topic: "hazard-awareness",
    promptEn: "You are driving at dusk and the sun is low ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة عند الغسق والشمس منخفضة أمامك، ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved visibility", ar: "تحسّن الرؤية", correct: false },
      { en: "Glare reducing your ability to see hazards", ar: "وهج يقلل قدرتك على رؤية المخاطر", correct: true },
      { en: "Lower traffic levels", ar: "انخفاض حركة المرور", correct: false },
      { en: "Automatic speed limit changes", ar: "تغيرات تلقائية في حد السرعة", correct: false }
    ],
    keywords: [
      { term: "sun glare", ar: "وهج الشمس", explainAr: "الشمس المنخفضة قد تسبب وهجًا يقلل من الرؤية." },
      { term: "dusk", ar: "الغسق", explainAr: "فترة الغسق عندما تكون الشمس منخفضة في السماء." },
      { term: "reduced visibility", ar: "انخفاض الرؤية", explainAr: "الوهج قد يخفي المخاطر على الطريق." }
    ]
  },

  {
    id: "HZ-5025",
    topic: "hazard-awareness",
    promptEn: "You see a pedestrian stepping off the kerb while traffic is moving. What hazard should you anticipate?",
    promptAr: "ترى أحد المشاة يخطو من الرصيف بينما حركة المرور مستمرة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The pedestrian will step back immediately", ar: "سيعود المشاة فورًا", correct: false },
      { en: "You may need to stop suddenly", ar: "قد تحتاج إلى التوقف فجأة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The pedestrian will run across", ar: "سيجري المشاة عبر الطريق", correct: false }
    ],
    keywords: [
      { term: "pedestrian", ar: "مشاة", explainAr: "الأشخاص الذين يعبرون الطريق قد يتصرفون بشكل غير متوقع." },
      { term: "stepping off kerb", ar: "الخطو من الرصيف", explainAr: "عندما يخطو المشاة من الرصيف، قد يعبرون الطريق فجأة." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "قد تحتاج إلى التوقف فجأة لتجنب الاصطدام بالمشاة." }
    ]
  },

  {
    id: "HZ-5026",
    topic: "hazard-awareness",
    promptEn: "You are driving behind a large vehicle and cannot see the road ahead clearly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة خلف مركبة كبيرة ولا تستطيع رؤية الطريق أمامك بوضوح، ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will accelerate suddenly", ar: "ستتسارع المركبة فجأة", correct: false },
      { en: "Traffic ahead may slow or stop unexpectedly", ar: "قد تتباطأ أو تتوقف حركة المرور أمامك بشكل غير متوقع", correct: true },
      { en: "The road surface will improve", ar: "سيتحسن سطح الطريق", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "large vehicle", ar: "مركبة كبيرة", explainAr: "المركبات الكبيرة تحجب الرؤية وقد تخفي المخاطر أمامك." },
      { term: "blocked view", ar: "رؤية محجوبة", explainAr: "عندما لا تستطيع رؤية الطريق أمامك، قد تواجه مخاطر غير متوقعة." },
      { term: "hidden hazard", ar: "خطر مخفي", explainAr: "المخاطر التي لا يمكن رؤيتها بسبب حجب الرؤية." }
    ]
  },

  {
    id: "HZ-5027",
    topic: "hazard-awareness",
    promptEn: "You are approaching a pedestrian crossing and notice someone waiting near it. What hazard should you anticipate?",
    promptAr: "تقترب من ممر مشاة وتلاحظ شخصًا ينتظر بالقرب منه. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will wait until traffic stops completely", ar: "سينتظر حتى يتوقف المرور تمامًا", correct: false },
      { en: "They may step onto the crossing unexpectedly", ar: "قد يدخل إلى الممر بشكل غير متوقع", correct: true },
      { en: "They will cross only when waved across", ar: "سيعبر فقط عند الإشارة له", correct: false },
      { en: "They are waiting for public transport", ar: "ينتظر وسائل النقل العام", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "منطقة مخصصة لعبور المشاة على الطريق." },
      { term: "waiting pedestrian", ar: "مشاة ينتظر", explainAr: "المشاة الذين ينتظرون قد يعبرون فجأة دون تحذير." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها." }
    ]
  },

  {
    id: "HZ-5028",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead with its hazard warning lights on. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تشغّل أضواء التحذير. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is travelling at high speed", ar: "المركبة تسير بسرعة عالية", correct: false },
      { en: "The vehicle may stop or move unpredictably", ar: "قد تتوقف المركبة أو تتحرك بشكل غير متوقع", correct: true },
      { en: "The road ahead is clear", ar: "الطريق أمامك خالٍ", correct: false },
      { en: "The vehicle is giving way only", ar: "المركبة تعطي أولوية المرور فقط", correct: false }
    ],
    keywords: [
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "إشارة تحذيرية تشير إلى وجود مشكلة أو خطر." },
      { term: "unpredictable movement", ar: "حركة غير متوقعة", explainAr: "المركبة قد تتحرك أو تتوقف بشكل غير متوقع." },
      { term: "warning", ar: "تحذير", explainAr: "إشارة تنبيهية لوجود خطر محتمل." }
    ]
  },

  {
    id: "HZ-5029",
    topic: "hazard-awareness",
    promptEn: "You are driving on a country road and see a warning sign for wild animals. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق ريفي، ترى علامة تحذير لوجود حيوانات برية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Animals will stay away from the road", ar: "ستبقى الحيوانات بعيدًا عن الطريق", correct: false },
      { en: "Animals may suddenly enter the road", ar: "قد تدخل الحيوانات الطريق فجأة", correct: true },
      { en: "The road surface will change", ar: "سيتغير سطح الطريق", correct: false },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "wild animals", ar: "حيوانات برية", explainAr: "الحيوانات البرية قد تظهر فجأة على الطريق." },
      { term: "country road", ar: "طريق ريفي", explainAr: "الطرق الريفية قد تحتوي على مخاطر مثل الحيوانات البرية." },
      { term: "sudden hazard", ar: "خطر مفاجئ", explainAr: "مخاطر تظهر فجأة دون تحذير مسبق." }
    ]
  },

  {
    id: "HZ-5030",
    topic: "hazard-awareness",
    promptEn: "You are driving in busy traffic and notice a vehicle ahead braking repeatedly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة مرور كثيفة، تلاحظ مركبة أمامك تكبح بشكل متكرر. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is confident and alert", ar: "السائق واثق ومتيقظ", correct: false },
      { en: "Traffic ahead may stop suddenly", ar: "قد تتوقف حركة المرور أمامك فجأة", correct: true },
      { en: "The vehicle will change lanes smoothly", ar: "ستغير المركبة المسار بسلاسة", correct: false },
      { en: "The speed limit will be raised", ar: "سيتم رفع حد السرعة", correct: false }
    ],
    keywords: [
      { term: "repeated braking", ar: "كبح متكرر", explainAr: "الكبح المتكرر يشير إلى وجود مشكلة أو ازدحام أمامك." },
      { term: "congestion", ar: "ازدحام", explainAr: "حركة المرور الكثيفة قد تؤدي إلى توقف مفاجئ." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "قد تحتاج إلى التوقف فجأة بسبب ازدحام المرور." }
    ]
  },

  {
    id: "HZ-5031",
    topic: "hazard-awareness",
    promptEn: "You are driving in slow-moving traffic and see a gap opening ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة مرور بطيئة، ترى فجوة تنفتح أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will speed up smoothly", ar: "ستزداد سرعة المرور بسلاسة", correct: false },
      { en: "The gap may close suddenly as traffic stops again", ar: "قد تُغلق الفجوة فجأة مع توقف المرور مجددًا", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "Other drivers will signal clearly", ar: "سيعطي السائقون الآخرون إشارات واضحة", correct: false }
    ],
    keywords: [
      { term: "slow traffic", ar: "حركة مرور بطيئة", explainAr: "الحركة البطيئة قد تتوقف فجأة وتغلق الفجوات." },
      { term: "closing gap", ar: "فجوة تُغلق", explainAr: "الفجوات في حركة المرور قد تُغلق فجأة عندما تتوقف المركبات." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها." }
    ]
  },

  {
    id: "HZ-5032",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead pulling away from the kerb with its indicator on. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تتحرك مبتعدة عن الرصيف مع تشغيل الإشارة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will stop again immediately", ar: "ستتوقف المركبة مجددًا فورًا", correct: false },
      { en: "The vehicle may move into your path", ar: "قد تدخل المركبة إلى مسارك", correct: true },
      { en: "The vehicle will accelerate sharply", ar: "ستتسارع المركبة بقوة", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "pulling out", ar: "التحرك من الرصيف", explainAr: "المركبات التي تتحرك من الرصيف قد تدخل إلى مسارك." },
      { term: "indicator", ar: "الإشارة", explainAr: "الإشارة تشير إلى نية السائق لكن لا تضمن أنه سيرى مسارك." },
      { term: "path conflict", ar: "تعارض المسار", explainAr: "عندما تتحرك مركبة إلى مسارك، قد يحدث تعارض خطير." }
    ]
  },

  {
    id: "HZ-5033",
    topic: "hazard-awareness",
    promptEn: "You are driving near a market area and see people standing close to the road. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب منطقة سوق، ترى أشخاصًا يقفون بالقرب من الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will remain stationary", ar: "سيبقون في أماكنهم", correct: false },
      { en: "Pedestrians may step into the road unexpectedly", ar: "قد يخطو المشاة إلى الطريق بشكل غير متوقع", correct: true },
      { en: "Traffic will flow faster", ar: "ستتحسن حركة المرور", correct: false },
      { en: "Parking restrictions will end", ar: "ستنتهي قيود الوقوف", correct: false }
    ],
    keywords: [
      { term: "busy area", ar: "منطقة مزدحمة", explainAr: "المناطق المزدحمة تحتوي على مخاطر متعددة مثل المشاة." },
      { term: "pedestrians", ar: "المشاة", explainAr: "المشاة قد يتحركون بشكل غير متوقع ويدخلون إلى الطريق." },
      { term: "unexpected movement", ar: "حركة غير متوقعة", explainAr: "المشاة قد يخطون إلى الطريق دون تحذير مسبق." }
    ]
  },

  {
    id: "HZ-5034",
    topic: "hazard-awareness",
    promptEn: "You notice a car ahead slowing without using brake lights. What hazard should you anticipate?",
    promptAr: "تلاحظ سيارة أمامك تُبطئ دون تشغيل أضواء الفرامل. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is experienced", ar: "السائق ذو خبرة", correct: false },
      { en: "The vehicle may stop suddenly", ar: "قد تتوقف المركبة فجأة", correct: true },
      { en: "The road surface is smooth", ar: "سطح الطريق ناعم", correct: false },
      { en: "The speed limit is lower", ar: "حد السرعة أقل", correct: false }
    ],
    keywords: [
      { term: "no brake lights", ar: "عدم تشغيل أضواء الفرامل", explainAr: "عندما لا تُشغّل المركبة أضواء الفرامل، يصعب توقع توقفها." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "المركبة التي تُبطئ دون إشارة قد تتوقف فجأة." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها." }
    ]
  },

  {
    id: "HZ-5035",
    topic: "hazard-awareness",
    promptEn: "You are driving on a residential street and see a delivery van stopped with doors open. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في شارع سكني، ترى شاحنة توصيل متوقفة وأبوابها مفتوحة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The van will remain parked", ar: "ستبقى الشاحنة متوقفة", correct: false },
      { en: "People may step into the road from behind the van", ar: "قد يخرج أشخاص إلى الطريق من خلف الشاحنة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will narrow permanently", ar: "سيضيق الطريق بشكل دائم", correct: false }
    ],
    keywords: [
      { term: "delivery van", ar: "شاحنة توصيل", explainAr: "شاحنات التوصيل قد تخفي المشاة خلفها." },
      { term: "hidden pedestrians", ar: "مشاة مختبئون", explainAr: "المشاة خلف المركبات الكبيرة قد يظهرون فجأة." },
      { term: "residential street", ar: "شارع سكني", explainAr: "الشوارع السكنية تحتوي على مخاطر مثل المشاة والمركبات المتوقفة." }
    ]
  },

  {
    id: "HZ-5036",
    topic: "hazard-awareness",
    promptEn: "You are driving on a dual carriageway and see traffic ahead bunching together. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مزدوج، ترى حركة المرور أمامك تتقارب بشكل ملحوظ. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will flow freely", ar: "ستكون حركة المرور سلسة", correct: false },
      { en: "Sudden braking or stopping ahead", ar: "كبح أو توقف مفاجئ أمامك", correct: true },
      { en: "A speed limit increase", ar: "زيادة حد السرعة", correct: false },
      { en: "Road surface improvement", ar: "تحسن سطح الطريق", correct: false }
    ],
    keywords: [
      { term: "bunching traffic", ar: "تقارب حركة المرور", explainAr: "عندما تتقارب المركبات، قد يكون هناك خطر أو عائق أمامك." },
      { term: "dual carriageway", ar: "طريق مزدوج", explainAr: "الطريق المزدوج يحتوي على مسارين منفصلين في كل اتجاه." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "المركبات التي تتقارب قد تتوقف فجأة بسبب خطر أو عائق." }
    ]
  },

  {
    id: "HZ-5037",
    topic: "hazard-awareness",
    promptEn: "You see a pedestrian pushing a pram near the kerb. What hazard should you anticipate?",
    promptAr: "ترى أحد المشاة يدفع عربة أطفال قرب حافة الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will wait for traffic to stop", ar: "سينتظر حتى يتوقف المرور", correct: false },
      { en: "They may move slowly into the road", ar: "قد يدخل الطريق ببطء", correct: true },
      { en: "They will signal before crossing", ar: "سيعطي إشارة قبل العبور", correct: false },
      { en: "They will remain on the pavement", ar: "سيبقون على الرصيف", correct: false }
    ],
    keywords: [
      { term: "pram", ar: "عربة أطفال", explainAr: "المشاة الذين يدفعون عربات أطفال قد يتحركون ببطء وقد يدخلون الطريق." },
      { term: "pedestrian", ar: "مشاة", explainAr: "الأشخاص الذين يعبرون الطريق قد يتحركون بشكل غير متوقع." },
      { term: "slow movement", ar: "حركة بطيئة", explainAr: "الحركة البطيئة للمشاة قد تجعل من الصعب توقع تحركاتهم." }
    ]
  },

  {
    id: "HZ-5038",
    topic: "hazard-awareness",
    promptEn: "You are driving in windy conditions and see a cyclist ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ظروف رياح قوية، ترى درّاجًا أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will stop immediately", ar: "سيتوقف الدرّاج فورًا", correct: false },
      { en: "The cyclist may swerve unexpectedly", ar: "قد ينحرف الدرّاج بشكل غير متوقع", correct: true },
      { en: "The cyclist will leave the road", ar: "سيغادر الدرّاج الطريق", correct: false },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "windy conditions", ar: "ظروف رياح قوية", explainAr: "الرياح القوية قد تؤثر على استقرار الدراجات والمركبات الخفيفة." },
      { term: "cyclist", ar: "درّاج", explainAr: "الدرّاجون أكثر عرضة للتأثر بالرياح وقد ينحرفون بشكل غير متوقع." },
      { term: "swerve", ar: "انحراف", explainAr: "الانحراف المفاجئ للدرّاج قد يجعله يدخل إلى مسارك." }
    ]
  },

  {
    id: "HZ-5039",
    topic: "hazard-awareness",
    promptEn: "You are approaching a junction and see a vehicle edging forward from a side road. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع وترى مركبة تتقدم ببطء من طريق جانبي. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will reverse back", ar: "ستعود المركبة للخلف", correct: false },
      { en: "The vehicle may pull out into your path", ar: "قد تخرج المركبة إلى مسارك", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will narrow", ar: "سيضيق الطريق", correct: false }
    ],
    keywords: [
      { term: "side road", ar: "طريق جانبي", explainAr: "المركبات القادمة من الطرق الجانبية قد تدخل إلى مسارك." },
      { term: "edging forward", ar: "التقدم ببطء", explainAr: "المركبة التي تتقدم ببطء قد تكون على وشك الخروج إلى الطريق الرئيسي." },
      { term: "emerging vehicle", ar: "مركبة تخرج", explainAr: "المركبات التي تخرج من الطرق الجانبية قد لا تراك وقد تدخل إلى مسارك." }
    ]
  },

  {
    id: "HZ-5040",
    topic: "hazard-awareness",
    promptEn: "You are driving near a playground and see children running on the pavement. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب ملعب، ترى أطفالًا يركضون على الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Children will stay on the pavement", ar: "سيبقى الأطفال على الرصيف", correct: false },
      { en: "A child may suddenly run into the road", ar: "قد يركض طفل فجأة إلى الطريق", correct: true },
      { en: "Traffic speed will reduce automatically", ar: "ستنخفض سرعة المرور تلقائيًا", correct: false },
      { en: "The road will be closed", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "playground", ar: "ملعب", explainAr: "المناطق القريبة من الملاعب تحتوي على أطفال قد يتحركون بشكل غير متوقع." },
      { term: "children", ar: "أطفال", explainAr: "الأطفال قد يركضون إلى الطريق دون تفكير أو تحذير مسبق." },
      { term: "sudden movement", ar: "حركة مفاجئة", explainAr: "الحركات المفاجئة للأطفال قد تجعلهم يدخلون إلى الطريق دون سابق إنذار." }
    ]
  },

  {
    id: "HZ-5041",
    topic: "hazard-awareness",
    promptEn: "You are driving in early morning frost and see a shaded section of road ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في صباح بارد مع صقيع، ترى جزءًا مظللًا من الطريق أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Dry road surface", ar: "سطح طريق جاف", correct: false },
      { en: "Black ice causing reduced grip", ar: "جليد أسود يسبب انخفاض التماسك", correct: true },
      { en: "Improved visibility", ar: "تحسن الرؤية", correct: false },
      { en: "A speed limit increase", ar: "زيادة حد السرعة", correct: false }
    ],
    keywords: [
      { term: "black ice", ar: "جليد أسود", explainAr: "طبقة رقيقة من الجليد غير المرئي على الطريق، خاصة في المناطق المظللة." },
      { term: "frost", ar: "صقيع", explainAr: "ظروف الطقس الباردة التي قد تسبب تكوّن الجليد على الطريق." },
      { term: "shaded road", ar: "طريق مظلل", explainAr: "الأجزاء المظللة من الطريق تحتفظ بالجليد لفترة أطول من الأجزاء المعرضة للشمس." }
    ]
  },

  {
    id: "HZ-5042",
    topic: "hazard-awareness",
    promptEn: "You see a group of people standing at a bus stop with one person stepping forward. What hazard should you anticipate?",
    promptAr: "ترى مجموعة أشخاص يقفون عند موقف حافلات مع شخص يتقدم خطوة للأمام. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will remain behind the kerb", ar: "سيبقون خلف الرصيف", correct: false },
      { en: "Someone may step into the road unexpectedly", ar: "قد يخطو أحدهم إلى الطريق بشكل غير متوقع", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The bus will reverse", ar: "سترجع الحافلة للخلف", correct: false }
    ],
    keywords: [
      { term: "bus stop", ar: "موقف حافلات", explainAr: "الأشخاص في مواقف الحافلات قد يتحركون بشكل مفاجئ للوصول إلى الحافلة." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يقفون عند مواقف الحافلات قد يخطون إلى الطريق دون تفكير." },
      { term: "unexpected crossing", ar: "عبور غير متوقع", explainAr: "الحركة المفاجئة للمشاة إلى الطريق دون التحقق من حركة المرور." }
    ]
  },

  {
    id: "HZ-5043",
    topic: "hazard-awareness",
    promptEn: "You are driving behind a motorcycle approaching a junction. What hazard should you anticipate?",
    promptAr: "أثناء القيادة خلف دراجة نارية تقترب من تقاطع، ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The motorcycle will always stop", ar: "ستتوقف الدراجة دائمًا", correct: false },
      { en: "The rider may slow suddenly or change position", ar: "قد يبطئ السائق فجأة أو يغيّر موضعه", correct: true },
      { en: "The motorcycle will accelerate quickly", ar: "ستتسارع الدراجة بسرعة", correct: false },
      { en: "The rider will signal clearly every time", ar: "سيعطي السائق إشارة واضحة دائمًا", correct: false }
    ],
    keywords: [
      { term: "motorcycle", ar: "دراجة نارية", explainAr: "الدراجات النارية قد تغيّر موضعها فجأة، خاصة عند التقاطعات." },
      { term: "junction", ar: "تقاطع", explainAr: "التقاطعات هي نقاط حرجة حيث قد تغيّر المركبات اتجاهها أو سرعتها." },
      { term: "position change", ar: "تغيير الموضع", explainAr: "الدراجات النارية قد تغيّر موضعها فجأة لتجنب المخاطر أو للتحضير للانعطاف." }
    ]
  },

  {
    id: "HZ-5044",
    topic: "hazard-awareness",
    promptEn: "You are driving near parked vans and cannot see the pavement clearly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب شاحنات متوقفة ولا تستطيع رؤية الرصيف بوضوح. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false },
      { en: "Pedestrians emerging from between vehicles", ar: "مشاة يخرجون من بين المركبات", correct: true },
      { en: "A speed camera ahead", ar: "كاميرا سرعة أمامك", correct: false },
      { en: "Improved traffic flow", ar: "تحسن حركة المرور", correct: false }
    ],
    keywords: [
      { term: "parked vans", ar: "شاحنات متوقفة", explainAr: "الشاحنات المتوقفة الكبيرة تحجب الرؤية وتمنع رؤية المشاة خلفها." },
      { term: "hidden pedestrians", ar: "مشاة مخفيون", explainAr: "المشاة الذين يخرجون من بين المركبات المتوقفة قد لا يكونون مرئيين حتى اللحظة الأخيرة." },
      { term: "limited view", ar: "رؤية محدودة", explainAr: "المركبات الكبيرة المتوقفة تقلل من مجال الرؤية وتزيد من خطر ظهور مشاة فجأة." }
    ]
  },

  {
    id: "HZ-5045",
    topic: "hazard-awareness",
    promptEn: "You notice a vehicle ahead slowing near a pedestrian crossing with no lights. What hazard should you anticipate?",
    promptAr: "تلاحظ مركبة أمامك تُبطئ قرب ممر مشاة دون إشارات ضوئية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is parking", ar: "المركبة تتوقف للوقوف", correct: false },
      { en: "Pedestrians may be crossing", ar: "قد يكون هناك مشاة يعبرون", correct: true },
      { en: "The road is closing", ar: "الطريق سيُغلق", correct: false },
      { en: "The speed limit has changed", ar: "تغير حد السرعة", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "ممرات المشاة هي نقاط عبور محتملة للمشاة، حتى بدون إشارات ضوئية." },
      { term: "slowing vehicle", ar: "مركبة تبطئ", explainAr: "عندما تبطئ المركبة أمامك قرب ممر مشاة، قد يكون السبب وجود مشاة يعبرون." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع المخاطر المحتملة قبل حدوثها يساعد في تجنب الحوادث." }
    ]
  },

  {
    id: "HZ-5046",
    topic: "hazard-awareness",
    promptEn: "You are driving on a residential road and hear an ice cream van's music ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في شارع سكني، تسمع موسيقى سيارة آيس كريم أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will move faster", ar: "ستتحرك حركة المرور بشكل أسرع", correct: false },
      { en: "Children may run into the road unexpectedly", ar: "قد يركض أطفال فجأة إلى الطريق", correct: true },
      { en: "The road surface will be slippery", ar: "سيصبح سطح الطريق زلقًا", correct: false },
      { en: "Parking restrictions will end", ar: "ستنتهي قيود الوقوف", correct: false }
    ],
    keywords: [
      { term: "ice cream van", ar: "سيارة آيس كريم", explainAr: "سيارات الآيس كريم تجذب الأطفال الذين قد يركضون إلى الطريق دون انتباه." },
      { term: "children", ar: "أطفال", explainAr: "الأطفال في المناطق السكنية قد يظهرون فجأة في الطريق دون النظر." },
      { term: "residential hazard", ar: "خطر سكني", explainAr: "المناطق السكنية تحتوي على مخاطر خاصة مثل الأطفال والحيوانات الأليفة." }
    ]
  },

  {
    id: "HZ-5047",
    topic: "hazard-awareness",
    promptEn: "You are approaching a bend and see a warning sign for loose gravel. What hazard should you anticipate?",
    promptAr: "تقترب من منعطف وترى علامة تحذير لوجود حصى متناثر. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved braking performance", ar: "تحسن أداء الكبح", correct: false },
      { en: "Reduced tyre grip and longer stopping distance", ar: "انخفاض تماسك الإطارات وزيادة مسافة التوقف", correct: true },
      { en: "A higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false }
    ],
    keywords: [
      { term: "loose gravel", ar: "حصى متناثر", explainAr: "الحصى المتناثر يقلل من تماسك الإطارات مع الطريق." },
      { term: "bend", ar: "منعطف", explainAr: "المنعطفات مع الحصى المتناثر تزيد من خطر الانزلاق." },
      { term: "reduced grip", ar: "انخفاض التماسك", explainAr: "انخفاض التماسك يعني مسافة توقف أطول وخطر انزلاق أكبر." }
    ]
  },

  {
    id: "HZ-5048",
    topic: "hazard-awareness",
    promptEn: "You see a driver ahead frequently checking their mirrors and slowing. What hazard should you anticipate?",
    promptAr: "ترى سائقًا أمامك يفحص المرايا كثيرًا ويبطئ السرعة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is lost and may change lanes suddenly", ar: "قد يكون السائق تائهًا وقد يغيّر المسار فجأة", correct: true },
      { en: "The driver will stop immediately", ar: "سيتوقف السائق فورًا", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false }
    ],
    keywords: [
      { term: "driver behaviour", ar: "سلوك السائق", explainAr: "سلوك السائق يمكن أن يشير إلى نواياه أو حالته." },
      { term: "lane change", ar: "تغيير المسار", explainAr: "السائقون التائهون قد يغيرون المسار فجأة دون إشارة." },
      { term: "anticipation", ar: "التوقع", explainAr: "مراقبة سلوك السائقين الآخرين يساعد في توقع تحركاتهم." }
    ]
  },

  {
    id: "HZ-5049",
    topic: "hazard-awareness",
    promptEn: "You are driving near a railway level crossing and the barriers are up. What hazard should you still anticipate?",
    promptAr: "أثناء القيادة قرب معبر سكة حديد والموانع مرفوعة. ما الخطر الذي يجب أن تتوقعه رغم ذلك؟",
    options: [
      { en: "Trains cannot appear", ar: "لا يمكن للقطارات الظهور", correct: false },
      { en: "The barriers may start to close and traffic may stop suddenly", ar: "قد تبدأ الموانع بالإغلاق وقد يتوقف المرور فجأة", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "Pedestrians have priority", ar: "للمشاة أولوية المرور", correct: false }
    ],
    keywords: [
      { term: "level crossing", ar: "معبر سكة حديد", explainAr: "معابر السكك الحديدية خطيرة حتى عندما تكون الموانع مرفوعة." },
      { term: "barriers", ar: "موانع", explainAr: "الموانع قد تبدأ بالإغلاق في أي لحظة عند اقتراب قطار." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "المركبات قد تتوقف فجأة عند إغلاق الموانع." }
    ]
  },

  {
    id: "HZ-5050",
    topic: "hazard-awareness",
    promptEn: "You are driving on a busy high street and see a taxi pulling in near the kerb. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في شارع تجاري مزدحم، ترى سيارة أجرة تتوقف قرب الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The taxi will park for a long time", ar: "ستقف سيارة الأجرة لفترة طويلة", correct: false },
      { en: "Passengers may step into the road suddenly", ar: "قد ينزل ركاب إلى الطريق فجأة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will narrow permanently", ar: "سيضيق الطريق بشكل دائم", correct: false }
    ],
    keywords: [
      { term: "taxi", ar: "سيارة أجرة", explainAr: "سيارات الأجرة تتوقف بشكل متكرر لركاب قد ينزلون أو يصعدون." },
      { term: "passengers", ar: "ركاب", explainAr: "الركاب قد ينزلون من سيارة الأجرة ويدخلون الطريق دون انتباه." },
      { term: "busy street", ar: "شارع مزدحم", explainAr: "الشوارع المزدحمة تحتوي على مخاطر متعددة مثل الركاب والسيارات المتوقفة." }
    ]
  },

  {
    id: "HZ-5051",
    topic: "hazard-awareness",
    promptEn: "You are driving in fog and notice tail lights ahead suddenly become clearer. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في الضباب، تلاحظ أن الأضواء الخلفية أمامك أصبحت أوضح فجأة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Visibility is improving permanently", ar: "تحسنت الرؤية بشكل دائم", correct: false },
      { en: "You are closing the gap too quickly and traffic may stop", ar: "أنت تقترب بسرعة وقد يتوقف المرور", correct: true },
      { en: "The speed limit has increased", ar: "ازداد حد السرعة", correct: false },
      { en: "The vehicle ahead is accelerating", ar: "المركبة الأمامية تتسارع", correct: false }
    ],
    keywords: [
      { term: "fog", ar: "ضباب", explainAr: "الضباب يقلل الرؤية ويجعل من الصعب تقدير المسافات." },
      { term: "closing gap", ar: "تقليل المسافة", explainAr: "عندما تصبح الأضواء أوضح فجأة، قد يعني ذلك أنك تقترب بسرعة كبيرة." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "المرور قد يتوقف فجأة في الضباب، خاصة إذا كنت تقترب بسرعة." }
    ]
  },

  {
    id: "HZ-5052",
    topic: "hazard-awareness",
    promptEn: "You are approaching a mini-roundabout and see a vehicle hesitating at the entry. What hazard should you anticipate?",
    promptAr: "تقترب من دوّار صغير وترى مركبة مترددة عند الدخول. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will remain stationary", ar: "ستبقى المركبة متوقفة", correct: false },
      { en: "The vehicle may pull out suddenly", ar: "قد تندفع المركبة فجأة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road surface will change", ar: "سيتغير سطح الطريق", correct: false }
    ],
    keywords: [
      { term: "mini-roundabout", ar: "دوار صغير", explainAr: "الدوارات الصغيرة تتطلب انتباهاً خاصاً لأن المركبات قد تندفع فجأة." },
      { term: "hesitation", ar: "تردد", explainAr: "التردد عند الدخول إلى الدوار قد يشير إلى أن السائق قد يندفع فجأة." },
      { term: "emerging vehicle", ar: "مركبة مندفعة", explainAr: "المركبات المترددة قد تندفع فجأة إلى الدوار دون تحذير." }
    ]
  },

  {
    id: "HZ-5053",
    topic: "hazard-awareness",
    promptEn: "You are driving past roadworks and see temporary signs but no workers visible. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب أعمال طرق وترى إشارات مؤقتة دون وجود عمّال ظاهرين. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "No hazard if workers are not present", ar: "لا يوجد خطر إذا لم يكن هناك عمّال", correct: false },
      { en: "Sudden lane changes or uneven road surface", ar: "تغييرات مفاجئة في المسارات أو سطح طريق غير مستوٍ", correct: true },
      { en: "An increase in speed limit", ar: "زيادة حد السرعة", correct: false },
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال طرق", explainAr: "أعمال الطرق قد تسبب تغييرات في المسارات وسطح الطريق حتى بدون وجود عمّال." },
      { term: "temporary signs", ar: "إشارات مؤقتة", explainAr: "الإشارات المؤقتة تحذر من مخاطر أعمال الطرق." },
      { term: "uneven surface", ar: "سطح غير مستوٍ", explainAr: "أعمال الطرق قد تترك سطح طريق غير مستوٍ حتى بعد انتهاء العمل." }
    ]
  },

  {
    id: "HZ-5054",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead slowing near a cycle lane. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تُبطئ قرب مسار دراجات. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will park immediately", ar: "ستقف المركبة فورًا", correct: false },
      { en: "A cyclist may be alongside or crossing its path", ar: "قد يكون درّاج بمحاذاتها أو يعبر طريقها", correct: true },
      { en: "The speed limit will drop", ar: "سينخفض حد السرعة", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "cycle lane", ar: "مسار دراجات", explainAr: "المسارات المخصصة للدراجات قد تحتوي على دراجين قد يعبرون أو يتحركون بجانب المركبات." },
      { term: "cyclist", ar: "درّاج", explainAr: "الدراجون قد يكونون في نقاط عمياء أو يعبرون بشكل غير متوقع." },
      { term: "turning hazard", ar: "خطر الانعطاف", explainAr: "المركبات التي تبطئ قرب مسار دراجات قد تستعد للانعطاف عبر مسار الدراجات." }
    ]
  },

  {
    id: "HZ-5055",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy traffic and notice pedestrians looking between stationary vehicles. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ازدحام مروري كثيف، تلاحظ مشاة ينظرون بين مركبات متوقفة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will wait until traffic clears", ar: "سينتظرون حتى يخلو الطريق", correct: false },
      { en: "Pedestrians may cross between vehicles unexpectedly", ar: "قد يعبر المشاة بين المركبات بشكل غير متوقع", correct: true },
      { en: "Traffic will start moving smoothly", ar: "ستبدأ حركة المرور بسلاسة", correct: false },
      { en: "The road will be closed", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "heavy traffic", ar: "ازدحام مروري كثيف", explainAr: "الازدحام المروري الكثيف يزيد من احتمالية عبور المشاة بين المركبات." },
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة الذين ينظرون بين المركبات قد يعبرون الطريق فجأة." },
      { term: "crossing between vehicles", ar: "العبور بين المركبات", explainAr: "المشاة قد يعبرون بين المركبات المتوقفة دون رؤية المركبات المتحركة." }
    ]
  },

  {
    id: "HZ-5056",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet road and see a drain cover on a bend. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مبلل، ترى غطاء مصرف على منعطف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved grip over the cover", ar: "تماسك أفضل فوق الغطاء", correct: false },
      { en: "Loss of traction if you drive over it", ar: "فقدان التماسك عند المرور فوقه", correct: true },
      { en: "A speed limit increase", ar: "زيادة حد السرعة", correct: false },
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false }
    ],
    keywords: [
      { term: "wet road", ar: "طريق مبلل", explainAr: "الطرق المبللة تقلل من التماسك بين الإطارات والطريق." },
      { term: "drain cover", ar: "غطاء مصرف", explainAr: "أغطية المصارف المعدنية تصبح زلقة جداً على الطرق المبللة." },
      { term: "reduced grip", ar: "تماسك منخفض", explainAr: "فقدان التماسك يمكن أن يؤدي إلى انزلاق المركبة خاصة على المنعطفات." }
    ]
  },

  {
    id: "HZ-5057",
    topic: "hazard-awareness",
    promptEn: "You see a learner driver ahead approaching a junction. What hazard should you anticipate?",
    promptAr: "ترى سائقًا متعلمًا أمامك يقترب من تقاطع. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will proceed confidently", ar: "سيتقدم بثقة", correct: false },
      { en: "They may hesitate or stop unexpectedly", ar: "قد يتردد أو يتوقف بشكل غير متوقع", correct: true },
      { en: "They will always signal early", ar: "سيعطي إشارة مبكرة دائمًا", correct: false },
      { en: "They will drive faster than normal", ar: "سيقود أسرع من المعتاد", correct: false }
    ],
    keywords: [
      { term: "learner driver", ar: "سائق متعلم", explainAr: "السائقون المتعلمون قد يكونون أقل ثقة وقد يتخذون قرارات غير متوقعة." },
      { term: "junction", ar: "تقاطع", explainAr: "التقاطعات تتطلب قرارات سريعة وقد يتردد السائقون المتعلمون عندها." },
      { term: "hesitation", ar: "تردد", explainAr: "التردد المفاجئ أو التوقف غير المتوقع يمكن أن يشكل خطراً على المركبات الأخرى." }
    ]
  },

  {
    id: "HZ-5058",
    topic: "hazard-awareness",
    promptEn: "You are driving near parked buses and see passengers gathering. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب حافلات متوقفة وترى ركابًا يتجمعون. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The bus will reverse", ar: "سترجع الحافلة للخلف", correct: false },
      { en: "Passengers may step into the road", ar: "قد يخطو الركاب إلى الطريق", correct: true },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "bus passengers", ar: "ركاب الحافلة", explainAr: "ركاب الحافلات قد يتجمعون وينتظرون على الرصيف أو بالقرب من الطريق." },
      { term: "stepping out", ar: "الخطو إلى الطريق", explainAr: "الركاب قد يخطون إلى الطريق فجأة دون النظر، خاصة عند انتظار الحافلة أو النزول منها." },
      { term: "urban hazard", ar: "خطر حضري", explainAr: "المناطق الحضرية مليئة بالمخاطر المحتملة مثل المشاة والركاب الذين قد يتحركون بشكل غير متوقع." }
    ]
  },

  {
    id: "HZ-5059",
    topic: "hazard-awareness",
    promptEn: "You notice a vehicle ahead drifting towards the centre line on a bend. What hazard should you anticipate?",
    promptAr: "تلاحظ مركبة أمامك تنحرف نحو خط المنتصف عند منعطف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is indicating a turn", ar: "السائق يعطي إشارة انعطاف", correct: false },
      { en: "The vehicle may cross into your lane", ar: "قد تدخل المركبة إلى مسارك", correct: true },
      { en: "The road will widen", ar: "سيتسع الطريق", correct: false },
      { en: "Speed limits will change", ar: "ستتغير حدود السرعة", correct: false }
    ],
    keywords: [
      { term: "centre line", ar: "خط المنتصف", explainAr: "خط المنتصف يفصل بين مسارات المرور في اتجاهات مختلفة." },
      { term: "bend", ar: "منعطف", explainAr: "المنعطفات تتطلب انتباهاً خاصاً لأن المركبات قد تنحرف عن مسارها." },
      { term: "lane encroachment", ar: "التعدي على المسار", explainAr: "عندما تنحرف مركبة نحو خط المنتصف، قد تعبر إلى مسارك وتسبب تصادماً." }
    ]
  },

  {
    id: "HZ-5060",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see a flashing amber beacon ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة ليلاً، ترى ضوءًا كهرمانيًا وامضًا أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "A fast-moving emergency vehicle", ar: "مركبة طوارئ سريعة", correct: false },
      { en: "A slow-moving or working vehicle", ar: "مركبة بطيئة أو تعمل على الطريق", correct: true },
      { en: "A road closure", ar: "إغلاق الطريق", correct: false },
      { en: "Traffic lights ahead", ar: "إشارات مرور أمامك", correct: false }
    ],
    keywords: [
      { term: "amber beacon", ar: "ضوء كهرماني وامض", explainAr: "الضوء الكهرماني الوامض يشير عادة إلى مركبة بطيئة أو تعمل على الطريق." },
      { term: "slow-moving vehicle", ar: "مركبة بطيئة", explainAr: "المركبات البطيئة مثل شاحنات القمامة أو مركبات الصيانة قد تعمل على الطريق." },
      { term: "night hazard", ar: "خطر ليلي", explainAr: "القيادة ليلاً تقلل الرؤية وتجعل من الصعب رؤية المخاطر في الوقت المناسب." }
    ]
  },

  {
    id: "HZ-5061",
    topic: "hazard-awareness",
    promptEn: "You are driving on a road with parked cars and see a driver sitting in one with the engine running. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق فيه سيارات متوقفة، ترى سائقًا جالسًا في إحدى السيارات مع تشغيل المحرك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver will remain parked", ar: "سيبقى السائق متوقفًا", correct: false },
      { en: "The vehicle may pull out suddenly", ar: "قد تنطلق المركبة فجأة إلى الطريق", correct: true },
      { en: "The vehicle will switch off the engine", ar: "سيطفئ السائق المحرك", correct: false },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تتحرك فجأة إذا كان المحرك يعمل." },
      { term: "engine running", ar: "المحرك يعمل", explainAr: "المحرك المشغل يعني أن السائق قد يكون على وشك التحرك." },
      { term: "pulling out", ar: "الانطلاق", explainAr: "التحرك من مكان التوقف إلى الطريق بشكل مفاجئ." }
    ]
  },

  {
    id: "HZ-5062",
    topic: "hazard-awareness",
    promptEn: "You are approaching a crossroads and see a vehicle waiting to turn right from the opposite direction. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع طرق وترى مركبة قادمة من الاتجاه المقابل تنتظر للانعطاف يمينًا. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will wait until the lights change", ar: "ستنتظر المركبة حتى تتغير الإشارة", correct: false },
      { en: "The vehicle may turn across your path", ar: "قد تنعطف المركبة قاطعة طريقك", correct: true },
      { en: "The vehicle will reverse", ar: "سترجع المركبة للخلف", correct: false },
      { en: "The vehicle will accelerate straight ahead", ar: "ستتسارع المركبة للأمام", correct: false }
    ],
    keywords: [
      { term: "crossroads", ar: "تقاطع طرق", explainAr: "نقطة التقاء طرق متعددة حيث قد تعبر المركبات من اتجاهات مختلفة." },
      { term: "right turn", ar: "انعطاف يمين", explainAr: "الانعطاف يمينًا قد يتطلب قطع طريق المركبات القادمة من الاتجاه المقابل." },
      { term: "crossing path", ar: "قطع الطريق", explainAr: "عندما تعبر مركبة طريقك أثناء الانعطاف." }
    ]
  },

  {
    id: "HZ-5063",
    topic: "hazard-awareness",
    promptEn: "You are driving near a sports ground and see a crowd gathering. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب ملعب رياضي، ترى حشدًا من الناس يتجمع. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will be lighter", ar: "ستكون حركة المرور أخف", correct: false },
      { en: "Pedestrians may cross the road unpredictably", ar: "قد يعبر المشاة الطريق بشكل غير متوقع", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will close immediately", ar: "سيُغلق الطريق فورًا", correct: false }
    ],
    keywords: [
      { term: "sports ground", ar: "ملعب رياضي", explainAr: "مكان تجمع الناس لمشاهدة أو ممارسة الرياضة." },
      { term: "crowds", ar: "حشود", explainAr: "تجمعات كبيرة من الناس قد تتحرك بشكل غير متوقع." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين قد يعبرون الطريق بشكل مفاجئ دون النظر." }
    ]
  },

  {
    id: "HZ-5064",
    topic: "hazard-awareness",
    promptEn: "You are driving downhill and see brake lights ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة نزولًا، ترى أضواء الفرامل أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic ahead is accelerating", ar: "حركة المرور أمامك تتسارع", correct: false },
      { en: "Vehicles may stop suddenly with reduced braking distance", ar: "قد تتوقف المركبات فجأة مع زيادة مسافة التوقف", correct: true },
      { en: "The road surface is dry", ar: "سطح الطريق جاف", correct: false },
      { en: "The speed limit has increased", ar: "ازداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "downhill", ar: "نزول", explainAr: "القيادة على منحدر نزولي تزيد من سرعة المركبة." },
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "إشارة إلى أن المركبات أمامك تبطئ أو تتوقف." },
      { term: "longer stopping distance", ar: "مسافة توقف أطول", explainAr: "عند القيادة نزولاً، تحتاج مسافة أطول للتوقف بسبب الجاذبية." }
    ]
  },

  {
    id: "HZ-5065",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead slowing near a bus lane during operating hours. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تُبطئ قرب مسار حافلات خلال ساعات عمله. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will stop for a break", ar: "ستتوقف المركبة للاستراحة", correct: false },
      { en: "A bus may be approaching from behind", ar: "قد تقترب حافلة من الخلف", correct: true },
      { en: "The bus lane is not in use", ar: "مسار الحافلات غير مستخدم", correct: false },
      { en: "Traffic will flow faster", ar: "ستتحسن حركة المرور", correct: false }
    ],
    keywords: [
      { term: "bus lane", ar: "مسار حافلات", explainAr: "مسار مخصص للحافلات خلال ساعات معينة." },
      { term: "operating hours", ar: "ساعات العمل", explainAr: "الأوقات التي يكون فيها مسار الحافلات نشطًا." },
      { term: "approaching bus", ar: "حافلة قادمة", explainAr: "الحافلات قد تقترب بسرعة من الخلف في مسارها المخصص." }
    ]
  },

  {
    id: "HZ-5066",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet road and see a pedestrian running towards a crossing. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مبلل، ترى أحد المشاة يركض باتجاه ممر مشاة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The pedestrian will stop at the kerb", ar: "سيتوقف المشاة عند الرصيف", correct: false },
      { en: "The pedestrian may enter the crossing suddenly", ar: "قد يدخل المشاة الممر فجأة", correct: true },
      { en: "Traffic lights will remain green", ar: "ستبقى الإشارة خضراء", correct: false },
      { en: "The road surface will dry quickly", ar: "سيجف سطح الطريق بسرعة", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "منطقة مخصصة للمشاة لعبور الطريق." },
      { term: "wet road", ar: "طريق مبلل", explainAr: "الطرق المبللة تقلل من قوة الفرامل وتزيد مسافة التوقف." },
      { term: "sudden movement", ar: "حركة مفاجئة", explainAr: "المشاة الذين يركضون قد يدخلون الممر دون توقف أو تفكير." }
    ]
  },

  {
    id: "HZ-5067",
    topic: "hazard-awareness",
    promptEn: "You are approaching a junction and see a vehicle signalling left but positioned to the right. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع وترى مركبة تعطي إشارة انعطاف يسارًا لكنها متمركزة إلى اليمين. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will continue straight ahead", ar: "ستتابع المركبة السير للأمام", correct: false },
      { en: "The vehicle may turn unpredictably across your path", ar: "قد تنعطف المركبة بشكل غير متوقع قاطعة طريقك", correct: true },
      { en: "The vehicle will stop completely", ar: "ستتوقف المركبة تمامًا", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "conflicting signals", ar: "إشارات متضاربة", explainAr: "عندما لا تتطابق إشارة المركبة مع موقعها، قد يكون السائق مشتتًا أو غير منتبه." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة حيث تحدث معظم الحوادث." },
      { term: "unpredictable manoeuvre", ar: "مناورة غير متوقعة", explainAr: "المركبة قد تنعطف بشكل مفاجئ دون تحذير كافٍ." }
    ]
  },

  {
    id: "HZ-5068",
    topic: "hazard-awareness",
    promptEn: "You are driving past a construction site and see vehicles entering and leaving. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب موقع إنشاءات، ترى مركبات تدخل وتخرج. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false },
      { en: "Slow or turning vehicles crossing your path", ar: "مركبات بطيئة أو منعطفة قد تقطع طريقك", correct: true },
      { en: "A permanent road closure", ar: "إغلاق دائم للطريق", correct: false },
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false }
    ],
    keywords: [
      { term: "construction site", ar: "موقع إنشاءات", explainAr: "منطقة عمل قد تحتوي على مركبات ثقيلة ومواد بناء." },
      { term: "entering traffic", ar: "مرور دخول", explainAr: "المركبات التي تدخل من موقع الإنشاءات قد تتحرك ببطء أو بشكل مفاجئ." },
      { term: "crossing path", ar: "قطع الطريق", explainAr: "المركبات التي تعبر طريقك أثناء الدخول أو الخروج من موقع الإنشاءات." }
    ]
  },

  {
    id: "HZ-5069",
    topic: "hazard-awareness",
    promptEn: "You see a cyclist ahead riding close to parked cars. What hazard should you anticipate?",
    promptAr: "ترى درّاجًا أمامك يسير قرب سيارات متوقفة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will stay close to the kerb", ar: "سيبقى الدرّاج قرب الحافة", correct: false },
      { en: "The cyclist may move out to avoid opening doors", ar: "قد يبتعد الدرّاج لتجنب أبواب تُفتح", correct: true },
      { en: "The cyclist will stop suddenly", ar: "سيتوقف الدرّاج فجأة", correct: false },
      { en: "The cyclist will dismount", ar: "سينزل الدرّاج عن الدراجة", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "درّاج", explainAr: "شخص يركب دراجة قد يكون عرضة للخطر من السيارات المتوقفة." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تفتح أبوابها فجأة مما يهدد الدرّاجين." },
      { term: "door zone", ar: "منطقة الأبواب", explainAr: "المسافة التي قد تفتح فيها أبواب السيارات المتوقفة، وهي خطيرة للدرّاجين." }
    ]
  },

  {
    id: "HZ-5070",
    topic: "hazard-awareness",
    promptEn: "You are driving in traffic and see a vehicle ahead with a roof rack carrying a loose load. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة المرور، ترى مركبة أمامك تحمل حمولة غير ثابتة على رف السقف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will increase speed", ar: "ستزيد المركبة سرعتها", correct: false },
      { en: "Items may fall into the road", ar: "قد تسقط أشياء على الطريق", correct: true },
      { en: "Traffic will slow smoothly", ar: "سيتباطأ المرور بسلاسة", correct: false },
      { en: "The load will secure itself", ar: "ستثبت الحمولة نفسها", correct: false }
    ],
    keywords: [
      { term: "loose load", ar: "حمولة غير ثابتة", explainAr: "الحمولة غير المثبتة جيدًا قد تسقط على الطريق وتشكل خطرًا." },
      { term: "roof rack", ar: "رف السقف", explainAr: "جهاز مثبت على سقف المركبة لحمل الأمتعة أو الحمولات." },
      { term: "falling objects", ar: "أشياء متساقطة", explainAr: "الأشياء التي تسقط من المركبات قد تضرب مركبات أخرى أو تعيق الطريق." }
    ]
  },

  {
    id: "HZ-5071",
    topic: "hazard-awareness",
    promptEn: "You are approaching a zebra crossing and see a pedestrian looking towards traffic but not yet stepping out. What hazard should you anticipate?",
    promptAr: "تقترب من ممر مشاة (زِبرا) وترى أحد المشاة ينظر إلى حركة المرور دون أن يخطو بعد. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The pedestrian will wait until waved across", ar: "سينتظر المشاة حتى تتم الإشارة له بالعبور", correct: false },
      { en: "The pedestrian may step onto the crossing suddenly", ar: "قد يخطو المشاة إلى الممر فجأة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The crossing is not in use", ar: "الممر غير مستخدم", correct: false }
    ],
    keywords: [
      { term: "zebra crossing", ar: "ممر مشاة (زِبرا)", explainAr: "ممر مشاة مخصص للمشاة لعبور الطريق بأمان." },
      { term: "pedestrian intention", ar: "نية المشاة", explainAr: "يجب أن تكون منتبهًا لإشارات المشاة التي قد تدل على نيتهم في العبور." },
      { term: "anticipation", ar: "التوقع", explainAr: "القدرة على توقع الأخطار المحتملة قبل حدوثها." }
    ]
  },

  {
    id: "HZ-5072",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy rain and see spray reducing visibility ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في أمطار غزيرة، ترى رذاذًا يقلل الرؤية أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved visibility as traffic moves", ar: "تحسّن الرؤية مع تحرك المرور", correct: false },
      { en: "Traffic ahead may slow or stop suddenly", ar: "قد تتباطأ أو تتوقف حركة المرور أمامك فجأة", correct: true },
      { en: "A higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Clear road surface", ar: "سطح طريق خالٍ", correct: false }
    ],
    keywords: [
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "الأمطار الغزيرة تقلل الرؤية وتزيد من خطر الحوادث." },
      { term: "spray", ar: "رذاذ", explainAr: "الرذاذ المتطاير من المركبات يقلل الرؤية بشكل كبير." },
      { term: "reduced visibility", ar: "انخفاض الرؤية", explainAr: "عندما تقل الرؤية، يجب تقليل السرعة والاستعداد للتوقف المفاجئ." }
    ]
  },

  {
    id: "HZ-5073",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead straddling lane markings in slow traffic. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تسير فوق خطوط المسار في حركة مرور بطيئة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is confident", ar: "السائق واثق", correct: false },
      { en: "The vehicle may change lanes suddenly", ar: "قد تغيّر المركبة المسار فجأة", correct: true },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false },
      { en: "The vehicle will stop permanently", ar: "ستتوقف المركبة نهائيًا", correct: false }
    ],
    keywords: [
      { term: "lane discipline", ar: "انضباط المسار", explainAr: "الالتزام بالبقاء داخل حدود المسار المحدد." },
      { term: "slow traffic", ar: "حركة مرور بطيئة", explainAr: "الحركة البطيئة قد تجعل السائقين يغيرون المسارات بشكل مفاجئ." },
      { term: "sudden lane change", ar: "تغيير مسار مفاجئ", explainAr: "تغيير المسار دون إشارة أو تحذير مناسب يشكل خطرًا على المركبات الأخرى." }
    ]
  },

  {
    id: "HZ-5074",
    topic: "hazard-awareness",
    promptEn: "You are driving near a park entrance and see a group of cyclists approaching. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مدخل حديقة، ترى مجموعة من الدراجين يقتربون. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Cyclists will stop at the kerb", ar: "سيتوقف الدراجون عند الرصيف", correct: false },
      { en: "Cyclists may enter the road together", ar: "قد يدخل الدراجون الطريق معًا", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The road will narrow permanently", ar: "سيضيق الطريق بشكل دائم", correct: false }
    ],
    keywords: [
      { term: "cyclists", ar: "الدراجون", explainAr: "الأشخاص الذين يركبون الدراجات يحتاجون إلى مساحة آمنة على الطريق." },
      { term: "park entrance", ar: "مدخل حديقة", explainAr: "الأماكن العامة مثل الحدائق قد يكون فيها حركة كثيفة للمشاة والدراجين." },
      { term: "group movement", ar: "حركة جماعية", explainAr: "عندما يتحرك الدراجون في مجموعة، قد يدخلون الطريق معًا مما يتطلب حذرًا إضافيًا." }
    ]
  },

  {
    id: "HZ-5075",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see a vehicle ahead with no headlights. What hazard should you anticipate?",
    promptAr: "أثناء القيادة ليلاً، ترى مركبة أمامك دون أضواء أمامية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will turn off soon", ar: "ستنطفئ المركبة قريبًا", correct: false },
      { en: "The vehicle may be hard to judge and slow or stop unexpectedly", ar: "قد يصعب تقدير حركة المركبة وقد تُبطئ أو تتوقف فجأة", correct: true },
      { en: "The road is well lit so no risk", ar: "الطريق مضاء جيدًا فلا يوجد خطر", correct: false },
      { en: "Speed limits will change", ar: "ستتغير حدود السرعة", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "القيادة ليلاً", explainAr: "القيادة في الليل تتطلب حذرًا إضافيًا بسبب انخفاض الرؤية." },
      { term: "unlit vehicle", ar: "مركبة غير مضاءة", explainAr: "المركبة التي لا تستخدم الأضواء قد تكون صعبة الرؤية والتقدير." },
      { term: "judging distance", ar: "تقدير المسافة", explainAr: "عندما تكون المركبة غير مضاءة، يصعب تقدير المسافة والسرعة بدقة." }
    ]
  },

  {
    id: "HZ-5076",
    topic: "hazard-awareness",
    promptEn: "You are driving along a road with parked cars and notice a gap between two vehicles. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق فيه سيارات متوقفة، تلاحظ فجوة بين سيارتين. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The gap is for parking only", ar: "الفجوة مخصصة للوقوف فقط", correct: false },
      { en: "A pedestrian may step out from between the vehicles", ar: "قد يخرج مشاة من بين المركبات", correct: true },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The road will narrow permanently", ar: "سيضيق الطريق بشكل دائم", correct: false }
    ],
    keywords: [
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة على جانب الطريق قد تخفي المشاة خلفها." },
      { term: "gaps", ar: "فجوات", explainAr: "المسافات بين السيارات المتوقفة قد تكون نقاط خروج للمشاة." },
      { term: "hidden pedestrians", ar: "مشاة مخفيون", explainAr: "المشاة الذين يظهرون فجأة من بين السيارات المتوقفة يشكلون خطرًا كبيرًا." }
    ]
  },

  {
    id: "HZ-5077",
    topic: "hazard-awareness",
    promptEn: "You see a car ahead braking lightly and repeatedly in flowing traffic. What hazard should you anticipate?",
    promptAr: "ترى سيارة أمامك تكبح بشكل خفيف ومتكرر في حركة مرور مستمرة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is maintaining distance", ar: "السائق يحافظ على المسافة", correct: false },
      { en: "Traffic ahead may become congested suddenly", ar: "قد يحدث ازدحام مفاجئ أمامك", correct: true },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false },
      { en: "The speed limit has increased", ar: "ازداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "repeated braking", ar: "كبح متكرر", explainAr: "الكبح المتكرر قد يشير إلى مشكلة في حركة المرور أمامك." },
      { term: "flowing traffic", ar: "حركة مرور مستمرة", explainAr: "عندما تكون حركة المرور مستمرة، فإن الكبح المتكرر غير عادي ويشير إلى خطر محتمل." },
      { term: "sudden congestion", ar: "ازدحام مفاجئ", explainAr: "قد يحدث ازدحام مفاجئ يتطلب منك التباطؤ أو التوقف." }
    ]
  },

  {
    id: "HZ-5078",
    topic: "hazard-awareness",
    promptEn: "You are driving on a rural road and see a tractor emerging from a field. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق ريفي، ترى جرارًا زراعيًا يخرج من حقل. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The tractor will move quickly", ar: "سيتحرك الجرار بسرعة", correct: false },
      { en: "Slow-moving vehicle entering your path", ar: "مركبة بطيئة تدخل إلى مسارك", correct: true },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false },
      { en: "A speed limit increase", ar: "زيادة حد السرعة", correct: false }
    ],
    keywords: [
      { term: "tractor", ar: "جرار زراعي", explainAr: "الجرارات الزراعية تتحرك ببطء شديد وتحتاج إلى حذر عند الاقتراب منها." },
      { term: "rural road", ar: "طريق ريفي", explainAr: "الطرق الريفية قد تحتوي على مركبات زراعية بطيئة الحركة." },
      { term: "slow vehicle", ar: "مركبة بطيئة", explainAr: "المركبات البطيئة تتطلب منك التباطؤ والتخطيط للتجاوز بأمان." }
    ]
  },

  {
    id: "HZ-5079",
    topic: "hazard-awareness",
    promptEn: "You are approaching traffic lights and see pedestrians gathering near the push-button. What hazard should you anticipate?",
    promptAr: "تقترب من إشارات مرور وترى مشاة يتجمعون قرب زر العبور. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The lights will stay green", ar: "ستبقى الإشارة خضراء", correct: false },
      { en: "The lights may change and pedestrians may start crossing", ar: "قد تتغير الإشارة ويبدأ المشاة بالعبور", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The crossing is out of order", ar: "الممر معطل", correct: false }
    ],
    keywords: [
      { term: "traffic lights", ar: "إشارات مرور", explainAr: "إشارات المرور تنظم حركة المركبات والمشاة." },
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة الذين يتجمعون قرب إشارة المرور قد يعبرون قريبًا." },
      { term: "signal change", ar: "تغيير الإشارة", explainAr: "عندما يضغط المشاة على زر العبور، قد تتغير الإشارة قريبًا." }
    ]
  },

  {
    id: "HZ-5080",
    topic: "hazard-awareness",
    promptEn: "You are driving downhill in wet conditions and see a bend ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة نزولًا في ظروف مبللة، ترى منعطفًا أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved braking efficiency", ar: "تحسن كفاءة الكبح", correct: false },
      { en: "Longer stopping distance and reduced control", ar: "زيادة مسافة التوقف وانخفاض السيطرة", correct: true },
      { en: "Clear visibility around the bend", ar: "رؤية واضحة حول المنعطف", correct: false },
      { en: "Higher speed limit", ar: "حد سرعة أعلى", correct: false }
    ],
    keywords: [
      { term: "downhill", ar: "نزول", explainAr: "القيادة نزولًا تزيد من سرعة المركبة وتتطلب حذرًا إضافيًا." },
      { term: "wet road", ar: "طريق مبلل", explainAr: "الطرق المبللة تقلل من قوة التصاق الإطارات وتزيد مسافة التوقف." },
      { term: "reduced control", ar: "انخفاض السيطرة", explainAr: "في الظروف المبللة وعلى المنحدرات، تقل قدرتك على التحكم في المركبة." }
    ]
  },

  {
    id: "HZ-5081",
    topic: "hazard-awareness",
    promptEn: "You are driving past a bus that has just pulled away from a stop. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب حافلة بدأت بالتحرك من موقفها، ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The bus will accelerate quickly", ar: "ستتسارع الحافلة بسرعة", correct: false },
      { en: "Pedestrians may cross in front of the bus", ar: "قد يعبر مشاة أمام الحافلة", correct: true },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The bus will reverse", ar: "سترجع الحافلة للخلف", correct: false }
    ],
    keywords: [
      { term: "bus pulling out", ar: "حافلة تتحرك من الموقف", explainAr: "عندما تتحرك الحافلة من الموقف، قد يكون هناك مشاة خلفها أو على الجانب الآخر." },
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة الذين كانوا ينتظرون الحافلة قد يعبرون الطريق فجأة بعد تحركها." },
      { term: "hidden hazard", ar: "خطر مخفي", explainAr: "المشاة خلف الحافلة لا يمكن رؤيتهم، مما يجعلهم خطرًا محتملاً." }
    ]
  },

  {
    id: "HZ-5082",
    topic: "hazard-awareness",
    promptEn: "You are driving on a tree-lined road and notice fallen leaves. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق تحيط به الأشجار وتلاحظ أوراقًا متساقطة، ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved grip on the road", ar: "تحسن التماسك على الطريق", correct: false },
      { en: "Reduced grip, especially when wet", ar: "انخفاض التماسك خاصة عند البلل", correct: true },
      { en: "Clear visibility ahead", ar: "رؤية واضحة أمامك", correct: false },
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false }
    ],
    keywords: [
      { term: "fallen leaves", ar: "أوراق متساقطة", explainAr: "الأوراق المتساقطة على الطريق يمكن أن تجعله زلقًا، خاصة عند البلل." },
      { term: "reduced grip", ar: "انخفاض التماسك", explainAr: "الأوراق الرطبة تقلل من قوة التصاق الإطارات بالطريق، مما يزيد من خطر الانزلاق." },
      { term: "slippery surface", ar: "سطح زلق", explainAr: "الأوراق المتساقطة تخلق سطحًا زلقًا يمكن أن يقلل من التحكم في المركبة." }
    ]
  },

  {
    id: "HZ-5083",
    topic: "hazard-awareness",
    promptEn: "You see a delivery rider stopping frequently along the road. What hazard should you anticipate?",
    promptAr: "ترى سائق توصيل يتوقف بشكل متكرر على الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The rider will leave the road", ar: "سيغادر السائق الطريق", correct: false },
      { en: "Sudden stopping or pulling away", ar: "توقف أو انطلاق مفاجئ", correct: true },
      { en: "Traffic lights changing", ar: "تغير إشارات المرور", correct: false },
      { en: "Road closure ahead", ar: "إغلاق الطريق أمامك", correct: false }
    ],
    keywords: [
      { term: "delivery rider", ar: "سائق توصيل", explainAr: "سائقو التوصيل يتوقفون بشكل متكرر لتسليم الطلبات، مما يجعل تحركاتهم غير متوقعة." },
      { term: "frequent stops", ar: "توقفات متكررة", explainAr: "التوقفات المتكررة تعني أن السائق قد يتوقف أو ينطلق فجأة دون إشارة واضحة." },
      { term: "sudden movement", ar: "حركة مفاجئة", explainAr: "الحركات المفاجئة من سائقي التوصيل يمكن أن تشكل خطرًا على المركبات الأخرى." }
    ]
  },

  {
    id: "HZ-5084",
    topic: "hazard-awareness",
    promptEn: "You are approaching a school crossing patrol holding a stop sign. What hazard should you anticipate?",
    promptAr: "تقترب من مراقب عبور مدرسة يحمل إشارة توقف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will continue normally", ar: "ستستمر حركة المرور بشكل طبيعي", correct: false },
      { en: "Children may start crossing the road", ar: "قد يبدأ الأطفال بعبور الطريق", correct: true },
      { en: "The patrol will move aside", ar: "سيتحرك المراقب جانبًا", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "school crossing patrol", ar: "مراقب عبور مدرسة", explainAr: "مراقب عبور المدرسة يساعد الأطفال على عبور الطريق بأمان." },
      { term: "children", ar: "أطفال", explainAr: "الأطفال قد يكونون غير متوقعين في تحركاتهم وقد يعبرون الطريق فجأة." },
      { term: "stop sign", ar: "إشارة توقف", explainAr: "عندما يرفع المراقب إشارة التوقف، يجب التوقف تمامًا لأن الأطفال قد يعبرون." }
    ]
  },

  {
    id: "HZ-5085",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see reflections from animals' eyes at the roadside. What hazard should you anticipate?",
    promptAr: "أثناء القيادة ليلاً، ترى انعكاس عيون حيوانات على جانب الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Animals will stay away from the road", ar: "ستبقى الحيوانات بعيدًا عن الطريق", correct: false },
      { en: "Animals may move onto the road suddenly", ar: "قد تدخل الحيوانات الطريق فجأة", correct: true },
      { en: "The road surface is clear", ar: "سطح الطريق خالٍ", correct: false },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "animals", ar: "حيوانات", explainAr: "الحيوانات البرية يمكن أن تتحرك بشكل غير متوقع وتدخل الطريق فجأة." },
      { term: "night driving", ar: "القيادة ليلاً", explainAr: "القيادة ليلاً تقلل من الرؤية وتجعل اكتشاف الحيوانات أكثر صعوبة." },
      { term: "sudden hazard", ar: "خطر مفاجئ", explainAr: "الحيوانات قد تتحرك فجأة إلى الطريق دون سابق إنذار، مما يتطلب حذرًا إضافيًا." }
    ]
  },

  {
    id: "HZ-5086",
    topic: "hazard-awareness",
    promptEn: "You are driving in slow traffic and see a driver ahead checking a sat-nav repeatedly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة مرور بطيئة، ترى سائقًا أمامك ينظر إلى جهاز الملاحة بشكل متكرر. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver will keep a steady course", ar: "سيحافظ السائق على مساره بثبات", correct: false },
      { en: "Sudden lane changes or braking", ar: "تغيير مسار أو كبح مفاجئ", correct: true },
      { en: "The driver will stop permanently", ar: "سيتوقف السائق نهائيًا", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "sat-nav", ar: "جهاز الملاحة", explainAr: "الانشغال بجهاز الملاحة أثناء القيادة يشتت انتباه السائق ويجعله أقل تركيزًا على الطريق." },
      { term: "distracted driver", ar: "سائق مشتت", explainAr: "السائق المشتت قد يقوم بحركات مفاجئة وغير متوقعة مثل تغيير المسار أو الكبح المفاجئ." },
      { term: "sudden manoeuvre", ar: "مناورة مفاجئة", explainAr: "الحركات المفاجئة من السائق المشتت يمكن أن تشكل خطرًا على المركبات الأخرى." }
    ]
  },

  {
    id: "HZ-5087",
    topic: "hazard-awareness",
    promptEn: "You are approaching a narrow bridge and see oncoming traffic. What hazard should you anticipate?",
    promptAr: "تقترب من جسر ضيق وترى حركة مرور قادمة من الاتجاه المقابل. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Both vehicles can pass easily", ar: "يمكن للمركبتين المرور بسهولة", correct: false },
      { en: "You may need to slow down or give way", ar: "قد تحتاج إلى التخفيف أو إعطاء الطريق", correct: true },
      { en: "The bridge will widen", ar: "سيتسع الجسر", correct: false },
      { en: "Traffic will stop automatically", ar: "سيتوقف المرور تلقائيًا", correct: false }
    ],
    keywords: [
      { term: "narrow bridge", ar: "جسر ضيق", explainAr: "الجسور الضيقة لا تسمح بمرور مركبتين جنبًا إلى جنب بأمان، مما يتطلب الحذر." },
      { term: "oncoming traffic", ar: "حركة مرور قادمة", explainAr: "عند وجود حركة مرور قادمة على جسر ضيق، قد تحتاج إلى التخفيف أو إعطاء الطريق." },
      { term: "giving way", ar: "إعطاء الطريق", explainAr: "في الجسور الضيقة، قد تحتاج إلى التوقف أو التخفيف لإعطاء الطريق للمركبات القادمة." }
    ]
  },

  {
    id: "HZ-5088",
    topic: "hazard-awareness",
    promptEn: "You are driving in strong crosswinds and see a high-sided vehicle ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في رياح جانبية قوية، ترى مركبة عالية الجوانب أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will maintain a straight line", ar: "ستحافظ المركبة على خط مستقيم", correct: false },
      { en: "The vehicle may be blown off course", ar: "قد تنحرف المركبة عن مسارها", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "crosswinds", ar: "رياح جانبية", explainAr: "الرياح الجانبية القوية يمكن أن تؤثر على استقرار المركبات، خاصة المركبات عالية الجوانب." },
      { term: "high-sided vehicle", ar: "مركبة عالية الجوانب", explainAr: "المركبات عالية الجوانب مثل الشاحنات والحافلات أكثر عرضة للتأثر بالرياح الجانبية." },
      { term: "loss of control", ar: "فقدان السيطرة", explainAr: "الرياح القوية يمكن أن تدفع المركبة عالية الجوانب عن مسارها، مما قد يؤدي إلى فقدان السيطرة." }
    ]
  },

  {
    id: "HZ-5089",
    topic: "hazard-awareness",
    promptEn: "You are approaching a junction and see road markings partially obscured by snow. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع وترى علامات الطريق مغطاة جزئيًا بالثلج. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Road layout is unchanged", ar: "تخطيط الطريق لم يتغير", correct: false },
      { en: "Other drivers may misjudge priorities", ar: "قد يسيء السائقون الآخرون تقدير الأولويات", correct: true },
      { en: "The speed limit is higher", ar: "حد السرعة أعلى", correct: false },
      { en: "Traffic lights are not needed", ar: "لا حاجة لإشارات المرور", correct: false }
    ],
    keywords: [
      { term: "snow", ar: "ثلج", explainAr: "الثلج يمكن أن يغطي علامات الطريق ويجعلها غير مرئية، مما يزيد من خطر الحوادث." },
      { term: "obscured markings", ar: "علامات مغطاة", explainAr: "عندما تكون علامات الطريق مغطاة، يصعب على السائقين معرفة قواعد الأولوية والمسار الصحيح." },
      { term: "misjudgement", ar: "سوء التقدير", explainAr: "عندما لا تكون علامات الطريق واضحة، قد يسيء السائقون الآخرون تقدير من له الأولوية في التقاطع." }
    ]
  },

  {
    id: "HZ-5090",
    topic: "hazard-awareness",
    promptEn: "You are driving near a hospital entrance and see vehicles stopping briefly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مدخل مستشفى، ترى مركبات تتوقف لفترة قصيرة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will move smoothly", ar: "ستتحرك حركة المرور بسلاسة", correct: false },
      { en: "Pedestrians or vehicles may emerge suddenly", ar: "قد يظهر مشاة أو مركبات فجأة", correct: true },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "hospital", ar: "مستشفى", explainAr: "المستشفيات هي أماكن نشطة حيث قد يظهر المشاة والمركبات بشكل مفاجئ." },
      { term: "brief stops", ar: "توقفات قصيرة", explainAr: "التوقفات القصيرة للمركبات قد تشير إلى أن هناك نشاطًا في المنطقة، مثل تسليم أو استقبال المرضى." },
      { term: "sudden emergence", ar: "ظهور مفاجئ", explainAr: "قرب المستشفيات، قد يظهر المشاة أو المركبات فجأة من المداخل أو الممرات الجانبية." }
    ]
  },

  {
    id: "HZ-5091",
    topic: "hazard-awareness",
    promptEn: "You are driving past a parked car with its wheels turned outwards. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب سيارة متوقفة وعجلاتها موجهة للخارج. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The car is securely parked", ar: "السيارة متوقفة بشكل آمن", correct: false },
      { en: "The car may pull out into the road", ar: "قد تنطلق السيارة إلى الطريق", correct: true },
      { en: "The road surface will narrow", ar: "سيضيق سطح الطريق", correct: false },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "parked car", ar: "سيارة متوقفة", explainAr: "السيارة المتوقفة قد تكون على وشك الانطلاق، خاصة إذا كانت العجلات موجهة للخارج." },
      { term: "wheels turned", ar: "عجلات موجهة", explainAr: "عندما تكون عجلات السيارة المتوقفة موجهة للخارج، فهذا يشير إلى أن السائق قد يكون على وشك الانطلاق إلى الطريق." },
      { term: "pulling out", ar: "الانطلاق", explainAr: "السيارة المتوقفة قد تنطلق فجأة إلى الطريق، مما يتطلب منك أن تكون مستعدًا للتباطؤ أو التوقف." }
    ]
  },

  {
    id: "HZ-5092",
    topic: "hazard-awareness",
    promptEn: "You are approaching a crossroads and see pedestrians waiting on a central refuge. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع وترى مشاة ينتظرون على جزيرة وسطية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will stay on the refuge", ar: "سيبقون على الجزيرة", correct: false },
      { en: "They may continue crossing into your lane", ar: "قد يكملون العبور إلى مسارك", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The crossing is closed", ar: "الممر مغلق", correct: false }
    ],
    keywords: [
      { term: "central refuge", ar: "جزيرة وسطية", explainAr: "منطقة آمنة في منتصف الطريق حيث ينتظر المشاة لعبور النصف الثاني من الطريق." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يعبرون الطريق قد يكملون عبورهم فجأة، خاصة إذا كانوا على جزيرة وسطية." },
      { term: "crossing", ar: "عبور", explainAr: "المشاة على الجزيرة الوسطية قد يكملون عبورهم إلى مسارك دون سابق إنذار، مما يتطلب منك الحذر والاستعداد للتوقف." }
    ]
  },

  {
    id: "HZ-5093",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead with its brake lights flickering on and off. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تومض أضواء الفرامل بشكل متكرر. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is signalling politely", ar: "السائق يعطي إشارة مجاملة", correct: false },
      { en: "Traffic flow ahead is unstable and may stop suddenly", ar: "حركة المرور أمامك غير مستقرة وقد تتوقف فجأة", correct: true },
      { en: "The road surface is smooth", ar: "سطح الطريق ناعم", correct: false },
      { en: "The speed limit has changed", ar: "تغير حد السرعة", correct: false }
    ],
    keywords: [
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "أضواء الفرامل تومض عندما يضغط السائق على الفرامل بشكل متكرر." },
      { term: "unstable traffic", ar: "حركة مرور غير مستقرة", explainAr: "الفرملة المتكررة تشير إلى أن حركة المرور أمامك غير مستقرة وقد تتوقف فجأة." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "عندما تومض أضواء الفرامل بشكل متكرر، يجب أن تكون مستعدًا لتوقف مفاجئ في حركة المرور أمامك." }
    ]
  },

  {
    id: "HZ-5094",
    topic: "hazard-awareness",
    promptEn: "You are driving near a pub at closing time and see people gathered outside. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب حانة وقت الإغلاق، ترى أشخاصًا متجمعين في الخارج. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will be lighter", ar: "ستكون حركة المرور أخف", correct: false },
      { en: "Pedestrians may act unpredictably and step into the road", ar: "قد يتصرف المشاة بشكل غير متوقع ويخطون إلى الطريق", correct: true },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false },
      { en: "Speed limits will increase", ar: "ستزداد حدود السرعة", correct: false }
    ],
    keywords: [
      { term: "pub closing time", ar: "وقت إغلاق الحانة", explainAr: "وقت إغلاق الحانات هو وقت خطير حيث قد يكون الناس تحت تأثير الكحول ويتصرفون بشكل غير متوقع." },
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة قرب الحانات وقت الإغلاق قد يتصرفون بشكل غير متوقع بسبب تأثير الكحول." },
      { term: "unpredictable behaviour", ar: "سلوك غير متوقع", explainAr: "الأشخاص تحت تأثير الكحول قد يخطون إلى الطريق دون تفكير أو دون النظر، مما يشكل خطرًا كبيرًا." }
    ]
  },

  {
    id: "HZ-5095",
    topic: "hazard-awareness",
    promptEn: "You are driving in early morning mist and see a cyclist without lights ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ضباب صباحي خفيف، ترى درّاجًا بلا أضواء أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will be clearly visible", ar: "سيكون الدرّاج واضح الرؤية", correct: false },
      { en: "The cyclist may be hard to see and judge distance", ar: "قد يصعب رؤية الدرّاج وتقدير المسافة", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The cyclist will stop immediately", ar: "سيتوقف الدرّاج فورًا", correct: false }
    ],
    keywords: [
      { term: "mist", ar: "ضباب", explainAr: "الضباب يقلل من الرؤية ويجعل من الصعب رؤية المركبات والدراجات، خاصة تلك التي لا تحمل أضواء." },
      { term: "cyclist without lights", ar: "درّاج بلا أضواء", explainAr: "الدرّاجون بدون أضواء يصعب رؤيتهم في الظروف الضبابية، مما يزيد من خطر الحوادث." },
      { term: "visibility", ar: "الرؤية", explainAr: "في الضباب، تقل الرؤية بشكل كبير، مما يجعل من الصعب رؤية الدرّاجين وتقدير المسافة إليهم بدقة." }
    ]
  },

  {
    id: "HZ-5096",
    topic: "hazard-awareness",
    promptEn: "You are driving past a driveway and see a vehicle's front wheels turned towards the road. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب مدخل منزل، ترى عجلات مركبة موجهة نحو الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is parked securely", ar: "المركبة متوقفة بشكل آمن", correct: false },
      { en: "The vehicle may pull out suddenly", ar: "قد تنطلق المركبة فجأة إلى الطريق", correct: true },
      { en: "The road surface will narrow", ar: "سيضيق سطح الطريق", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "driveway", ar: "مدخل منزل", explainAr: "المدخل المؤدي إلى منزل خاص، حيث قد تكون المركبات متوقفة وتستعد للانطلاق." },
      { term: "wheels turned", ar: "عجلات موجهة", explainAr: "عندما تكون العجلات الأمامية موجهة نحو الطريق، فهذا يشير إلى أن السائق يستعد للانطلاق." },
      { term: "pulling out", ar: "الانطلاق إلى الطريق", explainAr: "المركبة قد تنطلق فجأة من المدخل إلى الطريق دون سابق إنذار، مما يشكل خطرًا على المركبات المارة." }
    ]
  },

  {
    id: "HZ-5097",
    topic: "hazard-awareness",
    promptEn: "You are approaching a bend and see a warning sign for pedestrians. What hazard should you anticipate?",
    promptAr: "تقترب من منعطف وترى علامة تحذير لوجود مشاة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Pedestrians will stay on the pavement", ar: "سيبقى المشاة على الرصيف", correct: false },
      { en: "Pedestrians may be walking in the road or crossing", ar: "قد يكون المشاة يسيرون في الطريق أو يعبرونه", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will straighten", ar: "سيستقيم الطريق", correct: false }
    ],
    keywords: [
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام، وقد يكونون في الطريق أو يعبرونه." },
      { term: "bend", ar: "منعطف", explainAr: "المنعطف يقلل من الرؤية، مما يجعل من الصعب رؤية المشاة في الوقت المناسب." },
      { term: "limited view", ar: "رؤية محدودة", explainAr: "في المنعطفات، تكون الرؤية محدودة وقد لا ترى المشاة حتى تكون قريبًا جدًا منهم." }
    ]
  },

  {
    id: "HZ-5098",
    topic: "hazard-awareness",
    promptEn: "You are driving in stop-start traffic and see a motorcyclist filtering between lanes. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة مرور متوقفة ومتقطعة، ترى درّاجًا ناريًا يشق طريقه بين المسارات. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The motorcyclist will stop behind you", ar: "سيتوقف الدرّاج خلفك", correct: false },
      { en: "The motorcyclist may appear suddenly alongside your vehicle", ar: "قد يظهر الدرّاج فجأة بمحاذاة مركبتك", correct: true },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false },
      { en: "Lane markings will change", ar: "ستتغير علامات المسارات", correct: false }
    ],
    keywords: [
      { term: "motorcyclist", ar: "درّاج ناري", explainAr: "سائق دراجة نارية قد يكون صغير الحجم ويصعب رؤيته، خاصة عند المرور بين المسارات." },
      { term: "filtering", ar: "المرور بين المسارات", explainAr: "الدرّاجون الناريون غالبًا ما يمرون بين المسارات في حركة المرور المتوقفة، مما قد يجعلهم يظهرون فجأة." },
      { term: "stop-start traffic", ar: "حركة مرور متوقفة ومتقطعة", explainAr: "في حركة المرور المتوقفة، قد يمر الدرّاجون الناريون بين المركبات، مما يشكل خطرًا عند تغيير المسار أو فتح الأبواب." }
    ]
  },

  {
    id: "HZ-5099",
    topic: "hazard-awareness",
    promptEn: "You are driving near a taxi rank and see passengers standing close to the kerb. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب موقف سيارات أجرة، ترى ركابًا يقفون قرب حافة الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Passengers will wait for traffic to stop", ar: "سينتظر الركاب حتى يتوقف المرور", correct: false },
      { en: "Passengers may step into the road unexpectedly", ar: "قد يخطو الركاب إلى الطريق بشكل غير متوقع", correct: true },
      { en: "The taxis will remain stationary", ar: "ستبقى سيارات الأجرة متوقفة", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "taxi rank", ar: "موقف سيارات أجرة", explainAr: "مكان مخصص لانتظار سيارات الأجرة، حيث يقف الركاب في انتظار سيارة أجرة." },
      { term: "passengers", ar: "ركاب", explainAr: "الأشخاص الذين ينتظرون سيارة أجرة قد يخطون إلى الطريق فجأة عند رؤية سيارة أجرة قادمة." },
      { term: "stepping out", ar: "الخطو إلى الطريق", explainAr: "الركاب المنتظرون قد يخطون إلى الطريق فجأة دون النظر، خاصة عند رؤية سيارة أجرة، مما يشكل خطرًا على المركبات المارة." }
    ]
  },

  {
    id: "HZ-5100",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet road and see a metal road plate ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مبلل، ترى صفيحة معدنية على الطريق أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved tyre grip", ar: "تحسّن تماسك الإطارات", correct: false },
      { en: "Reduced grip and possible skidding", ar: "انخفاض التماسك واحتمال الانزلاق", correct: true },
      { en: "A speed limit increase", ar: "زيادة حد السرعة", correct: false },
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false }
    ],
    keywords: [
      { term: "metal road plate", ar: "صفيحة معدنية على الطريق", explainAr: "صفيحة معدنية توضع مؤقتًا على الطريق لإصلاحات، وتكون زلقة جدًا خاصة في الطقس الرطب." },
      { term: "wet conditions", ar: "ظروف رطبة", explainAr: "الطرق المبللة تقلل من التماسك، والصفيحة المعدنية تزيد من هذا الخطر بشكل كبير." },
      { term: "reduced grip", ar: "انخفاض التماسك", explainAr: "الصفيحة المعدنية على الطريق المبلل تقلل بشكل كبير من تماسك الإطارات، مما قد يؤدي إلى الانزلاق." }
    ]
  },

  {
    id: "HZ-5101",
    topic: "hazard-awareness",
    promptEn: "You are driving on a residential street and see a car reversing from a driveway. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في شارع سكني، ترى سيارة ترجع للخلف من مدخل منزل. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The car will stop and wait", ar: "ستتوقف السيارة وتنتظر", correct: false },
      { en: "The car may continue reversing into your path", ar: "قد تواصل السيارة الرجوع إلى مسارك", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road surface will narrow", ar: "سيضيق سطح الطريق", correct: false }
    ],
    keywords: [
      { term: "reversing vehicle", ar: "مركبة ترجع للخلف", explainAr: "المركبة التي ترجع للخلف من مدخل قد لا تراك وقد تواصل الرجوع إلى مسارك، مما يشكل خطرًا." },
      { term: "driveway", ar: "مدخل منزل", explainAr: "المدخل المؤدي إلى منزل خاص، حيث قد تكون المركبات ترجع للخلف دون رؤية واضحة للطريق." },
      { term: "residential", ar: "سكني", explainAr: "المناطق السكنية غالبًا ما تحتوي على مداخل منازل ومركبات متوقفة قد تتحرك فجأة." }
    ]
  },

  {
    id: "HZ-5102",
    topic: "hazard-awareness",
    promptEn: "You are approaching a hill crest and cannot see the road ahead. What hazard should you anticipate?",
    promptAr: "تقترب من قمة تل ولا تستطيع رؤية الطريق أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false },
      { en: "Oncoming vehicles or stationary traffic just beyond the crest", ar: "مركبات قادمة أو حركة مرور متوقفة خلف القمة مباشرة", correct: true },
      { en: "Higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Improved visibility", ar: "تحسن الرؤية", correct: false }
    ],
    keywords: [
      { term: "hill crest", ar: "قمة تل", explainAr: "قمة التل تخفي الرؤية عن الطريق خلفها، مما يجعل من الصعب رؤية المركبات القادمة أو المتوقفة." },
      { term: "limited view", ar: "رؤية محدودة", explainAr: "عند قمة التل، تكون الرؤية محدودة جدًا ولا يمكنك رؤية ما خلف القمة حتى تكون قريبًا جدًا." },
      { term: "oncoming traffic", ar: "مركبات قادمة", explainAr: "المركبات القادمة من الاتجاه المعاكس قد تظهر فجأة من خلف قمة التل، مما يتطلب الحذر الشديد." }
    ]
  },

  {
    id: "HZ-5103",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead slowing near a school crossing with flashing amber lights. What hazard should you anticipate?",
    promptAr: "ترى مركبة أمامك تُبطئ قرب معبر مدرسة مع أضواء كهرمانية وامضة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is parking", ar: "المركبة تتوقف للوقوف", correct: false },
      { en: "Children may start crossing the road", ar: "قد يبدأ الأطفال بعبور الطريق", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The lights are advisory only", ar: "الأضواء إرشادية فقط", correct: false }
    ],
    keywords: [
      { term: "school crossing", ar: "معبر مدرسة", explainAr: "معبر مخصص للأطفال بالقرب من المدرسة، حيث قد يبدأ الأطفال بعبور الطريق فجأة." },
      { term: "amber lights", ar: "أضواء كهرمانية", explainAr: "الأضواء الكهرمانية الوامضة عند معبر المدرسة تشير إلى احتمال عبور الأطفال، مما يتطلب التخفيف والحذر." },
      { term: "children", ar: "أطفال", explainAr: "الأطفال قد يبدأون بعبور الطريق فجأة دون النظر، خاصة عند معابر المدارس، مما يتطلب الحذر الشديد." }
    ]
  },

  {
    id: "HZ-5104",
    topic: "hazard-awareness",
    promptEn: "You are driving in traffic and see a vehicle ahead signalling then cancelling repeatedly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة المرور، ترى مركبة أمامك تعطي إشارة ثم تلغيها بشكل متكرر. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is confident", ar: "السائق واثق", correct: false },
      { en: "The vehicle may change direction suddenly", ar: "قد تغيّر المركبة اتجاهها فجأة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false }
    ],
    keywords: [
      { term: "uncertain signalling", ar: "إشارة غير مؤكدة", explainAr: "الإشارة المتكررة ثم الإلغاء تشير إلى أن السائق غير متأكد من اتجاهه وقد يغير اتجاهه فجأة." },
      { term: "sudden manoeuvre", ar: "مناورة مفاجئة", explainAr: "المركبة التي تعطي إشارات متضاربة قد تقوم بمناورة مفاجئة، مما يتطلب الحذر والاستعداد للتوقف." },
      { term: "traffic", ar: "حركة مرور", explainAr: "في حركة المرور الكثيفة، المناورات المفاجئة تشكل خطرًا أكبر بسبب قرب المركبات من بعضها." }
    ]
  },

  {
    id: "HZ-5105",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see a broken-down vehicle partially in the road. What hazard should you anticipate?",
    promptAr: "أثناء القيادة ليلاً، ترى مركبة معطلة تشغل جزءًا من الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will move away quickly", ar: "ستتحرك المركبة بسرعة", correct: false },
      { en: "Sudden obstruction requiring you to slow or stop", ar: "عائق مفاجئ يتطلب التخفيف أو التوقف", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The road is closed ahead", ar: "الطريق مغلق أمامك", correct: false }
    ],
    keywords: [
      { term: "broken-down vehicle", ar: "مركبة معطلة", explainAr: "المركبة المعطلة قد تشغل جزءًا من الطريق وتشكل عائقًا مفاجئًا، خاصة في الليل عندما تكون الرؤية محدودة." },
      { term: "night driving", ar: "القيادة ليلاً", explainAr: "القيادة ليلاً تقلل من الرؤية، مما يجعل من الصعب رؤية المركبات المعطلة أو العوائق في الوقت المناسب." },
      { term: "obstruction", ar: "عائق", explainAr: "المركبة المعطلة تشكل عائقًا في الطريق يتطلب التخفيف أو التوقف أو تغيير المسار بأمان." }
    ]
  },

  {
    id: "HZ-5106",
    topic: "hazard-awareness",
    promptEn: "You are driving on a busy road and see a car door opening on the driver's side of a parked vehicle. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مزدحم، ترى باب سيارة يُفتح من جهة السائق في مركبة متوقفة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver will close the door quickly", ar: "سيُغلق السائق الباب بسرعة", correct: false },
      { en: "The door or driver may obstruct your path", ar: "قد يعيق الباب أو السائق مسارك", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will widen", ar: "سيتسع الطريق", correct: false }
    ],
    keywords: [
      { term: "opening door", ar: "باب مفتوح", explainAr: "فتح باب السيارة المتوقفة فجأة قد يعيق مسارك ويسبب حادثًا، خاصة على الطرق المزدحمة." },
      { term: "parked vehicle", ar: "مركبة متوقفة", explainAr: "المركبات المتوقفة قد تشكل خطرًا عندما يفتح الركاب أو السائق الأبواب دون التحقق من حركة المرور." },
      { term: "obstruction", ar: "عائق", explainAr: "الباب المفتوح أو السائق الذي يخرج من المركبة قد يعيق مسارك ويتطلب التخفيف أو تغيير المسار." }
    ]
  },

  {
    id: "HZ-5107",
    topic: "hazard-awareness",
    promptEn: "You are approaching a roundabout and see a cyclist positioned near the centre of the lane. What hazard should you anticipate?",
    promptAr: "تقترب من دوّار وترى درّاجًا يتمركز قرب وسط المسار. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will pull over to the kerb", ar: "سينتقل الدرّاج إلى الرصيف", correct: false },
      { en: "The cyclist may turn right or change direction", ar: "قد ينعطف الدرّاج يمينًا أو يغيّر اتجاهه", correct: true },
      { en: "The cyclist will stop completely", ar: "سيتوقف الدرّاج تمامًا", correct: false },
      { en: "Traffic lights will control the junction", ar: "ستتحكم إشارات المرور بالتقاطع", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "الدوارات تتطلب انتباهًا خاصًا للدرّاجين الذين قد يغيرون اتجاههم أو ينعطفون." },
      { term: "cyclist position", ar: "موقع الدرّاج", explainAr: "تمركز الدرّاج قرب وسط المسار قد يشير إلى نيته في الانعطاف أو تغيير الاتجاه." },
      { term: "change direction", ar: "تغيير الاتجاه", explainAr: "الدرّاجون في الدوارات قد يغيرون اتجاههم فجأة، مما يتطلب الحذر وإعطاء مسافة كافية." }
    ]
  },

  {
    id: "HZ-5108",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy traffic and notice a pedestrian weaving between vehicles. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ازدحام شديد، تلاحظ مشاة يتنقلون بين المركبات. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The pedestrian will wait for traffic to stop", ar: "سينتظر المشاة حتى يتوقف المرور", correct: false },
      { en: "The pedestrian may step into your lane suddenly", ar: "قد يدخل المشاة إلى مسارك فجأة", correct: true },
      { en: "Traffic will move smoothly", ar: "ستتحرك حركة المرور بسلاسة", correct: false },
      { en: "The road will be closed", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة الذين يتنقلون بين المركبات في حركة المرور الكثيفة قد يظهرون فجأة في مسارك." },
      { term: "between vehicles", ar: "بين المركبات", explainAr: "المشاة الذين يتحركون بين المركبات المتوقفة أو البطيئة قد يكونون غير مرئيين حتى يظهرون فجأة." },
      { term: "sudden movement", ar: "حركة مفاجئة", explainAr: "المشاة الذين يتنقلون بين المركبات قد يخطون إلى مسارك فجأة دون سابق إنذار، مما يتطلب الحذر الشديد." }
    ]
  },

  {
    id: "HZ-5109",
    topic: "hazard-awareness",
    promptEn: "You are driving on a country road and see a horse rider ahead signalling. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق ريفي، ترى فارسًا على حصان يعطي إشارة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The rider will move quickly", ar: "سيتحرك الفارس بسرعة", correct: false },
      { en: "The horse may react unpredictably to traffic", ar: "قد يتصرف الحصان بشكل غير متوقع بسبب المرور", correct: true },
      { en: "The road surface will change", ar: "سيتغير سطح الطريق", correct: false },
      { en: "The rider will dismount", ar: "سينزل الفارس عن الحصان", correct: false }
    ],
    keywords: [
      { term: "horse rider", ar: "فارس على حصان", explainAr: "الخيول قد تتصرف بشكل غير متوقع عند اقتراب المركبات، مما يتطلب التخفيف وإعطاء مسافة كافية." },
      { term: "country road", ar: "طريق ريفي", explainAr: "الطرق الريفية غالبًا ما تستخدمها الخيول، مما يتطلب الحذر الشديد والقيادة ببطء عند الاقتراب منها." },
      { term: "unpredictable behaviour", ar: "سلوك غير متوقع", explainAr: "الخيول قد تخاف من المركبات أو الأصوات العالية وتتصرف بشكل غير متوقع، مما قد يعرض الفارس والمركبات للخطر." }
    ]
  },

  {
    id: "HZ-5110",
    topic: "hazard-awareness",
    promptEn: "You are driving on a road with temporary traffic lights and see long queues forming. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق فيه إشارات مرور مؤقتة، ترى طوابير طويلة تتشكل. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will clear quickly", ar: "سيتلاشى الازدحام بسرعة", correct: false },
      { en: "Sudden stopping at the back of the queue", ar: "توقف مفاجئ عند مؤخرة الطابور", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will widen", ar: "سيتسع الطريق", correct: false }
    ],
    keywords: [
      { term: "temporary lights", ar: "إشارات مرور مؤقتة", explainAr: "إشارات المرور المؤقتة غالبًا ما تشير إلى أعمال بناء أو صيانة، مما قد يسبب طوابير طويلة وتوقف مفاجئ." },
      { term: "queues", ar: "طوابير", explainAr: "الطوابير الطويلة قد تتوقف فجأة عند مؤخرتها، مما يتطلب الحذر والاستعداد للتوقف." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "عند الاقتراب من طابور طويل، قد تتوقف المركبات فجأة عند المؤخرة، مما يتطلب الحذر والمسافة الكافية." }
    ]
  },

  {
    id: "HZ-5111",
    topic: "hazard-awareness",
    promptEn: "You are driving in slow-moving traffic and notice a cyclist checking over their shoulder. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة مرور بطيئة، تلاحظ درّاجًا ينظر فوق كتفه. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will stop immediately", ar: "سيتوقف الدرّاج فورًا", correct: false },
      { en: "The cyclist may change position or direction", ar: "قد يغيّر الدرّاج موضعه أو اتجاهه", correct: true },
      { en: "The cyclist will leave the road", ar: "سيغادر الدرّاج الطريق", correct: false },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "درّاج", explainAr: "الدرّاجون قد يغيرون موضعهم أو اتجاههم بعد النظر خلفهم، مما يتطلب الحذر وإعطاء مسافة كافية." },
      { term: "lifesaver glance", ar: "نظرة فوق الكتف", explainAr: "عندما ينظر الدرّاج فوق كتفه، غالبًا ما يكون على وشك تغيير موضعه أو اتجاهه، مما يتطلب الاستعداد لذلك." },
      { term: "change position", ar: "تغيير الموضع", explainAr: "الدرّاجون قد يغيرون موضعهم في الطريق بعد فحص الطريق خلفهم، مما قد يعرضهم للخطر إذا لم تكن مستعدًا." }
    ]
  },

  {
    id: "HZ-5112",
    topic: "hazard-awareness",
    promptEn: "You are approaching a pedestrian crossing and see a vehicle ahead slowing suddenly. What hazard should you anticipate?",
    promptAr: "تقترب من ممر مشاة وترى مركبة أمامك تُبطئ فجأة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is parking", ar: "المركبة تتوقف للوقوف", correct: false },
      { en: "Pedestrians may be crossing in front of the vehicle", ar: "قد يكون هناك مشاة يعبرون أمام المركبة", correct: true },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false },
      { en: "The speed limit has increased", ar: "ازداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "ممرات المشاة هي أماكن قد يعبرها المشاة في أي وقت، مما يتطلب الحذر الشديد والاستعداد للتوقف." },
      { term: "sudden slowing", ar: "إبطاء مفاجئ", explainAr: "عندما تُبطئ مركبة فجأة عند ممر مشاة، غالبًا ما يكون هناك مشاة يعبرون، مما يتطلب الحذر والاستعداد للتوقف." },
      { term: "crossing pedestrians", ar: "مشاة يعبرون", explainAr: "المشاة الذين يعبرون الطريق قد لا يكونون مرئيين خلف المركبات الأخرى، مما يتطلب الحذر الشديد عند الاقتراب من ممرات المشاة." }
    ]
  },

  {
    id: "HZ-5113",
    topic: "hazard-awareness",
    promptEn: "You are driving on a narrow street and see a delivery driver unloading goods. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في شارع ضيق، ترى سائق توصيل يفرغ البضائع. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The road will be clear", ar: "سيكون الطريق خاليًا", correct: false },
      { en: "The driver or goods may obstruct the road suddenly", ar: "قد يعيق السائق أو البضائع الطريق فجأة", correct: true },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false },
      { en: "Parking restrictions will end", ar: "ستنتهي قيود الوقوف", correct: false }
    ],
    keywords: [
      { term: "delivery", ar: "توصيل", explainAr: "مركبات التوصيل قد تتوقف فجأة وتفرغ البضائع، مما قد يعيق الطريق ويعرض السائقين للخطر." },
      { term: "unloading", ar: "تفريغ", explainAr: "عند تفريغ البضائع، قد يتحرك السائق أو البضائع فجأة إلى الطريق، مما يتطلب الحذر والاستعداد للتوقف." },
      { term: "obstruction", ar: "إعاقة", explainAr: "البضائع أو السائق قد يعيقان الطريق فجأة، مما يتطلب الحذر والاستعداد للتوقف أو تغيير المسار." }
    ]
  },

  {
    id: "HZ-5114",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see flashing red lights ahead at a railway crossing. What hazard should you anticipate?",
    promptAr: "أثناء القيادة ليلاً، ترى أضواء حمراء وامضة عند معبر سكة حديد أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The lights are advisory only", ar: "الأضواء إرشادية فقط", correct: false },
      { en: "A train may be approaching and traffic will stop", ar: "قد يقترب قطار وسيتوقف المرور", correct: true },
      { en: "The road is closing permanently", ar: "الطريق سيُغلق بشكل دائم", correct: false },
      { en: "Traffic will speed up", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "railway crossing", ar: "معبر سكة حديد", explainAr: "معابر السكك الحديدية هي أماكن خطيرة تتطلب الحذر الشديد والاستعداد للتوقف عند رؤية الأضواء الحمراء الوامضة." },
      { term: "flashing red lights", ar: "أضواء حمراء وامضة", explainAr: "الأضواء الحمراء الوامضة عند معبر سكة حديد تعني أن قطارًا يقترب ويجب التوقف فورًا." },
      { term: "train", ar: "قطار", explainAr: "القطارات تسير بسرعة عالية ولا يمكنها التوقف بسرعة، مما يجعل معابر السكك الحديدية خطيرة للغاية." }
    ]
  },

  {
    id: "HZ-5115",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy rain and see puddles forming near the kerb. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في أمطار غزيرة، ترى برك مياه تتشكل قرب حافة الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved grip near the kerb", ar: "تماسك أفضل قرب الحافة", correct: false },
      { en: "Splashing pedestrians or reduced control", ar: "تناثر المياه على المشاة أو انخفاض السيطرة", correct: true },
      { en: "Higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Clear road surface", ar: "سطح طريق خالٍ", correct: false }
    ],
    keywords: [
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "الأمطار الغزيرة تقلل الرؤية والتماسك، مما يجعل القيادة أكثر خطورة." },
      { term: "puddles", ar: "برك مياه", explainAr: "برك المياه قد تسبب انخفاض السيطرة على المركبة أو تناثر المياه على المشاة." },
      { term: "reduced control", ar: "انخفاض السيطرة", explainAr: "عند القيادة عبر برك المياه، قد تفقد المركبة التماسك والسيطرة، مما يتطلب التخفيف من السرعة." }
    ]
  },

  {
    id: "HZ-5116",
    topic: "hazard-awareness",
    promptEn: "You are driving past a row of shops and see people standing close to the kerb. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب صف من المتاجر، ترى أشخاصًا يقفون قريبًا من حافة الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will stay on the pavement", ar: "سيبقون على الرصيف", correct: false },
      { en: "Pedestrians may step into the road suddenly", ar: "قد يخطو المشاة إلى الطريق فجأة", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "Parking restrictions will end", ar: "ستنتهي قيود الوقوف", correct: false }
    ],
    keywords: [
      { term: "shops", ar: "متاجر", explainAr: "المناطق التجارية والمتاجر تجذب المشاة الذين قد يتحركون بشكل غير متوقع." },
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة الذين يقفون قرب حافة الرصيف قد يخطون إلى الطريق فجأة دون تحذير." },
      { term: "stepping out", ar: "الخطو إلى الطريق", explainAr: "عندما يقف المشاة قرب حافة الرصيف، قد يخطون إلى الطريق فجأة، مما يتطلب الحذر والاستعداد للتوقف." }
    ]
  },

  {
    id: "HZ-5117",
    topic: "hazard-awareness",
    promptEn: "You are approaching a junction and see a vehicle emerging slowly from a side road. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع وترى مركبة تخرج ببطء من طريق جانبي. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will stop immediately", ar: "ستتوقف المركبة فورًا", correct: false },
      { en: "The vehicle may pull out into your path", ar: "قد تخرج المركبة إلى مسارك", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will widen", ar: "سيتسع الطريق", correct: false }
    ],
    keywords: [
      { term: "side road", ar: "طريق جانبي", explainAr: "الطرق الجانبية قد تخرج منها مركبات بشكل غير متوقع." },
      { term: "emerging vehicle", ar: "مركبة تخرج", explainAr: "المركبات التي تخرج من طرق جانبية قد تدخل إلى مسارك فجأة، مما يتطلب الحذر والاستعداد للتباطؤ أو التوقف." },
      { term: "junction", ar: "تقاطع", explainAr: "التقاطعات هي أماكن خطيرة حيث قد تتحرك المركبات من اتجاهات مختلفة." }
    ]
  },

  {
    id: "HZ-5118",
    topic: "hazard-awareness",
    promptEn: "You are driving in poor daylight conditions and see a vehicle ahead without rear lights. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ظروف إضاءة ضعيفة نهارًا، ترى مركبة أمامك دون أضواء خلفية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is easy to judge", ar: "من السهل تقدير حركة المركبة", correct: false },
      { en: "It may be difficult to judge distance and speed", ar: "قد يصعب تقدير المسافة والسرعة", correct: true },
      { en: "The road surface is dry", ar: "سطح الطريق جاف", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "poor daylight", ar: "إضاءة ضعيفة نهارًا", explainAr: "ظروف الإضاءة الضعيفة تقلل الرؤية وتجعل من الصعب رؤية المركبات بوضوح." },
      { term: "unlit vehicle", ar: "مركبة دون أضواء", explainAr: "المركبات دون أضواء خلفية يصعب رؤيتها وتقدير مسافتها وسرعتها، خاصة في ظروف الإضاءة الضعيفة." },
      { term: "judging distance", ar: "تقدير المسافة", explainAr: "عندما تكون المركبة غير مرئية بوضوح، يصعب تقدير المسافة والسرعة، مما يزيد من خطر الاصطدام." }
    ]
  },

  {
    id: "HZ-5119",
    topic: "hazard-awareness",
    promptEn: "You are driving on a road with speed humps and see a vehicle slowing sharply ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق يحتوي على مطبّات سرعة، ترى مركبة أمامك تُبطئ بشكل حاد. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle is parking", ar: "المركبة تتوقف للوقوف", correct: false },
      { en: "Traffic may slow or stop suddenly", ar: "قد تتباطأ أو تتوقف حركة المرور فجأة", correct: true },
      { en: "The road will straighten", ar: "سيستقيم الطريق", correct: false },
      { en: "The speed limit has increased", ar: "ازداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "speed humps", ar: "مطبّات سرعة", explainAr: "مطبّات السرعة تجبر المركبات على التباطؤ، مما قد يسبب توقف مفاجئ في حركة المرور." },
      { term: "sharp braking", ar: "فرملة حادة", explainAr: "الفرملة الحادة قد تشير إلى خطر أو توقف مفاجئ في حركة المرور." },
      { term: "sudden slowing", ar: "إبطاء مفاجئ", explainAr: "عندما تُبطئ مركبة بشكل حاد، قد يكون هناك خطر أو توقف مفاجئ في حركة المرور، مما يتطلب الحذر والاستعداد للتوقف." }
    ]
  },

  {
    id: "HZ-5120",
    topic: "hazard-awareness",
    promptEn: "You are driving near a cycle lane and see a car ahead signalling left. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مسار دراجات، ترى سيارة أمامك تعطي إشارة انعطاف يسارًا. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The car will stop completely", ar: "ستتوقف السيارة تمامًا", correct: false },
      { en: "The car may turn across the path of a cyclist", ar: "قد تنعطف السيارة قاطعة طريق درّاج", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The cycle lane is not in use", ar: "مسار الدراجات غير مستخدم", correct: false }
    ],
    keywords: [
      { term: "cycle lane", ar: "مسار دراجات", explainAr: "مسارات الدراجات هي مناطق قد يكون فيها درّاجون، مما يتطلب الحذر الشديد عند الانعطاف." },
      { term: "left turn", ar: "انعطاف يسارًا", explainAr: "عند الانعطاف يسارًا قرب مسار دراجات، قد تعترض طريق درّاج، مما يتطلب فحص شامل قبل الانعطاف." },
      { term: "cyclist", ar: "درّاج", explainAr: "الدرّاجون قد يكونون في مساراتهم وقد لا يكونون مرئيين بسهولة، خاصة عند الانعطاف." }
    ]
  },

  {
    id: "HZ-5121",
    topic: "hazard-awareness",
    promptEn: "You are driving on a main road and see a queue forming ahead beyond a bend. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق رئيسي، ترى طابورًا يتشكل أمامك بعد منعطف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will speed up after the bend", ar: "ستزداد سرعة المرور بعد المنعطف", correct: false },
      { en: "Stationary traffic hidden beyond the bend", ar: "حركة مرور متوقفة مخفية بعد المنعطف", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will widen", ar: "سيتسع الطريق", correct: false }
    ],
    keywords: [
      { term: "queue", ar: "طابور", explainAr: "تشكّل طابور من المركبات يشير إلى توقف أو إبطاء في حركة المرور." },
      { term: "bend", ar: "منعطف", explainAr: "المنعطفات تخفي الرؤية، مما يجعل من الصعب رؤية المخاطر القادمة." },
      { term: "hidden traffic", ar: "مرور مخفي", explainAr: "المرور المتوقف خلف المنعطف قد يظهر فجأة، مما يتطلب التباطؤ والاستعداد للتوقف." }
    ]
  },

  {
    id: "HZ-5122",
    topic: "hazard-awareness",
    promptEn: "You are driving past a parked lorry and cannot see the pavement. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب شاحنة متوقفة ولا تستطيع رؤية الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The lorry will move off immediately", ar: "ستتحرك الشاحنة فورًا", correct: false },
      { en: "Pedestrians may step out from in front of the lorry", ar: "قد يخرج مشاة من أمام الشاحنة", correct: true },
      { en: "Traffic will flow faster", ar: "ستتحسن حركة المرور", correct: false },
      { en: "The road surface will improve", ar: "سيتحسن سطح الطريق", correct: false }
    ],
    keywords: [
      { term: "parked lorry", ar: "شاحنة متوقفة", explainAr: "الشاحنات الكبيرة قد تحجب الرؤية تمامًا، مما يجعل من المستحيل رؤية المشاة أو المخاطر الأخرى." },
      { term: "blocked pavement", ar: "رصيف محجوب", explainAr: "عندما لا تستطيع رؤية الرصيف، قد يخرج المشاة فجأة من أمام المركبة الكبيرة." },
      { term: "hidden pedestrians", ar: "مشاة مخفيون", explainAr: "المشاة الذين لا يمكن رؤيتهم بسبب حجب الرؤية قد يخرجون فجأة إلى الطريق." }
    ]
  },

  {
    id: "HZ-5123",
    topic: "hazard-awareness",
    promptEn: "You are driving in fog and hear a siren approaching. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في الضباب، تسمع صفارة إنذار تقترب. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will stop automatically", ar: "سيتوقف المرور تلقائيًا", correct: false },
      { en: "An emergency vehicle may appear suddenly", ar: "قد تظهر مركبة طوارئ فجأة", correct: true },
      { en: "The speed limit will change", ar: "سيتغير حد السرعة", correct: false },
      { en: "Visibility will improve quickly", ar: "ستتحسن الرؤية بسرعة", correct: false }
    ],
    keywords: [
      { term: "fog", ar: "ضباب", explainAr: "الضباب يقلل الرؤية بشكل كبير، مما يجعل من الصعب رؤية المركبات القادمة." },
      { term: "siren", ar: "صفارة إنذار", explainAr: "صوت صفارة الإنذار يشير إلى اقتراب مركبة طوارئ، والتي قد تظهر فجأة في الضباب." },
      { term: "emergency vehicle", ar: "مركبة طوارئ", explainAr: "مركبات الطوارئ قد تظهر فجأة في ظروف الرؤية السيئة، مما يتطلب الحذر الشديد والاستعداد للتوقف أو التحرك جانبًا." }
    ]
  },

  {
    id: "HZ-5124",
    topic: "hazard-awareness",
    promptEn: "You are driving near a tram route and see tracks crossing the road. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مسار ترام، ترى قضبان تعبر الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved grip over the tracks", ar: "تماسك أفضل فوق القضبان", correct: false },
      { en: "Reduced grip, especially for two-wheeled vehicles", ar: "انخفاض التماسك خاصة للمركبات ذات العجلتين", correct: true },
      { en: "Higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false }
    ],
    keywords: [
      { term: "tram tracks", ar: "قضبان ترام", explainAr: "قضبان الترام قد تكون زلقة، خاصة عند البلل، مما يقلل التماسك." },
      { term: "reduced grip", ar: "انخفاض التماسك", explainAr: "التماسك المنخفض على القضبان المعدنية قد يجعل المركبات، خاصة الدراجات النارية، تفقد السيطرة." },
      { term: "two-wheeled vehicles", ar: "مركبات ذات عجلتين", explainAr: "الدراجات النارية والدراجات العادية أكثر عرضة لفقدان التماسك على القضبان المعدنية." }
    ]
  },

  {
    id: "HZ-5125",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy traffic and see a driver ahead gesturing angrily. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ازدحام مروري كثيف، ترى سائقًا أمامك يُلوّح بغضب. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver will calm down immediately", ar: "سيهدأ السائق فورًا", correct: false },
      { en: "Unpredictable or aggressive driving behaviour", ar: "سلوك قيادة عدواني أو غير متوقع", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will clear", ar: "سيفرغ الطريق", correct: false }
    ],
    keywords: [
      { term: "aggressive driver", ar: "سائق عدواني", explainAr: "السائقون الغاضبون قد يتصرفون بشكل غير متوقع أو خطير، مما يشكل خطرًا على الآخرين." },
      { term: "gesturing", ar: "إيماءات", explainAr: "الإيماءات الغاضبة قد تشير إلى سائق منزعج قد يتصرف بشكل خطير." },
      { term: "unpredictable behaviour", ar: "سلوك غير متوقع", explainAr: "السلوك غير المتوقع من السائقين الغاضبين قد يشمل فرملة مفاجئة أو تغيير مسار خطير." }
    ]
  },

  {
    id: "HZ-5126",
    topic: "hazard-awareness",
    promptEn: "You are driving on a road with parked cars and see a child walking along the pavement holding a ball. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق فيه سيارات متوقفة، ترى طفلًا يمشي على الرصيف وهو يحمل كرة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The child will stay on the pavement", ar: "سيبقى الطفل على الرصيف", correct: false },
      { en: "The child may run into the road suddenly", ar: "قد يركض الطفل فجأة إلى الطريق", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The road surface will be slippery", ar: "سيصبح سطح الطريق زلقًا", correct: false }
    ],
    keywords: [
      { term: "children", ar: "أطفال", explainAr: "الأطفال قد يتصرفون بشكل غير متوقع وقد يركضون فجأة إلى الطريق، خاصة عند اللعب." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تحجب الرؤية وتجعل من الصعب رؤية الأطفال أو المشاة." },
      { term: "sudden movement", ar: "حركة مفاجئة", explainAr: "الحركات المفاجئة من الأطفال أو المشاة قد تحدث دون سابق إنذار وتتطلب استجابة فورية." }
    ]
  },

  {
    id: "HZ-5127",
    topic: "hazard-awareness",
    promptEn: "You are approaching a junction and see a vehicle waiting with its wheels turned towards the main road. What hazard should you anticipate?",
    promptAr: "تقترب من تقاطع وترى مركبة تنتظر وعجلاتها موجهة نحو الطريق الرئيسي. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will remain stationary", ar: "ستبقى المركبة متوقفة", correct: false },
      { en: "The vehicle may pull out suddenly", ar: "قد تخرج المركبة فجأة إلى الطريق", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will narrow", ar: "سيضيق الطريق", correct: false }
    ],
    keywords: [
      { term: "junction", ar: "تقاطع", explainAr: "التقاطعات هي نقاط خطيرة حيث قد تخرج المركبات أو تعبر الطريق." },
      { term: "wheels turned", ar: "عجلات موجهة", explainAr: "العجلات الموجهة نحو الطريق تشير إلى أن السائق مستعد للانطلاق فورًا." },
      { term: "emerging vehicle", ar: "مركبة خارجة", explainAr: "المركبة التي تخرج من تقاطع أو مدخل جانبي قد تظهر فجأة في طريقك." }
    ]
  },

  {
    id: "HZ-5128",
    topic: "hazard-awareness",
    promptEn: "You are driving in poor visibility and see reflective clothing ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في ظروف رؤية ضعيفة، ترى ملابس عاكسة أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The road is clear", ar: "الطريق خالٍ", correct: false },
      { en: "Pedestrians or cyclists may be close to the road", ar: "قد يكون مشاة أو درّاجون قريبين من الطريق", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The speed limit has changed", ar: "تغير حد السرعة", correct: false }
    ],
    keywords: [
      { term: "poor visibility", ar: "رؤية ضعيفة", explainAr: "الظروف التي تقلل الرؤية مثل الضباب أو المطر أو الظلام تجعل من الصعب رؤية المخاطر." },
      { term: "reflective clothing", ar: "ملابس عاكسة", explainAr: "الملابس العاكسة تشير إلى وجود مشاة أو دراجين في المنطقة، خاصة في ظروف الرؤية الضعيفة." },
      { term: "vulnerable road users", ar: "مستخدمي الطريق الضعفاء", explainAr: "المشاة والدراجون هم أكثر عرضة للخطر في ظروف الرؤية الضعيفة ويحتاجون إلى مزيد من الحذر." }
    ]
  },

  {
    id: "HZ-5129",
    topic: "hazard-awareness",
    promptEn: "You are driving downhill and see a warning sign for sharp bends ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة نزولًا، ترى علامة تحذير لمنعطفات حادة أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved braking performance", ar: "تحسن أداء الكبح", correct: false },
      { en: "Difficulty slowing down and maintaining control", ar: "صعوبة في التخفيف والحفاظ على السيطرة", correct: true },
      { en: "A higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Clear visibility around bends", ar: "رؤية واضحة حول المنعطفات", correct: false }
    ],
    keywords: [
      { term: "downhill", ar: "نزول", explainAr: "القيادة نزولًا تزيد من سرعة المركبة وتجعل من الصعب التخفيف." },
      { term: "sharp bends", ar: "منعطفات حادة", explainAr: "المنعطفات الحادة تتطلب تخفيف السرعة مسبقًا والحفاظ على السيطرة." },
      { term: "reduced control", ar: "سيطرة منخفضة", explainAr: "المنعطفات الحادة على منحدر قد تجعل من الصعب الحفاظ على السيطرة على المركبة." }
    ]
  },

  {
    id: "HZ-5130",
    topic: "hazard-awareness",
    promptEn: "You are driving near a school at the start of the day and see cars stopping briefly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مدرسة في بداية اليوم الدراسي، ترى سيارات تتوقف لفترات قصيرة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will clear quickly", ar: "سيزول الازدحام بسرعة", correct: false },
      { en: "Children or parents may step into the road suddenly", ar: "قد يخطو أطفال أو أولياء أمور فجأة إلى الطريق", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "school", ar: "مدرسة", explainAr: "المناطق القريبة من المدارس تحتوي على أطفال قد يتصرفون بشكل غير متوقع." },
      { term: "drop-off", ar: "إنزال", explainAr: "أوقات إنزال الأطفال في المدارس تشهد حركة كثيفة للمشاة والمركبات." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأطفال والآباء قد يعبرون الطريق فجأة أثناء إنزال الأطفال في المدارس." }
    ]
  },

  {
    id: "HZ-5131",
    topic: "hazard-awareness",
    promptEn: "You are driving on a busy road and see a pedestrian suddenly change direction on the pavement. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مزدحم، ترى أحد المشاة يغير اتجاهه فجأة على الرصيف. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will walk away from the road", ar: "سيبتعد عن الطريق", correct: false },
      { en: "They may step into the road unexpectedly", ar: "قد يخطو إلى الطريق بشكل مفاجئ", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will narrow", ar: "سيضيق الطريق", correct: false }
    ],
    keywords: [
      { term: "pedestrian", ar: "مشاة", explainAr: "المشاة الذين يغيرون اتجاههم فجأة قد يعبرون الطريق بشكل غير متوقع." },
      { term: "sudden movement", ar: "حركة مفاجئة", explainAr: "التغييرات المفاجئة في اتجاه المشاة تشير إلى احتمال عبور الطريق." },
      { term: "anticipation", ar: "التوقع", explainAr: "التوقع المبكر للمخاطر يساعدك على الاستعداد والتفاعل بسرعة." }
    ]
  },

  {
    id: "HZ-5132",
    topic: "hazard-awareness",
    promptEn: "You are driving past a line of stationary traffic and see a gap ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة بجانب طابور سيارات متوقفة، ترى فجوة أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will start flowing freely", ar: "ستبدأ حركة المرور بالانسياب", correct: false },
      { en: "A vehicle may turn or emerge through the gap", ar: "قد تنعطف أو تخرج مركبة من خلال الفجوة", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road surface will improve", ar: "سيتحسن سطح الطريق", correct: false }
    ],
    keywords: [
      { term: "stationary traffic", ar: "مرور متوقف", explainAr: "المركبات المتوقفة قد تخفي مركبات أخرى أو مشاة." },
      { term: "gap", ar: "فجوة", explainAr: "الفجوات في المرور المتوقف قد تسمح لمركبات أو مشاة بالظهور فجأة." },
      { term: "emerging vehicle", ar: "مركبة خارجة", explainAr: "المركبات التي تخرج من الفجوات في المرور المتوقف تشكل خطرًا محتملاً." }
    ]
  },

  {
    id: "HZ-5133",
    topic: "hazard-awareness",
    promptEn: "You are approaching a bend and see a warning sign for cattle. What hazard should you anticipate?",
    promptAr: "تقترب من منعطف وترى علامة تحذير لوجود ماشية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Animals will stay behind fences", ar: "ستبقى الحيوانات خلف الأسوار", correct: false },
      { en: "Animals may be on or near the road", ar: "قد تكون الحيوانات على الطريق أو بالقرب منه", correct: true },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false }
    ],
    keywords: [
      { term: "cattle", ar: "ماشية", explainAr: "الماشية قد تكون على الطريق أو بالقرب منه وتتحرك بشكل غير متوقع." },
      { term: "country road", ar: "طريق ريفي", explainAr: "الطرق الريفية غالبًا ما تحتوي على حيوانات قد تعبر الطريق." },
      { term: "animals", ar: "حيوانات", explainAr: "الحيوانات على الطريق تشكل خطرًا كبيرًا وتتطلب تخفيف السرعة والحذر." }
    ]
  },

  {
    id: "HZ-5134",
    topic: "hazard-awareness",
    promptEn: "You are driving in traffic and see a driver ahead frequently looking in their mirrors. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة المرور، ترى سائقًا أمامك يفحص المرايا باستمرار. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is confident", ar: "السائق واثق", correct: false },
      { en: "The driver may change lanes suddenly", ar: "قد يغيّر السائق المسار فجأة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road surface is damaged", ar: "سطح الطريق متضرر", correct: false }
    ],
    keywords: [
      { term: "mirror checks", ar: "فحص المرايا", explainAr: "فحص المرايا المتكرر قد يشير إلى نية تغيير المسار." },
      { term: "lane change", ar: "تغيير المسار", explainAr: "تغيير المسار المفاجئ قد يشكل خطرًا على المركبات المجاورة." },
      { term: "anticipation", ar: "التوقع", explainAr: "مراقبة سلوك السائقين الآخرين يساعدك على توقع تحركاتهم." }
    ]
  },

  {
    id: "HZ-5135",
    topic: "hazard-awareness",
    promptEn: "You are driving near a bus stop and see a bus indicating to pull out. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب موقف حافلات، ترى حافلة تعطي إشارة للانطلاق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The bus will remain stationary", ar: "ستبقى الحافلة متوقفة", correct: false },
      { en: "The bus may move into your path", ar: "قد تدخل الحافلة إلى مسارك", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false }
    ],
    keywords: [
      { term: "bus stop", ar: "موقف حافلات", explainAr: "مواقف الحافلات تشهد حركة كثيفة للحافلات والركاب." },
      { term: "bus pulling out", ar: "حافلة تنطلق", explainAr: "الحافلات التي تنطلق من المواقف قد تدخل إلى مسارك وتتطلب إعطاء الأولوية." },
      { term: "giving way", ar: "إعطاء الأولوية", explainAr: "يجب إعطاء الأولوية للحافلات التي تنطلق من المواقف." }
    ]
  },

  {
    id: "HZ-5136",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet road and see a bend sign ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق مبلل، ترى علامة منعطف أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Improved grip through the bend", ar: "تماسك أفضل في المنعطف", correct: false },
      { en: "Reduced grip and risk of skidding", ar: "انخفاض التماسك وخطر الانزلاق", correct: true },
      { en: "A higher speed limit", ar: "حد سرعة أعلى", correct: false },
      { en: "Clear visibility", ar: "رؤية واضحة", correct: false }
    ],
    keywords: [
      { term: "wet road", ar: "طريق مبلل", explainAr: "الطرق المبللة تقلل من التماسك وتزيد من خطر الانزلاق." },
      { term: "bend", ar: "منعطف", explainAr: "المنعطفات على الطرق المبللة تتطلب تخفيف السرعة بشكل أكبر." },
      { term: "skidding", ar: "انزلاق", explainAr: "خطر الانزلاق يزداد على الطرق المبللة خاصة في المنعطفات." }
    ]
  },

  {
    id: "HZ-5137",
    topic: "hazard-awareness",
    promptEn: "You see a pedestrian using a white stick near the road. What hazard should you anticipate?",
    promptAr: "ترى مشاة يستخدم عصا بيضاء قرب الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The pedestrian will wait for signals", ar: "سينتظر المشاة الإشارات", correct: false },
      { en: "The pedestrian may not be able to see traffic clearly", ar: "قد لا يتمكن المشاة من رؤية المرور بوضوح", correct: true },
      { en: "Traffic will stop automatically", ar: "سيتوقف المرور تلقائيًا", correct: false },
      { en: "The road will be closed", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "white stick", ar: "عصا بيضاء", explainAr: "العصا البيضاء تشير إلى أن المشاة يعاني من ضعف البصر." },
      { term: "visually impaired", ar: "ضعيف البصر", explainAr: "المشاة ضعيفو البصر قد لا يتمكنون من رؤية المركبات القادمة." },
      { term: "pedestrian", ar: "مشاة", explainAr: "يجب توخي الحذر الشديد عند الاقتراب من مشاة ضعيفي البصر." }
    ]
  },

  {
    id: "HZ-5138",
    topic: "hazard-awareness",
    promptEn: "You are driving in traffic and notice a vehicle ahead drifting between lanes. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة المرور، تلاحظ مركبة أمامك تنحرف بين المسارات. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver is confident", ar: "السائق واثق", correct: false },
      { en: "Sudden lane changes or loss of control", ar: "تغييرات مسار مفاجئة أو فقدان السيطرة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road is narrowing", ar: "الطريق يضيق", correct: false }
    ],
    keywords: [
      { term: "lane drifting", ar: "انحراف بين المسارات", explainAr: "الانحراف بين المسارات قد يشير إلى سائق مشتت أو متعب." },
      { term: "loss of control", ar: "فقدان السيطرة", explainAr: "المركبات التي تنحرف قد تفقد السيطرة وتشكل خطرًا على المركبات الأخرى." },
      { term: "anticipation", ar: "التوقع", explainAr: "مراقبة سلوك المركبات الأخرى يساعدك على توقع المخاطر المحتملة." }
    ]
  },

  {
    id: "HZ-5139",
    topic: "hazard-awareness",
    promptEn: "You are driving near a car park entrance and see vehicles queuing. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مدخل موقف سيارات، ترى مركبات تصطف في طابور. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will flow faster", ar: "ستتحسن حركة المرور", correct: false },
      { en: "Vehicles may turn or stop suddenly", ar: "قد تنعطف أو تتوقف المركبات فجأة", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "car park", ar: "موقف سيارات", explainAr: "مداخل مواقف السيارات تشهد حركة كثيفة للمركبات التي تدخل وتخرج." },
      { term: "queuing traffic", ar: "مرور في طابور", explainAr: "المركبات في الطابور قد تنعطف أو تتوقف فجأة." },
      { term: "sudden stop", ar: "توقف مفاجئ", explainAr: "المركبات القريبة من مواقف السيارات قد تتوقف فجأة للدخول أو الخروج." }
    ]
  },

  {
    id: "HZ-5140",
    topic: "hazard-awareness",
    promptEn: "You are driving at night and see a cyclist ahead wearing dark clothing. What hazard should you anticipate?",
    promptAr: "أثناء القيادة ليلاً، ترى درّاجًا يرتدي ملابس داكنة أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will be clearly visible", ar: "سيكون الدرّاج واضح الرؤية", correct: false },
      { en: "The cyclist may be difficult to see and judge distance", ar: "قد يصعب رؤية الدرّاج وتقدير المسافة", correct: true },
      { en: "Traffic speed will increase", ar: "ستزداد سرعة المرور", correct: false },
      { en: "The cyclist will stop immediately", ar: "سيتوقف الدرّاج فورًا", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "درّاج", explainAr: "الدرّاجون الذين يرتدون ملابس داكنة يصعب رؤيتهم ليلاً." },
      { term: "night", ar: "ليل", explainAr: "القيادة ليلاً تقلل من الرؤية وتزيد من صعوبة رؤية الدرّاجين." },
      { term: "visibility", ar: "الرؤية", explainAr: "الملابس الداكنة تقلل من وضوح رؤية الدرّاجين خاصة في الليل." }
    ]
  },

  {
    id: "HZ-5141",
    topic: "hazard-awareness",
    promptEn: "You are approaching roadworks and see cones narrowing the road. What hazard should you anticipate?",
    promptAr: "تقترب من أعمال طرق وترى أقماع تضيق الطريق. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will move faster", ar: "ستتحسن حركة المرور", correct: false },
      { en: "Sudden lane changes and reduced space", ar: "تغييرات مسار مفاجئة ومساحة أقل", correct: true },
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false },
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال طرق", explainAr: "أعمال الطرق تقلل من المساحة المتاحة وتتطلب الحذر." },
      { term: "cones", ar: "أقماع", explainAr: "الأقماع تشير إلى تضييق الطريق وتغيير المسارات." },
      { term: "narrow lanes", ar: "مسارات ضيقة", explainAr: "المسارات الضيقة تتطلب تخفيف السرعة والحذر من المركبات الأخرى." }
    ]
  },

  {
    id: "HZ-5142",
    topic: "hazard-awareness",
    promptEn: "You are driving in stop-start traffic and see brake lights ahead go off suddenly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة مرور متقطعة، ترى أضواء الفرامل أمامك تنطفئ فجأة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will flow smoothly", ar: "ستتحرك حركة المرور بسلاسة", correct: false },
      { en: "Traffic may start moving then stop again", ar: "قد يبدأ المرور بالحركة ثم يتوقف مجددًا", correct: true },
      { en: "The road surface is dry", ar: "سطح الطريق جاف", correct: false },
      { en: "Speed limits will increase", ar: "ستزداد حدود السرعة", correct: false }
    ],
    keywords: [
      { term: "stop-start traffic", ar: "مرور متقطع", explainAr: "المرور المتقطع يتطلب الحذر من التوقف والانطلاق المفاجئ." },
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "أضواء الفرامل تشير إلى توقف المركبات، وإطفاؤها يشير إلى بدء الحركة." },
      { term: "anticipation", ar: "التوقع", explainAr: "مراقبة أضواء الفرامل تساعدك على توقع حركة المرور." }
    ]
  },

  {
    id: "HZ-5143",
    topic: "hazard-awareness",
    promptEn: "You are driving near a pedestrian crossing and see a cyclist approaching it quickly. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب ممر مشاة، ترى درّاجًا يقترب بسرعة. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The cyclist will stop well back", ar: "سيتوقف الدرّاج بعيدًا", correct: false },
      { en: "The cyclist may cross unexpectedly", ar: "قد يعبر الدرّاج بشكل غير متوقع", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will narrow", ar: "سيضيق الطريق", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "درّاج", explainAr: "الدرّاجون الذين يقتربون بسرعة من ممرات المشاة قد يعبرون بشكل غير متوقع." },
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "ممرات المشاة تشهد عبور المشاة والدرّاجين." },
      { term: "speed", ar: "السرعة", explainAr: "الدرّاجون الذين يقتربون بسرعة قد لا يتمكنون من التوقف في الوقت المناسب." }
    ]
  },

  {
    id: "HZ-5144",
    topic: "hazard-awareness",
    promptEn: "You are driving on a road with overhanging trees and strong wind. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق به أشجار متدلية ورياح قوية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Clear road ahead", ar: "طريق خالٍ أمامك", correct: false },
      { en: "Falling branches or debris", ar: "سقوط فروع أو حطام", correct: true },
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false },
      { en: "Improved grip", ar: "تماسك أفضل", correct: false }
    ],
    keywords: [
      { term: "strong wind", ar: "رياح قوية", explainAr: "الرياح القوية قد تسبب سقوط الفروع والأغصان." },
      { term: "trees", ar: "أشجار", explainAr: "الأشجار المتدلية على الطريق قد تسقط فروعها في الرياح القوية." },
      { term: "falling debris", ar: "حطام متساقط", explainAr: "الفروع والحطام المتساقط يشكل خطرًا على المركبات." }
    ]
  },

  {
    id: "HZ-5145",
    topic: "hazard-awareness",
    promptEn: "You are driving in traffic and see a driver ahead using a mobile phone. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في حركة المرور، ترى سائقًا أمامك يستخدم الهاتف المحمول. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The driver will drive steadily", ar: "سيقود السائق بثبات", correct: false },
      { en: "Distracted driving and sudden reactions", ar: "تشتيت الانتباه وردود فعل مفاجئة", correct: true },
      { en: "Traffic lights will change", ar: "ستتغير إشارات المرور", correct: false },
      { en: "The road will widen", ar: "سيتسع الطريق", correct: false }
    ],
    keywords: [
      { term: "mobile phone", ar: "هاتف محمول", explainAr: "استخدام الهاتف المحمول أثناء القيادة يشتت الانتباه." },
      { term: "distraction", ar: "تشتيت الانتباه", explainAr: "السائقون المشتتون قد يتفاعلون بشكل مفاجئ أو بطيء." },
      { term: "sudden reaction", ar: "رد فعل مفاجئ", explainAr: "السائقون المشتتون قد يتفاعلون بشكل غير متوقع مع المواقف." }
    ]
  },

  {
    id: "HZ-5146",
    topic: "hazard-awareness",
    promptEn: "You are driving near a hospital and hear a siren. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مستشفى وتسمع صفارة إنذار. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will stop automatically", ar: "سيتوقف المرور تلقائيًا", correct: false },
      { en: "An emergency vehicle may appear suddenly", ar: "قد تظهر مركبة طوارئ فجأة", correct: true },
      { en: "The speed limit will increase", ar: "سيزداد حد السرعة", correct: false },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false }
    ],
    keywords: [
      { term: "hospital", ar: "مستشفى", explainAr: "المستشفيات تشهد حركة كثيفة لمركبات الطوارئ." },
      { term: "siren", ar: "صفارة إنذار", explainAr: "صفارات الإنذار تشير إلى اقتراب مركبة طوارئ." },
      { term: "emergency vehicle", ar: "مركبة طوارئ", explainAr: "مركبات الطوارئ قد تظهر فجأة وتتطلب إعطاء الأولوية." }
    ]
  },

  {
    id: "HZ-5147",
    topic: "hazard-awareness",
    promptEn: "You are driving on a frosty morning and see a bridge ahead. What hazard should you anticipate?",
    promptAr: "أثناء القيادة في صباح صقيعي، ترى جسرًا أمامك. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "The bridge will be dry", ar: "سيكون الجسر جافًا", correct: false },
      { en: "Ice forming earlier on the bridge surface", ar: "تكوّن الجليد على الجسر قبل الطرق الأخرى", correct: true },
      { en: "Improved grip", ar: "تماسك أفضل", correct: false },
      { en: "Higher speed limit", ar: "حد سرعة أعلى", correct: false }
    ],
    keywords: [
      { term: "frost", ar: "صقيع", explainAr: "الصقيع يسبب تكوّن الجليد على الطرق." },
      { term: "bridge", ar: "جسر", explainAr: "الجسور تتجمد قبل الطرق الأخرى لأنها معرضة للهواء من جميع الجهات." },
      { term: "ice", ar: "جليد", explainAr: "الجليد على الجسور يقلل من التماسك ويشكل خطرًا كبيرًا." }
    ]
  },

  {
    id: "HZ-5148",
    topic: "hazard-awareness",
    promptEn: "You are driving near a leisure centre and see groups of people crossing informally. What hazard should you anticipate?",
    promptAr: "أثناء القيادة قرب مركز ترفيهي، ترى مجموعات من الناس يعبرون بشكل غير رسمي. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Traffic will slow automatically", ar: "سيتباطأ المرور تلقائيًا", correct: false },
      { en: "Unpredictable pedestrian crossings", ar: "عبور مشاة غير متوقع", correct: true },
      { en: "The road will close", ar: "سيُغلق الطريق", correct: false },
      { en: "Speed limits will increase", ar: "ستزداد حدود السرعة", correct: false }
    ],
    keywords: [
      { term: "leisure centre", ar: "مركز ترفيهي", explainAr: "المراكز الترفيهية تشهد حركة كثيفة للمشاة." },
      { term: "pedestrians", ar: "مشاة", explainAr: "المشاة بالقرب من المراكز الترفيهية قد يعبرون بشكل غير متوقع." },
      { term: "informal crossing", ar: "عبور غير رسمي", explainAr: "العبور غير الرسمي يعني أن المشاة قد يعبرون في أي مكان دون استخدام ممرات المشاة." }
    ]
  },

  {
    id: "HZ-5149",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet motorway and see spray reducing visibility. What hazard should you anticipate?",
    promptAr: "أثناء القيادة على طريق سريع مبلل، ترى رذاذًا يقلل الرؤية. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "Clear visibility ahead", ar: "رؤية واضحة أمامك", correct: false },
      { en: "Reduced visibility and difficulty seeing hazards", ar: "انخفاض الرؤية وصعوبة رؤية المخاطر", correct: true },
      { en: "Higher speed limits", ar: "حدود سرعة أعلى", correct: false },
      { en: "Improved road conditions", ar: "تحسن ظروف الطريق", correct: false }
    ],
    keywords: [
      { term: "wet motorway", ar: "طريق سريع مبلل", explainAr: "الطرق السريعة المبللة تنتج رذاذًا يقلل الرؤية." },
      { term: "spray", ar: "رذاذ", explainAr: "الرذاذ من المركبات الأخرى يقلل من الرؤية بشكل كبير." },
      { term: "visibility", ar: "الرؤية", explainAr: "انخفاض الرؤية يجعل من الصعب رؤية المخاطر والمركبات الأخرى." }
    ]
  },

  {
    id: "ROR-5301",
    topic: "rules-of-the-road",
    promptEn: "At an unmarked crossroads, which traffic has priority?",
    promptAr: "عند تقاطع غير معلم بإشارات أو علامات، من له أولوية المرور؟",
    options: [
      { en: "Traffic coming from the left", ar: "المركبات القادمة من اليسار", correct: false },
      { en: "Traffic going straight ahead", ar: "المركبات المتجهة للأمام", correct: false },
      { en: "Traffic coming from the right", ar: "المركبات القادمة من اليمين", correct: true },
      { en: "Larger vehicles", ar: "المركبات الأكبر حجمًا", correct: false }
    ],
    keywords: [
      { term: "priority", ar: "أولوية", explainAr: "حق المرور في المضي قدمًا قبل المركبات الأخرى." },
      { term: "unmarked crossroads", ar: "تقاطع غير معلم", explainAr: "تقاطع بدون إشارات مرور أو علامات تحدد الأولوية." },
      { term: "give way", ar: "إعطاء الأولوية", explainAr: "السماح للمركبات الأخرى بالمرور أولاً." }
    ]
  },

  {
    id: "ROR-5302",
    topic: "rules-of-the-road",
    promptEn: "When must you stop at a STOP sign?",
    promptAr: "متى يجب عليك التوقف عند إشارة التوقف (STOP)؟",
    options: [
      { en: "Only if traffic is approaching", ar: "فقط إذا كانت هناك حركة مرور", correct: false },
      { en: "Only if pedestrians are crossing", ar: "فقط إذا كان المشاة يعبرون", correct: false },
      { en: "Every time you reach the stop line", ar: "في كل مرة تصل فيها إلى خط التوقف", correct: true },
      { en: "Only during busy times", ar: "فقط في أوقات الازدحام", correct: false }
    ],
    keywords: [
      { term: "stop sign", ar: "إشارة التوقف", explainAr: "إشارة مرور حمراء مثمنة تتطلب توقفًا كاملاً." },
      { term: "mandatory stop", ar: "توقف إلزامي", explainAr: "يجب التوقف تمامًا عند خط التوقف، بغض النظر عن ظروف المرور." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." }
    ]
  },

  {
    id: "ROR-5303",
    topic: "rules-of-the-road",
    promptEn: "When should you signal when turning left at a junction?",
    promptAr: "متى يجب عليك إعطاء إشارة عند الانعطاف يسارًا عند تقاطع؟",
    options: [
      { en: "After starting the turn", ar: "بعد بدء الانعطاف", correct: false },
      { en: "Only if traffic is behind you", ar: "فقط إذا كانت هناك مركبات خلفك", correct: false },
      { en: "In good time before turning", ar: "في وقت مناسب قبل الانعطاف", correct: true },
      { en: "Only if pedestrians are present", ar: "فقط إذا كان المشاة موجودين", correct: false }
    ],
    keywords: [
      { term: "signals", ar: "الإشارات", explainAr: "استخدام إشارات الانعطاف لإعلام الآخرين بنيتك." },
      { term: "turning left", ar: "الانعطاف يسارًا", explainAr: "تغيير الاتجاه إلى اليسار." },
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." }
    ]
  },

  {
    id: "ROR-5304",
    topic: "rules-of-the-road",
    promptEn: "Who has priority on a roundabout unless signs say otherwise?",
    promptAr: "من له أولوية المرور في الدوار ما لم تُظهر الإشارات غير ذلك؟",
    options: [
      { en: "Traffic entering the roundabout", ar: "المركبات الداخلة إلى الدوار", correct: false },
      { en: "Traffic already on the roundabout", ar: "المركبات الموجودة داخل الدوار", correct: true },
      { en: "Larger vehicles", ar: "المركبات الأكبر", correct: false },
      { en: "Vehicles going straight ahead", ar: "المركبات المتجهة للأمام", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث تدور المركبات حول جزيرة مركزية." },
      { term: "priority", ar: "أولوية", explainAr: "حق المرور في المضي قدمًا قبل المركبات الأخرى." },
      { term: "give way", ar: "إعطاء الأولوية", explainAr: "السماح للمركبات الموجودة بالفعل في الدوار بالمرور أولاً." }
    ]
  },

  {
    id: "ROR-5305",
    topic: "rules-of-the-road",
    promptEn: "When may you cross a double solid white line in the centre of the road?",
    promptAr: "متى يُسمح لك بعبور خطين أبيضين متصلين في منتصف الطريق؟",
    options: [
      { en: "To overtake slow traffic", ar: "لتجاوز المرور البطيء", correct: false },
      { en: "To pass a stationary vehicle if safe", ar: "لتجاوز مركبة متوقفة إذا كان آمنًا", correct: true },
      { en: "To make a U-turn", ar: "لعمل استدارة كاملة", correct: false },
      { en: "At night only", ar: "ليلًا فقط", correct: false }
    ],
    keywords: [
      { term: "double white lines", ar: "خطان أبيضان", explainAr: "علامات على الطريق تحظر التجاوز إلا في حالات محدودة." },
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى تسير في نفس الاتجاه." },
      { term: "road markings", ar: "علامات الطريق", explainAr: "الخطوط والرموز المرسومة على سطح الطريق لتوجيه السائقين." }
    ]
  },

  {
    id: "ROR-5306",
    topic: "rules-of-the-road",
    promptEn: "When must you give way to pedestrians at a zebra crossing?",
    promptAr: "متى يجب عليك إعطاء الأولوية للمشاة عند ممر مشاة (زِبرا)؟",
    options: [
      { en: "Only when they are waiting", ar: "فقط عندما ينتظرون", correct: false },
      { en: "Only when traffic lights are red", ar: "فقط عندما تكون الإشارة حمراء", correct: false },
      { en: "When they have stepped onto the crossing", ar: "عندما يخطو المشاة إلى الممر", correct: true },
      { en: "At all times", ar: "في جميع الأوقات", correct: false }
    ],
    keywords: [
      { term: "zebra crossing", ar: "ممر مشاة", explainAr: "ممر للمشاة محدد بخطوط بيضاء متوازية على الطريق." },
      { term: "pedestrians", ar: "مشاة", explainAr: "الأشخاص الذين يسيرون على الأقدام." },
      { term: "priority", ar: "أولوية", explainAr: "حق المرور في المضي قدمًا قبل المركبات الأخرى." }
    ]
  },

  {
    id: "ROR-5307",
    topic: "rules-of-the-road",
    promptEn: "When emerging from a side road, what should you do first?",
    promptAr: "عند الخروج من طريق جانبي، ما أول إجراء يجب عليك القيام به؟",
    options: [
      { en: "Signal", ar: "إعطاء إشارة", correct: false },
      { en: "Move forward quickly", ar: "التقدم بسرعة", correct: false },
      { en: "Look both ways for traffic", ar: "النظر في كلا الاتجاهين للمرور", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "emerging", ar: "الخروج", explainAr: "الخروج من طريق جانبي إلى طريق رئيسي." },
      { term: "observation", ar: "المراقبة", explainAr: "فحص الطريق والمرور قبل اتخاذ أي إجراء." },
      { term: "side road", ar: "طريق جانبي", explainAr: "طريق ثانوي يتصل بطريق رئيسي." }
    ]
  },

  {
    id: "ROR-5308",
    topic: "rules-of-the-road",
    promptEn: "What does a flashing amber traffic light at a pedestrian crossing mean?",
    promptAr: "ماذا تعني الإشارة الكهرمانية الوامضة عند ممر المشاة؟",
    options: [
      { en: "Stop and wait", ar: "توقف وانتظر", correct: false },
      { en: "Proceed if the crossing is clear", ar: "تابع إذا كان الممر خاليًا", correct: true },
      { en: "Speed up", ar: "زد السرعة", correct: false },
      { en: "Pedestrians must wait", ar: "يجب على المشاة الانتظار", correct: false }
    ],
    keywords: [
      { term: "pelican crossing", ar: "ممر مشاة بإشارات", explainAr: "ممر مشاة مع إشارات مرور ضوئية." },
      { term: "flashing amber", ar: "إشارة كهرمانية وامضة", explainAr: "إشارة تحذيرية تسمح بالمرور إذا كان الممر خاليًا." },
      { term: "traffic lights", ar: "إشارات المرور", explainAr: "أضواء تتحكم في حركة المرور عند التقاطعات." }
    ]
  },

  {
    id: "ROR-5309",
    topic: "rules-of-the-road",
    promptEn: "When should you check your mirrors?",
    promptAr: "متى يجب عليك فحص المرايا؟",
    options: [
      { en: "Only when changing lanes", ar: "فقط عند تغيير المسار", correct: false },
      { en: "Before signalling or changing speed or direction", ar: "قبل الإشارة أو تغيير السرعة أو الاتجاه", correct: true },
      { en: "Only in heavy traffic", ar: "فقط في الازدحام", correct: false },
      { en: "Only on motorways", ar: "فقط على الطرق السريعة", correct: false }
    ],
    keywords: [
      { term: "mirrors", ar: "المرايا", explainAr: "تساعدك على رؤية المركبات خلفك وعلى الجانبين." },
      { term: "observation", ar: "المراقبة", explainAr: "فحص الطريق والمرور قبل اتخاذ أي إجراء." },
      { term: "safe driving", ar: "قيادة آمنة", explainAr: "ممارسة القيادة بطريقة تقلل من المخاطر." }
    ]
  },

  {
    id: "ROR-5310",
    topic: "rules-of-the-road",
    promptEn: "When are you allowed to overtake on the left?",
    promptAr: "متى يُسمح لك بالتجاوز من الجهة اليسرى؟",
    options: [
      { en: "At any time on a dual carriageway", ar: "في أي وقت على طريق مزدوج", correct: false },
      { en: "When traffic is moving slowly in queues", ar: "عندما يكون المرور بطيئًا في طوابير", correct: true },
      { en: "On single carriageways", ar: "على الطرق المفردة", correct: false },
      { en: "At junctions", ar: "عند التقاطعات", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى تسير في نفس الاتجاه." },
      { term: "left side", ar: "الجانب الأيسر", explainAr: "التجاوز من الجهة اليسرى، وهو غير مسموح عادة إلا في حالات محددة." },
      { term: "queues", ar: "طوابير", explainAr: "صفوف من المركبات تتحرك ببطء أو متوقفة." }
    ]
  },

  {
    id: "VH-5501",
    topic: "vehicle-handling",
    promptEn: "Why should you brake earlier when driving on a wet road?",
    promptAr: "لماذا يجب عليك الكبح مبكرًا عند القيادة على طريق مبلل؟",
    options: [
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "Because stopping distances are longer", ar: "لأن مسافة التوقف تكون أطول", correct: true },
      { en: "Because tyres grip better", ar: "لأن تماسك الإطارات أفضل", correct: false },
      { en: "To avoid using ABS", ar: "لتجنب استخدام نظام ABS", correct: false }
    ],
    keywords: [
      { term: "wet road", ar: "طريق مبلل", explainAr: "طريق رطب يقلل من تماسك الإطارات ويزيد مسافة التوقف." },
      { term: "braking", ar: "الفرملة", explainAr: "عملية إبطاء أو إيقاف المركبة باستخدام المكابح." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا." }
    ]
  },

  {
    id: "VH-5502",
    topic: "vehicle-handling",
    promptEn: "What effect can under-inflated tyres have on your vehicle?",
    promptAr: "ما تأثير الإطارات غير المنفوخة بشكل كافٍ على مركبتك؟",
    options: [
      { en: "Improved steering response", ar: "تحسن استجابة التوجيه", correct: false },
      { en: "Reduced control and increased fuel use", ar: "انخفاض السيطرة وزيادة استهلاك الوقود", correct: true },
      { en: "Shorter stopping distance", ar: "مسافة توقف أقصر", correct: false },
      { en: "No noticeable effect", ar: "لا تأثير ملحوظ", correct: false }
    ],
    keywords: [
      { term: "tyres", ar: "الإطارات", explainAr: "العجلات المطاطية التي تلامس الطريق وتوفر التماسك." },
      { term: "under-inflated", ar: "غير منفوخة بشكل كافٍ", explainAr: "إطارات لا تحتوي على ضغط هواء كافٍ." },
      { term: "control", ar: "السيطرة", explainAr: "القدرة على توجيه وإدارة المركبة بشكل فعال." }
    ]
  },

  {
    id: "VH-5504",
    topic: "vehicle-handling",
    promptEn: "What should you do if your vehicle begins to skid?",
    promptAr: "ماذا يجب أن تفعل إذا بدأت مركبتك بالانزلاق؟",
    options: [
      { en: "Brake hard immediately", ar: "الكبح بقوة فورًا", correct: false },
      { en: "Ease off the pedals and steer into the skid", ar: "تخفيف الضغط على الدواسات والتوجيه باتجاه الانزلاق", correct: true },
      { en: "Apply the handbrake", ar: "استخدام فرامل اليد", correct: false },
      { en: "Accelerate to regain grip", ar: "التسارع لاستعادة التماسك", correct: false }
    ],
    keywords: [
      { term: "skid", ar: "الانزلاق", explainAr: "فقدان التماسك بين الإطارات والطريق مما يؤدي إلى فقدان السيطرة." },
      { term: "steering", ar: "التوجيه", explainAr: "توجيه المركبة باستخدام عجلة القيادة." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه وإدارة المركبة بشكل فعال." }
    ]
  },

  {
    id: "VH-5505",
    topic: "vehicle-handling",
    promptEn: "Why is it important to adjust your head restraint correctly?",
    promptAr: "لماذا من المهم ضبط مسند الرأس بشكل صحيح؟",
    options: [
      { en: "To improve comfort only", ar: "لتحسين الراحة فقط", correct: false },
      { en: "To reduce the risk of neck injury in a collision", ar: "لتقليل خطر إصابة الرقبة عند التصادم", correct: true },
      { en: "To improve rear visibility", ar: "لتحسين الرؤية الخلفية", correct: false },
      { en: "To reduce wind noise", ar: "لتقليل ضوضاء الرياح", correct: false }
    ],
    keywords: [
      { term: "head restraint", ar: "مسند الرأس", explainAr: "جهاز في المقعد يدعم الرأس والرقبة لحماية الرقبة من الإصابات." },
      { term: "neck injury", ar: "إصابة الرقبة", explainAr: "ضرر يلحق بالرقبة، غالبًا بسبب حركة الرأس المفاجئة عند التصادم." },
      { term: "safety", ar: "السلامة", explainAr: "حماية نفسك والآخرين من الأذى أثناء القيادة." }
    ]
  },

  {
    id: "VH-5506",
    topic: "vehicle-handling",
    promptEn: "What effect can carrying a heavy load on the roof have?",
    promptAr: "ما تأثير حمل حمولة ثقيلة على سقف المركبة؟",
    options: [
      { en: "Improved handling", ar: "تحسن التحكم", correct: false },
      { en: "Reduced stability and increased stopping distance", ar: "انخفاض الثبات وزيادة مسافة التوقف", correct: true },
      { en: "Better fuel economy", ar: "اقتصاد أفضل في الوقود", correct: false },
      { en: "No effect if secured", ar: "لا تأثير إذا كانت مثبتة", correct: false }
    ],
    keywords: [
      { term: "roof load", ar: "حمولة السقف", explainAr: "الأشياء المحمولة على سطح المركبة." },
      { term: "stability", ar: "الثبات", explainAr: "قدرة المركبة على البقاء مستقرة ومتوازنة." },
      { term: "handling", ar: "التحكم", explainAr: "كيفية استجابة المركبة لتوجيهات السائق." }
    ]
  },

  {
    id: "VH-5507",
    topic: "vehicle-handling",
    promptEn: "Why should you use a lower gear when driving downhill?",
    promptAr: "لماذا يجب استخدام ترس أقل عند القيادة نزولًا؟",
    options: [
      { en: "To increase speed", ar: "لزيادة السرعة", correct: false },
      { en: "To help control speed using engine braking", ar: "للمساعدة في التحكم بالسرعة باستخدام فرملة المحرك", correct: true },
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To reduce engine noise", ar: "لتقليل ضوضاء المحرك", correct: false }
    ],
    keywords: [
      { term: "downhill", ar: "نزول", explainAr: "القيادة على منحدر نزولي." },
      { term: "engine braking", ar: "فرملة المحرك", explainAr: "استخدام مقاومة المحرك لإبطاء المركبة بدلاً من المكابح فقط." },
      { term: "gears", ar: "التروس", explainAr: "نظام نقل الحركة الذي يتحكم في سرعة المركبة وقوتها." }
    ]
  },

  {
    id: "VH-5508",
    topic: "vehicle-handling",
    promptEn: "What should you do if the steering feels unusually heavy?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت بأن التوجيه ثقيل بشكل غير معتاد؟",
    options: [
      { en: "Continue driving normally", ar: "متابعة القيادة بشكل طبيعي", correct: false },
      { en: "Check for a fault and drive with caution", ar: "التحقق من وجود عطل والقيادة بحذر", correct: true },
      { en: "Increase speed", ar: "زيادة السرعة", correct: false },
      { en: "Ignore it if the road is clear", ar: "تجاهله إذا كان الطريق خاليًا", correct: false }
    ],
    keywords: [
      { term: "steering", ar: "التوجيه", explainAr: "نظام توجيه المركبة باستخدام عجلة القيادة." },
      { term: "fault", ar: "عطل", explainAr: "مشكلة تقنية في المركبة تحتاج إلى فحص وإصلاح." },
      { term: "vehicle control", ar: "التحكم بالمركبة", explainAr: "القدرة على توجيه وإدارة المركبة بشكل فعال وآمن." }
    ]
  },

  {
    id: "VH-5509",
    topic: "vehicle-handling",
    promptEn: "Why should loads inside your vehicle be secured?",
    promptAr: "لماذا يجب تثبيت الحمولة داخل المركبة؟",
    options: [
      { en: "To improve fuel efficiency", ar: "لتحسين كفاءة الوقود", correct: false },
      { en: "To prevent them moving and causing injury", ar: "لمنع تحركها والتسبب بإصابات", correct: true },
      { en: "To reduce engine wear", ar: "لتقليل تآكل المحرك", correct: false },
      { en: "To improve steering", ar: "لتحسين التوجيه", correct: false }
    ],
    keywords: [
      { term: "load", ar: "الحمولة", explainAr: "الأشياء المحمولة داخل المركبة." },
      { term: "vehicle interior", ar: "داخل المركبة", explainAr: "المساحة الداخلية للمركبة حيث يجلس الركاب أو توضع الحمولة." },
      { term: "safety", ar: "السلامة", explainAr: "حماية نفسك والآخرين من الأذى أثناء القيادة." }
    ]
  },

  {
    id: "VH-5510",
    topic: "vehicle-handling",
    promptEn: "What is the main benefit of anti-lock braking systems (ABS)?",
    promptAr: "ما الفائدة الرئيسية لنظام منع انغلاق المكابح (ABS)؟",
    options: [
      { en: "Shorter stopping distances in all conditions", ar: "مسافة توقف أقصر في جميع الظروف", correct: false },
      { en: "Maintaining steering control while braking", ar: "الحفاظ على التحكم بالتوجيه أثناء الفرملة", correct: true },
      { en: "Preventing tyre wear", ar: "منع تآكل الإطارات", correct: false },
      { en: "Reducing fuel consumption", ar: "تقليل استهلاك الوقود", correct: false }
    ],
    keywords: [
      { term: "ABS", ar: "نظام منع انغلاق المكابح", explainAr: "نظام يمنع انغلاق العجلات أثناء الفرملة القوية." },
      { term: "braking", ar: "الفرملة", explainAr: "عملية إبطاء أو إيقاف المركبة باستخدام المكابح." },
      { term: "steering control", ar: "التحكم بالتوجيه", explainAr: "القدرة على توجيه المركبة أثناء الفرملة." }
    ]
  },

  {
    id: "VH-5511",
    topic: "vehicle-handling",
    promptEn: "How should you adjust your driving in strong winds?",
    promptAr: "كيف يجب أن تعدّل قيادتك في الرياح القوية؟",
    options: [
      { en: "Increase speed to maintain stability", ar: "زيادة السرعة للحفاظ على الثبات", correct: false },
      { en: "Reduce speed and keep a firm grip on the steering wheel", ar: "تخفيف السرعة والإمساك بالمقود بإحكام", correct: true },
      { en: "Drive closer to other vehicles", ar: "القيادة أقرب إلى المركبات الأخرى", correct: false },
      { en: "Use cruise control", ar: "استخدام مثبت السرعة", correct: false }
    ],
    keywords: [
      { term: "strong winds", ar: "الرياح القوية", explainAr: "رياح قوية يمكن أن تؤثر على استقرار المركبة وتتطلب قيادة حذرة." },
      { term: "steering", ar: "التوجيه", explainAr: "التحكم في اتجاه المركبة باستخدام المقود." },
      { term: "stability", ar: "الاستقرار", explainAr: "القدرة على الحفاظ على توازن المركبة والتحكم بها." }
    ]
  },

  {
    id: "VH-5512",
    topic: "vehicle-handling",
    promptEn: "Why should you check your tyres regularly?",
    promptAr: "لماذا يجب فحص الإطارات بانتظام؟",
    options: [
      { en: "To improve vehicle appearance", ar: "لتحسين مظهر المركبة", correct: false },
      { en: "To ensure correct grip and safe handling", ar: "لضمان التماسك والتحكم الآمن", correct: true },
      { en: "To reduce engine noise", ar: "لتقليل ضوضاء المحرك", correct: false },
      { en: "To increase maximum speed", ar: "لزيادة السرعة القصوى", correct: false }
    ],
    keywords: [
      { term: "tyres", ar: "الإطارات", explainAr: "العجلات المطاطية التي تلامس الطريق وتوفر التماسك." },
      { term: "grip", ar: "التماسك", explainAr: "قدرة الإطارات على التمسك بسطح الطريق." },
      { term: "handling", ar: "التحكم", explainAr: "القدرة على توجيه ومراقبة المركبة بشكل آمن." }
    ]
  },

  {
    id: "VH-5513",
    topic: "vehicle-handling",
    promptEn: "What should you do if your brakes feel spongy?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت بأن المكابح إسفنجية؟",
    options: [
      { en: "Brake harder", ar: "الكبح بقوة أكبر", correct: false },
      { en: "Have the braking system checked immediately", ar: "فحص نظام المكابح فورًا", correct: true },
      { en: "Ignore it if braking still works", ar: "تجاهله إذا كانت المكابح تعمل", correct: false },
      { en: "Use the handbrake more often", ar: "استخدام فرامل اليد أكثر", correct: false }
    ],
    keywords: [
      { term: "brakes", ar: "المكابح", explainAr: "نظام إيقاف المركبة أو إبطائها." },
      { term: "spongy", ar: "إسفنجية", explainAr: "شعور بأن المكابح طرية أو غير فعالة، مما يشير إلى مشكلة في النظام." },
      { term: "vehicle fault", ar: "عطل المركبة", explainAr: "مشكلة في أحد أنظمة المركبة تتطلب الفحص والإصلاح." }
    ]
  },

  {
    id: "VH-5514",
    topic: "vehicle-handling",
    promptEn: "How does rain affect your vehicle's stopping distance?",
    promptAr: "كيف يؤثر المطر على مسافة توقف المركبة؟",
    options: [
      { en: "It shortens stopping distance", ar: "يقصر مسافة التوقف", correct: false },
      { en: "It increases stopping distance", ar: "يزيد مسافة التوقف", correct: true },
      { en: "It has no effect", ar: "ليس له تأثير", correct: false },
      { en: "It only affects braking at high speeds", ar: "يؤثر فقط عند السرعات العالية", correct: false }
    ],
    keywords: [
      { term: "rain", ar: "المطر", explainAr: "ظروف الطقس الماطرة التي تجعل الطريق زلقًا." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا بعد البدء بالفرملة." },
      { term: "braking", ar: "الفرملة", explainAr: "عملية إبطاء أو إيقاف المركبة باستخدام المكابح." }
    ]
  },

  {
    id: "VH-5515",
    topic: "vehicle-handling",
    promptEn: "What is the main risk of aquaplaning?",
    promptAr: "ما الخطر الرئيسي للانزلاق المائي (Aquaplaning)؟",
    options: [
      { en: "Increased fuel consumption", ar: "زيادة استهلاك الوقود", correct: false },
      { en: "Loss of steering and braking control", ar: "فقدان التحكم بالتوجيه والفرملة", correct: true },
      { en: "Tyre punctures", ar: "انفجار الإطارات", correct: false },
      { en: "Engine stalling", ar: "توقف المحرك", correct: false }
    ],
    keywords: [
      { term: "aquaplaning", ar: "الانزلاق المائي", explainAr: "ظاهرة تحدث عندما تفقد الإطارات التماسك مع الطريق بسبب طبقة من الماء." },
      { term: "water", ar: "الماء", explainAr: "الرطوبة على سطح الطريق التي يمكن أن تسبب الانزلاق." },
      { term: "loss of control", ar: "فقدان السيطرة", explainAr: "عدم القدرة على التحكم في اتجاه أو سرعة المركبة." }
    ]
  },

  {
    id: "VH-5516",
    topic: "vehicle-handling",
    promptEn: "Why should you slow down before entering a bend?",
    promptAr: "لماذا يجب التخفيف قبل دخول منعطف؟",
    options: [
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "To maintain control and balance", ar: "للحفاظ على التحكم والتوازن", correct: true },
      { en: "To improve acceleration", ar: "لتحسين التسارع", correct: false },
      { en: "To reduce engine noise", ar: "لتقليل ضوضاء المحرك", correct: false }
    ],
    keywords: [
      { term: "bends", ar: "المنعطفات", explainAr: "مناطق في الطريق حيث يتغير الاتجاه بشكل منحني." },
      { term: "speed control", ar: "التحكم بالسرعة", explainAr: "القدرة على تعديل السرعة بشكل مناسب للظروف." },
      { term: "handling", ar: "التحكم", explainAr: "القدرة على توجيه ومراقبة المركبة بشكل آمن." }
    ]
  },

  {
    id: "VH-5517",
    topic: "vehicle-handling",
    promptEn: "What effect does ice have on vehicle handling?",
    promptAr: "ما تأثير الجليد على التحكم بالمركبة؟",
    options: [
      { en: "Improved grip", ar: "تحسن التماسك", correct: false },
      { en: "Severely reduced grip and control", ar: "انخفاض شديد في التماسك والتحكم", correct: true },
      { en: "No effect at low speeds", ar: "لا تأثير عند السرعات المنخفضة", correct: false },
      { en: "Only affects braking", ar: "يؤثر فقط على الفرامل", correct: false }
    ],
    keywords: [
      { term: "ice", ar: "الجليد", explainAr: "طبقة من الجليد على الطريق تجعله زلقًا جدًا وخطيرًا." },
      { term: "grip", ar: "التماسك", explainAr: "قدرة الإطارات على التمسك بسطح الطريق." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه ومراقبة المركبة بشكل آمن." }
    ]
  },

  {
    id: "VH-5518",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid sudden steering movements?",
    promptAr: "لماذا يجب تجنب حركات التوجيه المفاجئة؟",
    options: [
      { en: "They save time", ar: "توفر الوقت", correct: false },
      { en: "They can cause loss of control", ar: "قد تسبب فقدان السيطرة", correct: true },
      { en: "They reduce tyre wear", ar: "تقلل تآكل الإطارات", correct: false },
      { en: "They improve handling", ar: "تحسن التحكم", correct: false }
    ],
    keywords: [
      { term: "steering", ar: "التوجيه", explainAr: "التحكم في اتجاه المركبة باستخدام المقود." },
      { term: "sudden movements", ar: "الحركات المفاجئة", explainAr: "تغييرات سريعة وحادة في اتجاه المركبة." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه ومراقبة المركبة بشكل آمن." }
    ]
  },

  {
    id: "VH-5519",
    topic: "vehicle-handling",
    promptEn: "What should you do if your vehicle starts to overheat?",
    promptAr: "ماذا يجب أن تفعل إذا بدأ محرك المركبة بالسخونة الزائدة؟",
    options: [
      { en: "Continue driving to reach your destination", ar: "متابعة القيادة للوصول", correct: false },
      { en: "Stop safely and switch off the engine", ar: "التوقف بأمان وإطفاء المحرك", correct: true },
      { en: "Increase speed to cool it down", ar: "زيادة السرعة لتبريده", correct: false },
      { en: "Ignore the warning light", ar: "تجاهل ضوء التحذير", correct: false }
    ],
    keywords: [
      { term: "overheating", ar: "السخونة الزائدة", explainAr: "ارتفاع درجة حرارة المحرك بشكل خطير." },
      { term: "engine", ar: "المحرك", explainAr: "جزء المركبة الذي يوفر الطاقة للحركة." },
      { term: "warning", ar: "التحذير", explainAr: "إشارة تنبهك إلى وجود مشكلة في المركبة." }
    ]
  },

  {
    id: "VH-5520",
    topic: "vehicle-handling",
    promptEn: "What is the safest way to maintain control on slippery roads?",
    promptAr: "ما الطريقة الأكثر أمانًا للحفاظ على السيطرة على الطرق الزلقة؟",
    options: [
      { en: "Brake and accelerate sharply", ar: "الكبح والتسارع بشكل حاد", correct: false },
      { en: "Use smooth steering, gentle braking, and low speed", ar: "استخدام توجيه سلس وكبح لطيف وسرعة منخفضة", correct: true },
      { en: "Use cruise control", ar: "استخدام مثبت السرعة", correct: false },
      { en: "Drive close to other vehicles", ar: "القيادة قرب المركبات الأخرى", correct: false }
    ],
    keywords: [
      { term: "slippery roads", ar: "الطرق الزلقة", explainAr: "طرق زلقة بسبب المطر أو الجليد أو الزيت." },
      { term: "smooth driving", ar: "القيادة السلسة", explainAr: "قيادة بحركات ناعمة ومتحكم بها دون حركات مفاجئة." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه ومراقبة المركبة بشكل آمن." }
    ]
  },

  {
    id: "MW-5601",
    topic: "motorway-driving",
    promptEn: "When joining a motorway, why should you use the full length of the slip road?",
    promptAr: "عند الانضمام إلى الطريق السريع، لماذا يجب استخدام كامل طول طريق الاندماج؟",
    options: [
      { en: "To stop safely before joining", ar: "للتوقف بأمان قبل الدخول", correct: false },
      { en: "To match your speed with motorway traffic", ar: "لمواءمة سرعتك مع حركة المرور على الطريق السريع", correct: true },
      { en: "To check road signs", ar: "لفحص إشارات الطريق", correct: false },
      { en: "To give way to traffic behind", ar: "لإعطاء أولوية للمركبات خلفك", correct: false }
    ],
    keywords: [
      { term: "slip road", ar: "طريق الاندماج", explainAr: "المسار الذي تستخدمه للوصول إلى سرعة مناسبة قبل الدخول إلى الطريق السريع." },
      { term: "joining motorway", ar: "الانضمام للطريق السريع", explainAr: "عملية الدخول إلى الطريق السريع من طريق جانبي." },
      { term: "matching speed", ar: "مواءمة السرعة", explainAr: "ضبط سرعتك لتتناسب مع سرعة المركبات على الطريق السريع." }
    ]
  },
  {
    id: "MW-5602",
    topic: "motorway-driving",
    promptEn: "What is the normal use of the left-hand lane on a motorway?",
    promptAr: "ما الاستخدام الطبيعي للمسار الأيسر على الطريق السريع؟",
    options: [
      { en: "For overtaking only", ar: "للتجاوز فقط", correct: false },
      { en: "For normal driving", ar: "للقيادة العادية", correct: true },
      { en: "For emergency vehicles", ar: "لمركبات الطوارئ", correct: false },
      { en: "For slow vehicles only", ar: "للمركبات البطيئة فقط", correct: false }
    ],
    keywords: [
      { term: "left lane", ar: "المسار الأيسر", explainAr: "المسار الأساسي للسير العادي على الطريق السريع." },
      { term: "lane discipline", ar: "انضباط المسارات", explainAr: "استخدام المسارات بشكل صحيح وفق القواعد المرورية." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق سريع متعدد المسارات للقيادة بسرعات عالية." }
    ]
  },
  {
    id: "MW-5603",
    topic: "motorway-driving",
    promptEn: "When should you use the hard shoulder on a motorway?",
    promptAr: "متى يُسمح باستخدام كتف الطريق على الطريق السريع؟",
    options: [
      { en: "When traffic is heavy", ar: "عند الازدحام", correct: false },
      { en: "In an emergency or breakdown only", ar: "في حالات الطوارئ أو الأعطال فقط", correct: true },
      { en: "To answer a phone call", ar: "للرد على الهاتف", correct: false },
      { en: "To overtake slow vehicles", ar: "لتجاوز المركبات البطيئة", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "المسار الجانبي المخصص للطوارئ والأعطال فقط." },
      { term: "emergency", ar: "الطوارئ", explainAr: "حالة خطيرة تتطلب توقف فوري." },
      { term: "breakdown", ar: "العطل", explainAr: "عطل في المركبة يمنعها من الاستمرار في السير." }
    ]
  },
  {
    id: "MW-5604",
    topic: "motorway-driving",
    promptEn: "What does a red 'X' above a motorway lane mean?",
    promptAr: "ماذا تعني علامة X الحمراء فوق أحد مسارات الطريق السريع؟",
    options: [
      { en: "Lane recommended for use", ar: "المسار مُوصى باستخدامه", correct: false },
      { en: "Lane closed and must not be used", ar: "المسار مغلق ويُمنع استخدامه", correct: true },
      { en: "Lane for emergency vehicles only", ar: "مسار لمركبات الطوارئ فقط", correct: false },
      { en: "Lane closing soon", ar: "المسار سيغلق قريبًا", correct: false }
    ],
    keywords: [
      { term: "red X", ar: "علامة X الحمراء", explainAr: "إشارة تعني أن المسار مغلق ولا يمكن استخدامه." },
      { term: "lane closed", ar: "المسار مغلق", explainAr: "المسار غير متاح للاستخدام بسبب أعمال صيانة أو حادث." },
      { term: "smart motorway", ar: "الطريق السريع الذكي", explainAr: "طريق سريع يستخدم إشارات إلكترونية للتحكم في المسارات." }
    ]
  },
  {
    id: "MW-5605",
    topic: "motorway-driving",
    promptEn: "On a smart motorway, what do variable speed limit signs displayed on overhead gantries indicate?",
    promptAr: "على طريق سريع ذكي، ماذا تشير علامات حد السرعة المتغيرة المعروضة على الجسور العلوية؟",
    options: [
      { en: "The maximum speed you should travel at that moment", ar: "الحد الأقصى للسرعة التي يجب أن تسير بها في تلك اللحظة", correct: true },
      { en: "The minimum speed required", ar: "الحد الأدنى للسرعة المطلوبة", correct: false },
      { en: "A suggestion that you can ignore", ar: "اقتراح يمكنك تجاهله", correct: false },
      { en: "The speed limit for the next junction only", ar: "حد السرعة للمفترق التالي فقط", correct: false }
    ],
    keywords: [
      { term: "variable speed limits", ar: "حدود السرعة المتغيرة", explainAr: "قيود سرعة ديناميكية تُعدّل حسب ظروف المرور والطقس." },
      { term: "smart motorway", ar: "الطريق السريع الذكي", explainAr: "طريق سريع يستخدم إشارات إلكترونية للتحكم في السرعات والمسارات." },
      { term: "gantry", ar: "الجسر العلوي", explainAr: "هيكل معلق فوق الطريق يعرض إشارات السرعة والمسارات." }
    ]
  },
  {
    id: "MW-5606",
    topic: "motorway-driving",
    promptEn: "Why should you keep a longer following distance on motorways?",
    promptAr: "لماذا يجب الحفاظ على مسافة متابعة أطول على الطرق السريعة؟",
    options: [
      { en: "Because vehicles are heavier", ar: "لأن المركبات أثقل", correct: false },
      { en: "Because speeds are higher", ar: "لأن السرعات أعلى", correct: true },
      { en: "Because lanes are narrower", ar: "لأن المسارات أضيق", correct: false },
      { en: "Because traffic lights are absent", ar: "لعدم وجود إشارات ضوئية", correct: false }
    ],
    keywords: [
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة الآمنة بين مركبتك والمركبة أمامك." },
      { term: "high speed", ar: "السرعة العالية", explainAr: "القيادة بسرعات أعلى من الطرق العادية." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "إجراءات السلامة الخاصة بالقيادة على الطرق السريعة." }
    ]
  },
  {
    id: "MW-5607",
    topic: "motorway-driving",
    promptEn: "What should you do if your vehicle breaks down on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا تعطلت مركبتك على الطريق السريع؟",
    options: [
      { en: "Stay in the vehicle with seatbelt on", ar: "البقاء داخل المركبة مع حزام الأمان", correct: false },
      { en: "Leave the vehicle safely and wait behind a barrier if possible", ar: "مغادرة المركبة بأمان والانتظار خلف حاجز إن أمكن", correct: true },
      { en: "Try to repair it on the road", ar: "محاولة إصلاحها على الطريق", correct: false },
      { en: "Signal other drivers with your horn", ar: "تحذير السائقين باستخدام البوق", correct: false }
    ],
    keywords: [
      { term: "breakdown", ar: "العطل", explainAr: "عطل في المركبة يمنعها من الاستمرار في السير." },
      { term: "safety", ar: "السلامة", explainAr: "الحفاظ على سلامتك وسلامة الآخرين." },
      { term: "barrier", ar: "الحاجز", explainAr: "حاجز واقي يفصل بين الطريق والمنطقة المحيطة." }
    ]
  },
  {
    id: "MW-5608",
    topic: "motorway-driving",
    promptEn: "When are you allowed to overtake on the left on a motorway?",
    promptAr: "متى يُسمح لك بالتجاوز من اليسار على الطريق السريع؟",
    options: [
      { en: "When traffic in the right-hand lanes is moving slowly in queues", ar: "عندما تكون حركة المرور في المسارات اليمنى تتحرك ببطء في طوابير", correct: true },
      { en: "At any time when you want to go faster", ar: "في أي وقت عندما تريد السير أسرع", correct: false },
      { en: "When the vehicle ahead is indicating right", ar: "عندما تكون المركبة الأمامية تشير يميناً", correct: false },
      { en: "Only on dual carriageways, not motorways", ar: "فقط على الطرق المزدوجة وليس الطرق السريعة", correct: false }
    ],
    keywords: [
      { term: "overtaking on left", ar: "التجاوز من اليسار", explainAr: "تجاوز مركبة من الجانب الأيسر، مسموح فقط في حالات محددة مثل الطوابير البطيئة." },
      { term: "queues", ar: "طوابير", explainAr: "صفوف من المركبات تتحرك ببطء أو متوقفة." },
      { term: "lane discipline", ar: "انضباط المسار", explainAr: "استخدام المسار الصحيح وفقًا للقواعد المرورية." }
    ]
  },
  {
    id: "MW-5609",
    topic: "motorway-driving",
    promptEn: "When approaching roadworks or congestion on a motorway that requires lane merging, what should you do?",
    promptAr: "عند الاقتراب من أعمال طرق أو ازدحام على الطريق السريع يتطلب دمج المسارات، ماذا يجب أن تفعل؟",
    options: [
      { en: "Merge in turn early and maintain a safe speed", ar: "الدمج بالتناوب مبكراً والحفاظ على سرعة آمنة", correct: true },
      { en: "Speed up to get ahead before the merge point", ar: "التسارع للتفوق قبل نقطة الدمج", correct: false },
      { en: "Stop and wait for a large gap", ar: "التوقف والانتظار لفجوة كبيرة", correct: false },
      { en: "Use the hard shoulder to bypass the congestion", ar: "استخدام كتف الطريق لتجاوز الازدحام", correct: false }
    ],
    keywords: [
      { term: "lane merging", ar: "دمج المسارات", explainAr: "عملية دمج مسارين أو أكثر في مسار واحد بسبب أعمال طرق أو ازدحام." },
      { term: "merge in turn", ar: "الدمج بالتناوب", explainAr: "ممارسة السماح للمركبات بالاندماج بالتناوب بدلاً من محاولة منعها." },
      { term: "roadworks", ar: "أعمال الطرق", explainAr: "أعمال صيانة أو بناء على الطريق تتطلب توخي الحذر." }
    ]
  },
  {
    id: "MW-5610",
    topic: "motorway-driving",
    promptEn: "What should you do if traffic ahead slows suddenly on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا تباطأت حركة المرور فجأة أمامك على الطريق السريع؟",
    options: [
      { en: "Brake sharply", ar: "الكبح بقوة", correct: false },
      { en: "Switch on hazard warning lights briefly", ar: "تشغيل أضواء التحذير لفترة قصيرة", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Change lanes immediately", ar: "تغيير المسار فورًا", correct: false }
    ],
    keywords: [
      { term: "sudden slowdown", ar: "التباطؤ المفاجئ", explainAr: "انخفاض مفاجئ في سرعة حركة المرور." },
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "أضواء تحذيرية تنبه السائقين خلفك إلى خطر أو تباطؤ." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق سريع متعدد المسارات للقيادة بسرعات عالية." }
    ]
  },
  {
    id: "MW-5611",
    topic: "motorway-driving",
    promptEn: "Why should you check your mirrors frequently on a motorway?",
    promptAr: "لماذا يجب فحص المرايا بشكل متكرر على الطريق السريع؟",
    options: [
      { en: "Because traffic is slow", ar: "لأن المرور بطيء", correct: false },
      { en: "Because vehicles approach quickly from behind", ar: "لأن المركبات تقترب بسرعة من الخلف", correct: true },
      { en: "Because lanes are narrow", ar: "لأن المسارات ضيقة", correct: false },
      { en: "Because signs are unclear", ar: "لأن الإشارات غير واضحة", correct: false }
    ],
    keywords: [
      { term: "mirrors", ar: "المرايا", explainAr: "تساعدك على رؤية المركبات خلفك وعلى الجانبين." },
      { term: "high speed", ar: "السرعة العالية", explainAr: "القيادة بسرعات أعلى من الطرق العادية." },
      { term: "awareness", ar: "الوعي", explainAr: "الانتباه لما يحدث حولك أثناء القيادة." }
    ]
  },
  {
    id: "MW-5612",
    topic: "motorway-driving",
    promptEn: "Why is reversing on a motorway dangerous?",
    promptAr: "لماذا يعتبر الرجوع للخلف على الطريق السريع خطيرًا؟",
    options: [
      { en: "It confuses navigation systems", ar: "يربك أنظمة الملاحة", correct: false },
      { en: "Traffic approaches at high speed", ar: "المركبات تقترب بسرعات عالية", correct: true },
      { en: "It damages tyres", ar: "يتلف الإطارات", correct: false },
      { en: "It uses more fuel", ar: "يستهلك وقودًا أكثر", correct: false }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة المركبة في الاتجاه المعاكس." },
      { term: "danger", ar: "الخطر", explainAr: "موقف خطير يهدد السلامة." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق سريع متعدد المسارات للقيادة بسرعات عالية." }
    ]
  },
  {
    id: "MW-5613",
    topic: "motorway-driving",
    promptEn: "When overtaking on a motorway, what should you do after passing?",
    promptAr: "عند التجاوز على الطريق السريع، ماذا يجب أن تفعل بعد تجاوز المركبة؟",
    options: [
      { en: "Move back left when safe", ar: "العودة للمسار الأيسر عند الأمان", correct: true },
      { en: "Stay in the right lane", ar: "البقاء في المسار الأيمن", correct: false },
      { en: "Slow down immediately", ar: "التباطؤ فورًا", correct: false },
      { en: "Use hazard lights", ar: "استخدام أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "تجاوز مركبة أخرى من المسار الأيمن." },
      { term: "lane discipline", ar: "انضباط المسارات", explainAr: "استخدام المسارات بشكل صحيح وفق القواعد المرورية." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق سريع متعدد المسارات للقيادة بسرعات عالية." }
    ]
  },

  {
    id: "MW-5626",
    topic: "motorway-driving",
    promptEn: "When should you move into the left-hand lane after overtaking on a motorway?",
    promptAr: "متى يجب أن تعود إلى المسار الأيسر بعد تجاوز مركبة على الطريق السريع؟",
    options: [
      { en: "Immediately, even if it's not safe", ar: "فورًا حتى لو لم يكن ذلك آمنًا", correct: false },
      { en: "When you can see the overtaken vehicle safely in your mirrors", ar: "عندما ترى المركبة التي تجاوزتها بأمان في المرايا", correct: true },
      { en: "Only when traffic becomes heavy", ar: "فقط عند ازدحام المرور", correct: false },
      { en: "Only at the next exit", ar: "فقط عند المخرج التالي", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "تجاوز مركبة أخرى من المسار الأيمن." },
      { term: "lane discipline", ar: "انضباط المسارات", explainAr: "استخدام المسارات بشكل صحيح وفق القواعد المرورية." },
      { term: "mirrors", ar: "المرايا", explainAr: "المرايا الجانبية والخلفية التي تساعدك على رؤية المركبات خلفك وعلى الجانبين." }
    ]
  },

  {
    id: "MW-5627",
    topic: "motorway-driving",
    promptEn: "When driving on a motorway in heavy rain with spray from other vehicles, how should you adjust your following distance?",
    promptAr: "عند القيادة على الطريق السريع في أمطار غزيرة مع رذاذ من المركبات الأخرى، كيف يجب أن تعدّل مسافة التتبّع؟",
    options: [
      { en: "Increase your following distance significantly", ar: "زيادة مسافة التتبّع بشكل كبير", correct: true },
      { en: "Reduce your following distance to avoid spray", ar: "تقليل مسافة التتبّع لتجنب الرذاذ", correct: false },
      { en: "Maintain the same distance as in dry conditions", ar: "الحفاظ على نفس المسافة كما في الظروف الجافة", correct: false },
      { en: "Drive alongside other vehicles to share the spray", ar: "القيادة بجانب المركبات الأخرى لمشاركة الرذاذ", correct: false }
    ],
    keywords: [
      { term: "spray", ar: "الرذاذ", explainAr: "رذاذ الماء الذي تثيره المركبات على الطريق المبتل، مما يقلل الرؤية بشكل كبير." },
      { term: "following distance", ar: "مسافة التتبّع", explainAr: "المسافة الآمنة بين مركبتك والمركبة أمامك." },
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "هطول مطر شديد يقلل من الرؤية والالتصاق بالطريق." }
    ]
  },

  {
    id: "MW-5628",
    topic: "motorway-driving",
    promptEn: "Why should you avoid staying in the middle lane when the left lane is clear?",
    promptAr: "لماذا يجب تجنب البقاء في المسار الأوسط عندما يكون المسار الأيسر خاليًا؟",
    options: [
      { en: "It saves fuel", ar: "يوفر الوقود", correct: false },
      { en: "It can obstruct traffic and encourage risky overtakes", ar: "قد يعيق المرور ويشجع على تجاوزات خطرة", correct: true },
      { en: "It improves visibility", ar: "يحسن الرؤية", correct: false },
      { en: "It is required by law", ar: "مطلوب قانونيًا", correct: false }
    ],
    keywords: [
      { term: "middle lane", ar: "المسار الأوسط", explainAr: "المسار الأوسط في الطريق السريع، يجب استخدامه فقط عند التجاوز." },
      { term: "lane discipline", ar: "انضباط المسارات", explainAr: "استخدام المسارات بشكل صحيح وفق القواعد المرورية." },
      { term: "traffic flow", ar: "تدفق المرور", explainAr: "حركة المرور السلسة والمنظمة على الطريق." }
    ]
  },

  {
    id: "MW-5629",
    topic: "motorway-driving",
    promptEn: "What should you do if you see an emergency vehicle approaching behind on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا اقتربت مركبة طوارئ من خلفك على الطريق السريع؟",
    options: [
      { en: "Stop in your lane", ar: "التوقف داخل المسار", correct: false },
      { en: "Make space by moving left if safe and continue calmly", ar: "إفساح المجال بالتحرك يسارًا إن كان آمنًا والمتابعة بهدوء", correct: true },
      { en: "Speed up to get away", ar: "زيادة السرعة للابتعاد", correct: false },
      { en: "Use hazard lights continuously", ar: "تشغيل أضواء التحذير باستمرار", correct: false }
    ],
    keywords: [
      { term: "emergency vehicles", ar: "مركبات الطوارئ", explainAr: "السيارات الإسعافية ومركبات الإطفاء والشرطة التي تحتاج إلى المرور بسرعة." },
      { term: "motorway", ar: "الطريق السريع", explainAr: "طريق سريع متعدد المسارات للقيادة بسرعات عالية." },
      { term: "making space", ar: "إفساح المجال", explainAr: "التحرك جانبًا لإفساح الطريق لمركبات الطوارئ." }
    ]
  },

  {
    id: "MW-5630",
    topic: "motorway-driving",
    promptEn: "What is the safest way to rejoin the motorway after stopping on the hard shoulder due to an emergency?",
    promptAr: "ما الطريقة الأكثر أمانًا للعودة إلى الطريق السريع بعد التوقف على الكتف بسبب طارئ؟",
    options: [
      { en: "Pull out immediately at low speed", ar: "الخروج فورًا بسرعة منخفضة", correct: false },
      { en: "Build up speed on the hard shoulder and merge when a safe gap appears", ar: "زيادة السرعة على الكتف والاندماج عند توفر فجوة آمنة", correct: true },
      { en: "Wait for another driver to flash you in", ar: "انتظار أن يفسح لك سائق آخر بالإشارة", correct: false },
      { en: "Reverse to a better position", ar: "الرجوع للخلف لمكان أفضل", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "الكتف الجانبي", explainAr: "يُستخدم فقط لحالات الطوارئ ولا يُستخدم للوقوف العادي." },
      { term: "rejoin traffic", ar: "العودة للمرور", explainAr: "الاندماج مرة أخرى في حركة المرور بعد التوقف." },
      { term: "safe gap", ar: "فجوة آمنة", explainAr: "مسافة كافية بين المركبات للاندماج بأمان." }
    ]
  },

  {
    id: "MW-5631",
    topic: "motorway-driving",
    promptEn: "On a smart motorway, what should you do if you break down and cannot reach a refuge area?",
    promptAr: "على طريق سريع ذكي، ماذا تفعل إذا تعطلت ولم تستطع الوصول لمنطقة توقف آمنة؟",
    options: [
      { en: "Leave the vehicle and cross the carriageway", ar: "مغادرة المركبة وعبور الطريق", correct: false },
      { en: "Switch on hazard lights and call for help as soon as possible", ar: "تشغيل أضواء التحذير وطلب المساعدة بأسرع وقت", correct: true },
      { en: "Turn off all lights to save battery", ar: "إطفاء الأضواء لتوفير البطارية", correct: false },
      { en: "Place a warning triangle behind the car", ar: "وضع مثلث تحذير خلف السيارة", correct: false }
    ],
    keywords: [
      { term: "smart motorway", ar: "طريق سريع ذكي", explainAr: "يستخدم شاشات إلكترونية لإدارة السرعات والمسارات." },
      { term: "breakdown", ar: "تعطل المركبة", explainAr: "عطل في المركبة يمنعها من الاستمرار في القيادة." },
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "الأضواء الوامضة التي تشير إلى وجود خطر أو مشكلة." }
    ]
  },

  {
    id: "MW-5632",
    topic: "motorway-driving",
    promptEn: "What does a variable speed limit on a motorway require you to do?",
    promptAr: "ماذا يتطلب منك حد السرعة المتغير على الطريق السريع؟",
    options: [
      { en: "Treat it as a suggestion", ar: "اعتباره اقتراحًا فقط", correct: false },
      { en: "Obey it as the current legal speed limit", ar: "الالتزام به كحد سرعة قانوني حالي", correct: true },
      { en: "Ignore it if traffic is light", ar: "تجاهله إذا كان المرور خفيفًا", correct: false },
      { en: "Follow the speed of the car ahead", ar: "اتباع سرعة السيارة أمامك", correct: false }
    ],
    keywords: [
      { term: "variable speed limit", ar: "حد السرعة المتغير", explainAr: "حد سرعة يتغير حسب ظروف المرور والطقس." },
      { term: "legal", ar: "قانوني", explainAr: "مطابق للقوانين واللوائح المرورية." },
      { term: "motorway signs", ar: "إشارات الطريق السريع", explainAr: "اللوحات الإلكترونية التي تعرض المعلومات والقيود على الطريق السريع." }
    ]
  },

  {
    id: "MW-5633",
    topic: "motorway-driving",
    promptEn: "Why should you check your speed when leaving a motorway?",
    promptAr: "لماذا يجب أن تتحقق من سرعتك عند مغادرة الطريق السريع؟",
    options: [
      { en: "Because speed limits increase off the motorway", ar: "لأن حدود السرعة تزيد خارج الطريق السريع", correct: false },
      { en: "Because your sense of speed may be inaccurate after fast driving", ar: "لأن إحساسك بالسرعة قد يكون غير دقيق بعد القيادة السريعة", correct: true },
      { en: "Because brakes work differently", ar: "لأن المكابح تعمل بشكل مختلف", correct: false },
      { en: "Because steering becomes heavier", ar: "لأن المقود يصبح أثقل", correct: false }
    ],
    keywords: [
      { term: "leaving motorway", ar: "مغادرة الطريق السريع", explainAr: "الخروج من الطريق السريع إلى طريق عادي." },
      { term: "speed perception", ar: "إدراك السرعة", explainAr: "القدرة على تقدير السرعة بدقة." },
      { term: "speedometer", ar: "عداد السرعة", explainAr: "أداة في السيارة تعرض السرعة الحالية." }
    ]
  },

  {
    id: "MW-5634",
    topic: "motorway-driving",
    promptEn: "What should you do if you see debris on the motorway ahead?",
    promptAr: "ماذا يجب أن تفعل إذا رأيت حطامًا على الطريق السريع أمامك؟",
    options: [
      { en: "Stop and remove it yourself", ar: "التوقف وإزالته بنفسك", correct: false },
      { en: "Keep a safe distance, avoid sudden moves, and report it when safe", ar: "ترك مسافة أمان وتجنب الحركات المفاجئة والإبلاغ عنه عند الأمان", correct: true },
      { en: "Swerve sharply at the last second", ar: "الانحراف بقوة في آخر لحظة", correct: false },
      { en: "Use full beam lights to warn others", ar: "استخدام الضوء العالي للتحذير", correct: false }
    ],
    keywords: [
      { term: "debris", ar: "الحطام", explainAr: "أشياء ملقاة على الطريق قد تشكل خطرًا." },
      { term: "hazard", ar: "خطر", explainAr: "شيء على الطريق قد يسبب حادثًا أو مشكلة." },
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "إجراءات السلامة المطلوبة عند القيادة على الطرق السريعة." }
    ]
  },

  {
    id: "MW-5635",
    topic: "motorway-driving",
    promptEn: "When joining a motorway, who has priority?",
    promptAr: "عند الانضمام للطريق السريع، من له أولوية المرور؟",
    options: [
      { en: "Traffic on the slip road", ar: "حركة المرور على طريق الاندماج", correct: false },
      { en: "Traffic already on the motorway", ar: "حركة المرور الموجودة على الطريق السريع", correct: true },
      { en: "Heavy vehicles only", ar: "المركبات الثقيلة فقط", correct: false },
      { en: "Vehicles using the middle lane", ar: "مركبات المسار الأوسط", correct: false }
    ],
    keywords: [
      { term: "priority", ar: "أولوية المرور", explainAr: "من له الحق في المرور أولاً عند التقاطعات أو الاندماج." },
      { term: "joining motorway", ar: "الانضمام للطريق السريع", explainAr: "الدخول إلى الطريق السريع من طريق اندماج." },
      { term: "merge", ar: "الاندماج", explainAr: "الانضمام إلى حركة المرور من مسار إلى آخر." }
    ]
  },

  {
    id: "MW-5636",
    topic: "motorway-driving",
    promptEn: "What is the safest approach when a lane is closed ahead and traffic is merging?",
    promptAr: "ما التصرف الأكثر أمانًا عندما يكون مسار مغلقًا أمامك والمرور يندمج؟",
    options: [
      { en: "Speed up to block gaps", ar: "زيادة السرعة لمنع الفجوات", correct: false },
      { en: "Merge early and cooperate with other drivers", ar: "الاندماج مبكرًا والتعاون مع السائقين الآخرين", correct: true },
      { en: "Drive on the hard shoulder to pass", ar: "القيادة على الكتف لتجاوز الطابور", correct: false },
      { en: "Stop and wait in your lane", ar: "التوقف والانتظار داخل المسار", correct: false }
    ],
    keywords: [
      { term: "lane closure", ar: "إغلاق المسار", explainAr: "إغلاق مسار مؤقتًا بسبب أعمال صيانة أو حادث." },
      { term: "merging", ar: "الاندماج", explainAr: "الانضمام إلى حركة المرور من مسار إلى آخر." },
      { term: "cooperation", ar: "التعاون", explainAr: "العمل مع السائقين الآخرين لضمان تدفق المرور بسلاسة." }
    ]
  },

  {
    id: "MW-5637",
    topic: "motorway-driving",
    promptEn: "Why is it unsafe to follow closely behind a large vehicle on a motorway?",
    promptAr: "لماذا يعتبر اتباع مركبة كبيرة عن قرب على الطريق السريع غير آمن؟",
    options: [
      { en: "It increases engine noise", ar: "يزيد ضوضاء المحرك", correct: false },
      { en: "It reduces your view and reaction time", ar: "يقلل الرؤية ووقت الاستجابة", correct: true },
      { en: "It improves fuel efficiency", ar: "يحسن اقتصاد الوقود", correct: false },
      { en: "It makes overtaking easier", ar: "يجعل التجاوز أسهل", correct: false }
    ],
    keywords: [
      { term: "large vehicle", ar: "مركبة كبيرة", explainAr: "شاحنة أو حافلة أو مركبة ثقيلة أخرى." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية ما أمامك وما حولك بوضوح." },
      { term: "reaction time", ar: "وقت الاستجابة", explainAr: "الوقت الذي يستغرقه السائق للرد على موقف طارئ." }
    ]
  },

  {
    id: "MW-5638",
    topic: "motorway-driving",
    promptEn: "What should you do if you need to stop due to an emergency on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا اضطررت للتوقف بسبب طارئ على الطريق السريع؟",
    options: [
      { en: "Stop in the left lane", ar: "التوقف في المسار الأيسر", correct: false },
      { en: "Use the hard shoulder or a safe place if available", ar: "استخدام كتف الطريق أو مكان آمن إن توفر", correct: true },
      { en: "Stop on the slip road entrance", ar: "التوقف عند مدخل طريق الاندماج", correct: false },
      { en: "Stop near a bend for visibility", ar: "التوقف قرب منعطف لزيادة الرؤية", correct: false }
    ],
    keywords: [
      { term: "emergency stop", ar: "توقف طارئ", explainAr: "التوقف المفاجئ بسبب مشكلة أو خطر." },
      { term: "hard shoulder", ar: "الكتف الجانبي", explainAr: "يُستخدم فقط لحالات الطوارئ ولا يُستخدم للوقوف العادي." },
      { term: "safe place", ar: "مكان آمن", explainAr: "موقع آمن للتوقف بعيدًا عن حركة المرور." }
    ]
  },

  {
    id: "MW-5639",
    topic: "motorway-driving",
    promptEn: "Why should you avoid unnecessary lane changes on a motorway?",
    promptAr: "لماذا يجب تجنب تغييرات المسار غير الضرورية على الطريق السريع؟",
    options: [
      { en: "They reduce fuel use", ar: "تقلل استهلاك الوقود", correct: false },
      { en: "They increase risk and disrupt traffic flow", ar: "تزيد الخطر وتربك حركة المرور", correct: true },
      { en: "They are required to stay alert", ar: "مطلوبة للبقاء متيقظًا", correct: false },
      { en: "They improve visibility", ar: "تحسن الرؤية", correct: false }
    ],
    keywords: [
      { term: "lane changes", ar: "تغييرات المسار", explainAr: "الانتقال من مسار إلى آخر." },
      { term: "risk", ar: "الخطر", explainAr: "احتمالية حدوث حادث أو مشكلة." },
      { term: "traffic flow", ar: "تدفق المرور", explainAr: "حركة المرور السلسة والمنظمة على الطريق." }
    ]
  },

  {
    id: "MW-5640",
    topic: "motorway-driving",
    promptEn: "What should you do if you see a sign directing you to a different lane due to an incident ahead?",
    promptAr: "ماذا يجب أن تفعل إذا رأيت إشارة تطلب منك الانتقال لمسار آخر بسبب حادث أمامك؟",
    options: [
      { en: "Ignore it if your lane seems clear", ar: "تجاهلها إذا بدا مسارك خاليًا", correct: false },
      { en: "Move as directed when it is safe to do so", ar: "الانتقال كما هو مطلوب عندما يكون ذلك آمنًا", correct: true },
      { en: "Stop and wait for instructions", ar: "التوقف وانتظار التعليمات", correct: false },
      { en: "Use hazard lights and continue in your lane", ar: "تشغيل التحذير والمتابعة في مسارك", correct: false }
    ],
    keywords: [
      { term: "lane directions", ar: "توجيهات المسار", explainAr: "الإشارات التي توجهك للانتقال إلى مسار معين." },
      { term: "incident ahead", ar: "حادث أمامك", explainAr: "حادث مروري أو مشكلة على الطريق أمامك." },
      { term: "signals", ar: "الإشارات", explainAr: "اللوحات والعلامات التي تعطي تعليمات للسائقين." }
    ]
  },

  {
    id: "SM-5702",
    topic: "safety-margins",
    promptEn: "When should you increase your following distance to at least four seconds?",
    promptAr: "متى يجب زيادة مسافة المتابعة إلى أربع ثوانٍ على الأقل؟",
    options: [
      { en: "In bright daylight", ar: "في وضح النهار", correct: false },
      { en: "In wet weather conditions", ar: "في ظروف الطقس الماطر", correct: true },
      { en: "On quiet roads", ar: "على الطرق الهادئة", correct: false },
      { en: "When driving slowly", ar: "عند القيادة ببطء", correct: false }
    ],
    keywords: [
      { term: "four-second rule", ar: "قاعدة الأربع ثوانٍ", explainAr: "قاعدة السلامة التي تنص على ترك مسافة زمنية لا تقل عن أربع ثوانٍ في الظروف الصعبة." },
      { term: "wet road", ar: "طريق مبلل", explainAr: "طريق مبلل بالمطر مما يقلل من تماسك الإطارات ويزيد مسافة التوقف." },
      { term: "weather", ar: "الطقس", explainAr: "الظروف الجوية التي تؤثر على ظروف القيادة والسلامة." }
    ]
  },
  {
    id: "SM-5705",
    topic: "safety-margins",
    promptEn: "Why is tailgating especially dangerous at high speeds?",
    promptAr: "لماذا تعتبر القيادة الملاصقة خطيرة بشكل خاص عند السرعات العالية؟",
    options: [
      { en: "Fuel consumption increases", ar: "يزداد استهلاك الوقود", correct: false },
      { en: "There is less time to react and stop", ar: "يقل الوقت المتاح للاستجابة والتوقف", correct: true },
      { en: "Steering becomes lighter", ar: "يصبح التوجيه أخف", correct: false },
      { en: "Brakes work better", ar: "تعمل المكابح بشكل أفضل", correct: false }
    ],
    keywords: [
      { term: "tailgating", ar: "القيادة الملاصقة", explainAr: "القيادة قريبًا جدًا من المركبة التي أمامك، مما يقلل من وقت الاستجابة." },
      { term: "high speed", ar: "السرعة العالية", explainAr: "القيادة بسرعات أعلى من المعتاد، مما يزيد من مسافة التوقف." },
      { term: "reaction time", ar: "وقت الاستجابة", explainAr: "الوقت الذي يستغرقه السائق للاستجابة لخطر مفاجئ." }
    ]
  },
  {
    id: "SM-5706",
    topic: "safety-margins",
    promptEn: "What should you do if another driver pulls into the safe gap you have left?",
    promptAr: "ماذا يجب أن تفعل إذا دخل سائق آخر في مسافة الأمان التي تركتها؟",
    options: [
      { en: "Flash your headlights", ar: "وميض الأضواء", correct: false },
      { en: "Drop back to re-establish a safe gap", ar: "التراجع لإعادة إنشاء مسافة أمان", correct: true },
      { en: "Maintain your speed", ar: "الحفاظ على السرعة", correct: false },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "safe gap", ar: "مسافة أمان", explainAr: "المسافة الكافية بينك وبين المركبة التي أمامك للسماح بالاستجابة الآمنة." },
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة التي يجب الحفاظ عليها بينك وبين المركبة التي أمامك." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالصبر وعدم الانفعال عند القيادة." }
    ]
  },
  {
    id: "SM-5707",
    topic: "safety-margins",
    promptEn: "Why should you leave extra space when driving behind a motorcycle?",
    promptAr: "لماذا يجب ترك مسافة إضافية عند القيادة خلف دراجة نارية؟",
    options: [
      { en: "Motorcycles are always slow", ar: "الدراجات النارية بطيئة دائمًا", correct: false },
      { en: "They can stop or swerve suddenly", ar: "قد تتوقف أو تنحرف فجأة", correct: true },
      { en: "They use different lanes", ar: "تستخدم مسارات مختلفة", correct: false },
      { en: "They have bright lights", ar: "لديها أضواء قوية", correct: false }
    ],
    keywords: [
      { term: "motorcycles", ar: "الدراجات النارية", explainAr: "مركبات ذات عجلتين أصغر من السيارات وأكثر عرضة للتأثر بالظروف." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا من لحظة اكتشاف الخطر." },
      { term: "sudden movement", ar: "الحركة المفاجئة", explainAr: "تغيير مفاجئ في الاتجاه أو السرعة قد يكون خطيرًا." }
    ]
  },
  {
    id: "SM-5708",
    topic: "safety-margins",
    promptEn: "How does ice affect your safety margins?",
    promptAr: "كيف يؤثر الجليد على مسافات الأمان؟",
    options: [
      { en: "It shortens stopping distances", ar: "يقصر مسافة التوقف", correct: false },
      { en: "It has little effect at low speeds", ar: "تأثيره محدود عند السرعات المنخفضة", correct: false },
      { en: "It greatly increases stopping distances", ar: "يزيد مسافة التوقف بشكل كبير", correct: true },
      { en: "It improves tyre grip", ar: "يحسن تماسك الإطارات", correct: false }
    ],
    keywords: [
      { term: "ice", ar: "الجليد", explainAr: "طبقة من الجليد على الطريق تقلل بشكل كبير من تماسك الإطارات." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا من لحظة اكتشاف الخطر." },
      { term: "low grip", ar: "انخفاض التماسك", explainAr: "انخفاض قدرة الإطارات على التمسك بسطح الطريق." }
    ]
  },
  {
    id: "SM-5709",
    topic: "safety-margins",
    promptEn: "Why should you increase your following distance when towing a trailer?",
    promptAr: "لماذا يجب زيادة مسافة المتابعة عند سحب مقطورة؟",
    options: [
      { en: "The engine becomes quieter", ar: "يصبح المحرك أكثر هدوءًا", correct: false },
      { en: "Stopping distances are longer", ar: "مسافة التوقف تكون أطول", correct: true },
      { en: "Steering becomes lighter", ar: "يصبح التوجيه أخف", correct: false },
      { en: "Fuel use decreases", ar: "ينخفض استهلاك الوقود", correct: false }
    ],
    keywords: [
      { term: "trailer", ar: "المقطورة", explainAr: "مركبة يتم سحبها خلف المركبة الرئيسية." },
      { term: "towing", ar: "السحب", explainAr: "عملية سحب مركبة أو مقطورة خلف المركبة." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا من لحظة اكتشاف الخطر." }
    ]
  },
  {
    id: "SM-5711",
    topic: "safety-margins",
    promptEn: "Why should you leave a larger following distance at night?",
    promptAr: "لماذا يجب ترك مسافة متابعة أكبر أثناء القيادة ليلاً؟",
    options: [
      { en: "Because roads are quieter", ar: "لأن الطرق تكون أهدأ", correct: false },
      { en: "Because visibility is reduced", ar: "لأن الرؤية تكون أقل", correct: true },
      { en: "Because speed limits change", ar: "لأن حدود السرعة تتغير", correct: false },
      { en: "Because headlights are brighter", ar: "لأن الأضواء أقوى", correct: false }
    ],
    keywords: [
      { term: "night driving", ar: "القيادة الليلية", explainAr: "القيادة أثناء الليل عندما تكون الرؤية محدودة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الطريق والمركبات الأخرى بوضوح." },
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها بينك وبين المركبة التي أمامك." }
    ]
  },
  {
    id: "SM-5712",
    topic: "safety-margins",
    promptEn: "How should snow affect the distance you keep from the vehicle ahead?",
    promptAr: "كيف يجب أن يؤثر الثلج على المسافة التي تتركها بينك وبين المركبة أمامك؟",
    options: [
      { en: "No change is needed", ar: "لا حاجة للتغيير", correct: false },
      { en: "Reduce the distance", ar: "تقليل المسافة", correct: false },
      { en: "Increase the distance significantly", ar: "زيادة المسافة بشكل كبير", correct: true },
      { en: "Follow closely to see better", ar: "المتابعة عن قرب لرؤية أفضل", correct: false }
    ],
    keywords: [
      { term: "snow", ar: "الثلج", explainAr: "ظروف الطقس التي تؤثر على سطح الطريق وتقلل من الجر." },
      { term: "low grip", ar: "قلة الجر", explainAr: "انخفاض قوة الالتصاق بين الإطارات والطريق مما يزيد من مسافة التوقف." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا من لحظة اكتشاف الخطر." }
    ]
  },
  {
    id: "SM-5713",
    topic: "safety-margins",
    promptEn: "Why should you keep extra distance when following a heavy goods vehicle?",
    promptAr: "لماذا يجب الحفاظ على مسافة إضافية عند متابعة مركبة نقل ثقيلة؟",
    options: [
      { en: "They accelerate quickly", ar: "تتسارع بسرعة", correct: false },
      { en: "They block your view of the road ahead", ar: "تحجب رؤيتك للطريق أمامك", correct: true },
      { en: "They use hazard lights", ar: "تستخدم أضواء التحذير", correct: false },
      { en: "They always drive slowly", ar: "تقود دائمًا ببطء", correct: false }
    ],
    keywords: [
      { term: "HGV", ar: "مركبة نقل ثقيلة", explainAr: "مركبة كبيرة تستخدم لنقل البضائع الثقيلة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الطريق والمركبات الأخرى بوضوح." },
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة الآمنة التي يجب الحفاظ عليها بينك وبين المركبة التي أمامك." }
    ]
  },
  {
    id: "SM-5714",
    topic: "safety-margins",
    promptEn: "What should you do if visibility suddenly becomes poor due to heavy rain?",
    promptAr: "ماذا يجب أن تفعل إذا أصبحت الرؤية ضعيفة فجأة بسبب أمطار غزيرة؟",
    options: [
      { en: "Maintain your speed", ar: "الحفاظ على السرعة", correct: false },
      { en: "Slow down and increase your following distance", ar: "التخفيف وزيادة مسافة المتابعة", correct: true },
      { en: "Drive closer to the vehicle ahead", ar: "القيادة أقرب للمركبة الأمامية", correct: false },
      { en: "Use the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "heavy rain", ar: "أمطار غزيرة", explainAr: "ظروف طقس صعبة تقلل من الرؤية والجر." },
      { term: "poor visibility", ar: "رؤية ضعيفة", explainAr: "عدم القدرة على رؤية الطريق بوضوح بسبب الظروف الجوية." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية التي تسمح لك بالتفاعل بأمان مع أي خطر محتمل." }
    ]
  },
  {
    id: "SM-5716",
    topic: "safety-margins",
    promptEn: "How should you react if the vehicle in front brakes suddenly?",
    promptAr: "كيف يجب أن تتصرف إذا قامت المركبة أمامك بالكبح فجأة؟",
    options: [
      { en: "Swerve immediately", ar: "الانحراف فورًا", correct: false },
      { en: "Brake smoothly while keeping control", ar: "الكبح بسلاسة مع الحفاظ على السيطرة", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Accelerate to pass", ar: "التسارع للتجاوز", correct: false }
    ],
    keywords: [
      { term: "sudden braking", ar: "الكبح المفاجئ", explainAr: "تطبيق المكابح بشكل مفاجئ دون تحذير مسبق." },
      { term: "reaction", ar: "الاستجابة", explainAr: "كيفية التصرف عند مواجهة موقف مفاجئ على الطريق." },
      { term: "control", ar: "السيطرة", explainAr: "القدرة على التحكم في المركبة بشكل آمن." }
    ]
  },
  {
    id: "SM-5717",
    topic: "safety-margins",
    promptEn: "Why should you avoid driving too close in slow-moving traffic?",
    promptAr: "لماذا يجب تجنب القيادة عن قرب في حركة المرور البطيئة؟",
    options: [
      { en: "It saves time", ar: "يوفر الوقت", correct: false },
      { en: "It reduces reaction time if traffic stops", ar: "يقلل وقت الاستجابة إذا توقف المرور", correct: true },
      { en: "It improves fuel economy", ar: "يحسن اقتصاد الوقود", correct: false },
      { en: "It helps you see traffic lights", ar: "يساعد على رؤية الإشارات", correct: false }
    ],
    keywords: [
      { term: "slow traffic", ar: "حركة المرور البطيئة", explainAr: "القيادة في ظروف مرورية مزدحمة حيث تكون السرعة منخفضة." },
      { term: "reaction time", ar: "وقت الاستجابة", explainAr: "الوقت الذي تحتاجه للتفاعل مع موقف مفاجئ على الطريق." },
      { term: "safe gap", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة التي أمامك للتفاعل بأمان." }
    ]
  },
  {
    id: "SM-5718",
    topic: "safety-margins",
    promptEn: "How does carrying a heavy load affect your safety margins?",
    promptAr: "كيف تؤثر الحمولة الثقيلة على مسافات الأمان؟",
    options: [
      { en: "It shortens stopping distance", ar: "تقصّر مسافة التوقف", correct: false },
      { en: "It increases stopping distance", ar: "تزيد مسافة التوقف", correct: true },
      { en: "It improves handling", ar: "تحسن التحكم", correct: false },
      { en: "It has no effect", ar: "ليس لها تأثير", correct: false }
    ],
    keywords: [
      { term: "heavy load", ar: "حمولة ثقيلة", explainAr: "وزن إضافي تحمله المركبة يؤثر على أدائها." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة التي تحتاجها المركبة للتوقف تمامًا من لحظة اكتشاف الخطر." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على التحكم في المركبة بشكل آمن." }
    ]
  },
  {
    id: "SM-5719",
    topic: "safety-margins",
    promptEn: "What is the safest action if road conditions suddenly worsen?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا ساءت ظروف الطريق فجأة؟",
    options: [
      { en: "Maintain speed to clear the area", ar: "الحفاظ على السرعة لتجاوز المنطقة", correct: false },
      { en: "Reduce speed and increase safety margins", ar: "تخفيف السرعة وزيادة مسافات الأمان", correct: true },
      { en: "Follow other vehicles closely", ar: "متابعة المركبات الأخرى عن قرب", correct: false },
      { en: "Stop immediately", ar: "التوقف فورًا", correct: false }
    ],
    keywords: [
      { term: "road conditions", ar: "ظروف الطريق", explainAr: "حالة سطح الطريق والظروف الجوية التي تؤثر على القيادة." },
      { term: "weather change", ar: "تغير الطقس", explainAr: "التغيرات المفاجئة في الظروف الجوية التي تؤثر على القيادة." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على السلامة أثناء القيادة من خلال اتخاذ الإجراءات المناسبة." }
    ]
  },
  {
    id: "SM-5720",
    topic: "safety-margins",
    promptEn: "Why is using a time gap more reliable than judging distance by eye?",
    promptAr: "لماذا تعتبر طريقة المسافة الزمنية أكثر موثوقية من تقدير المسافة بالنظر؟",
    options: [
      { en: "Because it is quicker", ar: "لأنها أسرع", correct: false },
      { en: "Because it adjusts automatically for speed", ar: "لأنها تتكيف تلقائيًا مع السرعة", correct: true },
      { en: "Because it uses road markings", ar: "لأنها تعتمد على علامات الطريق", correct: false },
      { en: "Because it reduces fuel use", ar: "لأنها تقلل استهلاك الوقود", correct: false }
    ],
    keywords: [
      { term: "time gap", ar: "المسافة الزمنية", explainAr: "الفترة بين مرور السيارة التي أمامك بنقطة معينة ومرورك أنت بنفس النقطة." },
      { term: "speed", ar: "السرعة", explainAr: "المعدل الذي تتحرك به المركبة على الطريق." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية التي تسمح لك بالتفاعل بأمان مع أي خطر محتمل." }
    ]
  },

  // --- INCIDENTS (Additional) ---

  {
    id: "IN-17",
    topic: "incidents",
    promptEn: "What should you do if someone is bleeding heavily after an accident?",
    promptAr: "ماذا يجب أن تفعل إذا كان أحد المصابين ينزف بشدة بعد حادث؟",
    options: [
      { en: "Apply firm pressure to the wound", ar: "الضغط بقوة على الجرح", correct: true },
      { en: "Give them a warm drink", ar: "إعطاؤه شراباً دافئاً", correct: false },
      { en: "Remove any objects from the wound", ar: "إزالة أي أجسام من الجرح", correct: false },
      { en: "Ask them to stand up", ar: "مطالبته بالوقوف", correct: false }
    ],
    keywords: [
      { term: "heavy bleeding", ar: "نزيف شديد", explainAr: "خروج الدم بكمية كبيرة من الجرح." },
      { term: "first aid", ar: "الإسعافات الأولية", explainAr: "المساعدة الطبية الفورية المقدمة قبل وصول الطوارئ." }
    ]
  },

  {
    id: "IN-18",
    topic: "incidents",
    promptEn: "What should you do if a casualty is unconscious but breathing?",
    promptAr: "ماذا يجب أن تفعل إذا كان المصاب فاقداً للوعي لكنه يتنفس؟",
    options: [
      { en: "Place them in the recovery position", ar: "وضعه في وضعية الإفاقة", correct: true },
      { en: "Give them food", ar: "إعطاؤه طعاماً", correct: false },
      { en: "Sit them upright", ar: "إجلاؤه للجلوس", correct: false },
      { en: "Remove their helmet immediately", ar: "إزالة الخوذة فوراً", correct: false }
    ],
    keywords: [
      { term: "unconscious", ar: "فاقد الوعي", explainAr: "الشخص الذي لا يستجيب ولا يدرك ما حوله." },
      { term: "recovery position", ar: "وضعية الإفاقة", explainAr: "وضع آمن للمصاب الفاقد للوعي الذي يتنفس." }
    ]
  },

  {
    id: "IN-19",
    topic: "incidents",
    promptEn: "Why should you avoid smoking near an accident scene?",
    promptAr: "لماذا يجب تجنب التدخين قرب موقع الحادث؟",
    options: [
      { en: "Fuel or fumes may be present", ar: "قد يكون هناك وقود أو أبخرة", correct: true },
      { en: "It distracts drivers", ar: "يشتت السائقين", correct: false },
      { en: "It wastes time", ar: "يضيع الوقت", correct: false },
      { en: "It causes traffic delays", ar: "يسبب تأخير المرور", correct: false }
    ],
    keywords: [
      { term: "fire risk", ar: "خطر الحريق", explainAr: "احتمالية اندلاع حريق بسبب وجود مواد قابلة للاشتعال." },
      { term: "fuel fumes", ar: "أبخرة الوقود", explainAr: "الأبخرة المتصاعدة من الوقود التي قد تكون قابلة للاشتعال." }
    ]
  },

  {
    id: "IN-20",
    topic: "incidents",
    promptEn: "What information should you give when calling emergency services?",
    promptAr: "ما المعلومات التي يجب تقديمها عند الاتصال بخدمات الطوارئ؟",
    options: [
      { en: "Exact location, number of vehicles, and any visible injuries", ar: "الموقع الدقيق وعدد المركبات وأي إصابات مرئية", correct: true },
      { en: "Your driving licence number", ar: "رقم رخصة القيادة", correct: false },
      { en: "Insurance details", ar: "تفاصيل التأمين", correct: false },
      { en: "Vehicle registration only", ar: "رقم المركبة فقط", correct: false }
    ],
    keywords: [
      { term: "emergency call", ar: "مكالمة الطوارئ", explainAr: "الاتصال بخدمات الطوارئ للإبلاغ عن حادث." },
      { term: "location", ar: "الموقع", explainAr: "المكان الدقيق الذي وقع فيه الحادث." }
    ]
  },

  {
    id: "IN-21",
    topic: "incidents",
    promptEn: "Why should you warn approaching traffic after an accident?",
    promptAr: "لماذا يجب تحذير حركة المرور القادمة بعد حادث؟",
    options: [
      { en: "To reduce the risk of further collisions", ar: "لتقليل خطر وقوع حوادث إضافية", correct: true },
      { en: "To avoid congestion", ar: "لتجنب الازدحام", correct: false },
      { en: "To help emergency services arrive faster", ar: "لمساعدة الطوارئ على الوصول أسرع", correct: false },
      { en: "To clear the road quickly", ar: "لتفريغ الطريق بسرعة", correct: false }
    ],
    keywords: [
      { term: "warning traffic", ar: "تحذير المرور", explainAr: "تنبيه السائقين القادمين لوجود حادث على الطريق." },
      { term: "secondary accidents", ar: "حوادث ثانوية", explainAr: "حوادث إضافية قد تحدث بسبب الحادث الأول." }
    ]
  },

  {
    id: "IN-22",
    topic: "incidents",
    promptEn: "What should you do if a vehicle involved in an accident is on fire?",
    promptAr: "ماذا يجب أن تفعل إذا كانت مركبة متورطة في حادث تحترق؟",
    options: [
      { en: "Keep people well away from the vehicle", ar: "إبعاد الناس عن المركبة", correct: true },
      { en: "Try to put out the fire", ar: "محاولة إطفاء الحريق", correct: false },
      { en: "Open the bonnet", ar: "فتح غطاء المحرك", correct: false },
      { en: "Move the vehicle", ar: "تحريك المركبة", correct: false }
    ],
    keywords: [
      { term: "vehicle fire", ar: "حريق المركبة", explainAr: "اندلاع حريق في مركبة متورطة في حادث." },
      { term: "keep away", ar: "الإبعاد", explainAr: "إبقاء الناس على مسافة آمنة من الخطر." }
    ]
  },

  {
    id: "IN-23",
    topic: "incidents",
    promptEn: "Why should you stay calm at the scene of an accident?",
    promptAr: "لماذا يجب عليك البقاء هادئاً في موقع الحادث؟",
    options: [
      { en: "To make clear and safe decisions", ar: "لاتخاذ قرارات واضحة وآمنة", correct: true },
      { en: "To avoid police involvement", ar: "لتجنب تدخل الشرطة", correct: false },
      { en: "To speed up traffic", ar: "لتسريع حركة المرور", correct: false },
      { en: "To leave quickly", ar: "للمغادرة بسرعة", correct: false }
    ],
    keywords: [
      { term: "calm", ar: "الهدوء", explainAr: "البقاء هادئاً ومركزاً في موقف طارئ." },
      { term: "decision making", ar: "اتخاذ القرارات", explainAr: "القدرة على التفكير بوضوح واتخاذ قرارات صحيحة." }
    ]
  },

  {
    id: "IN-24",
    topic: "incidents",
    promptEn: "What should you do if you are involved in a collision that causes damage but no injuries?",
    promptAr: "ماذا يجب أن تفعل إذا كنت متورطاً في تصادم تسبب بأضرار دون إصابات؟",
    options: [
      { en: "Stop and exchange details with the other party", ar: "التوقف وتبادل التفاصيل مع الطرف الآخر", correct: true },
      { en: "Leave the scene immediately", ar: "مغادرة المكان فوراً", correct: false },
      { en: "Call an ambulance", ar: "الاتصال بالإسعاف", correct: false },
      { en: "Move on if traffic is blocked", ar: "المغادرة إذا كان المرور متعطلاً", correct: false }
    ],
    keywords: [
      { term: "collision", ar: "تصادم", explainAr: "حادث تصادم بين مركبتين أو أكثر." },
      { term: "exchange details", ar: "تبادل التفاصيل", explainAr: "تبادل معلومات الاتصال والتأمين مع الطرف الآخر." }
    ]
  },

  {
    id: "IN-25",
    topic: "incidents",
    promptEn: "When must a road accident be reported to the police?",
    promptAr: "متى يجب الإبلاغ عن حادث مروري للشرطة؟",
    options: [
      { en: "If details cannot be exchanged at the scene", ar: "إذا تعذر تبادل التفاصيل في موقع الحادث", correct: true },
      { en: "Always, regardless of damage", ar: "دائماً بغض النظر عن الأضرار", correct: false },
      { en: "Only if emergency services attend", ar: "فقط إذا حضرت خدمات الطوارئ", correct: false },
      { en: "Only when vehicles are towed", ar: "فقط عند سحب المركبات", correct: false }
    ],
    keywords: [
      { term: "police report", ar: "الإبلاغ للشرطة", explainAr: "إبلاغ الشرطة عن الحادث عند الحاجة." },
      { term: "legal duty", ar: "واجب قانوني", explainAr: "المسؤولية القانونية المطلوبة في حالة الحوادث." }
    ]
  },

  {
    id: "IN-26",
    topic: "incidents",
    promptEn: "What should you do if you break down in a live motorway lane?",
    promptAr: "ماذا يجب أن تفعل إذا تعطلت مركبتك في مسار نشط على الطريق السريع؟",
    options: [
      { en: "Get yourself and passengers to a safe place behind the barrier, then call for help", ar: "انتقل أنت والركاب إلى مكان آمن خلف الحاجز، ثم اتصل بالمساعدة", correct: true },
      { en: "Stay in the vehicle", ar: "البقاء داخل المركبة", correct: false },
      { en: "Try to restart the engine repeatedly", ar: "محاولة تشغيل المحرك مراراً", correct: false },
      { en: "Push the vehicle to the hard shoulder", ar: "دفع المركبة إلى كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "motorway breakdown", ar: "تعطل على الطريق السريع", explainAr: "توقف المركبة عن العمل على طريق سريع." },
      { term: "live lane", ar: "مسار نشط", explainAr: "مسار مروري يستخدمه السائقون بنشاط." },
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "الجانب الأيسر على الطرق السريعة." }
    ]
  },

  {
    id: "IN-27",
    topic: "incidents",
    promptEn: "Why should you not give a drink to someone who is injured?",
    promptAr: "لماذا يجب عدم إعطاء المصاب شراباً؟",
    options: [
      { en: "It may cause choking or complicate treatment", ar: "قد يسبب اختناقاً أو يعقّد العلاج", correct: true },
      { en: "It delays emergency services", ar: "يؤخر الطوارئ", correct: false },
      { en: "It has no effect", ar: "ليس له تأثير", correct: false },
      { en: "It makes them more anxious", ar: "يجعلهم أكثر قلقاً", correct: false }
    ],
    keywords: [
      { term: "injured person", ar: "المصاب", explainAr: "شخص تعرض لإصابة في حادث." },
      { term: "first aid", ar: "الإسعافات الأولية", explainAr: "المساعدة الطبية الأولية المقدمة قبل وصول الطوارئ." }
    ]
  },

  {
    id: "IN-28",
    topic: "incidents",
    promptEn: "What is the safest action if a casualty is trapped in a vehicle?",
    promptAr: "ما الإجراء الأكثر أماناً إذا كان المصاب محاصراً داخل مركبة؟",
    options: [
      { en: "Reassure them and wait for emergency services", ar: "طمأنته وانتظار خدمات الطوارئ", correct: true },
      { en: "Pull them out quickly", ar: "إخراجه بسرعة", correct: false },
      { en: "Remove their helmet", ar: "إزالة الخوذة", correct: false },
      { en: "Give them food", ar: "إعطاؤه طعاماً", correct: false }
    ],
    keywords: [
      { term: "trapped casualty", ar: "مصاب محاصر", explainAr: "شخص مصاب عالق داخل مركبة ولا يمكن إخراجه بسهولة." },
      { term: "emergency services", ar: "خدمات الطوارئ", explainAr: "الفرق المتخصصة في التعامل مع الحوادث والإصابات." }
    ]
  },

  {
    id: "IN-29",
    topic: "incidents",
    promptEn: "What should you do if you are involved in an accident and someone is injured?",
    promptAr: "ماذا يجب أن تفعل إذا كنت متورطاً في حادث وأصيب شخص ما؟",
    options: [
      { en: "Stop, assist if safe, and call emergency services", ar: "التوقف، المساعدة إن كان آمناً، والاتصال بالطوارئ", correct: true },
      { en: "Leave once emergency services arrive", ar: "المغادرة عند وصول الطوارئ", correct: false },
      { en: "Exchange details and leave", ar: "تبادل التفاصيل والمغادرة", correct: false },
      { en: "Move injured people away from the road immediately", ar: "نقل المصابين فوراً", correct: false }
    ],
    keywords: [
      { term: "injury", ar: "إصابة", explainAr: "ضرر جسدي ناتج عن حادث." },
      { term: "emergency services", ar: "خدمات الطوارئ", explainAr: "الفرق المتخصصة في التعامل مع الحوادث والإصابات." }
    ]
  },

  {
    id: "IN-30",
    topic: "incidents",
    promptEn: "What should you do after a minor collision if vehicles are causing an obstruction?",
    promptAr: "ماذا يجب أن تفعل بعد تصادم بسيط إذا كانت المركبات تعيق المرور؟",
    options: [
      { en: "Move vehicles to a safe place if possible", ar: "تحريك المركبات إلى مكان آمن إن أمكن", correct: true },
      { en: "Leave vehicles where they are", ar: "ترك المركبات في مكانها", correct: false },
      { en: "Wait for police before moving", ar: "انتظار الشرطة قبل التحريك", correct: false },
      { en: "Turn off hazard lights", ar: "إطفاء أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "minor collision", ar: "تصادم بسيط", explainAr: "حادث تصادم بسيط دون إصابات خطيرة." },
      { term: "obstruction", ar: "عائق", explainAr: "شيء يعيق حركة المرور على الطريق." }
    ]
  },

  {
    id: "IN-31",
    topic: "incidents",
    promptEn: "Why is it important to remain at the scene of an accident?",
    promptAr: "لماذا من المهم البقاء في موقع الحادث؟",
    options: [
      { en: "Because leaving could be a criminal offence", ar: "لأن المغادرة قد تُعد جريمة", correct: true },
      { en: "To avoid traffic delays", ar: "لتجنب تأخير المرور", correct: false },
      { en: "To protect your vehicle", ar: "لحماية مركبتك", correct: false },
      { en: "To speak to witnesses only", ar: "للتحدث مع الشهود فقط", correct: false }
    ],
    keywords: [
      { term: "leave scene", ar: "مغادرة موقع الحادث", explainAr: "الخروج من موقع الحادث قبل إتمام الإجراءات المطلوبة." },
      { term: "legal responsibility", ar: "المسؤولية القانونية", explainAr: "الواجب القانوني المطلوب في حالة الحوادث." }
    ]
  },

  {
    id: "IN-32",
    topic: "incidents",
    promptEn: "What should you do if you cannot move vehicles after an accident but they are causing danger to other road users?",
    promptAr: "ماذا يجب أن تفعل إذا لم تستطع تحريك المركبات بعد حادث لكنها تشكل خطراً على مستخدمي الطريق الآخرين؟",
    options: [
      { en: "Warn approaching traffic and call emergency services immediately", ar: "تحذير حركة المرور القادمة والاتصال بالطوارئ فوراً", correct: true },
      { en: "Leave the scene to avoid danger", ar: "مغادرة المكان لتجنب الخطر", correct: false },
      { en: "Try to push the vehicles yourself", ar: "محاولة دفع المركبات بنفسك", correct: false },
      { en: "Wait for other drivers to help", ar: "انتظار سائقين آخرين للمساعدة", correct: false }
    ],
    keywords: [
      { term: "obstruction", ar: "عائق", explainAr: "شيء يعيق حركة المرور على الطريق." },
      { term: "danger", ar: "الخطر", explainAr: "موقف خطير يتطلب إجراء فوري." }
    ]
  },

  {
    id: "IN-33",
    topic: "incidents",
    promptEn: "When using a warning triangle on a normal road, how far should you place it from your vehicle?",
    promptAr: "عند استخدام مثلث التحذير على طريق عادي، كم يجب أن يكون بعده عن مركبتك؟",
    options: [
      { en: "At least 45 metres (147 feet) on the same side of the road", ar: "على الأقل 45 متراً (147 قدماً) على نفس جانب الطريق", correct: true },
      { en: "Right next to the vehicle", ar: "بجانب المركبة مباشرة", correct: false },
      { en: "On the opposite side of the road", ar: "على الجانب المقابل من الطريق", correct: false },
      { en: "Only 5 metres away", ar: "فقط على بعد 5 أمتار", correct: false }
    ],
    keywords: [
      { term: "warning triangle", ar: "مثلث التحذير", explainAr: "أداة تحذيرية توضع خلف المركبة المتعطلة على الطرق العادية." },
      { term: "safe placement", ar: "الوضع الآمن", explainAr: "وضع المثلث في مكان آمن يعطي السائقين وقتاً كافياً للتفاعل." }
    ]
  },

  {
    id: "IN-34",
    topic: "incidents",
    promptEn: "What should you do if a casualty is not breathing after an accident?",
    promptAr: "ماذا يجب أن تفعل إذا كان المصاب لا يتنفس بعد حادث؟",
    options: [
      { en: "Call 999 immediately and start CPR if you are trained", ar: "اتصل برقم 999 فوراً وابدأ الإنعاش القلبي الرئوي إن كنت مدرباً", correct: true },
      { en: "Give them water to help them breathe", ar: "إعطاؤه ماء لمساعدته على التنفس", correct: false },
      { en: "Wait for emergency services to arrive", ar: "انتظار وصول خدمات الطوارئ", correct: false },
      { en: "Move them to a more comfortable position", ar: "نقله إلى وضع أكثر راحة", correct: false }
    ],
    keywords: [
      { term: "not breathing", ar: "عدم التنفس", explainAr: "حالة طبية طارئة تتطلب إجراء فوري." },
      { term: "CPR", ar: "الإنعاش القلبي الرئوي", explainAr: "تقنية إسعافات أولية لإنقاذ شخص لا يتنفس." },
      { term: "999", ar: "999", explainAr: "رقم الطوارئ في المملكة المتحدة." }
    ]
  },

  {
    id: "IN-35",
    topic: "incidents",
    promptEn: "What key information should you provide to emergency services when reporting an accident?",
    promptAr: "ما المعلومات الأساسية التي يجب تقديمها لخدمات الطوارئ عند الإبلاغ عن حادث؟",
    options: [
      { en: "Location, number of vehicles involved, and any visible injuries", ar: "الموقع وعدد المركبات المتورطة وأي إصابات مرئية", correct: true },
      { en: "Your insurance policy number", ar: "رقم بوليصة التأمين الخاصة بك", correct: false },
      { en: "The other driver's phone number", ar: "رقم هاتف السائق الآخر", correct: false },
      { en: "Details about vehicle damage only", ar: "تفاصيل أضرار المركبات فقط", correct: false }
    ],
    keywords: [
      { term: "emergency services", ar: "خدمات الطوارئ", explainAr: "الفرق المتخصصة في التعامل مع الحوادث والإصابات." },
      { term: "location", ar: "الموقع", explainAr: "المكان الدقيق الذي وقع فيه الحادث." },
      { term: "hazards", ar: "المخاطر", explainAr: "أي مخاطر إضافية في موقع الحادث مثل الوقود المسكوب أو المركبات المحترقة." }
    ]
  },

  {
    id: "IN-36",
    topic: "incidents",
    promptEn: "What should you do if you witness a road accident but cannot stop safely?",
    promptAr: "ماذا يجب أن تفعل إذا شهدت حادث مروري لكن لا تستطيع التوقف بأمان؟",
    options: [
      { en: "Note the location and call emergency services as soon as it is safe to do so", ar: "سجّل الموقع واتصل بخدمات الطوارئ بمجرد أن يكون ذلك آمناً", correct: true },
      { en: "Continue driving and forget about it", ar: "متابعة القيادة ونسيان الأمر", correct: false },
      { en: "Stop in the middle of the road", ar: "التوقف في منتصف الطريق", correct: false },
      { en: "Only report it if you see injuries", ar: "الإبلاغ فقط إذا رأيت إصابات", correct: false }
    ],
    keywords: [
      { term: "witness", ar: "شاهد", explainAr: "شخص رأى حادثاً لكنه لم يكن طرفاً فيه." },
      { term: "safe to stop", ar: "آمن للتوقف", explainAr: "القدرة على التوقف دون تعريض نفسك أو الآخرين للخطر." }
    ]
  },
  {
    id: "DOC-5901",
    topic: "documents",
    promptEn: "What is the minimum insurance required to drive legally on UK roads?",
    promptAr: "ما هو الحد الأدنى للتأمين المطلوب للقيادة بشكل قانوني على طرق المملكة المتحدة؟",
    options: [
      { en: "Fully comprehensive insurance", ar: "تأمين شامل", correct: false },
      { en: "Third party insurance", ar: "تأمين طرف ثالث", correct: true },
      { en: "Third party, fire and theft", ar: "تأمين طرف ثالث مع الحريق والسرقة", correct: false },
      { en: "Personal injury cover", ar: "تغطية الإصابات الشخصية", correct: false }
    ],
    keywords: [
      { term: "insurance", ar: "التأمين", explainAr: "وثيقة تغطي التكاليف المالية في حالة الحوادث." },
      { term: "third party", ar: "طرف ثالث", explainAr: "أبسط نوع تأمين إلزامي يغطي فقط ضرر الآخرين وليس سيارتك." },
      { term: "legal requirement", ar: "المتطلب القانوني", explainAr: "شيء مطلوب بموجب القانون للقيادة على الطرق." }
    ]
  },
  {
    id: "DOC-5903",
    topic: "documents",
    promptEn: "When must a vehicle have a valid MOT certificate?",
    promptAr: "متى يجب أن تمتلك المركبة شهادة فحص MOT سارية؟",
    options: [
      { en: "From the first year of registration", ar: "من السنة الأولى للتسجيل", correct: false },
      { en: "Once the vehicle is over three years old", ar: "عندما يتجاوز عمر المركبة ثلاث سنوات", correct: true },
      { en: "Only if it is used commercially", ar: "فقط إذا استُخدمت تجاريًا", correct: false },
      { en: "Only after an accident", ar: "فقط بعد حادث", correct: false }
    ],
    keywords: [
      { term: "MOT", ar: "MOT", explainAr: "فحص فني سنوي مطلوب قانونياً للمركبات التي تجاوزت ثلاث سنوات." },
      { term: "vehicle age", ar: "عمر المركبة", explainAr: "الوقت المنقضي منذ تسجيل المركبة لأول مرة." },
      { term: "legal", ar: "قانوني", explainAr: "مطلوب بموجب القانون." }
    ]
  },
  {
    id: "DOC-5904",
    topic: "documents",
    promptEn: "How long is an MOT certificate normally valid?",
    promptAr: "ما مدة صلاحية شهادة فحص MOT عادةً؟",
    options: [
      { en: "6 months", ar: "6 أشهر", correct: false },
      { en: "12 months", ar: "12 شهرًا", correct: true },
      { en: "24 months", ar: "24 شهرًا", correct: false },
      { en: "Until the next service", ar: "حتى الصيانة التالية", correct: false }
    ],
    keywords: [
      { term: "MOT", ar: "MOT", explainAr: "فحص فني سنوي مطلوب قانونياً للمركبات." },
      { term: "validity", ar: "الصلاحية", explainAr: "المدة التي تبقى فيها الوثيقة سارية المفعول." },
      { term: "12 months", ar: "12 شهرًا", explainAr: "مدة صلاحية شهادة MOT عادةً سنة واحدة." }
    ]
  },
  {
    id: "DOC-5905",
    topic: "documents",
    promptEn: "What should you do if your eyesight changes and no longer meets legal standards?",
    promptAr: "ماذا يجب أن تفعل إذا تغير نظرك ولم يعد يلبي المتطلبات القانونية؟",
    options: [
      { en: "Continue driving carefully", ar: "متابعة القيادة بحذر", correct: false },
      { en: "Stop driving and inform the DVLA", ar: "التوقف عن القيادة وإبلاغ DVLA", correct: true },
      { en: "Drive only in daylight", ar: "القيادة فقط نهارًا", correct: false },
      { en: "Use hazard lights", ar: "استخدام أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "eyesight", ar: "النظر", explainAr: "قدرتك على الرؤية بوضوح." },
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." },
      { term: "medical", ar: "طبي", explainAr: "متعلق بالصحة أو الحالة الطبية." }
    ]
  },
  {
    id: "DOC-5906",
    topic: "documents",
    promptEn: "What must you do if you change your name or address?",
    promptAr: "ماذا يجب أن تفعل إذا غيرت اسمك أو عنوانك؟",
    options: [
      { en: "Inform your insurance company only", ar: "إبلاغ شركة التأمين فقط", correct: false },
      { en: "Inform the DVLA promptly", ar: "إبلاغ DVLA فورًا", correct: true },
      { en: "Wait until licence renewal", ar: "الانتظار حتى تجديد الرخصة", correct: false },
      { en: "Do nothing", ar: "عدم القيام بأي شيء", correct: false }
    ],
    keywords: [
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." },
      { term: "address change", ar: "تغيير العنوان", explainAr: "عندما تنتقل إلى عنوان جديد." },
      { term: "licence", ar: "رخصة القيادة", explainAr: "وثيقة رسمية تثبت أنك مسموح لك قانونياً بالقيادة." }
    ]
  },
  {
    id: "DOC-5907",
    topic: "documents",
    promptEn: "When are you required to show your insurance certificate?",
    promptAr: "متى يُطلب منك إبراز شهادة التأمين؟",
    options: [
      { en: "When buying fuel", ar: "عند شراء الوقود", correct: false },
      { en: "When requested by the police", ar: "عند طلب الشرطة", correct: true },
      { en: "At every journey", ar: "في كل رحلة", correct: false },
      { en: "Only after an accident", ar: "فقط بعد حادث", correct: false }
    ],
    keywords: [
      { term: "insurance certificate", ar: "شهادة التأمين", explainAr: "وثيقة تثبت أن مركبتك مؤمنة." },
      { term: "police", ar: "الشرطة", explainAr: "ضباط الشرطة الذين يمكنهم طلب إبراز الوثائق." },
      { term: "documents", ar: "الوثائق", explainAr: "رخصة القيادة والتأمين ووثائق المركبة." }
    ]
  },
  {
    id: "DOC-5908",
    topic: "documents",
    promptEn: "What could happen if you drive without valid insurance?",
    promptAr: "ما الذي قد يحدث إذا قدت دون تأمين ساري؟",
    options: [
      { en: "You may receive a warning only", ar: "تحصل على تحذير فقط", correct: false },
      { en: "You could face fines, points, or disqualification", ar: "قد تواجه غرامات أو نقاط أو سحب الرخصة", correct: true },
      { en: "Nothing if you drive carefully", ar: "لا شيء إذا قدت بحذر", correct: false },
      { en: "Insurance covers you automatically", ar: "يتم تغطيتك تلقائيًا", correct: false }
    ],
    keywords: [
      { term: "no insurance", ar: "عدم وجود تأمين", explainAr: "القيادة دون تأمين ساري المفعول." },
      { term: "penalties", ar: "العقوبات", explainAr: "الغرامات أو النقاط على الرخصة أو سحب الرخصة." },
      { term: "law", ar: "القانون", explainAr: "القواعد القانونية التي يجب اتباعها." }
    ]
  },
  {
    id: "DOC-5909",
    topic: "documents",
    promptEn: "Why must you ensure your driving licence is valid?",
    promptAr: "لماذا يجب التأكد من أن رخصة قيادتك سارية؟",
    options: [
      { en: "To reduce fuel costs", ar: "لتقليل تكاليف الوقود", correct: false },
      { en: "Because driving without a valid licence is illegal", ar: "لأن القيادة دون رخصة سارية غير قانونية", correct: true },
      { en: "To avoid vehicle servicing", ar: "لتجنب صيانة المركبة", correct: false },
      { en: "To impress other drivers", ar: "لإبهار السائقين الآخرين", correct: false }
    ],
    keywords: [
      { term: "driving licence", ar: "رخصة القيادة", explainAr: "وثيقة رسمية تثبت أنك مسموح لك قانونياً بالقيادة." },
      { term: "legal", ar: "قانوني", explainAr: "مطلوب بموجب القانون." },
      { term: "validity", ar: "الصلاحية", explainAr: "المدة التي تبقى فيها الوثيقة سارية المفعول." }
    ]
  },
  {
    id: "DOC-5910",
    topic: "documents",
    promptEn: "When may the police ask you to stop and produce documents?",
    promptAr: "متى يجوز للشرطة أن تطلب منك التوقف وإبراز الوثائق؟",
    options: [
      { en: "Only after an accident", ar: "فقط بعد حادث", correct: false },
      { en: "At any time while driving", ar: "في أي وقت أثناء القيادة", correct: true },
      { en: "Only at checkpoints", ar: "فقط عند نقاط التفتيش", correct: false },
      { en: "Only at night", ar: "فقط ليلًا", correct: false }
    ],
    keywords: [
      { term: "police powers", ar: "صلاحيات الشرطة", explainAr: "السلطة القانونية للشرطة لطلب إبراز الوثائق." },
      { term: "documents", ar: "الوثائق", explainAr: "رخصة القيادة والتأمين ووثائق المركبة." },
      { term: "stop", ar: "التوقف", explainAr: "إيقاف المركبة عند طلب الشرطة." }
    ]
  },
  {
    id: "DOC-5911",
    topic: "documents",
    promptEn: "What should you do if your driving licence is lost or stolen?",
    promptAr: "ماذا يجب أن تفعل إذا فُقدت أو سُرقت رخصة قيادتك؟",
    options: [
      { en: "Continue driving until renewal", ar: "متابعة القيادة حتى التجديد", correct: false },
      { en: "Apply for a replacement from the DVLA", ar: "التقدم بطلب رخصة بديلة من DVLA", correct: true },
      { en: "Report it only to your insurer", ar: "إبلاغ شركة التأمين فقط", correct: false },
      { en: "Buy a temporary licence", ar: "شراء رخصة مؤقتة", correct: false }
    ],
    keywords: [
      { term: "lost licence", ar: "رخصة مفقودة", explainAr: "عندما تفقد رخصة القيادة أو تُسرق." },
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." },
      { term: "replacement", ar: "بديل", explainAr: "رخصة جديدة تحل محل الرخصة المفقودة أو المسروقة." }
    ]
  },
  {
    id: "DOC-5912",
    topic: "documents",
    promptEn: "When must you inform the DVLA about a medical condition?",
    promptAr: "متى يجب عليك إبلاغ DVLA عن حالة طبية؟",
    options: [
      { en: "Only if requested by police", ar: "فقط إذا طلبت الشرطة ذلك", correct: false },
      { en: "If the condition could affect your driving", ar: "إذا كانت الحالة قد تؤثر على قيادتك", correct: true },
      { en: "Only after an accident", ar: "فقط بعد حادث", correct: false },
      { en: "At licence renewal only", ar: "فقط عند تجديد الرخصة", correct: false }
    ],
    keywords: [
      { term: "medical condition", ar: "حالة طبية", explainAr: "أي حالة صحية قد تؤثر على قدرتك على القيادة بأمان." },
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." },
      { term: "fitness to drive", ar: "اللياقة للقيادة", explainAr: "قدرتك الصحية على القيادة بأمان." }
    ]
  },
  {
    id: "DOC-5913",
    topic: "documents",
    promptEn: "What could happen if you fail to notify the DVLA about a relevant medical condition?",
    promptAr: "ما الذي قد يحدث إذا لم تُبلغ DVLA عن حالة طبية ذات صلة؟",
    options: [
      { en: "Nothing if you drive carefully", ar: "لا شيء إذا قدت بحذر", correct: false },
      { en: "You could be fined and your insurance may be invalid", ar: "قد تُغرَّم وقد يصبح تأمينك غير ساري", correct: true },
      { en: "Your vehicle will be seized immediately", ar: "ستُصادر مركبتك فورًا", correct: false },
      { en: "You will receive a warning only", ar: "تحصل على تحذير فقط", correct: false }
    ],
    keywords: [
      { term: "medical notification", ar: "الإبلاغ الطبي", explainAr: "إخبار DVLA عن حالة طبية قد تؤثر على القيادة." },
      { term: "insurance invalid", ar: "تأمين غير ساري", explainAr: "عندما يصبح التأمين غير صالح بسبب عدم الإبلاغ عن حالة طبية." },
      { term: "penalty", ar: "عقوبة", explainAr: "الغرامة أو العقوبة القانونية لعدم الإبلاغ." }
    ]
  },
  {
    id: "DOC-5914",
    topic: "documents",
    promptEn: "When must you renew your photocard driving licence?",
    promptAr: "متى يجب عليك تجديد رخصة القيادة البلاستيكية (Photocard)؟",
    options: [
      { en: "Every 5 years", ar: "كل 5 سنوات", correct: false },
      { en: "Every 10 years", ar: "كل 10 سنوات", correct: true },
      { en: "At age 60", ar: "عند سن 60", correct: false },
      { en: "Only if requested", ar: "فقط إذا طُلب ذلك", correct: false }
    ],
    keywords: [
      { term: "photocard licence", ar: "رخصة بلاستيكية", explainAr: "رخصة القيادة الحديثة التي تحتوي على صورة." },
      { term: "renewal", ar: "تجديد", explainAr: "استبدال الرخصة القديمة برخصة جديدة." },
      { term: "10 years", ar: "10 سنوات", explainAr: "المدة التي تبقى فيها رخصة القيادة البلاستيكية سارية قبل الحاجة للتجديد." }
    ]
  },
  {
    id: "DOC-5915",
    topic: "documents",
    promptEn: "What must you do if you sell or transfer your vehicle to someone else?",
    promptAr: "ماذا يجب أن تفعل إذا بعت أو نقلت ملكية مركبتك لشخص آخر؟",
    options: [
      { en: "Give them your insurance", ar: "إعطاؤه تأمينك", correct: false },
      { en: "Notify the DVLA of the change", ar: "إبلاغ DVLA بتغيير الملكية", correct: true },
      { en: "Do nothing once paid", ar: "عدم القيام بأي شيء بعد الدفع", correct: false },
      { en: "Wait until tax renewal", ar: "الانتظار حتى تجديد الضريبة", correct: false }
    ],
    keywords: [
      { term: "vehicle sale", ar: "بيع المركبة", explainAr: "عندما تبيع مركبتك لشخص آخر." },
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." },
      { term: "ownership", ar: "الملكية", explainAr: "من يملك المركبة قانونياً." }
    ]
  },
  {
    id: "DOC-5916",
    topic: "documents",
    promptEn: "What happens if you drive with an expired MOT certificate?",
    promptAr: "ما الذي يحدث إذا قدت مركبة بشهادة MOT منتهية؟",
    options: [
      { en: "Nothing if the car seems safe", ar: "لا شيء إذا بدت المركبة آمنة", correct: false },
      { en: "You may invalidate your insurance and face penalties", ar: "قد يصبح تأمينك غير ساري وتتعرض لعقوبات", correct: true },
      { en: "You can renew it later without issue", ar: "يمكنك تجديدها لاحقًا دون مشكلة", correct: false },
      { en: "It only affects commercial vehicles", ar: "يؤثر فقط على المركبات التجارية", correct: false }
    ],
    keywords: [
      { term: "expired MOT", ar: "MOT منتهي", explainAr: "شهادة MOT التي انتهت صلاحيتها." },
      { term: "insurance", ar: "التأمين", explainAr: "وثيقة تغطي تكاليف الأضرار أو الإصابات في الحوادث." },
      { term: "penalty", ar: "عقوبة", explainAr: "الغرامة أو العقوبة القانونية." }
    ]
  },
  {
    id: "DOC-5917",
    topic: "documents",
    promptEn: "When are you legally allowed to drive without an MOT?",
    promptAr: "متى يُسمح لك قانونيًا بالقيادة دون شهادة MOT؟",
    options: [
      { en: "When driving to a pre-booked MOT test", ar: "عند القيادة إلى فحص MOT محجوز مسبقًا", correct: true },
      { en: "When the journey is short", ar: "عندما تكون الرحلة قصيرة", correct: false },
      { en: "When driving slowly", ar: "عند القيادة ببطء", correct: false },
      { en: "At night only", ar: "ليلًا فقط", correct: false }
    ],
    keywords: [
      { term: "no MOT", ar: "بدون MOT", explainAr: "القيادة دون شهادة MOT سارية." },
      { term: "test appointment", ar: "موعد الفحص", explainAr: "موعد محجوز مسبقاً لفحص MOT." },
      { term: "legal exception", ar: "استثناء قانوني", explainAr: "حالة استثنائية يسمح فيها القانون بالقيادة دون MOT." }
    ]
  },
  {
    id: "DOC-5918",
    topic: "documents",
    promptEn: "What document shows who is responsible for a vehicle?",
    promptAr: "أي وثيقة تُظهر من هو المسؤول عن المركبة؟",
    options: [
      { en: "Insurance certificate", ar: "شهادة التأمين", correct: false },
      { en: "Vehicle registration certificate (V5C)", ar: "شهادة تسجيل المركبة (V5C)", correct: true },
      { en: "MOT certificate", ar: "شهادة MOT", correct: false },
      { en: "Driving licence", ar: "رخصة القيادة", correct: false }
    ],
    keywords: [
      { term: "V5C", ar: "V5C", explainAr: "وثيقة تسجيل السيارة التي تُظهر تفاصيل المالك والمركبة." },
      { term: "vehicle registration", ar: "تسجيل المركبة", explainAr: "الوثيقة الرسمية التي تسجل ملكية المركبة." },
      { term: "responsibility", ar: "المسؤولية", explainAr: "من يتحمل المسؤولية القانونية عن المركبة." }
    ]
  },
  {
    id: "DOC-5919",
    topic: "documents",
    promptEn: "Why must your vehicle tax be up to date?",
    promptAr: "لماذا يجب أن تكون ضريبة المركبة محدثة؟",
    options: [
      { en: "To reduce fuel costs", ar: "لتقليل تكاليف الوقود", correct: false },
      { en: "Because driving without valid tax is illegal", ar: "لأن القيادة دون ضريبة سارية غير قانونية", correct: true },
      { en: "To pass an MOT", ar: "لاجتياز فحص MOT", correct: false },
      { en: "To get insurance", ar: "للحصول على تأمين", correct: false }
    ],
    keywords: [
      { term: "vehicle tax", ar: "ضريبة المركبة", explainAr: "الضريبة السنوية المطلوبة قانونياً لاستخدام المركبة على الطرق العامة." },
      { term: "legal requirement", ar: "متطلب قانوني", explainAr: "شيء مطلوب بموجب القانون." },
      { term: "DVLA", ar: "DVLA", explainAr: "الجهة الحكومية المسؤولة عن تسجيل المركبات ورخص القيادة في بريطانيا." }
    ]
  },
  {
    id: "DOC-5920",
    topic: "documents",
    promptEn: "What should you do if the police issue you with a producer (HO/RT1)?",
    promptAr: "ماذا يجب أن تفعل إذا أصدرت لك الشرطة إشعار إبراز وثائق (HO/RT1)؟",
    options: [
      { en: "Ignore it if you have insurance", ar: "تجاهله إذا كان لديك تأمين", correct: false },
      { en: "Produce the required documents within the stated time", ar: "إبراز الوثائق المطلوبة خلال المدة المحددة", correct: true },
      { en: "Send copies by email", ar: "إرسال نسخ بالبريد الإلكتروني", correct: false },
      { en: "Wait for a reminder", ar: "انتظار تذكير", correct: false }
    ],
    keywords: [
      { term: "producer", ar: "إشعار إبراز وثائق", explainAr: "إشعار من الشرطة يطلب إبراز الوثائق في مركز شرطة." },
      { term: "HO/RT1", ar: "HO/RT1", explainAr: "نموذج رسمي يستخدمه ضباط الشرطة لطلب إبراز الوثائق." },
      { term: "police documents", ar: "وثائق الشرطة", explainAr: "الوثائق المطلوبة من قبل الشرطة مثل رخصة القيادة والتأمين." }
    ]
  },

  // --- GENERAL ---

  {
    id: "GEN-6401",
    topic: "general",
    promptEn: "What is the safest way to reduce fuel consumption while driving?",
    promptAr: "ما الطريقة الأكثر أمانًا لتقليل استهلاك الوقود أثناء القيادة؟",
    options: [
      { en: "Accelerate sharply", ar: "التسارع بقوة", correct: false },
      { en: "Anticipate traffic and drive smoothly", ar: "توقع حركة المرور والقيادة بسلاسة", correct: true },
      { en: "Drive in a low gear", ar: "القيادة على ترس منخفض", correct: false },
      { en: "Brake late and hard", ar: "الفرملة المتأخرة والقوية", correct: false }
    ],
    keywords: [
      { term: "fuel efficiency", ar: "كفاءة الوقود", explainAr: "استخدام أقل كمية من الوقود أثناء القيادة." },
      { term: "smooth driving", ar: "القيادة بسلاسة", explainAr: "القيادة دون تسارع أو فرملة مفاجئة." },
      { term: "anticipation", ar: "التوقع", explainAr: "التفكير المسبق في ما قد يحدث على الطريق." }
    ]
  },
  {
    id: "GEN-6402",
    topic: "general",
    promptEn: "Before starting a long journey, what vehicle checks should you carry out?",
    promptAr: "قبل بدء رحلة طويلة، ما الفحوصات التي يجب إجراؤها على المركبة؟",
    options: [
      { en: "Check tyres, lights, oil, water, and fuel levels", ar: "فحص الإطارات والأضواء والزيت والماء ومستوى الوقود", correct: true },
      { en: "Only check the radio and air conditioning", ar: "فحص الراديو وتكييف الهواء فقط", correct: false },
      { en: "Check the vehicle only if it's raining", ar: "فحص المركبة فقط إذا كان المطر يتساقط", correct: false },
      { en: "No checks are necessary before long journeys", ar: "لا حاجة لفحوصات قبل الرحلات الطويلة", correct: false }
    ],
    keywords: [
      { term: "vehicle checks", ar: "فحوصات المركبة", explainAr: "فحص حالة المركبة قبل القيادة لضمان السلامة." },
      { term: "tyres", ar: "الإطارات", explainAr: "التحقق من ضغط الهواء وعمق المداس." },
      { term: "lights", ar: "الأضواء", explainAr: "التحقق من عمل جميع الأضواء بشكل صحيح." },
      { term: "oil and water", ar: "الزيت والماء", explainAr: "التحقق من مستويات زيت المحرك وماء التبريد." }
    ]
  },
  {
    id: "GEN-6403",
    topic: "general",
    promptEn: "What should you do if another driver behaves aggressively towards you?",
    promptAr: "ماذا يجب أن تفعل إذا تصرف سائق آخر بعدوانية تجاهك؟",
    options: [
      { en: "Respond with the same behaviour", ar: "الرد بنفس السلوك", correct: false },
      { en: "Stay calm and avoid confrontation", ar: "البقاء هادئًا وتجنب المواجهة", correct: true },
      { en: "Sound your horn repeatedly", ar: "استخدام البوق بشكل متكرر", correct: false },
      { en: "Block their path", ar: "إعاقة طريقه", correct: false }
    ],
    keywords: [
      { term: "aggressive drivers", ar: "السائقون العدوانيون", explainAr: "السائقون الذين يتصرفون بعدوانية أو خطورة." },
      { term: "calm", ar: "الهدوء", explainAr: "البقاء هادئًا وعدم الرد على السلوك العدواني." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على سلامتك وسلامة الآخرين على الطريق." }
    ]
  },
  {
    id: "GEN-6404",
    topic: "general",
    promptEn: "Why should you avoid unnecessary journeys by car?",
    promptAr: "لماذا يجب تجنب الرحلات غير الضرورية بالسيارة؟",
    options: [
      { en: "To reduce wear on tyres only", ar: "لتقليل تآكل الإطارات فقط", correct: false },
      { en: "To reduce congestion and environmental impact", ar: "لتقليل الازدحام والتأثير البيئي", correct: true },
      { en: "To avoid using headlights", ar: "لتجنب استخدام الأضواء", correct: false },
      { en: "To improve engine sound", ar: "لتحسين صوت المحرك", correct: false }
    ],
    keywords: [
      { term: "environment", ar: "البيئة", explainAr: "التأثير على البيئة من خلال انبعاثات المركبات." },
      { term: "congestion", ar: "الازدحام", explainAr: "ازدحام الطرق بالمركبات." },
      { term: "journeys", ar: "الرحلات", explainAr: "الرحلات بالسيارة." }
    ]
  },
  {
    id: "GEN-6405",
    topic: "general",
    promptEn: "What is the main benefit of maintaining a safe driving attitude?",
    promptAr: "ما الفائدة الرئيسية من الحفاظ على سلوك قيادة آمن؟",
    options: [
      { en: "Reaching destinations faster", ar: "الوصول أسرع", correct: false },
      { en: "Reducing the risk of collisions", ar: "تقليل خطر الحوادث", correct: true },
      { en: "Lower insurance costs immediately", ar: "خفض التأمين فورًا", correct: false },
      { en: "Using fewer gears", ar: "استخدام عدد أقل من التروس", correct: false }
    ],
    keywords: [
      { term: "driving attitude", ar: "سلوك القيادة", explainAr: "طريقة تفكيرك وتصرفك أثناء القيادة." },
      { term: "risk reduction", ar: "تقليل المخاطر", explainAr: "تقليل احتمالية وقوع الحوادث." },
      { term: "safety", ar: "الأمان", explainAr: "الحفاظ على سلامتك وسلامة الآخرين." }
    ]
  },
  {
    id: "GEN-6406",
    topic: "general",
    promptEn: "Why should you avoid distractions while driving?",
    promptAr: "لماذا يجب تجنب المشتتات أثناء القيادة؟",
    options: [
      { en: "They make journeys longer", ar: "تجعل الرحلات أطول", correct: false },
      { en: "They reduce your awareness of hazards", ar: "تقلل إدراكك للمخاطر", correct: true },
      { en: "They increase fuel use", ar: "تزيد استهلاك الوقود", correct: false },
      { en: "They damage the vehicle", ar: "تتلف المركبة", correct: false }
    ],
    keywords: [
      { term: "distractions", ar: "المشتتات", explainAr: "أشياء تشتت انتباهك عن القيادة مثل الهاتف أو الطعام." },
      { term: "hazard awareness", ar: "إدراك المخاطر", explainAr: "القدرة على ملاحظة المخاطر المحتملة على الطريق." },
      { term: "attention", ar: "الانتباه", explainAr: "التركيز على الطريق والقيادة." }
    ]
  },
  {
    id: "GEN-6407",
    topic: "general",
    promptEn: "What is the safest approach when driving in unfamiliar areas?",
    promptAr: "ما الأسلوب الأكثر أمانًا عند القيادة في مناطق غير مألوفة؟",
    options: [
      { en: "Drive faster to leave quickly", ar: "القيادة بسرعة للمغادرة سريعًا", correct: false },
      { en: "Slow down and observe road signs carefully", ar: "التخفيف ومراقبة الإشارات بعناية", correct: true },
      { en: "Follow other vehicles closely", ar: "اتباع المركبات عن قرب", correct: false },
      { en: "Ignore road markings", ar: "تجاهل علامات الطريق", correct: false }
    ],
    keywords: [
      { term: "unfamiliar roads", ar: "طرق غير مألوفة", explainAr: "طرق لا تعرفها أو لم تكن فيها من قبل." },
      { term: "signs", ar: "الإشارات", explainAr: "علامات وإشارات الطريق التي توفر معلومات مهمة." },
      { term: "observation", ar: "المراقبة", explainAr: "مراقبة الطريق والإشارات بعناية." }
    ]
  },
  {
    id: "GEN-6408",
    topic: "general",
    promptEn: "Why is courtesy towards other road users important?",
    promptAr: "لماذا تعتبر المجاملة تجاه مستخدمي الطريق الآخرين مهمة؟",
    options: [
      { en: "It reduces journey time", ar: "تقلل زمن الرحلة", correct: false },
      { en: "It helps create safer and calmer traffic flow", ar: "تساعد على خلق حركة مرور أكثر أمانًا وهدوءًا", correct: true },
      { en: "It is required by insurance", ar: "مطلوبة من التأمين", correct: false },
      { en: "It improves vehicle performance", ar: "تحسن أداء المركبة", correct: false }
    ],
    keywords: [
      { term: "courtesy", ar: "المجاملة", explainAr: "التصرف بلطف واحترام تجاه مستخدمي الطريق الآخرين." },
      { term: "road users", ar: "مستخدمو الطريق", explainAr: "جميع الأشخاص الذين يستخدمون الطريق مثل السائقين والمشاة." },
      { term: "traffic flow", ar: "تدفق المرور", explainAr: "حركة المركبات على الطريق." }
    ]
  },

  // --- PROHIBITORY / REGULATORY SIGNS (Red Circular Signs) ---

  {
    id: "RS-R-01",
    topic: "road-signs",
    promptEn: "What does a red circular sign showing a bus symbol mean?",
    promptAr: "ماذا تعني إشارة دائرية حمراء تحتوي على رمز حافلة؟",
    image: "/theory-images/signs/signs_q096_no-buses.png",
    options: [
      { en: "Buses are not allowed to enter this road", ar: "الحافلات ممنوعة من دخول هذا الطريق", correct: true },
      { en: "Buses only route", ar: "طريق مخصص للحافلات فقط", correct: false },
      { en: "Bus stop ahead", ar: "موقف حافلات أمامك", correct: false },
      { en: "Public transport lane", ar: "مسار مخصص للنقل العام", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-02",
    topic: "road-signs",
    promptEn: "What does this triangular warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية المثلثة؟",
    image: "/theory-images/signs/signs_q097_dual-carriageway-ends.png",
    options: [
      { en: "The dual carriageway is ending ahead", ar: "الطريق المزدوج ينتهي أمامك", correct: true },
      { en: "The road becomes one-way", ar: "الطريق يصبح باتجاه واحد", correct: false },
      { en: "Overtaking is not allowed", ar: "التجاوز ممنوع", correct: false },
      { en: "Traffic lights ahead", ar: "إشارات ضوئية أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-03",
    topic: "road-signs",
    promptEn: "What does this triangular warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية المثلثة؟",
    image: "/theory-images/signs/signs_q098_road-narrows-both-sides.png",
    options: [
      { en: "The road narrows on both sides ahead", ar: "الطريق يضيق من الجانبين أمامك", correct: true },
      { en: "The road bends sharply", ar: "الطريق ينعطف بشكل حاد", correct: false },
      { en: "Two-way traffic ends", ar: "نهاية حركة المرور باتجاهين", correct: false },
      { en: "One-way road ahead", ar: "طريق باتجاه واحد أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-04",
    topic: "road-signs",
    promptEn: "What does a red circular sign with a motorcycle symbol crossed out mean?",
    promptAr: "ماذا تعني إشارة دائرية حمراء عليها رمز دراجة نارية مشطوب؟",
    image: "/theory-images/signs/signs_q098_no-motorcycles.png",
    options: [
      { en: "No motorcycles allowed", ar: "ممنوع مرور الدراجات النارية", correct: true },
      { en: "Motorcycles only", ar: "الدراجات النارية فقط", correct: false },
      { en: "End of motorcycle restriction", ar: "نهاية قيد الدراجات النارية", correct: false },
      { en: "Motorcycle route recommended", ar: "مسار مُوصى به للدراجات النارية", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-05",
    topic: "road-signs",
    promptEn: "What does this triangular warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية المثلثة؟",
    image: "/theory-images/signs/signs_q100_t-junction-priority-over-right.png",
    options: [
      { en: "T-junction ahead where you have priority over vehicles from the right", ar: "تقاطع على شكل T أمامك حيث لديك الأولوية على المركبات القادمة من اليمين", correct: true },
      { en: "T-junction ahead where you must give way to vehicles from the right", ar: "تقاطع على شكل T أمامك حيث يجب إعطاء الأولوية للمركبات القادمة من اليمين", correct: false },
      { en: "Crossroads with equal priority", ar: "تقاطع طرق بأولوية متساوية", correct: false },
      { en: "Road ends ahead", ar: "نهاية الطريق أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-06",
    topic: "road-signs",
    promptEn: "What does this triangular warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية المثلثة؟",
    image: "/theory-images/signs/signs_q101_junction-on-bend-ahead.png",
    options: [
      { en: "Junction on a bend ahead", ar: "تقاطع على منعطف أمامك", correct: true },
      { en: "Sharp bend to the right only", ar: "منعطف حاد إلى اليمين فقط", correct: false },
      { en: "Road narrows on one side", ar: "الطريق يضيق من جانب واحد", correct: false },
      { en: "T-junction ahead", ar: "تقاطع على شكل T أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-07",
    topic: "road-signs",
    promptEn: "What does this road sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة المرورية؟",
    image: "/theory-images/signs/signs_q102_light-signals-ahead-stop-when-lights-show.png",
    options: [
      { en: "Traffic lights ahead – stop when lights show", ar: "إشارات ضوئية أمامك – توقف عندما تظهر الإشارات", correct: true },
      { en: "Pedestrian crossing with signals", ar: "معبر مشاة مع إشارات", correct: false },
      { en: "Level crossing without barriers", ar: "معبر سكة حديدية بدون حواجز", correct: false },
      { en: "Temporary traffic lights only", ar: "إشارات مرور مؤقتة فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-08",
    topic: "road-signs",
    promptEn: "What does this road sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة المرورية؟",
    image: "/theory-images/signs/signs_q103_level-crossing-without-barrier.png",
    options: [
      { en: "Level crossing without a barrier or gate ahead", ar: "معبر سكة حديدية بدون حاجز أو بوابة أمامك", correct: true },
      { en: "Level crossing with barriers ahead", ar: "معبر سكة حديدية مع حواجز أمامك", correct: false },
      { en: "Tram crossing only", ar: "معبر ترام فقط", correct: false },
      { en: "Railway station ahead", ar: "محطة قطار أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-09",
    topic: "road-signs",
    promptEn: "What does this blue circular sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة الزرقاء الدائرية؟",
    image: "/theory-images/signs/signs_q104_keep-left.png",
    options: [
      { en: "Vehicles must keep to the left of the obstruction", ar: "يجب على المركبات البقاء على يسار العائق", correct: true },
      { en: "Left turn ahead", ar: "انعطاف إلى اليسار أمامك", correct: false },
      { en: "One-way road to the left", ar: "طريق باتجاه واحد إلى اليسار", correct: false },
      { en: "Overtaking on the left only", ar: "التجاوز من اليسار فقط", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-10",
    topic: "road-signs",
    promptEn: "What does this blue circular sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة الزرقاء الدائرية؟",
    image: "/theory-images/signs/signs_q105_pass-either-side.png",
    options: [
      { en: "Vehicles may pass on either side to reach the same destination", ar: "يمكن للمركبات المرور من أي جانب للوصول إلى نفس الوجهة", correct: true },
      { en: "Vehicles must pass on the left only", ar: "يجب على المركبات المرور من اليسار فقط", correct: false },
      { en: "Vehicles must pass on the right only", ar: "يجب على المركبات المرور من اليمين فقط", correct: false },
      { en: "One-way traffic ahead", ar: "طريق باتجاه واحد أمامك", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-11",
    topic: "road-signs",
    promptEn: "What does this triangular warning sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة التحذيرية المثلثة؟",
    image: "/theory-images/signs/signs_q106_road-works.png",
    options: [
      { en: "Road works ahead", ar: "أعمال طرق أمامك", correct: true },
      { en: "Slippery road ahead", ar: "طريق زلق أمامك", correct: false },
      { en: "Road narrows ahead", ar: "الطريق يضيق أمامك", correct: false },
      { en: "Uneven road surface", ar: "سطح طريق غير مستوٍ", correct: false }
    ],
    keywords: []
  },

  {
    id: "RS-R-12",
    topic: "road-signs",
    promptEn: "What does this temporary road sign indicate?",
    promptAr: "ماذا تعني هذه الإشارة المؤقتة على الطريق؟",
    image: "/theory-images/signs/signs_q107_temporary-lane-closure.png",
    options: [
      { en: "Temporary lane closure ahead", ar: "إغلاق مؤقت لمسار أمامك", correct: true },
      { en: "Permanent road narrowing", ar: "تضييق دائم للطريق", correct: false },
      { en: "Two-way traffic ahead", ar: "حركة مرور باتجاهين أمامك", correct: false },
      { en: "End of road works", ar: "نهاية أعمال الطرق", correct: false }
    ],
    keywords: []
  },

  // --- WARNING SIGNS (Additional) ---

  {
    id: "RS-W-01",
    topic: "road-signs",
    promptEn: "You're driving on a country lane and see a triangular warning sign showing the road narrowing on the left. What should you prepare for?",
    promptAr: "أنت تقود على طريق ريفي ضيق وترى علامة تحذير مثلثة تُظهر أن الطريق يضيق من اليسار. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q107_road-narrows-left_warning.png",
    options: [
      { en: "Reduced road width on the left requiring careful positioning", ar: "عرض طريق مقلص من اليسار يتطلب وضعاً حذراً", correct: true },
      { en: "You must move immediately to the left side", ar: "يجب أن تنتقل فوراً إلى الجانب الأيسر", correct: false },
      { en: "Overtaking is mandatory before the narrowing", ar: "التجاوز إلزامي قبل التضييق", correct: false },
      { en: "The road becomes one-way ahead", ar: "الطريق يصبح باتجاه واحد أمامك", correct: false }
    ],
    keywords: [
      { term: "road narrows left", ar: "الطريق يضيق من اليسار", explainAr: "الطريق يصبح أضيق من الجانب الأيسر مما يتطلب الحذر." }
    ]
  },

  {
    id: "RS-W-02",
    topic: "road-signs",
    promptEn: "You're driving in a hilly area and see a triangular warning sign showing a steep upward slope. What should you prepare for?",
    promptAr: "أنت تقود في منطقة جبلية وترى علامة تحذير مثلثة تُظهر منحدراً شديداً صاعداً. ماذا يجب أن تستعد له؟",
    image: "/theory-images/signs/signs_q108_steep-uphill-warning.png",
    options: [
      { en: "A steep uphill climb where you'll need lower gears and may encounter slower vehicles", ar: "صعود حاد ستحتاج فيه لغيار منخفض وقد تواجه مركبات أبطأ", correct: true },
      { en: "A steep downhill section ahead", ar: "منحدر شديد إلى الأسفل أمامك", correct: false },
      { en: "An uneven road surface only", ar: "سطح طريق غير مستوٍ فقط", correct: false },
      { en: "The end of the hill section", ar: "نهاية قسم التل", correct: false }
    ],
    keywords: [
      { term: "steep hill up", ar: "صعود حاد", explainAr: "منحدر صاعد شديد يتطلب استخدام غيار منخفض." }
    ]
  },

  {
    id: "RS-W-03",
    topic: "road-signs",
    promptEn: "You're driving through farmland and see a triangular warning sign showing farm animals. What hazard should you be alert for?",
    promptAr: "أنت تقود عبر أراضي زراعية وترى علامة تحذير مثلثة تُظهر حيوانات مزرعة. ما الخطر الذي يجب أن تكون منتبهاً له؟",
    image: "/theory-images/signs/signs_q109_farm-animals-warning.png",
    options: [
      { en: "Farm animals may wander onto or cross the road", ar: "قد تتجول حيوانات المزرعة على الطريق أو تعبره", correct: true },
      { en: "A farm entrance is ahead", ar: "مدخل مزرعة أمامك", correct: false },
      { en: "Only farm vehicles are allowed on this road", ar: "المركبات الزراعية فقط مسموحة على هذا الطريق", correct: false },
      { en: "A livestock market is nearby", ar: "سوق مواشي قريب", correct: false }
    ],
    keywords: [
      { term: "farm animals", ar: "حيوانات مزرعة", explainAr: "الحيوانات الزراعية قد تظهر فجأة على الطريق وتتحرك ببطء." }
    ]
  },

  {
    id: "RS-W-04",
    topic: "road-signs",
    promptEn: "You're driving on a main road and see a triangular warning sign showing a side road joining from the right. What hazard should you anticipate?",
    promptAr: "أنت تقود على طريق رئيسي وترى علامة تحذير مثلثة تُظهر طريقاً جانبياً ينضم من اليمين. ما الخطر الذي يجب أن تتوقعه؟",
    image: "/theory-images/signs/signs_q110_side-road-joins-right_warning.png",
    options: [
      { en: "Vehicles may emerge from the side road and join your path", ar: "قد تظهر مركبات من الطريق الجانبي وتنضم إلى مسارك", correct: true },
      { en: "Traffic from the right always has priority", ar: "المرور من اليمين له دائماً الأولوية", correct: false },
      { en: "You must overtake before the junction", ar: "يجب أن تتجاوز قبل التقاطع", correct: false },
      { en: "The road becomes one-way ahead", ar: "الطريق يصبح باتجاه واحد أمامك", correct: false }
    ],
    keywords: [
      { term: "side road right", ar: "طريق جانبي من اليمين", explainAr: "طريق ثانوي ينضم من اليمين وقد تظهر منه مركبات." }
    ]
  },

  // --- INFORMATION SIGNS ---

  {
    id: "RS-I-01",
    topic: "road-signs",
    promptEn: "You see this warning sign. What does it indicate?",
    promptAr: "ماذا تشير هذه الإشارة التحذيرية؟",
    image: "/theory-images/signs/signs_q112_staggered-junction.png",
    options: [
      { en: "Crossroads ahead", ar: "تقاطع طرق", correct: false },
      { en: "Staggered junction ahead", ar: "تقاطع متدرج (غير متقابل)", correct: true },
      { en: "Road narrows on both sides", ar: "الطريق يضيق من الجانبين", correct: false },
      { en: "Side road on the left only", ar: "طريق فرعي على اليسار فقط", correct: false }
    ],
    keywords: [
      { term: "staggered junction", ar: "تقاطع متدرج", explainAr: "تقاطع حيث الطرق الجانبية غير متقابلة مباشرة - أحدها أمام الآخر قليلاً." }
    ]
  },

  {
    id: "RS-I-02",
    topic: "road-signs",
    promptEn: "You see this warning sign. What does it indicate?",
    promptAr: "ماذا تشير هذه الإشارة التحذيرية؟",
    image: "/theory-images/signs/signs_q0113_uneven-road-surface.png",
    options: [
      { en: "Slippery road ahead", ar: "طريق زلق أمامك", correct: false },
      { en: "Uneven road surface ahead", ar: "سطح طريق غير مستوٍ أمامك", correct: true },
      { en: "Road narrows ahead", ar: "الطريق يضيق أمامك", correct: false },
      { en: "Speed humps ahead", ar: "مطبات سرعة أمامك", correct: false }
    ],
    keywords: [
      { term: "uneven road surface", ar: "سطح طريق غير مستوٍ", explainAr: "يحذر من سطح طريق غير مستوٍ أمامك - يجب تخفيف السرعة والحذر." }
    ]
  },

  {
    id: "RS-I-03",
    topic: "road-signs",
    promptEn: "A rectangular blue sign with white text showing 'M' followed by a number indicates:",
    promptAr: "إشارة مستطيلة زرقاء عليها نص أبيض يُظهر حرف M متبوعاً برقم تشير إلى:",
    image: "/theory-images/signs/signs_q113_motorway-route-number_M-sign.png",
    options: [
      { en: "Motorway ahead with route number", ar: "طريق سريع أمامك مع رقم المسار", correct: true },
      { en: "Maximum speed limit", ar: "حد السرعة الأقصى", correct: false },
      { en: "Mileage marker", ar: "علامة المسافة", correct: false },
      { en: "Mandatory route", ar: "مسار إلزامي", correct: false }
    ],
    keywords: [
      { term: "motorway", ar: "طريق سريع", explainAr: "علامة معلوماتية تشير إلى وجود طريق سريع قريب مع رقمه." }
    ]
  },

  {
    id: "RS-I-04",
    topic: "road-signs",
    promptEn: "A rectangular green sign with white text and route numbers provides:",
    promptAr: "إشارة مستطيلة خضراء عليها نص أبيض وأرقام مسارات تقدم:",
    image: "/theory-images/signs/signs_q114_green-rectangular-primary-route-directions.png",
    options: [
      { en: "Primary route directions and destinations", ar: "اتجاهات المسار الرئيسي والوجهات", correct: true },
      { en: "Speed limit for primary routes", ar: "حد السرعة للطرق الرئيسية", correct: false },
      { en: "Restriction on primary routes", ar: "قيود على الطرق الرئيسية", correct: false },
      { en: "End of primary route", ar: "نهاية المسار الرئيسي", correct: false }
    ],
    keywords: [
      { term: "primary route", ar: "مسار رئيسي", explainAr: "علامة معلوماتية خضراء تشير إلى اتجاهات المسارات الرئيسية والوجهات." }
    ]
  },

  {
    id: "RS-I-05",
    topic: "road-signs",
    promptEn: "You see a warning sign for loose chippings. What should you do?",
    promptAr: "ترى إشارة تحذّر من حصى/زَلَط مفكوك على الطريق. ماذا يجب أن تفعل؟",
    image: "/theory-images/signs/signs_q116_loose-chippings.png",
    options: [
      { en: "Speed up to clear the area quickly", ar: "زد السرعة لتجاوز المنطقة بسرعة", correct: false },
      { en: "Reduce speed and keep a greater distance from the vehicle ahead", ar: "خفّف السرعة وزِد المسافة عن المركبة أمامك", correct: true },
      { en: "Brake sharply to test your tyres", ar: "اكبح بقوة لاختبار الإطارات", correct: false },
      { en: "Drive close to the kerb to avoid the chippings", ar: "قد قريباً جداً من الرصيف لتجنب الحصى", correct: false }
    ],
    keywords: []
  }

];
