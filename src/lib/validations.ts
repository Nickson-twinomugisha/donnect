import { z } from "zod";

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

export const donorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 16; // Typically donors must be at least 16 or 18
  }, "Donor must be at least 16 years old"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { required_error: "Blood type is required" }),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().regex(phoneRegex, "Invalid phone number"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
  donationCenter: z.string().min(2, "Donation center is required"),
});

export const donationSchema = z.object({
  donorId: z.string().uuid("Invalid donor selected"),
  date: z.string().refine((date) => {
    return new Date(date) <= new Date();
  }, "Donation date cannot be in the future"),
  type: z.enum(["whole_blood", "plasma", "platelets"], { required_error: "Donation type is required" }),
  volume: z.coerce.number().positive("Volume must be a positive number"),
  center: z.string().min(2, "Center name is required"),
});

export const testResultSchema = z.object({
  donationId: z.string().uuid("Invalid donation selected"),
  date: z.string().refine((date) => {
    return new Date(date) <= new Date();
  }, "Test date cannot be in the future"),
  hiv: z.enum(["pass", "fail", "pending"]),
  hepatitisB: z.enum(["pass", "fail", "pending"]),
  hepatitisC: z.enum(["pass", "fail", "pending"]),
  syphilis: z.enum(["pass", "fail", "pending"]),
  bloodTypingConfirmation: z.enum(["pass", "fail", "pending"]),
  hemoglobin: z.coerce.number().positive("Hemoglobin must be positive").optional().or(z.literal('')),
});

export const medicalNoteSchema = z.object({
  donorId: z.string().uuid("Invalid donor selected"),
  content: z.string().min(5, "Note must be at least 5 characters long"),
});

export type DonorFormValues = z.infer<typeof donorSchema>;
export type DonationFormValues = z.infer<typeof donationSchema>;
export type TestResultFormValues = z.infer<typeof testResultSchema>;
export type MedicalNoteFormValues = z.infer<typeof medicalNoteSchema>;
