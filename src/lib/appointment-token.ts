import type { Prisma } from '@prisma/client'

/** Format: U + 4 digits (e.g. U0427). Unique within Appointment.tokenNumber. */
export async function generateUniqueAppointmentToken(
  tx: Prisma.TransactionClient
): Promise<string> {
  for (let attempt = 0; attempt < 40; attempt++) {
    const digits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    const token = `U${digits}`
    const clash = await tx.appointment.findFirst({
      where: { tokenNumber: token },
      select: { id: true },
    })
    if (!clash) return token
  }
  throw new Error('Unable to generate a unique appointment token')
}
