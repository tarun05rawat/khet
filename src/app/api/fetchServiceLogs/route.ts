import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const docRef = doc(db, 'ServiceLogs', 'admin')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const documentData = docSnap.data()
      return new Response(JSON.stringify(documentData), { status: 200 })
    } else {
      return new Response('Service logs not found', { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching service logs:', error)
    return new Response('Error fetching service logs', { status: 500 })
  }
}
