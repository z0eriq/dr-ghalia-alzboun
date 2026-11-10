const LOCAL_MOBILE = /^07[789]\d{7}$/;

/** Normalizes Jordanian mobile numbers to the local 07XXXXXXXX form. */
export function normalizeJordanPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("00962")) {
    digits = digits.slice(5);
  } else if (digits.startsWith("962")) {
    digits = digits.slice(3);
  }

  if (digits.length === 9 && digits.startsWith("7")) {
    digits = `0${digits}`;
  }

  return LOCAL_MOBILE.test(digits) ? digits : null;
}

export function toWhatsAppNumber(localPhone: string): string {
  return `962${localPhone.slice(1)}`;
}

export function formatJordanPhone(localPhone: string): string {
  if (!LOCAL_MOBILE.test(localPhone)) return localPhone;
  return `${localPhone.slice(0, 4)} ${localPhone.slice(4, 7)} ${localPhone.slice(7)}`;
}
