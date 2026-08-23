import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const docRef = doc(db, 'BaseQueue', 'Meals')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const documentData = docSnap.data()
      return NextResponse.json(documentData, { status: 200 })
    }
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
