import type { Locale } from "@/lib/types";

export type Dictionary = {
  meta: { title: string; short: string; description: string };
  nav: {
    home: string;
    services: string;
    about: string;
    contact: string;
    book: string;
    language: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    book: string;
    whatsapp: string;
    hoursLabel: string;
    placeLabel: string;
    phoneLabel: string;
  };
  servicesSection: { eyebrow: string; title: string; lead: string; more: string; book: string };
  approach: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  visit: { eyebrow: string; title: string; lead: string; map: string; directions: string };
  cta: { title: string; lead: string; book: string };
  footer: { rights: string; staff: string; nav: string; visit: string };
  whatsappFloat: string;
  skip: string;
  servicesPage: { title: string; lead: string };
  aboutPage: { title: string; lead: string; expectTitle: string; expect: string[] };
  contactPage: { title: string; lead: string };
  contact: {
    name: string;
    phone: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    whatsapp: string;
    another: string;
  };
  book: {
    title: string;
    lead: string;
    name: string;
    phone: string;
    phoneHint: string;
    service: string;
    date: string;
    time: string;
    timePlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    sending: string;
    loadingSlots: string;
    noSlots: string;
    chooseDate: string;
    successTitle: string;
    successLead: string;
    reference: string;
    sendWhatsapp: string;
    whatsappHint: string;
    another: string;
    fallback: string;
  };
  errors: {
    invalid: string;
    taken: string;
    closed: string;
    rate: string;
    server: string;
  };
  notFound: { title: string; lead: string; home: string };
};

const ar: Dictionary = {
  meta: {
    title: "عيادة الدكتورة غالية الزبون",
    short: "د. غالية الزبون",
    description:
      "عيادة أسنان في الضليل بجانب صيدلية مزبار. علاج العصب، التركيبات والتجميل، الحشوات، التنظيف، التبييض بالليزر، وجراحة الفم. الدوام يوميًا من 10 صباحًا حتى 8 مساءً.",
  },
  nav: {
    home: "الرئيسية",
    services: "الخدمات",
    about: "عن العيادة",
    contact: "تواصل",
    book: "احجز موعدًا",
    language: "English",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
  },
  hero: {
    eyebrow: "DENTAL CLINIC",
    title: "عيادة الدكتورة غالية الزبون",
    lead: "عناية واضحة بالأسنان في الضليل: علاج العصب، التركيبات والتجميل، التبييض بالليزر، وجراحة الفم.",
    book: "احجز موعدًا",
    whatsapp: "واتساب",
    hoursLabel: "الدوام",
    placeLabel: "الموقع",
    phoneLabel: "الهاتف",
  },
  servicesSection: {
    eyebrow: "الخدمات",
    title: "رعاية سنية في مكان واحد",
    lead: "من التنظيف والوقاية حتى العلاج والتجميل والجراحة. كل خدمة تبدأ بفحص يوضح ما يحتاجه السن فعلًا.",
    more: "تفاصيل الخدمة",
    book: "احجز هذه الخدمة",
  },
  approach: {
    eyebrow: "طريقة الحجز",
    title: "موعد واضح، وتأكيد على واتساب",
    items: [
      {
        title: "تختارون الوقت",
        text: "النموذج يعرض الأوقات المتاحة من العاشرة صباحًا حتى الثامنة مساءً، كل موعد ثلاثون دقيقة.",
      },
      {
        title: "يُحفظ الطلب في العيادة",
        text: "يصل الحجز إلى لوحة المواعيد برقم طلب، حتى تتم متابعته من غير أن يضيع بين الرسائل.",
      },
      {
        title: "تأكيد عبر واتساب",
        text: "بعد الإرسال تُفتح رسالة جاهزة إلى العيادة. الرد على واتساب هو تأكيد الموعد.",
      },
    ],
  },
  visit: {
    eyebrow: "الزيارة",
    title: "في الضليل، بجانب صيدلية مزبار",
    lead: "الدوام يوميًا من العاشرة صباحًا حتى الثامنة مساءً. للوصول الأسرع استخدموا الخريطة أو الاتصال المباشر.",
    map: "خريطة العيادة",
    directions: "فتح الموقع في خرائط جوجل",
  },
  cta: {
    title: "نرتب موعدكم اليوم",
    lead: "اختاروا الخدمة والوقت، ثم أرسلوا التفاصيل على واتساب العيادة.",
    book: "الانتقال إلى الحجز",
  },
  footer: {
    rights: "عيادة الدكتورة غالية الزبون. جميع الحقوق محفوظة.",
    staff: "دخول الموظفين",
    nav: "الصفحات",
    visit: "الزيارة",
  },
  whatsappFloat: "مراسلة العيادة على واتساب",
  skip: "تخطٍ إلى المحتوى",
  servicesPage: {
    title: "خدمات العيادة",
    lead: "سبع خدمات تغطي العلاج والتجميل والوقاية والجراحة. الوصف عام، والخطة النهائية تُحدَّد بعد فحص الفم.",
  },
  aboutPage: {
    title: "عن العيادة",
    lead: "عيادة الدكتورة غالية الزبون عيادة أسنان في الضليل، إلى جانب صيدلية مزبار. نستقبل المراجعين يوميًا من العاشرة صباحًا حتى الثامنة مساءً.",
    expectTitle: "قبل الزيارة",
    expect: [
      "الحجز من الموقع طلب مبدئي، والتأكيد يتم برسالة واتساب من العيادة.",
      "مدة الموعد في الجدول ثلاثون دقيقة، وقد يطول الشرح أو العلاج حسب الحالة.",
      "إذا توفرت صورة أو تقرير سابق للأسنان، يفيد إحضاره إلى الزيارة.",
    ],
  },
  contactPage: {
    title: "تواصلوا مع العيادة",
    lead: "للاتصال، واتساب، أو رسالة تُحفظ لدى العيادة. العنوان: الضليل بجانب صيدلية مزبار.",
  },
  contact: {
    name: "الاسم",
    phone: "رقم الهاتف",
    message: "الرسالة",
    submit: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    success: "وصلت رسالتكم إلى العيادة.",
    whatsapp: "إرسال الرسالة أيضًا على واتساب",
    another: "رسالة جديدة",
  },
  book: {
    title: "حجز موعد",
    lead: "اختاروا الخدمة واليوم والوقت. الطلب يُحفظ في العيادة، ثم ترسلون تفاصيله جاهزة على واتساب.",
    name: "اسم المراجع",
    phone: "رقم الهاتف",
    phoneHint: "رقم أردني يبدأ بـ 07، مثل 0791853391",
    service: "الخدمة",
    date: "التاريخ",
    time: "الوقت",
    timePlaceholder: "اختاروا الوقت",
    notes: "ملاحظات",
    notesPlaceholder: "اختياري: ألم، تفضيل وقت، أو معلومة تفيد الطبيب",
    submit: "حفظ الطلب",
    sending: "جارٍ حفظ الطلب…",
    loadingSlots: "جارٍ تحميل الأوقات…",
    noSlots: "لا توجد أوقات متاحة في هذا اليوم.",
    chooseDate: "اختاروا التاريخ أولًا",
    successTitle: "تم حفظ طلب الموعد",
    successLead: "الطلب موجود في لوحة العيادة. أرسلوا الرسالة التالية على واتساب ليصل فورًا إلى هاتف العيادة.",
    reference: "رقم الطلب",
    sendWhatsapp: "إرسال التفاصيل على واتساب",
    whatsappHint: "يفتح واتساب ورسالة جاهزة. أرسلوها من رقمكم حتى تستطيع العيادة الرد وتأكيد الموعد.",
    another: "حجز موعد آخر",
    fallback: "يمكنكم أيضًا مراسلة العيادة مباشرة إذا تعذر استخدام النموذج.",
  },
  errors: {
    invalid: "راجعوا الاسم ورقم الهاتف والحقول المطلوبة.",
    taken: "هذا الوقت حُجز للتو. اختاروا وقتًا آخر.",
    closed: "الوقت خارج دوام العيادة أو لم يعد متاحًا.",
    rate: "وصلت عدة طلبات من هذا الرقم. حاولوا لاحقًا أو اتصلوا بالعيادة.",
    server: "تعذر حفظ الطلب الآن. اتصلوا بالعيادة أو أرسلوا واتساب.",
  },
  notFound: {
    title: "الصفحة غير موجودة",
    lead: "الرابط غير متاح. يمكنكم العودة إلى الرئيسية أو حجز موعد.",
    home: "العودة إلى الرئيسية",
  },
};

const en: Dictionary = {
  meta: {
    title: "Dr. Ghalia Alzboun Dental Clinic",
    short: "Dr. Ghalia Alzboun",
    description:
      "Dental clinic in Al-Dulail, next to Mazbar Pharmacy. Root canal treatment, crowns and cosmetics, fillings, cleaning, laser whitening, and oral surgery. Open daily from 10:00 AM to 8:00 PM.",
  },
  nav: {
    home: "Home",
    services: "Services",
    about: "The clinic",
    contact: "Contact",
    book: "Book",
    language: "العربية",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "DENTAL CLINIC",
    title: "Dr. Ghalia Alzboun",
    lead: "Dental care in Al-Dulail: root canal treatment, crowns and cosmetics, laser whitening, and oral surgery.",
    book: "Book a visit",
    whatsapp: "WhatsApp",
    hoursLabel: "Hours",
    placeLabel: "Location",
    phoneLabel: "Phone",
  },
  servicesSection: {
    eyebrow: "Services",
    title: "Dental care in one clinic",
    lead: "From cleaning and prevention to treatment, cosmetics, and surgery. Each service starts with an examination of what the tooth actually needs.",
    more: "Service details",
    book: "Book this service",
  },
  approach: {
    eyebrow: "Booking",
    title: "A clear visit, confirmed on WhatsApp",
    items: [
      {
        title: "Choose a time",
        text: "The form shows open times from 10:00 AM to 8:00 PM. Each appointment is thirty minutes.",
      },
      {
        title: "The clinic keeps the request",
        text: "The booking is stored on the clinic schedule with a reference, so it is not left only inside a chat.",
      },
      {
        title: "Confirm on WhatsApp",
        text: "After saving, a ready message opens to the clinic. The reply on WhatsApp confirms the visit.",
      },
    ],
  },
  visit: {
    eyebrow: "Visit",
    title: "In Al-Dulail, next to Mazbar Pharmacy",
    lead: "Open daily from 10:00 AM until 8:00 PM. Use the map or call for the most direct way here.",
    map: "Clinic map",
    directions: "Open in Google Maps",
  },
  cta: {
    title: "Arrange your visit",
    lead: "Choose the service and time, then send the details to the clinic on WhatsApp.",
    book: "Go to booking",
  },
  footer: {
    rights: "Dr. Ghalia Alzboun Dental Clinic. All rights reserved.",
    staff: "Staff sign in",
    nav: "Pages",
    visit: "Visit",
  },
  whatsappFloat: "Message the clinic on WhatsApp",
  skip: "Skip to content",
  servicesPage: {
    title: "Clinic services",
    lead: "Seven services covering treatment, cosmetics, prevention, and surgery. These descriptions are general. The final plan follows an oral examination.",
  },
  aboutPage: {
    title: "About the clinic",
    lead: "Dr. Ghalia Alzboun Dental Clinic is in Al-Dulail, next to Mazbar Pharmacy. Patients are seen daily from 10:00 AM until 8:00 PM.",
    expectTitle: "Before you come",
    expect: [
      "A website booking is a request. The clinic confirms it with a WhatsApp message.",
      "The schedule uses thirty-minute visits. The conversation or treatment may take longer.",
      "If you have a previous dental image or report, bringing it is useful.",
    ],
  },
  contactPage: {
    title: "Contact the clinic",
    lead: "Call, use WhatsApp, or leave a message that the clinic keeps. Address: Al-Dulail, next to Mazbar Pharmacy.",
  },
  contact: {
    name: "Name",
    phone: "Phone",
    message: "Message",
    submit: "Send message",
    sending: "Sending…",
    success: "Your message reached the clinic.",
    whatsapp: "Also send it on WhatsApp",
    another: "New message",
  },
  book: {
    title: "Book a visit",
    lead: "Choose a service, day, and time. The request is saved for the clinic, then you send the details on WhatsApp.",
    name: "Patient name",
    phone: "Phone number",
    phoneHint: "A Jordanian mobile starting with 07, such as 0791853391",
    service: "Service",
    date: "Date",
    time: "Time",
    timePlaceholder: "Choose a time",
    notes: "Notes",
    notesPlaceholder: "Optional: pain, a time preference, or anything useful for the dentist",
    submit: "Save request",
    sending: "Saving…",
    loadingSlots: "Loading times…",
    noSlots: "No open times remain on this day.",
    chooseDate: "Choose a date first",
    successTitle: "Your request is saved",
    successLead: "It is on the clinic schedule. Send the prepared WhatsApp message so it also reaches the clinic phone.",
    reference: "Reference",
    sendWhatsapp: "Send the details on WhatsApp",
    whatsappHint: "WhatsApp opens with a ready message. Send it from your number so the clinic can reply and confirm.",
    another: "Book another visit",
    fallback: "You can also message the clinic directly if the form is unavailable.",
  },
  errors: {
    invalid: "Check the name, phone number, and required fields.",
    taken: "That time was just reserved. Please choose another.",
    closed: "That time is outside clinic hours or no longer open.",
    rate: "Several requests came from this number. Try later or call the clinic.",
    server: "The request could not be saved. Call the clinic or send a WhatsApp message.",
  },
  notFound: {
    title: "Page not found",
    lead: "This link is not available. You can return home or book a visit.",
    home: "Back to home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localePath(locale: Locale, path = "/"): string {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function switchLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (segments[1] === "ar" || segments[1] === "en") {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return `/${target}`;
}
