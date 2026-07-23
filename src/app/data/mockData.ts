export type Role = "family" | "caregiver" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  conditions: string[];
  medications: string[];
  emergencyContact: string;
  address: string;
  photo?: string;
  familyMemberId: string;
  bloodType: string;
  allergies: string[];
}

export interface Caregiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  verified: boolean;
  available: boolean;
  experience: string;
  languages: string[];
  photo: string;
  bio: string;
  certifications: string[];
  location: string;
  status: "pending" | "approved" | "rejected";
  joinedDate: string;
}

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  caregiverId: string;
  caregiverName: string;
  familyMemberId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  totalAmount: number;
  tasks: Task[];
  visitLog?: VisitLog;
  invoiceId?: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: { lat: number; lng: number };
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  category: "medication" | "meal" | "hygiene" | "exercise" | "social" | "other";
}

export interface VisitLog {
  id: string;
  bookingId: string;
  submittedAt: string;
  notes: string;
  tasksCompleted: string[];
  observations: string;
  nextVisitNotes: string;
  vitals?: VitalReading;
}

export interface VitalReading {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
  weight?: number;
}

export interface Transaction {
  id: string;
  bookingId: string;
  familyMemberName: string;
  caregiverName: string;
  amount: number;
  platformFee: number;
  caregiverPayout: number;
  date: string;
  status: "pending" | "completed" | "refunded";
  paymentMethod: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

// ── MOCK USERS ──────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Amina Odhiambo",
    email: "family@vizazi.care",
    role: "family",
    phone: "+254 712 345 678",
    avatar: "https://images.unsplash.com/photo-1758686254563-5c5ab338c8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  },
  {
    id: "u2",
    name: "Dr. Grace Kamau",
    email: "caregiver@vizazi.care",
    role: "caregiver",
    phone: "+254 723 456 789",
    avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  },
  {
    id: "u3",
    name: "James Mwangi",
    email: "admin@vizazi.care",
    role: "admin",
    phone: "+254 734 567 890",
    avatar: "",
  },
];

// ── PATIENTS ────────────────────────────────────────────────────────────────

export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Mzee Francis Odhiambo",
    age: 78,
    conditions: ["Type 2 Diabetes", "Hypertension", "Mild Cognitive Impairment"],
    medications: ["Metformin 500mg", "Amlodipine 5mg", "Aspirin 75mg"],
    emergencyContact: "+254 712 345 678 (Amina - Daughter)",
    address: "14 Kileleshwa Avenue, Nairobi",
    photo: "https://images.unsplash.com/photo-1765896387454-3c29c0473615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    familyMemberId: "u1",
    bloodType: "O+",
    allergies: ["Penicillin", "Sulfa Drugs"],
  },
];

// ── CAREGIVERS ───────────────────────────────────────────────────────────────

export const mockCaregivers: Caregiver[] = [
  {
    id: "c1",
    name: "Grace Kamau",
    email: "grace@vizazi.care",
    phone: "+254 723 456 789",
    specialties: ["Dementia Care", "Diabetes Management", "Physiotherapy"],
    rating: 4.9,
    reviews: 87,
    hourlyRate: 800,
    verified: true,
    available: true,
    experience: "6 years",
    languages: ["English", "Swahili", "Kikuyu"],
    photo: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Certified nurse with 6 years specialising in elderly care and chronic disease management. Passionate about dignity and quality of life for seniors.",
    certifications: ["RN License", "Dementia Care Certification", "BLS/CPR"],
    location: "Nairobi, Kenya",
    status: "approved",
    joinedDate: "2022-03-15",
  },
  {
    id: "c2",
    name: "Dr. Beatrice Wanjiru",
    email: "beatrice@vizazi.care",
    phone: "+254 734 567 891",
    specialties: ["Palliative Care", "Post-Surgery Recovery", "Wound Care"],
    rating: 4.8,
    reviews: 64,
    hourlyRate: 1000,
    verified: true,
    available: true,
    experience: "9 years",
    languages: ["English", "Swahili"],
    photo: "https://images.unsplash.com/photo-1576669801945-7a346954da5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Medical doctor turned home care specialist. Experienced in managing complex medical conditions in home settings.",
    certifications: ["MBChB", "Palliative Care Diploma", "Wound Care Specialist"],
    location: "Nairobi, Kenya",
    status: "approved",
    joinedDate: "2021-06-22",
  },
  {
    id: "c3",
    name: "Samuel Otieno",
    email: "samuel@vizazi.care",
    phone: "+254 745 678 902",
    specialties: ["Physical Therapy", "Stroke Rehabilitation", "Fall Prevention"],
    rating: 4.7,
    reviews: 42,
    hourlyRate: 700,
    verified: true,
    available: false,
    experience: "4 years",
    languages: ["English", "Swahili", "Luo"],
    photo: "https://images.unsplash.com/photo-1686052401814-d0430982f8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Physical therapist specialising in mobility restoration and fall prevention for elderly patients.",
    certifications: ["BPT", "Neuro-Rehab Certification", "CPR"],
    location: "Nairobi, Kenya",
    status: "approved",
    joinedDate: "2023-01-10",
  },
  {
    id: "c4",
    name: "Faith Njeri",
    email: "faith@vizazi.care",
    phone: "+254 756 789 013",
    specialties: ["Nutritional Care", "Diabetes Management", "Companionship"],
    rating: 4.6,
    reviews: 28,
    hourlyRate: 600,
    verified: false,
    available: true,
    experience: "2 years",
    languages: ["English", "Swahili"],
    photo: "https://images.unsplash.com/photo-1620856902651-ce18d6d31d42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Nutritionist with a focus on dietary management for elderly patients with chronic conditions.",
    certifications: ["BSc Nutrition", "First Aid"],
    location: "Kiambu, Kenya",
    status: "pending",
    joinedDate: "2025-12-01",
  },
  {
    id: "c5",
    name: "Peter Macharia",
    email: "peter@vizazi.care",
    phone: "+254 767 890 124",
    specialties: ["General Home Care", "Medication Management", "Bathing & Grooming"],
    rating: 4.5,
    reviews: 19,
    hourlyRate: 550,
    verified: false,
    available: true,
    experience: "1 year",
    languages: ["English", "Swahili", "Kikuyu"],
    photo: "",
    bio: "Trained home care aide dedicated to providing respectful and professional care to elderly patients.",
    certifications: ["CNA Certificate", "BLS"],
    location: "Thika, Kenya",
    status: "pending",
    joinedDate: "2026-01-15",
  },
];

// ── BOOKINGS ─────────────────────────────────────────────────────────────────

export const mockBookings: Booking[] = [
  {
    id: "b1",
    patientId: "p1",
    patientName: "Mzee Francis Odhiambo",
    caregiverId: "c1",
    caregiverName: "Grace Kamau",
    familyMemberId: "u1",
    date: "2026-03-06",
    startTime: "09:00",
    endTime: "13:00",
    duration: 4,
    status: "in-progress",
    totalAmount: 3200,
    invoiceId: "INV-2026-001",
    checkInTime: "09:03",
    checkInLocation: { lat: -1.2921, lng: 36.8219 },
    tasks: [
      { id: "t1", description: "Administer morning medication (Metformin 500mg, Aspirin 75mg)", completed: true, completedAt: "09:15", category: "medication" },
      { id: "t2", description: "Check blood pressure and blood sugar levels", completed: true, completedAt: "09:22", category: "medication" },
      { id: "t3", description: "Assist with morning hygiene and grooming", completed: true, completedAt: "10:05", category: "hygiene" },
      { id: "t4", description: "Prepare and serve breakfast (diabetic-friendly)", completed: true, completedAt: "10:35", category: "meal" },
      { id: "t5", description: "15-minute gentle walk in the garden", completed: false, category: "exercise" },
      { id: "t6", description: "Administer midday medication (Amlodipine 5mg)", completed: false, category: "medication" },
    ],
  },
  {
    id: "b2",
    patientId: "p1",
    patientName: "Mzee Francis Odhiambo",
    caregiverId: "c1",
    caregiverName: "Grace Kamau",
    familyMemberId: "u1",
    date: "2026-03-04",
    startTime: "09:00",
    endTime: "13:00",
    duration: 4,
    status: "completed",
    totalAmount: 3200,
    invoiceId: "INV-2026-002",
    checkInTime: "09:01",
    checkOutTime: "13:05",
    tasks: [
      { id: "t7", description: "Administer morning medication", completed: true, completedAt: "09:10", category: "medication" },
      { id: "t8", description: "Check vitals", completed: true, completedAt: "09:20", category: "medication" },
      { id: "t9", description: "Assist with hygiene", completed: true, completedAt: "10:00", category: "hygiene" },
      { id: "t10", description: "Prepare breakfast", completed: true, completedAt: "10:30", category: "meal" },
    ],
    visitLog: {
      id: "vl1",
      bookingId: "b2",
      submittedAt: "2026-03-04T13:10:00",
      notes: "Patient was in good spirits today. Ate full breakfast with good appetite.",
      tasksCompleted: ["t7", "t8", "t9", "t10"],
      observations: "Blood sugar was slightly elevated (8.2 mmol/L). Suggested reducing fruit juice at breakfast. Blood pressure stable at 128/82.",
      nextVisitNotes: "Monitor blood sugar trend. Bring glucometer calibration kit.",
      vitals: {
        timestamp: "2026-03-04T09:25:00",
        heartRate: 74,
        bloodPressureSystolic: 128,
        bloodPressureDiastolic: 82,
        temperature: 36.6,
        oxygenSaturation: 97,
        weight: 72.5,
      },
    },
  },
  {
    id: "b3",
    patientId: "p1",
    patientName: "Mzee Francis Odhiambo",
    caregiverId: "c2",
    caregiverName: "Dr. Beatrice Wanjiru",
    familyMemberId: "u1",
    date: "2026-03-10",
    startTime: "10:00",
    endTime: "14:00",
    duration: 4,
    status: "upcoming",
    totalAmount: 4000,
    invoiceId: "INV-2026-003",
    tasks: [
      { id: "t11", description: "Wound dressing change (left knee)", completed: false, category: "hygiene" },
      { id: "t12", description: "Medication administration", completed: false, category: "medication" },
      { id: "t13", description: "Physiotherapy exercises", completed: false, category: "exercise" },
    ],
  },
];

// ── VITALS HISTORY ────────────────────────────────────────────────────────────

export const mockVitalsHistory: VitalReading[] = [
  { timestamp: "2026-02-24T09:20:00", heartRate: 76, bloodPressureSystolic: 132, bloodPressureDiastolic: 84, temperature: 36.5, oxygenSaturation: 96 },
  { timestamp: "2026-02-26T09:18:00", heartRate: 72, bloodPressureSystolic: 130, bloodPressureDiastolic: 83, temperature: 36.7, oxygenSaturation: 97 },
  { timestamp: "2026-02-28T09:25:00", heartRate: 78, bloodPressureSystolic: 135, bloodPressureDiastolic: 86, temperature: 36.6, oxygenSaturation: 96 },
  { timestamp: "2026-03-02T09:15:00", heartRate: 74, bloodPressureSystolic: 129, bloodPressureDiastolic: 81, temperature: 36.4, oxygenSaturation: 97 },
  { timestamp: "2026-03-04T09:25:00", heartRate: 74, bloodPressureSystolic: 128, bloodPressureDiastolic: 82, temperature: 36.6, oxygenSaturation: 97 },
  { timestamp: "2026-03-06T09:22:00", heartRate: 71, bloodPressureSystolic: 126, bloodPressureDiastolic: 80, temperature: 36.5, oxygenSaturation: 98 },
];

// ── TRANSACTIONS ──────────────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    bookingId: "b1",
    familyMemberName: "Amina Odhiambo",
    caregiverName: "Grace Kamau",
    amount: 3200,
    platformFee: 320,
    caregiverPayout: 2880,
    date: "2026-03-06",
    status: "completed",
    paymentMethod: "M-Pesa",
  },
  {
    id: "txn-002",
    bookingId: "b2",
    familyMemberName: "Amina Odhiambo",
    caregiverName: "Grace Kamau",
    amount: 3200,
    platformFee: 320,
    caregiverPayout: 2880,
    date: "2026-03-04",
    status: "completed",
    paymentMethod: "M-Pesa",
  },
  {
    id: "txn-003",
    bookingId: "b3",
    familyMemberName: "Amina Odhiambo",
    caregiverName: "Dr. Beatrice Wanjiru",
    amount: 4000,
    platformFee: 400,
    caregiverPayout: 3600,
    date: "2026-03-06",
    status: "pending",
    paymentMethod: "Card",
  },
];

// ── SUPPORT TICKETS ───────────────────────────────────────────────────────────

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "tkt-001",
    userId: "u1",
    userName: "Amina Odhiambo",
    userRole: "Family Member",
    subject: "Unable to download invoice",
    description: "I cannot find the download button for invoice INV-2026-001. Please assist.",
    status: "open",
    priority: "medium",
    createdAt: "2026-03-05T14:32:00",
    updatedAt: "2026-03-05T14:32:00",
    messages: [
      { id: "m1", senderId: "u1", senderName: "Amina Odhiambo", content: "I cannot find the download button for invoice INV-2026-001. Please assist.", timestamp: "2026-03-05T14:32:00", isAdmin: false },
    ],
  },
  {
    id: "tkt-002",
    userId: "u2",
    userName: "Grace Kamau",
    userRole: "Caregiver",
    subject: "Payout not received for March 4th visit",
    description: "My payout for booking b2 has not reflected in my account after 48 hours.",
    status: "in-progress",
    priority: "high",
    createdAt: "2026-03-06T08:15:00",
    updatedAt: "2026-03-06T10:00:00",
    messages: [
      { id: "m2", senderId: "u2", senderName: "Grace Kamau", content: "My payout for booking b2 has not reflected in my account after 48 hours.", timestamp: "2026-03-06T08:15:00", isAdmin: false },
      { id: "m3", senderId: "u3", senderName: "Admin James", content: "Hi Grace, we are investigating this with our payments team. We'll resolve within 24 hours.", timestamp: "2026-03-06T10:00:00", isAdmin: true },
    ],
  },
  {
    id: "tkt-003",
    userId: "u1",
    userName: "Robert Kariuki",
    userRole: "Family Member",
    subject: "Caregiver arrived 45 minutes late",
    description: "The caregiver for our booking on March 3rd arrived very late without prior notification.",
    status: "resolved",
    priority: "high",
    createdAt: "2026-03-03T15:00:00",
    updatedAt: "2026-03-04T09:00:00",
    messages: [
      { id: "m4", senderId: "u1", senderName: "Robert Kariuki", content: "The caregiver arrived 45 minutes late without notification.", timestamp: "2026-03-03T15:00:00", isAdmin: false },
      { id: "m5", senderId: "u3", senderName: "Admin James", content: "We sincerely apologise for this. We have issued a 15% credit on your next booking. The caregiver has been notified.", timestamp: "2026-03-04T09:00:00", isAdmin: true },
    ],
  },
];

// ── CALENDAR AVAILABILITY ─────────────────────────────────────────────────────

export const caregiverAvailability: Record<string, string[]> = {
  "2026-03-09": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "2026-03-10": [],
  "2026-03-11": ["09:00", "10:00", "11:00", "12:00"],
  "2026-03-12": ["13:00", "14:00", "15:00", "16:00"],
  "2026-03-13": ["09:00", "10:00"],
  "2026-03-16": ["09:00", "10:00", "11:00", "14:00"],
  "2026-03-17": ["09:00", "10:00", "11:00", "12:00", "13:00"],
};
