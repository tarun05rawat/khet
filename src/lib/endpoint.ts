import { db } from '@/firebase/config'
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from 'firebase/firestore'
import { BaseQueue } from '@/types/types'
import { SERVICES } from '@/types/enums'
import { DataTable as DataTableType } from '@/types/types'

// ---------- PUT ENDPOINTS ---------- //
export const handleAppendToQueue = async (
  type: string,
  dataToAppend: BaseQueue
) => {
  const docRef = doc(db, 'BaseQueue', type)
  try {
    await updateDoc(docRef, {
      queue: arrayUnion(dataToAppend),
    })
    console.log(`Successfully appended data to ${type} queue.`)
  } catch (error) {
    console.error(`Error appending data to ${type} queue:`, error)
  }
}

export const handleAddProfile = async (
  name: string,
  ethnicity: string,
  gender: string,
  ageGroup: string,
  benefits: { name: SERVICES; value: number }[]
) => {
  try {
    const response = await fetch(`/api/addProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        ethnicity: ethnicity,
        gender: gender,
        ageGroup: ageGroup,
        benefits: benefits,
      }),
    })

    if (!response.ok) {
      // Handle HTTP errors
      const errorText = await response.text()
      console.error(
        `Error adding profile: ${response.status} ${response.statusText}`,
        errorText
      )
      // Optionally, throw an error or return an error indicator
      return { success: false, error: `HTTP error ${response.status}` }
    }

    // Handle successful response
    const result = await response.json()
    console.log('Profile added successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Failed to add profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const handleAppendService = async (
  uuid: string,
  servicesToUpdate: SERVICES[]
) => {
  try {
    // 1. Fetch the current profile data
    const fetchResponse = await fetch(`/api/fetchProfile?uuid=${uuid}`)

    if (!fetchResponse.ok) {
      let errorPayload: any = {
        message: `HTTP error! status: ${fetchResponse.status}`,
      }
      let errorText = ''
      try {
        errorText = await fetchResponse.text()
        if (errorText) {
          errorPayload = JSON.parse(errorText) // Attempt to parse as JSON
        }
      } catch (parseError) {
        console.error(
          'Failed to parse fetch profile error response:',
          parseError
        )
        errorPayload.message =
          errorText || fetchResponse.statusText || errorPayload.message
      }
      console.error(
        'Error fetching profile:',
        fetchResponse.statusText,
        errorPayload
      )
      return
    }
    const initialData: DataTableType = await fetchResponse.json() // Assuming fetchProfile returns DataTableType
    const currentBenefits = initialData.benefits || [] // Ensure benefits array exists

    const benefitsMap = new Map<SERVICES, number>()
    currentBenefits.forEach((benefit) => {
      benefitsMap.set(benefit.name, benefit.value)
    })

    // 3. Update counts for the provided services
    servicesToUpdate.forEach((service) => {
      const currentValue = benefitsMap.get(service) || 0
      benefitsMap.set(service, currentValue + 1)
    })

    // 4. Convert the map back to the array format required by Firestore
    const updatedBenefits = Array.from(benefitsMap.entries()).map(
      ([name, value]) => ({ name, value })
    )

    // 5. Prepare the data payload for the PUT request
    const updateData = {
      benefits: updatedBenefits,
      updatedAt: new Date().toISOString(), // Also update the updatedAt timestamp
    }

    // 6. Send the PUT request to update the profile
    const updateResponse = await fetch(`/api/updateProfile?uuid=${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    // --- Improved Response Handling ---
    if (!updateResponse.ok) {
      let errorPayload: any = {
        message: `HTTP error! status: ${updateResponse.status}`,
      }
      let errorText = ''
      try {
        errorText = await updateResponse.text()
        if (errorText) {
          errorPayload = JSON.parse(errorText) // Attempt to parse as JSON
        }
      } catch (parseError) {
        console.error(
          'Failed to parse update profile error response:',
          parseError
        )
        errorPayload.message =
          errorText || updateResponse.statusText || errorPayload.message
      }
      console.error(
        'Error updating profile:',
        updateResponse.statusText,
        errorPayload
      )
      return
    }

    // Handle successful response (status 2xx)
    let responseText = '' // Define outside try block
    try {
      responseText = await updateResponse.text() // Read response body as text first
      if (responseText) {
        const result = JSON.parse(responseText) // Attempt to parse as JSON
        console.log('Profile update successful:', result)
      } else {
        // Handle empty successful response (e.g., 204 No Content, or unexpected empty 200)
        console.log(
          'Profile update successful (empty response body). Status:',
          updateResponse.status
        )
      }
    } catch (parseError) {
      console.error('Failed to parse successful response as JSON:', parseError)
      // Log the raw text to see what was actually received
      console.error('Raw response text that failed parsing:', responseText)
    }
    // --- End of Improved Response Handling ---
  } catch (error) {
    console.error('Error in handleTwo function:', error)
  }
}

// ---------- GET ENDPOINTS ---------- //
// Modified handleFetchData to fetch all client data for the directory
export const handleFetchData = async (): Promise<
  { id: string; name: string }[] | undefined
> => {
  try {
    const response = await fetch(`/api/fetchData`) // Fetch all data
    if (!response.ok) {
      console.error('Error fetching all data:', response.statusText)
      return undefined // Return undefined on error
    }
    const data: any = await response.json() // Expect an array of DataTableType
    console.log('Fetched all data:', data)

    // Map data to the format needed for the directory
    const list = data.map((user: any) => ({
      id: user.id,
      name: user.name,
    }))
    return list // Return the processed list
  } catch (err) {
    console.error('Failed to fetch or process directory data:', err)
    return undefined // Return undefined on error
  }
}

export const handleFetchProfileData = async (uuid: string) => {
  // Renamed original handleFetchData
  const response = await fetch(`/api/fetchProfile?uuid=${uuid}`)
  if (!response.ok) {
    console.error('Error fetching profile:', response.statusText)
    return
  }
  const data = await response.json()
  console.log('Fetched profile data:', data)
}

export const handleFetchQueueMeals = async () => {
  const response = await fetch('/api/fetchBaseQueue/meals')
  if (!response.ok) {
    console.error('Error fetching queue data:', response.statusText)
    return
  }
  const data = await response.json()
  console.log('Fetched shower data:', data.data)
  return data
}

export const handleFetchQueueShower = async () => {
  const response = await fetch('/api/fetchBaseQueue/meals')
  if (!response.ok) {
    console.error('Error fetching queue data:', response.statusText)
    return {}
  }
  const data = await response.json()
  console.log('Fetched queue shower data:', data.data)
  return data
}

// ---------- DELETE ENDPOINTS ---------- //
// Add parameter for the item to remove, or modify logic to always remove the first
export const handleDeleteFromQueue = async (type: string) => {
  const docRef = doc(db, 'BaseQueue', type)
  try {
    // Get the current document data
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      // Check if the queue exists and is not empty
      if (
        data &&
        data.queue &&
        Array.isArray(data.queue) &&
        data.queue.length > 0
      ) {
        // Get the first element from the queue array
        const firstElement = data.queue[0]

        // Update the document by removing the first element from the queue array
        await updateDoc(docRef, {
          queue: arrayRemove(firstElement), // Use arrayRemove to delete the specific element
        })
        console.log(`Successfully deleted the first item from ${type} queue.`)
      } else {
        console.log(
          `Queue for ${type} is empty or does not exist. Nothing to delete.`
        )
      }
    } else {
      console.error(`Document for ${type} queue does not exist.`)
    }
  } catch (error) {
    console.error(`Error deleting data from ${type} queue:`, error)
  }
}
