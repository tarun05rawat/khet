import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { NextRequest, NextResponse } from 'next/server'
import { DataTable as DataTableType } from '@/types/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uuid = searchParams.get('uuid')

  if (!uuid) {
    return NextResponse.json({ error: 'UUID is required' }, { status: 400 })
  }
  try {
    const docRef = doc(db, 'DataTable', uuid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const documentData = docSnap.data()
      return NextResponse.json(
        { uuid: docSnap.id, ...documentData } as DataTableType,
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: "Profiles array field not found in document 'worker'" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
