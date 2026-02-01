export interface Question {
  id: string;
  topic: string;
  promptEn: string;
  promptAr: string;
  options: { en: string; ar: string; correct: boolean }[];
  keywords: { term: string; ar: string; explainAr: string; explainEn?: string }[];
  image?: string; // path to an image in /public
}

export const questions: Question[] = [
  // --- ALERTNESS ---

  {
    id: "AL-01",
    topic: "alertness",
    promptEn: "Why should you switch on your headlights as daylight starts to fade?",
    promptAr: "لماذا يجب تشغيل المصابيح الأمامية عند بدء حلول الظلام؟",
    options: [
      { en: "To see dashboard instruments", ar: "لرؤية أدوات لوحة القيادة", correct: false },
      { en: "To blend in with traffic", ar: "للاندماج مع حركة المرور", correct: false },
      { en: "To help other road users see you", ar: "لمساعدة مستخدمي الطريق الآخرين على رؤيتك", correct: true },
      { en: "Because street lights are on", ar: "لأن أضواء الشوارع مضاءة", correct: false }
    ],
    keywords: [
      { term: "headlights", ar: "المصابيح الأمامية", explainAr: "المصابيح الأمامية تحسن رؤيتك للآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "المصابيح الأمامية تحسن رؤية الآخرين لك لأنها تجعل مركبتك أكثر وضوحاً في الظروف المظلمة، مما يقلل من خطر الاصطدام." }
    ]
  },

  {
    id: "AL-02",
    topic: "alertness",
    promptEn: "What's most likely to happen if you use a hands-free phone while driving?",
    promptAr: "ما الأكثر احتمالًا حدوثه عند استخدام الهاتف بدون يد أثناء القيادة؟",
    options: [
      { en: "Improved safety", ar: "تحسين السلامة", correct: false },
      { en: "Better concentration", ar: "تركيز أفضل", correct: false },
      { en: "Reduced vision", ar: "رؤية منخفضة", correct: false },
      { en: "Diverted attention", ar: "انتباه مشتت", correct: true }
    ],
    keywords: [
      { term: "hands-free", ar: "بدون يد", explainAr: "الهواتف بدون يد يمكن أن تشتت الانتباه." },
      { term: "hint", ar: "تلميح", explainAr: "حتى المكالمات بدون استخدام اليدين تشتت انتباهك لأنها تتطلب التركيز العقلي على المحادثة بدلاً من التركيز الكامل على القيادة، مما يزيد من خطر الحوادث." }
    ]
  },

  {
    id: "AL-03",
    topic: "alertness",
    promptEn: "How can you prevent a GPS from distracting you while driving?",
    promptAr: "كيف يمكنك منع نظام تحديد المواقع (GPS) من تشتيتك أثناء القيادة؟",
    options: [
      { en: "Turn it off in towns", ar: "أطفئه في المدن", correct: false },
      { en: "Choose a calming voice", ar: "اختر صوتاً مهدئاً", correct: false },
      { en: "Set destination before starting", ar: "حدد الوجهة قبل البدء", correct: true },
      { en: "Set it only when lost", ar: "اضبطه فقط عند الضياع", correct: false }
    ],
    keywords: [
      { term: "sat nav", ar: "جهاز الملاحة", explainAr: "جهاز الملاحة يمكن أن يشتت الانتباه." },
      { term: "hint", ar: "تلميح", explainAr: "إعداد نظام الملاحة قبل البدء بالحركة يمنع تشتت الانتباه أثناء القيادة لأنك لن تحتاج إلى النظر إلى الشاشة أو تعديل الإعدادات أثناء القيادة، مما يحافظ على تركيزك على الطريق." }
    ]
  },

  {
    id: "AL-04",
    topic: "alertness",
    promptEn: "If you can't see clearly behind when reversing, what should you do?",
    promptAr: "إذا لم تستطع الرؤية بوضوح عند الرجوع، ماذا تفعل؟",
    options: [
      { en: "Open the window", ar: "افتح النافذة", correct: false },
      { en: "Open the door", ar: "افتح الباب", correct: false },
      { en: "Use mirrors only", ar: "استخدم المرايا فقط", correct: false },
      { en: "Ask someone to guide you", ar: "اطلب من شخص أن يرشدك", correct: true }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "الرجوع للخلف يتطلب رؤية واضحة." },
      { term: "hint", ar: "تلميح", explainAr: "وجود مرشد عند الرجوع للخلف يقلل من خطر الاصطدام لأنه يساعدك على رؤية المناطق التي لا يمكنك رؤيتها من داخل المركبة، مما يمنع الاصطدام مع المركبات أو الأشياء الأخرى." }
    ]
  },

  {
    id: "AL-05",
    topic: "alertness",
    promptEn: "A curved arrow marking on the road indicates what?",
    promptAr: "ماذا تعني علامة السهم المنحني على الطريق؟",
    image: "/theory-images/signs/signs_q049_road-surface-arrow-left.png",
    options: [
      { en: "Heavy vehicles turn left", ar: "المركبات الثقيلة تنعطف يساراً", correct: false },
      { en: "Road bends left ahead", ar: "الطريق ينحني يساراً أمامك", correct: true },
      { en: "Move back to left lane", ar: "ارجع إلى المسار الأيسر", correct: false },
      { en: "Road camber changes", ar: "تغيير انحناء الطريق", correct: false }
    ],
    keywords: [
      { term: "curved arrow", ar: "سهم منحني", explainAr: "السهم المنحني يحذر من المنعطفات." },
      { term: "hint", ar: "تلميح", explainAr: "الأسهم المنحنية على الطريق تحذر من المنعطفات القادمة لأنها تشير إلى أن الطريق سينحني في اتجاه معين، مما يتطلب منك تقليل السرعة والاستعداد للمنعطف." }
    ]
  },

  {
    id: "AL-06",
    topic: "alertness",
    promptEn: "Where should you avoid overtaking other vehicles?",
    promptAr: "أين يجب تجنب التجاوز؟",
    options: [
      { en: "One-way streets", ar: "شوارع ذات اتجاه واحد", correct: false },
      { en: "Dual carriageways", ar: "طرق مزدوجة", correct: false },
      { en: "Just after bends or dips", ar: "مباشرة بعد المنعطفات أو الانخفاضات", correct: true },
      { en: "Wide open roads", ar: "طرق واسعة مفتوحة", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "التجاوز يتطلب رؤية واضحة." },
      { term: "hint", ar: "تلميح", explainAr: "الرؤية المحدودة تزيد من الخطر لأنك لا تستطيع رؤية المركبات القادمة أو المخاطر الأخرى في الوقت المناسب، مما يقلل من وقت رد الفعل ويزيد من احتمال الاصطدام." }
    ]
  },

  {
    id: "AL-07",
    topic: "alertness",
    promptEn: "What should you do before slowing down or stopping?",
    promptAr: "ماذا يجب أن تفعل قبل الإبطاء أو التوقف؟",
    options: [
      { en: "Sound horn", ar: "استخدم البوق", correct: false },
      { en: "Check mirrors", ar: "افحص المرايا", correct: true },
      { en: "Change gear", ar: "غير الغيار", correct: false },
      { en: "Flash headlights", ar: "ومض الأضواء", correct: false }
    ],
    keywords: [
      { term: "mirrors", ar: "المرايا", explainAr: "فحص المرايا ضروري قبل أي تغيير." },
      { term: "hint", ar: "تلميح", explainAr: "المرايا تظهر حركة المرور خلفك لأنها تسمح لك بمراقبة المركبات القادمة من الخلف قبل الإبطاء أو التوقف، مما يمنع الاصطدامات الخلفية." }
    ]
  },

  {
    id: "AL-08",
    topic: "alertness",
    promptEn: "How should you pass a cyclist safely on the road?",
    promptAr: "كيف تتجاوز دراجًا بأمان؟",
    options: [
      { en: "Sound the horn", ar: "استخدم البوق", correct: false },
      { en: "Pass closely", ar: "تجاوز عن قرب", correct: false },
      { en: "Leave plenty of space", ar: "اترك مسافة كافية", correct: true },
      { en: "Accelerate past", ar: "اسرع عند التجاوز", correct: false }
    ],
    keywords: [
      { term: "cyclist", ar: "دراج", explainAr: "الدراجون يحتاجون مسافة آمنة." },
      { term: "hint", ar: "تلميح", explainAr: "ترك مسافة كافية يحمي الدراجين لأنها تمنحهم مساحة آمنة للحركة وتجنب الرياح القوية من مركبتك، مما يقلل من خطر سقوطهم أو اصطدامهم." }
    ]
  },

  {
    id: "AL-09",
    topic: "alertness",
    promptEn: "What is a 'blind spot'?",
    promptAr: "ما المقصود بـ \"النقطة العمياء\"؟",
    options: [
      { en: "Seen in right mirror", ar: "تظهر في المرآة اليمنى", correct: false },
      { en: "Not lit by headlights", ar: "غير مضاءة بالأضواء", correct: false },
      { en: "Seen in left mirror", ar: "تظهر في المرآة اليسرى", correct: false },
      { en: "Area not visible to the driver", ar: "منطقة غير مرئية للسائق", correct: true }
    ],
    keywords: [
      { term: "blind spot", ar: "النقطة العمياء", explainAr: "منطقة لا تظهر في المرايا." },
      { term: "hint", ar: "تلميح", explainAr: "المرايا لا تظهر كل شيء لأنها تحتوي على نقاط عمياء حيث لا يمكنك رؤية المركبات أو الأشياء الأخرى، مما يتطلب منك النظر مباشرة قبل تغيير الاتجاه." }
    ]
  },

  {
    id: "AL-10",
    topic: "alertness",
    promptEn: "Traffic lights ahead have been green for some time. What should you do?",
    promptAr: "كانت الإشارة خضراء لفترة، ماذا تفعل؟",
    options: [
      { en: "Accelerate", ar: "اسرع", correct: false },
      { en: "Maintain speed", ar: "حافظ على السرعة", correct: false },
      { en: "Be ready to stop", ar: "كن مستعداً للتوقف", correct: true },
      { en: "Brake hard", ar: "افرمل بقوة", correct: false }
    ],
    keywords: [
      { term: "traffic lights", ar: "إشارات المرور", explainAr: "إشارات المرور قد تتغير." },
      { term: "hint", ar: "تلميح", explainAr: "الإشارات الضوئية قد تتغير قريباً لأنها كانت خضراء لفترة طويلة، مما يعني أنها على وشك التحول إلى اللون الأحمر، لذلك يجب أن تكون مستعداً للتوقف." }
    ]
  },

  {
    id: "AL-11",
    topic: "alertness",
    promptEn: "Why should you keep a safe distance behind a large vehicle?",
    promptAr: "لماذا يجب ترك مسافة آمنة خلف مركبة كبيرة؟",
    options: [
      { en: "Better cornering", ar: "منعطفات أفضل", correct: false },
      { en: "Easier stopping", ar: "توقف أسهل", correct: false },
      { en: "To be seen by the driver", ar: "لكي يراك السائق", correct: true },
      { en: "Avoid wind", ar: "تجنب الرياح", correct: false }
    ],
    keywords: [
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الآمنة مهمة." },
      { term: "hint", ar: "تلميح", explainAr: "المركبات الكبيرة تحجب الرؤية لأنها كبيرة الحجم وتمنعك من رؤية ما أمامها، لذلك يجب أن تترك مسافة كافية لرؤية سائق المركبة الكبيرة في المرآة، مما يضمن أنه يراك." }
    ]
  },

  {
    id: "AL-12",
    topic: "alertness",
    promptEn: "When may you legally use a hand-held mobile phone while driving?",
    promptAr: "متى يُسمح قانونيًا باستخدام الهاتف باليد؟",
    options: [
      { en: "Receiving a call", ar: "استقبال مكالمة", correct: false },
      { en: "Driving slowly", ar: "القيادة ببطء", correct: false },
      { en: "Automatic transmission", ar: "ناقل حركة أوتوماتيكي", correct: false },
      { en: "When parked safely", ar: "عند الوقوف بأمان", correct: true }
    ],
    keywords: [
      { term: "mobile phone", ar: "هاتف محمول", explainAr: "استخدام الهاتف أثناء القيادة محظور." },
      { term: "hint", ar: "تلميح", explainAr: "يجب أن تكون المركبة متوقفة تماماً لأن استخدام الهاتف المحمول أثناء القيادة محظور قانونياً لأنه يشتت الانتباه ويزيد من خطر الحوادث بشكل كبير." }
    ]
  },

  {
    id: "AL-13",
    topic: "alertness",
    promptEn: "What's most likely to distract you while driving?",
    promptAr: "ما أكثر ما يشتت السائق؟",
    options: [
      { en: "Windscreen wipers", ar: "مساحات الزجاج الأمامي", correct: false },
      { en: "Demisters", ar: "أجهزة إزالة الضباب", correct: false },
      { en: "Mirrors", ar: "المرايا", correct: false },
      { en: "Mobile phone use", ar: "استخدام الهاتف المحمول", correct: true }
    ],
    keywords: [
      { term: "distraction", ar: "إلهاء", explainAr: "الإلهاء خطر أثناء القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "الهواتف تقسم الانتباه لأنها تتطلب التركيز على المحادثة بدلاً من التركيز الكامل على القيادة والطريق، مما يقلل من وقت رد الفعل ويزيد من خطر الحوادث." }
    ]
  },

  {
    id: "AL-14",
    topic: "alertness",
    promptEn: "Why can objects hanging from the interior mirror be dangerous?",
    promptAr: "لماذا تُعد الأشياء المعلقة بالمرايا خطرة؟",
    options: [
      { en: "Obstruct your view", ar: "تحجب رؤيتك", correct: true },
      { en: "Affect radio", ar: "تؤثر على الراديو", correct: false },
      { en: "Tangle visor", ar: "تشابك مظلة الشمس", correct: false },
      { en: "Mist windscreen", ar: "ضباب الزجاج الأمامي", correct: false }
    ],
    keywords: [
      { term: "interior mirror", ar: "المرآة الداخلية", explainAr: "المرآة الداخلية مهمة للرؤية." },
      { term: "hint", ar: "تلميح", explainAr: "الرؤية الواضحة ضرورية لأن أي عائق في الرؤية يمنعك من رؤية المخاطر والمركبات الأخرى في الوقت المناسب، مما يزيد من خطر الحوادث." }
    ]
  },

  {
    id: "AL-15",
    topic: "alertness",
    promptEn: "What should you check before making a U-turn?",
    promptAr: "ماذا يجب التحقق منه قبل الالتفاف U؟",
    options: [
      { en: "Arm signal", ar: "إشارة الذراع", correct: false },
      { en: "Gear selection", ar: "اختيار الغيار", correct: false },
      { en: "Road markings allow it", ar: "علامات الطريق تسمح بذلك", correct: true },
      { en: "Shoulder check", ar: "فحص الكتف", correct: false }
    ],
    keywords: [
      { term: "U-turn", ar: "التفاف U", explainAr: "الالتفاف U ليس مسموحاً في كل مكان." },
      { term: "hint", ar: "تلميح", explainAr: "الانعطاف على شكل حرف U غير مسموح في كل مكان لأن بعض الطرق تحتوي على علامات تحظر ذلك، والقيام بذلك في أماكن غير مسموحة يعرضك لخطر الاصطدام مع المركبات القادمة." }
    ]
  },

  {
    id: "AL-16",
    topic: "alertness",
    promptEn: "Your phone rings while driving. What should you do?",
    promptAr: "يرن الهاتف أثناء القيادة، ماذا تفعل؟",
    options: [
      { en: "Answer immediately", ar: "أجب فوراً", correct: false },
      { en: "Stop suddenly", ar: "توقف فجأة", correct: false },
      { en: "Pull over safely first", ar: "توقف بأمان أولاً", correct: true },
      { en: "Answer while moving", ar: "أجب أثناء الحركة", correct: false }
    ],
    keywords: [
      { term: "phone", ar: "هاتف", explainAr: "استخدام الهاتف أثناء القيادة خطر." },
      { term: "hint", ar: "تلميح", explainAr: "التوقف بأمان قبل الإجابة ضروري لأن استخدام الهاتف أثناء القيادة محظور قانونياً ويشكل خطراً كبيراً، لذلك يجب التوقف في مكان آمن أولاً." }
    ]
  },

  {
    id: "AL-17",
    topic: "alertness",
    promptEn: "Before turning right onto a dual carriageway, what should you check?",
    promptAr: "قبل الانعطاف يمينًا إلى طريق مزدوج، ماذا تتحقق؟",
    options: [
      { en: "Parking brake", ar: "فرامل الوقوف", correct: false },
      { en: "Left position", ar: "الموضع الأيسر", correct: false },
      { en: "Central reservation width", ar: "عرض الحاجز الأوسط", correct: true },
      { en: "Space behind", ar: "المسافة خلفك", correct: false }
    ],
    keywords: [
      { term: "dual carriageway", ar: "طريق مزدوج", explainAr: "الطرق المزدوجة تتطلب حذراً." },
      { term: "hint", ar: "تلميح", explainAr: "يجب أن تتسع مركبتك بأمان في الحاجز الأوسط لأن الحواجز الوسطى في الطرق المزدوجة قد تكون ضيقة، والتحقق من العرض يمنع الاصطدام بالحواجز أو المركبات الأخرى." }
    ]
  },

  {
    id: "AL-18",
    topic: "alertness",
    promptEn: "What should you do before moving off from behind a parked car?",
    promptAr: "ماذا تفعل قبل التحرك من خلف سيارة متوقفة؟",
    options: [
      { en: "Signal after moving", ar: "أشر بعد التحرك", correct: false },
      { en: "Look around first", ar: "انظر حولك أولاً", correct: true },
      { en: "Mirrors only", ar: "المرايا فقط", correct: false },
      { en: "Look after moving", ar: "انظر بعد التحرك", correct: false }
    ],
    keywords: [
      { term: "parked car", ar: "سيارة متوقفة", explainAr: "السيارات المتوقفة قد تحجب الرؤية." },
      { term: "hint", ar: "تلميح", explainAr: "التحقق من جميع الاتجاهات ضروري قبل التحرك من خلف سيارة متوقفة لأن المركبات أو المشاة قد يكونون قادمين من أي اتجاه، والتحقق الشامل يمنع الاصطدامات." }
    ]
  },

  {
    id: "AL-19",
    topic: "alertness",
    promptEn: "On a wet road, what should you do if you must stop in an emergency?",
    promptAr: "على طريق مبلل، ماذا تفعل عند التوقف الطارئ؟",
    options: [
      { en: "Parking brake", ar: "فرامل الوقوف", correct: false },
      { en: "Both hands on wheel", ar: "كلتا اليدين على المقود", correct: true },
      { en: "Reverse gear", ar: "غيار الرجوع", correct: false },
      { en: "Arm signal", ar: "إشارة الذراع", correct: false }
    ],
    keywords: [
      { term: "wet road", ar: "طريق مبلل", explainAr: "الطرق المبللة تتطلب حذراً." },
      { term: "hint", ar: "تلميح", explainAr: "الحفاظ على السيطرة على المقود ضروري في التوقف الطارئ على طريق مبلل لأن الطرق المبللة تقلل من الجر، واستخدام كلتا اليدين على المقود يمنع فقدان السيطرة والانزلاق." }
    ]
  },

  {
    id: "AL-20",
    topic: "alertness",
    promptEn: "Your view at a junction is blocked by parked vehicles. What should you do?",
    promptAr: "الرؤية محجوبة عند تقاطع، ماذا تفعل؟",
    options: [
      { en: "Move quickly", ar: "تحرك بسرعة", correct: false },
      { en: "Edge forward slowly and carefully", ar: "تقدم ببطء وحذر", correct: true },
      { en: "Ask pedestrians", ar: "اسأل المشاة", correct: false },
      { en: "Turn around", ar: "استدر", correct: false }
    ],
    keywords: [
      { term: "junction", ar: "تقاطع", explainAr: "التقاطعات تتطلب رؤية واضحة." },
      { term: "hint", ar: "تلميح", explainAr: "التقدم تدريجياً لتحسين الرؤية آمن لأن المركبات المتوقفة تحجب الرؤية عند التقاطعات، والتقدم ببطء يسمح لك برؤية حركة المرور القادمة تدريجياً دون المخاطرة بالاصطدام." }
    ]
  },

  {
    id: "AL-21",
    topic: "alertness",
    promptEn: "As you approach a bridge on a narrow road, what should you do?",
    promptAr: "عند الاقتراب من جسر ضيق، ماذا تفعل؟",
    options: [
      { en: "Move right", ar: "تحرك يميناً", correct: false },
      { en: "Change gear", ar: "غير الغيار", correct: false },
      { en: "Slow down", ar: "خفف السرعة", correct: true },
      { en: "Keep 30 mph", ar: "حافظ على 30 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "narrow bridge", ar: "جسر ضيق", explainAr: "الجسور الضيقة تتطلب حذراً." },
      { term: "hint", ar: "تلميح", explainAr: "الجسور الضيقة تقلل من المساحة المتاحة لأنها أضيق من الطريق العادي، مما يتطلب تقليل السرعة للسماح للمركبات القادمة من الاتجاه المعاكس بالمرور بأمان." }
    ]
  },

  {
    id: "AL-22",
    topic: "alertness",
    promptEn: "When do windscreen pillars most seriously restrict your view?",
    promptAr: "متى تعيق أعمدة الزجاج الأمامي الرؤية؟",
    options: [
      { en: "Motorways", ar: "الطرق السريعة", correct: false },
      { en: "Dual carriageways", ar: "الطرق المزدوجة", correct: false },
      { en: "Bends and junctions", ar: "المنعطفات والتقاطعات", correct: true },
      { en: "One-way streets", ar: "شوارع ذات اتجاه واحد", correct: false }
    ],
    keywords: [
      { term: "windscreen pillars", ar: "أعمدة الزجاج الأمامي", explainAr: "أعمدة الزجاج قد تحجب الرؤية." },
      { term: "hint", ar: "تلميح", explainAr: "زوايا الانعطاف تخفي المخاطر لأن أعمدة الزجاج الأمامي تحجب الرؤية عند الانعطافات والتقاطعات، مما يمنعك من رؤية المركبات أو المشاة القادمين من الجانبين في الوقت المناسب." }
    ]
  },

  {
    id: "AL-23",
    topic: "alertness",
    promptEn: "Why should you check your mirrors when a hazard appears ahead?",
    promptAr: "لماذا تفحص المرايا عند وجود خطر أمامك؟",
    options: [
      { en: "Accelerate", ar: "اسرع", correct: false },
      { en: "Assess traffic behind", ar: "قيم حركة المرور خلفك", correct: true },
      { en: "Brake sharply", ar: "افرمل بقوة", correct: false },
      { en: "Check ahead only", ar: "افحص الأمام فقط", correct: false }
    ],
    keywords: [
      { term: "hazard", ar: "خطر", explainAr: "المخاطر تتطلب فحصاً شاملاً." },
      { term: "hint", ar: "تلميح", explainAr: "الآخرون قد يتأثرون لأن وجود خطر أمامك قد يتطلب منك الإبطاء أو التوقف فجأة، والتحقق من المرايا يسمح لك بتقييم حركة المرور خلفك وتجنب الاصطدامات الخلفية." }
    ]
  },

  {
    id: "AL-24",
    topic: "alertness",
    promptEn: "Why are transverse yellow road markings painted across the road?",
    promptAr: "لماذا تُرسم الخطوط الصفراء العرضية؟",
    image: "/theory-images/signs/signs_q083_diagonal-white-lines-hazard-warning.png",
    options: [
      { en: "Lane selection", ar: "اختيار المسار", correct: false },
      { en: "Separation distance", ar: "مسافة الفصل", correct: false },
      { en: "Speed awareness", ar: "الوعي بالسرعة", correct: true },
      { en: "Roundabout distance", ar: "مسافة الدوار", correct: false }
    ],
    keywords: [
      { term: "yellow markings", ar: "علامات صفراء", explainAr: "العلامات الصفراء تحذر من السرعة." },
      { term: "hint", ar: "تلميح", explainAr: "الخطوط الصفراء العرضية تحذر من السرعة لأنها ترسم عبر الطريق في المناطق الخطرة مثل المنعطفات الحادة أو التلال، مما يذكر السائقين بضرورة تقليل السرعة لسلامتهم." }
    ]
  },

  {
    id: "AL-25",
    topic: "alertness",
    promptEn: "On a long motorway journey, what should you do if you feel sleepy?",
    promptAr: "في رحلة طويلة، ماذا تفعل عند الشعور بالنعاس؟",
    options: [
      { en: "Loud music", ar: "موسيقى عالية", correct: false },
      { en: "Stop on hard shoulder", ar: "توقف على الكتف الصلب", correct: false },
      { en: "Drive faster", ar: "اسرع", correct: false },
      { en: "Leave motorway and rest safely", ar: "اترك الطريق السريع واسترح بأمان", correct: true }
    ],
    keywords: [
      { term: "sleepy", ar: "نعاس", explainAr: "النعاس خطر أثناء القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "الراحة تستعيد اليقظة لأن النعاس يقلل من التركيز ووقت رد الفعل بشكل خطير، والراحة تسمح لك بالتعافي واستعادة القدرة على القيادة بأمان." }
    ]
  },

  {
    id: "AL-26",
    topic: "alertness",
    promptEn: "When emerging from a junction with a blocked view, who should you watch for most carefully?",
    promptAr: "عند الخروج من تقاطع برؤية محجوبة، من تنتبه له أكثر؟",
    options: [
      { en: "Lorries", ar: "الشاحنات", correct: false },
      { en: "Buses", ar: "الحافلات", correct: false },
      { en: "Motorcyclists", ar: "سائقي الدراجات النارية", correct: true },
      { en: "Coaches", ar: "الحافلات السياحية", correct: false }
    ],
    keywords: [
      { term: "emerging", ar: "الخروج", explainAr: "الخروج من التقاطع يتطلب حذراً." },
      { term: "hint", ar: "تلميح", explainAr: "المركبات الأصغر حجماً يصعب رؤيتها لأنها أصغر من المركبات الكبيرة مثل الشاحنات والحافلات، مما يجعلها أكثر عرضة للاصطدام عند الخروج من التقاطعات، خاصة الدراجات النارية." }
    ]
  },

  // --- HAZARD AWARENESS ---

  {
    id: "HZ-01",
    topic: "hazard-awareness",
    promptEn: "Why should you reduce your speed when the road ahead becomes narrower?",
    promptAr: "لماذا يجب أن تقلل سرعتك عندما يصبح الطريق أمامك أضيق؟",
    options: [
      { en: "Because there is a staggered junction ahead", ar: "لأن هناك تقاطع متدرج أمامك", correct: false },
      { en: "Because there's less room for error and vehicles passing safely", ar: "لأن المساحة تصبح أقل لمرور المركبات بأمان", correct: true },
      { en: "Because the surface suddenly changes", ar: "لأن سطح الطريق يتغير فجأة", correct: false },
      { en: "Because a low bridge is coming", ar: "لأن جسراً منخفضاً قادم", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-01", ar: "تلميح", explainAr: "تخفيف السرعة عند ضيق الطريق يمنحك وقتاً أطول للتفاعل بأمان، مما يقلل من خطر الحوادث." }
    ]
  },

  {
    id: "HZ-02",
    topic: "hazard-awareness",
    promptEn: "As you approach a cyclist near a junction, what should you do?",
    promptAr: "عندما تقترب من دراج قرب تقاطع، ماذا يجب أن تفعل؟",
    options: [
      { en: "Try to pass before the cyclist reaches the junction", ar: "حاول التجاوز قبل وصول الدراج للتقاطع", correct: false },
      { en: "Flash your headlights to warn them", ar: "ومض بأضواء سيارتك لتحذيرهم", correct: false },
      { en: "Reduce speed and allow the cyclist to complete the turn", ar: "خفف السرعة واسمح للدراج بإكمال المنعطف", correct: true },
      { en: "Rev your engine so they notice you", ar: "أسرع محركك ليلاحظوك", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-02", ar: "تلميح", explainAr: "إعطاء الدراج الوقت والمساحة الكافية يمنع الحوادث عند التقاطعات لأنه يسمح لهم بإكمال منعطفاتهم بأمان." }
    ]
  },

  {
    id: "HZ-03",
    topic: "hazard-awareness",
    promptEn: "You're waiting at a junction and parked vehicles restrict your view. What can help you judge approaching traffic?",
    promptAr: "أنت تنتظر عند تقاطع والمركبات المتوقفة تقيد رؤيتك. ماذا يمكن أن يساعدك في الحكم على حركة المرور القادمة؟",
    options: [
      { en: "Watching traffic behind you", ar: "مراقبة حركة المرور خلفك", correct: false },
      { en: "Using reflections in nearby windows", ar: "استخدام الانعكاسات في النوافذ القريبة", correct: true },
      { en: "Making eye contact with pedestrians", ar: "إجراء اتصال بصري مع المشاة", correct: false },
      { en: "Checking only your interior mirror", ar: "فحص مرآة الداخلية فقط", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-03", ar: "تلميح", explainAr: "استخدام الانعكاسات في النوافذ القريبة يساعدك على رؤية حركة المرور التي لا يمكنك رؤيتها مباشرة بسبب المركبات المتوقفة، مما يحسن من قدرتك على اتخاذ قرارات آمنة." }
    ]
  },

  {
    id: "HZ-04",
    topic: "hazard-awareness",
    promptEn: "If your eyesight has worsened and no longer meets legal driving standards, what must you do?",
    promptAr: "إذا تدهورت بصرك ولم تعد تلبي معايير القيادة القانونية، ماذا يجب أن تفعل؟",
    options: [
      { en: "Inform the licensing authority", ar: "أبلغ سلطة الترخيص", correct: true },
      { en: "Tell your optician only", ar: "أخبر طبيب العيون فقط", correct: false },
      { en: "Contact the police", ar: "اتصل بالشرطة", correct: false },
      { en: "Speak to your doctor and continue driving", ar: "تحدث مع طبيبك واستمر في القيادة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-04", ar: "تلميح", explainAr: "إبلاغ سلطة الترخيص عند تدهور البصر يحافظ على سلامة الجميع على الطريق لأنه يضمن أن السائقين يستوفون المعايير القانونية للرؤية." }
    ]
  },

  {
    id: "HZ-05",
    topic: "hazard-awareness",
    promptEn: "Which of the following would seriously distract you while driving?",
    promptAr: "أي مما يلي سيشتت انتباهك بشكل خطير أثناء القيادة؟",
    options: [
      { en: "Reading a road map", ar: "قراءة خريطة طريق", correct: true },
      { en: "Using the demister", ar: "استخدام مزيل الضباب", correct: false },
      { en: "Operating windscreen washers", ar: "تشغيل منظفات الزجاج الأمامي", correct: false },
      { en: "Checking your door mirror", ar: "فحص مرآة الباب", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-05", ar: "تلميح", explainAr: "قراءة خريطة الطريق تأخذ عينيك عن الطريق وتشتت انتباهك، مما يزيد من خطر الحوادث لأنك لا تراقب حركة المرور والطريق أمامك." }
    ]
  },

  {
    id: "HZ-06",
    topic: "hazard-awareness",
    promptEn: "Red warning lights begin flashing as you approach a level crossing. What should you do?",
    promptAr: "تبدأ أضواء التحذير الحمراء بالوميض عند اقترابك من معبر سكة حديد. ماذا يجب أن تفعل؟",
    options: [
      { en: "Cross quickly before barriers lower", ar: "اعبر بسرعة قبل أن تنخفض الحواجز", correct: false },
      { en: "Continue carefully across", ar: "استمر بعناية عبر المعبر", correct: false },
      { en: "Stop before reaching the barrier", ar: "توقف قبل الوصول للحاجز", correct: true },
      { en: "Switch on hazard lights and continue", ar: "شغل أضواء الخطر واستمر", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-06", ar: "تلميح", explainAr: "التوقف عند إشارات التحذير الحمراء يمنع حوادث خطيرة مع القطارات لأن القطارات لا يمكنها التوقف بسرعة وتحتاج إلى مسافة طويلة للتوقف." }
    ]
  },

  {
    id: "HZ-07",
    topic: "hazard-awareness",
    promptEn: "You're driving on a multi-lane road. What do overhead lane signals showing a red cross mean?",
    promptAr: "أنت تقود على طريق متعدد المسارات. ماذا تعني إشارات المسار العلوية التي تظهر صليباً أحمر؟",
    options: [
      { en: "The right lanes are open", ar: "المسارات اليمنى مفتوحة", correct: false },
      { en: "The left lanes are open", ar: "المسارات اليسرى مفتوحة", correct: false },
      { en: "Vehicles in the left lanes must stop", ar: "المركبات في المسارات اليسرى يجب أن تتوقف", correct: false },
      { en: "Vehicles in the right lanes must stop", ar: "المركبات في المسارات اليمنى يجب أن تتوقف", correct: true }
    ],
    keywords: [
      { term: "hint-HZ-07", ar: "تلميح", explainAr: "الصليب الأحمر يعني أن المسار مغلق ويجب التوقف لأن استخدام مسار مغلق يعرضك لخطر الاصطدام مع المركبات أو العوائق في ذلك المسار." }
    ]
  },

  {
    id: "HZ-08",
    topic: "hazard-awareness",
    promptEn: "What should you do if you start to feel tired while driving on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا بدأت تشعر بالتعب أثناء القيادة على طريق سريع؟",
    options: [
      { en: "Stop on the hard shoulder and swap drivers", ar: "توقف على الكتف الصلب وبدل السائقين", correct: false },
      { en: "Leave at the next exit and take a break", ar: "اخرج عند المخرج التالي وخذ استراحة", correct: true },
      { en: "Increase speed and raise radio volume", ar: "زد السرعة وارفع صوت الراديو", correct: false },
      { en: "Close windows and turn the heater up", ar: "أغلق النوافذ وارفع التدفئة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-08", ar: "تلميح", explainAr: "أخذ استراحة عند الشعور بالتعب يمنع الحوادث الناتجة عن النعاس لأن التعب يقلل من رد الفعل والتركيز، مما يزيد من خطر فقدان السيطرة على المركبة." }
    ]
  },

  {
    id: "HZ-09",
    topic: "hazard-awareness",
    promptEn: "Why must a junction on the left be kept clear?",
    promptAr: "لماذا يجب أن يبقى التقاطع على اليسار خالياً؟",
    options: [
      { en: "To allow vehicles to enter and exit safely", ar: "للسماح للمركبات بالدخول والخروج بأمان", correct: true },
      { en: "To allow buses to reverse", ar: "للسماح للحافلات بالرجوع للخلف", correct: false },
      { en: "To permit U-turns", ar: "للسماح بالانعطاف على شكل حرف U", correct: false },
      { en: "To allow parking", ar: "للسماح بالوقوف", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-09", ar: "تلميح", explainAr: "الحفاظ على التقاطع خالياً يمنح المركبات مساحة آمنة للدخول والخروج، مما يمنع الحوادث ويضمن تدفق حركة المرور بسلاسة." }
    ]
  },

  {
    id: "HZ-10",
    topic: "hazard-awareness",
    promptEn: "You're behind a cyclist at traffic lights. When the lights change, what should you do?",
    promptAr: "أنت خلف دراج عند إشارات المرور. عندما تتغير الإشارات، ماذا يجب أن تفعل؟",
    options: [
      { en: "Move off quickly before the cyclist", ar: "انطلق بسرعة قبل الدراج", correct: false },
      { en: "Give the cyclist time and space", ar: "امنح الدراج الوقت والمساحة", correct: true },
      { en: "Turn right immediately", ar: "انعطف يميناً فوراً", correct: false },
      { en: "Sound the horn and continue", ar: "استخدم البوق واستمر", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-10", ar: "تلميح", explainAr: "إعطاء الدراج الوقت والمساحة يمنع الحوادث عند إشارات المرور لأنه يسمح لهم بالانطلاق بأمان دون الضغط عليهم أو التسبب في اصطدام." }
    ]
  },

  {
    id: "HZ-11",
    topic: "hazard-awareness",
    promptEn: "What is the most likely hazard a driver should watch for when passing a bus that has stopped at the roadside?",
    promptAr: "ما هو الخطر الأكثر احتمالاً الذي يجب أن ينتبه له السائق عند تجاوز حافلة متوقفة على جانب الطريق؟",
    options: [
      { en: "The black car stopping suddenly", ar: "السيارة السوداء التي تتوقف فجأة", correct: false },
      { en: "Oncoming traffic assuming a right turn", ar: "حركة المرور القادمة التي تفترض انعطافاً يميناً", correct: false },
      { en: "A bus pulling out unexpectedly", ar: "حافلة تخرج بشكل غير متوقع", correct: true },
      { en: "Sun glare affecting vision", ar: "وهج الشمس الذي يؤثر على الرؤية", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-11", ar: "تلميح", explainAr: "الحافلات المتوقفة قد تخرج فجأة بعد صعود أو نزول الركاب، مما يعرضك لخطر الاصطدام إذا لم تكن مستعداً أو كنت تحاول التجاوز." }
    ]
  },

  {
    id: "HZ-12",
    topic: "hazard-awareness",
    promptEn: "Which vehicle commonly uses an amber flashing beacon on a dual carriageway?",
    promptAr: "أي مركبة تستخدم عادة منارة وميضية صفراء على طريق مزدوج؟",
    options: [
      { en: "Ambulance", ar: "سيارة إسعاف", correct: false },
      { en: "Fire engine", ar: "سيارة إطفاء", correct: false },
      { en: "Doctor's car", ar: "سيارة طبيب", correct: false },
      { en: "Tractor", ar: "جرار", correct: true }
    ],
    keywords: [
      { term: "hint-HZ-12", ar: "تلميح", explainAr: "الجرارات البطيئة تستخدم منارة صفراء لتحذير السائقين الآخرين لأنها تتحرك ببطء شديد وقد تسبب اصطدامات إذا لم ينتبه السائقون الآخرون في الوقت المناسب." }
    ]
  },

  {
    id: "HZ-13",
    topic: "hazard-awareness",
    promptEn: "You realise you're going the wrong way on a one-way street. What should you do?",
    promptAr: "تدرك أنك تسير في الاتجاه الخاطئ على شارع باتجاه واحد. ماذا يجب أن تفعل؟",
    options: [
      { en: "Reverse back out", ar: "ارجع للخلف للخروج", correct: false },
      { en: "Turn around in a side road", ar: "استدر في طريق جانبي", correct: false },
      { en: "Continue and find another route", ar: "استمر وابحث عن طريق آخر", correct: true },
      { en: "Reverse into a driveway", ar: "ارجع للخلف إلى ممر خاص", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-13", ar: "تلميح", explainAr: "الاستمرار والبحث عن طريق آخر أكثر أماناً من الرجوع للخلف لأن الرجوع للخلف في شارع باتجاه واحد يعرضك لخطر الاصطدام مع المركبات القادمة من الخلف التي لا تتوقع وجودك." }
    ]
  },

  {
    id: "HZ-14",
    topic: "hazard-awareness",
    promptEn: "Why are two-way roads with three lanes particularly dangerous?",
    promptAr: "لماذا تعتبر الطرق ثنائية الاتجاه ذات الثلاث مسارات خطيرة بشكل خاص؟",
    options: [
      { en: "Traffic from both directions may overtake using the middle lane", ar: "حركة المرور من كلا الاتجاهين قد تتجاوز باستخدام المسار الأوسط", correct: true },
      { en: "Vehicles travel faster in poor weather", ar: "المركبات تسير أسرع في الطقس السيء", correct: false },
      { en: "Overtaking happens on the left", ar: "التجاوز يحدث على اليسار", correct: false },
      { en: "The middle lane is only for emergencies", ar: "المسار الأوسط مخصص للطوارئ فقط", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-14", ar: "تلميح", explainAr: "المسار الأوسط المشترك يزيد خطر الاصطدام الأمامي لأن المركبات من كلا الاتجاهين قد تستخدم نفس المسار للتجاوز في نفس الوقت، مما يؤدي إلى اصطدامات مباشرة." }
    ]
  },

  {
    id: "HZ-15",
    topic: "hazard-awareness",
    promptEn: "At a junction with a stop line, what must you do?",
    promptAr: "عند تقاطع مع خط توقف، ماذا يجب أن تفعل؟",
    options: [
      { en: "Stop behind the line, then edge forward to see clearly", ar: "توقف خلف الخط، ثم تقدم ببطء لترى بوضوح", correct: true },
      { en: "Stop beyond the line", ar: "توقف بعد الخط", correct: false },
      { en: "Stop only if traffic is present", ar: "توقف فقط إذا كانت هناك حركة مرور", correct: false },
      { en: "Stop only when turning right", ar: "توقف فقط عند الانعطاف يميناً", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-15", ar: "تلميح", explainAr: "التوقف خلف خط التوقف ثم التقدم ببطء يمنحك رؤية آمنة للتقاطع لأنه يسمح لك برؤية حركة المرور القادمة من جميع الاتجاهات قبل اتخاذ قرار بالانعطاف أو المتابعة." }
    ],
    image: "/theory-images/signs/signs_q073_stop-line-solid-white.png"
  },

  {
    id: "HZ-16",
    topic: "hazard-awareness",
    promptEn: "As you approach a pedestrian crossing, what should you do?",
    promptAr: "عندما تقترب من معبر مشاة، ماذا يجب أن تفعل؟",
    options: [
      { en: "Maintain speed", ar: "حافظ على السرعة", correct: false },
      { en: "Use the horn", ar: "استخدم البوق", correct: false },
      { en: "Drive through quickly", ar: "اعبر بسرعة", correct: false },
      { en: "Slow down and be ready to stop", ar: "خفف السرعة وكن مستعداً للتوقف", correct: true }
    ],
    keywords: [
      { term: "hint-HZ-16", ar: "تلميح", explainAr: "التخفيف والاستعداد للتوقف يمنحك وقتاً للتفاعل مع المشاة الذين قد يعبرون الطريق بشكل غير متوقع، مما يمنع الحوادث ويحمي حياتهم." }
    ]
  },

  {
    id: "HZ-17",
    topic: "hazard-awareness",
    promptEn: "Which road user is most likely to create a danger by blocking visibility near a junction?",
    promptAr: "أي مستخدم للطريق من المرجح أن يخلق خطراً من خلال حجب الرؤية بالقرب من تقاطع؟",
    options: [
      { en: "The pedestrian waiting", ar: "المشاة المنتظر", correct: false },
      { en: "The moving car", ar: "السيارة المتحركة", correct: false },
      { en: "The turning vehicle", ar: "المركبة المنعطفة", correct: false },
      { en: "The parked car", ar: "السيارة المتوقفة", correct: true }
    ],
    keywords: [
      { term: "hint-HZ-17", ar: "تلميح", explainAr: "السيارات المتوقفة تحجب الرؤية وتزيد خطر الحوادث عند التقاطعات لأنها تمنعك من رؤية حركة المرور القادمة من الاتجاهات الأخرى، مما يزيد من احتمال الاصطدام عند الانعطاف أو المتابعة." }
    ]
  },

  {
    id: "HZ-18",
    topic: "hazard-awareness",
    promptEn: "You're following a slow vehicle and there's a junction ahead on the right. What should you do?",
    promptAr: "أنت تتبع مركبة بطيئة وهناك تقاطع أمامك على اليمين. ماذا يجب أن تفعل؟",
    options: [
      { en: "Overtake before the junction", ar: "تجاوز قبل التقاطع", correct: false },
      { en: "Only overtake once past the junction", ar: "تجاوز فقط بعد تجاوز التقاطع", correct: true },
      { en: "Accelerate sharply to pass", ar: "أسرع بشكل حاد للتجاوز", correct: false },
      { en: "Prepare to overtake on the left", ar: "استعد للتجاوز على اليسار", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-18", ar: "تلميح", explainAr: "التجاوز بعد التقاطع يمنع الحوادث مع المركبات القادمة من التقاطع لأن التجاوز قبل التقاطع يعرضك لخطر الاصطدام مع المركبات التي قد تخرج من التقاطع فجأة." }
    ]
  },

  {
    id: "HZ-19",
    topic: "hazard-awareness",
    promptEn: "Traffic in the left-hand lane is slowing. What's the safest action?",
    promptAr: "حركة المرور في المسار الأيسر تتباطأ. ما الإجراء الأكثر أماناً؟",
    options: [
      { en: "Reduce speed and maintain safe distance", ar: "خفف السرعة وحافظ على مسافة آمنة", correct: true },
      { en: "Accelerate past traffic", ar: "أسرع لتجاوز حركة المرور", correct: false },
      { en: "Pull onto the verge", ar: "اسحب إلى الحافة", correct: false },
      { en: "Move right and continue", ar: "انتقل يميناً واستمر", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-19", ar: "تلميح", explainAr: "التخفيف والحفاظ على مسافة آمنة يمنحك وقتاً للتفاعل مع التباطؤ في حركة المرور لأنه يمنحك مسافة كافية للتوقف بأمان إذا توقفت المركبات أمامك فجأة." }
    ]
  },

  {
    id: "HZ-20",
    topic: "hazard-awareness",
    promptEn: "A police officer gives a hand signal to oncoming traffic. What does it mean?",
    promptAr: "ضابط شرطة يعطي إشارة يدوية لحركة المرور القادمة. ماذا تعني؟",
    options: [
      { en: "Proceed", ar: "تابع", correct: false },
      { en: "Stop", ar: "توقف", correct: true },
      { en: "Turn left", ar: "انعطف يساراً", correct: false },
      { en: "Turn right", ar: "انعطف يميناً", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-20", ar: "تلميح", explainAr: "إشارات ضابط الشرطة لها أولوية على إشارات المرور لأن ضباط الشرطة يمكنهم إدارة حركة المرور في حالات الطوارئ أو عند تعطل الإشارات، ويجب اتباع إشاراتهم دائماً." }
    ]
  },

  {
    id: "HZ-21",
    topic: "hazard-awareness",
    promptEn: "You've just had a heated argument and you feel angry. What should you do before you drive?",
    promptAr: "دخلت في شجار وشعرت بالغضب. ماذا يجب أن تفعل قبل القيادة؟",
    options: [
      { en: "Start driving to \"cool off\"", ar: "تبدأ القيادة لكي \"تهدأ\"", correct: false },
      { en: "Turn the radio up to distract yourself", ar: "ترفع صوت الراديو لتشتيت نفسك", correct: false },
      { en: "Have an alcoholic drink to relax", ar: "تشرب كحولاً للاسترخاء", correct: false },
      { en: "Wait until you've calmed down before setting off", ar: "تنتظر حتى تهدأ قبل الانطلاق", correct: true }
    ],
    keywords: [
      { term: "hint-HZ-21", ar: "تلميح", explainAr: "الغضب يقلل التركيز ويزيد خطر الحوادث لأنه يشتت الانتباه ويؤثر على قدرتك على اتخاذ قرارات سليمة ورد الفعل السريع، مما يعرضك والآخرين للخطر." }
    ]
  },

  {
    id: "HZ-22",
    topic: "hazard-awareness",
    promptEn: "You're approaching a junction on a country road and your view to the right is partly blocked by a hedge. Why should you slow down early?",
    promptAr: "تقترب من تقاطع على طريق ريفي ورؤيتك إلى اليمين محجوبة جزئياً بسياج/شجيرات. لماذا يجب أن تخفف السرعة مبكراً؟",
    options: [
      { en: "Because animals always cross here", ar: "لأن الحيوانات تعبر دائماً هنا", correct: false },
      { en: "Because there might be traffic you can't see until late", ar: "لأنه قد توجد حركة مرور لا تراها إلا متأخراً", correct: true },
      { en: "Because level crossings are common on rural roads", ar: "لأن معابر القطار شائعة في الطرق الريفية", correct: false },
      { en: "Because the speed limit automatically changes at junctions", ar: "لأن حد السرعة يتغير تلقائياً عند التقاطعات", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-22", ar: "تلميح", explainAr: "التخفيف المبكر يمنحك وقتاً للتفاعل مع المرور المخفي لأن السياج أو الشجيرات تحجب رؤيتك، والتخفيف مبكراً يمنحك وقتاً كافياً للتوقف أو تجنب المركبات التي قد تظهر فجأة." }
    ]
  },

  {
    id: "HZ-23",
    topic: "hazard-awareness",
    promptEn: "A car ahead begins reversing out of a driveway into the road. What should you do?",
    promptAr: "سيارة أمامك تبدأ بالرجوع للخلف من مدخل منزل إلى الطريق. ماذا يجب أن تفعل؟",
    options: [
      { en: "Speed up to pass before it blocks the road", ar: "تسرع لتتجاوز قبل أن تسد الطريق", correct: false },
      { en: "Sound the horn and keep going", ar: "تستخدم البوق وتكمل", correct: false },
      { en: "Be ready to stop and give way", ar: "تستعد للتوقف وتفسح الطريق", correct: true },
      { en: "Move to the opposite side at the same speed", ar: "تنتقل للجهة المقابلة بنفس السرعة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-23", ar: "تلميح", explainAr: "الاستعداد للتوقف يمنح المركبة الراجعة مساحة آمنة للخروج لأن المركبة التي ترجع للخلف قد لا تراك، وإعطاؤها المساحة يمنع الاصطدام ويسمح لها بإكمال مناورة الرجوع بأمان." }
    ]
  },

  {
    id: "HZ-24",
    topic: "hazard-awareness",
    promptEn: "Why are many door mirrors slightly curved?",
    promptAr: "لماذا تكون مرايا الأبواب غالباً منحنية قليلاً؟",
    options: [
      { en: "They make vehicles behind look larger", ar: "تجعل المركبات خلفك تبدو أكبر", correct: false },
      { en: "They give a wider field of view", ar: "تعطي مجال رؤية أوسع", correct: true },
      { en: "They remove the need to check blind spots", ar: "تلغي الحاجة لفحص النقطة العمياء", correct: false },
      { en: "They reduce glare from headlights", ar: "تقلل وهج الأضواء الأمامية", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-24", ar: "تلميح", explainAr: "المرايا المنحنية تعطي رؤية أوسع لكن تجعل الأشياء تبدو أبعد مما هي عليه في الواقع، لذلك يجب التحقق من النقطة العمياء مباشرة قبل تغيير الاتجاه لأن المركبات قد تكون أقرب مما تبدو في المرآة." }
    ]
  },

  {
    id: "HZ-25",
    topic: "hazard-awareness",
    promptEn: "You see a vehicle ahead displaying an amber flashing beacon. What should you expect?",
    promptAr: "ترى مركبة أمامك تشغّل ضوءاً أصفر وامضاً. ماذا يجب أن تتوقع؟",
    options: [
      { en: "It will be travelling faster than normal traffic", ar: "ستسير أسرع من المرور", correct: false },
      { en: "It may be slow-moving or doing work", ar: "قد تكون بطيئة أو تقوم بعمل على الطريق", correct: true },
      { en: "It has priority like an emergency vehicle", ar: "لها أولوية مثل مركبة طوارئ", correct: false },
      { en: "You must overtake it immediately", ar: "يجب تجاوزها فوراً", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-25", ar: "تلميح", explainAr: "المنارة الصفراء الوامضة تحذرك من مركبة بطيئة أو تعمل على الطريق لأن هذه المركبات تتحرك ببطء شديد أو قد تكون متوقفة، مما يتطلب منك تقليل السرعة والتجاوز بحذر." }
    ]
  },

  {
    id: "HZ-26",
    topic: "hazard-awareness",
    promptEn: "If a medical condition or poor health could affect your driving, what should you do?",
    promptAr: "إذا كانت حالة صحية قد تؤثر على قيادتك، ماذا يجب أن تفعل؟",
    options: [
      { en: "Keep driving and see if it improves", ar: "تتابع القيادة وترى إن تحسنت", correct: false },
      { en: "Tell the licensing authority (DVLA) if required", ar: "تبلغ جهة الترخيص (DVLA) إذا لزم الأمر", correct: true },
      { en: "Only tell your insurance company", ar: "تبلغ شركة التأمين فقط", correct: false },
      { en: "Only avoid motorways", ar: "تتجنب الطرق السريعة فقط", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-26", ar: "تلميح", explainAr: "إبلاغ جهة الترخيص (DVLA) عند وجود حالة صحية تحافظ على سلامة الجميع على الطريق لأنه يضمن أن السائقين يستوفون المعايير الصحية المطلوبة للقيادة الآمنة." }
    ]
  },

  {
    id: "HZ-27",
    topic: "hazard-awareness",
    promptEn: "A pedestrian is already in the road ahead, crossing slowly. What is the safest action?",
    promptAr: "يوجد مشاة بالفعل في الطريق أمامك يعبر ببطء. ما التصرف الأكثر أماناً؟",
    options: [
      { en: "Wave them to hurry up", ar: "تلوّح له ليُسرع", correct: false },
      { en: "Drive behind them quickly", ar: "تمر خلفه بسرعة", correct: false },
      { en: "Slow down and be prepared to stop", ar: "تخفف السرعة وتستعد للتوقف", correct: true },
      { en: "Sound the horn to make them move", ar: "تستخدم البوق ليبتعد", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-27", ar: "تلميح", explainAr: "التخفيف والاستعداد للتوقف يحمي المشاة البطيئين لأنهم قد يحتاجون وقتاً أطول لعبور الطريق، وإعطاؤهم الوقت والمساحة يمنع الحوادث ويحمي حياتهم." }
    ]
  },

  {
    id: "HZ-28",
    topic: "hazard-awareness",
    promptEn: "A motorcyclist has just overtaken you and moves back into your lane with little space. What should you do?",
    promptAr: "درّاج ناري تجاوزك للتو وعاد إلى مسارك بمسافة قليلة. ماذا يجب أن تفعل؟",
    options: [
      { en: "Flash your headlights to show annoyance", ar: "تومض أضواءك لإظهار الانزعاج", correct: false },
      { en: "Sound the horn continuously", ar: "تستخدم البوق باستمرار", correct: false },
      { en: "Drop back to rebuild a safe gap", ar: "تتراجع لإعادة مسافة أمان", correct: true },
      { en: "Accelerate to get very close to them", ar: "تسرع لتقترب جداً منه", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-28", ar: "تلميح", explainAr: "التراجع لإعادة مسافة آمنة يمنحك وقتاً للتفاعل مع التغييرات لأن المسافة القصيرة تعرضك لخطر الاصطدام إذا تباطأ الدراج الناري أو توقف فجأة." }
    ]
  },

  {
    id: "HZ-29",
    topic: "hazard-awareness",
    promptEn: "You're driving in slow-moving queues and notice traffic ahead spreading into the left lane. What is this most likely indicating?",
    promptAr: "تقود في طوابير بطيئة وتلاحظ أن المرور أمامك ينتشر إلى المسار الأيسر. ماذا يُرجّح أن يعني ذلك؟",
    options: [
      { en: "A hazard or obstruction ahead in the right lane", ar: "خطر/عائق أمامك في المسار الأيمن", correct: true },
      { en: "The speed limit has increased", ar: "حد السرعة زاد", correct: false },
      { en: "The left lane is for overtaking", ar: "المسار الأيسر للتجاوز", correct: false },
      { en: "Everyone must exit at the next junction", ar: "الجميع يجب أن يخرج عند المخرج التالي", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-29", ar: "تلميح", explainAr: "انتشار المرور إلى مسار آخر يشير عادة إلى خطر أو عائق في المسار الأصلي لأن السائقين يتجنبون شيئاً ما في الطريق، مما يتطلب منك الاستعداد للإبطاء أو تغيير المسار." }
    ]
  },

  {
    id: "HZ-30",
    topic: "hazard-awareness",
    promptEn: "You want to turn left from a side road, but your view along the main road is restricted. What should you do?",
    promptAr: "تريد الانعطاف يساراً من طريق جانبي لكن رؤيتك للطريق الرئيسي محدودة. ماذا يجب أن تفعل؟",
    options: [
      { en: "Approach slowly and edge forward until you can see clearly", ar: "تقترب ببطء وتتقدم قليلاً حتى تصبح الرؤية واضحة", correct: true },
      { en: "Build up speed so you can join quickly", ar: "تزيد السرعة لتدخل بسرعة", correct: false },
      { en: "Stay well back and go only when you think it's clear", ar: "تبقى بعيداً وتتحرك فقط عندما تعتقد أنه خالٍ", correct: false },
      { en: "Use the horn to warn traffic before pulling out", ar: "تستخدم البوق قبل الخروج لتحذير المرور", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-30", ar: "تلميح", explainAr: "التقدم ببطء حتى الرؤية الواضحة يمنحك وقتاً لاتخاذ قرار آمن لأن الرؤية المحدودة تمنعك من رؤية حركة المرور القادمة، والتقدم تدريجياً يسمح لك برؤية الطريق بوضوح قبل الانعطاف." }
    ]
  },

  {
    id: "HZ-31",
    topic: "hazard-awareness",
    promptEn: "A driver's behaviour has upset you. What is the safest thing to do before driving?",
    promptAr: "سلوك أحد السائقين أزعجك. ما الإجراء الأكثر أمانًا قبل القيادة؟",
    options: [
      { en: "Open a window", ar: "افتح نافذة", correct: false },
      { en: "Turn on the radio", ar: "شغّل الراديو", correct: false },
      { en: "Drink alcohol", ar: "اشرب كحولاً", correct: false },
      { en: "Take time to calm down", ar: "خذ وقتاً لتهدأ", correct: true }
    ],
    keywords: [
      { term: "hint-HZ-31", ar: "تلميح", explainAr: "الهدوء قبل القيادة يحافظ على التركيز ويقلل الأخطاء لأن الانزعاج أو الغضب يشتت الانتباه ويؤثر على قدرتك على اتخاذ قرارات سليمة ورد الفعل السريع، مما يعرضك للخطر." }
    ]
  },

  {
    id: "HZ-32",
    topic: "hazard-awareness",
    promptEn: "Why should you check medicine labels before driving?",
    promptAr: "لماذا يجب فحص نشرة الدواء قبل القيادة؟",
    options: [
      { en: "Medicines may affect safe driving", ar: "الأدوية قد تؤثر على القيادة الآمنة", correct: true },
      { en: "To see expiry date only", ar: "لمعرفة تاريخ انتهاء الصلاحية فقط", correct: false },
      { en: "To avoid police checks", ar: "لتجنب تفتيش الشرطة", correct: false },
      { en: "To improve concentration", ar: "لتحسين التركيز", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-32", ar: "تلميح", explainAr: "فحص ملصقات الأدوية يمنع القيادة تحت تأثير مواد تؤثر على التركيز لأن بعض الأدوية تسبب النعاس أو تقلل من وقت رد الفعل، مما يزيد بشكل كبير من خطر الحوادث." }
    ]
  },

  {
    id: "HZ-33",
    topic: "hazard-awareness",
    promptEn: "You feel very tired with a strong headache before driving. What should you do?",
    promptAr: "تشعر بتعب شديد وصداع قوي قبل القيادة. ماذا تفعل؟",
    options: [
      { en: "Drive slowly", ar: "قد ببطء", correct: false },
      { en: "Take painkillers and drive", ar: "تناول مسكنات واقود", correct: false },
      { en: "Delay driving until you feel better", ar: "أجل القيادة حتى تشعر بتحسن", correct: true },
      { en: "Open a window", ar: "افتح نافذة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-33", ar: "تلميح", explainAr: "التأجيل حتى التحسن يمنع الحوادث الناتجة عن التعب والمرض لأن التعب والصداع يقللان من التركيز ووقت رد الفعل بشكل خطير، مما يعرضك والآخرين لخطر الاصطدام." }
    ]
  },

  {
    id: "HZ-34",
    topic: "hazard-awareness",
    promptEn: "When must you wear glasses if you need them to read a number plate?",
    promptAr: "متى يجب ارتداء النظارات إذا كنت تحتاجها لقراءة لوحة المركبة؟",
    options: [
      { en: "Only at night", ar: "فقط في الليل", correct: false },
      { en: "In bad weather only", ar: "في الطقس السيء فقط", correct: false },
      { en: "Whenever you are driving", ar: "كلما كنت تقود", correct: true },
      { en: "Only on motorways", ar: "فقط على الطرق السريعة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-34", ar: "ارتداء النظارات دائماً يحافظ على الرؤية الواضحة في جميع الظروف.", explainAr: "Wearing glasses always maintains clear vision in all conditions." }
    ]
  },

  {
    id: "HZ-35",
    topic: "hazard-awareness",
    promptEn: "How does alcohol affect driving ability?",
    promptAr: "كيف يؤثر الكحول على القدرة على القيادة؟",
    options: [
      { en: "Improves reactions", ar: "يحسن ردود الفعل", correct: false },
      { en: "Reduces judgement and control", ar: "يقلل الحكم والسيطرة", correct: true },
      { en: "Improves awareness", ar: "يحسن الوعي", correct: false },
      { en: "Makes driving safer", ar: "يجعل القيادة أكثر أماناً", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-35", ar: "الكحول يضعف الحكم والسيطرة ويزيد خطر الحوادث بشكل كبير.", explainAr: "Alcohol impairs judgement and control, significantly increasing accident risk." }
    ]
  },

  {
    id: "HZ-36",
    topic: "hazard-awareness",
    promptEn: "Why should you be careful passing a bus at a bus stop?",
    promptAr: "لماذا يجب الحذر عند تجاوز حافلة متوقفة؟",
    options: [
      { en: "Road may be slippery", ar: "الطريق قد يكون زلقاً", correct: false },
      { en: "Pedestrians may cross in front", ar: "المشاة قد يعبرون من الأمام", correct: true },
      { en: "Bus will reverse", ar: "الحافلة سترجع للخلف", correct: false },
      { en: "Traffic speeds up", ar: "حركة المرور تتسارع", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-36", ar: "الحافلات المتوقفة قد تخفي المشاة الذين يعبرون من الأمام.", explainAr: "Stopped buses may hide pedestrians crossing in front." }
    ]
  },

  {
    id: "HZ-37",
    topic: "hazard-awareness",
    promptEn: "Approaching a left-hand bend, what hazard should you expect?",
    promptAr: "عند الاقتراب من منعطف أيسر، ما الخطر المتوقع؟",
    options: [
      { en: "Overtaking vehicles", ar: "مركبات تتجاوز", correct: false },
      { en: "Mud or debris on the road", ar: "طين أو حطام على الطريق", correct: true },
      { en: "Wider road", ar: "طريق أوسع", correct: false },
      { en: "Faster traffic", ar: "حركة مرور أسرع", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-37", ar: "المنعطفات اليسرى قد تحتوي على طين أو حطام من المركبات الزراعية.", explainAr: "Left-hand bends may contain mud or debris from farm vehicles." }
    ]
  },

  {
    id: "HZ-38",
    topic: "hazard-awareness",
    promptEn: "What can seriously reduce your concentration while driving?",
    promptAr: "ما الذي قد يقلل التركيز بشكل خطير أثناء القيادة؟",
    options: [
      { en: "Drugs", ar: "المخدرات", correct: true },
      { en: "Clear weather", ar: "طقس صافٍ", correct: false },
      { en: "New tyres", ar: "إطارات جديدة", correct: false },
      { en: "Mirrors", ar: "المرايا", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-38", ar: "المخدرات تقلل التركيز والوعي وتهدد السلامة على الطريق.", explainAr: "Drugs reduce concentration and awareness, threatening road safety." }
    ]
  },

  {
    id: "HZ-39",
    topic: "hazard-awareness",
    promptEn: "Driving behind a lorry in rain, what should you be aware of?",
    promptAr: "عند القيادة خلف شاحنة أثناء المطر، ما الذي يجب الانتباه له؟",
    options: [
      { en: "Better visibility", ar: "رؤية أفضل", correct: false },
      { en: "Spray reducing vision", ar: "رذاذ يقلل الرؤية", correct: true },
      { en: "Faster stopping", ar: "توقف أسرع", correct: false },
      { en: "Clear mirrors", ar: "مرايا واضحة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-39", ar: "الرذاذ من الشاحنات الكبيرة يقلل الرؤية ويزيد خطر الحوادث.", explainAr: "Spray from large lorries reduces visibility and increases accident risk." }
    ]
  },

  {
    id: "HZ-40",
    topic: "hazard-awareness",
    promptEn: "Which glasses can make night driving more difficult?",
    promptAr: "أي نوع من النظارات قد يجعل القيادة الليلية أصعب؟",
    options: [
      { en: "Clear lenses", ar: "عدسات شفافة", correct: false },
      { en: "Tinted lenses", ar: "عدسات ملونة", correct: true },
      { en: "Reading glasses", ar: "نظارات القراءة", correct: false },
      { en: "Protective glasses", ar: "نظارات واقية", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-40", ar: "العدسات الملونة تقلل كمية الضوء وتجعل الرؤية الليلية أصعب.", explainAr: "Tinted lenses reduce light amount and make night vision harder." }
    ]
  },

  {
    id: "HZ-41",
    topic: "hazard-awareness",
    promptEn: "Traffic lights fail at a crossroads. What should you do?",
    promptAr: "تعطلت إشارات المرور عند تقاطع. ماذا تفعل؟",
    options: [
      { en: "Drive through quickly", ar: "اعبر بسرعة", correct: false },
      { en: "Be ready to stop for all traffic", ar: "كن مستعداً للتوقف لجميع حركة المرور", correct: true },
      { en: "Follow the largest vehicle", ar: "اتبع أكبر مركبة", correct: false },
      { en: "Sound the horn", ar: "استخدم البوق", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-41", ar: "عند تعطل إشارات المرور، يجب التصرف بحذر كأنها تقاطع غير محكم.", explainAr: "When traffic lights fail, treat it as an unmarked junction with extra caution." }
    ]
  },

  {
    id: "HZ-42",
    topic: "hazard-awareness",
    promptEn: "Why should you allow extra time for older drivers?",
    promptAr: "لماذا يجب مراعاة السائقين الأكبر سنًا؟",
    options: [
      { en: "They take more risks", ar: "يأخذون مخاطر أكثر", correct: false },
      { en: "Their reactions may be slower", ar: "ردود أفعالهم قد تكون أبطأ", correct: true },
      { en: "They drive faster", ar: "يقودون أسرع", correct: false },
      { en: "They ignore signs", ar: "يتجاهلون الإشارات", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-42", ar: "السائقون الأكبر سناً قد يحتاجون وقتاً أطول للتفاعل، لذا امنحهم مساحة.", explainAr: "Older drivers may need more time to react, so give them space." }
    ]
  },

  {
    id: "HZ-43",
    topic: "hazard-awareness",
    promptEn: "A car ahead is signalling right continuously. What should you do?",
    promptAr: "مركبة أمامك تترك إشارة اليمين مفعلة. ماذا تفعل؟",
    options: [
      { en: "Overtake immediately", ar: "تجاوز فوراً", correct: false },
      { en: "Stay behind and be cautious", ar: "ابق خلفها وكن حذراً", correct: true },
      { en: "Sound the horn", ar: "استخدم البوق", correct: false },
      { en: "Flash headlights", ar: "ومض الأضواء", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-43", ar: "الإشارة المستمرة قد تعني أن السائق نسى إيقافها أو أن هناك مشكلة.", explainAr: "Continuous signalling may mean the driver forgot to cancel it or there's a problem." }
    ]
  },

  {
    id: "HZ-44",
    topic: "hazard-awareness",
    promptEn: "What does a sharp bend warning sign mean?",
    promptAr: "ماذا تعني إشارة المنعطف الحاد؟",
    options: [
      { en: "Road narrows", ar: "الطريق يضيق", correct: false },
      { en: "Sudden bend ahead", ar: "منعطف مفاجئ أمامك", correct: true },
      { en: "Slippery road", ar: "طريق زلق", correct: false },
      { en: "Junction ahead", ar: "تقاطع أمامك", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-44", ar: "إشارة المنعطف الحاد تحذرك من منعطف مفاجئ يتطلب تخفيف السرعة.", explainAr: "Sharp bend signs warn of sudden bends requiring speed reduction." }
    ]
  },

  {
    id: "HZ-45",
    topic: "hazard-awareness",
    promptEn: "Approaching a narrow bridge, what should you do?",
    promptAr: "عند الاقتراب من جسر ضيق، ماذا تفعل؟",
    options: [
      { en: "Speed up", ar: "أسرع", correct: false },
      { en: "Be prepared to give way", ar: "كن مستعداً لإفساح الطريق", correct: true },
      { en: "Drive in the centre", ar: "قد في الوسط", correct: false },
      { en: "Use horn", ar: "استخدم البوق", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-45", ar: "الجسور الضيقة تتطلب الاستعداد لإفساح الطريق للمركبات الكبيرة.", explainAr: "Narrow bridges require readiness to give way to large vehicles." }
    ]
  },

  {
    id: "HZ-46",
    topic: "hazard-awareness",
    promptEn: "What should you do if you feel drowsy while driving?",
    promptAr: "ماذا تفعل إذا شعرت بالنعاس أثناء القيادة؟",
    options: [
      { en: "Turn heater up", ar: "ارفع التدفئة", correct: false },
      { en: "Continue slowly", ar: "استمر ببطء", correct: false },
      { en: "Stop and rest", ar: "توقف واسترح", correct: true },
      { en: "Drink water only", ar: "اشرب الماء فقط", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-46", ar: "التوقف والراحة عند النعاس يمنع الحوادث الناتجة عن النوم أثناء القيادة.", explainAr: "Stopping and resting when drowsy prevents accidents from falling asleep at the wheel." }
    ]
  },

  {
    id: "HZ-47",
    topic: "hazard-awareness",
    promptEn: "When should hazard warning lights be used?",
    promptAr: "متى تُستخدم أضواء التحذير؟",
    options: [
      { en: "When parking briefly", ar: "عند الوقوف لفترة قصيرة", correct: false },
      { en: "When vehicle breaks down and obstructs traffic", ar: "عند تعطل المركبة وإعاقة حركة المرور", correct: true },
      { en: "When indicators fail only", ar: "عند تعطل المؤشرات فقط", correct: false },
      { en: "In fog", ar: "في الضباب", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-47", ar: "أضواء التحذير تُستخدم فقط عند تعطل المركبة وإعاقة حركة المرور.", explainAr: "Hazard lights are only used when the vehicle breaks down and obstructs traffic." }
    ]
  },

  {
    id: "HZ-48",
    topic: "hazard-awareness",
    promptEn: "Which vehicle may appear in the middle of a narrow road?",
    promptAr: "أي مركبة قد تظهر في منتصف طريق ضيق؟",
    options: [
      { en: "Bicycle", ar: "دراجة", correct: false },
      { en: "Lorry", ar: "شاحنة", correct: true },
      { en: "Motorcycle", ar: "دراجة نارية", correct: false },
      { en: "Car", ar: "سيارة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-48", ar: "الشاحنات الكبيرة قد تحتاج استخدام منتصف الطريق الضيق للعبور.", explainAr: "Large lorries may need to use the middle of narrow roads to pass." }
    ]
  },

  {
    id: "HZ-49",
    topic: "hazard-awareness",
    promptEn: "How can you reduce tiredness on long journeys?",
    promptAr: "كيف تقلل التعب في الرحلات الطويلة؟",
    options: [
      { en: "Loud music", ar: "موسيقى عالية", correct: false },
      { en: "Large meals", ar: "وجبات كبيرة", correct: false },
      { en: "Regular breaks", ar: "استراحات منتظمة", correct: true },
      { en: "Driving faster", ar: "القيادة بشكل أسرع", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-49", ar: "الاستراحات المنتظمة تحافظ على التركيز وتقلل التعب في الرحلات الطويلة.", explainAr: "Regular breaks maintain concentration and reduce fatigue on long journeys." }
    ]
  },

  {
    id: "HZ-50",
    topic: "hazard-awareness",
    promptEn: "What should you do if medicine causes drowsiness?",
    promptAr: "ماذا تفعل إذا سبب الدواء نعاسًا؟",
    options: [
      { en: "Drive carefully", ar: "قد بحذر", correct: false },
      { en: "Avoid driving", ar: "تجنب القيادة", correct: true },
      { en: "Drink coffee", ar: "اشرب قهوة", correct: false },
      { en: "Drive short distances", ar: "قد مسافات قصيرة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-50", ar: "تجنب القيادة عند النعاس من الدواء يمنع الحوادث الخطيرة.", explainAr: "Avoiding driving when medicine causes drowsiness prevents serious accidents." }
    ]
  },

  {
    id: "HZ-51",
    topic: "hazard-awareness",
    promptEn: "Where are reflective safety markers most commonly found?",
    promptAr: "أين يمكن أن تجد عادة العلامات العاكسة للسلامة؟",
    options: [
      { en: "On motorway information signs", ar: "على لوحات معلومات الطرق السريعة", correct: false },
      { en: "On railway bridges", ar: "على جسور السكك الحديدية", correct: false },
      { en: "On large goods vehicles", ar: "على المركبات الثقيلة", correct: true },
      { en: "On diversion signs", ar: "على لوحات التحويل", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-51", ar: "العلامات العاكسة على المركبات الثقيلة تساعدك على رؤيتها في الظلام.", explainAr: "Reflective markers on large goods vehicles help you see them in the dark." }
    ]
  },

  {
    id: "HZ-52",
    topic: "hazard-awareness",
    promptEn: "How should you normally drive in areas with traffic-calming measures?",
    promptAr: "كيف يجب أن تقود عادة في المناطق التي تحتوي على إجراءات تهدئة المرور؟",
    options: [
      { en: "At a reduced speed", ar: "بسرعة منخفضة", correct: true },
      { en: "At the maximum speed", ar: "بأقصى سرعة", correct: false },
      { en: "In the centre of the road", ar: "في منتصف الطريق", correct: false },
      { en: "With headlights always on", ar: "مع تشغيل الأضواء دائماً", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-52", ar: "القيادة بسرعة منخفضة في مناطق تهدئة المرور تحمي المشاة والدراجين.", explainAr: "Driving at reduced speed in traffic-calmed areas protects pedestrians and cyclists." }
    ]
  },

  {
    id: "HZ-53",
    topic: "hazard-awareness",
    promptEn: "If a doctor prescribes medicine that may affect your driving, what should you do?",
    promptAr: "إذا وصف لك الطبيب دواء قد يؤثر على قيادتك، ماذا يجب أن تفعل؟",
    options: [
      { en: "Only drive short distances", ar: "القيادة لمسافات قصيرة فقط", correct: false },
      { en: "Avoid motorways only", ar: "تجنب الطرق السريعة فقط", correct: false },
      { en: "Let someone else drive", ar: "دع شخصاً آخر يقود", correct: true },
      { en: "Drive slowly and carefully", ar: "القيادة ببطء وحذر", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-53", ar: "السماح لشخص آخر بالقيادة عند تناول دواء يؤثر على القيادة يحافظ على السلامة.", explainAr: "Letting someone else drive when taking medicine that affects driving maintains safety." }
    ]
  },

  {
    id: "HZ-54",
    topic: "hazard-awareness",
    promptEn: "When approaching a narrow bridge, which vehicle should you be especially prepared to give way to?",
    promptAr: "عند الاقتراب من جسر ضيق، لأي مركبة يجب أن تكون مستعداً لإعطائها الأولوية؟",
    options: [
      { en: "Cars", ar: "السيارات", correct: false },
      { en: "Buses", ar: "الحافلات", correct: true },
      { en: "Motorcycles", ar: "الدراجات النارية", correct: false },
      { en: "Bicycles", ar: "الدراجات الهوائية", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-54", ar: "الحافلات الكبيرة تحتاج مساحة أكبر على الجسور الضيقة.", explainAr: "Large buses need more space on narrow bridges." }
    ]
  },

  {
    id: "HZ-55",
    topic: "hazard-awareness",
    promptEn: "Where is overtaking most unsafe?",
    promptAr: "أين يكون التجاوز غير آمن بشكل خاص؟",
    options: [
      { en: "On a straight road", ar: "على طريق مستقيم", correct: false },
      { en: "On a one-way street", ar: "في شارع باتجاه واحد", correct: false },
      { en: "Near a junction", ar: "قرب تقاطع", correct: true },
      { en: "On a wide road", ar: "على طريق واسع", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-55", ar: "التجاوز قرب التقاطعات خطير بسبب المرور القادم من عدة اتجاهات.", explainAr: "Overtaking near junctions is dangerous due to traffic from multiple directions." }
    ]
  },

  {
    id: "HZ-56",
    topic: "hazard-awareness",
    promptEn: "What is a common hazard when driving near parked vehicles on a bend?",
    promptAr: "ما الخطر الشائع عند القيادة قرب سيارات متوقفة على منعطف؟",
    options: [
      { en: "Vehicles turning around", ar: "مركبات تستدير", correct: false },
      { en: "Hidden parked cars", ar: "سيارات متوقفة مخفية", correct: false },
      { en: "Pedestrians stepping out suddenly", ar: "مشاة يخرجون فجأة", correct: true },
      { en: "Road surface damage", ar: "تلف سطح الطريق", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-56", ar: "السيارات المتوقفة على المنعطفات قد تخفي المشاة الذين يخرجون فجأة.", explainAr: "Parked cars on bends may hide pedestrians stepping out suddenly." }
    ]
  },

  {
    id: "HZ-57",
    topic: "hazard-awareness",
    promptEn: "Why must you take extra care when emerging from a junction with limited visibility?",
    promptAr: "لماذا يجب أن تتوخى الحذر الشديد عند الخروج من تقاطع برؤية محدودة؟",
    options: [
      { en: "The road surface is uneven", ar: "سطح الطريق غير مستوٍ", correct: false },
      { en: "Kerbs are high", ar: "الأرصفة مرتفعة", correct: false },
      { en: "Your view is restricted", ar: "الرؤية محدودة", correct: true },
      { en: "Traffic lights may fail", ar: "إشارات المرور قد تتعطل", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-57", ar: "الرؤية المحدودة عند التقاطعات تزيد خطر الحوادث مع المرور المخفي.", explainAr: "Limited visibility at junctions increases accident risk with hidden traffic." }
    ]
  },

  {
    id: "HZ-58",
    topic: "hazard-awareness",
    promptEn: "How does alcohol usually affect driving behaviour?",
    promptAr: "كيف يؤثر الكحول عادةً على سلوك القيادة؟",
    options: [
      { en: "Improves judgement", ar: "يحسن التقدير", correct: false },
      { en: "Increases confidence dangerously", ar: "يزيد الثقة بشكل خطير", correct: true },
      { en: "Speeds up reactions", ar: "يسرّع ردود الفعل", correct: false },
      { en: "Improves concentration", ar: "يحسن التركيز", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-58", ar: "الكحول يزيد الثقة بشكل خطير ويقلل الحكم السليم.", explainAr: "Alcohol increases confidence dangerously and reduces sound judgement." }
    ]
  },

  {
    id: "HZ-59",
    topic: "hazard-awareness",
    promptEn: "When passing parked cars, what hazard should you be especially aware of?",
    promptAr: "عند المرور بجانب سيارات متوقفة، ما الخطر الذي يجب أن تنتبه له بشكل خاص؟",
    options: [
      { en: "Uneven road surface", ar: "سطح طريق غير مستوٍ", correct: false },
      { en: "Traffic behind you", ar: "المرور خلفك", correct: false },
      { en: "Doors opening suddenly", ar: "أبواب تُفتح فجأة", correct: true },
      { en: "Empty parking spaces", ar: "أماكن وقوف فارغة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-59", ar: "أبواب السيارات المتوقفة قد تُفتح فجأة وتسبب حوادث خطيرة.", explainAr: "Parked car doors may open suddenly and cause serious accidents." }
    ]
  },

  {
    id: "HZ-60",
    topic: "hazard-awareness",
    promptEn: "If illness affects your ability to drive safely, what must you do?",
    promptAr: "إذا أثّر المرض على قدرتك على القيادة بأمان، ماذا يجب أن تفعل؟",
    options: [
      { en: "Reduce your medication", ar: "تقليل الدواء", correct: false },
      { en: "Drive only short distances", ar: "القيادة لمسافات قصيرة", correct: false },
      { en: "Stop driving until fit again", ar: "التوقف عن القيادة حتى تتحسن", correct: true },
      { en: "Drive with someone else", ar: "القيادة مع شخص آخر", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-60", ar: "التوقف عن القيادة عند المرض يحافظ على سلامة الجميع.", explainAr: "Stopping driving when ill keeps everyone safe." }
    ]
  },

  {
    id: "HZ-61",
    topic: "hazard-awareness",
    promptEn: "If you plan to drive later, what is the safest choice at a social event with alcohol?",
    promptAr: "إذا كنت تخطط للقيادة لاحقاً، ما الخيار الأكثر أماناً في مناسبة تحتوي على كحول؟",
    options: [
      { en: "Drink less alcohol", ar: "شرب كمية أقل", correct: false },
      { en: "Eat food before drinking", ar: "الأكل قبل الشرب", correct: false },
      { en: "Avoid alcohol completely", ar: "تجنب الكحول تماماً", correct: true },
      { en: "Drink slowly", ar: "الشرب ببطء", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-61", ar: "تجنب الكحول تماماً عند التخطيط للقيادة يمنع القيادة تحت التأثير.", explainAr: "Avoiding alcohol completely when planning to drive prevents driving under influence." }
    ]
  },

  {
    id: "HZ-62",
    topic: "hazard-awareness",
    promptEn: "What hazard is common in residential streets with parked vehicles?",
    promptAr: "ما الخطر الشائع في الشوارع السكنية التي تحتوي على سيارات متوقفة؟",
    options: [
      { en: "Sun glare", ar: "وهج الشمس", correct: false },
      { en: "Missing road markings", ar: "غياب علامات الطريق", correct: false },
      { en: "Children running out unexpectedly", ar: "أطفال يخرجون فجأة", correct: true },
      { en: "Heavy goods vehicles", ar: "مركبات ثقيلة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-62", ar: "الأطفال في الشوارع السكنية قد يخرجون فجأة من بين السيارات المتوقفة.", explainAr: "Children in residential streets may run out suddenly from between parked cars." }
    ]
  },

  {
    id: "HZ-63",
    topic: "hazard-awareness",
    promptEn: "What should you do if you feel drowsy while driving on a motorway?",
    promptAr: "ماذا يجب أن تفعل إذا شعرت بالنعاس أثناء القيادة على الطريق السريع؟",
    options: [
      { en: "Stop on the hard shoulder", ar: "التوقف على الكتف", correct: false },
      { en: "Open a window and stop safely as soon as possible", ar: "فتح النافذة والتوقف بأمان في أقرب وقت", correct: true },
      { en: "Increase speed", ar: "زيادة السرعة", correct: false },
      { en: "Let others overtake", ar: "السماح للآخرين بالتجاوز", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-63", ar: "التوقف بأمان في أقرب وقت عند النعاس على الطريق السريع يمنع الحوادث.", explainAr: "Stopping safely as soon as possible when drowsy on motorways prevents accidents." }
    ]
  },

  {
    id: "HZ-64",
    topic: "hazard-awareness",
    promptEn: "Before driving after taking medicine from a friend, what should you do?",
    promptAr: "قبل القيادة بعد تناول دواء من صديق، ماذا يجب أن تفعل؟",
    options: [
      { en: "Ask the friend about effects", ar: "سؤال الصديق", correct: false },
      { en: "Drink coffee", ar: "شرب القهوة", correct: false },
      { en: "Check the medicine label", ar: "فحص ملصق الدواء", correct: true },
      { en: "Test drive briefly", ar: "تجربة القيادة قليلاً", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-64", ar: "فحص ملصق الدواء قبل القيادة يمنع القيادة تحت تأثير مواد خطيرة.", explainAr: "Checking medicine labels before driving prevents driving under dangerous substances." }
    ]
  },

  {
    id: "HZ-65",
    topic: "hazard-awareness",
    promptEn: "Why might you need to slow down on a dual carriageway?",
    promptAr: "لماذا قد تحتاج إلى تخفيف السرعة على طريق مزدوج؟",
    options: [
      { en: "Broken centre line", ar: "خط متقطع في الوسط", correct: false },
      { en: "Solid white lines at the sides", ar: "خطوط بيضاء متصلة على الجانبين", correct: false },
      { en: "Roadworks ahead", ar: "أعمال طرق أمامك", correct: true },
      { en: "No footpaths", ar: "لا توجد أرصفة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-65", ar: "أعمال الطرق تتطلب تخفيف السرعة والانتباه للعمال والمركبات.", explainAr: "Roadworks require speed reduction and attention to workers and vehicles." }
    ]
  },

  {
    id: "HZ-66",
    topic: "hazard-awareness",
    promptEn: "When are hazard warning lights normally used?",
    promptAr: "متى تُستخدم أضواء التحذير عادةً؟",
    options: [
      { en: "To warn traffic of a breakdown causing obstruction", ar: "لتحذير المرور من عطل يسبب إعاقة", correct: true },
      { en: "When indicators fail", ar: "عند تعطل الإشارات", correct: false },
      { en: "When double parked", ar: "عند الوقوف المزدوج", correct: false },
      { en: "To warn of speed cameras", ar: "لتحذير من كاميرات السرعة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-66", ar: "أضواء التحذير تُستخدم لتحذير المرور من عطل يسبب إعاقة.", explainAr: "Hazard lights are used to warn traffic of a breakdown causing obstruction." }
    ]
  },

  {
    id: "HZ-67",
    topic: "hazard-awareness",
    promptEn: "After a conviction for drink- or drug-driving, what usually becomes more expensive?",
    promptAr: "بعد الإدانة بالقيادة تحت تأثير الكحول أو المخدرات، ما الذي يصبح أغلى عادةً؟",
    options: [
      { en: "Road tax", ar: "ضريبة الطريق", correct: false },
      { en: "Insurance", ar: "التأمين", correct: true },
      { en: "MOT test", ar: "فحص المركبة", correct: false },
      { en: "Driving licence", ar: "رخصة القيادة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-67", ar: "الإدانة بالقيادة تحت التأثير تزيد تكلفة التأمين بشكل كبير.", explainAr: "Drink or drug-driving convictions significantly increase insurance costs." }
    ]
  },

  {
    id: "HZ-68",
    topic: "hazard-awareness",
    promptEn: "What is the main hazard when following a cyclist near a junction?",
    promptAr: "ما الخطر الرئيسي عند اتباع درّاج قرب تقاطع؟",
    options: [
      { en: "The cyclist stopping", ar: "توقف الدراجة", correct: false },
      { en: "The cyclist swerving into the road", ar: "انحراف الدراجة إلى الطريق", correct: true },
      { en: "The cyclist dismounting", ar: "نزول الدراجة", correct: false },
      { en: "The cyclist pushing the bike", ar: "دفع الدراجة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-68", ar: "الدراجون قرب التقاطعات قد ينحرفون فجأة إلى الطريق.", explainAr: "Cyclists near junctions may swerve suddenly into the road." }
    ]
  },

  {
    id: "HZ-69",
    topic: "hazard-awareness",
    promptEn: "Is it important to plan rest stops on a long journey?",
    promptAr: "هل من المهم التخطيط لاستراحات خلال رحلة طويلة؟",
    options: [
      { en: "Yes, to stop every 30 minutes", ar: "نعم، كل 30 دقيقة", correct: false },
      { en: "Yes, regular breaks improve concentration", ar: "نعم، الاستراحات المنتظمة تحسن التركيز", correct: true },
      { en: "No, arriving quickly reduces fatigue", ar: "لا، الوصول السريع يقلل التعب", correct: false },
      { en: "No, fuel stops are enough", ar: "لا، التزود بالوقود كافٍ", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-69", ar: "الاستراحات المنتظمة تحسن التركيز وتقلل خطر الحوادث في الرحلات الطويلة.", explainAr: "Regular breaks improve concentration and reduce accident risk on long journeys." }
    ]
  },

  {
    id: "HZ-70",
    topic: "hazard-awareness",
    promptEn: "Why should you avoid rushing during a long drive?",
    promptAr: "لماذا يجب تجنب التسرع أثناء القيادة لمسافات طويلة؟",
    options: [
      { en: "It saves fuel", ar: "يوفر الوقود", correct: false },
      { en: "It reduces alertness", ar: "يقلل الانتباه", correct: false },
      { en: "It increases fatigue and errors", ar: "يزيد التعب والأخطاء", correct: true },
      { en: "It improves focus", ar: "يحسن التركيز", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-70", ar: "التسرع في الرحلات الطويلة يزيد التعب والأخطاء ويهدد السلامة.", explainAr: "Rushing on long drives increases fatigue and errors, threatening safety." }
    ]
  },

  {
    id: "HZ-71",
    topic: "hazard-awareness",
    promptEn: "In an automatic car, when would you use kick-down?",
    promptAr: "في سيارة أوتوماتيكية، متى تستخدم خاصية التسارع المفاجئ؟",
    options: [
      { en: "To engage cruise control", ar: "لتشغيل مثبت السرعة", correct: false },
      { en: "To accelerate quickly", ar: "للتسارع السريع", correct: true },
      { en: "To brake smoothly", ar: "للفرملة التدريجية", correct: false },
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-71", ar: "خاصية التسارع المفاجئ في السيارات الأوتوماتيكية تُستخدم للتسارع السريع.", explainAr: "Kick-down in automatic cars is used for quick acceleration." }
    ]
  },

  {
    id: "HZ-72",
    topic: "hazard-awareness",
    promptEn: "On a three-lane motorway, how should you overtake a slow lorry in the middle lane?",
    promptAr: "على طريق سريع بثلاثة مسارات، كيف يجب تجاوز شاحنة بطيئة في المسار الأوسط؟",
    options: [
      { en: "Overtake on either side", ar: "التجاوز من أي جانب", correct: false },
      { en: "Wait until leaving the motorway", ar: "الانتظار حتى الخروج", correct: false },
      { en: "Use the right-hand lane normally", ar: "استخدام المسار الأيمن بشكل طبيعي", correct: true },
      { en: "Overtake on the left", ar: "التجاوز من اليسار", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-72", ar: "استخدام المسار الأيمن للتجاوز على الطرق السريعة متعددة المسارات هو القاعدة.", explainAr: "Using the right-hand lane for overtaking on multi-lane motorways is the rule." }
    ]
  },

  {
    id: "HZ-73",
    topic: "hazard-awareness",
    promptEn: "You are driving in heavy rain and notice water pooling on the road surface. What should you be most aware of?",
    promptAr: "أنت تقود في أمطار غزيرة ولاحظت تجمع الماء على سطح الطريق. ما الذي يجب أن تنتبه له بشكل خاص؟",
    options: [
      { en: "Improved visibility ahead", ar: "تحسن الرؤية أمامك", correct: false },
      { en: "Risk of aquaplaning and loss of control", ar: "خطر الانزلاق المائي وفقدان السيطرة", correct: true },
      { en: "Faster traffic flow", ar: "تدفق مروري أسرع", correct: false },
      { en: "Better tyre grip", ar: "تماسك إطارات أفضل", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-73", ar: "تجمع الماء على الطريق يزيد خطر الانزلاق المائي وفقدان السيطرة.", explainAr: "Water pooling on roads increases risk of aquaplaning and loss of control." }
    ]
  },

  {
    id: "HZ-74",
    topic: "hazard-awareness",
    promptEn: "A pedestrian is standing at the edge of the pavement looking at their phone. What hazard should you anticipate?",
    promptAr: "مشاة يقف عند حافة الرصيف ينظر إلى هاتفه. ما الخطر الذي يجب أن تتوقعه؟",
    options: [
      { en: "They will wait for traffic to clear", ar: "سينتظر حتى يخلو الطريق", correct: false },
      { en: "They may step into the road without looking", ar: "قد يخطو إلى الطريق دون النظر", correct: true },
      { en: "They are waiting for a bus", ar: "ينتظر الحافلة", correct: false },
      { en: "They will signal before crossing", ar: "سيعطي إشارة قبل العبور", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-74", ar: "المشاة المنشغلون بهواتفهم قد يخطون إلى الطريق دون النظر.", explainAr: "Pedestrians distracted by phones may step into the road without looking." }
    ]
  },

  {
    id: "HZ-75",
    topic: "hazard-awareness",
    promptEn: "You are driving on a country road and see a horse rider ahead. What should you do?",
    promptAr: "أنت تقود على طريق ريفي وترى فارساً أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Sound your horn to warn them", ar: "استخدم البوق لتحذيرهم", correct: false },
      { en: "Pass as quickly as possible", ar: "تجاوز بأسرع ما يمكن", correct: false },
      { en: "Slow down and pass wide, giving plenty of space", ar: "خفف السرعة وتجاوز بعرض، مع ترك مساحة كبيرة", correct: true },
      { en: "Flash your headlights repeatedly", ar: "ومض بأضواءك بشكل متكرر", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-75", ar: "التخفيف والتجاوز بعرض عند رؤية الفرسان يحافظ على سلامة الجميع.", explainAr: "Slowing down and passing wide when seeing horse riders keeps everyone safe." }
    ]
  },

  {
    id: "HZ-76",
    topic: "hazard-awareness",
    promptEn: "You notice a vehicle ahead suddenly swerving and braking. What should you do immediately?",
    promptAr: "لاحظت مركبة أمامك تنحرف فجأة وتكبح. ماذا يجب أن تفعل فوراً؟",
    options: [
      { en: "Overtake immediately to avoid the hazard", ar: "تجاوز فوراً لتجنب الخطر", correct: false },
      { en: "Increase your following distance and be ready to brake", ar: "زِد مسافة التباعد وكن مستعداً للكبح", correct: true },
      { en: "Maintain your current speed", ar: "حافظ على سرعتك الحالية", correct: false },
      { en: "Sound your horn to alert them", ar: "استخدم البوق لتنبيههم", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-76", ar: "زيادة مسافة التباعد عند رؤية مركبة تنحرف فجأة يمنحك وقتاً للتفاعل.", explainAr: "Increasing following distance when seeing a vehicle swerve suddenly gives you time to react." }
    ]
  },

  {
    id: "HZ-77",
    topic: "hazard-awareness",
    promptEn: "You are approaching a school during the afternoon. What should you be especially alert for?",
    promptAr: "أنت تقترب من مدرسة خلال فترة بعد الظهر. ما الذي يجب أن تنتبه له بشكل خاص؟",
    options: [
      { en: "School buses only", ar: "حافلات المدرسة فقط", correct: false },
      { en: "Children crossing or running near the road", ar: "أطفال يعبرون أو يركضون قرب الطريق", correct: true },
      { en: "Parking restrictions", ar: "قيود الوقوف", correct: false },
      { en: "Speed cameras", ar: "كاميرات السرعة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-77", ar: "المركبات الكبيرة تحتاج مساحة أكبر للانعطاف وقد تتأرجح أولاً.", explainAr: "Large vehicles need more space to turn and may swing out first." }
    ]
  },

  {
    id: "HZ-78",
    topic: "hazard-awareness",
    promptEn: "While driving in fog, you see a vehicle's lights ahead but cannot judge its distance clearly. What should you do?",
    promptAr: "أثناء القيادة في الضباب، ترى أضواء مركبة أمامك لكن لا يمكنك تقدير مسافتها بوضوح. ماذا يجب أن تفعل؟",
    options: [
      { en: "Speed up to pass quickly", ar: "اسرع للمرور بسرعة", correct: false },
      { en: "Slow down and increase your following distance", ar: "خفف السرعة وزِد مسافة التباعد", correct: true },
      { en: "Use full beam headlights", ar: "استخدم الأضواء العالية", correct: false },
      { en: "Maintain normal speed", ar: "حافظ على السرعة العادية", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-78", ar: "المركبات الكبيرة قد تحتاج استخدام منتصف الطريق للانعطاف.", explainAr: "Large vehicles may need to use the middle of the road to turn." }
    ]
  },

  {
    id: "HZ-79",
    topic: "hazard-awareness",
    promptEn: "You are driving behind a large vehicle that is indicating left but positioned to the right. What should you anticipate?",
    promptAr: "أنت تقود خلف مركبة كبيرة تعطي إشارة يسار لكنها موضوعة إلى اليمين. ما الذي يجب أن تتوقعه؟",
    options: [
      { en: "The vehicle will turn left immediately", ar: "المركبة ستنعطف يساراً فوراً", correct: false },
      { en: "The vehicle needs space to turn left and may swing right first", ar: "المركبة تحتاج مساحة للانعطاف يساراً وقد تتأرجح يميناً أولاً", correct: true },
      { en: "The indicator is faulty", ar: "المؤشر معطل", correct: false },
      { en: "The vehicle will continue straight", ar: "المركبة ستستمر مباشرة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-79", ar: "المركبات الكبيرة قد تتأرجح يميناً قبل الانعطاف يساراً للحصول على مساحة.", explainAr: "Large vehicles may swing right before turning left to get space." }
    ]
  },

  {
    id: "HZ-80",
    topic: "hazard-awareness",
    promptEn: "You are driving on a wet road and approaching a sharp bend. What should you do before entering the bend?",
    promptAr: "أنت تقود على طريق مبلل وتقترب من منعطف حاد. ماذا يجب أن تفعل قبل دخول المنعطف؟",
    options: [
      { en: "Accelerate to maintain speed through the bend", ar: "اسرع للحفاظ على السرعة في المنعطف", correct: false },
      { en: "Slow down before the bend and avoid sudden steering or braking", ar: "خفف السرعة قبل المنعطف وتجنب التوجيه أو الكبح المفاجئ", correct: true },
      { en: "Change to a lower gear only", ar: "غير إلى غيار منخفض فقط", correct: false },
      { en: "Use the handbrake to control speed", ar: "استخدم فرامل اليد للتحكم بالسرعة", correct: false }
    ],
    keywords: [
      { term: "hint-HZ-80", ar: "التخفيف قبل المنعطفات الحادة على الطرق المبللة يمنع الانزلاق.", explainAr: "Slowing down before sharp bends on wet roads prevents skidding." }
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
    promptEn: "What is the most common reason a vehicle starts to skid?",
    promptAr: "ما السبب الأكثر شيوعًا لانزلاق السيارة؟",
    options: [
      { en: "Poor road surface conditions", ar: "حالة الطريق", correct: false },
      { en: "Driver actions", ar: "تصرفات السائق", correct: true },
      { en: "Mechanical failure", ar: "عطل ميكانيكي", correct: false },
      { en: "Strong wind", ar: "الرياح القوية", correct: false }
    ],
    keywords: [
      { term: "hint-SM-01", ar: "التسارع أو الفرملة المفاجئة تسبب الانزلاق، خاصة على الطرق الرطبة أو الجليدية.", explainAr: "Sudden acceleration or braking causes skidding, especially on wet or icy roads." }
    ]
  },

  {
    id: "SM-02",
    topic: "safety-margins",
    promptEn: "Which lights should you use when driving on a wet motorway with heavy spray?",
    promptAr: "أي أضواء يجب استخدامها على طريق سريع مبلل مع رذاذ كثيف؟",
    options: [
      { en: "Hazard warning lights", ar: "أضواء التحذير", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true },
      { en: "Rear fog lights", ar: "أضواء الضباب الخلفية", correct: false },
      { en: "Sidelights", ar: "أضواء الموضع", correct: false }
    ],
    keywords: [
      { term: "hint-SM-02", ar: "الأضواء المنخفضة تحسن الرؤية في الطقس الرطب دون إبهار السائقين الآخرين.", explainAr: "Dipped headlights improve visibility in wet weather without dazzling other drivers." }
    ]
  },

  {
    id: "SM-03",
    topic: "safety-margins",
    promptEn: "What risk is increased when you drive downhill in neutral (coasting)?",
    promptAr: "ما الخطر عند القيادة على منحدر مع وضع القير على الحياد؟",
    options: [
      { en: "Better steering control", ar: "تحكم أفضل", correct: false },
      { en: "Improved fuel economy", ar: "توفير الوقود", correct: false },
      { en: "Reduced control of the vehicle", ar: "فقدان السيطرة على السيارة", correct: true },
      { en: "Less braking effort", ar: "تقليل استخدام الفرامل", correct: false }
    ],
    keywords: [
      { term: "hint-SM-03", ar: "القيادة على الحياد تقلل السيطرة وتزيد مسافة التوقف، خاصة على المنحدرات.", explainAr: "Coasting reduces control and increases stopping distance, especially on hills." }
    ]
  },

  {
    id: "SM-04",
    topic: "safety-margins",
    promptEn: "Why should you position your vehicle towards the left before a right-hand bend?",
    promptAr: "لماذا يجب الاقتراب من اليسار قبل منعطف يمين؟",
    options: [
      { en: "To overtake safely", ar: "للتجاوز", correct: false },
      { en: "To improve your view of the road ahead", ar: "لتحسين الرؤية", correct: true },
      { en: "To avoid pedestrians", ar: "لتجنب المشاة", correct: false },
      { en: "To reduce fuel use", ar: "لتوفير الوقود", correct: false }
    ],
    keywords: [
      { term: "hint-SM-04", ar: "الموضع الصحيح قبل المنعطف يمنحك رؤية أفضل ووقتًا أطول للتفاعل مع المخاطر.", explainAr: "Correct positioning before bends gives you better visibility and more time to react to hazards." }
    ]
  },

  {
    id: "SM-05",
    topic: "safety-margins",
    promptEn: "When parking downhill, how should you turn your wheels?",
    promptAr: "عند الوقوف على منحدر نزولي، كيف توجه العجلات؟",
    options: [
      { en: "Away from the kerb", ar: "بعيدًا عن الرصيف", correct: false },
      { en: "Straight ahead", ar: "مستقيمة", correct: false },
      { en: "Towards the kerb", ar: "نحو الرصيف", correct: true },
      { en: "It doesn't matter", ar: "لا يهم", correct: false }
    ],
    keywords: [
      { term: "hint-SM-05", ar: "توجيه العجلات نحو الرصيف يمنع السيارة من التدحرج في حالة فشل الفرامل.", explainAr: "Turning wheels towards the kerb prevents the car from rolling if brakes fail." }
    ]
  },

  {
    id: "SM-06",
    topic: "safety-margins",
    promptEn: "What should you do when approaching a speed hump in a residential area?",
    promptAr: "ماذا تفعل عند الاقتراب من مطب سرعة؟",
    options: [
      { en: "Accelerate to pass quickly", ar: "التسارع", correct: false },
      { en: "Move to the centre of the road", ar: "التوسط بالطريق", correct: false },
      { en: "Check mirrors and slow down", ar: "فحص المرايا وتخفيف السرعة", correct: true },
      { en: "Stop completely", ar: "التوقف الكامل", correct: false }
    ],
    keywords: [
      { term: "hint-SM-06", ar: "تخفيف السرعة قبل المطبات يحافظ على السيطرة ويحمي المركبة والمشاة.", explainAr: "Slowing down before speed humps maintains control and protects your vehicle and pedestrians." }
    ]
  },

  {
    id: "SM-07",
    topic: "safety-margins",
    promptEn: "If a vehicle is following you too closely on a motorway, what should you do?",
    promptAr: "إذا كانت مركبة تلاحقك عن قرب على الطريق السريع، ماذا تفعل؟",
    options: [
      { en: "Brake sharply", ar: "الفرملة بقوة", correct: false },
      { en: "Increase speed", ar: "زيادة السرعة", correct: false },
      { en: "Increase the gap in front of you", ar: "زيادة المسافة أمامك", correct: true },
      { en: "Use hazard lights", ar: "تشغيل التحذير", correct: false }
    ],
    keywords: [
      { term: "hint-SM-07", ar: "زيادة المسافة أمامك تعطيك وقتًا إضافيًا للفرملة التدريجية وتجنب الاصطدامات.", explainAr: "Increasing the gap ahead gives you extra time for gradual braking and avoids collisions." }
    ]
  },

  {
    id: "SM-08",
    topic: "safety-margins",
    promptEn: "How should you use ABS brakes in an emergency stop?",
    promptAr: "كيف تستخدم فرامل ABS في التوقف الطارئ؟",
    options: [
      { en: "Pump the brake", ar: "ضخ الفرامل", correct: false },
      { en: "Brake firmly and steer", ar: "الضغط بقوة مع التوجيه", correct: true },
      { en: "Use the handbrake", ar: "فرامل اليد", correct: false },
      { en: "Brake lightly", ar: "ضغط خفيف", correct: false }
    ],
    keywords: [
      { term: "hint-SM-08", ar: "ABS يمنع انغلاق العجلات، مما يسمح بالفرملة القوية مع الحفاظ على القدرة على التوجيه.", explainAr: "ABS prevents wheel lock-up, allowing firm braking while maintaining steering ability." }
    ]
  },

  {
    id: "SM-09",
    topic: "safety-margins",
    promptEn: "What often indicates icy road conditions?",
    promptAr: "ما الذي يدل غالبًا على وجود جليد على الطريق؟",
    options: [
      { en: "Increased tyre noise", ar: "زيادة صوت الإطارات", correct: false },
      { en: "Reduced engine noise", ar: "انخفاض صوت المحرك", correct: false },
      { en: "Less tyre noise", ar: "قلة صوت الإطارات", correct: true },
      { en: "Strong steering feel", ar: "ثقل المقود", correct: false }
    ],
    keywords: [
      { term: "hint-SM-09", ar: "الطرق الجليدية تقلل الاحتكاك، مما يجعل الإطارات أكثر هدوءًا ويزيد مسافة التوقف بشكل كبير.", explainAr: "Icy roads reduce friction, making tyres quieter and dramatically increasing stopping distance." }
    ]
  },

  {
    id: "SM-10",
    topic: "safety-margins",
    promptEn: "How should you approach a sharp bend in freezing conditions?",
    promptAr: "كيف تقترب من منعطف حاد في الطقس المتجمد؟",
    options: [
      { en: "Coast through the bend", ar: "الانزلاق بدون تسارع", correct: false },
      { en: "Brake hard", ar: "الفرملة القوية", correct: false },
      { en: "Slow down gently", ar: "تخفيف السرعة بلطف", correct: true },
      { en: "Use the handbrake", ar: "فرامل اليد", correct: false }
    ],
    keywords: [
      { term: "hint-SM-10", ar: "الفرملة التدريجية قبل المنعطفات في الطقس المتجمد تحافظ على التماسك وتقلل خطر الانزلاق.", explainAr: "Gradual braking before bends in freezing conditions maintains grip and reduces skidding risk." }
    ]
  },

  {
    id: "SM-11",
    topic: "safety-margins",
    promptEn: "When using ABS, how should the footbrake be applied in an emergency?",
    promptAr: "كيف تضغط على الفرامل مع ABS في الطوارئ؟",
    options: [
      { en: "Gently and slowly", ar: "بلطف وببطء", correct: false },
      { en: "Rapidly and firmly", ar: "بسرعة وبقوة", correct: true },
      { en: "Light pressure only", ar: "ضغط خفيف", correct: false },
      { en: "Pumping repeatedly", ar: "ضخ متكرر", correct: false }
    ],
    keywords: [
      { term: "hint-SM-11", ar: "ABS يعمل بشكل أفضل مع الضغط القوي والمستمر، مما يقلل مسافة التوقف.", explainAr: "ABS works best with firm, continuous pressure, reducing stopping distance." }
    ]
  },

  {
    id: "SM-12",
    topic: "safety-margins",
    promptEn: "What does very light steering on a wet road indicate?",
    promptAr: "ماذا يعني خفة المقود على طريق مبلل؟",
    options: [
      { en: "Engine failure", ar: "عطل بالمحرك", correct: false },
      { en: "Loss of tyre grip", ar: "فقدان تماسك الإطارات", correct: true },
      { en: "Overinflated tyres", ar: "ضغط زائد", correct: false },
      { en: "Steering fault", ar: "خلل توجيه", correct: false }
    ],
    keywords: [
      { term: "hint-SM-12", ar: "فقدان التماسك على الطرق الرطبة يقلل السيطرة ويزيد خطر الانزلاق المائي.", explainAr: "Loss of grip on wet roads reduces control and increases aquaplaning risk." }
    ]
  },

  {
    id: "SM-13",
    topic: "safety-margins",
    promptEn: "Which situation requires extra care in strong winds?",
    promptAr: "أي حالة تتطلب حذرًا إضافيًا مع الرياح القوية؟",
    options: [
      { en: "Braking", ar: "الفرملة", correct: false },
      { en: "Hill starts", ar: "الانطلاق", correct: false },
      { en: "Turning into narrow roads", ar: "الانعطاف", correct: false },
      { en: "Passing cyclists", ar: "تجاوز الدراجين", correct: true }
    ],
    keywords: [
      { term: "hint-SM-13", ar: "الرياح القوية تدفع الدراجين بشكل غير متوقع، لذا اترك مسافة جانبية أكبر عند التجاوز.", explainAr: "Strong winds push cyclists unpredictably, so leave extra side space when overtaking." }
    ]
  },

  {
    id: "SM-14",
    topic: "safety-margins",
    promptEn: "How should you brake when driving in snow?",
    promptAr: "كيف تفرمل على طريق ثلجي؟",
    options: [
      { en: "Quickly and firmly", ar: "بسرعة", correct: false },
      { en: "Gently with early braking", ar: "بلطف وبوقت مبكر", correct: true },
      { en: "Using handbrake", ar: "فرامل اليد", correct: false },
      { en: "Sharp steering", ar: "توجيه حاد", correct: false }
    ],
    keywords: [
      { term: "hint-SM-14", ar: "الفرملة المبكرة والتدريجية على الثلج تحافظ على التماسك وتقلل خطر الانزلاق.", explainAr: "Early, gentle braking on snow maintains grip and reduces skidding risk." }
    ]
  },

  {
    id: "SM-15",
    topic: "safety-margins",
    promptEn: "How can wheelspin be reduced on icy roads?",
    promptAr: "كيف تقلل انزلاق العجلات على الجليد؟",
    options: [
      { en: "Low gear", ar: "غيار منخفض", correct: false },
      { en: "Highest gear possible at low speed", ar: "غيار عالي مع سرعة منخفضة", correct: true },
      { en: "Handbrake use", ar: "فرامل اليد", correct: false },
      { en: "Rapid acceleration", ar: "تسارع سريع", correct: false }
    ],
    keywords: [
      { term: "hint-SM-15", ar: "الغيار العالي يقلل عزم الدوران، مما يمنع انزلاق العجلات على الجليد.", explainAr: "High gear reduces torque, preventing wheelspin on ice." }
    ]
  },

  {
    id: "SM-16",
    topic: "safety-margins",
    promptEn: "How can engine braking be used safely?",
    promptAr: "كيف تستخدم فرملة المحرك؟",
    options: [
      { en: "Shift to a lower gear", ar: "تغيير لغيار أقل", correct: true },
      { en: "Use neutral", ar: "الحياد", correct: false },
      { en: "Select reverse", ar: "الرجوع", correct: false },
      { en: "Turn off engine", ar: "إطفاء المحرك", correct: false }
    ],
    keywords: [
      { term: "hint-SM-16", ar: "الغيار المنخفض يستخدم مقاومة المحرك لإبطاء السيارة بأمان، خاصة على المنحدرات.", explainAr: "Lower gear uses engine resistance to slow the car safely, especially on hills." }
    ]
  },

  {
    id: "SM-17",
    topic: "safety-margins",
    promptEn: "Where are side winds most likely to affect your vehicle?",
    promptAr: "أين تؤثر الرياح الجانبية أكثر؟",
    options: [
      { en: "Busy roads", ar: "الطرق المزدحمة", correct: false },
      { en: "Narrow lanes", ar: "الطرق الضيقة", correct: false },
      { en: "Open stretches of road", ar: "الطرق المفتوحة", correct: true },
      { en: "City streets", ar: "المدن", correct: false }
    ],
    keywords: [
      { term: "hint-SM-17", ar: "الطرق المفتوحة تسمح للرياح بالوصول بقوة أكبر، مما يتطلب حذرًا إضافيًا في السيطرة.", explainAr: "Open roads allow winds to reach with greater force, requiring extra care in control." }
    ]
  },

  {
    id: "SM-18",
    topic: "safety-margins",
    promptEn: "What should you do before driving in fog?",
    promptAr: "ماذا تفعل قبل القيادة في الضباب؟",
    options: [
      { en: "Reduce tyre pressure", ar: "تخفيض ضغط الإطارات", correct: false },
      { en: "Drink caffeine", ar: "شرب كافيين", correct: false },
      { en: "Allow extra time", ar: "إتاحة وقت إضافي", correct: true },
      { en: "Wear hi-vis", ar: "ارتداء سترة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-18", ar: "الوقت الإضافي يسمح بالقيادة ببطء وأمان في الضباب، مما يقلل خطر الاصطدامات.", explainAr: "Extra time allows slow, safe driving in fog, reducing collision risk." }
    ]
  },

  {
    id: "SM-19",
    topic: "safety-margins",
    promptEn: "What should you do if another vehicle pulls into your safe gap on a wet road?",
    promptAr: "إذا دخلت مركبة في المسافة الآمنة أمامك، ماذا تفعل؟",
    options: [
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false },
      { en: "Overtake immediately", ar: "التجاوز فورًا", correct: false },
      { en: "Drop back to increase distance", ar: "التراجع لزيادة المسافة", correct: true },
      { en: "Stay close", ar: "البقاء قريبًا", correct: false }
    ],
    keywords: [
      { term: "hint-SM-19", ar: "التراجع لإعادة المسافة الآمنة على الطرق الرطبة يمنحك وقتًا كافيًا للفرملة بأمان.", explainAr: "Dropping back to rebuild safe distance on wet roads gives you enough time to brake safely." }
    ]
  },

  {
    id: "SM-20",
    topic: "safety-margins",
    promptEn: "What is the main advantage of four-wheel drive?",
    promptAr: "ما الفائدة الأساسية للدفع الرباعي؟",
    options: [
      { en: "Shorter stopping distance", ar: "مسافة توقف أقصر", correct: false },
      { en: "Better grip in poor conditions", ar: "تماسك أفضل في الظروف السيئة", correct: true },
      { en: "Lower fuel use", ar: "استهلاك أقل", correct: false },
      { en: "Faster acceleration", ar: "تسارع أسرع", correct: false }
    ],
    keywords: [
      { term: "hint-SM-20", ar: "الدفع الرباعي يحسن التماسك في الطرق الزلقة، لكنه لا يقلل مسافة التوقف.", explainAr: "Four-wheel drive improves grip on slippery roads, but doesn't reduce stopping distance." }
    ]
  },

  {
    id: "SM-21",
    topic: "safety-margins",
    promptEn: "What helps a car move off more safely on a snowy road surface?",
    promptAr: "ما الذي يساعد السيارة على التحرك بأمان على طريق ثلجي؟",
    options: [
      { en: "Using a low gear", ar: "استخدام غيار منخفض", correct: false },
      { en: "Using a higher gear than usual", ar: "استخدام غيار أعلى من المعتاد", correct: true },
      { en: "Using high engine speed", ar: "رفع عدد دورات المحرك", correct: false },
      { en: "Using the parking brake", ar: "استخدام فرامل اليد", correct: false }
    ],
    keywords: [
      { term: "hint-SM-21", ar: "الغيار الأعلى يقلل عزم الدوران، مما يمنع انزلاق العجلات عند الانطلاق على الثلج.", explainAr: "Higher gear reduces torque, preventing wheelspin when moving off on snow." }
    ]
  },

  {
    id: "SM-22",
    topic: "safety-margins",
    promptEn: "After passing a hazard warning sign on a country road, what should you do once it's safe?",
    promptAr: "بعد تجاوز خطر على طريق ريفي، ماذا يجب أن تفعل عندما يصبح الطريق آمنًا؟",
    options: [
      { en: "Check tyre pressures", ar: "فحص ضغط الإطارات", correct: false },
      { en: "Switch on hazard lights", ar: "تشغيل أضواء التحذير", correct: false },
      { en: "Accelerate smoothly", ar: "التسارع بسلاسة", correct: true },
      { en: "Test the brakes", ar: "اختبار الفرامل", correct: false }
    ],
    keywords: [
      { term: "hint-SM-22", ar: "بعد تجاوز الخطر بأمان، التسارع التدريجي يعيد السرعة الطبيعية دون مفاجآت.", explainAr: "After safely passing the hazard, gradual acceleration returns to normal speed without surprises." }
    ]
  },

  {
    id: "SM-23",
    topic: "safety-margins",
    promptEn: "On a dry open road, what following distance should you normally keep?",
    promptAr: "على طريق مفتوح وجاف، ما المسافة الآمنة بينك وبين السيارة أمامك؟",
    options: [
      { en: "A two-second gap", ar: "فجوة زمنية قدرها ثانيتان", correct: true },
      { en: "One car length", ar: "طول سيارة واحدة", correct: false },
      { en: "Two metres", ar: "متران", correct: false },
      { en: "Two car lengths", ar: "طول سيارتين", correct: false }
    ],
    keywords: [
      { term: "hint-SM-23", ar: "قاعدة الثانيتين تعطيك وقتًا كافيًا للتفاعل والفرملة بأمان في الظروف الجافة.", explainAr: "The two-second rule gives you enough time to react and brake safely in dry conditions." }
    ]
  },

  {
    id: "SM-24",
    topic: "safety-margins",
    promptEn: "What does it usually mean if the ESC warning light flashes briefly while driving?",
    promptAr: "ماذا يعني وميض ضوء نظام الثبات الإلكتروني أثناء القيادة؟",
    options: [
      { en: "The system is faulty", ar: "عطل في النظام", correct: false },
      { en: "The system has been switched off", ar: "النظام متوقف", correct: false },
      { en: "The system is actively helping control the car", ar: "النظام يعمل للمساعدة في التحكم", correct: true },
      { en: "A routine test is running", ar: "فحص روتيني", correct: false }
    ],
    keywords: [
      { term: "hint-SM-24", ar: "وميض ضوء ESC يعني أن النظام يعمل لتصحيح الانزلاق وتحسين السيطرة.", explainAr: "ESC light flashing means the system is working to correct skidding and improve control." }
    ]
  },

  {
    id: "SM-25",
    topic: "safety-margins",
    promptEn: "What is most affected when road surfaces soften in very hot weather?",
    promptAr: "ما الذي يتأثر أكثر عندما تصبح الطرق لينة بسبب الحرارة العالية؟",
    options: [
      { en: "Suspension", ar: "نظام التعليق", correct: false },
      { en: "Fuel consumption", ar: "استهلاك الوقود", correct: false },
      { en: "Tyre grip", ar: "تماسك الإطارات", correct: true },
      { en: "Exhaust system", ar: "العادم", correct: false }
    ],
    keywords: [
      { term: "hint-SM-25", ar: "الطرق اللينة في الحرارة العالية تقلل التماسك ويمكن أن تزيد مسافة التوقف.", explainAr: "Soft roads in very hot weather reduce grip and can increase stopping distance." }
    ]
  },

  {
    id: "SM-26",
    topic: "safety-margins",
    promptEn: "How should you overtake a motorcyclist on a windy day?",
    promptAr: "كيف يجب تجاوز دراجة نارية في يوم عاصف؟",
    options: [
      { en: "Closely", ar: "عن قرب", correct: false },
      { en: "Very slowly", ar: "ببطء شديد", correct: false },
      { en: "With extra space", ar: "بمسافة جانبية إضافية", correct: true },
      { en: "As quickly as possible", ar: "بسرعة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-26", ar: "الرياح القوية تدفع الدراجات النارية بشكل غير متوقع، لذا اترك مسافة جانبية أكبر.", explainAr: "Strong winds push motorcycles unpredictably, so leave extra side space." }
    ]
  },

  {
    id: "SM-27",
    topic: "safety-margins",
    promptEn: "After driving through flood water, how can you check your brakes are working?",
    promptAr: "بعد المرور بمياه فيضان، كيف تتأكد أن الفرامل تعمل؟",
    options: [
      { en: "Drive fast for a short distance", ar: "القيادة بسرعة", correct: false },
      { en: "Avoid using brakes", ar: "تجنب استخدام الفرامل", correct: false },
      { en: "Apply brakes gently while driving slowly", ar: "الضغط بلطف أثناء القيادة البطيئة", correct: true },
      { en: "Stop for an hour", ar: "التوقف ساعة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-27", ar: "الفرملة التدريجية بعد المرور بالمياه تجفف الفرامل وتتحقق من عملها بأمان.", explainAr: "Gentle braking after driving through water dries the brakes and checks they work safely." }
    ]
  },

  {
    id: "SM-28",
    topic: "safety-margins",
    promptEn: "On which type of road surface may ABS be less effective?",
    promptAr: "على أي نوع من الطرق قد تكون فرامل ABS أقل فاعلية؟",
    options: [
      { en: "Dry", ar: "جافة", correct: false },
      { en: "Loose", ar: "غير متماسكة (حصى)", correct: true },
      { en: "Firm", ar: "صلبة", correct: false },
      { en: "Smooth", ar: "ناعمة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-28", ar: "الطرق غير المتماسكة مثل الحصى تقلل فعالية ABS لأن العجلات تحتاج للانغلاق لإنشاء مسافة توقف أقصر.", explainAr: "Loose surfaces like gravel reduce ABS effectiveness because wheels need to lock to create shorter stopping distance." }
    ]
  },

  {
    id: "SM-29",
    topic: "safety-margins",
    promptEn: "When driving in fog, what else should you do besides using dipped headlights?",
    promptAr: "عند القيادة في الضباب، ماذا تفعل بالإضافة للأضواء المنخفضة؟",
    options: [
      { en: "Stay close to the vehicle ahead", ar: "الاقتراب من السيارة الأمامية", correct: false },
      { en: "Use full beam", ar: "استخدام الضوء العالي", correct: false },
      { en: "Keep a safe distance", ar: "الحفاظ على مسافة أمان", correct: true },
      { en: "Match faster traffic speed", ar: "مجاراة السيارات السريعة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-29", ar: "المسافة الآمنة في الضباب تعطيك وقتًا أطول للتفاعل مع المخاطر المخفية.", explainAr: "Safe distance in fog gives you more time to react to hidden hazards." }
    ]
  },

  {
    id: "SM-30",
    topic: "safety-margins",
    promptEn: "Before driving in freezing weather, which parts of the car must be cleared of ice?",
    promptAr: "قبل القيادة في الطقس المتجمد، ما الذي يجب تنظيفه من الجليد؟",
    options: [
      { en: "Bumper", ar: "الصدام", correct: false },
      { en: "Windows", ar: "النوافذ", correct: true },
      { en: "Aerial", ar: "الهوائي", correct: false },
      { en: "Boot", ar: "صندوق السيارة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-30", ar: "النوافذ النظيفة ضرورية للرؤية الواضحة، مما يحسن السلامة في الطقس المتجمد.", explainAr: "Clear windows are essential for good visibility, improving safety in freezing weather." }
    ]
  },

  {
    id: "SM-31",
    topic: "safety-margins",
    promptEn: "When driving through a contraflow system, what should you do?",
    promptAr: "عند القيادة في نظام تحويل المسارات، ماذا تفعل؟",
    options: [
      { en: "Change lanes often", ar: "تغيير المسار باستمرار", correct: false },
      { en: "Increase speed", ar: "زيادة السرعة", correct: false },
      { en: "Choose your lane early", ar: "اختيار المسار مبكرًا", correct: true },
      { en: "Follow vehicles closely", ar: "القيادة عن قرب", correct: false }
    ],
    keywords: [
      { term: "hint-SM-31", ar: "اختيار المسار مبكرًا في أنظمة تحويل المسارات يمنحك وقتًا للتفاعل ويقلل التغييرات الخطيرة.", explainAr: "Choosing your lane early in contraflow systems gives you time to react and reduces dangerous lane changes." }
    ]
  },

  {
    id: "SM-32",
    topic: "safety-margins",
    promptEn: "In which condition does stopping distance increase the most?",
    promptAr: "في أي حالة تزداد مسافة التوقف أكثر؟",
    options: [
      { en: "Fog", ar: "الضباب", correct: false },
      { en: "Strong wind", ar: "الرياح", correct: false },
      { en: "Rain", ar: "المطر", correct: false },
      { en: "Ice", ar: "الجليد", correct: true }
    ],
    keywords: [
      { term: "hint-SM-32", ar: "الجليد يقلل الاحتكاك بشكل كبير، مما يزيد مسافة التوقف أكثر من أي حالة طقس أخرى.", explainAr: "Ice dramatically reduces friction, increasing stopping distance more than any other weather condition." }
    ]
  },

  {
    id: "SM-33",
    topic: "safety-margins",
    promptEn: "By how much can stopping distance increase on icy roads?",
    promptAr: "كم يمكن أن تزيد مسافة التوقف على طريق جليدي؟",
    options: [
      { en: "2 times", ar: "مرتين", correct: false },
      { en: "3 times", ar: "ثلاث مرات", correct: false },
      { en: "5 times", ar: "خمس مرات", correct: false },
      { en: "10 times", ar: "عشر مرات", correct: true }
    ],
    keywords: [
      { term: "hint-SM-33", ar: "الجليد يقلل الاحتكاك بشكل كبير، مما يجعل مسافة التوقف أطول بعشر مرات من الطرق الجافة.", explainAr: "Ice dramatically reduces friction, making stopping distance ten times longer than on dry roads." }
    ]
  },

  {
    id: "SM-34",
    topic: "safety-margins",
    promptEn: "How should you control speed when driving downhill?",
    promptAr: "كيف تتحكم بالسرعة عند النزول من منحدر؟",
    options: [
      { en: "High gear with firm braking", ar: "غيار عالي وفرملة قوية", correct: false },
      { en: "High gear without braking", ar: "غيار عالي بدون فرملة", correct: false },
      { en: "Low gear with gentle braking", ar: "غيار منخفض وفرملة لطيفة", correct: true },
      { en: "Low gear without braking", ar: "غيار منخفض بدون فرملة", correct: false }
    ],
    keywords: [
      { term: "hint-SM-34", ar: "الغيار المنخفض مع الفرملة التدريجية يستخدم فرملة المحرك ويحافظ على السيطرة على المنحدرات.", explainAr: "Low gear with gentle braking uses engine braking and maintains control on hills." }
    ]
  },

  // --- RULES OF THE ROAD ---

  {
    id: "RR-01",
    topic: "rules-of-the-road",
    promptEn: "What do red and white roadside marker posts usually warn drivers about?",
    promptAr: "ماذا تحذر الأعمدة الحمراء والبيضاء على جانب الطريق عادةً؟",
    options: [
      { en: "End of motorway", ar: "نهاية الطريق السريع", correct: false },
      { en: "Hidden railway crossing ahead", ar: "معبر سكة حديد مخفي أمامك", correct: true },
      { en: "Speed limit change", ar: "تغيير حد السرعة", correct: false },
      { en: "End of dual carriageway", ar: "نهاية الطريق المزدوج", correct: false }
    ],
    keywords: [
      { term: "roadside markers", ar: "أعمدة جانبية", explainAr: "أعمدة على جانب الطريق تحذر من المخاطر." },
      { term: "hint", ar: "تلميح", explainAr: "These markers are often used near hidden hazards." }
    ]
  },

  {
    id: "RR-02",
    topic: "rules-of-the-road",
    promptEn: "You want to overtake a slow-moving tractor but you're unsure it's safe. What should you do?",
    promptAr: "تريد تجاوز جرار بطيء لكنك غير متأكد من الأمان، ماذا تفعل؟",
    options: [
      { en: "Follow another car overtaking", ar: "اتبع سيارة أخرى تتجاوز", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Overtake quickly", ar: "تجاوز بسرعة", correct: false },
      { en: "Stay behind until it's clearly safe", ar: "ابق خلفه حتى يكون الأمر آمناً بوضوح", correct: true }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى." },
      { term: "hint", ar: "تلميح", explainAr: "Never overtake if you're unsure." }
    ]
  },

  {
    id: "RR-03",
    topic: "rules-of-the-road",
    promptEn: "What is the national speed limit on a single carriageway for cars and motorcycles (unless signs show otherwise)?",
    promptAr: "ما الحد الأقصى للسرعة على طريق بمسار واحد للسيارات والدراجات النارية؟",
    options: [
      { en: "30 mph", ar: "30 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: true },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "national speed limit", ar: "حد السرعة الوطني", explainAr: "حد السرعة الافتراضي على الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "This applies when no lower limit is signed." }
    ]
  },

  {
    id: "RR-04",
    topic: "rules-of-the-road",
    promptEn: "You're using full-beam headlights at night and another vehicle begins overtaking you. When should you dip your headlights?",
    promptAr: "تستخدم الضوء العالي ليلاً ويتم تجاوزك، متى تخفض الأضواء؟",
    options: [
      { en: "After they pass", ar: "بعد أن يمر", correct: false },
      { en: "When they finish overtaking", ar: "عندما ينتهي من التجاوز", correct: false },
      { en: "Only if they dip theirs", ar: "فقط إذا خفضوا أضواءهم", correct: false },
      { en: "Before they start to pass you", ar: "قبل أن يبدأوا بتجاوزك", correct: true }
    ],
    keywords: [
      { term: "full-beam headlights", ar: "الأضواء العالية", explainAr: "أضواء قوية تستخدم في الطرق المظلمة." },
      { term: "hint", ar: "تلميح", explainAr: "Avoid dazzling other drivers." }
    ]
  },

  {
    id: "RR-05",
    topic: "rules-of-the-road",
    promptEn: "When is it legal to drive across a pavement?",
    promptAr: "متى يُسمح قانونيًا بالقيادة فوق الرصيف؟",
    options: [
      { en: "To overtake traffic", ar: "لتجاوز المرور", correct: false },
      { en: "When it's wide", ar: "عندما يكون واسعاً", correct: false },
      { en: "If no pedestrians are present", ar: "إذا لم يكن هناك مشاة", correct: false },
      { en: "To access a property", ar: "للوصول إلى عقار", correct: true }
    ],
    keywords: [
      { term: "pavement", ar: "رصيف", explainAr: "ممر للمشاة بجانب الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Pavements are mainly for pedestrians." }
    ]
  },

  // --- VULNERABLE ROAD USERS ---

  {
    id: "VU-01",
    topic: "vulnerable-road-users",
    promptEn: "What should you do when approaching a pedestrian crossing where people may cross?",
    promptAr: "ماذا يجب أن تفعل عند الاقتراب من ممر مشاة قد يعبره أشخاص؟",
    options: [
      { en: "Prepare to slow down and be ready to stop", ar: "الاستعداد لتخفيف السرعة والتوقف", correct: true },
      { en: "Speed up and pass quickly", ar: "زيادة السرعة والمرور بسرعة", correct: false },
      { en: "Wave pedestrians across", ar: "الإشارة للمشاة بالعبور", correct: false },
      { en: "Continue unless someone steps out", ar: "الاستمرار إلا إذا نزل أحد إلى الطريق", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "منطقة مخصصة للمشاة لعبور الطريق بأمان." },
      { term: "give way", ar: "أعطِ أولوية المرور", explainAr: "السماح للمشاة بالعبور قبل أن تتحرك." },
      { term: "hint", ar: "تلميح", explainAr: "للمشاة دائماً أولوية المرور عند المعابر." }
    ]
  },

  {
    id: "VU-02",
    topic: "vulnerable-road-users",
    promptEn: "Which road user should you allow extra space when overtaking?",
    promptAr: "أي مستخدم طريق يجب أن تترك له مسافة إضافية عند التجاوز؟",
    options: [
      { en: "Lorry", ar: "شاحنة", correct: false },
      { en: "Tractor", ar: "جرار", correct: false },
      { en: "Bicycle", ar: "دراجة هوائية", correct: true },
      { en: "Road sweeper", ar: "كنس الشوارع", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أو مستخدم طريق آخر." },
      { term: "cyclist", ar: "درّاج", explainAr: "راكب دراجة هوائية يحتاج مساحة آمنة." },
      { term: "hint", ar: "تلميح", explainAr: "الدرّاجون ضعفاء وقد يكونون غير مستقرين." }
    ]
  },

  {
    id: "VU-03",
    topic: "vulnerable-road-users",
    promptEn: "Why should you check for motorcyclists before turning right?",
    promptAr: "لماذا يجب التحقق من وجود دراجات نارية قبل الانعطاف يمينًا؟",
    options: [
      { en: "They may overtake on your right", ar: "قد يتجاوزونك من اليمين", correct: true },
      { en: "They may stop suddenly", ar: "قد يتوقفون فجأة", correct: false },
      { en: "They may come from the side road", ar: "قد يخرجون من الطريق الجانبي", correct: false },
      { en: "They may slow down for you", ar: "قد يبطئون من أجلك", correct: false }
    ],
    keywords: [
      { term: "motorcyclist", ar: "سائق دراجة نارية", explainAr: "راكب دراجة نارية قد يكون صعب الرؤية." },
      { term: "turning right", ar: "الانعطاف يمينًا", explainAr: "تغيير الاتجاه إلى اليمين يتطلب فحص شامل." },
      { term: "hint", ar: "تلميح", explainAr: "الدراجات النارية سريعة وسهلة الفقدان." }
    ]
  },

  {
    id: "VU-04",
    topic: "vulnerable-road-users",
    promptEn: "When overtaking a cyclist in a 30 mph zone, how much space should you leave?",
    promptAr: "عند تجاوز دراجة هوائية في منطقة 30 ميل/س، كم مسافة يجب تركها؟",
    options: [
      { en: "At least the same space as overtaking a car", ar: "نفس المسافة عند تجاوز سيارة", correct: true },
      { en: "One car length", ar: "طول سيارة واحدة", correct: false },
      { en: "Half a lane", ar: "نصف مسار", correct: false },
      { en: "Two car widths", ar: "عرض سيارتين", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أو مستخدم طريق آخر." },
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية للتفاعل بأمان." },
      { term: "hint", ar: "تلميح", explainAr: "عامل الدرّاجين كالمركبات عند التجاوز." }
    ]
  },

  {
    id: "VU-05",
    topic: "vulnerable-road-users",
    promptEn: "If a pedestrian is behind your car while you are reversing, what should you do?",
    promptAr: "إذا كان هناك مشاة خلف سيارتك أثناء الرجوع للخلف، ماذا تفعل؟",
    options: [
      { en: "Give way to the pedestrian", ar: "إعطاء الأولوية للمشاة", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Reverse quickly", ar: "الرجوع بسرعة", correct: false },
      { en: "Signal them to stop", ar: "الإشارة لهم بالتوقف", correct: false }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف تتطلب حذرًا إضافيًا." },
      { term: "pedestrian priority", ar: "أولوية المشاة", explainAr: "للمشاة أولوية المرور دائمًا." },
      { term: "hint", ar: "تلميح", explainAr: "للمشاة دائماً أولوية المرور." }
    ]
  },

  {
    id: "VU-06",
    topic: "vulnerable-road-users",
    promptEn: "Who is allowed to use a toucan crossing?",
    promptAr: "من يُسمح له باستخدام Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)؟",
    options: [
      { en: "Cyclists and pedestrians", ar: "الدراجون والمشاة", correct: true },
      { en: "Motorcyclists only", ar: "راكبو الدراجات النارية فقط", correct: false },
      { en: "Pedestrians only", ar: "المشاة فقط", correct: false },
      { en: "Vehicles only", ar: "المركبات فقط", correct: false }
    ],
    keywords: [
      { term: "toucan crossing", ar: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)", explainAr: "ممر مشاة يمكن للدرّاجين والمشاة استخدامه معًا." },
      { term: "cyclists", ar: "الدرّاجون", explainAr: "راكبو الدراجات الهوائية." },
      { term: "hint", ar: "تلميح", explainAr: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك) = اثنان يمكنهما العبور." }
    ]
  },

  {
    id: "VU-07",
    topic: "vulnerable-road-users",
    promptEn: "What should you do if parked vehicles block your view at a junction?",
    promptAr: "ماذا تفعل إذا حجبت السيارات المتوقفة رؤيتك عند التقاطع؟",
    options: [
      { en: "Stop, then edge forward slowly", ar: "التوقف ثم التقدم ببطء", correct: true },
      { en: "Move out quickly", ar: "الخروج بسرعة", correct: false },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Get out and look", ar: "النزول والنظر", correct: false }
    ],
    keywords: [
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." },
      { term: "blocked view", ar: "رؤية محجوبة", explainAr: "عدم القدرة على رؤية الطريق بوضوح." },
      { term: "hint", ar: "تلميح", explainAr: "الحركة المتحكم بها تحسن السلامة." }
    ]
  },

  {
    id: "VU-08",
    topic: "vulnerable-road-users",
    promptEn: "At night, what does a pedestrian with reflective clothing and a red light indicate?",
    promptAr: "ماذا يعني مشاة يرتدون ملابس عاكسة ويحملون ضوءًا أحمر؟",
    options: [
      { en: "An organised walk or group", ar: "مسيرة منظمة", correct: true },
      { en: "Roadworks", ar: "أعمال طرق", correct: false },
      { en: "A slow vehicle", ar: "مركبة بطيئة", correct: false },
      { en: "A hazard sign", ar: "إشارة خطر", correct: false }
    ],
    keywords: [
      { term: "reflective clothing", ar: "ملابس عاكسة", explainAr: "ملابس تعكس الضوء لزيادة الرؤية." },
      { term: "night driving", ar: "القيادة الليلية", explainAr: "القيادة في الظلام تتطلب حذرًا إضافيًا." },
      { term: "hint", ar: "تلميح", explainAr: "يجب أن تكون المجموعات مرئية في الليل." }
    ]
  },

  {
    id: "VU-09",
    topic: "vulnerable-road-users",
    promptEn: "Why must you be extra alert for cyclists and motorcyclists at junctions?",
    promptAr: "لماذا يجب الانتباه أكثر للدراجات عند التقاطعات؟",
    options: [
      { en: "They are harder to see", ar: "يصعب رؤيتهم", correct: true },
      { en: "They always slow down", ar: "يبطئون دائمًا", correct: false },
      { en: "They must give way", ar: "يجب أن يعطوا الأولوية", correct: false },
      { en: "They stop often", ar: "يتوقفون كثيرًا", correct: false }
    ],
    keywords: [
      { term: "junctions", ar: "التقاطعات", explainAr: "نقاط التقاء طرق متعددة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية المركبات والمستخدمين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "المركبات الأصغر تندمج في حركة المرور." }
    ]
  },

  {
    id: "VU-10",
    topic: "vulnerable-road-users",
    promptEn: "Why must zig-zag road markings near schools be kept clear?",
    promptAr: "لماذا يجب إبقاء علامات الزجزاج قرب المدارس خالية؟",
    options: [
      { en: "To help children see and be seen", ar: "لمساعدة الأطفال على الرؤية والرؤية", correct: true },
      { en: "For teachers parking", ar: "لوقوف المعلمين", correct: false },
      { en: "For deliveries", ar: "للتوصيل", correct: false },
      { en: "For parents stopping", ar: "لتوقف الأهالي", correct: false }
    ],
    keywords: [
      { term: "zig-zag markings", ar: "علامات الزجزاج", explainAr: "علامات على الطريق تشير إلى منطقة مدرسة." },
      { term: "school zone", ar: "منطقة مدرسة", explainAr: "منطقة قرب المدرسة تتطلب حذرًا إضافيًا." },
      { term: "hint", ar: "تلميح", explainAr: "الرؤية تنقذ الأرواح." }
    ]
  },

  {
    id: "VU-11",
    topic: "vulnerable-road-users",
    promptEn: "In which situation should you be especially alert for motorcyclists and cyclists?",
    promptAr: "في أي موقف يجب أن تنتبه بشكل خاص للدراجات النارية والدراجات الهوائية؟",
    options: [
      { en: "On dual carriageways", ar: "على الطرق المزدوجة", correct: false },
      { en: "At junctions", ar: "عند التقاطعات", correct: true },
      { en: "At zebra crossings", ar: "عند ممرات المشاة", correct: false },
      { en: "On one-way streets", ar: "في الشوارع ذات الاتجاه الواحد", correct: false }
    ],
    keywords: [
      { term: "junctions", ar: "التقاطعات", explainAr: "نقاط التقاء طرق متعددة حيث قد يكون من الصعب رؤية الدراجات." },
      { term: "alert", ar: "منتبه", explainAr: "التركيز والانتباه المستمر للطريق." },
      { term: "hint", ar: "تلميح", explainAr: "التقاطعات هي نقاط الخطر الرئيسية للدراجات." }
    ]
  },

  {
    id: "VU-12",
    topic: "vulnerable-road-users",
    promptEn: "What should you do when you see an older person about to cross the road ahead?",
    promptAr: "ماذا يجب أن تفعل عندما ترى شخصًا مسنًا يستعد لعبور الطريق أمامك؟",
    options: [
      { en: "Expect them to wait for you", ar: "توقّع أن ينتظر مرورك", correct: false },
      { en: "Speed up to pass quickly", ar: "زيادة السرعة للمرور بسرعة", correct: false },
      { en: "Stop and wave them across", ar: "التوقف والإشارة لهم بالعبور", correct: false },
      { en: "Be cautious as they may misjudge your speed", ar: "كن حذرًا فقد يخطئون في تقدير سرعتك", correct: true }
    ],
    keywords: [
      { term: "elderly", ar: "كبار السن", explainAr: "أشخاص قد يحتاجون وقتًا أطول لتقدير السرعة والمسافة." },
      { term: "misjudge", ar: "خطأ في التقدير", explainAr: "عدم القدرة على تقدير السرعة بشكل صحيح." },
      { term: "hint", ar: "تلميح", explainAr: "كبار السن قد يخطئون في تقدير سرعتك." }
    ]
  },

  {
    id: "VU-13",
    topic: "vulnerable-road-users",
    promptEn: "You're approaching a roundabout and a cyclist ahead is signalling to turn right. What should you do?",
    promptAr: "أنت تقترب من دوّار ويوجد درّاج أمامك يشير إلى الانعطاف يمينًا، ماذا تفعل؟",
    options: [
      { en: "Overtake on the right", ar: "التجاوز من اليمين", correct: false },
      { en: "Sound your horn", ar: "استخدام البوق", correct: false },
      { en: "Signal them to move across", ar: "الإشارة له بالتحرك", correct: false },
      { en: "Give the cyclist plenty of room", ar: "اترك له مساحة كافية", correct: true }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث قد يشغل الدرّاجون المسار بالكامل." },
      { term: "cyclist signalling", ar: "إشارة الدرّاج", explainAr: "الدرّاجون يشيرون لاتجاههم قبل الانعطاف." },
      { term: "hint", ar: "تلميح", explainAr: "اترك مساحة كافية للدرّاجين في الدوارات." }
    ]
  },

  {
    id: "VU-14",
    topic: "vulnerable-road-users",
    promptEn: "How does a school crossing patrol normally signal traffic to stop?",
    promptAr: "كيف يقوم مراقب عبور المدرسة عادةً بإعطاء إشارة التوقف؟",
    options: [
      { en: "By pointing at children", ar: "بالإشارة إلى الأطفال", correct: false },
      { en: "By showing a red light", ar: "بعرض ضوء أحمر", correct: false },
      { en: "By holding up a STOP sign", ar: "برفع لوحة توقف", correct: true },
      { en: "By giving an arm signal only", ar: "بإشارة يد فقط", correct: false }
    ],
    keywords: [
      { term: "school crossing patrol", ar: "مراقب عبور المدرسة", explainAr: "شخص مسؤول عن مساعدة الأطفال في عبور الطريق بأمان." },
      { term: "STOP sign", ar: "لوحة توقف", explainAr: "لوحة تحمل كلمة STOP لإيقاف المرور." },
      { term: "hint", ar: "تلميح", explainAr: "مراقبو عبور المدرسة يستخدمون لوحة STOP." }
    ]
  },

  {
    id: "VU-15",
    topic: "vulnerable-road-users",
    promptEn: "At a pelican crossing, what must you do while the amber light is flashing?",
    promptAr: "عند ممر المشاة بإشارة ضوئية (Pelican Crossing)، ماذا يجب أن تفعل عندما يكون الضوء الأصفر يومض؟",
    options: [
      { en: "Signal pedestrians to cross", ar: "الإشارة للمشاة بالعبور", correct: false },
      { en: "Always wait for green", ar: "الانتظار دائمًا للضوء الأخضر", correct: false },
      { en: "Give way to pedestrians already on the crossing", ar: "إعطاء الأولوية للمشاة الموجودين على الممر", correct: true },
      { en: "Wait for red-and-amber", ar: "الانتظار حتى الأحمر والأصفر", correct: false }
    ],
    keywords: [
      { term: "pelican crossing", ar: "ممر المشاة بإشارة ضوئية (Pelican Crossing)", explainAr: "ممر مشاة مع إشارات ضوئية." },
      { term: "amber light flashing", ar: "الضوء الأصفر الوامض", explainAr: "إشارة تحذيرية تشير إلى أن المشاة قد لا يزالون يعبرون." },
      { term: "hint", ar: "تلميح", explainAr: "عندما يومض الضوء الأصفر، أعطِ الأولوية للمشاة على ممر بيليكان." }
    ]
  },

  {
    id: "VU-16",
    topic: "vulnerable-road-users",
    promptEn: "On a country road, who may be travelling towards you on your side of the road?",
    promptAr: "على طريق ريفي، من قد يكون قادمًا باتجاهك في نفس جانب الطريق؟",
    options: [
      { en: "Motorcycles", ar: "دراجات نارية", correct: false },
      { en: "Bicycles", ar: "دراجات هوائية", correct: false },
      { en: "Pedestrians", ar: "مشاة", correct: true },
      { en: "Cars only", ar: "سيارات فقط", correct: false }
    ],
    keywords: [
      { term: "country road", ar: "طريق ريفي", explainAr: "طريق في المناطق الريفية قد يكون ضيقًا." },
      { term: "pedestrians", ar: "المشاة", explainAr: "مستخدمو طريق على الأقدام قد يسيرون على نفس جانب الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "في الطرق الريفية، قد يسير المشاة على نفس جانب الطريق." }
    ]
  },

  {
    id: "VU-17",
    topic: "vulnerable-road-users",
    promptEn: "What does a shared route sign for pedestrians and cyclists indicate?",
    promptAr: "ماذا تعني إشارة المسار المشترك للمشاة والدراجات؟",
    options: [
      { en: "Pedestrians only", ar: "للمشاة فقط", correct: false },
      { en: "Cyclists only", ar: "للدّراجات فقط", correct: false },
      { en: "No access for either", ar: "ممنوع للجميع", correct: false },
      { en: "Shared route for pedestrians and cyclists", ar: "مسار مشترك للمشاة والدراجات", correct: true }
    ],
    keywords: [
      { term: "shared route", ar: "مسار مشترك", explainAr: "مسار يمكن للمشاة والدرّاجين استخدامه معًا." },
      { term: "sign", ar: "إشارة", explainAr: "علامة تشير إلى نوع المسار المسموح." },
      { term: "hint", ar: "تلميح", explainAr: "المسار المشترك يعني أن المشاة والدرّاجين يمكنهم استخدامه معًا." }
    ]
  },

  {
    id: "VU-18",
    topic: "vulnerable-road-users",
    promptEn: "When following a motorcyclist on a poor road surface, what should you do?",
    promptAr: "عند متابعة دراجة نارية على طريق سيئ السطح، ماذا يجب أن تفعل؟",
    options: [
      { en: "Follow closely", ar: "الاقتراب الشديد", correct: false },
      { en: "Overtake immediately", ar: "التجاوز فورًا", correct: false },
      { en: "Allow extra space in case they swerve", ar: "ترك مسافة إضافية في حال الانحراف", correct: true },
      { en: "Keep normal distance", ar: "مسافة عادية", correct: false }
    ],
    keywords: [
      { term: "poor road surface", ar: "طريق سيئ السطح", explainAr: "طريق به حفر أو سطح غير مستوٍ." },
      { term: "swerve", ar: "الانحراف", explainAr: "تغيير الاتجاه فجأة لتجنب عائق." },
      { term: "hint", ar: "تلميح", explainAr: "الطرق السيئة قد تجعل الدراجات النارية تنحرف فجأة." }
    ]
  },

  {
    id: "VU-19",
    topic: "vulnerable-road-users",
    promptEn: "What is the main purpose of school zig-zag road markings?",
    promptAr: "ما الهدف الأساسي من علامات الزجزاج أمام المدارس؟",
    options: [
      { en: "Allow teachers to park", ar: "السماح للمعلمين بالوقوف", correct: false },
      { en: "Allow deliveries", ar: "السماح بالتوصيل", correct: false },
      { en: "Help children see and be seen when crossing", ar: "مساعدة الأطفال على الرؤية والرؤية عند العبور", correct: true },
      { en: "Parent pick-up area", ar: "منطقة استلام الأهالي", correct: false }
    ],
    keywords: [
      { term: "zig-zag markings", ar: "علامات الزجزاج", explainAr: "علامات على الطريق تشير إلى منطقة مدرسة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الأطفال ورؤيتهم من قبل السائقين." },
      { term: "hint", ar: "تلميح", explainAr: "علامات الزجزاج تحسن الرؤية للأطفال والسائقين." }
    ]
  },

  {
    id: "VU-20",
    topic: "vulnerable-road-users",
    promptEn: "In slow-moving traffic, what should you do just before changing lanes?",
    promptAr: "في حركة مرور بطيئة، ماذا يجب أن تفعل قبل تغيير المسار؟",
    options: [
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Look for motorcyclists filtering through traffic", ar: "التحقق من الدراجات التي تمر بين السيارات", correct: true },
      { en: "Give a hand signal", ar: "إعطاء إشارة يد", correct: false },
      { en: "Change down to first gear", ar: "النزول إلى الغيار الأول", correct: false }
    ],
    keywords: [
      { term: "changing lanes", ar: "تغيير المسار", explainAr: "الانتقال من مسار إلى آخر." },
      { term: "filtering", ar: "المرور بين السيارات", explainAr: "الدراجات النارية قد تمر بين السيارات في حركة المرور البطيئة." },
      { term: "hint", ar: "تلميح", explainAr: "الدراجات النارية قد تمر بين السيارات في حركة المرور البطيئة." }
    ]
  },

  {
    id: "VU-21",
    topic: "vulnerable-road-users",
    promptEn: "You approach a roundabout and see a horse rider signalling to turn right while staying to the left. What should you do?",
    promptAr: "عند اقترابك من دوّار ترى فارس خيل يشير للانعطاف يمينًا لكنه يبقى إلى اليسار، ماذا يجب أن تفعل؟",
    options: [
      { en: "Continue as normal", ar: "المتابعة بشكل طبيعي", correct: false },
      { en: "Drive close to them", ar: "الاقتراب منهم", correct: false },
      { en: "Cut in front of them", ar: "الدخول أمامهم", correct: false },
      { en: "Stay well back", ar: "البقاء على مسافة آمنة", correct: true }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث قد يشغل الفارسون مساحة أكبر." },
      { term: "horse rider", ar: "فارس خيل", explainAr: "مستخدم طريق ضعيف يحتاج مساحة آمنة." },
      { term: "hint", ar: "تلميح", explainAr: "الفارسون يحتاجون مساحة للانعطاف - ابق على مسافة آمنة." }
    ]
  },

  {
    id: "VU-22",
    topic: "vulnerable-road-users",
    promptEn: "How should you behave when dealing with inexperienced drivers?",
    promptAr: "كيف يجب أن تتعامل مع السائقين قليلي الخبرة؟",
    options: [
      { en: "Use your horn to warn them", ar: "استخدام البوق لتحذيرهم", correct: false },
      { en: "Be patient and expect slower reactions", ar: "التحلي بالصبر وتوقّع ردود أبطأ", correct: true },
      { en: "Flash your headlights to guide them", ar: "وميض الأضواء لإرشادهم", correct: false },
      { en: "Overtake them immediately", ar: "تجاوزهم فورًا", correct: false }
    ],
    keywords: [
      { term: "inexperienced drivers", ar: "سائقون قليلو الخبرة", explainAr: "سائقون جدد قد يحتاجون وقتًا أطول للتفاعل." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالهدوء وإعطاء الوقت الكافي للآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "السائقون الجدد قد يتفاعلون ببطء - كن صبورًا." }
    ]
  },

  {
    id: "VU-23",
    topic: "vulnerable-road-users",
    promptEn: "What makes a toucan crossing different from a puffin crossing?",
    promptAr: "ما الذي يميز Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك) عن ممر بفن؟",
    options: [
      { en: "It can be used by mopeds", ar: "يُستخدم للدراجات النارية", correct: false },
      { en: "It's controlled by a traffic officer", ar: "يُدار بواسطة شرطي مرور", correct: false },
      { en: "It uses flashing lights only", ar: "يعمل بأضواء وامضة فقط", correct: false },
      { en: "It allows pedestrians and cyclists together", ar: "يسمح بمرور المشاة والدراجات معًا", correct: true }
    ],
    keywords: [
      { term: "toucan crossing", ar: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)", explainAr: "ممر مشاة يمكن للدرّاجين والمشاة استخدامه معًا." },
      { term: "puffin crossing", ar: "ممر بفن", explainAr: "ممر مشاة للمشاة فقط مع إشارات ضوئية." },
      { term: "hint", ar: "تلميح", explainAr: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك) = اثنان يمكنهما العبور (المشاة والدراجات)." }
    ]
  },

  {
    id: "VU-24",
    topic: "vulnerable-road-users",
    promptEn: "You see flashing amber lights below a school warning sign. What should you do?",
    promptAr: "ترى أضواء صفراء وامضة أسفل إشارة مدرسة، ماذا يجب أن تفعل؟",
    options: [
      { en: "Reduce speed until clear of the area", ar: "تخفيف السرعة حتى تجاوز المنطقة", correct: true },
      { en: "Maintain speed and sound the horn", ar: "الحفاظ على السرعة واستخدام البوق", correct: false },
      { en: "Increase speed to pass quickly", ar: "زيادة السرعة للمرور بسرعة", correct: false },
      { en: "Stop and wait until lights stop", ar: "التوقف حتى تتوقف الأضواء", correct: false }
    ],
    keywords: [
      { term: "school warning sign", ar: "إشارة تحذير مدرسة", explainAr: "إشارة تشير إلى وجود مدرسة قريبة." },
      { term: "flashing amber lights", ar: "أضواء صفراء وامضة", explainAr: "أضواء تحذيرية تشير إلى وجود خطر محتمل." },
      { term: "hint", ar: "تلميح", explainAr: "الأضواء الوامضة تعني أن الأطفال قد يعبرون - خفف السرعة." }
    ]
  },

  {
    id: "VU-25",
    topic: "vulnerable-road-users",
    promptEn: "When overtaking a cyclist, why should you leave as much space as you would for a car?",
    promptAr: "عند تجاوز درّاج، لماذا يجب ترك مسافة مماثلة لتجاوز سيارة؟",
    options: [
      { en: "The cyclist may suddenly speed up", ar: "قد يزيد سرعته فجأة", correct: false },
      { en: "The cyclist may get off the bike", ar: "قد ينزل عن الدراجة", correct: false },
      { en: "The cyclist may become unstable if passed closely", ar: "قد يفقد توازنه إذا مررت قريبًا", correct: true },
      { en: "The cyclist may turn left", ar: "قد ينعطف يسارًا", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "التجاوز", explainAr: "المرور بجانب مركبة أو مستخدم طريق آخر." },
      { term: "cyclist stability", ar: "استقرار الدرّاج", explainAr: "الدرّاجون قد يفقدون التوازن إذا مررت قريبًا جدًا." },
      { term: "hint", ar: "تلميح", explainAr: "المرور القريب قد يجعل الدرّاج يفقد التوازن - اترك مسافة كافية." }
    ]
  },

  {
    id: "VU-26",
    topic: "vulnerable-road-users",
    promptEn: "On a narrow road, a horse rider ahead is riding in the centre of the lane. What should you do?",
    promptAr: "على طريق ضيق، فارس خيل يسير في وسط المسار، ماذا تفعل؟",
    options: [
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Stay behind and allow this position", ar: "البقاء خلفه والسماح له بالاستمرار", correct: true },
      { en: "Move right and pass carefully", ar: "التحرك يمينًا والتجاوز بحذر", correct: false },
      { en: "Drive close to encourage movement", ar: "الاقتراب لدفعه للتحرك", correct: false }
    ],
    keywords: [
      { term: "narrow road", ar: "طريق ضيق", explainAr: "طريق ضيق قد لا يوفر مساحة كافية للتجاوز الآمن." },
      { term: "horse rider", ar: "فارس خيل", explainAr: "مستخدم طريق ضعيف يحتاج مساحة آمنة." },
      { term: "hint", ar: "تلميح", explainAr: "الفارسون قد يشغلون وسط المسار للأمان - ابق خلفهم." }
    ]
  },

  {
    id: "VU-27",
    topic: "vulnerable-road-users",
    promptEn: "You want to reverse into a side road and you're unsure if the area behind is clear. What should you do?",
    promptAr: "تريد الرجوع للخلف إلى شارع جانبي ولست متأكدًا أن الطريق خلفك خالٍ، ماذا تفعل؟",
    options: [
      { en: "Check mirrors only", ar: "الاكتفاء بالمرايا", correct: false },
      { en: "Continue carefully", ar: "المتابعة بحذر", correct: false },
      { en: "Get out and check", ar: "النزول والتحقق بنفسك", correct: true },
      { en: "Look through rear window only", ar: "النظر من النافذة الخلفية فقط", correct: false }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف تتطلب حذرًا إضافيًا." },
      { term: "side road", ar: "شارع جانبي", explainAr: "طريق فرعي قد يحتوي على مشاة أو مركبات." },
      { term: "hint", ar: "تلميح", explainAr: "إذا لم تكن متأكدًا، انزل وتحقق بنفسك - السلامة أولاً." }
    ]
  },

  {
    id: "VU-28",
    topic: "vulnerable-road-users",
    promptEn: "Where would you normally see a sign warning drivers about children crossing?",
    promptAr: "أين ترى عادةً إشارة تحذير من عبور الأطفال؟",
    options: [
      { en: "Near a school crossing", ar: "قرب ممر مدرسة", correct: true },
      { en: "At a playground entrance", ar: "عند مدخل ملعب", correct: false },
      { en: "On a school bus", ar: "على حافلة مدرسية", correct: false },
      { en: "In pedestrian-only zones", ar: "في مناطق المشاة فقط", correct: false }
    ],
    keywords: [
      { term: "children crossing", ar: "عبور الأطفال", explainAr: "منطقة قد يعبرها أطفال - يجب توخي الحذر الشديد." },
      { term: "school crossing", ar: "ممر مدرسة", explainAr: "ممر مشاة مخصص للأطفال قرب المدارس." },
      { term: "hint", ar: "تلميح", explainAr: "إشارات عبور الأطفال توجد عادة قرب المدارس." }
    ]
  },

  {
    id: "VU-29",
    topic: "vulnerable-road-users",
    promptEn: "You see several horse riders ahead on the road. What should you do?",
    promptAr: "ترى عدة فرسان خيل أمامك على الطريق، ماذا يجب أن تفعل؟",
    options: [
      { en: "Move to the centre of the road", ar: "الانتقال لمنتصف الطريق", correct: false },
      { en: "Slow down and be ready to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Switch on hazard lights", ar: "تشغيل أضواء التحذير", correct: false },
      { en: "Signal to turn right", ar: "الإشارة لليمين", correct: false }
    ],
    keywords: [
      { term: "horse riders", ar: "فرسان خيل", explainAr: "مستخدمو طريق ضعفاء يحتاجون حماية خاصة." },
      { term: "multiple riders", ar: "عدة فرسان", explainAr: "مجموعة من الفارسين قد تحتاج مساحة أكبر." },
      { term: "hint", ar: "تلميح", explainAr: "المجموعات الكبيرة من الفارسين تحتاج حذرًا إضافيًا - خفف السرعة." }
    ]
  },

  {
    id: "VU-30",
    topic: "vulnerable-road-users",
    promptEn: "You're approaching a zebra crossing and a person in a wheelchair is waiting to cross. What should you do?",
    promptAr: "تقترب من ممر مشاة ويوجد شخص على كرسي متحرك ينتظر العبور، ماذا تفعل؟",
    options: [
      { en: "Continue driving", ar: "المتابعة بالقيادة", correct: false },
      { en: "Wave them to cross", ar: "الإشارة له بالعبور", correct: false },
      { en: "Wave them to wait", ar: "الإشارة له بالانتظار", correct: false },
      { en: "Be prepared to stop", ar: "الاستعداد للتوقف", correct: true }
    ],
    keywords: [
      { term: "zebra crossing", ar: "ممر مشاة مخطّط", explainAr: "ممر مشاة بخطوط بيضاء حيث للمشاة أولوية العبور." },
      { term: "wheelchair", ar: "كرسي متحرك", explainAr: "جهاز يستخدمه الأشخاص ذوو القدرة المحدودة على الحركة." },
      { term: "hint", ar: "تلميح", explainAr: "للمشاة دائماً أولوية المرور عند المعابر - استعد للتوقف." }
    ]
  },

  {
    id: "VU-31",
    topic: "vulnerable-road-users",
    promptEn: "You're approaching a roundabout and see horses being ridden ahead. What should you do?",
    promptAr: "تقترب من دوّار وترى خيولًا تسير أمامك. ماذا يجب أن تفعل؟",
    options: [
      { en: "Sound your horn", ar: "استخدام البوق", correct: false },
      { en: "Treat them like normal cars", ar: "التعامل معهم كسيارات", correct: false },
      { en: "Give them plenty of space", ar: "ترك مسافة كافية لهم", correct: true },
      { en: "Accelerate past quickly", ar: "التسارع وتجاوزهم", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث قد يشغل الفارسون مساحة أكبر." },
      { term: "horses", ar: "خيول", explainAr: "الحيوانات قد تخاف من الضوضاء والحركة المفاجئة." },
      { term: "hint", ar: "تلميح", explainAr: "الخيول قد تفزع بسهولة - اترك مساحة كافية." }
    ]
  },

  {
    id: "VU-32",
    topic: "vulnerable-road-users",
    promptEn: "Why should you be cautious when there's a bus stopped on the opposite side of the road?",
    promptAr: "لماذا يجب أن تكون حذرًا عند وجود حافلة متوقفة على الجهة المقابلة؟",
    options: [
      { en: "The bus may be broken down", ar: "قد تكون الحافلة معطلة", correct: false },
      { en: "Pedestrians may cross in front of it", ar: "قد يعبر مشاة من أمامها", correct: true },
      { en: "The bus may stay parked", ar: "قد تبقى متوقفة", correct: false },
      { en: "The bus may reverse", ar: "قد ترجع للخلف", correct: false }
    ],
    keywords: [
      { term: "bus", ar: "حافلة", explainAr: "مركبة كبيرة قد تحجب رؤية المشاة." },
      { term: "pedestrians crossing", ar: "عبور المشاة", explainAr: "المشاة قد يعبرون من أمام الحافلة المتوقفة." },
      { term: "hint", ar: "تلميح", explainAr: "الحافلات المتوقفة قد تخفي المشاة خلفها." }
    ]
  },

  {
    id: "VU-33",
    topic: "vulnerable-road-users",
    promptEn: "Two cyclists are riding ahead toward a roundabout in the left lane. What should you expect?",
    promptAr: "درّاجان يسيران أمامك باتجاه دوّار في المسار الأيسر. ماذا تتوقع؟",
    options: [
      { en: "They will turn left", ar: "سينعطفون يسارًا", correct: false },
      { en: "They may turn right", ar: "قد ينعطفون يمينًا", correct: true },
      { en: "They will stop suddenly", ar: "سيتوقفون فجأة", correct: false },
      { en: "They must go straight", ar: "يجب أن يذهبوا مستقيمًا", correct: false }
    ],
    keywords: [
      { term: "cyclists", ar: "الدرّاجون", explainAr: "راكبو الدراجات الهوائية قد يشغلون المسار بالكامل." },
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث قد يشغل الدرّاجون المسار بالكامل." },
      { term: "hint", ar: "تلميح", explainAr: "الدرّاجون قد يشغلون المسار بالكامل للانعطاف في الدوارات." }
    ]
  },

  {
    id: "VU-34",
    topic: "vulnerable-road-users",
    promptEn: "You're following a cyclist and want to turn left shortly ahead. What should you do?",
    promptAr: "تتبع درّاجًا وتريد الانعطاف يسارًا قريبًا. ماذا تفعل؟",
    options: [
      { en: "Overtake before the junction", ar: "تجاوزه قبل التقاطع", correct: false },
      { en: "Pull alongside and stay level", ar: "السير بمحاذاته", correct: false },
      { en: "Wait behind until the cyclist passes", ar: "الانتظار خلفه حتى يتجاوز التقاطع", correct: true },
      { en: "Go around them at the junction", ar: "الدوران حوله عند التقاطع", correct: false }
    ],
    keywords: [
      { term: "following", ar: "المتابعة", explainAr: "القيادة خلف مركبة أو مستخدم طريق آخر." },
      { term: "turning left", ar: "الانعطاف يسارًا", explainAr: "تغيير الاتجاه إلى اليسار." },
      { term: "hint", ar: "تلميح", explainAr: "لا تتجاوز الدرّاجين قبل التقاطعات - انتظر حتى يتجاوزوا." }
    ]
  },

  {
    id: "VU-35",
    topic: "vulnerable-road-users",
    promptEn: "A ball rolls out from between parked cars ahead. What should you do?",
    promptAr: "كرة تخرج من بين سيارات متوقفة أمامك. ماذا تفعل؟",
    options: [
      { en: "Maintain speed and sound the horn", ar: "الاستمرار بنفس السرعة واستخدام البوق", correct: false },
      { en: "Flash headlights and continue", ar: "وميض الأضواء والمتابعة", correct: false },
      { en: "Slow down and be ready to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Stop and wave children across", ar: "التوقف والإشارة للأطفال", correct: false }
    ],
    keywords: [
      { term: "ball", ar: "كرة", explainAr: "كرة قد تشير إلى وجود أطفال قريبين." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تحجب رؤية الأطفال." },
      { term: "hint", ar: "تلميح", explainAr: "الكرة قد تعني طفلًا يركض خلفها - خفف السرعة." }
    ]
  },

  {
    id: "VU-36",
    topic: "vulnerable-road-users",
    promptEn: "At night, you're dazzled by headlights from behind. What should you do?",
    promptAr: "ليلًا، تُبهرك أضواء مركبة خلفك. ماذا تفعل؟",
    options: [
      { en: "Adjust mirror to anti-dazzle", ar: "ضبط المرآة لوضعية منع الإبهار", correct: true },
      { en: "Brake sharply", ar: "الفرملة بقوة", correct: false },
      { en: "Flash rear lights", ar: "وميض الأضواء الخلفية", correct: false },
      { en: "Ignore it", ar: "تجاهل الأمر", correct: false }
    ],
    keywords: [
      { term: "dazzled", ar: "مبهر", explainAr: "عدم القدرة على الرؤية بوضوح بسبب الضوء القوي." },
      { term: "anti-dazzle", ar: "منع الإبهار", explainAr: "وضعية المرآة التي تقلل من الإبهار." },
      { term: "hint", ar: "تلميح", explainAr: "استخدم وضعية منع الإبهار في المرآة لتقليل الوهج." }
    ]
  },

  {
    id: "VU-37",
    topic: "vulnerable-road-users",
    promptEn: "Which road user is generally most vulnerable?",
    promptAr: "أي مستخدم طريق يُعد الأكثر ضعفًا؟",
    options: [
      { en: "Car driver", ar: "سائق سيارة", correct: false },
      { en: "Tractor driver", ar: "سائق جرار", correct: false },
      { en: "Lorry driver", ar: "سائق شاحنة", correct: false },
      { en: "Motorcyclist", ar: "سائق دراجة نارية", correct: true }
    ],
    keywords: [
      { term: "vulnerable", ar: "ضعيف", explainAr: "أكثر عرضة للخطر ويحتاج حماية خاصة." },
      { term: "motorcyclist", ar: "سائق دراجة نارية", explainAr: "راكب دراجة نارية لا يحميه هيكل مركبة." },
      { term: "hint", ar: "تلميح", explainAr: "الدراجات النارية لا توفر حماية مثل المركبات الأخرى." }
    ]
  },

  {
    id: "VU-38",
    topic: "vulnerable-road-users",
    promptEn: "What does a sign showing a shared route for pedestrians and cyclists mean?",
    promptAr: "ماذا تعني إشارة طريق مشترك للمشاة والدراجات؟",
    options: [
      { en: "Pedestrians only", ar: "للمشاة فقط", correct: false },
      { en: "Cyclists only", ar: "للدّراجات فقط", correct: false },
      { en: "No pedestrians or cyclists", ar: "ممنوع المشاة والدراجات", correct: false },
      { en: "Shared route for both", ar: "مسار مشترك لكليهما", correct: true }
    ],
    keywords: [
      { term: "shared route", ar: "مسار مشترك", explainAr: "مسار يمكن للمشاة والدرّاجين استخدامه معًا." },
      { term: "sign", ar: "إشارة", explainAr: "علامة تشير إلى نوع المسار المسموح." },
      { term: "hint", ar: "تلميح", explainAr: "المسار المشترك يعني أن المشاة والدرّاجين يمكنهم استخدامه معًا." }
    ]
  },

  {
    id: "VU-39",
    topic: "vulnerable-road-users",
    promptEn: "What is the purpose of the marked area between two stop lines at traffic lights?",
    promptAr: "ما الغرض من المنطقة المحددة بين خطي توقف عند الإشارات؟",
    options: [
      { en: "Taxi waiting area", ar: "منطقة انتظار سيارات الأجرة", correct: false },
      { en: "Pedestrian crossing", ar: "عبور المشاة", correct: false },
      { en: "Cycle waiting area", ar: "منطقة انتظار الدراجات", correct: true },
      { en: "Emergency access", ar: "ممر طوارئ", correct: false }
    ],
    keywords: [
      { term: "stop lines", ar: "خطوط التوقف", explainAr: "خطوط على الطريق تشير إلى مكان التوقف." },
      { term: "traffic lights", ar: "إشارات المرور", explainAr: "إشارات ضوئية تتحكم بحركة المرور." },
      { term: "hint", ar: "تلميح", explainAr: "المنطقة بين خطوط التوقف مخصصة للدرّاجين." }
    ]
  },

  {
    id: "VU-40",
    topic: "vulnerable-road-users",
    promptEn: "You're turning right into a side road. Pedestrians are waiting to cross. What should you do?",
    promptAr: "تنعطف يمينًا إلى شارع جانبي وهناك مشاة ينتظرون العبور. ماذا تفعل؟",
    options: [
      { en: "Turn immediately", ar: "الانعطاف فورًا", correct: false },
      { en: "Wave them across", ar: "الإشارة لهم بالعبور", correct: false },
      { en: "Wait and give way", ar: "الانتظار وإعطاؤهم أولوية", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "turning right", ar: "الانعطاف يمينًا", explainAr: "تغيير الاتجاه إلى اليمين." },
      { term: "side road", ar: "شارع جانبي", explainAr: "طريق فرعي يتقاطع مع الطريق الرئيسي." },
      { term: "hint", ar: "تلميح", explainAr: "للمشاة دائماً أولوية المرور - انتظر حتى يعبروا." }
    ]
  },

  {
    id: "VU-41",
    topic: "vulnerable-road-users",
    promptEn: "A cyclist ahead is signalling right but keeping left on a roundabout. What should you do?",
    promptAr: "درّاج أمامك يشير يمينًا لكنه يبقى يسارًا في دوّار. ماذا تفعل؟",
    options: [
      { en: "Overtake", ar: "تجاوزه", correct: false },
      { en: "Assume left turn", ar: "افتراض أنه سينعطف يسارًا", correct: false },
      { en: "Allow space to turn", ar: "ترك مساحة له", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري حيث قد يشغل الدرّاجون المسار بالكامل." },
      { term: "signalling", ar: "الإشارة", explainAr: "استخدام إشارات الانعطاف لتحديد الاتجاه." },
      { term: "hint", ar: "تلميح", explainAr: "الدرّاجون قد يحتاجون مساحة للانعطاف في الدوارات." }
    ]
  },

  {
    id: "VU-42",
    topic: "vulnerable-road-users",
    promptEn: "You're behind a moped and want to turn left soon. What should you do?",
    promptAr: "تتبع دراجة نارية صغيرة وتريد الانعطاف يسارًا قريبًا. ماذا تفعل؟",
    options: [
      { en: "Overtake before the junction", ar: "تجاوزه قبل التقاطع", correct: false },
      { en: "Stay behind until it passes", ar: "البقاء خلفه حتى يتجاوز التقاطع", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Pull alongside", ar: "السير بمحاذاته", correct: false }
    ],
    keywords: [
      { term: "moped", ar: "دراجة نارية صغيرة", explainAr: "مركبة صغيرة قد تكون بطيئة الحركة." },
      { term: "turning left", ar: "الانعطاف يسارًا", explainAr: "تغيير الاتجاه إلى اليسار." },
      { term: "hint", ar: "تلميح", explainAr: "لا تتجاوز المركبات الضعيفة قبل التقاطعات - انتظر حتى تتجاوز." }
    ]
  },

  {
    id: "VU-43",
    topic: "vulnerable-road-users",
    promptEn: "At a pelican crossing, the lights turn green but elderly people are still crossing. What should you do?",
    promptAr: "عند ممر المشاة بإشارة ضوئية (Pelican Crossing)، تتحول الإشارة للأخضر لكن كبار السن لا يزالون يعبرون. ماذا تفعل؟",
    options: [
      { en: "Encourage them to hurry", ar: "حثهم على الإسراع", correct: false },
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false },
      { en: "Wait patiently", ar: "الانتظار بصبر", correct: true },
      { en: "Rev engine", ar: "زيادة صوت المحرك", correct: false }
    ],
    keywords: [
      { term: "pelican crossing", ar: "ممر المشاة بإشارة ضوئية (Pelican Crossing)", explainAr: "ممر مشاة مع إشارات ضوئية." },
      { term: "elderly", ar: "كبار السن", explainAr: "أشخاص قد يحتاجون وقتًا أطول للعبور." },
      { term: "hint", ar: "تلميح", explainAr: "كبار السن قد يحتاجون وقتًا أطول للعبور على ممر بيليكان - كن صبورًا." }
    ]
  },

  {
    id: "VU-44",
    topic: "vulnerable-road-users",
    promptEn: "You see a bicycle wheel sticking out from between parked cars ahead. What should you do?",
    promptAr: "ترى عجلة دراجة تبرز بين سيارات متوقفة. ماذا تفعل؟",
    options: [
      { en: "Accelerate past", ar: "التسارع", correct: false },
      { en: "Brake sharply", ar: "الفرملة بقوة", correct: false },
      { en: "Slow down and prepare to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "bicycle wheel", ar: "عجلة دراجة", explainAr: "جزء من دراجة قد يشير إلى وجود درّاج قريب." },
      { term: "parked cars", ar: "سيارات متوقفة", explainAr: "السيارات المتوقفة قد تحجب رؤية الدرّاجين." },
      { term: "hint", ar: "تلميح", explainAr: "عجلة دراجة قد تعني درّاجًا قريبًا - خفف السرعة." }
    ]
  },

  {
    id: "VU-45",
    topic: "vulnerable-road-users",
    promptEn: "Why should you look carefully for motorcycles when emerging from a junction?",
    promptAr: "لماذا يجب الانتباه جيدًا للدراجات النارية عند الخروج من تقاطع؟",
    options: [
      { en: "They are faster than all vehicles", ar: "أسرع من الجميع", correct: false },
      { en: "They can be hidden from view", ar: "قد تكون مخفية عن الرؤية", correct: true },
      { en: "They have priority", ar: "لهم أولوية", correct: false },
      { en: "Police often ride them", ar: "الشرطة تستخدمها", correct: false }
    ],
    keywords: [
      { term: "junction", ar: "تقاطع", explainAr: "نقطة التقاء طرق متعددة." },
      { term: "motorcycle", ar: "دراجة نارية", explainAr: "مركبة صغيرة قد تكون صعبة الرؤية." },
      { term: "hint", ar: "تلميح", explainAr: "الدراجات النارية صغيرة ويمكن أن تكون مخفية عن الرؤية." }
    ]
  },

  {
    id: "VU-46",
    topic: "vulnerable-road-users",
    promptEn: "Which road users are hardest to see when reversing?",
    promptAr: "من هم أصعب مستخدمي الطريق رؤية عند الرجوع للخلف؟",
    options: [
      { en: "Car drivers", ar: "سائقو السيارات", correct: false },
      { en: "Motorcyclists", ar: "سائقي الدراجات النارية", correct: false },
      { en: "Cyclists", ar: "الدراجون", correct: false },
      { en: "Children", ar: "الأطفال", correct: true }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف تتطلب حذرًا إضافيًا." },
      { term: "children", ar: "الأطفال", explainAr: "الأطفال صغار الحجم وقد يكونون غير مرئيين خلف السيارة." },
      { term: "hint", ar: "تلميح", explainAr: "الأطفال صغار وقد يكونون غير مرئيين في المرايا." }
    ]
  },

  {
    id: "VU-47",
    topic: "vulnerable-road-users",
    promptEn: "At a pelican crossing, a disabled person is crossing slowly and the lights turn green. What should you do?",
    promptAr: "عند ممر المشاة بإشارة ضوئية (Pelican Crossing)، شخص من ذوي الإعاقة يعبر ببطء ويتحول الضوء للأخضر. ماذا تفعل؟",
    options: [
      { en: "Drive through", ar: "المتابعة", correct: false },
      { en: "Edge forward", ar: "التقدم قليلًا", correct: false },
      { en: "Sound the horn", ar: "استخدام البوق", correct: false },
      { en: "Wait until they finish", ar: "الانتظار حتى ينتهي", correct: true }
    ],
    keywords: [
      { term: "pelican crossing", ar: "ممر المشاة بإشارة ضوئية (Pelican Crossing)", explainAr: "ممر مشاة مع إشارات ضوئية." },
      { term: "disabled person", ar: "شخص من ذوي الإعاقة", explainAr: "شخص قد يحتاج وقتًا أطول للعبور." },
      { term: "hint", ar: "تلميح", explainAr: "الأشخاص من ذوي الإعاقة يحتاجون وقتًا إضافيًا على ممر بيليكان - انتظر حتى ينتهوا." }
    ]
  },

  {
    id: "VU-48",
    topic: "vulnerable-road-users",
    promptEn: "The pavement is closed due to roadworks. What should you be alert for?",
    promptAr: "الرصيف مغلق بسبب أعمال طريق. ما الذي يجب الانتباه له؟",
    options: [
      { en: "Pedestrians in the road", ar: "المشاة في الطريق", correct: true },
      { en: "Faster traffic", ar: "حركة أسرع", correct: false },
      { en: "Clear lanes", ar: "مسارات خالية", correct: false },
      { en: "Fewer hazards", ar: "مخاطر أقل", correct: false }
    ],
    keywords: [
      { term: "pavement", ar: "الرصيف", explainAr: "المسار المخصص للمشاة." },
      { term: "roadworks", ar: "أعمال طريق", explainAr: "أعمال صيانة أو بناء على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "عند إغلاق الرصيف، قد يضطر المشاة للسير على الطريق." }
    ]
  },

  {
    id: "VU-49",
    topic: "vulnerable-road-users",
    promptEn: "Which sign warns that pedestrians may be walking along the road?",
    promptAr: "أي إشارة تحذر من وجود مشاة يسيرون على الطريق؟",
    options: [
      { en: "Pedestrian warning sign", ar: "إشارة تحذير المشاة", correct: true },
      { en: "No entry sign", ar: "ممنوع الدخول", correct: false },
      { en: "One-way sign", ar: "اتجاه واحد", correct: false },
      { en: "Speed limit sign", ar: "حد السرعة", correct: false }
    ],
    keywords: [
      { term: "pedestrian warning sign", ar: "إشارة تحذير المشاة", explainAr: "إشارة تحذيرية تشير إلى وجود مشاة على الطريق." },
      { term: "road signs", ar: "إشارات الطريق", explainAr: "علامات وإشارات توفر معلومات مهمة للسائقين." },
      { term: "hint", ar: "تلميح", explainAr: "إشارات التحذير تساعدك على الاستعداد للمخاطر المحتملة." }
    ]
  },

  {
    id: "VU-50",
    topic: "vulnerable-road-users",
    promptEn: "When turning left into a side road, what hazard should you watch for most carefully?",
    promptAr: "عند الانعطاف يسارًا إلى شارع جانبي، ما الخطر الأهم الذي يجب الانتباه له؟",
    options: [
      { en: "Parked vehicles", ar: "السيارات المتوقفة", correct: false },
      { en: "Traffic congestion", ar: "ازدحام المرور", correct: false },
      { en: "Pedestrians crossing", ar: "المشاة الذين يعبرون", correct: true },
      { en: "One-way streets", ar: "الشوارع ذات الاتجاه الواحد", correct: false }
    ],
    keywords: [
      { term: "turning left", ar: "الانعطاف يسارًا", explainAr: "تغيير الاتجاه إلى اليسار يتطلب فحص شامل." },
      { term: "side road", ar: "شارع جانبي", explainAr: "طريق فرعي يتصل بالطريق الرئيسي." },
      { term: "hint", ar: "تلميح", explainAr: "المشاة هم الأكثر عرضة للخطر عند المنعطفات." }
    ]
  },

  {
    id: "VU-51",
    topic: "vulnerable-road-users",
    promptEn: "Why do motorcyclists often wear bright or reflective clothing?",
    promptAr: "لماذا يرتدي سائقي الدراجات النارية ملابس زاهية أو عاكسة؟",
    options: [
      { en: "It is legally required", ar: "مطلوب قانونياً", correct: false },
      { en: "It keeps them cooler", ar: "لتبريد الجسم", correct: false },
      { en: "It is fashionable", ar: "للموضة", correct: false },
      { en: "To be more visible to others", ar: "ليكونوا أكثر وضوحاً للآخرين", correct: true }
    ],
    keywords: [
      { term: "reflective clothing", ar: "ملابس عاكسة", explainAr: "ملابس تعكس الضوء لزيادة الرؤية." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية المركبات والمستخدمين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "الرؤية الجيدة تقلل خطر الحوادث." }
    ]
  },

  {
    id: "VU-52",
    topic: "vulnerable-road-users",
    promptEn: "Why might a motorcyclist look over their right shoulder before turning right?",
    promptAr: "لماذا ينظر سائق الدراجة النارية فوق كتفه الأيمن قبل الانعطاف يميناً؟",
    options: [
      { en: "To listen for traffic", ar: "لسماع المرور", correct: false },
      { en: "Because motorcycles lack mirrors", ar: "لعدم وجود مرايا", correct: false },
      { en: "To help balance", ar: "للموازنة", correct: false },
      { en: "To check blind spots", ar: "لفحص النقطة العمياء", correct: true }
    ],
    keywords: [
      { term: "blind spot", ar: "النقطة العمياء", explainAr: "منطقة لا يمكن رؤيتها في المرايا." },
      { term: "shoulder check", ar: "فحص الكتف", explainAr: "النظر فوق الكتف للتحقق من النقطة العمياء." },
      { term: "hint", ar: "تلميح", explainAr: "النقاط العمياء شائعة مع المركبات ذات العجلتين." }
    ]
  },

  {
    id: "VU-53",
    topic: "vulnerable-road-users",
    promptEn: "What does a flashing amber beacon on a moving vehicle usually indicate?",
    promptAr: "ماذا يدل الضوء الأصفر الوامض على مركبة متحركة؟",
    options: [
      { en: "Emergency vehicle", ar: "مركبة طوارئ", correct: false },
      { en: "Broken down vehicle", ar: "مركبة معطلة", correct: false },
      { en: "Slow-moving or working vehicle", ar: "مركبة بطيئة أو عاملة", correct: true },
      { en: "School patrol", ar: "دورية مدرسية", correct: false }
    ],
    keywords: [
      { term: "amber beacon", ar: "ضوء أصفر", explainAr: "ضوء تحذيري أصفر اللون." },
      { term: "warning light", ar: "ضوء تحذيري", explainAr: "ضوء يشير إلى وجود خطر محتمل." },
      { term: "hint", ar: "تلميح", explainAr: "الأضواء الصفراء تحذر من مركبات بطيئة أو عاملة." }
    ]
  },

  {
    id: "VU-54",
    topic: "vulnerable-road-users",
    promptEn: "What does a sign showing a bicycle symbol on a blue background usually mean?",
    promptAr: "ماذا تعني إشارة دراجة على خلفية زرقاء؟",
    options: [
      { en: "No cycling", ar: "ممنوع ركوب الدراجات", correct: false },
      { en: "Cycle route", ar: "مسار دراجات", correct: true },
      { en: "Bicycle parking", ar: "موقف دراجات", correct: false },
      { en: "End of cycle route", ar: "نهاية مسار الدراجات", correct: false }
    ],
    keywords: [
      { term: "cycle route", ar: "مسار دراجات", explainAr: "مسار مخصص للدراجات الهوائية." },
      { term: "blue sign", ar: "إشارة زرقاء", explainAr: "إشارة زرقاء تعطي معلومات وليست تحذيرية." },
      { term: "hint", ar: "تلميح", explainAr: "الإشارات الزرقاء تعطي معلومات وليست تحذيرات." }
    ]
  },

  {
    id: "VU-55",
    topic: "vulnerable-road-users",
    promptEn: "A pedestrian is walking with a dog wearing a yellow or burgundy coat. What does this indicate?",
    promptAr: "شخص يمشي مع كلب يرتدي معطفاً أصفر أو خمري. ماذا يعني ذلك؟",
    options: [
      { en: "The person is elderly", ar: "الشخص مسن", correct: false },
      { en: "The person is a trainer", ar: "الشخص مدرب", correct: false },
      { en: "The person is deaf", ar: "الشخص أصم", correct: false },
      { en: "The person has a hearing impairment", ar: "الشخص يعاني من ضعف السمع", correct: true }
    ],
    keywords: [
      { term: "hearing impairment", ar: "ضعف السمع", explainAr: "عدم القدرة على السمع بشكل كامل." },
      { term: "assistance dog", ar: "كلب مساعد", explainAr: "كلب مدرب لمساعدة الأشخاص ذوي الإعاقة." },
      { term: "hint", ar: "تلميح", explainAr: "هذه المعاطف تشير إلى كلاب مساعدة للأشخاص ذوي ضعف السمع." }
    ]
  },

  {
    id: "VU-56",
    topic: "vulnerable-road-users",
    promptEn: "How should you pass horse riders safely?",
    promptAr: "كيف تتجاوز راكبي الخيل بأمان؟",
    options: [
      { en: "Pass quickly", ar: "التجاوز بسرعة", correct: false },
      { en: "Sound horn", ar: "استخدام البوق", correct: false },
      { en: "Drive slowly and give space", ar: "القيادة ببطء وإعطاء مسافة", correct: true },
      { en: "Pass closely", ar: "التجاوز عن قرب", correct: false }
    ],
    keywords: [
      { term: "horse riders", ar: "راكبو الخيل", explainAr: "أشخاص يركبون الخيول على الطريق." },
      { term: "safe passing", ar: "تجاوز آمن", explainAr: "المرور بجانب راكبي الخيل ببطء ومسافة كافية." },
      { term: "hint", ar: "تلميح", explainAr: "الخيول قد تخاف من الضوضاء أو السرعة." }
    ]
  },

  {
    id: "VU-57",
    topic: "vulnerable-road-users",
    promptEn: "A learner driver stalls at a junction. What should you do?",
    promptAr: "متعلم قيادة يتوقف محركه عند تقاطع. ماذا تفعل؟",
    options: [
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false },
      { en: "Rev engine", ar: "زيادة صوت المحرك", correct: false },
      { en: "Be patient", ar: "التحلي بالصبر", correct: true },
      { en: "Overtake immediately", ar: "التجاوز فوراً", correct: false }
    ],
    keywords: [
      { term: "learner driver", ar: "متعلم قيادة", explainAr: "شخص يتعلم القيادة ويحتاج وقتاً أطول للتفاعل." },
      { term: "stall", ar: "توقف المحرك", explainAr: "توقف محرك السيارة بشكل مفاجئ." },
      { term: "hint", ar: "تلميح", explainAr: "المتعلمون قد يحتاجون وقتاً أطول للتفاعل." }
    ]
  },

  {
    id: "VU-58",
    topic: "vulnerable-road-users",
    promptEn: "Where would you normally see a reflective yellow school warning sign?",
    promptAr: "أين تُرى عادة إشارة تحذير مدرسية صفراء عاكسة؟",
    options: [
      { en: "On cars", ar: "على السيارات", correct: false },
      { en: "On playground gates", ar: "على بوابات الملاعب", correct: false },
      { en: "On school buses", ar: "على حافلات المدارس", correct: false },
      { en: "On roadside near schools", ar: "على جانب الطريق قرب المدارس", correct: true }
    ],
    keywords: [
      { term: "school warning sign", ar: "إشارة تحذير مدرسية", explainAr: "إشارة تحذيرية تشير إلى وجود مدرسة قريبة." },
      { term: "reflective sign", ar: "إشارة عاكسة", explainAr: "إشارة تعكس الضوء لزيادة الرؤية." },
      { term: "hint", ar: "تلميح", explainAr: "الإشارات التحذيرية المدرسية توضع قرب المدارس." }
    ]
  },

  {
    id: "VU-59",
    topic: "vulnerable-road-users",
    promptEn: "Before turning right into a side road, what should you check last?",
    promptAr: "قبل الانعطاف يميناً إلى شارع جانبي، ماذا يجب فحصه أخيراً؟",
    options: [
      { en: "Speed", ar: "السرعة", correct: false },
      { en: "Gear", ar: "الغيار", correct: false },
      { en: "Mirrors for overtaking traffic", ar: "المرايا للمرور المتجاوز", correct: true },
      { en: "Handbrake", ar: "فرامل اليد", correct: false }
    ],
    keywords: [
      { term: "turning right", ar: "الانعطاف يميناً", explainAr: "تغيير الاتجاه إلى اليمين." },
      { term: "mirror check", ar: "فحص المرايا", explainAr: "التحقق من المرايا قبل تغيير الاتجاه." },
      { term: "hint", ar: "تلميح", explainAr: "فحص المرايا للمرور المتجاوز مهم قبل الانعطاف." }
    ]
  },

  {
    id: "VU-60",
    topic: "vulnerable-road-users",
    promptEn: "How can new drivers reduce collision risk after passing their test?",
    promptAr: "كيف يقلل السائق الجديد خطر الحوادث بعد النجاح؟",
    options: [
      { en: "Drive close to others", ar: "القيادة قريباً من الآخرين", correct: false },
      { en: "Avoid high speeds only", ar: "تجنب السرعات العالية فقط", correct: false },
      { en: "Take extra training", ar: "أخذ تدريب إضافي", correct: true },
      { en: "Stay in left lane always", ar: "البقاء في المسار الأيسر دائماً", correct: false }
    ],
    keywords: [
      { term: "new driver", ar: "سائق جديد", explainAr: "سائق حديث النجاح في اختبار القيادة." },
      { term: "collision risk", ar: "خطر الاصطدام", explainAr: "احتمالية حدوث حادث مروري." },
      { term: "hint", ar: "تلميح", explainAr: "التدريب الإضافي يحسن المهارات ويقلل المخاطر." }
    ]
  },

  {
    id: "VU-61",
    topic: "vulnerable-road-users",
    promptEn: "A pedestrian carries a white stick with a red band. What does this mean?",
    promptAr: "شخص يحمل عصاً بيضاء مع شريط أحمر. ماذا يعني ذلك؟",
    options: [
      { en: "Limited mobility", ar: "حركة محدودة", correct: false },
      { en: "Deaf", ar: "أصم", correct: false },
      { en: "Blind", ar: "أعمى", correct: false },
      { en: "Deaf and blind", ar: "أصم وأعمى", correct: true }
    ],
    keywords: [
      { term: "white stick", ar: "عصا بيضاء", explainAr: "عصا يستخدمها الأشخاص المكفوفون." },
      { term: "red band", ar: "شريط أحمر", explainAr: "شريط أحمر على العصا يشير إلى إعاقة إضافية." },
      { term: "hint", ar: "تلميح", explainAr: "العصا البيضاء مع الشريط الأحمر تشير إلى إعاقة مزدوجة." }
    ]
  },

  {
    id: "VU-62",
    topic: "vulnerable-road-users",
    promptEn: "Pedestrians have started crossing where you want to turn left. What should you do?",
    promptAr: "بدأ المشاة بالعبور وأنت تريد الانعطاف يساراً. ماذا تفعل؟",
    options: [
      { en: "Sound horn", ar: "استخدام البوق", correct: false },
      { en: "Go around", ar: "الالتفاف حولهم", correct: false },
      { en: "Give way", ar: "إعطاء الأولوية", correct: true },
      { en: "Flash lights", ar: "وميض الأضواء", correct: false }
    ],
    keywords: [
      { term: "pedestrians crossing", ar: "المشاة يعبرون", explainAr: "المشاة الذين بدأوا عبور الطريق." },
      { term: "give way", ar: "أعطِ أولوية المرور", explainAr: "السماح للمشاة بالعبور قبل أن تتحرك." },
      { term: "hint", ar: "تلميح", explainAr: "للمشاة أولوية المرور عند عبور الطريق." }
    ]
  },

  {
    id: "VU-63",
    topic: "vulnerable-road-users",
    promptEn: "Why give extra space to motorcyclists on windy days?",
    promptAr: "لماذا تترك مسافة إضافية للدراجات النارية في الطقس العاصف؟",
    options: [
      { en: "They may speed up", ar: "قد يسرعون", correct: false },
      { en: "They may be blown sideways", ar: "قد ينفجرون جانبياً", correct: true },
      { en: "They may stop suddenly", ar: "قد يتوقفون فجأة", correct: false },
      { en: "They ride faster", ar: "يركبون أسرع", correct: false }
    ],
    keywords: [
      { term: "windy conditions", ar: "ظروف عاصفة", explainAr: "ظروف طقس مع رياح قوية." },
      { term: "sideways movement", ar: "حركة جانبية", explainAr: "حركة المركبة إلى الجانب بسبب الرياح." },
      { term: "hint", ar: "تلميح", explainAr: "الرياح القوية قد تدفع الدراجات النارية جانبياً." }
    ]
  },

  {
    id: "VU-64",
    topic: "vulnerable-road-users",
    promptEn: "Powered mobility vehicles on dual carriageways must display which beacon?",
    promptAr: "أي ضوء يجب أن تستخدمه مركبات ذوي الإعاقة على الطرق السريعة؟",
    options: [
      { en: "Red", ar: "أحمر", correct: false },
      { en: "Green", ar: "أخضر", correct: false },
      { en: "Blue", ar: "أزرق", correct: false },
      { en: "Amber", ar: "أصفر", correct: true }
    ],
    keywords: [
      { term: "powered mobility vehicle", ar: "مركبة ذوي الإعاقة", explainAr: "مركبة كهربائية للأشخاص ذوي الإعاقة." },
      { term: "dual carriageway", ar: "طريق سريع", explainAr: "طريق متعدد المسارات بفاصل وسطي." },
      { term: "hint", ar: "تلميح", explainAr: "مركبات ذوي الإعاقة يجب أن تستخدم ضوءاً أصفر على الطرق السريعة." }
    ]
  },

  {
    id: "VU-65",
    topic: "vulnerable-road-users",
    promptEn: "A horse rider is in the left lane at a roundabout. Where might they go?",
    promptAr: "راكب خيل في المسار الأيسر عند دوّار. أين قد يتجه؟",
    options: [
      { en: "Left only", ar: "يسار فقط", correct: false },
      { en: "Right only", ar: "يمين فقط", correct: false },
      { en: "Straight only", ar: "مستقيم فقط", correct: false },
      { en: "Any direction", ar: "أي اتجاه", correct: true }
    ],
    keywords: [
      { term: "horse rider", ar: "راكب خيل", explainAr: "شخص يركب حصاناً على الطريق." },
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري." },
      { term: "hint", ar: "تلميح", explainAr: "راكبو الخيل قد يحتاجون المسار الكامل للدوار." }
    ]
  },

  {
    id: "VU-66",
    topic: "vulnerable-road-users",
    promptEn: "Older people are crossing ahead. What should you do?",
    promptAr: "كبار السن يعبرون الطريق أمامك. ماذا تفعل؟",
    options: [
      { en: "Wave them", ar: "الإشارة لهم", correct: false },
      { en: "Rev engine", ar: "زيادة صوت المحرك", correct: false },
      { en: "Be patient", ar: "التحلي بالصبر", correct: true },
      { en: "Sound horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "elderly pedestrians", ar: "مشاة مسنون", explainAr: "المشاة المسنون قد يتحركون ببطء." },
      { term: "patience", ar: "الصبر", explainAr: "التحلي بالصبر مع المشاة المسنون." },
      { term: "hint", ar: "تلميح", explainAr: "كبار السن يحتاجون وقتاً أطول للعبور." }
    ]
  },

  {
    id: "VU-67",
    topic: "vulnerable-road-users",
    promptEn: "Yellow zigzag lines outside a school mean what?",
    promptAr: "ماذا تعني الخطوط الصفراء المتعرجة أمام المدارس؟",
    options: [
      { en: "Parking allowed", ar: "الوقوف مسموح", correct: false },
      { en: "Waiting allowed", ar: "الانتظار مسموح", correct: false },
      { en: "No stopping or parking", ar: "ممنوع التوقف أو الوقوف", correct: true },
      { en: "Drop-off only", ar: "إنزال فقط", correct: false }
    ],
    keywords: [
      { term: "zigzag lines", ar: "خطوط متعرجة", explainAr: "علامات على الطريق تشير إلى منطقة مدرسة." },
      { term: "school zone", ar: "منطقة مدرسة", explainAr: "منطقة قرب المدرسة تتطلب حذراً إضافياً." },
      { term: "hint", ar: "تلميح", explainAr: "الخطوط المتعرجة الصفراء تعني ممنوع التوقف أو الوقوف." }
    ]
  },

  {
    id: "VU-68",
    topic: "vulnerable-road-users",
    promptEn: "Loose sheep are on the road. What should you do?",
    promptAr: "أغنام سائبة على الطريق. ماذا تفعل؟",
    options: [
      { en: "Sound horn", ar: "استخدام البوق", correct: false },
      { en: "Go slowly", ar: "الذهاب ببطء", correct: true },
      { en: "Pass quickly", ar: "المرور بسرعة", correct: false },
      { en: "Herd them", ar: "تجمعهم", correct: false }
    ],
    keywords: [
      { term: "loose animals", ar: "حيوانات سائبة", explainAr: "حيوانات على الطريق بدون رقابة." },
      { term: "slow down", ar: "تخفيف السرعة", explainAr: "تقليل السرعة للتعامل مع الحيوانات." },
      { term: "hint", ar: "تلميح", explainAr: "الحيوانات السائبة تتطلب قيادة حذرة وبطيئة." }
    ]
  },

  {
    id: "VU-69",
    topic: "vulnerable-road-users",
    promptEn: "Before turning right from a queue, why check your right mirror?",
    promptAr: "لماذا تفحص المرآة اليمنى قبل الانعطاف يميناً من صف؟",
    options: [
      { en: "Pedestrians", ar: "المشاة", correct: false },
      { en: "Overtaking vehicles", ar: "المركبات المتجاوزة", correct: true },
      { en: "Side road traffic", ar: "حركة المرور الجانبية", correct: false },
      { en: "Parked cars", ar: "السيارات المتوقفة", correct: false }
    ],
    keywords: [
      { term: "right mirror", ar: "المرآة اليمنى", explainAr: "المرآة الجانبية اليمنى للسيارة." },
      { term: "overtaking", ar: "التجاوز", explainAr: "مرور مركبة أمام مركبة أخرى." },
      { term: "hint", ar: "تلميح", explainAr: "فحص المرآة اليمنى مهم للتحقق من المركبات المتجاوزة." }
    ]
  },

  {
    id: "VU-70",
    topic: "vulnerable-road-users",
    promptEn: "You're turning left and a pedestrian is waiting to cross the side road. What should you do?",
    promptAr: "تنعطف يساراً وهناك مشاة ينتظرون العبور. ماذا تفعل؟",
    options: [
      { en: "Flash lights", ar: "وميض الأضواء", correct: false },
      { en: "Continue", ar: "المتابعة", correct: false },
      { en: "Sound horn", ar: "استخدام البوق", correct: false },
      { en: "Give way", ar: "إعطاء الأولوية", correct: true }
    ],
    keywords: [
      { term: "turning left", ar: "الانعطاف يساراً", explainAr: "تغيير الاتجاه إلى اليسار." },
      { term: "pedestrian waiting", ar: "مشاة ينتظرون", explainAr: "المشاة الذين ينتظرون عبور الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "للمشاة أولوية المرور عند عبور الطريق." }
    ]
  },

  {
    id: "VU-71",
    topic: "vulnerable-road-users",
    promptEn: "Why do motorcyclists use dipped headlights during the day?",
    promptAr: "لماذا يستخدم سائقي الدراجات النارية الأضواء المنخفضة نهاراً؟",
    options: [
      { en: "Battery protection", ar: "حماية البطارية", correct: false },
      { en: "To be seen clearly", ar: "ليكونوا مرئيين بوضوح", correct: true },
      { en: "Better vision", ar: "رؤية أفضل", correct: false },
      { en: "Invitation to pass", ar: "دعوة للمرور", correct: false }
    ],
    keywords: [
      { term: "dipped headlights", ar: "الأضواء المنخفضة", explainAr: "أضواء السيارة المنخفضة للرؤية." },
      { term: "daytime visibility", ar: "الرؤية النهارية", explainAr: "القدرة على رؤية المركبات أثناء النهار." },
      { term: "hint", ar: "تلميح", explainAr: "الأضواء النهارية تساعد السائقين الآخرين على رؤية الدراجات النارية." }
    ]
  },

  // --- VEHICLE HANDLING ---

  {
    id: "VH-01",
    topic: "vehicle-handling",
    promptEn: "When is it acceptable to pass another vehicle on the left?",
    promptAr: "متى يُسمح لك بتجاوز مركبة من الجهة اليسرى؟",
    options: [
      { en: "When the vehicle ahead is signalling to turn left", ar: "عندما تكون المركبة أمامك تُشير للانعطاف يساراً", correct: false },
      { en: "When you are approaching a slip road to leave", ar: "عندما تقترب من مخرج للانحراف خارج الطريق", correct: false },
      { en: "When you are on a one-way street", ar: "عندما تكون في شارع باتجاه واحد", correct: false },
      { en: "When traffic in the right lane is moving slowly in queues", ar: "عندما يكون السير في المسار الأيمن بطيئاً ضمن طوابير", correct: true }
    ],
    keywords: [
      { term: "overtaking on the left", ar: "التجاوز من اليسار", explainAr: "التجاوز من الجهة اليسرى مسموح فقط في حالات محددة." },
      { term: "slow-moving queues", ar: "طوابير بطيئة", explainAr: "صفوف مركبات تتحرك ببطء." },
      { term: "hint", ar: "تلميح", explainAr: "التجاوز يساراً يكون غالباً مسموحاً فقط عند الطوابير البطيئة." }
    ]
  },

  {
    id: "VH-02",
    topic: "vehicle-handling",
    promptEn: "In fog, why should you leave a bigger gap to the vehicle ahead?",
    promptAr: "في الضباب، لماذا يجب أن تترك مسافة أكبر مع المركبة أمامك؟",
    options: [
      { en: "In case it turns suddenly", ar: "لاحتمال أن تغيّر اتجاهها فجأة", correct: false },
      { en: "In case its fog lights dazzle you", ar: "لأن أضواء الضباب قد تُبهرك", correct: false },
      { en: "In case it stops suddenly", ar: "لاحتمال أن تتوقف فجأة", correct: true },
      { en: "In case its brake lights dazzle you", ar: "لأن أضواء الفرامل قد تُبهرك", correct: false }
    ],
    keywords: [
      { term: "fog", ar: "ضباب", explainAr: "ظروف رؤية ضعيفة تتطلب حذراً إضافياً." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة اللازمة للتوقف بأمان." },
      { term: "hint", ar: "تلميح", explainAr: "في الضباب تظهر المخاطر متأخرة—قد يحدث توقف مفاجئ." }
    ]
  },

  {
    id: "VH-03",
    topic: "vehicle-handling",
    promptEn: "On a wet bend, why might a motorcyclist avoid riding over drain covers?",
    promptAr: "على منعطف مبلل، لماذا قد يتجنب سائق الدراجة النارية أغطية المصارف؟",
    options: [
      { en: "To avoid puncturing the tyre", ar: "لتجنب ثقب الإطار", correct: false },
      { en: "Because metal covers can be slippery", ar: "لأن الغطاء المعدني قد يكون زلقاً", correct: true },
      { en: "To use them as turning markers", ar: "لاستخدامها كعلامات للمنعطف", correct: false },
      { en: "To avoid splashing pedestrians", ar: "لتجنب رش الماء على المشاة", correct: false }
    ],
    keywords: [
      { term: "drain covers", ar: "أغطية المصارف", explainAr: "أغطية معدنية للمصارف قد تكون زلقة عند البلل." },
      { term: "wet bend", ar: "منعطف مبلل", explainAr: "منعطف على طريق مبلل يتطلب حذراً إضافياً." },
      { term: "hint", ar: "تلميح", explainAr: "المعدن الأملس يقلل التماسك خصوصاً عند البلل." }
    ]
  },

  {
    id: "VH-04",
    topic: "vehicle-handling",
    promptEn: "What is most likely to happen when driving up a steep hill?",
    promptAr: "ما الأكثر احتمالاً عند القيادة صعوداً على منحدر شديد؟",
    options: [
      { en: "High gears will pull better", ar: "الغيارات العالية ستكون أفضل", correct: false },
      { en: "Steering will feel heavier", ar: "سيصبح المقود أثقل", correct: false },
      { en: "Overtaking becomes easier", ar: "يصبح التجاوز أسهل", correct: false },
      { en: "The engine will work harder", ar: "سيعمل المحرك بجهد أكبر", correct: true }
    ],
    keywords: [
      { term: "steep hill", ar: "منحدر شديد", explainAr: "منحدر حاد يتطلب جهداً أكبر من المحرك." },
      { term: "engine load", ar: "حمل المحرك", explainAr: "الجهد الذي يبذله المحرك لدفع المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "المنحدرات تزيد حمل المحرك وقد تقلل السرعة." }
    ]
  },

  {
    id: "VH-05",
    topic: "vehicle-handling",
    promptEn: "Why is \"coasting\" (rolling with the clutch down or in neutral) unsafe?",
    promptAr: "لماذا تُعد \"القيادة على الفاضي/الدبرياج\" غير آمنة؟",
    options: [
      { en: "It uses more fuel", ar: "يستهلك وقوداً أكثر", correct: false },
      { en: "It overheats the engine", ar: "يسخن المحرك", correct: false },
      { en: "It reduces control of steering and braking", ar: "يقلل التحكم بالتوجيه والفرملة", correct: true },
      { en: "It improves tyre wear", ar: "يحسن تآكل الإطارات", correct: false }
    ],
    keywords: [
      { term: "coasting", ar: "القيادة على الفاضي", explainAr: "القيادة مع الدبرياج مضغوطاً أو على الفاضي." },
      { term: "control", ar: "التحكم", explainAr: "القدرة على توجيه وفرملة المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "تفقد فرملة المحرك ويقل التحكم." }
    ]
  },

  {
    id: "VH-06",
    topic: "vehicle-handling",
    promptEn: "You meet an oncoming vehicle on a single-track road. What should you do?",
    promptAr: "تقابل مركبة قادمة على طريق بمسار واحد ضيق. ماذا تفعل؟",
    options: [
      { en: "Reverse back to the main road", ar: "ارجع للخلف حتى الطريق الرئيسي", correct: false },
      { en: "Do an emergency stop", ar: "قم بتوقف طارئ", correct: false },
      { en: "Use a passing place and be prepared to wait", ar: "استخدم ممر التجاوز واستعد للانتظار", correct: true },
      { en: "Switch on hazard lights", ar: "شغّل أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "single-track road", ar: "طريق بمسار واحد", explainAr: "طريق ضيق بمسار واحد فقط." },
      { term: "passing place", ar: "ممر التجاوز", explainAr: "مكان مخصص للسماح للمركبات بالمرور." },
      { term: "hint", ar: "تلميح", explainAr: "استخدم أماكن التجاوز لتفادي الإعاقة والحفاظ على الأمان." }
    ]
  },

  {
    id: "VH-07",
    topic: "vehicle-handling",
    promptEn: "You're on a road with speed humps and the driver ahead is slower. What should you do?",
    promptAr: "على طريق فيه مطبات، والسائق أمامك أبطأ. ماذا تفعل؟",
    options: [
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Overtake as soon as you can", ar: "تجاوز بأسرع وقت", correct: false },
      { en: "Flash headlights", ar: "ومض الأضواء", correct: false },
      { en: "Slow down and stay behind", ar: "خفف السرعة وابقَ خلفه", correct: true }
    ],
    keywords: [
      { term: "speed humps", ar: "مطبات سرعة", explainAr: "مطبات على الطريق لإجبار السائقين على تخفيض السرعة." },
      { term: "steady speed", ar: "سرعة ثابتة", explainAr: "السرعة المناسبة للقيادة بأمان." },
      { term: "hint", ar: "تلميح", explainAr: "المطبات تتطلب قيادة هادئة ومتحكم بها." }
    ]
  },

  {
    id: "VH-08",
    topic: "vehicle-handling",
    promptEn: "Why is it risky to keep the clutch down or stay in neutral for a long time while moving?",
    promptAr: "لماذا من الخطر إبقاء الدبرياج مضغوطاً أو البقاء على الفاضي لفترة طويلة؟",
    options: [
      { en: "Fuel will spill", ar: "سينسكب الوقود", correct: false },
      { en: "The engine will be damaged", ar: "سيتلف المحرك", correct: false },
      { en: "You have less steering and braking control", ar: "يقل التحكم بالتوجيه والفرامل", correct: true },
      { en: "Tyres wear faster", ar: "تتآكل الإطارات أسرع", correct: false }
    ],
    keywords: [
      { term: "clutch down", ar: "الدبرياج مضغوط", explainAr: "الضغط على دواسة الدبرياج لفصل المحرك." },
      { term: "neutral", ar: "الفاضي", explainAr: "وضع الغيار على الفاضي." },
      { term: "hint", ar: "تلميح", explainAr: "القيادة على الفاضي تقلل التحكم وقد تزيد مسافة التوقف." }
    ]
  },

  // --- INCIDENTS ---

  {
    id: "IN-01",
    topic: "incidents",
    promptEn: "What's the safest action if your car catches fire while driving through a tunnel?",
    promptAr: "ما الإجراء الأكثر أمانًا إذا اشتعلت النار في سيارتك داخل نفق؟",
    options: [
      { en: "Leave the engine running and exit immediately", ar: "اترك المحرك يعمل واخرج فوراً", correct: false },
      { en: "Stop and walk to an emergency phone", ar: "توقف وامشِ إلى هاتف الطوارئ", correct: false },
      { en: "Park on the side and wait", ar: "اركن على الجانب وانتظر", correct: false },
      { en: "If safe, drive out of the tunnel before stopping", ar: "إذا كان آمناً، اخرج من النفق قبل التوقف", correct: true }
    ],
    keywords: [
      { term: "tunnel fire", ar: "حريق في نفق", explainAr: "في حالة الحريق داخل النفق، الأفضل الخروج من النفق إذا كان ذلك آمناً." },
      { term: "hint", ar: "تلميح", explainAr: "Leaving the tunnel reduces danger to others." }
    ]
  },

  {
    id: "IN-02",
    topic: "incidents",
    promptEn: "When should an injured motorcyclist's helmet be removed?",
    promptAr: "متى يجب إزالة خوذة سائق الدراجة المصاب؟",
    options: [
      { en: "Immediately in all cases", ar: "فوراً في جميع الحالات", correct: false },
      { en: "Only if they request it", ar: "فقط إذا طلبوا ذلك", correct: false },
      { en: "Only if it's essential for first aid", ar: "فقط إذا كان ضرورياً للإسعافات الأولية", correct: true },
      { en: "Unless they are conscious", ar: "إلا إذا كانوا واعين", correct: false }
    ],
    keywords: [
      { term: "motorcyclist helmet", ar: "خوذة سائق الدراجة", explainAr: "إزالة الخوذة بشكل خاطئ قد يزيد من الإصابات." },
      { term: "hint", ar: "تلميح", explainAr: "Removing a helmet incorrectly can worsen injuries." }
    ]
  },

  {
    id: "IN-03",
    topic: "incidents",
    promptEn: "Which lights should you use when driving through a tunnel?",
    promptAr: "أي أضواء يجب استخدامها عند القيادة داخل نفق؟",
    options: [
      { en: "Sidelights", ar: "الأضواء الجانبية", correct: false },
      { en: "Fog lights", ar: "أضواء الضباب", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true },
      { en: "Hazard lights", ar: "أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "tunnel lights", ar: "أضواء النفق", explainAr: "استخدام الأضواء المنخفضة يحسّن الرؤية للجميع." },
      { term: "hint", ar: "تلميح", explainAr: "Headlights improve visibility for everyone." }
    ]
  },

  {
    id: "IN-04",
    topic: "incidents",
    promptEn: "What is the correct chest compression depth for adult CPR?",
    promptAr: "ما العمق الصحيح للضغط على الصدر عند إجراء الإنعاش القلبي؟",
    options: [
      { en: "1–2 cm", ar: "1–2 سم", correct: false },
      { en: "5–6 cm", ar: "5–6 سم", correct: true },
      { en: "10–15 cm", ar: "10–15 سم", correct: false },
      { en: "15–20 cm", ar: "15–20 سم", correct: false }
    ],
    keywords: [
      { term: "CPR", ar: "الإنعاش القلبي", explainAr: "تقنية الإسعافات الأولية لإنقاذ حياة شخص توقف قلبه." },
      { term: "hint", ar: "تلميح", explainAr: "Correct depth is vital for circulation." }
    ]
  },

  {
    id: "IN-05",
    topic: "incidents",
    promptEn: "If your car stalls on a level crossing and alarms start sounding, what should you do?",
    promptAr: "إذا توقفت سيارتك على تقاطع سكة حديد وبدأ الإنذار، ماذا تفعل؟",
    options: [
      { en: "Keep restarting the engine", ar: "استمر في إعادة تشغيل المحرك", correct: false },
      { en: "Push the car alone", ar: "ادفع السيارة وحدك", correct: false },
      { en: "Exit immediately and move clear of the tracks", ar: "اخرج فوراً وابتعد عن القضبان", correct: true },
      { en: "Signal the train", ar: "أشير للقطار", correct: false }
    ],
    keywords: [
      { term: "level crossing", ar: "تقاطع سكة حديد", explainAr: "تقاطع بين طريق وسكة حديدية." },
      { term: "hint", ar: "تلميح", explainAr: "Personal safety comes first." }
    ]
  },

  {
    id: "IN-06",
    topic: "incidents",
    promptEn: "What's the first action if a casualty isn't breathing?",
    promptAr: "ما أول إجراء إذا كان المصاب لا يتنفس؟",
    options: [
      { en: "Shake them", ar: "هزّهم", correct: false },
      { en: "Roll them onto their side", ar: "اقلبهم على جانبهم", correct: false },
      { en: "Open their airway", ar: "افتح مجرى الهواء", correct: true },
      { en: "Raise their arms", ar: "ارفع أذرعهم", correct: false }
    ],
    keywords: [
      { term: "airway", ar: "مجرى الهواء", explainAr: "الخطوة الأولى في الإسعافات الأولية هي فتح مجرى الهواء." },
      { term: "hint", ar: "تلميح", explainAr: "Airway first, then breathing." }
    ]
  },

  {
    id: "IN-07",
    topic: "incidents",
    promptEn: "How far behind your car should a warning triangle be placed on a two-way road?",
    promptAr: "على بعد كم يجب وضع مثلث التحذير خلف السيارة؟",
    options: [
      { en: "5 metres", ar: "5 أمتار", correct: false },
      { en: "25 metres", ar: "25 متراً", correct: false },
      { en: "45 metres", ar: "45 متراً", correct: true },
      { en: "100 metres", ar: "100 متر", correct: false }
    ],
    keywords: [
      { term: "warning triangle", ar: "مثلث التحذير", explainAr: "يُوضع على بعد مناسب لإعطاء السائقين وقتاً للتفاعل." },
      { term: "hint", ar: "تلميح", explainAr: "Distance gives other drivers time to react." }
    ]
  },

  {
    id: "IN-08",
    topic: "incidents",
    promptEn: "How can you best help someone suffering from shock after a collision?",
    promptAr: "كيف تساعد شخصًا مصابًا بالصدمة بعد حادث؟",
    options: [
      { en: "Give them a drink", ar: "أعطهم شراباً", correct: false },
      { en: "Reassure them calmly", ar: "طمئنهم بهدوء", correct: true },
      { en: "Ask who caused the crash", ar: "اسأل من تسبب في الحادث", correct: false },
      { en: "Give them food", ar: "أعطهم طعاماً", correct: false }
    ],
    keywords: [
      { term: "shock", ar: "صدمة", explainAr: "حالة طبية خطيرة قد تحدث بعد الحوادث." },
      { term: "hint", ar: "تلميح", explainAr: "Calm reassurance reduces stress." }
    ]
  },

  // --- DOCUMENTS ---

  {
    id: "DC-01",
    topic: "documents",
    promptEn: "When is it legal to drive a vehicle without a valid MOT certificate?",
    promptAr: "متى يُسمح قانونيًا بقيادة مركبة بدون شهادة فحص؟",
    options: [
      { en: "For 7 days after expiry", ar: "لمدة 7 أيام بعد انتهاء الصلاحية", correct: false },
      { en: "With the owner's permission", ar: "بإذن المالك", correct: false },
      { en: "When driving to a pre-booked MOT test", ar: "عند القيادة إلى فحص محجوز مسبقاً", correct: true },
      { en: "When driving to buy insurance", ar: "عند القيادة لشراء تأمين", correct: false }
    ],
    keywords: [
      { term: "MOT certificate", ar: "شهادة الفحص", explainAr: "إثبات أن السيارة اجتازت الفحص الفني المطلوب." },
      { term: "hint", ar: "تلميح", explainAr: "You may only drive directly to a booked test." }
    ]
  },

  {
    id: "DC-02",
    topic: "documents",
    promptEn: "When does a new car usually need its first MOT test?",
    promptAr: "متى تحتاج السيارة الجديدة لأول فحص؟",
    options: [
      { en: "After 1 year", ar: "بعد سنة واحدة", correct: false },
      { en: "After 3 years", ar: "بعد 3 سنوات", correct: true },
      { en: "After 5 years", ar: "بعد 5 سنوات", correct: false },
      { en: "After 7 years", ar: "بعد 7 سنوات", correct: false }
    ],
    keywords: [
      { term: "MOT test", ar: "فحص فني", explainAr: "فحص سنوي مطلوب للمركبات." },
      { term: "hint", ar: "تلميح", explainAr: "New cars have an MOT exemption period." }
    ]
  },

  {
    id: "DC-03",
    topic: "documents",
    promptEn: "A police officer asks for your driving documents, but you don't have them with you. How long do you have to present them?",
    promptAr: "كم لديك من الوقت لإبراز الوثائق؟",
    options: [
      { en: "5 days", ar: "5 أيام", correct: false },
      { en: "7 days", ar: "7 أيام", correct: true },
      { en: "14 days", ar: "14 يوماً", correct: false },
      { en: "21 days", ar: "21 يوماً", correct: false }
    ],
    keywords: [
      { term: "driving documents", ar: "وثائق القيادة", explainAr: "رخصة القيادة والتأمين ووثائق المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "This is known as a \"producer\"." }
    ]
  },

  {
    id: "DC-04",
    topic: "documents",
    promptEn: "What is a Statutory Off-Road Notification (SORN)?",
    promptAr: "ما هو إشعار إخراج المركبة من الطريق؟",
    options: [
      { en: "A notice that a vehicle has no insurance", ar: "إشعار بأن المركبة لا تملك تأميناً", correct: false },
      { en: "A notice that a vehicle has no MOT", ar: "إشعار بأن المركبة لا تملك شهادة فحص", correct: false },
      { en: "A declaration that a vehicle is not being used on public roads", ar: "إعلان بأن المركبة لا تُستخدم على الطرق العامة", correct: true },
      { en: "A police record of vehicle ownership", ar: "سجل شرطة لملكية المركبة", correct: false }
    ],
    keywords: [
      { term: "SORN", ar: "إشعار إخراج من الطريق", explainAr: "إعلان بأن المركبة خارج الاستخدام على الطرق العامة." },
      { term: "hint", ar: "تلميح", explainAr: "SORN vehicles must not be used on public roads." }
    ]
  },

  {
    id: "DC-05",
    topic: "documents",
    promptEn: "Who is legally responsible for keeping vehicle registration details up to date?",
    promptAr: "من المسؤول قانونيًا عن تحديث بيانات المركبة؟",
    options: [
      { en: "The insurance company", ar: "شركة التأمين", correct: false },
      { en: "The vehicle manufacturer", ar: "الشركة المصنعة", correct: false },
      { en: "The registered keeper", ar: "الحارس المسجل", correct: true },
      { en: "The licensing authority", ar: "سلطة الترخيص", correct: false }
    ],
    keywords: [
      { term: "registered keeper", ar: "الحارس المسجل", explainAr: "الشخص المسؤول قانونياً عن المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Responsibility stays with the keeper." }
    ]
  },

  {
    id: "DC-06",
    topic: "documents",
    promptEn: "How long is an MOT certificate normally valid?",
    promptAr: "كم مدة صلاحية شهادة الفحص؟",
    options: [
      { en: "3 years", ar: "3 سنوات", correct: false },
      { en: "10,000 miles", ar: "10,000 ميل", correct: false },
      { en: "1 year", ar: "سنة واحدة", correct: true },
      { en: "30,000 miles", ar: "30,000 ميل", correct: false }
    ],
    keywords: [
      { term: "MOT certificate", ar: "شهادة الفحص", explainAr: "إثبات أن السيارة اجتازت الفحص الفني." },
      { term: "hint", ar: "تلميح", explainAr: "MOTs must be renewed annually." }
    ]
  },

  {
    id: "DC-07",
    topic: "documents",
    promptEn: "You pass your first driving test and receive 6 penalty points within 2 years. What happens?",
    promptAr: "ماذا يحدث إذا حصلت على 6 نقاط خلال سنتين؟",
    options: [
      { en: "Retake the theory test only", ar: "إعادة اختبار النظري فقط", correct: false },
      { en: "Retake both theory and practical tests", ar: "إعادة كلا الاختبارين النظري والعملي", correct: true },
      { en: "Retake the practical test only", ar: "إعادة الاختبار العملي فقط", correct: false },
      { en: "Reapply for a licence immediately", ar: "إعادة التقدم للحصول على رخصة فوراً", correct: false }
    ],
    keywords: [
      { term: "penalty points", ar: "نقاط جزائية", explainAr: "نقاط تُضاف إلى رخصة القيادة بسبب المخالفات." },
      { term: "hint", ar: "تلميح", explainAr: "New drivers have stricter rules." }
    ]
  },

  {
    id: "DC-08",
    topic: "documents",
    promptEn: "When must you show your insurance certificate?",
    promptAr: "متى يجب إبراز شهادة التأمين؟",
    options: [
      { en: "When declaring SORN", ar: "عند إعلان SORN", correct: false },
      { en: "When buying or selling a vehicle", ar: "عند شراء أو بيع مركبة", correct: false },
      { en: "When requested by a police officer", ar: "عند طلب ضابط شرطة", correct: true },
      { en: "During an MOT test", ar: "أثناء فحص MOT", correct: false }
    ],
    keywords: [
      { term: "insurance certificate", ar: "شهادة التأمين", explainAr: "وثيقة تثبت أن مركبتك مؤمنة." },
      { term: "hint", ar: "تلميح", explainAr: "Police can request proof at any time." }
    ]
  },

  {
    id: "DC-09",
    topic: "documents",
    promptEn: "What additional requirement must you meet to supervise a learner driver?",
    promptAr: "ما الشرط الإضافي لمرافقة متعلم؟",
    options: [
      { en: "Have dual controls", ar: "امتلاك ضوابط مزدوجة", correct: false },
      { en: "Be at least 21 years old", ar: "أن يكون عمرك 21 سنة على الأقل", correct: true },
      { en: "Be an approved instructor", ar: "أن تكون مدرباً معتمداً", correct: false },
      { en: "Hold an advanced licence", ar: "امتلاك رخصة متقدمة", correct: false }
    ],
    keywords: [
      { term: "learner driver", ar: "سائق متعلم", explainAr: "شخص يتعلم القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Age and experience both matter." }
    ]
  },

  {
    id: "DC-10",
    topic: "documents",
    promptEn: "What must you have to legally drive a motor vehicle on the road?",
    promptAr: "ما الذي تحتاجه للقيادة قانونيًا؟",
    options: [
      { en: "Breakdown cover", ar: "تغطية الأعطال", correct: false },
      { en: "Proof of identity", ar: "إثبات الهوية", correct: false },
      { en: "A vehicle handbook", ar: "دليل المركبة", correct: false },
      { en: "A valid driving licence", ar: "رخصة قيادة سارية", correct: true }
    ],
    keywords: [
      { term: "driving licence", ar: "رخصة القيادة", explainAr: "وثيقة رسمية تثبت أنك مسموح لك قانونياً بالقيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Licence comes before anything else." }
    ]
  },

  {
    id: "DC-11",
    topic: "documents",
    promptEn: "What must be in place before renewing vehicle tax?",
    promptAr: "ما المطلوب قبل تجديد ضريبة المركبة؟",
    options: [
      { en: "Vehicle handbook", ar: "دليل المركبة", correct: false },
      { en: "Chassis number", ar: "رقم الهيكل", correct: false },
      { en: "Valid insurance", ar: "تأمين ساري", correct: true },
      { en: "Driving licence", ar: "رخصة القيادة", correct: false }
    ],
    keywords: [
      { term: "vehicle tax", ar: "ضريبة المركبة", explainAr: "الضريبة السنوية المطلوبة لاستخدام المركبة على الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "Insurance is checked automatically." }
    ]
  },

  {
    id: "DC-12",
    topic: "documents",
    promptEn: "What does third-party insurance cover?",
    promptAr: "ماذا يغطي تأمين الطرف الثالث؟",
    options: [
      { en: "Damage to your own vehicle", ar: "الضرر لمركبتك الخاصة", correct: false },
      { en: "Damage to other vehicles and property", ar: "الضرر لمركبات وممتلكات الآخرين", correct: true },
      { en: "Injury to yourself", ar: "الإصابة لنفسك", correct: false },
      { en: "All damage and injury", ar: "جميع الأضرار والإصابات", correct: false }
    ],
    keywords: [
      { term: "third-party insurance", ar: "تأمين الطرف الثالث", explainAr: "نوع تأمين يغطي ضرر الآخرين وليس سيارتك." },
      { term: "hint", ar: "تلميح", explainAr: "It protects others, not you." }
    ]
  },

  {
    id: "DC-13",
    topic: "documents",
    promptEn: "What is the maximum penalty for driving without insurance?",
    promptAr: "ما أقصى عقوبة للقيادة بدون تأمين؟",
    options: [
      { en: "£500", ar: "500 جنيه إسترليني", correct: false },
      { en: "£1,000", ar: "1,000 جنيه إسترليني", correct: false },
      { en: "£5,000", ar: "5,000 جنيه إسترليني", correct: false },
      { en: "Unlimited fine", ar: "غرامة غير محدودة", correct: true }
    ],
    keywords: [
      { term: "driving without insurance", ar: "القيادة بدون تأمين", explainAr: "القيادة دون تأمين ساري المفعول." },
      { term: "hint", ar: "تلميح", explainAr: "There's no upper financial limit." }
    ]
  },

  {
    id: "DC-14",
    topic: "documents",
    promptEn: "When must a vehicle have valid insurance cover?",
    promptAr: "متى يجب أن يكون للمركبة تأمين ساري؟",
    options: [
      { en: "Before declaring it off the road", ar: "قبل إعلان إخراجها من الطريق", correct: false },
      { en: "Before selling it", ar: "قبل بيعها", correct: false },
      { en: "Before scrapping it", ar: "قبل إلغائها", correct: false },
      { en: "Before taxing the vehicle", ar: "قبل فرض ضريبة على المركبة", correct: true }
    ],
    keywords: [
      { term: "vehicle insurance", ar: "تأمين المركبة", explainAr: "التأمين مطلوب قبل ضريبة المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Insurance is required before vehicle tax." }
    ]
  },

  {
    id: "DC-15",
    topic: "documents",
    promptEn: "How long does a Statutory Off-Road Notification (SORN) remain valid?",
    promptAr: "إلى متى يبقى إشعار إخراج المركبة من الطريق ساريًا؟",
    options: [
      { en: "Until the vehicle is insured", ar: "حتى يتم تأمين المركبة", correct: false },
      { en: "Until the vehicle is repaired", ar: "حتى يتم إصلاح المركبة", correct: false },
      { en: "Until the vehicle is taxed, sold, or scrapped", ar: "حتى يتم فرض ضريبة على المركبة أو بيعها أو إلغاؤها", correct: true },
      { en: "Until the vehicle is used again", ar: "حتى يتم استخدام المركبة مرة أخرى", correct: false }
    ],
    keywords: [
      { term: "SORN", ar: "إشعار إخراج من الطريق", explainAr: "إعلان بأن المركبة خارج الاستخدام على الطرق العامة." },
      { term: "hint", ar: "تلميح", explainAr: "SORN ends when the vehicle status changes." }
    ]
  },

  {
    id: "DC-16",
    topic: "documents",
    promptEn: "Who is responsible for paying vehicle tax?",
    promptAr: "من المسؤول عن دفع ضريبة المركبة؟",
    options: [
      { en: "The driver", ar: "السائق", correct: false },
      { en: "The car dealer", ar: "تاجر السيارات", correct: false },
      { en: "The registered keeper", ar: "الحارس المسجل", correct: true },
      { en: "The licensing authority", ar: "سلطة الترخيص", correct: false }
    ],
    keywords: [
      { term: "vehicle tax", ar: "ضريبة المركبة", explainAr: "الضريبة السنوية المطلوبة لاستخدام المركبة على الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "Responsibility stays with the keeper." }
    ]
  },

  {
    id: "DC-17",
    topic: "documents",
    promptEn: "What is the minimum legal insurance required to drive on public roads?",
    promptAr: "ما الحد الأدنى للتأمين المطلوب قانونيًا؟",
    options: [
      { en: "Comprehensive", ar: "تأمين شامل", correct: false },
      { en: "Third party, fire and theft", ar: "طرف ثالث، حريق وسرقة", correct: false },
      { en: "Third party only", ar: "طرف ثالث فقط", correct: true },
      { en: "Personal injury cover", ar: "تغطية الإصابات الشخصية", correct: false }
    ],
    keywords: [
      { term: "minimum insurance", ar: "الحد الأدنى للتأمين", explainAr: "أقل مستوى تأمين مطلوب قانونياً." },
      { term: "hint", ar: "تلميح", explainAr: "Third-party is the minimum." }
    ]
  },

  {
    id: "DC-18",
    topic: "documents",
    promptEn: "When could the cost of your insurance be reduced?",
    promptAr: "متى يمكن أن تنخفض تكلفة التأمين؟",
    options: [
      { en: "If you're under 25", ar: "إذا كان عمرك أقل من 25", correct: false },
      { en: "If you don't wear glasses", ar: "إذا لم تكن ترتدي نظارات", correct: false },
      { en: "If you pass your test first time", ar: "إذا نجحت في الاختبار من المرة الأولى", correct: false },
      { en: "If you complete an approved driving course", ar: "إذا أكملت دورة قيادة معتمدة", correct: true }
    ],
    keywords: [
      { term: "insurance cost", ar: "تكلفة التأمين", explainAr: "السعر الذي تدفعه مقابل التأمين." },
      { term: "hint", ar: "تلميح", explainAr: "Extra training can lower premiums." }
    ]
  },

  {
    id: "DC-19",
    topic: "documents",
    promptEn: "What does third-party insurance cover?",
    promptAr: "ماذا يغطي تأمين الطرف الثالث؟",
    options: [
      { en: "Damage to your own vehicle", ar: "الضرر لمركبتك الخاصة", correct: false },
      { en: "Fire damage to your vehicle", ar: "ضرر الحريق لمركبتك", correct: false },
      { en: "Flood damage to your vehicle", ar: "ضرر الفيضان لمركبتك", correct: false },
      { en: "Damage to other vehicles and property", ar: "الضرر لمركبات وممتلكات الآخرين", correct: true }
    ],
    keywords: [
      { term: "third-party insurance", ar: "تأمين الطرف الثالث", explainAr: "نوع تأمين يغطي ضرر الآخرين وليس سيارتك." },
      { term: "hint", ar: "تلميح", explainAr: "It protects others, not you." }
    ]
  },

  {
    id: "DC-20",
    topic: "documents",
    promptEn: "What could be affected if you drive a vehicle without a valid MOT?",
    promptAr: "ما الذي قد يصبح غير صالح إذا قدت بدون فحص ساري؟",
    options: [
      { en: "The service history", ar: "سجل الصيانة", correct: false },
      { en: "The insurance cover", ar: "تغطية التأمين", correct: true },
      { en: "The registration document", ar: "وثيقة التسجيل", correct: false },
      { en: "The owner details", ar: "تفاصيل المالك", correct: false }
    ],
    keywords: [
      { term: "MOT", ar: "فحص المركبة", explainAr: "فحص فني سنوي مطلوب للمركبات." },
      { term: "hint", ar: "تلميح", explainAr: "Insurance may become invalid." }
    ]
  },

  {
    id: "DC-21",
    topic: "documents",
    promptEn: "What legal requirement applies to a newly qualified driver?",
    promptAr: "ما المتطلب القانوني للسائق الجديد؟",
    options: [
      { en: "Display green plates", ar: "عرض لوحات خضراء", correct: false },
      { en: "Retake a photo immediately", ar: "إعادة التقاط صورة فوراً", correct: false },
      { en: "Be accompanied on motorways", ar: "المرافقة على الطرق السريعة", correct: false },
      { en: "Have valid motor insurance", ar: "امتلاك تأمين سيارات ساري", correct: true }
    ],
    keywords: [
      { term: "newly qualified driver", ar: "سائق جديد مؤهل", explainAr: "سائق نجح للتو في اختبار القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Insurance applies to all drivers." }
    ]
  },

  {
    id: "DC-22",
    topic: "documents",
    promptEn: "In which situation must you notify the licensing authority?",
    promptAr: "متى يجب إبلاغ جهة الترخيص؟",
    options: [
      { en: "When working abroad", ar: "عند العمل في الخارج", correct: false },
      { en: "When lending your vehicle", ar: "عند إعارة مركبتك", correct: false },
      { en: "When your health affects your driving", ar: "عندما تؤثر صحتك على قيادتك", correct: true },
      { en: "When booking an MOT", ar: "عند حجز فحص MOT", correct: false }
    ],
    keywords: [
      { term: "licensing authority", ar: "جهة الترخيص", explainAr: "الجهة المسؤولة عن رخص القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Medical conditions must be reported." }
    ]
  },

  {
    id: "DC-23",
    topic: "documents",
    promptEn: "When must you contact the licensing authority?",
    promptAr: "متى يجب التواصل مع جهة الترخيص؟",
    options: [
      { en: "After a parking ticket", ar: "بعد مخالفة وقوف", correct: false },
      { en: "When you change vehicle ownership", ar: "عند تغيير ملكية المركبة", correct: true },
      { en: "When using your vehicle for work", ar: "عند استخدام مركبتك للعمل", correct: false },
      { en: "When insurance is due", ar: "عند استحقاق التأمين", correct: false }
    ],
    keywords: [
      { term: "vehicle ownership", ar: "ملكية المركبة", explainAr: "تغيير مالك المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Ownership changes must be reported." }
    ]
  },

  {
    id: "DC-24",
    topic: "documents",
    promptEn: "What information is shown on a vehicle registration document?",
    promptAr: "ما المعلومات الموجودة في وثيقة تسجيل المركبة؟",
    options: [
      { en: "Insurance details", ar: "تفاصيل التأمين", correct: false },
      { en: "MOT expiry date", ar: "تاريخ انتهاء الفحص", correct: false },
      { en: "Service history", ar: "سجل الصيانة", correct: false },
      { en: "Registered keeper details", ar: "تفاصيل الحارس المسجل", correct: true }
    ],
    keywords: [
      { term: "registration document", ar: "وثيقة التسجيل", explainAr: "وثيقة رسمية تُظهر تفاصيل المركبة والمالك." },
      { term: "hint", ar: "تلميح", explainAr: "The keeper is officially recorded." }
    ]
  },

  {
    id: "DC-25",
    topic: "documents",
    promptEn: "What must you check before driving someone else's vehicle?",
    promptAr: "ماذا يجب التحقق منه قبل قيادة سيارة شخص آخر؟",
    options: [
      { en: "The owner has insurance", ar: "أن المالك لديه تأمين", correct: false },
      { en: "Your own vehicle is insured", ar: "أن مركبتك الخاصة مؤمنة", correct: false },
      { en: "The vehicle is insured for your use", ar: "أن المركبة مؤمنة لاستخدامك", correct: true },
      { en: "Insurance papers are inside the car", ar: "أن أوراق التأمين داخل السيارة", correct: false }
    ],
    keywords: [
      { term: "driving someone else's vehicle", ar: "قيادة مركبة شخص آخر", explainAr: "القيادة بمركبة لا تملكها." },
      { term: "hint", ar: "تلميح", explainAr: "Insurance must cover you as a driver." }
    ]
  },

  {
    id: "DC-26",
    topic: "documents",
    promptEn: "What does an insurance excess of £500 mean?",
    promptAr: "ماذا يعني وجود مبلغ تحمّل £500؟",
    options: [
      { en: "The insurer pays the first £500", ar: "شركة التأمين تدفع أول £500", correct: false },
      { en: "You receive £500 if you don't claim", ar: "تحصل على £500 إذا لم تقدم مطالبة", correct: false },
      { en: "The vehicle is insured up to £500", ar: "المركبة مؤمنة حتى £500", correct: false },
      { en: "You must pay the first £500 of any claim", ar: "يجب أن تدفع أول £500 من أي مطالبة", correct: true }
    ],
    keywords: [
      { term: "insurance excess", ar: "مبلغ التحمل", explainAr: "المبلغ الذي تدفعه قبل أن تبدأ شركة التأمين بالدفع." },
      { term: "hint", ar: "تلميح", explainAr: "Excess is the amount you pay first." }
    ]
  },

  {
    id: "DC-27",
    topic: "documents",
    promptEn: "When should you update your vehicle registration certificate?",
    promptAr: "متى يجب تحديث وثيقة تسجيل المركبة؟",
    options: [
      { en: "After passing your driving test", ar: "بعد اجتياز اختبار القيادة", correct: false },
      { en: "When you move house", ar: "عند الانتقال إلى منزل جديد", correct: true },
      { en: "When the vehicle needs an MOT", ar: "عندما تحتاج المركبة لفحص MOT", correct: false },
      { en: "After a collision", ar: "بعد حادث تصادم", correct: false }
    ],
    keywords: [
      { term: "registration certificate", ar: "شهادة التسجيل", explainAr: "وثيقة رسمية تُظهر تفاصيل المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Address changes must be updated." }
    ]
  },

  // --- MOTORWAY DRIVING ---

  {
    id: "MW-01",
    topic: "motorway-driving",
    promptEn: "When should you use the hard shoulder on a motorway if it is not operating as a running lane?",
    promptAr: "متى يُسمح باستخدام كتف الطريق السريع إذا لم يكن مسارًا مفتوحًا للسير؟",
    options: [
      { en: "When leaving the motorway", ar: "عند مغادرة الطريق السريع", correct: false },
      { en: "When stopping to rest", ar: "عند التوقف للراحة", correct: false },
      { en: "When joining the motorway", ar: "عند الانضمام للطريق السريع", correct: false },
      { en: "When stopping in an emergency", ar: "عند التوقف في حالة طوارئ", correct: true }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "الكتف الجانبي للطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "The hard shoulder is for emergencies only." }
    ]
  },

  {
    id: "MW-02",
    topic: "motorway-driving",
    promptEn: "When are you allowed to stop on a motorway?",
    promptAr: "متى يُسمح لك بالتوقف على الطريق السريع؟",
    options: [
      { en: "To use a mobile phone", ar: "لاستخدام الهاتف المحمول", correct: false },
      { en: "To get fresh air", ar: "للحصول على هواء نقي", correct: false },
      { en: "When directed by traffic signals or authorities", ar: "عند توجيه إشارات المرور أو السلطات", correct: true },
      { en: "To pick up passengers", ar: "لنقل ركاب", correct: false }
    ],
    keywords: [
      { term: "motorway stopping", ar: "التوقف على الطريق السريع", explainAr: "التوقف على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Stopping is only allowed when instructed or in emergencies." }
    ]
  },

  {
    id: "MW-03",
    topic: "motorway-driving",
    promptEn: "What should you do while driving on a motorway?",
    promptAr: "ماذا يجب أن تفعل أثناء القيادة على الطريق السريع؟",
    options: [
      { en: "Drive faster than on other roads", ar: "القيادة أسرع من الطرق الأخرى", correct: false },
      { en: "Keep a shorter following distance", ar: "الحفاظ على مسافة متابعة أقصر", correct: false },
      { en: "Look much further ahead than usual", ar: "النظر إلى الأمام أبعد من المعتاد", correct: true },
      { en: "Relax your concentration", ar: "إرخاء تركيزك", correct: false }
    ],
    keywords: [
      { term: "motorway observation", ar: "المراقبة على الطريق السريع", explainAr: "المراقبة على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Higher speeds require longer forward observation." }
    ]
  },

  {
    id: "MW-04",
    topic: "motorway-driving",
    promptEn: "When should you use the right-hand lane on a three-lane motorway?",
    promptAr: "متى يجب استخدام المسار الأيمن على طريق سريع بثلاثة مسارات؟",
    options: [
      { en: "To save fuel", ar: "لتوفير الوقود", correct: false },
      { en: "When travelling above the speed limit", ar: "عند السفر فوق حد السرعة", correct: false },
      { en: "When overtaking slower traffic", ar: "عند تجاوز المرور الأبطأ", correct: true },
      { en: "When preparing to exit", ar: "عند الاستعداد للخروج", correct: false }
    ],
    keywords: [
      { term: "right-hand lane", ar: "المسار الأيمن", explainAr: "المسار الأيمن على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Right lanes are for overtaking only." }
    ]
  },

  {
    id: "MW-05",
    topic: "motorway-driving",
    promptEn: "When should you use an emergency area on a motorway?",
    promptAr: "متى يُستخدم مكان الطوارئ على الطريق السريع؟",
    options: [
      { en: "To check directions", ar: "للتحقق من الاتجاهات", correct: false },
      { en: "To make a phone call", ar: "لإجراء مكالمة هاتفية", correct: false },
      { en: "During a breakdown or emergency", ar: "أثناء عطل أو طوارئ", correct: true },
      { en: "To avoid traffic delays", ar: "لتجنب تأخير المرور", correct: false }
    ],
    keywords: [
      { term: "emergency area", ar: "منطقة الطوارئ", explainAr: "منطقة مخصصة للطوارئ على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Emergency areas are not rest stops." }
    ]
  },

  {
    id: "MW-06",
    topic: "motorway-driving",
    promptEn: "What colour are the reflective studs between a motorway and a slip road?",
    promptAr: "ما لون العواكس بين الطريق السريع ومخرج الطريق؟",
    options: [
      { en: "White", ar: "أبيض", correct: false },
      { en: "Red", ar: "أحمر", correct: false },
      { en: "Green", ar: "أخضر", correct: false },
      { en: "Amber", ar: "أصفر", correct: true }
    ],
    keywords: [
      { term: "reflective studs", ar: "عواكس", explainAr: "علامات عاكسة على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Amber studs separate the motorway from slip roads." }
    ]
  },

  {
    id: "MW-07",
    topic: "motorway-driving",
    promptEn: "If your vehicle breaks down on the hard shoulder and you call for help, what should you check?",
    promptAr: "ماذا يجب أن تتحقق منه عند الاتصال لطلب المساعدة على كتف الطريق؟",
    options: [
      { en: "Stand behind your vehicle", ar: "الوقوف خلف مركبتك", correct: false },
      { en: "Call a friend", ar: "الاتصال بصديق", correct: false },
      { en: "Stay in your vehicle", ar: "البقاء في مركبتك", correct: false },
      { en: "Identify your location using marker posts", ar: "تحديد موقعك باستخدام علامات المسافة", correct: true }
    ],
    keywords: [
      { term: "marker posts", ar: "علامات المسافة", explainAr: "علامات على جانب الطريق تساعد في تحديد الموقع." },
      { term: "hint", ar: "تلميح", explainAr: "Marker posts help emergency services locate you." }
    ]
  },

  {
    id: "MW-08",
    topic: "motorway-driving",
    promptEn: "What should you do when approaching motorway roadworks?",
    promptAr: "ماذا يجب فعله عند الاقتراب من أعمال صيانة على الطريق السريع؟",
    options: [
      { en: "Increase speed", ar: "زيادة السرعة", correct: false },
      { en: "Follow the speed limit shown", ar: "اتباع حد السرعة المعروض", correct: true },
      { en: "Use the hard shoulder", ar: "استخدام كتف الطريق", correct: false },
      { en: "Drive very close to the vehicle ahead", ar: "القيادة قريباً جداً من المركبة أمامك", correct: false }
    ],
    keywords: [
      { term: "roadworks", ar: "أعمال صيانة", explainAr: "أعمال صيانة على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Temporary speed limits are mandatory." }
    ]
  },

  {
    id: "MW-09",
    topic: "motorway-driving",
    promptEn: "What does a mandatory speed limit shown above the hard shoulder mean?",
    promptAr: "ماذا يعني تحديد السرعة الإلزامي فوق كتف الطريق؟",
    options: [
      { en: "You may park there", ar: "يمكنك الوقوف هناك", correct: false },
      { en: "You may use it to rest", ar: "يمكنك استخدامه للراحة", correct: false },
      { en: "The hard shoulder is open for traffic", ar: "كتف الطريق مفتوح للمرور", correct: true },
      { en: "Mobile phone use is allowed", ar: "استخدام الهاتف المحمول مسموح", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "كتف الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "A speed limit above means the lane is active." }
    ]
  },

  {
    id: "MW-10",
    topic: "motorway-driving",
    promptEn: "What does it mean if a vehicle briefly uses hazard warning lights on a motorway?",
    promptAr: "ماذا يعني تشغيل أضواء التحذير لفترة قصيرة؟",
    options: [
      { en: "A speed camera is ahead", ar: "كاميرا سرعة أمامك", correct: false },
      { en: "The driver wants you to overtake", ar: "السائق يريدك أن تتجاوزه", correct: false },
      { en: "Traffic ahead is slowing suddenly", ar: "المرور أمامك يتباطأ فجأة", correct: true },
      { en: "The vehicle is changing lanes", ar: "المركبة تغيّر المسار", correct: false }
    ],
    keywords: [
      { term: "hazard warning lights", ar: "أضواء التحذير", explainAr: "أضواء التحذير على المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "It's a warning of sudden danger ahead." }
    ]
  },

  // --- OTHER TYPES OF VEHICLES ---

  {
    id: "OV-01",
    topic: "other-vehicles",
    promptEn: "You're waiting to turn right from a side road. A large lorry is approaching from the right. Why should you wait before turning?",
    promptAr: "لماذا يجب أن تنتظر قبل الانعطاف عندما تقترب شاحنة كبيرة؟",
    options: [
      { en: "The lorry might suddenly speed up", ar: "قد تسرع الشاحنة فجأة", correct: false },
      { en: "The lorry's load may be unstable", ar: "قد تكون حمولة الشاحنة غير مستقرة", correct: false },
      { en: "Another vehicle overtaking the lorry may be hidden from view", ar: "قد تكون مركبة أخرى تتجاوز الشاحنة مخفية عن الأنظار", correct: true },
      { en: "The lorry may be slowing down", ar: "قد تكون الشاحنة تبطئ", correct: false }
    ],
    keywords: [
      { term: "large vehicle", ar: "مركبة كبيرة", explainAr: "المركبات الكبيرة قد تخفي المركبات الأصغر خلفها." },
      { term: "hint", ar: "تلميح", explainAr: "Large vehicles can hide smaller vehicles behind them." }
    ]
  },

  {
    id: "OV-02",
    topic: "other-vehicles",
    promptEn: "You see a large vehicle creating a narrow gap ahead. What should you be prepared to do?",
    promptAr: "ماذا يجب أن تكون مستعدًا لفعله في هذا الموقف؟",
    options: [
      { en: "Sound your horn and continue", ar: "استخدم البوق واستمر", correct: false },
      { en: "Squeeze through the gap", ar: "اضغط للعبور من الفجوة", correct: false },
      { en: "Slow down and give way", ar: "أبطئ وأفسح الطريق", correct: true },
      { en: "Report the driver", ar: "أبلغ عن السائق", correct: false }
    ],
    keywords: [
      { term: "give way", ar: "أفسح الطريق", explainAr: "السماح للمركبات الأخرى بالمرور أولاً." },
      { term: "hint", ar: "تلميح", explainAr: "Giving way prevents sudden collisions." }
    ]
  },

  {
    id: "OV-03",
    topic: "other-vehicles",
    promptEn: "You overtake a cyclist on a very windy day. What should you do?",
    promptAr: "كيف تتجاوز دراجًا في يوم عاصف؟",
    options: [
      { en: "Overtake very slowly", ar: "تتجاوز ببطء شديد", correct: false },
      { en: "Keep close as you pass", ar: "ابق قريباً أثناء المرور", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Allow extra room", ar: "اترك مسافة إضافية", correct: true }
    ],
    keywords: [
      { term: "cyclist", ar: "دراج", explainAr: "راكب دراجة هوائية." },
      { term: "hint", ar: "تلميح", explainAr: "Wind can push cyclists sideways." }
    ]
  },

  {
    id: "OV-04",
    topic: "other-vehicles",
    promptEn: "You're towing a caravan. Which mirror setup gives you the safest rear view?",
    promptAr: "أي نوع مرايا هو الأكثر أمانًا عند سحب قافلة؟",
    options: [
      { en: "Interior wide-angle mirror", ar: "مرآة داخلية واسعة الزاوية", correct: false },
      { en: "Ordinary door mirrors", ar: "مرايا الأبواب العادية", correct: false },
      { en: "Ordinary interior mirror", ar: "مرآة داخلية عادية", correct: false },
      { en: "Extended-arm side mirrors", ar: "مرايا جانبية بذراع ممتد", correct: true }
    ],
    keywords: [
      { term: "caravan", ar: "قافلة", explainAr: "مقطورة سكنية." },
      { term: "hint", ar: "تلميح", explainAr: "Extended mirrors improve visibility past the caravan." }
    ]
  },

  {
    id: "OV-05",
    topic: "other-vehicles",
    promptEn: "You're driving behind a bus that stops at a bus stop. What should you do?",
    promptAr: "ماذا يجب أن تفعل عند توقف حافلة أمامك؟",
    options: [
      { en: "Accelerate past the bus", ar: "تسرع لتتجاوز الحافلة", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Pull in closely behind", ar: "اقترب منها كثيراً من الخلف", correct: false },
      { en: "Watch carefully for pedestrians", ar: "راقب المشاة بعناية", correct: true }
    ],
    keywords: [
      { term: "bus stop", ar: "موقف الحافلات", explainAr: "مكان تتوقف فيه الحافلات." },
      { term: "hint", ar: "تلميح", explainAr: "Pedestrians may cross in front of buses." }
    ]
  },

  {
    id: "OV-06",
    topic: "other-vehicles",
    promptEn: "A large vehicle ahead signals left at a crossroads. What should you do?",
    promptAr: "ماذا تفعل إذا أشارت مركبة كبيرة للانعطاف يسارًا؟",
    options: [
      { en: "Overtake if the road looks clear", ar: "تتجاوز إذا بدا الطريق خالياً", correct: false },
      { en: "Wait until the vehicle completes the turn", ar: "انتظر حتى تكمل المركبة الانعطاف", correct: true },
      { en: "Overtake quickly", ar: "تتجاوز بسرعة", correct: false },
      { en: "Assume the signal is wrong", ar: "افترض أن الإشارة خاطئة", correct: false }
    ],
    keywords: [
      { term: "large vehicle", ar: "مركبة كبيرة", explainAr: "مركبة كبيرة تحتاج مساحة أكبر للانعطاف." },
      { term: "hint", ar: "تلميح", explainAr: "Large vehicles need extra space to turn." }
    ]
  },

  {
    id: "OV-07",
    topic: "other-vehicles",
    promptEn: "You're driving in heavy traffic on a wet road with a lot of spray. Which lights should you use?",
    promptAr: "أي أضواء تستخدم في مطر غزير مع رذاذ؟",
    options: [
      { en: "Main beam headlights", ar: "الأضواء العالية", correct: false },
      { en: "Sidelights only", ar: "الأضواء الجانبية فقط", correct: false },
      { en: "Rear fog lights", ar: "أضواء الضباب الخلفية", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true }
    ],
    keywords: [
      { term: "dipped headlights", ar: "أضواء منخفضة", explainAr: "أضواء لا تعمي السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "Dipped headlights reduce glare." }
    ]
  },

  {
    id: "OV-08",
    topic: "other-vehicles",
    promptEn: "It's very windy and a motorcyclist is overtaking a high-sided vehicle ahead. What should you do?",
    promptAr: "ماذا تفعل عند تجاوز دراج ناري لشاحنة في رياح قوية؟",
    options: [
      { en: "Overtake immediately", ar: "تتجاوز فوراً", correct: false },
      { en: "Stay level with the motorcyclist", ar: "ابق على مستوى الدراج الناري", correct: false },
      { en: "Keep well back", ar: "ابق على مسافة جيدة", correct: true },
      { en: "Keep close behind", ar: "ابق قريباً من الخلف", correct: false }
    ],
    keywords: [
      { term: "motorcyclist", ar: "دراج ناري", explainAr: "راكب دراجة نارية." },
      { term: "hint", ar: "تلميح", explainAr: "Sudden gusts can affect balance." }
    ]
  },

  {
    id: "OV-09",
    topic: "other-vehicles",
    promptEn: "You're about to overtake a slow-moving motorcyclist. When should you take extra care?",
    promptAr: "متى يجب توخي الحذر عند تجاوز دراج ناري؟",
    options: [
      { en: "When road markings warn of hazards ahead", ar: "عندما تحذر علامات الطريق من مخاطر أمامك", correct: true },
      { en: "When traffic is light", ar: "عندما يكون المرور خفيفاً", correct: false },
      { en: "When the motorcyclist signals left", ar: "عندما يشير الدراج الناري لليسار", correct: false },
      { en: "When visibility is good", ar: "عندما تكون الرؤية جيدة", correct: false }
    ],
    keywords: [
      { term: "motorcyclist", ar: "دراج ناري", explainAr: "راكب دراجة نارية." },
      { term: "hint", ar: "تلميح", explainAr: "Warning signs indicate increased risk." }
    ]
  },

  {
    id: "OV-10",
    topic: "other-vehicles",
    promptEn: "A long vehicle signals left but moves right before turning. What should you do?",
    promptAr: "ماذا تفعل إذا تحركت مركبة طويلة يمينًا قبل الانعطاف؟",
    options: [
      { en: "Get closer and pass", ar: "اقترب ومر", correct: false },
      { en: "Overtake as it slows", ar: "تجاوز بينما تبطئ", correct: false },
      { en: "Stay well back and give it room", ar: "ابق على مسافة جيدة وأفسح لها المجال", correct: true },
      { en: "Assume it's turning right", ar: "افترض أنها تنعطف يميناً", correct: false }
    ],
    keywords: [
      { term: "long vehicle", ar: "مركبة طويلة", explainAr: "مركبة طويلة تحتاج مساحة أكبر للانعطاف." },
      { term: "hint", ar: "تلميح", explainAr: "Long vehicles swing wide before turning." }
    ]
  },

  {
    id: "OV-11",
    topic: "other-vehicles",
    promptEn: "Why should you keep a safe distance behind a large vehicle on a single carriageway?",
    promptAr: "لماذا يجب ترك مسافة خلف مركبة كبيرة؟",
    options: [
      { en: "To accelerate quickly", ar: "لتسارع بسرعة", correct: false },
      { en: "To get a clear view of the road ahead", ar: "للحصول على رؤية واضحة للطريق أمامك", correct: true },
      { en: "To help others overtake you", ar: "لمساعدة الآخرين على تجاوزك", correct: false },
      { en: "To prevent it rolling back", ar: "لمنعها من الرجوع للخلف", correct: false }
    ],
    keywords: [
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة أمامك." },
      { term: "hint", ar: "تلميح", explainAr: "Visibility improves decision-making." }
    ]
  },

  {
    id: "OV-12",
    topic: "other-vehicles",
    promptEn: "A long vehicle ahead signals left at a mini-roundabout but positions to the right. What should you do?",
    promptAr: "ماذا تفعل عند اقتراب شاحنة من دوار صغير؟",
    options: [
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Overtake on the left", ar: "تجاوز من اليسار", correct: false },
      { en: "Follow closely", ar: "اتبع عن قرب", correct: false },
      { en: "Keep well back", ar: "ابق على مسافة جيدة", correct: true }
    ],
    keywords: [
      { term: "mini-roundabout", ar: "دوار صغير", explainAr: "دوار صغير في الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Give long vehicles space to manoeuvre." }
    ]
  },

  {
    id: "OV-13",
    topic: "other-vehicles",
    promptEn: "Why is overtaking a large vehicle more difficult than overtaking a car?",
    promptAr: "لماذا يصعب تجاوز المركبات الكبيرة؟",
    options: [
      { en: "Large vehicles accelerate slowly", ar: "المركبات الكبيرة تتسارع ببطء", correct: false },
      { en: "They have speed limiters", ar: "لديها محدودات سرعة", correct: false },
      { en: "It takes longer to pass them safely", ar: "يستغرق وقتاً أطول لتجاوزها بأمان", correct: true },
      { en: "They use air brakes", ar: "تستخدم فرامل هوائية", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى." },
      { term: "hint", ar: "تلميح", explainAr: "Length increases exposure time." }
    ]
  },

  {
    id: "OV-14",
    topic: "other-vehicles",
    promptEn: "As you approach a slow-moving lorry ahead, what should you do?",
    promptAr: "ماذا تفعل عند الاقتراب من شاحنة بطيئة؟",
    options: [
      { en: "Flash your headlights", ar: "أومض بأضواءك", correct: false },
      { en: "Move to the right-hand side", ar: "انتقل إلى الجانب الأيمن", correct: false },
      { en: "Make the lorry wait", ar: "اجعل الشاحنة تنتظر", correct: false },
      { en: "Slow down and be prepared to wait", ar: "أبطئ وكن مستعداً للانتظار", correct: true }
    ],
    keywords: [
      { term: "lorry", ar: "شاحنة", explainAr: "مركبة كبيرة." },
      { term: "hint", ar: "تلميح", explainAr: "Patience reduces risk." }
    ]
  },

  {
    id: "OV-15",
    topic: "other-vehicles",
    promptEn: "A long vehicle ahead signals right but keeps close to the left kerb. What should you do?",
    promptAr: "ماذا تفعل إذا أشارت مركبة طويلة لليمين وبقيت يسارًا؟",
    options: [
      { en: "Warn the driver", ar: "حذر السائق", correct: false },
      { en: "Overtake on the right", ar: "تجاوز من اليمين", correct: false },
      { en: "Report to police", ar: "أبلغ الشرطة", correct: false },
      { en: "Wait behind the vehicle", ar: "انتظر خلف المركبة", correct: true }
    ],
    keywords: [
      { term: "long vehicle", ar: "مركبة طويلة", explainAr: "مركبة طويلة تحتاج مساحة للانعطاف." },
      { term: "hint", ar: "تلميح", explainAr: "Turning space is needed." }
    ]
  },

  {
    id: "OV-16",
    topic: "other-vehicles",
    promptEn: "Why must drivers take extra care where trams operate?",
    promptAr: "لماذا يجب الحذر قرب الترام؟",
    options: [
      { en: "Trams have no horns", ar: "الترام ليس لديه أبواق", correct: false },
      { en: "Trams cannot stop", ar: "الترام لا يمكنه التوقف", correct: false },
      { en: "Trams have no lights", ar: "الترام ليس لديه أضواء", correct: false },
      { en: "Trams cannot steer to avoid obstacles", ar: "الترام لا يمكنه الانحراف لتجنب العوائق", correct: true }
    ],
    keywords: [
      { term: "tram", ar: "ترام", explainAr: "مركبة نقل عام على قضبان ثابتة." },
      { term: "hint", ar: "تلميح", explainAr: "Trams run on fixed tracks." }
    ]
  },

  {
    id: "OV-17",
    topic: "other-vehicles",
    promptEn: "You leave a safe gap behind a large vehicle. Another car moves into it. What should you do?",
    promptAr: "ماذا تفعل إذا دخلت سيارة في المسافة الآمنة؟",
    options: [
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Flash headlights", ar: "أومض بالأضواء", correct: false },
      { en: "Start overtaking", ar: "ابدأ التجاوز", correct: false },
      { en: "Drop back to restore the gap", ar: "تراجع لاستعادة المسافة", correct: true }
    ],
    keywords: [
      { term: "safe gap", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة أمامك." },
      { term: "hint", ar: "تلميح", explainAr: "Always maintain safe distance." }
    ]
  },

  {
    id: "OV-18",
    topic: "other-vehicles",
    promptEn: "You see a bus stopped at a bus stop ahead. What should you do?",
    promptAr: "ماذا تفعل عند رؤية حافلة متوقفة؟",
    options: [
      { en: "Flash your lights", ar: "أومض بأضواءك", correct: false },
      { en: "Pass quickly", ar: "مر بسرعة", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Watch for pedestrians crossing", ar: "راقب المشاة الذين يعبرون", correct: true }
    ],
    keywords: [
      { term: "bus stop", ar: "موقف الحافلات", explainAr: "مكان تتوقف فيه الحافلات." },
      { term: "hint", ar: "تلميح", explainAr: "Pedestrians may step out suddenly." }
    ]
  },

  {
    id: "OV-19",
    topic: "other-vehicles",
    promptEn: "You want to overtake a long, slow-moving vehicle on a busy road. What should you do?",
    promptAr: "كيف تتجاوز مركبة طويلة ببطء؟",
    options: [
      { en: "Follow closely to see ahead", ar: "اتبع عن قرب لرؤية الأمام", correct: false },
      { en: "Flash headlights", ar: "أومض بالأضواء", correct: false },
      { en: "Wait to be waved past", ar: "انتظر أن يلوحوا لك بالمرور", correct: false },
      { en: "Keep well back to get a clear view", ar: "ابق على مسافة جيدة للحصول على رؤية واضحة", correct: true }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى." },
      { term: "hint", ar: "تلميح", explainAr: "Distance improves visibility." }
    ]
  },

  {
    id: "OV-20",
    topic: "other-vehicles",
    promptEn: "A bus ahead signals to pull away from a bus stop. What should you do?",
    promptAr: "ماذا تفعل إذا أشارت الحافلة للخروج؟",
    options: [
      { en: "Get past before it moves", ar: "تجاوز قبل أن تتحرك", correct: false },
      { en: "Flash your headlights", ar: "أومض بأضواءك", correct: false },
      { en: "Signal and wave the bus on", ar: "أشر وأومئ للحافلة", correct: false },
      { en: "Allow it to pull out if safe", ar: "اسمح لها بالخروج إذا كان آمناً", correct: true }
    ],
    keywords: [
      { term: "bus", ar: "حافلة", explainAr: "مركبة نقل عام." },
      { term: "hint", ar: "تلميح", explainAr: "Give priority to buses when safe." }
    ]
  },

  {
    id: "OV-21",
    topic: "other-vehicles",
    promptEn: "You're following a lorry on a wet road. Spray reduces your visibility. What should you do?",
    promptAr: "ماذا تفعل إذا قلّت الرؤية خلف شاحنة؟",
    options: [
      { en: "Speed up and overtake", ar: "تسرع وتتجاوز", correct: false },
      { en: "Keep close behind", ar: "ابق قريباً من الخلف", correct: false },
      { en: "Use full beam headlights", ar: "استخدم الأضواء العالية", correct: false },
      { en: "Drop back until visibility improves", ar: "تراجع حتى تتحسن الرؤية", correct: true }
    ],
    keywords: [
      { term: "spray", ar: "رذاذ", explainAr: "الماء المتطاير من المركبات." },
      { term: "hint", ar: "تلميح", explainAr: "Distance reduces spray." }
    ]
  },

  {
    id: "OV-22",
    topic: "other-vehicles",
    promptEn: "Which vehicles are least affected by strong side winds?",
    promptAr: "أي المركبات أقل تأثرًا بالرياح الجانبية؟",
    options: [
      { en: "Cyclists", ar: "الدراجون", correct: false },
      { en: "Motorcyclists", ar: "راكبو الدراجات النارية", correct: false },
      { en: "High-sided vehicles", ar: "المركبات عالية الجوانب", correct: false },
      { en: "Cars", ar: "السيارات", correct: true }
    ],
    keywords: [
      { term: "side winds", ar: "رياح جانبية", explainAr: "الرياح القوية من الجانب." },
      { term: "hint", ar: "تلميح", explainAr: "Heavier vehicles are more stable." }
    ]
  },

  // --- VEHICLE LOADING ---

  {
    id: "VL-01",
    topic: "vehicle-loading",
    promptEn: "Before towing a trailer, where can you find the maximum permitted nose weight for your vehicle's tow bar?",
    promptAr: "قبل سحب مقطورة، أين تجد الوزن الأقصى المسموح به على خطاف السحب؟",
    options: [
      { en: "In the vehicle handbook", ar: "في دليل المركبة", correct: true },
      { en: "In the Highway Code", ar: "في قانون الطريق", correct: false },
      { en: "On the registration document", ar: "على وثيقة التسجيل", correct: false },
      { en: "On your driving licence", ar: "على رخصة القيادة", correct: false }
    ],
    keywords: [
      { term: "nose weight", ar: "وزن الأنف", explainAr: "الوزن المسموح به على خطاف السحب." },
      { term: "hint", ar: "تلميح", explainAr: "Manufacturer limits are always listed in the handbook." }
    ]
  },

  {
    id: "VL-02",
    topic: "vehicle-loading",
    promptEn: "How does carrying a heavy load on a roof rack affect your car?",
    promptAr: "كيف يؤثر حمل حمولة ثقيلة على حامل السقف على السيارة؟",
    options: [
      { en: "Improves handling", ar: "يحسن التحكم", correct: false },
      { en: "Shortens stopping distance", ar: "يقصر مسافة التوقف", correct: false },
      { en: "Makes steering lighter", ar: "يجعل التوجيه أخف", correct: false },
      { en: "Reduces stability", ar: "يقلل الثبات", correct: true }
    ],
    keywords: [
      { term: "roof rack", ar: "حامل السقف", explainAr: "حامل على سطح السيارة للحمولات." },
      { term: "hint", ar: "تلميح", explainAr: "High loads raise the centre of gravity." }
    ]
  },

  {
    id: "VL-03",
    topic: "vehicle-loading",
    promptEn: "What restraint must be used for a child under 3 years old in a car?",
    promptAr: "ما وسيلة التقييد المناسبة لطفل دون 3 سنوات في السيارة؟",
    options: [
      { en: "Child seat", ar: "مقعد أطفال", correct: true },
      { en: "Adult holding the child", ar: "شخص بالغ يمسك الطفل", correct: false },
      { en: "Adult seat belt", ar: "حزام أمان للبالغين", correct: false },
      { en: "Lap belt", ar: "حزام الحوض", correct: false }
    ],
    keywords: [
      { term: "child seat", ar: "مقعد أطفال", explainAr: "مقعد مخصص للأطفال." },
      { term: "hint", ar: "تلميح", explainAr: "Young children must always use approved child seats." }
    ]
  },

  {
    id: "VL-04",
    topic: "vehicle-loading",
    promptEn: "Before towing a trailer, you notice one of its lights is not working. What should you do?",
    promptAr: "لاحظت أن أحد أضواء المقطورة لا يعمل، ماذا يجب أن تفعل؟",
    options: [
      { en: "Continue driving", ar: "استمر في القيادة", correct: false },
      { en: "Disconnect the trailer", ar: "افصل المقطورة", correct: false },
      { en: "Repair the fault before driving", ar: "أصلح العطل قبل القيادة", correct: true },
      { en: "Repair it later", ar: "أصلحه لاحقاً", correct: false }
    ],
    keywords: [
      { term: "trailer lights", ar: "أضواء المقطورة", explainAr: "أضواء المقطورة يجب أن تعمل." },
      { term: "hint", ar: "تلميح", explainAr: "All trailer lights must work before travel." }
    ]
  },

  {
    id: "VL-05",
    topic: "vehicle-loading",
    promptEn: "If the trailer is wider than your car, what must you fit?",
    promptAr: "إذا كانت المقطورة أعرض من السيارة، ماذا يجب تركيبه؟",
    options: [
      { en: "Exterior towing mirrors", ar: "مرايا سحب خارجية", correct: true },
      { en: "Parking sensors", ar: "أجهزة استشعار للوقوف", correct: false },
      { en: "Reversing camera", ar: "كاميرا للرجوع للخلف", correct: false },
      { en: "Projection markers", ar: "علامات الإسقاط", correct: false }
    ],
    keywords: [
      { term: "towing mirrors", ar: "مرايا السحب", explainAr: "مرايا إضافية لرؤية المقطورة." },
      { term: "hint", ar: "تلميح", explainAr: "You must be able to see clearly behind." }
    ]
  },

  {
    id: "VL-06",
    topic: "vehicle-loading",
    promptEn: "What safety device must be fitted to a trailer's braking system?",
    promptAr: "ما جهاز الأمان الذي يجب تركيبه في نظام فرامل المقطورة؟",
    options: [
      { en: "Stabiliser", ar: "مثبت", correct: false },
      { en: "Jockey wheel", ar: "عجلة الجوكي", correct: false },
      { en: "Corner steadies", ar: "مثبتات الزوايا", correct: false },
      { en: "Breakaway cable", ar: "كابل الانفصال", correct: true }
    ],
    keywords: [
      { term: "breakaway cable", ar: "كابل الانفصال", explainAr: "كابل يطبق الفرامل إذا انفصلت المقطورة." },
      { term: "hint", ar: "تلميح", explainAr: "It applies the brakes if the trailer detaches." }
    ]
  },

  {
    id: "VL-07",
    topic: "vehicle-loading",
    promptEn: "What helps improve stability when towing a caravan?",
    promptAr: "ما الذي يساعد على تحسين الثبات عند سحب كرفان؟",
    options: [
      { en: "Jockey wheel", ar: "عجلة الجوكي", correct: false },
      { en: "Power steering", ar: "توجيه قوي", correct: false },
      { en: "ABS brakes", ar: "فرامل ABS", correct: false },
      { en: "Tow-bar stabiliser", ar: "مثبت خطاف السحب", correct: true }
    ],
    keywords: [
      { term: "stabiliser", ar: "مثبت", explainAr: "جهاز يقلل تأرجح المقطورة." },
      { term: "hint", ar: "تلميح", explainAr: "Stabilisers reduce trailer sway." }
    ]
  },

  {
    id: "VL-08",
    topic: "vehicle-loading",
    promptEn: "Who is legally responsible for making sure a vehicle is not overloaded?",
    promptAr: "من المسؤول قانونيًا عن عدم تحميل المركبة أكثر من اللازم؟",
    options: [
      { en: "Vehicle owner", ar: "مالك المركبة", correct: false },
      { en: "Person loading items", ar: "الشخص الذي يحمل الأغراض", correct: false },
      { en: "Licensing authority", ar: "سلطة الترخيص", correct: false },
      { en: "Driver of the vehicle", ar: "سائق المركبة", correct: true }
    ],
    keywords: [
      { term: "overloaded", ar: "محملة أكثر من اللازم", explainAr: "تحميل المركبة بأكثر من قدرتها." },
      { term: "hint", ar: "تلميح", explainAr: "Responsibility always lies with the driver." }
    ]
  },

  {
    id: "VL-09",
    topic: "vehicle-loading",
    promptEn: "What does a trailer's Maximum Authorised Mass (MAM) mean?",
    promptAr: "ماذا يعني الوزن الإجمالي الأقصى المصرح به للمقطورة؟",
    options: [
      { en: "Load only", ar: "الحمولة فقط", correct: false },
      { en: "Empty trailer weight", ar: "وزن المقطورة الفارغة", correct: false },
      { en: "Combined towing weight", ar: "الوزن الإجمالي للسحب", correct: false },
      { en: "Trailer plus load weight", ar: "وزن المقطورة مع الحمولة", correct: true }
    ],
    keywords: [
      { term: "MAM", ar: "الوزن الإجمالي الأقصى", explainAr: "الحد الأقصى للوزن المسموح به." },
      { term: "hint", ar: "تلميح", explainAr: "Never exceed the stated MAM." }
    ]
  },

  {
    id: "VL-10",
    topic: "vehicle-loading",
    promptEn: "When attaching an unbraked trailer, what must you ensure?",
    promptAr: "عند توصيل مقطورة غير مزودة بفرامل، ماذا يجب التأكد منه؟",
    options: [
      { en: "Fit a secondary coupling device", ar: "تركيب جهاز اقتران ثانوي", correct: true },
      { en: "Grease the tow ball", ar: "تشحيم كرة السحب", correct: false },
      { en: "Switch off sensors", ar: "إيقاف أجهزة الاستشعار", correct: false },
      { en: "Adjust mirrors only", ar: "تعديل المرايا فقط", correct: false }
    ],
    keywords: [
      { term: "unbraked trailer", ar: "مقطورة بدون فرامل", explainAr: "مقطورة لا تحتوي على نظام فرامل." },
      { term: "hint", ar: "تلميح", explainAr: "Secondary couplings add safety." }
    ]
  },

  {
    id: "VL-11",
    topic: "vehicle-loading",
    promptEn: "What aspect of your vehicle is most affected by carrying a very heavy load?",
    promptAr: "ما الجزء الأكثر تأثرًا عند تحميل السيارة حمولة ثقيلة؟",
    options: [
      { en: "Battery", ar: "البطارية", correct: false },
      { en: "Ventilation", ar: "التهوية", correct: false },
      { en: "Handling", ar: "التحكم", correct: true },
      { en: "Gearbox", ar: "صندوق التروس", correct: false }
    ],
    keywords: [
      { term: "handling", ar: "التحكم", explainAr: "قدرة السائق على التحكم في المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Heavy loads affect balance and control." }
    ]
  },

  {
    id: "VL-12",
    topic: "vehicle-loading",
    promptEn: "Before towing a trailer for the first time, what's recommended?",
    promptAr: "قبل سحب مقطورة لأول مرة، ماذا يُنصح به؟",
    options: [
      { en: "Update licence", ar: "تحديث الرخصة", correct: false },
      { en: "Fit P plates", ar: "تركيب لوحات P", correct: false },
      { en: "Take professional training", ar: "أخذ تدريب احترافي", correct: true },
      { en: "Take another test", ar: "إجراء اختبار آخر", correct: false }
    ],
    keywords: [
      { term: "towing", ar: "السحب", explainAr: "عملية سحب مقطورة." },
      { term: "hint", ar: "تلميح", explainAr: "Training improves safety and confidence." }
    ]
  },

  {
    id: "VL-13",
    topic: "vehicle-loading",
    promptEn: "After passing your test, what's the maximum authorised mass of a trailer you can tow?",
    promptAr: "بعد اجتياز الاختبار، ما أقصى وزن مصرح به للمقطورة؟",
    options: [
      { en: "6,500 kg", ar: "6500 كيلوغرام", correct: false },
      { en: "5,500 kg", ar: "5500 كيلوغرام", correct: false },
      { en: "4,500 kg", ar: "4500 كيلوغرام", correct: false },
      { en: "3,500 kg", ar: "3500 كيلوغرام", correct: true }
    ],
    keywords: [
      { term: "maximum authorised mass", ar: "الوزن الأقصى المصرح به", explainAr: "الحد الأقصى للوزن المسموح به." },
      { term: "hint", ar: "تلميح", explainAr: "Always check licence limits." }
    ]
  },

  {
    id: "VL-14",
    topic: "vehicle-loading",
    promptEn: "If your trailer starts to sway while driving, what should you do?",
    promptAr: "إذا بدأت المقطورة بالتأرجح، ماذا يجب أن تفعل؟",
    options: [
      { en: "Brake sharply", ar: "الفرملة بقوة", correct: false },
      { en: "Increase speed", ar: "زيادة السرعة", correct: false },
      { en: "Steer sharply", ar: "التوجيه بقوة", correct: false },
      { en: "Reduce speed gently", ar: "تقليل السرعة برفق", correct: true }
    ],
    keywords: [
      { term: "sway", ar: "التأرجح", explainAr: "حركة المقطورة من جانب إلى آخر." },
      { term: "hint", ar: "تلميح", explainAr: "Gentle speed reduction helps regain control." }
    ]
  },

  {
    id: "VL-15",
    topic: "vehicle-loading",
    promptEn: "When towing on a three-lane motorway, which restriction applies?",
    promptAr: "عند سحب مقطورة على طريق سريع بثلاث مسارات، ما القيد المطبق؟",
    options: [
      { en: "Max 50 mph", ar: "حد أقصى 50 ميل/ساعة", correct: false },
      { en: "No overtaking", ar: "عدم التجاوز", correct: false },
      { en: "Stabiliser required", ar: "مثبت مطلوب", correct: false },
      { en: "No use of right-hand lane", ar: "عدم استخدام المسار الأيمن", correct: true }
    ],
    keywords: [
      { term: "motorway", ar: "طريق سريع", explainAr: "طريق متعدد المسارات بسرعة عالية." },
      { term: "hint", ar: "تلميح", explainAr: "Trailers must stay out of the right lane." }
    ]
  },

  {
    id: "VL-16",
    topic: "vehicle-loading",
    promptEn: "When should tyre pressures be increased above normal?",
    promptAr: "متى يجب زيادة ضغط الإطارات عن الوضع الطبيعي؟",
    options: [
      { en: "Slippery roads", ar: "طرق زلقة", correct: false },
      { en: "ABS fitted", ar: "نظام ABS مثبت", correct: false },
      { en: "Worn tread", ar: "مداس بالي", correct: false },
      { en: "Carrying a heavy load", ar: "حمل حمولة ثقيلة", correct: true }
    ],
    keywords: [
      { term: "tyre pressure", ar: "ضغط الإطارات", explainAr: "الضغط داخل الإطارات." },
      { term: "hint", ar: "تلميح", explainAr: "Heavy loads need higher pressures." }
    ]
  },

  {
    id: "VL-17",
    topic: "vehicle-loading",
    promptEn: "If a trailer starts swinging side to side, what's the safest action?",
    promptAr: "إذا بدأت المقطورة بالتأرجح، ما الإجراء الأكثر أمانًا؟",
    options: [
      { en: "Accelerate", ar: "التسارع", correct: false },
      { en: "Brake hard", ar: "الفرملة بقوة", correct: false },
      { en: "Let go of steering", ar: "ترك عجلة القيادة", correct: false },
      { en: "Ease off the accelerator", ar: "التخفيف من دواسة الوقود", correct: true }
    ],
    keywords: [
      { term: "swinging", ar: "التأرجح", explainAr: "حركة المقطورة من جانب إلى آخر." },
      { term: "hint", ar: "تلميح", explainAr: "Sudden actions make swaying worse." }
    ]
  },

  {
    id: "VL-18",
    topic: "vehicle-loading",
    promptEn: "What's the legal minimum tread depth for trailer tyres?",
    promptAr: "ما الحد الأدنى القانوني لعمق مداس إطارات المقطورة؟",
    options: [
      { en: "1 mm", ar: "1 ملم", correct: false },
      { en: "1.6 mm", ar: "1.6 ملم", correct: true },
      { en: "2 mm", ar: "2 ملم", correct: false },
      { en: "2.2 mm", ar: "2.2 ملم", correct: false }
    ],
    keywords: [
      { term: "tread depth", ar: "عمق المداس", explainAr: "عمق الأخاديد في الإطار." },
      { term: "hint", ar: "تلميح", explainAr: "Same minimum as car tyres." }
    ]
  },

  {
    id: "VL-19",
    topic: "vehicle-loading",
    promptEn: "Are passengers allowed to travel in a towed caravan?",
    promptAr: "هل يُسمح للركاب بالجلوس داخل كرفان مسحوب؟",
    options: [
      { en: "Yes, over 14", ar: "نعم، فوق 14 سنة", correct: false },
      { en: "No, never", ar: "لا، أبداً", correct: true },
      { en: "If seats are full", ar: "إذا كانت المقاعد ممتلئة", correct: false },
      { en: "With stabiliser", ar: "مع مثبت", correct: false }
    ],
    keywords: [
      { term: "caravan", ar: "كرفان", explainAr: "مقطورة سكنية." },
      { term: "hint", ar: "تلميح", explainAr: "It's illegal and unsafe." }
    ]
  },

  {
    id: "VL-20",
    topic: "vehicle-loading",
    promptEn: "How should heavy items be positioned when loading a trailer?",
    promptAr: "كيف يجب وضع الأغراض الثقيلة داخل المقطورة؟",
    options: [
      { en: "At the front", ar: "في المقدمة", correct: false },
      { en: "At the back", ar: "في الخلف", correct: false },
      { en: "Over the axles", ar: "فوق المحاور", correct: true },
      { en: "In corners", ar: "في الزوايا", correct: false }
    ],
    keywords: [
      { term: "axles", ar: "المحاور", explainAr: "المحاور التي تدور عليها عجلات المقطورة." },
      { term: "hint", ar: "تلميح", explainAr: "Central weight improves balance." }
    ]
  },

  {
    id: "VL-21",
    topic: "vehicle-loading",
    promptEn: "How should a load be carried on a roof rack?",
    promptAr: "كيف يجب تثبيت الحمولة على حامل السقف؟",
    options: [
      { en: "Securely fastened with proper restraints", ar: "مثبتة بإحكام بأربطة مناسبة", correct: true },
      { en: "Toward the rear", ar: "نحو الخلف", correct: false },
      { en: "Visible in mirrors", ar: "مرئية في المرايا", correct: false },
      { en: "Covered with plastic", ar: "مغطاة بالبلاستيك", correct: false }
    ],
    keywords: [
      { term: "roof rack", ar: "حامل السقف", explainAr: "حامل على سطح السيارة." },
      { term: "hint", ar: "تلميح", explainAr: "Loose loads are extremely dangerous." }
    ]
  },

  // --- ATTITUDE ---

  {
    id: "AT-01",
    topic: "attitude",
    promptEn: "As you approach a pedestrian crossing and people are waiting, what should you do?",
    promptAr: "عند الاقتراب من ممر مشاة ووجود أشخاص ينتظرون العبور، ماذا يجب أن تفعل؟",
    options: [
      { en: "Only stop for elderly people", ar: "التوقف فقط لكبار السن", correct: false },
      { en: "Slow down and be ready to stop", ar: "تخفيف السرعة والاستعداد للتوقف", correct: true },
      { en: "Flash headlights to invite them", ar: "وميض الأضواء لدعوتهم", correct: false },
      { en: "Wave them across", ar: "الإشارة لهم بالعبور", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "ممر مشاة", explainAr: "مكان مخصص لعبور المشاة." },
      { term: "hint", ar: "تلميح", explainAr: "Pedestrians always have priority at crossings." }
    ]
  },

  {
    id: "AT-02",
    topic: "attitude",
    promptEn: "Traffic is slow and the driver behind is following very closely. What should you do?",
    promptAr: "إذا كان السائق خلفك قريبًا جدًا، ماذا يجب أن تفعل؟",
    options: [
      { en: "Ignore them", ar: "تجاهلهم", correct: false },
      { en: "Gradually increase the gap ahead", ar: "زيادة المسافة أمامك تدريجياً", correct: true },
      { en: "Wave them past", ar: "الإشارة لهم بالمرور", correct: false },
      { en: "Move to the centre of the road", ar: "الانتقال إلى وسط الطريق", correct: false }
    ],
    keywords: [
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة بينك وبين المركبة أمامك." },
      { term: "hint", ar: "تلميح", explainAr: "Increasing space ahead reduces sudden braking risk." }
    ]
  },

  {
    id: "AT-03",
    topic: "attitude",
    promptEn: "Why is driving too close to the vehicle in front dangerous?",
    promptAr: "لماذا يعتبر السير قريبًا جدًا من السيارة الأمامية خطيرًا؟",
    options: [
      { en: "Engine may overheat", ar: "قد يسخن المحرك", correct: false },
      { en: "Mirrors become ineffective", ar: "تصبح المرايا غير فعالة", correct: false },
      { en: "Your stopping time is reduced", ar: "وقت التوقف لديك يقل", correct: true },
      { en: "Navigation becomes inaccurate", ar: "تصبح الملاحة غير دقيقة", correct: false }
    ],
    keywords: [
      { term: "stopping time", ar: "وقت التوقف", explainAr: "الوقت اللازم للتوقف بأمان." },
      { term: "hint", ar: "تلميح", explainAr: "Less space means less time to react." }
    ]
  },

  {
    id: "AT-04",
    topic: "attitude",
    promptEn: "When is a two-second following gap generally recommended?",
    promptAr: "متى يُنصح بترك مسافة ثانيتين بينك وبين السيارة الأمامية؟",
    options: [
      { en: "In dry conditions", ar: "في الظروف الجافة", correct: true },
      { en: "In fog", ar: "في الضباب", correct: false },
      { en: "On icy roads", ar: "على الطرق الجليدية", correct: false },
      { en: "In heavy rain", ar: "في المطر الغزير", correct: false }
    ],
    keywords: [
      { term: "two-second gap", ar: "مسافة ثانيتين", explainAr: "المسافة الآمنة في الظروف العادية." },
      { term: "hint", ar: "تلميح", explainAr: "Bad weather needs longer gaps." }
    ]
  },

  {
    id: "AT-05",
    topic: "attitude",
    promptEn: "A large vehicle signals left but swings right before turning. What should you do?",
    promptAr: "مركبة كبيرة تعطي إشارة يسار لكنها تنحرف يمينًا، ماذا تفعل؟",
    options: [
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Drive past on the left", ar: "المرور من اليسار", correct: false },
      { en: "Overtake quickly", ar: "التجاوز بسرعة", correct: false },
      { en: "Slow down and allow it to turn", ar: "التخفيف والسماح لها بالانعطاف", correct: true }
    ],
    keywords: [
      { term: "large vehicle", ar: "مركبة كبيرة", explainAr: "مركبة كبيرة تحتاج مساحة أكبر للانعطاف." },
      { term: "hint", ar: "تلميح", explainAr: "Large vehicles need space to turn safely." }
    ]
  },

  {
    id: "AT-06",
    topic: "attitude",
    promptEn: "Who must obey diamond-shaped lane signs?",
    promptAr: "من يجب عليه الالتزام بإشارات المسارات ذات الشكل الماسي؟",
    options: [
      { en: "Trams", ar: "الترام", correct: false },
      { en: "Buses", ar: "الحافلات", correct: false },
      { en: "Lorries", ar: "الشاحنات", correct: false },
      { en: "Taxis", ar: "سيارات الأجرة", correct: true }
    ],
    keywords: [
      { term: "diamond-shaped signs", ar: "إشارات ماسية الشكل", explainAr: "إشارات خاصة بمركبات معينة." },
      { term: "hint", ar: "تلميح", explainAr: "These signs are specific to certain vehicles." }
    ]
  },

  {
    id: "AT-07",
    topic: "attitude",
    promptEn: "When should you flash your headlights at another road user?",
    promptAr: "متى يجب وميض الأضواء لسائق آخر؟",
    options: [
      { en: "To claim right of way", ar: "للمطالبة بأولوية المرور", correct: false },
      { en: "To warn of a turn", ar: "لتحذير من انعطاف", correct: false },
      { en: "To show you're there", ar: "لإظهار وجودك", correct: true },
      { en: "To force them to stop", ar: "لإجبارهم على التوقف", correct: false }
    ],
    keywords: [
      { term: "flash headlights", ar: "وميض الأضواء", explainAr: "استخدام الأضواء للتنبيه." },
      { term: "hint", ar: "تلميح", explainAr: "Headlight flashes are for presence, not permission." }
    ]
  },

  {
    id: "AT-08",
    topic: "attitude",
    promptEn: "A bus lane sign shows no operating times. What does this mean?",
    promptAr: "ماذا يعني مسار الحافلات بدون أوقات تشغيل محددة؟",
    options: [
      { en: "Only peak hours", ar: "ساعات الذروة فقط", correct: false },
      { en: "Daytime only", ar: "نهاراً فقط", correct: false },
      { en: "Not currently active", ar: "غير نشط حالياً", correct: false },
      { en: "Operates all the time", ar: "يعمل طوال الوقت", correct: true }
    ],
    keywords: [
      { term: "bus lane", ar: "مسار الحافلات", explainAr: "مسار مخصص للحافلات." },
      { term: "hint", ar: "تلميح", explainAr: "No times means 24-hour operation." }
    ]
  },

  {
    id: "AT-09",
    topic: "attitude",
    promptEn: "At a pelican crossing with flashing amber, what must you do?",
    promptAr: "عند ممر المشاة بإشارة ضوئية (Pelican Crossing) بإشارة صفراء وامضة، ماذا يجب أن تفعل؟",
    options: [
      { en: "Stop immediately", ar: "التوقف فوراً", correct: false },
      { en: "Proceed carefully", ar: "المتابعة بحذر", correct: false },
      { en: "Give way to pedestrians already crossing", ar: "إعطاء أولوية للمشاة الذين يعبرون بالفعل", correct: true },
      { en: "Wait for red light", ar: "الانتظار للضوء الأحمر", correct: false }
    ],
    keywords: [
      { term: "pelican crossing", ar: "ممر المشاة بإشارة ضوئية (Pelican Crossing)", explainAr: "ممر مشاة مع إشارات ضوئية." },
      { term: "hint", ar: "تلميح", explainAr: "المشاة على ممر بيليكان لا يزالون لهم الأولوية." }
    ]
  },

  {
    id: "AT-10",
    topic: "attitude",
    promptEn: "What minimum following distance should you allow on wet roads?",
    promptAr: "ما أقل مسافة أمان يجب تركها على الطرق المبتلة؟",
    options: [
      { en: "1 second", ar: "ثانية واحدة", correct: false },
      { en: "2 seconds", ar: "ثانيتان", correct: false },
      { en: "3 seconds", ar: "3 ثوان", correct: false },
      { en: "4 seconds", ar: "4 ثوان", correct: true }
    ],
    keywords: [
      { term: "wet roads", ar: "طرق مبتلة", explainAr: "الطرق المبتلة تحتاج مسافة أكبر." },
      { term: "hint", ar: "تلميح", explainAr: "Wet roads double stopping distance." }
    ]
  },

  {
    id: "AT-11",
    topic: "attitude",
    promptEn: "A vehicle pulls out suddenly at a junction. What should you do?",
    promptAr: "مركبة تخرج فجأة من تقاطع، ماذا تفعل؟",
    options: [
      { en: "Accelerate", ar: "التسارع", correct: false },
      { en: "Sound your horn", ar: "استخدام البوق", correct: false },
      { en: "Swerve sharply", ar: "الانحراف بقوة", correct: false },
      { en: "Slow down and prepare to stop", ar: "التخفيف والاستعداد للتوقف", correct: true }
    ],
    keywords: [
      { term: "junction", ar: "تقاطع", explainAr: "مكان يتقاطع فيه طريقان." },
      { term: "hint", ar: "تلميح", explainAr: "Sudden reactions increase collision risk." }
    ]
  },

  {
    id: "AT-12",
    topic: "attitude",
    promptEn: "A long lorry is overtaking you slowly. What should you do?",
    promptAr: "شاحنة طويلة تتجاوزك ببطء، ماذا تفعل؟",
    options: [
      { en: "Speed up", ar: "زيادة السرعة", correct: false },
      { en: "Change direction", ar: "تغيير الاتجاه", correct: false },
      { en: "Hold your speed", ar: "الحفاظ على سرعتك", correct: true },
      { en: "Brake suddenly", ar: "الفرملة فجأة", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "المرور بجانب مركبة أخرى." },
      { term: "hint", ar: "تلميح", explainAr: "Maintain steady speed to help them pass safely." }
    ]
  },

  {
    id: "AT-13",
    topic: "attitude",
    promptEn: "Which driving style increases danger for everyone?",
    promptAr: "أي أسلوب قيادة يزيد الخطر على الجميع؟",
    options: [
      { en: "Considerate", ar: "مراعي", correct: false },
      { en: "Defensive", ar: "دفاعي", correct: false },
      { en: "Competitive", ar: "تنافسي", correct: true },
      { en: "Responsible", ar: "مسؤول", correct: false }
    ],
    keywords: [
      { term: "driving style", ar: "أسلوب القيادة", explainAr: "طريقة القيادة والسلوك على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Competition on roads leads to risk-taking." }
    ]
  },

  {
    id: "AT-14",
    topic: "attitude",
    promptEn: "On a narrow single-track road, where should you wait if a vehicle is approaching?",
    promptAr: "على طريق ضيق بمسار واحد، أين يجب أن تنتظر؟",
    options: [
      { en: "In the passing place opposite", ar: "في مكان المرور المقابل", correct: false },
      { en: "On the verge", ar: "على الحافة", correct: false },
      { en: "In the passing place on your side", ar: "في مكان المرور على جانبك", correct: true },
      { en: "In the centre of the road", ar: "في وسط الطريق", correct: false }
    ],
    keywords: [
      { term: "single-track road", ar: "طريق بمسار واحد", explainAr: "طريق ضيق بمسار واحد." },
      { term: "hint", ar: "تلميح", explainAr: "Use passing places correctly." }
    ]
  },

  {
    id: "AT-15",
    topic: "attitude",
    promptEn: "A person herding animals asks you to stop. What should you do?",
    promptAr: "شخص يقود حيوانات يطلب منك التوقف، ماذا تفعل؟",
    options: [
      { en: "Ignore them", ar: "تجاهلهم", correct: false },
      { en: "Stop and switch off the engine", ar: "التوقف وإيقاف المحرك", correct: true },
      { en: "Drive slowly past", ar: "المرور ببطء", correct: false },
      { en: "Sound your horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "herding animals", ar: "قيادة الحيوانات", explainAr: "تحريك الحيوانات على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Livestock movements require full stopping." }
    ]
  },

  {
    id: "AT-16",
    topic: "attitude",
    promptEn: "Why should you never wave pedestrians across the road?",
    promptAr: "لماذا لا يجب التلويح للمشاة للعبور؟",
    options: [
      { en: "They may be distracted", ar: "قد يكونون مشتتين", correct: false },
      { en: "Other vehicles may not stop", ar: "المركبات الأخرى قد لا تتوقف", correct: true },
      { en: "It delays traffic", ar: "يؤخر حركة المرور", correct: false },
      { en: "It's unnecessary", ar: "إنه غير ضروري", correct: false }
    ],
    keywords: [
      { term: "wave pedestrians", ar: "التلويح للمشاة", explainAr: "الإشارة للمشاة بالعبور." },
      { term: "hint", ar: "تلميح", explainAr: "You can't control other drivers." }
    ]
  },

  {
    id: "AT-17",
    topic: "attitude",
    promptEn: "You're driving at the speed limit and a vehicle behind wants to overtake. What should you do?",
    promptAr: "تسير بالسرعة القانونية وسائق خلفك يريد التجاوز، ماذا تفعل؟",
    options: [
      { en: "Accelerate", ar: "التسارع", correct: false },
      { en: "Block them", ar: "عرقلة طريقهم", correct: false },
      { en: "Hold steady and allow overtaking", ar: "الحفاظ على الثبات والسماح بالتجاوز", correct: true },
      { en: "Sound your horn", ar: "استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "speed limit", ar: "حد السرعة", explainAr: "الحد الأقصى للسرعة المسموح بها." },
      { term: "hint", ar: "تلميح", explainAr: "Stay predictable and calm." }
    ]
  },

  {
    id: "AT-18",
    topic: "attitude",
    promptEn: "Which vehicle uses a blue flashing beacon?",
    promptAr: "أي مركبة تستخدم ضوءًا أزرق وامضًا؟",
    options: [
      { en: "Snow plough", ar: "مكشطة الثلج", correct: false },
      { en: "Breakdown recovery", ar: "إنقاذ الأعطال", correct: false },
      { en: "Bomb disposal", ar: "تفكيك القنابل", correct: true },
      { en: "Road maintenance", ar: "صيانة الطرق", correct: false }
    ],
    keywords: [
      { term: "blue beacon", ar: "ضوء أزرق وامض", explainAr: "ضوء أزرق وامض للمركبات الخاصة." },
      { term: "hint", ar: "تلميح", explainAr: "Blue beacons indicate emergency services." }
    ]
  },

  {
    id: "AT-19",
    topic: "attitude",
    promptEn: "How should you approach an unmarked crossroads?",
    promptAr: "كيف تتعامل مع تقاطع غير مُعلَّم؟",
    options: [
      { en: "Accelerate", ar: "التسارع", correct: false },
      { en: "Keep right", ar: "البقاء على اليمين", correct: false },
      { en: "Slow down and check both ways", ar: "التخفيف والتحقق من كلا الاتجاهين", correct: true },
      { en: "Look left only", ar: "النظر يساراً فقط", correct: false }
    ],
    keywords: [
      { term: "unmarked crossroads", ar: "تقاطع غير معلم", explainAr: "تقاطع بدون إشارات أو علامات." },
      { term: "hint", ar: "تلميح", explainAr: "Lack of signs means extra caution." }
    ]
  },

  {
    id: "AT-20",
    topic: "attitude",
    promptEn: "At night on a clear road with oncoming traffic, which lights should you use?",
    promptAr: "ليلاً ومع وجود حركة مرور مقابلة، أي أضواء تستخدم؟",
    options: [
      { en: "Full beam", ar: "الأضواء العالية", correct: false },
      { en: "Fog lights", ar: "أضواء الضباب", correct: false },
      { en: "Sidelights", ar: "الأضواء الجانبية", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true }
    ],
    keywords: [
      { term: "dipped headlights", ar: "أضواء منخفضة", explainAr: "أضواء لا تعمي السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "Avoid dazzling other drivers." }
    ]
  },

  {
    id: "AT-21",
    topic: "attitude",
    promptEn: "At a pedestrian crossing controlled by push-button signals, what light comes after green?",
    promptAr: "في معبر مشاة بإشارات زرّية، ما الإشارة التي تأتي بعد اللون الأخضر؟",
    options: [
      { en: "Steady red", ar: "أحمر ثابت", correct: false },
      { en: "Flashing amber", ar: "أصفر وامض", correct: true },
      { en: "Steady amber", ar: "أصفر ثابت", correct: false },
      { en: "Flashing green", ar: "أخضر وامض", correct: false }
    ],
    keywords: [
      { term: "pedestrian crossing", ar: "معبر مشاة", explainAr: "مكان مخصص لعبور المشاة." },
      { term: "hint", ar: "تلميح", explainAr: "Flashing amber means pedestrians may still be crossing." }
    ]
  },

  {
    id: "AT-22",
    topic: "attitude",
    promptEn: "In good, dry conditions, when should you apply the two-second following rule?",
    promptAr: "في ظروف جافة وجيدة، متى تطبق قاعدة الثانيتين؟",
    options: [
      { en: "When checking distance from the vehicle ahead", ar: "عند فحص المسافة من المركبة الأمامية", correct: true },
      { en: "Before restarting the engine", ar: "قبل إعادة تشغيل المحرك", correct: false },
      { en: "Before signalling", ar: "قبل الإشارة", correct: false },
      { en: "When lights turn green", ar: "عندما تتحول الإشارة إلى الأخضر", correct: false }
    ],
    keywords: [
      { term: "two-second rule", ar: "قاعدة الثانيتين", explainAr: "قاعدة لقياس المسافة الآمنة." },
      { term: "hint", ar: "تلميح", explainAr: "The rule measures safe following distance." }
    ]
  },

  {
    id: "AT-23",
    topic: "attitude",
    promptEn: "What problem can a loose diesel fuel cap cause while driving?",
    promptAr: "ما المشكلة التي قد يسببها غطاء وقود الديزل غير المحكم؟",
    options: [
      { en: "Hard starting", ar: "صعوبة التشغيل", correct: false },
      { en: "Slippery road surface for others", ar: "سطح طريق زلق للآخرين", correct: true },
      { en: "Better fuel economy", ar: "اقتصاد أفضل للوقود", correct: false },
      { en: "Lower emissions", ar: "انبعاثات أقل", correct: false }
    ],
    keywords: [
      { term: "fuel cap", ar: "غطاء الوقود", explainAr: "غطاء خزان الوقود." },
      { term: "hint", ar: "تلميح", explainAr: "Spilled fuel is dangerous for other road users." }
    ]
  },

  {
    id: "AT-24",
    topic: "attitude",
    promptEn: "Which dashboard light shows that main-beam headlights are on?",
    promptAr: "أي ضوء في لوحة العدادات يدل على تشغيل الضوء العالي؟",
    options: [
      { en: "Green headlamp symbol with straight lines", ar: "رمز مصباح أخضر بخطوط مستقيمة", correct: true },
      { en: "Amber fog light symbol", ar: "رمز ضوء ضباب أصفر", correct: false },
      { en: "Red battery symbol", ar: "رمز بطارية أحمر", correct: false },
      { en: "Blue sidelights symbol", ar: "رمز أضواء جانبية زرقاء", correct: false }
    ],
    keywords: [
      { term: "main beam", ar: "الضوء العالي", explainAr: "الأضواء العالية للسيارة." },
      { term: "hint", ar: "تلميح", explainAr: "Main beam is shown by a blue/green straight-line headlamp icon." }
    ]
  },

  {
    id: "AT-25",
    topic: "attitude",
    promptEn: "You're driving a slow vehicle on a narrow, winding road. What should you do?",
    promptAr: "تقود مركبة بطيئة على طريق ضيق ومتعرج، ماذا تفعل؟",
    options: [
      { en: "Block overtaking", ar: "عرقلة التجاوز", correct: false },
      { en: "Pull in when safe to let others pass", ar: "الانسحاب عندما يكون آمناً للسماح للآخرين بالمرور", correct: true },
      { en: "Keep speeding up", ar: "الاستمرار في التسارع", correct: false },
      { en: "Signal continuously", ar: "الإشارة باستمرار", correct: false }
    ],
    keywords: [
      { term: "narrow road", ar: "طريق ضيق", explainAr: "طريق بمساحة محدودة." },
      { term: "hint", ar: "تلميح", explainAr: "Letting others pass reduces risk and frustration." }
    ]
  },

  {
    id: "AT-26",
    topic: "attitude",
    promptEn: "You're driving at the speed limit and a vehicle behind flashes headlights. What should you do?",
    promptAr: "تسير بالسرعة القانونية وسائق خلفك يومض بالأضواء، ماذا تفعل؟",
    options: [
      { en: "Accelerate", ar: "التسارع", correct: false },
      { en: "Brake sharply", ar: "الفرملة بقوة", correct: false },
      { en: "Block overtaking", ar: "عرقلة التجاوز", correct: false },
      { en: "Allow the vehicle to pass safely", ar: "السماح للمركبة بالمرور بأمان", correct: true }
    ],
    keywords: [
      { term: "speed limit", ar: "حد السرعة", explainAr: "الحد الأقصى للسرعة المسموح بها." },
      { term: "hint", ar: "تلميح", explainAr: "Do not react aggressively to pressure." }
    ]
  },

  {
    id: "AT-27",
    topic: "attitude",
    promptEn: "How can you best prevent fuel from spilling onto the road?",
    promptAr: "كيف تمنع تسرب الوقود على الطريق؟",
    options: [
      { en: "Keep tank partially full", ar: "الحفاظ على الخزان ممتلئاً جزئياً", correct: false },
      { en: "Use locking cap", ar: "استخدام غطاء قفل", correct: false },
      { en: "Check gauge regularly", ar: "فحص المؤشر بانتظام", correct: false },
      { en: "Ensure the filler cap is secure", ar: "التأكد من أن غطاء التعبئة محكم", correct: true }
    ],
    keywords: [
      { term: "fuel spill", ar: "تسرب الوقود", explainAr: "تسرب الوقود على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "A loose cap can cause dangerous spills." }
    ]
  },

  {
    id: "AT-28",
    topic: "attitude",
    promptEn: "Which emergency vehicle uses a green flashing beacon?",
    promptAr: "أي مركبة طوارئ تستخدم ضوءًا أخضر وامضًا؟",
    options: [
      { en: "Fire engine", ar: "سيارة إطفاء", correct: false },
      { en: "Road gritter", ar: "مكشطة الطريق", correct: false },
      { en: "Ambulance", ar: "إسعاف", correct: false },
      { en: "Doctor's car", ar: "سيارة طبيب", correct: true }
    ],
    keywords: [
      { term: "green beacon", ar: "ضوء أخضر وامض", explainAr: "ضوء أخضر وامض للمركبات الخاصة." },
      { term: "hint", ar: "تلميح", explainAr: "Green beacons are used by doctors responding to emergencies." }
    ]
  },

  {
    id: "AT-29",
    topic: "attitude",
    promptEn: "How should you overtake a horse and rider safely?",
    promptAr: "كيف تتجاوز حصانًا وفارسه بأمان؟",
    options: [
      { en: "Use the horn", ar: "استخدام البوق", correct: false },
      { en: "Pass quickly", ar: "المرور بسرعة", correct: false },
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false },
      { en: "Pass slowly and carefully", ar: "المرور ببطء وحذر", correct: true }
    ],
    keywords: [
      { term: "horse rider", ar: "فارس", explainAr: "شخص يركب حصاناً على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Horses can be startled by noise and speed." }
    ]
  },

  {
    id: "AT-30",
    topic: "attitude",
    promptEn: "On roads where trams operate, which road users are most at risk from rails?",
    promptAr: "على الطرق التي تعمل بها الترام، من الأكثر عرضة للخطر بسبب القضبان؟",
    options: [
      { en: "Cars", ar: "السيارات", correct: false },
      { en: "Buses", ar: "الحافلات", correct: false },
      { en: "Lorries", ar: "الشاحنات", correct: false },
      { en: "Bicycles", ar: "الدراجات", correct: true }
    ],
    keywords: [
      { term: "tram rails", ar: "قضبان الترام", explainAr: "قضبان ثابتة للترام." },
      { term: "hint", ar: "تلميح", explainAr: "Narrow wheels can slip into rails." }
    ]
  },

  {
    id: "AT-31",
    topic: "attitude",
    promptEn: "Why should you position your vehicle correctly early before turning right?",
    promptAr: "لماذا يجب اتخاذ الوضع الصحيح قبل الانعطاف يمينًا بوقت كافٍ؟",
    options: [
      { en: "To let others pass", ar: "للسماح للآخرين بالمرور", correct: false },
      { en: "To signal your intentions clearly", ar: "لإظهار نواياك بوضوح", correct: true },
      { en: "To increase speed", ar: "لزيادة السرعة", correct: false },
      { en: "To block traffic", ar: "لعرقلة المرور", correct: false }
    ],
    keywords: [
      { term: "positioning", ar: "الوضع", explainAr: "اتخاذ الوضع الصحيح على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Clear positioning helps others anticipate your move." }
    ]
  },

  {
    id: "AT-32",
    topic: "attitude",
    promptEn: "At night on an unlit road, what lights should you use when following another vehicle?",
    promptAr: "ليلاً على طريق غير مضاء، أي أضواء تستخدم عند اتباع مركبة؟",
    options: [
      { en: "Flash headlights", ar: "وميض الأضواء", correct: false },
      { en: "Full beam", ar: "الأضواء العالية", correct: false },
      { en: "Switch off lights", ar: "إطفاء الأضواء", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true }
    ],
    keywords: [
      { term: "dipped headlights", ar: "أضواء منخفضة", explainAr: "أضواء لا تعمي السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "Avoid dazzling the driver ahead." }
    ]
  },

  {
    id: "AT-33",
    topic: "attitude",
    promptEn: "In a one-way street with two lanes, where should you position to turn right?",
    promptAr: "في شارع باتجاه واحد بمسارين، أين تتمركز للانعطاف يمينًا؟",
    options: [
      { en: "Left lane", ar: "المسار الأيسر", correct: false },
      { en: "Right lane", ar: "المسار الأيمن", correct: true },
      { en: "Either lane", ar: "أي مسار", correct: false },
      { en: "Centre of road", ar: "وسط الطريق", correct: false }
    ],
    keywords: [
      { term: "one-way street", ar: "شارع باتجاه واحد", explainAr: "شارع يسمح بالحركة في اتجاه واحد فقط." },
      { term: "hint", ar: "تلميح", explainAr: "Position according to your intended direction." }
    ]
  },

  {
    id: "AT-34",
    topic: "attitude",
    promptEn: "A car cuts in very close ahead of you. What should you do?",
    promptAr: "سيارة تدخل فجأة أمامك بمسافة قريبة، ماذا تفعل؟",
    options: [
      { en: "Accelerate", ar: "التسارع", correct: false },
      { en: "Sound horn", ar: "استخدام البوق", correct: false },
      { en: "Drop back to a safe distance", ar: "التراجع إلى مسافة آمنة", correct: true },
      { en: "Flash lights", ar: "وميض الأضواء", correct: false }
    ],
    keywords: [
      { term: "safe distance", ar: "مسافة آمنة", explainAr: "المسافة الكافية بينك وبين المركبة أمامك." },
      { term: "hint", ar: "تلميح", explainAr: "Increase space to avoid collision." }
    ]
  },

  {
    id: "AT-35",
    topic: "attitude",
    promptEn: "An ambulance with blue flashing lights is behind you. What should you do?",
    promptAr: "إسعاف بضوء أزرق وامض خلفك، ماذا تفعل؟",
    options: [
      { en: "Speed up", ar: "التسارع", correct: false },
      { en: "Maintain speed", ar: "الحفاظ على السرعة", correct: false },
      { en: "Pull over safely and let it pass", ar: "الانسحاب بأمان والسماح له بالمرور", correct: true },
      { en: "Brake sharply", ar: "الفرملة بقوة", correct: false }
    ],
    keywords: [
      { term: "emergency vehicle", ar: "مركبة طوارئ", explainAr: "مركبة خدمات طوارئ." },
      { term: "hint", ar: "تلميح", explainAr: "Emergency vehicles must be given priority." }
    ]
  },

  {
    id: "AT-36",
    topic: "attitude",
    promptEn: "Which crossing allows cyclists to ride across with pedestrians?",
    promptAr: "أي معبر يسمح للدراجات بالعبور مع المشاة؟",
    options: [
      { en: "Puffin", ar: "بفن", correct: false },
      { en: "Pelican", ar: "ممر المشاة بإشارة ضوئية (Pelican Crossing)", correct: false },
      { en: "Zebra", ar: "زيبرا", correct: false },
      { en: "Toucan", ar: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)", correct: true }
    ],
    keywords: [
      { term: "toucan crossing", ar: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)", explainAr: "معبر يسمح للدراجات والمشاة بالعبور معاً." },
      { term: "hint", ar: "تلميح", explainAr: "Toucan = \"two can cross\"." }
    ]
  },

  {
    id: "AT-37",
    topic: "attitude",
    promptEn: "What danger results from following a vehicle too closely?",
    promptAr: "ما خطر السير قريبًا جدًا من مركبة أخرى؟",
    options: [
      { en: "Engine overheating", ar: "سخونة المحرك", correct: false },
      { en: "Higher fuel use", ar: "استهلاك وقود أعلى", correct: false },
      { en: "Reduced forward view", ar: "انخفاض الرؤية الأمامية", correct: true },
      { en: "Tyre damage", ar: "تلف الإطارات", correct: false }
    ],
    keywords: [
      { term: "following distance", ar: "مسافة المتابعة", explainAr: "المسافة بينك وبين المركبة أمامك." },
      { term: "hint", ar: "تلميح", explainAr: "Close following limits visibility and reaction time." }
    ]
  },

  {
    id: "AT-38",
    topic: "attitude",
    promptEn: "At night in a queue, how can you avoid dazzling drivers behind you?",
    promptAr: "ليلاً أثناء التوقف، كيف تتجنب إبهار السائقين خلفك؟",
    options: [
      { en: "Keep foot on brake", ar: "الحفاظ على القدم على الفرامل", correct: false },
      { en: "Use parking brake and release footbrake", ar: "استخدام فرامل اليد وإطلاق فرامل القدم", correct: true },
      { en: "Balance clutch", ar: "موازنة الدبرياج", correct: false },
      { en: "Use both brakes", ar: "استخدام كلا الفراملين", correct: false }
    ],
    keywords: [
      { term: "dazzling", ar: "إبهار", explainAr: "إبهار السائقين الآخرين بالأضواء." },
      { term: "hint", ar: "تلميح", explainAr: "Parking brake prevents bright brake lights." }
    ]
  },

  // --- SAFETY & YOUR VEHICLE ---

  {
    id: "SV-01",
    topic: "safety-vehicle",
    promptEn: "In which situation would parking your vehicle cause an obstruction?",
    promptAr: "في أي حالة قد يؤدي ركن مركبتك إلى إعاقة المرور؟",
    options: [
      { en: "Next to a parking meter", ar: "بجانب عداد وقوف السيارات", correct: false },
      { en: "In front of a property entrance", ar: "أمام مدخل عقار", correct: true },
      { en: "On your own driveway", ar: "على ممرك الخاص", correct: false },
      { en: "In a marked parking bay", ar: "في مكان وقوف محدد", correct: false }
    ],
    keywords: [
      { term: "obstruction", ar: "إعاقة", explainAr: "منع الآخرين من الوصول أو الخروج." },
      { term: "hint", ar: "تلميح", explainAr: "Blocking access points can prevent others from entering or leaving." }
    ]
  },

  {
    id: "SV-02",
    topic: "safety-vehicle",
    promptEn: "What should you do when leaving your vehicle parked and unattended?",
    promptAr: "ماذا يجب أن تفعل عند ترك مركبتك متوقفة دون مراقبة؟",
    options: [
      { en: "Leave the indicator on", ar: "ترك المؤشر مشغلاً", correct: false },
      { en: "Park near a junction", ar: "الوقوف قرب تقاطع", correct: false },
      { en: "Lock the vehicle and remove the key", ar: "قفل المركبة وإزالة المفتاح", correct: true },
      { en: "Leave a window open", ar: "ترك نافذة مفتوحة", correct: false }
    ],
    keywords: [
      { term: "unattended", ar: "دون مراقبة", explainAr: "ترك المركبة بدون مراقبة." },
      { term: "hint", ar: "تلميح", explainAr: "Securing the vehicle reduces theft risk." }
    ]
  },

  {
    id: "SV-03",
    topic: "safety-vehicle",
    promptEn: "If your vehicle continues to bounce after pressing down on the bodywork, what does this indicate?",
    promptAr: "إذا استمرت المركبة بالاهتزاز بعد الضغط عليها، ماذا يدل ذلك؟",
    options: [
      { en: "Worn tyres", ar: "إطارات بالية", correct: false },
      { en: "Under-inflated tyres", ar: "إطارات منخفضة الضغط", correct: false },
      { en: "Soft ground", ar: "أرض ناعمة", correct: false },
      { en: "Worn shock absorbers", ar: "مساعدين تالفين", correct: true }
    ],
    keywords: [
      { term: "shock absorbers", ar: "المساعدين", explainAr: "أجهزة تمتص الاهتزاز." },
      { term: "hint", ar: "تلميح", explainAr: "Shock absorbers control bouncing and stability." }
    ]
  },

  {
    id: "SV-04",
    topic: "safety-vehicle",
    promptEn: "How is your journey likely to change if you travel outside peak traffic hours?",
    promptAr: "كيف تتغير رحلتك إذا سافرت خارج أوقات الذروة؟",
    options: [
      { en: "More fuel used", ar: "استهلاك وقود أكثر", correct: false },
      { en: "Longer journey", ar: "رحلة أطول", correct: false },
      { en: "Greater danger", ar: "خطر أكبر", correct: false },
      { en: "Fewer delays", ar: "تأخيرات أقل", correct: true }
    ],
    keywords: [
      { term: "peak traffic hours", ar: "أوقات الذروة", explainAr: "الأوقات التي يكون فيها المرور كثيفاً." },
      { term: "hint", ar: "تلميح", explainAr: "Less traffic usually means smoother travel." }
    ]
  },

  {
    id: "SV-05",
    topic: "safety-vehicle",
    promptEn: "What benefit can smooth driving provide?",
    promptAr: "ما الفائدة التي يحققها أسلوب القيادة السلس؟",
    options: [
      { en: "Longer journey times", ar: "أوقات رحلة أطول", correct: false },
      { en: "Increased fuel use", ar: "زيادة استهلاك الوقود", correct: false },
      { en: "Reduced fuel consumption by about 15%", ar: "تقليل استهلاك الوقود بنحو 15%", correct: true },
      { en: "Increased emissions", ar: "زيادة الانبعاثات", correct: false }
    ],
    keywords: [
      { term: "smooth driving", ar: "قيادة سلسة", explainAr: "قيادة بدون تسارع مفاجئ أو فرملة قوية." },
      { term: "hint", ar: "تلميح", explainAr: "Smooth acceleration saves fuel." }
    ]
  },

  {
    id: "SV-06",
    topic: "safety-vehicle",
    promptEn: "Where is a catalytic converter located on a vehicle?",
    promptAr: "أين يوجد المحول الحفاز في المركبة؟",
    options: [
      { en: "Fuel tank", ar: "خزان الوقود", correct: false },
      { en: "Air filter", ar: "فلتر الهواء", correct: false },
      { en: "Cooling system", ar: "نظام التبريد", correct: false },
      { en: "Exhaust system", ar: "نظام العادم", correct: true }
    ],
    keywords: [
      { term: "catalytic converter", ar: "المحول الحفاز", explainAr: "جهاز ينظف غازات العادم." },
      { term: "hint", ar: "تلميح", explainAr: "It treats exhaust gases before release." }
    ]
  },

  {
    id: "SV-07",
    topic: "safety-vehicle",
    promptEn: "Allowing which fluid level to fall too low could cause a crash?",
    promptAr: "انخفاض أي مستوى سائل قد يؤدي إلى حادث؟",
    options: [
      { en: "Antifreeze", ar: "مضاد التجمد", correct: false },
      { en: "Brake fluid", ar: "سائل الفرامل", correct: true },
      { en: "Battery water", ar: "ماء البطارية", correct: false },
      { en: "Fuel", ar: "الوقود", correct: false }
    ],
    keywords: [
      { term: "brake fluid", ar: "سائل الفرامل", explainAr: "سائل حيوي لقوة الفرملة." },
      { term: "hint", ar: "تلميح", explainAr: "Brake fluid is vital for stopping power." }
    ]
  },

  {
    id: "SV-08",
    topic: "safety-vehicle",
    promptEn: "How can you reduce the risk of your vehicle being broken into at night?",
    promptAr: "كيف تقلل خطر سرقة مركبتك ليلاً؟",
    options: [
      { en: "Park in a dark area", ar: "الوقوف في منطقة مظلمة", correct: false },
      { en: "Leave steering unlocked", ar: "ترك التوجيه غير مقفل", correct: false },
      { en: "Park in a well-lit area", ar: "الوقوف في منطقة مضاءة جيداً", correct: true },
      { en: "Park on a quiet road", ar: "الوقوف على طريق هادئ", correct: false }
    ],
    keywords: [
      { term: "well-lit area", ar: "منطقة مضاءة جيداً", explainAr: "منطقة فيها إضاءة جيدة." },
      { term: "hint", ar: "تلميح", explainAr: "Visibility deters thieves." }
    ]
  },

  {
    id: "SV-09",
    topic: "safety-vehicle",
    promptEn: "When must you use parking lights when parked at night?",
    promptAr: "متى يجب استخدام أضواء الوقوف ليلاً؟",
    options: [
      { en: "Near a bus stop", ar: "قرب موقف حافلات", correct: false },
      { en: "Facing oncoming traffic", ar: "مواجهة المرور القادم", correct: false },
      { en: "When the speed limit exceeds 30 mph", ar: "عندما يتجاوز حد السرعة 30 ميل/ساعة", correct: true },
      { en: "On private land", ar: "على أرض خاصة", correct: false }
    ],
    keywords: [
      { term: "parking lights", ar: "أضواء الوقوف", explainAr: "أضواء تستخدم عند الوقوف ليلاً." },
      { term: "hint", ar: "تلميح", explainAr: "Required on higher-speed roads." }
    ]
  },

  {
    id: "SV-10",
    topic: "safety-vehicle",
    promptEn: "How much more fuel is typically used at 70 mph compared to 50 mph?",
    promptAr: "كم يزداد استهلاك الوقود عند 70 مقارنة بـ50 ميل/س؟",
    options: [
      { en: "About 5%", ar: "حوالي 5%", correct: false },
      { en: "About 15%", ar: "حوالي 15%", correct: true },
      { en: "About 75%", ar: "حوالي 75%", correct: false },
      { en: "About 100%", ar: "حوالي 100%", correct: false }
    ],
    keywords: [
      { term: "fuel consumption", ar: "استهلاك الوقود", explainAr: "كمية الوقود المستخدمة." },
      { term: "hint", ar: "تلميح", explainAr: "Higher speeds significantly increase fuel use." }
    ]
  },

  {
    id: "SV-11",
    topic: "safety-vehicle",
    promptEn: "Who is responsible for ensuring children wear seat belts in your car?",
    promptAr: "من المسؤول عن التأكد من ارتداء الأطفال لأحزمة الأمان؟",
    options: [
      { en: "Parents", ar: "الوالدين", correct: false },
      { en: "Front passenger", ar: "الراكب الأمامي", correct: false },
      { en: "The children", ar: "الأطفال", correct: false },
      { en: "The driver", ar: "السائق", correct: true }
    ],
    keywords: [
      { term: "seat belts", ar: "أحزمة الأمان", explainAr: "أحزمة لحماية الركاب." },
      { term: "hint", ar: "تلميح", explainAr: "The driver is legally responsible." }
    ]
  },

  {
    id: "SV-12",
    topic: "safety-vehicle",
    promptEn: "When may you leave your vehicle's engine running while parked?",
    promptAr: "متى يُسمح بترك المحرك يعمل أثناء الوقوف؟",
    options: [
      { en: "Under 5 minutes", ar: "أقل من 5 دقائق", correct: false },
      { en: "Battery issues", ar: "مشاكل البطارية", correct: false },
      { en: "In a 20 mph zone", ar: "في منطقة 20 ميل/ساعة", correct: false },
      { en: "Never when unattended", ar: "أبداً عندما تكون غير مراقبة", correct: true }
    ],
    keywords: [
      { term: "unattended", ar: "غير مراقبة", explainAr: "بدون مراقبة." },
      { term: "hint", ar: "تلميح", explainAr: "Running engines waste fuel and increase risk." }
    ]
  },

  {
    id: "SV-13",
    topic: "safety-vehicle",
    promptEn: "What does fuel-efficient driving help achieve?",
    promptAr: "ماذا تحقق القيادة الاقتصادية؟",
    options: [
      { en: "More emissions", ar: "انبعاثات أكثر", correct: false },
      { en: "Environmental protection and safety", ar: "حماية البيئة والسلامة", correct: true },
      { en: "Engine damage", ar: "تلف المحرك", correct: false },
      { en: "Higher fuel bills", ar: "فواتير وقود أعلى", correct: false }
    ],
    keywords: [
      { term: "fuel-efficient", ar: "اقتصادي في الوقود", explainAr: "استخدام أقل للوقود." },
      { term: "hint", ar: "تلميح", explainAr: "Efficient driving benefits safety and environment." }
    ]
  },

  {
    id: "SV-14",
    topic: "safety-vehicle",
    promptEn: "What's the safest way to leave valuables in your car?",
    promptAr: "ما الطريقة الأكثر أمانًا لترك مقتنيات في السيارة؟",
    options: [
      { en: "In a visible bag", ar: "في حقيبة مرئية", correct: false },
      { en: "Near a school", ar: "قرب مدرسة", correct: false },
      { en: "Locked and out of sight", ar: "مقفلة وغير مرئية", correct: true },
      { en: "Near a bus stop", ar: "قرب موقف حافلات", correct: false }
    ],
    keywords: [
      { term: "valuables", ar: "مقتنيات قيمة", explainAr: "أشياء ثمينة." },
      { term: "hint", ar: "تلميح", explainAr: "Out of sight reduces theft." }
    ]
  },

  {
    id: "SV-15",
    topic: "safety-vehicle",
    promptEn: "What can be damaged by turning the steering wheel while stationary?",
    promptAr: "ما الذي قد يتضرر عند تدوير المقود والسيارة متوقفة؟",
    options: [
      { en: "Engine", ar: "المحرك", correct: false },
      { en: "Gearbox", ar: "صندوق التروس", correct: false },
      { en: "Brakes", ar: "الفرامل", correct: false },
      { en: "Tyres", ar: "الإطارات", correct: true }
    ],
    keywords: [
      { term: "stationary", ar: "متوقفة", explainAr: "السيارة غير متحركة." },
      { term: "hint", ar: "تلميح", explainAr: "Stationary steering stresses tyres." }
    ]
  },

  {
    id: "SV-16",
    topic: "safety-vehicle",
    promptEn: "What document should you remove from your vehicle when leaving it unattended?",
    promptAr: "أي وثيقة يجب إزالتها من السيارة عند تركها؟",
    options: [
      { en: "Owner's manual", ar: "دليل المالك", correct: false },
      { en: "Service record", ar: "سجل الصيانة", correct: false },
      { en: "Dealer details", ar: "تفاصيل التاجر", correct: false },
      { en: "Vehicle registration document", ar: "وثيقة تسجيل المركبة", correct: true }
    ],
    keywords: [
      { term: "registration document", ar: "وثيقة التسجيل", explainAr: "وثيقة تسجيل المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Prevent identity theft." }
    ]
  },

  {
    id: "SV-17",
    topic: "safety-vehicle",
    promptEn: "What is the main purpose of a catalytic converter?",
    promptAr: "ما الغرض الرئيسي من المحول الحفاز؟",
    options: [
      { en: "Reduce fuel use", ar: "تقليل استهلاك الوقود", correct: false },
      { en: "Reduce fire risk", ar: "تقليل خطر الحريق", correct: false },
      { en: "Reduce harmful exhaust gases", ar: "تقليل غازات العادم الضارة", correct: true },
      { en: "Reduce engine wear", ar: "تقليل تآكل المحرك", correct: false }
    ],
    keywords: [
      { term: "catalytic converter", ar: "المحول الحفاز", explainAr: "جهاز ينظف غازات العادم." },
      { term: "hint", ar: "تلميح", explainAr: "It cleans exhaust emissions." }
    ]
  },

  {
    id: "SV-18",
    topic: "safety-vehicle",
    promptEn: "How can you help prevent your car radio from being stolen?",
    promptAr: "كيف تمنع سرقة راديو السيارة؟",
    options: [
      { en: "Park in darkness", ar: "الوقوف في الظلام", correct: false },
      { en: "Leave it on", ar: "تركه مشغلاً", correct: false },
      { en: "Park near junction", ar: "الوقوف قرب تقاطع", correct: false },
      { en: "Use a security-coded radio", ar: "استخدام راديو مشفر", correct: true }
    ],
    keywords: [
      { term: "security-coded", ar: "مشفر", explainAr: "راديو يحتاج كود للعمل." },
      { term: "hint", ar: "تلميح", explainAr: "Security coding deters theft." }
    ]
  },

  {
    id: "SV-19",
    topic: "safety-vehicle",
    promptEn: "How does fuel-efficient driving help protect the environment?",
    promptAr: "كيف تحمي القيادة الاقتصادية البيئة؟",
    options: [
      { en: "More cars", ar: "سيارات أكثر", correct: false },
      { en: "Higher fuel bills", ar: "فواتير وقود أعلى", correct: false },
      { en: "Legal enforcement", ar: "التطبيق القانوني", correct: false },
      { en: "Lower exhaust emissions", ar: "انبعاثات عادم أقل", correct: true }
    ],
    keywords: [
      { term: "exhaust emissions", ar: "انبعاثات العادم", explainAr: "الغازات المنبعثة من المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Less fuel burned means cleaner air." }
    ]
  },

  {
    id: "SV-20",
    topic: "safety-vehicle",
    promptEn: "How should you drive on a road with multiple speed humps?",
    promptAr: "كيف تقود على طريق مليء بالمطبات؟",
    options: [
      { en: "Accelerate between humps", ar: "التسارع بين المطبات", correct: false },
      { en: "Keep maximum speed", ar: "الحفاظ على السرعة القصوى", correct: false },
      { en: "Drive slowly only at school times", ar: "القيادة ببطء فقط في أوقات المدرسة", correct: false },
      { en: "Maintain a reduced speed throughout", ar: "الحفاظ على سرعة مخفضة طوال الوقت", correct: true }
    ],
    keywords: [
      { term: "speed humps", ar: "مطبات السرعة", explainAr: "مطبات على الطريق لإجبار السائقين على التباطؤ." },
      { term: "hint", ar: "تلميح", explainAr: "Consistent low speed improves control." }
    ]
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
    promptEn: "Sometimes you'll see short yellow transverse lines across the carriageway on the approach to a hazard. What are they mainly for?",
    promptAr: "أحياناً ترى خطوطاً صفراء قصيرة عرضية قبل خطر. ما فائدتها الرئيسية؟",
    options: [
      { en: "To show a safe gap between vehicles", ar: " لإظهار مسافة آمنة بين المركبات", correct: false },
      { en: "To keep an area clear", ar: " لإبقاء منطقة خالية", correct: false },
      { en: "To make you more aware of your speed", ar: " لزيادة انتباهك لسرعتك", correct: true },
      { en: "To warn you to change direction", ar: " لتحذيرك لتغيير الاتجاه", correct: false }
    ],
    keywords: [
      { term: "yellow lines", ar: "خطوط صفراء", explainAr: "خطوط صفراء عرضية على الطريق." },
      { term: "hazard approach", ar: "اقتراب من خطر", explainAr: "المنطقة قبل وجود خطر على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "هي مؤشر بصري يساعدك على التخفيف." }
    ]
  },

  {
    id: "VH-10",
    topic: "vehicle-handling",
    promptEn: "Before driving in fog, what should you check first?",
    promptAr: "قبل القيادة في الضباب، ماذا يجب أن تتأكد منه أولاً؟",
    options: [
      { en: "Radiator antifreeze level", ar: "مستوى مانع التجمد", correct: false },
      { en: "A warning triangle is in the car", ar: "وجود مثلث تحذير", correct: false },
      { en: "Windows are clean and all lights work", ar: "نظافة الزجاج وعمل الأضواء", correct: true },
      { en: "A mobile phone is charged", ar: "شحن الهاتف", correct: false }
    ],
    keywords: [
      { term: "fog", ar: "ضباب", explainAr: "ظروف رؤية ضعيفة." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على الرؤية بوضوح." },
      { term: "hint", ar: "تلميح", explainAr: "الرؤية وأن تُرى أمران أساسيان في الضباب." }
    ]
  },

  {
    id: "VH-11",
    topic: "vehicle-handling",
    promptEn: "If you must park on the road in fog, which lights should you leave on?",
    promptAr: "إذا اضطررت للوقوف على الطريق في الضباب، أي أضواء تتركها مشغّلة؟",
    options: [
      { en: "Parking/sidelights", ar: "أضواء الوقوف/الجانبية", correct: true },
      { en: "Dipped headlights and fog lights", ar: "الأضواء المنخفضة وأضواء الضباب", correct: false },
      { en: "Dipped headlights only", ar: "الأضواء المنخفضة فقط", correct: false },
      { en: "Main beam headlights", ar: "الضوء العالي", correct: false }
    ],
    keywords: [
      { term: "parking lights", ar: "أضواء الوقوف", explainAr: "أضواء جانبية تُستخدم عند الوقوف." },
      { term: "fog parking", ar: "الوقوف في الضباب", explainAr: "الوقوف على الطريق في ظروف ضبابية." },
      { term: "hint", ar: "تلميح", explainAr: "السيارة المتوقفة تُظهر أضواء الوقوف دون إبهار الآخرين." }
    ]
  },

  {
    id: "VH-12",
    topic: "vehicle-handling",
    promptEn: "You're driving through a series of road humps. What's the safest approach?",
    promptAr: "تقود عبر سلسلة مطبات. ما الأسلوب الأكثر أماناً؟",
    options: [
      { en: "Brake hard at each hump", ar: "فرملة قوية عند كل مطب", correct: false },
      { en: "Speed up between each hump", ar: "زد السرعة بين المطبات", correct: false },
      { en: "Keep a reduced, steady speed through the whole stretch", ar: "حافظ على سرعة منخفضة ثابتة طوال المقطع", correct: true },
      { en: "Use cruise control", ar: "استخدم مثبت السرعة", correct: false }
    ],
    keywords: [
      { term: "road humps", ar: "مطبات", explainAr: "مطبات على الطريق لإجبار السائقين على تخفيض السرعة." },
      { term: "steady speed", ar: "سرعة ثابتة", explainAr: "السرعة المناسبة للقيادة بأمان." },
      { term: "hint", ar: "تلميح", explainAr: "القيادة السلسة تحافظ على التحكم والراحة." }
    ]
  },

  {
    id: "VH-13",
    topic: "vehicle-handling",
    promptEn: "On a windy motorway, what should you watch for when overtaking a high-sided vehicle?",
    promptAr: "على طريق سريع عاصف، ماذا تنتبه له عند تجاوز مركبة عالية؟",
    options: [
      { en: "Increase speed", ar: "زد السرعة", correct: false },
      { en: "A sudden gust as you pass", ar: "هبّة ريح مفاجئة أثناء التجاوز", correct: true },
      { en: "Drive alongside closely", ar: "قد بمحاذاة قريبة", correct: false },
      { en: "Expect normal conditions", ar: "توقّع ظروف عادية", correct: false }
    ],
    keywords: [
      { term: "windy motorway", ar: "طريق سريع عاصف", explainAr: "طريق سريع مع رياح قوية." },
      { term: "high-sided vehicle", ar: "مركبة عالية", explainAr: "مركبة ذات جوانب عالية مثل الشاحنات." },
      { term: "hint", ar: "تلميح", explainAr: "اضطراب الرياح قد يدفع المركبة جانبياً." }
    ]
  },

  {
    id: "VH-14",
    topic: "vehicle-handling",
    promptEn: "When driving downhill, what helps you keep control of speed without overheating brakes?",
    promptAr: "عند النزول، ما الذي يساعدك على التحكم بالسرعة دون تسخين الفرامل؟",
    options: [
      { en: "Coast in neutral", ar: "القيادة على الفاضي", correct: false },
      { en: "Use a lower gear (engine braking)", ar: "استخدام غيار منخفض (فرملة المحرك)", correct: true },
      { en: "Ride the clutch", ar: "إبقاء الدبرياج نصف مضغوط", correct: false },
      { en: "Keep braking hard continuously", ar: "فرملة قوية باستمرار", correct: false }
    ],
    keywords: [
      { term: "downhill", ar: "النزول", explainAr: "القيادة نزولاً على منحدر." },
      { term: "engine braking", ar: "فرملة المحرك", explainAr: "استخدام المحرك للمساعدة في كبح السرعة." },
      { term: "hint", ar: "تلميح", explainAr: "فرملة المحرك تساعد على التحكم بالسرعة بأمان." }
    ]
  },

  {
    id: "VH-15",
    topic: "vehicle-handling",
    promptEn: "You must travel in foggy conditions. What should you do?",
    promptAr: "عليك السفر في الضباب. ماذا تفعل؟",
    options: [
      { en: "Follow tail lights closely", ar: "اتبع أضواء الخلفية عن قرب", correct: false },
      { en: "Avoid dipped headlights", ar: "تجنب الأضواء المنخفضة", correct: false },
      { en: "Allow extra time for the journey", ar: "اترك وقتاً إضافياً للرحلة", correct: true },
      { en: "Keep only a 2-second gap", ar: "اترك ثانيتين فقط", correct: false }
    ],
    keywords: [
      { term: "foggy conditions", ar: "ظروف ضبابية", explainAr: "ظروف رؤية ضعيفة بسبب الضباب." },
      { term: "journey time", ar: "وقت الرحلة", explainAr: "الوقت اللازم لإكمال الرحلة." },
      { term: "hint", ar: "تلميح", explainAr: "الضباب يقلل السرعة والرؤية—خطط لوقت إضافي." }
    ]
  },

  {
    id: "VH-16",
    topic: "vehicle-handling",
    promptEn: "When may you stop inside a yellow box junction?",
    promptAr: "متى يُسمح لك بالتوقف داخل المربع الأصفر؟",
    options: [
      { en: "When you're queuing straight ahead", ar: "عند الطابور للاتجاه للأمام", correct: false },
      { en: "When approaching a crossing", ar: "عند الاقتراب من معبر", correct: false },
      { en: "When approaching a zebra crossing", ar: "عند الاقتراب من زيبرا", correct: false },
      { en: "When waiting to turn right and oncoming traffic blocks your exit", ar: "عند الانعطاف يميناً ويمنعك المرور المقابل من الخروج", correct: true }
    ],
    keywords: [
      { term: "yellow box junction", ar: "مربع أصفر", explainAr: "منطقة صفراء على الطريق يجب إبقاؤها خالية." },
      { term: "turning right", ar: "الانعطاف يميناً", explainAr: "تغيير الاتجاه إلى اليمين." },
      { term: "hint", ar: "تلميح", explainAr: "ادخل فقط إذا كان مخرجك خالياً (استثناء الانعطاف يميناً)." }
    ]
  },

  {
    id: "VH-17",
    topic: "vehicle-handling",
    promptEn: "When overtaking at night, why should you be extra cautious?",
    promptAr: "لماذا يجب أن تكون أكثر حذراً عند التجاوز ليلاً؟",
    options: [
      { en: "Oncoming headlights make it easier", ar: "أضواء المقابل تسهّل الرؤية", correct: false },
      { en: "You can't see as far ahead as in daylight", ar: "لا ترى بعيداً كما في النهار", correct: true },
      { en: "Horn use is required", ar: "البوق مطلوب", correct: false },
      { en: "Overtaking is always banned at night", ar: "التجاوز ممنوع دائماً ليلاً", correct: false }
    ],
    keywords: [
      { term: "night overtaking", ar: "التجاوز ليلاً", explainAr: "التجاوز في الظلام يتطلب حذراً إضافياً." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على الرؤية في الظلام." },
      { term: "hint", ar: "تلميح", explainAr: "ضعف الرؤية يزيد وقت اتخاذ القرار." }
    ]
  },

  {
    id: "VH-18",
    topic: "vehicle-handling",
    promptEn: "At night you're dazzled by oncoming headlights. What should you do?",
    promptAr: "ليلاً تُبهرك أضواء مركبة قادمة. ماذا تفعل؟",
    options: [
      { en: "Pull down your sun visor", ar: "أنزل حاجب الشمس", correct: false },
      { en: "Slow down or stop if necessary", ar: "خفف السرعة أو توقف إذا لزم", correct: true },
      { en: "Flash main beam", ar: "ومض الضوء العالي", correct: false },
      { en: "Shade eyes with your hand", ar: "غطّ عينيك بيدك", correct: false }
    ],
    keywords: [
      { term: "dazzled", ar: "مبهر", explainAr: "التعرض لضوء قوي يسبب العمى المؤقت." },
      { term: "oncoming headlights", ar: "أضواء قادمة", explainAr: "أضواء المركبات القادمة من الاتجاه المعاكس." },
      { term: "hint", ar: "تلميح", explainAr: "لا تنظر للأضواء مباشرة—خفف السرعة وتحكم بالمركبة." }
    ]
  },

  {
    id: "VH-19",
    topic: "vehicle-handling",
    promptEn: "After driving in fog, what must you do when visibility improves?",
    promptAr: "بعد القيادة في الضباب، ماذا يجب أن تفعل عند تحسن الرؤية؟",
    options: [
      { en: "Switch off fog lights", ar: "أطفئ أضواء الضباب", correct: true },
      { en: "Keep rear fog lights on", ar: "أبقِ ضباب الخلفي شغال", correct: false },
      { en: "Keep front fog lights on", ar: "أبقِ الأمامية شغالة", correct: false },
      { en: "Leave them on just in case", ar: "اتركها احتياطاً", correct: false }
    ],
    keywords: [
      { term: "fog lights", ar: "أضواء الضباب", explainAr: "أضواء خاصة للاستخدام في الضباب." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على الرؤية بوضوح." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب قد تُبهِر الآخرين عند تحسن الرؤية." }
    ]
  },

  {
    id: "VH-20",
    topic: "vehicle-handling",
    promptEn: "Why are rear fog lights fitted to vehicles?",
    promptAr: "لماذا يتم تزويد المركبات بأضواء الضباب الخلفية؟",
    options: [
      { en: "To improve visibility at high speed", ar: "لتحسين الرؤية عند السرعات العالية", correct: false },
      { en: "To show the vehicle has broken down", ar: "للإشارة إلى أن المركبة تعطلت", correct: false },
      { en: "To make the vehicle more visible in thick fog", ar: "لجعل المركبة أكثر وضوحاً في الضباب الكثيف", correct: true },
      { en: "To warn drivers behind to keep back", ar: "لتحذير السائقين بالخلف للابتعاد", correct: false }
    ],
    keywords: [
      { term: "rear fog lights", ar: "أضواء الضباب الخلفية", explainAr: "أضواء خلفية قوية تُستخدم في الضباب الكثيف." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية المركبات والمستخدمين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "تُستخدم أضواء الضباب الخلفية فقط عند ضعف الرؤية الشديد." }
    ]
  },

  {
    id: "VH-21",
    topic: "vehicle-handling",
    promptEn: "Why is it dangerous to leave rear fog lights on once fog has cleared?",
    promptAr: "لماذا يُعد ترك أضواء الضباب الخلفية مشغلة بعد زوال الضباب خطيراً؟",
    options: [
      { en: "They can be mistaken for brake lights", ar: "قد تُخطأ على أنها أضواء فرامل", correct: true },
      { en: "They damage the electrical system", ar: "تُتلف النظام الكهربائي", correct: false },
      { en: "They reduce engine performance", ar: "تقلل أداء المحرك", correct: false },
      { en: "They cause tyre wear", ar: "تسبب تآكل الإطارات", correct: false }
    ],
    keywords: [
      { term: "rear fog lights", ar: "أضواء الضباب الخلفية", explainAr: "أضواء خلفية قوية للاستخدام في الضباب الكثيف." },
      { term: "brake lights", ar: "أضواء الفرامل", explainAr: "أضواء خلفية تشتعل عند الضغط على الفرامل." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب الخلفية أقوى من أضواء الخلف العادية." }
    ]
  },

  {
    id: "VH-22",
    topic: "vehicle-handling",
    promptEn: "What is the main purpose of traffic-calming measures?",
    promptAr: "ما الهدف الرئيسي من إجراءات تهدئة المرور؟",
    options: [
      { en: "To reduce aggressive driving", ar: "للحد من القيادة العدوانية", correct: false },
      { en: "To make parking easier", ar: "لتسهيل الوقوف", correct: false },
      { en: "To slow vehicles down", ar: "إبطاء حركة المركبات", correct: true },
      { en: "To improve overtaking", ar: "لتحسين التجاوز", correct: false }
    ],
    keywords: [
      { term: "traffic-calming", ar: "تهدئة المرور", explainAr: "إجراءات تصمم لإبطاء حركة المرور." },
      { term: "speed control", ar: "التحكم بالسرعة", explainAr: "السيطرة على سرعة المركبات." },
      { term: "hint", ar: "تلميح", explainAr: "تهدئة المرور تهدف للتحكم بالسرعة." }
    ]
  },

  {
    id: "VH-23",
    topic: "vehicle-handling",
    promptEn: "Why is travelling in neutral for long distances poor driving practice?",
    promptAr: "لماذا تُعد القيادة على الغيار الفارغ لمسافات طويلة أسلوباً سيئاً؟",
    options: [
      { en: "It increases skidding risk", ar: "يزيد خطر الانزلاق", correct: false },
      { en: "The engine may stall", ar: "قد يتوقف المحرك", correct: false },
      { en: "You lose engine braking", ar: "تفقد فرملة المحرك", correct: true },
      { en: "Fuel use increases", ar: "يزداد استهلاك الوقود", correct: false }
    ],
    keywords: [
      { term: "neutral gear", ar: "الغيار الفارغ", explainAr: "وضع المحرك حيث لا يوجد اتصال بالعجلات." },
      { term: "engine braking", ar: "فرملة المحرك", explainAr: "استخدام مقاومة المحرك لإبطاء المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "فرملة المحرك تساعد على التحكم بالمركبة." }
    ]
  },

  {
    id: "VH-24",
    topic: "vehicle-handling",
    promptEn: "When overtaking at night, what is essential to avoid?",
    promptAr: "عند التجاوز ليلاً، ما الذي يجب تجنبه؟",
    options: [
      { en: "Using headlights", ar: "استخدام الأضواء", correct: false },
      { en: "Dazzling other road users", ar: "إبهار مستخدمي الطريق", correct: true },
      { en: "Changing gear", ar: "تغيير الغيار", correct: false },
      { en: "Slowing down", ar: "تخفيف السرعة", correct: false }
    ],
    keywords: [
      { term: "overtaking at night", ar: "التجاوز ليلاً", explainAr: "المرور بجانب مركبة أخرى أثناء الليل." },
      { term: "dazzling", ar: "إبهار", explainAr: "استخدام أضواء قوية تُعمي السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "القيادة ليلاً تتطلب انتباهاً واحتراماً أكبر." }
    ]
  },

  {
    id: "VH-25",
    topic: "vehicle-handling",
    promptEn: "On an icy road, how far should you stay behind the vehicle in front?",
    promptAr: "على طريق جليدي، كم يجب أن تكون المسافة مع المركبة أمامك؟",
    options: [
      { en: "4 times normal distance", ar: "أربعة أضعاف المسافة العادية", correct: false },
      { en: "6 times normal distance", ar: "ستة أضعاف", correct: false },
      { en: "8 times normal distance", ar: "ثمانية أضعاف", correct: false },
      { en: "10 times normal distance", ar: "عشرة أضعاف", correct: true }
    ],
    keywords: [
      { term: "icy road", ar: "طريق جليدي", explainAr: "طريق مغطى بالجليد أو الثلج." },
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة اللازمة للتوقف بأمان." },
      { term: "hint", ar: "تلميح", explainAr: "مسافة التوقف تزداد كثيراً على الجليد." }
    ]
  },

  {
    id: "VH-26",
    topic: "vehicle-handling",
    promptEn: "Why should you avoid coasting downhill?",
    promptAr: "لماذا يجب تجنب القيادة على الفاضي أثناء النزول؟",
    options: [
      { en: "It uses more fuel", ar: "يستهلك وقوداً أكثر", correct: false },
      { en: "The engine may overheat", ar: "قد يسخن المحرك", correct: false },
      { en: "The vehicle can gain speed too easily", ar: "قد تزداد السرعة بشكل غير مسيطر عليه", correct: true },
      { en: "Tyres wear faster", ar: "تتآكل الإطارات أسرع", correct: false }
    ],
    keywords: [
      { term: "coasting", ar: "القيادة على الفاضي", explainAr: "القيادة مع المحرك في وضع الحياد." },
      { term: "downhill", ar: "نزول", explainAr: "القيادة على منحدر نزولي." },
      { term: "hint", ar: "تلميح", explainAr: "استخدم فرملة المحرك للنزول الآمن." }
    ]
  },

  {
    id: "VH-27",
    topic: "vehicle-handling",
    promptEn: "What is the effect of using rear fog lights in clear conditions?",
    promptAr: "ما تأثير استخدام أضواء الضباب الخلفية في ظروف واضحة؟",
    options: [
      { en: "Improves towing safety", ar: "يحسن السحب", correct: false },
      { en: "Warns large vehicles", ar: "يحذر المركبات الكبيرة", correct: false },
      { en: "Dazzles drivers behind", ar: "يُبهِر السائقين بالخلف", correct: true },
      { en: "Keeps traffic back", ar: "يُبقي المرور بعيداً", correct: false }
    ],
    keywords: [
      { term: "rear fog lights", ar: "أضواء الضباب الخلفية", explainAr: "أضواء خلفية قوية للاستخدام في الضباب الكثيف." },
      { term: "clear conditions", ar: "ظروف واضحة", explainAr: "ظروف رؤية جيدة بدون ضباب." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب الخلفية شديدة السطوع." }
    ]
  },

  {
    id: "VH-28",
    topic: "vehicle-handling",
    promptEn: "When driving on a slippery surface, what technique helps prevent wheelspin?",
    promptAr: "عند القيادة على سطح زلق، ما الأسلوب الذي يمنع دوران العجلات؟",
    options: [
      { en: "Use a low gear and accelerate hard", ar: "غيار منخفض وتسارع قوي", correct: false },
      { en: "Use a high gear and gentle acceleration", ar: "غيار أعلى وتسارع لطيف", correct: true },
      { en: "Brake firmly", ar: "فرملة قوية", correct: false },
      { en: "Turn steering sharply", ar: "توجيه حاد", correct: false }
    ],
    keywords: [
      { term: "slippery surface", ar: "سطح زلق", explainAr: "سطح طريق يقلل من تماسك الإطارات." },
      { term: "wheelspin", ar: "دوران العجلات", explainAr: "دوران العجلات بدون حركة للأمام." },
      { term: "hint", ar: "تلميح", explainAr: "التحكم اللطيف يحافظ على التماسك." }
    ]
  },

  {
    id: "VH-29",
    topic: "vehicle-handling",
    promptEn: "Which lights must you use on a well-lit motorway at night?",
    promptAr: "أي أضواء يجب استخدامها على طريق سريع مُضاء ليلاً؟",
    options: [
      { en: "Sidelights only", ar: "الأضواء الجانبية فقط", correct: false },
      { en: "Headlights", ar: "المصابيح الأمامية", correct: true },
      { en: "Rear fog lights", ar: "أضواء الضباب الخلفية", correct: false },
      { en: "Front fog lights", ar: "أضواء الضباب الأمامية", correct: false }
    ],
    keywords: [
      { term: "motorway", ar: "طريق سريع", explainAr: "طريق متعدد المسارات بسرعة عالية." },
      { term: "headlights", ar: "المصابيح الأمامية", explainAr: "أضواء أمامية للرؤية أثناء الليل." },
      { term: "hint", ar: "تلميح", explainAr: "المصابيح الأمامية تضمن الرؤية والظهور." }
    ]
  },

  {
    id: "VH-30",
    topic: "vehicle-handling",
    promptEn: "What is a rumble device designed to do?",
    promptAr: "ما الهدف من جهاز الاهتزاز على الطريق؟",
    options: [
      { en: "Give directions", ar: "إعطاء اتجاهات", correct: false },
      { en: "Prevent animals escaping", ar: "منع هروب الحيوانات", correct: false },
      { en: "Alert you to a hazard", ar: "تنبيهك لوجود خطر", correct: true },
      { en: "Check tyre pressure", ar: "فحص ضغط الإطارات", correct: false }
    ],
    keywords: [
      { term: "rumble device", ar: "جهاز اهتزاز", explainAr: "جهاز على الطريق يهتز أو يصدر صوتاً لتحذير السائقين." },
      { term: "hazard warning", ar: "تحذير خطر", explainAr: "تنبيه لوجود خطر محتمل على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "أجهزة الاهتزاز تحذّر السائق عبر الاهتزاز أو الصوت." }
    ]
  },

  {
    id: "VH-31",
    topic: "vehicle-handling",
    promptEn: "When do you feel engine braking most clearly?",
    promptAr: "متى تشعر بتأثير فرملة المحرك بشكل أوضح؟",
    options: [
      { en: "When you rely only on the parking brake", ar: "عند الاعتماد فقط على فرامل اليد", correct: false },
      { en: "When you select neutral", ar: "عند وضع الغيار على الحياد (نيوترال)", correct: false },
      { en: "When you change down to a lower gear", ar: "عند الانتقال إلى غيار أقل", correct: true },
      { en: "When you change up to a higher gear", ar: "عند الانتقال إلى غيار أعلى", correct: false }
    ],
    keywords: [
      { term: "engine braking", ar: "فرملة المحرك", explainAr: "استخدام المحرك لإبطاء المركبة بدلاً من الفرامل." },
      { term: "lower gear", ar: "غيار أقل", explainAr: "غيار منخفض يزيد من قوة فرملة المحرك." },
      { term: "hint", ar: "تلميح", explainAr: "فرملة المحرك تكون أقوى عند استخدام غيار أقل." }
    ]
  },

  {
    id: "VH-32",
    topic: "vehicle-handling",
    promptEn: "In very heavy rain, what happens to your overall stopping distance?",
    promptAr: "في المطر الغزير جداً، ماذا يحدث لمسافة التوقف الإجمالية؟",
    options: [
      { en: "It is likely to be longer (often around double)", ar: "غالباً تصبح أطول (وغالباً تتضاعف تقريباً)", correct: true },
      { en: "It is likely to be shorter", ar: "غالباً تصبح أقصر", correct: false },
      { en: "It becomes ten times longer", ar: "تصبح أطول بعشرة أضعاف", correct: false },
      { en: "It stays the same", ar: "تبقى كما هي", correct: false }
    ],
    keywords: [
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة الكلية اللازمة للتوقف من لحظة رؤية الخطر." },
      { term: "heavy rain", ar: "مطر غزير", explainAr: "مطر شديد يقلل من تماسك الإطارات." },
      { term: "hint", ar: "تلميح", explainAr: "الطرق المبللة تقلل التماسك وتزيد مسافة التوقف." }
    ]
  },

  {
    id: "VH-33",
    topic: "vehicle-handling",
    promptEn: "Why should you slow down when driving in fog?",
    promptAr: "لماذا يجب أن تخفف السرعة عند القيادة في الضباب؟",
    options: [
      { en: "Because brakes work less effectively", ar: "لأن الفرامل تعمل بشكل أضعف", correct: false },
      { en: "Because headlights always dazzle you", ar: "لأن الأضواء دائماً تُبهرك", correct: false },
      { en: "Because the engine warms up slower", ar: "لأن المحرك يسخن ببطء", correct: false },
      { en: "Because you can't see hazards as early", ar: "لأن رؤية المخاطر تصبح أصعب ومتأخرة", correct: true }
    ],
    keywords: [
      { term: "fog", ar: "ضباب", explainAr: "ظروف طقس تقلل الرؤية بشكل كبير." },
      { term: "visibility", ar: "الرؤية", explainAr: "القدرة على رؤية الطريق والمخاطر." },
      { term: "hint", ar: "تلميح", explainAr: "في الضباب يجب أن تتمكن من التوقف ضمن المسافة التي تراها." }
    ]
  },

  {
    id: "VH-34",
    topic: "vehicle-handling",
    promptEn: "After driving through deep water or floodwater, what should you do soon after?",
    promptAr: "بعد القيادة عبر مياه عميقة أو سيول، ماذا يجب أن تفعل بعد ذلك مباشرة؟",
    options: [
      { en: "Test your brakes gently to check they're working", ar: "اختبر الفرامل بلطف للتأكد أنها تعمل", correct: true },
      { en: "Accelerate hard to dry the tyres", ar: "سرّع بقوة لتجفيف الإطارات", correct: false },
      { en: "Avoid using brakes for several miles", ar: "تجنب استخدام الفرامل لعدة أميال", correct: false },
      { en: "Stop for an hour to let brakes dry", ar: "توقف ساعة كاملة لتجف الفرامل", correct: false }
    ],
    keywords: [
      { term: "deep water", ar: "مياه عميقة", explainAr: "مياه على الطريق قد تؤثر على الفرامل." },
      { term: "brake test", ar: "اختبار الفرامل", explainAr: "فحص الفرامل للتأكد من عملها بشكل صحيح." },
      { term: "hint", ar: "تلميح", explainAr: "الماء قد يضعف الفرملة مؤقتاً—تحقق بأمان." }
    ]
  },

  {
    id: "VH-35",
    topic: "vehicle-handling",
    promptEn: "On a motorway at night, if vehicles are ahead of you, which headlights should you normally use?",
    promptAr: "على الطريق السريع ليلاً، إذا كانت هناك مركبات أمامك، أي أضواء تستخدم عادة؟",
    options: [
      { en: "Front fog lights", ar: "أضواء الضباب الأمامية", correct: false },
      { en: "Main beam", ar: "الضوء العالي", correct: false },
      { en: "Sidelights only", ar: "أضواء جانبية فقط", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true }
    ],
    keywords: [
      { term: "dipped headlights", ar: "الأضواء المنخفضة", explainAr: "أضواء منخفضة لا تُبهِر السائقين الآخرين." },
      { term: "motorway", ar: "طريق سريع", explainAr: "طريق متعدد المسارات للسرعة العالية." },
      { term: "hint", ar: "تلميح", explainAr: "استخدم الضوء المنخفض لتجنب إبهار الآخرين." }
    ]
  },

  {
    id: "VH-36",
    topic: "vehicle-handling",
    promptEn: "What colour reflective studs mark the left edge of a motorway?",
    promptAr: "ما لون العواكس التي تحدد الحافة اليسرى للطريق السريع؟",
    options: [
      { en: "Green", ar: "أخضر", correct: false },
      { en: "Amber", ar: "أصفر", correct: false },
      { en: "Red", ar: "أحمر", correct: true },
      { en: "White", ar: "أبيض", correct: false }
    ],
    keywords: [
      { term: "reflective studs", ar: "عواكس", explainAr: "علامات عاكسة على الطريق لتحديد المسارات." },
      { term: "motorway edge", ar: "حافة الطريق السريع", explainAr: "حافة الطريق السريع قرب الكتف." },
      { term: "hint", ar: "تلميح", explainAr: "الأحمر = الحافة اليسرى (قرب كتف الطريق)." }
    ]
  },

  {
    id: "VH-37",
    topic: "vehicle-handling",
    promptEn: "Which factor most affects your stopping distance?",
    promptAr: "أي عامل يؤثر أكثر على مسافة التوقف؟",
    options: [
      { en: "The posted speed limit", ar: "حد السرعة المكتوب", correct: false },
      { en: "Street lighting", ar: "إنارة الشارع", correct: false },
      { en: "Time of day", ar: "وقت اليوم", correct: false },
      { en: "Tyre condition and grip", ar: "حالة الإطارات والتماسك", correct: true }
    ],
    keywords: [
      { term: "stopping distance", ar: "مسافة التوقف", explainAr: "المسافة اللازمة للتوقف بشكل كامل." },
      { term: "tyre grip", ar: "تماسك الإطارات", explainAr: "قدرة الإطارات على التمسك بالطريق." },
      { term: "hint", ar: "تلميح", explainAr: "الإطارات البالية تقلل التماسك وتزيد مسافة التوقف." }
    ]
  },

  {
    id: "VH-38",
    topic: "vehicle-handling",
    promptEn: "After heavy snowfall, what should you consider before starting a journey?",
    promptAr: "بعد تساقط كثيف للثلوج، ماذا يجب أن تفكر قبل بدء الرحلة؟",
    options: [
      { en: "Fitting an amber beacon", ar: "تركيب ضوء أصفر وامض", correct: false },
      { en: "Driving without a seatbelt", ar: "القيادة دون حزام", correct: false },
      { en: "Wearing sunglasses", ar: "ارتداء نظارات شمسية", correct: false },
      { en: "Whether the journey is essential", ar: "هل الرحلة ضرورية فعلاً", correct: true }
    ],
    keywords: [
      { term: "heavy snowfall", ar: "تساقط كثيف للثلوج", explainAr: "ظروف طقس صعبة مع ثلوج كثيفة." },
      { term: "essential journey", ar: "رحلة ضرورية", explainAr: "رحلة مهمة وليست اختيارية." },
      { term: "hint", ar: "تلميح", explainAr: "لا تقُد في الظروف القاسية إلا إذا كانت الرحلة ضرورية." }
    ]
  },

  {
    id: "VH-39",
    topic: "vehicle-handling",
    promptEn: "When must you use dipped headlights during the day?",
    promptAr: "متى يجب استخدام الأضواء المنخفضة نهاراً؟",
    options: [
      { en: "All the time", ar: "طوال الوقت", correct: false },
      { en: "On narrow streets only", ar: "فقط في الشوارع الضيقة", correct: false },
      { en: "When visibility is poor", ar: "عند ضعف الرؤية", correct: true },
      { en: "When parking", ar: "عند الوقوف", correct: false }
    ],
    keywords: [
      { term: "dipped headlights", ar: "الأضواء المنخفضة", explainAr: "أضواء منخفضة للرؤية في ظروف صعبة." },
      { term: "poor visibility", ar: "ضعف الرؤية", explainAr: "ظروف تقلل من القدرة على الرؤية بوضوح." },
      { term: "hint", ar: "تلميح", explainAr: "ضعف الرؤية يشمل المطر الغزير والضباب والرذاذ." }
    ]
  },

  {
    id: "VH-40",
    topic: "vehicle-handling",
    promptEn: "Daylight visibility is poor but not seriously reduced. Which lights should you use?",
    promptAr: "الرؤية نهاراً ضعيفة لكن ليست شديدة الانخفاض. أي أضواء تستخدم؟",
    options: [
      { en: "Headlights and fog lights", ar: "الأضواء الأمامية وأضواء الضباب", correct: false },
      { en: "Front fog lights", ar: "أضواء الضباب الأمامية", correct: false },
      { en: "Dipped headlights", ar: "الأضواء المنخفضة", correct: true },
      { en: "Rear fog lights", ar: "أضواء الضباب الخلفية", correct: false }
    ],
    keywords: [
      { term: "poor visibility", ar: "ضعف الرؤية", explainAr: "رؤية محدودة لكن ليست شديدة الانخفاض." },
      { term: "fog lights", ar: "أضواء الضباب", explainAr: "أضواء قوية للرؤية في الضباب الكثيف." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب تُستخدم فقط عند انخفاض شديد في الرؤية." }
    ]
  },

  {
    id: "VH-41",
    topic: "vehicle-handling",
    promptEn: "Why might drivers fit snow chains to their wheels?",
    promptAr: "لماذا قد يركّب السائق سلاسل ثلج على العجلات؟",
    options: [
      { en: "To protect the road surface", ar: "لحماية سطح الطريق", correct: false },
      { en: "To reduce tyre wear", ar: "لتقليل تآكل الإطارات", correct: false },
      { en: "To reduce skidding in deep snow", ar: "لتقليل الانزلاق في الثلج العميق", correct: true },
      { en: "To stop brakes locking", ar: "لمنع انغلاق الفرامل", correct: false }
    ],
    keywords: [
      { term: "snow chains", ar: "سلاسل ثلج", explainAr: "سلاسل معدنية تُركّب على الإطارات لزيادة التماسك." },
      { term: "deep snow", ar: "ثلج عميق", explainAr: "طبقة سميكة من الثلج على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "السلاسل تزيد التماسك على الثلج والجليد." }
    ]
  },

  {
    id: "VH-42",
    topic: "vehicle-handling",
    promptEn: "When are front fog lights allowed to be used?",
    promptAr: "متى يُسمح باستخدام أضواء الضباب الأمامية؟",
    options: [
      { en: "When visibility is seriously reduced", ar: "عندما تكون الرؤية منخفضة جداً", correct: true },
      { en: "When fitted above the bumper", ar: "إذا كانت مركبة فوق الصدام", correct: false },
      { en: "When they are dimmer than headlights", ar: "إذا كانت أضعف من المصابيح", correct: false },
      { en: "When using a horn warning", ar: "عند استخدام البوق", correct: false }
    ],
    keywords: [
      { term: "front fog lights", ar: "أضواء الضباب الأمامية", explainAr: "أضواء قوية للرؤية في الضباب الكثيف." },
      { term: "seriously reduced visibility", ar: "انخفاض شديد في الرؤية", explainAr: "رؤية محدودة جداً (عادة أقل من 100 متر)." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب ليست للمطر العادي أو الليالي الصافية." }
    ]
  },

  {
    id: "VH-43",
    topic: "vehicle-handling",
    promptEn: "You're using front fog lights and the fog clears. What should you do?",
    promptAr: "كنت تستخدم أضواء الضباب الأمامية ثم زال الضباب. ماذا تفعل؟",
    options: [
      { en: "Keep them on if others use lights", ar: "اتركها تعمل إذا كان الآخرون يشغلون أضواءهم", correct: false },
      { en: "Switch them off if visibility is good", ar: "أطفئها طالما أن الرؤية جيدة", correct: true },
      { en: "Flash them to warn others", ar: "ومض بها للتحذير", correct: false },
      { en: "Use them instead of headlights", ar: "استخدمها بدل المصابيح الأمامية", correct: false }
    ],
    keywords: [
      { term: "fog clears", ar: "زال الضباب", explainAr: "تحسّنت الرؤية وزال الضباب." },
      { term: "switch off", ar: "إطفاء", explainAr: "إيقاف تشغيل الأضواء عندما لا تكون ضرورية." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب قد تُبهِر عند تحسن الرؤية." }
    ]
  },

  {
    id: "VH-44",
    topic: "vehicle-handling",
    promptEn: "Why should you switch off rear fog lights once fog has cleared?",
    promptAr: "لماذا يجب إطفاء أضواء الضباب الخلفية بعد زوال الضباب؟",
    options: [
      { en: "To help headlights work", ar: "لمساعدة المصابيح الأمامية", correct: false },
      { en: "To prevent battery drain only", ar: "فقط لمنع نفاد البطارية", correct: false },
      { en: "To avoid engine power loss", ar: "لمنع ضعف المحرك", correct: false },
      { en: "To prevent dazzling drivers behind", ar: "لمنع إبهار السائقين خلفك", correct: true }
    ],
    keywords: [
      { term: "rear fog lights", ar: "أضواء الضباب الخلفية", explainAr: "أضواء قوية في الخلف للرؤية في الضباب الكثيف." },
      { term: "dazzling", ar: "إبهار", explainAr: "إزعاج السائقين الآخرين بأضواء قوية." },
      { term: "hint", ar: "تلميح", explainAr: "أضواء الضباب الخلفية قوية وقد تزعج الآخرين." }
    ]
  },

  {
    id: "VH-45",
    topic: "vehicle-handling",
    promptEn: "How can you use the engine to help control your speed?",
    promptAr: "كيف يمكنك استخدام المحرك للمساعدة في التحكم بالسرعة؟",
    options: [
      { en: "By changing to a lower gear", ar: "بالانتقال إلى غيار أقل", correct: true },
      { en: "By selecting reverse gear", ar: "بوضع الرجوع للخلف", correct: false },
      { en: "By changing to a higher gear", ar: "بالانتقال إلى غيار أعلى", correct: false },
      { en: "By selecting neutral", ar: "بوضع الغيار على الحياد", correct: false }
    ],
    keywords: [
      { term: "engine braking", ar: "فرملة المحرك", explainAr: "استخدام المحرك لإبطاء المركبة." },
      { term: "speed control", ar: "التحكم بالسرعة", explainAr: "إدارة سرعة المركبة بشكل آمن." },
      { term: "hint", ar: "تلميح", explainAr: "الغيار الأقل يزيد تأثير فرملة المحرك." }
    ]
  },

  // --- MOTORWAY (EXTRA) ---

  {
    id: "MW-11",
    topic: "motorway-driving",
    promptEn: "Overhead signs show a red cross above your lane. What must you do?",
    promptAr: "ماذا يجب أن تفعل إذا ظهر صليب أحمر فوق المسار؟",
    options: [
      { en: "Leave the motorway at the next exit", ar: "مغادرة الطريق السريع عند المخرج التالي", correct: false },
      { en: "Continue carefully", ar: "الاستمرار بحذر", correct: false },
      { en: "Use the hard shoulder", ar: "استخدام كتف الطريق", correct: false },
      { en: "Move out of that lane immediately", ar: "الخروج من ذلك المسار فوراً", correct: true }
    ],
    keywords: [
      { term: "red cross", ar: "صليب أحمر", explainAr: "علامة حمراء على شكل X." },
      { term: "hint", ar: "تلميح", explainAr: "A red cross means the lane is closed." }
    ]
  },

  {
    id: "MW-12",
    topic: "motorway-driving",
    promptEn: "How should you join a motorway from a slip road?",
    promptAr: "كيف تنضم للطريق السريع من طريق فرعي؟",
    options: [
      { en: "Stop at the end of the slip road", ar: "التوقف عند نهاية طريق الاندماج", correct: false },
      { en: "Drive along the hard shoulder", ar: "القيادة على كتف الطريق", correct: false },
      { en: "Accelerate to match traffic speed and merge safely", ar: "التسارع لمطابقة سرعة المرور والاندماج بأمان", correct: true },
      { en: "Enter at a very slow speed", ar: "الدخول بسرعة منخفضة جداً", correct: false }
    ],
    keywords: [
      { term: "joining motorway", ar: "الانضمام للطريق السريع", explainAr: "الدخول إلى الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Match speed and merge smoothly." }
    ]
  },

  {
    id: "MW-13",
    topic: "motorway-driving",
    promptEn: "What is the maximum speed for a car towing a trailer on a motorway?",
    promptAr: "ما السرعة القصوى لسيارة تسحب مقطورة على الطريق السريع؟",
    options: [
      { en: "40 mph", ar: "40 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: true },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "towing", ar: "سحب مقطورة", explainAr: "سحب مقطورة خلف المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Towing vehicles have lower speed limits." }
    ]
  },

  {
    id: "MW-14",
    topic: "motorway-driving",
    promptEn: "After using an emergency phone on the motorway, where should you wait?",
    promptAr: "أين يجب الانتظار بعد استخدام هاتف الطوارئ؟",
    options: [
      { en: "Beside your vehicle", ar: "بجانب مركبتك", correct: false },
      { en: "On the hard shoulder", ar: "على كتف الطريق", correct: false },
      { en: "Next to the phone", ar: "بجانب الهاتف", correct: false },
      { en: "Well away from traffic", ar: "بعيداً عن حركة المرور", correct: true }
    ],
    keywords: [
      { term: "emergency phone", ar: "هاتف الطوارئ", explainAr: "هاتف للطوارئ على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Stay away from moving traffic." }
    ]
  },

  {
    id: "MW-15",
    topic: "motorway-driving",
    promptEn: "After repairing your vehicle on the hard shoulder, how should you rejoin traffic?",
    promptAr: "كيف تعود للطريق بعد إصلاح مركبتك؟",
    options: [
      { en: "Pull out slowly and accelerate on the carriageway", ar: "الخروج ببطء والتسارع على الطريق", correct: false },
      { en: "Wait for another driver to flash you", ar: "انتظار سائق آخر لإشارة الضوء", correct: false },
      { en: "Accelerate on the hard shoulder before merging", ar: "التسارع على كتف الطريق قبل الاندماج", correct: true },
      { en: "Use hazard lights while pulling out", ar: "استخدام أضواء التحذير أثناء الخروج", correct: false }
    ],
    keywords: [
      { term: "rejoining traffic", ar: "العودة للمرور", explainAr: "العودة إلى حركة المرور." },
      { term: "hint", ar: "تلميح", explainAr: "Build speed before merging." }
    ]
  },

  {
    id: "MW-16",
    topic: "motorway-driving",
    promptEn: "How should motorway lanes normally be used?",
    promptAr: "كيف يجب استخدام المسارات على الطريق السريع؟",
    options: [
      { en: "Stay in one lane", ar: "البقاء في مسار واحد", correct: false },
      { en: "Use the clearest lane", ar: "استخدام أنظف مسار", correct: false },
      { en: "Keep left unless overtaking", ar: "البقاء يساراً ما لم تتجاوز", correct: true },
      { en: "Change lanes frequently", ar: "تغيير المسارات بشكل متكرر", correct: false }
    ],
    keywords: [
      { term: "lane discipline", ar: "انضباط المسارات", explainAr: "استخدام المسارات بشكل صحيح." },
      { term: "hint", ar: "تلميح", explainAr: "Left lane is the default." }
    ]
  },

  {
    id: "MW-17",
    topic: "motorway-driving",
    promptEn: "Where are amber reflective studs found on a motorway?",
    promptAr: "أين توجد العواكس الصفراء على الطريق السريع؟",
    options: [
      { en: "Between lanes", ar: "بين المسارات", correct: false },
      { en: "Between carriageway and central reservation", ar: "بين الطريق والجزيرة الوسطى", correct: false },
      { en: "Between the hard shoulder and carriageway", ar: "بين كتف الطريق والطريق", correct: true },
      { en: "On slip roads only", ar: "على طرق الاندماج فقط", correct: false }
    ],
    keywords: [
      { term: "amber studs", ar: "عواكس صفراء", explainAr: "علامات عاكسة صفراء على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Amber marks the hard shoulder boundary." }
    ]
  },

  {
    id: "MW-18",
    topic: "motorway-driving",
    promptEn: "What does a red cross above the hard shoulder mean?",
    promptAr: "ماذا يعني ظهور صليب أحمر فوق كتف الطريق؟",
    options: [
      { en: "You may stop there", ar: "يمكنك التوقف هناك", correct: false },
      { en: "You may drive in that lane", ar: "يمكنك القيادة في ذلك المسار", correct: false },
      { en: "You must not use that lane", ar: "يجب ألا تستخدم ذلك المسار", correct: true },
      { en: "It's a rest area", ar: "إنها منطقة راحة", correct: false }
    ],
    keywords: [
      { term: "red cross", ar: "صليب أحمر", explainAr: "علامة حمراء على شكل X." },
      { term: "hint", ar: "تلميح", explainAr: "Red cross = lane closed." }
    ]
  },

  {
    id: "MW-19",
    topic: "motorway-driving",
    promptEn: "Which vehicles should normally use the left-hand lane on a motorway?",
    promptAr: "أي المركبات يجب أن تستخدم المسار الأيسر عادةً؟",
    options: [
      { en: "Slow vehicles only", ar: "المركبات البطيئة فقط", correct: false },
      { en: "Emergency vehicles only", ar: "مركبات الطوارئ فقط", correct: false },
      { en: "Large vehicles only", ar: "المركبات الكبيرة فقط", correct: false },
      { en: "Any vehicle not overtaking", ar: "أي مركبة لا تتجاوز", correct: true }
    ],
    keywords: [
      { term: "left-hand lane", ar: "المسار الأيسر", explainAr: "المسار الأيسر على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Keep left unless overtaking." }
    ]
  },

  {
    id: "MW-20",
    topic: "motorway-driving",
    promptEn: "What restriction applies to drivers with a provisional licence?",
    promptAr: "ما القيد المفروض على حامل الرخصة المؤقتة؟",
    options: [
      { en: "No night driving", ar: "لا قيادة ليلاً", correct: false },
      { en: "No driving above 30 mph", ar: "لا قيادة فوق 30 ميل/ساعة", correct: false },
      { en: "Must be accompanied by a qualified driver", ar: "يجب أن يكون برفقة سائق مؤهل", correct: true },
      { en: "Limited to one passenger", ar: "محدود براكب واحد", correct: false }
    ],
    keywords: [
      { term: "provisional licence", ar: "رخصة مؤقتة", explainAr: "رخصة قيادة مؤقتة للمتعلمين." },
      { term: "hint", ar: "تلميح", explainAr: "Provisional drivers must be supervised." }
    ]
  },

  {
    id: "MW-21",
    topic: "motorway-driving",
    promptEn: "A displayed speed limit above the hard shoulder usually means it's being used as a live lane.",
    promptAr: "حد السرعة المعروض فوق كتف الطريق السريع يعني عادةً أنه يُستخدم كمسار حي.",
    options: [
      { en: "True", ar: "صحيح", correct: true },
      { en: "False", ar: "خطأ", correct: false }
    ],
    keywords: [
      { term: "hard shoulder", ar: "كتف الطريق", explainAr: "الكتف الجانبي للطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "A displayed speed limit above the hard shoulder usually means it's being used as a live lane." }
    ]
  },

  {
    id: "MW-22",
    topic: "motorway-driving",
    promptEn: "You've stopped in an emergency area. What should you do before rejoining the motorway?",
    promptAr: "توقفت في منطقة طوارئ. ماذا يجب أن تفعل قبل العودة إلى الطريق السريع؟",
    options: [
      { en: "Use an emergency phone if you need help, then rejoin when safe", ar: "استخدم هاتف الطوارئ إذا احتجت مساعدة، ثم انضم عندما يكون آمناً", correct: true },
      { en: "Give an arm signal while moving off", ar: "أعطِ إشارة بالذراع أثناء التحرك", correct: false },
      { en: "Switch headlights on before moving off", ar: "شغّل المصابيح الأمامية قبل التحرك", correct: false },
      { en: "Pull away with hazard lights on at all times", ar: "انطلق مع تشغيل أضواء الخطر في جميع الأوقات", correct: false }
    ],
    keywords: [
      { term: "emergency area", ar: "منطقة طوارئ", explainAr: "منطقة مخصصة للطوارئ على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Rejoin only when it's safe; use an emergency phone if assistance is needed." }
    ]
  },

  {
    id: "MW-23",
    topic: "motorway-driving",
    promptEn: "You're on a motorway and need to slow down quickly because traffic ahead is stopping. How can you warn drivers behind?",
    promptAr: "أنت على طريق سريع واضطررت للتباطؤ بسرعة بسبب توقف المرور أمامك. كيف تحذّر السائقين خلفك؟",
    options: [
      { en: "Briefly use hazard warning lights", ar: "استخدم أضواء الخطر لفترة وجيزة", correct: true },
      { en: "Flash your headlights repeatedly", ar: "أومض مصابيحك الأمامية بشكل متكرر", correct: false },
      { en: "Sound your horn", ar: "استخدم البوق", correct: false },
      { en: "Switch headlights on and off", ar: "شغّل وأطفئ المصابيح الأمامية", correct: false }
    ],
    keywords: [
      { term: "hazard warning lights", ar: "أضواء الخطر", explainAr: "أضواء الخطر للتحذير." },
      { term: "hint", ar: "تلميح", explainAr: "Brief hazard lights can warn following traffic of sudden slowing." }
    ]
  },

  {
    id: "MW-24",
    topic: "motorway-driving",
    promptEn: "Which of these must NOT use the right-hand lane of a three-lane motorway?",
    promptAr: "أي من هذه المركبات لا يُسمح لها باستخدام المسار الأيمن على طريق سريع بثلاثة مسارات؟",
    options: [
      { en: "Small delivery vans", ar: "شاحنات توصيل صغيرة", correct: false },
      { en: "Motorcycles", ar: "الدراجات النارية", correct: false },
      { en: "Vehicles towing a trailer", ar: "المركبات التي تسحب مقطورة", correct: true },
      { en: "Motorcycle with a sidecar", ar: "دراجة نارية مع عربة جانبية", correct: false }
    ],
    keywords: [
      { term: "towing", ar: "سحب", explainAr: "سحب مقطورة أو عربة." },
      { term: "hint", ar: "تلميح", explainAr: "Towing vehicles are restricted from the right-hand lane on 3-lane motorways." }
    ]
  },

  {
    id: "MW-25",
    topic: "motorway-driving",
    promptEn: "You're towing a trailer on a three-lane motorway. When may you use the right-hand lane?",
    promptAr: "أنت تسحب مقطورة على طريق سريع بثلاثة مسارات. متى يُسمح لك باستخدام المسار الأيمن؟",
    options: [
      { en: "When there are lane closures", ar: "عند إغلاق المسارات", correct: false },
      { en: "When traffic is slow-moving", ar: "عندما تكون حركة المرور بطيئة", correct: false },
      { en: "Never (trailers must not use the right-hand lane)", ar: "أبداً (المقطورات لا يجب أن تستخدم المسار الأيمن)", correct: true },
      { en: "When large vehicles are in the left and centre lanes", ar: "عندما تكون المركبات الكبيرة في المسارين الأيسر والوسط", correct: false }
    ],
    keywords: [
      { term: "towing", ar: "سحب", explainAr: "سحب مقطورة أو عربة." },
      { term: "hint", ar: "تلميح", explainAr: "On a 3-lane motorway, towing a trailer means you must not use the right-hand lane." }
    ]
  },

  {
    id: "MW-26",
    topic: "motorway-driving",
    promptEn: "You get a puncture on the motorway and stop on the hard shoulder. What should you do next?",
    promptAr: "حصل لديك ثقب في الإطار وتوقفت على كتف الطريق السريع. ماذا تفعل بعد ذلك؟",
    options: [
      { en: "Change the wheel immediately", ar: "غيّر العجلة فوراً", correct: false },
      { en: "Use an emergency phone or call for assistance", ar: "استخدم هاتف الطوارئ أو اتصل للمساعدة", correct: true },
      { en: "Wave down other vehicles for help", ar: "أومض للمركبات الأخرى للمساعدة", correct: false },
      { en: "Only change the wheel if someone is with you", ar: "غيّر العجلة فقط إذا كان معك شخص", correct: false }
    ],
    keywords: [
      { term: "puncture", ar: "ثقب في الإطار", explainAr: "ثقب في إطار المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "For safety, call for help rather than attempting roadside wheel changes on motorways." }
    ]
  },

  {
    id: "MW-27",
    topic: "motorway-driving",
    promptEn: "When may you stop on a motorway?",
    promptAr: "متى يُسمح لك بالتوقف على الطريق السريع؟",
    options: [
      { en: "To read a map", ar: "لقراءة خريطة", correct: false },
      { en: "To rest when tired", ar: "للراحة عند التعب", correct: false },
      { en: "If your phone rings", ar: "إذا رن هاتفك", correct: false },
      { en: "Only in an emergency or breakdown", ar: "فقط في حالة طوارئ أو عطل", correct: true }
    ],
    keywords: [
      { term: "motorway stopping", ar: "التوقف على الطريق السريع", explainAr: "التوقف على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Motorways are not for routine stops—only emergencies." }
    ]
  },

  {
    id: "MW-28",
    topic: "motorway-driving",
    promptEn: "You see motorway countdown markers (3 bars, then 2, then 1). What do they tell you?",
    promptAr: "ترى علامات عدّ تنازلي على الطريق السريع (3 ثم 2 ثم 1). ماذا تعني؟",
    options: [
      { en: "Distance to a bridge", ar: "المسافة إلى جسر", correct: false },
      { en: "Distance to the next emergency telephone", ar: "المسافة إلى أقرب هاتف طوارئ", correct: false },
      { en: "Distance to the next exit/junction", ar: "المسافة إلى المخرج/التقاطع التالي", correct: true },
      { en: "A police checkpoint is ahead", ar: "نقطة تفتيش شرطة أمامك", correct: false }
    ],
    keywords: [
      { term: "countdown markers", ar: "علامات العد التنازلي", explainAr: "علامات على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "These markers count down to an exit/junction." }
    ]
  },

  {
    id: "MW-29",
    topic: "motorway-driving",
    promptEn: "Immediately after joining a motorway, what should you normally do?",
    promptAr: "مباشرة بعد دخول الطريق السريع، ماذا يجب أن تفعل عادةً؟",
    options: [
      { en: "Try to overtake straight away", ar: "حاول التجاوز فوراً", correct: false },
      { en: "Re-check mirrors and traffic position", ar: "أعد فحص المرايا وموضع المرور", correct: true },
      { en: "Move into the centre lane", ar: "انتقل إلى المسار الأوسط", correct: false },
      { en: "Brake to create space", ar: "فرمل لخلق مساحة", correct: false }
    ],
    keywords: [
      { term: "joining motorway", ar: "الانضمام للطريق السريع", explainAr: "الدخول إلى الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Confirm your position and mirrors after merging." }
    ]
  },

  {
    id: "MW-30",
    topic: "motorway-driving",
    promptEn: "Why should you use the full length of the slip road when joining a motorway?",
    promptAr: "لماذا يجب استخدام كامل مسار الاندماج عند دخول الطريق السريع؟",
    options: [
      { en: "So you can turn around if needed", ar: "حتى تتمكن من الدوران إذا لزم الأمر", correct: false },
      { en: "To join directly into overtaking lanes", ar: "للانضمام مباشرة إلى مسارات التجاوز", correct: false },
      { en: "To build speed and merge safely into traffic flow", ar: "لبناء السرعة والاندماج بأمان في تدفق المرور", correct: true },
      { en: "Because you can continue on the hard shoulder", ar: "لأنه يمكنك المتابعة على كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "slip road", ar: "مسار الاندماج", explainAr: "مسار للدخول إلى الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "The slip road is for matching speed and merging smoothly." }
    ]
  },

  {
    id: "MW-31",
    topic: "motorway-driving",
    promptEn: "What can help reduce bunching and sudden braking on a motorway?",
    promptAr: "ما الذي يساعد على تقليل تكدّس المركبات والفرملة المفاجئة على الطريق السريع؟",
    options: [
      { en: "National speed limits only", ar: "حدود السرعة الوطنية فقط", correct: false },
      { en: "Lane closures", ar: "إغلاق المسارات", correct: false },
      { en: "Variable speed limits", ar: "حدود السرعة المتغيرة", correct: true },
      { en: "Contraflow systems", ar: "أنظمة التدفق المعاكس", correct: false }
    ],
    keywords: [
      { term: "variable speed limits", ar: "حدود السرعة المتغيرة", explainAr: "حدود سرعة تتغير حسب الظروف." },
      { term: "hint", ar: "تلميح", explainAr: "Variable limits can smooth traffic flow." }
    ]
  },

  {
    id: "MW-32",
    topic: "motorway-driving",
    promptEn: "How do variable speed limits help motorway traffic?",
    promptAr: "كيف تساعد حدود السرعة المتغيرة على الطريق السريع؟",
    options: [
      { en: "By raising limits at all times", ar: "برفع الحدود في جميع الأوقات", correct: false },
      { en: "By giving a minimum speed", ar: "بإعطاء حد أدنى للسرعة", correct: false },
      { en: "By adjusting legal speeds to keep traffic flowing smoothly", ar: "بتعديل السرعات القانونية للحفاظ على تدفق المرور بسلاسة", correct: true },
      { en: "By allowing faster overtaking", ar: "بالسماح بتجاوز أسرع", correct: false }
    ],
    keywords: [
      { term: "variable speed limits", ar: "حدود السرعة المتغيرة", explainAr: "حدود سرعة تتغير حسب الظروف." },
      { term: "hint", ar: "تلميح", explainAr: "They reduce stop-start traffic by controlling flow." }
    ]
  },

  {
    id: "MW-33",
    topic: "motorway-driving",
    promptEn: "Which lane should you be in well before your motorway exit?",
    promptAr: "أي مسار يجب أن تكون فيه قبل وقت كافٍ من خروجك من الطريق السريع؟",
    options: [
      { en: "Right lane", ar: "المسار الأيمن", correct: false },
      { en: "Middle lane", ar: "المسار الأوسط", correct: false },
      { en: "Left-hand lane", ar: "المسار الأيسر", correct: true },
      { en: "Hard shoulder", ar: "كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "motorway exit", ar: "مخرج الطريق السريع", explainAr: "مخرج من الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Plan early and move left in good time." }
    ]
  },

  {
    id: "MW-34",
    topic: "motorway-driving",
    promptEn: "When using a motorway emergency telephone, how should you stand?",
    promptAr: "عند استخدام هاتف الطوارئ على الطريق السريع، كيف يجب أن تقف؟",
    options: [
      { en: "Close to the carriageway", ar: "قريباً من الطريق", correct: false },
      { en: "Facing the oncoming traffic", ar: "مواجهاً لحركة المرور القادمة", correct: false },
      { en: "With your back to the traffic", ar: "بظهرك للحركة المرورية", correct: false },
      { en: "On the hard shoulder, facing the phone and away from traffic", ar: "على كتف الطريق، مواجهاً للهاتف وبعيداً عن المرور", correct: true }
    ],
    keywords: [
      { term: "emergency telephone", ar: "هاتف الطوارئ", explainAr: "هاتف للطوارئ على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Stay safely away from live traffic." }
    ]
  },

  {
    id: "MW-35",
    topic: "motorway-driving",
    promptEn: "What is the national speed limit for cars and motorcycles on a motorway (unless signs show otherwise)?",
    promptAr: "ما الحد الوطني للسرعة للسيارات والدراجات النارية على الطريق السريع (ما لم تُظهر الإشارات خلاف ذلك)؟",
    options: [
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: false },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: true },
      { en: "80 mph", ar: "80 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "national speed limit", ar: "الحد الوطني للسرعة", explainAr: "الحد الأقصى للسرعة على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Standard motorway limit is 70 mph unless signed." }
    ]
  },

  {
    id: "MW-36",
    topic: "motorway-driving",
    promptEn: "When is overtaking on the left permitted on a motorway?",
    promptAr: "متى يُسمح بالتجاوز من اليسار على الطريق السريع؟",
    options: [
      { en: "Any time the hard shoulder is clear", ar: "في أي وقت يكون كتف الطريق خالياً", correct: false },
      { en: "When traffic to your right is moving slower in queues", ar: "عندما تكون حركة المرور على يمينك تتحرك ببطء في طوابير", correct: true },
      { en: "When you signal left to warn others", ar: "عندما تشير يساراً لتحذير الآخرين", correct: false },
      { en: "When the right lane is signalling right", ar: "عندما يكون المسار الأيمن يشير يميناً", correct: false }
    ],
    keywords: [
      { term: "overtaking", ar: "تجاوز", explainAr: "تجاوز مركبة أخرى." },
      { term: "hint", ar: "تلميح", explainAr: "In slow-moving queues, passing on the left may happen legally." }
    ]
  },

  {
    id: "MW-37",
    topic: "motorway-driving",
    promptEn: "If you need to reach the nearest motorway emergency telephone, which way should you walk?",
    promptAr: "إذا احتجت للوصول إلى أقرب هاتف طوارئ على الطريق السريع، بأي اتجاه تمشي؟",
    options: [
      { en: "With traffic flow", ar: "مع اتجاه المرور", correct: false },
      { en: "Facing oncoming traffic", ar: "مواجهاً لحركة المرور القادمة", correct: false },
      { en: "In the direction shown by the marker posts", ar: "في الاتجاه الموضح بواسطة علامات المسافة", correct: true },
      { en: "Towards the nearest exit", ar: "نحو أقرب مخرج", correct: false }
    ],
    keywords: [
      { term: "emergency telephone", ar: "هاتف الطوارئ", explainAr: "هاتف للطوارئ على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Marker posts show the direction to the nearest phone." }
    ]
  },

  {
    id: "MW-38",
    topic: "motorway-driving",
    promptEn: "What is the motorway speed limit for cars and motorcycles unless signs say otherwise?",
    promptAr: "ما حد السرعة على الطريق السريع للسيارات والدراجات النارية ما لم تُظهر الإشارات غير ذلك؟",
    options: [
      { en: "30 mph", ar: "30 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: false },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: true }
    ],
    keywords: [
      { term: "national speed limit", ar: "الحد الوطني للسرعة", explainAr: "الحد الأقصى للسرعة على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Same rule: 70 mph unless signed." }
    ]
  },

  {
    id: "MW-39",
    topic: "motorway-driving",
    promptEn: "On a three-lane motorway, which lane should you normally use when the road ahead is clear?",
    promptAr: "على طريق سريع بثلاثة مسارات، أي مسار تستخدم عادة عندما يكون الطريق أمامك خاليًا؟",
    options: [
      { en: "Left", ar: "الأيسر", correct: true },
      { en: "Centre", ar: "الأوسط", correct: false },
      { en: "Right", ar: "الأيمن", correct: false },
      { en: "Either centre or right", ar: "إما الأوسط أو الأيمن", correct: false }
    ],
    keywords: [
      { term: "motorway lanes", ar: "مسارات الطريق السريع", explainAr: "مسارات على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Keep left unless overtaking." }
    ]
  },

  {
    id: "MW-40",
    topic: "motorway-driving",
    promptEn: "You're in the left lane and traffic is joining from a slip road. What should you do?",
    promptAr: "أنت في المسار الأيسر وهناك مركبات تندمج من مسار جانبي. ماذا تفعل؟",
    options: [
      { en: "Speed up so they must join behind you", ar: "اسرع حتى يضطروا للانضمام خلفك", correct: false },
      { en: "Adjust speed or change lane if safe", ar: "عدّل السرعة أو غيّر المسار إذا كان آمناً", correct: true },
      { en: "Maintain speed no matter what", ar: "حافظ على السرعة مهما حدث", correct: false },
      { en: "Switch hazard lights on", ar: "شغّل أضواء الخطر", correct: false }
    ],
    keywords: [
      { term: "slip road", ar: "مسار الاندماج", explainAr: "مسار للدخول إلى الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Help merging traffic only if it's safe—never force sudden moves." }
    ]
  },

  {
    id: "MW-41",
    topic: "motorway-driving",
    promptEn: "Which type of vehicle is not allowed to use a motorway?",
    promptAr: "أي نوع من المركبات غير مسموح له باستخدام الطريق السريع؟",
    options: [
      { en: "Powered mobility scooters", ar: "سكوترات التنقل الكهربائية", correct: true },
      { en: "Motorcycles over 50 cc", ar: "دراجات نارية أكثر من 50 سي سي", correct: false },
      { en: "Double-deck buses", ar: "حافلات ذات طابقين", correct: false },
      { en: "Cars with automatic transmission", ar: "سيارات بناقل حركة أوتوماتيكي", correct: false }
    ],
    keywords: [
      { term: "motorway", ar: "طريق سريع", explainAr: "طريق متعدد المسارات بسرعة عالية." },
      { term: "hint", ar: "تلميح", explainAr: "Motorways are only for fast motor vehicles." }
    ]
  },

  {
    id: "MW-42",
    topic: "motorway-driving",
    promptEn: "If you miss your exit on a motorway, what should you do?",
    promptAr: "إذا فاتك مخرج الطريق السريع، ماذا يجب أن تفعل؟",
    options: [
      { en: "Reverse along the hard shoulder", ar: "الرجوع للخلف على كتف الطريق", correct: false },
      { en: "Continue to the next exit", ar: "المتابعة إلى المخرج التالي", correct: true },
      { en: "Reverse carefully in the left lane", ar: "الرجوع بحذر في المسار الأيسر", correct: false },
      { en: "Make a U-turn through the central reservation", ar: "القيام باستدارة عبر الجزيرة الوسطى", correct: false }
    ],
    keywords: [
      { term: "motorway exit", ar: "مخرج الطريق السريع", explainAr: "مخرج من الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Never reverse or turn around on a motorway." }
    ]
  },

  {
    id: "MW-43",
    topic: "motorway-driving",
    promptEn: "What colour are the reflective studs between lanes on a motorway?",
    promptAr: "ما لون العواكس بين المسارات على الطريق السريع؟",
    options: [
      { en: "Green", ar: "أخضر", correct: false },
      { en: "Amber", ar: "أصفر", correct: false },
      { en: "White", ar: "أبيض", correct: true },
      { en: "Red", ar: "أحمر", correct: false }
    ],
    keywords: [
      { term: "reflective studs", ar: "عواكس", explainAr: "علامات عاكسة على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "White studs separate lanes." }
    ]
  },

  {
    id: "MW-44",
    topic: "motorway-driving",
    promptEn: "Where should you stop to rest if you feel tired on a motorway?",
    promptAr: "أين يجب أن تتوقف للراحة إذا شعرت بالتعب على الطريق السريع؟",
    options: [
      { en: "On the hard shoulder", ar: "على كتف الطريق", correct: false },
      { en: "At the nearest service area", ar: "في أقرب منطقة خدمات", correct: true },
      { en: "On a slip road", ar: "على مسار جانبي", correct: false },
      { en: "On the central reservation", ar: "على الجزيرة الوسطى", correct: false }
    ],
    keywords: [
      { term: "service area", ar: "منطقة خدمات", explainAr: "منطقة للراحة والخدمات على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Use service areas, not the hard shoulder." }
    ]
  },

  {
    id: "MW-45",
    topic: "motorway-driving",
    promptEn: "Why is it better to use an emergency roadside telephone than a mobile phone on a motorway?",
    promptAr: "لماذا يُفضل استخدام هاتف الطوارئ على الطريق السريع؟",
    options: [
      { en: "It connects you to a local garage", ar: "يربطك بورشة محلية", correct: false },
      { en: "Mobile phones distract other drivers", ar: "الهواتف المحمولة تشتت انتباه السائقين الآخرين", correct: false },
      { en: "It allows emergency services to locate you easily", ar: "يسمح لخدمات الطوارئ بتحديد موقعك بسهولة", correct: true },
      { en: "Mobile phones don't work on motorways", ar: "الهواتف المحمولة لا تعمل على الطرق السريعة", correct: false }
    ],
    keywords: [
      { term: "emergency telephone", ar: "هاتف الطوارئ", explainAr: "هاتف للطوارئ على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Emergency phones give your exact location." }
    ]
  },

  {
    id: "MW-46",
    topic: "motorway-driving",
    promptEn: "You see red studs on your left and white studs on your right. Which lane are you in?",
    promptAr: "ترى عواكس حمراء على يسارك وبيضاء على يمينك، في أي مسار أنت؟",
    options: [
      { en: "Right-hand lane", ar: "المسار الأيمن", correct: false },
      { en: "Middle lane", ar: "المسار الأوسط", correct: true },
      { en: "Hard shoulder", ar: "كتف الطريق", correct: false },
      { en: "Left-hand lane", ar: "المسار الأيسر", correct: false }
    ],
    keywords: [
      { term: "reflective studs", ar: "عواكس", explainAr: "علامات عاكسة على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Red = central reservation, white = lane divider." }
    ]
  },

  {
    id: "MW-47",
    topic: "motorway-driving",
    promptEn: "What must you do if a red cross is shown above every motorway lane?",
    promptAr: "ماذا يجب أن تفعل إذا ظهرت علامة X حمراء فوق جميع المسارات؟",
    options: [
      { en: "Pull onto the hard shoulder", ar: "التحرك إلى كتف الطريق", correct: false },
      { en: "Slow down and wait", ar: "إبطاء والانتظار", correct: false },
      { en: "Leave at the next exit", ar: "المغادرة عند المخرج التالي", correct: false },
      { en: "Stop and wait", ar: "التوقف والانتظار", correct: true }
    ],
    keywords: [
      { term: "red cross", ar: "علامة X حمراء", explainAr: "علامة إغلاق المسار." },
      { term: "hint", ar: "تلميح", explainAr: "All lanes closed means you must stop." }
    ]
  },

  {
    id: "MW-48",
    topic: "motorway-driving",
    promptEn: "Your vehicle breaks down and you cannot reach the hard shoulder. What should you do?",
    promptAr: "تعطلت مركبتك ولا يمكنك الوصول إلى كتف الطريق، ماذا تفعل؟",
    options: [
      { en: "Switch on hazard warning lights", ar: "تشغيل أضواء الخطر", correct: true },
      { en: "Stand behind your vehicle", ar: "الوقوف خلف مركبتك", correct: false },
      { en: "Try to repair it quickly", ar: "محاولة إصلاحها بسرعة", correct: false },
      { en: "Stop traffic behind you", ar: "إيقاف المرور خلفك", correct: false }
    ],
    keywords: [
      { term: "hazard warning lights", ar: "أضواء الخطر", explainAr: "أضواء تحذيرية." },
      { term: "hint", ar: "تلميح", explainAr: "Hazard lights warn approaching traffic." }
    ]
  },

  {
    id: "MW-49",
    topic: "motorway-driving",
    promptEn: "When should you normally use the left-hand lane on a motorway?",
    promptAr: "متى يجب استخدام المسار الأيسر عادةً؟",
    options: [
      { en: "When overtaking", ar: "عند التجاوز", correct: false },
      { en: "When the road ahead is clear and you are not overtaking", ar: "عندما يكون الطريق أمامك خالياً وأنت لا تتجاوز", correct: true },
      { en: "When making a phone call", ar: "عند إجراء مكالمة هاتفية", correct: false },
      { en: "When driving slowly", ar: "عند القيادة ببطء", correct: false }
    ],
    keywords: [
      { term: "left-hand lane", ar: "المسار الأيسر", explainAr: "المسار الأيسر على الطريق السريع." },
      { term: "hint", ar: "تلميح", explainAr: "Left lane is for normal driving." }
    ]
  },

  {
    id: "MW-50",
    topic: "motorway-driving",
    promptEn: "What should you do when driving through a contraflow system?",
    promptAr: "ماذا يجب أن تفعل عند القيادة في نظام تحويل المسارات؟",
    options: [
      { en: "Switch lanes to move faster", ar: "تغيير المسارات للتحرك أسرع", correct: false },
      { en: "Keep a safe distance from the vehicle ahead", ar: "الحفاظ على مسافة آمنة من المركبة الأمامية", correct: true },
      { en: "Drive close to reduce queues", ar: "القيادة قريباً لتقليل الطوابير", correct: false },
      { en: "Use hazard warning lights", ar: "استخدام أضواء الخطر", correct: false }
    ],
    keywords: [
      { term: "contraflow system", ar: "نظام تحويل المسارات", explainAr: "نظام تحويل حركة المرور." },
      { term: "hint", ar: "تلميح", explainAr: "Reduced lanes mean higher risk." }
    ]
  },

  {
    id: "MW-51",
    topic: "motorway-driving",
    promptEn: "What would you normally expect at a contraflow system?",
    promptAr: "ماذا تتوقع عادةً في نظام تحويل المسارات؟",
    options: [
      { en: "Temporary traffic lights", ar: "إشارات مرور مؤقتة", correct: false },
      { en: "Lower speed limits", ar: "حدود سرعة أقل", correct: true },
      { en: "Wider lanes", ar: "مسارات أوسع", correct: false },
      { en: "Road humps", ar: "مطبات سرعة", correct: false }
    ],
    keywords: [
      { term: "contraflow system", ar: "نظام تحويل المسارات", explainAr: "نظام تحويل حركة المرور." },
      { term: "hint", ar: "تلميح", explainAr: "Speed is reduced for safety." }
    ]
  },

  {
    id: "MW-52",
    topic: "motorway-driving",
    promptEn: "Why is checking your vehicle important before a long motorway journey?",
    promptAr: "لماذا فحص المركبة مهم قبل رحلة طويلة على الطريق السريع؟",
    options: [
      { en: "Motorways wear tyres faster", ar: "الطرق السريعة تبلى الإطارات أسرع", correct: false },
      { en: "Services can't help breakdowns", ar: "الخدمات لا يمكنها مساعدة الأعطال", correct: false },
      { en: "Continuous high speeds increase breakdown risk", ar: "السرعات العالية المستمرة تزيد خطر الأعطال", correct: true },
      { en: "Brakes are used more", ar: "الفرامل تُستخدم أكثر", correct: false }
    ],
    keywords: [
      { term: "vehicle check", ar: "فحص المركبة", explainAr: "فحص المركبة قبل الرحلة." },
      { term: "hint", ar: "تلميح", explainAr: "Long high-speed driving stresses vehicles." }
    ]
  },

  {
    id: "MW-53",
    topic: "motorway-driving",
    promptEn: "What are traffic officers authorised to do on motorways?",
    promptAr: "ما الذي يُسمح لرجال المرور بفعله على الطرق السريعة؟",
    options: [
      { en: "Arrest drivers", ar: "اعتقال السائقين", correct: false },
      { en: "Repair vehicles", ar: "إصلاح المركبات", correct: false },
      { en: "Issue penalty notices", ar: "إصدار إشعارات الغرامات", correct: false },
      { en: "Stop and direct traffic", ar: "إيقاف وتوجيه المرور", correct: true }
    ],
    keywords: [
      { term: "traffic officers", ar: "رجال المرور", explainAr: "موظفو إدارة المرور." },
      { term: "hint", ar: "تلميح", explainAr: "They manage traffic flow and safety." }
    ]
  },

  {
    id: "MW-54",
    topic: "motorway-driving",
    promptEn: "What colour are the studs between the hard shoulder and left-hand lane?",
    promptAr: "ما لون العواكس بين كتف الطريق والمسار الأيسر؟",
    options: [
      { en: "Green", ar: "أخضر", correct: false },
      { en: "Red", ar: "أحمر", correct: false },
      { en: "White", ar: "أبيض", correct: false },
      { en: "Amber", ar: "أصفر", correct: true }
    ],
    keywords: [
      { term: "reflective studs", ar: "عواكس", explainAr: "علامات عاكسة على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Amber separates hard shoulder from traffic." }
    ]
  },

  {
    id: "MW-55",
    topic: "motorway-driving",
    promptEn: "A red cross is shown above the hard shoulder with speed limits above other lanes. What does this mean?",
    promptAr: "ماذا يعني ظهور علامة X حمراء فوق كتف الطريق؟",
    options: [
      { en: "Hard shoulder can be used as a lane", ar: "يمكن استخدام كتف الطريق كمسار", correct: false },
      { en: "Hard shoulder is emergency use only", ar: "كتف الطريق للطوارئ فقط", correct: true },
      { en: "Hard shoulder has a 50 mph limit", ar: "كتف الطريق له حد سرعة 50 ميل/ساعة", correct: false },
      { en: "You can rest there", ar: "يمكنك الراحة هناك", correct: false }
    ],
    keywords: [
      { term: "red cross", ar: "علامة X حمراء", explainAr: "علامة إغلاق المسار." },
      { term: "hint", ar: "تلميح", explainAr: "Red cross = lane closed." }
    ]
  },

  {
    id: "MW-56",
    topic: "motorway-driving",
    promptEn: "Where would you find a crawler or climbing lane on a motorway?",
    promptAr: "أين تجد مسار المركبات البطيئة على الطريق السريع؟",
    options: [
      { en: "Near a service area", ar: "قرب منطقة خدمات", correct: false },
      { en: "Before a junction", ar: "قبل تقاطع", correct: false },
      { en: "On a steep uphill section", ar: "على منحدر صاعد شديد", correct: true },
      { en: "Along the hard shoulder", ar: "على طول كتف الطريق", correct: false }
    ],
    keywords: [
      { term: "climbing lane", ar: "مسار المركبات البطيئة", explainAr: "مسار للمركبات البطيئة على المنحدرات." },
      { term: "hint", ar: "تلميح", explainAr: "Used to help slow vehicles uphill." }
    ]
  },

  {
    id: "MW-57",
    topic: "motorway-driving",
    promptEn: "After a breakdown on the hard shoulder, how should you rejoin the motorway?",
    promptAr: "كيف تعود للطريق السريع بعد عطل على كتف الطريق؟",
    options: [
      { en: "Move straight into traffic", ar: "التحرك مباشرة إلى المرور", correct: false },
      { en: "Wait for another driver to signal", ar: "الانتظار حتى يشير سائق آخر", correct: false },
      { en: "Build speed on the hard shoulder, then merge safely", ar: "زيادة السرعة على كتف الطريق ثم الاندماج بأمان", correct: true },
      { en: "Keep hazard lights on while joining", ar: "الحفاظ على أضواء الخطر أثناء الانضمام", correct: false }
    ],
    keywords: [
      { term: "rejoin motorway", ar: "العودة للطريق السريع", explainAr: "العودة إلى الطريق السريع بعد التوقف." },
      { term: "hint", ar: "تلميح", explainAr: "Match speed before merging safely." }
    ]
  },

  // --- RULES OF THE ROAD (EXTRA) ---

  {
    id: "RR-06",
    topic: "rules-of-the-road",
    promptEn: "A cycle lane is marked with a broken white line. What does this mean for drivers?",
    promptAr: "ممر دراجات بخط أبيض متقطع، ماذا يعني ذلك للسائقين؟",
    options: [
      { en: "Drivers must not enter", ar: "السائقون لا يجب أن يدخلوا", correct: false },
      { en: "Drivers may enter if necessary and safe", ar: "السائقون قد يدخلون إذا كان ضرورياً وآمناً", correct: true },
      { en: "Cyclists travel both directions", ar: "الدراجون يسيرون في كلا الاتجاهين", correct: false },
      { en: "Motorcycles must use it", ar: "الدراجات النارية يجب أن تستخدمه", correct: false }
    ],
    keywords: [
      { term: "cycle lane", ar: "ممر دراجات", explainAr: "مسار مخصص للدراجات." },
      { term: "hint", ar: "تلميح", explainAr: "Broken lines allow limited access." }
    ]
  },

  {
    id: "RR-07",
    topic: "rules-of-the-road",
    promptEn: "A sign indicates that a previously enforced speed limit has ended. What does this mean?",
    promptAr: "تشير علامة إلى انتهاء حد سرعة مفروض سابقًا، ماذا يعني ذلك؟",
    options: [
      { en: "Minimum speed applies", ar: "حد السرعة الأدنى ينطبق", correct: false },
      { en: "End of maximum speed", ar: "نهاية حد السرعة الأقصى", correct: false },
      { en: "End of minimum speed", ar: "نهاية حد السرعة الأدنى", correct: false },
      { en: "National speed limit now applies", ar: "حد السرعة الوطني ينطبق الآن", correct: true }
    ],
    keywords: [
      { term: "speed limit", ar: "حد السرعة", explainAr: "الحد الأقصى للسرعة المسموح بها." },
      { term: "hint", ar: "تلميح", explainAr: "Default limits return when a restriction ends." }
    ]
  },

  {
    id: "RR-08",
    topic: "rules-of-the-road",
    promptEn: "When should you normally use the right-hand lane on a dual carriageway?",
    promptAr: "متى يُستخدم المسار الأيمن عادةً على طريق مزدوج؟",
    options: [
      { en: "When turning right or overtaking", ar: "عند الانعطاف يميناً أو التجاوز", correct: true },
      { en: "When passing side roads", ar: "عند المرور بجانب طرق جانبية", correct: false },
      { en: "At constant high speed", ar: "بسرعة عالية ثابتة", correct: false },
      { en: "At minimum speed", ar: "بحد السرعة الأدنى", correct: false }
    ],
    keywords: [
      { term: "dual carriageway", ar: "طريق مزدوج", explainAr: "طريق بمسارين منفصلين لكل اتجاه." },
      { term: "hint", ar: "تلميح", explainAr: "Keep left unless overtaking." }
    ]
  },

  {
    id: "RR-09",
    topic: "rules-of-the-road",
    promptEn: "You're unsure whether it's safe to reverse your vehicle. What should you do?",
    promptAr: "غير متأكد من أمان الرجوع للخلف، ماذا تفعل؟",
    options: [
      { en: "Sound the horn", ar: "استخدم البوق", correct: false },
      { en: "Rev the engine", ar: "زِد سرعة المحرك", correct: false },
      { en: "Get out and check", ar: "اخرج وتحقق", correct: true },
      { en: "Reverse slowly", ar: "ارجع للخلف ببطء", correct: false }
    ],
    keywords: [
      { term: "reverse", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف." },
      { term: "hint", ar: "تلميح", explainAr: "Never guess when reversing." }
    ]
  },

  {
    id: "RR-10",
    topic: "rules-of-the-road",
    promptEn: "Where is the safest place to park your vehicle?",
    promptAr: "أين المكان الأكثر أمانًا لركن سيارتك؟",
    options: [
      { en: "Near a bus stop", ar: "قرب موقف حافلات", correct: false },
      { en: "On a hill crest", ar: "على قمة تل", correct: false },
      { en: "Near a level crossing", ar: "قرب معبر سكة حديد", correct: false },
      { en: "In a marked parking bay", ar: "في مكان وقوف محدد", correct: true }
    ],
    keywords: [
      { term: "parking", ar: "وقوف", explainAr: "إيقاف المركبة في مكان آمن." },
      { term: "hint", ar: "تلميح", explainAr: "Designated spaces reduce risk." }
    ]
  },

  {
    id: "RR-11",
    topic: "rules-of-the-road",
    promptEn: "In built-up areas without speed limit signs, how is a 30 mph limit usually indicated?",
    promptAr: "في المناطق المبنية دون إشارات، كيف يُعرف حد 30 ميل؟",
    options: [
      { en: "Hazard lines", ar: "خطوط الخطر", correct: false },
      { en: "Street lighting present", ar: "وجود أعمدة إنارة", correct: true },
      { en: "Pedestrian islands", ar: "جزر المشاة", correct: false },
      { en: "Yellow lines", ar: "خطوط صفراء", correct: false }
    ],
    keywords: [
      { term: "built-up area", ar: "منطقة مبنية", explainAr: "منطقة فيها مبانٍ وسكان." },
      { term: "hint", ar: "تلميح", explainAr: "Street lighting usually indicates 30 mph." }
    ]
  },

  {
    id: "RR-12",
    topic: "rules-of-the-road",
    promptEn: "You're on a narrow road with passing places. A vehicle approaches from ahead. What should you do?",
    promptAr: "طريق ضيق مع أماكن تفادي، مركبة قادمة، ماذا تفعل؟",
    options: [
      { en: "Force the other to reverse", ar: "أجبر الآخر على الرجوع", correct: false },
      { en: "Pull into the nearest passing place on your left", ar: "انسحب إلى أقرب مكان تفادي على يسارك", correct: true },
      { en: "Use the verge", ar: "استخدم الحافة", correct: false },
      { en: "Continue driving", ar: "استمر في القيادة", correct: false }
    ],
    keywords: [
      { term: "passing places", ar: "أماكن تفادي", explainAr: "أماكن على الطريق الضيق للسماح بالمرور." },
      { term: "hint", ar: "تلميح", explainAr: "Passing places allow safe sharing." }
    ]
  },

  {
    id: "RR-13",
    topic: "rules-of-the-road",
    promptEn: "What does it mean when no local speed limit signs are shown on an open road?",
    promptAr: "ماذا يعني عدم وجود إشارات سرعة محلية؟",
    options: [
      { en: "No waiting allowed", ar: "ممنوع الانتظار", correct: false },
      { en: "No entry", ar: "ممنوع الدخول", correct: false },
      { en: "National speed limit applies", ar: "حد السرعة الوطني ينطبق", correct: true },
      { en: "Temporary limit applies", ar: "حد سرعة مؤقت ينطبق", correct: false }
    ],
    keywords: [
      { term: "national speed limit", ar: "حد السرعة الوطني", explainAr: "حد السرعة الافتراضي على الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "National limits apply unless stated otherwise." }
    ]
  },

  {
    id: "RR-14",
    topic: "rules-of-the-road",
    promptEn: "Why can reversing from a side road into a main road be dangerous?",
    promptAr: "لماذا قد يكون الرجوع من طريق جانبي إلى رئيسي خطيرًا؟",
    options: [
      { en: "Sensors may fail", ar: "المستشعرات قد تفشل", correct: false },
      { en: "Restricted view of traffic", ar: "رؤية محدودة للمرور", correct: true },
      { en: "Lights won't show", ar: "الأضواء لن تظهر", correct: false },
      { en: "Mirrors need adjustment", ar: "المرايا تحتاج تعديل", correct: false }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف." },
      { term: "hint", ar: "تلميح", explainAr: "الرؤية المحدودة تزيد من الخطر لأنك لا تستطيع رؤية المركبات القادمة أو المخاطر الأخرى في الوقت المناسب، مما يقلل من وقت رد الفعل ويزيد من احتمال الاصطدام." }
    ]
  },

  {
    id: "RR-15",
    topic: "rules-of-the-road",
    promptEn: "When may you stop and wait inside a box junction?",
    promptAr: "متى يُسمح بالتوقف داخل مربع التقاطع؟",
    image: "/theory-images/signs/signs_q015_box-junction-right-turn.png",
    options: [
      { en: "Turning left in traffic", ar: "الانعطاف يساراً في المرور", correct: false },
      { en: "Going straight", ar: "السير مباشرة", correct: false },
      { en: "When waiting to turn right and blocked by oncoming traffic", ar: "عند الانتظار للانعطاف يميناً والمسدود بمرور قادم", correct: true },
      { en: "On roundabouts", ar: "في الدوارات", correct: false }
    ],
    keywords: [
      { term: "box junction", ar: "مربع التقاطع", explainAr: "منطقة صفراء في التقاطع." },
      { term: "hint", ar: "تلميح", explainAr: "Box junctions must be kept clear." }
    ]
  },

  {
    id: "RR-16",
    topic: "rules-of-the-road",
    promptEn: "Who has priority at an unmarked crossroads?",
    promptAr: "من له الأولوية عند تقاطع غير مُعلّم؟",
    options: [
      { en: "Larger vehicle", ar: "المركبة الأكبر", correct: false },
      { en: "Faster vehicle", ar: "المركبة الأسرع", correct: false },
      { en: "Smaller vehicle", ar: "المركبة الأصغر", correct: false },
      { en: "No one has priority", ar: "لا أحد له أولوية", correct: true }
    ],
    keywords: [
      { term: "unmarked crossroads", ar: "تقاطع غير معلّم", explainAr: "تقاطع بدون علامات أو إشارات." },
      { term: "hint", ar: "تلميح", explainAr: "Proceed with caution." }
    ]
  },

  {
    id: "RR-17",
    topic: "rules-of-the-road",
    promptEn: "Why is it safer to turn behind an oncoming vehicle when both are turning right?",
    promptAr: "لماذا من الأفضل الانعطاف خلف المركبة المقابلة؟",
    options: [
      { en: "Better fuel use", ar: "استهلاك وقود أفضل", correct: false },
      { en: "Clearer view of traffic", ar: "رؤية أوضح للمرور", correct: true },
      { en: "Faster turn", ar: "انعطاف أسرع", correct: false },
      { en: "Avoid stopping", ar: "تجنب التوقف", correct: false }
    ],
    keywords: [
      { term: "turning right", ar: "الانعطاف يميناً", explainAr: "تغيير الاتجاه إلى اليمين." },
      { term: "hint", ar: "تلميح", explainAr: "Visibility improves safety." }
    ]
  },

  {
    id: "RR-18",
    topic: "rules-of-the-road",
    promptEn: "At a pelican crossing, the red light changes to flashing amber. What does this mean?",
    promptAr: "في ممر المشاة بإشارة ضوئية (Pelican Crossing)، يتحول الأحمر إلى أصفر وامض، ماذا يعني؟",
    options: [
      { en: "Stop immediately", ar: "توقف فوراً", correct: false },
      { en: "Proceed without checking", ar: "تابع دون فحص", correct: false },
      { en: "Give way to pedestrians still crossing", ar: "أفسح الطريق للمشاة الذين لا يزالون يعبرون", correct: true },
      { en: "Wait for green", ar: "انتظر الأخضر", correct: false }
    ],
    keywords: [
      { term: "pelican crossing", ar: "ممر المشاة بإشارة ضوئية (Pelican Crossing)", explainAr: "ممر مشاة مع إشارات ضوئية." },
      { term: "hint", ar: "تلميح", explainAr: "المشاة قد لا يزالون على ممر بيليكان." }
    ]
  },

  {
    id: "RR-19",
    topic: "rules-of-the-road",
    promptEn: "You see a pedestrian waiting at a zebra crossing. What should you do?",
    promptAr: "ترى مشاة ينتظرون عند ممر مشاة، ماذا تفعل؟",
    options: [
      { en: "Ignore them", ar: "تجاهلهم", correct: false },
      { en: "Speed past", ar: "مر بسرعة", correct: false },
      { en: "Be ready to slow or stop to let them cross", ar: "كن مستعداً للتباطؤ أو التوقف للسماح لهم بالعبور", correct: true },
      { en: "Sound horn", ar: "استخدم البوق", correct: false }
    ],
    keywords: [
      { term: "zebra crossing", ar: "ممر مشاة", explainAr: "ممر مشاة بخطوط متعرجة." },
      { term: "hint", ar: "تلميح", explainAr: "Pedestrians have priority." }
    ]
  },

  {
    id: "RR-20",
    topic: "rules-of-the-road",
    promptEn: "When may you drive in a bus lane?",
    promptAr: "متى يُسمح بالقيادة في مسار الحافلات؟",
    options: [
      { en: "Anytime", ar: "في أي وقت", correct: false },
      { en: "To overtake traffic", ar: "لتجاوز المرور", correct: false },
      { en: "Outside its hours of operation", ar: "خارج ساعات عملها", correct: true },
      { en: "Never", ar: "أبداً", correct: false }
    ],
    keywords: [
      { term: "bus lane", ar: "مسار حافلات", explainAr: "مسار مخصص للحافلات." },
      { term: "hint", ar: "تلميح", explainAr: "Always check lane operating times." }
    ]
  },

  {
    id: "RR-21",
    topic: "rules-of-the-road",
    promptEn: "Besides indicators, how can drivers communicate intentions to others?",
    promptAr: "بخلاف الإشارات، كيف يمكن التواصل مع مستخدمي الطريق؟",
    options: [
      { en: "Fog lights", ar: "أضواء الضباب", correct: false },
      { en: "Brake lights", ar: "أضواء الفرامل", correct: false },
      { en: "Interior lights", ar: "الأضواء الداخلية", correct: false },
      { en: "Vehicle position and movement", ar: "موضع المركبة وحركتها", correct: true }
    ],
    keywords: [
      { term: "communication", ar: "تواصل", explainAr: "طريقة إخبار الآخرين بنواياك." },
      { term: "hint", ar: "تلميح", explainAr: "Positioning is a form of communication." }
    ]
  },

  {
    id: "RR-22",
    topic: "rules-of-the-road",
    promptEn: "You're driving on a busy road and realise you're going the wrong way. What should you do?",
    promptAr: "تكتشف أنك تسير في الاتجاه الخاطئ، ماذا تفعل؟",
    options: [
      { en: "Reverse on main road", ar: "ارجع للخلف على الطريق الرئيسي", correct: false },
      { en: "Make a U-turn", ar: "قم باستدارة", correct: false },
      { en: "Turn around safely in a side road", ar: "استدر بأمان في طريق جانبي", correct: true },
      { en: "Stop and block traffic", ar: "توقف وأعيق المرور", correct: false }
    ],
    keywords: [
      { term: "wrong way", ar: "اتجاه خاطئ", explainAr: "السير في الاتجاه الخاطئ." },
      { term: "hint", ar: "تلميح", explainAr: "Never reverse on a main road." }
    ]
  },

  {
    id: "RR-23",
    topic: "rules-of-the-road",
    promptEn: "You realise too late that you're in the wrong lane at a busy junction. What should you do?",
    promptAr: "تكتشف متأخرًا أنك في المسار الخاطئ عند تقاطع مزدحم، ماذا تفعل؟",
    options: [
      { en: "Force your way across", ar: "أجبر طريقك للعبور", correct: false },
      { en: "Stop and block traffic", ar: "توقف وأعيق المرور", correct: false },
      { en: "Continue safely in the same lane", ar: "استمر بأمان في نفس المسار", correct: true },
      { en: "Use hand signals", ar: "استخدم إشارات اليد", correct: false }
    ],
    keywords: [
      { term: "wrong lane", ar: "مسار خاطئ", explainAr: "الوجود في المسار غير الصحيح." },
      { term: "hint", ar: "تلميح", explainAr: "Never change lanes suddenly at junctions." }
    ]
  },

  {
    id: "RR-24",
    topic: "rules-of-the-road",
    promptEn: "On a well-lit road at night in a built-up area, why should you use dipped headlights?",
    promptAr: "في طريق مضاء ليلاً داخل منطقة مأهولة، لماذا تستخدم الأضواء المنخفضة؟",
    options: [
      { en: "To see further", ar: "لرؤية أبعد", correct: false },
      { en: "To drive faster", ar: "للقيادة أسرع", correct: false },
      { en: "To switch to full beam quickly", ar: "للتبديل للضوء العالي بسرعة", correct: false },
      { en: "So others can see you clearly", ar: "ليتمكن الآخرون من رؤيتك بوضوح", correct: true }
    ],
    keywords: [
      { term: "dipped headlights", ar: "أضواء منخفضة", explainAr: "أضواء لا تعمي السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "Dipped headlights improve visibility for everyone." }
    ]
  },

  {
    id: "RR-25",
    topic: "rules-of-the-road",
    promptEn: "When may you legally drive without wearing a seat belt?",
    promptAr: "متى يُسمح قانونيًا بالقيادة دون حزام أمان؟",
    options: [
      { en: "While reversing as part of a manoeuvre", ar: "أثناء الرجوع للخلف كجزء من مناورة", correct: true },
      { en: "While moving off uphill", ar: "أثناء الانطلاق صعوداً", correct: false },
      { en: "In slow traffic", ar: "في المرور البطيء", correct: false },
      { en: "When testing brakes", ar: "عند اختبار الفرامل", correct: false }
    ],
    keywords: [
      { term: "seat belt", ar: "حزام أمان", explainAr: "حزام للحماية في حالة الحوادث." },
      { term: "hint", ar: "تلميح", explainAr: "Reversing manoeuvres are an exception." }
    ]
  },

  {
    id: "RR-26",
    topic: "rules-of-the-road",
    promptEn: "You're waiting at a level crossing. A train passes but the red lights continue flashing. What should you do?",
    promptAr: "تنتظر عند معبر قطار، مر القطار لكن الأضواء لا تزال تومض، ماذا تفعل؟",
    options: [
      { en: "Drive forward carefully", ar: "تقدّم بحذر", correct: false },
      { en: "Get out and investigate", ar: "اخرج وتحقق", correct: false },
      { en: "Phone the signal operator", ar: "اتصل بمشغل الإشارة", correct: false },
      { en: "Continue waiting", ar: "استمر في الانتظار", correct: true }
    ],
    keywords: [
      { term: "level crossing", ar: "معبر سكة حديد", explainAr: "تقاطع بين الطريق وسكة الحديد." },
      { term: "hint", ar: "تلميح", explainAr: "Another train may be coming." }
    ]
  },

  {
    id: "RR-27",
    topic: "rules-of-the-road",
    promptEn: "You're in the right-hand lane and see a sign that this lane is closed ahead. What should you do?",
    promptAr: "أنت في المسار الأيمن وترى إشارة إغلاقه لاحقًا، ماذا تفعل؟",
    options: [
      { en: "Stay until the queue", ar: "ابق حتى الطابور", correct: false },
      { en: "Move left immediately", ar: "انتقل يساراً فوراً", correct: false },
      { en: "Move left in good time", ar: "انتقل يساراً في الوقت المناسب", correct: true },
      { en: "Wait and decide later", ar: "انتظر وقرر لاحقاً", correct: false }
    ],
    keywords: [
      { term: "lane closed", ar: "مسار مغلق", explainAr: "مسار غير متاح للاستخدام." },
      { term: "hint", ar: "تلميح", explainAr: "Early lane changes reduce congestion." }
    ]
  },

  {
    id: "RR-28",
    topic: "rules-of-the-road",
    promptEn: "At night, when may you park on the right-hand side of the road?",
    promptAr: "متى يمكن الركن على الجانب الأيمن ليلاً؟",
    options: [
      { en: "Under street lights", ar: "تحت أعمدة الإنارة", correct: false },
      { en: "More than 10 m from junction", ar: "أكثر من 10 م من التقاطع", correct: false },
      { en: "In a one-way street only", ar: "في شارع باتجاه واحد فقط", correct: true },
      { en: "With sidelights on", ar: "مع الأضواء الجانبية مضاءة", correct: false }
    ],
    keywords: [
      { term: "parking", ar: "وقوف", explainAr: "إيقاف المركبة في مكان آمن." },
      { term: "hint", ar: "تلميح", explainAr: "Right-side parking is allowed only on one-way roads." }
    ]
  },

  {
    id: "RR-29",
    topic: "rules-of-the-road",
    promptEn: "In the UK, what speed limit usually applies where there are street lights but no speed signs?",
    promptAr: "ما حد السرعة المعتاد مع إنارة الشوارع دون إشارات؟",
    options: [
      { en: "30 mph", ar: "30 ميل/ساعة", correct: true },
      { en: "40 mph", ar: "40 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "speed limit", ar: "حد السرعة", explainAr: "الحد الأقصى للسرعة المسموح بها." },
      { term: "hint", ar: "تلميح", explainAr: "Street lighting usually indicates 30 mph." }
    ]
  },

  {
    id: "RR-30",
    topic: "rules-of-the-road",
    promptEn: "A cycle lane marked with a solid white line is in operation. What does this mean for drivers?",
    promptAr: "مسار دراجات بخط أبيض متصل، ماذا يعني ذلك؟",
    options: [
      { en: "Drivers may enter if careful", ar: "السائقون قد يدخلون إذا كانوا حذرين", correct: false },
      { en: "Drivers must not use the lane", ar: "السائقون لا يجب أن يستخدموا المسار", correct: true },
      { en: "Parking is allowed", ar: "الوقوف مسموح", correct: false },
      { en: "Motorcycles must use it", ar: "الدراجات النارية يجب أن تستخدمه", correct: false }
    ],
    keywords: [
      { term: "cycle lane", ar: "ممر دراجات", explainAr: "مسار مخصص للدراجات." },
      { term: "hint", ar: "تلميح", explainAr: "Solid lines must not be crossed." }
    ]
  },

  {
    id: "RR-31",
    topic: "rules-of-the-road",
    promptEn: "When should you normally use the right-hand lane on a three-lane dual carriageway?",
    promptAr: "متى يُستخدم المسار الأيمن عادةً؟",
    options: [
      { en: "When overtaking only", ar: "عند التجاوز فقط", correct: true },
      { en: "When turning right", ar: "عند الانعطاف يميناً", correct: false },
      { en: "Using cruise control", ar: "باستخدام التحكم بالسرعة", correct: false },
      { en: "Driving fast", ar: "القيادة بسرعة", correct: false }
    ],
    keywords: [
      { term: "dual carriageway", ar: "طريق مزدوج", explainAr: "طريق بمسارين منفصلين لكل اتجاه." },
      { term: "hint", ar: "تلميح", explainAr: "Keep left unless overtaking." }
    ]
  },

  {
    id: "RR-32",
    topic: "rules-of-the-road",
    promptEn: "On a one-way street, where may you overtake another vehicle?",
    promptAr: "أين يمكن التجاوز في شارع باتجاه واحد؟",
    options: [
      { en: "Left side only", ar: "الجانب الأيسر فقط", correct: false },
      { en: "Right side only", ar: "الجانب الأيمن فقط", correct: false },
      { en: "Either side if safe", ar: "أي جانب إذا كان آمناً", correct: true },
      { en: "Overtaking not allowed", ar: "التجاوز غير مسموح", correct: false }
    ],
    keywords: [
      { term: "one-way street", ar: "شارع باتجاه واحد", explainAr: "شارع يمكن السير فيه في اتجاه واحد فقط." },
      { term: "hint", ar: "تلميح", explainAr: "Direction of travel matters, not side." }
    ]
  },

  {
    id: "RR-33",
    topic: "rules-of-the-road",
    promptEn: "Parking restrictions are shown for certain days and times. What should you do during those times?",
    promptAr: "توجد قيود ركن في أوقات محددة، ماذا تفعل؟",
    options: [
      { en: "Park free anywhere", ar: "اركن مجاناً في أي مكان", correct: false },
      { en: "Park on yellow lines", ar: "اركن على الخطوط الصفراء", correct: false },
      { en: "Park in bays and pay if required", ar: "اركن في الأماكن المخصصة وادفع إذا لزم الأمر", correct: true },
      { en: "Ignore the sign", ar: "تجاهل الإشارة", correct: false }
    ],
    keywords: [
      { term: "parking restrictions", ar: "قيود الوقوف", explainAr: "قواعد حول متى وأين يمكن الوقوف." },
      { term: "hint", ar: "تلميح", explainAr: "Always follow time restrictions." }
    ]
  },

  {
    id: "RR-34",
    topic: "rules-of-the-road",
    promptEn: "At a roundabout, how should you signal when going straight ahead?",
    promptAr: "كيف تشير عند السير مباشرة في دوار؟",
    options: [
      { en: "Signal right then left", ar: "أشر يميناً ثم يساراً", correct: false },
      { en: "No signal on approach, signal left to exit", ar: "لا إشارة عند الاقتراب، أشر يساراً للخروج", correct: true },
      { en: "Signal right throughout", ar: "أشر يميناً طوال الوقت", correct: false },
      { en: "Signal after leaving", ar: "أشر بعد الخروج", correct: false }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري." },
      { term: "hint", ar: "تلميح", explainAr: "Signal your exit, not the approach." }
    ]
  },

  {
    id: "RR-35",
    topic: "rules-of-the-road",
    promptEn: "Who is legally authorised to signal you to stop?",
    promptAr: "من المخول قانونيًا بإيقافك؟",
    options: [
      { en: "Pedestrian", ar: "مشاة", correct: false },
      { en: "Bus driver", ar: "سائق حافلة", correct: false },
      { en: "Police officer", ar: "ضابط شرطة", correct: true },
      { en: "Motorcyclist", ar: "سائق دراجة نارية", correct: false }
    ],
    keywords: [
      { term: "authority", ar: "سلطة", explainAr: "الشخص المخول قانونياً." },
      { term: "hint", ar: "تلميح", explainAr: "Police have legal authority." }
    ]
  },

  {
    id: "RR-36",
    topic: "rules-of-the-road",
    promptEn: "Where is the safest place to park your car overnight?",
    promptAr: "أين المكان الأكثر أمانًا لركن السيارة ليلاً؟",
    options: [
      { en: "On a busy road", ar: "على طريق مزدحم", correct: false },
      { en: "In a garage", ar: "في مرآب", correct: true },
      { en: "Near red routes", ar: "قرب الطرق الحمراء", correct: false },
      { en: "In a dark car park", ar: "في موقف مظلم", correct: false }
    ],
    keywords: [
      { term: "parking", ar: "وقوف", explainAr: "إيقاف المركبة في مكان آمن." },
      { term: "hint", ar: "تلميح", explainAr: "Secure locations reduce theft." }
    ]
  },

  {
    id: "RR-37",
    topic: "rules-of-the-road",
    promptEn: "There's an obstruction on your side of the road. What should you do?",
    promptAr: "يوجد عائق في مسارك، ماذا تفعل؟",
    options: [
      { en: "Continue with priority", ar: "استمر مع الأولوية", correct: false },
      { en: "Accelerate past", ar: "تسارع للمرور", correct: false },
      { en: "Give way to oncoming traffic", ar: "أفسح الطريق للمرور القادم", correct: true },
      { en: "Wave others through", ar: "أومئ للآخرين بالمرور", correct: false }
    ],
    keywords: [
      { term: "obstruction", ar: "عائق", explainAr: "شيء يعيق الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Obstructions remove priority." }
    ]
  },

  {
    id: "RR-38",
    topic: "rules-of-the-road",
    promptEn: "When may you stop on an urban clearway?",
    promptAr: "متى يمكن التوقف في طريق خالٍ حضري؟",
    options: [
      { en: "To use phone", ar: "لاستخدام الهاتف", correct: false },
      { en: "To load/unload", ar: "للتحميل/التفريغ", correct: false },
      { en: "To set down or pick up passengers", ar: "لإنزال أو استقبال ركاب", correct: true },
      { en: "To ask directions", ar: "لسؤال الاتجاهات", correct: false }
    ],
    keywords: [
      { term: "clearway", ar: "طريق خالٍ", explainAr: "طريق ممنوع فيه التوقف." },
      { term: "hint", ar: "تلميح", explainAr: "No waiting, but brief pickup is allowed." }
    ]
  },

  {
    id: "RR-39",
    topic: "rules-of-the-road",
    promptEn: "What is the national speed limit for cars on a dual carriageway?",
    promptAr: "ما حد السرعة الوطني للسيارات على طريق مزدوج؟",
    options: [
      { en: "30 mph", ar: "30 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: false },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: true }
    ],
    keywords: [
      { term: "national speed limit", ar: "حد السرعة الوطني", explainAr: "حد السرعة الافتراضي على الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "Applies unless signs show otherwise." }
    ]
  },

  {
    id: "RR-40",
    topic: "rules-of-the-road",
    promptEn: "What's the safest way to turn around on a busy high street?",
    promptAr: "ما الطريقة الأكثر أمانًا لتغيير الاتجاه في شارع مزدحم؟",
    options: [
      { en: "U-turn", ar: "استدارة", correct: false },
      { en: "Reverse on main road", ar: "الرجوع للخلف على الطريق الرئيسي", correct: false },
      { en: "Ask someone to stop traffic", ar: "اطلب من أحد إيقاف المرور", correct: false },
      { en: "Turn around in a quiet side road", ar: "استدر في طريق جانبي هادئ", correct: true }
    ],
    keywords: [
      { term: "turn around", ar: "استدارة", explainAr: "تغيير الاتجاه." },
      { term: "hint", ar: "تلميح", explainAr: "Avoid turning in heavy traffic." }
    ]
  },

  {
    id: "RR-41",
    topic: "rules-of-the-road",
    promptEn: "You're waiting to turn right at a box junction with oncoming traffic. What should you do?",
    promptAr: "تنتظر للانعطاف يمينًا عند مربع تقاطع، ماذا تفعل؟",
    options: [
      { en: "Enter and wait inside", ar: "ادخل وانتظر داخله", correct: false },
      { en: "Wait before the junction until exit is clear", ar: "انتظر قبل التقاطع حتى يكون المخرج خالياً", correct: true },
      { en: "Turn anyway", ar: "انعطف على أي حال", correct: false },
      { en: "Enter when waved", ar: "ادخل عند الإشارة", correct: false }
    ],
    keywords: [
      { term: "box junction", ar: "مربع التقاطع", explainAr: "منطقة صفراء في التقاطع." },
      { term: "hint", ar: "تلميح", explainAr: "Do not block box junctions." }
    ]
  },

  {
    id: "RR-42",
    topic: "rules-of-the-road",
    promptEn: "Which road users can legally use toucan crossings?",
    promptAr: "من يمكنه استخدام Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)؟",
    options: [
      { en: "Cars and motorcycles", ar: "السيارات والدراجات النارية", correct: false },
      { en: "Cyclists and pedestrians", ar: "الدراجون والمشاة", correct: true },
      { en: "Buses and lorries", ar: "الحافلات والشاحنات", correct: false },
      { en: "Trams", ar: "الترام", correct: false }
    ],
    keywords: [
      { term: "toucan crossing", ar: "Toucan crossing (ممر المشاة وراكبي الدراجات المشترَك)", explainAr: "ممر مشاة يمكن للدراجين والمشاة استخدامه معاً." },
      { term: "hint", ar: "تلميح", explainAr: "Toucan = Two can cross." }
    ]
  },

  {
    id: "RR-43",
    topic: "rules-of-the-road",
    promptEn: "You're waiting at a level crossing. A train passes, but the red warning lights continue flashing. What should you do?",
    promptAr: "تنتظر عند معبر قطار، مر القطار لكن الأضواء الحمراء ما زالت تومض. ماذا تفعل؟",
    options: [
      { en: "Get out and investigate", ar: "اخرج وتحقق", correct: false },
      { en: "Telephone the signal operator", ar: "اتصل بمشغل الإشارة", correct: false },
      { en: "Continue waiting", ar: "استمر في الانتظار", correct: true },
      { en: "Drive across carefully", ar: "اعبر بحذر", correct: false }
    ],
    keywords: [
      { term: "level crossing", ar: "معبر سكة حديد", explainAr: "نقطة عبور سكة حديد." },
      { term: "hint", ar: "تلميح", explainAr: "Another train may still be approaching." }
    ]
  },

  {
    id: "RR-44",
    topic: "rules-of-the-road",
    promptEn: "What is the minimum distance you may park from a junction?",
    promptAr: "ما أقل مسافة يُسمح بالوقوف عندها من تقاطع؟",
    options: [
      { en: "10 metres (32 feet)", ar: "10 أمتار (32 قدم)", correct: true },
      { en: "12 metres", ar: "12 متر", correct: false },
      { en: "15 metres", ar: "15 متر", correct: false },
      { en: "20 metres", ar: "20 متر", correct: false }
    ],
    keywords: [
      { term: "parking distance", ar: "مسافة الوقوف", explainAr: "المسافة الدنيا من التقاطع." },
      { term: "hint", ar: "تلميح", explainAr: "Parking too close reduces visibility." }
    ]
  },

  {
    id: "RR-45",
    topic: "rules-of-the-road",
    promptEn: "When are you allowed to park in a bay reserved for disabled drivers?",
    promptAr: "متى يُسمح لك بالركن في موقف مخصص لذوي الإعاقة؟",
    options: [
      { en: "When you have a Blue Badge", ar: "عندما يكون لديك شارة زرقاء", correct: true },
      { en: "When you have a wheelchair", ar: "عندما يكون لديك كرسي متحرك", correct: false },
      { en: "When you hold an advanced licence", ar: "عندما تحمل رخصة متقدمة", correct: false },
      { en: "When the vehicle is adapted", ar: "عندما تكون المركبة معدلة", correct: false }
    ],
    keywords: [
      { term: "disabled bay", ar: "موقف ذوي الإعاقة", explainAr: "موقف مخصص لذوي الإعاقة." },
      { term: "hint", ar: "تلميح", explainAr: "Only Blue Badge holders may use these bays." }
    ]
  },

  {
    id: "RR-46",
    topic: "rules-of-the-road",
    promptEn: "You're turning right onto a dual carriageway. The central reservation is too narrow for your vehicle. What should you do?",
    promptAr: "تنعطف يمينًا إلى طريق مزدوج والحاجز الأوسط ضيق. ماذا تفعل؟",
    options: [
      { en: "Wait in the reservation", ar: "انتظر في الحاجز", correct: false },
      { en: "Stop in the first lane", ar: "توقف في المسار الأول", correct: false },
      { en: "Wait until the road is clear both ways", ar: "انتظر حتى يكون الطريق خالياً من كلا الاتجاهين", correct: true },
      { en: "Move forward to show intent", ar: "تقدم للأمام لإظهار النية", correct: false }
    ],
    keywords: [
      { term: "dual carriageway", ar: "طريق مزدوج", explainAr: "طريق بمسارين منفصلين لكل اتجاه." },
      { term: "hint", ar: "تلميح", explainAr: "Never block live traffic lanes." }
    ]
  },

  {
    id: "RR-47",
    topic: "rules-of-the-road",
    promptEn: "As you approach a left turn from a main road, how should you position your vehicle?",
    promptAr: "عند الاقتراب من انعطاف يسار من طريق رئيسي، كيف تتموضع؟",
    options: [
      { en: "Near the centre", ar: "قرب الوسط", correct: false },
      { en: "In the middle", ar: "في المنتصف", correct: false },
      { en: "Swing right", ar: "انحرف يميناً", correct: false },
      { en: "Keep well to the left", ar: "ابق جيداً إلى اليسار", correct: true }
    ],
    keywords: [
      { term: "positioning", ar: "التموضع", explainAr: "وضع المركبة على الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Correct positioning helps safety and flow." }
    ]
  },

  {
    id: "RR-48",
    topic: "rules-of-the-road",
    promptEn: "Which type of vehicle is most likely to take an unusual path at a roundabout?",
    promptAr: "أي مركبة يُحتمل أن تسلك مسارًا غير معتاد في الدوار؟",
    options: [
      { en: "Estate car", ar: "سيارة استيت", correct: false },
      { en: "Taxi", ar: "سيارة أجرة", correct: false },
      { en: "Delivery van", ar: "شاحنة توصيل", correct: false },
      { en: "Long vehicle", ar: "مركبة طويلة", correct: true }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري." },
      { term: "hint", ar: "تلميح", explainAr: "Long vehicles need extra space." }
    ]
  },

  {
    id: "RR-49",
    topic: "rules-of-the-road",
    promptEn: "Why should you drive slowly along residential streets with parked cars?",
    promptAr: "لماذا يجب القيادة ببطء في شارع سكني به سيارات متوقفة؟",
    options: [
      { en: "To avoid alarms", ar: "لتجنب الإنذارات", correct: false },
      { en: "To see delivery vehicles", ar: "لرؤية مركبات التوصيل", correct: false },
      { en: "Children may run out unexpectedly", ar: "قد يخرج الأطفال فجأة", correct: true },
      { en: "To allow overtaking", ar: "للسماح بالتجاوز", correct: false }
    ],
    keywords: [
      { term: "residential street", ar: "شارع سكني", explainAr: "شارع في منطقة سكنية." },
      { term: "hint", ar: "تلميح", explainAr: "Children can appear suddenly." }
    ]
  },

  {
    id: "RR-50",
    topic: "rules-of-the-road",
    promptEn: "A sign indicates a school crossing patrol. What does this mean for drivers?",
    promptAr: "إشارة تدل على عبور مدرسي. ماذا يعني ذلك للسائق؟",
    options: [
      { en: "National speed limit", ar: "حد السرعة الوطني", correct: false },
      { en: "No entry", ar: "ممنوع الدخول", correct: false },
      { en: "Be ready to stop for children", ar: "كن مستعداً للتوقف للأطفال", correct: true },
      { en: "Waiting restrictions", ar: "قيود الانتظار", correct: false }
    ],
    keywords: [
      { term: "school crossing patrol", ar: "عبور مدرسي", explainAr: "شخص يساعد الأطفال في عبور الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Always be prepared to stop." }
    ]
  },

  {
    id: "RR-51",
    topic: "rules-of-the-road",
    promptEn: "On a motorway in England, when must you stop your vehicle?",
    promptAr: "متى يجب التوقف على الطريق السريع في إنجلترا؟",
    options: [
      { en: "When signalled by a pedestrian", ar: "عند الإشارة من مشاة", correct: false },
      { en: "When another driver stops", ar: "عند توقف سائق آخر", correct: false },
      { en: "When directed by a traffic officer", ar: "عند توجيه من ضابط مرور", correct: true },
      { en: "When roadworks staff wave", ar: "عندما يلوح عمال الطرق", correct: false }
    ],
    keywords: [
      { term: "motorway", ar: "طريق سريع", explainAr: "طريق متعدد المسارات بسرعة عالية." },
      { term: "hint", ar: "تلميح", explainAr: "Traffic officers have authority." }
    ]
  },

  {
    id: "RR-52",
    topic: "rules-of-the-road",
    promptEn: "When going straight ahead at a roundabout, what signal should you give?",
    promptAr: "عند السير مباشرة في دوار، ما الإشارة التي تستخدمها؟",
    options: [
      { en: "Signal right", ar: "إشارة يمين", correct: false },
      { en: "No signal at any time", ar: "لا إشارة في أي وقت", correct: false },
      { en: "Signal left on approach", ar: "إشارة يسار عند الاقتراب", correct: false },
      { en: "Signal left when exiting", ar: "إشارة يسار عند الخروج", correct: true }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري." },
      { term: "hint", ar: "تلميح", explainAr: "Signal your exit clearly." }
    ]
  },

  {
    id: "RR-53",
    topic: "rules-of-the-road",
    promptEn: "When must you stop your vehicle by law?",
    promptAr: "متى يجب التوقف قانونيًا؟",
    options: [
      { en: "At give-way lines", ar: "عند خطوط إعطاء الأولوية", correct: false },
      { en: "Before a motorway", ar: "قبل طريق سريع", correct: false },
      { en: "After any collision causing injury or damage", ar: "بعد أي حادث يسبب إصابة أو ضرر", correct: true },
      { en: "At one-way streets", ar: "في شوارع ذات اتجاه واحد", correct: false }
    ],
    keywords: [
      { term: "legal requirement", ar: "متطلب قانوني", explainAr: "ما يفرضه القانون." },
      { term: "hint", ar: "تلميح", explainAr: "You must stop after collisions." }
    ]
  },

  {
    id: "RR-54",
    topic: "rules-of-the-road",
    promptEn: "Which vehicle may need extra room at a roundabout due to its size?",
    promptAr: "أي مركبة تحتاج مساحة إضافية في الدوار؟",
    options: [
      { en: "Sports car", ar: "سيارة رياضية", correct: false },
      { en: "Estate car", ar: "سيارة استيت", correct: false },
      { en: "Van", ar: "شاحنة صغيرة", correct: false },
      { en: "Long vehicle", ar: "مركبة طويلة", correct: true }
    ],
    keywords: [
      { term: "roundabout", ar: "دوار", explainAr: "تقاطع دائري." },
      { term: "hint", ar: "تلميح", explainAr: "Long vehicles swing wide." }
    ]
  },

  {
    id: "RR-55",
    topic: "rules-of-the-road",
    promptEn: "When may you enter a box junction?",
    promptAr: "متى يجوز دخول مربع التقاطع؟",
    options: [
      { en: "When traffic signals allow", ar: "عندما تسمح إشارات المرور", correct: false },
      { en: "When waved through", ar: "عندما يُلوح لك بالمرور", correct: false },
      { en: "When your exit road is clear", ar: "عندما يكون طريق خروجك خالياً", correct: true },
      { en: "When traffic is slow", ar: "عندما يكون المرور بطيئاً", correct: false }
    ],
    keywords: [
      { term: "box junction", ar: "مربع التقاطع", explainAr: "منطقة صفراء في التقاطع." },
      { term: "hint", ar: "تلميح", explainAr: "Never block your exit." }
    ]
  },

  {
    id: "RR-56",
    topic: "rules-of-the-road",
    promptEn: "At night on a road with a 40 mph limit, what should you do when parking?",
    promptAr: "ليلاً على طريق حدّه 40، ماذا تفعل عند الركن؟",
    options: [
      { en: "Face traffic", ar: "واجه المرور", correct: false },
      { en: "Use dipped headlights", ar: "استخدم الأضواء المنخفضة", correct: false },
      { en: "Use parking lights", ar: "استخدم أضواء الوقوف", correct: true },
      { en: "Park under a lamp", ar: "اركن تحت مصباح", correct: false }
    ],
    keywords: [
      { term: "parking lights", ar: "أضواء الوقوف", explainAr: "أضواء تستخدم عند الوقوف ليلاً." },
      { term: "hint", ar: "تلميح", explainAr: "Parking lights improve visibility." }
    ]
  },

  {
    id: "RR-57",
    topic: "rules-of-the-road",
    promptEn: "When reversing into a side road, when does your vehicle pose the greatest risk to others?",
    promptAr: "عند الرجوع إلى طريق جانبي، متى تكون المركبة أخطر؟",
    options: [
      { en: "After finishing", ar: "بعد الانتهاء", correct: false },
      { en: "Before starting", ar: "قبل البدء", correct: false },
      { en: "When fully in the side road", ar: "عندما تكون بالكامل في الطريق الجانبي", correct: false },
      { en: "When the front swings out", ar: "عندما ينحرف المقدمة للخارج", correct: true }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف." },
      { term: "hint", ar: "تلميح", explainAr: "Front swing can strike traffic." }
    ]
  },

  {
    id: "RR-58",
    topic: "rules-of-the-road",
    promptEn: "Where is the safest place to park your vehicle at night?",
    promptAr: "أين المكان الأكثر أمانًا للركن ليلاً؟",
    options: [
      { en: "Near police station", ar: "قرب مركز شرطة", correct: false },
      { en: "Quiet road", ar: "طريق هادئ", correct: false },
      { en: "Red route", ar: "طريق أحمر", correct: false },
      { en: "Well-lit area", ar: "منطقة مضاءة جيداً", correct: true }
    ],
    keywords: [
      { term: "parking safety", ar: "سلامة الوقوف", explainAr: "اختيار مكان آمن للوقوف." },
      { term: "hint", ar: "تلميح", explainAr: "Lighting deters crime." }
    ]
  },

  {
    id: "RR-59",
    topic: "rules-of-the-road",
    promptEn: "While driving over a level crossing, warning lights activate and an alarm sounds. What should you do?",
    promptAr: "أثناء عبور سكة، تعمل الأضواء والإنذار. ماذا تفعل؟",
    options: [
      { en: "Stop immediately", ar: "توقف فوراً", correct: false },
      { en: "Reverse", ar: "ارجع للخلف", correct: false },
      { en: "Clear the crossing immediately", ar: "أفرغ المعبر فوراً", correct: true },
      { en: "Use hazard lights", ar: "استخدم أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "level crossing", ar: "معبر سكة حديد", explainAr: "نقطة عبور سكة حديد." },
      { term: "hint", ar: "تلميح", explainAr: "Clear the crossing to avoid danger." }
    ]
  },

  {
    id: "RR-60",
    topic: "rules-of-the-road",
    promptEn: "When may you stop on a clearway?",
    promptAr: "متى يُسمح بالتوقف على طريق خالٍ؟",
    options: [
      { en: "Never", ar: "أبداً", correct: true },
      { en: "During daylight", ar: "خلال النهار", correct: false },
      { en: "Rush hour", ar: "ساعة الذروة", correct: false },
      { en: "When busy", ar: "عندما يكون مزدحماً", correct: false }
    ],
    keywords: [
      { term: "clearway", ar: "طريق خالٍ", explainAr: "طريق ممنوع التوقف عليه." },
      { term: "hint", ar: "تلميح", explainAr: "Clearways prohibit stopping." }
    ]
  },

  {
    id: "RR-61",
    topic: "rules-of-the-road",
    promptEn: "A sign shows a single carriageway speed limit. What is the maximum speed for a car towing a trailer?",
    promptAr: "ما السرعة القصوى لسيارة تسحب مقطورة على طريق مفرد؟",
    options: [
      { en: "30 mph", ar: "30 ميل/ساعة", correct: false },
      { en: "40 mph", ar: "40 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: true },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "towing", ar: "سحب", explainAr: "سحب مقطورة أو قافلة." },
      { term: "hint", ar: "تلميح", explainAr: "Towing reduces limits." }
    ]
  },

  {
    id: "RR-62",
    topic: "rules-of-the-road",
    promptEn: "You see roadworks with a temporary speed limit. What must you do?",
    promptAr: "ترى أعمال طرق وحد سرعة مؤقت. ماذا تفعل؟",
    options: [
      { en: "Ignore it", ar: "تجاهله", correct: false },
      { en: "Use judgement", ar: "استخدم الحكم", correct: false },
      { en: "Obey the displayed limit", ar: "اتبع الحد المعروض", correct: true },
      { en: "Only follow during rush hour", ar: "اتبع فقط خلال ساعة الذروة", correct: false }
    ],
    keywords: [
      { term: "temporary speed limit", ar: "حد سرعة مؤقت", explainAr: "حد سرعة مؤقت بسبب أعمال الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "Temporary limits are enforceable." }
    ]
  },

  {
    id: "RR-63",
    topic: "rules-of-the-road",
    promptEn: "A sign indicates the end of a controlled parking zone. What does this mean?",
    promptAr: "إشارة نهاية منطقة ركن منظم، ماذا تعني؟",
    options: [
      { en: "No through road", ar: "لا يوجد طريق للعبور", correct: false },
      { en: "Free parking now applies", ar: "الوقوف المجاني ينطبق الآن", correct: true },
      { en: "Traffic calming ends", ar: "تهدئة المرور تنتهي", correct: false },
      { en: "No entry", ar: "ممنوع الدخول", correct: false }
    ],
    keywords: [
      { term: "controlled parking zone", ar: "منطقة ركن منظم", explainAr: "منطقة فيها قيود على الوقوف." },
      { term: "hint", ar: "تلميح", explainAr: "Parking rules change after zone ends." }
    ]
  },

  {
    id: "RR-64",
    topic: "rules-of-the-road",
    promptEn: "Double white lines run along the centre of the road. When may you park on the left?",
    promptAr: "خطوط بيضاء مزدوجة في الوسط، متى يمكن الركن؟",
    options: [
      { en: "If line is broken", ar: "إذا كان الخط متقطعاً", correct: false },
      { en: "During daylight", ar: "خلال النهار", correct: false },
      { en: "To pick up passengers", ar: "لنقل ركاب", correct: false },
      { en: "Not at any time", ar: "لا في أي وقت", correct: true }
    ],
    keywords: [
      { term: "double white lines", ar: "خطوط بيضاء مزدوجة", explainAr: "خطوط بيضاء مزدوجة في منتصف الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Double white lines restrict parking." }
    ]
  },

  {
    id: "RR-65",
    topic: "rules-of-the-road",
    promptEn: "Only disabled bays are available and you are not disabled. What should you do?",
    promptAr: "المواقف المتاحة لذوي الإعاقة فقط وأنت غير معاق، ماذا تفعل؟",
    options: [
      { en: "Use it briefly", ar: "استخدمه لفترة قصيرة", correct: false },
      { en: "Stay with vehicle", ar: "ابق مع المركبة", correct: false },
      { en: "Keep one space free", ar: "اترك مساحة واحدة خالية", correct: false },
      { en: "Wait for a regular space", ar: "انتظر مكاناً عادياً", correct: true }
    ],
    keywords: [
      { term: "disabled bay", ar: "موقف ذوي الإعاقة", explainAr: "موقف مخصص لذوي الإعاقة." },
      { term: "hint", ar: "تلميح", explainAr: "Disabled bays are protected." }
    ]
  },

  {
    id: "RR-66",
    topic: "rules-of-the-road",
    promptEn: "How far are you allowed to reverse?",
    promptAr: "إلى أي مسافة يُسمح بالرجوع؟",
    options: [
      { en: "Car length", ar: "طول سيارة", correct: false },
      { en: "Around a corner", ar: "حول زاوية", correct: false },
      { en: "As far as necessary and safe", ar: "بقدر ما هو ضروري وآمن", correct: true },
      { en: "Length of street", ar: "طول الشارع", correct: false }
    ],
    keywords: [
      { term: "reversing", ar: "الرجوع للخلف", explainAr: "قيادة السيارة للخلف." },
      { term: "hint", ar: "تلميح", explainAr: "Reverse only when needed." }
    ]
  },

  {
    id: "RR-67",
    topic: "rules-of-the-road",
    promptEn: "What's the speed limit for a car towing a caravan on a dual carriageway?",
    promptAr: "ما حد السرعة لسيارة تسحب كرفان على طريق مزدوج؟",
    options: [
      { en: "40 mph", ar: "40 ميل/ساعة", correct: false },
      { en: "50 mph", ar: "50 ميل/ساعة", correct: false },
      { en: "60 mph", ar: "60 ميل/ساعة", correct: true },
      { en: "70 mph", ar: "70 ميل/ساعة", correct: false }
    ],
    keywords: [
      { term: "towing", ar: "سحب", explainAr: "سحب قافلة أو مقطورة." },
      { term: "hint", ar: "تلميح", explainAr: "Towing reduces speed limits." }
    ]
  },

  // --- SAFETY & YOUR VEHICLE (EXTRA) ---

  {
    id: "SV-21",
    topic: "safety-vehicle",
    promptEn: "If your car has blind-spot monitoring, what should you check regularly to ensure it works correctly?",
    promptAr: "إذا كانت سيارتك مزودة بنظام مراقبة النقطة العمياء، ماذا يجب أن تتحقق منه بانتظام؟",
    options: [
      { en: "Tyre pressure", ar: "ضغط الإطارات", correct: false },
      { en: "GPS signal", ar: "إشارة GPS", correct: false },
      { en: "Clean sensor areas on the vehicle", ar: "تنظيف مناطق المستشعرات على المركبة", correct: true },
      { en: "Dash cam position", ar: "موضع كاميرا لوحة القيادة", correct: false }
    ],
    keywords: [
      { term: "blind-spot monitoring", ar: "نظام مراقبة النقطة العمياء", explainAr: "نظام يساعد في اكتشاف المركبات في النقاط العمياء." },
      { term: "hint", ar: "تلميح", explainAr: "Sensors must be clean to detect vehicles accurately." }
    ]
  },

  {
    id: "SV-22",
    topic: "safety-vehicle",
    promptEn: "What's the best way to reduce the risk of your car being broken into when unattended?",
    promptAr: "ما أفضل طريقة لتقليل خطر سرقة سيارتك عند تركها؟",
    options: [
      { en: "Park near a taxi rank", ar: "الركن قرب موقف سيارات الأجرة", correct: false },
      { en: "Leave valuables on the floor", ar: "ترك الأشياء الثمينة على الأرض", correct: false },
      { en: "Take all valuables with you", ar: "أخذ جميع الأشياء الثمينة معك", correct: true },
      { en: "Park near a fire station", ar: "الركن قرب محطة إطفاء", correct: false }
    ],
    keywords: [
      { term: "theft prevention", ar: "منع السرقة", explainAr: "طرق لتقليل خطر سرقة السيارة." },
      { term: "hint", ar: "تلميح", explainAr: "Removing valuables removes temptation." }
    ]
  },

  {
    id: "SV-23",
    topic: "safety-vehicle",
    promptEn: "Why is it important to wear suitable footwear while driving?",
    promptAr: "لماذا من المهم ارتداء حذاء مناسب أثناء القيادة؟",
    options: [
      { en: "To adjust the seat", ar: "لضبط المقعد", correct: false },
      { en: "To walk after breakdown", ar: "للمشي بعد العطل", correct: false },
      { en: "To prevent pedal wear", ar: "لمنع تآكل الدواسات", correct: false },
      { en: "To maintain proper pedal control", ar: "للحفاظ على التحكم الصحيح بالدواسات", correct: true }
    ],
    keywords: [
      { term: "footwear", ar: "الحذاء", explainAr: "الحذاء المناسب مهم للتحكم بالدواسات." },
      { term: "hint", ar: "تلميح", explainAr: "Good grip ensures safe braking and acceleration." }
    ]
  },

  {
    id: "SV-24",
    topic: "safety-vehicle",
    promptEn: "What is most likely to increase fuel waste?",
    promptAr: "ما الشيء الأكثر احتمالًا لهدر الوقود؟",
    options: [
      { en: "Reducing speed", ar: "تقليل السرعة", correct: false },
      { en: "Driving on motorways", ar: "القيادة على الطرق السريعة", correct: false },
      { en: "Using different fuel brands", ar: "استخدام علامات وقود مختلفة", correct: false },
      { en: "Under-inflated tyres", ar: "الإطارات منخفضة الضغط", correct: true }
    ],
    keywords: [
      { term: "fuel consumption", ar: "استهلاك الوقود", explainAr: "كمية الوقود المستخدمة." },
      { term: "hint", ar: "تلميح", explainAr: "Low tyre pressure increases rolling resistance." }
    ]
  },

  {
    id: "SV-25",
    topic: "safety-vehicle",
    promptEn: "When may a passenger legally travel without wearing a seat belt?",
    promptAr: "متى يُسمح للراكب بالسفر دون حزام أمان؟",
    options: [
      { en: "Sitting in the rear seat", ar: "الجلوس في المقعد الخلفي", correct: false },
      { en: "Under 14 years old", ar: "أقل من 14 سنة", correct: false },
      { en: "Short journeys", ar: "رحلات قصيرة", correct: false },
      { en: "When medically exempt", ar: "عند الإعفاء الطبي", correct: true }
    ],
    keywords: [
      { term: "seat belt", ar: "حزام الأمان", explainAr: "حزام للحماية في حالة الحوادث." },
      { term: "hint", ar: "تلميح", explainAr: "Medical exemptions must be official." }
    ]
  },

  {
    id: "SV-26",
    topic: "safety-vehicle",
    promptEn: "How does fitting a roof rack affect your car?",
    promptAr: "كيف يؤثر تركيب حامل سقف على سيارتك؟",
    options: [
      { en: "Less wind noise", ar: "ضوضاء رياح أقل", correct: false },
      { en: "Faster acceleration", ar: "تسارع أسرع", correct: false },
      { en: "Increased fuel consumption", ar: "زيادة استهلاك الوقود", correct: true },
      { en: "Lower oil usage", ar: "استخدام زيت أقل", correct: false }
    ],
    keywords: [
      { term: "roof rack", ar: "حامل السقف", explainAr: "حامل على سطح السيارة لحمل الأمتعة." },
      { term: "hint", ar: "تلميح", explainAr: "Extra drag increases fuel use." }
    ]
  },

  {
    id: "SV-27",
    topic: "safety-vehicle",
    promptEn: "Which driver-assistance system is designed to actively prevent collisions?",
    promptAr: "أي نظام مساعدة للسائق مصمم لمنع الحوادث فعليًا؟",
    options: [
      { en: "Cruise control", ar: "التحكم بالسرعة", correct: false },
      { en: "Night vision", ar: "الرؤية الليلية", correct: false },
      { en: "Drowsiness alert", ar: "تنبيه النعاس", correct: false },
      { en: "Emergency braking system", ar: "نظام الفرملة الطارئة", correct: true }
    ],
    keywords: [
      { term: "driver-assistance", ar: "مساعدة السائق", explainAr: "أنظمة تساعد السائق في القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Emergency braking can apply brakes automatically." }
    ]
  },

  {
    id: "SV-28",
    topic: "safety-vehicle",
    promptEn: "What does it usually indicate if a red brake warning light stays on while driving?",
    promptAr: "ماذا يدل عليه بقاء ضوء تحذير الفرامل مضاءً أثناء القيادة؟",
    options: [
      { en: "Low engine oil", ar: "زيت محرك منخفض", correct: false },
      { en: "Fault in braking system", ar: "عطل في نظام الفرامل", correct: true },
      { en: "Seat belt not fastened", ar: "حزام الأمان غير مربوط", correct: false },
      { en: "Rear light failure", ar: "فشل الضوء الخلفي", correct: false }
    ],
    keywords: [
      { term: "brake warning light", ar: "ضوء تحذير الفرامل", explainAr: "ضوء تحذيري يشير إلى مشكلة في الفرامل." },
      { term: "hint", ar: "تلميح", explainAr: "Brake warnings must be checked immediately." }
    ]
  },

  {
    id: "SV-29",
    topic: "safety-vehicle",
    promptEn: "An 11-year-old child is sitting in the front seat and is under 1.35 m tall. What restraint must be used?",
    promptAr: "طفل عمره 11 سنة وأقصر من 1.35 م يجلس في المقعد الأمامي، ماذا يجب استخدامه؟",
    options: [
      { en: "Adult seat belt", ar: "حزام أمان للبالغين", correct: false },
      { en: "Suitable child restraint", ar: "مقعد أمان مناسب للأطفال", correct: true },
      { en: "Self-fastened belt", ar: "حزام مربوط ذاتيًا", correct: false },
      { en: "Clear view ahead", ar: "رؤية واضحة للأمام", correct: false }
    ],
    keywords: [
      { term: "child restraint", ar: "مقعد أمان للأطفال", explainAr: "مقعد خاص للأطفال للحماية." },
      { term: "hint", ar: "تلميح", explainAr: "Height matters more than age for restraints." }
    ]
  },

  {
    id: "SV-30",
    topic: "safety-vehicle",
    promptEn: "Why is parking in a secure car park recommended?",
    promptAr: "لماذا يُنصح بالركن في موقف سيارات آمن؟",
    options: [
      { en: "Easier to find car", ar: "أسهل للعثور على السيارة", correct: false },
      { en: "Protection from weather", ar: "الحماية من الطقس", correct: false },
      { en: "Lower parking costs", ar: "تكاليف ركن أقل", correct: false },
      { en: "Helps deter theft", ar: "يساعد في ردع السرقة", correct: true }
    ],
    keywords: [
      { term: "secure car park", ar: "موقف سيارات آمن", explainAr: "موقف سيارات محمي." },
      { term: "hint", ar: "تلميح", explainAr: "Security reduces theft risk." }
    ]
  },

  {
    id: "SV-31",
    topic: "safety-vehicle",
    promptEn: "How should you dispose of a used car battery?",
    promptAr: "كيف يجب التخلص من بطارية سيارة مستعملة؟",
    options: [
      { en: "Bury it", ar: "دفنها", correct: false },
      { en: "Put in household bin", ar: "وضعها في سلة المهملات المنزلية", correct: false },
      { en: "Take to authorised recycling site", ar: "أخذها إلى موقع إعادة تدوير معتمد", correct: true },
      { en: "Leave on waste land", ar: "تركها على أرض النفايات", correct: false }
    ],
    keywords: [
      { term: "battery disposal", ar: "التخلص من البطارية", explainAr: "طريقة التخلص الآمنة من البطارية." },
      { term: "hint", ar: "تلميح", explainAr: "Batteries are hazardous waste." }
    ]
  },

  {
    id: "SV-32",
    topic: "safety-vehicle",
    promptEn: "You must arrive on time for an appointment. How should you plan your journey?",
    promptAr: "يجب أن تصل في الوقت المحدد، كيف تخطط لرحلتك؟",
    options: [
      { en: "Travel at busy times", ar: "السفر في أوقات مزدحمة", correct: false },
      { en: "Prevent overtaking", ar: "منع التجاوز", correct: false },
      { en: "Allow extra time", ar: "السماح بوقت إضافي", correct: true },
      { en: "Avoid national speed limit roads", ar: "تجنب الطرق بحد السرعة الوطني", correct: false }
    ],
    keywords: [
      { term: "journey planning", ar: "تخطيط الرحلة", explainAr: "التخطيط المسبق للرحلة." },
      { term: "hint", ar: "تلميح", explainAr: "Extra time reduces stress and risk." }
    ]
  },

  {
    id: "SV-33",
    topic: "safety-vehicle",
    promptEn: "What symptom suggests that your wheels are unbalanced?",
    promptAr: "ما العلامة التي تدل على أن العجلات غير متوازنة؟",
    options: [
      { en: "Brake failure", ar: "فشل الفرامل", correct: false },
      { en: "Tyre deflation", ar: "انكماش الإطار", correct: false },
      { en: "Steering vibration", ar: "اهتزاز التوجيه", correct: true },
      { en: "Pulling to one side", ar: "الانحراف إلى جانب واحد", correct: false }
    ],
    keywords: [
      { term: "wheel balance", ar: "توازن العجلات", explainAr: "التوازن الصحيح للعجلات." },
      { term: "hint", ar: "تلميح", explainAr: "Vibration increases with speed." }
    ]
  },

  {
    id: "SV-34",
    topic: "safety-vehicle",
    promptEn: "What action helps reduce fuel consumption?",
    promptAr: "ما الإجراء الذي يقلل استهلاك الوقود؟",
    options: [
      { en: "Rapid acceleration", ar: "التسارع السريع", correct: false },
      { en: "Heavy braking", ar: "الفرملة الثقيلة", correct: false },
      { en: "Staying in low gears", ar: "البقاء في الغيارات المنخفضة", correct: false },
      { en: "Driving more smoothly and steadily", ar: "القيادة بسلاسة وثبات أكثر", correct: true }
    ],
    keywords: [
      { term: "fuel efficiency", ar: "كفاءة الوقود", explainAr: "استخدام أقل للوقود." },
      { term: "hint", ar: "تلميح", explainAr: "Gentle driving saves fuel." }
    ]
  },

  {
    id: "SV-35",
    topic: "safety-vehicle",
    promptEn: "How can drivers help protect the environment?",
    promptAr: "كيف يمكن للسائقين حماية البيئة؟",
    options: [
      { en: "Harsh acceleration", ar: "التسارع العنيف", correct: false },
      { en: "Gentle acceleration", ar: "التسارع اللطيف", correct: true },
      { en: "Using leaded fuel", ar: "استخدام وقود محتوي على الرصاص", correct: false },
      { en: "Driving faster", ar: "القيادة بسرعة أكبر", correct: false }
    ],
    keywords: [
      { term: "environment", ar: "البيئة", explainAr: "الحفاظ على البيئة." },
      { term: "hint", ar: "تلميح", explainAr: "Smooth driving reduces emissions." }
    ]
  },

  {
    id: "SV-36",
    topic: "safety-vehicle",
    promptEn: "When is the best time to check tyre pressures?",
    promptAr: "متى يكون أفضل وقت لفحص ضغط الإطارات؟",
    options: [
      { en: "After long drive", ar: "بعد رحلة طويلة", correct: false },
      { en: "At high speed", ar: "عند السرعة العالية", correct: false },
      { en: "When tyres are hot", ar: "عندما تكون الإطارات ساخنة", correct: false },
      { en: "When tyres are cold", ar: "عندما تكون الإطارات باردة", correct: true }
    ],
    keywords: [
      { term: "tyre pressure", ar: "ضغط الإطارات", explainAr: "الضغط الصحيح للإطارات." },
      { term: "hint", ar: "تلميح", explainAr: "Cold tyres give accurate readings." }
    ]
  },

  {
    id: "SV-37",
    topic: "safety-vehicle",
    promptEn: "What should you do if the ABS warning light stays on while driving?",
    promptAr: "ماذا تفعل إذا ظل ضوء ABS مضاءً أثناء القيادة؟",
    options: [
      { en: "Check fluid level", ar: "فحص مستوى السائل", correct: false },
      { en: "Check parking brake", ar: "فحص فرامل اليد", correct: false },
      { en: "Continue driving", ar: "متابعة القيادة", correct: false },
      { en: "Have the brakes checked immediately", ar: "فحص الفرامل فوراً", correct: true }
    ],
    keywords: [
      { term: "ABS", ar: "نظام الفرملة المانعة للانغلاق", explainAr: "نظام يساعد في منع انغلاق العجلات." },
      { term: "hint", ar: "تلميح", explainAr: "ABS faults affect braking safety." }
    ]
  },

  {
    id: "SV-38",
    topic: "safety-vehicle",
    promptEn: "What makes tyres illegal to use on the road?",
    promptAr: "ما الذي يجعل الإطارات غير قانونية للاستخدام؟",
    options: [
      { en: "Different tread patterns", ar: "أنماط مداس مختلفة", correct: false },
      { en: "Different brands", ar: "علامات تجارية مختلفة", correct: false },
      { en: "Large deep sidewall cuts", ar: "جروح كبيرة وعميقة في جدار الإطار", correct: true },
      { en: "Second-hand purchase", ar: "الشراء المستعمل", correct: false }
    ],
    keywords: [
      { term: "illegal tyres", ar: "إطارات غير قانونية", explainAr: "إطارات لا يمكن استخدامها قانونياً." },
      { term: "hint", ar: "تلميح", explainAr: "Structural damage is unsafe." }
    ]
  },

  {
    id: "SV-39",
    topic: "safety-vehicle",
    promptEn: "Why should you plan your journey to avoid peak traffic times?",
    promptAr: "لماذا يُنصح بتجنب أوقات الذروة؟",
    options: [
      { en: "Longer journey", ar: "رحلة أطول", correct: false },
      { en: "More stress", ar: "مزيد من التوتر", correct: false },
      { en: "Easier, smoother trip", ar: "رحلة أسهل وأكثر سلاسة", correct: true },
      { en: "More congestion", ar: "مزيد من الازدحام", correct: false }
    ],
    keywords: [
      { term: "peak traffic", ar: "حركة المرور في الذروة", explainAr: "أوقات الازدحام المروري." },
      { term: "hint", ar: "تلميح", explainAr: "Less traffic means fewer delays." }
    ]
  },

  {
    id: "SV-40",
    topic: "safety-vehicle",
    promptEn: "What can you expect if you frequently accelerate hard and brake heavily?",
    promptAr: "ماذا تتوقع عند التسارع والفرملة العنيفة باستمرار؟",
    options: [
      { en: "Reduced pollution", ar: "تقليل التلوث", correct: false },
      { en: "Increased road safety", ar: "زيادة السلامة على الطريق", correct: false },
      { en: "Reduced fuel use", ar: "تقليل استخدام الوقود", correct: false },
      { en: "Increased fuel consumption", ar: "زيادة استهلاك الوقود", correct: true }
    ],
    keywords: [
      { term: "fuel consumption", ar: "استهلاك الوقود", explainAr: "كمية الوقود المستخدمة." },
      { term: "hint", ar: "تلميح", explainAr: "Aggressive driving wastes fuel." }
    ]
  },

  {
    id: "SV-41",
    topic: "safety-vehicle",
    promptEn: "How do under-inflated tyres affect your vehicle?",
    promptAr: "كيف تؤثر الإطارات غير المنفوخة بشكل كافٍ على سيارتك؟",
    options: [
      { en: "Indicator flash rate increases", ar: "يزيد معدل وميض المؤشر", correct: false },
      { en: "Headlights aim higher", ar: "تستهدف الأضواء أعلى", correct: false },
      { en: "Gear changes become stiff", ar: "تصبح تغييرات التروس صلبة", correct: false },
      { en: "Stopping distance increases", ar: "تزيد مسافة التوقف", correct: true }
    ],
    keywords: [
      { term: "under-inflated tyres", ar: "إطارات غير منفوخة", explainAr: "إطارات بضغط هواء منخفض." },
      { term: "hint", ar: "تلميح", explainAr: "Low tyre pressure reduces grip and braking efficiency." }
    ]
  },

  {
    id: "SV-42",
    topic: "safety-vehicle",
    promptEn: "While driving on a dual carriageway, which driver-assistance system helps keep the car within lane markings?",
    promptAr: "أثناء القيادة على طريق مزدوج، أي نظام مساعدة يساعد على البقاء داخل المسار؟",
    options: [
      { en: "Blind-spot assist", ar: "مساعدة النقطة العمياء", correct: false },
      { en: "Traffic jam assist", ar: "مساعدة ازدحام المرور", correct: false },
      { en: "Intelligent speed assist", ar: "مساعدة السرعة الذكية", correct: false },
      { en: "Lane-keep assist", ar: "مساعدة الحفاظ على المسار", correct: true }
    ],
    keywords: [
      { term: "lane-keep assist", ar: "مساعدة الحفاظ على المسار", explainAr: "نظام يساعد على البقاء داخل المسار." },
      { term: "hint", ar: "تلميح", explainAr: "Lane-keep systems detect road markings." }
    ]
  },

  {
    id: "SV-43",
    topic: "safety-vehicle",
    promptEn: "How can you reduce the environmental impact of your vehicle?",
    promptAr: "كيف يمكنك تقليل الأثر البيئي لسيارتك؟",
    options: [
      { en: "Avoid servicing", ar: "تجنب الصيانة", correct: false },
      { en: "Drive faster than normal", ar: "القيادة أسرع من المعتاد", correct: false },
      { en: "Only make short trips", ar: "القيام برحلات قصيرة فقط", correct: false },
      { en: "Keep engine revs low", ar: "الحفاظ على دورات المحرك منخفضة", correct: true }
    ],
    keywords: [
      { term: "environmental impact", ar: "الأثر البيئي", explainAr: "تأثير المركبة على البيئة." },
      { term: "hint", ar: "تلميح", explainAr: "Lower revs reduce emissions and fuel use." }
    ]
  },

  {
    id: "SV-44",
    topic: "safety-vehicle",
    promptEn: "On a quiet motorway, which driver-assistance feature is most likely to help prevent drifting out of lane?",
    promptAr: "على طريق سريع هادئ، أي نظام يساعد على منع الانحراف عن المسار؟",
    options: [
      { en: "Traffic jam assist", ar: "مساعدة ازدحام المرور", correct: false },
      { en: "Night vision", ar: "الرؤية الليلية", correct: false },
      { en: "Intelligent speed assist", ar: "مساعدة السرعة الذكية", correct: false },
      { en: "Lane-departure warning", ar: "تحذير مغادرة المسار", correct: true }
    ],
    keywords: [
      { term: "lane-departure warning", ar: "تحذير مغادرة المسار", explainAr: "نظام يحذر عند الانحراف عن المسار." },
      { term: "hint", ar: "تلميح", explainAr: "Lane-departure systems warn if you drift." }
    ]
  },

  {
    id: "SV-45",
    topic: "safety-vehicle",
    promptEn: "When are you NOT allowed to sound your vehicle's horn in a built-up area?",
    promptAr: "متى لا يُسمح باستخدام بوق السيارة في المناطق السكنية؟",
    options: [
      { en: "Between 10 pm and 6 am", ar: "بين الساعة 10 مساءً و 6 صباحاً", correct: true },
      { en: "At any time", ar: "في أي وقت", correct: false },
      { en: "Between 11:30 pm and 7 am", ar: "بين الساعة 11:30 مساءً و 7 صباحاً", correct: false },
      { en: "Only on main roads", ar: "فقط على الطرق الرئيسية", correct: false }
    ],
    keywords: [
      { term: "horn", ar: "بوق", explainAr: "صوت تحذيري للمركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Horn use is restricted at night in built-up areas." }
    ]
  },

  {
    id: "SV-46",
    topic: "safety-vehicle",
    promptEn: "What should you do if your car pulls to one side when braking?",
    promptAr: "ماذا تفعل إذا انحرفت السيارة إلى جهة واحدة عند الفرملة؟",
    options: [
      { en: "Pump the brake pedal", ar: "ضغط دواسة الفرامل", correct: false },
      { en: "Increase tyre pressure", ar: "زيادة ضغط الإطارات", correct: false },
      { en: "Use the parking brake", ar: "استخدام فرامل اليد", correct: false },
      { en: "Have the brakes checked promptly", ar: "فحص الفرامل فوراً", correct: true }
    ],
    keywords: [
      { term: "braking", ar: "الفرملة", explainAr: "استخدام الفرامل لإيقاف المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Uneven braking indicates a fault." }
    ]
  },

  {
    id: "SV-47",
    topic: "safety-vehicle",
    promptEn: "What driving behaviour is most likely to increase fuel consumption?",
    promptAr: "أي أسلوب قيادة يزيد استهلاك الوقود؟",
    options: [
      { en: "Staying in high gears", ar: "البقاء في التروس العالية", correct: false },
      { en: "Poor steering control", ar: "التحكم الضعيف في التوجيه", correct: false },
      { en: "Harsh braking and acceleration", ar: "الفرملة والتسارع العنيف", correct: true },
      { en: "Smooth cornering", ar: "الانعطاف السلس", correct: false }
    ],
    keywords: [
      { term: "fuel consumption", ar: "استهلاك الوقود", explainAr: "كمية الوقود المستخدمة." },
      { term: "hint", ar: "تلميح", explainAr: "Aggressive driving wastes fuel." }
    ]
  },

  {
    id: "SV-48",
    topic: "safety-vehicle",
    promptEn: "What should you do when leaving your car unattended for a short time?",
    promptAr: "ماذا يجب أن تفعل عند ترك سيارتك لفترة قصيرة؟",
    options: [
      { en: "Leave engine running", ar: "ترك المحرك يعمل", correct: false },
      { en: "Leave key inside", ar: "ترك المفتاح بالداخل", correct: false },
      { en: "Lock the car and remove the key", ar: "قفل السيارة وإزالة المفتاح", correct: true },
      { en: "Park near a warden", ar: "الركن قرب حارس", correct: false }
    ],
    keywords: [
      { term: "unattended", ar: "دون مراقبة", explainAr: "ترك المركبة بدون مراقبة." },
      { term: "hint", ar: "تلميح", explainAr: "Locking reduces theft risk." }
    ]
  },

  {
    id: "SV-49",
    topic: "safety-vehicle",
    promptEn: "How can you avoid unnecessary fuel waste?",
    promptAr: "كيف تتجنب هدر الوقود؟",
    options: [
      { en: "Rev engine in low gears", ar: "زيادة دورات المحرك في التروس المنخفضة", correct: false },
      { en: "Drive faster", ar: "القيادة أسرع", correct: false },
      { en: "Keep empty roof rack fitted", ar: "الحفاظ على حامل السقف الفارغ", correct: false },
      { en: "Service the vehicle regularly", ar: "صيانة المركبة بانتظام", correct: true }
    ],
    keywords: [
      { term: "fuel waste", ar: "هدر الوقود", explainAr: "استخدام الوقود بشكل غير ضروري." },
      { term: "hint", ar: "تلميح", explainAr: "Well-maintained engines run efficiently." }
    ]
  },

  {
    id: "SV-50",
    topic: "safety-vehicle",
    promptEn: "What's likely to happen if too much engine oil is added?",
    promptAr: "ماذا يحدث إذا تم إضافة كمية زائدة من زيت المحرك؟",
    options: [
      { en: "Timing belt slips", ar: "انزلاق حزام التوقيت", correct: false },
      { en: "Air intake blocks", ar: "انسداد مدخل الهواء", correct: false },
      { en: "Oil seals may leak", ar: "قد تتسرب حشوات الزيت", correct: true },
      { en: "Clutch locks", ar: "قفل القابض", correct: false }
    ],
    keywords: [
      { term: "engine oil", ar: "زيت المحرك", explainAr: "زيت لتشحيم المحرك." },
      { term: "hint", ar: "تلميح", explainAr: "Excess oil can damage seals." }
    ]
  },

  {
    id: "SV-51",
    topic: "safety-vehicle",
    promptEn: "What's the benefit of following the manufacturer's service schedule?",
    promptAr: "ما فائدة الالتزام بجدول صيانة الشركة المصنعة؟",
    options: [
      { en: "Lower insurance costs", ar: "تكاليف تأمين أقل", correct: false },
      { en: "Reduced journey time", ar: "وقت رحلة أقل", correct: false },
      { en: "Vehicle reliability improves", ar: "تحسن موثوقية المركبة", correct: true },
      { en: "Lower vehicle tax", ar: "ضريبة مركبة أقل", correct: false }
    ],
    keywords: [
      { term: "service schedule", ar: "جدول الصيانة", explainAr: "جدول زمني للصيانة الدورية." },
      { term: "hint", ar: "تلميح", explainAr: "Regular servicing prevents breakdowns." }
    ]
  },

  {
    id: "SV-52",
    topic: "safety-vehicle",
    promptEn: "How can you plan a route before a long journey?",
    promptAr: "كيف تخطط لمسارك قبل رحلة طويلة؟",
    options: [
      { en: "Ask a garage", ar: "اسأل ورشة", correct: false },
      { en: "Check handbook", ar: "راجع الكتيب", correct: false },
      { en: "Consult travel agent", ar: "استشر وكيل سفر", correct: false },
      { en: "Use an online route planner", ar: "استخدم مخطط مسار إلكتروني", correct: true }
    ],
    keywords: [
      { term: "route planning", ar: "تخطيط المسار", explainAr: "تخطيط المسار قبل الرحلة." },
      { term: "hint", ar: "تلميح", explainAr: "Route planners help avoid delays." }
    ]
  },

  {
    id: "SV-53",
    topic: "safety-vehicle",
    promptEn: "What makes a vehicle environmentally friendly compared to others?",
    promptAr: "ما الذي يجعل المركبة صديقة للبيئة؟",
    options: [
      { en: "Diesel power", ar: "طاقة الديزل", correct: false },
      { en: "Petrol engine", ar: "محرك بنزين", correct: false },
      { en: "Electric power", ar: "طاقة كهربائية", correct: true },
      { en: "Gravity powered", ar: "مدعوم بالجاذبية", correct: false }
    ],
    keywords: [
      { term: "environmentally friendly", ar: "صديق للبيئة", explainAr: "لا يضر بالبيئة." },
      { term: "hint", ar: "تلميح", explainAr: "Electric vehicles produce no exhaust emissions." }
    ]
  },

  {
    id: "SV-54",
    topic: "safety-vehicle",
    promptEn: "Why should you plan an alternative route before starting a journey?",
    promptAr: "لماذا يجب التخطيط لمسار بديل قبل الرحلة؟",
    options: [
      { en: "Maps have different scales", ar: "الخرائط لها مقاييس مختلفة", correct: false },
      { en: "Original route may be blocked", ar: "قد يكون المسار الأصلي مسدوداً", correct: true },
      { en: "Congestion charges apply", ar: "تطبق رسوم الازدحام", correct: false },
      { en: "Tractors cause delays", ar: "الجرارات تسبب تأخيرات", correct: false }
    ],
    keywords: [
      { term: "alternative route", ar: "مسار بديل", explainAr: "مسار بديل في حالة إغلاق الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Alternatives save time if roads close." }
    ]
  },

  {
    id: "SV-55",
    topic: "safety-vehicle",
    promptEn: "What action helps reduce overall traffic levels?",
    promptAr: "ما الإجراء الذي يقلل الازدحام المروري؟",
    options: [
      { en: "Driving everywhere", ar: "القيادة في كل مكان", correct: false },
      { en: "Using bus lanes", ar: "استخدام مسارات الحافلات", correct: false },
      { en: "Short journeys by walking or cycling", ar: "الرحلات القصيرة سيراً أو بالدراجة", correct: true },
      { en: "Bigger engines", ar: "محركات أكبر", correct: false }
    ],
    keywords: [
      { term: "traffic levels", ar: "مستويات المرور", explainAr: "كمية المرور على الطرق." },
      { term: "hint", ar: "تلميح", explainAr: "Fewer car trips reduce congestion." }
    ]
  },

  {
    id: "SV-56",
    topic: "safety-vehicle",
    promptEn: "What is the main purpose of advanced driver-assistance systems (ADAS)?",
    promptAr: "ما الهدف الرئيسي من أنظمة مساعدة السائق المتقدمة؟",
    options: [
      { en: "Reduce pollution", ar: "تقليل التلوث", correct: false },
      { en: "Shorten journeys", ar: "تقصير الرحلات", correct: false },
      { en: "Make driving easier", ar: "تسهيل القيادة", correct: false },
      { en: "Improve road safety", ar: "تحسين السلامة على الطريق", correct: true }
    ],
    keywords: [
      { term: "ADAS", ar: "أنظمة مساعدة السائق المتقدمة", explainAr: "أنظمة تساعد السائق في القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "ADAS systems are safety-focused." }
    ]
  },

  {
    id: "SV-57",
    topic: "safety-vehicle",
    promptEn: "When should you check your engine oil level?",
    promptAr: "متى يجب فحص مستوى زيت المحرك؟",
    options: [
      { en: "When engine is hot", ar: "عندما يكون المحرك ساخناً", correct: false },
      { en: "Every time you drive", ar: "في كل مرة تقود فيها", correct: false },
      { en: "Before a long journey", ar: "قبل رحلة طويلة", correct: true },
      { en: "Early morning only", ar: "في الصباح الباكر فقط", correct: false }
    ],
    keywords: [
      { term: "engine oil level", ar: "مستوى زيت المحرك", explainAr: "كمية الزيت في المحرك." },
      { term: "hint", ar: "تلميح", explainAr: "Correct oil level protects the engine." }
    ]
  },

  {
    id: "SV-58",
    topic: "safety-vehicle",
    promptEn: "Which vehicle component must legally be kept in good condition?",
    promptAr: "أي جزء يجب الحفاظ عليه بحالة جيدة قانونيًا؟",
    options: [
      { en: "Gearbox", ar: "صندوق التروس", correct: false },
      { en: "Door locks", ar: "أقفال الأبواب", correct: false },
      { en: "Transmission", ar: "ناقل الحركة", correct: false },
      { en: "Seat belts", ar: "أحزمة الأمان", correct: true }
    ],
    keywords: [
      { term: "seat belts", ar: "أحزمة الأمان", explainAr: "أحزمة لحماية الركاب." },
      { term: "hint", ar: "تلميح", explainAr: "Seat belts are a legal safety requirement." }
    ]
  },

  {
    id: "SV-59",
    topic: "safety-vehicle",
    promptEn: "If you stop at the roadside for a long time, what must you do?",
    promptAr: "إذا توقفت على جانب الطريق لفترة طويلة، ماذا يجب أن تفعل؟",
    options: [
      { en: "Use headlights", ar: "استخدم الأضواء", correct: false },
      { en: "Switch off engine", ar: "إيقاف المحرك", correct: true },
      { en: "Switch off radio", ar: "إيقاف الراديو", correct: false },
      { en: "Apply steering lock", ar: "تطبيق قفل التوجيه", correct: false }
    ],
    keywords: [
      { term: "roadside", ar: "جانب الطريق", explainAr: "على حافة الطريق." },
      { term: "hint", ar: "تلميح", explainAr: "Idling wastes fuel and increases emissions." }
    ]
  },

  {
    id: "SV-60",
    topic: "safety-vehicle",
    promptEn: "Why have 'red routes' been introduced in major cities?",
    promptAr: "لماذا تم تطبيق الطرق الحمراء في المدن الكبرى؟",
    options: [
      { en: "Raise speed limits", ar: "رفع حدود السرعة", correct: false },
      { en: "Provide parking", ar: "توفير مواقف", correct: false },
      { en: "Improve traffic flow", ar: "تحسين تدفق المرور", correct: true },
      { en: "Allow easier loading", ar: "السماح بالتحميل الأسهل", correct: false }
    ],
    keywords: [
      { term: "red routes", ar: "الطرق الحمراء", explainAr: "طرق في المدن الكبرى حيث التوقف ممنوع." },
      { term: "hint", ar: "تلميح", explainAr: "Red routes reduce stopping and congestion." }
    ]
  },

  {
    id: "SV-61",
    topic: "safety-vehicle",
    promptEn: "What is the main purpose of road humps, chicanes, and road narrowings?",
    promptAr: "ما الهدف الرئيسي من المطبات المرورية والتعرجات وتضييق الطرق؟",
    options: [
      { en: "Separate traffic lanes", ar: "فصل مسارات المرور", correct: false },
      { en: "Increase vehicle speed", ar: "زيادة سرعة المركبات", correct: false },
      { en: "Allow pedestrian crossings", ar: "السماح بعبور المشاة", correct: false },
      { en: "Reduce traffic speed", ar: "تقليل سرعة المرور", correct: true }
    ],
    keywords: [
      { term: "traffic calming", ar: "تهدئة المرور", explainAr: "إجراءات لتقليل سرعة المرور." },
      { term: "hint", ar: "تلميح", explainAr: "Traffic calming features slow vehicles to improve safety." }
    ]
  },

  {
    id: "SV-62",
    topic: "safety-vehicle",
    promptEn: "When does a vehicle use the most fuel?",
    promptAr: "متى تستهلك المركبة أكبر كمية من الوقود؟",
    options: [
      { en: "While braking", ar: "أثناء الفرملة", correct: false },
      { en: "While coasting", ar: "أثناء الانزلاق", correct: false },
      { en: "While accelerating", ar: "أثناء التسارع", correct: true },
      { en: "While turning", ar: "أثناء الانعطاف", correct: false }
    ],
    keywords: [
      { term: "fuel consumption", ar: "استهلاك الوقود", explainAr: "كمية الوقود المستخدمة." },
      { term: "hint", ar: "تلميح", explainAr: "Acceleration demands the most engine power." }
    ]
  },

  {
    id: "SV-63",
    topic: "safety-vehicle",
    promptEn: "You're driving an unfamiliar car with driver-assistance systems. Where should you check how to use them properly?",
    promptAr: "تقود سيارة غير مألوفة مزودة بأنظمة مساعدة، أين تجد طريقة استخدامها؟",
    options: [
      { en: "Ask a garage", ar: "اسأل ورشة", correct: false },
      { en: "Manufacturer's handbook", ar: "دليل الشركة المصنعة", correct: true },
      { en: "Highway Code", ar: "قانون الطريق", correct: false },
      { en: "Motoring association", ar: "جمعية السيارات", correct: false }
    ],
    keywords: [
      { term: "driver-assistance systems", ar: "أنظمة مساعدة السائق", explainAr: "أنظمة تساعد السائق في القيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Vehicle manuals explain system operation." }
    ]
  },

  {
    id: "SV-64",
    topic: "safety-vehicle",
    promptEn: "Two children under 14 are passengers. Who is responsible for seat belt use?",
    promptAr: "طفلان دون 14 عامًا في السيارة، من المسؤول عن أحزمة الأمان؟",
    options: [
      { en: "Adult passenger", ar: "راكب بالغ", correct: false },
      { en: "The children", ar: "الأطفال", correct: false },
      { en: "You, the driver", ar: "أنت، السائق", correct: true },
      { en: "Their parent", ar: "والدهم", correct: false }
    ],
    keywords: [
      { term: "seat belt", ar: "حزام الأمان", explainAr: "حزام للحماية في حالة الحوادث." },
      { term: "hint", ar: "تلميح", explainAr: "The driver is legally responsible." }
    ]
  },

  {
    id: "SV-65",
    topic: "safety-vehicle",
    promptEn: "What action helps reduce environmental damage caused by vehicles?",
    promptAr: "ما الإجراء الذي يقلل الضرر البيئي للمركبات؟",
    options: [
      { en: "Avoid cruise control", ar: "تجنب التحكم بالسرعة", correct: false },
      { en: "Use air conditioning constantly", ar: "استخدام التكييف باستمرار", correct: false },
      { en: "Use gears to slow down", ar: "استخدام الغيارات للتباطؤ", correct: false },
      { en: "Avoid many short journeys", ar: "تجنب العديد من الرحلات القصيرة", correct: true }
    ],
    keywords: [
      { term: "environmental damage", ar: "الضرر البيئي", explainAr: "التأثير السلبي على البيئة." },
      { term: "hint", ar: "تلميح", explainAr: "Cold engines increase emissions." }
    ]
  },

  {
    id: "SV-66",
    topic: "safety-vehicle",
    promptEn: "Can you ever park on the zigzag lines at a zebra crossing?",
    promptAr: "هل يُسمح بالوقوف على الخطوط المتعرجة عند ممر المشاة؟",
    options: [
      { en: "Yes, if you stay in the car", ar: "نعم، إذا بقيت في السيارة", correct: false },
      { en: "Yes, to drop off passengers", ar: "نعم، لإنزال الركاب", correct: false },
      { en: "Yes, if pedestrians can pass", ar: "نعم، إذا استطاع المشاة المرور", correct: false },
      { en: "No, never", ar: "لا، أبداً", correct: true }
    ],
    keywords: [
      { term: "zigzag lines", ar: "خطوط متعرجة", explainAr: "خطوط على جانبي ممر المشاة." },
      { term: "hint", ar: "تلميح", explainAr: "Zigzag lines must always be kept clear." }
    ]
  },

  {
    id: "SV-67",
    topic: "safety-vehicle",
    promptEn: "When will a vehicle consume more fuel?",
    promptAr: "متى تستهلك السيارة وقودًا أكثر؟",
    options: [
      { en: "Tyres under-inflated", ar: "إطارات منخفضة الضغط", correct: true },
      { en: "Tyres of different brands", ar: "إطارات من علامات مختلفة", correct: false },
      { en: "Tyres over-inflated", ar: "إطارات مرتفعة الضغط", correct: false },
      { en: "New tyres", ar: "إطارات جديدة", correct: false }
    ],
    keywords: [
      { term: "tyre pressure", ar: "ضغط الإطارات", explainAr: "الضغط الصحيح للإطارات مهم." },
      { term: "hint", ar: "تلميح", explainAr: "Low pressure increases rolling resistance." }
    ]
  },

  {
    id: "SV-68",
    topic: "safety-vehicle",
    promptEn: "What is the legal minimum tread depth for trailer or caravan tyres?",
    promptAr: "ما الحد الأدنى القانوني لعمق نقش إطارات المقطورة؟",
    options: [
      { en: "1 mm", ar: "1 ملم", correct: false },
      { en: "1.6 mm", ar: "1.6 ملم", correct: true },
      { en: "2 mm", ar: "2 ملم", correct: false },
      { en: "2.6 mm", ar: "2.6 ملم", correct: false }
    ],
    keywords: [
      { term: "tread depth", ar: "عمق النقش", explainAr: "عمق نقش الإطار." },
      { term: "hint", ar: "تلميح", explainAr: "Trailer tyre limits match car requirements." }
    ]
  },

  {
    id: "SV-69",
    topic: "safety-vehicle",
    promptEn: "Why is a correctly adjusted head restraint important?",
    promptAr: "لماذا من المهم ضبط مسند الرأس بشكل صحيح؟",
    options: [
      { en: "Comfort", ar: "الراحة", correct: false },
      { en: "Relaxation", ar: "الاسترخاء", correct: false },
      { en: "Neck injury protection", ar: "حماية الرقبة من الإصابة", correct: true },
      { en: "Driving position", ar: "وضعية القيادة", correct: false }
    ],
    keywords: [
      { term: "head restraint", ar: "مسند الرأس", explainAr: "مسند خلف الرأس للحماية." },
      { term: "hint", ar: "تلميح", explainAr: "Proper head restraints reduce whiplash injuries." }
    ]
  },

  {
    id: "SV-70",
    topic: "safety-vehicle",
    promptEn: "When will a driver drowsiness system alert you?",
    promptAr: "متى ينبهك نظام اكتشاف التعب في السيارة؟",
    options: [
      { en: "After 4 hours of driving", ar: "بعد 4 ساعات من القيادة", correct: false },
      { en: "At set times", ar: "في أوقات محددة", correct: false },
      { en: "When fatigue patterns are detected", ar: "عند اكتشاف أنماط التعب", correct: true },
      { en: "Near rest signs", ar: "قرب إشارات الراحة", correct: false }
    ],
    keywords: [
      { term: "drowsiness system", ar: "نظام اكتشاف التعب", explainAr: "نظام يراقب حالة السائق." },
      { term: "hint", ar: "تلميح", explainAr: "Sensors monitor steering and driver behaviour." }
    ]
  },

  {
    id: "SV-71",
    topic: "safety-vehicle",
    promptEn: "After a collision, what reduces the risk of neck injury?",
    promptAr: "ما الذي يقلل خطر إصابة الرقبة بعد حادث؟",
    options: [
      { en: "Anti-lock brakes", ar: "فرامل مانعة للانغلاق", correct: false },
      { en: "Collapsible steering wheel", ar: "مقود قابل للطي", correct: false },
      { en: "Air-sprung seat", ar: "مقعد بنابض هوائي", correct: false },
      { en: "Correctly adjusted head restraint", ar: "مسند رأس مضبوط بشكل صحيح", correct: true }
    ],
    keywords: [
      { term: "neck injury", ar: "إصابة الرقبة", explainAr: "إصابة في الرقبة بعد حادث." },
      { term: "hint", ar: "تلميح", explainAr: "Head restraints limit head movement." }
    ]
  },

  {
    id: "SV-72",
    topic: "safety-vehicle",
    promptEn: "How should used engine oil be disposed of?",
    promptAr: "كيف يجب التخلص من زيت المحرك المستعمل؟",
    options: [
      { en: "Pour down drain", ar: "صب في البالوعة", correct: false },
      { en: "Household bin", ar: "سلة المهملات المنزلية", correct: false },
      { en: "Local authority recycling site", ar: "موقع إعادة التدوير المحلي", correct: true },
      { en: "Into soil", ar: "في التربة", correct: false }
    ],
    keywords: [
      { term: "engine oil", ar: "زيت المحرك", explainAr: "زيت يستخدم في المحرك." },
      { term: "hint", ar: "تلميح", explainAr: "Engine oil is hazardous waste." }
    ]
  },

  {
    id: "SV-73",
    topic: "safety-vehicle",
    promptEn: "Which driving technique helps save fuel?",
    promptAr: "أي أسلوب قيادة يساعد على توفير الوقود؟",
    options: [
      { en: "Frequent low gears", ar: "استخدام الغيارات المنخفضة بكثرة", correct: false },
      { en: "Sharp acceleration", ar: "التسارع الحاد", correct: false },
      { en: "Using every gear", ar: "استخدام كل غيار", correct: false },
      { en: "Skipping gears appropriately", ar: "تخطي الغيارات بشكل مناسب", correct: true }
    ],
    keywords: [
      { term: "fuel efficiency", ar: "كفاءة الوقود", explainAr: "استخدام أقل للوقود." },
      { term: "hint", ar: "تلميح", explainAr: "Efficient gear use reduces fuel use." }
    ]
  },

  {
    id: "SV-74",
    topic: "safety-vehicle",
    promptEn: "What may help deter vehicle theft?",
    promptAr: "ما الذي قد يساعد في ردع سرقة السيارة؟",
    options: [
      { en: "Headlights on", ar: "الأضواء الأمامية مضاءة", correct: false },
      { en: "Reflective windows", ar: "نوافذ عاكسة", correct: false },
      { en: "Interior light on", ar: "الضوء الداخلي مضاء", correct: false },
      { en: "Etching registration on windows", ar: "نقش رقم التسجيل على النوافذ", correct: true }
    ],
    keywords: [
      { term: "vehicle theft", ar: "سرقة السيارة", explainAr: "سرقة المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Marking deters resale." }
    ]
  },

  {
    id: "SV-75",
    topic: "safety-vehicle",
    promptEn: "Why are exhaust emissions tested during MOTs?",
    promptAr: "لماذا يتم فحص انبعاثات العادم في اختبار MOT؟",
    options: [
      { en: "Recover equipment cost", ar: "استرداد تكلفة المعدات", correct: false },
      { en: "Protect the environment", ar: "حماية البيئة", correct: true },
      { en: "Compare fuel suppliers", ar: "مقارنة موردي الوقود", correct: false },
      { en: "Equalise engine fumes", ar: "تسوية أبخرة المحرك", correct: false }
    ],
    keywords: [
      { term: "MOT", ar: "اختبار MOT", explainAr: "فحص سنوي للمركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Emissions affect air quality." }
    ]
  },

  {
    id: "SV-76",
    topic: "safety-vehicle",
    promptEn: "You're carrying a 5-year-old child without a suitable child seat. What should you do?",
    promptAr: "تنقل طفلًا عمره 5 سنوات دون مقعد مناسب، ماذا تفعل؟",
    options: [
      { en: "Use adult seat belt", ar: "استخدام حزام أمان للبالغين", correct: false },
      { en: "Share belt", ar: "مشاركة الحزام", correct: false },
      { en: "Seat between children", ar: "الجلوس بين الأطفال", correct: false },
      { en: "Do not carry the child until a proper seat is available", ar: "لا تنقل الطفل حتى يتوفر مقعد مناسب", correct: true }
    ],
    keywords: [
      { term: "child seat", ar: "مقعد أمان للأطفال", explainAr: "مقعد خاص للأطفال للحماية." },
      { term: "hint", ar: "تلميح", explainAr: "Correct child restraints are mandatory." }
    ]
  },

  {
    id: "SV-77",
    topic: "safety-vehicle",
    promptEn: "What is the legal minimum tread depth for car tyres?",
    promptAr: "ما الحد الأدنى القانوني لعمق نقش إطارات السيارة؟",
    options: [
      { en: "1 mm", ar: "1 ملم", correct: false },
      { en: "1.6 mm", ar: "1.6 ملم", correct: true },
      { en: "2.5 mm", ar: "2.5 ملم", correct: false },
      { en: "4 mm", ar: "4 ملم", correct: false }
    ],
    keywords: [
      { term: "tread depth", ar: "عمق النقش", explainAr: "عمق نقش الإطار." },
      { term: "hint", ar: "تلميح", explainAr: "Below legal depth is unsafe and illegal." }
    ]
  },

  {
    id: "SV-78",
    topic: "safety-vehicle",
    promptEn: "How can people help reduce urban pollution?",
    promptAr: "كيف يمكن تقليل التلوث في المدن؟",
    options: [
      { en: "Drive faster", ar: "القيادة أسرع", correct: false },
      { en: "Over-rev engine", ar: "زيادة سرعة المحرك", correct: false },
      { en: "Walk or cycle", ar: "المشي أو ركوب الدراجة", correct: true },
      { en: "Drive short journeys", ar: "القيادة في رحلات قصيرة", correct: false }
    ],
    keywords: [
      { term: "urban pollution", ar: "التلوث الحضري", explainAr: "التلوث في المدن." },
      { term: "hint", ar: "تلميح", explainAr: "Fewer car trips reduce emissions." }
    ]
  },

  {
    id: "SV-79",
    topic: "safety-vehicle",
    promptEn: "What can cause excessive or uneven tyre wear?",
    promptAr: "ما الذي قد يسبب تآكلًا غير متساوٍ للإطارات؟",
    options: [
      { en: "Faulty gearbox", ar: "عطل في صندوق التروس", correct: false },
      { en: "Faulty braking system", ar: "عطل في نظام الفرامل", correct: true },
      { en: "Electrical fault", ar: "عطل كهربائي", correct: false },
      { en: "Exhaust fault", ar: "عطل في العادم", correct: false }
    ],
    keywords: [
      { term: "tyre wear", ar: "تآكل الإطارات", explainAr: "تآكل الإطارات." },
      { term: "hint", ar: "تلميح", explainAr: "Brake faults affect tyre wear." }
    ]
  },

  {
    id: "SV-80",
    topic: "safety-vehicle",
    promptEn: "How can you reduce environmental damage from your vehicle?",
    promptAr: "كيف تقلل الضرر البيئي الناتج عن سيارتك؟",
    options: [
      { en: "Use busy routes", ar: "استخدام الطرق المزدحمة", correct: false },
      { en: "Brake heavily", ar: "الفرملة الثقيلة", correct: false },
      { en: "Use side streets", ar: "استخدام الشوارع الجانبية", correct: false },
      { en: "Anticipate traffic ahead", ar: "التنبؤ بمرور المرور أمامك", correct: true }
    ],
    keywords: [
      { term: "environmental damage", ar: "الضرر البيئي", explainAr: "التأثير السلبي على البيئة." },
      { term: "hint", ar: "تلميح", explainAr: "Anticipation reduces harsh braking." }
    ]
  },

  {
    id: "SV-81",
    topic: "safety-vehicle",
    promptEn: "You activate adaptive cruise control. What must you still do?",
    promptAr: "عند تفعيل مثبت السرعة التكيفي، ماذا يجب أن تستمر بفعله؟",
    options: [
      { en: "Remove seat belt", ar: "إزالة حزام الأمان", correct: false },
      { en: "Use phone", ar: "استخدام الهاتف", correct: false },
      { en: "Eat and drink", ar: "الأكل والشرب", correct: false },
      { en: "Continue watching road signs", ar: "الاستمرار في مراقبة إشارات الطريق", correct: true }
    ],
    keywords: [
      { term: "adaptive cruise control", ar: "مثبت السرعة التكيفي", explainAr: "نظام يحافظ على السرعة تلقائياً." },
      { term: "hint", ar: "تلميح", explainAr: "Driver attention is always required." }
    ]
  },

  {
    id: "SV-82",
    topic: "safety-vehicle",
    promptEn: "You want to fit a rear-facing baby seat in the front passenger seat with an active airbag. What must you do?",
    promptAr: "تريد تركيب مقعد طفل خلفي في المقعد الأمامي مع وسادة هوائية، ماذا تفعل؟",
    options: [
      { en: "Turn seat sideways", ar: "تدوير المقعد جانبياً", correct: false },
      { en: "Ask passenger to hold baby", ar: "طلب من الراكب حمل الطفل", correct: false },
      { en: "Use adult belt", ar: "استخدام حزام للبالغين", correct: false },
      { en: "Deactivate the airbag", ar: "إلغاء تفعيل الوسادة الهوائية", correct: true }
    ],
    keywords: [
      { term: "rear-facing baby seat", ar: "مقعد طفل خلفي", explainAr: "مقعد أمان للأطفال يواجه الخلف." },
      { term: "hint", ar: "تلميح", explainAr: "Airbags can seriously injure rear-facing infants." }
    ]
  },

  // --- INCIDENTS (EXTRA) ---

  {
    id: "IN-09",
    topic: "incidents",
    promptEn: "If a casualty has stopped breathing, what should you do?",
    promptAr: "إذا توقف المصاب عن التنفس، ماذا تفعل؟",
    options: [
      { en: "Give them water", ar: "أعطهم ماءً", correct: false },
      { en: "Raise their legs", ar: "ارفع أرجلهم", correct: false },
      { en: "Start CPR immediately", ar: "ابدأ الإنعاش القلبي فوراً", correct: true },
      { en: "Keep their head forward", ar: "أبقي رأسهم للأمام", correct: false }
    ],
    keywords: [
      { term: "CPR", ar: "الإنعاش القلبي", explainAr: "تقنية الإسعافات الأولية لإنقاذ حياة شخص توقف قلبه." },
      { term: "hint", ar: "تلميح", explainAr: "CPR saves lives." }
    ]
  },

  {
    id: "IN-10",
    topic: "incidents",
    promptEn: "When should you call emergency services if someone is unconscious after a crash?",
    promptAr: "متى يجب الاتصال بالطوارئ إذا كان شخص فاقد الوعي؟",
    options: [
      { en: "After waking them", ar: "بعد إيقاظهم", correct: false },
      { en: "Only if others fail", ar: "فقط إذا فشل الآخرون", correct: false },
      { en: "As soon as possible", ar: "في أقرب وقت ممكن", correct: true },
      { en: "After checking injuries", ar: "بعد فحص الإصابات", correct: false }
    ],
    keywords: [
      { term: "emergency services", ar: "خدمات الطوارئ", explainAr: "اتصل برقم 999 أو 112 لطلب الإسعاف أو الشرطة أو الإطفاء." },
      { term: "hint", ar: "تلميح", explainAr: "Time is critical." }
    ]
  },

  {
    id: "IN-11",
    topic: "incidents",
    promptEn: "On arriving at an accident scene, what should you check first?",
    promptAr: "ما أول شيء يجب التأكد منه عند الوصول لموقع حادث؟",
    options: [
      { en: "Start CPR", ar: "ابدأ الإنعاش القلبي", correct: false },
      { en: "Find an AED", ar: "ابحث عن جهاز الصدمات", correct: false },
      { en: "Check it's safe to approach", ar: "تأكد أن المكان آمن للاقتراب", correct: true },
      { en: "Move the casualty", ar: "انقل المصاب", correct: false }
    ],
    keywords: [
      { term: "safety first", ar: "الأمان أولاً", explainAr: "سلامتك مهمة أيضاً." },
      { term: "hint", ar: "تلميح", explainAr: "Your safety matters too." }
    ]
  },

  {
    id: "IN-12",
    topic: "incidents",
    promptEn: "If traffic stops inside a tunnel, what should you do?",
    promptAr: "إذا توقفت الحركة داخل نفق، ماذا تفعل؟",
    options: [
      { en: "Park very close to the car ahead", ar: "اركن قريباً جداً من السيارة أمامك", correct: false },
      { en: "Ignore message signs", ar: "تجاهل لوحات الرسائل", correct: false },
      { en: "Keep a safe distance from the vehicle ahead", ar: "احتفظ بمسافة آمنة من المركبة أمامك", correct: true },
      { en: "Turn around", ar: "استدر", correct: false }
    ],
    keywords: [
      { term: "tunnel safety", ar: "سلامة النفق", explainAr: "المسافة تقلل خطر الحريق." },
      { term: "hint", ar: "تلميح", explainAr: "Space reduces fire risk." }
    ]
  },

  {
    id: "IN-13",
    topic: "incidents",
    promptEn: "Who is allowed to use a public AED?",
    promptAr: "من يمكنه استخدام جهاز الصدمات القلبي؟",
    options: [
      { en: "Doctors only", ar: "الأطباء فقط", correct: false },
      { en: "Paramedics only", ar: "المسعفون فقط", correct: false },
      { en: "First-aiders only", ar: "المسعفون الأوليون فقط", correct: false },
      { en: "Anyone", ar: "أي شخص", correct: true }
    ],
    keywords: [
      { term: "AED", ar: "جهاز الصدمات القلبي", explainAr: "جهاز يستخدم لإعادة تشغيل القلب." },
      { term: "hint", ar: "تلميح", explainAr: "AEDs are designed for public use." }
    ]
  },

  {
    id: "IN-14",
    topic: "incidents",
    promptEn: "How should you help someone bleeding heavily from an arm wound?",
    promptAr: "كيف تساعد شخصًا ينزف بشدة من ذراعه؟",
    options: [
      { en: "Give them a drink", ar: "أعطهم شراباً", correct: false },
      { en: "Dab the wound", ar: "امسح الجرح", correct: false },
      { en: "Walk them around", ar: "امشِ بهم", correct: false },
      { en: "Apply firm pressure", ar: "اضغط بقوة", correct: true }
    ],
    keywords: [
      { term: "bleeding", ar: "نزيف", explainAr: "الضغط يبطئ النزيف." },
      { term: "hint", ar: "تلميح", explainAr: "Pressure slows bleeding." }
    ]
  },

  {
    id: "IN-15",
    topic: "incidents",
    promptEn: "How can emergency services identify a vehicle carrying dangerous goods?",
    promptAr: "كيف يتم التعرف على مركبة تنقل مواد خطرة؟",
    options: [
      { en: "Special number plates", ar: "لوحات أرقام خاصة", correct: false },
      { en: "Warning symbols or hazard markings", ar: "رموز تحذيرية أو علامات خطر", correct: true },
      { en: "Flashing blue lights", ar: "أضواء زرقاء وامضة", correct: false },
      { en: "Audible alarms", ar: "إنذارات صوتية", correct: false }
    ],
    keywords: [
      { term: "dangerous goods", ar: "مواد خطرة", explainAr: "مواد قد تكون قابلة للاشتعال أو سامة." },
      { term: "hint", ar: "تلميح", explainAr: "Hazard markings warn emergency services." }
    ]
  },

  {
    id: "IN-16",
    topic: "incidents",
    promptEn: "What warns you of congestion ahead in a long tunnel?",
    promptAr: "ما الذي يحذرك من ازدحام داخل نفق؟",
    options: [
      { en: "Hazard lines", ar: "خطوط الخطر", correct: false },
      { en: "Flashing headlights", ar: "أضواء وامضة", correct: false },
      { en: "Variable message signs", ar: "لوحات رسائل متغيرة", correct: true },
      { en: "Road markings", ar: "علامات الطريق", correct: false }
    ],
    keywords: [
      { term: "tunnel signs", ar: "علامات النفق", explainAr: "يجب دائماً اتباع علامات النفق." },
      { term: "hint", ar: "تلميح", explainAr: "Always follow tunnel signs." }
    ]
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


  // --- INCIDENTS (Additional) ---

  {
    id: "IN-17",
    topic: "incidents",
    promptEn: "How can you help injured people at an accident?",
    promptAr: "كيف تساعد المصابين في حادث؟",
    options: [
      { en: "Give food", ar: "أعطهم طعاماً", correct: false },
      { en: "Keep them moving", ar: "أبقيهم يتحركون", correct: false },
      { en: "Keep them warm and reassured", ar: "أبقيهم دافئين ومطمئنين", correct: true },
      { en: "Offer a drink", ar: "اعرض شراباً", correct: false }
    ],
    keywords: [
      { term: "first aid", ar: "الإسعافات الأولية", explainAr: "المساعدة الطبية الفورية المقدمة قبل وصول الطوارئ." },
      { term: "hint", ar: "تلميح", explainAr: "Warmth prevents shock." }
    ]
  },

  {
    id: "IN-18",
    topic: "incidents",
    promptEn: "If a dashboard warning light comes on while driving, what should you do?",
    promptAr: "ماذا تفعل إذا أضاءت لمبة تحذير أثناء القيادة؟",
    options: [
      { en: "Ignore it", ar: "تجاهلها", correct: false },
      { en: "Wait until later", ar: "انتظر حتى وقت لاحق", correct: false },
      { en: "Stop safely and investigate", ar: "توقف بأمان وافحص", correct: true },
      { en: "Continue driving", ar: "استمر في القيادة", correct: false }
    ],
    keywords: [
      { term: "warning light", ar: "لمبة تحذير", explainAr: "لمبة تحذير تشير إلى مشاكل." },
      { term: "hint", ar: "تلميح", explainAr: "Warning lights signal problems." }
    ]
  },

  {
    id: "IN-19",
    topic: "incidents",
    promptEn: "An injured person is lying in a busy road after a crash. What should you do first?",
    promptAr: "مصاب مستلقٍ على طريق مزدحم، ما أول إجراء؟",
    options: [
      { en: "Treat shock", ar: "عالج الصدمة", correct: false },
      { en: "Warn approaching traffic", ar: "حذّر المرور القادم", correct: true },
      { en: "Move the casualty", ar: "انقل المصاب", correct: false },
      { en: "Cover them", ar: "غطّهم", correct: false }
    ],
    keywords: [
      { term: "traffic warning", ar: "تحذير المرور", explainAr: "منع الخطر الإضافي." },
      { term: "hint", ar: "تلميح", explainAr: "Prevent further danger." }
    ]
  },

  {
    id: "IN-20",
    topic: "incidents",
    promptEn: "When should you stop CPR?",
    promptAr: "متى يجب إيقاف الإنعاش القلبي؟",
    options: [
      { en: "After 5 minutes", ar: "بعد 5 دقائق", correct: false },
      { en: "When calling emergency services", ar: "عند الاتصال بالطوارئ", correct: false },
      { en: "When breathing resumes or professionals take over", ar: "عند استئناف التنفس أو عندما يتولى المحترفون", correct: true },
      { en: "When you feel tired", ar: "عندما تشعر بالتعب", correct: false }
    ],
    keywords: [
      { term: "CPR", ar: "الإنعاش القلبي", explainAr: "تقنية الإسعافات الأولية لإنقاذ حياة شخص توقف قلبه." },
      { term: "hint", ar: "تلميح", explainAr: "Continue until help arrives." }
    ]
  },

  {
    id: "IN-21",
    topic: "incidents",
    promptEn: "After an incident, once the area is safe, how should you care for casualties?",
    promptAr: "بعد الحادث، وعندما يصبح المكان آمناً، كيف يجب التعامل مع المصابين؟",
    options: [
      { en: "Move them away from vehicles", ar: "نقلهم بعيداً عن المركبات", correct: false },
      { en: "Ask them how the crash happened", ar: "سؤالهم كيف حدث الحادث", correct: false },
      { en: "Give them food", ar: "إعطاؤهم طعاماً", correct: false },
      { en: "Keep them still and monitor them", ar: "إبقاؤهم ساكنين ومراقبتهم", correct: true }
    ],
    keywords: [
      { term: "casualty care", ar: "رعاية المصابين", explainAr: "الطريقة الصحيحة للتعامل مع المصابين بعد الحادث." },
      { term: "hint", ar: "تلميح", explainAr: "Unnecessary movement can worsen injuries." }
    ]
  },

  {
    id: "IN-22",
    topic: "incidents",
    promptEn: "A casualty is unconscious but breathing normally in the recovery position. What should you do next?",
    promptAr: "مصاب فاقد الوعي لكنه يتنفس، ماذا يجب فعله؟",
    options: [
      { en: "Press between their shoulders", ar: "الضغط بين أكتافهم", correct: false },
      { en: "Put their arms straight", ar: "وضع أذرعهم مستقيمة", correct: false },
      { en: "Give them a warm drink", ar: "إعطاؤهم شراباً دافئاً", correct: false },
      { en: "Keep checking their airway stays open", ar: "الاستمرار في التأكد من بقاء مجرى الهواء مفتوحاً", correct: true }
    ],
    keywords: [
      { term: "airway", ar: "مجرى الهواء", explainAr: "مجرى الهواء يجب أن يبقى مفتوحاً في جميع الأوقات." },
      { term: "hint", ar: "تلميح", explainAr: "Airway must remain clear at all times." }
    ]
  },

  {
    id: "IN-23",
    topic: "incidents",
    promptEn: "How can you best help someone who is suffering from shock after an accident?",
    promptAr: "كيف تساعد شخصاً يعاني من صدمة بعد حادث؟",
    options: [
      { en: "Keep them walking", ar: "إبقاؤهم يمشون", correct: false },
      { en: "Give them food", ar: "إعطاؤهم طعاماً", correct: false },
      { en: "Give them a hot drink", ar: "إعطاؤهم شراباً ساخناً", correct: false },
      { en: "Speak calmly and reassure them", ar: "التحدث بهدوء وطمأنتهم", correct: true }
    ],
    keywords: [
      { term: "shock", ar: "صدمة", explainAr: "حالة طبية خطيرة قد تحدث بعد الحوادث." },
      { term: "hint", ar: "تلميح", explainAr: "Calm reassurance reduces shock effects." }
    ]
  },

  {
    id: "IN-24",
    topic: "incidents",
    promptEn: "You're first at a serious accident. Engines are off and hazards are on. What should you do next?",
    promptAr: "وصلت أولاً إلى حادث خطير، ماذا تفعل بعد تأمين المكان؟",
    options: [
      { en: "Ask drivers nearby to help", ar: "طلب المساعدة من السائقين القريبين", correct: false },
      { en: "Give injured people drinks", ar: "إعطاء المصابين مشروبات", correct: false },
      { en: "Move injured people from vehicles", ar: "نقل المصابين من المركبات", correct: false },
      { en: "Make sure emergency services are called", ar: "التأكد من الاتصال بخدمات الطوارئ", correct: true }
    ],
    keywords: [
      { term: "emergency services", ar: "خدمات الطوارئ", explainAr: "المساعدة المهنية ضرورية." },
      { term: "hint", ar: "تلميح", explainAr: "Professional help is essential." }
    ]
  },

  {
    id: "IN-25",
    topic: "incidents",
    promptEn: "At an accident scene, how can you help an unconscious casualty?",
    promptAr: "كيف تساعد مصاباً فاقد الوعي؟",
    options: [
      { en: "Take photos", ar: "التقاط صور", correct: false },
      { en: "Check they're breathing normally", ar: "التأكد من أنهم يتنفسون بشكل طبيعي", correct: true },
      { en: "Move them to comfort", ar: "نقلهم للراحة", correct: false },
      { en: "Splash water on their face", ar: "رش الماء على وجوههم", correct: false }
    ],
    keywords: [
      { term: "breathing check", ar: "فحص التنفس", explainAr: "فحص التنفس أمر بالغ الأهمية." },
      { term: "hint", ar: "تلميح", explainAr: "Breathing check is critical." }
    ]
  },

  {
    id: "IN-26",
    topic: "incidents",
    promptEn: "How will you know how to use a public defibrillator (AED)?",
    promptAr: "كيف تعرف طريقة استخدام جهاز الصدمات AED؟",
    options: [
      { en: "You must be trained", ar: "يجب أن تكون مدرباً", correct: false },
      { en: "Read the manual first", ar: "قراءة الدليل أولاً", correct: false },
      { en: "The casualty explains it", ar: "المصاب يشرحه", correct: false },
      { en: "The AED gives clear spoken and visual instructions", ar: "جهاز AED يعطي تعليمات واضحة صوتية ومرئية", correct: true }
    ],
    keywords: [
      { term: "AED", ar: "جهاز الصدمات", explainAr: "أجهزة AED ترشد المستخدمين خطوة بخطوة." },
      { term: "hint", ar: "تلميح", explainAr: "AEDs guide users step by step." }
    ]
  },

  {
    id: "IN-27",
    topic: "incidents",
    promptEn: "You accidentally damage property and the owner isn't present. What must you do?",
    promptAr: "إذا تضررت ممتلكات ولم يكن صاحبها موجوداً، ماذا تفعل؟",
    options: [
      { en: "Tell the owner later", ar: "إخبار المالك لاحقاً", correct: false },
      { en: "Inform insurance only", ar: "إبلاغ التأمين فقط", correct: false },
      { en: "Find someone nearby immediately", ar: "البحث عن شخص قريب فوراً", correct: false },
      { en: "Report it to police within 24 hours", ar: "الإبلاغ للشرطة خلال 24 ساعة", correct: true }
    ],
    keywords: [
      { term: "property damage", ar: "ضرر الممتلكات", explainAr: "الإبلاغ القانوني مطلوب." },
      { term: "hint", ar: "تلميح", explainAr: "Legal reporting is required." }
    ]
  },

  {
    id: "IN-28",
    topic: "incidents",
    promptEn: "When should you move an unconscious but breathing casualty?",
    promptAr: "متى يجوز تحريك مصاب فاقد الوعي لكنه يتنفس؟",
    options: [
      { en: "When others tell you", ar: "عندما يخبرك الآخرون", correct: false },
      { en: "When ambulance is coming", ar: "عندما يكون الإسعاف قادماً", correct: false },
      { en: "Only if there's further danger", ar: "فقط إذا كان هناك خطر إضافي", correct: true },
      { en: "When helpers arrive", ar: "عند وصول المساعدين", correct: false }
    ],
    keywords: [
      { term: "move casualty", ar: "تحريك المصاب", explainAr: "التحريك فقط إذا تطلب الأمر للأمان." },
      { term: "hint", ar: "تلميح", explainAr: "Move only if safety requires it." }
    ]
  },

  {
    id: "IN-29",
    topic: "incidents",
    promptEn: "What must you do first if you're involved in a collision?",
    promptAr: "ما أول إجراء بعد حادث مروري؟",
    options: [
      { en: "Call insurance", ar: "الاتصال بالتأمين", correct: false },
      { en: "Call emergency services", ar: "الاتصال بالطوارئ", correct: false },
      { en: "Stop at the scene", ar: "التوقف في موقع الحادث", correct: true },
      { en: "Continue driving", ar: "الاستمرار في القيادة", correct: false }
    ],
    keywords: [
      { term: "stop at scene", ar: "التوقف في موقع الحادث", explainAr: "التوقف واجب قانوني." },
      { term: "hint", ar: "تلميح", explainAr: "Stopping is a legal duty." }
    ]
  },

  {
    id: "IN-30",
    topic: "incidents",
    promptEn: "What details must you give after a collision causing vehicle damage?",
    promptAr: "ما المعلومات التي يجب تبادلها بعد حادث؟",
    options: [
      { en: "Job details", ar: "تفاصيل العمل", correct: false },
      { en: "National Insurance number", ar: "رقم التأمين الوطني", correct: false },
      { en: "Internet provider", ar: "مزود الإنترنت", correct: false },
      { en: "Name, address, and vehicle registration", ar: "الاسم والعنوان ورقم تسجيل المركبة", correct: true }
    ],
    keywords: [
      { term: "exchange details", ar: "تبادل التفاصيل", explainAr: "تفاصيل الهوية مطلوبة قانونياً." },
      { term: "hint", ar: "تلميح", explainAr: "Identification details are required by law." }
    ]
  },

  {
    id: "IN-31",
    topic: "incidents",
    promptEn: "What should you do if a tyre bursts while driving?",
    promptAr: "ماذا تفعل إذا انفجر إطار أثناء القيادة؟",
    options: [
      { en: "Use handbrake", ar: "استخدام فرامل اليد", correct: false },
      { en: "Brake hard", ar: "الفرملة بقوة", correct: false },
      { en: "Slow down and pull over safely", ar: "تخفيف السرعة والتوقف بأمان", correct: true },
      { en: "Keep driving", ar: "الاستمرار في القيادة", correct: false }
    ],
    keywords: [
      { term: "tyre burst", ar: "انفجار الإطار", explainAr: "التحكم التدريجي يمنع الانزلاق." },
      { term: "hint", ar: "تلميح", explainAr: "Gradual control prevents skidding." }
    ]
  },

  {
    id: "IN-32",
    topic: "incidents",
    promptEn: "If your car breaks down in a tunnel, what should you do?",
    promptAr: "إذا تعطلت السيارة داخل نفق، ماذا تفعل؟",
    options: [
      { en: "Stay in the car", ar: "البقاء في السيارة", correct: false },
      { en: "Stand behind the car", ar: "الوقوف خلف السيارة", correct: false },
      { en: "Stand in front of it", ar: "الوقوف أمامها", correct: false },
      { en: "Switch hazards and go to call for help", ar: "تشغيل أضواء التحذير والذهاب لطلب المساعدة", correct: true }
    ],
    keywords: [
      { term: "tunnel breakdown", ar: "تعطل في نفق", explainAr: "الأنفاق تتطلب إخلاء سريع." },
      { term: "hint", ar: "تلميح", explainAr: "Tunnels require quick evacuation." }
    ]
  },

  {
    id: "IN-33",
    topic: "incidents",
    promptEn: "A motorcyclist is unconscious in the road after a crash. What's your first action?",
    promptAr: "دراج ناري فاقد الوعي في الطريق، ما أول خطوة؟",
    options: [
      { en: "Move the rider", ar: "تحريك السائق", correct: false },
      { en: "Clear debris", ar: "إزالة الحطام", correct: false },
      { en: "Warn approaching traffic", ar: "تحذير المرور القادم", correct: true },
      { en: "Reassure the rider", ar: "طمأنة السائق", correct: false }
    ],
    keywords: [
      { term: "warn traffic", ar: "تحذير المرور", explainAr: "منع المزيد من التصادمات." },
      { term: "hint", ar: "تلميح", explainAr: "Prevent further collisions." }
    ]
  },

  {
    id: "IN-34",
    topic: "incidents",
    promptEn: "A motorcyclist is unconscious on the road. Traffic has stopped and there's no danger. What could help them?",
    promptAr: "دراج ناري فاقد الوعي والطريق آمن. ما أفضل تصرف للمساعدة؟",
    options: [
      { en: "Remove their helmet", ar: "إزالة خوذتهم", correct: false },
      { en: "Get medical help", ar: "الحصول على مساعدة طبية", correct: true },
      { en: "Move them off the road", ar: "نقلهم بعيداً عن الطريق", correct: false },
      { en: "Remove their jacket", ar: "إزالة سترتهم", correct: false }
    ],
    keywords: [
      { term: "motorcyclist", ar: "سائق دراجة نارية", explainAr: "شخص يقود دراجة نارية." },
      { term: "hint", ar: "تلميح", explainAr: "Helmets should only be removed by trained professionals." }
    ]
  },

  {
    id: "IN-35",
    topic: "incidents",
    promptEn: "A casualty needs CPR. What is the correct chest compression rate for an adult?",
    promptAr: "ما المعدل الصحيح للضغطات الصدرية أثناء الإنعاش القلبي؟",
    options: [
      { en: "10 per minute", ar: "10 في الدقيقة", correct: false },
      { en: "60 per minute", ar: "60 في الدقيقة", correct: false },
      { en: "120 per minute", ar: "120 في الدقيقة", correct: true },
      { en: "240 per minute", ar: "240 في الدقيقة", correct: false }
    ],
    keywords: [
      { term: "CPR rate", ar: "معدل الإنعاش القلبي", explainAr: "سرعة الضغطات على الصدر أثناء الإنعاش القلبي." },
      { term: "hint", ar: "تلميح", explainAr: "CPR rhythm is fast and steady." }
    ]
  },

  {
    id: "IN-36",
    topic: "incidents",
    promptEn: "Why should you only remove a motorcyclist's helmet if it's essential?",
    promptAr: "لماذا لا يُزال خوذة الدراج إلا عند الضرورة؟",
    options: [
      { en: "They may object", ar: "قد يعترضون", correct: false },
      { en: "It could worsen neck injuries", ar: "قد يزيد إصابات الرقبة", correct: true },
      { en: "It lets them cool down", ar: "يساعدهم على التبريد", correct: false },
      { en: "It could damage the helmet", ar: "قد يتلف الخوذة", correct: false }
    ],
    keywords: [
      { term: "helmet removal", ar: "إزالة الخوذة", explainAr: "إزالة خوذة سائق الدراجة النارية." },
      { term: "hint", ar: "تلميح", explainAr: "Neck and spine injuries are common." }
    ]
  },

  {
    id: "IN-37",
    topic: "incidents",
    promptEn: "At an incident, an unconscious person needs help. What should you check first?",
    promptAr: "عند إسعاف شخص فاقد الوعي، ما أول شيء تفحصه؟",
    options: [
      { en: "Their insurance", ar: "تأمينهم", correct: false },
      { en: "Their allergies", ar: "حساسياتهم", correct: false },
      { en: "Their comfort", ar: "راحتهم", correct: false },
      { en: "Their airway", ar: "مجرى الهواء لديهم", correct: true }
    ],
    keywords: [
      { term: "airway", ar: "مجرى الهواء", explainAr: "الممر الذي يسمح للهواء بالدخول إلى الرئتين." },
      { term: "hint", ar: "تلميح", explainAr: "Airway comes before everything else." }
    ]
  },

  {
    id: "IN-38",
    topic: "incidents",
    promptEn: "When may you use hazard warning lights on a motorway?",
    promptAr: "متى يُسمح باستخدام أضواء التحذير على الطريق السريع؟",
    options: [
      { en: "When followed closely", ar: "عندما يتبعك أحد عن قرب", correct: false },
      { en: "When slowing suddenly due to danger ahead", ar: "عند التباطؤ المفاجئ بسبب خطر أمامك", correct: true },
      { en: "When being towed", ar: "عندما يتم سحبك", correct: false },
      { en: "When using the hard shoulder as a lane", ar: "عند استخدام الكتف الجانبي كمسار", correct: false }
    ],
    keywords: [
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "أضواء تحذيرية تُستخدم لتنبيه السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "Hazards warn others of sudden danger." }
    ]
  },

  {
    id: "IN-39",
    topic: "incidents",
    promptEn: "Emergency services are on the way and the scene is safe. What is your first priority for an unconscious motorcyclist?",
    promptAr: "ما الأولوية الأولى لمصاب فاقد الوعي بعد تأمين المكان؟",
    options: [
      { en: "Check for broken bones", ar: "فحص الكسور", correct: false },
      { en: "Check for bleeding", ar: "فحص النزيف", correct: false },
      { en: "Check breathing", ar: "فحص التنفس", correct: true },
      { en: "Check bruises", ar: "فحص الكدمات", correct: false }
    ],
    keywords: [
      { term: "breathing check", ar: "فحص التنفس", explainAr: "التأكد من أن الشخص يتنفس." },
      { term: "hint", ar: "تلميح", explainAr: "Breathing = life." }
    ]
  },

  {
    id: "IN-40",
    topic: "incidents",
    promptEn: "While driving on the motorway, luggage falls from your vehicle. What should you do?",
    promptAr: "إذا سقط حمل من مركبتك على الطريق السريع، ماذا تفعل؟",
    options: [
      { en: "Stop and collect it", ar: "توقف وجمعه", correct: false },
      { en: "Walk back to retrieve it", ar: "امشِ للخلف لاسترجاعه", correct: false },
      { en: "Stop at the next emergency phone and report it", ar: "توقف عند هاتف الطوارئ التالي وأبلغ عنه", correct: true },
      { en: "Pull over and signal traffic", ar: "توقف على الجانب وأشير للمرور", correct: false }
    ],
    keywords: [
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "قواعد السلامة على الطرق السريعة." },
      { term: "hint", ar: "تلميح", explainAr: "Never walk on a motorway." }
    ]
  },

  {
    id: "IN-41",
    topic: "incidents",
    promptEn: "How is CPR for a 6-year-old child different from an adult?",
    promptAr: "ما الفرق في الإنعاش القلبي لطفل عمره 6 سنوات؟",
    options: [
      { en: "Use two fingers only", ar: "استخدم إصبعين فقط", correct: false },
      { en: "Press twice as fast", ar: "اضغط بضعف السرعة", correct: false },
      { en: "Use one hand, pressing 4–5 cm", ar: "استخدم يداً واحدة، اضغط 4–5 سم", correct: true },
      { en: "Press more slowly and firmly", ar: "اضغط ببطء أكبر وبقوة", correct: false }
    ],
    keywords: [
      { term: "child CPR", ar: "إنعاش قلبي للأطفال", explainAr: "تقنية الإنعاش القلبي للأطفال." },
      { term: "hint", ar: "تلميح", explainAr: "Less force is used for children." }
    ]
  },

  {
    id: "IN-42",
    topic: "incidents",
    promptEn: "Your vehicle has a puncture on the motorway. What should you do?",
    promptAr: "إذا تعرض إطارك للانفجار على الطريق السريع، ماذا تفعل؟",
    options: [
      { en: "Drive slowly to services", ar: "قد ببطء إلى محطة الخدمة", correct: false },
      { en: "Change the wheel quickly", ar: "غيّر العجلة بسرعة", correct: false },
      { en: "Stop in a refuge area and call for help", ar: "توقف في منطقة ملاذ واطلب المساعدة", correct: true },
      { en: "Stop in your lane with hazards on", ar: "توقف في مسارك مع تشغيل أضواء التحذير", correct: false }
    ],
    keywords: [
      { term: "puncture", ar: "ثقب في الإطار", explainAr: "ثقب في إطار المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Safety areas exist for a reason." }
    ]
  },

  {
    id: "IN-43",
    topic: "incidents",
    promptEn: "At an incident, how could you help a small child who is not breathing?",
    promptAr: "كيف تساعد طفلاً لا يتنفس بعد حادث؟",
    options: [
      { en: "Look for parents", ar: "ابحث عن الوالدين", correct: false },
      { en: "Open airway and begin CPR", ar: "افتح مجرى الهواء وابدأ الإنعاش القلبي", correct: true },
      { en: "Put them in recovery position", ar: "ضعهم في وضعية الإفاقة", correct: false },
      { en: "Talk to them until help arrives", ar: "تحدث معهم حتى وصول المساعدة", correct: false }
    ],
    keywords: [
      { term: "child not breathing", ar: "طفل لا يتنفس", explainAr: "طفل توقف عن التنفس." },
      { term: "hint", ar: "تلميح", explainAr: "Immediate CPR saves lives." }
    ]
  },

  {
    id: "IN-44",
    topic: "incidents",
    promptEn: "After a collision, which document may police ask you to produce?",
    promptAr: "أي وثيقة قد تطلبها الشرطة بعد حادث؟",
    options: [
      { en: "Vehicle service record", ar: "سجل صيانة المركبة", correct: false },
      { en: "Theory test certificate", ar: "شهادة اختبار النظرية", correct: false },
      { en: "Vehicle registration document", ar: "وثيقة تسجيل المركبة", correct: false },
      { en: "Driving licence", ar: "رخصة القيادة", correct: true }
    ],
    keywords: [
      { term: "driving licence", ar: "رخصة القيادة", explainAr: "وثيقة رسمية تثبت أنك مسموح لك قانونياً بالقيادة." },
      { term: "hint", ar: "تلميح", explainAr: "Licence proves legal entitlement to drive." }
    ]
  },

  {
    id: "IN-45",
    topic: "incidents",
    promptEn: "When performing CPR on an adult, how fast should chest compressions be?",
    promptAr: "أثناء الإنعاش القلبي، ما السرعة الصحيحة للضغطات الصدرية؟",
    options: [
      { en: "Once per second", ar: "مرة واحدة في الثانية", correct: false },
      { en: "Twice per second", ar: "مرتين في الثانية", correct: true },
      { en: "Three times per second", ar: "ثلاث مرات في الثانية", correct: false },
      { en: "Once every five seconds", ar: "مرة واحدة كل خمس ثوانٍ", correct: false }
    ],
    keywords: [
      { term: "CPR rate", ar: "معدل الإنعاش القلبي", explainAr: "سرعة الضغطات على الصدر أثناء الإنعاش القلبي." },
      { term: "hint", ar: "تلميح", explainAr: "CPR rhythm is fast and steady." }
    ]
  },

  {
    id: "IN-46",
    topic: "incidents",
    promptEn: "What helps reduce the risk of your vehicle catching fire?",
    promptAr: "ما الذي يقلل خطر اشتعال السيارة؟",
    options: [
      { en: "Keeping coolant above maximum", ar: "الحفاظ على سائل التبريد فوق الحد الأقصى", correct: false },
      { en: "Investigating strong fuel smells", ar: "فحص روائح الوقود القوية", correct: true },
      { en: "Avoiding a full fuel tank", ar: "تجنب خزان وقود ممتلئ", correct: false },
      { en: "Using fuel additives", ar: "استخدام إضافات الوقود", correct: false }
    ],
    keywords: [
      { term: "fire risk", ar: "خطر الحريق", explainAr: "احتمالية اندلاع حريق في المركبة." },
      { term: "hint", ar: "تلميح", explainAr: "Fuel leaks are a serious fire risk." }
    ]
  },

  {
    id: "IN-47",
    topic: "incidents",
    promptEn: "A pedestrian has heavy bleeding from a leg wound. Nothing is embedded. What should you do?",
    promptAr: "مصاب ينزف بشدة من ساقه. ما الإجراء الصحيح؟",
    options: [
      { en: "Dab the wound", ar: "امسح الجرح", correct: false },
      { en: "Keep the leg flat", ar: "أبقي الساق مسطحة", correct: false },
      { en: "Give a warm drink", ar: "أعطِ شراباً دافئاً", correct: false },
      { en: "Apply firm pressure", ar: "اضغط بقوة", correct: true }
    ],
    keywords: [
      { term: "bleeding", ar: "نزيف", explainAr: "خروج الدم من الجرح." },
      { term: "hint", ar: "تلميح", explainAr: "Pressure helps control bleeding." }
    ]
  },

  {
    id: "IN-48",
    topic: "incidents",
    promptEn: "While performing CPR, someone offers to help. What should you ask them to do?",
    promptAr: "أثناء الإنعاش، ما أفضل طلب من شخص يساعدك؟",
    options: [
      { en: "Fetch a blanket", ar: "أحضر بطانية", correct: false },
      { en: "Fetch a first aid kit", ar: "أحضر صندوق الإسعافات الأولية", correct: false },
      { en: "Fetch a defibrillator (AED)", ar: "أحضر جهاز الصدمات الكهربائية (AED)", correct: true },
      { en: "Fetch a privacy screen", ar: "أحضر شاشة خصوصية", correct: false }
    ],
    keywords: [
      { term: "AED", ar: "جهاز الصدمات", explainAr: "جهاز يستخدم لإعادة تشغيل القلب." },
      { term: "hint", ar: "تلميح", explainAr: "AEDs save lives when used quickly." }
    ]
  },

  {
    id: "IN-49",
    topic: "incidents",
    promptEn: "You're asked to find a defibrillator (AED). What's the best way?",
    promptAr: "كيف تعثر بسرعة على جهاز الصدمات الكهربائية؟",
    options: [
      { en: "Follow roadside arrows", ar: "اتبع الأسهم على جانب الطريق", correct: false },
      { en: "Ask the emergency operator", ar: "اسأل مشغل الطوارئ", correct: true },
      { en: "Use your sat nav", ar: "استخدم نظام الملاحة", correct: false },
      { en: "Search the casualty's belongings", ar: "ابحث في متعلقات المصاب", correct: false }
    ],
    keywords: [
      { term: "AED location", ar: "موقع جهاز الصدمات", explainAr: "مكان جهاز الصدمات الكهربائية." },
      { term: "hint", ar: "تلميح", explainAr: "Emergency operators know AED locations." }
    ]
  },

  {
    id: "IN-50",
    topic: "incidents",
    promptEn: "Before driving into a tunnel, what should you do?",
    promptAr: "ماذا تفعل قبل دخول نفق؟",
    options: [
      { en: "Switch off the radio", ar: "أطفئ الراديو", correct: false },
      { en: "Remove sunglasses", ar: "أزل النظارات الشمسية", correct: true },
      { en: "Close the sunroof", ar: "أغلق السقف الزجاجي", correct: false },
      { en: "Switch on wipers", ar: "شغّل المساحات", correct: false }
    ],
    keywords: [
      { term: "tunnel preparation", ar: "الاستعداد للنفق", explainAr: "التحضيرات قبل دخول النفق." },
      { term: "hint", ar: "تلميح", explainAr: "Clear vision is vital in tunnels." }
    ]
  },

  {
    id: "IN-51",
    topic: "incidents",
    promptEn: "Your vehicle breaks down on an automatic railway crossing. What should you do first?",
    promptAr: "تعطلت سيارتك على ممر سكة حديد. ما أول خطوة؟",
    options: [
      { en: "Call recovery services", ar: "اتصل بخدمة السحب", correct: false },
      { en: "Warn approaching trains", ar: "حذّر القطارات القادمة", correct: false },
      { en: "Push the vehicle clear", ar: "ادفع السيارة بعيداً", correct: false },
      { en: "Get everyone out and away from the crossing", ar: "أخرج الجميع وابتعد عن الممر", correct: true }
    ],
    keywords: [
      { term: "railway crossing", ar: "ممر سكة حديد", explainAr: "تقاطع بين طريق وسكة حديدية." },
      { term: "hint", ar: "تلميح", explainAr: "Personal safety comes first." }
    ]
  },

  {
    id: "IN-52",
    topic: "incidents",
    promptEn: "A large object falls from a lorry onto the motorway. What should you do?",
    promptAr: "سقط جسم كبير على الطريق السريع. ماذا تفعل؟",
    options: [
      { en: "Stop and remove it", ar: "توقف وأزلّه", correct: false },
      { en: "Chase the lorry", ar: "اتبع الشاحنة", correct: false },
      { en: "Stop nearby", ar: "توقف قريباً", correct: false },
      { en: "Report it at the next emergency phone", ar: "أبلغ عنه عند هاتف الطوارئ التالي", correct: true }
    ],
    keywords: [
      { term: "motorway safety", ar: "سلامة الطريق السريع", explainAr: "قواعد السلامة على الطرق السريعة." },
      { term: "hint", ar: "تلميح", explainAr: "Never stop on a live motorway." }
    ]
  },

  {
    id: "IN-53",
    topic: "incidents",
    promptEn: "Someone has severe burns after an incident. How can you help?",
    promptAr: "كيف تساعد شخصاً مصاباً بحروق شديدة؟",
    options: [
      { en: "Apply lotion", ar: "ضع مرهماً", correct: false },
      { en: "Burst blisters", ar: "انفجر البثور", correct: false },
      { en: "Remove stuck clothing", ar: "أزل الملابس الملتصقة", correct: false },
      { en: "Cool burns with clean water", ar: "برّد الحروق بماء نظيف", correct: true }
    ],
    keywords: [
      { term: "burns", ar: "حروق", explainAr: "إصابات ناتجة عن الحرارة أو المواد الكيميائية." },
      { term: "hint", ar: "تلميح", explainAr: "Cool burns, don't treat them." }
    ]
  },

  {
    id: "IN-54",
    topic: "incidents",
    promptEn: "After a collision, which is a warning sign of shock?",
    promptAr: "ما علامة الصدمة بعد حادث؟",
    options: [
      { en: "Flushed skin", ar: "جلد محمر", correct: false },
      { en: "Warm, dry skin", ar: "جلد دافئ وجاف", correct: false },
      { en: "Slow pulse", ar: "نبض بطيء", correct: false },
      { en: "Rapid, shallow breathing", ar: "تنفس سريع وسطحي", correct: true }
    ],
    keywords: [
      { term: "shock", ar: "صدمة", explainAr: "حالة طبية خطيرة قد تحدث بعد الحوادث." },
      { term: "hint", ar: "تلميح", explainAr: "Shock affects breathing." }
    ]
  },

  {
    id: "IN-55",
    topic: "incidents",
    promptEn: "Your car breaks down on a railway crossing. What's the first thing to do?",
    promptAr: "تعطلت سيارتك على السكة. ما أول تصرف؟",
    options: [
      { en: "Warn drivers behind", ar: "حذّر السائقين خلفك", correct: false },
      { en: "Leave the vehicle and clear everyone away", ar: "اترك المركبة وأبعد الجميع", correct: true },
      { en: "Walk along the tracks", ar: "امشِ على القضبان", correct: false },
      { en: "Stay in the car", ar: "ابقَ في السيارة", correct: false }
    ],
    keywords: [
      { term: "railway crossing", ar: "ممر سكة حديد", explainAr: "تقاطع بين طريق وسكة حديدية." },
      { term: "hint", ar: "تلميح", explainAr: "Trains cannot stop quickly." }
    ]
  },

  {
    id: "IN-56",
    topic: "incidents",
    promptEn: "When may you use hazard warning lights?",
    promptAr: "متى يُسمح باستخدام أضواء التحذير؟",
    options: [
      { en: "When stopped and causing a temporary obstruction", ar: "عند التوقف والتسبب في عائق مؤقت", correct: true },
      { en: "When driving without headlights", ar: "عند القيادة بدون أضواء أمامية", correct: false },
      { en: "When parked briefly on double yellow lines", ar: "عند الوقوف لفترة قصيرة على خطوط صفراء مزدوجة", correct: false },
      { en: "When driving slowly because you're lost", ar: "عند القيادة ببطء لأنك تائه", correct: false }
    ],
    keywords: [
      { term: "hazard lights", ar: "أضواء التحذير", explainAr: "أضواء تحذيرية تُستخدم لتنبيه السائقين الآخرين." },
      { term: "hint", ar: "تلميح", explainAr: "Hazards warn others of danger." }
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
