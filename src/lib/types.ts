export type Locale = "ar" | "en";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AppointmentDto = {
  id: string;
  reference: string;
  patientName: string;
  phone: string;
  serviceSlug: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string | null;
  staffNote: string | null;
  status: AppointmentStatus;
  locale: Locale;
  createdAt: string;
};

export type ContactMessageDto = {
  id: string;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
