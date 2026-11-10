import { clinic } from "@/lib/clinic";
import { toWhatsAppNumber } from "@/lib/phone";
import type { Locale } from "@/lib/types";

export function whatsAppLink(localOrInternational: string, text: string): string {
  const digits = localOrInternational.replace(/\D/g, "");
  const number = digits.startsWith("962") ? digits : toWhatsAppNumber(digits);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function clinicInquiryLink(locale: Locale): string {
  const text =
    locale === "ar"
      ? "السلام عليكم، أرغب بالاستفسار عن موعد في عيادة الدكتورة غالية الزبون."
      : "Hello, I would like to ask about an appointment at Dr. Ghalia Alzboun Dental Clinic.";
  return whatsAppLink(clinic.phoneLocal, text);
}

type BookingMessageInput = {
  reference: string;
  patientName: string;
  phone: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  notes: string | null;
};

/** Arabic message sent to the clinic, regardless of the website language. */
export function bookingMessage(input: BookingMessageInput): string {
  const lines = [
    "السلام عليكم، أرغب بحجز موعد في عيادة الدكتورة غالية الزبون.",
    "",
    `رقم الطلب: ${input.reference}`,
    `الاسم: ${input.patientName}`,
    `الهاتف: ${input.phone}`,
    `الخدمة: ${input.serviceName}`,
    `التاريخ: ${input.dateLabel}`,
    `الوقت: ${input.timeLabel}`,
  ];

  if (input.notes) {
    lines.push(`ملاحظات: ${input.notes}`);
  }

  return lines.join("\n");
}

type PatientMessageInput = {
  patientName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
};

export function confirmationMessage(input: PatientMessageInput): string {
  return [
    `السلام عليكم ${input.patientName}،`,
    "معكم عيادة الدكتورة غالية الزبون.",
    "تم تأكيد موعدكم:",
    `الخدمة: ${input.serviceName}`,
    `التاريخ: ${input.dateLabel}`,
    `الوقت: ${input.timeLabel}`,
    `الموقع: ${clinic.addressAr}`,
    "نرجو الحضور قبل الموعد بعشر دقائق.",
    `للاستفسار: ${clinic.phoneDisplay}`,
  ].join("\n");
}

export function cancellationMessage(input: PatientMessageInput): string {
  return [
    `السلام عليكم ${input.patientName}،`,
    "معكم عيادة الدكتورة غالية الزبون.",
    "نعتذر، الموعد التالي لم يعد متاحًا:",
    `الخدمة: ${input.serviceName}`,
    `التاريخ: ${input.dateLabel}`,
    `الوقت: ${input.timeLabel}`,
    "يمكنكم حجز وقت آخر من موقع العيادة، أو بالرد على هذه الرسالة.",
    `للاستفسار: ${clinic.phoneDisplay}`,
  ].join("\n");
}
