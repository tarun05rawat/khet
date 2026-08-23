"use client";
import { motion } from "framer-motion";

export default function InsightCard({ summary }: { summary: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border-l-4 border-blue-600 bg-blue-50 p-6 shadow
                 dark:bg-blue-950 dark:border-blue-400"
    >
      <h2 className="mb-2 text-lg font-semibold text-blue-700 dark:text-blue-200">
        Cerebrase Insight
      </h2>
      <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
        {summary}
      </p>
    </motion.div>
  );
}
