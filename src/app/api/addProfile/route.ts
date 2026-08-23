import { NextRequest } from 'next/server'
import { db } from '@/firebase/config'
import { doc, arrayUnion, getDoc, addDoc, collection } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  const { name, ethnicity, gender, ageGroup, benefits } = await req.json()

  if (!name || !ethnicity || !gender || !ageGroup || !benefits) {
    return new Response('Missing required fields', { status: 400 })
  }

  try {
    await addDoc(collection(db, 'DataTable'), {
      name: name,
      ethnicity: ethnicity,
      gender: gender,
      ageGroup: ageGroup,
      benefits: benefits,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    // Simulate adding a profile to the database
    console.log('Adding profile:', {
      name,
      ethnicity,
      gender,
      ageGroup,
      benefits,
    })
    // Here you would typically add the profile to your database

    return new Response(
      JSON.stringify({ message: 'Profile added successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error adding profile:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
