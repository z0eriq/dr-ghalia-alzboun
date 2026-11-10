import { clinic } from "@/lib/clinic";
import { toWhatsAppNumber } from "@/lib/phone";
import type { Locale } from "@/lib/types";

/** Forces each Arabic line to stay right-to-left inside WhatsApp. */
const RLM = "\u200F";
/** Keeps a phone, reference, or clock time in written order. */
const LRI = "\u2066";
/** Keeps an Arabic value from swapping places with the label. */
const RLI = "\u2067";
const PDI = "\u2069";

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] as const;
const MONTHS = [
  "كانون الثاني",
  "شباط",
  "آذار",
  "نيسان",
  "أيار",
  "حزيران",
  "تموز",
  "آب",
  "أيلول",
  "تشرين الأول",
  "تشرين الثاني",
  "كانون الأول",
] as const;

export function whatsAppLink(localOrInternational: string, text: string): string {
  const digits = localOrInternational.replace(/\D/g, "");
  const number = digits.startsWith("962") ? digits : toWhatsAppNumber(digits);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function clinicInquiryLink(locale: Locale): string {
  const text =
    locale === "ar"
      ? rtl("السلام عليكم، أرغب بالاستفسار عن موعد في عيادة الدكتورة غالية الزبون.")
      : "Hello, I would like to ask about an appointment at Dr. Ghalia Alzboun Dental Clinic.";
  return whatsAppLink(clinic.phoneLocal, text);
}

type BookingMessageInput = {
  reference: string;
  patientName: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string | null;
};

/** Arabic message sent to the clinic, regardless of the website language. */
export function bookingMessage(input: BookingMessageInput): string {
  const lines = [
    rtl("السلام عليكم، أرغب بحجز موعد في عيادة الدكتورة غالية الزبون."),
    "",
    field("رقم الطلب", input.reference),
    field("الاسم", input.patientName),
    field("الهاتف", input.phone),
    field("الخدمة", input.serviceName),
    field("التاريخ", appointmentDate(input.date)),
    field("الوقت", input.time),
  ];

  if (input.notes) {
    lines.push(field("ملاحظات", input.notes));
  }

  return lines.join("\n");
}

type PatientMessageInput = {
  patientName: string;
  serviceName: string;
  date: string;
  time: string;
};

export function confirmationMessage(input: PatientMessageInput): string {
  return [
    rtl(`السلام عليكم ${isolate(input.patientName)}،`),
    rtl("معكم عيادة الدكتورة غالية الزبون."),
    rtl("تم تأكيد موعدكم:"),
    field("الخدمة", input.serviceName),
    field("التاريخ", appointmentDate(input.date)),
    field("الوقت", input.time),
    field("الموقع", clinic.addressAr),
    rtl("نرجو الحضور قبل الموعد بعشر دقائق."),
    field("للاستفسار", clinic.phoneDisplay),
  ].join("\n");
}

export function cancellationMessage(input: PatientMessageInput): string {
  return [
    rtl(`السلام عليكم ${isolate(input.patientName)}،`),
    rtl("معكم عيادة الدكتورة غالية الزبون."),
    rtl("نعتذر، الموعد التالي لم يعد متاحًا:"),
    field("الخدمة", input.serviceName),
    field("التاريخ", appointmentDate(input.date)),
    field("الوقت", input.time),
    rtl("يمكنكم حجز وقت آخر من موقع العيادة، أو بالرد على هذه الرسالة."),
    field("للاستفسار", clinic.phoneDisplay),
  ].join("\n");
}

export function contactMessage(input: { name: string; phone: string; message: string }): string {
  return [
    rtl("السلام عليكم، رسالة من موقع عيادة الدكتورة غالية الزبون."),
    "",
    field("الاسم", input.name),
    field("الهاتف", input.phone),
    field("الرسالة", input.message),
  ].join("\n");
}

export function patientReply(name: string): string {
  return rtl(`السلام عليكم ${isolate(name)}، معكم عيادة الدكتورة غالية الزبون بخصوص رسالتكم.`);
}

function rtl(text: string): string {
  return `${RLM}${text}`;
}

function field(label: string, value: string): string {
  return `${RLM}${label}: ${isolate(value)}`;
}

/** Arabic values stay Arabic. Numbers and Latin text stay in the order they were typed. */
function isolate(value: string): string {
  const arabic = /[\u0600-\u06FF]/.test(value);
  return arabic ? `${RLI}${value}${PDI}` : `${LRI}${value}${PDI}`;
}

/** Weekday plus an unambiguous day-month-year, without the digits WhatsApp reorders. */
function appointmentDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const utc = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  const weekday = WEEKDAYS[utc.getUTCDay()] ?? "";
  const monthName = MONTHS[(month ?? 1) - 1] ?? "";
  return `${weekday}، ${LRI}${day}${PDI} ${monthName} ${LRI}${year}${PDI}`;
}
