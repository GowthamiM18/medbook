// src/types/index.ts
import { Doctor, User, TimeSlot, Appointment } from '@prisma/client'

export type DoctorWithUser = Doctor & { user: User }
export type DoctorWithSlots = Doctor & { user: User; timeSlots: TimeSlot[] }
export type AppointmentWithDetails = Appointment & {
  doctor: Doctor & { user: User }
  slot: TimeSlot
}

// next-auth type augmentation
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}
