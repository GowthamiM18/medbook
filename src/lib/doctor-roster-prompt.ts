/**
 * Live doctor list for AI booking — keeps the model aligned with the database.
 */
import { prisma } from '@/lib/prisma'

export type DoctorRosterEntry = {
  id: string
  name: string
  specialty: string
}

export async function getDoctorRosterForChat(): Promise<DoctorRosterEntry[]> {
  const rows = await prisma.doctor.findMany({
    orderBy: { user: { name: 'asc' } },
    select: {
      id: true,
      specialty: true,
      user: { select: { name: true } },
    },
  })
  return rows.map((r) => ({
    id: r.id,
    name: r.user.name,
    specialty: r.specialty,
  }))
}

export function formatDoctorRosterForPrompt(entries: DoctorRosterEntry[]): string {
  if (entries.length === 0) {
    return `## Hospital doctor roster
No doctors are registered in the system yet. Do not invent doctors. Tell the user to contact the hospital or check back later.`
  }
  const lines = entries.map(
    (e) => `- doctor_id: \`${e.id}\` | name: ${e.name} | specialty: ${e.specialty}`
  )
  return `## Hospital doctor roster (authoritative — ONLY these doctors exist)
These are the ONLY doctors at Udumula Hospital in this system. You MUST NOT invent, rename, or substitute any other doctor. If the user asks for someone not listed, say they are not in the directory and offer choices from this list only.

When recommending doctors by specialty, pick only from rows whose specialty matches.
When calling create_appointment you MUST set \`doctor_id\` to the exact \`doctor_id\` value from a line below (required). You may repeat the same name in \`doctor_name\` for clarity.

${lines.join('\n')}`
}
