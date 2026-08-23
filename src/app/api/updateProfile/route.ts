import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase/auth' // Consider using server-side auth methods if applicable
import { db } from '@/firebase/config'
import { doc, updateDoc } from 'firebase/firestore'

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uuid = searchParams.get('uuid')

  if (!uuid) {
    return NextResponse.json(
      { error: 'Missing uuid parameter' },
      { status: 400 }
    )
  }

  try {
    const data = await req.json() // Await the promise returned by req.json()

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'DataTable', uuid)
    await updateDoc(docRef, data) // Use the resolved data

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    ) // Add success response
  } catch (error) {
    console.error('Error updating profile:', error)
    // Check for specific Firestore errors if needed
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
