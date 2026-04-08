// prisma/seed.ts — Udumula Hospital sample data
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, format } from 'date-fns'

const prisma = new PrismaClient()

const HOSPITAL = 'Udumula Hospital'

/** OPD window: 09:00–16:30, 15-minute slots (exclude 13:00–14:00 lunch break) */
const DAY_SLOTS = (() => {
  const out: { start: string; end: string }[] = []
  for (let mins = 9 * 60; mins <= 16 * 60 + 30; mins += 15) {
    if (mins >= 13 * 60 && mins < 14 * 60) continue
    const startH = Math.floor(mins / 60)
    const startM = mins % 60
    const endMins = mins + 15
    const endH = Math.floor(endMins / 60)
    const endM = endMins % 60
    out.push({
      start: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      end: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
    })
  }
  return out
})()

async function main() {
  // Clear slots & doctor rows only — keeps PATIENT accounts (e.g. after Postgres migration)
  await prisma.appointment.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.user.deleteMany({ where: { role: 'DOCTOR' } })

  const patientHash = await bcrypt.hash('password123', 10)
  const adminHash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'patient@demo.com' },
    create: {
      name: 'Demo Patient',
      email: 'patient@demo.com',
      phone: '9822110001',
      password: patientHash,
      role: 'PATIENT',
    },
    update: {},
  })

  await prisma.user.upsert({
    where: { email: 'admin@udumulahospital.com' },
    create: {
      name: 'Udumula Hospital Admin',
      email: 'admin@udumulahospital.com',
      phone: '9822110002',
      password: adminHash,
      role: 'ADMIN',
    },
    update: {},
  })

  // Specialty strings must match doctors page filters exactly
  const doctorsData = [
    // General Physician (2)
    {
      name: 'Dr. Ananya Sharma',
      email: 'a.sharma.gp@udumulahospital.com',
      specialty: 'General Physician',
      bio: 'Family physician for routine check-ups, chronic disease management, and referrals.',
      experience: 12,
      rating: 4.7,
      location: `${HOSPITAL} — General OPD, Block A`,
      fee: 300,
    },
    {
      name: 'Dr. Ravi Kulkarni',
      email: 'r.kulkarni.gp@udumulahospital.com',
      specialty: 'General Physician',
      bio: 'Primary care doctor with focus on preventive health and adult medicine.',
      experience: 9,
      rating: 4.6,
      location: `${HOSPITAL} — General OPD, Block A, Room 12`,
      fee: 280,
    },
    // Cardiology (2)
    {
      name: 'Dr. Meera Nambiar',
      email: 'm.nambiar.cardio@udumulahospital.com',
      specialty: 'Cardiology',
      bio: 'Consultant cardiologist: hypertension, ischemic heart disease, and echocardiography.',
      experience: 17,
      rating: 4.9,
      location: `${HOSPITAL} — Cardiac Centre, Floor 2`,
      fee: 550,
    },
    {
      name: 'Dr. Joseph Mathew',
      email: 'j.mathew.cardio@udumulahospital.com',
      specialty: 'Cardiology',
      bio: 'Interventional cardiology follow-up and preventive cardiac care.',
      experience: 14,
      rating: 4.8,
      location: `${HOSPITAL} — Cardiac Centre, Floor 2, Room 205`,
      fee: 520,
    },
    // Dermatology (2)
    {
      name: 'Dr. Kavitha Sundaram',
      email: 'k.sundaram.derm@udumulahospital.com',
      specialty: 'Dermatology',
      bio: 'Medical dermatology: eczema, psoriasis, infections, and hair disorders.',
      experience: 10,
      rating: 4.8,
      location: `${HOSPITAL} — Skin Clinic, Block B`,
      fee: 400,
    },
    {
      name: 'Dr. Farhan Ahmed',
      email: 'f.ahmed.derm@udumulahospital.com',
      specialty: 'Dermatology',
      bio: 'Dermatologist with interest in acne, allergies, and procedural dermatology.',
      experience: 7,
      rating: 4.7,
      location: `${HOSPITAL} — Skin Clinic, Block B, Room 8`,
      fee: 380,
    },
    // Orthopedics (2)
    {
      name: 'Dr. Sunita Iyer',
      email: 's.iyer.ortho@udumulahospital.com',
      specialty: 'Orthopedics',
      bio: 'Orthopedic surgeon: fractures, arthritis, and sports-related injuries.',
      experience: 16,
      rating: 4.8,
      location: `${HOSPITAL} — Ortho OPD, Ground Floor`,
      fee: 500,
    },
    {
      name: 'Dr. Vikram Desai',
      email: 'v.desai.ortho@udumulahospital.com',
      specialty: 'Orthopedics',
      bio: 'Joint replacement assessment, back pain, and musculoskeletal trauma.',
      experience: 19,
      rating: 4.9,
      location: `${HOSPITAL} — Ortho OPD, Ground Floor, Room 3`,
      fee: 550,
    },
    // Pediatrics (2)
    {
      name: 'Dr. Arjun Mehta',
      email: 'a.mehta.peds@udumulahospital.com',
      specialty: 'Pediatrics',
      bio: 'Pediatrician: vaccinations, growth monitoring, and childhood infections.',
      experience: 11,
      rating: 4.7,
      location: `${HOSPITAL} — Child Care Centre, Block C`,
      fee: 350,
    },
    {
      name: 'Dr. Priya Menon',
      email: 'p.menon.peds@udumulahospital.com',
      specialty: 'Pediatrics',
      bio: 'Newborn and adolescent care, asthma, and developmental follow-up.',
      experience: 8,
      rating: 4.8,
      location: `${HOSPITAL} — Child Care Centre, Block C, Room 15`,
      fee: 340,
    },
    // Neurology (2)
    {
      name: 'Dr. Robert Kim',
      email: 'r.kim.neuro@udumulahospital.com',
      specialty: 'Neurology',
      bio: 'Neurologist: headaches, epilepsy, stroke recovery follow-up, and neuropathy.',
      experience: 18,
      rating: 4.8,
      location: `${HOSPITAL} — Neurosciences Wing, Floor 3`,
      fee: 520,
    },
    {
      name: 'Dr. Deepa Krishnan',
      email: 'd.krishnan.neuro@udumulahospital.com',
      specialty: 'Neurology',
      bio: 'Movement disorders, dizziness, and cognitive concerns in adults.',
      experience: 13,
      rating: 4.7,
      location: `${HOSPITAL} — Neurosciences Wing, Floor 3, Room 310`,
      fee: 500,
    },
  ]

  for (let i = 0; i < doctorsData.length; i++) {
    const d = doctorsData[i]
    const user = await prisma.user.create({
      data: {
        name: d.name,
        email: d.email,
        phone: String(9822110100 + i),
        password: await bcrypt.hash('password123', 10),
        role: 'DOCTOR',
      },
    })

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialty: d.specialty,
        bio: d.bio,
        experience: d.experience,
        rating: d.rating,
        location: d.location,
        fee: d.fee,
      },
    })

    const slotRows: { doctorId: string; date: string; startTime: string; endTime: string }[] = []
    for (let i = 1; i <= 7; i++) {
      const day = addDays(new Date(), i)
      const date = format(day, 'yyyy-MM-dd')
      const dayOfWeek = day.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      for (const t of DAY_SLOTS) {
        slotRows.push({
          doctorId: doctor.id,
          date,
          startTime: t.start,
          endTime: t.end,
        })
      }
    }
    if (slotRows.length > 0) await prisma.timeSlot.createMany({ data: slotRows })
  }

  console.log(`✅ Seed complete — ${HOSPITAL}`)
  console.log('Demo patient: patient@demo.com / password123')
  console.log('Admin: admin@udumulahospital.com / admin123')
  console.log('All doctors: password123')
  doctorsData.forEach((d) => console.log(`  • ${d.name} (${d.specialty}) — ${d.email}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
