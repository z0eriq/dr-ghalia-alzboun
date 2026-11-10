import type { Locale } from "@/lib/types";

export const services = [
  {
    slug: "root-canal",
    title: {
      ar: "علاج وعصب الأسنان",
      en: "Root canal treatment",
    },
    summary: {
      ar: "علاج لب السن عند الالتهاب أو التسوس العميق، لتخفيف الألم والحفاظ على السن قدر الإمكان.",
      en: "Treatment of the tooth pulp when decay or inflammation reaches the nerve, to relieve pain and keep the tooth when possible.",
    },
    detail: {
      ar: "إذا وصل التسوس إلى العصب أو ظهر ألم أو انتفاخ، يُنظَّف لب السن ثم يُغلق لمنع استمرار العدوى. يوضح الطبيب خطوات العلاج قبل البدء، وقد يحتاج السن إلى أكثر من جلسة حسب حالته.",
      en: "When decay reaches the nerve, or pain and swelling appear, the pulp is cleaned and sealed to stop the infection from continuing. The steps are explained before treatment starts, and some teeth need more than one visit.",
    },
  },
  {
    slug: "crowns-cosmetics",
    title: {
      ar: "تركيبات وتجميل الأسنان",
      en: "Crowns and cosmetic dentistry",
    },
    summary: {
      ar: "تيجان وجسور وحلول تجميلية لاستعادة شكل السن ووظيفته.",
      en: "Crowns, bridges, and cosmetic options that restore how a tooth looks and works.",
    },
    detail: {
      ar: "التركيبات تُستخدم عند كسر السن أو بعد علاج العصب أو لتعويض فراغ. التجميل قد يشمل تيجانًا أو عدسات حسب وضع الأسنان. الخطة تُحدَّد بعد الفحص، وليست كل حالة تحتاج الإجراء نفسه.",
      en: "Restorations are used for a broken tooth, after root canal treatment, or to replace a missing tooth. Cosmetic work may include crowns or veneers, decided after an examination. Not every case needs the same procedure.",
    },
  },
  {
    slug: "cosmetic-fillings",
    title: {
      ar: "حشوات تجميلية",
      en: "Tooth-colored fillings",
    },
    summary: {
      ar: "حشوات بلون الأسنان لإصلاح التسوس مع مظهر قريب من السن الطبيعي.",
      en: "Fillings matched to the tooth color, used to repair decay while keeping a natural look.",
    },
    detail: {
      ar: "تُزال الأنسجة المتسوسة ثم تُعاد الحشوة بلون مناسب للسن. هذا الخيار يناسب الأسنان التي ما زالت قوية بما يكفي من غير الحاجة إلى تلبيسة.",
      en: "The decayed tissue is removed and replaced with a filling close to the tooth’s color. This suits teeth that are still strong enough and do not need a crown.",
    },
  },
  {
    slug: "cleaning",
    title: {
      ar: "تنظيف وتلميع الأسنان",
      en: "Cleaning and polishing",
    },
    summary: {
      ar: "إزالة الجير والتصبغات السطحية وتلميع الأسنان ضمن العناية الوقائية.",
      en: "Removal of tartar and surface stains, followed by polishing as part of preventive care.",
    },
    detail: {
      ar: "التنظيف الدوري يساعد على تقليل التهاب اللثة والرائحة المرتبطة بالترسبات. التلميع ينعّم سطح السن بعد إزالة الجير، وعدد الزيارات يختلف حسب كمية الترسبات.",
      en: "Regular cleaning helps reduce gum irritation and odor linked to deposits. Polishing smooths the tooth after tartar removal. How often it is needed depends on how quickly deposits return.",
    },
  },
  {
    slug: "laser-whitening",
    title: {
      ar: "تبييض الأسنان بالليزر",
      en: "Laser teeth whitening",
    },
    summary: {
      ar: "تفتيح لون الأسنان بإشراف طبي داخل العيادة.",
      en: "In-clinic lightening of the tooth shade, done under dental supervision.",
    },
    detail: {
      ar: "التبييض يغيّر درجة لون الأسنان ولا يبدّل لون الحشوات أو التركيبات. النتيجة تختلف حسب اللون الأصلي ونوع التصبغ، لذلك يُفحص السن واللثة قبل الجلسة. قد لا يناسب التبييض كل حالة.",
      en: "Whitening changes the shade of natural teeth. It does not change the color of fillings or crowns. The result depends on the starting shade and the type of stain, so the teeth and gums are checked first. It is not suitable for every case.",
    },
  },
  {
    slug: "oral-surgery",
    title: {
      ar: "جراحة الفم والأسنان",
      en: "Oral surgery",
    },
    summary: {
      ar: "خلع جراحي وإجراءات فموية عندما لا يكفي العلاج التحفظي.",
      en: "Surgical extraction and oral procedures when conservative treatment is not enough.",
    },
    detail: {
      ar: "تشمل الحالات التي تحتاج خلعًا جراحيًا أو تدخلاً في الأنسجة المحيطة بالسن. يشرح الطبيب سبب الإجراء والعناية بعده قبل اتخاذ القرار.",
      en: "This covers cases that need a surgical extraction or care of the tissues around a tooth. The reason for the procedure and the after-care are explained before a decision is made.",
    },
  },
  {
    slug: "comprehensive-care",
    title: {
      ar: "عناية شاملة بصحة الفم والأسنان",
      en: "Complete oral care",
    },
    summary: {
      ar: "فحص وخطة علاج ومتابعة وقائية تناسب حالة كل مراجع.",
      en: "An examination, a treatment plan, and preventive follow-up shaped around each patient.",
    },
    detail: {
      ar: "تبدأ الزيارة بالتعرّف على الشكوى وفحص الأسنان واللثة، ثم تُرتَّب الأولويات: تهدئة الألم، علاج التسوس، أو الوقاية. الهدف خطة واضحة يمكن متابعتها على أكثر من موعد عند الحاجة.",
      en: "A visit starts with the concern you came for and an examination of the teeth and gums. Priorities are then set: easing pain, treating decay, or prevention. The aim is a clear plan that can continue over more than one visit when needed.",
    },
  },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

export function isServiceSlug(value: string): value is ServiceSlug {
  return services.some((service) => service.slug === value);
}

export function getService(slug: string) {
  return services.find((service) => service.slug === slug) ?? null;
}

export function localizedServices(locale: Locale) {
  return services.map((service) => ({
    slug: service.slug,
    title: service.title[locale],
    summary: service.summary[locale],
    detail: service.detail[locale],
  }));
}
