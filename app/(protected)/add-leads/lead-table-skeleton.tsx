import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MotionSkeleton = motion(Skeleton);
const MotionTableRow = motion(TableRow);

const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

const containerAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LeadTableSkeleton() {
  return (
    <motion.div
      className="space-y-4"
      variants={containerAnimation}
      initial="initial"
      animate="animate"
    >
      {/* Action buttons skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <MotionSkeleton
            className="h-10 w-[100px]"
            variants={fadeInAnimation}
          />
          <MotionSkeleton
            className="h-10 w-[100px]"
            variants={fadeInAnimation}
          />
        </div>
        <MotionSkeleton className="h-10 w-[100px]" variants={fadeInAnimation} />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableHead key={index}>
                  <MotionSkeleton
                    className="h-4 w-[100px]"
                    variants={fadeInAnimation}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <MotionTableRow
                key={rowIndex}
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                }}
              >
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <MotionSkeleton
                      className="h-4 w-[100px]"
                      variants={fadeInAnimation}
                    />
                  </TableCell>
                ))}
              </MotionTableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <MotionSkeleton className="h-8 w-[100px]" variants={fadeInAnimation} />
        <div className="flex items-center gap-2">
          <MotionSkeleton
            className="h-8 w-[100px]"
            variants={fadeInAnimation}
          />
          <MotionSkeleton
            className="h-8 w-[100px]"
            variants={fadeInAnimation}
          />
        </div>
      </div>
    </motion.div>
  );
}
