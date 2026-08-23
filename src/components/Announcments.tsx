import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data moved here
const MOCK_ANNOUNCEMENTS = [
  {
    title: "Winter Shelter Hours Update",
    content:
      "Starting next week, the Winter Shelter will be open from 6 PM to 8 AM daily. Please make sure all clients are informed during intake.",
  },
  {
    title: "Staff Meeting on Friday",
    content:
      "A brief team sync will be held in the break room at 4 PM. Topics include updated check-in procedures and volunteer scheduling.",
  },
];

// Animation helper moved here (or import if shared)
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Announcements() {
  return (
    <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }}>
      <Card className="overflow-hidden shadow-sm border-amber-300 bg-amber-50">
        <CardHeader className="bg-amber-50 pb-2">
          <CardTitle className="text-md bg-amber-50">Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_ANNOUNCEMENTS.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl bg-white p-4 border-gray-500 border-1"
            >
              <h3 className="text-sm font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{a.content}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}