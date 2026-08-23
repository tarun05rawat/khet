import { ServiceLog } from "@/types/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import motion
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading

// Define animation variants (or import if defined elsewhere)
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Loading Skeleton for the ServiceLogs card
const ServiceLogsSkeleton = () => (
  <motion.div variants={fadeUp} className="h-full">
    {" "}
    {/* Ensure motion div takes height */}
    <p>{Date.now()}</p>
    <p>My Service logs</p>
    <Card className="overflow-hidden shadow-md h-full">
      {" "}
      {/* Ensure card takes height */}
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ServiceLogs() {
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error
      try {
        const response = await fetch("/api/fetchServiceLogs");
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }
        const data = await response.json();
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Error fetching service logs:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLogs([]);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchLogs();
  }, []); // Empty dependency array to run once on mount

  // Helper to format date (optional)
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateString; // Fallback
    }
  };

  if (isLoading) {
    return <ServiceLogsSkeleton />;
  }

  // Render the actual logs card
  return (
    <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }}>
      <p>My Service logs for {new Date().toLocaleDateString()}</p>{" "}
      {/* Changed to DateString for clarity */}
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-4">
          {" "}
          {/* Changed from p-0 to p-4 */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
            {" "}
            {/* Added border and rounded-lg */}
            {/* Header Row (Optional but recommended for clarity) */}
            <div className="flex items-center justify-between px-4 py-2 font-semibold text-sm text-gray-600 dark:text-gray-400 dark:bg-gray-800 bg-[#C1CAD6] rounded-t-md">
              {" "}
              {/* Removed p-4, kept px-4 py-2 */}
              <div className="flex-1 pr-2">Client Name</div>
              <div className="flex-1 px-2">Service</div>
              <div className="w-24 text-right pl-2">Logged At</div>{" "}
              {/* Fixed width for time */}
            </div>
            {error ? (
              <p className="p-4 text-sm text-red-500">
                Error loading logs: {error}
              </p>
            ) : Array.isArray(logs) && logs.length > 0 ? (
              logs.map((l: ServiceLog, i: number) => (
                <motion.div
                  key={l.uuid || i}
                  className="flex items-center justify-between px-4 py-3 text-sm" // Adjusted padding
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {/* Column 1: Client Name */}
                  <div className="flex-1 pr-2 truncate">{l.name}</div>
                  {/* Column 2: Service */}
                  <div className="flex-1 px-2 truncate">{l.service}</div>
                  {/* Column 3: Logged At */}
                  <div className="w-24 text-right pl-2 text-gray-500 dark:text-gray-400 text-xs">
                    {" "}
                    {/* Fixed width */}
                    {formatDate(l.createdAt)}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">
                No service logs found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
