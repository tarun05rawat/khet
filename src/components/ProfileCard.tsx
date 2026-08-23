'use client';

import { DataTable as DataTableType } from "@/types/types"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" // Import Card components
import { useProfileData } from "@/lib/atom";

type ProfileCardProps = {
  data: DataTableType | null
}



export default function ProfileCard() {
  const [data, setData] = useProfileData();
  return (
    // Use the Card component as the main container
    <Card className="w-[350px]"> {/* You might want to adjust width as needed */}
      <CardHeader>
        <CardTitle>{data?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Age Group: {data?.ageGroup}</p>
        <p>Services</p>
        {data?.benefits.map((benefitObj, idx) => {
          // Assuming each object in the benefits array has one key-value pair
          const entry = Object.entries(benefitObj)[idx];
          if (!entry) return null; // Skip if the object is empty
          const [name, quantity] = entry;
          return (
            <div key={idx} className="flex items-center justify-between text-sm text-muted-foreground mt-1">
              {`${benefitObj.name}: ${benefitObj.value}`}
            </div>
          );
        })}
      </CardContent>
      {/* Optionally, add a CardFooter for actions or less important info */}
      {/* <CardFooter>
        <p>Last Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
      </CardFooter> */}
    </Card>
  )
}