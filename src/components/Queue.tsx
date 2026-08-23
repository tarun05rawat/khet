import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseQueue } from "@/types/types"; // Assuming BaseQueue is the type for queue items
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { set } from "zod";

// ... (Keep QueueDisplayItem, QueueProps, calculateWaitTime, fadeUp, QueueLoadingSkeleton) ...
type QueueDisplayItem = {
  name: string;
  wait: string; // Or number if you calculate wait time numerically
  uuid: string; // Include uuid for potential key usage
};

// Helper function to calculate wait time (example)
const calculateWaitTime = (createdAt: string): string => {
  // Add a check for valid createdAt string
  if (!createdAt || typeof createdAt !== 'string') {
    return 'N/A'; // Return a default value if createdAt is invalid
  }
  try {
    const createdDate = new Date(createdAt);
    // Check if the date is valid
    if (isNaN(createdDate.getTime())) {
      return 'Invalid Date';
    }
    const now = new Date();
    const diffMinutes = Math.round((now.getTime() - createdDate.getTime()) / (1000 * 60));
    // Handle potential negative values if clocks are skewed or data is future-dated
    return `${Math.max(0, diffMinutes)} min`;
  } catch (e) {
    console.error("Error calculating wait time:", e);
    return 'Error';
  }
};

// Animation variants (optional, can be passed as props if needed)
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Loading Skeleton for the Queue component
const QueueLoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <h2 className="mb-2 text-xl font-semibold">Queues</h2>
    <div className="flex flex-col gap-6">
      {/* Skeleton for one queue card */}
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-gray-100 pb-2">
          <Skeleton className="h-6 w-1/3" /> {/* Skeleton for title */}
        </CardHeader>
        <CardContent className="bg-gray-100 p-0">
          <div className=" divide-gray-200 p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
      {/* Skeleton for another queue card */}
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-gray-100 pb-2">
          <Skeleton className="h-6 w-1/3" /> {/* Skeleton for title */}
        </CardHeader>
        <CardContent className="bg-gray-100 p-0">
          <div className="divide-y divide-gray-200 p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function Queue() {
  const [showerQueue, setShowerQueue] = useState<BaseQueue[]>([]);
  const [mealQueue, setMealQueue] = useState<BaseQueue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return; // Prevent multiple fetches
    setHasFetched(true);
    const fetchQueues = async () => {
      setIsLoading(true);
      setError(null);

      const fetchShowerQueue = async () => {
        try {
          const response = await fetch('/api/fetchBaseQueue/shower');
          if (!response.ok) throw new Error(`Shower queue fetch failed: ${response.statusText}`);
          const data = await response.json();
          setShowerQueue(data.data || []);
          console.log('Shower queue:', data.data);
        } catch (error) {
          console.error('Error fetching shower queue:', error);
          setShowerQueue([]);
          setError(prev => prev ? `${prev}\nFailed to load shower queue.` : 'Failed to load shower queue.');
        }
      };

      const fetchMealQueue = async () => {
        try {
          // Corrected endpoint
          const response = await fetch('/api/fetchBaseQueue/meals');
          if (!response.ok) throw new Error(`Meal queue fetch failed: ${response.statusText}`);
          const data = await response.json();
          // Corrected data access - assuming API returns { queue: [...] }
          setMealQueue(data.data || []);
          console.log('Meal queue:', data.data);
        } catch (error) {
          console.error('Error fetching meal queue:', error);
          setMealQueue([]);
          setError(prev => prev ? `${prev}\nFailed to load meal queue.` : 'Failed to load meal queue.');
        }
      };

      await Promise.all([fetchShowerQueue(), fetchMealQueue()]);
      setIsLoading(false);
    };

    fetchQueues();
  }, []);

  const queuesToDisplay: Record<string, QueueDisplayItem[]> = isLoading ? {} : {
    Showers: showerQueue.map(item => ({
      name: item.name,
      wait: calculateWaitTime(item.createdAt),
      uuid: item.uuid,
    })),
    Meals: mealQueue.map(item => ({
      name: item.name,
      wait: calculateWaitTime(item.createdAt),
      uuid: item.uuid,
    })),
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg"> {/* Outer card */}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Queues</CardTitle>
        </CardHeader>
        <CardContent>
          <QueueLoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error && showerQueue.length === 0 && mealQueue.length === 0) {
    return (
      <Card className="shadow-lg"> {/* Outer card */}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Queues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="p-4 text-sm text-red-500">Error loading queues: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg"> {/* Outer card with shadow */}
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Ongoing Queues</CardTitle>
      </CardHeader>
      <CardContent> {/* Content wrapper for the inner queues */}
        <motion.div className="flex flex-col gap-6" variants={fadeUp}>
          {Object.entries(queuesToDisplay).map(([queueName, list]) => (
            <motion.div key={queueName} whileHover={{ scale: 1.01 }}> {/* Slightly reduced hover scale */}
              {/* Individual queue card with shadow */}
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2 pt-4 px-4"> {/* Adjusted padding */}
                  <CardTitle className="text-lg">{queueName}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Wrapper div for border and rounding */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    {/* Header Row for Name and Wait Time */}
                    <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-black dark:text-gray-400 bg-[#C1CAD6] dark:bg-gray-800"> {/* Removed border classes, kept bg and rounded-t */}
                      <div className="flex-1 pr-2">Name</div>
                      <div className="whitespace-nowrap">Wait Time</div>
                    </div>
                    {/* List items container */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700"> {/* Use divide-y for internal borders */}
                      {Array.isArray(list) && list.length > 0 ? (
                        list.map((e, i) => (
                          <motion.div
                            key={e.uuid} // Use uuid for a more stable key
                            className="flex items-center justify-between px-4 py-3 text-sm" // Adjusted padding and text size
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: i * 0.08 }}
                          >
                            <div className="truncate pr-2 flex-1">{e.name}</div> {/* Added flex-1 */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{`${e.wait}`}</div> {/* Adjusted text style */}
                          </motion.div>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">The {queueName.toLowerCase()} queue is empty.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}