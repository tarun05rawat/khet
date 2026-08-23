"use client";
import { Button } from "@/components/ui/button";
import {
  generateDataTableData,
  generateDataTableUuids,
  generateFakeStuff,
} from "@/lib/utils";
import { SERVICES } from "@/types/enums"; // Import SERVICES enum if needed for transformation
import { DataTable as DataTableType, BaseQueue } from "@/types/types"; // Import BaseQueue type
import { addDoc, collection, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"; // Ensure getDoc is imported if you need to read first, but arrayUnion handles appending directly
import { db } from "@/firebase/config";
import { handleDeleteFromQueue, handleAppendToQueue, handleAddProfile } from "@/lib/endpoint";

export default function Test() {
  const testFetchProfile = async () => {
    const response = await fetch("/api/fetchProfile?uuid=uuid-2-1745109832048");
    if (!response.ok) {
      console.error("Error fetching profile:", response.statusText);
      return;
    }
    const data = await response.json();
    console.log("Fetched profile data:", data);
  };

  const handleWriteMockQueueData = async () => {
    const docRef = doc(db, "BaseQueue", 'Meals')
    const data = generateFakeStuff(3)
    try {
      await setDoc(docRef, data);
    } catch (error) {
      console.error("Error writing mock data to Firestore:", error);
    }
  };

  const handleWriteMockData = async () => {
    // Generate data using the utility function (returns DataTableType[] from @/types/types)
    const docRef = doc(db, "DataTable", "worker");
    const generatedData = generateDataTableData(100);
    try {
      await setDoc(docRef, generatedData);
    } catch (error) {
      console.error("Error writing mock data to Firestore:", error);
    }
  };

  const handleFetchAllData = async () => {
    const response = await fetch("/api/fetchData");
    if (!response.ok) {
      console.error("Error fetching all data:", response.statusText);
      return;
    }
    const data = await response.json();
    console.log("Fetched all data:", data);
  };

  const handleFetchQueue = async () => {
    const response = await fetch("/api/fetchBaseQueue/meals");
    if (!response.ok) {
      console.error("Error fetching queue data:", response.statusText);
      return;
    }
    const data = await response.json();
    console.log("Fetched queue data:", data);
  };
  const handleOne = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "DataTable"),
        generateDataTableUuids()
      );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleTwo = async (uuid: string, servicesToUpdate: SERVICES[]) => {
    try {
      const fetchResponse = await fetch(`/api/fetchProfile?uuid=${uuid}`);

      if (!fetchResponse.ok) {
        let errorPayload: any = { message: `HTTP error! status: ${fetchResponse.status}` };
        let errorText = '';
        try {
          errorText = await fetchResponse.text();
          if (errorText) {
            errorPayload = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.error("Failed to parse fetch profile error response:", parseError);
          errorPayload.message = errorText || fetchResponse.statusText || errorPayload.message;
        }
        console.error("Error fetching profile:", fetchResponse.statusText, errorPayload);
        return;
      }
      const initialData: DataTableType = await fetchResponse.json();
      const currentBenefits = initialData.benefits || [];

      const benefitsMap = new Map<SERVICES, number>();
      currentBenefits.forEach(benefit => {
        benefitsMap.set(benefit.name, benefit.value);
      });

      servicesToUpdate.forEach(service => {
        const currentValue = benefitsMap.get(service) || 0;
        benefitsMap.set(service, currentValue + 1);
      });

      const updatedBenefits = Array.from(benefitsMap.entries()).map(([name, value]) => ({ name, value }));

      const updateData = {
        benefits: updatedBenefits,
        updatedAt: new Date().toISOString(),
      };

      const updateResponse = await fetch(`/api/updateProfile?uuid=${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        let errorPayload: any = { message: `HTTP error! status: ${updateResponse.status}` };
        let errorText = '';
        try {
          errorText = await updateResponse.text();
          if (errorText) {
            errorPayload = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.error("Failed to parse update profile error response:", parseError);
          errorPayload.message = errorText || updateResponse.statusText || errorPayload.message;
        }
        console.error("Error updating profile:", updateResponse.statusText, errorPayload);
        return;
      }

      let responseText = '';
      try {
        responseText = await updateResponse.text();
        if (responseText) {
          const result = JSON.parse(responseText);
          console.log("Profile update successful:", result);
        } else {
          console.log("Profile update successful (empty response body). Status:", updateResponse.status);
        }
      } catch (parseError) {
        console.error("Failed to parse successful response as JSON:", parseError);
        console.error("Raw response text that failed parsing:", responseText);
      }

    } catch (error) {
      console.error("Error in handleTwo function:", error);
    }
  }

  const appendToQueue = async (type: string, dataToAppend: BaseQueue) => {
    const docRef = doc(db, 'BaseQueue', type);
    try {
      await updateDoc(docRef, {
        queue: arrayUnion(dataToAppend)
      });
      console.log(`Successfully appended data to ${type} queue.`);
    } catch (error) {
      console.error(`Error appending data to ${type} queue:`, error);
    }
  }




  return (
    <>
      <Button variant="default" onClick={handleWriteMockData}>mock firebase data</Button>
      <Button variant="default" onClick={testFetchProfile}>test fetchProfile</Button>
      <Button variant="default" onClick={handleFetchAllData}>test all data</Button>
      <Button variant="default" onClick={handleWriteMockQueueData}>generate fake shower</Button>
      <Button variant="default" onClick={handleFetchQueue}>fetch queue data</Button>
      <Button variant="default" onClick={handleOne}>Add Single Profile</Button>
      <Button variant="default" onClick={() => handleTwo('4IuMehgXBydTa3FWuEaW', [SERVICES.SHOWER])}>Update Profile (Shower)</Button>
      <Button variant="default" onClick={() => handleAppendToQueue('Shower', { type: SERVICES.SHOWER, name: 'Test User', uuid: 'test-uuid-123', createdAt: new Date().toISOString() })}>Append to Shower Queue</Button>
      <Button variant="default" onClick={() => handleDeleteFromQueue('Shower')}>Delete Shower Queue</Button>
      <Button variant="default" onClick={() => handleAddProfile('Atticus Wong', 'Chinese', 'Male', 'ADULT', [])}>Add Atticus Profile</Button>
    </>
  )
}