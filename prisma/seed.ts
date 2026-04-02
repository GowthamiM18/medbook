// prisma/seed.ts — Udumula Hospital sample data
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, format } from 'date-fns'

const prisma = new PrismaClient()

const HOSPITAL = 'Udumula Hospital'

/** OPD window: 10:00–14:00, 30-minute slots */
const MORNING_SLOTS = [
  { start: '10:00', end: '10:30' },
  { start: '10:30', end: '11:00' },
  { start: '11:00', end: '11:30' },
  { start: '11:30', end: '12:00' },
  { start: '12:00', end: '12:30' },
  { start: '12:30', end: '13:00' },
  { start: '13:00', end: '13:30' },
  { start: '13:30', end: '14:00' },
]

async function main() {
  await prisma.appointment.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      name: 'Demo Patient',
      email: 'patient@demo.com',
      phone: '9822110001',
      password: await bcrypt.hash('password123', 10),
      role: 'PATIENT',
    },
  })

  await prisma.user.create({
    data: {
      name: 'Udumula Hospital Admin',
      email: 'admin@udumulahospital.com',
      phone: '9822110002',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  })

  // Specialty strings must match doctors page filters exactly
  const doctorsData = [
    // General Practice (2)
    {
      name: 'Dr. Ananya Sharma',
      email: 'a.sharma.gp@udumulahospital.com',
      specialty: 'General Practice',
      bio: 'Family physician for routine check-ups, chronic disease management, and referrals.',
      experience: 12,
      rating: 4.7,
      location: `${HOSPITAL} — General OPD, Block A`,
      fee: 300,
    },
    {
      name: 'Dr. Ravi Kulkarni',
      email: 'r.kulkarni.gp@udumulahospital.com',
      specialty: 'General Practice',
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

    for (let i = 1; i <= 7; i++) {
      const date = format(addDays(new Date(), i), 'yyyy-MM-dd')
      const dayOfWeek = addDays(new Date(), i).getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      for (const t of MORNING_SLOTS) {
        await prisma.timeSlot.create({
          data: {
            doctorId: doctor.id,
            date,
            startTime: t.start,
            endTime: t.end,
          },
        })
      }
    }
  }

  console.log(`✅ Seed complete — ${HOSPITAL}`)
  console.log('Demo patient: patient@demo.com / password123')
  console.log('Admin: admin@udumulahospital.com / admin123')
  console.log('All doctors: password123')
  doctorsData.forEach((d) => console.log(`  • ${d.name} (${d.specialty}) — ${d.email}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
