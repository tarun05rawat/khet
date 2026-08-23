import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DataTable as DataTableType, AGEGROUP, BaseQueue } from '@/types/types' // Import AGEGROUP and SERVICES
import { SERVICES } from '@/types/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate random data for DataTableType
export function generateDataTableData(amount: number) {
  const data: DataTableType[] = []
  const ageGroups = Object.values(AGEGROUP)
  const serviceTypes: SERVICES[] = [
    SERVICES.SHOWER,
    SERVICES.LAUNDRY,
    SERVICES.MNGMT,
  ]
  const ethnicities = [
    'Caucasian',
    'Hispanic',
    'Asian',
    'African American',
    'Other',
  ]
  const genders = ['Male', 'Female', 'Other']

  for (let i = 0; i < amount; i++) {
    const benefitsCount = Math.floor(Math.random() * (serviceTypes.length + 1)) // 0 to 3 benefits
    const benefits: { name: SERVICES; value: number }[] = []
    const usedServices = new Set<SERVICES>()

    for (let j = 0; j < benefitsCount; j++) {
      let service: SERVICES
      do {
        service = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
      } while (usedServices.has(service)) // Ensure unique services per client
      usedServices.add(service)
      benefits.push({
        name: service,
        value: Math.floor(Math.random() * 10) + 1, // Random value 1-10
      })
    }

    const entry: DataTableType = {
      uuid: uuidv4(), // Generate UUID
      name: `Person ${i + 1}`,
      ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      benefits: benefits,
      createAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Optionally add stayDuration
      // stayDuration: {
      //   start: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(), // Random start within last 30 days
      //   end: Math.random() > 0.5 ? new Date().toISOString() : undefined // 50% chance of having an end date
      // }
    }
    data.push(entry)
  }
  return { data }
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const generateFakeStuff = (amount: number) => {
  const data: BaseQueue[] = []
  const serviceTypes: SERVICES[] = [
    SERVICES.SHOWER,
    SERVICES.LAUNDRY,
    SERVICES.MNGMT,
  ]
  const names = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana Prince',
    'Ethan Hunt',
    'Felicity Smoak',
    'George Clooney',
    'Hannah Montana',
  ]
  const createdAt = new Date().toISOString()
  for (let i = 0; i < amount; i++) {
    const entry: BaseQueue = {
      type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      name: names[Math.floor(Math.random() * names.length)],
      uuid: `uuid-${i}-${Date.now()}`,
      createdAt,
    }
    data.push(entry)
  }
  return { data }
}
export const generateDataTableUuids = (): DataTableType & { uuid: string } => {
  // Added uuid to return type
  const ageGroups = Object.values(AGEGROUP)
  const serviceTypes: SERVICES[] = [
    SERVICES.SHOWER,
    SERVICES.LAUNDRY,
    SERVICES.MNGMT,
  ]
  const ethnicities = [
    'Caucasian',
    'Hispanic',
    'Asian',
    'African American',
    'Other',
  ]
  const genders = ['Male', 'Female', 'Other']
  const names = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana Prince',
    'Ethan Hunt',
    'Felicity Smoak',
    'George Clooney',
    'Hannah Montana',
  ]

  const benefitsCount = Math.floor(Math.random() * (serviceTypes.length + 1)) // 0 to 3 benefits
  const benefits: { name: SERVICES; value: number }[] = []
  const usedServices = new Set<SERVICES>()

  for (let j = 0; j < benefitsCount; j++) {
    let service: SERVICES
    do {
      service = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
    } while (usedServices.has(service)) // Ensure unique services per client
    usedServices.add(service)
    benefits.push({
      name: service,
      value: Math.floor(Math.random() * 10) + 1, // Random value 1-10
    })
  }

  const entry: DataTableType & { uuid: string } = {
    // Added uuid property
    uuid: uuidv4(), // Generate UUID
    name: names[Math.floor(Math.random() * names.length)], // Pick a random name from the list
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
    gender: genders[Math.floor(Math.random() * genders.length)],
    ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
    benefits: benefits,
    createAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return entry // Return a single instance
}

