export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Donor {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  donationCenter: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  date: string;
  type: "whole_blood" | "plasma" | "platelets";
  volume: number;
  center: string;
  collectedBy: string;
  bloodType: string;
}

export interface TestResult {
  id: string;
  donationId: string;
  donorId: string;
  donorName: string;
  date: string;
  hiv: "pass" | "fail" | "pending";
  hepatitisB: "pass" | "fail" | "pending";
  hepatitisC: "pass" | "fail" | "pending";
  syphilis: "pass" | "fail" | "pending";
  bloodTypingConfirmation: "pass" | "fail" | "pending";
  hemoglobin: number | null;
}

export interface MedicalNote {
  id: string;
  donorId: string;
  author: string;
  date: string;
  content: string;
}

const MOCK_DONORS: Donor[] = [
  {
    id: "d1", fullName: "James Carter", dateOfBirth: "1990-03-15", gender: "male",
    bloodType: "O+", phone: "+1-555-0101", email: "james.carter@email.com",
    address: "123 Main St, Springfield", emergencyContactName: "Sarah Carter",
    emergencyContactPhone: "+1-555-0102", emergencyContactRelationship: "Spouse",
    donationCenter: "Central Blood Bank", createdAt: "2024-01-10",
  },
  {
    id: "d2", fullName: "Maria Santos", dateOfBirth: "1985-07-22", gender: "female",
    bloodType: "A-", phone: "+1-555-0201", email: "maria.santos@email.com",
    address: "456 Oak Ave, Riverside", emergencyContactName: "Pedro Santos",
    emergencyContactPhone: "+1-555-0202", emergencyContactRelationship: "Brother",
    donationCenter: "Riverside Medical Center", createdAt: "2024-02-05",
  },
  {
    id: "d3", fullName: "Alex Johnson", dateOfBirth: "1992-11-08", gender: "male",
    bloodType: "B+", phone: "+1-555-0301", email: "alex.j@email.com",
    address: "789 Pine Rd, Lakewood", emergencyContactName: "Lisa Johnson",
    emergencyContactPhone: "+1-555-0302", emergencyContactRelationship: "Mother",
    donationCenter: "Central Blood Bank", createdAt: "2024-03-12",
  },
  {
    id: "d4", fullName: "Priya Patel", dateOfBirth: "1988-01-30", gender: "female",
    bloodType: "AB+", phone: "+1-555-0401", email: "priya.p@email.com",
    address: "321 Elm Dr, Greenfield", emergencyContactName: "Raj Patel",
    emergencyContactPhone: "+1-555-0402", emergencyContactRelationship: "Husband",
    donationCenter: "Greenfield Community Hospital", createdAt: "2024-04-18",
  },
  {
    id: "d5", fullName: "David Kim", dateOfBirth: "1995-06-14", gender: "male",
    bloodType: "O-", phone: "+1-555-0501", email: "david.kim@email.com",
    address: "654 Maple Ln, Westville", emergencyContactName: "Grace Kim",
    emergencyContactPhone: "+1-555-0502", emergencyContactRelationship: "Sister",
    donationCenter: "Central Blood Bank", createdAt: "2024-05-22",
  },
];

const MOCK_DONATIONS: Donation[] = [
  { id: "dn1", donorId: "d1", donorName: "James Carter", date: "2025-01-15", type: "whole_blood", volume: 450, center: "Central Blood Bank", collectedBy: "Nurse Williams", bloodType: "O+" },
  { id: "dn2", donorId: "d2", donorName: "Maria Santos", date: "2025-01-20", type: "plasma", volume: 600, center: "Riverside Medical Center", collectedBy: "Nurse Davis", bloodType: "A-" },
  { id: "dn3", donorId: "d3", donorName: "Alex Johnson", date: "2025-01-25", type: "platelets", volume: 250, center: "Central Blood Bank", collectedBy: "Nurse Williams", bloodType: "B+" },
  { id: "dn4", donorId: "d1", donorName: "James Carter", date: "2025-02-10", type: "whole_blood", volume: 450, center: "Central Blood Bank", collectedBy: "Nurse Williams", bloodType: "O+" },
  { id: "dn5", donorId: "d4", donorName: "Priya Patel", date: "2025-02-12", type: "whole_blood", volume: 450, center: "Greenfield Community Hospital", collectedBy: "Nurse Brown", bloodType: "AB+" },
  { id: "dn6", donorId: "d5", donorName: "David Kim", date: "2025-02-14", type: "plasma", volume: 500, center: "Central Blood Bank", collectedBy: "Nurse Williams", bloodType: "O-" },
  { id: "dn7", donorId: "d2", donorName: "Maria Santos", date: "2025-02-15", type: "whole_blood", volume: 450, center: "Riverside Medical Center", collectedBy: "Nurse Davis", bloodType: "A-" },
];

const MOCK_TEST_RESULTS: TestResult[] = [
  { id: "t1", donationId: "dn1", donorId: "d1", donorName: "James Carter", date: "2025-01-16", hiv: "pass", hepatitisB: "pass", hepatitisC: "pass", syphilis: "pass", bloodTypingConfirmation: "pass", hemoglobin: 14.5 },
  { id: "t2", donationId: "dn2", donorId: "d2", donorName: "Maria Santos", date: "2025-01-21", hiv: "pass", hepatitisB: "pass", hepatitisC: "pass", syphilis: "pass", bloodTypingConfirmation: "pass", hemoglobin: 13.2 },
  { id: "t3", donationId: "dn3", donorId: "d3", donorName: "Alex Johnson", date: "2025-01-26", hiv: "pass", hepatitisB: "pending", hepatitisC: "pending", syphilis: "pass", bloodTypingConfirmation: "pass", hemoglobin: 15.1 },
  { id: "t4", donationId: "dn4", donorId: "d1", donorName: "James Carter", date: "2025-02-11", hiv: "pass", hepatitisB: "pass", hepatitisC: "pass", syphilis: "pass", bloodTypingConfirmation: "pass", hemoglobin: 14.8 },
  { id: "t5", donationId: "dn5", donorId: "d4", donorName: "Priya Patel", date: "2025-02-13", hiv: "pending", hepatitisB: "pending", hepatitisC: "pending", syphilis: "pending", bloodTypingConfirmation: "pending", hemoglobin: null },
];

const MOCK_MEDICAL_NOTES: MedicalNote[] = [
  { id: "mn1", donorId: "d1", author: "Dr. Smith", date: "2025-01-15", content: "Donor in good health. No adverse reactions during donation." },
  { id: "mn2", donorId: "d2", author: "Nurse Davis", date: "2025-01-20", content: "Slight dizziness after donation. Rested for 30 minutes before leaving." },
  { id: "mn3", donorId: "d3", author: "Dr. Smith", date: "2025-01-25", content: "First-time platelet donor. Tolerated procedure well." },
];

function getStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize storage with mock data on first load
function initMockData() {
  if (!localStorage.getItem("donnect_initialized")) {
    setStorage("donnect_donors", MOCK_DONORS);
    setStorage("donnect_donations", MOCK_DONATIONS);
    setStorage("donnect_test_results", MOCK_TEST_RESULTS);
    setStorage("donnect_medical_notes", MOCK_MEDICAL_NOTES);
    localStorage.setItem("donnect_initialized", "true");
  }
}

initMockData();

export function getDonors(): Donor[] {
  return getStorage("donnect_donors", MOCK_DONORS);
}

export function getDonor(id: string): Donor | undefined {
  return getDonors().find(d => d.id === id);
}

export function addDonor(donor: Omit<Donor, "id" | "createdAt">): Donor {
  const donors = getDonors();
  const newDonor: Donor = { ...donor, id: `d${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] };
  donors.push(newDonor);
  setStorage("donnect_donors", donors);
  return newDonor;
}

export function getDonations(): Donation[] {
  return getStorage("donnect_donations", MOCK_DONATIONS);
}

export function getDonationsByDonor(donorId: string): Donation[] {
  return getDonations().filter(d => d.donorId === donorId);
}

export function addDonation(donation: Omit<Donation, "id">): Donation {
  const donations = getDonations();
  const newDonation: Donation = { ...donation, id: `dn${Date.now()}` };
  donations.push(newDonation);
  setStorage("donnect_donations", donations);
  return newDonation;
}

export function getTestResults(): TestResult[] {
  return getStorage("donnect_test_results", MOCK_TEST_RESULTS);
}

export function getTestResultsByDonor(donorId: string): TestResult[] {
  return getTestResults().filter(t => t.donorId === donorId);
}

export function addTestResult(result: Omit<TestResult, "id">): TestResult {
  const results = getTestResults();
  const newResult: TestResult = { ...result, id: `t${Date.now()}` };
  results.push(newResult);
  setStorage("donnect_test_results", results);
  return newResult;
}

export function getMedicalNotes(): MedicalNote[] {
  return getStorage("donnect_medical_notes", MOCK_MEDICAL_NOTES);
}

export function getMedicalNotesByDonor(donorId: string): MedicalNote[] {
  return getMedicalNotes().filter(n => n.donorId === donorId);
}

export function addMedicalNote(note: Omit<MedicalNote, "id">): MedicalNote {
  const notes = getMedicalNotes();
  const newNote: MedicalNote = { ...note, id: `mn${Date.now()}` };
  notes.push(newNote);
  setStorage("donnect_medical_notes", notes);
  return newNote;
}

export function isEligibleToDonate(donorId: string): boolean {
  const donations = getDonationsByDonor(donorId);
  if (donations.length === 0) return true;
  const lastDonation = donations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const daysSince = Math.floor((Date.now() - new Date(lastDonation.date).getTime()) / (1000 * 60 * 60 * 24));
  return daysSince >= 56;
}

export function getLastDonationDate(donorId: string): string | null {
  const donations = getDonationsByDonor(donorId);
  if (donations.length === 0) return null;
  return donations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
}
